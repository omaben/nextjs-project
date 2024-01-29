import SelectTheme from '@/components/SelectTheme'
import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import {
   renderAmountCell,
   renderBetAmountCell,
   renderCurrencyCell,
   renderPlayerStatusCell,
   renderTestStatusCell,
   renderTimeCell,
   RenderTransactionStatusCell,
   renderTransactionTypeCell,
} from '@/components/custom/PortalRenderCells'
import TransitionSlide from '@/components/custom/TransitionSlide'
import {
   IntegrationType,
   Operator,
   SetWithdrawStatusDto,
   Transaction,
   TransactionStatus,
   TransactionType,
   User,
   UserPermissionEvent,
   UserScope,
   ValidatePaymentDto,
} from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faCircleArrowRight,
   faCopy,
   faRectangleXmark,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TabContext, TabList, TabPanel } from '@mui/lab'
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
   Tab,
   Table,
   TableBody,
   TableCell,
   TableRow,
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
import dynamic from 'next/dynamic'
import React, { MouseEventHandler, useState } from 'react'
import { Check } from 'react-feather'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   selectAuthCurrentBrand,
   selectAuthCurrentOperator,
   selectAuthOperator,
   selectAuthTransactionList,
   selectAuthUser,
} from 'redux/authSlice'
import { selectLoadingTransactionList } from 'redux/loadingSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith5Toolbar,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import {
   UseGetTransactionListQueryProps,
   useDepositStatusMutation,
   useGetTransactionListQuery,
   useWithdrawStatusMutation,
} from './lib/hooks/queries'

