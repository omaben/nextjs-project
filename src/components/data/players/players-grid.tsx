import SelectTheme from '@/components/SelectTheme';
import GridStyle from '@/components/custom/GridStyle';
import PortalCurrencyValue from '@/components/custom/PortalCurrencyValue';
import {
   renderBrandCell,
   renderPlayerStatusCell,
   renderTestStatusCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells';
import {
   DeletePlayerDto,
   ForceCashOutDto,
   GetTopupCurrenciesDto,
   IntegrationType,
   Operator,
   Player,
   SetPlayerChatIsBlockedDto,
   SetPlayerIsBlockedDto,
   SetPlayerIsTestDto,
   SetPlayerNicknameDto,
   UpdateWalletDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front';
import { TopupDto } from '@alienbackoffice/back-front/lib/player/dto/topup.dto';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown, faBan } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   Box,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogProps,
   DialogTitle,
   FormControl,
   IconButton,
   InputLabel,
   MenuItem,
   Select,
   Stack,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridSortModel,
} from '@mui/x-data-grid-pro';
import { darkPurple, neutral, red } from 'colors';
import React, { MouseEventHandler } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
   saveTopupCurrencies,
   selectAuthCurrencies,
   selectAuthCurrentBrand,
   selectAuthCurrentOperator,
   selectAuthOperator,
   selectAuthPlayersList,
   selectAuthTopupCurrencies,
} from 'redux/authSlice';
import { selectLoadingPlayersList } from 'redux/loadingSlice';
import { selectBoClient } from 'redux/socketSlice';
import { store } from 'redux/store';
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith3Toolbar,
   PageWith5Toolbar,
} from 'services/globalFunctions';
import { hasDetailsPermission } from 'services/permissionHandler';
import { v4 as uuidv4 } from 'uuid';
import { useForceCashOutMutation } from '../cashinCashout/lib/hooks/queries';
import {
   UseGetPlayersListQueryProps,
   useAllocateWalletPlayerMutation,
   useChatIsBlockedPlayerMutation,
   useGetPlayersListQuery,
   useIsBlockedPlayerMutation,
   useIsTestPlayerMutation,
   useIsTopUpPlayerMutation,
   useRemovePlayerMutation,
   useSetNicknamePlayerMutation,
} from './lib/hooks/queries';

