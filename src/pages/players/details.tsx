import CustomLoader from '@/components/custom/CustomLoader';
import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar';
import HeaderToolbar from '@/components/custom/HeaderToolbar';
import MoreFiltersButton from '@/components/custom/MoreFiltersButton';
import PortalBetsLineChart from '@/components/custom/PortalBetsLineChart';
import PortalCopyValue from '@/components/custom/PortalCopyValue';
import { FilterChip } from '@/components/custom/PortalFilterChips';
import TransitionSlide from '@/components/custom/TransitionSlide';
import DateToolbar from '@/components/custom/customDateToolbar';
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar';
import PlayerActivities from '@/components/data/activities/player-activities-grid';
import AllBets from '@/components/data/bets/bets-grid';
import { useRollBackMutation } from '@/components/data/bets/lib/hooks/queries';
import CashinCashoutData from '@/components/data/cashinCashout/cashin-cashout-grid';
import { useForceCashOutMutation } from '@/components/data/cashinCashout/lib/hooks/queries';
import { statusData } from '@/components/data/filters';
import {
   useAllocateWalletPlayerMutation,
   useChatIsBlockedPlayerMutation,
   useGetPlayerQuery,
   useIsBlockedPlayerMutation,
   useIsTestPlayerMutation,
   useIsTopUpPlayerMutation,
   useRemovePlayerMutation,
   useSeNotePlayerMutation,
   useSetNicknamePlayerMutation,
   useUpdatePlayerStatsMutation,
   useUpdateWalletPlayerMutation,
} from '@/components/data/players/lib/hooks/queries';
import PlayerProfit from '@/components/data/players/player-profit';
import RelatedAccounts from '@/components/data/players/player-related-accounts';
import Transactions from '@/components/data/transactions/transactions-grid';
import {
   BetStatus,
   DeletePlayerDto,
   ForceCashOutDto,
   GetTopupCurrenciesDto,
   IntegrationType,
   Operator,
   Player,
   RollbackOpenBetDto,
   SetPlayerChatIsBlockedDto,
   SetPlayerIsBlockedDto,
   SetPlayerIsTestDto,
   SetPlayerNicknameDto,
   SetPlayerNoteDto,
   TopupDto,
   UpdatePlayerStatsDto,
   UpdateWalletDto,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front';
import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
   faAngleDown,
   faBan,
   faCircle,
   faCircle as faCircleOutline,
   faRobot,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Clear from '@mui/icons-material/Clear';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
   Autocomplete,
   Avatar,
   Box,
   Card,
   CardContent,
   Checkbox,
   Chip,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogProps,
   DialogTitle,
   Divider,
   FormControlLabel,
   Grid,
   IconButton,
   InputAdornment,
   InputLabel,
   MenuItem,
   Button as MuiButton,
   FormControl as MuiFormControl,
   Select,
   Tab,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import { Stack, spacing } from '@mui/system';
import { ImoonGray, darkPurple } from 'colors';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
   saveBetsList,
   saveFinancialReportsGraph,
   savePlayerActivitiesList,
   saveRelatedPlayers,
   saveTopupCurrencies,
   saveTransactions,
   selectAuthCurrencies,
   selectAuthCurrencyOption,
   selectAuthCurrentOperator,
   selectAuthCurrenturrency,
   selectAuthOperator,
   selectAuthPlayerDetails,
   selectAuthTopupCurrencies,
   selectAuthUser,
} from 'redux/authSlice';
import { selectLoadingFinancialReport } from 'redux/loadingSlice';
import { getCrashConfig } from 'redux/slices/crashConfig';
import { selectBoClient } from 'redux/socketSlice';
import { store } from 'redux/store';
import {
   PageWithdetails3Toolbar,
   PageWithdetails3ToolbarWithFilter,
   PageWithdetails4Toolbar,
   PageWithdetails4ToolbarWithFilter,
   formatSmall,
   getDefaultEndDate,
   getDefaultStartDate,
} from 'services/globalFunctions';
import { hasDetailsPermission } from 'services/permissionHandler';
import createTheme from 'theme';
import { PlayerDetailsTabs } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { THEMES } from '../../constants';
import DashboardLayout from '../../layouts/Dashboard';
import Documents from './documents';

const Button = styled(MuiButton)(spacing);
const FormControlSpacing = styled(MuiFormControl)(spacing);
const FormControl = styled(FormControlSpacing)`
   min-width: 148px;
`;
const timedifference = new Date().getTimezoneOffset();

const filterInitialState = {
   playerId: '',
   betId: '',
   gameId: '',
   roundIndex: '',
   status: [] as string[],
   mode: 'all',
   cashOut: 'all',
   currencies: 'all',
   isTest: 'false',
   nickname: '',
   gameTitle: '',
   isFun: 'all',
};

const filterInitialStateDelete = {
   playerId: '',
   betId: '',
   gameId: '',
   roundIndex: '',
   status: [],
   mode: 'all',
   cashOut: 'all',
   currencies: 'all',
   isTest: 'all',
   nickname: '',
   gameTitle: '',
   isFun: 'all',
};

const filterInitialStateCashin = {
   playerId: '',
   status: 'all',
   nickname: '',
   cashierId: '',
};

