import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import Theme from "../../theme/Theme";

export const MenuCategory = ({
  categories,
  selectedCategory,
  handleCategoryFilter,
}) => {
  return (
    <View style={styles.menuCategoryView}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
        style={styles.menuCategory}
      >
        {categories?.map((category, index) => (
          <TouchableOpacity
            onPress={() => handleCategoryFilter(category.id)}
            key={index}
          >
            <View
              style={[
                styles.menuItemsCategory,
                category.id === selectedCategory && styles.selectedCategory,
              ]}
            >
              <Text
                style={[
                  styles.menuItemsCategoryText,
                  category.id === selectedCategory &&
                    styles.selectedCategoryText,
                ]}
              >
                {category.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  menuCategoryView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuCategory: {
    width: "100%",
    flexDirection: "row",
    paddingBottom: 8,
  },
  menuItemsCategory: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Theme.colors.background.primary.disabled,
  },
  menuItemsCategoryText: {
    fontSize: Theme.typography.fontSize[13],
    fontFamily: "Montserrat-Regular",
    color: Theme.colors.text.primary.default,
  },
  selectedCategory: {
    backgroundColor: Theme.colors.background.primary.default,
  },
  selectedCategoryText: {
    color: Theme.colors.text.secondary.default,
  },
});
