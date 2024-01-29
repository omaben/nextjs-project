import {
   useGetOperatorListQuery,
   useGetOperatorQuery,
} from '@/components/data/operators/lib/hooks/queries'
import {
   IntegrationType,
   Operator,
   PaymentGatewayName,
} from '@alienbackoffice/back-front'
import { OperatorList } from '@alienbackoffice/back-front/lib/operator/interfaces/operator-list.interface'
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
import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'
import {
   saveCurrencyOption,
   saveCurrentOp,
   saveCurrentOpData,
   selectAuthCurrentBrand,
   selectAuthGatewayReport,
   selectAuthOperator,
   selectAuthOperators,
} from 'redux/authSlice'
import { store } from 'redux/store'
import { curenciesType } from 'types'

function OpList() {
   const router = useRouter()
   const theme = useTheme()
   const opId = useSelector(selectAuthOperator)
   const operators = useSelector(selectAuthOperators) as OperatorList
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const gateway = useSelector(selectAuthGatewayReport) || PaymentGatewayName.PW
   const currentBrandId = useSelector(selectAuthCurrentBrand)

   useGetOperatorListQuery({
      isAssociated: true,
      key: 'navBar',
   })

   useGetOperatorQuery({
      opId: opId,
      key: 'navBar',
   })

   const UpdateDB = (event: SelectChangeEvent) => {
      store.dispatch(saveCurrentOp(event.target.value))
      store.dispatch(saveCurrencyOption(curenciesType[1]))
      const operator = operators.operators.find(
         (item: Operator) => item.opId === event.target.value
      )
      store.dispatch(saveCurrentOpData(operator))
      if (router.pathname === '/tableReports/operatorReports/details') {
         router.push(
            `/tableReports/operatorReports/details?opId=${event.target.value}`
         )
      }
      if (router.pathname === '/tableReports/operatorReports/detailsB2c') {
         if (operator?.integrationType === IntegrationType.ALIEN_STANDALONE) {
            router.push(
               `/tableReports/operatorReports/detailsB2c?opId=${event.target.value}`
            )
         } else {
            router.push(
               `/tableReports/operatorReports/details?opId=${event.target.value}`
            )
         }
      }
      if (router.pathname === '/transactions/report') {
         router.push(
            `/transactions/report?gateway=${gateway}&opId=${
               event.target.value
            }${
               currentBrandId !== 'All Brands'
                  ? '&brandId=' + currentBrandId
                  : ''
            }`
         )
      }

      if (router.pathname === '/operators/details') {
         router.push(`/operators/details?id=${event.target.value}`)
      }
      if (
         (router.pathname.includes('/transactions') ||
            router.pathname.includes('operator-transactions') ||
            router.pathname.includes('activities') ||
            router.pathname.includes('payments')) &&
         operator &&
         operator?.integrationType !== IntegrationType.ALIEN_STANDALONE
      ) {
         router.push(`/dashboard`)
      }
   }

   return (
      <React.Fragment>
         <Grid item ml={2} xs={12}>
            <FormControl
               size="small"
               sx={{
                  width: isDesktop ? 'auto' : '100%',
                  marginTop: 0,
                  svg: {
                     marginRight: '5px',
                  },
                  '.MuiInputBase-root': {
                     p: isDesktop ? '4px 8px!important' : 0,
                  },
               }}
            >
               <Select
                  value={opId}
                  onChange={UpdateDB}
                  size="small"
                  sx={{
                     bgcolor: 'transparent',
                     color: theme.palette.primary.contrastText,
                     minHeight: 'initial',
                     padding: '0 !important',
                     textTransform: 'capitalize',
                     '.MuiSelect-select': {
                        p: 1,
                        alignItems: 'center',
                     },
                     '.MuiInputBase-input': {
                        pr: isDesktop ? '16px !important' : '26px !important',
                        display: 'flex',
                     },
                     fieldset: {
                        border: `1px solid ${darkPurple[6]} !important`,
                     },
                     width: isDesktop ? 'auto' : '100%',
                     svg: {
                        color: darkPurple[12],
                        right: '0px !important',
                        top: isDesktop ? '9px !important' : '5px !important',
                     },
                  }}
                  IconComponent={() => (
                     <FontAwesomeIcon
                        icon={faAngleDown as IconProp}
                        className="selectIcon"
                        size="sm"
                     />
                  )}
               >
                  {operators &&
                     operators?.operators &&
                     operators?.operators.length > 0 &&
                     operators?.operators?.map(
                        (item: Operator, index: number) => {
                           return (
                              <MenuItem key={`opId${index}`} value={item.opId}>
                                 {item.opId} - {item.title}
                              </MenuItem>
                           )
                        }
                     )}
               </Select>
            </FormControl>
         </Grid>
      </React.Fragment>
   )
}

export default OpList
