import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../../components/Text";
import { OnboardingBackground } from "../../components/UniversalBackground";
import { useLanguage } from "../../context/LanguageContext";
import { RootStackParamList } from "../../types";

interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  icon: any;
}

export default function SelectLanguageScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { availableLanguages, setSelectedLanguage, selectedLanguage, t } =
    useLanguage();

  const handleLanguageSelect = async (language: Language) => {
    console.log("Language changed to:", language.code);
    await setSelectedLanguage(language);
    navigation.goBack(); // Go back to settings
  };

  const renderLanguageItem = (language: Language) => {
    const isSelected = selectedLanguage.code === language.code;

    return (
      <TouchableOpacity
        key={language.id}
        style={[styles.languageItem, isSelected && styles.selectedLanguageItem]}
        onPress={() => handleLanguageSelect(language)}
        activeOpacity={0.8}
      >
        <View style={styles.languageLeft}>
          <View style={styles.languageIconContainer}>
            <Text style={styles.flagEmoji}>{language.flag}</Text>
          </View>
          <View style={styles.languageInfo}>
            <Text style={styles.languageName}>{language.name}</Text>
            <Text style={styles.languageNativeName}>{language.nativeName}</Text>
          </View>
        </View>
        <View style={styles.languageRight}>
          <Text style={styles.languageCode}>{language.code.toUpperCase()}</Text>
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
          <Text style={styles.headerTitle}>{t("language.selectLanguage")}</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Language List */}
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {availableLanguages.map((language) => renderLanguageItem(language))}
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
    paddingVertical: 20,
    marginBottom: 20,
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
  headerRight: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  languageItem: {
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
  selectedLanguageItem: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  languageLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  languageIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  flagEmoji: {
    fontSize: 24,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  languageNativeName: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  languageRight: {
    alignItems: "flex-end",
  },
  languageCode: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 4,
  },
});