const filterInitialStateDeleteCashin = {
   playerId: '',
   status: 'all',
   nickname: '',
   cashierId: '',
};
function PlayerDetails() {
   const router = useRouter();
   const theme = useTheme();
   const { id, opId: opIdQuery }: any = router.query;
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
   const operator = useSelector(selectAuthCurrentOperator) as Operator;
   const opIdFromOperator = useSelector(selectAuthOperator);
   const opId = opIdQuery ? opIdQuery : opIdFromOperator;
   const data = useSelector(selectAuthPlayerDetails) as Player;
   const [boxRefrech, setBoxRefrech] = React.useState(0);
   const [refresh, setRefresh] = React.useState(0);
   const [autoRefresh, setAutoRefresh] = React.useState(0);
   const currency: string = useSelector(selectAuthCurrenturrency) || '';
   const [currencyTop, setCurrencyTop] = React.useState('USDT');
   const [playerOpen, setPlayerOpen]: any = React.useState(data);
   const [nickname, setNickname] = React.useState(data?.nickname);
   const [note, setNote] = React.useState('');
   const [activeSubmit, setActiveSubmit] = React.useState(false);
   const currencyOption = useSelector(selectAuthCurrencyOption);
   const crashConfig = useSelector(getCrashConfig);
   const [ignore, setIgnore] = React.useState(false);
   const [jsonCollapse, setJsonCollapse] = React.useState(false);
   const [startDate, setStartDate]: any = React.useState(
      moment(getDefaultStartDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   );
   const [endDate, setEndDate]: any = React.useState(
      moment(getDefaultEndDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   );
   const [startDateUpdate, setStartDateUpdate]: any = React.useState(
      moment(getDefaultStartDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   );
   const [endDateUpdate, setEndDateUpdate]: any = React.useState(
      moment(getDefaultEndDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   );
   const boClient = useSelector(selectBoClient);
   const [maxWidth, setMaxWidth] =
      React.useState<DialogProps['maxWidth']>('sm');
   const [fullWidth, setFullWidth] = React.useState(true);
   const [openRemovePlayer, setOpenRemovePlayer] = React.useState(false);
   const [openForceCashOut, setOpenForceCashOut] = React.useState(false);
   const [currentPlayer, setCurrentPlayer] = React.useState({} as Player);
   const [openUpdateWallet, setOpenUpdateWallet] = React.useState(false);
   const [openAllocateWallet, setOpenAllocateWallet] = React.useState(false);
   const loadingFinancialReport = useSelector(selectLoadingFinancialReport);
   const user: User = useSelector(selectAuthUser);
   const format = data?.activeCurrency === 'IRT' ? '0,00' : '0,00.[00]';
   const activeBalance =
      (data &&
         data.wallet?.byCurrency &&
         data.activeCurrency &&
         data.wallet?.byCurrency[data.activeCurrency]?.balance) ||
      0;
   const balance = `${data?.activeCurrency} ${formatSmall(
      activeBalance,
      format
   )} ($${
      data && data.wallet?.inUSD?.balance
         ? formatSmall(data.wallet?.inUSD?.balance, '0,00.[00]')
         : 0
   })`;
   const topupCurrencies = useSelector(selectAuthTopupCurrencies);
   const [value, setValue]: any = React.useState('');
   const [excludePendingDeposit, setExcludePendingDeposit] =
      React.useState(true);
   const [canceled, setCanceled] = React.useState(false);
   const [openFilter, setOpenFilter] = React.useState(false);
   const [transitionFilter, setTransitionFilter]: any = React.useState();
   const [filters, setFilters] = React.useState(filterInitialState);
   const [filtersInput, setFiltersInput] = React.useState(filterInitialState);
   const [filtersCashin, setFiltersCashin] = React.useState(
      filterInitialStateCashin
   );
   const [filtersInputCashin, setFiltersInputCashin] = React.useState(
      filterInitialStateCashin
   );
   const [filterChips, setFilterChips] = React.useState<FilterChip[]>([]);
   const [filterChipsCashin, setFilterChipsCashin] = React.useState<
      FilterChip[]
   >([]);
   const currencies = useSelector(selectAuthCurrencies);
   const [rollbackIds, setRollbackIds] = React.useState([]);
   const [rollbackActiveIndex, setRollbackActive] = React.useState(0);
   const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });
   const [amountTopUp, setAmountTopUp] = React.useState(0);
   const [amountTopUpInput, setAmountTopUpInput] = React.useState(0) as any;
   const [openTopUpPlayer, setOpenTopUpPlayer] = React.useState(false);

   useGetPlayerQuery({
      playerId: id,
      opId: opId,
      key: refresh,
   });

   const handleChangeTabs = (event: React.SyntheticEvent, newValue: string) => {
      event.preventDefault();
      setValue(newValue);
      setNote(data?.note || '');
   };

   const { mutate: mutateRollBack } = useRollBackMutation({
      onSuccess: (data) => {
         if (rollbackActiveIndex === rollbackIds.length - 1) {
            setRefresh(refresh + 1);
            toast.success(`You rolledback the bets successfully`, {
               position: toast.POSITION.TOP_CENTER,
            });
         }
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateStats } = useUpdatePlayerStatsMutation({
      onSuccess: () => {
         toast.success('You update player stats successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
         setBoxRefrech(boxRefrech + 1);
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateNote } = useSeNotePlayerMutation({
      onSuccess: () => {
         toast.success('You set the player note successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
         setBoxRefrech(boxRefrech + 1);
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateNickname } = useSetNicknamePlayerMutation({
      onSuccess: () => {
         toast.success('You set the player nickname successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateAllocateWallet } = useAllocateWalletPlayerMutation({
      onSuccess: () => {
         setBoxRefrech(boxRefrech + 1);
         setOpenAllocateWallet(false);
         toast.success('Wallet allocated successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
      },
      onError: (error) => {
         setOpenAllocateWallet(false);
      },
   });

   const { mutate: mutateRemovePlayer } = useRemovePlayerMutation({
      onSuccess: () => {
         setBoxRefrech(boxRefrech + 1);
         setOpenRemovePlayer(false);
         toast.success('Player deleted successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateUpdateWallet } = useUpdateWalletPlayerMutation({
      onSuccess: () => {
         setBoxRefrech(boxRefrech + 1);
         setOpenUpdateWallet(false);
         toast.success('Wallet updated successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateTopUp } = useIsTopUpPlayerMutation({
      onSuccess: () => {
         toast.success('You topped up player successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
         handleCloseTopUpPlayer();
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateIsTest } = useIsTestPlayerMutation({
      onSuccess: (data) => {
         setBoxRefrech(boxRefrech + 1);
         toast.success('Player test status updated successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
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
            } the chat successfully`
         );
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateBlocked } = useIsBlockedPlayerMutation({
      onSuccess: () => {
         setBoxRefrech(boxRefrech + 1);
         toast.success('Player blocked status updated successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
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

   const handlelogDate = async (
      startDate: Date,
      endDate: Date,
      update: Boolean,
      firstLaunch: Boolean
   ) => {
      setStartDateUpdate(moment(startDate).utc());
      setEndDateUpdate(moment(endDate).utc());
      if (update) {
         setStartDate(
            moment(startDate).utc().unix() * 1000 +
               crashConfig.timezoneOffset * 60 * 1000 -
               timedifference * 60 * 1000
         );
         setEndDate(
            moment(endDate).utc().unix() * 1000 +
               crashConfig.timezoneOffset * 60 * 1000 -
               timedifference * 60 * 1000
         );
      }
   };

   const handleSearchClick = () => {
      setStartDate(
         moment(startDateUpdate).utc().unix() * 1000 +
            crashConfig.timezoneOffset * 60 * 1000 -
            timedifference * 60 * 1000
      );
      setEndDate(
         moment(endDateUpdate).utc().unix() * 1000 +
            crashConfig.timezoneOffset * 60 * 1000 -
            timedifference * 60 * 1000
      );
      setAutoRefresh(autoRefresh + 1);
   };

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

   const handleSetPlayerIsTest = React.useCallback(
      (dto: SetPlayerIsTestDto) => {
         mutateIsTest({ dto });
      },
      [mutateIsTest]
   );

   const openTopUpPlayerHandle = (player: Player) => {
      setAmountTopUp(0);
      setAmountTopUpInput(0);
      setOpenTopUpPlayer(true);
   };

   const handleCloseTopUpPlayer = () => {
      setOpenTopUpPlayer(false);
   };

   const topUpPlayerSubmit = React.useCallback(
      (dto: TopupDto) => {
         handleCloseTopUpPlayer();
         mutateTopUp({ dto });
      },
      [mutateTopUp]
   );

   const topUpPlayerHandle = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setActiveSubmit(true);
      const post: TopupDto = {
         opId: data.opId,
         playerId: data.playerId,
         amount: amountTopUp,
         currency: currencyTop,
      };
      topUpPlayerSubmit(post);
   };

   const handleOpenRemovePlayer = () => {
      setOpenRemovePlayer(true);
   };

   const handleOpenUpdateWallet = () => {
      setOpenUpdateWallet(true);
   };

   const handleOpenAllocateWallet = () => {
      setOpenAllocateWallet(true);
   };

   const handleRemovePlayer = React.useCallback(
      (dto: DeletePlayerDto) => {
         mutateRemovePlayer({ dto });
      },
      [mutateRemovePlayer]
   );

   const handleUpdateWallet = React.useCallback(
      (dto: UpdateWalletDto) => {
         mutateUpdateWallet({ dto });
      },
      [mutateUpdateWallet]
   );

   const handleAllocateWallet = React.useCallback(
      (dto: UpdateWalletDto) => {
         mutateAllocateWallet({ dto });
      },
      [mutateAllocateWallet]
   );

   const handleCloseRemovePlayer = () => {
      setOpenRemovePlayer(false);
   };

   const handleCloseUpdateWallet = () => {
      setOpenUpdateWallet(false);
   };

   const handleCloseAllocateWallet = () => {
      setOpenAllocateWallet(false);
   };

   const handleTabValue = () => {
      let valueTab = '';
      switch (true) {
         case data?.integrationType === IntegrationType.ALIEN_STANDALONE &&
            hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GET_PLAYER_REQ):
            valueTab = PlayerDetailsTabs.DETAILS;
            break;
         case hasDetailsPermission(UserPermissionEvent.BACKOFFICE_BET_LIST_REQ):
            valueTab = PlayerDetailsTabs.BETS;
            break;
         case [
            IntegrationType.ALIEN_STANDALONE,
            IntegrationType.PG_WALLET_TRANSFER,
            IntegrationType.ALIEN_WALLET_TRANSFER,
         ].includes(data?.integrationType as IntegrationType) &&
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_TRANSACTION_LIST_REQ
            ):
            valueTab = PlayerDetailsTabs.TRANSACTIONS;
            break;
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_FINANCIAL_REPORT_REQ
         ):
            valueTab = PlayerDetailsTabs.REPORT;
            break;
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_PLAYER_ACTIVITY_LIST_REQ
         ):
            valueTab = PlayerDetailsTabs.ACTIVITIES;
            break;
         case data?.integrationType === IntegrationType.ALIEN_STANDALONE &&
            hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GET_PLAYER_REQ):
            valueTab = PlayerDetailsTabs.DOCUMENTS;
            break;
         case data?.integrationType === IntegrationType.ALIEN_STANDALONE &&
            hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GET_PLAYER_REQ):
            valueTab = PlayerDetailsTabs.PROFIT;
            break;
         case data?.integrationType === IntegrationType.ALIEN_STANDALONE &&
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GET_RELATED_PLAYERS_REQ
            ):
            valueTab = PlayerDetailsTabs.RELATED_ACCOUNTS;
            break;
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_PLAYER_REQ
         ):
            valueTab = PlayerDetailsTabs.NOTE;
            break;
         case checkActionPermission():
            valueTab = PlayerDetailsTabs.ACTIONS;
            break;
         default:
            break;
      }
      return valueTab;
   };

   const nicknamePlayerSubmit = React.useCallback(
      (dto: SetPlayerNicknameDto) => {
         setActiveSubmit(!activeSubmit);
         mutateNickname({ dto });
      },
      [mutateNickname, activeSubmit]
   );

   const nicknamePlayerHandle = () => {
      const post: SetPlayerNicknameDto = {
         opId,
         playerId: playerOpen.playerId,
         nickname: nickname || '',
      };
      nicknamePlayerSubmit(post);
   };

   const notePlayerSubmit = React.useCallback(
      (dto: SetPlayerNoteDto) => {
         mutateNote({ dto });
      },
      [mutateNote]
   );

   const notePlayerHandle = (player: Player) => {
      const post: SetPlayerNoteDto = {
         opId,
         playerId: player.playerId,
         note: note,
      };
      notePlayerSubmit(post);
   };

   const handleChangeExcludePendingDeposit = () => {
      setExcludePendingDeposit(!excludePendingDeposit);
   };

   const updateStatsSubmit = React.useCallback(
      (dto: UpdatePlayerStatsDto) => {
         mutateStats({ dto });
      },
      [mutateStats]
   );

   const handleForceCashOut = React.useCallback(
      (dto: ForceCashOutDto) => {
         mutateForceCashOut({ dto });
      },
      [mutateForceCashOut]
   );

   const checkActionPermission = () => {
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SET_PLAYER_NICKNAME_REQ
         ) ||
         hasDetailsPermission(UserPermissionEvent.BACKOFFICE_TOPUP_REQ) ||
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_UPDATE_WALLET_REQ
         ) ||
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_ALLOCATE_WALLET_ADDRESS_REQ
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
         hasDetailsPermission(UserPermissionEvent.BACKOFFICE_DELETE_PLAYER_REQ)
      ) {
         return true;
      } else {
         return false;
      }
   };

   const handleChangeCanceled = () => {
      setCanceled(!canceled);
   };

   const handleClickOpenFilter = () => {
      setTransitionFilter(TransitionSlide);
      setOpenFilter(true);
   };

   const handleCloseFilter = () => {
      setOpenFilter(false);
   };

   const handleSearchFilter = () => {
      setFilters(filtersInput);
      setFiltersCashin(filtersInputCashin);
      handleCloseFilter();
   };

   const moreFiltersBtn = () => {
      return (
         <MoreFiltersButton
            open={openFilter}
            onClick={handleClickOpenFilter}
            TransitionComponent={transitionFilter}
            onClose={handleCloseFilter}
            onSearch={handleSearchFilter}
         >
            {value === PlayerDetailsTabs.BETS && (
               <>
                  <TextField
                     label="Bet ID"
                     type="search"
                     value={filtersInput.betId}
                     fullWidth
                     onChange={(e) => {
                        setFiltersInput((prev) => ({
                           ...prev,
                           betId: e.target.value,
                        }));
                     }}
                     autoComplete="off"
                  />

                  <TextField
                     label="Nickname"
                     type="search"
                     value={filtersInput.nickname}
                     fullWidth
                     onChange={(e) => {
                        setFiltersInput((prev) => ({
                           ...prev,
                           nickname: e.target.value,
                        }));
                     }}
                     autoComplete="off"
                  />

                  <TextField
                     label="Game ID"
                     type="search"
                     value={filtersInput.gameId}
                     fullWidth
                     onChange={(e) => {
                        setFiltersInput((prev) => ({
                           ...prev,
                           gameId: e.target.value,
                        }));
                     }}
                     autoComplete="off"
                  />
                  <TextField
                     label="Game Title"
                     type="search"
                     value={filtersInput.gameTitle}
                     fullWidth
                     onChange={(e) => {
                        setFiltersInput((prev) => ({
                           ...prev,
                           gameTitle: e.target.value,
                        }));
                     }}
                     autoComplete="off"
                  />
                  <FormControl
                     sx={{
                        width: '100%',
                     }}
                  >
                     <Autocomplete
                        id={`currency`}
                        options={currencies ? ['all', ...currencies] : ['all']}
                        sx={{
                           width: '100%',
                           mb: 0,
                           '.MuiAutocomplete-input': {
                              textTransform: 'capitalize',
                              cursor: 'pointer',
                           },
                        }}
                        value={filtersInput.currencies}
                        onChange={(e, selectedCurrency) => {
                           setFiltersInput((prev) => ({
                              ...prev,
                              currencies: selectedCurrency || '',
                           }));
                        }}
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              variant="outlined"
                              name={`currency`}
                              label={'Currencies'}
                              fullWidth
                              InputProps={{
                                 ...params.InputProps,
                                 endAdornment: (
                                    <FontAwesomeIcon
                                       icon={faAngleDown as IconProp}
                                       className="selectIcon"
                                       size="sm"
                                    />
                                 ),
                              }}
                           />
                        )}
                     />
                  </FormControl>

                  <FormControl fullWidth>
                     <InputLabel id="demo-simple-select-disabled-label">
                        Bet Status
                     </InputLabel>
                     <Select
                        IconComponent={() => (
                           <FontAwesomeIcon
                              icon={faAngleDown as IconProp}
                              className="selectIcon"
                              size="sm"
                           />
                        )}
                        labelId="demo-simple-select-label"
                        label="Bet Status "
                        id="demo-simple-select"
                        sx={{
                           width: '100%',
                           '.MuiPaper-root': {
                              background: 'red !important',
                           },
                           '.MuiButtonBase-root': {
                              background: 'transparent',
                              padding: 0,
                           },
                        }}
                        multiple
                        value={filtersInput.status}
                        onChange={(e) => {
                           const selectedValues = Array.isArray(e.target.value)
                              ? e.target.value
                              : [e.target.value];
                           setFiltersInput((prev) => ({
                              ...prev,
                              status: selectedValues, // Always set it as an array
                           }));
                        }}
                        renderValue={(selected) => (
                           <div>
                              {selected.map((item) => (
                                 <Chip
                                    key={item}
                                    label={item}
                                    style={{ marginRight: 2 }}
                                    sx={{
                                       height: '17px',
                                       marginTop: '7px',
                                    }}
                                 />
                              ))}
                           </div>
                        )}
                        endAdornment={
                           filtersInput.status?.length > 0 && (
                              <InputAdornment
                                 position="end"
                                 sx={{
                                    marginRight: 2,
                                 }}
                              >
                                 <IconButton
                                    onClick={() =>
                                       setFiltersInput((prev) => ({
                                          ...prev,
                                          status: [], // Always set it as an array
                                       }))
                                    }
                                    size="small"
                                 >
                                    <Clear />
                                 </IconButton>
                              </InputAdornment>
                           )
                        }
                     >
                        {statusData.map((item, index: number) => {
                           return (
                              <MenuItem
                                 key={`status${index}`}
                                 value={item.value}
                              >
                                 <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={2}
                                    textTransform="capitalize"
                                 >
                                    <FontAwesomeIcon
                                       icon={
                                          item.value === BetStatus.OPEN
                                             ? (faCircleOutline as IconProp)
                                             : (faCircle as IconProp)
                                       }
                                       fixedWidth
                                       color={item.color}
                                    />
                                    {item.label}
                                 </Stack>
                              </MenuItem>
                           );
                        })}
                     </Select>
                  </FormControl>
                  <FormControl
                     sx={{
                        width: '100%',
                     }}
                  >
                     <InputLabel id="demo-simple-select-disabled-label">
                        Test Status
                     </InputLabel>
                     <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Test Status "
                        fullWidth
                        value={filtersInput.isTest}
                        name="isTest"
                        onChange={(e) => {
                           setFiltersInput((prev) => ({
                              ...prev,
                              isTest: e.target.value,
                           }));
                        }}
                        IconComponent={() => (
                           <FontAwesomeIcon
                              icon={faAngleDown as IconProp}
                              className="selectIcon"
                              size="sm"
                           />
                        )}
                     >
                        <MenuItem value={'all'}>
                           <Stack
                              direction="row"
                              alignItems="center"
                              gap={2}
                              textTransform="capitalize"
                           >
                              All Status
                           </Stack>
                        </MenuItem>
                        <MenuItem value={'true'}>
                           <Stack
                              direction="row"
                              alignItems="center"
                              gap={2}
                              textTransform="capitalize"
                           >
                              Test
                           </Stack>
                        </MenuItem>
                        <MenuItem value={'false'}>
                           <Stack
                              direction="row"
                              alignItems="center"
                              gap={2}
                              textTransform="capitalize"
                           >
                              Real
                           </Stack>
                        </MenuItem>
                     </Select>
                  </FormControl>
                  <FormControl
                     sx={{
                        width: '100%',
                     }}
                  >
                     <InputLabel id="demo-simple-select-disabled-label">
                        Fun status
                     </InputLabel>
                     <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Fun Status "
                        sx={{
                           width: '100%',
                        }}
                        value={filtersInput.isFun}
                        name="isFun"
                        onChange={(e) => {
                           setFiltersInput((prev) => ({
                              ...prev,
                              isFun: e.target.value,
                           }));
                        }}
                        IconComponent={() => (
                           <FontAwesomeIcon
                              icon={faAngleDown as IconProp}
                              className="selectIcon"
                              size="sm"
                           />
                        )}
                     >
                        <MenuItem value={'all'}>
                           <Stack
                              direction="row"
                              alignItems="center"
                              gap={2}
                              textTransform="capitalize"
                           >
                              All Status
                           </Stack>
                        </MenuItem>
                        <MenuItem value={'true'}>
                           <Stack
                              direction="row"
                              alignItems="center"
                              gap={2}
                              textTransform="capitalize"
                           >
                              Fun
                           </Stack>
                        </MenuItem>
                        <MenuItem value={'false'}>
                           <Stack
                              direction="row"
                              alignItems="center"
                              gap={2}
                              textTransform="capitalize"
                           >
                              Real
                           </Stack>
                        </MenuItem>
                     </Select>
                  </FormControl>
               </>
            )}
            {value === PlayerDetailsTabs.CASHIN_CASHOUT && (
               <>
                  <TextField
                     label="Cashier ID"
                     type="search"
                     value={filtersInputCashin.cashierId}
                     fullWidth
                     onChange={(e) => {
                        setFiltersInputCashin((prev) => ({
                           ...prev,
                           cashierId: e.target.value,
                        }));
                     }}
                     autoComplete="off"
                  />
                  <TextField
                     label="Player ID"
                     type="search"
                     value={filtersInputCashin.playerId}
                     fullWidth
                     onChange={(e) => {
                        setFiltersInputCashin((prev) => ({
                           ...prev,
                           playerId: e.target.value,
                        }));
                     }}
                     autoComplete="off"
                  />
                  <TextField
                     label="Nickname"
                     type="search"
                     value={filtersInputCashin.nickname}
                     fullWidth
                     onChange={(e) => {
                        setFiltersInputCashin((prev) => ({
                           ...prev,
                           nickname: e.target.value,
                        }));
                     }}
                     autoComplete="off"
                  />

                  <FormControl fullWidth>
                     <InputLabel id="demo-simple-select-disabled-label">
                        Status
                     </InputLabel>
                     <Select
                        IconComponent={() => (
                           <FontAwesomeIcon
                              icon={faAngleDown as IconProp}
                              className="selectIcon"
                              size="sm"
                           />
                        )}
                        labelId="demo-simple-select-label"
                        label="Bet Status "
                        id="demo-simple-select"
                        sx={{
                           width: '100%',
                           '.MuiPaper-root': {
                              background: 'red !important',
                           },
                           '.MuiButtonBase-root': {
                              background: 'transparent',
                              padding: 0,
                           },
                        }}
                        value={filtersInputCashin.status}
                        onChange={(e) => {
                           const selectedValues = e.target.value;
                           setFiltersInputCashin((prev) => ({
                              ...prev,
                              status: selectedValues, // Always set it as an array
                           }));
                        }}
                        endAdornment={
                           filtersInputCashin.status?.length > 0 && (
                              <InputAdornment
                                 position="end"
                                 sx={{
                                    marginRight: 2,
                                 }}
                              >
                                 <IconButton
                                    onClick={() =>
                                       setFiltersInputCashin((prev) => ({
                                          ...prev,
                                          status: '', // Always set it as an array
                                       }))
                                    }
                                    size="small"
                                 >
                                    <Clear />
                                 </IconButton>
                              </InputAdornment>
                           )
                        }
                     >
                        <MenuItem value={'all'}>
                           <Stack
                              direction="row"
                              alignItems="center"
                              gap={2}
                              textTransform="capitalize"
                           >
                              All Status
                           </Stack>
                        </MenuItem>
                        {['open', 'close'].map((item, index: number) => {
                           return (
                              <MenuItem key={`status${index}`} value={item}>
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
               </>
            )}
         </MoreFiltersButton>
      );
   };

   const handleDeleteChip = (chipToDelete: FilterChip) => () => {
      setFilterChips((chips) =>
         chips.filter((chip) => chip.key !== chipToDelete.key)
      );

      const getObjectKey = (obj: any, value: string, keyData: number) => {
         return Object.keys(obj).find(
            (key, index) =>
               (Array.isArray(obj[key])
                  ? obj[key].join('\n') === value
                  : obj[key] === value) && index === keyData
         );
      };

      const objKey = getObjectKey(
         filters,
         chipToDelete.value,
         chipToDelete.key
      );
      objKey &&
         setFilters((prev) => ({
            ...prev,
            [objKey]:
               filterInitialStateDelete[
                  objKey as keyof typeof filterInitialStateDelete
               ],
         }));
   };

   const handleDeleteChipCashin = (chipToDelete: FilterChip) => () => {
      setFilterChipsCashin((chips) =>
         chips.filter((chip) => chip.key !== chipToDelete.key)
      );

      const getObjectKey = (obj: any, value: string, keyData: number) => {
         return Object.keys(obj).find(
            (key, index) =>
               (Array.isArray(obj[key])
                  ? obj[key].join('\n') === value
                  : obj[key] === value) && index === keyData
         );
      };

      const objKey = getObjectKey(
         filtersCashin,
         chipToDelete.value,
         chipToDelete.key
      );
      objKey &&
         setFiltersCashin((prev) => ({
            ...prev,
            [objKey]:
               filterInitialStateDeleteCashin[
                  objKey as keyof typeof filterInitialStateDeleteCashin
               ],
         }));
   };

   const updateRollbackList = (data: []) => {
      setRollbackIds(data);
   };

   const handleSetRollBackOpenBet = React.useCallback(
      (dto: RollbackOpenBetDto) => {
         mutateRollBack({ dto });
      },
      [mutateRollBack]
   );

   const handleOpenForceCashOut = () => {
      setCurrentPlayer(data);
      setOpenForceCashOut(true);
   };

   const handleCloseForceCashOut = () => {
      setOpenForceCashOut(false);
   };

   useEffect(() => {
      if (!activeSubmit) {
         setValue(handleTabValue());
      } else {
         setActiveSubmit(false);
      }
      setNote(data?.note || '');
      setPlayerOpen(data);
      setNickname(data?.nickname || '');
   }, [data]);

   useEffect(() => {
      setFilterChips([
         { key: 0, label: 'Player ID', value: filters.playerId },
         { key: 1, label: 'Bet ID', value: filters.betId },
         { key: 2, label: 'Game ID', value: filters.gameId },
         { key: 3, label: 'Round Index', value: filters.roundIndex },
         { key: 4, label: 'Bet Status', value: filters.status.join('\n') },
         { key: 5, label: 'Mode', value: filters.mode },
         { key: 6, label: 'CashOut', value: filters.cashOut },
         { key: 7, label: 'Currencies', value: filters.currencies },
         { key: 8, label: 'Is Test', value: filters.isTest },
         { key: 9, label: 'Nickname', value: filters.nickname },
         { key: 10, label: 'Game Title', value: filters.gameTitle },
         { key: 11, label: 'Is Fun', value: filters.isFun },
      ]);
      setFiltersInput(filters);
   }, [filters]);

   useEffect(() => {
      setFilterChipsCashin([
         { key: 0, label: 'Player ID', value: filtersCashin.playerId },
         { key: 1, label: 'Status', value: filtersCashin.status },
         { key: 2, label: 'Nickname', value: filtersCashin.nickname },
         { key: 3, label: 'Cashier ID', value: filtersCashin.cashierId },
      ]);
      setFiltersInputCashin(filtersCashin);
   }, [filtersCashin]);
   useEffect(() => {
      store.dispatch(saveTopupCurrencies([]));
      setStartDate(
         moment(
            data &&
               operator?.integrationType === IntegrationType.ALIEN_STANDALONE
               ? data.createdAt
               : getDefaultStartDate()
         )
            .utc()
            .unix() *
            1000 -
            crashConfig.timezoneOffset * 60 * 1000 +
            timedifference * 60 * 1000
      );
      setStartDateUpdate(
         moment(
            data &&
               operator?.integrationType === IntegrationType.ALIEN_STANDALONE
               ? data.createdAt
               : getDefaultStartDate()
         )
            .utc()
            .unix() *
            1000 -
            crashConfig.timezoneOffset * 60 * 1000 +
            timedifference * 60 * 1000
      );
      setBoxRefrech(boxRefrech + 1);
      if (data && data.opId) {
         const dto: GetTopupCurrenciesDto = {
            opId: data.opId,
         };
         if (data?.brand?.brandId) {
            dto.brandId = data?.brand?.brandId;
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
   }, [data]);

   useEffect(() => {
      if (!ignore) {
         store.dispatch(saveBetsList([]));
         store.dispatch(saveTransactions([]));
         store.dispatch(saveFinancialReportsGraph([]));
         store.dispatch(savePlayerActivitiesList([]));
         store.dispatch(saveRelatedPlayers([]));
         setTimeout(() => {
            setIgnore(true);
         }, 1000);
      }
   }, [ignore]);

   return (
      <React.Fragment>
         <Helmet title="Player Details" />
         <CustomOperatorsBrandsToolbar
            title={'Player Details'}
            filter={
               [
                  PlayerDetailsTabs.BETS,
                  PlayerDetailsTabs.CASHIN_CASHOUT,
               ].includes(value)
                  ? true
                  : false
            }
            handleFilter={moreFiltersBtn}
            background={
               isDesktop
                  ? theme.palette.secondary.dark
                  : theme.palette.primary.main
            }
            actions={
               <>
                  {value === PlayerDetailsTabs.BETS && (
                     <>
                        <Grid item mt={0}>
                           <FormControlLabel
                              sx={{
                                 '.MuiTypography-root': {
                                    color: theme.palette.primary.contrastText,
                                 },
                              }}
                              control={
                                 <Checkbox
                                    value="canceled"
                                    color="primary"
                                    onChange={handleChangeCanceled}
                                 />
                              }
                              label="Canceled"
                           />
                        </Grid>
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_ROLLBACK_OPEN_BET_REQ
                        ) && rollbackIds.length > 0 ? (
                           <Grid item>
                              <Button
                                 variant="outlined"
                                 sx={{
                                    color: theme.palette.primary.contrastText,
                                    borderColor: `${darkPurple[12]} !important`,
                                    lineHeight: '10.6px',
                                 }}
                                 onClick={() =>
                                    rollbackIds.map((item, index) => {
                                       setTimeout(() => {
                                          setRollbackActive(index);
                                          const post: RollbackOpenBetDto = {
                                             betId: item,
                                             opId: opId,
                                          };
                                          handleSetRollBackOpenBet(post);
                                       }, 500);
                                    })
                                 }
                              >
                                 Rollback
                              </Button>
                           </Grid>
                        ) : (
                           <></>
                        )}
                     </>
                  )}

                  {value === PlayerDetailsTabs.TRANSACTIONS && (
                     <Grid item>
                        <FormControlLabel
                           sx={{
                              '.MuiTypography-root': {
                                 color: theme.palette.primary.contrastText,
                              },
                           }}
                           control={
                              <Checkbox
                                 value="excludePendingDeposit"
                                 onChange={handleChangeExcludePendingDeposit}
                              />
                           }
                           label=" Exclude pending deposits"
                        />
                     </Grid>
                  )}

                  {hasDetailsPermission(
                     UserPermissionEvent.BACKOFFICE_UPDATE_PLAYER_STATS_REQ
                  ) &&
                     value === PlayerDetailsTabs.PROFIT && (
                        <Grid item>
                           <Button
                              onClick={() =>
                                 updateStatsSubmit({
                                    opId: opId,
                                    playerId: data.playerId,
                                 })
                              }
                              color="info"
                              variant="contained"
                              sx={{
                                 borderRadius: '8px',
                                 '&:hover': {
                                    background: '#8098F9',
                                 },
                                 padding: '4px 8px',
                                 letterSpacing: '0.48px',
                                 gap: '2px',
                                 height: '28px',
                              }}
                           >
                              Update stats
                           </Button>
                        </Grid>
                     )}
               </>
            }
         />

         {!isDesktop &&
            [
               PlayerDetailsTabs.BETS,
               PlayerDetailsTabs.TRANSACTIONS,
               PlayerDetailsTabs.REPORT,
               PlayerDetailsTabs.ACTIVITIES,
            ].includes(value) && (
               <>
                  <DateToolbar
                     background={ImoonGray[5]}
                     // from={
                     //    operator?.integrationType ===
                     //    IntegrationType.ALIEN_STANDALONE
                     //       ? startDate / 1000
                     //       : 0
                     // }
                     // to={
                     //    operator?.integrationType ===
                     //    IntegrationType.ALIEN_STANDALONE
                     //       ? endDate / 1000
                     //       : 0
                     // }
                     autoRefresh={false}
                     handleSearchClick={handleSearchClick}
                     handleLogDate={handlelogDate}
                  />
               </>
            )}
         {ignore && id && data ? (
            <>
               <Grid
                  container
                  alignItems="center"
                  p={2}
                  px={isDesktop ? '12px' : '4px'}
                  spacing={2}
                  sx={{
                     background: isDesktop ? 'initial' : darkPurple[4],
                  }}
               >
                  <Grid item>
                     {data && (
                        <Grid
                           container
                           alignItems="center"
                           p={2}
                           px={isLgUp ? '0' : '4px'}
                           spacing={0.5}
                        >
                           <Grid
                              item
                              textAlign={'center'}
                              p={1}
                              display={'flex'}
                              justifyContent={'center'}
                           >
                              <Stack
                                 width={'fit-content'}
                                 alignItems="center"
                                 direction="column"
                                 gap={2}
                                 position={'relative'}
                              >
                                 <Avatar
                                    sx={{
                                       width: [54],
                                       height: [54],
                                    }}
                                 />
                                 {data.isBlocked && (
                                    <Box
                                       sx={{
                                          position: 'absolute',
                                          left: -5,
                                          top: 0,
                                       }}
                                    >
                                       <FontAwesomeIcon
                                          icon={faBan as IconProp}
                                          color={
                                             createTheme(THEMES.DEFAULT).palette
                                                .error.main
                                          }
                                       />
                                    </Box>
                                 )}
                              </Stack>
                           </Grid>
                           <Grid
                              item
                              textAlign={'center'}
                              p={1}
                              justifyContent={'center'}
                              maxWidth={
                                 isLgUp
                                    ? '405px'
                                    : isDesktop
                                    ? '300px'
                                    : '405px'
                              }
                              width={
                                 isDesktop ? 'initial' : 'calc(100% - 60px)'
                              }
                           >
                              <Grid
                                 container
                                 alignItems="center"
                                 spacing={2}
                                 sx={{
                                    '.MuiGrid-root>.MuiBox-root': {
                                       position: 'relative',
                                       border: `1px solid ${ImoonGray[10]}`,
                                       height: '28px',
                                       p: '4px 6px',
                                       alignItems: 'center',
                                       display: 'grid',
                                       textAlign: 'center',
                                       borderRadius: '8px',
                                       pl: '20px',
                                    },
                                    // '.MuiBox-root .MuiStack-root svg': {
                                    //    position: 'absolute',
                                    //    left: '4px',
                                    //    top: '6px',
                                    // },
                                 }}
                              >
                                 <Grid item lg={6} md={12} sm={6} xs={6} pt={0}>
                                    <Box
                                       mb={0}
                                       borderRadius={8}
                                       display={'inline-flex'}
                                       gap={2}
                                       pl={'5px !important'}
                                       width={'100%'}
                                       justifyContent={'center'}
                                    >
                                       {data.isTest && (
                                          <Box
                                             sx={{
                                                position: 'absolute',
                                                right: '2px',
                                             }}
                                          >
                                             <FontAwesomeIcon
                                                icon={faRobot as IconProp}
                                                color={'#8098F9'}
                                             />
                                          </Box>
                                       )}
                                       <PortalCopyValue
                                          title={'Player ID:'}
                                          value={data.playerId}
                                          sx={{
                                             maxWidth: '100%',
                                             overflow: 'hidden',
                                             textOverflow: 'ellipsis',
                                             cursor: 'default',
                                             whiteSpace: 'nowrap',
                                             color: (props) =>
                                                isDesktop
                                                   ? ImoonGray[1]
                                                   : props.palette.primary
                                                        .contrastText,
                                          }}
                                          isVisible={true}
                                       />
                                    </Box>
                                 </Grid>
                                 {data.nicknameIsSet && data?.nickname && (
                                    <Grid
                                       item
                                       lg={6}
                                       md={12}
                                       sm={6}
                                       xs={6}
                                       pt={0}
                                    >
                                       <Box
                                          mb={0}
                                          pl={'5px !important'}
                                          borderRadius={8}
                                          display={'inline-flex'}
                                          gap={2}
                                          width={'100%'}
                                          justifyContent={'center'}
                                       >
                                          <PortalCopyValue
                                             title={'Nickname :'}
                                             value={
                                                data.nicknameIsSet
                                                   ? data?.nickname
                                                   : 'NoName'
                                             }
                                             isVisible={true}
                                             sx={{
                                                whiteSpace: 'nowrap',
                                                maxWidth: '100%',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                cursor: 'default',
                                                color: (props) =>
                                                   isDesktop
                                                      ? ImoonGray[1]
                                                      : props.palette.primary
                                                           .contrastText,
                                             }}
                                          />
                                       </Box>
                                    </Grid>
                                 )}
                                 <Grid
                                    item
                                    lg={6}
                                    md={12}
                                    sm={6}
                                    xs={12}
                                    pt={0}
                                 >
                                    <Box
                                       mb={0}
                                       pl={'5px !important'}
                                       borderRadius={8}
                                       sx={{
                                          background: (props) =>
                                             isDesktop
                                                ? 'initial'
                                                : ImoonGray[5],
                                       }}
                                    >
                                       <Typography
                                          color={(props) =>
                                             isDesktop
                                                ? ImoonGray[1]
                                                : props.palette.primary
                                                     .contrastText
                                          }
                                          variant="bodySmallBold"
                                          whiteSpace={'nowrap'}
                                       >
                                          Last Activity :{' '}
                                          {moment(data?.updatedAt).fromNow()}
                                       </Typography>
                                    </Box>
                                 </Grid>
                                 <Grid
                                    item
                                    lg={6}
                                    md={12}
                                    sm={6}
                                    xs={12}
                                    pt={0}
                                 >
                                    <Box
                                       mb={0}
                                       pl={'5px !important'}
                                       borderRadius={8}
                                       sx={{
                                          background: (props) =>
                                             isDesktop
                                                ? 'initial'
                                                : ImoonGray[5],
                                       }}
                                    >
                                       <Typography
                                          color={(props) =>
                                             isDesktop
                                                ? ImoonGray[1]
                                                : props.palette.primary
                                                     .contrastText
                                          }
                                          variant="bodySmallBold"
                                          whiteSpace={'nowrap'}
                                       >
                                          Joined At :{' '}
                                          {moment(data?.createdAt).fromNow()}
                                       </Typography>
                                    </Box>
                                 </Grid>
                              </Grid>
                           </Grid>
                        </Grid>
                     )}
                  </Grid>

                  {isDesktop && (
                     <>
                        <Grid item xs></Grid>
                        <Grid item pl={'0 !important'}>
                           <HeaderToolbar
                              defaultDate={
                                 operator?.integrationType ===
                                 IntegrationType.ALIEN_STANDALONE
                                    ? true
                                    : false
                              }
                              from={
                                 operator?.integrationType ===
                                 IntegrationType.ALIEN_STANDALONE
                                    ? startDate
                                    : null
                              }
                              isVisibleDate={true}
                              sx={{
                                 px: '8px !important',
                                 opacity: [
                                    PlayerDetailsTabs.BETS,
                                    PlayerDetailsTabs.TRANSACTIONS,
                                    PlayerDetailsTabs.REPORT,
                                    PlayerDetailsTabs.ACTIVITIES,
                                 ].includes(value)
                                    ? 1
                                    : 0,
                              }}
                              handleSearchClick={handleSearchClick}
                              handleLogDate={handlelogDate}
                           />
                        </Grid>
                     </>
                  )}
               </Grid>
               <Grid item xs={12} px={isDesktop ? '12px' : '4px'}>
                  <TabContext value={value}>
                     <TabList
                        className="detail_tabs"
                        onChange={handleChangeTabs}
                        variant="scrollable"
                        sx={{
                           mb: '6px',
                           pt: isDesktop ? 0 : '6px',
                           justifyContent: isDesktop ? 'left' : 'center',
                        }}
                        scrollButtons={true}
                     >
                        {data?.integrationType ===
                           IntegrationType.ALIEN_STANDALONE &&
                           hasDetailsPermission(
                              UserPermissionEvent.BACKOFFICE_GET_PLAYER_REQ
                           ) && (
                              <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       Details
                                    </Typography>
                                 }
                                 value={PlayerDetailsTabs.DETAILS}
                              />
                           )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_BET_LIST_REQ
                        ) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Bets
                                 </Typography>
                              }
                              value={PlayerDetailsTabs.BETS}
                           />
                        )}
                        {data?.integrationType ===
                           IntegrationType.ALIEN_STANDALONE &&
                           hasDetailsPermission(
                              UserPermissionEvent.BACKOFFICE_TRANSACTION_LIST_REQ
                           ) && (
                              <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       Transactions
                                    </Typography>
                                 }
                                 value={PlayerDetailsTabs.TRANSACTIONS}
                              />
                           )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_FINANCIAL_REPORT_REQ
                        ) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Report
                                 </Typography>
                              }
                              value={PlayerDetailsTabs.REPORT}
                           />
                        )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_PLAYER_ACTIVITY_LIST_REQ
                        ) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Activities
                                 </Typography>
                              }
                              value={PlayerDetailsTabs.ACTIVITIES}
                           />
                        )}
                        {data?.integrationType ===
                           IntegrationType.ALIEN_STANDALONE &&
                           hasDetailsPermission(
                              UserPermissionEvent.BACKOFFICE_GET_PLAYER_REQ
                           ) &&
                           data.kyc?.verifications &&
                           data.kyc?.verifications.length > 0 && (
                              <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       Documents
                                    </Typography>
                                 }
                                 value={PlayerDetailsTabs.DOCUMENTS}
                              />
                           )}
                        {data?.integrationType ===
                           IntegrationType.ALIEN_STANDALONE &&
                           hasDetailsPermission(
                              UserPermissionEvent.BACKOFFICE_GET_PLAYER_REQ
                           ) && (
                              <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       Profit
                                    </Typography>
                                 }
                                 value={PlayerDetailsTabs.PROFIT}
                              />
                           )}
                        {data?.integrationType ===
                           IntegrationType.ALIEN_STANDALONE &&
                           hasDetailsPermission(
                              UserPermissionEvent.BACKOFFICE_GET_RELATED_PLAYERS_REQ
                           ) && (
                              <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       Related accounts{' '}
                                       {/* <BadgeRole label={'Coming Soon'} /> */}
                                    </Typography>
                                 }
                                 value={PlayerDetailsTabs.RELATED_ACCOUNTS}
                              />
                           )}
                        {data?.integrationType ===
                           IntegrationType.ALIEN_WALLET_TRANSFER &&
                           hasDetailsPermission(
                              UserPermissionEvent.BACKOFFICE_CASH_IN_CASH_OUT_LIST_REQ
                           ) && (
                              <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       Cashin & Cashout
                                    </Typography>
                                 }
                                 value={PlayerDetailsTabs.CASHIN_CASHOUT}
                              />
                           )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_PLAYER_REQ
                        ) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Note
                                 </Typography>
                              }
                              value={PlayerDetailsTabs.NOTE}
                           />
                        )}
                        {checkActionPermission() && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Actions
                                 </Typography>
                              }
                              value={PlayerDetailsTabs.ACTIONS}
                           />
                        )}
                     </TabList>
                     <TabPanel
                        value={PlayerDetailsTabs.DETAILS}
                        sx={{
                           padding: '8px 0px',
                           height: PageWithdetails3Toolbar,
                           overflow: 'auto',
                        }}
                     >
                        <Card
                           key={boxRefrech}
                           sx={{
                              width: isDesktop ? 'calc(100vw - 245px)' : '100%',
                              height: 'initial',
                              overflowY: 'auto',
                              mb: '8px',
                              '.box-texfield-style': {
                                 p: '16px',
                                 border: `1px solid ${darkPurple[11]}`,
                                 borderRadius: '8px',
                                 background: darkPurple[12],
                                 mb: '6px',
                              },
                           }}
                        >
                           <CardContent sx={{ pb: '6px !important' }}>
                              {data?.profile?.email && (
                                 <Box className="box-texfield-style">
                                    <Typography
                                       variant="bodySmallBold"
                                       component={'p'}
                                       letterSpacing={'0.36px'}
                                       lineHeight={'15.6px'}
                                       color={darkPurple[9]}
                                    >
                                       Email
                                    </Typography>
                                    <Typography
                                       variant="body2"
                                       component={'p'}
                                       letterSpacing={'0.24px'}
                                    >
                                       {data?.profile?.email.address}
                                    </Typography>
                                 </Box>
                              )}
                              {data?.profile?.phone && (
                                 <Box className="box-texfield-style">
                                    <Typography
                                       variant="bodySmallBold"
                                       component={'p'}
                                       letterSpacing={'0.36px'}
                                       lineHeight={'15.6px'}
                                       color={darkPurple[9]}
                                    >
                                       Phone Number
                                    </Typography>
                                    <Typography
                                       variant="body2"
                                       component={'p'}
                                       letterSpacing={'0.24px'}
                                    >
                                       {data?.profile?.phone.number}
                                    </Typography>
                                 </Box>
                              )}
                              {data?.profile?.telegram && (
                                 <Box className="box-texfield-style">
                                    <Typography
                                       variant="bodySmallBold"
                                       component={'p'}
                                       letterSpacing={'0.36px'}
                                       lineHeight={'15.6px'}
                                       color={darkPurple[9]}
                                    >
                                       Telegram Id
                                    </Typography>
                                    <Typography
                                       variant="body2"
                                       component={'p'}
                                       letterSpacing={'0.24px'}
                                    >
                                       {data.profile?.telegram.telegramId}
                                    </Typography>
                                 </Box>
                              )}
                              {data?.registrationUrl && (
                                 <Box className="box-texfield-style">
                                    <Typography
                                       variant="bodySmallBold"
                                       component={'p'}
                                       letterSpacing={'0.36px'}
                                       lineHeight={'15.6px'}
                                       color={darkPurple[9]}
                                    >
                                       Registration Url
                                    </Typography>
                                    <Typography
                                       variant="body2"
                                       component={'p'}
                                       letterSpacing={'0.24px'}
                                    >
                                       {data.registrationUrl}
                                    </Typography>
                                 </Box>
                              )}
                              {data.activeCurrency && (
                                 <Box className="box-texfield-style">
                                    <Typography
                                       variant="bodySmallBold"
                                       component={'p'}
                                       letterSpacing={'0.36px'}
                                       lineHeight={'15.6px'}
                                       color={darkPurple[9]}
                                    >
                                       Active Currency
                                    </Typography>
                                    <Typography
                                       variant="body2"
                                       component={'p'}
                                       letterSpacing={'0.24px'}
                                    >
                                       {data.activeCurrency}
                                    </Typography>
                                 </Box>
                              )}
                              {data.wallet?.inUSD && (
                                 <Box className="box-texfield-style">
                                    <Typography
                                       variant="bodySmallBold"
                                       component={'p'}
                                       letterSpacing={'0.36px'}
                                       lineHeight={'15.6px'}
                                       color={darkPurple[9]}
                                    >
                                       Balance
                                    </Typography>
                                    <Typography
                                       variant="body2"
                                       component={'p'}
                                       letterSpacing={'0.24px'}
                                       color={
                                          data.wallet?.inUSD.balance > 0
                                             ? theme.palette.success.main
                                             : data.wallet?.inUSD.balance === 0
                                             ? theme.palette.grey[500]
                                             : theme.palette.error.main
                                       }
                                    >
                                       {balance}
                                    </Typography>
                                 </Box>
                              )}
                           </CardContent>
                        </Card>
                        {[UserScope.SUPERADMIN].includes(user?.scope) &&
                           data.playerId && (
                              <Box
                                 borderRadius={'8px'}
                                 sx={{
                                    width: isDesktop
                                       ? 'calc(100vw - 245px)'
                                       : '100%',
                                    '.react-json-view': {
                                       maxHeight: 350,
                                       width: isDesktop
                                          ? 'calc(100vw - 245px)'
                                          : '100%',
                                       overflow: 'auto',
                                       borderBottomLeftRadius: '8px',
                                       borderBottomRightRadius: '8px',
                                    },
                                 }}
                              >
                                 <Box
                                    sx={{
                                       background: ImoonGray[4],
                                       p: '12px',
                                       borderTopLeftRadius: '8px',
                                       borderTopRightRadius: '8px',
                                       textAlign: 'right',
                                       cursor: 'pointer',
                                    }}
                                    onClick={() =>
                                       setJsonCollapse(!jsonCollapse)
                                    }
                                 >
                                    <FontAwesomeIcon
                                       icon={faAngleDown as IconProp}
                                       color={
                                          theme.palette.primary.contrastText
                                       }
                                       size="lg"
                                    />
                                 </Box>
                                 <DynamicReactJson
                                    key={`json`}
                                    src={data}
                                    theme="tomorrow"
                                    collapsed={jsonCollapse}
                                 />
                              </Box>
                           )}
                     </TabPanel>
                     <TabPanel
                        value={PlayerDetailsTabs.RELATED_ACCOUNTS}
                        sx={{
                           padding: '8px 0px',
                           '.dataGridWrapper': {
                              marginLeft: isDesktop ? '-12px' : 0,
                              height: PageWithdetails4Toolbar,
                           },
                           width: isDesktop ? 'calc(100vw - 245px)' : '100%',
                        }}
                     >
                        {data && <RelatedAccounts data={data} />}
                     </TabPanel>
                     <TabPanel
                        value={PlayerDetailsTabs.CASHIN_CASHOUT}
                        sx={{
                           padding: '8px 0px',
                           '.dataGridWrapper': {
                              marginLeft: isDesktop ? '-12px' : 0,
                              height: PageWithdetails4Toolbar,
                           },
                           width: isDesktop ? 'calc(100vw - 245px)' : '100%',
                        }}
                     >
                        {data &&
                           data?.integrationType ===
                              IntegrationType.ALIEN_WALLET_TRANSFER &&
                           hasDetailsPermission(
                              UserPermissionEvent.BACKOFFICE_CASH_IN_CASH_OUT_LIST_REQ
                           ) && (
                              <>
                                 {filterChipsCashin.filter(
                                    (chip) => chip.value && chip.value !== 'all'
                                 ).length > 0 && (
                                    <HeaderTitleToolbar
                                       filterChips={filterChipsCashin}
                                       handleDeleteChip={handleDeleteChipCashin}
                                       sx={{
                                          '.MuiStack-root': {
                                             maxWidth: '100%',
                                          },
                                       }}
                                    />
                                 )}
                                 <CashinCashoutData
                                    placedAtFrom={startDate}
                                    playerId={id}
                                    placedAtTo={endDate}
                                    status={
                                       filtersCashin.status as 'open' | 'close'
                                    }
                                    selectedCurrency={currencyOption?.value}
                                    canceled={canceled}
                                    refresh={autoRefresh}
                                    nickname={filtersCashin.nickname}
                                    cashierId={filtersCashin.cashierId}
                                 />
                              </>
                           )}
                     </TabPanel>
                     <TabPanel
                        value={PlayerDetailsTabs.BETS}
                        sx={{
                           padding: '8px 0px',
                           '.dataGridWrapper': {
                              marginLeft: isDesktop ? '-12px' : 0,
                              height: isDesktop
                                 ? PageWithdetails4Toolbar
                                 : PageWithdetails4ToolbarWithFilter,
                           },
                           width: isDesktop ? 'calc(100vw - 245px)' : '100%',
                        }}
                     >
                        {data && (
                           <>
                              {filterChips.filter(
                                 (chip) => chip.value && chip.value !== 'all'
                              ).length > 0 && (
                                 <HeaderTitleToolbar
                                    filterChips={filterChips}
                                    handleDeleteChip={handleDeleteChip}
                                    sx={{
                                       '.MuiStack-root': {
                                          maxWidth: '100%',
                                       },
                                    }}
                                 />
                              )}
                              <AllBets
                                 playerId={id}
                                 selectedCurrency={currencyOption?.value}
                                 placedAtFrom={startDate}
                                 placedAtTo={endDate}
                                 betId={filters.betId}
                                 gameId={filters.gameId}
                                 gameTitle={filters.gameTitle}
                                 currencies={filters.currencies}
                                 status={filters.status}
                                 isFun={filters.isFun}
                                 nickname={filters.nickname}
                                 isTest={filters.isTest}
                                 canceled={canceled}
                                 rollbackData={updateRollbackList}
                                 refresh={autoRefresh}
                              />
                           </>
                        )}
                     </TabPanel>
                     <TabPanel
                        value={PlayerDetailsTabs.REPORT}
                        sx={{
                           padding: '8px 0px',
                           height: isDesktop
                              ? PageWithdetails3Toolbar
                              : PageWithdetails3ToolbarWithFilter,
                           overflow: 'hidden',
                           overflowY: 'auto',
                        }}
                     >
                        {data && (
                           <PortalBetsLineChart
                              startDate={startDate}
                              endDate={endDate}
                              isLoading={loadingFinancialReport}
                              usedCurrency={true}
                              playerId={id}
                              key={autoRefresh}
                           />
                        )}
                     </TabPanel>
                     <TabPanel
                        value={PlayerDetailsTabs.ACTIVITIES}
                        sx={{
                           padding: '8px 0px',
                           '.dataGridWrapper': {
                              marginLeft: isDesktop ? '-12px' : 0,
                              height: isDesktop
                                 ? PageWithdetails4Toolbar
                                 : PageWithdetails3ToolbarWithFilter,
                           },
                           width: isDesktop ? 'calc(100vw - 245px)' : '100%',
                        }}
                     >
                        {data && (
                           <>
                              <PlayerActivities
                                 key={boxRefrech}
                                 from={startDate}
                                 to={endDate}
                                 playerId={id}
                                 autoRefresh={autoRefresh}
                              />
                           </>
                        )}
                     </TabPanel>
                     <TabPanel
                        value={PlayerDetailsTabs.TRANSACTIONS}
                        sx={{
                           padding: '8px 0px',
                           '.dataGridWrapper': {
                              marginLeft: isDesktop ? '-12px' : 0,
                              height: isDesktop
                                 ? PageWithdetails4Toolbar
                                 : PageWithdetails3ToolbarWithFilter,
                           },
                           width: isDesktop ? 'calc(100vw - 245px)' : '100%',
                        }}
                     >
                        {data && (
                           <Transactions
                              opId={data.opId}
                              playerId={id}
                              from={startDate}
                              to={endDate}
                              excludePendingDeposit={excludePendingDeposit}
                              autoRefresh={autoRefresh}
                           />
                        )}
                     </TabPanel>
                     <TabPanel
                        value={PlayerDetailsTabs.DOCUMENTS}
                        sx={{
                           padding: '8px 0px',
                           height: PageWithdetails3Toolbar,
                           overflow: 'hidden',
                           overflowY: 'auto',
                        }}
                     >
                        {data &&
                           data.kyc?.verifications &&
                           data.kyc?.verifications.length > 0 && (
                              <Card
                                 key={boxRefrech}
                                 sx={{
                                    width: isDesktop
                                       ? 'calc(100vw - 245px)'
                                       : '100%',
                                    height: 'initial',
                                    overflowY: 'auto',
                                    mb: '8px',
                                    '.box-texfield-style': {
                                       p: '16px',
                                       border: `1px solid ${darkPurple[11]}`,
                                       borderRadius: '8px',
                                       background: darkPurple[12],
                                       mb: '6px',
                                    },
                                 }}
                              >
                                 <CardContent sx={{ pb: '6px !important' }}>
                                    <Documents
                                       key={boxRefrech}
                                       data={data}
                                       updateDocument={() => {
                                          setRefresh(refresh + 1);
                                       }}
                                    />
                                 </CardContent>
                              </Card>
                           )}
                     </TabPanel>
                     <TabPanel
                        value={PlayerDetailsTabs.PROFIT}
                        sx={{
                           padding: '8px 0px',
                           '.dataGridWrapper': {
                              marginLeft: isDesktop ? '-12px' : 0,
                              height: PageWithdetails4Toolbar,
                           },
                           width: isDesktop ? 'calc(100vw - 245px)' : '100%',
                        }}
                     >
                        {data && <PlayerProfit data={data} />}
                     </TabPanel>
                     <TabPanel
                        value={PlayerDetailsTabs.NOTE}
                        sx={{ padding: '8px 0px' }}
                     >
                        <Card
                           sx={{
                              width: '100%',
                              height: 'initial',
                              overflowY: 'auto',
                              mb: '8px',
                              '.box-texfield-style': {
                                 p: '16px',
                                 border: `1px solid ${darkPurple[11]}`,
                                 borderRadius: '8px',
                                 background: darkPurple[12],
                                 mb: '6px',
                              },
                              '&.MuiPaper-root': {
                                 maxWidth: '100%!important',
                              },
                              textAlign: 'center',
                           }}
                        >
                           <CardContent sx={{ pb: '6px !important' }}>
                              <FormControl
                                 mr={2}
                                 mb={2}
                                 sx={{
                                    width: '100%',
                                    '.MuiOutlinedInput-notchedOutline': {
                                       borderColor: theme.palette.divider,
                                    },
                                    '.MuiTextField-root fieldset': {
                                       border: `1px solid ${darkPurple[11]}!important`,
                                    },
                                 }}
                              >
                                 <TextField
                                    name="note"
                                    label="Note"
                                    disabled={
                                       !hasDetailsPermission(
                                          UserPermissionEvent.BACKOFFICE_SET_PLAYER_NOTE_REQ
                                       )
                                    }
                                    onChange={(e) => setNote(e.target.value)}
                                    value={note}
                                    minRows={15}
                                    multiline
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 5 }}
                                 />
                              </FormControl>
                              {hasDetailsPermission(
                                 UserPermissionEvent.BACKOFFICE_SET_PLAYER_NOTE_REQ
                              ) && (
                                 <DialogActions
                                    sx={{ justifyContent: 'center' }}
                                 >
                                    <Button
                                       onClick={() => setNote(data?.note || '')}
                                       color="secondary"
                                       variant="outlined"
                                       sx={{
                                          height: 32,
                                          borderColor: darkPurple[10],
                                       }}
                                    >
                                       Cancel
                                    </Button>
                                    <Button
                                       color="secondary"
                                       variant="contained"
                                       sx={{ height: 32 }}
                                       onClick={() => notePlayerHandle(data)}
                                    >
                                       Save
                                    </Button>
                                 </DialogActions>
                              )}
                           </CardContent>
                        </Card>
                     </TabPanel>
                     <TabPanel
                        value={PlayerDetailsTabs.ACTIONS}
                        sx={{ padding: '8px 0px' }}
                     >
                        <Card
                           key={boxRefrech}
                           sx={{
                              width: '100%',
                              height: 'initial',
                              overflowY: 'auto',
                              mb: '8px',
                              pb: '10px',
                              '.box-texfield-style': {
                                 p: '16px',
                                 border: `1px solid ${darkPurple[11]}`,
                                 borderRadius: '8px',
                                 background: darkPurple[12],
                                 mb: '6px',
                              },
                              '&.MuiPaper-root': {
                                 maxWidth: '100%!important',
                              },
                              textAlign: 'center',
                           }}
                        >
                           <CardContent sx={{ pb: '6px !important' }}>
                              <Grid
                                 container
                                 direction="row"
                                 alignItems="center"
                                 spacing={1}
                              >
                                 {hasDetailsPermission(
                                    UserPermissionEvent.BACKOFFICE_SET_PLAYER_NICKNAME_REQ
                                 ) && (
                                    <Grid item xs={12}>
                                       <Grid
                                          container
                                          direction="row"
                                          alignItems="center"
                                          spacing={0}
                                       >
                                          <Grid
                                             item
                                             sx={{
                                                width: 'calc(100% - 80px)',
                                             }}
                                          >
                                             <FormControl
                                                mr={2}
                                                mb={2}
                                                sx={{
                                                   width: '100%',
                                                   '.MuiOutlinedInput-notchedOutline':
                                                      {
                                                         borderColor:
                                                            theme.palette
                                                               .divider,
                                                      },
                                                   '.MuiTextField-root fieldset':
                                                      {
                                                         border: `1px solid ${darkPurple[11]}!important`,
                                                      },
                                                }}
                                             >
                                                <TextField
                                                   autoFocus
                                                   margin="dense"
                                                   id="nickname"
                                                   label="Set Nickname"
                                                   type="text"
                                                   required
                                                   value={nickname}
                                                   fullWidth
                                                   onChange={(event) =>
                                                      setNickname(
                                                         event.target.value
                                                      )
                                                   }
                                                   autoComplete="off"
                                                />
                                             </FormControl>
                                          </Grid>
                                          <Grid item xs />
                                          <Grid item>
                                             <Button
                                                onClick={nicknamePlayerHandle}
                                                disabled={!nickname}
                                                variant="contained"
                                                color="secondary"
                                                fullWidth
                                                sx={{ height: '32px' }}
                                             >
                                                Submit
                                             </Button>
                                          </Grid>
                                       </Grid>
                                    </Grid>
                                 )}
                                 <Grid item xs={12} pb={'12px'}>
                                    <Divider />
                                 </Grid>
                                 <Grid item xs={12} pb={'12px'}>
                                    <Divider />
                                 </Grid>
                                 {hasDetailsPermission(
                                    UserPermissionEvent.BACKOFFICE_FORCE_CASH_OUT_REQ
                                 ) &&
                                    [
                                       IntegrationType.ALIEN_WALLET_TRANSFER,
                                       IntegrationType.PG_WALLET_TRANSFER,
                                    ].includes(
                                       operator.integrationType as IntegrationType
                                    ) && (
                                       <Grid item xs={4} md={'auto'}>
                                          <Button
                                             onClick={handleOpenForceCashOut}
                                             variant="contained"
                                             color="secondary"
                                             fullWidth
                                             sx={{ height: '32px' }}
                                          >
                                             Force Cash Out
                                          </Button>
                                       </Grid>
                                    )}
                                 {data?.integrationType ===
                                    IntegrationType.ALIEN_STANDALONE &&
                                    hasDetailsPermission(
                                       UserPermissionEvent.BACKOFFICE_TOPUP_REQ
                                    ) && (
                                       <Grid item xs={4} md={'auto'}>
                                          <Button
                                             onClick={() =>
                                                openTopUpPlayerHandle(data)
                                             }
                                             variant="contained"
                                             color="secondary"
                                             fullWidth
                                             sx={{ height: '32px' }}
                                          >
                                             Top up
                                          </Button>
                                       </Grid>
                                    )}
                                 {data?.integrationType ===
                                    IntegrationType.ALIEN_STANDALONE &&
                                    hasDetailsPermission(
                                       UserPermissionEvent.BACKOFFICE_UPDATE_WALLET_REQ
                                    ) && (
                                       <Grid item xs={4} md={'auto'}>
                                          <Button
                                             onClick={handleOpenUpdateWallet}
                                             variant="contained"
                                             color="secondary"
                                             fullWidth
                                             sx={{ height: '32px' }}
                                          >
                                             Update wallet
                                          </Button>
                                       </Grid>
                                    )}
                                 {data?.integrationType ===
                                    IntegrationType.ALIEN_STANDALONE &&
                                    hasDetailsPermission(
                                       UserPermissionEvent.BACKOFFICE_ALLOCATE_WALLET_ADDRESS_REQ
                                    ) && (
                                       <Grid item xs={4} md={'auto'}>
                                          <Button
                                             onClick={handleOpenAllocateWallet}
                                             variant="contained"
                                             color="secondary"
                                             fullWidth
                                             sx={{ height: '32px' }}
                                          >
                                             Allocate wallet
                                          </Button>
                                       </Grid>
                                    )}
                                 {hasDetailsPermission(
                                    UserPermissionEvent.BACKOFFICE_SET_PLAYER_IS_TEST_REQ
                                 ) && (
                                    <Grid item xs={4} md={'auto'}>
                                       <Button
                                          onClick={() => {
                                             setActiveSubmit(true);
                                             handleSetPlayerIsTest({
                                                isTest: !data.isTest,
                                                opId: data.opId,
                                                playerId: data.playerId,
                                             });
                                          }}
                                          fullWidth
                                          variant="contained"
                                          color="secondary"
                                          sx={{ height: '32px' }}
                                       >
                                          {data.isTest
                                             ? 'Set As Real player'
                                             : 'Set As Test player'}
                                       </Button>
                                    </Grid>
                                 )}
                                 {hasDetailsPermission(
                                    UserPermissionEvent.BACKOFFICE_SET_PLAYER_IS_BLOCKED_REQ
                                 ) && (
                                    <Grid item xs={4} md={'auto'}>
                                       <Button
                                          variant="contained"
                                          color="secondary"
                                          fullWidth
                                          sx={{ height: '32px' }}
                                          onClick={() => {
                                             setActiveSubmit(true);
                                             handleSetPlayerIsBlocked({
                                                opId: data.opId,
                                                playerId: data.playerId,
                                                isBlocked: !data.isBlocked,
                                             });
                                          }}
                                       >
                                          {data.isBlocked ? 'Unblock' : 'Block'}
                                       </Button>
                                    </Grid>
                                 )}
                                 {hasDetailsPermission(
                                    UserPermissionEvent.BACKOFFICE_SET_PLAYER_CHAT_IS_BLOCKED_REQ
                                 ) && (
                                    <Grid item xs={4} md={'auto'}>
                                       <Button
                                          variant="contained"
                                          color="secondary"
                                          fullWidth
                                          sx={{ height: '32px' }}
                                          onClick={() => {
                                             setActiveSubmit(true);
                                             handleSetPlayerChatIsBlocked({
                                                opId: data.opId,
                                                playerId: data.playerId,
                                                isBlocked: !data.chatIsBlocked,
                                             });
                                          }}
                                       >
                                          {data.chatIsBlocked
                                             ? 'Unblock'
                                             : 'Block'}{' '}
                                          chat
                                       </Button>
                                    </Grid>
                                 )}

                                 {data?.integrationType ===
                                    IntegrationType.ALIEN_STANDALONE &&
                                    hasDetailsPermission(
                                       UserPermissionEvent.BACKOFFICE_DELETE_PLAYER_REQ
                                    ) && (
                                       <Grid item xs={4} md={'auto'}>
                                          <Button
                                             onClick={handleOpenRemovePlayer}
                                             variant="contained"
                                             color="secondary"
                                             fullWidth
                                             sx={{ height: '32px' }}
                                          >
                                             Delete
                                          </Button>
                                       </Grid>
                                    )}
                              </Grid>
                           </CardContent>
                        </Card>
                     </TabPanel>
                  </TabContext>
               </Grid>
            </>
         ) : ignore && id && data === null ? (
            <></>
         ) : (
            <CustomLoader />
         )}
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
                     // onKeyDown={preventInvalidCharacters}
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
                     inputProps={{
                        inputMode: 'numeric',
                        pattern: '[-]?[0-9]*[.,]?[0-9]+([eE][-+]?[0-9]+)?',
                     }}
                     autoComplete="off"
                  />
                  <FormControl
                     sx={{
                        width: '100%',
                     }}
                  >
                     <Autocomplete
                        id={`currency`}
                        options={topupCurrencies || []}
                        sx={{
                           width: '100%',
                           mb: 0,
                           '.MuiAutocomplete-input': {
                              cursor: 'pointer',
                           },
                        }}
                        value={currencyTop}
                        onChange={(e, selectedCurrency) => {
                           setCurrencyTop(selectedCurrency || '');
                        }}
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              variant="outlined"
                              name={`currency`}
                              label={'Currency'}
                              fullWidth
                              InputProps={{
                                 ...params.InputProps,
                                 endAdornment: (
                                    <FontAwesomeIcon
                                       icon={faAngleDown as IconProp}
                                       className="selectIcon"
                                       size="sm"
                                    />
                                 ),
                              }}
                           />
                        )}
                     />
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
               {data && data.opId && (
                  <Button
                     color="secondary"
                     variant="contained"
                     sx={{ height: 32 }}
                     onClick={() => {
                        setActiveSubmit(true);
                        handleRemovePlayer({
                           opId: data.opId,
                           playerId: data.playerId,
                        });
                     }}
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
            open={openUpdateWallet}
            onClose={handleCloseUpdateWallet}
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
            <DialogTitle id="form-dialog-title">Update Wallet</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to update the wallet for this Player?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleCloseUpdateWallet}
                  color="secondary"
                  variant="outlined"
                  sx={{
                     height: 32,
                     borderColor: darkPurple[10],
                  }}
               >
                  Cancel
               </Button>
               {data && data.opId && (
                  <Button
                     color="secondary"
                     variant="contained"
                     sx={{ height: 32 }}
                     onClick={() => {
                        setActiveSubmit(true);
                        handleUpdateWallet({
                           opId: data.opId,
                           playerId: data.playerId,
                        });
                     }}
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
               {data && data.opId && (
                  <Button
                     color="secondary"
                     variant="contained"
                     sx={{ height: 32 }}
                     onClick={() => {
                        setActiveSubmit(true);
                        handleAllocateWallet({
                           opId: data.opId,
                           playerId: data.playerId,
                        });
                     }}
                  >
                     Confirm
                  </Button>
               )}
            </DialogActions>
         </Dialog>
      </React.Fragment>
   );
}

PlayerDetails.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Player Details">{page}</DashboardLayout>;
};

export default PlayerDetails;