export default function AllPlayers(dataFilter: {
   playerId: string;
   brandId: string;
   nickname: string;
   brandName: string;
   isBlocked: string;
   isTest: string;
   isFun: string;
   emailAddress: string;
   telegramId: string;
   onlyWithPendingVerification: boolean;
   hasDeposit: string;
   registeredAtFrom: number;
   registeredAtTo: number;
   refresh: number;
   version?: string;
}) {
   const loadingPlayersList = useSelector(selectLoadingPlayersList);
   const topupCurrencies = useSelector(selectAuthTopupCurrencies);
   const boClient = useSelector(selectBoClient);
   const [dataSort, setDataSort]: any = React.useState({
      createdAt: -1,
   });
   const opId = useSelector(selectAuthOperator);
   const operator = useSelector(selectAuthCurrentOperator) as Operator;
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   });
   const [openBlockPlayer, setOpenBlockPlayer] = React.useState(false);
   const [reasonInput, setReasonInput] = React.useState('');
   const [playerOpen, setPlayerOpen]: any = React.useState({ id: -1 });
   const [maxWidth, setMaxWidth] =
      React.useState<DialogProps['maxWidth']>('sm');
   const [fullWidth, setFullWidth] = React.useState(true);
   const theme = useTheme();
   const [errorMessage, setErrorMessage] = React.useState([]);
   const [boxRefrech, setBoxRefrech] = React.useState(0);
   const [nickname, setNickname] = React.useState('');
   const [amountTopUpInput, setAmountTopUpInput] = React.useState(0) as any;
   const [amountTopUp, setAmountTopUp] = React.useState(0);
   const [currency, setCurrency] = React.useState('USD');
   const [openTopUpPlayer, setOpenTopUpPlayer] = React.useState(false);
   const [openNicknamePlayer, setOpenNicknamePlayer] = React.useState(false);
   const [openRemovePlayer, setOpenRemovePlayer] = React.useState(false);
   const [openForceCashOut, setOpenForceCashOut] = React.useState(false);
   const [currentPlayer, setCurrentPlayer] = React.useState({} as Player);
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({});
   var regexPattern = new RegExp('true');
   const data = useSelector(selectAuthPlayersList);
   const [action, setAction] = React.useState(0);
   const columns: GridColDef[] = [
      {
         field: 'playerId',
         headerName: 'Player',
         renderCell: (params) =>
            renderPlayerStatusCell(
               params.value,
               false,
               params.row.playerStatus === true,
               params.row.nicknameIsSet && params.row.nickname,
               params.row.blocked,
               params.row as Player,
               true
            ),
         minWidth: 150,
         flex: 1,
         hideable: false,
      },
      {
         field: 'brandId',
         headerName: 'Brand',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) =>
            renderBrandCell(
               opId,
               params.row.brand?.brandId,
               params.row.brand?.brandName
            ),
         minWidth: 130,
         flex: 1,
         filterable: false,
         disableColumnMenu: true,
      },
      {
         field: 'affId',
         headerName: 'Affiliate ID',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) => params.row.affId,
         minWidth: 130,
         flex: 1,
         filterable: false,
         disableColumnMenu: true,
      },
      {
         field: 'balance',
         headerName: 'Balance',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params: { row: Player }) => (
            <Typography>
               <PortalCurrencyValue
                  value={params.row.wallet?.inUSD?.balance}
                  currency={'USD'}
                  textTransform="uppercase"
                  visibleCurrency={true}
               />
            </Typography>
         ),
         hideable: false,
         minWidth: 100,
         // sortable: false,
         filterable: false,
         disableColumnMenu: true,
         flex: 1,
      },
      {
         field: 'statusT',
         headerName: 'Status',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) => {
            return (
               <>
                  {params.row.isBlocked && (
                     <IconButton
                        sx={{
                           svg: {
                              height: '18px',
                              width: '18px',
                           },
                           color: params.row.isBlocked
                              ? `${red[2]} !important`
                              : `${neutral[6]} !important`,
                        }}
                        onClick={() => {
                           handleOpenBlockedReason(params.row.blockReason);
                        }}
                     >
                        {params.row.blockReason &&
                        params.row.blockReason.length > 0 ? (
                           <FontAwesomeIcon icon={faBan as IconProp} />
                        ) : (
                           <FontAwesomeIcon icon={faBan} />
                        )}
                     </IconButton>
                  )}{' '}
                  {renderTestStatusCell(params.row.isTest)}
               </>
            );
         },
         minWidth: 150,
         flex: 1,
         sortable: false,
         cellClassName: 'caption-column',
         disableColumnMenu: true,
      },
      {
         field: 'chatIsBlocked',
         headerName: 'Chat Status',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) => {
            return (
               <>
                  {params.row.chatIsBlocked && (
                     <IconButton
                        sx={{
                           svg: {
                              height: '18px',
                              width: '18px',
                           },
                           color: params.row.chatIsBlocked
                              ? `${red[2]} !important`
                              : `${neutral[6]} !important`,
                        }}
                     >
                        <FontAwesomeIcon icon={faBan} />
                     </IconButton>
                  )}
               </>
            );
         },
         minWidth: 150,
         flex: 1,
         sortable: false,
         cellClassName: 'caption-column',
         disableColumnMenu: true,
      },
      {
         field: 'createdAt',
         headerName: 'Joined At',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
         disableColumnMenu: true,
      },
      {
         field: 'updatedAt',
         headerName: 'Last activity',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
         disableColumnMenu: true,
      },
   ];
   const [openBlockedReason, setOpenBlockedReason] = React.useState(false);
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0);
   const currencies = useSelector(selectAuthCurrencies);
   const [openAllocateWallet, setOpenAllocateWallet] = React.useState(false);
   const post: UseGetPlayersListQueryProps = {
      limit: paginationModel.pageSize,
      page: paginationModel.page,
      opId: opId,
      sort: dataSort,
      refresh: boxRefrech,
      autoRefresh: dataFilter.refresh,
      playerId: dataFilter.playerId,
      brandName: dataFilter.brandName,
      nickname: dataFilter.nickname,
      telegramId: dataFilter.telegramId,
      emailAddress: dataFilter.emailAddress,
      version: dataFilter.version,
   };
   if (dataFilter.registeredAtFrom > 0) {
      post.registeredAtFrom = dataFilter.registeredAtFrom;
   }
   if (dataFilter.registeredAtTo > 0) {
      post.registeredAtTo = dataFilter.registeredAtTo;
   }
   if (dataFilter.hasDeposit !== 'all') {
      post.hasDeposit = regexPattern.test(dataFilter.hasDeposit);
   }
   if (dataFilter.isBlocked !== 'all') {
      post.isBlocked = regexPattern.test(dataFilter.isBlocked);
   }
   if (dataFilter.isTest !== 'all') {
      post.isTest = regexPattern.test(dataFilter.isTest);
   }
   if (dataFilter.isFun !== 'all') {
      post.isFun = regexPattern.test(dataFilter.isFun);
   }
   if (
      dataFilter.onlyWithPendingVerification &&
      operator?.integrationType === IntegrationType.ALIEN_STANDALONE
   ) {
      post.onlyWithPendingVerification = dataFilter.onlyWithPendingVerification;
   }
   const brandId = useSelector(selectAuthCurrentBrand);
   if (brandId && brandId !== 'All Brands') {
      post.brandId = brandId;
   }

   useGetPlayersListQuery(post);

   const { mutate } = useIsTestPlayerMutation({
      onSuccess: (data) => {
         setBoxRefrech(boxRefrech + 1);
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateBlocked } = useIsBlockedPlayerMutation({
      onSuccess: (data) => {
         setBoxRefrech(boxRefrech + 1);
         toast.success(
            `You ${
               data.data?.isBlocked ? 'blocked' : 'unblocked'
            } the player successfully`,
            {
               position: toast.POSITION.TOP_CENTER,
            }
         );
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateChatBlocked } = useChatIsBlockedPlayerMutation({
      onSuccess: (data) => {
         setBoxRefrech(boxRefrech + 1);
         toast.success(
            `You ${
               data.data?.chatIsBlocked ? 'blocked' : 'unblocked'
            } the chat successfully`,
            {
               position: toast.POSITION.TOP_CENTER,
            }
         );
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateTopUp } = useIsTopUpPlayerMutation({
      onSuccess: () => {
         toast.success('You Topped Up Player Successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
         setBoxRefrech(boxRefrech + 1);
         handleCloseTopUpPlayer();
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateNickname } = useSetNicknamePlayerMutation({
      onSuccess: () => {
         toast.success('You set the Player nickname Successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
         setBoxRefrech(boxRefrech + 1);
         handleCloseNicknamePlayer();
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateRemovePlayer } = useRemovePlayerMutation({
      onSuccess: () => {
         setBoxRefrech(boxRefrech + 1);
         toast.success('You deleted the Player Successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
         setOpenRemovePlayer(false);
      },
   });

   const { mutate: mutateAllocateWallet } = useAllocateWalletPlayerMutation({
      onSuccess: () => {
         setBoxRefrech(boxRefrech + 1);
         setOpenAllocateWallet(false);
         toast.success('Wallet alocated successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
      },
      onError: (error) => {
         setOpenAllocateWallet(false);
      },
   });

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

   const handleCloseRemovePlayer = () => {
      setOpenRemovePlayer(false);
   };

   const handleOpenRemovePlayer = (player: Player) => {
      setCurrentPlayer(player);
      setOpenRemovePlayer(true);
   };

   const handleCloseForceCashOut = () => {
      setOpenForceCashOut(false);
   };

   const handleOpenForceCashOut = (player: Player) => {
      setCurrentPlayer(player);
      setOpenForceCashOut(true);
   };

   const handleSetPlayerIsTest = React.useCallback(
      (dto: SetPlayerIsTestDto) => {
         mutate({ dto });
      },
      [mutate]
   );

   const handleSetPlayerIsBlocked = React.useCallback(
      (dto: SetPlayerIsBlockedDto) => {
         mutateBlocked({ dto });
      },
      [mutateBlocked]
   );

   const handleSetPlayerChatIsBlocked = React.useCallback(
      (dto: SetPlayerChatIsBlockedDto) => {
         mutateChatBlocked({ dto });
      },
      [mutateChatBlocked]
   );

   const handleForceCashOut = React.useCallback(
      (dto: ForceCashOutDto) => {
         mutateForceCashOut({ dto });
      },
      [mutateForceCashOut]
   );

   const handleOpenBlockedReason = (blockReason: any) => {
      setOpenBlockedReason(true);
   };

   const handleCloseBlockPlayer = () => {
      setOpenBlockPlayer(false);
   };

   const handleBlockPlayer = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (reasonInput) {
         handleSetPlayerIsBlocked({
            opId: opId,
            playerId: '',
            isBlocked: true,
         });
      }
   };

   const openTopUpPlayerHandle = (player: Player) => {
      setAmountTopUp(0);
      setAmountTopUpInput(0);
      store.dispatch(saveTopupCurrencies([]));
      if (player && player.opId) {
         const dto: GetTopupCurrenciesDto = {
            opId: player.opId,
         };
         if (player?.brand?.brandId) {
            dto.brandId = player?.brand?.brandId;
         }
         boClient?.operator.getTopupCurrencies(
            { ...dto },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_TOPUP_CURRENCIES_REQ,
               },
            }
         );
      }
      setPlayerOpen(player);
      setOpenTopUpPlayer(true);
   };

   const openNicknamePlayerHandle = (player: Player) => {
      setNickname(player.nickname || '');
      setPlayerOpen(player);
      setOpenNicknamePlayer(true);
   };

   const hasActionPermission = () => {
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SET_PLAYER_NICKNAME_REQ
         ) ||
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SET_PLAYER_IS_TEST_REQ
         ) ||
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SET_PLAYER_IS_BLOCKED_REQ
         ) ||
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SET_PLAYER_CHAT_IS_BLOCKED_REQ
         ) ||
         hasDetailsPermission(UserPermissionEvent.BACKOFFICE_TOPUP_REQ) ||
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_ALLOCATE_WALLET_ADDRESS_REQ
         ) ||
         hasDetailsPermission(UserPermissionEvent.BACKOFFICE_DELETE_PLAYER_REQ)
      ) {
         return true;
      } else {
         return false;
      }
   };

   const Actions = (data: Player) => {
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
            UserPermissionEvent.BACKOFFICE_SET_PLAYER_NICKNAME_REQ
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
                  Set nickname
               </Typography>
            ),
            onClick: () => openNicknamePlayerHandle(data),
         });
      }
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SET_PLAYER_IS_TEST_REQ
         )
      ) {
         actiondata.push({
            value: '2',
            label: (
               <Typography
                  variant="bodySmallBold"
                  sx={{
                     svg: { position: 'relative', top: '3px', mr: '15px' },
                     flex: 1,
                  }}
               >
                  {data.isTest ? 'Set as real player' : 'Set as test player'}
               </Typography>
            ),
            onClick: () =>
               handleSetPlayerIsTest({
                  isTest: !data.isTest,
                  opId: opId,
                  playerId: data.playerId,
               }),
         });
      }
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SET_PLAYER_IS_BLOCKED_REQ
         )
      ) {
         actiondata.push({
            value: '3',
            label: (
               <Typography
                  variant="bodySmallBold"
                  sx={{
                     svg: { position: 'relative', top: '3px', mr: '15px' },
                     flex: 1,
                  }}
               >
                  {data.isBlocked ? 'Unblock' : 'Block'}
               </Typography>
            ),
            // onClick: () => handleReasonInput(data),
            onClick: () =>
               handleSetPlayerIsBlocked({
                  opId: opId,
                  playerId: data.playerId,
                  isBlocked: !data.isBlocked,
               }),
         });
      }
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SET_PLAYER_CHAT_IS_BLOCKED_REQ
         )
      ) {
         actiondata.push({
            value: '4',
            label: (
               <Typography
                  variant="bodySmallBold"
                  sx={{
                     svg: { position: 'relative', top: '3px', mr: '15px' },
                     flex: 1,
                  }}
               >
                  {data.chatIsBlocked ? 'Unblock chat' : 'Block chat'}
               </Typography>
            ),
            // onClick: () => handleReasonInput(data),
            onClick: () =>
               handleSetPlayerChatIsBlocked({
                  opId: opId,
                  playerId: data.playerId,
                  isBlocked: !data.chatIsBlocked,
               }),
         });
      }
      if (data?.integrationType === IntegrationType.ALIEN_STANDALONE) {
         if (hasDetailsPermission(UserPermissionEvent.BACKOFFICE_TOPUP_REQ)) {
            actiondata.push({
               value: '5',
               label: (
                  <Typography
                     variant="bodySmallBold"
                     sx={{
                        svg: { position: 'relative', top: '3px', mr: '15px' },
                        flex: 1,
                     }}
                  >
                     Top Up
                  </Typography>
               ),
               onClick: () => openTopUpPlayerHandle(data),
            });
         }
         if (
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_ALLOCATE_WALLET_ADDRESS_REQ
            )
         ) {
            actiondata.push({
               value: '6',
               label: (
                  <Typography
                     variant="bodySmallBold"
                     sx={{
                        svg: { position: 'relative', top: '3px', mr: '15px' },
                        flex: 1,
                     }}
                  >
                     Allocate Wallet
                  </Typography>
               ),
               onClick: () => handleOpenAllocateWallet(data),
            });
         }
         if (
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_DELETE_PLAYER_REQ
            )
         ) {
            actiondata.push({
               value: '7',
               label: (
                  <Typography
                     variant="bodySmallBold"
                     sx={{
                        svg: { position: 'relative', top: '3px', mr: '15px' },
                        flex: 1,
                     }}
                  >
                     Delete
                  </Typography>
               ),
               onClick: () => handleOpenRemovePlayer(data),
            });
         }
      }
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_FORCE_CASH_OUT_REQ
         ) &&
         [
            IntegrationType.ALIEN_WALLET_TRANSFER,
            IntegrationType.PG_WALLET_TRANSFER,
         ].includes(operator.integrationType as IntegrationType)
      ) {
         actiondata.push({
            value: '8',
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
      // actiondata.push({
      //    value: '8',
      //    label: (
      //       <Typography
      //          variant="bodySmallBold"
      //          sx={{
      //             svg: { position: 'relative', top: '3px', mr: '15px' },
      //             flex: 1,
      //          }}
      //       >
      //          Related Acounts
      //       </Typography>
      //    ),
      //    onClick: () =>
      //       router.push(`/players/related-accounts?id=${data.playerId}`),
      // })
      return actiondata;
   };

   const handleChangeReason = (event: React.ChangeEvent<HTMLInputElement>) => {
      setReasonInput(event.target.value);
      if (errorMessage) {
         setErrorMessage([]);
      }
   };

   if (hasActionPermission()) {
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

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field;
         let data = {};
         fieldName === 'playerId'
            ? (data = {
                 playerId: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'affId'
            ? (data = {
                 affId: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'brandId'
            ? (data = {
                 brandName: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'isTest'
            ? (data = {
                 isTest: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'isBlocked'
            ? (data = {
                 isBlocked: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'createdAt'
            ? (data = {
                 createdAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'balance'
            ? (data = {
                 balance: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'updatedAt'
            ? (data = {
                 updatedAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : (data = {
                 createdAt: sortModel[0].sort === 'asc' ? 1 : -1,
              });
         setDataSort(data);
      },
      []
   );

   const handleCloseTopUpPlayer = () => {
      setOpenTopUpPlayer(false);
   };

   const handleCloseNicknamePlayer = () => {
      setOpenNicknamePlayer(false);
   };

   const topUpPlayerHandle = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const post: TopupDto = {
         opId,
         playerId: playerOpen.playerId,
         amount: amountTopUp,
         currency: currency,
      };
      topUpPlayerSubmit(post);
   };

   const nicknamePlayerHandle = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const post: SetPlayerNicknameDto = {
         opId,
         playerId: playerOpen.playerId,
         nickname: nickname,
      };
      nicknamePlayerSubmit(post);
   };

   const topUpPlayerSubmit = React.useCallback(
      (dto: TopupDto) => {
         handleCloseTopUpPlayer();
         mutateTopUp({ dto });
      },
      [mutateTopUp]
   );

   const nicknamePlayerSubmit = React.useCallback(
      (dto: SetPlayerNicknameDto) => {
         handleCloseNicknamePlayer();
         mutateNickname({ dto });
      },
      [mutateNickname]
   );

   const handleRemovePlayer = React.useCallback(
      (dto: DeletePlayerDto) => {
         mutateRemovePlayer({ dto });
      },
      [mutateRemovePlayer]
   );

   const handleOpenAllocateWallet = (data: Player) => {
      setPlayerOpen(data);
      setOpenAllocateWallet(true);
   };

   const handleAllocateWallet = React.useCallback(
      (dto: UpdateWalletDto) => {
         mutateAllocateWallet({ dto });
      },
      [mutateAllocateWallet]
   );

   const handleCloseAllocateWallet = () => {
      setOpenAllocateWallet(false);
   };

   React.useEffect(() => {
      setRowCountState((prevRowCountState: any) =>
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
            height: isDesktop ? PageWith3Toolbar : PageWith5Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            rowHeight={isDesktop ? 44 : 30}
            sx={GridStyle}
            getRowId={(row) => row.playerId}
            rows={data?.players || []}
            paginationMode="server"
            sortingMode="server"
            rowCount={rowCountState | 0}
            columns={columns}
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pagination
            pageSizeOptions={[10, 20, 30, 40, 50, 100]}
            sortingOrder={['desc', 'asc']}
            onSortModelChange={handleSortModelChange}
            columnVisibilityModel={{
               balance:
                  operator?.integrationType ===
                  IntegrationType.ALIEN_STANDALONE,
               ...columnVisibilityModel,
            }}
            onColumnVisibilityModelChange={(newModel) =>
               setColumnVisibilityModel(newModel)
            }
            loading={loadingPlayersList}
            getRowClassName={(params) =>
               params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            disableColumnMenu
            slots={{
               noRowsOverlay: CustomNoRowsOverlay,
               noResultsOverlay: CustomNoRowsOverlay,
               columnSortedAscendingIcon: CustomMenuSortAscendingIcon,
               columnSortedDescendingIcon: CustomMenuSortDescendingIcon,
               columnUnsortedIcon: CustomMenuSortIcon,
            }}
         />

         <Dialog
            open={openBlockPlayer}
            onClose={handleCloseBlockPlayer}
            aria-labelledby="form-dialog-title"
            maxWidth={maxWidth}
            fullWidth={fullWidth}
         >
            <DialogTitle id="form-dialog-title">Block Player</DialogTitle>
            <form onSubmit={handleBlockPlayer}>
               <DialogContent>
                  <TextField
                     autoFocus
                     error={!reasonInput}
                     margin="dense"
                     id="name"
                     label="Reason"
                     helperText="Please enter a reason"
                     type="text"
                     value={reasonInput}
                     fullWidth
                     onChange={handleChangeReason}
                     autoComplete="off"
                  />
               </DialogContent>
               <DialogActions>
                  <Button onClick={handleCloseBlockPlayer} color="error">
                     Cancel
                  </Button>
                  <Button type="submit" color="primary" variant="contained">
                     Submit
                  </Button>
               </DialogActions>
            </form>
         </Dialog>

         <Dialog
            open={openTopUpPlayer}
            onClose={handleCloseTopUpPlayer}
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
            <DialogTitle id="form-dialog-title">Top Up Player</DialogTitle>
            <form onSubmit={topUpPlayerHandle}>
               <DialogContent sx={{ py: 0 }}>
                  <TextField
                     autoFocus
                     margin="dense"
                     id="amount"
                     label="Amount"
                     type="number"
                     error={amountTopUpInput === 0}
                     value={amountTopUpInput}
                     fullWidth
                     onChange={(event) => {
                        setAmountTopUpInput(event.target.value as any);
                        if (event.target.value) {
                           setAmountTopUp(
                              parseFloat(event.target.value).valueOf()
                           );
                        }
                     }}
                     autoComplete="off"
                     inputProps={{
                        inputMode: 'numeric',
                        pattern: '[-]?[0-9]*[.,]?[0-9]+([eE][-+]?[0-9]+)?',
                     }}
                  />
                  <FormControl
                     sx={{
                        width: '100%',
                     }}
                  >
                     <InputLabel id="demo-simple-select-disabled-label">
                        Currency
                     </InputLabel>
                     <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Currency"
                        sx={{
                           width: '100%',
                        }}
                        error={!currency}
                        value={currency}
                        name="currency"
                        onChange={(event) => setCurrency(event.target.value)}
                        IconComponent={() => (
                           <FontAwesomeIcon
                              icon={faAngleDown as IconProp}
                              className="selectIcon"
                              size="sm"
                           /> // Use FontAwesome icon as the select icon
                        )}
                     >
                        {topupCurrencies &&
                           topupCurrencies.map((item, index: number) => {
                              return (
                                 <MenuItem
                                    key={`currency${index}`}
                                    value={item}
                                 >
                                    <Stack
                                       direction="row"
                                       alignItems="center"
                                       gap={2}
                                       textTransform="capitalize"
                                    >
                                       {item}
                                    </Stack>
                                 </MenuItem>
                              );
                           })}
                     </Select>
                  </FormControl>
               </DialogContent>
               <DialogActions>
                  <Button
                     onClick={handleCloseTopUpPlayer}
                     color="secondary"
                     variant="outlined"
                     sx={{ height: 32, borderColor: darkPurple[10] }}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     color="secondary"
                     variant="contained"
                     disabled={!currency || amountTopUp === 0}
                     sx={{ height: 32 }}
                  >
                     Save
                  </Button>
               </DialogActions>
            </form>
         </Dialog>

         <Dialog
            open={openNicknamePlayer}
            onClose={handleCloseNicknamePlayer}
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
            <DialogTitle id="form-dialog-title"> Player Nickname</DialogTitle>
            <form onSubmit={nicknamePlayerHandle}>
               <DialogContent sx={{ py: 0 }}>
                  <TextField
                     autoFocus
                     margin="dense"
                     id="nickname"
                     label="Nickname"
                     type="text"
                     required
                     value={nickname}
                     fullWidth
                     onChange={(event) => setNickname(event.target.value)}
                     autoComplete="off"
                  />
               </DialogContent>
               <DialogActions>
                  <Button
                     onClick={handleCloseNicknamePlayer}
                     color="secondary"
                     variant="outlined"
                     sx={{ height: 32, borderColor: darkPurple[10] }}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     color="secondary"
                     variant="contained"
                     disabled={!nickname}
                     sx={{ height: 32 }}
                  >
                     Save
                  </Button>
               </DialogActions>
            </form>
         </Dialog>

         <Dialog
            open={openRemovePlayer}
            onClose={handleCloseRemovePlayer}
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
            <DialogTitle id="form-dialog-title">Delete Player</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this Player?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleCloseRemovePlayer}
                  color="secondary"
                  variant="outlined"
                  sx={{
                     height: 32,
                     borderColor: darkPurple[10],
                  }}
               >
                  Cancel
               </Button>
               {currentPlayer && currentPlayer.opId && (
                  <Button
                     color="secondary"
                     variant="contained"
                     sx={{ height: 32 }}
                     onClick={() =>
                        handleRemovePlayer({
                           opId: currentPlayer.opId,
                           playerId: currentPlayer.playerId,
                        })
                     }
                  >
                     Confirm
                  </Button>
               )}
            </DialogActions>
         </Dialog>

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
                  Are you sure you want to force cash out for this Player?
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
               {currentPlayer && currentPlayer.opId && (
                  <Button
                     color="secondary"
                     variant="contained"
                     sx={{ height: 32 }}
                     onClick={() =>
                        handleForceCashOut({
                           opId: currentPlayer.opId,
                           playerId: currentPlayer.playerId,
                        })
                     }
                  >
                     Confirm
                  </Button>
               )}
            </DialogActions>
         </Dialog>

         <Dialog
            open={openAllocateWallet}
            onClose={handleCloseAllocateWallet}
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
            <DialogTitle id="form-dialog-title">Allocate Wallet</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to allocate the wallet for this Player?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleCloseAllocateWallet}
                  color="secondary"
                  variant="outlined"
                  sx={{
                     height: 32,
                     borderColor: darkPurple[10],
                  }}
               >
                  Cancel
               </Button>
               {playerOpen && playerOpen.opId && (
                  <Button
                     color="secondary"
                     variant="contained"
                     sx={{ height: 32 }}
                     onClick={() =>
                        handleAllocateWallet({
                           opId: playerOpen.opId,
                           playerId: playerOpen.playerId,
                        })
                     }
                  >
                     Confirm
                  </Button>
               )}
            </DialogActions>
         </Dialog>
      </Box>
   );
}
