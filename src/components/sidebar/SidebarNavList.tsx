import React from 'react'

import ReduceChildRoutes from './reduceChildRoutes'

import { SidebarItemsType } from '../../types/sidebar'
import { useRouter } from 'next/router'

interface SidebarNavListProps {
   depth: number
   pages: SidebarItemsType[]
   opentext: Boolean
   onOpenDrawer?: React.MouseEventHandler<HTMLElement>
}

const SidebarNavList = (props: SidebarNavListProps) => {
   const { pages, depth, opentext, onOpenDrawer } = props
   const { pathname } = useRouter()

   const childRoutes = pages.reduce(
      (items, page) =>
         ReduceChildRoutes({
            items,
            page,
            currentRoute: pathname,
            depth,
            opentext,
            onOpenDrawer,
         }),
      [] as JSX.Element[]
   )

   return <React.Fragment>{childRoutes}</React.Fragment>
}

export default SidebarNavList
