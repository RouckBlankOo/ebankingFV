import { ThemedText } from "@/components/ThemedText";
import { OnboardingBackground } from "@/components/UniversalBackground";
import { useUser } from "@/context/UserContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
// Import reusable components
import { getTransactions } from "@/services/transaction";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActionButton } from "../../components/ActionButton";
import { AddAccountCard } from "../../components/AddAccountCard";
import { AnalyticsChart } from "../../components/AnalyticsChart";
import { CurrencyCard } from "../../components/CurrencyCard";
import { DiscountsContent } from "../../components/DiscountsContent";
import { EmptyState } from "../../components/EmptyState";
import MoreOptionsModal, {
  MoreOption,
} from "../../components/MoreOptionsModal";
import { ReferenceCard } from "../../components/ReferenceCard";
import { SectionContainer } from "../../components/SectionContainer";
import Text from "../../components/Text";
import { UserHeader } from "../../components/UserHeader";
import { VerificationBanner } from "../../components/VerificationBanner";
import { useAlert } from "../../context/AlertContext";
import { RootStackParamList } from "../../types";
import { checkAndClearRefreshFlag } from "../../utils/refreshUtils";

const { width: screenWidth } = Dimensions.get("window");

// Function to get responsive font size for balance amount
const getBalanceFontSize = () => {
  if (screenWidth < 350) return 36; // Small screens
  if (screenWidth < 400) return 40; // Medium screens
  return 44; // Large screens
};

// Function to get font size based on balance length
const getBalanceFontSizeByLength = (balanceText: string) => {
  const baseFontSize = getBalanceFontSize();
  if (balanceText.length > 12) return baseFontSize * 0.7; // Very long numbers
  if (balanceText.length > 8) return baseFontSize * 0.85; // Long numbers
  return baseFontSize; // Normal length
};

interface CurrencyCardData {
  id: string;
  symbol: string;
  iconSource: any;
  name: string;
  balance: string;
  percentage: string;
  coinType: string;
  isAddAccount?: boolean; // Special flag for "Add Account" card
  isDisabled?: boolean; // Flag to disable the "Add Account" card
}

