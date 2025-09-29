import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { OnboardingBackground } from "../../components/UniversalBackground";
import { ThemedText } from "../../components/ThemedText";
import { RootStackParamList } from "../../types";
import { useUser } from "../../context/UserContext";

const AccountOpeningSuccessScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  // Show loading for 3 seconds, then show success
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleBack = (): void => {
    navigation.goBack();
  };

  const handleDepositNow = (): void => {
    // Navigate to main app
    navigation.reset({
      index: 0,
      routes: [{ name: "MainApp" }],
    });
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
        </View>

        {/* Main Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Clock Icon with Loading or Success */}
            <View style={styles.clockContainer}>
              <View style={styles.clockCircle}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#007AFF" />
                ) : (
                  <Ionicons name="checkmark" size={40} color="#007AFF" />
                )}
              </View>
            </View>

            {/* Title */}
            <ThemedText style={styles.title}>
              {isLoading ? "We check your information" : "Everything Is Done"}
            </ThemedText>
            
            {/* Subtitle */}
            <ThemedText style={styles.subtitle}>
              {isLoading 
                ? "The currency accounts will be available soon. We will inform you of their opening. Thank you for your patience!"
                : "Your currency account has been successfully created."
              }
            </ThemedText>

            {/* Information Box - Only show during loading */}
            {isLoading && (
              <View style={styles.infoBox}>
                <ThemedText style={styles.infoText}>
                  Meet the conditions below to avoid any delay, rejection or loss of funds.
                </ThemedText>
              </View>
            )}

            {/* Currency Information - Show during both loading and success */}
            <View style={styles.currencySection}>
              <ThemedText style={styles.currencyTitle}>Currency applied</ThemedText>
              <View style={styles.currencyItem}>
                <View style={styles.euroIcon}>
                  <ThemedText style={styles.euroSymbol}>€</ThemedText>
                </View>
                <ThemedText style={styles.currencyText}>EUR (Euro)</ThemedText>
              </View>
            </View>

            {/* User Details - Only show during loading */}
            {isLoading && (
              <View style={styles.detailsSection}>
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>First name</ThemedText>
                  <ThemedText style={styles.detailValue}>{user?.fullName?.split(' ')[0] || 'SAID SAADOULI'}</ThemedText>
                </View>
                
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Last name</ThemedText>
                  <ThemedText style={styles.detailValue}>{user?.fullName?.split(' ').slice(1).join(' ') || 'SAADOULI'}</ThemedText>
                </View>
                
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Address</ThemedText>
                  <ThemedText style={styles.detailValue}>{user?.streetAddress || 'sousse sahloul 34 sousse'}</ThemedText>
                </View>
                
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>City</ThemedText>
                  <ThemedText style={styles.detailValue}>{user?.city || 'sousse'}</ThemedText>
                </View>
                
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Province/State</ThemedText>
                  <ThemedText style={styles.detailValue}>{user?.province || 'sousse'}</ThemedText>
                </View>
                
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Postal code</ThemedText>
                  <ThemedText style={styles.detailValue}>{user?.postalCode || '4000'}</ThemedText>
                </View>
                
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Country/Region</ThemedText>
                  <View style={styles.countryContainer}>
                    <ThemedText style={styles.flagEmoji}>🇹🇳</ThemedText>
                    <ThemedText style={styles.detailValue}>TUN</ThemedText>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Continue Button - Only show after loading */}
        {!isLoading && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.depositButton}
              onPress={handleDepositNow}
              activeOpacity={0.8}
              accessibilityLabel="Deposit now"
              accessibilityRole="button"
            >
              <ThemedText style={styles.depositButtonText}>
                Deposit Now
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for button
  },
  clockContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  clockCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  infoBox: {
    backgroundColor: "rgba(100, 100, 100, 0.4)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
  },
  currencySection: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  currencyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  euroIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  euroSymbol: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  currencyText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  detailsSection: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  detailLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  detailValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  flagEmoji: {
    fontSize: 16,
    marginRight: 8,
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
  depositButton: {
    backgroundColor: "#007AFF",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.5)",
  },
  depositButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});

export default AccountOpeningSuccessScreen;