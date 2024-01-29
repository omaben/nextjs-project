import GridStyle from '@/components/custom/GridStyle';
import PortalCopyValue from '@/components/custom/PortalCopyValue';
import {
   renderBetAmountCell,
   renderBetStatusCell,
   renderBrandCell,
   renderCurrencyCell,
   renderGameCell,
   renderPLCell,
   renderPlayerStatusCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells';
import {
   Bet,
   BetStatus,
   IntegrationType,
   Operator,
   RollbackOpenBetDto,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front';
import {
   Box,
   Button,
   Dialog,
   DialogContent,
   DialogProps,
   Grid,
   IconButton,
   Stack,
   Tab,
   Table,
   TableBody,
   TableCell,
   TableRow,
   Tooltip,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridRowParams,
   GridSortModel,
} from '@mui/x-data-grid-pro';
import React, { MouseEventHandler, useState } from 'react';
import { useSelector } from 'react-redux';
import {
   selectAuthBetsList,
   selectAuthCurrentBrand,
   selectAuthCurrentOperator,
   selectAuthOperator,
   selectAuthUser,
} from 'redux/authSlice';
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith4Toolbar,
   PageWith5Toolbar,
   PageWithdetails2Toolbar,
} from 'services/globalFunctions';
import {
   UseGetBetsListQueryProps,
   useGetBetsListQuery,
   useRollBackMutation,
} from './lib/hooks/queries';

import SelectTheme from '@/components/SelectTheme';
import TransitionSlide from '@/components/custom/TransitionSlide';
import { GetBetListSortDto } from '@alienbackoffice/back-front/lib/bet/dto/get-bet-list.dto';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
   faCheck,
   faClose,
   faCopy,
   faRectangleXmark,
   faRobot,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Check from '@mui/icons-material/Check';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { darkPurple } from 'colors';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { selectloadingBetsList } from 'redux/loadingSlice';
import { hasDetailsPermission } from 'services/permissionHandler';
import { betListType } from 'types';
import WebhookDataDetails from '../webhooks/webhook-detail';

export default function AllBets(dataFilter: {
   placedAtFrom?: number;
   playerId?: string;
   placedAtTo?: number;
   betId?: string;
   gameId?: string;
   gameTitle?: string;
   currencies?: string;
   status?: string[];
   selectedCurrency?: number;
   canceled?: boolean;
   isTest: string;
   refresh?: number;
   isFun: string;
   nickname?: string;
   searchDate?: number;
   rollbackData: Function;
   version?: string;
   cashierId?: string;
   statusWithoutClick?: boolean;
}) {
   const [dataSort, setDataSort] = React.useState<GetBetListSortDto>({
      placedAt: -1,
   });
   const theme = useTheme();
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
   const operator = useSelector(selectAuthCurrentOperator) as Operator;
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({});
   const [Transition, setTransition] = React.useState<any>();
   const [checked, setChecked] = useState(false);
   const opId = useSelector(selectAuthOperator);
   const currenctBrandId = useSelector(selectAuthCurrentBrand);
   const [jsonData, setJsonData] = useState({} as Bet);
   const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });
   const [openFullScreen, setOpenFullScreen] = React.useState(false);
   const [maxWidth, setMaxWidth] =
      React.useState<DialogProps['maxWidth']>('xl');
   const [fullWidth, setFullWidth] = React.useState(true);
   const [value, setValue] = React.useState('betDetail');
   var regexPattern = new RegExp('true');
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   });
   const loadingBetsList = useSelector(selectloadingBetsList);
   const [currentBet, setCurrentBet] = React.useState({} as Bet);
   const data = useSelector(selectAuthBetsList);
   const user = useSelector(selectAuthUser) as User;
   const [openBet, setOpenBet] = React.useState(false);
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0);
   const [action, setAction] = React.useState(0);
   const [boxRefrech, setBoxRefrech] = React.useState(0);
   const Actions = (data: Bet) => {
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
            UserPermissionEvent.BACKOFFICE_ROLLBACK_OPEN_BET_REQ
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
                  RollBack
               </Typography>
            ),
            onClick: () => {
               const post: RollbackOpenBetDto = {
                  betId: data.id,
                  opId: opId,
               };
               if (data.player?.brand?.brandId) {
                  post.brandId = data.player?.brand?.brandId;
               }
               if (data.player?.affId) {
                  post.affId = data.player?.affId;
               }
               handleSetRollBackOpenBet(post);
            },
         });
      }
      return actiondata;
   };

   const columns: GridColDef[] = [
      {
         field: 'id',
         headerAlign: 'center',
         align: 'center',
         headerName: 'ID',
         renderCell: (params) =>
            params &&
            params.value && (
               <>
                  <PortalCopyValue
                     value={params.value}
                     hideText
                     sx={{
                        mr: 1,
                     }}
                  />
                  {params.row.isTest && (
                     <Tooltip title={'Test'} placement="left">
                        <FontAwesomeIcon
                           icon={faRobot as IconProp}
                           color={'#8098F9'}
                        />
                     </Tooltip>
                  )}
               </>
            ),
         width: 40,
         hideable: false,
         filterable: false,
         disableColumnMenu: true,
      },
      {
         field: 'placedAt',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Date/Time',
         renderCell: (params) =>
            params && params.value && renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         sortable: true,
         cellClassName: 'caption-column',
      },
      {
         field: 'playerId',
         headerName: 'Player',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderPlayerStatusCell(
               params.row.player?.playerId,
               params.row.player?.isTest,
               params.row.playerStatus === true,
               params.row.player?.nicknameIsSet && params.row.player?.nickname,
               false,
               params.row.player
            ),
         minWidth: 120,
         flex: 1,
      },
      {
         field: 'brandId',
         headerName: 'Brand',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderBrandCell(
               opId,
               params.row.player?.brand?.brandId,
               params.row.player?.brand?.brandName
            ),
         minWidth: 100,
         flex: 1,
         filterable: false,
         disableColumnMenu: true,
      },
      {
         field: 'roundIndex',
         headerName: 'RoundIndex',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            params.row?.gameData?.roundIndex && (
               <PortalCopyValue value={params.row?.gameData?.roundIndex} />
            ),
         minWidth: 100,
         flex: 1,
         filterable: false,
         disableColumnMenu: true,
         sortable: false,
      },
      {
         field: 'gameId',
         headerName: 'Game',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            params &&
            params.value &&
            renderGameCell(params.value, params.row.gameTitle),
         minWidth: 100,
         flex: 1,
         filterable: false,
      },
      {
         field: 'currency',
         headerName: 'Currency',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            params && params.value && renderCurrencyCell(params.value),

         minWidth: 100,
         filterable: false,
         flex: 1,
      },
      {
         field: 'balanceInUSD',
         headerName: 'Balance Before Bet in USD',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderPLCell(params.row.player.wallet?.inUSD.balance || 0, 'USD'),
         minWidth: 220,
         filterable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'betAmount',
         headerName: 'Bet Amount',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderBetAmountCell(params.row.betAmount, params.row.currency),
         minWidth: 130,
         filterable: false,
         flex: 1,
      },
      {
         field: 'betAmountInUSD',
         headerName: 'Bet amount USD',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderBetAmountCell(params.row.betAmountInUSD, 'USD'),

         minWidth: 130,
         filterable: false,
         flex: 1,
      },
      {
         field: 'betAmountInEUR',
         headerName: 'Bet Amount EUR',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderBetAmountCell(params.row.betAmountInEUR, 'EUR'),

         minWidth: 130,
         filterable: false,
         flex: 1,
      },
      {
         field: 'plInUSD',
         headerName: 'PL USD',
         headerAlign: 'center',
         align: 'center',
         minWidth: 100,
         flex: 1,
         renderCell: (params) => (
            <Stack>{renderPLCell(params.row.plInUSD, 'USD')}</Stack>
         ),
         cellClassName: 'caption-column',
      },
      {
         field: 'plInEUR',
         headerName: 'PL EUR',
         headerAlign: 'center',
         align: 'center',
         minWidth: 100,
         flex: 1,
         renderCell: (params) => (
            <Stack>{renderPLCell(params.row.plInEUR, 'EUR')}</Stack>
         ),
         cellClassName: 'caption-column',
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
         field: 'newBalanceInUSD',
         headerName: 'Balance After Result in USD',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            params.row.playerAfter
               ? renderPLCell(
                    params.row.playerAfter?.wallet?.inUSD?.balance || 0,
                    'USD'
                 )
               : '--',

         minWidth: 130,
         filterable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'winOdds',
         headerName: 'Win Odds',
         headerAlign: 'center',
         align: 'center',
         minWidth: 120,
         flex: 1,
         renderCell: (params) => (
            <Stack>
               {params.row.winOdds ? (
                  <Typography variant="bodySmallBold">
                     {(Math.floor(params.row.winOdds * 100) / 100).toFixed(2)}x
                  </Typography>
               ) : (
                  <Typography variant="bodySmallBold">
                     {(Math.floor(0 * 100) / 100).toFixed(2)}x
                  </Typography>
               )}
            </Stack>
         ),
      },
      {
         field: 'status',
         minWidth: 120,
         headerName: 'Status',
         headerAlign: 'center',
         align: 'center',
         flex: 1,
         renderCell: (params) =>
            params &&
            params.value && (
               <Box
                  onClick={() =>
                     !dataFilter.statusWithoutClick && handleOpenBet(params.row)
                  }
                  sx={{ cursor: 'pointer' }}
               >
                  {renderBetStatusCell(params.value)}
               </Box>
            ),
      },
   ];
   if (
      hasDetailsPermission(UserPermissionEvent.BACKOFFICE_ROLLBACK_OPEN_BET_REQ)
   ) {
      columns.push({
         field: 'actions',
         headerName: '',
         renderCell: (params) => {
            return [BetStatus.OPEN, BetStatus.CANCELED].includes(
               params.row.status
            ) ? (
               <Box className="showOnHover">
                  <SelectTheme
                     noPadd={true}
                     icon={''}
                     data={Actions(params.row)}
                     value={action}
                  />
               </Box>
            ) : (
               ''
            );
         },
         sortable: false,
         filterable: false,
         disableColumnMenu: true,
         width: 10,
      });
   }
   const post: UseGetBetsListQueryProps = {
      limit: paginationModel.pageSize,
      opId: opId,
      betId: dataFilter.betId,
      nickname: dataFilter.nickname,
      gameTitle: dataFilter.gameTitle,
      gameId: dataFilter.gameId,
      playerId: dataFilter.playerId,
      currency: dataFilter.currencies,
      status: dataFilter.status as BetStatus[],
      page: paginationModel.page,
      sort: dataSort,
      placedAtFrom: dataFilter.placedAtFrom,
      placedAtTo: dataFilter.placedAtTo,
      autoRefresh: dataFilter.refresh,
      refresh: boxRefrech,
      key: betListType.LIST,
      searchDate: dataFilter.searchDate,
      version: dataFilter.version,
      cashierId: dataFilter.cashierId,
   };

   if (!dataFilter.canceled) {
      post.statuses = Object.keys(BetStatus).filter(
         (qry) => qry !== BetStatus.CANCELED
      ) as BetStatus[];
   }

   if (currenctBrandId && currenctBrandId !== 'All Brands') {
      post.brandId = currenctBrandId;
   }
   if (dataFilter.isTest !== 'all') {
      post.isTest = regexPattern.test(dataFilter.isTest);
   }
   if (dataFilter.isFun !== 'all') {
      post.isFun = regexPattern.test(dataFilter.isFun);
   }

   useGetBetsListQuery(post);

   const { mutate: mutateRollBack } = useRollBackMutation({
      onSuccess: (data) => {
         setBoxRefrech(boxRefrech + 1);
         toast.success(`You rollback the bet successfully`, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });
   const handleSetRollBackOpenBet = React.useCallback(
      (dto: RollbackOpenBetDto) => {
         mutateRollBack({ dto });
      },
      [mutateRollBack]
   );

   const handleCloseFullScreen = () => {
      setOpenFullScreen(false);
   };

   const handleOpenBet = (bet: Bet) => {
      setTransition(TransitionSlide);
      setCurrentBet(bet);
      setOpenBet(true);
   };

   const handleCloseBetDetails = () => {
      setOpenBet(false);
   };

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field;
         let data = {};
         switch (fieldName) {
            case 'gameId':
               data = {
                  gameId: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'playerId':
               data = {
                  playerId: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'currency':
               data = {
                  currency: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'opId':
               data = {
                  opId: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'status':
               data = {
                  status: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'pl':
               data = {
                  pl: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'winOdds':
               data = {
                  winOdds: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'betAmount':
               data = {
                  betAmount: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'betAmountInEUR':
               data = {
                  betAmountInEUR: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'betAmountInUSD':
               data = {
                  betAmountInUSD: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'plInUSD':
               data = {
                  plInUSD: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'plInEUR':
               data = {
                  plInEUR: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            case 'brandId':
               data = {
                  brandId: sortModel[0].sort === 'asc' ? 1 : -1,
               };
               break;
            default:
               data = {
                  placedAt: sortModel[0].sort === 'asc' ? 1 : -1,
               };
         }
         setDataSort(data);
      },
      []
   );

   const handleCopyButtonClick = (json: {}) => {
      const data = JSON.stringify(json, null, 2);
      navigator.clipboard.writeText(data);
      setChecked(true);
      setTimeout(() => setChecked(false), 1000);
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
            isRowSelectable={(params: GridRowParams) =>
               [BetStatus.OPEN].includes(params.row.status)
            }
            checkboxSelection={
               data?.bets?.filter((item) =>
                  [BetStatus.OPEN].includes(item.status)
               ) &&
               data?.bets?.filter((item) =>
                  [BetStatus.OPEN].includes(item.status)
               ).length > 0 &&
               hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_ROLLBACK_OPEN_BET_REQ
               )
            }
            rowHeight={isDesktop ? 44 : 30}
            sx={GridStyle}
            getRowId={(row) => row.id}
            rows={data?.bets || []}
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
            columnVisibilityModel={{
               betAmount: dataFilter.selectedCurrency === 0,
               betAmountInUSD: dataFilter.selectedCurrency === 1,
               betAmountInEUR: dataFilter.selectedCurrency === 2,
               pl: dataFilter.selectedCurrency === 0,
               plInUSD: dataFilter.selectedCurrency === 1,
               plInEUR: dataFilter.selectedCurrency === 2,
               balanceInUSD:
                  operator?.integrationType ===
                  IntegrationType.ALIEN_STANDALONE,
               newBalanceInUSD:
                  operator?.integrationType ===
                  IntegrationType.ALIEN_STANDALONE,
               ...columnVisibilityModel,
            }}
            onColumnVisibilityModelChange={(newModel) =>
               setColumnVisibilityModel(newModel)
            }
            onRowSelectionModelChange={(newSelectionModel) => {
               dataFilter.rollbackData(newSelectionModel);
            }}
            disableRowSelectionOnClick
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 30, 40, 50, 100]}
            sortingOrder={['desc', 'asc']}
            onSortModelChange={handleSortModelChange}
            loading={loadingBetsList}
            getRowClassName={(params) =>
               params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
         />

         <Dialog
            open={openFullScreen}
            onClose={handleCloseFullScreen}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            sx={{
               '.MuiPaper-root': {
                  p: '12px',
               },
            }}
            disableEnforceFocus
         >
            <IconButton
               edge="end"
               color="inherit"
               onClick={handleCloseFullScreen}
               sx={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  zIndex: 1,
                  color: (props) => props.palette.primary.contrastText,
               }}
            >
               <FontAwesomeIcon icon={faClose} fixedWidth fontSize={18} />
            </IconButton>
            {jsonData && jsonData.id && (
               <DialogContent sx={{ p: 1 }}>
                  <DynamicReactJson
                     key={`jsonDialog${jsonData.id}`}
                     src={jsonData}
                     theme="tomorrow"
                     enableClipboard={true}
                  />
               </DialogContent>
            )}
         </Dialog>

         <Dialog
            open={openBet}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseBetDetails}
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
                     Bet Details{' '}
                  </Typography>
               </Grid>
               <Grid item xs />
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleCloseBetDetails}
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
                           '.MuiTabs-scroller': {
                              justifyContent: 'center',
                              width: 'fit-content',
                              maxWidth: 'fit-content',
                           },
                        }}
                        aria-label="lab API tabs example"
                     >
                        <Tab label="Bet Detail" value={'betDetail'} />
                        {operator?.integrationType !==
                           IntegrationType.ALIEN_STANDALONE && (
                           <Tab label="Webhook Log" value={'log'} />
                        )}
                        {user?.scope === UserScope.SUPERADMIN && (
                           <Tab label="Json" value={'json'} />
                        )}
                     </TabList>
                     {user?.scope === UserScope.SUPERADMIN &&
                        data?.count &&
                        data?.count > 0 &&
                        data?.bets &&
                        value !== 'log' && (
                           <Grid
                              container
                              direction="row"
                              alignItems="center"
                              px={'8px'}
                              spacing={0}
                              sx={{
                                 svg: {
                                    fontSize: '16px',
                                    height: '16px',
                                 },
                              }}
                           >
                              <Grid item xs />

                              <Grid item>
                                 <Button
                                    variant="outlined"
                                    sx={{
                                       color: '#1F1933',
                                       path: {
                                          fill: checked
                                             ? theme.palette.success.main
                                             : darkPurple[9],
                                          stroke: 'unset !important',
                                       },
                                       svg: {
                                          mr: 1,
                                       },
                                    }}
                                    onClick={() => {
                                       handleCopyButtonClick(currentBet);
                                    }}
                                 >
                                    {checked ? (
                                       <Check />
                                    ) : (
                                       <FontAwesomeIcon
                                          icon={faCopy as IconProp}
                                          fixedWidth
                                       />
                                    )}
                                    Copy JSON
                                 </Button>
                              </Grid>
                           </Grid>
                        )}
                     <TabPanel
                        value={'betDetail'}
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
                                       {renderBetStatusCell(currentBet?.status)}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Win Odds
                                    </TableCell>
                                    <TableCell>
                                       {currentBet?.winOdds?.toFixed(2) ||
                                          (Math.floor(0 * 100) / 100).toFixed(
                                             2
                                          )}
                                       x
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Bet Amount
                                    </TableCell>
                                    <TableCell>
                                       {renderBetAmountCell(
                                          currentBet?.betAmount,
                                          ''
                                       )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       PL
                                    </TableCell>
                                    <TableCell>
                                       {renderPLCell(
                                          currentBet?.pl,
                                          currentBet?.currency
                                       )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow sx={{}}>
                                    <TableCell component="th" scope="row">
                                       Currency
                                    </TableCell>
                                    <TableCell>
                                       {currentBet?.currency}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Bet ID
                                    </TableCell>
                                    <TableCell>
                                       <PortalCopyValue
                                          value={currentBet?.id}
                                          isVisible={true}
                                          sx={{
                                             textOverflow: 'ellipsis',
                                             overflow: 'hidden',
                                             whiteSpace: 'nowrap',
                                             maxWidth: '400px',
                                          }}
                                       />
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Player ID
                                    </TableCell>
                                    <TableCell>
                                       <PortalCopyValue
                                          value={currentBet?.player?.playerId}
                                       />
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Game
                                    </TableCell>
                                    <TableCell>
                                       {currentBet?.gameId}-
                                       {currentBet?.gameTitle}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Placed At
                                    </TableCell>
                                    <TableCell
                                       sx={{ h6: { p: '0 !important' } }}
                                    >
                                       {currentBet?.placedAt &&
                                          renderTimeCell(
                                             new Date(
                                                currentBet?.placedAt
                                             ).toString(),
                                             true
                                          )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Resolved At
                                    </TableCell>
                                    <TableCell
                                       sx={{ h6: { p: '0 !important' } }}
                                    >
                                       {currentBet?.resolvedAt &&
                                          renderTimeCell(
                                             new Date(
                                                currentBet?.resolvedAt
                                             ).toString(),
                                             true
                                          )}
                                    </TableCell>
                                 </TableRow>
                              </TableBody>
                           </Table>
                        </Grid>
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
                                 {currentBet?.gameId?.startsWith('1') && (
                                    <TableRow>
                                       <TableCell component="th" scope="row">
                                          Game Mode
                                       </TableCell>
                                       <TableCell
                                          sx={{ textTransform: 'capitalize' }}
                                       >
                                          {currentBet?.gameData?.mode}
                                       </TableCell>
                                    </TableRow>
                                 )}
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Game Type
                                    </TableCell>
                                    <TableCell>
                                       {currentBet?.gameId?.startsWith('1')
                                          ? 'Crash'
                                          : 'JDB'}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       RoundIndex
                                    </TableCell>
                                    <TableCell>
                                       {currentBet?.gameData?.roundIndex}
                                    </TableCell>
                                 </TableRow>
                                 {currentBet?.gameId?.startsWith('1') && (
                                    <>
                                       <TableRow>
                                          <TableCell component="th" scope="row">
                                             Crash Point
                                          </TableCell>
                                          <TableCell>
                                             {currentBet?.gameData?.crashPoint}x
                                          </TableCell>
                                       </TableRow>
                                       <TableRow>
                                          <TableCell component="th" scope="row">
                                             Odds
                                          </TableCell>
                                          <TableCell>{`${currentBet?.odds}x${
                                             currentBet?.gameData?.mode ===
                                             'range'
                                                ? ` ~ ${currentBet?.gameData?.oddsRange}x`
                                                : ''
                                          }`}</TableCell>
                                       </TableRow>
                                       <TableRow>
                                          <TableCell component="th" scope="row">
                                             Auto Cashout
                                          </TableCell>
                                          <TableCell>
                                             {currentBet?.gameData
                                                ?.autoCashout ? (
                                                <FontAwesomeIcon
                                                   icon={faCheck as IconProp}
                                                   fixedWidth
                                                   color="green"
                                                />
                                             ) : (
                                                <FontAwesomeIcon
                                                   icon={faClose as IconProp}
                                                   fixedWidth
                                                   color="red"
                                                />
                                             )}
                                          </TableCell>
                                       </TableRow>
                                       <TableRow>
                                          <TableCell component="th" scope="row">
                                             Insurance
                                          </TableCell>
                                          <TableCell>
                                             {currentBet?.gameData
                                                ?.insurance ? (
                                                <FontAwesomeIcon
                                                   icon={faCheck as IconProp}
                                                   fixedWidth
                                                   color="green"
                                                />
                                             ) : (
                                                <FontAwesomeIcon
                                                   icon={faClose as IconProp}
                                                   fixedWidth
                                                   color="red"
                                                />
                                             )}
                                          </TableCell>
                                       </TableRow>
                                       <TableRow>
                                          <TableCell component="th" scope="row">
                                             Seat
                                          </TableCell>
                                          <TableCell>{`${
                                             currentBet?.gameData?.index === 0
                                                ? 1
                                                : currentBet?.gameData
                                                     ?.index === 1
                                                ? 2
                                                : ''
                                          }`}</TableCell>
                                       </TableRow>
                                       <TableRow>
                                          <TableCell component="th" scope="row">
                                             Hash
                                          </TableCell>
                                          <TableCell>
                                             <PortalCopyValue
                                                value={
                                                   currentBet?.gameData?.hash ||
                                                   ''
                                                }
                                                isVisible={true}
                                                sx={{
                                                   textOverflow: 'ellipsis',
                                                   overflow: 'hidden',
                                                   whiteSpace: 'nowrap',
                                                   maxWidth: isDesktop
                                                      ? '400px'
                                                      : '250px',
                                                }}
                                             />
                                          </TableCell>
                                       </TableRow>
                                       <TableRow>
                                          <TableCell component="th" scope="row">
                                             Md5
                                          </TableCell>
                                          <TableCell>
                                             <PortalCopyValue
                                                isVisible={true}
                                                value={
                                                   currentBet?.gameData?.md5 ||
                                                   ''
                                                }
                                                sx={{
                                                   textOverflow: 'ellipsis',
                                                   overflow: 'hidden',
                                                   whiteSpace: 'nowrap',
                                                   maxWidth: isDesktop
                                                      ? '400px'
                                                      : '250px',
                                                }}
                                             />
                                          </TableCell>
                                       </TableRow>
                                    </>
                                 )}
                              </TableBody>
                           </Table>
                        </Grid>
                     </TabPanel>
                     {operator?.integrationType !==
                        IntegrationType.ALIEN_STANDALONE && (
                        <TabPanel
                           value={'log'}
                           sx={{
                              height: PageWith4Toolbar,
                              overflow: 'auto',
                              mt: '8px',
                              py: '4px !important',
                           }}
                        >
                           <WebhookDataDetails
                              opId={opId}
                              betId={currentBet?.id}
                           />
                        </TabPanel>
                     )}

                     <TabPanel value={'json'} sx={{ py: '4px !important' }}>
                        <Grid
                           container
                           direction="row"
                           alignItems="center"
                           mb={2}
                           spacing={0}
                        >
                           {currentBet && currentBet.id && (
                              <Grid
                                 item
                                 xs={12}
                                 sx={{
                                    '.react-json-view': {
                                       width: '100%',
                                       overflow: 'auto',
                                       borderRadius: '8px',
                                       maxHeight: 'calc(100vh - 200px)',
                                    },
                                 }}
                              >
                                 <DynamicReactJson
                                    key={`jsonDialog${currentBet.id}`}
                                    src={currentBet}
                                    theme="tomorrow"
                                    enableClipboard={true}
                                 />
                              </Grid>
                           )}
                        </Grid>
                     </TabPanel>
                  </TabContext>
               </Grid>
            </DialogContent>
         </Dialog>
      </Box>
   );
}
