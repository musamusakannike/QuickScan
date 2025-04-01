import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [cameraType, setCameraType] = useState<"front" | "back">("back");

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);

    // Trigger haptic feedback
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Save to history
    try {
      const savedHistory = await AsyncStorage.getItem("scanHistory");
      const history = savedHistory ? JSON.parse(savedHistory) : [];
      history.unshift({ type, data, timestamp: new Date().toISOString() });
      await AsyncStorage.setItem(
        "scanHistory",
        JSON.stringify(history.slice(0, 50))
      );
    } catch (error) {
      console.error("Error saving to history:", error);
    }

    // Handle URL
    if (data.startsWith("http")) {
      await WebBrowser.openBrowserAsync(data);
    } else {
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    }

    // Reset scanner after 2 seconds
    setTimeout(() => setScanned(false), 2000);
  };

  const toggleCameraType = () => {
    setCameraType(cameraType === "back" ? "front" : "back");
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={cameraType}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "code128", "code39", "upc_e"],
        }}
      >
        <BlurView intensity={100} style={styles.header}>
          <Text style={styles.title}>Scan QR Code</Text>
        </BlurView>

        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>

        <BlurView intensity={100} style={styles.footer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleCameraType}
          >
            <MaterialIcons name="flip-camera-android" size={24} color="#000" />
          </TouchableOpacity>
        </BlurView>

        {scanned && (
          <BlurView intensity={100} style={styles.scannedOverlay}>
            <MaterialIcons name="camera" size={48} color="#6366F1" />
            <Text style={styles.scannedText}>QR Code Scanned!</Text>
          </BlurView>
        )}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: "#000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#6366F1",
    backgroundColor: "transparent",
    borderRadius: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scannedOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -75 }, { translateY: -75 }],
    width: 150,
    height: 150,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  scannedText: {
    marginTop: 10,
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#000",
  },
  text: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
});
