import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  NavigationProp,
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import { OnboardingBackground } from "../../components/UniversalBackground";
import Text from "../../components/Text";
import { RootStackParamList } from "../../types";

type AccountActionsScreenRouteProp = RouteProp<
  RootStackParamList,
  "AccountActions"
>;

export default function AccountActionsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<AccountActionsScreenRouteProp>();
  const { currency } = route.params;

  // Handle back button press
  const handleBack = () => {
    navigation.goBack();
  };

  // Define actions for the account
  const actions = [
    {
      id: "deposit",
      title: "Deposit",
      icon: require("@/assets/Icons/Quick Actions/depositMoney.png"),
      onPress: () => {
        if (currency === "EUR") {
          navigation.navigate("EURDeposit");
        } else {
          // For USD or other currencies, navigate to general deposit
          navigation.navigate("DepositScreen");
        }
      },
    },
    {
      id: "convert",
      title: "Convert",
      icon: require("@/assets/Icons/Quick Actions/convertMoney.png"),
      onPress: () => {
        navigation.navigate("Convert");
      },
    },
  ];

  // Render action item
  const renderActionItem = (item: typeof actions[0]) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.actionItem}
        onPress={item.onPress}
      >
        <View style={styles.actionIconContainer}>
          <Image
            source={item.icon}
            style={styles.actionIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.actionTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <OnboardingBackground style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="#000000" />
      <View style={[styles.statusBarBackground, { height: insets.top }]} />

      <View style={[styles.content, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{currency} Account Actions</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Actions List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.actionsContainer}>
            {actions.map((action) => renderActionItem(action))}
          </View>
        </ScrollView>
      </View>
    </OnboardingBackground>
  );
}

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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginHorizontal: -8,
  },
  actionItem: {
    width: "45%",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  actionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(21, 25, 32, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
  },
  actionTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "500",
  },
});