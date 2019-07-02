// @flow
import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// A theme with custom primary and secondary color.
// It's optional.
let darkTheme = createMuiTheme({
  typography: {
    fontFamily: ['"Roboto"', 'sans-serif'].join(','),
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5
    }
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
  },

  shape: {
    borderRadius: 8
  }
});

const lightTheme = createMuiTheme({
  typography: {
    fontFamily: ['"Roboto"', 'sans-serif'].join(','),
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5
    }
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
  },

  shape: {
    borderRadius: 8
  }
});

darkTheme = {
  ...darkTheme,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: '#18202c'
      }
    },
    MuiButton: {
      label: {
        textTransform: 'none'
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none'
        }
      }
    },
    MuiTabs: {
      root: {
        marginLeft: darkTheme.spacing(1)
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: darkTheme.palette.common.white
      }
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        margin: '0 16px',
        minWidth: 0,
        padding: 0,
        [darkTheme.breakpoints.up('md')]: {
          padding: 0,
          minWidth: 0
        }
      }
    },
    MuiIconButton: {
      root: {
        padding: darkTheme.spacing(1)
      }
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4
      }
    },
    MuiDivider: {
      root: {
        backgroundColor: '#404854'
      }
    },
    MuiListItemText: {
      primary: {
        fontWeight: darkTheme.typography.fontWeightMedium
      }
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20
        }
      }
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32
      }
    }
  },
  props: {
    MuiTab: {
      disableRipple: true
    }
  },
  mixins: {
    ...darkTheme.mixins,
    toolbar: {
      minHeight: 48
    }
  }
};

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
