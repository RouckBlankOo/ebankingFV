import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";

interface SectionContainerProps {
  title?: string;
  titleComponent?: React.ReactNode;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  titleOutside?: boolean;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  title,
  titleComponent,
  children,
  containerStyle,
  contentStyle,
  titleOutside = false,
}) => {
  const titleElement =
    titleComponent ||
    (title && (
      <ThemedText style={titleOutside ? styles.titleOutside : styles.title}>
        {title}
      </ThemedText>
    ));

  if (titleOutside) {
    return (
      <View style={[styles.section, containerStyle]}>
        {titleElement}
        <View style={[styles.containerWithoutTitle, contentStyle]}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.section, containerStyle]}>
      <View style={[styles.container, contentStyle]}>
        {titleElement}
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
    marginHorizontal: 20,
  },
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    minHeight: 100,
  },
  containerWithoutTitle: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    minHeight: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  titleOutside: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
});
