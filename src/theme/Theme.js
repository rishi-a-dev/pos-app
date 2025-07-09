export const colors = {
  text: {
    primary: {
      default: "#222222",
      disabled: "rgba(34, 34, 34, 0.4)",
    },
    secondary: {
      default: "#FFFFFF",
      muted: "rgba(255, 255, 255, 0.5)",
    },
    accents: {
      default: "#B3541E",
      red: "#FD5E53",
      black: "#222222",
    },
  },
  background: {
    primary: {
      default: "#B3541E",
      disabled: "#F2F2F2",
      muted: "#F9F9F9",
    },
    secondary: {
      default: "#222222",
      muted: "#333333",
    },
    accents: {
      white: "#FFFFFF",
      black: "#000000",
      brown: "rgba(179, 84, 30, 0.20)",
      red: "#FD5E53",
      blue: "#3F72AF",
      dark: "#393E46",
      green: "#57AA50",
    },
  },
  stroke: {
    primary: "rgba(255, 255, 255, 0.4)",
    secondary: "rgba(34, 34, 34, 0.4)",
  },
  transparent: "#00000000",
};

export const typography = {
  fontSize: {
    32: 32,
    28: 28,
    26: 26,
    24: 24,
    22: 22,
    20: 20,
    18: 18,
    16: 16,
    14: 14,
    12: 12,
    10: 10,
    8: 8,
  },
  H1: {
    fontSize: 24,
    fontFamily: "Montserrat-SemiBold",
  },
  H2: {
    fontSize: 20,
    fontFamily: "Montserrat-SemiBold",
  },
  H3: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
  },
  H4: {
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  H5: {
    fontSize: 14,
    fontFamily: "Montserrat-Medium",
  },
  H6: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
  },
};

export const spacing = {
  small: 8,
  medium: 16,
  large: 24,
  extraLarge: 32,
};

export const border = {
  width: {
    thin: 0.5,
    normal: 1,
    thick: 2,
    double: 4,
  },
  radius: {
    small: 4,
    medium: 8,
    large: 12,
    extraLarge: 16,
  },
};

export const icons = {
  size: {
    xsmall: 18,
    small: 24,
    medium: 32,
    large: 48,
  },
  color: {
    white: colors.text.secondary.default,
    red: colors.text.accents.red,
    black: colors.text.accents.black,
  },
};

export const shadows = {
  card: {
    shadowColor: "rgba(0, 0, 0, 0.10)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
};

export const elevation = {
  card: 4,
  modal: 8,
};

const Theme = {
  colors,
  typography,
  spacing,
  border,
  icons,
  shadows,
  elevation,
};

export default Theme;
