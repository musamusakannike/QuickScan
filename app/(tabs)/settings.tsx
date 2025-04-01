import { StyleSheet, Text, View, Switch, TouchableOpacity, Linking } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoOpenLinks, setAutoOpenLinks] = useState(true);

  const handleHapticToggle = () => {
    setHapticEnabled(!hapticEnabled);
    if (!hapticEnabled) {
      Haptics.selectionAsync();
    }
  };

  const openCameraSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permissions</Text>
        <TouchableOpacity style={styles.setting} onPress={openCameraSettings}>
          <View style={styles.settingContent}>
            <MaterialIcons name="camera" size={24} color="#6366F1" />
            <Text style={styles.settingText}>Camera Access</Text>
          </View>
          <MaterialIcons name="camera" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Scan Settings</Text>
        
        <View style={styles.setting}>
          <View style={styles.settingContent}>
            <MaterialIcons name="vibration" size={24} color="#6366F1" />
            <Text style={styles.settingText}>Haptic Feedback</Text>
          </View>
          <Switch
            value={hapticEnabled}
            onValueChange={handleHapticToggle}
            trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
            thumbColor={hapticEnabled ? '#6366F1' : '#F3F4F6'}
          />
        </View>

        <View style={styles.setting}>
          <View style={styles.settingContent}>
            <MaterialIcons name="volume-up" size={24} color="#6366F1" />
            <Text style={styles.settingText}>Sound Effects</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
            thumbColor={soundEnabled ? '#6366F1' : '#F3F4F6'}
          />
        </View>

        <View style={styles.setting}>
          <View style={styles.settingContent}>
            <MaterialIcons name="open-in-new" size={24} color="#6366F1" />
            <Text style={styles.settingText}>Auto-open Links</Text>
          </View>
          <Switch
            value={autoOpenLinks}
            onValueChange={setAutoOpenLinks}
            trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
            thumbColor={autoOpenLinks ? '#6366F1' : '#F3F4F6'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  version: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#6B7280',
  },
});