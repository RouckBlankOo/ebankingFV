import React, { createContext, ReactNode, useContext, useState } from "react";

export interface Card {
  id: string;
  type: string;
  name?: string;
  balance: string;
  cardNumber: string;
  gradient: string[];
  isFrozen?: boolean;
  isInfoHidden?: boolean;
  limit?: number;
  cardType?: "virtual" | "premium";
  pattern?: number;
  currency?: string;
}

interface User {
  fullName: string;
  email: string;
  phone: string;
  isAuthenticated: boolean;
  // Address information
  streetAddress?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  profileCompletionStatus: {
    personalInformation: boolean;
    addressInformation: boolean;
    identityVerification: boolean;
  };
}

interface UserContextType {
  user: User | null;
  cards: Card[];
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  updateProfileStatus: (
    step: keyof User["profileCompletionStatus"],
    completed: boolean
  ) => void;
  isProfileComplete: () => boolean;
  addCard: (card: Omit<Card, "id">) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [cards, setCards] = useState<Card[]>([
    // Initial crypto wallets available to all users
    {
      id: "usdc-wallet",
      type: "USDC",
      balance: "114.71",
      cardNumber: "•••• •••• •••• " + Math.floor(1000 + Math.random() * 9000),
      gradient: ["#2775CA", "#1E5F99"], // Blue gradient for USDC
      isFrozen: false,
      isInfoHidden: false,
      limit: 50000,
    },
    {
      id: "btc-wallet",
      type: "BTC",
      balance: "0",
      cardNumber: "•••• •••• •••• " + Math.floor(1000 + Math.random() * 9000),
      gradient: ["#F7931A", "#E87E04"], // Orange gradient for BTC
      isFrozen: false,
      isInfoHidden: false,
      limit: 10,
    },
    {
      id: "eth-wallet",
      type: "ETH",
      balance: "0.0876",
      cardNumber: "•••• •••• •••• " + Math.floor(1000 + Math.random() * 9000),
      gradient: ["#627EEA", "#4C6EDB"], // Purple gradient for ETH
      isFrozen: false,
      isInfoHidden: false,
      limit: 100,
    },
  ]);

  const setUser = (userData: User | null) => {
    setUserState(userData);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUserState({ ...user, ...updates });
    }
  };

  const updateProfileStatus = (
    step: keyof User["profileCompletionStatus"],
    completed: boolean
  ) => {
    if (user) {
      setUserState({
        ...user,
        profileCompletionStatus: {
          ...user.profileCompletionStatus,
          [step]: completed,
        },
      });
    }
  };

  const isProfileComplete = () => {
    if (!user) return false;
    const { personalInformation, addressInformation, identityVerification } =
      user.profileCompletionStatus;
    return personalInformation && addressInformation && identityVerification;
  };

  const addCard = (cardData: Omit<Card, "id">) => {
    // Check if a card with the same type already exists
    const existingCard = cards.find((card) => card.type === cardData.type);
    if (existingCard) {
      console.warn(
        `Card with type ${cardData.type} already exists. Cannot add duplicate.`
      );
      return; // Do not add the card
    }

    const newCard: Card = {
      ...cardData,
      id: Date.now().toString(),
    };
    setCards((prevCards) => [...prevCards, newCard]);
  };

  const updateCard = (cardId: string, updates: Partial<Card>) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, ...updates } : card
      )
    );
  };

  const deleteCard = (cardId: string) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
  };

  const logout = () => {
    setUserState(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        cards,
        setUser,
        updateUser,
        updateProfileStatus,
        isProfileComplete,
        addCard,
        updateCard,
        deleteCard,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
