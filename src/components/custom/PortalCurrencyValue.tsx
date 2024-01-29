import { Typography, TypographyProps, useTheme } from '@mui/material'
import { handleFormat } from 'services/globalFunctions'
import PortalCopyValue from './PortalCopyValue'

interface PortalCurrencyValueProps {
   currency?: string
   disableColor?: boolean
   format?: string
   value: number
   reverseColors?: boolean
   visibleCurrency?: boolean
   formatter?: boolean
}

const PortalCurrencyValue = ({
   currency: displayCurrency,
   format = displayCurrency === 'IRT' ? '0,00' : '0,00.[000000]',
   disableColor = false,
   value,
   reverseColors = false,
   visibleCurrency = false,
   formatter,
   ...props
}: PortalCurrencyValueProps & TypographyProps) => {
   format =
      displayCurrency === 'USD' ? `$${format}` : `${format}${displayCurrency}`
   const theme = useTheme()
   const profitLoss = reverseColors ? value > 0 : value < 0
   const color = disableColor
      ? theme.palette.text.primary
      : profitLoss
      ? theme.palette.error.main
      : !value
      ? theme.palette.grey[500]
      : theme.palette.success.main

   return (
      <>
         {!visibleCurrency ? (
            <PortalCopyValue
               value={`${handleFormat(value, displayCurrency)}`}
               isVisible={true}
               color={color}
            />
         ) : (
            <Typography color={color} variant="bodySmallBold" {...props}>
               {handleFormat(value || 0, displayCurrency, formatter)}{' '}
               {/* {visibleCurrency && displayCurrency !== 'USD'
                  ? displayCurrency
                  : ''} */}
            </Typography>
         )}
      </>
   )
}

export default PortalCurrencyValue
