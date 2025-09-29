import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import { OnboardingBackground } from "../../components/UniversalBackground";
import { useUser } from "../../context/UserContext";
import { RootStackParamList } from "../../types";

type AccountDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  "AccountDetails"
>;

const AccountDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<AccountDetailsScreenRouteProp>();
  const { user, addCard } = useUser();
  const [address, setAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(() => {
    try {
      setLoading(true);

      // Use data from UserContext instead of API call
      if (user) {
        // Split fullName into first and last name
        const nameParts = user.fullName?.split(" ") || ["User", "Name"];
        setFirstName(nameParts[0] || "User");
        setLastName(nameParts.slice(1).join(" ") || "Name");

        // Load address data from UserContext
        setCity(user.city || "Not provided");
        setProvince(user.province || "Not provided");
        setPostalCode(user.postalCode || "Not provided");
        setAddress(user.streetAddress || "No address provided");
      } else {
        // Set fallback values if no user data
        setFirstName("User");
        setLastName("Name");
        setCity("Not provided");
        setProvince("Not provided");
        setPostalCode("Not provided");
        setAddress("No address provided");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      // Set fallback values if loading fails
      setFirstName("User");
      setLastName("Name");
      setCity("Not provided");
      setProvince("Not provided");
      setPostalCode("Not provided");
      setAddress("No address provided");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Reload data every time the screen comes into focus
  useFocusEffect(loadUserData);

  const handleChangeInformation = () => {
    navigation.navigate("EditAccountDetails");
  };

  const handleContinue = () => {
    // Get selected currency from route params, default to EUR if not provided
    const selectedCurrency = route.params?.currency?.code || "EUR";

    const currencyIcons: { [key: string]: any } = {
      EUR: require("../../assets/Icons/Currency.png"),
      GBP: require("../../assets/Icons/Currency.png"), // Same icon for now
      USD: require("../../assets/Icons/USDC.png"),
      default: require("../../assets/Icons/Money.png"),
    };

    const currencyGradients: { [key: string]: string[] } = {
      EUR: ["#667eea", "#764ba2"], // Purple gradient for EUR
      GBP: ["#11998e", "#38ef7d"], // Green gradient for GBP
      USD: ["#f093fb", "#f5576c"], // Pink gradient for USD
      default: ["#4facfe", "#00f2fe"],
    };

    const newCurrencyCard = {
      type: selectedCurrency,
      name: `${selectedCurrency} Account`,
      balance: "0.00", // Starting balance
      cardNumber: "•••• •••• •••• " + Math.floor(1000 + Math.random() * 9000),
      gradient:
        currencyGradients[selectedCurrency] || currencyGradients["default"],
      isFrozen: false,
      isInfoHidden: false,
      limit: 10000,
      currency: selectedCurrency,
      icon: currencyIcons[selectedCurrency] || currencyIcons["default"],
    };

    // Add the new currency card to user's cards
    addCard(newCurrencyCard);

    // Navigate to account opening success screen
    navigation.navigate("AccountOpeningSuccess", {
      currency: {
        code: selectedCurrency,
        name:
          selectedCurrency === "EUR"
            ? "Euro"
            : selectedCurrency === "USD"
            ? "US Dollar"
            : selectedCurrency,
        symbol:
          selectedCurrency === "EUR"
            ? "€"
            : selectedCurrency === "USD"
            ? "$"
            : "$",
        flag:
          selectedCurrency === "EUR"
            ? "🇪🇺"
            : selectedCurrency === "USD"
            ? "🇺🇸"
            : "🇺🇸",
      },
    });
  };

  return (
    <OnboardingBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Loading State */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>
                Loading your profile information...
              </Text>
            </View>
          )}

          {/* Content */}
          {!loading && (
            <View style={styles.content}>
              {/* Verification Steps */}
              <View style={styles.verificationSection}>
                <View style={styles.verificationContainer}>
                  <Text style={styles.verificationTitle}>
                    Make sure your account details are correct
                  </Text>

                  <View style={styles.verificationItem}>
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                    <View style={styles.verificationTextContainer}>
                      <Text style={styles.verificationItemTitle}>
                        Check the account name
                      </Text>
                      <Text style={styles.verificationItemSubtitle}>
                        The account name must exactly match your identity
                        verification information.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.verificationItem}>
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                    <View style={styles.verificationTextContainer}>
                      <Text style={styles.verificationItemTitle}>
                        Verify the address
                      </Text>
                      <Text style={styles.verificationItemSubtitle}>
                        Please provide a valid address.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Form Fields */}
              <View style={styles.formSection}>
                {/* Currency Applied */}
                <View style={styles.currencySection}>
                  <Text style={styles.currencyTitle}>Currency applied</Text>
                  <View style={styles.currencyItem}>
                    <View style={styles.euroIcon}>
                      <Text style={styles.euroSymbol}>
                        {route.params?.currency?.symbol || "€"}
                      </Text>
                    </View>
                    <Text style={styles.currencyText}>
                      {route.params?.currency?.code || "EUR"} (
                      {route.params?.currency?.name || "Euro"})
                    </Text>
                  </View>
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.fieldLabel}>First name</Text>
                  <Text style={styles.fieldValue}>
                    {loading ? "Loading..." : firstName || "Not provided"}
                  </Text>
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.fieldLabel}>Last name</Text>
                  <Text style={styles.fieldValue}>
                    {loading ? "Loading..." : lastName || "Not provided"}
                  </Text>
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.fieldLabel}>Address</Text>
                  <Text style={styles.fieldValue}>
                    {loading ? "Loading..." : address || "No address provided"}
                  </Text>
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.fieldLabel}>City</Text>
                  <Text style={styles.fieldValue}>
                    {loading ? "Loading..." : city || "Not provided"}
                  </Text>
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.fieldLabel}>Province/State</Text>
                  <Text style={styles.fieldValue}>
                    {loading ? "Loading..." : province || "Not provided"}
                  </Text>
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.fieldLabel}>Postal code</Text>
                  <Text style={styles.fieldValue}>
                    {loading ? "Loading..." : postalCode || "Not provided"}
                  </Text>
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.fieldLabel}>Country/Region</Text>
                  <View style={styles.countryContainer}>
                    <View style={styles.countryFlag}>
                      <Text style={styles.flagText}>🇹🇳</Text>
                    </View>
                    <Text style={styles.fieldValue}>TUN</Text>
                  </View>
                </View>
              </View>

              {/* Change Information Link */}
              <TouchableOpacity
                style={styles.changeInfoButton}
                onPress={handleChangeInformation}
              >
                <Text style={styles.changeInfoText}>
                  Change your information
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </OnboardingBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  verificationSection: {
    marginBottom: 30,
  },
  verificationContainer: {
    backgroundColor: "rgba(10, 100, 100, 0.3)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  verificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#34C759",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  verificationTextContainer: {
    flex: 1,
  },
  verificationItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  verificationItemSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 16,
  },
  currencySection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  currencyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  euroIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  euroSymbol: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  currencyText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  formSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  fieldLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  fieldValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryFlag: {
    marginRight: 8,
  },
  flagText: {
    fontSize: 16,
  },
  changeInfoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  changeInfoText: {
    fontSize: 14,
    color: "#007AFF",
    marginRight: 4,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: "transparent",
  },
  continueButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AccountDetailsScreen;
