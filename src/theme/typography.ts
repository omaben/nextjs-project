import { TypographyOptions } from '@mui/material/styles/createTypography'
import { ImoonGray, darkPurple } from 'colors'

const typography: TypographyOptions = {
   fontFamily: ['Nunito Sans Regular'].join(','),
   fontSize: 10,
   h1: {
      lineHeight: '14px',
      fontFamily: 'Nunito Sans Bold',
      fontSize: '16px !important',
      '@media (max-width: 768px)': {
         // Font size for screens up to 768px width (mobile)
         fontSize: '12px !important',
      },
   },
   h2: {
      fontSize: '1.75rem',
      lineHeight: 1.25,
   },
   h3: {
      fontFamily: 'Nunito Sans Bold',
      color: ImoonGray[1],
      fontSize: '16px !important',
      lineHeight: '23.52px'
   },
   h4: {
      color: ImoonGray[9],
      fontFamily: 'Nunito Sans Bold',
      lineHeight: '11.6px',
      '@media (max-width: 768px)': {
         // Font size for screens up to 768px width (mobile)
         fontSize: '10px ',
      },
      fontSize: '12px',
   },
   h5: {
      fontSize: '12px !important',
      fontFamily: 'Nunito Sans Bold',
      lineHeight: '16px',
      letterSpacing: '0.48px'
   },
   h6: {
      fontFamily: 'Nunito Sans Bold',
      color: darkPurple[3],
      fontSize: '12px ',
      marginLeft: '0 !important',
      '@media (max-width: 768px)': {
         // Font size for screens up to 768px width (mobile)
         fontSize: '10px ',
      },
      lineHeight: '11.6px'
   },
   body1: {
      fontSize: '12px',
      '@media (max-width: 768px)': {
         // Font size for screens up to 768px width (mobile)
         fontSize: '10px',
      },
      letterSpacing: '0.3px',
      lineHeight: '13px'
   },
   body2: {
      fontSize: '12px !important',
      lineHeight: '14px',
      fontFamily: 'Nunito Sans Bold',
   },
   button: {
      textTransform: 'none',
      borderRadius: '6px'
   },
}

declare module '@mui/material/Typography' {
   interface TypographyPropsVariantOverrides {
      headLine: true
      subHeadLine: true
      bodyBold: true
      bodySmall: true
      bodySmallBold: true
      buttonMedium: true
      buttonSmall: true
   }
}

export default typography
