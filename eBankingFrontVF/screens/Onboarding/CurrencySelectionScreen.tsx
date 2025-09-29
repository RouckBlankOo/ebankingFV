import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { OnboardingBackground } from "../../components/UniversalBackground";
import { useUser } from "../../context/UserContext";
import { RootStackParamList } from "../../types";

interface CurrencyOption {
  id: string;
  symbol: string;
  name: string;
  code: string;
  flag: string;
}

const CurrencySelectionScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { cards } = useUser();
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");

  // Check which currencies already exist
  const existingCurrencies = cards
    .filter((card) => card.type === "EUR" || card.type === "USD")
    .map((card) => card.type);

  const hasEUR = existingCurrencies.includes("EUR");
  const hasUSD = existingCurrencies.includes("USD");

  const currencies: (CurrencyOption & { disabled?: boolean })[] = [
    {
      id: "eur",
      symbol: "€",
      name: "Euro",
      code: "EUR",
      flag: "🇪🇺",
      disabled: hasEUR,
    },
    {
      id: "usd",
      symbol: "$",
      name: "US Dollar",
      code: "USD",
      flag: "🇺🇸",
      disabled: hasUSD,
    },
  ];

  const handleCurrencySelect = (currencyId: string) => {
    const currency = currencies.find((c) => c.id === currencyId);
    if (currency && !currency.disabled) {
      setSelectedCurrency(currencyId);
    }
  };

  const handleContinue = () => {
    if (selectedCurrency) {
      const selectedCurrencyData = currencies.find(
        (c) => c.id === selectedCurrency
      );
      if (selectedCurrencyData) {
        navigation.navigate("AccountOpeningConditions", {
          currency: selectedCurrencyData,
        });
      }
    }
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
            <Text style={styles.headerTitle}>Select Currency</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Choose your account currency</Text>
            {hasEUR && hasUSD ? (
              <Text style={styles.subtitle}>
                You have already added both available currency accounts (EUR and
                USD). You can only have one account per currency type.
              </Text>
            ) : (
              <Text style={styles.subtitle}>
                Select the currency for your new account. This will be the
                primary currency for your account. You can only have one account
                per currency type.
              </Text>
            )}

            {/* Currency Options */}
            <View style={styles.currencyContainer}>
              {currencies.map((currency) => (
                <TouchableOpacity
                  key={currency.id}
                  style={[
                    styles.currencyOption,
                    selectedCurrency === currency.id && styles.selectedCurrency,
                    currency.disabled && styles.disabledCurrency,
                  ]}
                  onPress={() => handleCurrencySelect(currency.id)}
                  disabled={currency.disabled}
                >
                  <View style={styles.currencyLeft}>
                    <View style={styles.flagContainer}>
                      <Text
                        style={[
                          styles.flag,
                          currency.disabled && styles.disabledText,
                        ]}
                      >
                        {currency.flag}
                      </Text>
                    </View>
                    <View style={styles.currencyInfo}>
                      <Text
                        style={[
                          styles.currencyName,
                          currency.disabled && styles.disabledText,
                        ]}
                      >
                        {currency.name}
                      </Text>
                      <Text
                        style={[
                          styles.currencyCode,
                          currency.disabled && styles.disabledText,
                        ]}
                      >
                        {currency.code}
                      </Text>
                      {currency.disabled && (
                        <Text style={styles.alreadyAddedText}>
                          Already added
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.currencyRight}>
                    <Text
                      style={[
                        styles.currencySymbol,
                        currency.disabled && styles.disabledText,
                      ]}
                    >
                      {currency.symbol}
                    </Text>
                    {selectedCurrency === currency.id && (
                      <View style={styles.checkmark}>
                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedCurrency && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!selectedCurrency}
          >
            <Text
              style={[
                styles.continueButtonText,
                !selectedCurrency && styles.disabledButtonText,
              ]}
            >
              Continue
            </Text>
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
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 24,
    marginBottom: 40,
  },
  currencyContainer: {
    gap: 16,
  },
  currencyOption: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedCurrency: {
    borderColor: "#007AFF",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  currencyLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  flagContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  flag: {
    fontSize: 24,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  currencyCode: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  currencyRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
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
  disabledButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  disabledButtonText: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  disabledCurrency: {
    opacity: 0.5,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  disabledText: {
    color: "rgba(255, 255, 255, 0.4)",
  },
  alreadyAddedText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    fontStyle: "italic",
    marginTop: 2,
  },
});

export default CurrencySelectionScreen;
