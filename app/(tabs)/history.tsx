import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ScanItem {
  type: string;
  data: string;
  timestamp: string;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<ScanItem[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem('scanHistory');
        setHistory(savedHistory ? JSON.parse(savedHistory) : []);
      } catch (error) {
        console.error('Error loading history:', error);
      }
    };

    loadHistory();
    const interval = setInterval(loadHistory, 1000);
    return () => clearInterval(interval);
  }, []);

  const clearHistory = async () => {
    try {
      await AsyncStorage.setItem('scanHistory', '[]');
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const openLink = async (url: string) => {
    if (url.startsWith('http')) {
      await WebBrowser.openBrowserAsync(url);
    }
  };

  const renderItem = ({ item }: { item: ScanItem }) => {
    const date = new Date(item.timestamp);
    const isUrl = item.data.startsWith('http');

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => isUrl && openLink(item.data)}>
        <View style={styles.itemContent}>
          {isUrl ? (
            <MaterialIcons name="link" size={24} color="#6366F1" />
          ) : (
            <MaterialIcons name="qr-code" size={24} color="#6366F1" />
          )}
          <View style={styles.itemText}>
            <Text style={styles.itemData} numberOfLines={1}>
              {item.data}
            </Text>
            <Text style={styles.itemTime}>
              {date.toLocaleString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
            <MaterialIcons name="delete" size={20} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No scans yet</Text>
          <Text style={styles.emptySubtext}>
            Scanned QR codes will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.timestamp}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    color: '#111827',
  },
  clearButton: {
    padding: 8,
  },
  list: {
    padding: 20,
  },
  item: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    marginLeft: 12,
    flex: 1,
  },
  itemData: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  itemTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});