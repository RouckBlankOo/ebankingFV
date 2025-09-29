import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { OnboardingBackground } from "../components/UniversalBackground";
import { RootStackParamList } from "../types";

const EURBankTransferScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [firstName, setFirstName] = useState("SAID SAADOULI");

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSendInfo = () => {
    // Send info to email
    console.log("Send info to email");
    // Navigate back to home after sending info
    navigation.reset({
      index: 0,
      routes: [{ name: "MainApp" }],
    });
  };

  return (
    <OnboardingBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>EUR Bank Transfer</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Deposit Information */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Deposit Information</Text>

            <View style={styles.infoItem}>
              <View style={styles.bullet} />
              <Text style={styles.infoText}>
                Minimum deposit of at least $50 USD
              </Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.bullet} />
              <Text style={styles.infoText}>
                Maximum deposit of $1,000,000 USD at a time
              </Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.bullet} />
              <Text style={styles.infoText}>
                Deposits are usually credited in 1-5 business days
              </Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.bullet} />
              <Text style={styles.infoText}>
                We charge zero deposit fee. Substantial fees may be applied by
                your bank, please check prior to sending
              </Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.bullet} />
              <Text style={styles.infoText}>
                To learn more, visit our Help Center
              </Text>
            </View>
          </View>

          {/* Important Notes */}
          <View style={styles.notesSection}>
            <View style={styles.noteItem}>
              <Ionicons name="information-circle" size={20} color="#007AFF" />
              <Text style={styles.noteText}>
                The name on your bank account must match the name on your
                Cryptopont account
              </Text>
            </View>

            <View style={styles.noteItem}>
              <Ionicons name="information-circle" size={20} color="#007AFF" />
              <Text style={styles.noteText}>
                Deposit USD only. Non-USD deposits will be converted to USD at
                prevalent conversion rates.
              </Text>
            </View>
          </View>

          {/* Important Disclaimer */}
          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>
              Use the provided bank account details for sending any fund
              transfer funds using www.thingpoi.com/deposit
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>First name</Text>
              <TextInput
                style={styles.textInput}
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>IBAN</Text>
              <View style={styles.fieldValue}>
                <Text style={styles.fieldValueText}>
                  DE68 2022 0800 0040 3720 92
                </Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Bank Name</Text>
              <View style={styles.fieldValue}>
                <Text style={styles.fieldValueText}>
                  Standard Chartered Bank UAE
                </Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Bank Account Holder Name</Text>
              <View style={styles.fieldValue}>
                <Text style={styles.fieldValueText}>
                  Foris Dax Middle East FZE
                </Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Bank Address</Text>
              <View style={styles.fieldValue}>
                <Text style={styles.fieldValueText}>
                  Emaar Business Park, Building 3, Opposite Dubai Internet City
                  (DIC), P.O Box 193669, Dubai, UAE
                </Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Recipient Address</Text>
              <View style={styles.fieldValue}>
                <Text style={styles.fieldValueText}>
                  The Offices 4, 5th Floor, One Central, Dubai World Trade
                  Centre, PO Box 453116, Dubai, United Arab Emirates
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Send Info Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendInfo}>
            <Text style={styles.sendButtonText}>Send Info To Email</Text>
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
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.3)",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
    marginTop: 8,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
  },
  notesSection: {
    marginBottom: 20,
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.2)",
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 12,
    lineHeight: 20,
  },
  disclaimerBox: {
    backgroundColor: "rgba(0, 122, 255, 0.15)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  disclaimerText: {
    fontSize: 14,
    color: "#007AFF",
    textAlign: "center",
    lineHeight: 20,
  },
  formSection: {
    marginBottom: 100,
  },
  formGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  fieldValue: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  fieldValueText: {
    fontSize: 14,
    color: "#FFFFFF",
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
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EURBankTransferScreen;
