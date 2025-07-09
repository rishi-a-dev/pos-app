import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import LottieView from "lottie-react-native";

import { MenuCategory } from "./MenuCategory";
import MenuItem from "./MenuItem";

export const MenuList = ({
  isLoading,
  filteredFoodItems,
  categories,
  selectedCategory,
  handleCategoryFilter,
  addToCart,
  footerSection,
  onOverlayPress,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onOverlayPress}>
      <View style={styles.menuMainSectionView}>
        <View style={styles.menuCategoryView}>
          <MenuCategory
            categories={categories}
            selectedCategory={selectedCategory}
            handleCategoryFilter={handleCategoryFilter}
          />
        </View>
        <View style={styles.menuItemsListView}>
          {isLoading ? (
            <View style={styles.loadingAnimationView}>
              <LottieView
                autoPlay
                loop
                style={styles.loadingAnimation}
                source={require("../../assets/lottie/loader.json")}
              />
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.menuItemsContainer}>
              {filteredFoodItems?.map((item, index) => (
                <MenuItem key={index} item={item} onAddToCart={addToCart} />
              ))}
            </ScrollView>
          )}
        </View>
        {footerSection}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  menuMainSectionView: {
    flex: 1,
  },
  menuCategoryView: {},
  menuItemsListView: {
    flex: 1,
    paddingLeft: 10,
  },
  menuItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  loadingAnimationView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingAnimation: {
    width: 100,
    height: 100,
  },
});
