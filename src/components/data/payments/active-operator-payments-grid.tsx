import SelectTheme from '@/components/SelectTheme'
import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import { renderPaymentStatusCell } from '@/components/custom/PortalRenderCells'
import TransitionSlide from '@/components/custom/TransitionSlide'
import {
   Currency,
   PaymentGateway,
   PaymentGatewayName,
   SetActivePaymentGatewaysDto,
   SetPaymentGatewayCurrenciesDto,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front'
import { SetCpgPaymentGatewayDto } from '@alienbackoffice/back-front/lib/operator/dto/set-cpg-payment-gateway.dto'
import { SetJbPaymentGatewayDto } from '@alienbackoffice/back-front/lib/operator/dto/set-jb-payment-gateway.dto'
import { SetPwPaymentGatewayDto } from '@alienbackoffice/back-front/lib/operator/dto/set-pw-payment-gateway.dto'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown, faRectangleXmark } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Autocomplete,
   Box,
   Button,
   Checkbox,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogProps,
   DialogTitle,
   FormControl,
   FormControlLabel,
   FormGroup,
   Grid,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridSortModel,
} from '@mui/x-data-grid-pro'
import { darkPurple } from 'colors'
import { Formik } from 'formik'
import React, { MouseEventHandler, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   selectAuthActivePaymentGatewayBrand,
   selectAuthActivePaymentGatewayOperator,
   selectAuthCurrenciesInit,
   selectAuthPaymentCPGGatewayOperator,
   selectAuthPaymentGatewayOperator,
   selectAuthPaymentJBGatewayOperator,
   selectAuthPaymentsGateway,
   selectAuthUser,
} from 'redux/authSlice'
import { selectLoadingPaymentsGateway } from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith2Toolbar,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'
import CustomBankNames from '../operators/custom-bank-names'
import EditLimitCurrency from '../operators/edit-brands-currencies'
import Packages from '../operators/packages'
import RateCurrency from '../operators/rate-currencies'
import WithdrawFeeCurrency from '../operators/withdraw-fee-currencies'
import {
   UseGetPaymentsListBrandQueryProps,
   UseGetPaymentsListQueryProps,
   useGetActivePaymentsListQuery,
   useGetPaymentsListQuery,
   useSetCPGPaymentGatewayMutation,
   useSetJBPaymentGatewayMutation,
   useSetPWPaymentGatewayMutation,
   useSetPaymentGatewayCurrenciesMutation,
} from './lib/hooks/queries'

