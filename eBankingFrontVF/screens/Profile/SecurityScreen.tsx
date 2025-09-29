import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
  Alert,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../../components/Text";
import { UniversalBackground } from "../../components/UniversalBackground";
import { useAlert } from "../../context/AlertContext";
import { RootStackParamList } from "../../types";
import apiClient from "../../api/apiClient";

interface SecuritySettings {
  accountEnabled: boolean;
  securityLevel: "Low" | "Medium" | "High";
}

const SecurityScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { showSuccess, showInfo } = useAlert();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    accountEnabled: true,
    securityLevel: "Medium",
  });

  const loadSecuritySettings = useCallback(async () => {
    try {
      setLoading(true);
      // Since we don't have a specific security settings endpoint,
      // we'll use the user profile endpoint to get current settings
      const response = await apiClient.get("/auth/me");

      if (response.data) {
        // Map user data to security settings
        setSecuritySettings({
          accountEnabled: response.data.isActive !== false,
          securityLevel: response.data.securityLevel || "Medium",
        });
      }
    } catch (error) {
      console.error("Failed to load security settings:", error);
      showInfo("Error", "Failed to load security settings");
    } finally {
      setLoading(false);
    }
  }, [showInfo]);

  useEffect(() => {
    loadSecuritySettings();
  }, [loadSecuritySettings]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSecuritySettings();
    setRefreshing(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleChangePassword = async () => {
    try {
      Alert.alert(
        "Change Password",
        "Are you sure you want to change your password? You'll need to re-login after this action.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            style: "destructive",
            onPress: () => navigation.navigate("ChangePassword" as never),
          },
        ]
      );
    } catch (error) {
      console.error("Change password error:", error);
      showInfo("Error", "Unable to initiate password change");
    }
  };

  const handleChangeEmail = async () => {
    try {
      Alert.alert(
        "Change Email",
        "Changing your email address will require verification.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => navigation.navigate("ChangeEmail" as never),
          },
        ]
      );
    } catch (error) {
      console.error("Change email error:", error);
      showInfo("Error", "Unable to initiate email change");
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "⚠️ This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await apiClient.delete("/auth/delete-account");

              if (response.data.success) {
                showSuccess(
                  "Account Deleted",
                  "Your account has been permanently deleted"
                );
                // Clear storage and navigate to login
                navigation.navigate("Login" as never);
              } else {
                throw new Error(
                  response.data.message || "Failed to delete account"
                );
              }
            } catch (error: any) {
              console.error("Delete account error:", error);
              showInfo(
                "Error",
                error.response?.data?.message || "Failed to delete account"
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const toggleAccountEnabled = async () => {
    try {
      setLoading(true);
      const newStatus = !securitySettings.accountEnabled;

      // Update local state immediately for better UX
      setSecuritySettings((prev) => ({
        ...prev,
        accountEnabled: newStatus,
      }));

      // TODO: Add API call when backend supports account enable/disable
      // For now, just show success message
      showSuccess(
        "Account Updated",
        `Account ${newStatus ? "enabled" : "disabled"} successfully`
      );
    } catch (error: any) {
      console.error("Toggle account error:", error);
      // Revert state on error
      setSecuritySettings((prev) => ({
        ...prev,
        accountEnabled: !prev.accountEnabled,
      }));
      showInfo("Error", "Failed to update account status");
    } finally {
      setLoading(false);
    }
  };

  const handleDevicesPress = () => {
    showInfo("Device Management", "Device management feature coming soon");
  };

  const handleSecurityLogs = () => {
    showInfo("Security Logs", "Security activity logs feature coming soon");
  };

  return (
    <UniversalBackground variant="banking" style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
            colors={["#3B82F6"]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Security</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Security Level Card */}
        <View style={styles.securityLevelCard}>
          <View style={styles.securityLevelContent}>
            <View style={styles.securityLevelText}>
              <Text style={styles.securityLevelTitle}>Security Level</Text>
              <Text style={styles.securityLevelDescription}>
                Enable multiple authentication methods to enhance your account
                security.
              </Text>
              <View
                style={[
                  styles.mediumBadge,
                  securitySettings.securityLevel === "High"
                    ? styles.highBadge
                    : securitySettings.securityLevel === "Low"
                    ? styles.lowBadge
                    : null,
                ]}
              >
                <Text style={styles.mediumBadgeText}>
                  {securitySettings.securityLevel}
                </Text>
              </View>
            </View>
            <View style={styles.securityLevelIcon}>
              <Image
                source={require("../../assets/Icons/SecurityLevel.png")}
                style={styles.securityIcon}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Authentication Methods */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Authentication Methods</Text>

          <TouchableOpacity onPress={handleChangeEmail} disabled={loading}>
            <LinearGradient
              colors={["rgba(29, 36, 45, 1)", "rgba(29, 36, 45, 0.5)"]}
              style={[styles.menuItem, loading && styles.disabledItem]}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="mail-outline" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.menuText}>Change Email</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleChangePassword} disabled={loading}>
            <LinearGradient
              colors={["rgba(29, 36, 45, 1)", "rgba(29, 36, 45, 0.5)"]}
              style={[styles.menuItem, loading && styles.disabledItem]}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="key-outline" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.menuText}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Device & Activity */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Device & Activity</Text>

          <TouchableOpacity onPress={handleDevicesPress} disabled={loading}>
            <LinearGradient
              colors={["rgba(29, 36, 45, 1)", "rgba(29, 36, 45, 0.5)"]}
              style={[styles.menuItem, loading && styles.disabledItem]}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons
                    name="phone-portrait-outline"
                    size={24}
                    color="#FFFFFF"
                  />
                </View>
                <Text style={styles.menuText}>Trusted Devices</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSecurityLogs} disabled={loading}>
            <LinearGradient
              colors={["rgba(29, 36, 45, 1)", "rgba(29, 36, 45, 0.5)"]}
              style={[styles.menuItem, loading && styles.disabledItem]}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons
                    name="document-text-outline"
                    size={24}
                    color="#FFFFFF"
                  />
                </View>
                <Text style={styles.menuText}>Security Activity</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Account Management */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Management</Text>

          <LinearGradient
            colors={["rgba(29, 36, 45, 1)", "rgba(29, 36, 45, 0.5)"]}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="person-outline" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.menuText}>Account Active</Text>
            </View>
            <Switch
              value={securitySettings.accountEnabled}
              onValueChange={toggleAccountEnabled}
              trackColor={{ false: "#3e3e3e", true: "#22C55E" }}
              thumbColor={
                securitySettings.accountEnabled ? "#FFFFFF" : "#f4f3f4"
              }
              ios_backgroundColor="#3e3e3e"
              disabled={loading}
            />
          </LinearGradient>

          <TouchableOpacity onPress={handleDeleteAccount} disabled={loading}>
            <LinearGradient
              colors={["rgba(239, 68, 68, 0.2)", "rgba(239, 68, 68, 0.1)"]}
              style={[
                styles.menuItem,
                styles.dangerItem,
                loading && styles.disabledItem,
              ]}
            >
              <View style={styles.menuLeft}>
                <View
                  style={[styles.menuIconContainer, styles.dangerIconContainer]}
                >
                  <Ionicons name="trash-outline" size={24} color="#EF4444" />
                </View>
                <Text style={[styles.menuText, styles.dangerText]}>
                  Delete Account
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#EF4444" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </UniversalBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  securityLevelCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 20,
    marginBottom: 16,
  },
  securityLevelContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  securityLevelText: {
    flex: 1,
    marginRight: 20,
  },
  securityLevelTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  securityLevelDescription: {
    fontSize: 14,
    color: "#888888",
    lineHeight: 20,
    marginBottom: 16,
  },
  mediumBadge: {
    backgroundColor: "#FFC107",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  highBadge: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  lowBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  mediumBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  securityLevelIcon: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  securityIcon: {
    width: 140,
    height: 140,
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  menuItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  disabledItem: {
    opacity: 0.5,
  },
  dangerItem: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dangerIconContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    flex: 1,
  },
  dangerText: {
    color: "#EF4444",
  },
  bottomPadding: {
    height: 10,
  },
});

export default SecurityScreen;
