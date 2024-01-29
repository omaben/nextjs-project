import CustomLoader from '@/components/custom/CustomLoader'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import ActiveOperatorPaymentGatewayData from '@/components/data/payments/active-operator-payments-grid'
import { useTheme } from '@emotion/react'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faArrowsRotate } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Grid, Typography, useMediaQuery } from '@mui/material'
import { darkPurple } from 'colors'
import React, { ReactElement, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import {
   savePaymentsGateway,
   selectAuthCurrentBrand,
   selectAuthOperator,
} from 'redux/authSlice'
import { saveLoadingPaymentsGateway } from 'redux/loadingSlice'
import { store } from 'redux/store'
import DashboardLayout from '../../layouts/Dashboard'

function PaymentsList() {
   const [ignore, setIgnore] = React.useState(false)
   const theme = useTheme()
   const opId = useSelector(selectAuthOperator)
   const brandId = useSelector(selectAuthCurrentBrand)
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const [autoRefresh, setAutoRefresh] = React.useState(0)

   useEffect(() => {
      if (!ignore) {
         store.dispatch(saveLoadingPaymentsGateway(true))
         store.dispatch(savePaymentsGateway([]))
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   })

   return (
      <React.Fragment>
         <Helmet title="iMoon | Payment gateways" />
         <CustomOperatorsBrandsToolbar
            title={isDesktop ? 'Payment gateways' : ' '}
            brandFilter={!isDesktop && true}
            operatorFilter={!isDesktop && true}
            background={theme.palette.secondary.dark}
            actions={
               <Grid item>
                  <Button
                     onClick={() => setAutoRefresh(autoRefresh + 1)}
                     color="primary"
                     variant={isDesktop ? 'outlined' : 'text'}
                     sx={{
                        p: isDesktop ? '4px 8px 4px 8px' : 0,
                        height: '28px',
                        borderRadius: '8px',
                        justifyContent: isDesktop ? 'initial' : 'end',
                        minWidth: 'auto !important',
                        borderColor: `${darkPurple[12]} !important`,
                        svg: {
                           width: '16px !important',
                        },
                        gap: '10px',
                     }}
                  >
                     <FontAwesomeIcon
                        icon={faArrowsRotate as IconProp}
                        fixedWidth
                        fontSize={'16px'}
                        color={darkPurple[12]}
                     />
                     {isDesktop && (
                        <Typography
                           component="p"
                           variant="button"
                           fontFamily={'Nunito Sans SemiBold'}
                           fontSize={'14px'}
                           whiteSpace="nowrap"
                           color={darkPurple[12]}
                        >
                           Refresh
                        </Typography>
                     )}
                  </Button>
               </Grid>
            }
         />
         {ignore ? (
            <ActiveOperatorPaymentGatewayData
               key={'list'}
               opId={opId}
               autoRefresh={autoRefresh}
               brandId={brandId === 'All Brands' ? '' : brandId}
            />
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

PaymentsList.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Payment gateways">{page}</DashboardLayout>
}

export default PaymentsList