export default function ActiveOperatorPaymentGatewayData(
   dataFilter: UseGetPaymentsListBrandQueryProps
) {
   const currenciesInit = useSelector(selectAuthCurrenciesInit) as Currency[]
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const loadingPaymentsGateway = useSelector(selectLoadingPaymentsGateway)
   const [open, setOpen] = React.useState(false)
   const [openCurrencies, setOpenCurrencies] = React.useState(false)
   const [withdrawLimitByCurrencyValues, setWithdrawLimitByCurrencyValues] =
      React.useState({})
   const [depositLimitByCurrencyValues, setDepositLimitByCurrencyValues] =
      React.useState({})
   const [depositRateByCurrencyValues, setDepositRateByCurrencyValues] =
      React.useState({})
   const [withdrawRateByCurrencyValues, setWithdrawRateByCurrencyValues] =
      React.useState({})
   const [withdrawFeeByCurrencyValues, setWithdrawFeeByCurrencyValues] =
      React.useState({})
   const [depositPackagesValues, setDepositPackagesValues] = React.useState<
      number[]
   >([])
   const [withdrawPackagesValues, setWithdrawPackagesValues] = React.useState<
      number[]
   >([])
   const [bankNamesValues, setBankNamesValues] = React.useState<string[]>([])
   const [keyDate, setKeyDate] = React.useState(0)
   const [Transition, setTransition]: any = React.useState()
   const [gatewayName, setGatewayName]: any = React.useState()
   const [initialValues, setInitialValues]: any = React.useState({
      gatewayName: gatewayName,
      opId: dataFilter.opId,
      brandId: dataFilter.brandId,
      secretKey: '',
      depositPackages: [],
      withdrawPackages: [],
      type: '',
      currency: '',
      endpoint: '',
      userlevel: '',
      order: 0,
      enableToDeposit: false,
      enableToWithdarw: false,
      visibleForOperator: false,
      bankNameIsRequired: false,
      ibanIsRequired: false,
      withdrawLimitByCurrency: {},
      depositLimitByCurrency: {},
      depositRateByCurrency: {},
      withdrawRateByCurrency: {},
      withdrawFeeByCurrency: {},
      maxNumberOfWithdrawalsPerDay: 0,
      maxNumberOfWithdrawalsPerWeek: 0,
      maxNumberOfWithdrawalsPerMonth: 0,
   })
   const configData = useSelector(selectAuthPaymentGatewayOperator)
   const configDataJB = useSelector(selectAuthPaymentJBGatewayOperator)
   const configDataCPG = useSelector(selectAuthPaymentCPGGatewayOperator)
   const boClient = useSelector(selectBoClient)
   const [openActivePayment, setOpenActivePayment] = React.useState(false)
   const [paymentGatewayCurrencies, setPaymentGatewayCurrencies] =
      React.useState({
         validCurrenciesToDeposit: [] as string[],
         validCurrenciesToWithdraw: [] as string[],
      })
   const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm')
   const [fullWidth, setFullWidth] = React.useState(true)
   const [showPassword, setShowPassword] = React.useState(false)
   const [data, setData] = React.useState({
      count: 0,
      paymentsGateway: [] as {
         name: PaymentGatewayName
         title: string
         description: string
         types: string[]
      }[],
   })
   const user: User = useSelector(selectAuthUser)
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const dataActiveBrand = useSelector(selectAuthActivePaymentGatewayBrand) as {
      [PaymentGatewayName.CPG]?: PaymentGateway
      [PaymentGatewayName.JB]?: PaymentGateway
      [PaymentGatewayName.PW]?: PaymentGateway
   }
   const [action, setAction] = React.useState(0)

   const Actions = (data: {
      name: PaymentGatewayName
      title: string
      description: string
      types: string[]
   }) => {
      let actiondata: {
         value: string
         label: React.ReactElement | string
         onClick?: MouseEventHandler<any> | undefined
         disabled?: boolean
      }[] = []
      actiondata.push({
         value: '0',
         label: (
            <Typography
               variant="caption"
               sx={{
                  fontFamily: 'Nunito Sans Bold',
                  fontSize: '0.75rem',
               }}
            >
               Actions
            </Typography>
         ),
         disabled: true,
      })
      if (user?.scope !== UserScope.BRAND) {
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
                  {dataActiveBrand &&
                  dataActive &&
                  Object.keys(
                     [UserScope.SUPERADMIN, UserScope.ADMIN].includes(
                        user?.scope
                     ) && !dataFilter.brandId
                        ? dataActive
                        : dataActiveBrand
                  ).includes(data.name)
                     ? 'Inactive'
                     : 'Active'}
               </Typography>
            ),
            onClick: () => handleClickOpenActivePayment(data.name),
         })
      }
      if (
         ((data.name === PaymentGatewayName.JB &&
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GET_JB_PAYMENT_GATEWAY_REQ
            )) ||
            (data.name === PaymentGatewayName.CPG &&
               hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_GET_CPG_PAYMENT_GATEWAY_REQ
               )) ||
            (data.name === PaymentGatewayName.PW &&
               hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_GET_PW_PAYMENT_GATEWAY_REQ
               ))) &&
         dataActiveBrand &&
         Object.keys(dataActiveBrand).includes(data.name) &&
         dataFilter.brandId
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
                  Edit config
               </Typography>
            ),
            onClick: () => handleClickOpen(data.name),
         })
      }
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SET_PAYMENT_GATEWAY_CURRENCIES_REQ
         ) &&
         dataActiveBrand &&
         dataActive &&
         dataFilter.brandId
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
                  Payment Gateway Currencies
               </Typography>
            ),
            onClick: () => handleCurrenciesClickOpen(data.name),
         })
      }
      return actiondata
   }

   const columns: GridColDef[] = [
      {
         field: 'name',
         headerName: 'Gateway',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => params.value,
         minWidth: 100,
         filterable: false,
         sortable: false,
         flex: 1,
      },
      {
         field: 'title',
         headerName: 'Title',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => params.value,
         minWidth: 120,
         filterable: false,
         sortable: false,
         flex: 1,
      },
      {
         field: 'description',
         headerName: 'Description',
         headerAlign: 'center',
         align: 'center',
         minWidth: 130,
         renderCell: (params) => (
            <PortalCopyValue
               value={params.value}
               sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  maxWidth: '100px',
               }}
            />
         ),
         sortable: false,
         flex: 1,
      },
      {
         field: 'types',
         headerName: 'Types',
         minWidth: 100,
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => params.value,
         sortable: false,
         flex: 1,
      },
      {
         field: 'status',
         headerName: 'Status',
         headerAlign: 'center',
         align: 'center',
         minWidth: 100,
         renderCell: (params) =>
            dataActive &&
            renderPaymentStatusCell(
               Object.keys(
                  !dataFilter.brandId ? dataActive : dataActiveBrand
               ).includes(params.row.name)
            ),
         sortable: false,
         flex: 1,
      },
      {
         field: 'actions',
         headerName: '',
         renderCell: (params) => {
            return (
               <Box className="showOnHover">
                  {([UserScope.SUPERADMIN, UserScope.ADMIN].includes(
                     user?.scope
                  ) ||
                     dataFilter.brandId) && (
                     <SelectTheme
                        noPadd={true}
                        icon={''}
                        data={Actions(params.row)}
                        value={action}
                     />
                  )}
               </Box>
            )
         },
         sortable: false,
         filterable: false,
         disableColumnMenu: true,
         width: 10,
      },
   ]

   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   const post: UseGetPaymentsListQueryProps = {
      key: 'list',
      autoRefresh: dataFilter.autoRefresh,
   }
   useGetPaymentsListQuery(post)
   const dataAdmin = useSelector(selectAuthPaymentsGateway)
   const postActive: UseGetPaymentsListBrandQueryProps = {
      key: 'operator',
      opId: dataFilter.opId,
      autoRefresh: dataFilter.autoRefresh,
   }
   useGetActivePaymentsListQuery(postActive)
   const dataActive = useSelector(selectAuthActivePaymentGatewayOperator) as {
      [PaymentGatewayName.CPG]?: PaymentGateway
      [PaymentGatewayName.JB]?: PaymentGateway
      [PaymentGatewayName.PW]?: PaymentGateway
   }

   const postActiveBrand: UseGetPaymentsListBrandQueryProps = {
      key: 'brand',
      opId: dataFilter.opId,
   }
   if (dataFilter.brandId) {
      postActiveBrand.brandId = dataFilter.brandId
   }
   useGetActivePaymentsListQuery(postActiveBrand)

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         let data = {}
      },
      []
   )

   const handleClickOpen = (value: PaymentGatewayName) => {
      setTransition(TransitionSlide)
      setOpen(true)
      setGatewayName(value)
      if (
         value === PaymentGatewayName.PW &&
         dataFilter.opId &&
         dataFilter.brandId
      ) {
         boClient?.operator?.getPwPaymentGateway(
            { opId: dataFilter.opId, brandId: dataFilter.brandId },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_PW_PAYMENT_GATEWAY_REQ,
               },
            }
         )
      }
      if (
         value === PaymentGatewayName.JB &&
         dataFilter.opId &&
         dataFilter.brandId
      ) {
         boClient?.operator?.getJbPaymentGateway(
            { opId: dataFilter.opId, brandId: dataFilter.brandId },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_JB_PAYMENT_GATEWAY_REQ,
               },
            }
         )
      }
      if (
         value === PaymentGatewayName.CPG &&
         dataFilter.opId &&
         dataFilter.brandId
      ) {
         boClient?.operator?.getCpgPaymentGateway(
            { opId: dataFilter.opId, brandId: dataFilter.brandId },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_CPG_PAYMENT_GATEWAY_REQ,
               },
            }
         )
      }
      if (dataFilter.opId && dataFilter.brandId && value) {
         boClient?.operator?.getPaymentGatewayCurrencies(
            {
               opId: dataFilter.opId,
               brandId: dataFilter.brandId,
               paymentGatewayName: value,
            },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_PAYMENT_GATEWAY_CURRENCIES_REQ,
               },
            }
         )
         boClient?.operator.onGetPaymentGatewayCurrenciesResponse(
            async (result) => {
               setPaymentGatewayCurrencies({
                  validCurrenciesToDeposit:
                     result.data?.validCurrenciesToDeposit || ([] as string[]),
                  validCurrenciesToWithdraw:
                     result.data?.validCurrenciesToWithdraw || ([] as string[]),
               })
            }
         )
      }
   }

   const handleClose = async () => {
      setKeyDate(keyDate + 1)
      await setTransition(TransitionSlide)
      setOpen(false)
      setWithdrawLimitByCurrencyValues({})
      setDepositLimitByCurrencyValues({})
      setDepositRateByCurrencyValues({})
      setWithdrawRateByCurrencyValues({})
      setWithdrawFeeByCurrencyValues({})
      setDepositPackagesValues([])
      setWithdrawPackagesValues([])
      setBankNamesValues([])
      setInitialValues({
         gatewayName: gatewayName,
         opId: dataFilter.opId,
         brandId: dataFilter.brandId,
         secretKey: '',
         type: '',
         currency: '',
         endpoint: '',
         userlevel: '',
         order: 0,
         enableToDeposit: false,
         enableToWithdarw: false,
         visibleForOperator: false,
         bankNameIsRequired: false,
         ibanIsRequired: false,
         withdrawLimitByCurrency: {},
         withdrawFeeByCurrency: {},
         depositRateByCurrency: {},
         withdrawRateByCurrency: {},
         maxNumberOfWithdrawalsPerDay: 0,
         maxNumberOfWithdrawalsPerWeek: 0,
         maxNumberOfWithdrawalsPerMonth: 0,
      })
   }

   const handleCurrenciesClickOpen = (value: PaymentGatewayName) => {
      if (dataFilter.opId && dataFilter.brandId && value) {
         boClient?.operator?.getPaymentGatewayCurrencies(
            {
               opId: dataFilter.opId,
               brandId: dataFilter.brandId,
               paymentGatewayName: value,
            },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_PAYMENT_GATEWAY_CURRENCIES_REQ,
               },
            }
         )
         boClient?.operator.onGetPaymentGatewayCurrenciesResponse(
            async (result) => {
               setTransition(TransitionSlide)
               setOpenCurrencies(true)
               setGatewayName(value)
               setPaymentGatewayCurrencies({
                  validCurrenciesToDeposit:
                     result.data?.validCurrenciesToDeposit || ([] as string[]),
                  validCurrenciesToWithdraw:
                     result.data?.validCurrenciesToWithdraw || ([] as string[]),
               })
            }
         )
      }
   }

   const hanldeCloseCurrencies = async () => {
      setOpenCurrencies(false)
   }

   const { mutate } = useSetPWPaymentGatewayMutation({
      onSuccess: () => {
         toast.success('You updated PW gateway payment Successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         handleClose()
      },
   })

   const { mutate: mutatePaymentCurrencies } =
      useSetPaymentGatewayCurrenciesMutation({
         onSuccess: () => {
            toast.success(
               'You updated payment gateway currencies Successfully',
               {
                  position: toast.POSITION.TOP_CENTER,
               }
            )
            hanldeCloseCurrencies()
         },
      })

   const { mutate: mutateJB } = useSetJBPaymentGatewayMutation({
      onSuccess: () => {
         toast.success('You updated JB gateway payment Successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         handleClose()
      },
   })

   const { mutate: mutateCPG } = useSetCPGPaymentGatewayMutation({
      onSuccess: () => {
         toast.success('You updated CPG gateway payment Successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         handleClose()
      },
   })

   const handleSubmitMethods = React.useCallback(
      (dataPayment: {
         gatewayName: PaymentGatewayName
         type: string
         currency: string
         endpoint: string
         userlevel: string
         order: number
         enableToDeposit: boolean
         enableToWithdarw: boolean
         visibleForOperator: boolean
         ibanIsRequired: boolean
         bankNameIsRequired: boolean
         opId: string
         brandId: string
         secretKey: string
         withdrawLimitByCurrency: {
            [key: string]: {
               minAmount: number
            }
         }
         withdrawFeeByCurrency: {
            [key: string]: {
               amount: number
            }
         }
         withdrawRateByCurrency: {
            [key: string]: {
               minAmount: number
            }
         }
         depositRatetByCurrency: {
            [key: string]: {
               minAmount: number
            }
         }
         maxNumberOfWithdrawalsPerDay: number
         maxNumberOfWithdrawalsPerWeek: number
         maxNumberOfWithdrawalsPerMonth: number
      }) => {
         if (dataPayment.gatewayName === PaymentGatewayName.PW) {
            const dto: SetPwPaymentGatewayDto = {
               opId: dataPayment.opId,
               brandId: dataPayment.brandId,
               order: dataPayment.order,
               enableToWithdraw: Boolean(dataPayment.enableToWithdarw),
               enableToDeposit: Boolean(dataPayment.enableToDeposit),
               visible: Boolean(dataPayment.visibleForOperator),
               config: {
                  currency: dataPayment.currency,
                  endpoint: dataPayment.endpoint,
                  type: dataPayment.type,
                  userlevel: dataPayment.userlevel,
               },
               withdrawLimitByCurrency: withdrawLimitByCurrencyValues,
               withdrawFeeByCurrency: withdrawFeeByCurrencyValues,
               secret: {
                  key: dataPayment.secretKey,
               },
               withdrawalLimitPerTime: {
                  maxNumberOfWithdrawalsPerDay:
                     dataPayment.maxNumberOfWithdrawalsPerDay,
                  maxNumberOfWithdrawalsPerWeek:
                     dataPayment.maxNumberOfWithdrawalsPerWeek,
                  maxNumberOfWithdrawalsPerMonth:
                     dataPayment.maxNumberOfWithdrawalsPerMonth,
               },
            }
            mutate({ dto })
         }
         if (dataPayment.gatewayName === PaymentGatewayName.JB) {
            if (
               dataPayment.bankNameIsRequired &&
               bankNamesValues.length === 0
            ) {
               toast.error(
                  'Bank name is required. You must set at least one bank name.'
               )
            } else {
               const dto: SetJbPaymentGatewayDto = {
                  opId: dataPayment.opId,
                  brandId: dataPayment.brandId,
                  order: dataPayment.order,
                  enableToWithdraw: Boolean(dataPayment.enableToWithdarw),
                  enableToDeposit: Boolean(dataPayment.enableToDeposit),
                  visible: Boolean(dataPayment.visibleForOperator),
                  config: {
                     endpoint: dataPayment.endpoint,
                     type: dataPayment.type,
                     depositPackages: depositPackagesValues,
                     withdrawPackages: withdrawPackagesValues,
                     bankNames: bankNamesValues,
                     bankNameIsRequired: dataPayment.bankNameIsRequired,
                     ibanIsRequired: dataPayment.ibanIsRequired,
                  },
                  withdrawLimitByCurrency: withdrawLimitByCurrencyValues,
                  withdrawFeeByCurrency: withdrawFeeByCurrencyValues,
                  secret: {
                     key: dataPayment.secretKey,
                  },
                  withdrawalLimitPerTime: {
                     maxNumberOfWithdrawalsPerDay:
                        dataPayment.maxNumberOfWithdrawalsPerDay,
                     maxNumberOfWithdrawalsPerWeek:
                        dataPayment.maxNumberOfWithdrawalsPerWeek,
                     maxNumberOfWithdrawalsPerMonth:
                        dataPayment.maxNumberOfWithdrawalsPerMonth,
                  },
               }
               mutateJB({ dto })
            }
         }
         if (dataPayment.gatewayName === PaymentGatewayName.CPG) {
            const dto: SetCpgPaymentGatewayDto = {
               opId: dataPayment.opId,
               brandId: dataPayment.brandId,
               order: dataPayment.order,
               enableToWithdraw: Boolean(dataPayment.enableToWithdarw),
               enableToDeposit: Boolean(dataPayment.enableToDeposit),
               visible: Boolean(dataPayment.visibleForOperator),
               withdrawLimitByCurrency: withdrawLimitByCurrencyValues,
               withdrawFeeByCurrency: withdrawFeeByCurrencyValues,
               depositRateByCurrency: depositRateByCurrencyValues,
               withdrawRateByCurrency: withdrawRateByCurrencyValues,
               withdrawalLimitPerTime: {
                  maxNumberOfWithdrawalsPerDay:
                     dataPayment.maxNumberOfWithdrawalsPerDay,
                  maxNumberOfWithdrawalsPerWeek:
                     dataPayment.maxNumberOfWithdrawalsPerWeek,
                  maxNumberOfWithdrawalsPerMonth:
                     dataPayment.maxNumberOfWithdrawalsPerMonth,
               },
               config: {
                  depositLimitByCurrency: depositLimitByCurrencyValues,
               },
            }
            mutateCPG({ dto })
         }
      },
      [
         mutate,
         mutateJB,
         mutateCPG,
         withdrawLimitByCurrencyValues,
         depositLimitByCurrencyValues,
         withdrawFeeByCurrencyValues,
         depositPackagesValues,
         withdrawPackagesValues,
         bankNamesValues,
         depositRateByCurrencyValues,
         withdrawRateByCurrencyValues,
      ]
   )

   const handleGatewayPaymentCurrencies = React.useCallback(
      (dto: SetPaymentGatewayCurrenciesDto) => {
         mutatePaymentCurrencies({ dto })
      },
      [mutatePaymentCurrencies]
   )

   const handleCloseActivePayments = () => {
      setOpenActivePayment(false)
   }

   const handleClickOpenActivePayment = (
      gatewayNameValue: PaymentGatewayName
   ) => {
      setGatewayName(gatewayNameValue) as PaymentGatewayName
      setOpenActivePayment(true)
   }

   const updateStatusActivePayments = () => {
      const filterData = dataFilter.brandId ? dataActiveBrand : dataActive
      const data = {
         [PaymentGatewayName.CPG]:
            gatewayName === PaymentGatewayName.CPG
               ? !filterData[gatewayName as PaymentGatewayName]
               : Object.keys(filterData).findIndex(
                    (item) => item === PaymentGatewayName.CPG
                 ) > -1,
         [PaymentGatewayName.PW]:
            gatewayName === PaymentGatewayName.PW
               ? !filterData[gatewayName as PaymentGatewayName]
               : Object.keys(filterData).findIndex(
                    (item) => item === PaymentGatewayName.PW
                 ) > -1,
         [PaymentGatewayName.JB]:
            gatewayName === PaymentGatewayName.JB
               ? !filterData[gatewayName as PaymentGatewayName]
               : Object.keys(filterData).findIndex(
                    (item) => item === PaymentGatewayName.JB
                 ) > -1,
      }
      const dto: SetActivePaymentGatewaysDto = {
         opId: dataFilter.opId,
         ...data,
      }
      if (dataFilter.brandId) {
         dto.brandId = dataFilter.brandId
      }
      boClient?.operator.setActivePaymentGateways(
         {
            ...dto,
         },
         {
            uuid: uuidv4(),
            meta: {
               ts: new Date(),
               type: dto.brandId ? 'brand' : 'operator',
               sessionId: sessionStorage.getItem('sessionId'),
               event: UserPermissionEvent.BACKOFFICE_SET_ACTIVE_PAYMENT_GATEWAYS_REQ,
            },
         }
      )
      handleCloseActivePayments()
   }

   const setWithdrawLimitByCurrency = (
      withdrawLimitByCurrency: { currency: string; minAmount: number }[]
   ) => {
      const withdrawLimitByCurrencyData = withdrawLimitByCurrency?.reduce(
         (obj, cur) => ({
            ...obj,
            [cur.currency]: { minAmount: cur.minAmount },
         }),
         {}
      )
      setWithdrawLimitByCurrencyValues(withdrawLimitByCurrencyData)
   }

   const setDepositLimitByCurrency = (
      depositLimitByCurrency: { currency: string; minAmount: number }[]
   ) => {
      const depositLimitByCurrencyData = depositLimitByCurrency?.reduce(
         (obj, cur) => ({
            ...obj,
            [cur.currency]: { minAmount: cur.minAmount },
         }),
         {}
      )
      setDepositLimitByCurrencyValues(depositLimitByCurrencyData)
   }

   const setDepositRateByCurrency = (
      depositRateByCurrency: {
         currency: string
         toCurrency: string
         rate: number
      }[]
   ) => {
      const depositRateByCurrencyData = depositRateByCurrency?.reduce(
         (obj, cur) => ({
            ...obj,
            [cur.currency]: { toCurrency: cur.toCurrency, rate: cur.rate },
         }),
         {}
      )
      setDepositRateByCurrencyValues(depositRateByCurrencyData)
   }

   const setWithdrawRateByCurrency = (
      withdrawRateByCurrency: {
         currency: string
         toCurrency: string
         rate: number
      }[]
   ) => {
      const withdrawRateByCurrencyData = withdrawRateByCurrency?.reduce(
         (obj, cur) => ({
            ...obj,
            [cur.currency]: { toCurrency: cur.toCurrency, rate: cur.rate },
         }),
         {}
      )
      setWithdrawRateByCurrencyValues(withdrawRateByCurrencyData)
   }

   const setWithdrawFeeByCurrency = (
      withdrawFeeByCurrency: { currency: string; amount: number }[]
   ) => {
      const withdrawFeeByCurrencyData = withdrawFeeByCurrency?.reduce(
         (obj, cur) => ({
            ...obj,
            [cur.currency]: { amount: cur.amount },
         }),
         {}
      )
      setWithdrawFeeByCurrencyValues(withdrawFeeByCurrencyData)
   }

   const setDepositPackages = (depositPackages: { value: number }[]) => {
      const depositPackagesData = depositPackages?.map((obj, cur) => obj.value)
      setDepositPackagesValues(depositPackagesData)
   }

   const setWithdrawPackages = (withdrawPackages: { value: number }[]) => {
      const withdrawPackagesData = withdrawPackages?.map(
         (obj, cur) => obj.value
      )
      setWithdrawPackagesValues(withdrawPackagesData)
   }

   const setBankNames = (bankNames: { value: string }[]) => {
      const bankNamesData = bankNames?.map((obj, cur) => obj.value)
      setBankNamesValues(bankNamesData)
   }

   React.useEffect(() => {
      setRowCountState((prevRowCountState: any) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      )
   }, [data?.count, setRowCountState])

   useEffect(() => {
      if (gatewayName === PaymentGatewayName.PW) {
         if (configData) {
            setInitialValues({
               gatewayName: gatewayName,
               opId: dataFilter.opId,
               brandId: dataFilter.brandId,
               type: configData?.config?.type,
               currency: configData.config?.currency,
               endpoint: configData.config?.endpoint,
               userlevel: configData.config?.userlevel,
               order: configData.order,
               secretKey: configData.secret?.key,
               enableToDeposit: configData.enableToDeposit,
               enableToWithdarw: configData.enableToWithdraw,
               visibleForOperator: configData.visible,
               withdrawLimitByCurrency:
                  configData.withdrawLimitByCurrency || {},
               withdrawFeeByCurrency: configData.withdrawFeeByCurrency || {},
               maxNumberOfWithdrawalsPerDay:
                  configData?.withdrawalLimitPerTime
                     ?.maxNumberOfWithdrawalsPerDay || 0,
               maxNumberOfWithdrawalsPerWeek:
                  configData?.withdrawalLimitPerTime
                     ?.maxNumberOfWithdrawalsPerWeek || 0,
               maxNumberOfWithdrawalsPerMonth:
                  configData?.withdrawalLimitPerTime
                     ?.maxNumberOfWithdrawalsPerMonth || 0,
            })
            setWithdrawFeeByCurrencyValues(
               configData.withdrawFeeByCurrency || {}
            )
            setWithdrawLimitByCurrencyValues(
               configData.withdrawLimitByCurrency || {}
            )
         } else {
            setInitialValues({
               gatewayName: gatewayName,
               opId: dataFilter.opId,
               brandId: dataFilter.brandId,
               secretKey: '',
               type: '',
               currency: '',
               endpoint: '',
               userlevel: '',
               order: 0,
               enableToDeposit: false,
               enableToWithdarw: false,
               visibleForOperator: false,
               withdrawLimitByCurrency: {},
               withdrawFeeByCurrency: {},
               maxNumberOfWithdrawalsPerDay: 0,
               maxNumberOfWithdrawalsPerWeek: 0,
               maxNumberOfWithdrawalsPerMonth: 0,
            })
         }
      }
   }, [configData, gatewayName])

   useEffect(() => {
      if (gatewayName === PaymentGatewayName.JB) {
         if (configDataJB) {
            setInitialValues({
               gatewayName: gatewayName,
               opId: dataFilter.opId,
               brandId: dataFilter.brandId,
               type: configDataJB?.config?.type,
               secretKey: configDataJB?.secret?.key,
               endpoint: configDataJB?.config?.endpoint,
               depositPackages: configDataJB?.config?.depositPackages || [],
               withdrawPackages: configDataJB?.config?.withdrawPackages || [],
               order: configDataJB.order,
               enableToDeposit: configDataJB.enableToDeposit,
               enableToWithdarw: configDataJB.enableToWithdraw,
               visibleForOperator: configDataJB.visible,
               ibanIsRequired: configDataJB?.config?.ibanIsRequired || false,
               bankNameIsRequired:
                  configDataJB?.config?.bankNameIsRequired || false,
               bankNames: configDataJB?.config?.bankNames || [],
               withdrawLimitByCurrency:
                  configDataJB.withdrawLimitByCurrency || {},
               withdrawFeeByCurrency: configDataJB.withdrawFeeByCurrency || {},
               maxNumberOfWithdrawalsPerDay:
                  configDataJB?.withdrawalLimitPerTime
                     ?.maxNumberOfWithdrawalsPerDay || 0,
               maxNumberOfWithdrawalsPerWeek:
                  configDataJB?.withdrawalLimitPerTime
                     ?.maxNumberOfWithdrawalsPerWeek || 0,
               maxNumberOfWithdrawalsPerMonth:
                  configDataJB?.withdrawalLimitPerTime
                     ?.maxNumberOfWithdrawalsPerMonth || 0,
            })
            setWithdrawFeeByCurrencyValues(
               configDataJB.withdrawFeeByCurrency || {}
            )
            setWithdrawLimitByCurrencyValues(
               configDataJB.withdrawLimitByCurrency || {}
            )
            setDepositPackagesValues(
               configDataJB?.config?.depositPackages || []
            )
            setWithdrawPackagesValues(
               configDataJB?.config?.withdrawPackages || []
            )
            setBankNamesValues(configDataJB?.config?.bankNames || [])
         } else {
            setInitialValues({
               gatewayName: gatewayName,
               opId: dataFilter.opId,
               brandId: dataFilter.brandId,
               type: '',
               secretKey: '',
               endpoint: '',
               order: 0,
               enableToDeposit: false,
               enableToWithdarw: false,
               visibleForOperator: false,
               ibanIsRequired: false,
               bankNameIsRequired: false,
               withdrawLimitByCurrency: {},
               withdrawFeeByCurrency: {},
               maxNumberOfWithdrawalsPerDay: 0,
               maxNumberOfWithdrawalsPerWeek: 0,
               maxNumberOfWithdrawalsPerMonth: 0,
            })
         }
      }
   }, [configDataJB, gatewayName])

   useEffect(() => {
      if (gatewayName === PaymentGatewayName.CPG) {
         if (configDataCPG) {
            setInitialValues({
               gatewayName: gatewayName,
               opId: dataFilter.opId,
               brandId: dataFilter.brandId,
               order: configDataCPG.order,
               enableToDeposit: configDataCPG.enableToDeposit,
               enableToWithdarw: configDataCPG.enableToWithdraw,
               visibleForOperator: configDataCPG.visible,
               withdrawLimitByCurrency:
                  configDataCPG.withdrawLimitByCurrency || {},
               depositLimitByCurrency:
                  configDataCPG?.config?.depositLimitByCurrency || {},
               depositRateByCurrency: configDataCPG.depositRateByCurrency || {},
               withdrawRateByCurrency:
                  configDataCPG.withdrawRateByCurrency || {},
               withdrawFeeByCurrency: configDataCPG.withdrawFeeByCurrency || {},
               maxNumberOfWithdrawalsPerDay:
                  configDataCPG?.withdrawalLimitPerTime
                     ?.maxNumberOfWithdrawalsPerDay || 0,
               maxNumberOfWithdrawalsPerWeek:
                  configDataCPG?.withdrawalLimitPerTime
                     ?.maxNumberOfWithdrawalsPerWeek || 0,
               maxNumberOfWithdrawalsPerMonth:
                  configDataCPG?.withdrawalLimitPerTime
                     ?.maxNumberOfWithdrawalsPerMonth || 0,
            })
            setWithdrawFeeByCurrencyValues(
               configDataCPG.withdrawFeeByCurrency || {}
            )
            setWithdrawLimitByCurrencyValues(
               configDataCPG.withdrawLimitByCurrency || {}
            )
            setDepositLimitByCurrencyValues(
               configDataCPG?.config?.depositLimitByCurrency || {}
            )
            setDepositRateByCurrencyValues(
               configDataCPG?.depositRateByCurrency || {}
            )
            setWithdrawRateByCurrencyValues(
               configDataCPG?.withdrawRateByCurrency || {}
            )
         } else {
            setInitialValues({
               gatewayName: gatewayName,
               opId: dataFilter.opId,
               brandId: dataFilter.brandId,
               type: '',
               secretKey: '',
               endpoint: '',
               order: 0,
               enableToDeposit: false,
               enableToWithdarw: false,
               visibleForOperator: false,
               withdrawLimitByCurrency: {},
               depositRateByCurrency: {},
               withdrawRateByCurrency: {},
               withdrawFeeByCurrency: {},
               depositLimitByCurrency: {},
               maxNumberOfWithdrawalsPerDay: 0,
               maxNumberOfWithdrawalsPerWeek: 0,
               maxNumberOfWithdrawalsPerMonth: 0,
            })
         }
      }
   }, [configDataCPG, gatewayName])

   useEffect(() => {
      if ([UserScope.ADMIN, UserScope.SUPERADMIN].includes(user?.scope)) {
         setData(dataAdmin)
      } else if (user?.scope === UserScope.OPERATOR) {
         const dataInfo: {
            name: PaymentGatewayName
            title: string
            description: string
            types: string[]
         }[] = Object.keys(dataActive).map((item: string) => {
            return {
               name: item as PaymentGatewayName,
               title: dataActive[item as PaymentGatewayName]?.title as string,
               description: dataActive[item as PaymentGatewayName]
                  ?.description as string,
               types: dataActive[item as PaymentGatewayName]?.types as string[],
            }
         })

         setData({
            count: dataInfo.length,
            paymentsGateway: dataInfo,
         })
      } else {
         const dataInfo: {
            name: PaymentGatewayName
            title: string
            description: string
            types: string[]
         }[] = Object.keys(dataActiveBrand).map((item: string) => {
            return {
               name: item as PaymentGatewayName,
               title: dataActiveBrand[item as PaymentGatewayName]
                  ?.title as string,
               description: dataActiveBrand[item as PaymentGatewayName]
                  ?.description as string,
               types: dataActiveBrand[item as PaymentGatewayName]
                  ?.types as string[],
            }
         })
         setData({
            count: dataInfo.length,
            paymentsGateway: dataInfo,
         })
      }
   }, [dataAdmin, dataActive, dataActiveBrand])

   return (
      <Box
         className="dataGridWrapper"
         mb={'0px'}
         px={isLgUp ? '12px' : '4px'}
         py={isDesktop ? '12px' : '6px'}
         sx={{
            height: PageWith2Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            sx={GridStyle}
            rowHeight={isDesktop ? 44 : 30}
            getRowId={(row) => row.name}
            rows={data?.paymentsGateway || []}
            paginationMode="server"
            sortingMode="server"
            rowCount={rowCountState | 0}
            columns={columns}
            disableRowSelectionOnClick
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 30, 40, 50, 100]}
            sortingOrder={['desc', 'asc']}
            onSortModelChange={handleSortModelChange}
            loading={loadingPaymentsGateway}
            getRowClassName={(params) =>
               params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            columnVisibilityModel={{
               ...columnVisibilityModel,
            }}
            onColumnVisibilityModelChange={(newModel) =>
               setColumnVisibilityModel(newModel)
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
            open={open}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
            key={keyDate}
            aria-describedby="alert-dialog-slide-description"
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
               mb={'6px'}
            >
               <Grid item>
                  <Typography variant="h5" gutterBottom display="inline">
                     Edit Config {gatewayName} Gateway
                  </Typography>
               </Grid>
               <Grid item xs></Grid>
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleClose}
                     cursor={'pointer'}
                  />
               </Grid>
            </Grid>
            <EditLimitCurrency
               data={initialValues?.withdrawLimitByCurrency || {}}
               currencies={
                  paymentGatewayCurrencies.validCurrenciesToWithdraw || []
               }
               setWithdrawLimitByCurrency={setWithdrawLimitByCurrency}
               title="Withdraw limit by currency"
               key={'test1'}
            />
            {initialValues.gatewayName === PaymentGatewayName.CPG && (
               <EditLimitCurrency
                  data={initialValues?.depositLimitByCurrency || {}}
                  currencies={
                     paymentGatewayCurrencies.validCurrenciesToDeposit || []
                  }
                  setWithdrawLimitByCurrency={setDepositLimitByCurrency}
                  title="Deposit limit by currency"
               />
            )}
            <WithdrawFeeCurrency
               data={initialValues?.withdrawFeeByCurrency || {}}
               currencies={
                  paymentGatewayCurrencies.validCurrenciesToWithdraw || []
               }
               setWithdrawFeeByCurrency={setWithdrawFeeByCurrency}
               title="Withdraw fee by currency"
            />
            {initialValues.gatewayName === PaymentGatewayName.JB && (
               <>
                  <Packages
                     data={initialValues?.depositPackages || []}
                     setPackages={setDepositPackages}
                     title={'Deposit packages'}
                  />
                  <Packages
                     data={initialValues?.withdrawPackages || []}
                     setPackages={setWithdrawPackages}
                     title={'Withdraw packages'}
                  />
                  <CustomBankNames
                     data={initialValues?.bankNames || []}
                     setBankNames={setBankNames}
                     title={'Bank Names'}
                  />
               </>
            )}
            {initialValues.gatewayName === PaymentGatewayName.CPG && (
               <>
                  <RateCurrency
                     data={initialValues?.depositRateByCurrency || {}}
                     currencies={
                        paymentGatewayCurrencies.validCurrenciesToDeposit || []
                     }
                     setWithdrawRateByCurrency={setDepositRateByCurrency}
                     title="Deposit Rate by currency"
                  />
                  <RateCurrency
                     data={initialValues?.withdrawRateByCurrency || {}}
                     currencies={
                        paymentGatewayCurrencies.validCurrenciesToWithdraw || []
                     }
                     setWithdrawRateByCurrency={setWithdrawRateByCurrency}
                     title="Withdraw rate by currency"
                  />
               </>
            )}
            <Formik
               initialValues={initialValues}
               enableReinitialize={true}
               onSubmit={handleSubmitMethods}
               validationSchema={Yup.object().shape({
                  type: Yup.string().when(
                     ['gatewayName'],
                     ([gatewayName], schema) => {
                        if (
                           gatewayName === PaymentGatewayName.PW ||
                           gatewayName === PaymentGatewayName.JB
                        )
                           return Yup.string().required('type is required')
                        return schema
                     }
                  ),
                  maxNumberOfWithdrawalsPerDay: Yup.number().required(
                     'Max number of withdrawals per day is required'
                  ),
                  maxNumberOfWithdrawalsPerWeek: Yup.number()
                     .required('Max number of withdrawals per week is required')
                     .test(
                        'is-greater-than-maxNumberOfWithdrawalsPerDay',
                        'max number of withdrawals per week should be greater or equal than max number of withdrawals per day ',
                        function (value) {
                           const { maxNumberOfWithdrawalsPerDay } = this.parent
                           return (
                              !maxNumberOfWithdrawalsPerDay ||
                              !value ||
                              maxNumberOfWithdrawalsPerDay <= value
                           )
                        }
                     ),
                  maxNumberOfWithdrawalsPerMonth: Yup.number()
                     .required(
                        'Max number of withdrawals per month is required'
                     )
                     .test(
                        'is-greater-than-maxNumberOfWithdrawalsPerWeek',
                        'max number of withdrawals per month should be greater or equal than max number of withdrawals per week ',
                        function (value) {
                           const { maxNumberOfWithdrawalsPerWeek } = this.parent
                           return (
                              !maxNumberOfWithdrawalsPerWeek ||
                              !value ||
                              maxNumberOfWithdrawalsPerWeek <= value
                           )
                        }
                     ),
                  currency: Yup.string().when(
                     ['gatewayName'],
                     ([gatewayName], schema) => {
                        if (gatewayName === PaymentGatewayName.PW)
                           return Yup.string().required('Currency is required')
                        return schema
                     }
                  ),
                  endpoint: Yup.string().when(
                     ['gatewayName'],
                     ([gatewayName], schema) => {
                        if (gatewayName === PaymentGatewayName.PW)
                           return Yup.string().required('Endpoint is required')
                        return schema
                     }
                  ),
                  userlevel: Yup.string().when(
                     ['gatewayName'],
                     ([gatewayName], schema) => {
                        if (gatewayName === PaymentGatewayName.PW)
                           return Yup.string().required(
                              'User level is required'
                           )
                        return schema
                     }
                  ),
                  secretKey: Yup.string().when(
                     ['gatewayName'],
                     ([gatewayName], schema) => {
                        if (
                           gatewayName === PaymentGatewayName.PW ||
                           gatewayName === PaymentGatewayName.JB
                        )
                           return Yup.string().required(
                              'Secret key is required'
                           )
                        return schema
                     }
                  ),
               })}
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
                  <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                     {gatewayName === PaymentGatewayName.JB && (
                        <FormControl
                           component="fieldset"
                           variant="standard"
                           fullWidth
                        >
                           <FormGroup>
                              <FormControlLabel
                                 sx={{
                                    width: 'max-content',
                                 }}
                                 control={
                                    <Checkbox
                                       checked={Boolean(values.ibanIsRequired)}
                                       onChange={handleChange}
                                       name="ibanIsRequired"
                                    />
                                 }
                                 label="Iban is required"
                              />
                           </FormGroup>
                        </FormControl>
                     )}
                     {gatewayName === PaymentGatewayName.JB && (
                        <FormControl
                           component="fieldset"
                           variant="standard"
                           fullWidth
                        >
                           <FormGroup>
                              <FormControlLabel
                                 sx={{
                                    width: 'max-content',
                                 }}
                                 control={
                                    <Checkbox
                                       checked={Boolean(
                                          values.bankNameIsRequired
                                       )}
                                       onChange={handleChange}
                                       name="bankNameIsRequired"
                                    />
                                 }
                                 label="Bank name is required"
                              />
                           </FormGroup>
                        </FormControl>
                     )}
                     {gatewayName !== PaymentGatewayName.CPG && (
                        <TextField
                           name="secretKey"
                           label="Secret key "
                           type={showPassword ? 'text' : 'text'}
                           value={values.secretKey}
                           error={Boolean(
                              touched.secretKey && errors.secretKey
                           )}
                           InputProps={{
                              autoComplete: 'off',
                              'aria-autocomplete': 'none',
                           }}
                           helperText={touched.secretKey && errors.secretKey}
                           autoComplete="off"
                           fullWidth
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                     )}
                     {gatewayName !== PaymentGatewayName.CPG && (
                        <TextField
                           name="type"
                           label="Type "
                           type="text"
                           value={values.type}
                           error={Boolean(touched.type && errors.type)}
                           helperText={touched.type && errors.type}
                           autoComplete="off"
                           fullWidth
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                     )}
                     {gatewayName === PaymentGatewayName.PW && (
                        <TextField
                           name="currency"
                           label="Currency "
                           type="text"
                           value={values.currency}
                           error={Boolean(touched.currency && errors.currency)}
                           helperText={touched.currency && errors.currency}
                           autoComplete="off"
                           fullWidth
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                     )}
                     {gatewayName !== PaymentGatewayName.CPG && (
                        <TextField
                           name="endpoint"
                           label="Endpoint"
                           type="text"
                           value={values.endpoint}
                           error={Boolean(touched.endpoint && errors.endpoint)}
                           InputProps={{
                              autoComplete: 'off',
                              'aria-autocomplete': 'none',
                           }}
                           autoComplete="off"
                           helperText={touched.endpoint && errors.endpoint}
                           fullWidth
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                     )}
                     {gatewayName === PaymentGatewayName.PW && (
                        <TextField
                           name="userlevel"
                           label="User level "
                           type="text"
                           value={values.userlevel}
                           error={Boolean(
                              touched.userlevel && errors.userlevel
                           )}
                           helperText={touched.userlevel && errors.userlevel}
                           autoComplete="off"
                           fullWidth
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                     )}
                     <TextField
                        name="maxNumberOfWithdrawalsPerDay"
                        label="Max number of withdrawals per day"
                        type="number"
                        value={values.maxNumberOfWithdrawalsPerDay}
                        error={Boolean(
                           touched.maxNumberOfWithdrawalsPerDay &&
                              errors.maxNumberOfWithdrawalsPerDay
                        )}
                        helperText={
                           touched.maxNumberOfWithdrawalsPerDay &&
                           errors.maxNumberOfWithdrawalsPerDay
                        }
                        inputProps={{
                           inputMode: 'numeric', // Indicates numeric input
                           pattern: '[0-9]*', // Allows only digits
                           min: 0, // Minimum value
                        }}
                        autoComplete="off"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                     />
                     <TextField
                        name="maxNumberOfWithdrawalsPerWeek"
                        label="Max number of withdrawals per week"
                        type="number"
                        value={values.maxNumberOfWithdrawalsPerWeek}
                        error={Boolean(
                           touched.maxNumberOfWithdrawalsPerWeek &&
                              errors.maxNumberOfWithdrawalsPerWeek
                        )}
                        helperText={
                           touched.maxNumberOfWithdrawalsPerWeek &&
                           errors.maxNumberOfWithdrawalsPerWeek
                        }
                        inputProps={{
                           inputMode: 'numeric', // Indicates numeric input
                           pattern: '[0-9]*', // Allows only digits
                           min: 0, // Minimum value
                        }}
                        autoComplete="off"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                     />
                     <TextField
                        name="maxNumberOfWithdrawalsPerMonth"
                        label="Max number of withdrawals per month"
                        type="number"
                        value={values.maxNumberOfWithdrawalsPerMonth}
                        error={Boolean(
                           touched.maxNumberOfWithdrawalsPerMonth &&
                              errors.maxNumberOfWithdrawalsPerMonth
                        )}
                        helperText={
                           touched.maxNumberOfWithdrawalsPerMonth &&
                           errors.maxNumberOfWithdrawalsPerMonth
                        }
                        inputProps={{
                           inputMode: 'numeric', // Indicates numeric input
                           pattern: '[0-9]*', // Allows only digits
                           min: 0, // Minimum value
                        }}
                        autoComplete="off"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                     />
                     <FormControl
                        component="fieldset"
                        variant="standard"
                        fullWidth
                     >
                        <FormGroup>
                           <FormControlLabel
                              sx={{
                                 width: 'max-content',
                              }}
                              control={
                                 <Checkbox
                                    checked={Boolean(values.visibleForOperator)}
                                    onChange={handleChange}
                                    name="visibleForOperator"
                                 />
                              }
                              label="Visible"
                           />
                        </FormGroup>
                     </FormControl>
                     <FormControl
                        component="fieldset"
                        variant="standard"
                        fullWidth
                     >
                        <FormGroup>
                           <FormControlLabel
                              sx={{
                                 width: 'max-content',
                              }}
                              control={
                                 <Checkbox
                                    checked={Boolean(values.enableToDeposit)}
                                    onChange={handleChange}
                                    name="enableToDeposit"
                                 />
                              }
                              label="Enable to deposit"
                           />
                        </FormGroup>
                     </FormControl>
                     <FormControl
                        component="fieldset"
                        variant="standard"
                        fullWidth
                     >
                        <FormGroup>
                           <FormControlLabel
                              sx={{
                                 width: 'max-content',
                              }}
                              control={
                                 <Checkbox
                                    checked={Boolean(values.enableToWithdarw)}
                                    onChange={handleChange}
                                    name="enableToWithdarw"
                                 />
                              }
                              label="Enable to withdraw"
                           />
                        </FormGroup>
                     </FormControl>
                     <DialogActions>
                        <Button
                           onClick={handleClose}
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
                           sx={{ height: 32 }}
                        >
                           Save
                        </Button>
                     </DialogActions>
                  </form>
               )}
            </Formik>
         </Dialog>
         <Dialog
            open={openCurrencies}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="form-dialog-title"
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
               mb={'6px'}
            >
               <Grid item>
                  <Typography variant="h5" gutterBottom display="inline">
                     Payment gateway currencies {gatewayName}
                  </Typography>
               </Grid>
               <Grid item xs></Grid>
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={hanldeCloseCurrencies}
                     cursor={'pointer'}
                  />
               </Grid>
            </Grid>
            {dataFilter.opId && dataFilter.brandId && gatewayName && (
               <DialogContent sx={{ p: 1 }}>
                  <Formik
                     initialValues={{
                        opId: dataFilter.opId,
                        brandId: dataFilter.brandId,
                        paymentGatewayName: gatewayName,
                        validCurrenciesToDeposit:
                           paymentGatewayCurrencies?.validCurrenciesToDeposit as string[],
                        validCurrenciesToWithdraw:
                           paymentGatewayCurrencies?.validCurrenciesToWithdraw as string[],
                     }}
                     enableReinitialize={true}
                     validationSchema={Yup.object().shape({
                        opId: Yup.string().required('Operator Id  is required'),
                        brandId: Yup.string().required('brand Id  is required'),
                        paymentGatewayName: Yup.string().required(
                           'Gateway Name is required'
                        ),
                     })}
                     onSubmit={handleGatewayPaymentCurrencies}
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
                                 '.MuiFormLabel-root.Mui-focused, .MuiFormLabel-root.MuiInputLabel-shrink':
                                    {
                                       top: '12px',
                                    },
                                 '.MuiInputBase-root ': {
                                    '.MuiButtonBase-root': {
                                       p: 0,
                                       height: '16px',
                                       position: 'relative',
                                       top: '4px',
                                       svg: {
                                          width: '12px',
                                          color: (props) =>
                                             props.palette.primary.dark,
                                       },
                                    },
                                 },
                              }}
                           >
                              <Autocomplete
                                 onChange={(e, value) =>
                                    setFieldValue(
                                       'validCurrenciesToDeposit',
                                       value
                                    )
                                 }
                                 options={currenciesInit?.map(
                                    (item) => item.currency
                                 )}
                                 multiple
                                 defaultValue={values.validCurrenciesToDeposit}
                                 getOptionLabel={(option) => option as string}
                                 // popupIcon={
                                 //    <FontAwesomeIcon
                                 //       icon={faAngleDown as IconProp}
                                 //       size="sm"
                                 //    />
                                 // }
                                 sx={{
                                    '.MuiAutocomplete-input': {
                                       cursor: 'pointer',
                                    },
                                 }}
                                 renderInput={(params) => (
                                    <TextField
                                       {...params}
                                       label="Deposit Currencies"
                                       name={`validCurrenciesToDeposit`}
                                       id={`validCurrenciesToDeposit`}
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
                           <FormControl
                              sx={{
                                 width: '100%',
                                 '.MuiFormLabel-root.Mui-focused, .MuiFormLabel-root.MuiInputLabel-shrink':
                                    {
                                       top: '12px',
                                    },
                                 '.MuiInputBase-root .MuiButtonBase-root': {
                                    p: 0,
                                    height: '16px',
                                    position: 'relative',
                                    top: '4px',
                                    svg: {
                                       width: '12px',
                                       color: (props) =>
                                          props.palette.primary.dark,
                                    },
                                 },
                              }}
                           >
                              <Autocomplete
                                 onChange={(e, value) =>
                                    setFieldValue(
                                       'validCurrenciesToWithdraw',
                                       value
                                    )
                                 }
                                 options={currenciesInit?.map(
                                    (item) => item.currency
                                 )}
                                 multiple
                                 defaultValue={values.validCurrenciesToWithdraw}
                                 getOptionLabel={(option) => option as string}
                                 sx={{
                                    '.MuiAutocomplete-input': {
                                       cursor: 'pointer',
                                    },
                                 }}
                                 // popupIcon={
                                 //    <FontAwesomeIcon
                                 //       icon={faAngleDown as IconProp}
                                 //       size="sm"
                                 //    />
                                 // }
                                 renderInput={(params) => (
                                    <TextField
                                       {...params}
                                       label="Withdraw Currencies"
                                       name={`validCurrenciesToWithdraw`}
                                       id={`validCurrenciesToWithdraw`}
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
                           <DialogActions>
                              <Button
                                 onClick={hanldeCloseCurrencies}
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
            )}
         </Dialog>
         <Dialog
            open={openActivePayment}
            onClose={handleCloseActivePayments}
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
            <DialogTitle id="form-dialog-title">
               {dataFilter.brandId
                  ? dataActiveBrand &&
                    dataActiveBrand[gatewayName as PaymentGatewayName]
                     ? 'Inactive'
                     : 'Active'
                  : dataActive && dataActive[gatewayName as PaymentGatewayName]
                  ? 'Inactive'
                  : 'Active'}{' '}
               payment gateway
            </DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to{' '}
                  {dataFilter.brandId
                     ? dataActiveBrand &&
                       dataActiveBrand[gatewayName as PaymentGatewayName]
                        ? 'deactivate'
                        : 'activate'
                     : dataActive &&
                       dataActive[gatewayName as PaymentGatewayName]
                     ? 'deactivate'
                     : 'activate'}{' '}
                  {gatewayName} payment gateway?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleCloseActivePayments}
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
                  onClick={updateStatusActivePayments}
               >
                  Confirm
               </Button>
            </DialogActions>
         </Dialog>
      </Box>
   )
}
