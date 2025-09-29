import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

// Pick sensible defaults depending on runtime environment.
// - If API_BASE_URL env var is set, use it.
// - Android emulator (default) should use 10.0.2.2 to reach host machine.
// - For physical devices, set API_BASE_URL to your machine LAN IP (e.g. http://192.168.100.4:4022/api)
const MACHINE_LAN_IP = "http://192.168.100.4:4022/api"; // Your machine's actual LAN IP
const envBase = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

// Determine the appropriate API base URL
let API_BASE_URL: string;

if (envBase) {
  API_BASE_URL = envBase;
} else {
  // Since you're running on a physical device (based on backend logs showing 192.168.100.55),
  // use the LAN IP directly
  API_BASE_URL = MACHINE_LAN_IP;
}

// Override: Force LAN IP for all platforms since you're on physical device
API_BASE_URL = MACHINE_LAN_IP;

console.log(`API Client initialized with base URL: ${API_BASE_URL} (Platform: ${Platform.OS})`);
console.log(`Using LAN IP for physical device connectivity`);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Attach JWT if present in AsyncStorage
apiClient.interceptors.request.use(
  async (config: any) => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      if (token && config && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("🔑 Token attached to request:", token.substring(0, 20) + "...");
      } else {
        console.log("⚠️ No token found in AsyncStorage");
      }
    } catch (error) {
      console.log("❌ Error retrieving token:", error);
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response interceptor to give better guidance on network errors
apiClient.interceptors.response.use(
  (res) => res,
  async (error: any) => {
    if (error?.message === "Network Error" || error?.code === "NETWORK_ERROR") {
      console.warn(
        `Network Error when calling API (${API_BASE_URL}).\n` +
          "Common causes: backend not running, wrong base URL for device/emulator, CORS/network settings.\n" +
          "If you're on Android emulator use http://10.0.2.2:4022/api, on iOS simulator use http://localhost:4022/api, or set API_BASE_URL to your machine LAN IP for physical device."
      );
      
      // If we're not already using the LAN IP and this is a network error,
      // try switching to LAN IP for physical devices
      if (API_BASE_URL !== MACHINE_LAN_IP && (Platform.OS === "android" || Platform.OS === "ios")) {
        console.log("Attempting fallback to LAN IP for physical device...");
        
        // Create a new client with LAN IP
        const fallbackClient = axios.create({
          baseURL: MACHINE_LAN_IP,
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        });
        
        // Add auth header if available
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          fallbackClient.defaults.headers.Authorization = `Bearer ${token}`;
        }
        
        // Update the main client base URL
        apiClient.defaults.baseURL = MACHINE_LAN_IP;
        API_BASE_URL = MACHINE_LAN_IP;
        
        console.log(`Switched to LAN IP: ${MACHINE_LAN_IP}`);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
