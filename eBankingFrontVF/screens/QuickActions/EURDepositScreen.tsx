import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { OnboardingBackground } from "../../components/UniversalBackground";
import { RootStackParamList } from "../../types";

const EURDepositScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  // @ts-ignore
  const accountInfo = route.params?.accountInfo || {
    iban: "DE68 2022 0800 0040 3720 92",
    totalValue: "119.98",
    currency: "EUR",
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDepositAction = () => {
    // Handle deposit action
    console.log("Deposit action pressed");
  };

  const handleConvertAction = () => {
    // Handle convert action
    navigation.navigate("Convert");
  };

  const depositConditions = [
    {
      id: 1,
      title: "Verification of the Account Name",
      description:
        "Please ensure that the sender's bank account name matches the currency account holder's name.",
    },
    {
      id: 2,
      title: "Minimum Deposit",
      description:
        "The minimum deposit is 10 EUR. Amounts below this may not be processed and are non-refundable.",
    },
    {
      id: 3,
      title: "Payment method",
      description:
        "Use your local EUR SEPA bank account or a payment provider that supports SEPA for this transfer.",
    },
    {
      id: 4,
      title: "Refunds of Failed Deposits",
      description: "They will be processed within 7 to 14 business days.",
    },
  ];

  return (
    <OnboardingBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Balance Display */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceAmount}>{accountInfo.totalValue}</Text>
            <Text style={styles.balanceLabel}>
              Total Value ({accountInfo.currency}) ▼
            </Text>
          </View>

          {/* IBAN Display */}
          <View style={styles.ibanContainer}>
            <Text style={styles.ibanText}>{accountInfo.iban}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDepositAction}
            >
              <View style={styles.actionButtonIcon}>
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.actionButtonText}>Deposit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleConvertAction}
            >
              <View style={styles.actionButtonIcon}>
                <Ionicons name="swap-horizontal" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.actionButtonText}>Convert</Text>
            </TouchableOpacity>
          </View>

          {/* Conditions Section */}
          <View style={styles.conditionsContainer}>
            <Text style={styles.conditionsIntro}>
              Meet the conditions below to avoid any delay, rejection or loss of
              funds.
            </Text>

            {depositConditions.map((condition, index) => (
              <View key={condition.id} style={styles.conditionItem}>
                <View style={styles.conditionHeader}>
                  <Text style={styles.conditionNumber}>{index + 1}</Text>
                  <Text style={styles.conditionTitle}>{condition.title}</Text>
                </View>
                <Text style={styles.conditionDescription}>
                  {condition.description}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
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
    paddingBottom: 20,
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  balanceContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: "300",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#3B82F6",
    fontWeight: "500",
  },
  ibanContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  ibanText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
    letterSpacing: 1,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  actionButton: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10,
  },
  actionButtonIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  conditionsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
  },
  conditionsIntro: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 24,
    lineHeight: 20,
  },
  conditionItem: {
    marginBottom: 24,
  },
  conditionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  conditionNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
    marginRight: 8,
    minWidth: 20,
  },
  conditionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    lineHeight: 22,
  },
  conditionDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 20,
    marginLeft: 28,
  },
});

export default EURDepositScreen;
