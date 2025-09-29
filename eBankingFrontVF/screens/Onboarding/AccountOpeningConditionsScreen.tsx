import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
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

type AccountOpeningConditionsScreenRouteProp = RouteProp<
  RootStackParamList,
  "AccountOpeningConditions"
>;

const AccountOpeningConditionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<AccountOpeningConditionsScreenRouteProp>();
  const [showDepositDetails, setShowDepositDetails] = useState(false);

  const currency = route.params?.currency;

  const handleBack = (): void => {
    navigation.goBack();
  };

  const handleContinue = (): void => {
    // Navigate directly to AccountDetails since conditions are met
    navigation.navigate("AccountDetails", { currency });
  };

  const handleToggleDepositDetails = (): void => {
    setShowDepositDetails(!showDepositDetails);
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
            onPress={handleBack}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>
            Account opening conditions
          </ThemedText>
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Completed Conditions */}
            <View style={styles.conditionItem}>
              <View style={styles.conditionContent}>
                <ThemedText style={styles.conditionText}>
                  Your identity has been verified.
                </ThemedText>
                <View style={styles.checkmarkIcon}>
                  <Ionicons name="checkmark" size={20} color="#10B981" />
                </View>
              </View>
            </View>

            <View style={styles.conditionItem}>
              <View style={styles.conditionContent}>
                <ThemedText style={styles.conditionText}>
                  You have completed the risk assessment.
                </ThemedText>
                <View style={styles.checkmarkIcon}>
                  <Ionicons name="checkmark" size={20} color="#10B981" />
                </View>
              </View>
            </View>

            {/* Deposit Requirement */}
            <TouchableOpacity
              style={styles.conditionItem}
              onPress={handleToggleDepositDetails}
              activeOpacity={0.8}
            >
              <View style={styles.conditionContent}>
                <View style={styles.depositInfo}>
                  <ThemedText style={styles.conditionText}>
                    A minimum deposit of 100 USD{"\n"}is required why?
                  </ThemedText>
                  <ThemedText style={styles.balanceText}>
                    Solde: 20.07 USD
                  </ThemedText>
                </View>
                <View style={styles.arrowIcon}>
                  <Ionicons
                    name={showDepositDetails ? "chevron-up" : "chevron-forward"}
                    size={20}
                    color="rgba(255, 255, 255, 0.6)"
                  />
                </View>
              </View>

              {showDepositDetails && (
                <View style={styles.depositDetails}>
                  <ThemedText style={styles.depositDetailsText}>
                    The minimum deposit requirement ensures:
                    {"\n"}• Account activation and compliance
                    {"\n"}• Access to all banking features
                    {"\n"}• Regulatory requirements fulfillment
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
            accessibilityLabel="Continue to account details"
            accessibilityRole="button"
          >
            <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
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
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Space for button
  },
  conditionItem: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  conditionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  conditionText: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 22,
    flex: 1,
    marginRight: 12,
  },
  checkmarkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  depositInfo: {
    flex: 1,
    marginRight: 12,
  },
  balanceText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 4,
  },
  depositDetails: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    marginTop: -8,
  },
  depositDetailsText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
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
    backgroundColor: "#3B82F6",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.5)",
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});

export default AccountOpeningConditionsScreen;
