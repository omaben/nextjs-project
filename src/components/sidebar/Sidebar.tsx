import styled from '@emotion/styled'
import { Drawer as MuiDrawer, useTheme } from '@mui/material'
import React from 'react'
import { SidebarItemsType } from '../../types/sidebar'
import Footer from '../Footer'
import SidebarHeader from './SidebarHeader'
import SidebarNav from './SidebarNav'

const Drawer = styled(MuiDrawer)`
   border-right: 0;

   > div {
      border-right: 0;
   }
`

export interface SidebarProps {
   PaperProps: {
      style: {
         width: number
      }
   }
   variant?: 'permanent' | 'persistent' | 'temporary'
   open?: boolean
   onClose?: () => void
   items: {
      title: string
      pages: SidebarItemsType[]
   }[]
   showFooter?: boolean
   opentext: Boolean
   onOpenDrawer?: React.MouseEventHandler<HTMLElement>
}

const Sidebar = ({
   items,
   showFooter = true,
   opentext,
   onOpenDrawer,
   ...rest
}: SidebarProps) => {
   const theme = useTheme()
   return (
      <Drawer variant="permanent" elevation={4} {...rest}>
         <SidebarHeader />
         <SidebarNav
            items={items}
            opentext={opentext}
            onOpenDrawer={onOpenDrawer}
         />
         {showFooter && <Footer />}
      </Drawer>
   )
}

export default Sidebar
