import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Theme from "../../theme/Theme";
import { useAppStore } from "../../stores";
import { Search } from "../../assets/icons/Search";
import { Menu } from "../../assets/icons/Menu";
import { User } from "../../assets/icons/User";
import { useOrientation } from "../context/OrientationContext";

const DiameterScale = 38;

export const AppBar = ({
  searchQuery,
  setSearchQuery,
  onToggleSideMenu,
  showSearch = false,
}) => {
  const isLandscape = useOrientation();
  const dbData = useAppStore((state) => state.dbData);
  const selectedWaiter = useAppStore((state) => state.waiter);

  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
  };

  return (
    <View style={styles.appBar}>
      <View style={styles.appBarFlex}>
        <View style={[styles.leftFlex, { width: isLandscape ? "22%" : "8%" }]}>
          <TouchableOpacity>
            <Menu size={Theme.icons.size.medium} />
          </TouchableOpacity>
        </View>
        {showSearch && (
          <View
            style={[
              styles.centerFlex,
              { alignItems: isLandscape ? "center" : "flex-start" },
            ]}
          >
            <View style={styles.searchBox}>
              <Search size={Theme.icons.size.xsmall} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search coffee,tea etc..."
                placeholderTextColor={Theme.colors.text.secondary.default}
                disableFullscreenUI={true}
                value={searchQuery}
                onChangeText={handleSearchInputChange}
              />
            </View>
          </View>
        )}
        <View style={styles.rightFlex}>
          <TouchableOpacity onPress={onToggleSideMenu}>
            <View style={styles.userDetailsView}>
              <View style={styles.nameDateView}>
                <Text style={styles.userName}>
                  Employee: {selectedWaiter?.name}
                </Text>
                <Text style={styles.dateTime}>User : {dbData?.adminname}</Text>
              </View>
              <View style={styles.userImg}>
                <User size={38} />
                {/* <Image
                source={{
                  uri: "https://uploads-ssl.webflow.com/617fdc494ab511ccd18d29b4/630cf003a99fbddeed16b71f_ris.png",
                }}
                resizeMode="contain"
                style={{ width: 38, height: 38 }}
              /> */}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    width: "100%",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.background.secondary.default,
    borderTopWidth: Theme.border.width.thin,
    borderTopColor: Theme.colors.stroke.primary,
  },
  appBarFlex: {
    width: "97%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 2,
  },
  leftFlex: {
    flexDirection: "row",
  },
  centerFlex: {
    flex: 1,
    justifyContent: "center",
  },
  searchBox: {
    width: "65%",
    flexDirection: "row",
    backgroundColor: Theme.colors.background.secondary.muted,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: Theme.border.width.thin,
    borderColor: Theme.colors.stroke.primary,
  },
  searchInput: {
    width: "65%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: Theme.colors.text.secondary.default,
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-SemiBold",
  },
  rightFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userDetailsView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 2,
  },
  nameDateView: {
    marginRight: 8,
  },
  userName: {
    fontSize: Theme.typography.fontSize[12],
    fontFamily: "Montserrat-SemiBold",
    color: Theme.colors.text.secondary.default,
    textAlign: "right",
  },
  dateTime: {
    fontSize: Theme.typography.fontSize[10],
    fontFamily: "Montserrat-Medium",
    color: Theme.colors.text.secondary.muted,
    textAlign: "right",
  },
  userImg: {
    width: DiameterScale,
    height: DiameterScale,
    borderRadius: DiameterScale / 2,
  },
});
