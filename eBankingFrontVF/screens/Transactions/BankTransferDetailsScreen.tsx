import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../../components/Text";
import { OnboardingBackground } from "../../components/UniversalBackground";
import UniversalList, { ListItem } from "../../components/UniversalList";
import { useAlert } from "../../context/AlertContext";
import { RootStackParamList } from "../../types";
import {
  createBankTransfer,
  BankTransferData,
} from "../../services/bankTransfer";
import { markHomeForRefresh } from "../../utils/refreshUtils";

export default function BankTransferDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { showSuccess } = useAlert();

  // Get the amount and currency from navigation params
  const params = route.params as any;
  const amount = params?.amount || "100";
  const currency = params?.currency || "TND";
  const usdcAmount = params?.usdcAmount || "28.57";

  const [ribNumber, setRibNumber] = useState("000****0000");
  const [selectedBank, setSelectedBank] = useState("Biat");
  const [showBankModal, setShowBankModal] = useState(false);
  const [conditionText, setConditionText] = useState(
    "Lorem ipsum is simply dummy text of the printing and typesetting industry."
  );
  const [note, setNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // List of Tunisian banks
  const banks = [
    { id: 1, name: "Biat", fullName: "Banque Internationale Arabe de Tunisie" },
    { id: 2, name: "BFPME", fullName: "Banque de Financement des PME" },
    { id: 3, name: "BNA", fullName: "Banque Nationale Agricole" },
    { id: 4, name: "BH Bank", fullName: "Banque de l'Habitat" },
    { id: 5, name: "STB", fullName: "Société Tunisienne de Banque" },
    { id: 6, name: "UIB", fullName: "Union Internationale de Banques" },
    {
      id: 7,
      name: "UBCI",
      fullName: "Union Bancaire pour le Commerce et l'Industrie",
    },
    { id: 8, name: "ATB", fullName: "Arab Tunisian Bank" },
    { id: 9, name: "Amen Bank", fullName: "Amen Bank" },
    { id: 10, name: "ABC Bank", fullName: "Arab Banking Corporation" },
    { id: 11, name: "Attijari Bank", fullName: "Attijari Bank Tunisia" },
    { id: 12, name: "Zitouna Bank", fullName: "Zitouna Bank" },
  ];

  // Convert banks to list items for UniversalList
  const bankListItems: ListItem[] = banks.map((bank) => ({
    id: bank.id.toString(),
    title: bank.name,
    subtitle: bank.fullName,
    icon: "business",
    onPress: () => handleBankSelect(bank.name),
    selected: selectedBank === bank.name,
  }));

  const handleSave = async () => {
    try {
      setIsProcessing(true);

      // Validate required fields
      if (!ribNumber || ribNumber === "000****0000") {
        showSuccess(
          "Missing Information",
          "Please enter a valid RIB number",
          3000
        );
        return;
      }

      // Convert TND to USD (using a rough conversion rate)
      const amountInUSD = parseFloat(amount) * 0.32; // 1 TND ≈ 0.32 USD

      // Prepare bank transfer data
      const transferData: BankTransferData = {
        amount: amountInUSD,
        currency: "USD",
        recipientName: "Self Transfer", // You can add a field to collect recipient name
        recipientAccountNumber: ribNumber,
        bankName: selectedBank,
        ribNumber: ribNumber,
        description: `Bank transfer from ${selectedBank} - ${amount} ${currency}`,
        note: note,
      };

      console.log("Creating bank transfer with data:", transferData);

      const response = await createBankTransfer(transferData);

      if (response.success) {
        // Mark home screen for refresh
        await markHomeForRefresh();

        showSuccess(
          "Transfer Successful!",
          `$${amountInUSD.toFixed(
            2
          )} USD transfer created successfully via ${selectedBank}`,
          4000
        );

        // Navigate back to dashboard to see the updated balance
        navigation.navigate("Dashboard");
      } else {
        throw new Error(response.message || "Failed to process bank transfer");
      }
    } catch (error) {
      console.error("Bank transfer error:", error);
      showSuccess(
        "Transfer Failed",
        error instanceof Error
          ? error.message
          : "Failed to process bank transfer. Please try again.",
        4000
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBankSelect = (bankName: string) => {
    setSelectedBank(bankName);
    setShowBankModal(false);
  };

  const handleAddPhoto = () => {
    // TODO: Implement photo picker
    console.log("Add photo functionality");
  };

  return (
    <OnboardingBackground style={styles.container}>
      <ScrollView
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bank transfer</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Amount Section */}
        <View style={styles.amountSection}>
          <Text style={styles.amountValue}>
            {amount} {currency}
          </Text>
          <Text style={styles.usdcEquivalent}>≈ {usdcAmount} USDC</Text>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle" size={16} color="#3B82F6" />
            <Text style={styles.infoText}>
              Lorem ipsum is simply dummy text of the printing and typesetting
              industry.
            </Text>
          </View>
        </View>

        {/* RIB Section */}
        <View style={styles.section}>
          <View style={styles.ribContainer}>
            <View style={styles.ribHeader}>
              <Text style={styles.sectionTitle}>RIB</Text>
              <TouchableOpacity
                style={styles.bankInfo}
                onPress={() => setShowBankModal(true)}
              >
                <View style={styles.bankIcon}></View>
                <Text style={styles.bankName}>{selectedBank}</Text>
                <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.ribInput}
              value={ribNumber}
              onChangeText={setRibNumber}
              placeholder="000****0000"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>
        </View>

        {/* Condition Section */}
        <View style={styles.section}>
          <View style={styles.conditionContainer}>
            <Text style={styles.sectionTitle}>Condition</Text>
            <TextInput
              style={styles.conditionInput}
              value={conditionText}
              onChangeText={setConditionText}
              multiline={true}
              numberOfLines={3}
              placeholder="Enter conditions"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>
        </View>

        {/* Add Photo Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.addPhotoContainer}
            onPress={handleAddPhoto}
          >
            <View style={styles.addPhotoButton}>
              <Image
                source={require("../../assets/Icons/Camera.png")}
                style={styles.addPhotoIcon}
              />
            </View>
            <Text style={styles.addPhotoText}>Add Photo</Text>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={16} color="#3B82F6" />
              <Text style={styles.infoText}>
                Lorem ipsum is simply dummy text of the printing and typesetting
                industry.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Note Section */}
        <View style={styles.section}>
          <View style={styles.noteContainer}>
            <Text style={styles.sectionTitle}>Note</Text>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Add note"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>
        </View>

        {/* Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, isProcessing && styles.saveButtonDisabled]}
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={isProcessing}
        >
          <Text style={styles.saveButtonText}>
            {isProcessing ? "Processing Transfer..." : "Create Bank Transfer"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bank Selection Modal */}
      <Modal
        visible={showBankModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBankModal(false)}
      >
        <BlurView intensity={20} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Bank</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowBankModal(false)}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <UniversalList
              items={bankListItems}
              containerStyle={styles.bankList}
            />
          </View>
        </BlurView>
      </Modal>
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
    paddingVertical: 12,
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
  amountSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    textAlign: "center",
  },
  usdcEquivalent: {
    fontSize: 16,
    color: "#888888",
    marginBottom: 12,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
    marginBottom: 12,
  },
  ribContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
  },
  ribHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  ribInput: {
    fontSize: 16,
    color: "#FFFFFF",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  bankSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  bankInfo: {
    width: "40%",
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  bankIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  bankIconText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  bankName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 8,
  },
  conditionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
  },
  conditionInput: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlignVertical: "top",
    minHeight: 60,
  },
  addPhotoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  addPhotoButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderStyle: "dashed",
  },
  addPhotoIcon: {
    width: 20,
    height: 20,
    tintColor: "#3B82F6",
  },
  addPhotoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  noteContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
  },
  noteInput: {
    fontSize: 14,
    color: "#FFFFFF",
    paddingVertical: 8,
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    paddingBottom: 50,
    backgroundColor: "transparent",
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "rgba(59, 130, 246, 0.5)",
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },
  bankList: {
    padding: 20,
  },
  bankItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedBankItem: {
    borderColor: "#3B82F6",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  bankItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bankItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  bankItemIcon: {
    width: 24,
    height: 24,
    tintColor: "#3B82F6",
  },
  bankItemInfo: {
    flex: 1,
  },
  bankItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  bankItemFullName: {
    fontSize: 14,
    color: "#888888",
  },
});
