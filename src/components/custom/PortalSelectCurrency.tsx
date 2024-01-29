import { faFilterCircleDollar } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButton, Menu, MenuItem, useTheme } from '@mui/material'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { saveCurrencyOption, selectAuthCurrencyOption } from 'redux/authSlice'
import { store } from 'redux/store'
import { curenciesType } from 'types'

const PortalSelectCurrency = () => {
   const theme = useTheme()
   const currencyOption = useSelector(selectAuthCurrencyOption)
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
   const open = Boolean(anchorEl)
   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
   }
   const handleClose = () => {
      setAnchorEl(null)
   }

   const handleMenuItemClick = (
      event: React.MouseEvent<HTMLElement>,
      index: number,
      option: {
         value: number
         name: string
      }
   ) => {
      setAnchorEl(null)
      store.dispatch(saveCurrencyOption(option))
   }

   const menu = () =>
      curenciesType?.map((option, index) => (
         <MenuItem
            value={option.value}
            key={option.value}
            selected={index === currencyOption?.value}
            onClick={(event) => handleMenuItemClick(event, index, option)}
         >
            {option.name}
         </MenuItem>
      ))

   return (
      <>
         <IconButton onClick={handleClick} size="medium">
            <FontAwesomeIcon
               icon={faFilterCircleDollar as IconProp}
               fontSize={'14px'}
               color={theme.palette.info.contrastText}
               fixedWidth
            />
         </IconButton>
         <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
               'aria-labelledby': 'basic-button',
            }}
         >
            {menu()}
         </Menu>
      </>
   )
}

export default PortalSelectCurrency
