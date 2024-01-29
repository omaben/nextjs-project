import CustomLoader from '@/components/custom/CustomLoader';
import PortalCopyValue from '@/components/custom/PortalCopyValue';
import TransitionSlide from '@/components/custom/TransitionSlide';
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar';
import {
   useCreateGameOperatorMutation,
   useCreateGameV2OperatorMutation,
   useSetGameOperatorStatusMutation,
} from '@/components/data/operatorGames/lib/hooks/queries';
import OperatorGames from '@/components/data/operatorGames/operator-games-grid';
import { useSetGameOperatorStatusV2Mutation } from '@/components/data/operatorGamesV2/lib/hooks/queries';
import OperatorGamesV2 from '@/components/data/operatorGamesV2/operator-games-grid';
import OperatorConfigs from '@/components/data/operators/configs';
import EditBrandsData from '@/components/data/operators/edit-brands';
import EditLimitsData from '@/components/data/operators/edit-limits';
import OperatorJsonConfigs from '@/components/data/operators/jsonConfigs';
import {
   useEditOperatorBrandMutation,
   useGetOperatorQuery,
   useGetOperatorWebhookBaseURL,
   useLockedOperatorMutation,
   useSetOperatorConfigMutation,
   useSetWebhookBaseURLMutation,
} from '@/components/data/operators/lib/hooks/queries';
import ActiveOperatorPaymentGatewayData from '@/components/data/payments/active-operator-payments-grid';
import {
   AddAllGamesToOperatorDto,
   Brand,
   EditOperatorBrandsDto,
   GameStatus,
   IntegrationType,
   LockOperatorDto,
   Operator,
   OperatorGameStatus,
   SetOperatorConfigDto,
   SetOperatorGamesStatusDto,
   SetOperatorGamesV2StatusDto,
   SetOperatorWebhookBaseUrlDto,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front';
import { AddAllGamesV2ToOperatorDto } from '@alienbackoffice/back-front/lib/operator/dto/add-all-games-v2-to-operator.dto';
import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAdd, faRectangleXmark } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
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
import { ImoonGray, darkPurple } from 'colors';
import { Formik } from 'formik';
import moment from 'moment';
import type { ReactElement } from 'react';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
   savePaymentsGateway,
   selectAuthBrandsList,
   selectAuthCurrentBrand,
   selectAuthOperator,
   selectAuthOperatorDetails,
   selectAuthUser,
   selectAuthWebhookBaseURL,
} from 'redux/authSlice';
import { saveLoadingPaymentsGateway } from 'redux/loadingSlice';
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
function OperatorConfigDetails() {
   const id = useSelector(selectAuthOperator);
   const theme = useTheme();
   const user: User = useSelector(selectAuthUser);
   const data = useSelector(selectAuthBrandsList) as Brand[];
   const boClient = useSelector(selectBoClient);
   const [value, setValue] = React.useState('');
   const [gamesSelected, setGameSelected] = React.useState([]);
   const [gamesV2Selected, setGameV2Selected] = React.useState([]);
   const [Transition, setTransition]: any = React.useState();
   const [open, setOpen] = React.useState(false);
   const [initialValues, setInitialValues] = React.useState({
      opId: id,
      brandId: '',
      brandName: '',
      brandDomain: '',
   });
   const [refreshData, setRefreshData] = React.useState(0);
   const brandId = useSelector(selectAuthCurrentBrand);
   const webhookOperator = useSelector(selectAuthWebhookBaseURL) as string;
   const [webhookBaseURL, setWebhookBaseURL] = React.useState(webhookOperator);
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
   const [ignore, setIgnore] = React.useState(false);
   const dataOperator = useSelector(selectAuthOperatorDetails) as Operator;

   useGetOperatorQuery({ opId: id, key: 'details' });

   const { mutate } = useCreateGameOperatorMutation({
      onSuccess: () => {
         setRefreshData(refreshData + 1);
      },
      onSettled(data, error, variables, context) {
         if (error) {
         }
      },
   });

   const { mutate: mutateStatus } = useSetGameOperatorStatusMutation({
      onSuccess: () => {},
   });

   const { mutate: mutateJson } = useSetOperatorConfigMutation({
      onSuccess: (data) => {
         toast.success('You Edited Game Operator successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const { mutate: mutateLocked } = useLockedOperatorMutation({
      onSuccess: (data) => {},
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

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

   const { mutate: mutateV2Status } = useSetGameOperatorStatusV2Mutation({
      onSuccess: () => {},
   });

   const { mutate: mutateBrand } = useEditOperatorBrandMutation({
      onSuccess: () => {
         toast.success('You add Successfully operator Brand', {
            position: toast.POSITION.TOP_CENTER,
         });
         boClient?.operator.getOperatorBrands(
            { opId: id },
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

   const handleSubmitAddGames = React.useCallback(
      (dto: AddAllGamesToOperatorDto) => {
         mutate({ dto });
      },
      [mutate]
   );

   const handleSubmitGameStatus = React.useCallback(
      (dto: SetOperatorGamesStatusDto) => {
         mutateStatus({ dto });
      },
      [mutateStatus]
   );

   const updateGrid = (data: any) => {
      setGameSelected(data);
   };

   const updateGridV2 = (data: any) => {
      setGameV2Selected(data);
   };

   const handleSubmit = React.useCallback(
      (dto: SetOperatorConfigDto) => {
         const editData: any = dto;
         delete editData.webhookAuthorizationToken;
         delete editData.databaseConnectionString;
         delete editData.webhookBaseUrl;

         mutateJson({ dto: editData });
      },
      [mutateJson]
   );

   useGetOperatorWebhookBaseURL({
      opId: id,
   });

   const handleSubmitAddBrand = React.useCallback(
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
            opId: id,
            brands: [...data, brand],
         };
         mutateBrand({ dto });
      },
      [mutateBrand, id, data]
   );

   const webhookBaseURLSubmit = React.useCallback(
      (dto: SetOperatorWebhookBaseUrlDto) => {
         mutatWebhookBaseURL({ dto });
      },
      [mutatWebhookBaseURL]
   );

   const webhookBaseURLHandle = () => {
      const post: SetOperatorWebhookBaseUrlDto = {
         opId: dataOperator.opId,
         webhookBaseUrl: webhookBaseURL,
      };
      webhookBaseURLSubmit(post);
   };

   const handlelockOperator = React.useCallback(
      (dto: LockOperatorDto) => {
         mutateLocked({ dto });
      },
      [mutateLocked]
   );

   const handleClickOpen = () => {
      setTransition(TransitionSlide);
      setOpen(true);
      setInitialValues({
         opId: id,
         brandId: '',
         brandName: '',
         brandDomain: '',
      });
   };

   const handleClose = async () => {
      setOpen(false);
      setInitialValues({
         opId: id,
         brandId: '',
         brandName: '',
         brandDomain: '',
      });
   };

   const handleTabValue = () => {
      let valueTab = '';
      switch (true) {
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_OPERATOR_GAME_LIST_REQ
         ):
            valueTab = OperatorDetailsTabs.GAMES;
            break;
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_OPERATOR_GAME_V2_LIST_REQ
         ):
            valueTab = OperatorDetailsTabs.GAMESV2;
            break;
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_OPERATOR_CONFIG_REQ
         ):
            valueTab = OperatorDetailsTabs.OPCONFIGS;
            break;
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_OPERATOR_CONFIG_REQ
         ):
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
         default:
            break;
      }
      return valueTab;
   };

   const handleChangeTabs = (event: React.SyntheticEvent, newValue: string) => {
      event.preventDefault();
      setValue(newValue);
   };

   const handleSubmitGameV2Status = React.useCallback(
      (dto: SetOperatorGamesV2StatusDto) => {
         mutateV2Status({ dto });
      },
      [mutateV2Status]
   );

   const handleSubmitAddGamesV2 = React.useCallback(
      (dto: AddAllGamesV2ToOperatorDto) => {
         mutateV2({ dto });
      },
      [mutateV2]
   );

   useEffect(() => {
      setWebhookBaseURL(webhookOperator);
   }, [webhookOperator]);

   useEffect(() => {
      if (!ignore) {
         store.dispatch(saveLoadingPaymentsGateway(true));
         store.dispatch(savePaymentsGateway([]));
         setValue(handleTabValue());
         setTimeout(() => {
            setIgnore(true);
         }, 500);
      }
   });

   return (
      <React.Fragment>
         <Helmet title="iMoon | Settings" />
         <CustomOperatorsBrandsToolbar
            title={'Settings'}
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
                     gamesSelected.length === 0 &&
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
                              borderRadius: '8px',
                              '&:hover': {
                                 background: '#8098F9',
                              },
                           }}
                        >
                           {dataOperator?.isLocked ? 'Unlock ' : 'Lock '}
                        </Button>
                     </Grid>
                  )}
                  {value === OperatorDetailsTabs.EDITBRANDS &&
                     hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_EDIT_OPERATOR_BRANDS_REQ
                     ) && (
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
                                    '.MuiBox-root .MuiStack-root svg': {
                                       position: 'absolute',
                                       left: '4px',
                                       top: '6px',
                                    },
                                 }}
                              >
                                 {dataOperator.opId && (
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
                                                color: (props) =>
                                                   isDesktop
                                                      ? '#1570EF'
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
                                                color: (props) =>
                                                   isDesktop
                                                      ? '#1570EF'
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
                        sx={{ mb: '6px', pt: isDesktop ? 0 : '6px' }}
                        aria-label="lab API tabs example"
                     >
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_OPERATOR_GET_GAME_REQ
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
                              UserPermissionEvent.BACKOFFICE_GET_ACTIVE_PAYMENT_GATEWAYS_REQ
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
                     </TabList>
                     <TabPanel value={OperatorDetailsTabs.GAMES}>
                        <OperatorGames
                           opId={id}
                           key={refreshData}
                           updateGrid={updateGrid}
                        />
                     </TabPanel>
                     <TabPanel value={OperatorDetailsTabs.GAMESV2}>
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
                     <TabPanel value={OperatorDetailsTabs.OPCONFIGSJSON}>
                        <OperatorJsonConfigs
                           id={id}
                           disabled={dataOperator?.isLocked}
                        />
                     </TabPanel>
                     {dataOperator?.integrationType ===
                        IntegrationType.ALIEN_STANDALONE && (
                        <TabPanel value={OperatorDetailsTabs.EDITBRANDS}>
                           <EditBrandsData id={id} />
                        </TabPanel>
                     )}
                     <TabPanel value={OperatorDetailsTabs.EDITLIMITS}>
                        <EditLimitsData id={id} />
                     </TabPanel>
                     <TabPanel value={OperatorDetailsTabs.PAYMENT_GATEWAYS}>
                        <ActiveOperatorPaymentGatewayData
                           key={'list'}
                           opId={id}
                           brandId={brandId !== 'All Brands' ? brandId : ''}
                        />
                     </TabPanel>
                     <TabPanel value={OperatorDetailsTabs.WEBHOOK_BASE_URL}>
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
                  </TabContext>
               </Grid>
               <Dialog
                  open={open}
                  fullScreen
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleClose}
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
                           onClick={handleClose}
                        />
                     </Grid>
                  </Grid>
                  <DialogContent sx={{ p: 1 }}>
                     <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={Yup.object().shape({
                           brandId: Yup.string().required(
                              'brand id is required'
                           ),
                        })}
                        onSubmit={handleSubmitAddBrand}
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
                                       handleClose();
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
            </>
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   );
}

OperatorConfigDetails.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Operator Config">{page}</DashboardLayout>;
};

export default OperatorConfigDetails;
