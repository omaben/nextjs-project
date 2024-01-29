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
} from '@/components/custom/PortalRenderCells'
import TransitionSlide from '@/components/custom/TransitionSlide'
import {
   IntegrationType,
   Operator,
   SetOperatorWithdrawStatusDto,
   Transaction,
   TransactionStatus,
   TransactionType,
   User,
   UserPermissionEvent,
   ValidatePaymentDto,
} from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faCircleArrowRight } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
   Divider as MuiDivider,
   Stack,
   TextField,
   Toolbar,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { green } from '@mui/material/colors'
import { spacing } from '@mui/system'
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridSortModel,
} from '@mui/x-data-grid-pro'
import { darkPurple, secondary } from 'colors'
import React, { MouseEventHandler } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   selectAuthCurrentBrand,
   selectAuthCurrentOperator,
   selectAuthOperator,
   selectAuthOperatorTransactionList,
   selectAuthUser,
} from 'redux/authSlice'
import { selectLoadingOperatorTransactionList } from 'redux/loadingSlice'
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
   useGetOperatorTransactionListQuery,
   useOperatorWithdrawStatusMutation,
} from './lib/hooks/queries'

export default function OperatorTransactions(dataFilter: any) {
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
   var regexPattern = new RegExp('true')
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
   const data = useSelector(selectAuthOperatorTransactionList)
   const [action, setAction] = React.useState(0)
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
               <Toolbar
                  variant="dense"
                  sx={{
                     flexDirection: ['column', 'row'],
                     justifyContent: 'space-between',
                     gap: 2,
                  }}
               >
                  {renderBetAmountCell(
                     params.row.toAmount,
                     params.row.toCurrency
                  )}
               </Toolbar>
            ) : (
               <Toolbar
                  variant="dense"
                  sx={{
                     flexDirection: ['row'],
                     justifyContent: 'space-between',
                     gap: 2,
                  }}
               >
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
               </Toolbar>
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
         headerName: 'Type',
         headerAlign: 'center',
         align: 'center',
         minWidth: 100,
         renderCell: (params) => params.value,
         flex: 1,
      },
      {
         field: 'destination',
         headerName: 'Destination',
         headerAlign: 'center',
         align: 'center',
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
                  top: '-4px',
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
            RenderTransactionStatusCell({ status: params.value }),
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
            if (
               operator?.integrationType === IntegrationType.ALIEN_STANDALONE &&
               [TransactionType.WITHDRAW].includes(params.row.transactionType)
            ) {
               return (
                  <Box className="showOnHover">
                     <SelectTheme
                        noPadd={true}
                        icon={''}
                        data={ActionsDetails(params.row)}
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
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm')
   const [fullWidth, setFullWidth] = React.useState(true)
   const [openUpdateStatus, setOpenUpdateStatus] = React.useState(false)
   const [openDepositStatus, setOpenDepositStatus] = React.useState(false)
   const [transactionStatus, setTransactionStatus] = React.useState(
      TransactionStatus.PENDING
   )
   const [currentTransaction, setCurrentTransaction] = React.useState(
      {} as Transaction
   )
   const Divider = styled(MuiDivider)(spacing)
   const [note, setNote] = React.useState('')
   const user = useSelector(selectAuthUser) as User
   const loadingOperatorTransactionList = useSelector(
      selectLoadingOperatorTransactionList
   )
   const [Transition, setTransition]: any = React.useState()
   const [transactionDetails, setTransactionDetails]: Transaction | any =
      React.useState({})
   const [open, setOpen] = React.useState(false)

   const { mutate: mutateWithdrawStatus } = useOperatorWithdrawStatusMutation({
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

   useGetOperatorTransactionListQuery(post)

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
      (dto: SetOperatorWithdrawStatusDto) => {
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

   const handleClickOpen = (data: Transaction) => {
      setTransactionDetails(data)
      setTransition(TransitionSlide)
      setNote(data.noteForPlayer || '')
      setOpen(true)
   }

   const handleClose = async () => {
      await setTransition(TransitionSlide)
      setOpen(false)
   }

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
            height: PageWith5Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
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
            loading={loadingOperatorTransactionList}
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
               <Button onClick={handleCloseUpdateStatus} color="warning">
                  Cancel
               </Button>
               {currentTransaction &&
                  currentTransaction.txId &&
                  currenctBrandId && (
                     <Button
                        onClick={() =>
                           handleWithdrawStatus({
                              opId: opId,
                              brandId: currenctBrandId,
                              status: transactionStatus,
                              txId: currentTransaction.txId,
                              noteForUser: note,
                           })
                        }
                        color="error"
                        variant="contained"
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
                  width: '600px',
                  padding: '25px',
               },
            }}
         >
            <Grid
               container
               direction="row"
               alignItems="center"
               my={2}
               spacing={2}
            >
               <Grid item>
                  <Typography variant="h3" gutterBottom display="inline">
                     Withdraw Details
                  </Typography>
               </Grid>
               <Grid item xs />
               <Grid item>
                  {RenderTransactionStatusCell({
                     status: transactionDetails?.status,
                  })}
               </Grid>
            </Grid>

            <Divider my={2} />
            {transactionDetails?.status === TransactionStatus.PENDING &&
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_SET_OPERATOR_WITHDRAW_STATUS_REQ
            ) ? (
               <Grid container direction="row" alignItems="center" spacing={2}>
                  <TextField
                     name="note"
                     label="Note for user"
                     onChange={(e) => setNote(e.target.value)}
                     value={note}
                     minRows={3}
                     multiline
                     fullWidth
                     variant="outlined"
                     sx={{ mt: 5 }}
                  />
                  <Grid item>
                     <Button
                        variant="outlined"
                        color="success"
                        onClick={() =>
                           handleOpenUpdateTransaction(
                              transactionDetails,
                              TransactionStatus.CONFIRMED
                           )
                        }
                     >
                        {' '}
                        Confirm Withdraw
                     </Button>
                  </Grid>
                  <Grid item>
                     <Button
                        variant="outlined"
                        color="error"
                        onClick={() =>
                           handleOpenUpdateTransaction(
                              transactionDetails,
                              TransactionStatus.REJECTED
                           )
                        }
                     >
                        {' '}
                        Reject the Withdraw
                     </Button>
                  </Grid>
               </Grid>
            ) : (
               transactionDetails?.noteForPlayer && (
                  <Grid
                     container
                     direction="row"
                     alignItems="center"
                     mb={2}
                     spacing={0}
                  >
                     <Grid item mr={1}>
                        <Typography variant="body1">
                           Note for player :
                        </Typography>
                     </Grid>
                     <Grid item>
                        <PortalCopyValue
                           value={transactionDetails?.noteForPlayer}
                           color={green[500]}
                           isVisible={true}
                           sx={{
                              '.MuiTypography-root': {
                                 fontSize: 12,
                                 fontFamily: 'Nunito Sans SemiBold',
                                 overflow: 'hidden',
                                 whiteSpace: 'break-spaces',
                                 maxWidth: '300px',
                                 textOverflow: 'ellipsis',
                              },
                           }}
                        />
                     </Grid>
                  </Grid>
               )
            )}

            <Stack direction="row" gap={2} mt={2} alignItems="flex-start">
               <Stack>
                  <Grid
                     container
                     direction="row"
                     alignItems="center"
                     mb={2}
                     spacing={0}
                  >
                     <Grid item mr={1}>
                        <Typography variant="body1">Gateway :</Typography>
                     </Grid>
                     <Grid item>
                        <PortalCopyValue
                           value={transactionDetails?.gateway}
                           color={green[500]}
                           isVisible={true}
                        />
                     </Grid>
                  </Grid>
                  {transactionDetails?.player && (
                     <Grid
                        container
                        direction="row"
                        alignItems="center"
                        mb={2}
                        spacing={0}
                     >
                        <Grid item mr={1}>
                           <Typography variant="body1">Player Id:</Typography>
                        </Grid>
                        <Grid item>
                           <PortalCopyValue
                              value={`${transactionDetails?.player?.playerId}`}
                              color={secondary[6]}
                              isVisible={true}
                           />
                        </Grid>
                     </Grid>
                  )}
                  {transactionDetails?.player?.nicknameIsSet &&
                     transactionDetails?.player?.nickname && (
                        <Grid
                           container
                           direction="row"
                           alignItems="center"
                           mb={2}
                           spacing={0}
                        >
                           <Grid item mr={1}>
                              <Typography variant="body1">
                                 Player Name:
                              </Typography>
                           </Grid>
                           <Grid item>
                              <PortalCopyValue
                                 value={`${transactionDetails?.player?.nickname}`}
                                 color={secondary[6]}
                                 isVisible={true}
                              />
                           </Grid>
                        </Grid>
                     )}
                  {transactionDetails?.bankInfo?.destinationCard && (
                     <Grid
                        container
                        direction="row"
                        alignItems="center"
                        mb={2}
                        spacing={0}
                     >
                        <Grid item mr={1}>
                           <Typography variant="bodySmallBold">
                              Destination Card :
                           </Typography>
                        </Grid>
                        <Grid item>
                           <PortalCopyValue
                              value={
                                 transactionDetails?.bankInfo?.destinationCard
                              }
                              isVisible={true}
                              color={secondary[6]}
                           />
                        </Grid>
                     </Grid>
                  )}
                  {transactionDetails?.bankInfo?.nameOnDestinationCard && (
                     <Grid
                        container
                        direction="row"
                        alignItems="center"
                        mb={2}
                        spacing={0}
                     >
                        <Grid item mr={1}>
                           <Typography variant="bodySmallBold">
                              Name On Destination Card :
                           </Typography>
                        </Grid>
                        <Grid item>
                           <PortalCopyValue
                              value={
                                 transactionDetails?.bankInfo
                                    ?.nameOnDestinationCard
                              }
                              isVisible={true}
                              color={secondary[6]}
                           />
                        </Grid>
                     </Grid>
                  )}
                  {transactionDetails?.bankInfo?.bankName && (
                     <Grid
                        container
                        direction="row"
                        alignItems="center"
                        mb={2}
                        spacing={0}
                     >
                        <Grid item mr={1}>
                           <Typography variant="bodySmallBold">
                              Bank Name :
                           </Typography>
                        </Grid>
                        <Grid item>
                           <PortalCopyValue
                              value={transactionDetails?.bankInfo?.bankName}
                              isVisible={true}
                              color={secondary[6]}
                           />
                        </Grid>
                     </Grid>
                  )}
                  {transactionDetails?.bankInfo?.iban && (
                     <Grid
                        container
                        direction="row"
                        alignItems="center"
                        mb={2}
                        spacing={0}
                     >
                        <Grid item mr={1}>
                           <Typography variant="bodySmallBold">
                              Iban :
                           </Typography>
                        </Grid>
                        <Grid item>
                           <PortalCopyValue
                              value={transactionDetails?.bankInfo?.iban}
                              isVisible={true}
                              color={secondary[6]}
                           />
                        </Grid>
                     </Grid>
                  )}
                  {transactionDetails?.extraData?.destinationAddress && (
                     <Grid
                        container
                        direction="row"
                        alignItems="center"
                        mb={2}
                        spacing={0}
                     >
                        <Grid item mr={1}>
                           <Typography variant="bodySmallBold">
                              Destination Address :
                           </Typography>
                        </Grid>
                        <Grid item>
                           <PortalCopyValue
                              value={
                                 transactionDetails?.extraData
                                    ?.destinationAddress
                              }
                              isVisible={true}
                              color={secondary[6]}
                           />
                        </Grid>
                     </Grid>
                  )}
                  {transactionDetails?.toAmount && (
                     <Grid
                        container
                        direction="row"
                        alignItems="center"
                        mb={2}
                        spacing={0}
                     >
                        <Grid item mr={1}>
                           <Typography variant="bodySmallBold">
                              Amount :
                           </Typography>
                        </Grid>
                        <Grid item>
                           {renderAmountCell(
                              transactionDetails?.toAmount,
                              transactionDetails?.toCurrency
                           )}
                        </Grid>
                     </Grid>
                  )}
                  {transactionDetails?.toCurrency && (
                     <Grid
                        container
                        direction="row"
                        alignItems="center"
                        mb={2}
                        spacing={0}
                     >
                        <Grid item mr={1}>
                           <Typography variant="bodySmallBold">
                              Currency :
                           </Typography>
                        </Grid>
                        <Grid item>
                           <PortalCopyValue
                              value={transactionDetails?.toCurrency}
                              isVisible={true}
                              color={secondary[6]}
                           />
                        </Grid>
                     </Grid>
                  )}
               </Stack>
            </Stack>
         </Dialog>
      </Box>
   )
}
