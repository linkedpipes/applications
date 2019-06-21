// @flow
import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// A theme with custom primary and secondary color.
// It's optional.
const darkTheme = createMuiTheme({
  typography: {
    fontFamily: ['"Roboto"', 'sans-serif'].join(',')
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#fba333'
    },
    secondary: {
      main: '#00695c'
    },
    darkPaper: {
      main: `#323232`
    }
  }
});

const lightTheme = createMuiTheme({
  typography: {
    fontFamily: ['"Roboto"', 'sans-serif'].join(',')
  },
  palette: {
    primary: {
      // main: "#2196f3"
      main: '#154168'
    },
    secondary: {
      // main: "#ab003c"
      main: '#00695c'
    }
  }
});

function withRoot(Component: Object) {
  function WithRoot(props: Object) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    const { colorThemeIsLight } = props;
    return (
      <MuiThemeProvider theme={colorThemeIsLight ? lightTheme : darkTheme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component
          {...props}
          theme={colorThemeIsLight ? lightTheme : darkTheme}
        />
      </MuiThemeProvider>
    );
  }
  return WithRoot;
}

export default withRoot;
