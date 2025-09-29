import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import CountryInput from "../../components/CountryInput";
import CountrySelector from "../../components/CountrySelector";
import Text from "../../components/Text";
import { OnboardingBackground } from "../../components/UniversalBackground";
import { useAlert } from "../../context/AlertContext";
import { useUser } from "../../context/UserContext";
import { RootStackParamList } from "../../types";
import { completeKycData } from "../../services/user";

type DocumentType = "passport" | "driving_license" | "national_id_card";

const IdentityVerificationScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { updateProfileStatus } = useUser();
  const { showError, showInfo, showConfirm } = useAlert();
  const insets = useSafeAreaInsets();
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentType>("passport");
  const [documentNumber, setDocumentNumber] = useState("");
  const [issuingCity, setIssuingCity] = useState("");
  const [nationality, setNationality] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isCountryModalVisible, setCountryModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Document files
  const [passportImage, setPassportImage] = useState<any>(null);
  const [frontImage, setFrontImage] = useState<any>(null);
  const [backImage, setBackImage] = useState<any>(null);

  const formatExpiryDate = (date: string) => {
    if (!date) return "";

    // Handle different date formats
    if (date.includes("/")) {
      // Convert from MM/DD/YYYY to YYYY-MM-DD for backend
      const parts = date.split("/");
      if (parts.length === 3) {
        const month = parts[0].padStart(2, "0");
        const day = parts[1].padStart(2, "0");
        const year = parts[2];

        // Validate date components
        if (month.length === 2 && day.length === 2 && year.length === 4) {
          return `${year}-${month}-${day}`;
        }
      }
    } else if (date.includes("-")) {
      // Already in YYYY-MM-DD format
      return date;
    }

    console.warn("Invalid date format:", date);
    return date; // Return as-is if format is unknown
  };

  const validateForm = () => {
    // Check required fields
    if (!documentNumber.trim()) {
      showError("Validation Error", "Please enter your document number");
      return false;
    }

    if (!issuingCity.trim()) {
      showError("Validation Error", "Please enter the issuing city");
      return false;
    }

    if (!nationality.trim()) {
      showError("Validation Error", "Please select your nationality");
      return false;
    }

    // Validate document number format
    if (documentNumber.trim().length < 5) {
      showError(
        "Validation Error",
        "Document number must be at least 5 characters"
      );
      return false;
    }

    // Document-specific validations
    if (selectedDocument === "passport") {
      if (!passportImage) {
        showError("Validation Error", "Please upload a photo of your passport");
        return false;
      }
    } else {
      if (!frontImage) {
        showError(
          "Validation Error",
          `Please upload the front of your ${selectedDocument.replace(
            "_",
            " "
          )}`
        );
        return false;
      }
      if (!backImage) {
        showError(
          "Validation Error",
          `Please upload the back of your ${selectedDocument.replace("_", " ")}`
        );
        return false;
      }
    }

    // Validate expiry date if provided
    if (expiryDate) {
      const formattedDate = formatExpiryDate(expiryDate);
      if (!formattedDate || formattedDate === expiryDate) {
        showError(
          "Validation Error",
          "Please enter a valid expiry date (MM/DD/YYYY)"
        );
        return false;
      }

      // Check if date is not in the past
      const expiry = new Date(formattedDate);
      const today = new Date();
      if (expiry <= today) {
        showError(
          "Validation Error",
          "Document has expired. Please use a valid document"
        );
        return false;
      }
    }

    return true;
  };

  const handleContinue = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const kycData = {
        documentType: selectedDocument,
        documentNumber: documentNumber.trim(),
        issuingCity: issuingCity.trim(),
        nationality: nationality.trim(),
        expiryDate: expiryDate ? formatExpiryDate(expiryDate) : undefined,
        passport: passportImage,
        front: frontImage,
        back: backImage,
      };

      console.log("🔍 Submitting KYC data:", {
        ...kycData,
        passport: passportImage ? "File attached" : null,
        front: frontImage ? "File attached" : null,
        back: backImage ? "File attached" : null,
      });

      const response = await completeKycData(kycData);

      console.log("✅ KYC submission successful:", response);

      // Mark identity verification as complete
      updateProfileStatus("identityVerification", true);

      // Complete verification and go back to main app
      showConfirm(
        "Success",
        "Identity verification completed successfully!",
        () => navigation.navigate("MainApp"),
        undefined,
        "OK"
      );
    } catch (error: any) {
      console.error("❌ Complete KYC Error:", error);

      let errorMessage = "Failed to complete identity verification";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle specific error types
      if (error.message?.includes("Network Error")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      showError("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDocumentSelect = (type: DocumentType) => {
    setSelectedDocument(type);
  };

  const handleCountrySelect = () => {
    setCountryModalVisible(true);
  };

  const handleCountrySelection = (selectedCountry: string) => {
    setNationality(selectedCountry);
  };

  const handleAddPhoto = async (photoType: "passport" | "front" | "back") => {
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
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Create proper file object for React Native FormData
        const fileName =
          asset.uri.split("/").pop() || `${photoType}_${Date.now()}.jpg`;
        const fileType = asset.type || "image/jpeg";

        const file = {
          uri: asset.uri,
          name: fileName,
          type: fileType,
        };

        console.log(`📸 Image selected for ${photoType}:`, {
          uri: asset.uri,
          name: fileName,
          type: fileType,
          size: asset.fileSize || "unknown",
        });

        // Set the appropriate image based on type
        if (photoType === "passport") {
          setPassportImage(file);
        } else if (photoType === "front") {
          setFrontImage(file);
        } else if (photoType === "back") {
          setBackImage(file);
        }

        showInfo(
          "Success",
          `${
            photoType.charAt(0).toUpperCase() + photoType.slice(1)
          } photo selected!`
        );
      }
    } catch (error) {
      console.error("Image picker error:", error);
      showError("Error", "Failed to select image");
    }
  };

  const renderDocumentOption = (
    type: DocumentType,
    imageSource: any,
    title: string,
    subtitle: string
  ) => {
    const isSelected = selectedDocument === type;
    return (
      <TouchableOpacity
        style={[
          styles.documentOption,
          isSelected && styles.documentOptionSelected,
        ]}
        onPress={() => handleDocumentSelect(type)}
      >
        <View style={styles.documentIcon}>
          <Image
            source={imageSource}
            style={[
              styles.documentImage,
              {
                tintColor: isSelected ? "#3B82F6" : "rgba(255, 255, 255, 0.6)",
              },
            ]}
            resizeMode="contain"
          />
        </View>
        <View style={styles.documentInfo}>
          <Text
            style={[
              styles.documentTitle,
              isSelected && styles.documentTitleSelected,
            ]}
          >
            {title}
          </Text>
          <Text style={styles.documentSubtitle}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
    );
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
                <Text style={styles.title}>Identity Verification</Text>
                <Text style={styles.subtitle}>
                  Verify your identity with official documents
                </Text>
              </View>

              {/* Main Form Container */}

              {/* Document Selection */}
              <View style={styles.documentSelection}>
                <View style={styles.documentRow}>
                  {renderDocumentOption(
                    "passport",
                    require("@/assets/Icons/Passport.png"),
                    "Passport",
                    ""
                  )}
                  {renderDocumentOption(
                    "driving_license",
                    require("@/assets/Icons/License.png"),
                    "Driving License",
                    ""
                  )}
                  {renderDocumentOption(
                    "national_id_card",
                    require("@/assets/Icons/Nationality.png"),
                    "National ID Card",
                    ""
                  )}
                </View>
              </View>

              {/* Form Fields */}
              <View style={styles.formSection}>
                {/* Document Number */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Document Number</Text>
                  <TextInput
                    style={styles.input}
                    value={documentNumber}
                    onChangeText={setDocumentNumber}
                    placeholder="Enter document number"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  />
                </View>

                {/* Country and Nationality Row */}
                <View style={styles.countryRow}>
                  <View style={[styles.inputGroup, styles.countryInput]}>
                    <Text style={styles.inputLabel}>Issuing City</Text>
                    <TextInput
                      style={styles.input}
                      value={issuingCity}
                      onChangeText={setIssuingCity}
                      placeholder="Enter issuing city"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    />
                  </View>

                  <CountryInput
                    label="Nationality"
                    selectedCountry={nationality}
                    onPress={handleCountrySelect}
                    style={styles.countryInput}
                  />
                </View>

                {/* Expiry Date */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Expiry Date (Optional)</Text>
                  <View style={styles.dateInputContainer}>
                    <TextInput
                      style={styles.dateInput}
                      value={expiryDate}
                      onChangeText={setExpiryDate}
                      placeholder="00/00/0000"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    />
                  </View>
                </View>

                {/* Document Photos */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Document Photos</Text>
                  <View
                    style={[
                      styles.photoRow,
                      selectedDocument !== "passport" && {
                        justifyContent: "space-between",
                      },
                    ]}
                  >
                    {selectedDocument === "passport" ? (
                      // Passport needs only one photo
                      <View style={styles.photoUploadContainer}>
                        <TouchableOpacity
                          style={[
                            styles.photoUploadIcon,
                            passportImage && styles.photoUploadSelected,
                          ]}
                          onPress={() => handleAddPhoto("passport")}
                        >
                          {passportImage ? (
                            <View style={styles.photoSelectedContainer}>
                              <Ionicons
                                name="checkmark-circle"
                                size={24}
                                color="#4CAF50"
                              />
                              <Text style={styles.photoSelectedText}>
                                Passport Selected
                              </Text>
                            </View>
                          ) : (
                            <>
                              <Image
                                source={require("@/assets/Icons/AddPhoto.png")}
                                style={styles.addPhotoImage}
                                resizeMode="contain"
                              />
                              <Text style={styles.addPhotoText}>
                                Add Passport Photo
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    ) : (
                      // Driving License and National ID need two photos
                      <>
                        <View
                          style={[
                            styles.photoUploadContainer,
                            { flex: 1, marginRight: 8 },
                          ]}
                        >
                          <TouchableOpacity
                            style={[
                              styles.photoUploadIcon,
                              frontImage && styles.photoUploadSelected,
                            ]}
                            onPress={() => handleAddPhoto("front")}
                          >
                            {frontImage ? (
                              <View style={styles.photoSelectedContainer}>
                                <Ionicons
                                  name="checkmark-circle"
                                  size={20}
                                  color="#4CAF50"
                                />
                                <Text style={styles.photoSelectedTextSmall}>
                                  Front Selected
                                </Text>
                              </View>
                            ) : (
                              <>
                                <Image
                                  source={require("@/assets/Icons/AddPhoto.png")}
                                  style={styles.addPhotoImage}
                                  resizeMode="contain"
                                />
                                <Text style={styles.addPhotoTextSmall}>
                                  Front
                                </Text>
                              </>
                            )}
                          </TouchableOpacity>
                        </View>
                        <View
                          style={[
                            styles.photoUploadContainer,
                            { flex: 1, marginLeft: 8 },
                          ]}
                        >
                          <TouchableOpacity
                            style={[
                              styles.photoUploadIcon,
                              backImage && styles.photoUploadSelected,
                            ]}
                            onPress={() => handleAddPhoto("back")}
                          >
                            {backImage ? (
                              <View style={styles.photoSelectedContainer}>
                                <Ionicons
                                  name="checkmark-circle"
                                  size={20}
                                  color="#4CAF50"
                                />
                                <Text style={styles.photoSelectedTextSmall}>
                                  Back Selected
                                </Text>
                              </View>
                            ) : (
                              <>
                                <Image
                                  source={require("@/assets/Icons/AddPhoto.png")}
                                  style={styles.addPhotoImage}
                                  resizeMode="contain"
                                />
                                <Text style={styles.addPhotoTextSmall}>
                                  Back
                                </Text>
                              </>
                            )}
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.continueButtonText}>Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Country Selection Modal */}
      <CountrySelector
        visible={isCountryModalVisible}
        onClose={() => setCountryModalVisible(false)}
        onSelect={handleCountrySelection}
        selectedCountry={nationality}
        title="Select Nationality"
      />
    </OnboardingBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
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
    padding: 7,
  },
  sectionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 40,
    padding: 10,
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
  documentSelection: {
    marginBottom: 24,
  },
  documentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  documentOption: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    padding: 16,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    minHeight: 90,
  },
  documentOptionSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  documentInfo: {
    alignItems: "center",
  },
  documentTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 16,
  },
  documentTitleSelected: {
    color: "#3B82F6",
  },
  documentSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
  },
  formSection: {
    marginTop: 0,
  },
  inputGroup: {
    marginBottom: 20,
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
  countryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  countryInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateInputContainer: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
  },
  dateInput: {
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
  documentImage: {
    width: 32,
    height: 32,
  },
  photoRow: {
    flexDirection: "row",
    marginLeft: -35, // Adjusted to align with the document photos
    marginBottom: -30, // Adjusted to align with the document photos
    marginTop: 10, // Adjusted to align with the document photos
    justifyContent: "center",
    alignItems: "center",
  },
  photoUploadContainer: {
    alignItems: "center",
  },
  photoUploadIcon: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  photoUploadSelected: {
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  photoSelectedContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  photoSelectedText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },
  photoSelectedTextSmall: {
    fontSize: 10,
    color: "#4CAF50",
    fontWeight: "500",
    marginTop: 2,
    textAlign: "center",
  },
  addPhotoText: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },
  addPhotoTextSmall: {
    fontSize: 10,
    color: "#3B82F6",
    fontWeight: "500",
    marginTop: 2,
    textAlign: "center",
  },
  addPhotoImage: {
    width: 70,
    height: 70,
    tintColor: "#3B82F6",
  },
  photoUploadLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default IdentityVerificationScreen;