interface Transaction {
  _id: string;
  reference?: string;
  type?: string;
  amount?: number;
  currency?: string;
  status?: string;
  description?: string;
  category?: string;
  balanceAfter?: number;
  cardInfo?: { cardName?: string; cardType?: string; lastFourDigits?: string };
  createdAt?: string;
}

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { isProfileComplete, cards } = useUser();
  const { selectedCurrency } = useCurrency();
  const { t } = useLanguage();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { showInfo } = useAlert();

  // State for more options modal
  const [moreOptionsModalVisible, setMoreOptionsModalVisible] = useState(false);

  // State for identity verification - check if profile is complete
  const profileComplete = isProfileComplete();

  // Function to handle profile press
  const handleProfilePress = () => {
    navigation.navigate("ProfileScreen");
  };

  // Function to handle action button presses
  const handleActionPress = (actionName: string) => {
    // Check if profile is complete
    if (!isProfileComplete()) {
      // Navigate to SecurityVerificationScreen with the action name
      navigation.navigate("SecurityVerification", { actionName });
    } else {
      // Handle the actual action (deposit, send, etc.)
      if (actionName === "more") {
        // Show more options modal when More button is pressed
        setMoreOptionsModalVisible(true);
      } else if (actionName === "deposit") {
        // Navigate to Select Currency screen for deposit with proper parameter
        navigation.navigate("SelectCurrency", { purpose: "deposit" });
      } else if (actionName === "send") {
        // Navigate to Send screen
        navigation.navigate("Send");
      } else {
        console.log(`Performing action: ${actionName}`);
        // TODO: Implement actual action handling for other actions
      }
    }
  };

  // Function to handle card actions
  const handleCardAction = (actionName: string) => {
    console.log(`Performing ${actionName} action`);

    // Check if profile is complete for certain actions
    if (!isProfileComplete()) {
      navigation.navigate("SecurityVerification", { actionName });
      return;
    }

    // Handle specific actions
    switch (actionName) {
      case "convert":
        // Navigate to conversion screen
        navigation.navigate("Convert");
        break;
      case "withdraw":
        // Navigate to withdrawal screen
        navigation.navigate("Withdraw");
        break;
      case "scan":
        // TODO: Open QR scanner
        showInfo(t("home.scanQrCode"), t("home.scanQrCodeDescription"));
        break;
      case "gift":
        // TODO: Navigate to gift screen
        showInfo(t("home.gift"), t("home.giftDescription"));
        break;
      default:
        break;
    }
  };

  // Function to handle currency card navigation with robust type checking
  const handleCurrencyCardPress = (coinType: string) => {
    if (!isProfileComplete()) {
      // Navigate to profile completion if profile is not complete
      navigation.navigate("PersonalInformation");
      return;
    }

    // Handle different card types appropriately
    switch (coinType) {
      case "EUR":
      case "USD":
      case "GBP":
        // Navigate to transactions/dashboard for currency accounts
        navigation.navigate("Dashboard");
        break;
      case "USDC":
      case "BTC":
      case "ETH":
        // Navigate to crypto wallet (if crypto cards are added back)
        navigation.navigate("CoinWalletScreen", { coinType });
        break;
      default:
        console.warn(`Unknown card type: ${coinType}`);
        // Fallback to dashboard
        navigation.navigate("Dashboard");
    }
  };

  // Function to handle add account card press with proper validation
  const handleAddAccountPress = (isDisabled = false) => {
    if (isDisabled) {
      // Show informative alert when account limit is reached
      showInfo(
        "Account Limit Reached",
        "You have reached the maximum number of currency accounts. You can have one EUR account and one USD account."
      );
      return;
    }

    if (!isProfileComplete()) {
      // Guide user to complete profile first
      showInfo(
        "Complete Your Profile",
        "Please complete your profile verification before creating new accounts."
      );
      navigation.navigate("PersonalInformation");
      return;
    }

    // Navigate to account creation flow
    navigation.navigate("CurrencySelection");
  };

  // Define card actions for more options modal
  const homeMoreOptions: MoreOption[] = [
    {
      id: "convert",
      title: t("actions.convert"),
      description: t("actions.convertDescription"),
      icon: "swap-horizontal-outline",
      iconSource: require("@/assets/Icons/Convert.png"),
      gradient: ["rgba(29, 36, 45, 1)", "rgba(29, 36, 45, 0.5)"],
      onPress: () => handleCardAction("convert"),
    },
    {
      id: "withdraw",
      title: t("actions.withdraw"),
      description: t("actions.withdrawDescription"),
      icon: "arrow-up-outline",
      iconSource: require("@/assets/Icons/Withdraw.png"),
      gradient: ["rgba(29, 36, 45, 1)", "rgba(29, 36, 45, 0.5)"],
      onPress: () => handleCardAction("withdraw"),
    },
    {
      id: "scan",
      title: t("actions.scan"),
      description: t("actions.scanDescription"),
      icon: "qr-code-outline",
      iconSource: require("@/assets/Icons/Scan.png"),
      gradient: ["rgba(29, 36, 45, 1)", "rgba(29, 36, 45, 0.5)"],
      onPress: () => handleCardAction("scan"),
    },
    {
      id: "gift",
      title: t("actions.gift"),
      description: t("actions.giftDescription"),
      icon: "gift-outline",
      iconSource: require("@/assets/Icons/Gift.png"),
      gradient: ["rgba(29, 36, 45, 1)", "rgba(29, 36, 45, 0.5)"],
      onPress: () => handleCardAction("gift"),
    },
  ];

  // Current balance and currency from context
  const currentBalance = "0.00"; // Will display properly without cutoff
  const currency = selectedCurrency.displaySymbol;
  const currencyName = selectedCurrency.symbol;

  // Helper function to get symbol for currency/card type
  function getSymbolForCurrency(currency: string): string {
    switch (currency) {
      case "USDC":
        return "💎";
      case "BTC":
        return "₿";
      case "ETH":
        return "⟠";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      default:
        return "💰";
    }
  }

  // Helper function to get currency symbol for balance display
  function getCurrencySymbolForBalance(currency: string): string {
    switch (currency) {
      case "EUR":
        return "€";
      case "USD":
        return "$";
      case "GBP":
        return "£";
      default:
        return "$";
    }
  }

  // Helper function to get icon for currency/card type with fallbacks
  function getIconForCurrency(currency: string) {
    try {
      switch (currency) {
        case "USDC":
          return require("@/assets/Icons/USDC.png");
        case "BTC":
          return require("@/assets/Icons/Binances.png");
        case "ETH":
          return require("@/assets/Icons/ETH.png");
        case "USD":
          // Use a generic dollar icon or bank icon as fallback
          return require("@/assets/Icons/Bank.png");
        case "EUR":
          // Use a generic euro icon or bank icon as fallback
          return require("@/assets/Icons/Bank.png");
        case "GBP":
          // Use a generic pound icon or bank icon as fallback
          return require("@/assets/Icons/Bank.png");
        default:
          return require("@/assets/Icons/Bank.png");
      }
    } catch (error) {
      console.warn(
        `Icon not found for currency ${currency}, using fallback`,
        error
      );
      return require("@/assets/Icons/Bank.png");
    }
  }

  // Convert UserContext cards to CurrencyCardData format with proper fallbacks
  const userCurrencyCards = cards
    .filter((card) => card.type) // Ensure card has a type
    .map((card) => ({
      id: card.id,
      symbol: getSymbolForCurrency(card.type),
      iconSource: getIconForCurrency(card.type),
      name: card.type,
      balance: `${getCurrencySymbolForBalance(card.currency || card.type)}${
        card.balance || "0.00"
      }`,
      percentage: "0%", // Can be calculated based on performance data
      coinType: card.type,
    }));

  // Check account limits for currency accounts only
  const currencyAccounts = userCurrencyCards.filter((card) =>
    ["EUR", "USD", "GBP"].includes(card.coinType)
  );
  const hasEURAccount = currencyAccounts.some(
    (card) => card.coinType === "EUR"
  );
  const hasUSDAccount = currencyAccounts.some(
    (card) => card.coinType === "USD"
  );
  const maxCurrencyAccountsReached = hasEURAccount && hasUSDAccount;

  // Create "Add Account" card with proper state management
  const addAccountCard: CurrencyCardData = {
    id: "add-account",
    symbol: "🏦",
    iconSource: require("@/assets/Icons/Bank.png"),
    name: maxCurrencyAccountsReached
      ? "Account limit reached"
      : "Get an account",
    balance: "",
    percentage: "",
    coinType: "ADD_ACCOUNT",
    isAddAccount: true,
    isDisabled: maxCurrencyAccountsReached,
  };

  // Final cards array with clean separation of concerns
  const currencyCards: CurrencyCardData[] = [
    // 1. User's actual currency accounts (EUR, USD, etc.)
    ...userCurrencyCards,
    // 2. Add account option (conditionally disabled)
    addAccountCard,
  ];

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Force re-render when cards change
  const [, forceUpdate] = useState({});

  const loadTransactions = async (page = 1, replace = false) => {
    try {
      console.log(
        `🔍 Loading transactions - Page: ${page}, Replace: ${replace}`
      );
      setLoadingTransactions(true);

      const res = await getTransactions({ page, limit: 10 });
      console.log("📦 Transaction API Response:", res);

      // Expected API shape: { success, message, data: { transactions: [], pagination: { currentPage, totalPages, hasNextPage } } }
      const apiItems: any[] =
        res?.data?.transactions || res?.transactions || [];
      const pagination = res?.data?.pagination || res?.pagination || null;

      console.log(`📋 Received ${apiItems.length} transactions`, apiItems);
      console.log("📄 Pagination info:", pagination);

      // Map API items directly into state (we rely on their fields in render)
      if (replace) {
        setTransactions(apiItems);
        console.log("🔄 Replaced transactions with new data");
      } else {
        setTransactions((prev) => {
          const newTransactions =
            page === 1 ? apiItems : [...prev, ...apiItems];
          console.log(
            `📝 Updated transactions list (total: ${newTransactions.length})`
          );
          return newTransactions;
        });
      }

      // Pagination handling
      const hasNext = pagination
        ? !!pagination.hasNextPage
        : apiItems.length > 0 && apiItems.length >= 10;
      setHasMoreTransactions(hasNext);
      setTransactionsPage(page);

      console.log(`✅ Transaction loading complete - Has more: ${hasNext}`);
    } catch (err: any) {
      console.error("❌ Failed to load transactions:", err);
      console.error("Error details:", {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
      });

      // Show user-friendly error message
      if (err?.response?.status === 401) {
        console.log("🔐 Authentication error - user may need to login again");
      } else if (err?.message?.includes("Network Error")) {
        console.log("🌐 Network error - check backend connection");
      }
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    loadTransactions(1, true);
  }, []);

  // Pull-to-refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh transactions and other data
      await loadTransactions(1, true);
      console.log("🔄 Home page refreshed successfully");
    } catch (error) {
      console.error("❌ Error refreshing home page:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Refresh transactions when screen comes into focus (e.g., after completing a transaction)
  useFocusEffect(
    useCallback(() => {
      const handleFocus = async () => {
        // Check if a refresh was requested from a transaction screen
        const needsRefresh = await checkAndClearRefreshFlag();

        if (needsRefresh || transactions.length > 0) {
          console.log("🔄 Home screen focused - refreshing transactions");
          loadTransactions(1, true);
        }

        // Force re-render of currency cards to show new cards from context
        forceUpdate({});
      };

      handleFocus();
    }, [transactions.length, forceUpdate])
  );

  const renderCurrencyCard = ({ item }: { item: CurrencyCardData }) => {
    if (item.isAddAccount) {
      return (
        <AddAccountCard
          iconSource={item.iconSource}
          title={item.name}
          onPress={() => handleAddAccountPress(item.isDisabled)}
          isDisabled={item.isDisabled}
        />
      );
    }

    // If the card is a currency account (EUR, USD, GBP), pressing it navigates to DepositScreen
    const isCurrencyAccount = ["EUR", "USD", "GBP"].includes(item.coinType);
    return (
      <CurrencyCard
        symbol={item.symbol}
        iconSource={item.iconSource}
        name={item.name}
        balance={item.balance}
        percentage={item.percentage}
        onPress={
          isCurrencyAccount
            ? () => navigation.navigate("DepositScreen" as never)
            : () => handleCurrencyCardPress(item.coinType)
        }
      />
    );
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <ThemedText style={styles.transactionTitle}>
          {getTransactionTitle(item)}
        </ThemedText>
        <ThemedText style={styles.transactionSubtitle} numberOfLines={1}>
          #{item.reference ?? item._id}
          {item.cardInfo
            ? ` • ${item.cardInfo.cardName} • •••• ${item.cardInfo.lastFourDigits}`
            : ""}
        </ThemedText>
        <ThemedText style={styles.transactionDate}>
          {formatDate(item.createdAt)}
        </ThemedText>
      </View>
      <View style={styles.transactionRight}>
        <ThemedText
          style={[styles.transactionAmount, getAmountColor(item.type)]}
        >
          {formatAmountDisplay(item)}
        </ThemedText>
        <ThemedText
          style={[styles.transactionStatus, getStatusStyle(item.status)]}
        >
          {formatStatusLabel(item.status)}
        </ThemedText>
      </View>
    </View>
  );

  // Helpers
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const formatAmountDisplay = (tx: Transaction) => {
    const amount = tx.amount ?? 0;
    const currency = tx.currency ?? "";
    const isNegative = ["withdrawal", "payment", "fee"].includes(tx.type ?? "");
    const sign = isNegative ? "-" : "+";
    return `${sign}${amount.toFixed(2)} ${currency}`;
  };

  const getTransactionTitle = (tx: Transaction) => {
    if (tx.description) return tx.description;
    const titles: any = {
      payment: `Payment - ${tx.category || "General"}`,
      deposit: "Account Deposit",
      withdrawal: "Cash Withdrawal",
      transfer: "Money Transfer",
      refund: "Refund Received",
      fee: "Service Fee",
      interest: "Interest Earned",
      bonus: "Bonus Credit",
    };
    return titles[tx.type ?? ""] || "Transaction";
  };

  const getAmountColor = (type?: string) => {
    const isNegative = ["withdrawal", "payment", "fee"].includes(type ?? "");
    return isNegative
      ? styles.transactionAmountNegative
      : styles.transactionAmountPositive;
  };

  const formatStatusLabel = (status?: string) => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusStyle = (status?: string) => {
    if (!status) return {} as any;
    const s = status.toLowerCase();
    if (s === "failed" || s === "declined")
      return styles.transactionStatusDeclined;
    if (s === "completed" || s === "success")
      return styles.transactionStatusCompleted;
    if (s === "pending") return styles.transactionStatusPending;
    return {} as any;
  };

  return (
    <OnboardingBackground style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="#000000" />
      {/* Status bar background overlay */}
      <View style={[styles.statusBarBackground, { height: insets.top }]} />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingTop: insets.top - 10 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
            colors={["#3B82F6"]}
            progressBackgroundColor="#1F2937"
            title="Pull to refresh"
            titleColor="#FFFFFF"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <UserHeader
            greetingText={t("common.welcome")}
            useProfileImage={true}
            avatarSize={65}
            onProfilePress={handleProfilePress}
          />
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => navigation.navigate("Notifications")}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#FFFFFF"
              />
              <View style={styles.notificationBadge}>
                <ThemedText style={styles.notificationCount}>5</ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* Verification Banner */}
        {!profileComplete && (
          <VerificationBanner
            onVerifyPress={() => {
              // Navigate to Personal Information screen to start verification
              navigation.navigate("PersonalInformation");
            }}
          />
        )}

        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceAmountContainer}>
              {/* Balance amount with responsive font sizing and auto-fit to prevent cutoff */}
              <Text
                style={[
                  styles.balanceAmount,
                  {
                    fontSize: getBalanceFontSizeByLength(
                      `${currency}${currentBalance}`
                    ),
                  },
                ]}
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                minimumFontScale={0.6}
              >
                {currency}
                {currentBalance}
              </Text>
            </View>
            <ThemedText style={styles.balanceLabel}>
              Est. Total Value ({currencyName})
            </ThemedText>
            <View style={styles.balanceFooter}>
              <ThemedText style={styles.balanceSubtext}>
                Available Balance
              </ThemedText>
              <TouchableOpacity style={styles.eyeButton}>
                <Ionicons
                  name="eye-outline"
                  size={16}
                  color="rgba(255, 255, 255, 0.6)"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <ActionButton
            title={t("actions.deposit")}
            iconSource={require("@/assets/Icons/Deposit.png")}
            onPress={() => handleActionPress("deposit")}
          />
          <ActionButton
            title={t("actions.send")}
            iconSource={require("@/assets/Icons/Flesh.png")}
            onPress={() => handleActionPress("send")}
          />
          <ActionButton
            title={t("actions.more")}
            iconSource={require("@/assets/Icons/More.png")}
            onPress={() => handleActionPress("more")}
          />
        </View>

        {/* Currency Cards */}
        <FlatList
          data={currencyCards}
          renderItem={renderCurrencyCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.currencyCardsContainer}
          style={styles.currencyCardsList}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          snapToInterval={(screenWidth - 60) / 3 + 12} // Card width + separator
          decelerationRate="fast"
          bounces={false}
        />

        {/* Transactions Section */}
        <SectionContainer
          titleComponent={
            <View style={styles.transactionSectionTitle}>
              <ThemedText style={styles.transactionTitleText}>
                Transactions
              </ThemedText>
              <TouchableOpacity
                style={styles.transactionRefreshButton}
                onPress={() => loadTransactions(1, true)}
                disabled={loadingTransactions}
              >
                <Ionicons
                  name={loadingTransactions ? "refresh" : "refresh-outline"}
                  size={20}
                  color={loadingTransactions ? "#3B82F6" : "#FFFFFF"}
                  style={
                    loadingTransactions
                      ? { transform: [{ rotate: "180deg" }] }
                      : {}
                  }
                />
              </TouchableOpacity>
            </View>
          }
          containerStyle={styles.transactionsSection}
          contentStyle={styles.transactionsContainer}
        >
          {transactions.length === 0 && !loadingTransactions ? (
            <EmptyState message="Nothing Yet" />
          ) : (
            <FlatList
              data={transactions}
              renderItem={renderTransaction}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              refreshing={loadingTransactions}
              onRefresh={() => loadTransactions(1, true)}
              onEndReached={() => {
                if (!loadingTransactions && hasMoreTransactions) {
                  loadTransactions(transactionsPage + 1, false);
                }
              }}
              onEndReachedThreshold={0.5}
            />
          )}
        </SectionContainer>

        {/* Learn Section */}
        <SectionContainer title="Learn" titleOutside={true}>
          <ReferenceCard />
        </SectionContainer>

        {/* Analytics Section */}
        <SectionContainer title="Analytics" titleOutside={true}>
          <AnalyticsChart transactions={transactions} />
        </SectionContainer>

        {/* Unlock Discounts Section */}
        <SectionContainer title="Unlock discounts with..." titleOutside={true}>
          <DiscountsContent />
        </SectionContainer>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* More Options Modal */}
      <MoreOptionsModal
        visible={moreOptionsModalVisible}
        onClose={() => setMoreOptionsModalVisible(false)}
        options={homeMoreOptions}
        title="Quick Actions"
        subtitle="Choose an action to perform"
        headerIcon="ellipsis-horizontal"
        headerIconColor="#3B82F6"
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
    backgroundColor: "black",
    zIndex: 1000,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  greetingText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    position: "relative",
    marginRight: 16,
  },
  notificationBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCount: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 8,
  },
  balanceCard: {
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    minHeight: 180,
  },
  balanceAmountContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 12,
    minHeight: 70,
    maxHeight: 80,
  },
  balanceLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "500",
  },
  balanceAmount: {
    fontWeight: "500",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -1,
    includeFontPadding: false,
    textAlignVertical: "center",
    width: "100%",
    flexShrink: 1,
    overflow: "visible",
  },
  balanceFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 8,
  },
  balanceSubtext: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "400",
  },
  eyeButton: {
    padding: 8,
    borderRadius: 6,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
    marginBottom: 32,
  },
  actionButton: {
    alignItems: "center",
  },
  actionButtonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  currencyCardsList: {
    marginBottom: 32,
  },
  currencyCardsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  currencyCard: {
    width: (screenWidth - 60) / 3, // Responsive width: (screen width - padding) / 3 cards
    minWidth: 110, // Minimum width to prevent cards from being too small
    height: 120,
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 12,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  currencyCardGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: "rgba(59, 130, 246, 0.05)",
  },
  currencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  currencyIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  currencyIcon: {
    width: 24,
    height: 24,
  },
  currencyName: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    flex: 1,
  },
  currencyBalance: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 6,
  },
  currencyFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currencyPercentage: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
  percentageIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  transactionsSection: {
    flex: 1,
  },
  transactionsContainer: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 20,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  sectionTitleInside: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  transactionSectionTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  transactionTitleText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  transactionRefreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.03)",
  },
  transactionLeft: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    color: "#3B82F6",
    fontWeight: "500",
    marginBottom: 4,
  },
  transactionSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.4)",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "600",
    marginBottom: 4,
  },
  transactionAmountPositive: {
    color: "#28B083FF",
  },
  transactionAmountNegative: {
    color: "#EF4444",
  },
  transactionStatus: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  transactionStatusCompleted: {
    color: "#10B981",
  },
  transactionStatusPending: {
    color: "#F59E0B",
  },
  transactionStatusDeclined: {
    color: "#EF4444",
  },
  emptyTransactionsContainer: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
    flex: 1,
    padding: 20,
  },
  emptyTransactionState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTransactionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTransactionText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
    textAlign: "center",
  },
  emptyTransactionSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyStateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  additionalSection: {
    marginTop: 12,
    marginHorizontal: 20,
  },
  additionalSectionContainer: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    minHeight: 100,
  },
  emptyAdditionalState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 60,
  },
  emptyAdditionalText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
    textAlign: "center",
  },
  // Reference Card Styles
  referenceCard: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  referenceContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  referenceLeft: {
    flex: 1,
  },
  referenceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
    marginBottom: 8,
  },
  referenceDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  referenceRight: {
    marginLeft: 16,
  },
  referenceIllustration: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: 60,
    height: 50,
  },
  phoneIcon: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    padding: 6,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  phoneText: {
    fontSize: 18,
  },
  handIcon: {
    position: "absolute",
    right: -12,
    top: -5,
    zIndex: 1,
  },
  handText: {
    fontSize: 22,
  },
  referenceImage: {
    paddingRight: 12,
    width: 90,
    height: 90,
  },
  // Chart Styles
  chartContainer: {
    height: 180,
    flexDirection: "row",
    paddingVertical: 10,
  },
  yAxisLabels: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 12,
    width: 35,
    height: 140,
  },
  chartArea: {
    flex: 1,
  },
  chartGrid: {
    height: 140,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  gridLine: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    width: "100%",
  },
  chartEmptyState: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  chartEmptyText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "500",
  },
  xAxisLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  axisLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "400",
  },
  // Simplified Analytics Styles
  analyticsEmptyContainer: {
    height: 120,
    position: "relative",
  },
  analyticsEmptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  analyticsMonthLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  monthLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "400",
  },
  // Discounts Section Styles
  discountsContent: {
    paddingTop: 8,
  },
  discountsDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 16,
  },
  discountsFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  learnMoreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  learnMoreText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
    marginRight: 4,
  },
  progressIndicator: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
});

export default HomeScreen;
