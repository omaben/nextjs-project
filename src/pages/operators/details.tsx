import CustomLoader from '@/components/custom/CustomLoader';
import PortalCopyValue from '@/components/custom/PortalCopyValue';
import TransitionSlide from '@/components/custom/TransitionSlide';
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar';
import { useGetValidGamesForOperatorQuery } from '@/components/data/gamesV2/lib/hooks/queries';
import {
   useCreateGameOperatorMutation,
   useCreateGameV2OperatorMutation,
   useSetGameOperatorStatusMutation,
} from '@/components/data/operatorGames/lib/hooks/queries';
import OperatorGames from '@/components/data/operatorGames/operator-games-grid';
import {
   useCreateOperatorGameV2Mutation,
   useSetGameOperatorStatusV2Mutation,
} from '@/components/data/operatorGamesV2/lib/hooks/queries';
import OperatorGamesV2 from '@/components/data/operatorGamesV2/operator-games-grid';
import OperatorConfigs from '@/components/data/operators/configs';
import EditBrandsData from '@/components/data/operators/edit-brands';
import EditLimitsData from '@/components/data/operators/edit-limits';
import OperatorJsonConfigs from '@/components/data/operators/jsonConfigs';
import {
   useEditOperatorBrandMutation,
   useGetOperatorConfigQuery,
   useGetOperatorQuery,
   useGetOperatorWebhookBaseURL,
   useLockedOperatorMutation,
   useSetBetConfigOperatorMutation,
   useSetOperatorBetAmountLimitsMutation,
   useSetWebhookBaseURLMutation,
} from '@/components/data/operators/lib/hooks/queries';
import ActivePaymentGatewayData from '@/components/data/payments/active-payments-grid';
import { useSetOperatorTopUpCurrenciesMutation } from '@/components/data/topupCurrencies/lib/hooks/queries';
import TopUpCurrenciesData from '@/components/data/topupCurrencies/topup-currencies-data';
import AllUsers from '@/components/data/users/users-grid';
import {
   AddAllGamesToOperatorDto,
   BetAmountLimits,
   Brand,
   ConfigType,
   Currency,
   EditOperatorBrandsDto,
   GameStatus,
   GameV2,
   IntegrationType,
   LockOperatorDto,
   Operator,
   OperatorGameStatus,
   SetBetDbConfigDto,
   SetOperatorBetAmountLimitsDto,
   SetOperatorGamesStatusDto,
   SetOperatorGamesV2StatusDto,
   SetOperatorWebhookBaseUrlDto,
   SetTopupCurrenciesDto,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front';
import { AddAllGamesV2ToOperatorDto } from '@alienbackoffice/back-front/lib/operator/dto/add-all-games-v2-to-operator.dto';
import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
   faAdd,
   faAngleDown,
   faRectangleXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
   Autocomplete,
   Avatar,
   Box,
   Card,
   CardContent,
   Dialog,
   DialogActions,
   DialogContent,
   FormControl,
   Grid,
   Button as MuiButton,
   Tab,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import { Stack, spacing } from '@mui/system';
import { randomId } from '@mui/x-data-grid-generator';
import { ImoonGray, darkPurple } from 'colors';
import { Formik } from 'formik';
import moment from 'moment';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
   saveApiAuthorizationTokenData,
   saveOperatorBetConfigData,
   saveOperatorGamesList,
   saveOperatorGamesV2List,
   savePaymentsGateway,
   saveUsersList,
   selectAuthAuthorizationTokenData,
   selectAuthBrandsList,
   selectAuthCurrenciesInit,
   selectAuthCurrentBrand,
   selectAuthDefaultBetAmountLimits,
   selectAuthOperator,
   selectAuthOperatorBetAmountLimits,
   selectAuthOperatorBetConfig,
   selectAuthOperatorDetails,
   selectAuthTopupCurrencies,
   selectAuthUser,
   selectAuthValidGamesForOperator,
   selectAuthWebhookBaseURL,
} from 'redux/authSlice';
import {
   saveLoadingBetDBConfig,
   saveLoadingOperatorBetAmountLimits,
   saveLoadingOperatorGamesList,
   saveLoadingOperatorGamesV2List,
   saveLoadingPaymentsGateway,
   saveLoadingUsersList,
   selectloadingBetDBConfig,
} from 'redux/loadingSlice';
import { selectBoClient } from 'redux/socketSlice';
import { store } from 'redux/store';
import { PageWithdetails4Toolbar } from 'services/globalFunctions';
import { hasDetailsPermission } from 'services/permissionHandler';
import { OperatorDetailsTabs } from 'types';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import DashboardLayout from '../../layouts/Dashboard';

