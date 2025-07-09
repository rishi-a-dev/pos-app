import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

import Theme from "../../theme/Theme";
import { Food } from "../../assets/icons/Food";

const MenuItem = React.memo(({ item, onAddToCart }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    style={styles.menuItem}
    onPress={() => onAddToCart(item)}
  >
    <View style={styles.imageView}>
      <Food />
    </View>
    <Text style={styles.itemName}>{item.items?.itemName}</Text>
    <Text style={styles.itemPrice}>₹ {item.items?.rate}</Text>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  menuItem: {
    width: 170,
    backgroundColor: Theme.colors.background.primary.muted,
    marginBottom: 10,
    padding: 10,
    marginLeft: 14,
    borderRadius: 5,
    elevation: Theme.elevation.card,
    shadowColor: Theme.shadows.card.shadowColor,
    shadowOffset: Theme.shadows.card.shadowOffset,
    shadowOpacity: Theme.shadows.card.shadowOpacity,
    shadowRadius: Theme.shadows.card.shadowRadius,
  },
  imageView: {
    width: "100%",
    height: 107,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e7e7e7",
  },
  itemName: {
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-Medium",
    color: Theme.colors.text.primary.default,
    textAlign: "center",
  },
  itemPrice: {
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-Medium",
    color: Theme.colors.text.primary.default,
    textAlign: "center",
  },
});

export default MenuItem;
