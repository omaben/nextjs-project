import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Box,
   Grid,
   AppBar as MuiAppBar,
   IconButton as MuiIconButton,
   Stack,
   Toolbar,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PortalSelectCurrency from '../custom/PortalSelectCurrency'
import PortalSelectTimezone from '../custom/PortalSelectTimezone'
import ActionCrash from '../pages/dashboard/crash/Actions'
import NavbarNotificationsDropdown from './NavbarNotificationsDropdown'

const AppBar = styled(MuiAppBar)`
   background: ${(props) => props.theme.header.background};
   color: ${(props) => props.theme.header.color};
`
const IconButton = styled(MuiIconButton)`
   svg {
      width: 22px;
      height: 22px;
   }
`

// Prop types for Navbar component
interface NavbarProps {
   onDrawerToggle: React.MouseEventHandler<HTMLElement>
   title: string
   goBack?: any // You can replace this with a more specific type if needed
}

const Navbar: React.FC<NavbarProps> = ({ onDrawerToggle, title, goBack }) => {
   const { t } = useTranslation()
   const router = useRouter()
   const theme = useTheme()
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const isMdUp = useMediaQuery(theme.breakpoints.up('md'))

   // Function to determine whether to show the Action component
   const handleShowAction = () => {
      return isMdUp
   }

   // Function to determine whether to show the currencies
   const handleShowCurrencies = () => {
      return (
         router.pathname !== '/tableReports/operatorReports' &&
         router.pathname !== '/exchange'
      )
   }

   // Function to determine whether to show the timezone
   const handleShowTimezone = () => {
      return (
         router.pathname !== '/tableReports/operatorReports' &&
         router.pathname !== '/exchange' &&
         router.pathname !== '/tableReports/operatorReports/details'
      )
   }

   return (
      <AppBar
         sx={{
            px: isLgUp ? '12px' : 0,
            boxShadow: 0,
         }}
         position="sticky"
         elevation={3}
      >
         <Toolbar
            sx={{
               flexDirection: 'column',
               justifyContent: 'center',
               height: isMdUp ? '44px' : '38px',
               minHeight: '38px !important',
               px: '4px',
            }}
         >
            <Stack
               direction="row"
               alignItems="center"
               justifyContent="space-between"
               width="100%"
            >
               <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={onDrawerToggle}
                  size="medium"
                  sx={{ display: { xs: 'flex', md: 'none' } }}
               >
                  <FontAwesomeIcon
                     icon={faBars as IconProp}
                     fontSize={'12px'}
                     color={theme.palette.info.contrastText}
                     fixedWidth
                  />
               </IconButton>
               {handleShowAction() && (
                  <Stack
                     direction="row"
                     display={['none', null, 'flex']}
                     alignItems="center"
                     gap={[2, null, 4]}
                     flexWrap="wrap"
                  >
                     <ActionCrash />
                  </Stack>
               )}
               <Stack direction="row">
                  <Stack direction="row" display={['none', null, 'block']}>
                     <NavbarNotificationsDropdown />
                     {handleShowCurrencies() && <PortalSelectCurrency />}
                     {handleShowTimezone() && <PortalSelectTimezone />}
                  </Stack>
                  <Box display={['block', null, 'none']}>
                     <Grid
                        alignItems={'left'}
                        justifyContent="start"
                        container
                        spacing={1}
                     >
                        <Grid item>
                           <NavbarNotificationsDropdown />
                        </Grid>
                        {handleShowCurrencies() && (
                           <Grid item>
                              <PortalSelectCurrency />
                           </Grid>
                        )}
                        {handleShowTimezone() && (
                           <Grid item>
                              <PortalSelectTimezone />
                           </Grid>
                        )}
                     </Grid>
                  </Box>
               </Stack>
            </Stack>
         </Toolbar>
      </AppBar>
   )
}

export default Navbar
