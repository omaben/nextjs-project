import SelectTheme from '@/components/SelectTheme'
import GridStyle from '@/components/custom/GridStyle'
import { renderPaymentStatusCell } from '@/components/custom/PortalRenderCells'
import TransitionSlide from '@/components/custom/TransitionSlide'
import {
   PaymentGateway,
   PaymentGatewayName,
   SetActivePaymentGatewaysDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { SetCpgPaymentGatewayDto } from '@alienbackoffice/back-front/lib/operator/dto/set-cpg-payment-gateway.dto'
import { SetJbPaymentGatewayDto } from '@alienbackoffice/back-front/lib/operator/dto/set-jb-payment-gateway.dto'
import { SetPwPaymentGatewayDto } from '@alienbackoffice/back-front/lib/operator/dto/set-pw-payment-gateway.dto'
import {
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
   selectAuthPaymentCPGGatewayOperator,
   selectAuthPaymentGatewayOperator,
   selectAuthPaymentJBGatewayOperator,
   selectAuthPaymentsGateway,
} from 'redux/authSlice'
import { selectLoadingPaymentsGateway } from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith3Toolbar,
   PageWith4Toolbar,
} from 'services/globalFunctions'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'
import {
   UseGetPaymentsListBrandQueryProps,
   UseGetPaymentsListQueryProps,
   useGetActivePaymentsListQuery,
   useGetPaymentsListQuery,
   useSetCPGPaymentGatewayMutation,
   useSetJBPaymentGatewayMutation,
   useSetPWPaymentGatewayMutation,
} from './lib/hooks/queries'

