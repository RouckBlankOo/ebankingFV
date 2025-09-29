import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { OnboardingBackground } from "@/components/UniversalBackground";
import { useTheme } from "@/hooks/useTheme";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Snackbar } from "react-native-paper";
import { RootStackParamList } from "../../types";

const { width, height } = Dimensions.get("window");

const API_BASE_URL = "http://192.168.100.4:4022/api"; // Change to your IP for device testing

const SignUpScreen = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+216");
  const [signupMode, setSignupMode] = useState<"phone" | "email">("email");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isVerificationModalVisible, setVerificationModalVisible] =
    useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const countries = [
    { name: "Tunisia", code: "+216", flag: "🇹🇳" },
    { name: "United States", code: "+1", flag: "🇺🇸" },
    { name: "France", code: "+33", flag: "🇫🇷" },
    { name: "Germany", code: "+49", flag: "🇩🇪" },
    { name: "India", code: "+91", flag: "🇮🇳" },
    { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  ];

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleCreateAccount = () => {
    setSnackbarVisible(false);

    if (signupMode === "email") {
      if (!email.trim()) {
        showSnackbar("Email address is required");
        return;
      }
      if (!validateEmail(email)) {
        showSnackbar("Please enter a valid email address");
        return;
      }
    } else {
      if (!phone.trim()) {
        showSnackbar("Phone number is required");
        return;
      }
      if (phone.length < 8) {
        showSnackbar("Please enter a valid phone number");
        return;
      }
    }

    setVerificationModalVisible(true);
  };

  const handleConfirmContactInfo = () => {
    setVerificationModalVisible(false);
    setPasswordModalVisible(true);
  };

  const registerUser = async () => {
    if (!fullName.trim()) {
      showSnackbar("Full name is required");
      return;
    }

    if (!validatePassword(password)) {
      showSnackbar(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      showSnackbar("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        fullName: fullName.trim(),
        email:
          signupMode === "email"
            ? email.trim().toLowerCase()
            : `temp_${Date.now()}@placeholder.com`,
        phoneNumber:
          signupMode === "phone" ? `${countryCode}${phone}` : "+12025550189",
        password: password,
      };

      console.log("=== REGISTRATION DEBUG ===");
      console.log("🚀 Registration payload:", {
        ...requestBody,
        password: "[HIDDEN]",
      });
      console.log("🚀 API URL:", `${API_BASE_URL}/auth/register`);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Registration response status:", response.status);

      const responseText = await response.text();
      console.log("📡 Registration raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("📦 Registration parsed response:", data);
      } catch (parseError) {
        console.error("❌ Registration JSON parse error:", parseError);
        throw new Error("Invalid response from server");
      }

      if (response.ok && data.success) {
        console.log("✅ Registration successful");
        setPasswordModalVisible(false);

        const navigationParams = {
          contactInfo:
            signupMode === "phone" ? `${countryCode}${phone}` : email,
          signupMode: signupMode,
          userId: data.data.userId,
          token: data.data.token,
          email: data.data.email,
          tempUserData: {
            fullName: fullName.trim(),
            email: data.data.email,
            phoneNumber: data.data.phoneNumber,
            password: password,
          },
        };

        console.log("🚀 Navigation params:", navigationParams);

        navigation.navigate("CodeConfirmation", navigationParams);
      } else {
        const errorMessage =
          data.message ||
          data.error ||
          "Registration failed. Please try again.";
        console.error("❌ Registration failed:", errorMessage);
        showSnackbar(errorMessage);
      }
    } catch (error: any) {
      console.error("💥 Registration error:", error);
      showSnackbar(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    setVerificationModalVisible(false);
  };

  const handlePasswordModalBack = () => {
    setPasswordModalVisible(false);
    setVerificationModalVisible(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <OnboardingBackground style={styles.container}>
        <StatusBar style="light" translucent backgroundColor="#000000" />
        <View style={[styles.statusBarBackground, { height: insets.top }]} />

        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <BlurView intensity={0.2} style={styles.blurContainer}>
          <ThemedText type="title" style={styles.title}>
            Let&apos;s get started!
          </ThemedText>

          <ThemedText style={styles.description}>
            Enter your{" "}
            {signupMode === "phone" ? "phone number" : "email address"}. We will
            send you a{"\n"}
            {signupMode === "phone"
              ? "confirmation code"
              : "verification code"}{" "}
            there
          </ThemedText>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                signupMode === "phone" && styles.toggleButtonActive,
              ]}
              onPress={() => setSignupMode("phone")}
            >
              <Ionicons
                name="call"
                size={16}
                color={
                  signupMode === "phone"
                    ? "#FFFFFF"
                    : "rgba(255, 255, 255, 0.6)"
                }
              />
              <ThemedText
                style={[
                  styles.toggleText,
                  signupMode === "phone" && styles.toggleTextActive,
                ]}
              >
                Phone
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                signupMode === "email" && styles.toggleButtonActive,
              ]}
              onPress={() => setSignupMode("email")}
            >
              <Ionicons
                name="mail"
                size={16}
                color={
                  signupMode === "email"
                    ? "#FFFFFF"
                    : "rgba(255, 255, 255, 0.6)"
                }
              />
              <ThemedText
                style={[
                  styles.toggleText,
                  signupMode === "email" && styles.toggleTextActive,
                ]}
              >
                Email
              </ThemedText>
            </TouchableOpacity>
          </View>

          {signupMode === "email" ? (
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail"
                  size={20}
                  color={theme.colors.current.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={theme.colors.current.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={styles.inputUnderline} />
            </View>
          ) : (
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="call"
                  size={20}
                  color={theme.colors.current.textSecondary}
                  style={styles.inputIcon}
                />
                <TouchableOpacity
                  style={styles.countryCodeContainer}
                  onPress={() => setModalVisible(true)}
                >
                  <ThemedText style={styles.countryCodeText}>
                    {countryCode}
                  </ThemedText>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={theme.colors.current.textSecondary}
                  />
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  placeholder="12 345 678"
                  keyboardType="phone-pad"
                  placeholderTextColor={theme.colors.current.textSecondary}
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
              <View style={styles.inputUnderline} />
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.createAccountButton,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleCreateAccount}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <ThemedText style={styles.createAccountButtonText}>
                Create Account
              </ThemedText>
            )}
          </TouchableOpacity>

          <View style={styles.loginSection}>
            <ThemedText style={styles.loginText}>
              Already have an account?{" "}
            </ThemedText>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <ThemedText style={styles.loginLink}>Log in</ThemedText>
            </TouchableOpacity>
          </View>
        </BlurView>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={5000}
          style={styles.snackbar}
        >
          {snackbarMessage}
        </Snackbar>

        {/* Country Code Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <BlurView intensity={20} style={styles.modalBlurView}>
              <View style={styles.modalContent}>
                <FlatList
                  data={countries}
                  keyExtractor={(item) => item.code}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.countryItem,
                        { borderBottomColor: theme.colors.current.border },
                      ]}
                      onPress={() => {
                        setCountryCode(item.code);
                        setModalVisible(false);
                      }}
                    >
                      <ThemedText style={styles.countryFlag}>
                        {item.flag}
                      </ThemedText>
                      <ThemedText style={styles.countryName}>
                        {item.name}
                      </ThemedText>
                      <ThemedText style={styles.countryCodeModal}>
                        {item.code}
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={[
                    styles.closeModalButton,
                    { backgroundColor: theme.colors.primary[500] },
                  ]}
                  onPress={() => setModalVisible(false)}
                >
                  <ThemedText
                    style={[
                      styles.closeModalText,
                      { color: theme.colors.neutral[50] },
                    ]}
                  >
                    Close
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </Modal>

        {/* Contact Verification Modal */}
        <Modal
          visible={isVerificationModalVisible}
          animationType="fade"
          transparent={true}
          statusBarTranslucent
        >
          <View style={styles.verificationModalContainer}>
            <BlurView intensity={40} style={styles.verificationModalBlur}>
              <View style={styles.verificationModalContent}>
                <View style={styles.phoneDisplayContainer}>
                  <View style={styles.phoneIconContainer}>
                    {signupMode === "phone" ? (
                      <ThemedText style={styles.flagEmoji}>
                        {countries.find((c) => c.code === countryCode)?.flag ||
                          "🇹🇳"}
                      </ThemedText>
                    ) : (
                      <Ionicons name="mail" size={18} color="#FFFFFF" />
                    )}
                  </View>
                  <ThemedText style={styles.phoneDisplayText}>
                    {signupMode === "phone" ? `${countryCode} ${phone}` : email}
                  </ThemedText>
                </View>

                <ThemedText style={styles.verificationDescription}>
                  Is this {signupMode === "phone" ? "number" : "email"} correct?
                  We&apos;ll send you a verification code there.
                </ThemedText>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmContactInfo}
                >
                  <ThemedText style={styles.confirmButtonText}>
                    Confirm
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.goBackButton}
                  onPress={handleGoBack}
                >
                  <ThemedText style={styles.goBackButtonText}>
                    Go Back
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </Modal>

        {/* Password Setup Modal */}
        <Modal
          visible={isPasswordModalVisible}
          animationType="fade"
          transparent={true}
          statusBarTranslucent
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.verificationModalContainer}>
              <BlurView intensity={40} style={styles.verificationModalBlur}>
                <View
                  style={[
                    styles.verificationModalContent,
                    styles.passwordModalContent,
                  ]}
                >
                  <ThemedText style={styles.passwordModalTitle}>
                    Complete Registration
                  </ThemedText>

                  <ThemedText style={styles.passwordModalSubtitle}>
                    Enter your details to create your account
                  </ThemedText>

                  <View style={styles.modalInputWrapper}>
                    <View style={styles.modalInputContainer}>
                      <Ionicons
                        name="person"
                        size={20}
                        color="rgba(255, 255, 255, 0.6)"
                        style={styles.modalInputIcon}
                      />
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Full Name"
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        value={fullName}
                        onChangeText={setFullName}
                        autoCapitalize="words"
                      />
                    </View>
                  </View>

                  <View style={styles.modalInputWrapper}>
                    <View style={styles.modalInputContainer}>
                      <Ionicons
                        name="lock-closed"
                        size={20}
                        color="rgba(255, 255, 255, 0.6)"
                        style={styles.modalInputIcon}
                      />
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Password"
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons
                          name={showPassword ? "eye" : "eye-off"}
                          size={20}
                          color="rgba(255, 255, 255, 0.6)"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.modalInputWrapper}>
                    <View style={styles.modalInputContainer}>
                      <Ionicons
                        name="lock-closed"
                        size={20}
                        color="rgba(255, 255, 255, 0.6)"
                        style={styles.modalInputIcon}
                      />
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Confirm Password"
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <Ionicons
                          name={showConfirmPassword ? "eye" : "eye-off"}
                          size={20}
                          color="rgba(255, 255, 255, 0.6)"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <ThemedText style={styles.passwordRequirements}>
                    Password must contain at least 8 characters with uppercase,
                    lowercase, number, and special character
                  </ThemedText>

                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      isLoading && styles.buttonDisabled,
                    ]}
                    onPress={registerUser}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <ThemedText style={styles.confirmButtonText}>
                        Create Account
                      </ThemedText>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.goBackButton}
                    onPress={handlePasswordModalBack}
                    disabled={isLoading}
                  >
                    <ThemedText style={styles.goBackButtonText}>
                      Go Back
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </OnboardingBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: "center",
  },
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    zIndex: 1000,
  },
  blurContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 0,
    marginVertical: 120,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    fontSize: 28,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  description: {
    textAlign: "left",
    marginBottom: 40,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 24,
  },
  inputWrapper: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 4,
    minHeight: 56,
  },
  inputUnderline: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginTop: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    paddingVertical: 12,
  },
  countryCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
    marginRight: 12,
    borderRightWidth: 1,
    borderRightColor: "rgba(255, 255, 255, 0.2)",
  },
  countryCodeText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginRight: 4,
  },
  phoneInput: {
    marginLeft: 0,
  },
  createAccountButton: {
    backgroundColor: "#0066FF",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 30,
    alignItems: "center",
  },
  createAccountButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 16,
  },
  loginLink: {
    color: "#0066FF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBlurView: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  modalContent: {
    borderRadius: 16,
    width: width * 0.85,
    maxHeight: height * 0.6,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  countryCodeModal: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  closeModalButton: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#0066FF",
  },
  closeModalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  snackbar: {
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    borderRadius: 12,
  },
  verificationModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  verificationModalBlur: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  verificationModalContent: {
    width: width * 0.85,
    maxWidth: 320,
    padding: 32,
    backgroundColor: "rgba(30, 30, 30, 0.98)",
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  phoneDisplayContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 24,
  },
  phoneIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  flagEmoji: {
    fontSize: 18,
  },
  phoneDisplayText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  verificationDescription: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "left",
    lineHeight: 20,
    marginBottom: 32,
  },
  confirmButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  goBackButton: {
    backgroundColor: "rgba(255, 255, 255, 255)",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
  },
  goBackButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: "#007AFF",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: 8,
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  passwordModalContent: {
    maxWidth: 380,
    paddingVertical: 40,
  },
  passwordModalTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  passwordModalSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 32,
  },
  modalInputWrapper: {
    marginBottom: 20,
    width: "100%",
  },
  modalInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalInputIcon: {
    marginRight: 12,
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    paddingVertical: 4,
  },
  passwordRequirements: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 16,
  },
});

export default SignUpScreen;
