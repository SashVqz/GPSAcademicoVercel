export const theme = {
  palette: {
    primary: {
      name: "Azul Principal",
      hex: "#0065ef",
    },
    blueNavbar: {
      name: "Azul Navbar",
      hex: "#1D4ED8",
    },
    text: {
      name: "Negro",
      hex: "#2f2f2f",
    },
    light: {
      name: "Azul Claro",
      hex: "#66A3FF",
    },
    dark: {
      name: "Azul Oscuro",
      hex: "#004BB5",
    },
    complementary: {
      name: "Naranja",
      hex: "#FF6F20",
    },
    accent: {
      name: "Verde Lima",
      hex: "#A3D600",
    },
    neutral: {
      name: "Gris Claro",
      hex: "#F0F0F0",
    },
    background: {
      name: "Blanco",
      hex: "#FFFFFF",
    },
    secondary: {
      name: "Azul Secundario",
      hex: "#1E88E5",
    },
    success: {
      name: "Verde Éxito",
      hex: "#4CAF50",
    },
    warning: {
      name: "Amarillo Advertencia",
      hex: "#FFC107",
    },
    error: {
      name: "Rojo Error",
      hex: "#F44336",
    },
    info: {
      name: "Cian Información",
      hex: "#00BCD4",
    },
    gray: {
      name: "Gris Medio",
      hex: "#9E9E9E",
    },
    darkGray: {
      name: "Gris Oscuro",
      hex: "#616161",
    },
    lightGray: {
      name: "Gris Muy Claro",
      hex: "#E0E0E0",
    },
    purple: {
      name: "Morado",
      hex: "#9C27B0",
    },
    pink: {
      name: "Rosa",
      hex: "#E91E63",
    },
    teal: {
      name: "Verde Azulado",
      hex: "#009688",
    },
    indigo: {
      name: "Índigo",
      hex: "#3F51B5",
    },
    deepOrange: {
      name: "Naranja Oscuro",
      hex: "#FF5722",
    },
    lime: {
      name: "Verde Lima Oscuro",
      hex: "#CDDC39",
    },
    cyan: {
      name: "Cian Claro",
      hex: "#00E5FF",
    },
    amber: {
      name: "Ámbar",
      hex: "#FFAB00",
    },
    brown: {
      name: "Marrón",
      hex: "#795548",
    },
    blueGray: {
      name: "Gris Azulado",
      hex: "#607D8B",
    },
    purple: {
      name: "Morado",
      hex: "#7b04ff",
    },
  },
  fontSizes: {
    s: "12px",
    m: "14px",
    l: "16px",
    xl: "18px",
    xxl: "24px",
    xxxl: "32px",
    xxxxl: "48px",
    xxxxxl: "64px",
  },
  buttonRadios: {
    s: "4px",
    m: "8px",
    l: "12px",
    xl: "16px",
    xxl: "20px",
  },
  fontWeight: {
    thin: "100",
    extraLight: "200",
    ultraLight: "200",
    light: "300",
    regular: "400",
    semibold: "500",
    bold: "700",
  },
};

export const styles = {
  dropdown: {
    display: "block",
    position: "absolute",
    top: "71px",
    right: 0,
    backgroundColor: "white",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "5px",
    overflow: "hidden",
  },
  submenu: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
  },
  dropdownButton: {
    width: "150px",
    padding: "10px",
    border: "none",
    background: "none",
    cursor: "pointer",
    textAlign: "left",
    color: "black",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  modalButton: {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  confirm: {
    backgroundColor: "#28a745",
    color: "white",
  },
  cancel: {
    backgroundColor: "#6c757d",
    color: "white",
  },
};
