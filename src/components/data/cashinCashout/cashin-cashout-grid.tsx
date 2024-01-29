import SelectTheme from '@/components/SelectTheme';
import GridStyle from '@/components/custom/GridStyle';
import PortalCopyValue from '@/components/custom/PortalCopyValue';
import {
   renderBetAmountCell,
   renderBrandCell,
   renderCashinCashoutStatusCell,
   renderPLCell,
   renderPlayerStatusCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells';
import {
   CashInCashOut,
   ForceCashOutDto,
   IntegrationType,
   Operator,
   UserPermissionEvent,
} from '@alienbackoffice/back-front';
import { GetCashInCashOutListSortDto } from '@alienbackoffice/back-front/lib/cash-in-cash-out/dto/get-cash-in-cash-out-list.dto';
import {
   Box,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogProps,
   DialogTitle,
   Grid,
   Stack,
   Tab,
   Table,
   TableBody,
   TableCell,
   TableRow,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import { DataGridPro, GridColDef, GridSortModel } from '@mui/x-data-grid-pro';
import { darkPurple } from 'colors';
import React, { MouseEventHandler } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
   selectAuthCashinCashoutList,
   selectAuthCurrentOperator,
   selectAuthOperator,
} from 'redux/authSlice';
import { selectloadingCashinCashout } from 'redux/loadingSlice';
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith4Toolbar,
   PageWith5Toolbar,
   PageWithdetails2Toolbar,
} from 'services/globalFunctions';
import { hasDetailsPermission } from 'services/permissionHandler';
import { betListType } from 'types';
import {
   UseGetCashinCashoutListQueryProps,
   useForceCashOutMutation,
   useGetCashinCashoutListQuery,
} from './lib/hooks/queries';
import TransitionSlide from '@/components/custom/TransitionSlide';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleXmark } from '@fortawesome/pro-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import AllBets from '../bets/bets-grid';
import WebhookData from '../webhooks/webhook-grid';
import styled from '@emotion/styled';
import { spacing } from '@mui/system';

