import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import Theme from "../../theme/Theme";

export const SectionButton = ({
  section,
  index,
  sectionListLength,
  selectedSection,
  handleSection,
}) => (
  <TouchableOpacity
    style={[
      styles.sectionContainer,
      index === 0 && styles.sectionContainerFirst,
      index === sectionListLength - 1 && styles.sectionContainerLast,
      selectedSection?.id === section.id && {
        backgroundColor: Theme.colors.background.accents.blue,
      },
    ]}
    onPress={() => handleSection(section)}
  >
    <Text
      style={[
        styles.sectionName,
        selectedSection?.id === section.id && {
          color: Theme.colors.text.secondary.default,
        },
      ]}
    >
      {section.value}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Theme.colors.background.primary.disabled,
  },
  sectionContainerFirst: {
    borderTopLeftRadius: Theme.border.radius.medium,
    borderBottomLeftRadius: Theme.border.radius.medium,
  },
  sectionContainerLast: {
    borderTopRightRadius: Theme.border.radius.medium,
    borderBottomRightRadius: Theme.border.radius.medium,
  },
  sectionName: {
    ...Theme.typography.H5,
  },
});
