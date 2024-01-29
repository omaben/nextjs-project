import styled from '@emotion/styled';
import React from 'react';
import { User, UserPermissionEvent } from '@alienbackoffice/back-front';
import { Chip, Grid, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/system';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectAuthOperator, selectAuthServer } from 'redux/authSlice';
import { getUser } from 'redux/slices/user';
import { hasDetailsPermission } from 'services/permissionHandler';
import { COLORBADGEENV, ENV } from '../../../../types';
import BrandsFilter from '../default/brands';
import OpList from './list-operators';

function ActionCrash() {
   const router = useRouter();
   const { opId: opIdQuery } = router.query;
   const opId = useSelector(selectAuthOperator);
   const server = useSelector(selectAuthServer);
   const user = useSelector(getUser) as User;
   const theme = useTheme();
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const BadgeEnv = styled(Chip)`
      height: 20px;
      background: ${COLORBADGEENV.DEV};
      z-index: 1;
      span.MuiChip-label,
      span.MuiChip-label:hover {
         font-size: 11px;
         cursor: pointer;
         color: ${server === ENV.DEV || server === ENV.STAGE
            ? '#000'
            : (props) => props.theme.sidebar.badge.color};
         padding-left: ${(props) => props.theme.spacing(2)};
         padding-right: ${(props) => props.theme.spacing(2)};
      }
   `;
   const backgroundServer = () => {
      switch (server) {
         case ENV.DEV:
            return COLORBADGEENV.DEV;
         case ENV.TEST:
            return COLORBADGEENV.TEST;
         case ENV.STAGE:
            return COLORBADGEENV.STAGE;
         default:
            return '';
      }
   };
   const excludeURLs = [
      '/operators/details',
      '/players/details',
      '/brands/details',
      '/operators',
      '/tournament',
      '/games',
      '/users',
      '/users/details',
      '/services',
      '/games/details',
      '/operators/operatorGameDetails',
      '/tableReports/operatorReports',
      '/reports',
      '/messages',
      '/players/related-accounts',
      '/exchange',
      '/real-time',
      '/game-cores',
      '/v2-Tournament',
      '/v2-Tournament/details',
      '/devOps/cloudFlare',
      '/quick-reports',
   ];
   if (
      opIdQuery === 'all' &&
      router.pathname === '/tableReports/operatorReports/details'
   ) {
      excludeURLs.push('/tableReports/operatorReports/details');
   }
   const excludeBrandsURLs = ['/brands'];
   return (
      <React.Fragment>
         <Grid
            alignItems={'center'}
            justifyContent="space-between"
            container
            spacing={0.5}
            width={isDesktop ? 'auto' : '100%'}
         >
            <Grid item xs={12} md={'auto'}>
               <Stack direction="row" alignItems="center" gap={1}>
                  <BadgeEnv
                     label={`FE.ENV: ${ENV.DEV}`}
                     sx={{
                        background: { backgroundServer },
                        width: isDesktop ? 'auto' : '100%',
                     }}
                  />
               </Stack>
            </Grid>
            <Grid item xs={12} md={'auto'}>
               <Stack direction="row" alignItems="center" gap={1}>
                  <BadgeEnv
                     sx={{
                        background: { backgroundServer },
                        width: isDesktop ? 'auto' : '100%',
                     }}
                     label={`BE.ENV: ${server}`}
                  />
               </Stack>
            </Grid>
            {hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_OPERATOR_LIST_REQ
            ) &&
               !excludeURLs.includes(router.pathname) && (
                  <Grid item xs={12} md={'auto'}>
                     <OpList />
                  </Grid>
               )}
            {opId &&
               hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ
               ) &&
               user.brandId === '*' &&
               !excludeURLs.includes(router.pathname) &&
               !excludeBrandsURLs.includes(router.pathname) && (
                  <Grid item xs={12} md={'auto'}>
                     <BrandsFilter />
                  </Grid>
               )}
         </Grid>
      </React.Fragment>
   );
}

export default ActionCrash;
