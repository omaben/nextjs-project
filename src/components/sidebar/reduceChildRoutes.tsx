import {
   IntegrationType,
   Operator,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
   selectAuthBrands,
   selectAuthCurrentOperator,
   selectAuthOperators,
   selectAuthPermissions,
} from 'redux/authSlice';
import { getUser } from '../../redux/slices/user';
import { ENV, MenuModules, Modules } from '../../types';
import { SidebarItemsType } from '../../types/sidebar';
import SidebarNavList from './SidebarNavList';
import SidebarNavListItem from './SidebarNavListItem';
import { store } from 'redux/store';

interface ReduceChildRoutesProps {
   depth: number;
   page: SidebarItemsType;
   items: JSX.Element[];
   currentRoute: string;
   opentext: Boolean;
   onOpenDrawer?: React.MouseEventHandler<HTMLElement>;
}

const ReduceChildRoutes = (props: ReduceChildRoutesProps) => {
   const { t } = useTranslation();
   const { items, page, depth, currentRoute, opentext, onOpenDrawer } = props;
   const operators = useSelector(selectAuthOperators);
   const brands = useSelector(selectAuthBrands);
   const currenctOperator = useSelector(selectAuthCurrentOperator) as Operator;
   const user = useSelector(getUser) as User;
   const server = store.getState().auth.server;
   // const permissions = useSelector(selectAuthPermissions) as any[];
   // const findIndex = permissions.findIndex(
   //    (permission) => permission.event === page.permission
   // );
   // if (
   //    (findIndex > -1 &&
   //       permissions[findIndex].scopes?.includes(user?.scope)) ||
   //    page.type === MenuModules.DASHBOARD
   // ) {
   if (page.module.includes(user?.scope)) {
      if (page.children) {
         const open = currentRoute.includes(page.href);
         items.push(
            <SidebarNavListItem
               depth={depth}
               icon={page.icon}
               key={page.title}
               badge={page.badge}
               open={!!open}
               title={t(page.title)}
               href={page.href}
               opentext={opentext}
               onOpenDrawer={onOpenDrawer}
               type={page.type as Modules}
               permission={page.permission as UserPermissionEvent}
               section={page.section}
            >
               <SidebarNavList
                  opentext={opentext}
                  depth={depth + 1}
                  pages={page.children}
                  onOpenDrawer={onOpenDrawer}
               />
            </SidebarNavListItem>
         );
      } else {
         if (
            page.type === MenuModules.STATS ||
            (page.type === MenuModules.STATSC &&
               ([UserScope.SUPERADMIN, UserScope.ADMIN].includes(user.scope) ||
                  (![UserScope.SUPERADMIN, UserScope.ADMIN].includes(
                     user.scope
                  ) &&
                     currenctOperator.integrationType ===
                        IntegrationType.ALIEN_STANDALONE)))
         ) {
            if (
               user?.scope === UserScope.SUPERADMIN ||
               user?.scope === UserScope.ADMIN
            ) {
               if (page.type === MenuModules.STATS && server === ENV.DEV) {
                  items.push(
                     <SidebarNavListItem
                        type={page.type as MenuModules}
                        depth={depth}
                        href={`/tableReports/operatorReports/details?opId=all`}
                        icon={page.icon}
                        key={'All_Operators'}
                        badge={page.badge}
                        title={`All Operators`}
                        opentext={opentext}
                        onOpenDrawer={onOpenDrawer}
                        permission={page.permission as UserPermissionEvent}
                        section={page.section}
                     />
                  );
               }
               operators &&
                  operators.count > 0 &&
                  operators.operators.map((item: Operator) => {
                     if (
                        page.type === MenuModules.STATS ||
                        (page.type === MenuModules.STATSC &&
                           item.integrationType ===
                              IntegrationType.ALIEN_STANDALONE)
                     ) {
                        items.push(
                           <SidebarNavListItem
                              type={page.type as MenuModules}
                              depth={depth}
                              href={
                                 page.type === MenuModules.STATSC
                                    ? `/tableReports/operatorReports/detailsB2c?opId=${item.opId}`
                                    : `/tableReports/operatorReports/details?opId=${item.opId}`
                              }
                              icon={page.icon}
                              key={item.title}
                              badge={page.badge}
                              title={`${item.opId} - ${item.title}`}
                              opentext={opentext}
                              onOpenDrawer={onOpenDrawer}
                              permission={
                                 page.permission as UserPermissionEvent
                              }
                              section={page.section}
                           />
                        );
                     }
                  });
            } else if (
               user &&
               user?.scope === UserScope.BRAND &&
               brands &&
               brands?.length > 0
            ) {
               items.push(
                  <SidebarNavListItem
                     type={page.type}
                     depth={depth}
                     href={
                        page.type === MenuModules.STATSC
                           ? `/tableReports/operatorReports/detailsB2c?opId=${user.opId}`
                           : `/tableReports/operatorReports/details?opId=${user.opId}`
                     }
                     icon={page.icon}
                     key={'Report'}
                     badge={page.badge}
                     title={`${brands[0].brandName}`}
                     opentext={opentext}
                     onOpenDrawer={onOpenDrawer}
                     permission={page.permission as UserPermissionEvent}
                     section={page.section}
                  />
               );
            } else {
               items.push(
                  <SidebarNavListItem
                     type={page.type}
                     depth={depth}
                     href={
                        page.type === MenuModules.STATSC
                           ? `/tableReports/operatorReports/detailsB2c?opId=${currenctOperator.opId}`
                           : `/tableReports/operatorReports/details?opId=${currenctOperator.opId}`
                     }
                     icon={page.icon}
                     key={'Report'}
                     badge={page.badge}
                     title={`${currenctOperator.opId} - ${currenctOperator.title}`}
                     opentext={opentext}
                     onOpenDrawer={onOpenDrawer}
                     permission={page.permission as UserPermissionEvent}
                     section={page.section}
                  />
               );
            }
         } else {
            items.push(
               <SidebarNavListItem
                  type={page.type as Modules}
                  depth={depth}
                  href={page.href}
                  icon={page.icon}
                  key={page.title}
                  badge={page.badge}
                  title={t(page.title)}
                  opentext={opentext}
                  onOpenDrawer={onOpenDrawer}
                  permission={page.permission as UserPermissionEvent}
                  section={page.section}
               />
            );
         }
      }
   }

   return items;
};

export default ReduceChildRoutes;
