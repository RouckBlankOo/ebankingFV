import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  NavigationProp,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import { OnboardingBackground } from "../../components/UniversalBackground";
import { ThemedText } from "../../components/ThemedText";
import { RootStackParamList } from "../../types";

type AccountOpeningSuccessScreenRouteProp = RouteProp<
  RootStackParamList,
  "AccountOpeningSuccess"
>;

const AccountOpeningSuccessScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<AccountOpeningSuccessScreenRouteProp>();

  const currency = route.params?.currency;

  const handleDepositNow = (): void => {
    try {
      console.log("Currency data:", currency);
      console.log("Currency code:", currency?.code);

      // Navigate to EUR deposit screen if currency is EUR
      if (currency && currency.code === "EUR") {
        console.log("Navigating to EURDeposit");
        navigation.navigate("EURDeposit");
      } else {
        console.log("Navigating to SelectCurrency");
        // Navigate to deposit flow with proper currency context for other currencies
        navigation.navigate("SelectCurrency", { purpose: "deposit" });
      }
    } catch (error) {
      console.error("Navigation error in AccountOpeningSuccess:", error);
    }
  };

  const handleGoBack = (): void => {
    try {
      // Navigate back to home screen instead of previous screen
      // This prevents users from going back to incomplete flows
      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      });
    } catch (error) {
      console.error("Navigation error going back:", error);
      navigation.goBack();
    }
  };

  return (
    <OnboardingBackground style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            accessibilityLabel="Go back to home"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Success Card */}
          <View style={styles.successCard}>
            {/* Success Icon */}
            <View style={styles.successIconContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={32} color="#FFFFFF" />
              </View>
            </View>

            {/* Success Message */}
            <ThemedText style={styles.successTitle}>
              Everything Is Done
            </ThemedText>
            <ThemedText style={styles.successMessage}>
              Your{" "}
              {currency ? `${currency.name} (${currency.code})` : "currency"}{" "}
              account has been successfully created.
            </ThemedText>
          </View>

          {/* Spacer for proper layout */}
          <View style={styles.spacer} />

          {/* Deposit Button */}
          <TouchableOpacity
            style={styles.depositButton}
            onPress={handleDepositNow}
            activeOpacity={0.8}
            accessibilityLabel="Start depositing money"
            accessibilityRole="button"
          >
            <ThemedText style={styles.depositButtonText}>
              Deposit Now
            </ThemedText>
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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  successCard: {
    backgroundColor: "rgba(55, 65, 81, 0.85)",
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    maxWidth: 340,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    backdropFilter: "blur(10px)",
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#1E40AF",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  successMessage: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
    maxHeight: 80,
  },
  depositButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.5)",
  },
  depositButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});

export default AccountOpeningSuccessScreen;
