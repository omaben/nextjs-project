import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { List } from '@mui/material'
import { SxProps, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import React from 'react'
import ReactPerfectScrollbar from 'react-perfect-scrollbar'

import { SidebarItemsType } from '../../types/sidebar'
import SidebarNavSection from './SidebarNavSection'

const Items = styled.div`
   padding-top: ${(props) => props.theme.spacing(1)};
   padding-bottom: ${(props) => props.theme.spacing(1)};
`

interface SidebarNavProps {
   items: {
      title: string
      pages: SidebarItemsType[]
   }[]
   opentext: Boolean
   onOpenDrawer?: React.MouseEventHandler<HTMLElement>
}

const styles: SxProps<Theme> = {
   '&, .navItems': {
      height: 1,
   },
   overflow: 'auto',
   '.navItems': {
      display: 'flex',
      flexDirection: 'column',
      a: {
         mt: 'auto !important',
      },
   },
}

const SidebarNav = ({ items, opentext, onOpenDrawer }: SidebarNavProps) => {
   const theme = useTheme()
   const matches = useMediaQuery(theme.breakpoints.up('sm'))
   const baseScrollbar = (props: any) => css`
      background-color: #332c4a;
      border-right: 1px solid rgba(0, 0, 0, 0.12);
      ${ 'height: calc(100% - 220px)'};
      overflow: auto;
   `

   const Scrollbar = styled.div`
      ${baseScrollbar}
   `

   const PerfectScrollbar = styled(ReactPerfectScrollbar)`
      ${baseScrollbar}
   `
   const ScrollbarComponent = matches ? PerfectScrollbar : Scrollbar

   return (
      <ScrollbarComponent>
         <List disablePadding sx={styles}>
            <Items className="navItems">
               {items &&
                  items.map((item, index) => (
                     <SidebarNavSection
                        component="div"
                        key={item.title + index}
                        pages={item.pages}
                        title={item.title}
                        opentext={opentext}
                        onOpenDrawer={onOpenDrawer}
                     />
                  ))}
            </Items>
         </List>
      </ScrollbarComponent>
   )
}

export default SidebarNav
