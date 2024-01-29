import CustomLoader from '@/components/custom/CustomLoader'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import WalletBalance from '@/components/data/transactions/wallet-balance-grid'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faArrowsRotate } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Button,
   Grid,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { darkPurple } from 'colors'
import React, { ReactElement, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { saveWalletBalance } from 'redux/authSlice'
import { saveLoadingWalletBalanceList } from 'redux/loadingSlice'
import { store } from 'redux/store'
import DashboardLayout from '../../layouts/Dashboard'

function WalletBalanceList() {
   const theme = useTheme()
   const [ignore, setIgnore] = React.useState(false)
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const [autoRefresh, setAutoRefresh] = React.useState(0)

   useEffect(() => {
      if (!ignore) {
         store.dispatch(saveLoadingWalletBalanceList(true))
         store.dispatch(saveWalletBalance({}))
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   })

   return (
      <React.Fragment>
         <Helmet title={`iMoon | Wallet Balance`} />
         <CustomOperatorsBrandsToolbar
            title={isDesktop ? ' Wallet Balance' : ' '}
            filter={false}
            background={theme.palette.secondary.dark}
            brandFilter={isDesktop ? false : true}
            operatorFilter={isDesktop ? false : true}
            actions={
               <Grid item>
                  <Button
                     onClick={() => setAutoRefresh(autoRefresh + 1)}
                     color="primary"
                     variant={isDesktop ? 'outlined' : 'text'}
                     sx={{
                        p: isDesktop ? '4px 8px 4px 8px' : 0,
                        borderRadius: '8px',
                        height: '28px',
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
            <WalletBalance autoRefresh={autoRefresh} />
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

WalletBalanceList.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Wallet Balance">{page}</DashboardLayout>
}

export default WalletBalanceList
