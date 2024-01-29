import { Brand, PaymentGatewayName } from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   FormControl,
   Grid,
   MenuItem,
   Select,
   SelectChangeEvent,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { darkPurple } from 'colors'
import router from 'next/router'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
   saveCurrentBrand,
   selectAuthBrands,
   selectAuthCurrentBrand,
   selectAuthGatewayReport,
   selectAuthOperator,
} from 'redux/authSlice'
import { store } from 'redux/store'

function BrandsFilter(data: any) {
   const theme = useTheme()
   const brands: Brand[] = useSelector(selectAuthBrands) || []
   const brand = useSelector(selectAuthCurrentBrand) || 'All Brands'
   const gateway = useSelector(selectAuthGatewayReport) || PaymentGatewayName.PW
   const currentOpId = useSelector(selectAuthOperator)
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

   const handleUpdateBrand = (event: SelectChangeEvent) => {
      store.dispatch(saveCurrentBrand(event.target.value))
      if (router.pathname === '/transactions/report') {
         router.push(
            `/transactions/report?gateway=${gateway}&opId=${currentOpId}${
               event.target.value !== 'All Brands'
                  ? '&brandId=' + event.target.value
                  : ''
            }`
         )
      }
   }

   useEffect(() => {
      if (
         router.pathname === '/verification' &&
         brand === 'All Brands' &&
         brands.length > 0
      ) {
         store.dispatch(saveCurrentBrand(brands[0].brandId))
      } else if (brands.length === 0) {
         store.dispatch(saveCurrentBrand(null))
      }
   }, [router.pathname, brands])

   return (
      <React.Fragment>
         <Grid item ml={2} xs={12}>
            <FormControl
               size="small"
               sx={{
                  marginTop: 0,
                  width: isDesktop ? 'auto' : '100%',
                  svg: {
                     marginRight: '5px',
                  },
                  '.MuiInputBase-root': {
                     p: isDesktop ? '4px 8px!important' : 0,
                  },
               }}
            >
               <Select
                  value={brand}
                  onChange={handleUpdateBrand}
                  size="small"
                  IconComponent={() => (
                     <FontAwesomeIcon
                        icon={faAngleDown as IconProp}
                        className="selectIcon"
                        size="sm"
                     /> // Use FontAwesome icon as the select icon
                  )}
                  sx={{
                     bgcolor: 'transparent',
                     color: theme.palette.primary.contrastText,
                     minHeight: 'initial',
                     padding: '0 !important',
                     textTransform: 'capitalize',
                     '.MuiSelect-select': {
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                     },
                     '.MuiInputBase-input': {
                        pr: isDesktop ? '16px !important' : '26px !important',
                     },
                     width: isDesktop ? 'auto' : '100%',
                     fieldset: {
                        border: `1px solid ${darkPurple[6]} !important`,
                     },
                     svg: {
                        color: darkPurple[12],
                        right: '0px !important',
                        top: isDesktop ? '9px !important' : '5px !important',
                     },
                  }}
               >
                  {router.pathname !== '/verification' && (
                     <MenuItem
                        sx={{
                           minWidth: '10ch',
                        }}
                        value="All Brands"
                     >
                        {'All Brands'}
                     </MenuItem>
                  )}

                  {brands?.map((item: Brand, key: number) => (
                     <MenuItem
                        key={`${item.brandId}-${key}`}
                        value={item.brandId}
                        sx={{
                           minWidth: '10ch',
                        }}
                     >
                        {item.brandId} - {item.brandName}
                     </MenuItem>
                  ))}
               </Select>
            </FormControl>
         </Grid>
      </React.Fragment>
   )
}

export default BrandsFilter
