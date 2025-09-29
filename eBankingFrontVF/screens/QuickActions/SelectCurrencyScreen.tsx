import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../../components/Text";
import { OnboardingBackground } from "../../components/UniversalBackground";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";
import { RootStackParamList } from "../../types";

type SelectCurrencyScreenRouteProp = RouteProp<
  RootStackParamList,
  "SelectCurrency"
>;

interface Currency {
  id: string;
  symbol: string;
  name: string;
  icon: any;
  value: string;
  usdValue: string;
}

export default function SelectCurrencyScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<SelectCurrencyScreenRouteProp>();
  const { availableCurrencies, setSelectedCurrency, selectedCurrency } =
    useCurrency();
  const { t } = useLanguage();

  // Get the purpose from navigation params
  const purpose = route.params?.purpose || "settings";

  // Combine available currencies with crypto currencies for display
  const getAllCurrencies = (): Currency[] => {
    const fiatCurrencies: Currency[] = availableCurrencies.map((curr) => ({
      id: curr.id,
      symbol: curr.symbol,
      name: curr.name,
      icon: curr.icon,
      value: "0.00", // Will be updated with real balance
      usdValue: `${(1 / curr.exchangeRate).toFixed(2)}USD`,
    }));

    const cryptoCurrencies: Currency[] = [
      {
        id: "btc",
        symbol: "BTC",
        name: "Bitcoin",
        icon: require("../../assets/Icons/Binances.png"),
        value: "0.00000000",
        usdValue: "0.00USD",
      },
      {
        id: "eth",
        symbol: "ETH",
        name: "Ethereum",
        icon: require("../../assets/Icons/ETH.png"),
        value: "0.00000000",
        usdValue: "0.00USD",
      },
      {
        id: "usdc",
        symbol: "USDC",
        name: "USDC",
        icon: require("../../assets/Icons/USDC.png"),
        value: "0.00000000",
        usdValue: "1.00USD",
      },
      {
        id: "usdt",
        symbol: "USDT",
        name: "USDT",
        icon: require("../../assets/Icons/USDT.png"),
        value: "0.00000000",
        usdValue: "0.00USD",
      },
    ];

    return [...fiatCurrencies, ...cryptoCurrencies];
  };

  const currencies = getAllCurrencies();

  const handleCurrencySelect = async (currency: Currency) => {
    if (purpose === "settings") {
      // Settings flow: Change account balance display currency
      const matchingCurrency = availableCurrencies.find(
        (c) => c.symbol === currency.symbol
      );
      if (matchingCurrency) {
        await setSelectedCurrency(matchingCurrency);
        console.log("Account currency changed to:", matchingCurrency.symbol);
        navigation.goBack(); // Go back to settings
      }
    } else {
      // Deposit flow: Select currency for transaction and go to method selection
      console.log("Selected currency for deposit:", currency.symbol);
      navigation.navigate("SelectMethod", {
        currency: {
          symbol: currency.symbol,
          name: currency.name,
          icon: currency.icon,
        },
      });
    }
  };

  const renderCurrencyItem = (currency: Currency) => {
    const isSelected = selectedCurrency.symbol === currency.symbol;

    return (
      <TouchableOpacity
        key={currency.id}
        style={[styles.currencyItem, isSelected && styles.selectedCurrencyItem]}
        onPress={() => handleCurrencySelect(currency)}
        activeOpacity={0.8}
      >
        <View style={styles.currencyLeft}>
          <View style={styles.currencyIconContainer}>
            <Image
              source={currency.icon}
              style={styles.currencyIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.currencyInfo}>
            <Text style={styles.currencySymbol}>{currency.symbol}</Text>
            <Text style={styles.currencyName}>{currency.name}</Text>
          </View>
        </View>
        <View style={styles.currencyRight}>
          <Text style={styles.currencyValue}>{currency.value}</Text>
          <Text style={styles.currencyUsdValue}>≈ {currency.usdValue}</Text>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <OnboardingBackground style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("currency.selectCurrency")}</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Currency List */}
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {currencies.map((currency) => renderCurrencyItem(currency))}
        </ScrollView>
      </View>
    </OnboardingBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerRight: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.01)",

    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedCurrencyItem: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  currencyLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  currencyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  currencyIcon: {
    width: 32,
    height: 32,
  },
  currencyInfo: {
    flex: 1,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  currencyName: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  currencyRight: {
    alignItems: "flex-end",
  },
  currencyValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  currencyUsdValue: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
});
