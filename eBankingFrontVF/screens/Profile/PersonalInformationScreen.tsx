import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import CountryInput from "../../components/CountryInput";
import CountrySelector from "../../components/CountrySelector";
import Text from "../../components/Text";
import { OnboardingBackground } from "../../components/UniversalBackground";
import { useAlert } from "../../context/AlertContext";
import { useUser } from "../../context/UserContext";
import { RootStackParamList } from "../../types";
import { completeProfile } from "../../services/user";

const PersonalInformationScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { updateProfileStatus, updateUser } = useUser();
  const { showError, showInfo, showSuccess } = useAlert();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [nationality, setNationality] = useState("Tunisia");
  const [profilePicture, setProfilePicture] = useState<any>(null);
  const [isNationalityModalVisible, setNationalityModalVisible] =
    useState(false);

  const formatDateOfBirth = (date: string) => {
    // Convert from MM/DD/YYYY to YYYY-MM-DD for backend
    const parts = date.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(
        2,
        "0"
      )}`;
    }
    return date;
  };

  const handleContinue = async () => {
    // Basic validation
    if (!username || !firstName || !lastName || !dateOfBirth || !email) {
      showError("Error", "Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Error", "Please enter a valid email address");
      return;
    }

    // Date validation (simple check for MM/DD/YYYY format)
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!dateRegex.test(dateOfBirth)) {
      showError("Error", "Please enter date in MM/DD/YYYY format");
      return;
    }

    try {
      const profileData = {
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth: formatDateOfBirth(dateOfBirth),
        email: email.trim().toLowerCase(),
        profilePicture: profilePicture,
      };

      await completeProfile(profileData);

      // Update user information in context
      updateUser({
        fullName: `${firstName} ${lastName}`,
        email: email,
      });

      // Mark personal information as complete
      updateProfileStatus("personalInformation", true);

      showSuccess("Success", "Personal information completed successfully!");

      // Navigate to Address Information screen
      navigation.navigate("AddressInformation");
    } catch (error: any) {
      console.error("Complete Profile Error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save personal information";
      showError("Error", errorMessage);
    }
  };

  const handleAddPhoto = async () => {
    try {
      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        showError(
          "Permission Required",
          "Permission to access camera roll is required!"
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Create file object for upload
        const fileName = asset.uri.split("/").pop() || "profile.jpg";
        const fileType = asset.type || "image/jpeg";

        const file = {
          uri: asset.uri,
          name: fileName,
          type: fileType,
        } as any;

        setProfilePicture(file);
        showInfo("Success", "Profile picture selected!");
      }
    } catch (error) {
      console.error("Image picker error:", error);
      showError("Error", "Failed to select image");
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <OnboardingBackground style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="#000000" />
      <View style={[styles.statusBarBackground, { height: insets.top }]} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionContainer}>
              {/* Title Section */}
              <View style={styles.titleSection}>
                <Text style={styles.title}>Personal Information</Text>
                <Text style={styles.subtitle}>
                  Let&apos;s start with your basic information
                </Text>
              </View>

              {/* Main Container */}

              {/* Photo Section */}
              <View style={styles.photoSection}>
                <TouchableOpacity
                  style={styles.photoContainer}
                  onPress={handleAddPhoto}
                >
                  <View style={styles.photoIcon}>
                    <Ionicons name="camera-outline" size={32} color="#3B82F6" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Form Section */}
              <View style={styles.formSection}>
                {/* Username */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Username</Text>
                  <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  />
                </View>

                {/* Name Row */}
                <View style={styles.nameRow}>
                  <View style={[styles.inputGroup, styles.nameInput]}>
                    <Text style={styles.inputLabel}>First Name</Text>
                    <TextInput
                      style={styles.input}
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="First Name"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.nameInput]}>
                    <Text style={styles.inputLabel}>Last Name</Text>
                    <TextInput
                      style={styles.input}
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder="Last Name"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    />
                  </View>
                </View>

                {/* Date of Birth */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Date Of Birth</Text>
                  <View style={styles.dateInputContainer}>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="rgba(255, 255, 255, 0.6)"
                      style={styles.dateIcon}
                    />
                    <TextInput
                      style={styles.dateInput}
                      value={dateOfBirth}
                      onChangeText={setDateOfBirth}
                      placeholder="00/00/0000"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    />
                  </View>
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Gmail</Text>
                  <View style={styles.emailInputContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color="rgba(255, 255, 255, 0.6)"
                      style={styles.emailIcon}
                    />
                    <TextInput
                      style={styles.emailInput}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="example@gmail.com"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Nationality */}
                <CountryInput
                  label="Nationality"
                  selectedCountry={nationality}
                  onPress={() => setNationalityModalVisible(true)}
                />
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Country Selector */}
      <CountrySelector
        visible={isNationalityModalVisible}
        onClose={() => setNationalityModalVisible(false)}
        onSelect={setNationality}
        selectedCountry={nationality}
        title="Select Nationality"
      />
    </OnboardingBackground>
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
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 40,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  titleSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 24,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  photoIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  photoLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  formSection: {
    marginTop: 0,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "transparent",
    padding: 16,
    paddingLeft: 0,
    color: "#FFFFFF",
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
  },
  dateIcon: {
    marginRight: 12,
  },
  dateInput: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
    color: "#FFFFFF",
    fontSize: 16,
  },
  emailInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
  },
  emailIcon: {
    marginRight: 12,
  },
  emailInput: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
    color: "#FFFFFF",
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PersonalInformationScreen;