export default function ActivePaymentGatewayData(
   dataFilter: UseGetPaymentsListBrandQueryProps
) {
   const [dataSort, setDataSort]: any = React.useState({
      createdAt: -1,
   })
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const loadingPaymentsGateway = useSelector(selectLoadingPaymentsGateway)
   const [open, setOpen] = React.useState(false)
   const [keyDate, setKeyDate] = React.useState(0)
   const [Transition, setTransition]: any = React.useState()
   const [gatewayName, setGatewayName]: any = React.useState()
   const [initialValues, setInitialValues]: any = React.useState({
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
   })
   const configData = useSelector(selectAuthPaymentGatewayOperator)
   const configDataJB = useSelector(selectAuthPaymentJBGatewayOperator)
   const configDataCPG = useSelector(selectAuthPaymentCPGGatewayOperator)
   const boClient = useSelector(selectBoClient)
   const [openActivePayment, setOpenActivePayment] = React.useState(false)
   const [withdrawLimitByCurrencyValues, setWithdrawLimitByCurrencyValues] =
      React.useState({})
   const [depositLimitByCurrencyValues, setDepositLimitByCurrencyValues] =
      React.useState({})
   const [withdrawFeeByCurrencyValues, setWithdrawFeeByCurrencyValues] =
      React.useState({})
   const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm')
   const [fullWidth, setFullWidth] = React.useState(true)
   const post: UseGetPaymentsListQueryProps = {
      key: 'list',
   }
   useGetPaymentsListQuery(post)
   const data = useSelector(selectAuthPaymentsGateway)

   const postActive: UseGetPaymentsListBrandQueryProps = {
      key: 'brand',
      opId: dataFilter.opId,
   }
   if (dataFilter.brandId) {
      postActive.brandId = dataFilter.brandId
   }
   useGetActivePaymentsListQuery(postActive)
   const dataActive = useSelector(selectAuthActivePaymentGatewayBrand) as {
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
      {
         actiondata.push(
            {
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
            },
            {
               value: '1',
               label: (
                  <Typography
                     variant="bodySmallBold"
                     sx={{
                        svg: { position: 'relative', top: '3px', mr: '15px' },
                        flex: 1,
                     }}
                  >
                     {dataActive && Object.keys(dataActive).includes(data.name)
                        ? 'Inactive'
                        : 'Active'}
                  </Typography>
               ),
               onClick: () => handleClickOpenActivePayment(data.name),
            }
         )
      }
      if (
         dataActive &&
         Object.keys(dataActive).includes(data.name) &&
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
      return actiondata
   }
   const columns: GridColDef[] = [
      {
         field: 'name',
         headerName: 'Gateway',
         renderCell: (params) => params.value,
         minWidth: 120,
         filterable: false,
         sortable: false,
         flex: 1,
      },
      {
         field: 'title',
         headerName: 'Title',
         renderCell: (params) => params.value,
         minWidth: 120,
         filterable: false,
         sortable: false,
         flex: 1,
      },
      {
         field: 'description',
         headerName: 'Description',
         minWidth: 100,
         renderCell: (params) => params.value,
         sortable: false,
         flex: 1,
      },
      {
         field: 'types',
         headerName: 'Types',
         minWidth: 100,
         renderCell: (params) => params.value,
         sortable: false,
         flex: 1,
      },
      {
         field: 'status',
         headerName: 'Status',
         minWidth: 100,
         renderCell: (params) =>
            dataActive &&
            renderPaymentStatusCell(
               Object.keys(dataActive).includes(params.row.name)
            ),
         sortable: false,
         flex: 1,
      },
      {
         field: 'actions',
         headerName: '',
         renderCell: (params) => {
            if (
               dataFilter.opId &&
               [
                  PaymentGatewayName.PW,
                  PaymentGatewayName.JB,
                  PaymentGatewayName.CPG,
               ].includes(params.row.name)
            )
               return (
                  <Box className="showOnHover">
                     <SelectTheme
                        noPadd={true}
                        icon={''}
                        data={Actions(params.row)}
                        value={action}
                     />
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

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         let data = {}
         setDataSort(data)
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
   }

   const handleClose = async () => {
      setKeyDate(keyDate + 1)
      await setTransition(TransitionSlide)
      setOpen(false)
      setWithdrawLimitByCurrencyValues({})
      setWithdrawFeeByCurrencyValues({})
   }

   const { mutate } = useSetPWPaymentGatewayMutation({
      onSuccess: () => {
         toast.success('You update PW gateway payment Successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         handleClose()
      },
   })

   const { mutate: mutateJB } = useSetJBPaymentGatewayMutation({
      onSuccess: () => {
         toast.success('You update JB gateway payment Successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         handleClose()
      },
   })

   const { mutate: mutateCPG } = useSetCPGPaymentGatewayMutation({
      onSuccess: () => {
         toast.success('You update CPG gateway payment Successfully', {
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
                  bankNameIsRequired: false,
                  ibanIsRequired: false,
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
         withdrawFeeByCurrencyValues,
         depositLimitByCurrencyValues,
      ]
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
      const data = {
         [PaymentGatewayName.CPG]:
            gatewayName === PaymentGatewayName.CPG
               ? !dataActive[gatewayName as PaymentGatewayName]
               : Object.keys(dataActive).findIndex(
                    (item) => item === PaymentGatewayName.CPG
                 ) > -1,
         [PaymentGatewayName.PW]:
            gatewayName === PaymentGatewayName.PW
               ? !dataActive[gatewayName as PaymentGatewayName]
               : Object.keys(dataActive).findIndex(
                    (item) => item === PaymentGatewayName.PW
                 ) > -1,
         [PaymentGatewayName.JB]:
            gatewayName === PaymentGatewayName.JB
               ? !dataActive[gatewayName as PaymentGatewayName]
               : Object.keys(dataActive).findIndex(
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
               type: 'brand',
               sessionId: sessionStorage.getItem('sessionId'),
               event: UserPermissionEvent.BACKOFFICE_SET_ACTIVE_PAYMENT_GATEWAYS_REQ,
            },
         }
      )
      handleCloseActivePayments()
   }

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
               withdrawLimitByCurrency: configData.withdrawLimitByCurrency,
               withdrawFeeByCurrency: configData.withdrawFeeByCurrency,
            })
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
               order: configDataJB.order,
               enableToDeposit: configDataJB.enableToDeposit,
               enableToWithdarw: configDataJB.enableToWithdraw,
               visibleForOperator: configDataJB.visible,
               withdrawLimitByCurrency: configDataJB.withdrawLimitByCurrency,
               withdrawFeeByCurrency: configDataJB.withdrawFeeByCurrency,
            })
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
               withdrawFeeByCurrency: {},
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
               withdrawLimitByCurrency: configDataCPG.withdrawLimitByCurrency,
               depositLimitByCurrency:
                  configDataCPG?.config?.depositLimitByCurrency || {},
               withdrawFeeByCurrency: configDataCPG.withdrawFeeByCurrency,
            })
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
               depositLimitByCurrency: {},
               withdrawFeeByCurrency: {},
            })
         }
      }
   }, [configDataCPG, gatewayName])

   React.useEffect(() => {
      setRowCountState((prevRowCountState: any) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      )
   }, [data?.count, setRowCountState])

   return (
      <Box
         className="dataGridWrapper"
         mb={'0px'}
         px={isLgUp ? '12px' : '4px'}
         py={'6px'}
         pt={0}
         sx={{
            height: isDesktop ? PageWith4Toolbar : PageWith3Toolbar,
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
            sx={{
               '.MuiDialog-container': {
                  alignItems: 'end',
                  justifyContent: 'end',
               },
               '.MuiPaper-root': {
                  width: '600px',
                  padding: '25px',
               },
            }}
         >
            <Typography variant="h3" gutterBottom display="inline">
               Edit Config{' '}
               <Typography
                  variant="bodySmallBold"
                  component={'span'}
                  color={theme.palette.success.light}
               >
                  {gatewayName}
               </Typography>{' '}
               Gateway
            </Typography>

            <Typography variant="bodyBold">
               Withdraw limit by currency
            </Typography>
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
                  order: Yup.string().required('Order is required'),
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
                     <Box sx={{ flexGrow: 1, paddingTop: 0 }} mt={5}>
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
                              sx={{ mb: 5 }}
                           />
                        )}
                        {gatewayName === PaymentGatewayName.PW && (
                           <TextField
                              name="currency"
                              label="Currency "
                              type="text"
                              value={values.currency}
                              error={Boolean(
                                 touched.currency && errors.currency
                              )}
                              helperText={touched.currency && errors.currency}
                              autoComplete="off"
                              fullWidth
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                              sx={{ mb: 5 }}
                           />
                        )}
                        {gatewayName !== PaymentGatewayName.CPG && (
                           <TextField
                              name="endpoint"
                              label="Endpoint "
                              type="text"
                              value={values.endpoint}
                              error={Boolean(
                                 touched.endpoint && errors.endpoint
                              )}
                              helperText={touched.endpoint && errors.endpoint}
                              autoComplete="off"
                              fullWidth
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                              sx={{ mb: 5 }}
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
                              sx={{ mb: 5 }}
                           />
                        )}
                        {gatewayName !== PaymentGatewayName.CPG && (
                           <TextField
                              name="secretKey"
                              label="Secret key "
                              type="text"
                              value={values.secretKey}
                              error={Boolean(
                                 touched.secretKey && errors.secretKey
                              )}
                              helperText={touched.secretKey && errors.secretKey}
                              autoComplete="off"
                              fullWidth
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                              sx={{ mb: 5 }}
                           />
                        )}
                        <TextField
                           name="order"
                           label="Order"
                           type="number"
                           value={values.order}
                           error={Boolean(touched.order && errors.order)}
                           helperText={touched.order && errors.order}
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
                           sx={{ mb: 5 }}
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
                                       checked={Boolean(
                                          values.visibleForOperator
                                       )}
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
                                       checked={Boolean(
                                          values.enableToWithdarw
                                       )}
                                       onChange={handleChange}
                                       name="enableToWithdarw"
                                    />
                                 }
                                 label="Enable to withdraw"
                              />
                           </FormGroup>
                        </FormControl>
                     </Box>
                     <DialogActions>
                        <Button onClick={handleClose} color="error">
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
         </Dialog>

         <Dialog
            open={openActivePayment}
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
               {dataActive && dataActive[gatewayName as PaymentGatewayName]
                  ? 'Inactive'
                  : 'Active'}{' '}
               payment gateway
            </DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to{' '}
                  {dataActive && dataActive[gatewayName as PaymentGatewayName]
                     ? 'inactive'
                     : 'active'}{' '}
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