const Button = styled(MuiButton)(spacing);
interface RowsCellProps {
   brandId: string;
   brandName: string;
   brandDomain: string;
}
interface RowsCellPropsTopUp {
   id: string;
   currency: string;
}
interface RowsCellPropsLimit {
   currency: string;
   minStack: number;
   maxStack: number;
   maxWinAmount: number;
   defaultBetAmount: number;
}
function OperatorDetails() {
   const router = useRouter();
   const { id }: any = router.query;
   const theme = useTheme();
   const dataDefaultLimit = useSelector(
      selectAuthDefaultBetAmountLimits
   ) as BetAmountLimits;
   const user: User = useSelector(selectAuthUser);
   const dataOperator = useSelector(selectAuthOperatorDetails) as Operator;
   const webhookOperator = useSelector(selectAuthWebhookBaseURL) as string;
   const validGames = useSelector(selectAuthValidGamesForOperator) as GameV2[];
   const [open, setOpen] = React.useState(false);
   const [extraDataErrorSkin, setExtraDataErrorSkin] = React.useState(false);
   const [extraDataSkin, setExtraDataSkin] = React.useState({});
   const [value, setValue] = React.useState('');
   const [gamesSelected, setGameSelected] = React.useState([]);
   const [gamesV2Selected, setGameV2Selected] = React.useState([]);
   const [refreshData, setRefreshData] = React.useState(0);
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
   const opId = useSelector(selectAuthOperator);
   const [ignore, setIgnore] = React.useState(false);
   const boClient = useSelector(selectBoClient);
   const dataTopUp = useSelector(selectAuthTopupCurrencies) as string[];
   const [initialValuesBrand, setInitialValuesBrand] = React.useState({
      opId: opId,
      brandId: '',
      brandName: '',
      brandDomain: '',
   });
   const betOperatorConfig = useSelector(selectAuthOperatorBetConfig) as {
      connectionString: string;
      dbName: string;
   };
   const isLoadingBetOperatorConfig = useSelector(selectloadingBetDBConfig);
   const [initForm, setInitForm] = React.useState(0);
   const [openAddGame, setOpenAddGame] = React.useState(false);
   const [stakePresetsDefault, setStakePresetsDefault] = React.useState(
      [] as { title?: string; amount: number }[]
   );
   const [stakeByCurrency, setStakeByCurrency] = React.useState(
      [] as {
         currency: string;
         minStake: number;
         maxStake: number;
         maxWinAmount: number;
         defaultBetAmount: number;
         stakePresets?: { title?: string; amount: number }[];
      }[]
   );
   const [refresh, setRefresh] = React.useState(0);
   const [Transition, setTransition]: any = React.useState();
   const [expanded, setExpanded] = React.useState<string | false>('chatConfig');
   const [webhookBaseURL, setWebhookBaseURL] = React.useState(webhookOperator);
   const data = useSelector(selectAuthBrandsList) as Brand[];
   const currenciesInit = useSelector(selectAuthCurrenciesInit) as Currency[];
   const [openEditLimit, setOpenEditLimit] = React.useState(false);
   const [initialValuesLimit, setInitialValuesLimit] = React.useState({
      currency: '',
      minStack: 0,
      maxStack: 0,
      maxWinAmount: 0,
      defaultBetAmount: 0,
   });
   const [rows, setRows] = React.useState([] as RowsCellPropsLimit[]);
   const [initialValues, setInitialValues] = React.useState({
      opId: dataOperator?.opId,
      gameId: '',
      status: OperatorGameStatus.ACTIVE,
      chatConfig_IsEnable: false,
      tournamentConfig_IsEnable: false,
      TournamentConfig_statsFileUrl: '',
      languageConfig_dictionaryUrl: '',
      skinConfig_skinId: '',
      skinConfig_extraData: {},
      UIConfig_gameInfoUrl: '',
      UIConfig_showGameInfo: false,
      UIConfig_showPlayersCount: false,
      UIConfig_isSoundEnable: false,
      UIConfig_isTvModeEnable: false,
      alienCrashGameSpecificConfig_gamePlayURL: '',
      alienCrashGameSpecificConfig_autoCashoutIsEnable: false,
      alienCrashGameSpecificConfig_cancelBetInCurrentRoundIsEnable: false,
      alienCrashGameSpecificConfig_maintenanceModeIsEnabled: false,
      alienCrashGameSpecificConfig_multiBetIsEnabled: false,
      alienCrashGameSpecificConfig_showPlayersCount: false,
      alienCrashGameSpecificConfig_showTotalBets: false,
      alienCrashGameSpecificConfig_testMechanismIsEnable: false,
      defaultStakeConfigs_stakePresets: [],
      defaultStakeConfigs_minStake: 0,
      defaultStakeConfigs_maxStake: 0,
      defaultStakeConfigs_maxWinAmount: 0,
      defaultStakeConfigs_defaultBetAmount: 0,
      stakeConfigsByCurrencies: [],
   });
   const [openEditTopUp, setOpenEditTopUp] = React.useState(false);
   const apiAuthorizationToken = useSelector(selectAuthAuthorizationTokenData);

   const [initialValuesTopUp, setInitialValuesTopUp] = React.useState({
      id: '',
      currency: '',
   });
   const currentBrandId = useSelector(selectAuthCurrentBrand);
   const [rowsTopUp, setRowsTopUp] = React.useState([] as RowsCellPropsTopUp[]);
   const dataLimit = useSelector(
      selectAuthOperatorBetAmountLimits
   ) as BetAmountLimits;

   const handleChangeTabs = (event: React.SyntheticEvent, newValue: string) => {
      event.preventDefault();
      if (newValue === OperatorDetailsTabs.BET_DB_CONFIG) {
         store.dispatch(saveLoadingBetDBConfig(true));
         boClient?.operator.getBetDbConfig(
            { opId: id },
            {
               uuid: uuidv4(),
               meta: {
                  type: 'details',
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_BET_DB_CONFIG_REQ,
               },
            }
         );
      }
      if (newValue === OperatorDetailsTabs.API_AUTHORIZATION_TOKEN) {
         store.dispatch(saveApiAuthorizationTokenData(''));
         if (
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GET_API_AUTHORIZATION_TOKEN_REQ
            )
         ) {
            boClient?.operator.getApiAuthorizationToken(
               { opId: id },
               {
                  uuid: uuidv4(),
                  meta: {
                     type: 'details',
                     ts: new Date(),
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GET_API_AUTHORIZATION_TOKEN_REQ,
                  },
               }
            );
         }
      }
      if (newValue === OperatorDetailsTabs.USERS) {
         store.dispatch(saveLoadingUsersList(true));
      }
      if (newValue === OperatorDetailsTabs.EDITLIMITS) {
         store.dispatch(saveLoadingOperatorBetAmountLimits(true));
      }
      setGameV2Selected([]);
      setGameSelected([]);
      setValue(newValue);
   };

   useGetOperatorQuery({ opId: id, key: 'details' });

   useGetOperatorConfigQuery({
      opId: id,
   });

   useGetOperatorWebhookBaseURL({
      opId: id,
   });

   useGetValidGamesForOperatorQuery({
      opId: id,
      configType: ConfigType.ALIEN_CRASH,
   });

   const { mutate } = useCreateGameOperatorMutation({
      onSuccess: () => {
         setRefreshData(refreshData + 1);
      },
      onSettled(data, error, variables, context) {
         if (error) {
            toast.error(error, {
               position: toast.POSITION.TOP_CENTER,
            });
         }
      },
   });

   const { mutate: mutateV2 } = useCreateGameV2OperatorMutation({
      onSuccess: () => {
         setRefreshData(refreshData + 1);
         toast.success('Add all games Successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
      },
      onSettled(data, error, variables, context) {
         if (error) {
            toast.error(error, {
               position: toast.POSITION.TOP_CENTER,
            });
         }
      },
   });

   const { mutate: mutateStatus } = useSetGameOperatorStatusMutation({
      onSuccess: () => {},
   });

   const { mutate: mutateV2Status } = useSetGameOperatorStatusV2Mutation({
      onSuccess: () => {},
   });

   const { mutate: mutateLocked } = useLockedOperatorMutation({
      onSuccess: (data) => {},
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateLimit } = useSetOperatorBetAmountLimitsMutation({
      onSuccess: () => {
         toast.success('Operator bet amount limits Updated Successfully');
         handleCloseEditLimit();
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateTopUp } = useSetOperatorTopUpCurrenciesMutation({
      onSuccess: () => {
         toast.success('Top up currency added Successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
         handleCloseEditTopUp();
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: addNewOperatorGameMutate } = useCreateOperatorGameV2Mutation(
      {
         onSuccess: () => {
            toast.success('You add new game successfully', {
               position: toast.POSITION.TOP_CENTER,
            });
            setRefresh(refresh + 1);
            handleCloseNewGame();
         },
         onError(error, variables, context) {
            toast.error(error, {
               position: toast.POSITION.TOP_CENTER,
            });
         },
      }
   );

   const { mutate: mutatWebhookBaseURL } = useSetWebhookBaseURLMutation({
      onSuccess: () => {
         toast.success('You set webhook base URL successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateBrand } = useEditOperatorBrandMutation({
      onSuccess: () => {
         toast.success('You add Successfully operator Brand', {
            position: toast.POSITION.TOP_CENTER,
         });
         boClient?.operator.getOperatorBrands(
            { opId: opId },
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
         handleClose();
      },
   });

   const { mutate: mutateBetConfig } = useSetBetConfigOperatorMutation({
      onSuccess: () => {
         toast.success(`You set bet config successfully`, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const handleSubmitAddGames = React.useCallback(
      (dto: AddAllGamesToOperatorDto) => {
         mutate({ dto });
      },
      [mutate]
   );

   const handleSubmitAddGamesV2 = React.useCallback(
      (dto: AddAllGamesV2ToOperatorDto) => {
         mutateV2({ dto });
      },
      [mutateV2]
   );

   const handleSubmitGameStatus = React.useCallback(
      (dto: SetOperatorGamesStatusDto) => {
         mutateStatus({ dto });
      },
      [mutateStatus]
   );

   const handleSubmitGameV2Status = React.useCallback(
      (dto: SetOperatorGamesV2StatusDto) => {
         mutateV2Status({ dto });
      },
      [mutateV2Status]
   );

   const updateGrid = (data: any) => {
      setGameSelected(data);
   };

   const updateGridV2 = (data: any) => {
      setGameV2Selected(data);
   };

   const handleClose = (
      event?: React.SyntheticEvent | Event,
      reason?: string
   ) => {};

   const handlelockOperator = React.useCallback(
      (dto: LockOperatorDto) => {
         mutateLocked({ dto });
      },
      [mutateLocked]
   );

   const handleTabValue = () => {
      let valueTab = '';
      switch (true) {
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_OPERATOR_GAME_LIST_REQ
         ):
            valueTab = OperatorDetailsTabs.GAMES;
            break;
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_OPERATOR_CONFIG_REQ
         ):
            valueTab = OperatorDetailsTabs.OPCONFIGS;
            break;
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_OPERATOR_CONFIG_REQ
         ) && user?.scope === UserScope.SUPERADMIN:
            valueTab = OperatorDetailsTabs.OPCONFIGSJSON;
            break;
         case dataOperator?.integrationType ===
            IntegrationType.ALIEN_STANDALONE &&
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ
            ):
            valueTab = OperatorDetailsTabs.EDITBRANDS;
            break;
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BET_AMOUNT_LIMITS_REQ
         ):
            valueTab = OperatorDetailsTabs.EDITLIMITS;
            break;
         case dataOperator?.integrationType ===
            IntegrationType.ALIEN_STANDALONE &&
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GET_PAYMENT_GATEWAYS_REQ
            ):
            valueTab = OperatorDetailsTabs.PAYMENT_GATEWAYS;
            break;
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_USER_LIST_REQ
         ):
            valueTab = OperatorDetailsTabs.USERS;
            break;
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_BET_DB_CONFIG_REQ
         ):
            valueTab = OperatorDetailsTabs.BET_DB_CONFIG;
            break;
         default:
            break;
      }
      return valueTab;
   };

   const handleCloseNewGame = () => {
      setOpenAddGame(false);
   };

   // const handleSubmitAddNewGame = React.useCallback(
   //    (data: {
   //       opId: string
   //       gameId: string
   //       status: OperatorGameStatus
   //       chatConfig_IsEnable: boolean
   //       tournamentConfig_IsEnable: boolean
   //       TournamentConfig_statsFileUrl: string
   //       languageConfig_dictionaryUrl: string
   //       skinConfig_skinId: string
   //       skinConfig_extraData: any
   //       UIConfig_gameInfoUrl: string
   //       UIConfig_showGameInfo: boolean
   //       UIConfig_showPlayersCount: boolean
   //       UIConfig_isSoundEnable: boolean
   //       UIConfig_isTvModeEnable: boolean
   //       alienCrashGameSpecificConfig_gamePlayURL: string
   //       alienCrashGameSpecificConfig_autoCashoutIsEnable: boolean
   //       alienCrashGameSpecificConfig_cancelBetInCurrentRoundIsEnable: boolean
   //       alienCrashGameSpecificConfig_maintenanceModeIsEnabled: boolean
   //       alienCrashGameSpecificConfig_multiBetIsEnabled: boolean
   //       alienCrashGameSpecificConfig_showPlayersCount: boolean
   //       alienCrashGameSpecificConfig_showTotalBets: boolean
   //       alienCrashGameSpecificConfig_testMechanismIsEnable: boolean
   //       defaultStakeConfigs_minStake: number
   //       defaultStakeConfigs_maxStake: number
   //       defaultStakeConfigs_maxWinAmount: number
   //       defaultStakeConfigs_defaultBetAmount: number
   //       defaultStakeConfigs_stakePresets: { title?: string; amount: number }[]
   //       stakeConfigsByCurrencies: {
   //          currency: string
   //          minStake: number
   //          maxStake: number
   //          maxWinAmount: number
   //          defaultBetAmount: number
   //          stakePresets?: { title?: string; amount: number }[]
   //       }[]
   //    }) => {
   //       data.defaultStakeConfigs_stakePresets = stakePresetsDefault
   //       data.stakeConfigsByCurrencies = stakeByCurrency
   //       const dto: AddOperatorAlienCrashGameV2Dto = {
   //          opId: data.opId,
   //          gameId: data.gameId,
   //          status: data.status,
   //          chatConfig: {
   //             isEnable: data.chatConfig_IsEnable,
   //          },
   //          tournamentConfig: {
   //             isEnable: data.tournamentConfig_IsEnable,
   //             statsFileUrl: data.TournamentConfig_statsFileUrl,
   //          },
   //          stakeConfigs: {
   //             default: {
   //                minStake: data.defaultStakeConfigs_minStake,
   //                maxStake: data.defaultStakeConfigs_maxStake,
   //                maxWinAmount: data.defaultStakeConfigs_maxWinAmount,
   //                defaultBetAmount: data.defaultStakeConfigs_defaultBetAmount,
   //                stakePresets: data.defaultStakeConfigs_stakePresets,
   //             },
   //             byCurrency: data.stakeConfigsByCurrencies.reduce(
   //                (obj, cur) => ({
   //                   ...obj,
   //                   [cur.currency]: {
   //                      minStake: cur.minStake,
   //                      maxStake: cur.maxStake,
   //                      maxWinAmount: cur.maxWinAmount,
   //                      defaultBetAmount: cur.defaultBetAmount,
   //                      stakePresets: cur.stakePresets,
   //                   },
   //                }),
   //                {}
   //             ),
   //          },
   //          skinConfig: {
   //             skinId: data.skinConfig_skinId,
   //             extraData: data.skinConfig_extraData,
   //          },
   //          alienCrashGameSpecificConfig: {
   //             gameplay: '',
   //             autoCashoutIsEnable:
   //                data.alienCrashGameSpecificConfig_autoCashoutIsEnable,
   //             cancelBetInCurrentRoundIsEnable:
   //                data.alienCrashGameSpecificConfig_cancelBetInCurrentRoundIsEnable,
   //             gamePlayURL: data.alienCrashGameSpecificConfig_gamePlayURL,
   //             maintenanceModeIsEnabled:
   //                data.alienCrashGameSpecificConfig_maintenanceModeIsEnabled,
   //             multiBetIsEnabled:
   //                data.alienCrashGameSpecificConfig_multiBetIsEnabled,
   //             showPlayersCount: data.UIConfig_showPlayersCount,
   //             showTotalBets: data.alienCrashGameSpecificConfig_showTotalBets,
   //             testMechanismIsEnable:
   //                data.alienCrashGameSpecificConfig_testMechanismIsEnable,
   //          },
   //          uiConfig: {
   //             gameInfoUrl: data.UIConfig_gameInfoUrl,
   //             isSoundEnable: data.UIConfig_isSoundEnable,
   //             isTvModeEnable: data.UIConfig_isTvModeEnable,
   //             showGameInfo: data.UIConfig_showGameInfo,
   //             showPlayersCount: data.UIConfig_showPlayersCount,
   //          },
   //          languageConfig: {
   //             dictionaryUrl: data.languageConfig_dictionaryUrl,
   //          },
   //       }
   //       addNewOperatorGameMutate({ dto: dto })
   //    },
   //    [addNewOperatorGameMutate, stakePresetsDefault, stakeByCurrency]
   // )

   const handleChangePannel =
      (panel: string) =>
      (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
         setExpanded(isExpanded ? panel : false);
      };

   const handleStakePresetsDefault = (
      stakePresetsDefaultData: { title?: string; amount: number }[]
   ) => {
      setStakePresetsDefault(stakePresetsDefaultData);
   };

   const handleStakeByCurrency = (
      stakeByCurrencyData: {
         currency: string;
         minStake: number;
         maxStake: number;
         maxWinAmount: number;
         defaultBetAmount: number;
         stakePresets?: { title?: string; amount: number }[];
      }[]
   ) => {
      setStakeByCurrency(stakeByCurrencyData);
   };

   const webhookBaseURLSubmit = React.useCallback(
      (dto: SetOperatorWebhookBaseUrlDto) => {
         mutatWebhookBaseURL({ dto });
      },
      [mutatWebhookBaseURL]
   );

   const webhookBaseURLHandle = () => {
      const post: SetOperatorWebhookBaseUrlDto = {
         opId: dataOperator?.opId,
         webhookBaseUrl: webhookBaseURL,
      };
      webhookBaseURLSubmit(post);
   };

   const handleCloseBrand = async () => {
      setOpen(false);
      setInitialValuesBrand({
         opId: opId,
         brandId: '',
         brandName: '',
         brandDomain: '',
      });
   };

   const handleClickOpen = () => {
      setTransition(TransitionSlide);
      setOpen(true);
      setInitialValuesBrand({
         opId: opId,
         brandId: '',
         brandName: '',
         brandDomain: '',
      });
   };

   const handleSubmitBrand = React.useCallback(
      (dataItem: RowsCellProps) => {
         const brand: Brand = {
            brandId: dataItem.brandId,
         };
         if (dataItem.brandName) {
            brand.brandName = dataItem.brandName;
         }
         if (dataItem.brandDomain) {
            brand.brandDomain = dataItem.brandDomain;
         }
         const dto: EditOperatorBrandsDto = {
            opId: opId,
            brands: [...data, brand],
         };
         mutateBrand({ dto });
      },
      [mutateBrand, opId, data]
   );

   const handleOpenEditLimit = () => {
      setTransition(TransitionSlide);
      setOpenEditLimit(true);
   };

   const handleCloseEditLimit = async () => {
      setOpenEditLimit(false);
      setInitialValuesLimit({
         currency: '',
         defaultBetAmount: 0,
         maxStack: 0,
         minStack: 0,
         maxWinAmount: 0,
      });
   };

   const handleSubmitEditLimit = React.useCallback(
      (dataItem: RowsCellPropsLimit) => {
         const currencies: RowsCellPropsLimit[] = [...rows, dataItem];

         const minStakeByCurrency = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.minStack),
            }),
            {}
         );

         const maxStakeByCurrency = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.maxStack),
            }),
            {}
         );

         const maxWinAmountByCurrency = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.maxWinAmount),
            }),
            {}
         );

         const defaultBetAmount = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.defaultBetAmount),
            }),
            {}
         );
         const dto: SetOperatorBetAmountLimitsDto = {
            opId: opId,
            minStakeByCurrency: minStakeByCurrency,
            maxStakeByCurrency: maxStakeByCurrency,
            maxWinAmountByCurrency: maxWinAmountByCurrency,
            defaultBetAmountByCurrency: defaultBetAmount,
         };
         mutateLimit({ dto });
      },
      [mutateLimit, rows, opId]
   );

   const handleOpenEditTopUp = () => {
      setTransition(TransitionSlide);
      setInitialValuesTopUp({
         id: '',
         currency: '',
      });
      setOpenEditTopUp(true);
   };

   const handleCloseEditTopUp = async () => {
      setOpenEditTopUp(false);
      setInitialValuesTopUp({
         id: '',
         currency: '',
      });
   };

   const handleSubmitMethods = React.useCallback(
      (data: SetTopupCurrenciesDto) => {
         mutateTopUp({ dto: data });
      },
      [mutateTopUp]
   );

   const handleSubmitEditTopUp = (dataItem: RowsCellPropsTopUp) => {
      const currencies: RowsCellPropsTopUp[] = [...rowsTopUp, dataItem];
      // Create a Set to store unique currency values
      const uniqueCurrenciesSet: Set<string> = new Set();
      // Add existing currencies from dataTopUp
      dataTopUp.forEach((obj) => uniqueCurrenciesSet.add(obj));

      // Add new currencies from the updated rowsTopUp
      currencies.forEach((obj) => uniqueCurrenciesSet.add(obj.currency));
      // Convert the Set back to an array
      const uniqueCurrencies: string[] = Array.from(uniqueCurrenciesSet);

      const items: SetTopupCurrenciesDto = {
         opId,
         currencies: uniqueCurrencies,
      };
      if (currentBrandId !== 'All Brands') {
         items.brandId = currentBrandId;
      }
      handleSubmitMethods(items);
   };

   const handleSubmitBetDBConnection = React.useCallback(
      (dto: SetBetDbConfigDto) => {
         mutateBetConfig({ dto: dto });
      },
      [mutateBetConfig]
   );

   React.useEffect(() => {
      if (dataLimit) {
         const currencies =
            (dataLimit.minStakeByCurrency &&
               Object.keys(dataLimit.minStakeByCurrency)) ||
            [];
         const dataRows =
            currencies &&
            currencies.map(
               (obj: string) => ({
                  id: randomId(),
                  currency: obj,
                  minStack:
                     dataLimit?.minStakeByCurrency &&
                     dataLimit?.minStakeByCurrency[obj],
                  maxStack:
                     dataLimit?.maxStakeByCurrency &&
                     dataLimit?.maxStakeByCurrency[obj],
                  maxWinAmount:
                     dataLimit?.maxWinAmountByCurrency &&
                     dataLimit?.maxWinAmountByCurrency[obj],
                  defaultBetAmount:
                     dataLimit?.defaultBetAmountByCurrency &&
                     dataLimit?.defaultBetAmountByCurrency[obj],
               }),
               []
            );

         setRows(dataRows as RowsCellPropsLimit[]);
      }
   }, [dataLimit]);

   useEffect(() => {
      setWebhookBaseURL(webhookOperator);
   }, [webhookOperator]);

   useEffect(() => {
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_BET_DB_CONFIG_REQ
         )
      ) {
         boClient?.operator.getBetDbConfig(
            { opId: id },
            {
               uuid: uuidv4(),
               meta: {
                  type: 'details',
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_BET_DB_CONFIG_REQ,
               },
            }
         );
      }
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_API_AUTHORIZATION_TOKEN_REQ
         )
      ) {
         boClient?.operator.getApiAuthorizationToken(
            { opId: id },
            {
               uuid: uuidv4(),
               meta: {
                  type: 'details',
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_API_AUTHORIZATION_TOKEN_REQ,
               },
            }
         );
      }
   }, [id]);

   useEffect(() => {
      if (!ignore) {
         store.dispatch(saveLoadingPaymentsGateway(true));
         store.dispatch(savePaymentsGateway([]));
         store.dispatch(saveOperatorBetConfigData({}));
         store.dispatch(saveOperatorGamesV2List([]));
         store.dispatch(saveOperatorGamesList([]));
         store.dispatch(saveUsersList([]));
         store.dispatch(saveLoadingOperatorGamesList(true));
         store.dispatch(saveLoadingOperatorGamesV2List(true));
         setValue(handleTabValue());
         if (
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GET_OPERATOR_DEFAULT_BET_AMOUNT_LIMITS_REQ
            )
         ) {
            boClient?.operator.getOperatorDefaultBetAmountLimits(
               {},
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_DEFAULT_BET_AMOUNT_LIMITS_REQ,
                  },
               }
            );
         }
         setTimeout(() => {
            setIgnore(true);
         }, 500);
      }
   });

   return (
      <React.Fragment>
         <Helmet title="iMoon | Operator Details" />
         <CustomOperatorsBrandsToolbar
            title={'Operator Details'}
            background={
               isDesktop
                  ? theme.palette.secondary.dark
                  : theme.palette.primary.main
            }
            actions={
               <>
                  {value === OperatorDetailsTabs.GAMES &&
                     gamesSelected.length > 0 &&
                     hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_OPERATOR_SET_GAMES_STATUS_REQ
                     ) && (
                        <>
                           <Grid item>
                              <Button
                                 color="info"
                                 variant="contained"
                                 onClick={() =>
                                    handleSubmitGameStatus({
                                       opId: id,
                                       gameStatus: GameStatus.ACTIVE,
                                       gameIds: gamesSelected,
                                    })
                                 }
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
                                 {' '}
                                 Enable
                              </Button>
                           </Grid>
                           <Grid item>
                              <Button
                                 color="secondary"
                                 variant="outlined"
                                 sx={{
                                    color: darkPurple[10],
                                    borderColor: darkPurple[10],
                                    padding: '4px 8px',
                                    letterSpacing: '0.48px',
                                    gap: '2px',
                                    height: '28px',
                                 }}
                                 onClick={() =>
                                    handleSubmitGameStatus({
                                       opId: id,
                                       gameStatus: GameStatus.DISABLED,
                                       gameIds: gamesSelected,
                                    })
                                 }
                              >
                                 {' '}
                                 Disable
                              </Button>
                           </Grid>
                        </>
                     )}
                  {value === OperatorDetailsTabs.GAMESV2 &&
                     gamesV2Selected.length > 0 &&
                     hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_OPERATOR_SET_GAMES_V2_STATUS_REQ
                     ) && (
                        <>
                           <Grid item>
                              <Button
                                 color="info"
                                 variant="contained"
                                 onClick={() =>
                                    handleSubmitGameV2Status({
                                       opId: id,
                                       status: OperatorGameStatus.ACTIVE,
                                       gameIds: gamesV2Selected,
                                    })
                                 }
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
                                 {' '}
                                 Enable
                              </Button>
                           </Grid>
                           <Grid item>
                              <Button
                                 color="secondary"
                                 variant="outlined"
                                 sx={{
                                    color: darkPurple[10],
                                    borderColor: darkPurple[10],
                                    padding: '4px 8px',
                                    letterSpacing: '0.48px',
                                    gap: '2px',
                                    height: '28px',
                                 }}
                                 onClick={() =>
                                    handleSubmitGameV2Status({
                                       opId: id,
                                       status: OperatorGameStatus.DISABLED,
                                       gameIds: gamesV2Selected,
                                    })
                                 }
                              >
                                 {' '}
                                 Disable
                              </Button>
                           </Grid>
                        </>
                     )}
                  {value === OperatorDetailsTabs.GAMES &&
                     gamesSelected.length === 0 &&
                     hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_OPERATOR_ADD_ALL_GAMES_TO_OPERATOR_REQ
                     ) && (
                        <Grid item>
                           <Button
                              onClick={() => handleSubmitAddGames({ opId: id })}
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
                              <FontAwesomeIcon
                                 icon={faAdd as IconProp}
                                 fixedWidth
                                 fontSize={12}
                                 height={'initial'}
                                 width={'12px'}
                              />{' '}
                              Add All Games
                           </Button>
                        </Grid>
                     )}
                  {value === OperatorDetailsTabs.GAMESV2 &&
                     gamesV2Selected.length === 0 &&
                     hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_OPERATOR_ADD_ALL_GAMES_V2_TO_OPERATOR_REQ
                     ) && (
                        <Grid item>
                           <Button
                              onClick={() =>
                                 handleSubmitAddGamesV2({ opId: id })
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
                              <FontAwesomeIcon
                                 icon={faAdd as IconProp}
                                 fixedWidth
                                 fontSize={12}
                                 height={'initial'}
                                 width={'12px'}
                              />{' '}
                              Add All Games
                           </Button>
                        </Grid>
                     )}
                  {hasDetailsPermission(
                     UserPermissionEvent.BACKOFFICE_LOCK_OPERATOR_REQ
                  ) && (
                     <Grid item>
                        <Button
                           onClick={() =>
                              handlelockOperator({
                                 opId: dataOperator.opId,
                                 lock: !dataOperator?.isLocked,
                              })
                           }
                           color="info"
                           variant="contained"
                           sx={{
                              '&:hover': {
                                 background: '#8098F9',
                              },
                              borderRadius: '8px',
                              padding: '4px 8px',
                              letterSpacing: '0.48px',
                              gap: '2px',
                              height: '28px',
                           }}
                        >
                           {dataOperator?.isLocked
                              ? 'Unlock operator'
                              : 'Lock operator'}
                        </Button>
                     </Grid>
                  )}
                  {hasDetailsPermission(
                     UserPermissionEvent.BACKOFFICE_EDIT_OPERATOR_BRANDS_REQ
                  ) &&
                     value === OperatorDetailsTabs.EDITBRANDS && (
                        <Grid item>
                           <Button
                              onClick={() => handleClickOpen()}
                              color="info"
                              variant="contained"
                              sx={{
                                 fontSize: 12,
                                 fontFamily: 'Nunito Sans SemiBold',
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
                              <FontAwesomeIcon
                                 icon={faAdd as IconProp}
                                 fixedWidth
                                 fontSize={12}
                                 height={'initial'}
                                 width={'12px'}
                              />{' '}
                              New Brand
                           </Button>
                        </Grid>
                     )}
                  {hasDetailsPermission(
                     UserPermissionEvent.BACKOFFICE_SET_OPERATOR_BET_AMOUNT_LIMITS_REQ
                  ) &&
                     value === OperatorDetailsTabs.EDITLIMITS && (
                        <Grid item>
                           <Button
                              onClick={handleOpenEditLimit}
                              color="info"
                              variant="contained"
                              sx={{
                                 fontSize: 12,
                                 fontFamily: 'Nunito Sans SemiBold',
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
                              <FontAwesomeIcon
                                 icon={faAdd as IconProp}
                                 fixedWidth
                                 fontSize={12}
                                 height={'initial'}
                                 width={'12px'}
                              />{' '}
                              New Currency
                           </Button>
                        </Grid>
                     )}
                  {hasDetailsPermission(
                     UserPermissionEvent.BACKOFFICE_SET_TOPUP_CURRENCIES_REQ
                  ) &&
                     value === OperatorDetailsTabs.TOPUP_CURRENCIES && (
                        <Grid item>
                           <Button
                              onClick={handleOpenEditTopUp}
                              color="info"
                              variant="contained"
                              sx={{
                                 fontSize: 12,
                                 fontFamily: 'Nunito Sans SemiBold',
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
                              <FontAwesomeIcon
                                 icon={faAdd as IconProp}
                                 fixedWidth
                                 fontSize={12}
                                 height={'initial'}
                                 width={'12px'}
                              />{' '}
                              New Currency
                           </Button>
                        </Grid>
                     )}
               </>
            }
         />
         {id && ignore && dataOperator ? (
            <>
               <Grid
                  container
                  alignItems="center"
                  p={2}
                  px={isLgUp ? '12px' : '4px'}
                  spacing={2}
                  sx={{
                     background: isDesktop ? 'initial' : darkPurple[4],
                  }}
               >
                  <Grid item>
                     {dataOperator && (
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
                              </Stack>
                           </Grid>
                           <Grid
                              item
                              textAlign={'center'}
                              p={1}
                              justifyContent={'center'}
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
                                 }}
                              >
                                 {dataOperator?.opId && (
                                    <Grid item xs={6} pt={0}>
                                       <Box
                                          mb={0}
                                          borderRadius={8}
                                          display={'inline-flex'}
                                          gap={2}
                                          width={'100%'}
                                          justifyContent={'center'}
                                       >
                                          <PortalCopyValue
                                             title={' Operator ID:'}
                                             value={dataOperator.opId}
                                             isVisible={true}
                                             sx={{
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
                                             whiteSpace={'nowrap'}
                                          />
                                       </Box>
                                    </Grid>
                                 )}
                                 {dataOperator.title && (
                                    <Grid item xs={6} pt={0}>
                                       <Box
                                          mb={0}
                                          borderRadius={8}
                                          display={'inline-flex'}
                                          gap={2}
                                          width={'100%'}
                                          justifyContent={'center'}
                                       >
                                          <PortalCopyValue
                                             title={' Operator Title:'}
                                             value={dataOperator.title}
                                             isVisible={true}
                                             sx={{
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
                                             whiteSpace={'nowrap'}
                                          />
                                       </Box>
                                    </Grid>
                                 )}
                                 <Grid item sm={12} xs={12} pt={0}>
                                    <Box
                                       mb={0}
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
                                          {moment(
                                             dataOperator?.updatedAt
                                          ).fromNow()}
                                       </Typography>
                                    </Box>
                                 </Grid>
                              </Grid>
                           </Grid>
                        </Grid>
                     )}
                  </Grid>
                  <Grid item xs></Grid>
               </Grid>
               <Grid
                  item
                  xs={12}
                  px={isDesktop ? '12px' : '4px'}
                  sx={{
                     '.MuiTabPanel-root': {
                        padding: '8px 0px',
                        '.dataGridWrapper': {
                           marginLeft: isDesktop ? '-12px' : 0,
                           height: PageWithdetails4Toolbar,
                        },
                     },
                  }}
               >
                  <TabContext value={value}>
                     <TabList
                        className="detail_tabs"
                        onChange={handleChangeTabs}
                        variant="scrollable"
                        scrollButtons={true}
                        sx={{
                           mb: '6px',
                           pt: isDesktop ? 0 : '6px',
                           justifyContent: isDesktop ? 'left' : 'center',
                        }}
                        aria-label="lab API tabs example"
                     >
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_OPERATOR_GAME_LIST_REQ
                        ) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Games
                                 </Typography>
                              }
                              value={OperatorDetailsTabs.GAMES}
                           />
                        )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_OPERATOR_GAME_V2_LIST_REQ
                        ) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Games V2
                                 </Typography>
                              }
                              value={OperatorDetailsTabs.GAMESV2}
                           />
                        )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_OPERATOR_CONFIG_REQ
                        ) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    OP Configs
                                 </Typography>
                              }
                              value={OperatorDetailsTabs.OPCONFIGS}
                           />
                        )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_OPERATOR_CONFIG_REQ
                        ) &&
                           user?.scope === UserScope.SUPERADMIN && (
                              <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       OP Configs JSON
                                    </Typography>
                                 }
                                 value={OperatorDetailsTabs.OPCONFIGSJSON}
                              />
                           )}
                        {dataOperator?.integrationType ===
                           IntegrationType.ALIEN_STANDALONE &&
                           hasDetailsPermission(
                              UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ
                           ) && (
                              <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       Edit Brands
                                    </Typography>
                                 }
                                 value={OperatorDetailsTabs.EDITBRANDS}
                              />
                           )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BET_AMOUNT_LIMITS_REQ
                        ) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Edit Limits
                                 </Typography>
                              }
                              value={OperatorDetailsTabs.EDITLIMITS}
                           />
                        )}
                        {dataOperator?.integrationType ===
                           IntegrationType.ALIEN_STANDALONE &&
                           hasDetailsPermission(
                              UserPermissionEvent.BACKOFFICE_GET_PAYMENT_GATEWAYS_REQ
                           ) && (
                              <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       Payment Gateways
                                    </Typography>
                                 }
                                 value={OperatorDetailsTabs.PAYMENT_GATEWAYS}
                              />
                           )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_TOPUP_CURRENCIES_REQ
                        ) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Top up Currencies
                                 </Typography>
                              }
                              value={OperatorDetailsTabs.TOPUP_CURRENCIES}
                           />
                        )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_OPERATOR_WEBHOOK_BASE_URL_REQ
                        ) &&
                           dataOperator?.integrationType !==
                              IntegrationType.ALIEN_STANDALONE && (
                              <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       Webhook Base URL
                                    </Typography>
                                 }
                                 value={OperatorDetailsTabs.WEBHOOK_BASE_URL}
                              />
                           )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_USER_LIST_REQ
                        ) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Users
                                 </Typography>
                              }
                              value={OperatorDetailsTabs.USERS}
                           />
                        )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_BET_DB_CONFIG_REQ
                        ) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Bet DB Config
                                 </Typography>
                              }
                              value={OperatorDetailsTabs.BET_DB_CONFIG}
                           />
                        )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_API_AUTHORIZATION_TOKEN_REQ
                        ) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    API Authorization Token
                                 </Typography>
                              }
                              value={
                                 OperatorDetailsTabs.API_AUTHORIZATION_TOKEN
                              }
                           />
                        )}
                     </TabList>
                     <TabPanel value={OperatorDetailsTabs.USERS}>
                        <AllUsers opId={id} />
                     </TabPanel>
                     <TabPanel value={OperatorDetailsTabs.GAMES}>
                        <OperatorGames
                           opId={id}
                           key={refreshData}
                           updateGrid={updateGrid}
                        />
                     </TabPanel>
                     <TabPanel value={OperatorDetailsTabs.GAMESV2}>
                        {/* <Grid container alignItems="center" spacing={2} mb={2}>
                           <Grid item xs />
                           {hasDetailsPermission(
                              UserPermissionEvent.BACKOFFICE_OPERATOR_ADD_ALIEN_CRASH_GAME_V2_REQ
                           ) && (
                              <Grid
                                 item
                                 mr={2}
                                 xs={12}
                                 md={'auto'}
                                 sx={{
                                    width: matches ? 'initial' : '100%',
                                    svg: { mr: 2 },
                                 }}
                              >
                                 <Button
                                    color="primary"
                                    variant="contained"
                                    fullWidth
                                    onClick={() => {
                                       setTransition(TransitionSlide)
                                       setInitForm(initForm + 1)
                                       setOpenAddGame(true)
                                    }}
                                 >
                                    <Add /> New Game
                                 </Button>
                              </Grid>
                           )}
                        </Grid> */}
                        <OperatorGamesV2
                           opId={id}
                           key={refreshData}
                           updateGrid={updateGridV2}
                        />
                     </TabPanel>
                     <TabPanel value={OperatorDetailsTabs.OPCONFIGS}>
                        <OperatorConfigs
                           id={id}
                           disabled={dataOperator?.isLocked}
                        />
                     </TabPanel>
                     <TabPanel
                        value={OperatorDetailsTabs.OPCONFIGSJSON}
                        sx={{ padding: '8px 0px' }}
                     >
                        <OperatorJsonConfigs
                           id={id}
                           disabled={dataOperator?.isLocked}
                        />
                     </TabPanel>
                     {dataOperator?.integrationType ===
                        IntegrationType.ALIEN_STANDALONE && (
                        <TabPanel
                           value={OperatorDetailsTabs.EDITBRANDS}
                           sx={{ padding: '8px 0px' }}
                        >
                           <EditBrandsData
                              id={id}
                              detail={true}
                              sx={{
                                 paddingTop: '0 !important',
                              }}
                           />
                        </TabPanel>
                     )}
                     <TabPanel
                        value={OperatorDetailsTabs.EDITLIMITS}
                        sx={{ padding: '8px 0px' }}
                     >
                        <EditLimitsData id={id} />
                     </TabPanel>
                     {dataOperator?.integrationType ===
                        IntegrationType.ALIEN_STANDALONE && (
                        <TabPanel
                           value={OperatorDetailsTabs.PAYMENT_GATEWAYS}
                           sx={{ padding: '8px 0px' }}
                        >
                           <ActivePaymentGatewayData key={'list'} opId={id} />
                        </TabPanel>
                     )}
                     <TabPanel
                        value={OperatorDetailsTabs.TOPUP_CURRENCIES}
                        sx={{ padding: '8px 0px' }}
                     >
                        <TopUpCurrenciesData opId={id} />
                     </TabPanel>
                     <TabPanel
                        value={OperatorDetailsTabs.WEBHOOK_BASE_URL}
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
                              <FormControl variant="standard" fullWidth>
                                 <TextField
                                    name="webhookBaseURL"
                                    label="Webhook Base URL"
                                    disabled={
                                       !hasDetailsPermission(
                                          UserPermissionEvent.BACKOFFICE_SET_OPERATOR_WEBHOOK_BASE_URL_REQ
                                       )
                                    }
                                    onChange={(e) =>
                                       setWebhookBaseURL(e.target.value)
                                    }
                                    value={webhookBaseURL}
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 5 }}
                                 />
                              </FormControl>
                              {hasDetailsPermission(
                                 UserPermissionEvent.BACKOFFICE_SET_OPERATOR_WEBHOOK_BASE_URL_REQ
                              ) && (
                                 <DialogActions
                                    sx={{ justifyContent: 'center' }}
                                 >
                                    <Button
                                       onClick={() =>
                                          setWebhookBaseURL(
                                             webhookOperator || ''
                                          )
                                       }
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
                                       onClick={webhookBaseURLHandle}
                                    >
                                       Save
                                    </Button>
                                 </DialogActions>
                              )}
                           </CardContent>
                        </Card>
                     </TabPanel>
                     <TabPanel
                        value={OperatorDetailsTabs.BET_DB_CONFIG}
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
                              {isLoadingBetOperatorConfig ? (
                                 <CustomLoader />
                              ) : (
                                 <Formik
                                    key={refreshData}
                                    initialValues={{
                                       opId: id,
                                       betDbConnectionString:
                                          betOperatorConfig?.connectionString,
                                       betDbName: betOperatorConfig?.dbName,
                                    }}
                                    enableReinitialize={true}
                                    validationSchema={Yup.object().shape({
                                       // betDbConnectionString:
                                       //    Yup.string().required(
                                       //       'Bet DB Config  is required'
                                       //    ),
                                       // betDbName: Yup.string().required(
                                       //    'Bet DB Name  is required'
                                       // ),
                                    })}
                                    onSubmit={handleSubmitBetDBConnection}
                                 >
                                    {({
                                       errors,
                                       handleBlur,
                                       handleChange,
                                       handleSubmit,
                                       isSubmitting,
                                       touched,
                                       values,
                                       status,
                                    }) => (
                                       <form noValidate onSubmit={handleSubmit}>
                                          <TextField
                                             name="betDbConnectionString"
                                             label="Connection String"
                                             value={
                                                values.betDbConnectionString
                                             }
                                             error={Boolean(
                                                touched.betDbConnectionString &&
                                                   errors.betDbConnectionString
                                             )}
                                             disabled={
                                                !hasDetailsPermission(
                                                   UserPermissionEvent.BACKOFFICE_SET_BET_DB_CONFIG_REQ
                                                )
                                             }
                                             fullWidth
                                             helperText={
                                                touched.betDbConnectionString &&
                                                errors.betDbConnectionString
                                             }
                                             onBlur={handleBlur}
                                             onChange={handleChange}
                                             variant="outlined"
                                          />
                                          <TextField
                                             name="betDbName"
                                             label="Name"
                                             disabled={
                                                !hasDetailsPermission(
                                                   UserPermissionEvent.BACKOFFICE_SET_BET_DB_CONFIG_REQ
                                                )
                                             }
                                             value={values.betDbName}
                                             error={Boolean(
                                                touched.betDbName &&
                                                   errors.betDbName
                                             )}
                                             fullWidth
                                             helperText={
                                                touched.betDbName &&
                                                errors.betDbName
                                             }
                                             onBlur={handleBlur}
                                             onChange={handleChange}
                                             variant="outlined"
                                          />
                                          {hasDetailsPermission(
                                             UserPermissionEvent.BACKOFFICE_SET_BET_DB_CONFIG_REQ
                                          ) && (
                                             <DialogActions>
                                                <Button
                                                   onClick={() =>
                                                      boClient?.operator.getBetDbConfig(
                                                         { opId: id },
                                                         {
                                                            uuid: uuidv4(),
                                                            meta: {
                                                               type: 'details',
                                                               ts: new Date(),
                                                               sessionId:
                                                                  sessionStorage.getItem(
                                                                     'sessionId'
                                                                  ),
                                                               event: UserPermissionEvent.BACKOFFICE_GET_BET_DB_CONFIG_REQ,
                                                            },
                                                         }
                                                      )
                                                   }
                                                   color="secondary"
                                                   variant="outlined"
                                                   sx={{
                                                      height: 32,
                                                      borderColor:
                                                         darkPurple[10],
                                                   }}
                                                >
                                                   Cancel
                                                </Button>
                                                <Button
                                                   type="submit"
                                                   color="secondary"
                                                   variant="contained"
                                                   sx={{ height: 32 }}
                                                >
                                                   Save
                                                </Button>
                                             </DialogActions>
                                          )}
                                       </form>
                                    )}
                                 </Formik>
                              )}
                           </CardContent>
                        </Card>
                     </TabPanel>
                     <TabPanel
                        value={OperatorDetailsTabs.API_AUTHORIZATION_TOKEN}
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
                           <CardContent
                              sx={{ pb: '24px !important', p: '24px' }}
                           >
                              <Grid container>
                                 <Grid item mr={1}>
                                    <Typography
                                       variant="bodySmallBold"
                                       sx={{ fontFamily: 'Nunito Sans Bold' }}
                                    >
                                       API Authorization Token :
                                    </Typography>
                                 </Grid>
                                 <Grid item>
                                    <PortalCopyValue
                                       value={apiAuthorizationToken}
                                       isVisible={true}
                                    />
                                 </Grid>
                              </Grid>
                              {/* <TextField
                                 name="api_authorization_token"
                                 label="API Authorization Token"
                                 value={apiAuthorizationToken}
                                 disabled={true}
                                 fullWidth
                                 variant="outlined"
                              /> */}
                           </CardContent>
                        </Card>
                     </TabPanel>
                  </TabContext>
               </Grid>
               {/* <Dialog
                  open={openAddGame}
                  fullScreen
                  TransitionComponent={Transition}
                  keepMounted
                  sx={{
                     '.MuiDialog-container': {
                        alignItems: 'end',
                        justifyContent: 'end',
                     },
                     '.MuiPaper-root': {
                        width: '600px',
                        padding: '25px',
                     },
                     '.errorInput': {
                        color: (props) => props.palette.error.main,
                        ml: '14px',
                        fontSize: '0.75rem',
                     },
                  }}
               >
                  <Typography variant="h3" gutterBottom display="inline">
                     Add new game
                  </Typography>
                  <Formik
                     initialValues={initialValues}
                     enableReinitialize={true}
                     key={initForm}
                     validationSchema={Yup.object().shape({
                        opId: Yup.string().required('opId is required'),
                        gameId: Yup.string().required('gameId is required'),
                        status: Yup.string().required('status is required'),
                        skinConfig_skinId: Yup.string().required(
                           'Skin Id is required'
                        ),
                        UIConfig_gameInfoUrl: Yup.string().required(
                           'Game Info Url  is required'
                        ),
                        defaultStakeConfigs_minStake: Yup.number().required(
                           'Min Stake  is required'
                        ),
                        defaultStakeConfigs_maxStake: Yup.number().required(
                           'Max Stake  is required'
                        ),
                        defaultStakeConfigs_maxWinAmount: Yup.number().required(
                           'Max Win Amount  is required'
                        ),
                        defaultStakeConfigs_defaultBetAmount:
                           Yup.number().required(
                              'Default Bet Amount  is required'
                           ),
                        alienCrashGameSpecificConfig_gamePlayURL:
                           Yup.string().required('Game Play URL  is required'),
                        stakeConfigsByCurrencies: Yup.array()
                           .required('stake Configs By Currencies is required')
                           .min(
                              1,
                              'stake Configs By Currencies should have at least one currency'
                           ),
                     })}
                     onSubmit={() => {}}
                  >
                     {({
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values,
                        status,
                        setFieldValue,
                     }) => (
                        <form noValidate onSubmit={handleSubmit}>
                           <Box sx={{ flexGrow: 1, paddingTop: 0 }} mt={5}>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                 }}
                              >
                                 <Autocomplete
                                    options={validGames.map(
                                       (item) => item.gameId
                                    )}
                                    sx={{
                                       width: '100%',
                                       mb: 3,
                                    }}
                                    value={values.gameId}
                                    onChange={(e, selectedGame) => {
                                       // Use Formik's setFieldValue to update the 'languages' field
                                       setFieldValue('gameId', selectedGame)
                                    }}
                                    renderInput={(params) => (
                                       <TextField
                                          {...params}
                                          label="game Id"
                                          variant="outlined"
                                          name="gameId"
                                          fullWidth
                                       />
                                    )}
                                 />
                              </FormControl>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                 }}
                              >
                                 <Autocomplete
                                    options={Object.values(OperatorGameStatus)}
                                    sx={{
                                       width: '100%',
                                       mb: 3,
                                    }}
                                    value={values.status}
                                    onChange={(e, selectedStatus) => {
                                       // Use Formik's setFieldValue to update the 'languages' field
                                       setFieldValue('status', selectedStatus)
                                    }}
                                    renderInput={(params) => (
                                       <TextField
                                          {...params}
                                          label="Status"
                                          variant="outlined"
                                          name="status"
                                          fullWidth
                                       />
                                    )}
                                 />
                              </FormControl>
                              <Box
                                 sx={{
                                    height: 'auto',
                                    '.cm-editor': {
                                       width: '100%',
                                    },
                                    '.MuiPaper-root': {
                                       p: '0  !important',
                                       width: '100% !important',
                                       '.MuiAccordionSummary-content': {
                                          m: '0  !important',
                                       },
                                    },
                                 }}
                              >
                                 <Accordion
                                    expanded={expanded === 'panelChatConfig'}
                                    onChange={handleChangePannel(
                                       'panelChatConfig'
                                    )}
                                 >
                                    <AccordionSummary
                                       expandIcon={<ExpandMoreIcon />}
                                    >
                                       <Typography variant="h6">
                                          Chat Config
                                       </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                       <FormControl
                                          variant="standard"
                                          fullWidth
                                       >
                                          <FormGroup
                                             sx={{ width: 'fit-content' }}
                                          >
                                             <Field
                                                type="checkbox"
                                                name="chatConfig_IsEnable"
                                                value={
                                                   values.chatConfig_IsEnable
                                                }
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.chatConfig_IsEnable
                                                      }
                                                   />
                                                }
                                                label={'Enable'}
                                             />
                                          </FormGroup>
                                       </FormControl>
                                    </AccordionDetails>
                                 </Accordion>
                                 <Accordion
                                    expanded={
                                       expanded === 'panelTournamentConfig'
                                    }
                                    onChange={handleChangePannel(
                                       'panelTournamentConfig'
                                    )}
                                 >
                                    <AccordionSummary
                                       expandIcon={<ExpandMoreIcon />}
                                    >
                                       <Typography variant="h6">
                                          Tournament Config
                                       </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                       <TextField
                                          name="TournamentConfig_statsFileUrl"
                                          label="Stats File Url"
                                          value={
                                             values.TournamentConfig_statsFileUrl
                                          }
                                          error={Boolean(
                                             touched.TournamentConfig_statsFileUrl &&
                                                errors.TournamentConfig_statsFileUrl
                                          )}
                                          fullWidth
                                          helperText={
                                             touched.TournamentConfig_statsFileUrl &&
                                             errors.TournamentConfig_statsFileUrl
                                          }
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          variant="outlined"
                                          sx={{ mb: 3 }}
                                       />
                                       <FormControl
                                          variant="standard"
                                          fullWidth
                                       >
                                          <FormGroup
                                             sx={{ width: 'fit-content' }}
                                          >
                                             <Field
                                                type="checkbox"
                                                name="tournamentConfig_IsEnable"
                                                value={
                                                   values.tournamentConfig_IsEnable
                                                }
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.tournamentConfig_IsEnable
                                                      }
                                                   />
                                                }
                                                label={'Enable'}
                                             />
                                          </FormGroup>
                                       </FormControl>
                                    </AccordionDetails>
                                 </Accordion>
                                 <Accordion
                                    expanded={
                                       expanded === 'panelLanguageConfig'
                                    }
                                    onChange={handleChangePannel(
                                       'panelLanguageConfig'
                                    )}
                                 >
                                    <AccordionSummary
                                       expandIcon={<ExpandMoreIcon />}
                                    >
                                       <Typography variant="h6">
                                          Language Config
                                       </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                       <TextField
                                          name="languageConfig_dictionaryUrl"
                                          label="Dictionary Url"
                                          value={
                                             values.languageConfig_dictionaryUrl
                                          }
                                          error={Boolean(
                                             touched.languageConfig_dictionaryUrl &&
                                                errors.languageConfig_dictionaryUrl
                                          )}
                                          fullWidth
                                          helperText={
                                             touched.languageConfig_dictionaryUrl &&
                                             errors.languageConfig_dictionaryUrl
                                          }
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          variant="outlined"
                                          sx={{ mb: 3 }}
                                       />
                                    </AccordionDetails>
                                 </Accordion>
                                 <Accordion
                                    expanded={expanded === 'panelSkinConfig'}
                                    onChange={handleChangePannel(
                                       'panelSkinConfig'
                                    )}
                                    sx={{
                                       border: (props) =>
                                          errors.skinConfig_skinId
                                             ? `1px solid ${props.palette.error.main}`
                                             : 'none',
                                    }}
                                 >
                                    <AccordionSummary
                                       expandIcon={<ExpandMoreIcon />}
                                    >
                                       <Typography variant="h6">
                                          Skin Config
                                       </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                       <TextField
                                          name="skinConfig_skinId"
                                          label="Skin Id"
                                          value={values.skinConfig_skinId}
                                          error={Boolean(
                                             touched.skinConfig_skinId &&
                                                errors.skinConfig_skinId
                                          )}
                                          fullWidth
                                          helperText={
                                             touched.skinConfig_skinId &&
                                             errors.skinConfig_skinId
                                          }
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          variant="outlined"
                                          sx={{ mb: 3 }}
                                       />
                                       <Typography variant="headLine">
                                          Extra Data
                                       </Typography>
                                       <JSONEditor
                                          editable={true}
                                          data={values.skinConfig_extraData}
                                          setExtraData={(data: any) =>
                                             setExtraDataSkin(data)
                                          }
                                          setExtraDataError={(data: any) =>
                                             setExtraDataErrorSkin(data)
                                          }
                                       />
                                    </AccordionDetails>
                                 </Accordion>
                                 {touched.skinConfig_skinId &&
                                    errors.skinConfig_skinId && (
                                       <ErrorMessage
                                          name={'skinConfig_skinId'}
                                          component={Typography}
                                          className="errorInput"
                                       />
                                    )}
                                 <Accordion
                                    expanded={expanded === 'panelUIConfig'}
                                    onChange={handleChangePannel(
                                       'panelUIConfig'
                                    )}
                                    sx={{
                                       border: (props) =>
                                          errors.UIConfig_gameInfoUrl
                                             ? `1px solid ${props.palette.error.main}`
                                             : 'none',
                                    }}
                                 >
                                    <AccordionSummary
                                       expandIcon={<ExpandMoreIcon />}
                                    >
                                       <Typography variant="h6">
                                          UI Config
                                       </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                       <TextField
                                          name="UIConfig_gameInfoUrl"
                                          label="Game Info Url"
                                          value={values.UIConfig_gameInfoUrl}
                                          error={Boolean(
                                             touched.UIConfig_gameInfoUrl &&
                                                errors.UIConfig_gameInfoUrl
                                          )}
                                          fullWidth
                                          helperText={
                                             touched.UIConfig_gameInfoUrl &&
                                             errors.UIConfig_gameInfoUrl
                                          }
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          variant="outlined"
                                          sx={{ mb: 3 }}
                                       />
                                       <FormControl
                                          variant="standard"
                                          fullWidth
                                       >
                                          <FormGroup
                                             sx={{ width: 'fit-content' }}
                                          >
                                             <Field
                                                type="checkbox"
                                                name="UIConfig_showGameInfo"
                                                value={
                                                   values.UIConfig_showGameInfo
                                                }
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.UIConfig_showGameInfo
                                                      }
                                                   />
                                                }
                                                label={'Show Game Info'}
                                             />
                                          </FormGroup>
                                       </FormControl>
                                       <FormControl
                                          variant="standard"
                                          fullWidth
                                       >
                                          <FormGroup
                                             sx={{ width: 'fit-content' }}
                                          >
                                             <Field
                                                type="checkbox"
                                                name="UIConfig_showPlayersCount"
                                                value={
                                                   values.UIConfig_showPlayersCount
                                                }
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.UIConfig_showPlayersCount
                                                      }
                                                   />
                                                }
                                                label={'Show Players Count'}
                                             />
                                          </FormGroup>
                                       </FormControl>
                                       <FormControl
                                          variant="standard"
                                          fullWidth
                                       >
                                          <FormGroup
                                             sx={{ width: 'fit-content' }}
                                          >
                                             <Field
                                                type="checkbox"
                                                name="UIConfig_isSoundEnable"
                                                value={
                                                   values.UIConfig_isSoundEnable
                                                }
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.UIConfig_isSoundEnable
                                                      }
                                                   />
                                                }
                                                label={'Sound Enable'}
                                             />
                                          </FormGroup>
                                       </FormControl>
                                       <FormControl
                                          variant="standard"
                                          fullWidth
                                       >
                                          <FormGroup
                                             sx={{ width: 'fit-content' }}
                                          >
                                             <Field
                                                type="checkbox"
                                                name="UIConfig_isTvModeEnable"
                                                value={
                                                   values.UIConfig_isTvModeEnable
                                                }
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.UIConfig_isTvModeEnable
                                                      }
                                                   />
                                                }
                                                label={'Tv Mode Enable'}
                                             />
                                          </FormGroup>
                                       </FormControl>
                                    </AccordionDetails>
                                 </Accordion>
                                 {touched.UIConfig_gameInfoUrl &&
                                    errors.UIConfig_gameInfoUrl && (
                                       <ErrorMessage
                                          name={'UIConfig_gameInfoUrl'}
                                          component={Typography}
                                          className="errorInput"
                                       />
                                    )}
                                 <Accordion
                                    expanded={
                                       expanded === 'panelDefaultStakeConfigs'
                                    }
                                    onChange={handleChangePannel(
                                       'panelDefaultStakeConfigs'
                                    )}
                                 >
                                    <AccordionSummary
                                       expandIcon={<ExpandMoreIcon />}
                                    >
                                       <Typography variant="h6">
                                          Default Stake Configs
                                       </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                       <TextField
                                          name="defaultStakeConfigs_minStake"
                                          label="Min Stake"
                                          value={
                                             values.defaultStakeConfigs_minStake
                                          }
                                          error={Boolean(
                                             touched.defaultStakeConfigs_minStake &&
                                                errors.defaultStakeConfigs_minStake
                                          )}
                                          fullWidth
                                          helperText={
                                             touched.defaultStakeConfigs_minStake &&
                                             errors.defaultStakeConfigs_minStake
                                          }
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          type="number"
                                          variant="outlined"
                                          sx={{ mb: 3 }}
                                       />
                                       <TextField
                                          name="defaultStakeConfigs_maxStake"
                                          label="Max Stake"
                                          value={
                                             values.defaultStakeConfigs_maxStake
                                          }
                                          error={Boolean(
                                             touched.defaultStakeConfigs_maxStake &&
                                                errors.defaultStakeConfigs_maxStake
                                          )}
                                          fullWidth
                                          helperText={
                                             touched.defaultStakeConfigs_maxStake &&
                                             errors.defaultStakeConfigs_maxStake
                                          }
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          type="number"
                                          variant="outlined"
                                          sx={{ mb: 3 }}
                                       />
                                       <TextField
                                          name="defaultStakeConfigs_maxWinAmount"
                                          label="Max Win Amount"
                                          value={
                                             values.defaultStakeConfigs_maxWinAmount
                                          }
                                          error={Boolean(
                                             touched.defaultStakeConfigs_maxWinAmount &&
                                                errors.defaultStakeConfigs_maxWinAmount
                                          )}
                                          fullWidth
                                          helperText={
                                             touched.defaultStakeConfigs_maxWinAmount &&
                                             errors.defaultStakeConfigs_maxWinAmount
                                          }
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          type="number"
                                          variant="outlined"
                                          sx={{ mb: 3 }}
                                       />
                                       <TextField
                                          name="defaultStakeConfigs_defaultBetAmount"
                                          label="Default Bet Amount"
                                          value={
                                             values.defaultStakeConfigs_defaultBetAmount
                                          }
                                          error={Boolean(
                                             touched.defaultStakeConfigs_defaultBetAmount &&
                                                errors.defaultStakeConfigs_defaultBetAmount
                                          )}
                                          fullWidth
                                          helperText={
                                             touched.defaultStakeConfigs_defaultBetAmount &&
                                             errors.defaultStakeConfigs_defaultBetAmount
                                          }
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          type="number"
                                          variant="outlined"
                                          sx={{ mb: 3 }}
                                       />
                                       <StakePresetsCustom
                                          data={
                                             values?.defaultStakeConfigs_stakePresets ||
                                             []
                                          }
                                          setData={handleStakePresetsDefault}
                                          title="Stake Preset"
                                       />
                                    </AccordionDetails>
                                 </Accordion>

                                 <Accordion
                                    expanded={
                                       expanded ===
                                       'panelStakeConfigsByCurrencies'
                                    }
                                    onChange={handleChangePannel(
                                       'panelStakeConfigsByCurrencies'
                                    )}
                                    sx={{
                                       border: (props) =>
                                          errors.stakeConfigsByCurrencies
                                             ? `1px solid ${props.palette.error.main}`
                                             : 'none',
                                    }}
                                 >
                                    <AccordionSummary
                                       expandIcon={<ExpandMoreIcon />}
                                    >
                                       <Typography variant="h6">
                                          Stake Configs By Currencies
                                       </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                       <StakePresetsByCurrenciesCustom
                                          data={
                                             values?.stakeConfigsByCurrencies ||
                                             []
                                          }
                                          setData={handleStakeByCurrency}
                                          title="Stake Config"
                                       />
                                    </AccordionDetails>
                                 </Accordion>
                                 {touched.stakeConfigsByCurrencies &&
                                    errors.stakeConfigsByCurrencies && (
                                       <ErrorMessage
                                          name={'stakeConfigsByCurrencies'}
                                          component={Typography}
                                          className="errorInput"
                                       />
                                    )}
                                 <Accordion
                                    expanded={
                                       expanded ===
                                       'panelAlienCrashGameSpecificConfig'
                                    }
                                    onChange={handleChangePannel(
                                       'panelAlienCrashGameSpecificConfig'
                                    )}
                                    sx={{
                                       border: (props) =>
                                          errors.alienCrashGameSpecificConfig_gamePlayURL
                                             ? `1px solid ${props.palette.error.main}`
                                             : 'none',
                                    }}
                                 >
                                    <AccordionSummary
                                       expandIcon={<ExpandMoreIcon />}
                                    >
                                       <Typography variant="h6">
                                          Alien Crash Game Specific Config
                                       </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                       <TextField
                                          name="alienCrashGameSpecificConfig_gamePlayURL"
                                          label="Game Play URL"
                                          value={
                                             values.alienCrashGameSpecificConfig_gamePlayURL
                                          }
                                          error={Boolean(
                                             touched.alienCrashGameSpecificConfig_gamePlayURL &&
                                                errors.alienCrashGameSpecificConfig_gamePlayURL
                                          )}
                                          fullWidth
                                          helperText={
                                             touched.alienCrashGameSpecificConfig_gamePlayURL &&
                                             errors.alienCrashGameSpecificConfig_gamePlayURL
                                          }
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          variant="outlined"
                                          sx={{ mb: 3 }}
                                       />
                                       <FormControl
                                          variant="standard"
                                          fullWidth
                                       >
                                          <FormGroup
                                             sx={{ width: 'fit-content' }}
                                          >
                                             <Field
                                                type="checkbox"
                                                name="alienCrashGameSpecificConfig_autoCashoutIsEnable"
                                                value={
                                                   values.alienCrashGameSpecificConfig_autoCashoutIsEnable
                                                }
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.alienCrashGameSpecificConfig_autoCashoutIsEnable
                                                      }
                                                   />
                                                }
                                                label={'Auto Cashout Is Enable'}
                                             />
                                          </FormGroup>
                                       </FormControl>
                                       <FormControl
                                          variant="standard"
                                          fullWidth
                                       >
                                          <FormGroup
                                             sx={{ width: 'fit-content' }}
                                          >
                                             <Field
                                                type="checkbox"
                                                name="alienCrashGameSpecificConfig_cancelBetInCurrentRoundIsEnable"
                                                value={
                                                   values.alienCrashGameSpecificConfig_cancelBetInCurrentRoundIsEnable
                                                }
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.alienCrashGameSpecificConfig_cancelBetInCurrentRoundIsEnable
                                                      }
                                                   />
                                                }
                                                label={
                                                   'Cancel Bet In Current Round Is Enable'
                                                }
                                             />
                                          </FormGroup>
                                       </FormControl>
                                       <FormControl
                                          variant="standard"
                                          fullWidth
                                       >
                                          <FormGroup
                                             sx={{ width: 'fit-content' }}
                                          >
                                             <Field
                                                type="checkbox"
                                                name="alienCrashGameSpecificConfig_maintenanceModeIsEnabled"
                                                value={
                                                   values.alienCrashGameSpecificConfig_maintenanceModeIsEnabled
                                                }
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.alienCrashGameSpecificConfig_maintenanceModeIsEnabled
                                                      }
                                                   />
                                                }
                                                label={
                                                   'Maintenance Mode Is Enabled'
                                                }
                                             />
                                          </FormGroup>
                                       </FormControl>
                                       <FormControl
                                          variant="standard"
                                          fullWidth
                                       >
                                          <FormGroup
                                             sx={{ width: 'fit-content' }}
                                          >
                                             <Field
                                                type="checkbox"
                                                name="alienCrashGameSpecificConfig_multiBetIsEnabled"
                                                value={
                                                   values.alienCrashGameSpecificConfig_multiBetIsEnabled
                                                }
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.alienCrashGameSpecificConfig_multiBetIsEnabled
                                                      }
                                                   />
                                                }
                                                label={'multi Bet Is Enabled'}
                                             />
                                          </FormGroup>
                                       </FormControl>
                                       <FormControl
                                          variant="standard"
                                          fullWidth
                                       >
                                          <FormGroup
                                             sx={{ width: 'fit-content' }}
                                          >
                                             <Field
                                                type="checkbox"
                                                name="alienCrashGameSpecificConfig_showPlayersCount"
                                                value={
                                                   values.alienCrashGameSpecificConfig_showPlayersCount
                                                }
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.alienCrashGameSpecificConfig_showPlayersCount
                                                      }
                                                   />
                                                }
                                                label={'Show Players Count'}
                                             />
                                          </FormGroup>
                                       </FormControl>
                                       <FormControl
                                          variant="standard"
                                          fullWidth
                                       >
                                          <FormGroup
                                             sx={{ width: 'fit-content' }}
                                          >
                                             <Field
                                                type="checkbox"
                                                name="alienCrashGameSpecificConfig_showTotalBets"
                                                value={
                                                   values.alienCrashGameSpecificConfig_showTotalBets
                                                }
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.alienCrashGameSpecificConfig_showTotalBets
                                                      }
                                                   />
                                                }
                                                label={'Show Total Bets'}
                                             />
                                          </FormGroup>
                                       </FormControl>
                                       <FormControl
                                          variant="standard"
                                          fullWidth
                                       >
                                          <FormGroup
                                             sx={{ width: 'fit-content' }}
                                          >
                                             <Field
                                                type="checkbox"
                                                name="alienCrashGameSpecificConfig_testMechanismIsEnable"
                                                value={
                                                   values.alienCrashGameSpecificConfig_testMechanismIsEnable
                                                }
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.alienCrashGameSpecificConfig_testMechanismIsEnable
                                                      }
                                                   />
                                                }
                                                label={
                                                   'Test Mechanism Is Enable'
                                                }
                                             />
                                          </FormGroup>
                                       </FormControl>
                                    </AccordionDetails>
                                 </Accordion>
                                 {touched.alienCrashGameSpecificConfig_gamePlayURL &&
                                    errors.alienCrashGameSpecificConfig_gamePlayURL && (
                                       <ErrorMessage
                                          name={
                                             'alienCrashGameSpecificConfig_gamePlayURL'
                                          }
                                          component={Typography}
                                          className="errorInput"
                                       />
                                    )}
                              </Box>
                           </Box>
                           <DialogActions>
                              <Button
                                 onClick={handleCloseNewGame}
                                 color="error"
                              >
                                 Cancel
                              </Button>
                              <Button
                                 type="submit"
                                 color="success"
                                 variant="contained"
                              >
                                 Save
                              </Button>
                           </DialogActions>
                        </form>
                     )}
                  </Formik>
               </Dialog> */}
               <Dialog
                  open={open}
                  fullScreen
                  TransitionComponent={Transition}
                  keepMounted
                  aria-describedby="alert-dialog-slide-description"
                  sx={{
                     '.MuiPaper-root': {
                        p: '12px 4px!important',
                     },
                  }}
               >
                  <Grid
                     container
                     direction="row"
                     alignItems="center"
                     p={'4px 8px'}
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
                        <Typography
                           variant="h5"
                           gutterBottom
                           display="inline"
                           mb={0}
                        >
                           Add New Brand
                        </Typography>
                     </Grid>
                     <Grid item xs></Grid>
                     <Grid item>
                        <FontAwesomeIcon
                           icon={faRectangleXmark as IconProp}
                           onClick={handleCloseBrand}
                        />
                     </Grid>
                  </Grid>
                  <DialogContent sx={{ p: 1 }}>
                     <Formik
                        initialValues={initialValuesBrand}
                        enableReinitialize={true}
                        validationSchema={Yup.object().shape({
                           brandId: Yup.string().required(
                              'brand id is required'
                           ),
                        })}
                        onSubmit={handleSubmitBrand}
                     >
                        {({
                           errors,
                           resetForm,
                           handleBlur,
                           handleChange,
                           handleSubmit,
                           isSubmitting,
                           touched,
                           values,
                           status,
                        }) => (
                           <form noValidate onSubmit={handleSubmit}>
                              <TextField
                                 name="brandId"
                                 label="ID"
                                 value={values.brandId}
                                 error={Boolean(
                                    touched.brandId && errors.brandId
                                 )}
                                 fullWidth
                                 helperText={touched.brandId && errors.brandId}
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                              />
                              <TextField
                                 name="brandName"
                                 label="Brand Name"
                                 value={values.brandName}
                                 error={Boolean(
                                    touched.brandName && errors.brandName
                                 )}
                                 fullWidth
                                 helperText={
                                    touched.brandName && errors.brandName
                                 }
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                              />
                              <TextField
                                 name="brandDomain"
                                 label="Brand Domain"
                                 value={values.brandDomain}
                                 error={Boolean(
                                    touched.brandDomain && errors.brandDomain
                                 )}
                                 fullWidth
                                 helperText={
                                    touched.brandDomain && errors.brandDomain
                                 }
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                              />
                              <DialogActions>
                                 <Button
                                    onClick={() => {
                                       handleCloseBrand();
                                       resetForm();
                                    }}
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
                                    type="submit"
                                    color="secondary"
                                    variant="contained"
                                    sx={{ height: 32 }}
                                 >
                                    Save
                                 </Button>
                              </DialogActions>
                           </form>
                        )}
                     </Formik>
                  </DialogContent>
               </Dialog>
               <Dialog
                  open={openEditLimit}
                  fullScreen
                  TransitionComponent={Transition}
                  keepMounted
                  aria-describedby="alert-dialog-slide-description"
                  sx={{
                     '.MuiPaper-root': {
                        p: '12px 4px!important',
                     },
                  }}
               >
                  <Grid
                     container
                     direction="row"
                     alignItems="center"
                     p={'4px 8px'}
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
                        <Typography
                           variant="h5"
                           gutterBottom
                           display="inline"
                           mb={0}
                        >
                           Add new currency
                        </Typography>
                     </Grid>
                     <Grid item xs></Grid>
                     <Grid item>
                        <FontAwesomeIcon
                           icon={faRectangleXmark as IconProp}
                           onClick={handleCloseEditLimit}
                        />
                     </Grid>
                  </Grid>
                  <DialogContent sx={{ p: 1 }}>
                     <Formik
                        initialValues={initialValuesLimit}
                        enableReinitialize={true}
                        validationSchema={Yup.object().shape({
                           currency: Yup.string().required(
                              'Currency is required'
                           ),
                           minStack: Yup.number()
                              .required('Min Stake count is required')
                              .min(0, 'Min Stake should be greater than 0.'),
                           maxStack: Yup.number()
                              .required('Max Stake count is required')
                              .test(
                                 'is-greater-than-minStack',
                                 'Max Stake should be greater than Min Stake',
                                 function (value) {
                                    const { minStack } = this.parent;

                                    if (!minStack || !value) {
                                       return true; // Validation will pass if either date is not provided.
                                    }

                                    if (minStack < value) {
                                       return true;
                                    }

                                    return false; // Validation fails if "to" is not greater than or equal to "from"
                                 }
                              ),
                           maxWinAmount: Yup.number()
                              .required('Max win amount is required')
                              .test(
                                 'is-between-minStack-maxStack',
                                 'Max Win Amount value should be greater or equal than Max Stake.',
                                 function (value) {
                                    const { maxStack } = this.parent;

                                    if (!maxStack || !value) {
                                       return true; // Validation will pass if either date is not provided.
                                    }

                                    if (maxStack <= value) {
                                       return true;
                                    }

                                    return false; // Validation fails if "to" is not greater than or equal to "from"
                                 }
                              ),
                           defaultBetAmount: Yup.number()
                              .required('Default bet amount is required')
                              .test(
                                 'is-between-minStack-maxStack',
                                 'The Default Bet Amount value should be within the range of Min Stake and Max Stake values.',
                                 function (value) {
                                    const { minStack, maxStack } = this.parent;

                                    if (!minStack || !value || !maxStack) {
                                       return true; // Validation will pass if either date is not provided.
                                    }

                                    if (
                                       minStack <= value &&
                                       value <= maxStack
                                    ) {
                                       return true;
                                    }

                                    return false; // Validation fails if "to" is not greater than or equal to "from"
                                 }
                              ),
                        })}
                        onSubmit={(values, { resetForm }) => {
                           handleSubmitEditLimit(values);
                           setTimeout(() => {
                              resetForm();
                           }, 1500);
                        }}
                     >
                        {({
                           errors,
                           resetForm,
                           handleBlur,
                           handleChange,
                           handleSubmit,
                           isSubmitting,
                           touched,
                           values,
                           status,
                           setFieldValue,
                        }) => (
                           <form noValidate onSubmit={handleSubmit}>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                 }}
                              >
                                 <Autocomplete
                                    id={`currency`}
                                    options={
                                       currenciesInit?.map(
                                          (item) => item.currency
                                       ) || []
                                    }
                                    sx={{
                                       width: '100%',
                                       mb: 0,
                                       '.MuiAutocomplete-input': {
                                          cursor: 'pointer',
                                       },
                                    }}
                                    value={values.currency}
                                    onChange={(e, selectedCurrency) => {
                                       if (
                                          selectedCurrency &&
                                          Object.keys(
                                             dataDefaultLimit.minStakeByCurrency
                                          ).includes(selectedCurrency)
                                       ) {
                                          // setInitialValuesLimit({
                                          //    ...initialValuesLimit,
                                          //    currency: selectedCurrency,
                                          //    minStack:
                                          //       dataDefaultLimit
                                          //          .minStakeByCurrency[
                                          //          selectedCurrency
                                          //       ],
                                          // })
                                          setFieldValue(
                                             `minStack`,
                                             dataDefaultLimit
                                                .minStakeByCurrency[
                                                selectedCurrency
                                             ]
                                          );
                                          setFieldValue(
                                             `maxStack`,
                                             dataDefaultLimit
                                                .maxStakeByCurrency[
                                                selectedCurrency
                                             ]
                                          );
                                          setFieldValue(
                                             `maxWinAmount`,
                                             dataDefaultLimit
                                                .maxWinAmountByCurrency[
                                                selectedCurrency
                                             ]
                                          );
                                          if (
                                             dataDefaultLimit.defaultBetAmountByCurrency
                                          ) {
                                             setFieldValue(
                                                `defaultBetAmount`,
                                                dataDefaultLimit
                                                   .defaultBetAmountByCurrency[
                                                   selectedCurrency
                                                ]
                                             );
                                          }
                                       } else {
                                          setFieldValue(`minStack`, 0);
                                          setFieldValue(`maxStack`, 0);
                                          setFieldValue(`maxWinAmount`, 0);
                                          setFieldValue(`defaultBetAmount`, 0);
                                       }
                                       setFieldValue(
                                          `currency`,
                                          selectedCurrency
                                       );
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
                                                   icon={
                                                      faAngleDown as IconProp
                                                   }
                                                   className="selectIcon"
                                                   size="sm"
                                                />
                                             ),
                                          }}
                                       />
                                    )}
                                 />
                              </FormControl>
                              <TextField
                                 name="minStack"
                                 label="Min Stake"
                                 type="number"
                                 value={values.minStack}
                                 onChange={handleChange}
                                 fullWidth
                                 variant="outlined"
                                 error={Boolean(
                                    touched.minStack && errors.minStack
                                 )}
                                 helperText={
                                    touched.minStack && errors.minStack
                                 }
                              />
                              <TextField
                                 name="maxStack"
                                 label="Max Stake"
                                 type="number"
                                 value={values.maxStack}
                                 onChange={handleChange}
                                 error={Boolean(
                                    touched.maxStack && errors.maxStack
                                 )}
                                 helperText={
                                    touched.maxStack && errors.maxStack
                                 }
                                 fullWidth
                                 variant="outlined"
                              />
                              <TextField
                                 name="maxWinAmount"
                                 label="Max Win Amount"
                                 type="number"
                                 value={values.maxWinAmount}
                                 error={Boolean(
                                    touched.maxWinAmount && errors.maxWinAmount
                                 )}
                                 helperText={
                                    touched.maxWinAmount && errors.maxWinAmount
                                 }
                                 onChange={handleChange}
                                 fullWidth
                                 variant="outlined"
                              />
                              <TextField
                                 name="defaultBetAmount"
                                 label="Default Bet Amount"
                                 type="number"
                                 value={values.defaultBetAmount}
                                 error={Boolean(
                                    touched.defaultBetAmount &&
                                       errors.defaultBetAmount
                                 )}
                                 helperText={
                                    touched.defaultBetAmount &&
                                    errors.defaultBetAmount
                                 }
                                 onChange={handleChange}
                                 fullWidth
                                 variant="outlined"
                              />
                              <DialogActions>
                                 <Button
                                    onClick={() => {
                                       handleCloseEditLimit();
                                       resetForm();
                                    }}
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
                                    type="submit"
                                    color="secondary"
                                    variant="contained"
                                    sx={{ height: 32 }}
                                 >
                                    Save
                                 </Button>
                              </DialogActions>
                           </form>
                        )}
                     </Formik>
                  </DialogContent>
               </Dialog>
               <Dialog
                  open={openEditTopUp}
                  fullScreen
                  TransitionComponent={Transition}
                  keepMounted
                  aria-describedby="alert-dialog-slide-description"
                  sx={{
                     '.MuiPaper-root': {
                        p: '12px 4px!important',
                     },
                  }}
               >
                  <Grid
                     container
                     direction="row"
                     alignItems="center"
                     p={'4px 8px'}
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
                        <Typography
                           variant="h5"
                           gutterBottom
                           display="inline"
                           mb={0}
                        >
                           Add top up currency
                        </Typography>
                     </Grid>
                     <Grid item xs></Grid>
                     <Grid item>
                        <FontAwesomeIcon
                           icon={faRectangleXmark as IconProp}
                           onClick={handleCloseEditTopUp}
                        />
                     </Grid>
                  </Grid>
                  <DialogContent sx={{ p: 1 }}>
                     <Formik
                        initialValues={initialValuesTopUp}
                        enableReinitialize={true}
                        validationSchema={Yup.object().shape({
                           currency: Yup.string().required(
                              'Currency is required'
                           ),
                        })}
                        onSubmit={(values, { resetForm }) => {
                           handleSubmitEditTopUp(values);
                           setTimeout(() => {
                              resetForm();
                           }, 1500);
                        }}
                     >
                        {({
                           errors,
                           resetForm,
                           handleBlur,
                           handleChange,
                           handleSubmit,
                           isSubmitting,
                           touched,
                           values,
                           status,
                           setFieldValue,
                        }) => (
                           <form noValidate onSubmit={handleSubmit}>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                 }}
                              >
                                 <Autocomplete
                                    id={`currency`}
                                    options={
                                       currenciesInit?.map(
                                          (item) => item.currency
                                       ) || []
                                    }
                                    sx={{
                                       width: '100%',
                                       mb: 0,
                                       '.MuiAutocomplete-input': {
                                          cursor: 'pointer',
                                       },
                                    }}
                                    value={values.currency}
                                    onChange={(e, selectedCurrency) => {
                                       setFieldValue(
                                          `currency`,
                                          selectedCurrency
                                       );
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
                                                   icon={
                                                      faAngleDown as IconProp
                                                   }
                                                   className="selectIcon"
                                                   size="sm"
                                                />
                                             ),
                                          }}
                                       />
                                    )}
                                 />
                              </FormControl>
                              <DialogActions>
                                 <Button
                                    onClick={() => {
                                       resetForm();
                                       handleCloseEditTopUp();
                                    }}
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
                                    type="submit"
                                    color="secondary"
                                    variant="contained"
                                    sx={{ height: 32 }}
                                 >
                                    Save
                                 </Button>
                              </DialogActions>
                           </form>
                        )}
                     </Formik>
                  </DialogContent>
               </Dialog>
            </>
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   );
}

OperatorDetails.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Operator Details">{page}</DashboardLayout>;
};

export default OperatorDetails;
