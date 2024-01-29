import React, { useState } from 'react'

import { Box, Collapse, CssBaseline, Paper as MuiPaper } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { spacing } from '@mui/system'

import GlobalStyle from '@/components/GlobalStyle'
import Navbar from '@/components/navbar/Navbar'
import Sidebar from '@/components/sidebar/Sidebar'
import dashboardItems from '@/components/sidebar/dashboardItems'

const drawerWidth = 220
const Root = styled('div')`
   display: flex;
   min-height: 100vh;
`

const AppContent = styled('div')`
   flex: 1;
   display: flex;
   flex-direction: column;
   max-width: 100%;
`

const Paper = styled(MuiPaper)(spacing)

const MainContent = styled(Paper)`
   flex: 1;
   background: ${(props) => props.theme.palette.background.default};

   @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      flex: none;
   }

   .MuiPaper-root .MuiPaper-root {
      box-shadow: none;
   }
   padding-bottom: 8px;
`

interface DashboardType {
   children?: React.ReactNode
   title?: string
}
const Dashboard: React.FC<DashboardType> = ({ children, title }) => {
   const [mobileOpen, setMobileOpen] = useState(false)
   const [open, setOpen] = useState(true)
   const theme = useTheme()
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen)
      setOpen(true)
   }
   return (
      <Root>
         <CssBaseline />
         <GlobalStyle />
         <Collapse orientation="horizontal" in={mobileOpen} collapsedSize={0}>
            <Sidebar
               PaperProps={{ style: { width: drawerWidth } }}
               variant="temporary"
               open={mobileOpen}
               onClose={handleDrawerToggle}
               onOpenDrawer={handleDrawerToggle}
               items={dashboardItems}
               opentext={open}
            />
         </Collapse>
         <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Collapse
               orientation="horizontal"
               in={open}
               collapsedSize={drawerWidth}
            >
               <Sidebar
                  PaperProps={{
                     style: { width: drawerWidth },
                  }}
                  items={dashboardItems}
                  opentext={true}
                  open={false}
                  onOpenDrawer={handleDrawerToggle}
               />
            </Collapse>
         </Box>
         <AppContent>
            <Navbar
               onDrawerToggle={handleDrawerToggle}
               title={title as string}
            />
            <MainContent p={0} pt={0} pb={0} m={0}>
               {children}
            </MainContent>
         </AppContent>
      </Root>
   )
}

export default Dashboard
