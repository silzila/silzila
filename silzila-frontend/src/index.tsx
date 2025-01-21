import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import './assets/Fonts/fonts.css'
import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
const theme = createTheme({
	palette: {
	  primary: {
		main: "#2BB9BB",
		light: "#42a5f5",
		dark: "#1565c0",
		contrastText: "#484848",
		// contrastText: "#fff",
	  },
	  secondary: {
		main: "#f50057",
		light: "#af99db",
		dark: "#c51162",
		// contrastText: "#484848",
		contrastText: "#fff",
	  },
	},
	typography: {
	  fontFamily: [
		"Roboto-Regular",
		"Roboto-Medium",
		"Roboto-Bold",
		"Roboto-Light",
		"Segoe UI",
		"system-ui",
		"-apple-system",
		"BlinkMacSystemFont",
		"Helvetica",
		"Arial",
		"sans-serif",
	  ].join(","),
	  htmlFontSize: 16,
	  fontSize: 10.5, //0.75rem = 10.5/14
	  allVariants:{
		color: "#484848",
	  }
	},
  
	components: {
	  MuiCssBaseline: {
		styleOverrides: {
		  body: {
			fontFamily:
			  "Roboto-Regular, Roboto-Medium, Roboto-Bold, Roboto-Light, Segoe UI, Helvetica, Arial, sans-serif",
			color: "#484848", // Apply color to the body text
		  },
		},
	  },
	  MuiSelect: {
		styleOverrides: {
		  root: {
			fontFamily: "inherit",
			color: "#484848", // Apply custom color to MuiSelect
		  },
		},
	  },
	  MuiMenuItem: {
		styleOverrides: {
		  root: {
			fontFamily: "inherit",
			color: "#484848",
		  },
		},
	  },
	  // MuiTextField:{
	  //   styleOverrides: {
	  //     root: {
	  //       fontFamily: "inherit",
	  //       color: "#484848",
	  //     },
	  //   },
	  //   // allVariants:{
  
  
	  //   // }
	  // },
	  MuiTextField:{
		styleOverrides: {
		  root: {
			fontFamily: "inherit",
			color: "#484848",
		  },
		},
		// allVariants:{
  
		// }
	  },
	  MuiInputBase:{
		styleOverrides: {
		  root: {
			fontFamily: "inherit",
			color: "#484848",
		  },
		},
	  },
	  MuiTypography:{
		styleOverrides: {
		  root: {
			fontFamily: "inherit",
			color: "#484848",
			fontSize: "0.75rem",
		  },
		},
	  }
	},
  });
  export const palette = {
	/**
	 * user.css allPages.css ,groups.css pages.css has  color #484848 defined manually  on contrastText change change it in user.css allPages.css
	 */
	primary: {
	  main: "#2BB9BB",
	  light: "#42a5f5",
	  dark: "#1565c0",
	  contrastText: "#484848",
	  grey: "#A8A5AC",
	},
	secondary: {
	  main: "#f50057",
	  light: "#af99db",
	  dark: "#c51162",
	  // contrastText: "#484848",
	  contrastText: "#fff",
	},
  };
  export const fonts = {
	roboto: {
	  regular: "Roboto-Regular",
	  medium: "Roboto-Medium",
	  bold: "Roboto-Bold",
	  light: "Roboto-Light",
	},
	segoe: {
	  regular: "Segoe UI",
	  medium: "Segoe UI",
	  bold: "Segoe UI",
	  light: "Segoe UI",
	},
  };
  export const fontSize = {
	/**
	 * allPages.css pages.css has  font-size 0.75rem defined manually  on fontSize change change it in allPages.css
	 */
	extraSmall: "0.625rem", //10px
	small: "0.6875rem",//11px
	medium: "0.75rem",//12px
	semiLarge: "0.813rem", //13px
	large: "0.875rem",//14px
	extraLarge: "1rem",//16px
  
	extraLargePlus: "1.063rem",//17px
	doubleExtraLarge: "1.125rem", //18px
	TripleExtraLarge: "1.188rem", //19px
	xxl: "1.25rem",//20px
  };
  
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	// <React.StrictMode>
	<StyledEngineProvider injectFirst>
		<ThemeProvider theme={theme}>
			<CssBaseline />
	<App />
	</ThemeProvider>
	</StyledEngineProvider>
	//  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(//console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();