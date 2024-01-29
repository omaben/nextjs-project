import SelectTheme from '@/components/SelectTheme'
import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import { renderPLCell } from '@/components/custom/PortalRenderCells'
import TransitionSlide from '@/components/custom/TransitionSlide'
import {
   AddOperatorWithdrawDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import {
   Box,
   Button,
   Dialog,
   DialogActions,
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
import { Formik } from 'formik'
import React, { MouseEventHandler } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   selectAuthCurrentBrand,
   selectAuthOperator,
   selectAuthWalletBalance,
} from 'redux/authSlice'
import { selectLoadingWalletBalanceList } from 'redux/loadingSlice'
import {
   CustomAction,
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith2Toolbar,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import * as Yup from 'yup'
import {
   useAddOperatorWithdrawMutation,
   useGetWalletBalanceListQuery,
} from './lib/hooks/queries'

export default function WalletBalanceGrid(dataFilter: {
   autoRefresh?: number
}) {
   const [dataSort, setDataSort]: any = React.useState({
      createdAt: -1,
   })
   const [action, setAction] = React.useState(0)
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const opId = useSelector(selectAuthOperator)
   const currenctBrandId = useSelector(selectAuthCurrentBrand)
   const post: { opId: string; brandId?: string; autoRefresh?: number } = {
      opId: opId,
      autoRefresh: dataFilter.autoRefresh,
   }
   if (currenctBrandId !== 'All Brands') {
      post.brandId = currenctBrandId
   }
   const data = useSelector(selectAuthWalletBalance) as {
      walletBalance: {
         totalDepositByPlayers: number
         totalWithdrawByPlayers: number
         totalWithdrawByOperator: number
         totalPendingWithdrawByOperator: number
         balance: number
         walletId: string
         withdrawIsEnable: boolean
      }[]
      count: number
   }
   const Actions = (dataWallet: {
      totalDepositByPlayers: number
      totalWithdrawByPlayers: number
      totalWithdrawByOperator: number
      totalPendingWithdrawByOperator: number
      balance: number
      walletId: string
      withdrawIsEnable: boolean
   }) => {
      let actiondata: {
         value: string
         label: React.ReactElement | string
         onClick?: MouseEventHandler<any> | undefined
         disabled?: boolean
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
      ]
      if (
         dataWallet.balance > 0 &&
         dataWallet.totalPendingWithdrawByOperator === 0 &&
         dataWallet.withdrawIsEnable
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
                  Withdraw
               </Typography>
            ),
            onClick: () => handleClickOpen(dataWallet),
         })
      }
      return actiondata
   }

   const columns: GridColDef[] = [
      {
         field: 'walletId',
         headerName: 'Wallet',
         renderCell: (params) => <PortalCopyValue value={params.value} />,
         hideable: false,
         width: 100,
         sortable: false,
      },
      {
         field: 'balance',
         headerName: 'Balance',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => renderPLCell(params.row.balance, ''),
         minWidth: 130,
         filterable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'totalWithdrawByOperator',
         headerName: 'Total Operator Withdraw',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderPLCell(params.row.totalWithdrawByOperator, ''),
         minWidth: 130,
         filterable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'totalWithdrawByPlayers',
         headerName: 'Total Player Withdraw',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderPLCell(params.row.totalWithdrawByPlayers, ''),
         minWidth: 130,
         filterable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'totalDepositByPlayers',
         headerName: 'Total Player Deposit',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderPLCell(params.row.totalDepositByPlayers, ''),
         minWidth: 130,
         filterable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'totalPendingWithdrawByOperator',
         headerName: 'Total Pending Withdraw',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderPLCell(params.row.totalPendingWithdrawByOperator, ''),
         minWidth: 130,
         filterable: false,
         flex: 1,
         sortable: false,
      },
   ]
   if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_ADD_OPERATOR_WITHDRAW_REQ
      )
   ) {
      columns.push({
         field: 'actions',
         headerName: '',
         renderCell: (params) => {
            return params.row.balance > 0 &&
               params.row.totalPendingWithdrawByOperator === 0 &&
               params.row.withdrawIsEnable ? (
               <Box className="showOnHover">
                  <SelectTheme
                     noPadd={true}
                     icon={''}
                     data={Actions(params.row)}
                     value={action}
                  />
               </Box>
            ) : (
               <></>
            )
         },
         sortable: false,
         filterable: false,
         disableColumnMenu: true,
      })
   }
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const loadingWalletBalanceList = useSelector(selectLoadingWalletBalanceList)
   const [Transition, setTransition]: any = React.useState()
   const [open, setOpen] = React.useState(false)
   const [initialValues, setInitialValues] = React.useState({
      opId: opId,
      amount: 0,
      brandId: currenctBrandId || '',
      destinationCurrency: '',
      destinationBlockchain: '',
      destinationAddress: '',
   })

   useGetWalletBalanceListQuery(post)

   const handleClickOpen = (data: {
      totalDepositByPlayers: number
      totalWithdrawByPlayers: number
      totalWithdrawByOperator: number
      totalPendingWithdrawByOperator: number
      balance: number
      walletId: string
      withdrawIsEnable: boolean
   }) => {
      setTransition(TransitionSlide)
      setOpen(true)
      setInitialValues({
         opId: opId,
         amount: 0,
         brandId: currenctBrandId || '',
         destinationCurrency: '',
         destinationBlockchain: '',
         destinationAddress: '',
      })
   }

   const { mutate } = useAddOperatorWithdrawMutation({
      onSuccess: () => {
         handleClose()
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const handleClose = async () => {
      setOpen(false)
   }

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field
         let data = {}
         setDataSort(data)
      },
      []
   )

   const handleSubmit = React.useCallback(
      (data: AddOperatorWithdrawDto) => {
         mutate({ dto: data })
      },
      [mutate]
   )

   React.useEffect(() => {
      setRowCountState((prevRowCountState: number) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      )
   }, [data?.count, setRowCountState])

   return post.brandId ? (
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
            getRowId={(row) => row.walletId}
            rows={data?.walletBalance || []}
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
            loading={loadingWalletBalanceList}
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
            <Typography variant="h3" gutterBottom display="inline">
               Add Withdraw
            </Typography>
            <Formik
               initialValues={initialValues}
               enableReinitialize={true}
               validationSchema={Yup.object().shape({
                  opId: Yup.string().required('Operator Id is required'),
                  brandId: Yup.string().required('Brand is required'),
                  destinationCurrency: Yup.string().required(
                     'Destination currency is required'
                  ),
                  amount: Yup.number().required('Amount is required'),
               })}
               onSubmit={handleSubmit}
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
                     <Box sx={{ flexGrow: 1, paddingTop: 0 }} mt={3}>
                        <TextField
                           name="amount"
                           label="Amount"
                           value={values.amount}
                           error={Boolean(touched.amount && errors.amount)}
                           fullWidth
                           helperText={touched.amount && errors.amount}
                           onBlur={handleBlur}
                           onChange={handleChange}
                           type="number"
                           variant="outlined"
                           sx={{ mb: 3 }}
                        />
                        <TextField
                           name="destinationCurrency"
                           label="Destination Currency"
                           value={values.destinationCurrency}
                           error={Boolean(
                              touched.destinationCurrency &&
                                 errors.destinationCurrency
                           )}
                           fullWidth
                           helperText={
                              touched.destinationCurrency &&
                              errors.destinationCurrency
                           }
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                           sx={{ mb: 3 }}
                        />
                        <TextField
                           name="destinationAddress"
                           label="Destination Address"
                           value={values.destinationAddress}
                           error={Boolean(
                              touched.destinationAddress &&
                                 errors.destinationAddress
                           )}
                           fullWidth
                           helperText={
                              touched.destinationAddress &&
                              errors.destinationAddress
                           }
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                           sx={{ mb: 3 }}
                        />
                        <TextField
                           name="destinationBlockchain"
                           label="Destination Blockchain"
                           value={values.destinationBlockchain}
                           error={Boolean(
                              touched.destinationBlockchain &&
                                 errors.destinationBlockchain
                           )}
                           fullWidth
                           helperText={
                              touched.destinationBlockchain &&
                              errors.destinationBlockchain
                           }
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                           sx={{ mb: 3 }}
                        />
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
      </Box>
   ) : (
      <Box
         className="dataGridWrapper"
         sx={{
            height: PageWith2Toolbar,
            width: '100%',
            '.MuiDataGrid-row:hover, .MuiDataGrid-row:focus': {
               '.showOnHover,': {
                  opacity: 1,
               },
            },
            '.MuiDataGrid-row .showOnHover': {
               opacity: 0.2,
            },
         }}
      >
         <CustomAction />
      </Box>
   )
}
