import { ThemedText } from "@/components/ThemedText";
import { OnboardingBackground } from "@/components/UniversalBackground";
import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../../types";

// Updated API configuration with port
const API_BASE_URL = "http://192.168.100.4:4022/api";

const CodeConfirmationScreen = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [hasRequestedOTP, setHasRequestedOTP] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "CodeConfirmation">>();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const insets = useSafeAreaInsets();

  // Destructure with proper typing based on your RootStackParamList
  const { contactInfo, signupMode, userId, token, email, tempUserData } =
    route.params;

  console.log("🔍 CodeConfirmation params:", {
    contactInfo,
    signupMode,
    userId: userId || "not provided",
    token: token ? "provided" : "not provided",
    email: email || "not provided",
    tempUserData: tempUserData ? "provided" : "not provided",
  });

  const testConnection = async (): Promise<void> => {
    const testUrls = [
      `${API_BASE_URL}/health`,
      "http://192.168.100.4:4022/api/health",
      "https://httpbin.org/get", // External test
    ];

    for (const url of testUrls) {
      try {
        console.log(`🧪 Testing: ${url}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);
        console.log(`✅ ${url} - Status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${url} - Response:`, data);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(`❌ ${url} - Error: ${error.message}`);
        } else {
          console.log(`❌ ${url} - Error:`, error);
        }
      }
    }
  };

  const getMaskedContactInfo = (info: string): string => {
    if (info.includes("@")) {
      const [localPart, domain] = info.split("@");
      return `${localPart.substring(0, 2)}${"•".repeat(
        Math.max(1, localPart.length - 2)
      )}@${domain}`;
    } else {
      return `${"•".repeat(Math.max(1, info.length - 4))}${info.slice(-4)}`;
    }
  };

  useEffect(() => {
    // Test connection first
    testConnection();

    // Then request initial OTP
    if (!hasRequestedOTP) {
      setTimeout(() => {
        requestInitialOTP();
      }, 1000); // Wait 1 second after connection test
    }
  }, [hasRequestedOTP]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const requestInitialOTP = async (): Promise<void> => {
    if (hasRequestedOTP) return;

    setHasRequestedOTP(true);
    const emailToUse =
      signupMode === "email" ? contactInfo : email || contactInfo;

    console.log("🚀 Requesting initial OTP for:", emailToUse);
    console.log("🌐 Using API URL:", `${API_BASE_URL}/auth/send-otp`);

    try {
      console.log("📡 Making fetch request...");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const requestBody = {
        email: emailToUse,
      };

      console.log("📤 Request body:", requestBody);

      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", response.headers);

      let data: any;
      try {
        const responseText = await response.text();
        console.log("📡 Raw response:", responseText);
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ Failed to parse response as JSON:", parseError);
        throw new Error("Invalid response format from server");
      }

      console.log("📧 Initial OTP response:", data);

      if (response.ok && data.success) {
        setSnackbarMessage(
          `Verification code sent to ${getMaskedContactInfo(contactInfo)}`
        );
        setSnackbarVisible(true);
      } else {
        console.warn("⚠️ OTP request failed:", data.message);
        setSnackbarMessage(
          data.message || "Failed to send verification code. Please try again."
        );
        setSnackbarVisible(true);
      }
    } catch (error: any) {
      console.error("💥 Network error details:");
      console.error("💥 Error message:", error.message);
      console.error("💥 Error name:", error.name);
      console.error("💥 Full error:", error);

      let errorMessage = "Network error. Please try again.";

      if (error.name === "AbortError") {
        console.error("💥 Request was aborted (timeout)");
        errorMessage =
          "Request timed out. Please check your network connection.";
      } else if (error.message.includes("Network request failed")) {
        console.error("💥 Network request failed");
        errorMessage =
          "Cannot connect to server. Please check your network connection.";
      } else if (error.message.includes("Invalid response format")) {
        errorMessage = "Server returned invalid response. Please try again.";
      }

      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
      setHasRequestedOTP(false); // Allow retry
    }
  };

  const handleCodeChange = (value: string, index: number): void => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (
      newCode.every((digit) => digit !== "") &&
      newCode.join("").length === 6
    ) {
      setTimeout(() => handleConfirmCode(newCode.join("")), 500);
    }
  };

  const handleKeyPress = (key: string, index: number): void => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirmCode = async (codeOverride?: string): Promise<void> => {
    const enteredCode = codeOverride || code.join("");

    if (enteredCode.length !== 6) {
      setSnackbarMessage("Please enter all 6 digits of the verification code");
      setSnackbarVisible(true);
      return;
    }

    setIsLoading(true);
    setSnackbarVisible(false);

    try {
      const emailToUse =
        signupMode === "email" ? contactInfo : email || contactInfo;
      console.log("🔐 Verifying code:", enteredCode, "for email:", emailToUse);

      const requestBody = {
        email: emailToUse,
        otp: enteredCode,
      };

      console.log("📤 Verification request body:", requestBody);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("📡 Verification response status:", response.status);

      let data: any;
      try {
        const responseText = await response.text();
        console.log("📡 Raw verification response:", responseText);
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ Failed to parse verification response:", parseError);
        throw new Error("Invalid response format from server");
      }

      console.log("✅ Verification response:", data);

      if (response.ok && data.success) {
        setSnackbarMessage("Email verified successfully!");
        setSnackbarVisible(true);

        setTimeout(() => {
          if (token) {
            navigation.navigate("MainApp");
          } else {
            navigation.navigate("SetPassword", {
              contactInfo,
              signupMode,
              userId: userId || `verified-${Date.now()}`,
            });
          }
        }, 1500);
      } else {
        const errorMessage = data.message || "Invalid verification code";
        console.error("❌ Verification failed:", errorMessage);

        if (errorMessage.toLowerCase().includes("expired")) {
          setSnackbarMessage(
            "Verification code has expired. Please request a new one."
          );
        } else if (errorMessage.toLowerCase().includes("invalid")) {
          setSnackbarMessage("Invalid verification code. Please try again.");
        } else {
          setSnackbarMessage(errorMessage);
        }
        setSnackbarVisible(true);

        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      console.error("💥 Verification error:", error);

      let errorMessage = "Verification failed. Please try again.";

      if (error.name === "AbortError") {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.message.includes("Network request failed")) {
        errorMessage =
          "Cannot connect to server. Please check your internet connection.";
      } else if (error.message.includes("Invalid response format")) {
        errorMessage = "Server returned invalid response. Please try again.";
      }

      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);

      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async (): Promise<void> => {
    if (timeLeft > 0 || isResending) return;

    setIsResending(true);
    setSnackbarVisible(false);

    try {
      const emailToUse =
        signupMode === "email" ? contactInfo : email || contactInfo;
      console.log("🔄 Resending OTP for:", emailToUse);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: emailToUse,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data: any;
      try {
        const responseText = await response.text();
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Invalid response format from server");
      }

      console.log("📧 Resend OTP response:", data);

      if (response.ok && data.success) {
        setSnackbarMessage(
          `New verification code sent to ${getMaskedContactInfo(contactInfo)}`
        );
        setSnackbarVisible(true);
        setTimeLeft(600);
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        throw new Error(data.message || "Failed to resend code");
      }
    } catch (error: any) {
      console.error("💥 Resend code error:", error);

      let errorMessage = "Failed to resend code. Please try again.";

      if (error.name === "AbortError") {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.message.includes("Network request failed")) {
        errorMessage =
          "Cannot connect to server. Please check your internet connection.";
      } else if (error.message.includes("Invalid response format")) {
        errorMessage = "Server returned invalid response. Please try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <OnboardingBackground style={styles.container}>
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <BlurView intensity={0.2} style={styles.blurContainer}>
          <ThemedText style={styles.title}>Enter confirmation code</ThemedText>

          <ThemedText style={styles.description}>
            We sent a verification code to{"\n"}
            <ThemedText style={styles.contactInfo}>
              {getMaskedContactInfo(contactInfo)}
            </ThemedText>
          </ThemedText>

          <ThemedText style={styles.otpNote}>
            Check your email for the 6-digit verification code
          </ThemedText>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[styles.codeInput, digit && styles.codeInputFilled]}
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="numeric"
                maxLength={1}
                autoFocus={index === 0}
                selectTextOnFocus
                autoComplete="one-time-code"
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              (isLoading || code.join("").length !== 6) &&
                styles.confirmButtonDisabled,
            ]}
            onPress={() => handleConfirmCode()}
            disabled={isLoading || code.join("").length !== 6}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <ThemedText style={styles.confirmButtonText}>
                Confirm ({code.join("").length}/6)
              </ThemedText>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <ThemedText style={styles.resendText}>
              Didn&apos;t receive the code?{" "}
            </ThemedText>
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={timeLeft > 0 || isResending}
            >
              <ThemedText
                style={[
                  styles.resendLink,
                  (timeLeft > 0 || isResending) && styles.resendLinkDisabled,
                ]}
              >
                {isResending
                  ? "Sending..."
                  : timeLeft > 0
                  ? `Resend in ${formatTime(timeLeft)}`
                  : "Resend"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.timerInfo}>
            Code expires in {formatTime(timeLeft)}
          </ThemedText>
        </BlurView>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={4000}
          style={styles.snackbar}
        >
          <ThemedText style={styles.snackbarText}>{snackbarMessage}</ThemedText>
        </Snackbar>
      </OnboardingBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 24,
  },
  contactInfo: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  otpNote: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginBottom: 40,
    fontStyle: "italic",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  codeInputFilled: {
    borderColor: "#3B82F6",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  confirmButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  confirmButtonDisabled: {
    backgroundColor: "rgba(59, 130, 246, 0.3)",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  resendText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  resendLink: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600",
  },
  resendLinkDisabled: {
    color: "rgba(59, 130, 246, 0.5)",
  },
  timerInfo: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },
  snackbar: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 8,
  },
  snackbarText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});

export default CodeConfirmationScreen;
