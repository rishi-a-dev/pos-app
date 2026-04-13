import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import LottieView from "lottie-react-native";

import { MenuCategory } from "./MenuCategory";
import MenuItem from "./MenuItem";

/** Extra space at end of menu scroll so content clears overlays (e.g. floating current-order bar). */
export const MENU_SCROLL_BOTTOM_INSET = 120;

export const MenuList = ({
  isLoading,
  filteredFoodItems,
  categories,
  selectedCategory,
  handleCategoryFilter,
  addToCart,
  isRefreshing = false,
  onRefresh,
  footerSection,
  onOverlayPress,
  contentBottomInset = 0,
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
            <ScrollView
              contentContainerStyle={[
                styles.menuItemsContainer,
                contentBottomInset > 0 && { paddingBottom: contentBottomInset },
              ]}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                />
              }
            >
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