export default function CashinCashoutData(dataFilter: {
   placedAtFrom: number;
   playerId?: string;
   placedAtTo: number;
   betId?: string;
   status: string;
   selectedCurrency?: number;
   canceled?: boolean;
   refresh?: number;
   nickname?: string;
   searchDate?: number;
   cashierId?: string;
   version?: string;
}) {
   const [dataSort, setDataSort] = React.useState<GetCashInCashOutListSortDto>({
      isOpen: -1,
   });
   const theme = useTheme();
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
   const opId = useSelector(selectAuthOperator);
   const operator = useSelector(selectAuthCurrentOperator) as Operator;
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   });
   const ButtonStyled = styled(Button)(spacing);

   const loadingCashinCashoutList = useSelector(selectloadingCashinCashout);
   const data = useSelector(selectAuthCashinCashoutList);
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0);
   const [boxRefrech, setBoxRefrech] = React.useState(0);
   const [action, setAction] = React.useState(0);
   const [maxWidth, setMaxWidth] =
      React.useState<DialogProps['maxWidth']>('sm');
   const [fullWidth, setFullWidth] = React.useState(true);
   const [openForceCashOut, setOpenForceCashOut] = React.useState(false);
   const [currentCashOut, setCurrentCashOut] = React.useState(
      {} as CashInCashOut
   );
   const [Transition, setTransition] = React.useState<any>();
   const [currentCashinCashout, setCurrentCashinCashout] = React.useState(
      {} as CashInCashOut
   );
   const [openCashinCashout, setOpenCashinCashout] = React.useState(false);
   const [value, setValue] = React.useState('cashingCashoutDetails');

   const handleOpenCashinCashout = (cashinCashout: CashInCashOut) => {
      setValue('cashingCashoutDetails');
      setTransition(TransitionSlide);
      setCurrentCashinCashout(cashinCashout);
      setOpenCashinCashout(true);
   };
   const Actions = (data: CashInCashOut) => {
      let actiondata: {
         value: string;
         label: React.ReactElement | string;
         onClick?: MouseEventHandler<any> | undefined;
         disabled?: boolean;
      }[] = [
         {
            value: '0',
            label: (
               <Typography
                  variant="caption"
                  sx={{ fontFamily: 'Nunito Sans Bold', fontSize: '0.75rem' }}
               >
                  Actions
               </Typography>
            ),
            disabled: true,
         },
      ];
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_CASH_IN_CASH_OUT_LIST_REQ
         )
      ) {
         actiondata.push({
            value: '1',
            label: (
               <Typography
                  variant="bodySmallBold"
                  sx={{
                     svg: { position: 'relative', top: '3px', mr: '15px' },
                     flex: 1,
                  }}
               >
                  Force Cash Out
               </Typography>
            ),
            onClick: () => handleOpenForceCashOut(data),
         });
      }
      return actiondata;
   };
   const columns: GridColDef[] = [
      {
         field: 'playerId',
         headerName: 'Player',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderPlayerStatusCell(
               params.row.playerId,
               params.row.player?.isTest,
               params.row.playerStatus === true,
               params.row.nickname,
               false
            ),
         minWidth: 120,
         flex: 1,
      },
      {
         field: 'cashierId',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Cashier ID',
         renderCell: (params) =>
            params &&
            params.value && (
               <>
                  <PortalCopyValue
                     value={params.value}
                     isVisible
                     sx={{
                        mr: 1,
                     }}
                  />
               </>
            ),
         width: 100,
         hideable: false,
         filterable: false,
         disableColumnMenu: true,
         sortable: false,
      },
      {
         field: 'cashedInAt',
         headerAlign: 'center',
         align: 'center',
         headerName: ' Start Time',
         renderCell: (params) =>
            params && params.value && renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         sortable: true,
         cellClassName: 'caption-column',
      },
      {
         field: 'startBalance',
         headerName: 'Start Balance',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderBetAmountCell(params.row.startBalance, params.row.currency),
         minWidth: 130,
         filterable: false,
         flex: 1,
      },
      {
         field: 'cashedOutAt',
         headerAlign: 'center',
         align: 'center',
         headerName: ' End Time',
         renderCell: (params) =>
            params && params.value && renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         sortable: true,
         cellClassName: 'caption-column',
      },
      // {
      //    field: 'brandId',
      //    headerName: 'Brand',
      //    headerAlign: 'center',
      //    align: 'center',
      //    renderCell: (params) =>
      //       renderBrandCell(
      //          opId,
      //          params.row.brand?.brandId,
      //          params.row.brand?.brandName
      //       ),
      //    minWidth: 100,
      //    flex: 1,
      //    filterable: false,
      //    disableColumnMenu: true,
      //    sortable: false,
      // },
      {
         field: 'finalBalance',
         headerName: 'End Balance',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderBetAmountCell(params.row.finalBalance, params.row.currency),
         minWidth: 130,
         filterable: false,
         flex: 1,
      },
      {
         field: 'pl',
         headerName: 'PL',
         headerAlign: 'center',
         align: 'center',
         minWidth: 150,
         flex: 1,
         renderCell: (params) => (
            <Stack>{renderPLCell(params.row.pl, params.row.currency)}</Stack>
         ),
         cellClassName: 'caption-column',
      },
      {
         field: 'margin',
         headerName: 'Margin',
         headerAlign: 'center',
         align: 'center',
         minWidth: 150,
         flex: 1,
         renderCell: (params) => (
            <Stack
               color={
                  params.row.margin > 0
                     ? theme.palette.success.main
                     : params.row.margin < 0
                     ? theme.palette.error.main
                     : theme.palette.grey[500]
               }
            >
               {params.row.margin}%
            </Stack>
         ),
         cellClassName: 'caption-column',
      },
      {
         field: 'isOpen',
         minWidth: 120,
         headerName: 'Status',
         headerAlign: 'center',
         align: 'center',
         flex: 1,
         renderCell: (params) =>
            params && (
               <Box
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleOpenCashinCashout(params.row)}
               >
                  {renderCashinCashoutStatusCell(params.value)}
               </Box>
            ),
      },
   ];

   if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_CASH_IN_CASH_OUT_LIST_REQ
      ) &&
      [
         IntegrationType.ALIEN_WALLET_TRANSFER,
         IntegrationType.PG_WALLET_TRANSFER,
      ].includes(operator.integrationType as IntegrationType)
   ) {
      columns.push({
         field: 'actions',
         headerName: '',
         renderCell: (params) => {
            return (
               <Box className="showOnHover">
                  <SelectTheme
                     noPadd={true}
                     icon={''}
                     data={Actions(params.row)}
                     value={action}
                  />
               </Box>
            );
         },
         sortable: false,
         filterable: false,
         disableColumnMenu: true,
         width: 10,
      });
   }
   const post: UseGetCashinCashoutListQueryProps = {
      limit: paginationModel.pageSize,
      opId: opId,
      nickname: dataFilter.nickname,
      playerId: dataFilter.playerId,
      page: paginationModel.page,
      sort: dataSort,
      placedAtFrom: dataFilter.placedAtFrom,
      placedAtTo: dataFilter.placedAtTo,
      autoRefresh: dataFilter.refresh,
      refresh: boxRefrech,
      key: betListType.LIST,
      version: dataFilter.version,
   };
   if (dataFilter.status !== 'all') {
      post.status = dataFilter.status as 'open' | 'close';
   }
   if (dataFilter.cashierId !== undefined) {
      post.cashierId = dataFilter.cashierId;
   }
   useGetCashinCashoutListQuery(post);

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field;
         let data = {};
         switch (fieldName) {
            case 'playerId':
               data = {
                  playerId: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'pl':
               data = {
                  pl: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'margin':
               data = {
                  margin: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'playerFullId':
               data = {
                  nickname: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'cashedInAt':
               data = {
                  cashedInAt: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'cashedOutAt':
               data = {
                  cashedOutAt: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'startBalance':
               data = {
                  startBalance: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'finalBalance':
               data = {
                  finalBalance: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'isOpen':
               data = {
                  isOpen: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            default:
               data = {
                  cashedInAt: sortModel[0].sort === 'asc' ? 1 : -1,
               };
         }
         setDataSort(data);
      },
      []
   );

   const handleCloseForceCashOut = () => {
      setOpenForceCashOut(false);
   };

   const handleOpenForceCashOut = (data: CashInCashOut) => {
      setCurrentCashOut(data);
      setOpenForceCashOut(true);
   };

   const { mutate: mutateForceCashOut } = useForceCashOutMutation({
      onSuccess: (data) => {
         setBoxRefrech(boxRefrech + 1);
         toast.success(`You forced cash out successfully`, {
            position: toast.POSITION.TOP_CENTER,
         });
         setOpenForceCashOut(false);
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const handleForceCashOut = React.useCallback(
      (dto: ForceCashOutDto) => {
         mutateForceCashOut({ dto });
      },
      [mutateForceCashOut]
   );
   const handleCloseCashinCashoutDetails = () => {
      setOpenCashinCashout(false);
      setValue('cashingCashoutDetails');
   };
   const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue);
   };
   React.useEffect(() => {
      setRowCountState((prevRowCountState: number) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      );
   }, [data?.count, setRowCountState]);

   return (
      <Box
         className="dataGridWrapper"
         mb={'0px'}
         px={isLgUp ? '12px' : '4px'}
         py={'6px'}
         pt={0}
         sx={{
            height: PageWith5Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            rowHeight={isDesktop ? 44 : 30}
            sx={GridStyle}
            getRowId={(row) => row.id}
            rows={data?.cashInCashOuts || []}
            paginationMode="server"
            sortingMode="server"
            rowCount={rowCountState | 0}
            columns={columns}
            disableColumnMenu
            slots={{
               noRowsOverlay: CustomNoRowsOverlay,
               noResultsOverlay: CustomNoRowsOverlay,
               columnSortedAscendingIcon: CustomMenuSortAscendingIcon,
               columnSortedDescendingIcon: CustomMenuSortDescendingIcon,
               columnUnsortedIcon: CustomMenuSortIcon,
            }}
            disableRowSelectionOnClick
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 30, 40, 50, 100]}
            sortingOrder={['desc', 'asc']}
            onSortModelChange={handleSortModelChange}
            loading={loadingCashinCashoutList}
            getRowClassName={(params) =>
               params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
         />

         <Dialog
            open={openForceCashOut}
            onClose={handleCloseForceCashOut}
            aria-labelledby="form-dialog-title"
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            sx={{
               p: '12px !important',
               '.MuiPaper-root': {
                  m: 'auto',
                  borderRadius: '8px',
               },
            }}
         >
            <DialogTitle id="form-dialog-title">Force Cash Out</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to force cash out?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleCloseForceCashOut}
                  color="secondary"
                  variant="outlined"
                  sx={{
                     height: 32,
                     borderColor: darkPurple[10],
                  }}
               >
                  Cancel
               </Button>
               {currentCashOut && currentCashOut.opId && (
                  <Button
                     color="secondary"
                     variant="contained"
                     sx={{ height: 32 }}
                     onClick={() =>
                        handleForceCashOut({
                           opId: currentCashOut.opId,
                           playerId: currentCashOut.playerId,
                        })
                     }
                  >
                     Confirm
                  </Button>
               )}
            </DialogActions>
         </Dialog>
         <Dialog
            open={openCashinCashout}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseCashinCashoutDetails}
            aria-describedby="alert-dialog-slide-description"
            sx={{
               '.MuiDialog-container': {
                  alignItems: 'end',
                  justifyContent: 'end',
               },
               '.MuiPaper-root': {
                  p: '12px 4px!important',
               },
               table: {
                  th: {
                     width: 130,
                     background: '#332C4A',
                     color: (props) => props.palette.primary.contrastText,
                     '&.MuiTableCell-root': {
                        fontFamily: 'Nunito Sans SemiBold',
                     },
                  },
                  'tbody tr': {
                     background: `#FFF!important`,
                  },
                  tr: {
                     'td, th': {
                        '&:after': {
                           display: 'none !important',
                        },
                     },
                  },
                  'tr: first-of-type th': {
                     borderTopLeftRadius: '8px',
                  },
                  ' tr: first-of-type td': {
                     borderTopRightRadius: '8px',
                  },
                  'tr: last-child th': {
                     borderBottomLeftRadius: '8px',
                  },
                  'tr: last-child td': {
                     borderBottomRightRadius: '8px',
                  },
                  'td, th': {
                     border: 0,
                     textAlign: 'left',
                     position: 'relative',
                     '.MuiStack-root': {
                        textAlign: 'left',
                        justifyContent: 'start',
                     },
                     '&:before': {
                        content: '""',
                        borderTop: '1px solid #5C5474',
                        position: 'absolute',
                        bottom: 0,
                        width: 'calc(100% - 22px)',
                        left: '11px',
                     },
                  },
                  td: {
                     '&:before': {
                        borderTop: '1px solid #D5D2DF',
                     },
                  },
                  'tr: last-child td, tr: last-child th': {
                     '&:before': {
                        borderTop: '0px solid #D5D2DF',
                     },
                  },
               },
            }}
         >
            <Grid
               container
               direction="row"
               alignItems="center"
               p={'8px'}
               spacing={0}
               sx={{
                  svg: {
                     fontSize: '16px',
                     height: '16px',
                     cursor: 'pointer',
                  },
               }}
            >
               <Grid item>
                  <Typography variant="h3" gutterBottom display="inline">
                     Cashin & Cashout Details{' '}
                  </Typography>
               </Grid>
               <Grid item xs />
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleCloseCashinCashoutDetails}
                     cursor={'pointer'}
                  />
               </Grid>
            </Grid>
            <DialogContent sx={{ p: 1, overflow: 'hidden' }}>
               <Grid
                  item
                  xs={12}
                  sx={{
                     '.MuiTabPanel-root': {
                        padding: '8px 0px',
                        '.dataGridWrapper': {
                           marginLeft: isDesktop ? '-12px' : 0,
                        },
                     },
                  }}
               >
                  <TabContext value={value}>
                     <TabList
                        className="detail_tabs"
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons={true}
                        sx={{
                           mb: '0',
                           py: '4px',
                           pt: 0,
                           px: isDesktop ? '12px' : '4px',
                           justifyContent: 'start',
                           '.MuiTabs-scroller': {
                              justifyContent: 'center',
                              width: 'fit-content',
                              maxWidth: 'fit-content',
                           },
                        }}
                        aria-label="lab API tabs example"
                     >
                        <Tab label="Details" value={'cashingCashoutDetails'} />

                        <Tab label="Bets" value={'bets'} />
                        <Tab label="Logs" value={'logs'} />
                        <Tab label="Action" value={'action'} />
                     </TabList>
                     <TabPanel
                        value={'cashingCashoutDetails'}
                        sx={{
                           height: PageWithdetails2Toolbar,
                           overflow: 'auto',
                           py: '4px !important',
                        }}
                     >
                        <Grid
                           container
                           direction="row"
                           alignItems="center"
                           mb={2}
                           spacing={0}
                        >
                           <Table
                              sx={{
                                 th: {
                                    width: '100px !important',
                                 },
                              }}
                           >
                              <TableBody>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Status
                                    </TableCell>
                                    <TableCell>
                                       {renderCashinCashoutStatusCell(
                                          currentCashinCashout.isOpen
                                       )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Player ID
                                    </TableCell>
                                    <TableCell>
                                       <PortalCopyValue
                                          value={currentCashinCashout?.playerId}
                                       />
                                    </TableCell>
                                 </TableRow>
                                 {currentCashinCashout?.nickname && (
                                    <TableRow>
                                       <TableCell component="th" scope="row">
                                          Player Nickname
                                       </TableCell>
                                       <TableCell>
                                          <PortalCopyValue
                                             value={
                                                currentCashinCashout?.nickname ||
                                                ''
                                             }
                                          />
                                       </TableCell>
                                    </TableRow>
                                 )}
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Start Time
                                    </TableCell>
                                    <TableCell
                                       sx={{ h6: { p: '0 !important' } }}
                                    >
                                       {currentCashinCashout?.cashedInAt &&
                                          renderTimeCell(
                                             new Date(
                                                currentCashinCashout?.cashedInAt
                                             ).toString(),
                                             true
                                          )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       End Time
                                    </TableCell>
                                    <TableCell
                                       sx={{ h6: { p: '0 !important' } }}
                                    >
                                       {currentCashinCashout?.cashedOutAt &&
                                          renderTimeCell(
                                             new Date(
                                                currentCashinCashout?.cashedOutAt
                                             ).toString(),
                                             true
                                          )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow sx={{}}>
                                    <TableCell component="th" scope="row">
                                       Currency
                                    </TableCell>
                                    <TableCell>
                                       {currentCashinCashout?.currency}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Start Balance
                                    </TableCell>
                                    <TableCell>
                                       {renderBetAmountCell(
                                          currentCashinCashout?.startBalance,
                                          currentCashinCashout?.currency
                                       )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       End Balance
                                    </TableCell>
                                    <TableCell>
                                       {currentCashinCashout?.finalBalance &&
                                          renderBetAmountCell(
                                             currentCashinCashout?.finalBalance,
                                             currentCashinCashout?.currency
                                          )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       PL
                                    </TableCell>
                                    <TableCell>
                                       {renderPLCell(
                                          currentCashinCashout?.pl,
                                          currentCashinCashout?.currency
                                       )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Margin
                                    </TableCell>
                                    <TableCell>
                                       <Stack
                                          color={
                                             currentCashinCashout?.margin > 0
                                                ? theme.palette.success.main
                                                : currentCashinCashout?.margin <
                                                  0
                                                ? theme.palette.error.main
                                                : theme.palette.grey[500]
                                          }
                                       >
                                          {currentCashinCashout?.margin}%
                                       </Stack>
                                    </TableCell>
                                 </TableRow>
                              </TableBody>
                           </Table>
                        </Grid>
                     </TabPanel>

                     <TabPanel
                        value={'bets'}
                        sx={{
                           overflow: 'auto',
                           mt: '8px',
                           py: '4px !important',
                           h6: {
                              padding: '0px !important',
                           },
                           '.dataGridWrapper': {
                              height: PageWith4Toolbar,
                              margin: '0px!important',
                              width: '100%',
                              padding: '0px!important',
                           },
                        }}
                     >
                        <AllBets
                           cashierId={currentCashinCashout?.cashierId}
                           rollbackData={() => {}}
                           isTest="all"
                           isFun="all"
                           statusWithoutClick={true}
                        />
                     </TabPanel>

                     <TabPanel
                        value={'logs'}
                        sx={{
                           py: '4px !important',
                           h6: {
                              padding: '0px !important',
                           },
                           '.dataGridWrapper': {
                              height: PageWith4Toolbar,
                              margin: '0px!important',
                              width: '100%',
                              padding: '0px!important',
                           },
                        }}
                     >
                        <WebhookData
                           opId={currentCashinCashout?.opId}
                           cashierId={currentCashinCashout?.cashierId}
                        />
                     </TabPanel>
                     <TabPanel
                        value={'action'}
                        sx={{
                           height: PageWithdetails2Toolbar,
                           overflow: 'auto',
                           py: '4px !important',
                        }}
                     >
                        <ButtonStyled
                           onClick={() =>
                              handleOpenForceCashOut(currentCashinCashout)
                           }
                           variant="contained"
                           color="secondary"
                           sx={{ height: '32px' }}
                        >
                           Force Cash Out
                        </ButtonStyled>
                     </TabPanel>
                  </TabContext>
               </Grid>
            </DialogContent>
         </Dialog>
      </Box>
   );
}
