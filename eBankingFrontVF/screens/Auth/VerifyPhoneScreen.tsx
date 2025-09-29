import { ThemedText } from "@/components/ThemedText";
import { OnboardingBackground } from "@/components/UniversalBackground";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
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
import { CONSTANTS } from "../../constants";
import { RootStackParamList } from "../../types";

type VerifyPhoneRouteProp = RouteProp<RootStackParamList, "VerifyPhone">;

const API_URL = CONSTANTS.API_URL || CONSTANTS.API_URL_PROD;

const VerifyPhoneScreen = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(57);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<VerifyPhoneRouteProp>();
  const insets = useSafeAreaInsets();

  // Get phone number and isInitial from navigation params
  const { phoneNumber, isInitial = true } = route.params || {};

  // Countdown timer
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

  const inputRefs = useRef<TextInput[]>([]);

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyPhone = async () => {
    if (!phoneNumber) {
      setSnackbarMessage("Phone number is required");
      setSnackbarVisible(true);
      return;
    }

    const enteredCode = code.join("");
    if (!enteredCode || enteredCode.length < 6) {
      setSnackbarMessage("Please enter a 6-digit code");
      setSnackbarVisible(true);
      return;
    }

    setIsLoading(true);
    setSnackbarVisible(false);

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setSnackbarMessage("Authentication required. Please sign in again.");
        setSnackbarVisible(true);
        navigation.navigate("Login");
        return;
      }

      const response = await fetch(`${API_URL}/verification/verify-phone-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: phoneNumber, otp: enteredCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbarMessage("Phone verified successfully!");
        setSnackbarVisible(true);

        setTimeout(() => {
          navigation.navigate(
            isInitial ? "AccountCreationSuccess" : "Dashboard",
            {
              signupMethod: "phone",
            }
          );
        }, 2000);
      } else {
        setSnackbarMessage(data.message || "Verification failed");
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error("Phone verification error:", error);
      setSnackbarMessage("Network error. Please try again.");
      setSnackbarVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!phoneNumber) {
      setSnackbarMessage("Phone number is required");
      setSnackbarVisible(true);
      return;
    }

    if (timeLeft > 0 || isResending) return;

    setIsResending(true);
    setSnackbarVisible(false);

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setSnackbarMessage("Authentication required. Please sign in again.");
        setSnackbarVisible(true);
        navigation.navigate("Login");
        return;
      }

      const response = await fetch(`${API_URL}/verification/send-phone-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbarMessage("New verification code sent to your phone");
        setSnackbarVisible(true);
        setTimeLeft(57);
        setCode(["", "", "", "", "", ""]);
      } else {
        setSnackbarMessage(data.message || "Failed to resend code");
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error("Resend failed:", error);
      setSnackbarMessage("Network error. Please try again.");
      setSnackbarVisible(true);
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <OnboardingBackground style={styles.container}>
        <StatusBar style="light" />
        <View style={[styles.statusBarBackground, { height: insets.top }]} />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <BlurView intensity={100} tint="dark" style={styles.blurContainer}>
          <ThemedText style={styles.title}>Verify Your Phone</ThemedText>

          <ThemedText style={styles.description}>
            We sent a verification code to {phoneNumber || "your phone number"}
          </ThemedText>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
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
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.verifyButton,
              isLoading && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerifyPhone}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <ThemedText style={styles.verifyButtonText}>
                Verify Phone
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
        </BlurView>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
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
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#002657",
    zIndex: 1000,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
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
    marginBottom: 40,
    lineHeight: 24,
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
  verifyButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  verifyButtonDisabled: {
    backgroundColor: "rgba(59, 130, 246, 0.3)",
  },
  verifyButtonText: {
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
  snackbar: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 8,
  },
  snackbarText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});

export default VerifyPhoneScreen;
