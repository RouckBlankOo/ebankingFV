import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";

interface AddAccountCardProps {
  iconSource: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  isDisabled?: boolean;
}

export const AddAccountCard: React.FC<AddAccountCardProps> = ({
  iconSource,
  title,
  onPress,
  isDisabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isDisabled && styles.disabledContainer]}
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
    >
      <View style={styles.glow} />
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            isDisabled && styles.disabledIconContainer,
          ]}
        >
          <Image
            source={iconSource}
            style={[styles.icon, isDisabled && styles.disabledIcon]}
            resizeMode="contain"
          />
        </View>
        <ThemedText
          style={[styles.title, isDisabled && styles.disabledTitle]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </ThemedText>
        <View style={styles.arrowContainer}>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={
              isDisabled
                ? "rgba(255, 255, 255, 0.3)"
                : "rgba(255, 255, 255, 0.6)"
            }
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 110,
    minWidth: 110,
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
    marginRight: 12,
  },
  glow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: "rgba(59, 130, 246, 0.05)",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
  },
  title: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 16,
    flexWrap: "nowrap",
  },
  arrowContainer: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  // Disabled styles
  disabledContainer: {
    opacity: 0.5,
    backgroundColor: "#16212F",
    borderColor: "rgba(59, 130, 246, 0.1)",
  },
  disabledIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  disabledIcon: {
    tintColor: "rgba(255, 255, 255, 0.4)",
  },
  disabledTitle: {
    color: "rgba(255, 255, 255, 0.4)",
  },
});
