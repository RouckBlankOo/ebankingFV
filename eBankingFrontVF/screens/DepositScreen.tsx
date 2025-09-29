import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { OnboardingBackground } from "../components/UniversalBackground";
import { RootStackParamList } from "../types";
import { BlurView } from "expo-blur";

const DepositScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDeposit = () => {
    navigation.navigate("EURBankTransferScreen" as never);
  };

  const handleConvert = () => {
    navigation.navigate("Convert" as never);
  };

  return (
    <OnboardingBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Total Value Card */}
          <BlurView
            intensity={Platform.OS === "ios" ? 40 : 80}
            tint="dark"
            style={styles.valueCardBlur}
          >
            <View style={styles.valueCard}>
              <Text style={styles.totalAmount}>119.98</Text>
              <Text style={styles.totalLabel}>Total Value (EUR)</Text>
              <View style={styles.accountInfo}>
                <Text style={styles.accountNumber}>
                  DE68 2022 0800 0040 3720 92
                </Text>
              </View>
            </View>
          </BlurView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDeposit}
            >
              <View style={styles.circleButton}>
                <Ionicons name="download-outline" size={28} color="#fff" />
              </View>
              <Text style={styles.circleButtonLabel}>Deposit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleConvert}
            >
              <View style={styles.circleButton}>
                <Ionicons
                  name="swap-horizontal-outline"
                  size={28}
                  color="#fff"
                />
              </View>
              <Text style={styles.circleButtonLabel}>Convert</Text>
            </TouchableOpacity>
          </View>

          {/* Conditions Section */}
          <BlurView
            intensity={Platform.OS === "ios" ? 30 : 60}
            tint="dark"
            style={styles.conditionsSectionBlur}
          >
            <View style={styles.conditionsSection}>
              <Text style={styles.conditionsTitle}>
                Meet the conditions below to avoid any delay, rejection or loss
                of funds.
              </Text>

              {/* Condition Items */}
              <View style={styles.conditionItem}>
                <View style={styles.conditionNumber}>
                  <Text style={styles.conditionNumberText}>1</Text>
                </View>
                <View style={styles.conditionContent}>
                  <Text style={styles.conditionTitle}>
                    Verification of the Account Name
                  </Text>
                  <Text style={styles.conditionDescription}>
                    Please ensure that the sender&aposs bank account name
                    matches the currency account holder&aposs name.
                  </Text>
                </View>
              </View>

              <View style={styles.conditionItem}>
                <View style={styles.conditionNumber}>
                  <Text style={styles.conditionNumberText}>2</Text>
                </View>
                <View style={styles.conditionContent}>
                  <Text style={styles.conditionTitle}>Minimum Deposit</Text>
                  <Text style={styles.conditionDescription}>
                    The minimum deposit is 10 EUR. Amounts below this may not be
                    processed and are non-refundable.
                  </Text>
                </View>
              </View>

              <View style={styles.conditionItem}>
                <View style={styles.conditionNumber}>
                  <Text style={styles.conditionNumberText}>3</Text>
                </View>
                <View style={styles.conditionContent}>
                  <Text style={styles.conditionTitle}>Payment method</Text>
                  <Text style={styles.conditionDescription}>
                    Use your local EUR SEPA bank account or a payment provider
                    that supports SEPA for the transfer.
                  </Text>
                </View>
              </View>

              <View style={styles.conditionItem}>
                <View style={styles.conditionNumber}>
                  <Text style={styles.conditionNumberText}>4</Text>
                </View>
                <View style={styles.conditionContent}>
                  <Text style={styles.conditionTitle}>
                    Refunds of Failed Deposits
                  </Text>
                  <Text style={styles.conditionDescription}>
                    They will be processed within 7 to 14 business days.
                  </Text>
                </View>
              </View>
            </View>
          </BlurView>
        </ScrollView>
      </SafeAreaView>
    </OnboardingBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  valueCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  valueCardBlur: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 30,
  },
  totalAmount: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
  },
  accountInfo: {
    backgroundColor: "rgba(0, 122, 255, 0.2)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  accountNumber: {
    fontSize: 14,
    color: "#FFFFFFFF",
    fontWeight: "600",
    letterSpacing: 1,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  actionButton: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10,
  },
  circleButton: {
    width: 54,
    height: 54,
    borderRadius: 32,
    backgroundColor: "#23262F",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  circleButtonLabel: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 2,
  },
  conditionsSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  conditionsSectionBlur: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  conditionsTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  conditionItem: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  conditionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    marginTop: 2,
  },
  conditionNumberText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  conditionContent: {
    flex: 1,
  },
  conditionTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 4,
  },
  conditionDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 18,
  },
});

export default DepositScreen;
