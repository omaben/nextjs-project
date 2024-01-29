import PortalCopyValue from '@/components/custom/PortalCopyValue';
import {
   renderBetAmountCell,
   renderCurrencyCell,
   renderPLCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells';
import {
   Bet,
   Brand,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front';
import { OperatorList } from '@alienbackoffice/back-front/lib/operator/interfaces/operator-list.interface';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
   Box,
   Collapse,
   IconButton,
   Table,
   TableBody,
   TableCell,
   TableRow,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
   saveBetDetails,
   saveBrandsList,
   selectAuthBrandsList,
   selectAuthOperators,
   selectAuthUser,
   selectAuthbetDetails,
} from 'redux/authSlice';
import { selectBoClient } from 'redux/socketSlice';
import { store } from 'redux/store';
import { handleFormat } from 'services/globalFunctions';
import { hasDetailsPermission } from 'services/permissionHandler';
import { v4 as uuidv4 } from 'uuid';

function createData(
   index?: number,
   playerId?: string,
   winOdds?: number,
   nickname?: string,
   opId?: string,
   prize?: {
      amount: number;
      title: string;
   },
   betId?: string,
   brandId?: string,
   currency?: string
) {
   return {
      index: 0,
      playerId: '',
      winOdds: 0,
      nickname: '',
      opId: '',
      prize: {
         amount: 0,
         title: '',
      },
      betId: '',
      brandId: '',
      currency: '',
   };
}

function CustomRow(props: { row: ReturnType<typeof createData> }) {
   const { row } = props;
   const [open, setOpen] = React.useState(false);
   const [titleBrand, setTitleBrand] = React.useState('' as string);
   const [betDetails, setBetDetails] = React.useState({} as Bet);
   const theme = useTheme();
   const user = useSelector(selectAuthUser) as User;
   const operators = useSelector(selectAuthOperators) as OperatorList;
   const boClient = useSelector(selectBoClient);
   const brands = useSelector(selectAuthBrandsList) as Brand[];
   const betDetailsData = useSelector(selectAuthbetDetails) as Bet;
   const titleOpId = operators?.operators?.find(
      (item) => item.opId === row.opId
   )?.title;
   const openDetails = () => {
      if (
         [UserScope.ADMIN, UserScope.SUPERADMIN].includes(user?.scope) ||
         ([UserScope.OPERATOR].includes(user?.scope) && user?.opId === row.opId)
      ) {
         boClient?.operator.getOperatorBrands(
            { opId: row.opId },
            {
               uuid: uuidv4(),
               meta: {
                  type: 'list',
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ,
               },
            }
         );
      } else {
         store.dispatch(saveBrandsList([]));
      }
      if (
         hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GET_BET_REQ) &&
         row.betId
      ) {
         boClient?.bet.getBet(
            { opId: row.opId, betId: row.betId },
            {
               uuid: uuidv4(),
               meta: {
                  type: 'details',
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_BET_REQ,
               },
            }
         );
         boClient?.bet.onGetBetResponse(async (result) => {
            if (result.success) {
               setBetDetails(result.data as Bet);
            } else {
               let message = result.message;
               if (message === 'Access denied.') {
                  message = `Access denied to ${result.traceData?.meta?.event}`;
               }
            }
         });
      } else {
         store.dispatch(saveBetDetails({}));
      }
      setOpen(!open);
   };
   useEffect(() => {
      if (brands && brands.length > 0) {
         setTitleBrand(
            brands.find((item) => item.brandId === row.brandId)
               ?.brandName as string
         );
      }
   }, [brands]);

   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

   return (
      <React.Fragment>
         <TableRow
            sx={{
               '& > *': { borderBottom: 'unset' },
               fontSize: theme.breakpoints.down('sm') ? '10px' : '12px',
               th: {
                  background: `${theme.palette.background.paper}!important`,
               },
               '.MuiTableCell-root': {
                  padding: '5px',
               },
               '&:nth-of-type(odd), &:nth-of-type(odd) tr th': {
                  background: `${
                     (user?.scope === UserScope.OPERATOR &&
                        row.opId === user?.opId) ||
                     (user?.scope === UserScope.BRAND &&
                        row.opId === user?.opId &&
                        row.brandId === user?.brandId)
                        ? '#E0EAFF'
                        : '#F6F5F9'
                  }!important`,
               },
               '&:nth-of-type(odd) th': {
                  background: `${
                     (user?.scope === UserScope.OPERATOR &&
                        row.opId === user?.opId) ||
                     (user?.scope === UserScope.BRAND &&
                        row.opId === user?.opId &&
                        row.brandId === user?.brandId)
                        ? '#E0EAFF'
                        : '#F6F5F9'
                  }!important`,
               },
               '&:nth-of-type(even) th': {
                  background: `${
                     (user?.scope === UserScope.OPERATOR &&
                        row.opId === user?.opId) ||
                     (user?.scope === UserScope.BRAND &&
                        row.opId === user?.opId &&
                        row.brandId === user?.brandId)
                        ? '#E0EAFF'
                        : theme.palette.background.paper
                  }!important`,
               },

               '&:nth-of-type(even), &:nth-of-type(even) tr th': {
                  background: `${
                     (user?.scope === UserScope.OPERATOR &&
                        row.opId === user?.opId) ||
                     (user?.scope === UserScope.BRAND &&
                        row.opId === user?.opId &&
                        row.brandId === user?.brandId)
                        ? '#E0EAFF'
                        : theme.palette.background.paper
                  }!important`,
               },
               'th .MuiStack-root, th a': {
                  color: `${
                     (user?.scope === UserScope.OPERATOR &&
                        row.opId === user?.opId) ||
                     (user?.scope === UserScope.BRAND &&
                        row.opId === user?.opId &&
                        row.brandId === user?.brandId)
                        ? '#6172F3'
                        : '#1570EF'
                  }!important`,
                  fontFamily: `${'Nunito Sans SemiBold'} !important`,
               },
               'td , td  span': {
                  color: `${
                     (user?.scope === UserScope.OPERATOR &&
                        row.opId === user?.opId) ||
                     (user?.scope === UserScope.BRAND &&
                        row.opId === user?.opId &&
                        row.brandId === user?.brandId)
                        ? '#6172F3'
                        : '#04020B'
                  }!important`,
                  fontFamily: `${
                     (user?.scope === UserScope.OPERATOR &&
                        row.opId === user?.opId) ||
                     (user?.scope === UserScope.BRAND &&
                        row.opId === user?.opId &&
                        row.brandId === user?.brandId)
                        ? 'Nunito Sans ExtraBold'
                        : 'Nunito Sans SemiBold'
                  } !important`,
               },
               // hide last border
               'td, th': {
                  border: 0,
                  textAlign: 'center',
                  alignContent: 'center',
               },
               td: {
                  '&:before': {
                     display: 'none',
                  },
               },
            }}
         >
            <TableCell
               sx={{
                  h6: { p: '0 !important' },
                  textAlign: 'center !important',
               }}
            >
               {row.index + 1}
            </TableCell>
            <TableCell>
               <PortalCopyValue
                  value={row.playerId || ''}
                  href={`/players/details?id=${row.playerId}&opId=${row.opId}`}
                  sx={{
                     textOverflow: 'ellipsis',
                     overflow: 'hidden',
                     whiteSpace: 'nowrap',
                     maxWidth: '300px',
                     justifyContent: 'center !important',
                     textAlign: 'center !important',
                  }}
               />
            </TableCell>
            <TableCell>
               <PortalCopyValue
                  value={row.nickname || ''}
                  sx={{
                     textOverflow: 'ellipsis',
                     overflow: 'hidden',
                     whiteSpace: 'nowrap',
                     maxWidth: '100px',
                     justifyContent: 'center !important',
                     textAlign: 'center !important',
                  }}
               />
            </TableCell>
            {[UserScope.SUPERADMIN, UserScope.ADMIN].includes(user.scope) && (
               <TableCell>
                  <PortalCopyValue
                     value={`${row.opId}-${titleOpId}` || ''}
                     sx={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        maxWidth: '200px',
                        justifyContent: 'center !important',
                        textAlign: 'center !important',
                     }}
                  />
               </TableCell>
            )}
            <TableCell
               sx={{
                  h6: {
                     p: '0 !important',
                  },
                  justifyContent: 'center !important',
                  textAlign: 'center !important',
               }}
            >
               {row.winOdds ? (
                  <Typography variant="bodySmall">
                     {(Math.floor(row.winOdds * 100) / 100).toFixed(2)}x
                  </Typography>
               ) : (
                  ''
               )}
            </TableCell>
            <TableCell
               sx={{
                  h6: {
                     p: '0 !important',
                  },
                  justifyContent: 'center !important',
                  textAlign: 'center !important',
                  fontSize: isDesktop ? '12px !important' : '11px !important',
               }}
            >
               {row?.prize && row?.prize?.amount?.toString()
                  ? `${row.currency} ${handleFormat(
                       row?.prize.amount,
                       row.currency,
                       false,
                       true
                    )}`
                  : '--'}
            </TableCell>
            <TableCell sx={{ width: '50px !important' }}>
               <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => openDetails()}
               >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
               </IconButton>
            </TableCell>
         </TableRow>
         <TableRow sx={{ display: 'contents' }}>
            <TableCell style={{ padding: 0 }} colSpan={7}>
               <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                     <Table size="small" aria-label="purchases">
                        <TableBody>
                           <TableRow>
                              <TableCell component="th" scope="row">
                                 Bet Id
                              </TableCell>
                              <TableCell>
                                 <PortalCopyValue
                                    value={row.betId || ''}
                                    tooltip={true}
                                 />
                              </TableCell>
                           </TableRow>
                           {row.brandId &&
                              ([UserScope.SUPERADMIN, UserScope.ADMIN].includes(
                                 user?.scope
                              ) ||
                                 ([UserScope.OPERATOR].includes(user?.scope) &&
                                    user.opId === row.opId)) && (
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Brand ID
                                    </TableCell>
                                    <TableCell>
                                       <PortalCopyValue
                                          value={`${row.brandId}` || ''}
                                          tooltip={true}
                                       />
                                    </TableCell>
                                 </TableRow>
                              )}
                           {row.brandId &&
                              titleBrand &&
                              ([UserScope.SUPERADMIN, UserScope.ADMIN].includes(
                                 user?.scope
                              ) ||
                                 ([UserScope.OPERATOR].includes(user?.scope) &&
                                    user.opId === row.opId)) && (
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Brand Title
                                    </TableCell>
                                    <TableCell>
                                       <PortalCopyValue
                                          value={`${titleBrand}` || ''}
                                          tooltip={true}
                                       />
                                    </TableCell>
                                 </TableRow>
                              )}
                           {betDetails && (
                              <>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Game ID
                                    </TableCell>
                                    <TableCell>
                                       <PortalCopyValue
                                          value={`${betDetails?.gameId}` || ''}
                                          isVisible
                                       />
                                    </TableCell>
                                 </TableRow>
                                 <TableRow
                                    sx={{
                                       '.MuiStack-root .MuiTypography-root': {
                                          padding: '0 !important',
                                       },
                                    }}
                                 >
                                    <TableCell component="th" scope="row">
                                       Date/Time
                                    </TableCell>
                                    <TableCell>
                                       {betDetails?.placedAt &&
                                          renderTimeCell(betDetails?.placedAt)}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Bet Amount
                                    </TableCell>
                                    <TableCell>
                                       {renderBetAmountCell(
                                          betDetails?.betAmount,
                                          betDetails?.currency
                                       )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       PL
                                    </TableCell>
                                    <TableCell>
                                       {renderPLCell(
                                          betDetails.pl,
                                          betDetails.currency
                                       )}
                                    </TableCell>
                                 </TableRow>
                              </>
                           )}

                           <TableRow>
                              <TableCell component="th" scope="row">
                                 Currency
                              </TableCell>
                              <TableCell>
                                 {renderCurrencyCell(row.currency || '')}
                              </TableCell>
                           </TableRow>
                        </TableBody>
                     </Table>
                  </Box>
               </Collapse>
            </TableCell>
         </TableRow>
      </React.Fragment>
   );
}

export default CustomRow;
