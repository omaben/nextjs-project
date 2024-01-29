// Import the necessary modules
import '@mui/lab/themeAugmentation'
import { createTheme as createMuiTheme } from '@mui/material/styles'
import breakpoints from './breakpoints'
import components from './components'
import typography from './typography'
import variants from './variants'
import { darkPurple } from 'colors'

// Define a function to create a theme with a given name
const createTheme = (name: string) => {
   // Find the theme configuration based on the provided name
   let themeConfig = variants.find((variant) => variant.name === name)
   if (!themeConfig) {
      // If the provided name is not valid, log a warning and use the first variant as a fallback
      console.warn(new Error(`The theme ${name} is not valid`))
      themeConfig = variants[0]
   }

   // Create the base MUI theme with common configurations
   let theme = createMuiTheme(
      {
         spacing: 4,
         breakpoints: breakpoints,
         // @ts-ignore
         components: components,
         typography: typography,
         palette: themeConfig.palette,
      },
      {
         name: themeConfig.name,
         header: themeConfig.header,
         footer: themeConfig.footer,
         sidebar: themeConfig.sidebar,
      }
   )

   // Extend the base theme with responsive typography and component style overrides
   theme = createMuiTheme(theme, {
      typography: {
         h2: {
            [theme.breakpoints.down('sm')]: {
               fontSize: '1rem',
            },
         },
         h3: {
            [theme.breakpoints.down('sm')]: {
               fontSize: '0.9rem',
            },
         },
         body1: {
            [theme.breakpoints.down('sm')]: {
               fontSize: '10px',
            },
            [theme.breakpoints.up('sm')]: {
               fontSize: '12px',
            },
         },
         caption: {
            [theme.breakpoints.down('sm')]: {
               fontSize: '10px',
            },
            [theme.breakpoints.up('sm')]: {
               fontSize: '12px',
            },
         },
         bodySmallBold: {
            [theme.breakpoints.down('sm')]: {
               fontSize: '10px',
            },
            [theme.breakpoints.up('sm')]: {
               fontSize: '12px',
            },
            fontFamily: 'Nunito Sans SemiBold'
         },
         bodySmall: {
            [theme.breakpoints.down('sm')]: {
               fontSize: '10px',
            },
            [theme.breakpoints.up('sm')]: {
               fontSize: '12px',
            },
            fontFamily: 'Nunito Sans Bold'
         },
      },
      components: {
         MuiTypography: {
            variants: [
               {
                  props: { variant: 'bodySmallBold' },
                  style: {
                     [theme.breakpoints.down('sm')]: {
                        fontSize: '10px',
                     },
                     [theme.breakpoints.up('sm')]: {
                        fontSize: '12px',
                     },
                  },
               },
            ],
         },
         MuiFormHelperText: {
            styleOverrides: {
               root: {
                  color: '#FF6768 !important',
                  fontSize: '12px !important'
               },
            },
         },
         MuiInputBase: {
            styleOverrides: {
               root: {
                  'input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill': {
                     WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.default} inset !important`,
                  },
               },
            },
         },
         MuiTableHead: themeConfig.MuiTableHead,
         MuiTableBody: themeConfig.MuiTableBody,
         MuiCard: themeConfig.MuiCard,
      },
      name: themeConfig.name,
      header: themeConfig.header,
      footer: themeConfig.footer,
      sidebar: themeConfig.sidebar,
   })

   // Return the final theme
   return theme
}

// Export the createTheme function as the default export
export default createTheme
