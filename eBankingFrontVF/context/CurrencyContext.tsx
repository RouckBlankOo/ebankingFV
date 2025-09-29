import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CurrencyData {
  id: string;
  symbol: string;
  name: string;
  icon: any;
  displaySymbol: string;
  exchangeRate: number;
}

interface CurrencyContextType {
  selectedCurrency: CurrencyData;
  setSelectedCurrency: (currency: CurrencyData) => void;
  availableCurrencies: CurrencyData[];
  convertAmount: (amount: number, fromCurrency?: string) => number;
  formatAmount: (amount: number) => string;
  loading: boolean;
}

const defaultCurrencies: CurrencyData[] = [
  {
    id: "usd",
    symbol: "USD",
    name: "US Dollar",
    icon: require("../assets/Icons/Currency.png"),
    displaySymbol: "$",
    exchangeRate: 1.0,
  },
  {
    id: "eur",
    symbol: "EUR",
    name: "Euro",
    icon: require("../assets/Icons/Currency.png"),
    displaySymbol: "€",
    exchangeRate: 0.85,
  },
  {
    id: "gbp",
    symbol: "GBP",
    name: "British Pound",
    icon: require("../assets/Icons/Currency.png"),
    displaySymbol: "£",
    exchangeRate: 0.73,
  },
  {
    id: "jpy",
    symbol: "JPY",
    name: "Japanese Yen",
    icon: require("../assets/Icons/Currency.png"),
    displaySymbol: "¥",
    exchangeRate: 110.0,
  },
  {
    id: "cny",
    symbol: "CNY",
    name: "Chinese Yuan",
    icon: require("../assets/Icons/Currency.png"),
    displaySymbol: "¥",
    exchangeRate: 6.45,
  },
  {
    id: "tnd",
    symbol: "TND",
    name: "Tunisian Dinar",
    icon: require("../assets/Icons/Currency.png"),
    displaySymbol: "DT ",
    exchangeRate: 2.8,
  },
];

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedCurrency, setSelectedCurrencyState] = useState<CurrencyData>(
    defaultCurrencies[0]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedCurrency();
  }, []);

  const loadSavedCurrency = async () => {
    try {
      const savedCurrencyId = await AsyncStorage.getItem("selectedCurrency");
      if (savedCurrencyId) {
        const currency = defaultCurrencies.find(
          (c) => c.id === savedCurrencyId
        );
        if (currency) {
          setSelectedCurrencyState(currency);
        }
      }
    } catch (error) {
      console.error("Failed to load saved currency:", error);
    } finally {
      setLoading(false);
    }
  };

  const setSelectedCurrency = async (currency: CurrencyData) => {
    try {
      setSelectedCurrencyState(currency);
      await AsyncStorage.setItem("selectedCurrency", currency.id);
    } catch (error) {
      console.error("Failed to save currency:", error);
    }
  };

  const convertAmount = (
    amount: number,
    fromCurrency: string = "USD"
  ): number => {
    // Convert from USD base to selected currency
    if (fromCurrency === "USD") {
      return amount * selectedCurrency.exchangeRate;
    }

    // For other currencies, first convert to USD then to target
    const fromCurrencyData = defaultCurrencies.find(
      (c) => c.symbol === fromCurrency
    );
    if (!fromCurrencyData) return amount;

    const usdAmount = amount / fromCurrencyData.exchangeRate;
    return usdAmount * selectedCurrency.exchangeRate;
  };

  const formatAmount = (amount: number): string => {
    const convertedAmount = convertAmount(amount);
    return `${selectedCurrency.displaySymbol}${convertedAmount.toFixed(2)}`;
  };

  const value: CurrencyContextType = {
    selectedCurrency,
    setSelectedCurrency,
    availableCurrencies: defaultCurrencies,
    convertAmount,
    formatAmount,
    loading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
