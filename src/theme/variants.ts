import {
   deepOrange,
   green,
   grey,
   indigo,
   orange,
   red,
} from '@mui/material/colors'
import { ImoonGray, darkPurple, neutral, primary, tertiary } from 'colors'
import merge from 'deepmerge'
import { THEMES } from '../constants'

const customBlue = {
   4: '#1570EF',
   50: '#e9f0fb',
   100: '#c8daf4',
   200: '#a3c1ed',
   300: '#7ea8e5',
   400: '#6395e0',
   500: '#4782da',
   600: '#407ad6',
   700: '#376fd0',
   800: '#2f65cb',
   900: '#2052c2',
}

const customIndigo = {
   5: '#6172F3'
}
const customRed = {
   100: '#8c3e3e',
   200: '#681b2b',
}

const imoonGray = {
   1: '#04020B',
   4: '#332C4A',
   5: '#332C4A',
   6: '#5C5474',
   7: '#746D89',
   10: '#BBB7C9',
   11: '#D5D2DF',
   12: '#EDEBF4',
   200: '#463E5E',
   100: '#1F1933'
}

const defaultVariant = {
   name: THEMES.DEFAULT,
   palette: {
      mode: 'light',
      primary: {
         main: customBlue[700],
         contrastText: '#FFF',
      },
      secondary: {
         main: customBlue[500],
         contrastText: '#FFF',
      },
      background: {
         default: '#F7F9FC',
         paper: '#FFF',
      },
      headerGridBg: {
         main: '#F7F9FC',
         contrastText: '#FFF',
      },

      success: {
         main: tertiary[5],
         contrastText: tertiary[1],
      },

      error: {
         main: '#F04438',
         contrastText: red[900],
      },

      warning: {
         main: orange['A200'],
         contrastText: deepOrange[900],
      },

      info: {
         main: customBlue[300],
         contrastText: customBlue[900],
      },
      text: {
         primary: '#000',
         secondary: imoonGray[1],
         info: imoonGray[11]
      },
      inherit: {
         main: '#fff',
      }
   },
   header: {
      color: grey[500],
      background: '#FFF',
      search: {
         color: grey[800],
      },
      indicator: {
         background: customBlue[600],
      },
   },
   footer: {
      color: grey[500],
      background: '#FFF',
   },
   sidebar: {
      color: grey[200],
      background: '#233044',
      header: {
         color: grey[200],
         background: '#233044',
         brand: {
            color: customBlue[500],
         },
      },
      footer: {
         color: grey[200],
         background: '#1E2A38',
         online: {
            background: green[500],
         },
         offline: {
            background: red[500],
         },
      },
      headerSidebar: {
         color: grey[200],
         background: '#2D3037',
         online: {
            background: green[500],
         },
         offline: {
            background: red[500],
         },
      },
      badge: {
         color: '#FFF',
         background: customBlue[500],
      },
   },
   MuiTableHead: {
      styleOverrides: {
         root: {
            background: '#F7F9FC'
         }
      },
      defaultProps: {
         color: '#F7F9FC'
      }
   },
   MuiTableBody: {
      styleOverrides: {
         root: {}
      }
   },
   MuiCard: {
      styleOverrides: {
         root: {}
      }
   },
   a: {
      defaultProps: {
         color: '#000'
      }
   }
}

const darkVariant = merge(defaultVariant, {
   name: THEMES.DARK,
   palette: {
      mode: 'dark',
      primary: {
         main: primary[4],
         contrastText: '#000',
      },

      secondary: {
         main: neutral[6],
         dark: neutral[3],
         contrastText: '#FFF',
      },

      background: {
         default: '#1F1933',
         paper: '#FFF',
      },
      headerGridBg: {
         main: neutral[1],
         contrastText: '#FFF',
      },
      text: {
         primary: 'rgba(255, 255, 255, 0.95)',
         secondary: 'rgba(255, 255, 255, 0.5)',
      },
   },
   header: {
      color: grey[300],
      background: neutral[1],
      search: {
         color: grey[200],
      },
   },
   footer: {
      color: grey[300],
      background: neutral[3],
   },
   sidebar: {
      color: grey[200],
      background: neutral[2],
      header: {
         color: grey[200],
         background: neutral[2],
         brand: {
            color: customBlue[500],
         },
      },
      footer: {
         color: grey[200],
         background: neutral[2],
         online: {
            background: green[500],
         },
         offline: {
            background: red[500],
         },
      },
      badge: {
         color: '#FFF',
         background: primary[4],
      },
   },
   MuiTableHead: {
      styleOverrides: {
         root: {
            background: neutral[1]
         }
      }
   }
})

