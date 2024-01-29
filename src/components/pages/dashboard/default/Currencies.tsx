import { Player } from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown, faAngleUp } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Menu,
   MenuItem,
   Button as MuiButton,
   Stack,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { spacing } from '@mui/system'
import React from 'react'
import { useSelector } from 'react-redux'
import {
   saveCurrencyOption,
   saveCurrentCurrency,
   selectAuthCurrencies,
   selectAuthCurrencyOption,
   selectAuthCurrenturrency,
   selectAuthPlayerDetails,
} from 'redux/authSlice'
import { store } from 'redux/store'
import { curenciesType } from 'types'

const Button = styled(MuiButton)(spacing)

function CurrenciesFilter(data: { usedCurrency?: boolean }) {
   const theme = useTheme()
   const matches = useMediaQuery(theme.breakpoints.up('md'))
   const dataPlayer = useSelector(selectAuthPlayerDetails) as Player
   const [anchorElT, setAnchorElT] = React.useState<null | HTMLElement>(null)
   const currencies: string[] = useSelector(selectAuthCurrencies) || []
   const currency: string = useSelector(selectAuthCurrenturrency) || ''
   const listCurrencies = data.usedCurrency
      ? dataPlayer?.usedCurrency || []
      : currencies
   const currencyOption = useSelector(selectAuthCurrencyOption)

   const handleClickT = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorElT(event.currentTarget)
   }

   const handleUpdateCurrency = (currency: string) => {
      if (currency === 'all') {
         store.dispatch(saveCurrencyOption(curenciesType[1]))
      } else {
         store.dispatch(saveCurrencyOption(curenciesType[0]))
         store.dispatch(saveCurrentCurrency(currency))
      }
      setAnchorElT(null)
   }

   return (
      <React.Fragment>
         {listCurrencies.length > 0 && (
            <Stack
               direction={['column', 'row']}
               alignItems={'center'}
               gap={2}
               sx={{
                  '.MuiFormControl-root': {
                     width: [130, 175],
                     '& .MuiInputBase-input': { pr: 0 },
                  },
               }}
            >
               <Button
                  variant="contained"
                  color="secondary"
                  aria-owns={anchorElT ? 'simple-menu' : undefined}
                  aria-haspopup="true"
                  onClick={handleClickT}
                  fullWidth={matches ? false : true}
                  size={'small'}
                  sx={{
                     minWidth: '10ch',
                  }}
                  endIcon={
                     <FontAwesomeIcon
                        icon={
                           anchorElT
                              ? (faAngleUp as IconProp)
                              : (faAngleDown as IconProp)
                        }
                        color={theme.palette.primary.contrastText}
                        size="xs"
                     />
                  }
               >
                  {currencyOption.value === 1 ? 'All Currencies' : currency}
               </Button>
               <Menu
                  id="simple-menu"
                  anchorEl={anchorElT}
                  open={Boolean(anchorElT)}
                  onClose={() => setAnchorElT(null)}
               >
                  <MenuItem
                     key={'all'}
                     sx={{
                        minWidth: '10ch',
                     }}
                     onClick={() => handleUpdateCurrency('all')}
                  >
                     All Currencies
                  </MenuItem>
                  {listCurrencies?.map((item: string) => (
                     <MenuItem
                        key={item}
                        sx={{
                           minWidth: '10ch',
                        }}
                        onClick={() => handleUpdateCurrency(item)}
                     >
                        {item}
                     </MenuItem>
                  ))}
               </Menu>
            </Stack>
         )}
      </React.Fragment>
   )
}

export default CurrenciesFilter
