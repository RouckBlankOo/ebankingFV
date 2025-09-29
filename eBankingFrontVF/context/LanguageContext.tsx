import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import "../i18n"; // Import i18n configuration

export interface LanguageData {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  icon: any;
}

interface LanguageContextType {
  selectedLanguage: LanguageData;
  setSelectedLanguage: (language: LanguageData) => void;
  availableLanguages: LanguageData[];
  t: (key: string, fallback?: string) => string;
  loading: boolean;
}

const defaultLanguages: LanguageData[] = [
  {
    id: "en",
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    icon: require("../assets/Icons/language.png"),
  },
  {
    id: "fr",
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    icon: require("../assets/Icons/language.png"),
  },
  {
    id: "ar",
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇹🇳",
    icon: require("../assets/Icons/language.png"),
  },
  {
    id: "es",
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    icon: require("../assets/Icons/language.png"),
  },
  {
    id: "de",
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    icon: require("../assets/Icons/language.png"),
  },
  {
    id: "zh",
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    icon: require("../assets/Icons/language.png"),
  },
  {
    id: "ja",
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    icon: require("../assets/Icons/language.png"),
  },
];

// Basic translations (can be expanded)
const translations: Record<string, Record<string, string>> = {
  en: {
    // Common
    welcome: "Welcome",
    home: "Home",
    settings: "Settings",
    profile: "Profile",
    security: "Security",
    language: "Language",
    currency: "Currency",
    notifications: "Notifications",
    logout: "Logout",
    save: "Save",
    cancel: "Cancel",
    continue: "Continue",
    back: "Back",

    // Banking
    balance: "Balance",
    total_value: "Est. Total Value",
    available_balance: "Available Balance",
    transactions: "Transactions",
    transfer: "Transfer",
    deposit: "Deposit",
    withdraw: "Withdraw",

    // Auth
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    forgot_password: "Forgot Password",
  },
  fr: {
    // Common
    welcome: "Bienvenue",
    home: "Accueil",
    settings: "Paramètres",
    profile: "Profil",
    security: "Sécurité",
    language: "Langue",
    currency: "Devise",
    notifications: "Notifications",
    logout: "Déconnexion",
    save: "Enregistrer",
    cancel: "Annuler",
    continue: "Continuer",
    back: "Retour",

    // Banking
    balance: "Solde",
    total_value: "Valeur totale est.",
    available_balance: "Solde disponible",
    transactions: "Transactions",
    transfer: "Virement",
    deposit: "Dépôt",
    withdraw: "Retrait",

    // Auth
    login: "Connexion",
    signup: "S'inscrire",
    email: "E-mail",
    password: "Mot de passe",
    forgot_password: "Mot de passe oublié",
  },
  ar: {
    // Common
    welcome: "مرحباً",
    home: "الرئيسية",
    settings: "الإعدادات",
    profile: "الملف الشخصي",
    security: "الأمان",
    language: "اللغة",
    currency: "العملة",
    notifications: "الإشعارات",
    logout: "تسجيل الخروج",
    save: "حفظ",
    cancel: "إلغاء",
    continue: "متابعة",
    back: "رجوع",

    // Banking
    balance: "الرصيد",
    total_value: "إجمالي القيمة المقدرة",
    available_balance: "الرصيد المتاح",
    transactions: "المعاملات",
    transfer: "تحويل",
    deposit: "إيداع",
    withdraw: "سحب",

    // Auth
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    forgot_password: "نسيت كلمة المرور",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedLanguage, setSelectedLanguageState] = useState<LanguageData>(
    defaultLanguages[0]
  );
  const [loading, setLoading] = useState(true);
  const { i18n, t: i18nT } = useTranslation();

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguageId = await AsyncStorage.getItem("selectedLanguage");
      if (savedLanguageId) {
        const language = defaultLanguages.find((l) => l.id === savedLanguageId);
        if (language) {
          setSelectedLanguageState(language);
          // Change i18next language
          i18n.changeLanguage(language.code);
        }
      }
    } catch (error) {
      console.error("Failed to load saved language:", error);
    } finally {
      setLoading(false);
    }
  };

  const setSelectedLanguage = async (language: LanguageData) => {
    try {
      setSelectedLanguageState(language);
      await AsyncStorage.setItem("selectedLanguage", language.id);
      // Change i18next language
      i18n.changeLanguage(language.code);
      console.log("Language changed to:", language.code);
    } catch (error) {
      console.error("Failed to save language:", error);
    }
  };

  // Use i18next translation function
  const t = (key: string, fallback?: string): string => {
    return i18nT(key) || fallback || key;
  };

  const value: LanguageContextType = {
    selectedLanguage,
    setSelectedLanguage,
    availableLanguages: defaultLanguages,
    t,
    loading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