const lightVariant = merge(defaultVariant, {
   name: THEMES.LIGHT,
   palette: {
      mode: 'light',
   },
   header: {
      color: grey[200],
      background: customBlue[800],
      search: {
         color: grey[100],
      },
      indicator: {
         background: red[500],
      },
   },
   sidebar: {
      color: grey[900],
      background: '#FFF',
      header: {
         color: '#FFF',
         background: customBlue[800],
         brand: {
            color: '#FFFFFF',
         },
      },
      footer: {
         color: grey[800],
         background: '#F7F7F7',
         online: {
            background: green[500],
         },
         offline: {
            background: red[500],
         },
      },
   },
})

const redVariant = merge(defaultVariant, {
   name: THEMES.RED,
   palette: {
      mode: 'light',
      background: {
         default: '#F1F1F1',
         paper: '#FFF',
      },
      headerGridBg: {
         main: customRed[100],
         contrastText: '#FFF',
      },
      primary: {
         main: customRed[200],
         contrastText: '#FFF',
      },
      secondary: {
         main: customRed[100],
         contrastText: '#FFF',
      },
      info: {
         main: customRed[100],
         contrastText: '#fff',
      },
   },
   header: {
      color: grey[200],
      background: customRed[100],
      search: {
         color: grey[100],
      },
      indicator: {
         background: customRed[200],
      }
   },
   sidebar: {
      color: grey[900],
      background: '#FFF',
      header: {
         color: '#FFF',
         background: customRed[100],
         brand: {
            color: '#FFFFFF',
         },
      },
      badge: {
         color: '#FFF',
         background: customRed[200],
      },
      footer: {
         color: grey[800],
         background: '#F7F7F7',
         online: {
            background: green[500],
         },
         offline: {
            background: red[500],
         },
      },
   },
   MuiTableHead: {
      styleOverrides: {
         root: {
            background: customRed[100],
            color: '#fff',
            'th': {
               color: '#fff',
               borderRight: ` 2px solid #fff`,
               background: customRed[100],
            }
         }
      }
   },
   MuiTableBody: {
      styleOverrides: {
         root: {
            'th': {
               background: '#125603',
               color: '#fff !important',
               '.MuiStack-root, a': {
                  color: '#fff !important'
               }
            },
            'td, th': {
               borderRight: ` 1px solid #fff !important`,
               borderBottom: ` 1px solid #fff !important`,
            }
         }
      }
   },
   MuiCard: {
      styleOverrides: {
         root: {
            borderRadius: 0
         }
      }
   },
})

const imoonGrayVariant = merge(defaultVariant, {
   name: THEMES.IMOONGRAY,
   palette: {
      mode: 'light',

      background: {
         default: ImoonGray[11],
         paper: '#FFF',
      },
      headerGridBg: {
         main: imoonGray[100],
         contrastText: '#FFF',
      },
      primary: {
         main: imoonGray[100],
         dark: imoonGray[6],
         contrastText: '#FFF',
      },
      secondary: {
         main: customBlue[4],
         dark: imoonGray[5],
         contrastText: '#FFF',
      },
      info: {
         main: customIndigo[5],
         dark: imoonGray[5],
         light: imoonGray[10],
         contrastText: '#fff',
      },
      error: {
         main: '#F04438',
         light: '#FF6768',
         contrastText: '#fff',
      },
      grey: {
         100: '#746D89',
         200: '#BBB7C9',
         900: '#A39EB4'
      },
      inherit: {
         main: imoonGray[5],
         contrastText: '#FFF',
      }
   },
   header: {
      color: grey[200],
      background: imoonGray[100],
      search: {
         color: grey[100],
      },
      indicator: {
         background: imoonGray[200],
      }
   },
   sidebar: {
      color: grey[900],
      background: '#FFF',
      header: {
         color: '#FFF',
         background: imoonGray[100],
         brand: {
            color: '#FFFFFF',
         },
      },
      badge: {
         color: '#FFF',
         background: customBlue[4],
      },
      footer: {
         color: grey[800],
         background: '#332c4a',
         online: {
            background: green[500],
         },
         offline: {
            background: red[500],
         },
      },
   },
   MuiTableHead: {
      styleOverrides: {
         root: {
            background: imoonGray[4],
            color: darkPurple[12],
            fontFamily: 'Nunito Sans Regular',
            fontSize: '12px',
            '@media (max-width: 768px)': {
               // Font size for screens up to 768px width (mobile)
               fontSize: '10px',
            },
            'th': {
               color: '#fff',
               borderRight: ` 2px solid #fff`,
               background: imoonGray[100],
            }
         }
      }
   },
   MuiTableBody: {
      styleOverrides: {
         root: {
            'th': {
               background: '#125603',
               color: '#fff !important',
               '.MuiStack-root, a': {
                  color: '#fff !important'
               }
            },
            'td, th': {
               borderRight: ` 1px solid #fff !important`,
               borderBottom: ` 1px solid #fff !important`,
            }
         }
      }
   },
   MuiCard: {
      styleOverrides: {
         root: {
            borderRadius: 0
         }
      }
   },
})

