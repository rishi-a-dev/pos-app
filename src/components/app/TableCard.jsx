import React from "react";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions } from "react-native";

import Theme from "../../theme/Theme";

const KOT_BG = "#DCEAFF";
const KOT_BORDER = "#9FC0FF";

export const TableCard = ({
  table,
  selectedTable,
  isQueued = false,
  isKotTable = false,
  handleTable,
  handleLongPress,
}) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 420;
  const cardWidth = isSmallScreen ? "48%" : 172;

  const isSelected =
    selectedTable?.id === table.id &&
    (selectedTable?.chairName ?? "") === (table?.chairName ?? "");

  return (
    <TouchableOpacity
      style={[
        styles.tableCard,
        { width: cardWidth },
        {
          backgroundColor: isSelected
            ? Theme.colors.background.primary.default
            : isQueued
              ? Theme.colors.background.accents.brown
              : isKotTable
                ? KOT_BG
              : Theme.colors.background.primary.muted,
          borderColor: isQueued
            ? Theme.colors.text.accents.default
            : isKotTable
              ? KOT_BORDER
            : Theme.colors.stroke.secondary,
        },
      ]}
      onPress={() => handleTable(table)}
      delayLongPress={500}
      onLongPress={() => handleLongPress(table)}
    >
      <Text
        style={[
          Theme.typography.H5,
          styles.tableTitle,
          {
            color: isSelected
              ? Theme.colors.text.secondary.default
              : Theme.colors.text.primary.default,
          },
        ]}
      >
        Table {table.tableName} {table.chairName && `- ${table.chairName}`}
      </Text>
      {isKotTable && !isSelected && <Text style={styles.kotText}>KOT</Text>}
      {isQueued && !isSelected && <Text style={styles.queuedText}>Queued</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tableCard: {
    minHeight: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: Theme.border.width.normal,
    borderColor: Theme.colors.stroke.secondary,
    paddingHorizontal: 8,
  },
  tableTitle: {
    textAlign: "center",
  },
  queuedText: {
    ...Theme.typography.H6,
    color: Theme.colors.text.primary.default,
    marginTop: 4,
  },
  kotText: {
    ...Theme.typography.H6,
    color: Theme.colors.text.accents.default,
    marginTop: 2,
  },
});
