import styled from '@emotion/styled';
import Link from 'next/link';
import { rgba } from 'polished';
import React from 'react';

import {
   IntegrationType,
   Operator,
   PaymentGatewayName,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front';
import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
   Box,
   Chip,
   Collapse,
   Divider,
   ListItemButton,
   ListItemProps,
   ListItemText,
   Tooltip,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import { useSelector } from 'react-redux';
import {
   selectAuthCurrentBrand,
   selectAuthCurrentOperator,
   selectAuthOperator,
   selectAuthPendingVerification,
   selectAuthServer,
} from 'redux/authSlice';
import { getUser } from 'redux/slices/user';
import { store } from 'redux/store';
import {
   hasDetailsPermission,
   hasPermission,
} from 'services/permissionHandler';
import { ENV, MenuModules, Modules } from 'types';
import {
   UseGetPlayersListQueryProps,
   useGetPlayersPendingVerificationQuery,
} from '../data/players/lib/hooks/queries';

interface ItemProps {
   activeclassname?: string;
   onClick?: () => void;
   to?: string;
   component?: typeof Link;
   depth: number;
}

interface TitleInterface {
   depth: number;
}

const Title = styled(ListItemText)<TitleInterface>`
   margin: 0;
   span {
      padding: 0 ${(props) => props.theme.spacing(4)};
   }
`;

const Badge = styled(Chip)`
   border-radius: 0px 4px 4px 0px;
   opacity: 0.8;
   background: #e31b54;
   z-index: 1;
   box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.25);
   height: 19px;
   padding: 2px;
   span.MuiChip-label,
   span.MuiChip-label:hover {
      font-size: 12px;
      cursor: pointer;
      font-family: Nunito Sans semiBold;
      line-height: 13.92px;
      color: ${(props) => props.theme.sidebar.badge.color};
      padding-left: ${(props) => props.theme.spacing(2)};
      padding-right: ${(props) => props.theme.spacing(2)};
   }
`;
const BadgeBox = styled(Box)`
   height: 27px;
   position: absolute;
   right: 10px;
   border-radius: 1px;
   padding: 4px 0;
   top: 3px;
   z-index: 1;
   border-left: 1px solid #110c20;
`;

const ExpandLessIcon = styled(ExpandLess)`
   color: ${(props) => rgba('#A39EB4', 0.5)};
`;

const ExpandMoreIcon = styled(ExpandMore)`
   color: ${(props) => rgba('#A39EB4', 0.5)};
`;

interface SidebarNavListItemProps extends ListItemProps {
   className?: string;
   depth: number;
   href: string;
   icon?: IconDefinition;
   badge?: string;
   open?: boolean;
   title: string;
   opentext: Boolean;
   permission: UserPermissionEvent;
   type?: Modules | MenuModules;
   section: number;
   onOpenDrawer?: React.MouseEventHandler<HTMLElement>;
}

const SidebarNavListItem = (props: SidebarNavListItemProps) => {
   const {
      title,
      href,
      depth = 0,
      children,
      icon,
      badge,
      opentext,
      open: openProp = false,
      type,
      section,
      permission,
      onOpenDrawer,
   } = props;

   const theme = useTheme();
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const [dataSort, setDataSort]: any = React.useState({
      createdAt: -1,
   });
   const opId = useSelector(selectAuthOperator);
   const brandId = useSelector(selectAuthCurrentBrand);
   const user = useSelector(getUser) as User;
   // State to track loading status

   const post: UseGetPlayersListQueryProps = {
      opId,
      sort: dataSort,
      page: 0,
      limit: 1,
      refresh: 0,
   };
   if (brandId && brandId !== 'All Brands') {
      post.brandId = brandId;
   }
   useGetPlayersPendingVerificationQuery(post);
   const pendingVerification = useSelector(
      selectAuthPendingVerification
   ) as number;
   const [open, setOpen] = React.useState(openProp);
   const handleToggle = () => {
      setOpen((state) => !state);
   };
   const server = useSelector(selectAuthServer);
   const operator = useSelector(selectAuthCurrentOperator) as Operator;

   const MenuWithDivider = [MenuModules.DASHBOARD];

   // handle first divider

   if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_START_GAME_CORE_REALTIME_REQ
      ) &&
      [UserScope.SUPERADMIN, UserScope.ADMIN].includes(user.scope)
   ) {
      MenuWithDivider.push(MenuModules.REALTIME);
   } else if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_GET_FINANCIAL_REPORT_REQ
      ) &&
      [UserScope.SUPERADMIN].includes(user.scope)
   ) {
      MenuWithDivider.push(MenuModules.QUICKREPORT);
   } else if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_GET_FINANCIAL_REPORT_REQ
      ) &&
      [UserScope.SUPERADMIN, UserScope.ADMIN].includes(user.scope)
   ) {
      MenuWithDivider.push(MenuModules.REPORTS);
   } else if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_GET_FINANCIAL_REPORT_REQ
      )
   ) {
      MenuWithDivider.push(MenuModules.STATSC);
   }

   // handle second divider

   if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_CASH_IN_CASH_OUT_LIST_REQ
      ) &&
      [
         IntegrationType.ALIEN_WALLET_TRANSFER,
         IntegrationType.PG_WALLET_TRANSFER,
      ].includes(operator.integrationType as IntegrationType)
   ) {
      MenuWithDivider.push(MenuModules.CASHINGCASHOUT);
   } else if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_GET_ACTIVE_PAYMENT_GATEWAYS_REQ
      ) &&
      operator.integrationType === IntegrationType.ALIEN_STANDALONE
   ) {
      MenuWithDivider.push(MenuModules.PAYMENTS);
   } else if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_OPERATOR_TRANSACTION_LIST_REQ
      ) &&
      [
         IntegrationType.ALIEN_STANDALONE,
         IntegrationType.PG_WALLET_TRANSFER,
         IntegrationType.ALIEN_WALLET_TRANSFER,
      ].includes(operator.integrationType as IntegrationType)
   ) {
      MenuWithDivider.push(MenuModules.OPERATORTRANSACTIONS);
   } else if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_TRANSACTION_LIST_REQ
      ) &&
      [
         IntegrationType.ALIEN_STANDALONE,
         IntegrationType.PG_WALLET_TRANSFER,
         IntegrationType.ALIEN_WALLET_TRANSFER,
      ].includes(operator.integrationType as IntegrationType)
   ) {
      MenuWithDivider.push(MenuModules.TRANSACTIONS);
   } else if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_USER_ACTIVITY_LIST_REQ
      ) &&
      operator.integrationType === IntegrationType.ALIEN_STANDALONE
   ) {
      MenuWithDivider.push(MenuModules.USERACTIVITIES);
   } else if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_PLAYER_ACTIVITY_LIST_REQ
      ) &&
      operator.integrationType === IntegrationType.ALIEN_STANDALONE
   ) {
      MenuWithDivider.push(MenuModules.PLAYERACTIVITIES);
   } else if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_GET_ACTIVE_PAYMENT_GATEWAYS_REQ
      ) &&
      operator.integrationType === IntegrationType.ALIEN_STANDALONE
   ) {
      MenuWithDivider.push(MenuModules.PAYMENTS);
   } else if (
      hasDetailsPermission(UserPermissionEvent.BACKOFFICE_BET_LIST_REQ)
   ) {
      MenuWithDivider.push(MenuModules.BETS);
   } else if (
      hasDetailsPermission(UserPermissionEvent.BACKOFFICE_PLAYER_LIST_REQ)
   ) {
      MenuWithDivider.push(MenuModules.PLAYERS);
   } else if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ
      )
   ) {
      MenuWithDivider.push(MenuModules.BRAND);
   } else if (
      hasDetailsPermission(UserPermissionEvent.BACKOFFICE_OPERATOR_LIST_REQ)
   ) {
      MenuWithDivider.push(MenuModules.OPERATORS);
   }

   // handle third divider

   if (
      hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GAME_CORE_LIST_REQ)
   ) {
      MenuWithDivider.push(MenuModules.GAMECORES);
   } else if (
      hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GAME_LIST_REQ) &&
      [UserScope.SUPERADMIN, UserScope.ADMIN].includes(user.scope)
   ) {
      MenuWithDivider.push(MenuModules.GAMES);
   }

   // handle fourth divider
   if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_GET_TOURNAMENT_V2_IDS_REQ
      ) ||
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_GET_TOURNAMENT_V2_LIST_REQ
      )
   ) {
      MenuWithDivider.push(MenuModules.TOURNAMENTV2);
   } else if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_GET_TOURNAMENT_IDS_REQ
      ) ||
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_GET_TOURNAMENT_LIST_REQ
      )
   ) {
      MenuWithDivider.push(MenuModules.TOURNAMENT);
   }

   const Item = styled(ListItemButton)<ItemProps>`
      padding-top: ${'10px'};
      padding-bottom: ${'10px'};
      padding-left: ${open ? '5px !important' : '10px !important'};
      padding-right: ${'10px'};
      svg {
         font-size: 16px;
         width: 20px;
         opacity: 1;
         color: #a39eb4;
      }
      &:hover {
         background: rgba(0, 0, 0, 0.08);
         color: ${(props) => props.theme.sidebar.color};
      }
      span {
         font-family: Nunito Sans Bold;
         font-size: 14px !important;
         color: #a39eb4;
         line-height: 16.24px;
      }
      &.${(props) => props.activeclassname} {
         background: linear-gradient(
            90deg,
            #1f1933 2.22%,
            rgba(31, 25, 51, 0) 96.39%
         );
         border-left: 4px solid #89123e;
         span {
            color: ${(props) => '#fff'};
         }
         svg {
            color: ${(props) => '#EDEBF4'} !important;
         }
         svg path {
            stroke: ${(props) => '#EDEBF4'} !important;
         }
      }
   `;

   if (
      type === MenuModules.BRANDDETAILS &&
      !hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_GET_ACTIVE_PAYMENT_GATEWAYS_REQ
      ) &&
      !hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_GET_MESSAGES_IN_LANGUAGE_REQ
      ) &&
      !hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_GET_KYC_VERIFICATIONS_REQ
      )
   ) {
      return;
   } else if (
      type !== MenuModules.BRANDDETAILS &&
      !hasPermission(
         permission,
         operator?.integrationType as IntegrationType,
         type as MenuModules
      )
   ) {
      return;
   } else if (
      [MenuModules.GAMESV2].includes(type as MenuModules) &&
      server !== ENV.DEV
   ) {
      return;
   } else if (
      [MenuModules.STATSC].includes(type as MenuModules) &&
      ![UserScope.SUPERADMIN, UserScope.ADMIN].includes(user.scope) &&
      operator.integrationType !== IntegrationType.ALIEN_STANDALONE
   ) {
      return;
   } else if (
      [MenuModules.REALTIME].includes(type as MenuModules) &&
      (![UserScope.SUPERADMIN, UserScope.ADMIN].includes(user.scope) ||
         !hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GAME_CORE_LIST_REQ
         ) ||
         !hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_START_GAME_CORE_REALTIME_REQ
         ) ||
         !hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_STOP_GAME_CORE_REALTIME_REQ
         ))
   ) {
      return;
   } else {
      if (children) {
         return (
            <>
               <Item
                  depth={depth}
                  onClick={handleToggle}
                  disableGutters
                  sx={{
                     borderLeft: open ? '4px solid #89123e' : 'none',
                     background: open
                        ? 'linear-gradient(90deg, #1F1933 2.22%, rgba(31, 25, 51, 0.00) 96.39%)'
                        : 'initial',
                     paddingLeft: open ? '5px !important' : '10px !important',
                     svg: {
                        color: '#A39EB4',
                     },
                     span: {
                        color: open ? '#fff !important' : '#A39EB4 !improtant',
                     },
                  }}
               >
                  {icon && <FontAwesomeIcon icon={icon} />}
                  <Title depth={depth}>
                     {opentext && title}
                     {badge && <Badge label={badge} />}
                  </Title>
                  {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
               </Item>
               {MenuWithDivider.includes(type as MenuModules) && (
                  <Divider
                     sx={{
                        borderStyle: 'dashed',
                        borderColor: '#A39EB4',
                     }}
                  />
               )}
               <Box
                  className="submenu1"
                  sx={{
                     '.MuiButtonBase-root': {
                        paddingY: 0,
                        paddingLeft: '18px !important',
                        background: 'initial',
                        borderLeft: 'none',
                     },
                     ' .MuiListItemText-root': {
                        paddingTop: '8px',
                        paddingBottom: '5px',
                     },
                     span: {
                        color: '#5C5474 !important',
                     },
                     '.active span': {
                        color: '#EDEBF4 !important',
                     },
                  }}
               >
                  <Collapse
                     in={open}
                     sx={{
                        background: '#1F1933',
                        paddingBottom: open ? '8px' : 0,
                        paddingTop: open ? '4px' : 0,
                     }}
                     className="submenu"
                  >
                     {children}
                  </Collapse>
               </Box>
            </>
         );
      }

      const item = () => (
         <Item
            depth={depth}
            className={window.location.href.includes(href) ? 'active' : ''}
            activeclassname="active"
         >
            {icon && (
               <FontAwesomeIcon
                  icon={icon}
                  color={
                     window.location.href.includes(href) ? '#CACDD2' : '#60636A'
                  }
               />
            )}
            {opentext && (
               <Title depth={depth}>
                  {title}
                  {badge && pendingVerification > 0 && (
                     <BadgeBox>
                        <Badge label={pendingVerification} />
                     </BadgeBox>
                  )}
               </Title>
            )}
         </Item>
      );
      const opId = store.getState().auth.operator;
      const brandId = store.getState().auth.currentBrand;
      const gateway =
         store.getState().auth.gatewayReport || PaymentGatewayName.PW;
      return (
         <Link
            href={
               type === MenuModules.BRANDDETAILS
                  ? `/brands/details?id=${opId}&brandId=${brandId}`
                  : type === MenuModules.GATEWAYREPORT
                  ? `/transactions/report?gateway=${gateway}&opId=${opId}${
                       brandId !== 'All Brands' ? '&brandId=' + brandId : ''
                    } `
                  : href
            }
            passHref
            onClick={!isDesktop ? onOpenDrawer : () => {}}
            style={{ all: 'unset' }}
         >
            {!opentext ? (
               <Tooltip title={title} arrow placement="right">
                  {item()}
               </Tooltip>
            ) : (
               item()
            )}
            {MenuWithDivider.includes(type as MenuModules) && (
               <Divider
                  sx={{
                     borderStyle: 'dashed',
                     borderColor: '#A39EB4',
                  }}
               />
            )}
         </Link>
      );
   }
};

export default SidebarNavListItem;