const blueVariant = merge(defaultVariant, {
   name: THEMES.BLUE,
   palette: {
      mode: 'light',
   },
   sidebar: {
      color: '#FFF',
      background: customBlue[700],
      header: {
         color: '#FFF',
         background: customBlue[800],
         brand: {
            color: '#FFFFFF',
         },
      },
      footer: {
         color: '#FFF',
         background: customBlue[800],
         online: {
            background: '#FFF',
         },
         offline: {
            background: red[500],
         },
      },
      badge: {
         color: '#000',
         background: '#FFF',
      },
   },
})

const greenVariant = merge(defaultVariant, {
   name: THEMES.GREEN,
   palette: {
      primary: {
         main: green[800],
         contrastText: '#FFF',
      },
      secondary: {
         main: green[500],
         contrastText: '#FFF',
      },
   },
   header: {
      indicator: {
         background: green[600],
      },
   },
   sidebar: {
      color: '#FFF',
      background: green[700],
      header: {
         color: '#FFF',
         background: green[800],
         brand: {
            color: '#FFFFFF',
         },
      },
      footer: {
         color: '#FFF',
         background: green[800],
         online: {
            background: '#FFF',
         },
         offline: {
            background: red[500],
         },
      },
      badge: {
         color: '#000',
         background: '#FFF',
      },
   },
})

const indigoVariant = merge(defaultVariant, {
   name: THEMES.INDIGO,
   palette: {
      primary: {
         main: indigo[600],
         contrastText: '#FFF',
      },
      secondary: {
         main: indigo[400],
         contrastText: '#FFF',
      },
   },
   header: {
      indicator: {
         background: indigo[600],
      },
   },
   sidebar: {
      color: '#FFF',
      background: indigo[700],
      header: {
         color: '#FFF',
         background: indigo[800],
         brand: {
            color: '#FFFFFF',
         },
      },
      footer: {
         color: '#FFF',
         background: indigo[800],
         online: {
            background: '#FFF',
         },
         offline: {
            background: red[500],
         },
      },
      badge: {
         color: '#000',
         background: '#FFF',
      },
   },
})

const variants: Array<VariantType> = [
   defaultVariant,
   darkVariant,
   lightVariant,
   redVariant,
   blueVariant,
   greenVariant,
   indigoVariant,
   imoonGrayVariant
]

export default variants

export type VariantType = {
   name: string
   palette: {
      primary: MainContrastTextType
      secondary: MainContrastTextType
      headerGridBg: MainContrastTextType
   }
   header: ColorBgType & {
      search: {
         color: string
      }
      indicator: {
         background: string
      }
   }
   footer: ColorBgType
   sidebar: ColorBgType & {
      header: ColorBgType & {
         brand: {
            color: string
         }
      }
      footer: ColorBgType & {
         online: {
            background: string
         }
         offline: {
            background: string
         }
      }
      headerSidebar: ColorBgType & {
         online: {
            background: string
         }
         offline: {
            background: string
         }
      }
      badge: ColorBgType
   }
   MuiTableHead: {
      styleOverrides: {
         root: {}
      }
   },
   MuiTableBody: {
      styleOverrides: {
         root: {}
      }
   },
   MuiCard: {
      styleOverrides: {
         root: {}
      }
   },

}

type MainContrastTextType = {
   main: string
   contrastText: string
}
type ColorBgType = {
   color: string
   background: string
}