export default function Transactions(dataFilter: {
   playerId?: string
   nickname?: string
   txId?: string
   fromCurrency?: string
   toCurrency?: string
   fromAmount?: number
   toAmount?: number
   type?: any
   types?: TransactionType[]
   isTest?: string
   isFun?: string
   opId: string
   refresh?: number
   from?: number
   to?: number
   status?: any
   excludePendingDeposit?: boolean
   brandId?: string
   gateway?: string
   destinationAddress?: string
   iban?: string
   bankName?: string
   autoRefresh?: number
}) {
   const [boxRefrech, setBoxRefrech] = React.useState(0)
   const [dataSort, setDataSort]: any = React.useState({
      createdAt: -1,
   })
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const opId = useSelector(selectAuthOperator)
   const operator = useSelector(selectAuthCurrentOperator) as Operator
   const currenctBrandId = useSelector(selectAuthCurrentBrand)
   const data = useSelector(selectAuthTransactionList)
   const [action, setAction] = React.useState(0)
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm')
   const [fullWidth, setFullWidth] = React.useState(true)
   const user = useSelector(selectAuthUser) as User
   const loadingTransactionList = useSelector(selectLoadingTransactionList)
   const [Transition, setTransition]: any = React.useState()
   const [transactionDetails, setTransactionDetails]: Transaction | any =
      React.useState({})
   const [open, setOpen] = React.useState(false)
   const [note, setNote] = React.useState('')
   const [value, setValue] = React.useState('detail')
   const [openUpdateStatus, setOpenUpdateStatus] = React.useState(false)
   const [openDepositStatus, setOpenDepositStatus] = React.useState(false)
   const [transactionStatus, setTransactionStatus] = React.useState(
      TransactionStatus.PENDING
   )
   const [currentTransaction, setCurrentTransaction] = React.useState(
      {} as Transaction
   )
   const columns: GridColDef[] = [
      {
         field: 'txId',
         headerName: 'ID',
         renderCell: (params) => (
            <PortalCopyValue value={params.value} hideText />
         ),
         hideable: false,
         headerAlign: 'left',
         align: 'left',
         width: 50,
      },
      {
         field: 'createdAt',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Date/Time',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
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
         flex: 1,
         hideable: false,
         minWidth: 120,
      },
      {
         field: 'fromAmount',
         headerName: 'Amount',
         headerAlign: 'center',
         align: 'left',
         renderCell: (params) =>
            params.row.fromAmount === params.row.toAmount ? (
               renderBetAmountCell(
                  params.row.fromAmount,
                  params.row.fromCurrency
               )
            ) : (
               <>
                  {renderBetAmountCell(
                     params.row.fromAmount,
                     params.row.fromCurrency
                  )}
                  <FontAwesomeIcon
                     icon={faCircleArrowRight as IconProp}
                     color={darkPurple[9]}
                     fontSize={'10px'}
                     style={{
                        marginLeft: '5px',
                        marginRight: '5px',
                     }}
                  />
                  {renderBetAmountCell(
                     params.row.toAmount,
                     params.row.toCurrency
                  )}
               </>
            ),
         flex: 1,
         minWidth: 150,
      },
      {
         field: 'fromCurrency',
         headerName: 'Currency',
         headerAlign: 'center',
         align: 'left',
         renderCell: (params) =>
            params.row.fromCurrency === params.row.toCurrency ? (
               renderCurrencyCell(params.row.toCurrency)
            ) : (
               <>
                  {renderCurrencyCell(params.row.fromCurrency)}
                  <FontAwesomeIcon
                     icon={faCircleArrowRight as IconProp}
                     color={darkPurple[9]}
                     fontSize={'10px'}
                     style={{
                        marginLeft: '5px',
                        marginRight: '5px',
                     }}
                  />
                  {renderCurrencyCell(params.row.toCurrency)}
               </>
            ),
         minWidth: 140,
         filterable: false,
         flex: 1,
      },
      {
         field: 'isTest',
         headerName: 'Test',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderTestStatusCell(params.row.player?.isTest),
         minWidth: 80,
         flex: 1,
      },
      {
         field: 'gateway',
         headerName: 'Gateway',
         headerAlign: 'center',
         align: 'center',
         minWidth: 80,
         renderCell: (params) => params.value,
         flex: 1,
         sortable: false,
      },
      {
         field: 'transactionType',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Type',
         minWidth: 100,
         renderCell: (params) => renderTransactionTypeCell(params.value),
         flex: 1,
      },
      {
         field: 'destination',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Destination',
         renderCell: (params) => (
            <PortalCopyValue
               value={params.row?.bankInfo?.destinationCard}
               hideText
            />
         ),
         minWidth: 80,
         flex: 1,
         sortable: false,
      },
      {
         field: 'iban',
         headerName: 'Iban',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => (
            <PortalCopyValue value={params.row?.bankInfo?.iban} hideText />
         ),
         hideable: false,
         width: 50,
         sortable: false,
      },
      {
         field: 'bankName',
         headerName: 'Bank Name',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => (
            <PortalCopyValue
               value={params.row?.bankInfo?.bankName}
               sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  maxWidth: '100px',
                  position: 'relative',
               }}
            />
         ),
         hideable: false,
         width: 100,
         sortable: false,
      },
      {
         field: 'status',
         headerName: 'Status',
         headerAlign: 'center',
         align: 'center',
         minWidth: 100,
         renderCell: (params) =>
            RenderTransactionStatusCell({
               status: params.value,
               transactionType: params.row.transactionType,
               openDetails: () => {
                  handleClickOpen(params.row)
               },
            }),
         flex: 1,
      },
      {
         field: 'actions',
         headerName: '',
         renderCell: (params) => {
            if (
               operator?.integrationType === IntegrationType.ALIEN_STANDALONE &&
               params.row.status === TransactionStatus.PENDING &&
               [TransactionType.DEPOSIT].includes(params.row.transactionType) &&
               hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_VALIDATE_PAYMENT_REQ
               )
            ) {
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
            }
         },
         sortable: false,
         filterable: false,
         width: 10,
         disableColumnMenu: true,
      },
   ]
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   const [checked, setChecked] = useState(false)
   var regexPattern = new RegExp('true')
   const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false })

   const Actions = (data: Transaction) => {
      let actiondata: {
         value: string
         label: React.ReactElement | string
         onClick?: MouseEventHandler<any> | undefined
         disabled?: boolean
      }[] = []
      if (
         operator?.integrationType === IntegrationType.ALIEN_STANDALONE &&
         data.transactionType === TransactionType.DEPOSIT &&
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_VALIDATE_PAYMENT_REQ
         )
      ) {
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
                     Validate payment
                  </Typography>
               ),
               onClick: () => handleOpenUpdateDeposit(data),
            }
         )
      }
      return actiondata
   }

   const ActionsDetails = (data: Transaction) => {
      let actiondata: {
         value: string
         label: React.ReactElement | string
         onClick?: MouseEventHandler<any> | undefined
         disabled?: boolean
      }[] = []

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
                  Details
               </Typography>
            ),
            onClick: () => handleClickOpen(data),
         }
      )
      return actiondata
   }

   const post: UseGetTransactionListQueryProps = {
      limit: paginationModel.pageSize,
      page: paginationModel.page,
      sort: dataSort,
      playerId: dataFilter.playerId,
      destinationAddress: dataFilter.destinationAddress,
      gateway: dataFilter.gateway,
      fromCurrency: dataFilter.fromCurrency,
      toCurrency: dataFilter.toCurrency,
      fromAmount: dataFilter.fromAmount,
      toAmount: dataFilter.toAmount,
      refresh: boxRefrech,
      txId: dataFilter.txId,
      type: dataFilter.type,
      from: dataFilter.from,
      to: dataFilter.to,
      status: dataFilter.status,
      iban: dataFilter.iban,
      excludePendingDeposit: dataFilter.excludePendingDeposit,
      opId: opId,
      key: 'list',
      autoRefresh: dataFilter.autoRefresh,
   }

   if (currenctBrandId !== 'All Brands') {
      post.brandId = currenctBrandId
   }
   if (dataFilter.isFun && dataFilter.isFun !== 'all') {
      post.isFun = regexPattern.test(dataFilter.isFun)
   }
   if (dataFilter.isTest && dataFilter.isTest !== 'all') {
      post.isTest = regexPattern.test(dataFilter.isTest)
   }
   if (dataFilter.bankName && dataFilter.bankName !== 'all') {
      post.bankName = dataFilter.bankName
   }

   useGetTransactionListQuery(post)

   const { mutate: mutateWithdrawStatus } = useWithdrawStatusMutation({
      onSuccess: (data) => {
         setBoxRefrech(boxRefrech + 1)
         toast.success(
            `You ${transactionStatus.toLocaleLowerCase()} withdraw successfully`,
            {
               position: toast.POSITION.TOP_CENTER,
            }
         )
         setOpen(false)
         setOpenUpdateStatus(false)
      },
   })

   const { mutate: mutateDepositStatus } = useDepositStatusMutation({
      onSuccess: (data) => {
         setBoxRefrech(boxRefrech + 1)
         toast.success(`You validated the payment successfully`, {
            position: toast.POSITION.TOP_CENTER,
         })
         setOpenDepositStatus(false)
      },
   })

   const handleOpenUpdateTransaction = (
      transaction: Transaction,
      status: TransactionStatus
   ) => {
      setCurrentTransaction(transaction)
      setTransactionStatus(status)
      setOpenUpdateStatus(true)
   }

   const handleOpenUpdateDeposit = (transaction: Transaction) => {
      setCurrentTransaction(transaction)
      setOpenDepositStatus(true)
   }

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field
         let data = {}
         fieldName === 'opId'
            ? (data = {
                 opId: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'txId'
            ? (data = {
                 txId: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'playerId'
            ? (data = {
                 playerId: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'fromAmount'
            ? (data = {
                 fromAmount: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'fromCurrency'
            ? (data = {
                 fromCurrency: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'isTest'
            ? (data = {
                 isTest: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'transactionType'
            ? (data = {
                 type: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'status'
            ? (data = {
                 status: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : (data = {
                 createdAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
         setDataSort(data)
      },
      []
   )

   const handleCloseUpdateStatus = () => {
      setOpenUpdateStatus(false)
   }

   const handleCloseDepositStatus = () => {
      setOpenDepositStatus(false)
   }

   const handleWithdrawStatus = React.useCallback(
      (dto: SetWithdrawStatusDto) => {
         mutateWithdrawStatus({ dto })
      },
      [mutateWithdrawStatus]
   )

   const handleDepositStatus = React.useCallback(
      (dto: ValidatePaymentDto) => {
         mutateDepositStatus({ dto })
      },
      [mutateDepositStatus]
   )

   const handleClickOpen = (data: Transaction) => {
      setTransactionDetails(data)
      setTransition(TransitionSlide)
      setNote(data.noteForPlayer || '')
      setOpen(true)
   }

   const handleClose = async () => {
      setOpen(false)
   }

   const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue)
   }

   const handleCopyButtonClick = (json: {}) => {
      const data = JSON.stringify(json, null, 2)
      navigator.clipboard.writeText(data)
      setChecked(true)
      setTimeout(() => setChecked(false), 1000)
   }

   React.useEffect(() => {
      setRowCountState((prevRowCountState: number) =>
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
            height: PageWith5Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            rowHeight={isDesktop ? 44 : 30}
            sx={GridStyle}
            getRowId={(row) => row.txId}
            rows={data?.transactions || []}
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
            loading={loadingTransactionList}
            rowThreshold={0}
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
            open={openUpdateStatus}
            onClose={handleCloseUpdateStatus}
            aria-labelledby="form-dialog-title"
            maxWidth={maxWidth}
            fullWidth={fullWidth}
         >
            <DialogTitle id="form-dialog-title">
               {transactionStatus === TransactionStatus.CONFIRMED
                  ? 'Confirm'
                  : 'Reject'}{' '}
               Withdraw
            </DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  {` Are you sure you want to ${
                     transactionStatus === TransactionStatus.CONFIRMED
                        ? 'confirm'
                        : 'reject'
                  } this withdraw?`}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleCloseUpdateStatus}
                  color="secondary"
                  variant="outlined"
                  sx={{
                     height: 32,
                     borderColor: darkPurple[10],
                  }}
               >
                  Cancel
               </Button>
               {currentTransaction && currentTransaction.txId && (
                  <Button
                     color="secondary"
                     variant="contained"
                     sx={{ height: 32 }}
                     onClick={() =>
                        handleWithdrawStatus({
                           opId: opId,
                           txId: currentTransaction.txId,
                           status: transactionStatus,
                           noteForPlayer: note,
                        })
                     }
                  >
                     Confirm
                  </Button>
               )}
            </DialogActions>
         </Dialog>

         <Dialog
            open={openDepositStatus}
            onClose={handleCloseDepositStatus}
            aria-labelledby="form-dialog-title"
            maxWidth={maxWidth}
            fullWidth={fullWidth}
         >
            <DialogTitle id="form-dialog-title">Validate Payment</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  {` Are you sure you want to validate this payment?`}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleCloseDepositStatus}
                  color="secondary"
                  variant="outlined"
                  sx={{
                     height: 32,
                     borderColor: darkPurple[10],
                  }}
               >
                  Cancel
               </Button>
               {currentTransaction && currentTransaction.txId && (
                  <Button
                     color="secondary"
                     variant="contained"
                     sx={{ height: 32 }}
                     onClick={() =>
                        handleDepositStatus({
                           opId: opId,
                           txId: currentTransaction.txId,
                        })
                     }
                  >
                     Confirm
                  </Button>
               )}
            </DialogActions>
         </Dialog>

         <Dialog
            open={open}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
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
                     whiteSpace: 'normal',
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
                     {transactionDetails?.transactionType ===
                     TransactionType.WITHDRAW
                        ? 'Withdraw'
                        : transactionDetails?.transactionType ===
                          TransactionType.DEPOSIT
                        ? 'Deposit'
                        : transactionDetails?.transactionType ===
                          TransactionType.TOPUP
                        ? 'Topup'
                        : ''}{' '}
                     Details
                  </Typography>
               </Grid>
               <Grid item xs />
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleClose}
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
                     <Grid
                        container
                        direction="row"
                        alignItems="center"
                        p={'8px'}
                        spacing={1}
                        sx={{
                           svg: {
                              fontSize: '16px',
                              height: '16px',
                           },
                        }}
                     >
                        <Grid item>
                           <TabList
                              className="detail_tabs"
                              onChange={handleChange}
                              variant="scrollable"
                              scrollButtons={true}
                              sx={{
                                 mb: '0',
                                 pt: 0,
                                 px: isDesktop ? '12px' : '4px',
                                 justifyContent: 'start',
                                 alignItems: 'left',
                                 '.MuiTabs-scroller': {
                                    justifyContent: 'center',
                                    width: 'fit-content',
                                    maxWidth: 'fit-content',
                                 },
                              }}
                              aria-label="lab API tabs example"
                           >
                              <Tab label="Detail" value={'detail'} />
                              {user?.scope === UserScope.SUPERADMIN && (
                                 <Tab label="Json" value={'json'} />
                              )}
                           </TabList>
                        </Grid>
                        <Grid item xs />
                        {transactionDetails?.status ===
                           TransactionStatus.PENDING &&
                           hasDetailsPermission(
                              UserPermissionEvent.BACKOFFICE_SET_WITHDRAW_STATUS_REQ
                           ) &&
                           value === 'detail' && (
                              <>
                                 <Grid item>
                                    <Button
                                       color="secondary"
                                       variant="contained"
                                       onClick={() =>
                                          handleOpenUpdateTransaction(
                                             transactionDetails,
                                             TransactionStatus.CONFIRMED
                                          )
                                       }
                                    >
                                       Confirm
                                    </Button>
                                 </Grid>
                                 <Grid item>
                                    <Button
                                       color="secondary"
                                       variant="outlined"
                                       onClick={() =>
                                          handleOpenUpdateTransaction(
                                             transactionDetails,
                                             TransactionStatus.REJECTED
                                          )
                                       }
                                    >
                                       Reject
                                    </Button>
                                 </Grid>
                              </>
                           )}
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
                                 handleCopyButtonClick(transactionDetails)
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
                     <TabPanel
                        value={'detail'}
                        sx={{
                           height: PageWith5Toolbar,
                           overflow: 'auto',
                        }}
                     >
                        <Grid
                           container
                           direction="row"
                           alignItems="center"
                           mb={2}
                           spacing={0}
                        >
                           <Table>
                              <TableBody>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Status
                                    </TableCell>
                                    <TableCell>
                                       {RenderTransactionStatusCell({
                                          status: transactionDetails?.status,
                                          transactionType:
                                             transactionDetails?.transactionType,
                                       })}
                                    </TableCell>
                                 </TableRow>
                                 {[
                                    TransactionType.WITHDRAW,
                                    TransactionType.DEPOSIT,
                                 ].includes(
                                    transactionDetails?.transactionType
                                 ) && (
                                    <>
                                       <TableRow>
                                          <TableCell component="th" scope="row">
                                             Note for player
                                          </TableCell>
                                          <TableCell>
                                             {transactionDetails?.status ===
                                                TransactionStatus.PENDING &&
                                             hasDetailsPermission(
                                                UserPermissionEvent.BACKOFFICE_SET_WITHDRAW_STATUS_REQ
                                             ) ? (
                                                <TextField
                                                   name="note"
                                                   onChange={(e) =>
                                                      setNote(e.target.value)
                                                   }
                                                   value={note}
                                                   minRows={3}
                                                   multiline
                                                   fullWidth
                                                   autoFocus
                                                   variant="outlined"
                                                />
                                             ) : (
                                                <PortalCopyValue
                                                   value={
                                                      transactionDetails?.noteForPlayer
                                                   }
                                                   sx={{
                                                      textOverflow: 'ellipsis',
                                                      overflow: 'hidden',
                                                      whiteSpace: 'nowrap',
                                                      maxWidth: '230px',
                                                   }}
                                                />
                                             )}
                                          </TableCell>
                                       </TableRow>
                                       <TableRow>
                                          <TableCell component="th" scope="row">
                                             Gateway
                                          </TableCell>
                                          <TableCell>
                                             {transactionDetails?.gateway}
                                          </TableCell>
                                       </TableRow>
                                    </>
                                 )}

                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Player Id
                                    </TableCell>
                                    <TableCell>
                                       <PortalCopyValue
                                          value={
                                             transactionDetails?.player
                                                ?.playerId
                                          }
                                          sx={{
                                             textOverflow: 'ellipsis',
                                             overflow: 'hidden',
                                             whiteSpace: 'nowrap',
                                             maxWidth: '230px',
                                          }}
                                       />
                                    </TableCell>
                                 </TableRow>
                                 <TableRow sx={{}}>
                                    <TableCell component="th" scope="row">
                                       Player Name:
                                    </TableCell>
                                    <TableCell>
                                       <PortalCopyValue
                                          value={
                                             transactionDetails?.player
                                                ?.nickname
                                          }
                                          sx={{
                                             textOverflow: 'ellipsis',
                                             overflow: 'hidden',
                                             whiteSpace: 'nowrap',
                                             maxWidth: '230px',
                                          }}
                                       />
                                    </TableCell>
                                 </TableRow>
                                 {[TransactionType.WITHDRAW].includes(
                                    transactionDetails?.transactionType
                                 ) && (
                                    <>
                                       <TableRow>
                                          <TableCell component="th" scope="row">
                                             Destination Card
                                          </TableCell>
                                          <TableCell>
                                             <PortalCopyValue
                                                value={
                                                   transactionDetails?.bankInfo
                                                      ?.destinationCard
                                                }
                                                sx={{
                                                   textOverflow: 'ellipsis',
                                                   overflow: 'hidden',
                                                   whiteSpace: 'nowrap',
                                                   maxWidth: '230px',
                                                }}
                                             />
                                          </TableCell>
                                       </TableRow>
                                       <TableRow>
                                          <TableCell component="th" scope="row">
                                             Name On Destination Card
                                          </TableCell>
                                          <TableCell>
                                             <PortalCopyValue
                                                value={
                                                   transactionDetails?.bankInfo
                                                      ?.nameOnDestinationCard
                                                }
                                                sx={{
                                                   textOverflow: 'ellipsis',
                                                   overflow: 'hidden',
                                                   whiteSpace: 'nowrap',
                                                   maxWidth: '230px',
                                                }}
                                             />
                                          </TableCell>
                                       </TableRow>
                                       <TableRow>
                                          <TableCell component="th" scope="row">
                                             Bank Name
                                          </TableCell>
                                          <TableCell>
                                             <PortalCopyValue
                                                value={
                                                   transactionDetails?.bankInfo
                                                      ?.bankName || ''
                                                }
                                                sx={{
                                                   textOverflow: 'ellipsis',
                                                   overflow: 'hidden',
                                                   whiteSpace: 'nowrap',
                                                   maxWidth: '230px',
                                                }}
                                             />
                                          </TableCell>
                                       </TableRow>
                                       <TableRow>
                                          <TableCell component="th" scope="row">
                                             Iban
                                          </TableCell>
                                          <TableCell>
                                             <PortalCopyValue
                                                value={
                                                   transactionDetails?.bankInfo
                                                      ?.iban || ''
                                                }
                                                sx={{
                                                   textOverflow: 'ellipsis',
                                                   overflow: 'hidden',
                                                   whiteSpace: 'nowrap',
                                                   maxWidth: '230px',
                                                }}
                                             />
                                          </TableCell>
                                       </TableRow>
                                       <TableRow>
                                          <TableCell component="th" scope="row">
                                             Destination Address
                                          </TableCell>
                                          <TableCell>
                                             <PortalCopyValue
                                                value={
                                                   transactionDetails?.extraData
                                                      ?.destinationAddress || ''
                                                }
                                                sx={{
                                                   textOverflow: 'ellipsis',
                                                   overflow: 'hidden',
                                                   whiteSpace: 'nowrap',
                                                   maxWidth: '230px',
                                                }}
                                             />
                                          </TableCell>
                                       </TableRow>
                                    </>
                                 )}
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Amount
                                    </TableCell>
                                    <TableCell
                                       sx={{ h6: { p: '0 !important' } }}
                                    >
                                       {renderAmountCell(
                                          transactionDetails?.toAmount,
                                          transactionDetails?.toCurrency
                                       )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Currency
                                    </TableCell>
                                    <TableCell
                                       sx={{ h6: { p: '0 !important' } }}
                                    >
                                       {renderCurrencyCell(
                                          transactionDetails?.toCurrency
                                       )}
                                    </TableCell>
                                 </TableRow>
                              </TableBody>
                           </Table>
                        </Grid>
                     </TabPanel>
                     <TabPanel value={'json'} sx={{ padding: '8px 0px' }}>
                        <Grid
                           container
                           direction="row"
                           alignItems="center"
                           mb={2}
                           spacing={0}
                        >
                           {transactionDetails && transactionDetails.txId && (
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
                                    key={`jsonDialog${transactionDetails.txId}`}
                                    src={transactionDetails}
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
   )
}
