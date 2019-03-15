import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
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

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} theme={theme} />
      </MuiThemeProvider>
    );
  }
  return WithRoot;
}

export default withRoot;
