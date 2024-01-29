import CustomLoader from '@/components/custom/CustomLoader'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import TransitionSlide from '@/components/custom/TransitionSlide'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import MessagesData from '@/components/data/messages/message-grid'
import { useGetOperatorBrandListQuery } from '@/components/data/operators/lib/hooks/queries'
import ActiveOperatorPaymentGatewayData from '@/components/data/payments/active-operator-payments-grid'
import { useSetOperatorTopUpCurrenciesMutation } from '@/components/data/topupCurrencies/lib/hooks/queries'
import TopUpCurrenciesData from '@/components/data/topupCurrencies/topup-currencies-data'
import { useSetOperatorKycVerificationMutation } from '@/components/data/verification/lib/hooks/queries'
import VerificationData from '@/components/data/verification/verification-data'
import {
   Brand,
   Currency,
   IntegrationType,
   KycVerification,
   Operator,
   SetTopupCurrenciesDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import {
   KycVerificationsItemDto,
   SetKycVerificationsDto,
} from '@alienbackoffice/back-front/lib/operator/dto/set-kyc-verifications.dto'
import { KycVerificationType } from '@alienbackoffice/back-front/lib/operator/enum/kyc-verification-type.enum'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faAdd,
   faAngleDown,
   faRectangleXmark,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
   Autocomplete,
   Avatar,
   Box,
   Button,
   Checkbox,
   Dialog,
   DialogActions,
   DialogContent,
   FormControl,
   FormControlLabel,
   FormGroup,
   Grid,
   InputLabel,
   MenuItem,
   Select,
   Tab,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { Stack } from '@mui/system'
import { GridRowsProp } from '@mui/x-data-grid'
import { randomId } from '@mui/x-data-grid-generator'
import { ImoonGray, darkPurple } from 'colors'
import { Field, Formik } from 'formik'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   savePaymentsGateway,
   selectAuthBrandsList,
   selectAuthCurrenciesInit,
   selectAuthCurrentOperator,
   selectAuthTopupCurrencies,
   selectAuthkycVerification,
} from 'redux/authSlice'
import { saveLoadingPaymentsGateway } from 'redux/loadingSlice'
import { store } from 'redux/store'
import {
   CustomNoRowsOverlay,
   PageWithdetails3Toolbar,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import { BrandDetailsTab } from 'types'
import * as Yup from 'yup'
import DashboardLayout from '../../layouts/Dashboard'

interface RowsCellPropsTopUp {
   id: string
   currency: string
}

interface RowsCellPropsField {
   id: string
   order: number
   type: KycVerificationType
   title: string
   description?: string
   required: boolean
   visible: boolean
}

const initialRows: GridRowsProp = []
function BrandDetails() {
   const router = useRouter()
   const { id, brandId }: any = router.query
   const operator = useSelector(selectAuthCurrentOperator) as Operator
   const [value, setValue] = React.useState('')
   const [openEditField, setOpenEditField] = React.useState(false)
   const [formikField, setFormikField] = React.useState(0)
   const [initialValuesField, setInitialValuesField] = React.useState({
      type: KycVerificationType.FILE,
      order: 0,
      title: '',
      description: '',
      required: false,
      visible: false,
   })
   const [currentField, setCurrentField] = React.useState(
      {} as RowsCellPropsField
   )
   const dataBrands = useSelector(selectAuthBrandsList) as Brand[]
   const [brand, setBrand]: Brand | any = React.useState({})
   const [ignore, setIgnore] = React.useState(false)
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [openEditTopUp, setOpenEditTopUp] = React.useState(false)
   const [Transition, setTransition]: any = React.useState()
   const currenciesInit = useSelector(selectAuthCurrenciesInit) as Currency[]
   const [initialValuesTopUp, setInitialValuesTopUp] = React.useState({
      id: '',
      currency: '',
   })
   const [rowsTopUp, setRowsTopUp] = React.useState([] as RowsCellPropsTopUp[])
   const dataTopUp = useSelector(selectAuthTopupCurrencies) as string[]
   const dataField = useSelector(selectAuthkycVerification) as KycVerification[]

   const { mutate: mutateTopUp } = useSetOperatorTopUpCurrenciesMutation({
      onSuccess: () => {
         toast.success('Top up currency added Successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         handleCloseEditTopUp()
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const { mutate } = useSetOperatorKycVerificationMutation({
      onSuccess: () => {
         toast.success('Operator Kyc Verification Added Successfully')
         handleCloseEditField()
         setInitialValuesField({
            order: 0,
            description: '',
            required: false,
            title: '',
            type: KycVerificationType.FILE,
            visible: false,
         })
      },
      onError(error, variables, context) {
         toast.error(error)
      },
   })

   const handleTabValue = () => {
      let valueTab = ''
      switch (true) {
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_ACTIVE_PAYMENT_GATEWAYS_REQ
         ) && operator?.integrationType === IntegrationType.ALIEN_STANDALONE:
            valueTab = BrandDetailsTab.PAYMENTGATEWAYS
            break
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_KYC_VERIFICATIONS_REQ
         ) && operator?.integrationType === IntegrationType.ALIEN_STANDALONE:
            valueTab = BrandDetailsTab.VERIFICATION
            break
         case hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_MESSAGES_IN_LANGUAGE_REQ
         ):
            valueTab = BrandDetailsTab.SYSTEM_MESSAGES
            break
         default:
            break
      }
      return valueTab
   }

   const handleChangeTabs = (event: React.SyntheticEvent, newValue: string) => {
      event.preventDefault()
      setValue(newValue)
   }

   useGetOperatorBrandListQuery({
      opId: id,
      key: 'list',
   })

   const handleOpenEditTopUp = () => {
      setTransition(TransitionSlide)
      setInitialValuesTopUp({
         id: '',
         currency: '',
      })
      setOpenEditTopUp(true)
   }

   const handleCloseEditTopUp = async () => {
      setOpenEditTopUp(false)
      setInitialValuesTopUp({
         id: '',
         currency: '',
      })
   }

   const handleSubmitMethods = React.useCallback(
      (data: SetTopupCurrenciesDto) => {
         mutateTopUp({ dto: data })
      },
      [mutateTopUp]
   )

   const handleSubmitEditTopUp = (dataItem: RowsCellPropsTopUp) => {
      const currencies: RowsCellPropsTopUp[] = [...rowsTopUp, dataItem]
      const items: SetTopupCurrenciesDto = {
         opId: id,
         currencies: currencies.map((obj) => obj.currency),
         brandId: brandId,
      }
      // if (currentBrandId !== 'All Brands') {
      //    items.brandId = currentBrandId
      // }
      handleSubmitMethods(items)
   }

   const handleCloseEditField = async () => {
      setOpenEditField(false)
      setInitialValuesField({
         order: 0,
         type: KycVerificationType.FILE,
         title: '',
         description: '',
         required: false,
         visible: false,
      })
      setFormikField(formikField + 1)
   }

   const handleEditField = React.useCallback(
      (dataItem: KycVerificationsItemDto) => {
         const items: KycVerificationsItemDto[] = [...dataField, dataItem]

         const dto: SetKycVerificationsDto = {
            opId: id,
            items,
            brandId,
         }
         mutate({ dto })
      },
      [mutate, dataField, id, brandId]
   )

   const handleOpenEditField = () => {
      setFormikField(formikField + 1)
      setTransition(TransitionSlide)
      setInitialValuesField({
         order: 0,
         description: '',
         required: false,
         title: '',
         type: KycVerificationType.FILE,
         visible: false,
      })
      setOpenEditField(true)
   }

   useEffect(() => {
      setBrand(dataBrands.find((item) => item.brandId === brandId))
   }, [dataBrands])

   useEffect(() => {
      if (!ignore) {
         store.dispatch(saveLoadingPaymentsGateway(true))
         store.dispatch(savePaymentsGateway([]))
         setValue(handleTabValue())
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   })

   React.useEffect(() => {
      if (dataField) {
         const dataRows = dataField.map(
            (obj: KycVerification) => ({
               id: randomId(),
               type: obj.type,
               title: obj.title,
               description: obj.description,
               required: obj.required,
               order: obj.order,
               visible: obj.visible,
            }),
            []
         )
         const sortedDataRows = dataRows.sort((a, b) => a.order - b.order)
         // setRowsVerification(sortedDataRows)
      }
   }, [dataField])

   React.useEffect(() => {
      if (dataTopUp) {
         const dataRows = dataTopUp?.map(
            (obj: string) => ({
               id: randomId(),
               currency: obj,
            }),
            []
         )
         setRowsTopUp(dataRows)
      }
   }, [dataTopUp])

   return (
      <React.Fragment>
         <Helmet title="iMoon | Brand Details" />
         <CustomOperatorsBrandsToolbar
            title={'Brand Details'}
            background={
               isDesktop
                  ? theme.palette.secondary.dark
                  : theme.palette.primary.main
            }
            actions={
               <>
                  {hasDetailsPermission(
                     UserPermissionEvent.BACKOFFICE_SET_TOPUP_CURRENCIES_REQ
                  ) &&
                     value === BrandDetailsTab.TOPUP_CURRENCIES && (
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
                  {hasDetailsPermission(
                     UserPermissionEvent.BACKOFFICE_SET_KYC_VERIFICATIONS_REQ
                  ) &&
                     value === BrandDetailsTab.VERIFICATION && (
                        <Grid item>
                           <Button
                              onClick={handleOpenEditField}
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
                              New Field
                           </Button>
                        </Grid>
                     )}
               </>
            }
         />
         {id && ignore && brand ? (
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
                     {brand && (
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
                                 {id && (
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
                                             href={
                                                hasDetailsPermission(
                                                   UserPermissionEvent.BACKOFFICE_GET_OPERATOR_REQ
                                                )
                                                   ? `/operators/details?id=${id}`
                                                   : ''
                                             }
                                             title={' Operator ID:'}
                                             value={id}
                                             isVisible={true}
                                             sx={{
                                                color: (props) =>
                                                   isDesktop
                                                      ? hasDetailsPermission(
                                                           UserPermissionEvent.BACKOFFICE_GET_OPERATOR_REQ
                                                        )
                                                         ? '#1570EF'
                                                         : ImoonGray[1]
                                                      : props.palette.primary
                                                           .contrastText,
                                             }}
                                             whiteSpace={'nowrap'}
                                          />
                                       </Box>
                                    </Grid>
                                 )}
                                 {brand.brandName && (
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
                                             title={' Brand:'}
                                             value={`${brand.brandId} - ${brand.brandName}`}
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
                                       >
                                          Brand Domain : {brand.brandDomain}
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
                           height: PageWithdetails3Toolbar,
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
                           justifyContent: 'left',
                        }}
                        aria-label="lab API tabs example"
                     >
                        {operator?.integrationType ===
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
                                 value={BrandDetailsTab.PAYMENTGATEWAYS}
                              />
                           )}
                        {operator?.integrationType ===
                           IntegrationType.ALIEN_STANDALONE &&
                           hasDetailsPermission(
                              UserPermissionEvent.BACKOFFICE_GET_KYC_VERIFICATIONS_REQ
                           ) && (
                              <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       Verification
                                    </Typography>
                                 }
                                 value={BrandDetailsTab.VERIFICATION}
                              />
                           )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_MESSAGES_IN_LANGUAGE_REQ
                        ) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    System Messages
                                 </Typography>
                              }
                              value={BrandDetailsTab.SYSTEM_MESSAGES}
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
                              value={BrandDetailsTab.TOPUP_CURRENCIES}
                           />
                        )}
                     </TabList>
                     <TabPanel value={BrandDetailsTab.PAYMENTGATEWAYS}>
                        <ActiveOperatorPaymentGatewayData
                           key={'list'}
                           opId={id}
                           brandId={brandId}
                        />
                     </TabPanel>
                     <TabPanel value={BrandDetailsTab.VERIFICATION}>
                        <VerificationData opId={id} brandId={brandId} />
                     </TabPanel>
                     <TabPanel value={BrandDetailsTab.SYSTEM_MESSAGES}>
                        <MessagesData opId={id} brandId={brandId} />
                     </TabPanel>
                     <TabPanel value={BrandDetailsTab.TOPUP_CURRENCIES}>
                        <TopUpCurrenciesData opId={id} brandId={brandId} />
                     </TabPanel>
                  </TabContext>
               </Grid>
               <Dialog
                  open={openEditTopUp}
                  fullScreen
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleCloseEditTopUp}
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
                        key={formikField}
                        initialValues={initialValuesTopUp}
                        enableReinitialize={true}
                        validationSchema={Yup.object().shape({
                           currency: Yup.string().required(
                              'Currency is required'
                           ),
                        })}
                        onSubmit={handleSubmitEditTopUp}
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
                                       )
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
                                    onClick={handleCloseEditTopUp}
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
                  open={openEditField}
                  fullScreen
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleCloseEditField}
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
                           {currentField.title
                              ? `Edit Field ${currentField.title}`
                              : 'Add new field'}
                        </Typography>
                     </Grid>
                     <Grid item xs></Grid>
                     <Grid item>
                        <FontAwesomeIcon
                           icon={faRectangleXmark as IconProp}
                           onClick={handleCloseEditField}
                        />
                     </Grid>
                  </Grid>
                  <DialogContent sx={{ p: 1 }}>
                     <Formik
                        key={formikField}
                        initialValues={initialValuesField}
                        enableReinitialize={true}
                        validationSchema={Yup.object().shape({
                           title: Yup.string().required('Title is required'),
                           type: Yup.string().required('Type is required'),
                        })}
                        onSubmit={handleEditField}
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
                                 name="title"
                                 label="Title"
                                 value={values.title}
                                 error={Boolean(touched.title && errors.title)}
                                 fullWidth
                                 helperText={touched.title && errors.title}
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                              />
                              <FormControl
                                 sx={{
                                    width: '100%',
                                 }}
                              >
                                 <InputLabel id="demo-simple-select-disabled-label">
                                    Type
                                 </InputLabel>
                                 <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Type"
                                    sx={{
                                       width: '100%',
                                    }}
                                    value={values.type}
                                    name="type"
                                    onChange={handleChange}
                                    IconComponent={() => (
                                       <FontAwesomeIcon
                                          icon={faAngleDown as IconProp}
                                          className="selectIcon"
                                          size="sm"
                                       />
                                    )}
                                 >
                                    {Object.keys(KycVerificationType)?.map(
                                       (item: string) => (
                                          <MenuItem
                                             value={item}
                                             key={`${item}`}
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
                                       )
                                    )}
                                 </Select>
                              </FormControl>
                              <TextField
                                 name="description"
                                 label="Description"
                                 multiline
                                 value={values.description}
                                 error={Boolean(
                                    touched.description && errors.description
                                 )}
                                 fullWidth
                                 helperText={
                                    touched.description && errors.description
                                 }
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                              />
                              <FormControl variant="standard" fullWidth>
                                 <FormGroup
                                    sx={{
                                       width: 'fit-content',
                                       '.MuiCheckbox-root': {
                                          paddingLeft: 0,
                                       },
                                    }}
                                 >
                                    <Field
                                       type="checkbox"
                                       name="required"
                                       value={values.required}
                                       as={FormControlLabel}
                                       onChange={handleChange}
                                       control={
                                          <Checkbox checked={values.required} />
                                       }
                                       label={'Required'}
                                    />
                                 </FormGroup>
                                 <FormGroup
                                    sx={{
                                       width: 'fit-content',
                                       '.MuiCheckbox-root': {
                                          paddingLeft: 0,
                                       },
                                    }}
                                 >
                                    <Field
                                       type="checkbox"
                                       name="visible"
                                       value={values.visible}
                                       as={FormControlLabel}
                                       onChange={handleChange}
                                       control={
                                          <Checkbox checked={values.visible} />
                                       }
                                       label={'Visible'}
                                    />
                                 </FormGroup>
                              </FormControl>
                              <DialogActions>
                                 <Button
                                    onClick={handleCloseEditField}
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
         ) : brand ? (
            <CustomLoader />
         ) : (
            <CustomNoRowsOverlay />
         )}
      </React.Fragment>
   )
}

BrandDetails.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Brand Details">{page}</DashboardLayout>
}

export default BrandDetails
