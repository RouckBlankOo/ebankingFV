export type RootStackParamList = {
  AccountOpeningSuccess: { currency?: { symbol: string; name: string; code: string; flag: string } };
  DepositScreen: undefined;
  AuthTester: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: { userId: string; isEmailMode: boolean; scheme?: string };
  Dashboard: undefined;
  OnBoardingScreen: undefined;
  Help: undefined;
  Settings: undefined;
  CodeConfirmation: { 
    contactInfo: string; 
    signupMode: "phone" | "email"; 
    userId?: string;
    token?: string;  // Add this
    email?: string;  // Add this
    tempUserData?: {
      email: string;
      phoneNumber: string;
      fullName: string;
      password: string;
      isPlaceholder?: boolean;
    };
  };
  SetPassword: { contactInfo: string; signupMode: "phone" | "email"; userId?: string };
  VerifyPhone: { phoneNumber?: string };
  MainApp: undefined;
  PersonalInformation: undefined;
  AddressInformation: undefined;
  IdentityVerification: undefined;
  DocumentUpload: undefined;
  SecurityVerification: { actionName?: string };
  SelectCurrency: { purpose?: "deposit" | "settings" };
  SelectLanguage: undefined;
  SelectMethod: { currency: { symbol: string; name: string; icon?: any } };
  Deposit: { currency: { symbol: string; name: string; icon?: any } };
  BankTransfer: { currency: { symbol: string; name: string; icon?: any } };
  BankTransferDetails: { amount: string; currency: string; usdcAmount: string };
  BinancePay: { currency: { symbol: string; name: string; icon?: any } };
  Withdraw: undefined;
  Send: undefined;
  TransferAmount: { recipientType: "phone" | "email" | "uid"; recipientValue: string };
  CardTypes: undefined;
  ChooseCard: { cardType: "virtual" | "premium" };
  CardCustomization: { cardType: "virtual" | "premium" };
  ProfileScreen: undefined;
  Security: undefined;
  Devices: undefined;
  ChangePassword: undefined;
  ChangeEmail: undefined;
EmailVerification: { newEmail?: string | null; oldEmail: string; phoneNumber: string };
  AccountCreationSuccess: { 
    country?: 'Tunisia' | 'USA' | 'UK' | 'UAE'; 
    email?: string; 
    signupMethod?: 'email' | 'country';
  };
  // Notification screens
  Notifications: undefined;
  AnnouncesScreen: undefined;
  TransactionsNotificationsScreen: undefined;
  LowBalanceScreen: undefined;
  SystemNotificationsScreen: undefined;
  QuickActionScreen: undefined;
  InviteFriendsScreen: undefined;
  Convert: undefined;
  CoinWalletScreen: { coinType: string };
  AccountOpeningConditions: { currency?: { symbol: string; name: string; code: string; flag: string } };
  AccountDetails: { currency?: { symbol: string; name: string; code: string; flag: string } };
  EditAccountDetails: undefined;
  CurrencySelection: undefined;
};