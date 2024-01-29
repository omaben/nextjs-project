import SelectTheme from '@/components/SelectTheme'
import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import {
   renderCurrencyCell,
   renderOperatorStatusCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells'
import TransitionSlide from '@/components/custom/TransitionSlide'
import {
   EditOperatorDto,
   LockOperatorDto,
   Operator,
   OperatorStatus,
   SetBetDbConfigDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { GetOperatorListSortDto } from '@alienbackoffice/back-front/lib/operator/dto/get-operator-list.dto'
import { OperatorList } from '@alienbackoffice/back-front/lib/operator/interfaces/operator-list.interface'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faBan,
   faCheck,
   faLock,
   faRectangleXmark,
   faUnlock,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Box,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogProps,
   DialogTitle,
   FormControl,
   Grid,
   IconButton,
   InputLabel,
   MenuItem,
   Select,
   Stack,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { green } from '@mui/material/colors'
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridSortModel,
} from '@mui/x-data-grid-pro'
import { darkPurple, red } from 'colors'
import { Formik } from 'formik'
import React, { MouseEventHandler, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   selectAuthOperatorBetConfig,
   selectAuthOperatorsList,
} from 'redux/authSlice'
import { selectLoadingOperatorList } from 'redux/loadingSlice'
import { store } from 'redux/store'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith3Toolbar,
   PageWith4Toolbar,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'
import {
   useEditOperatorMutation,
   useGetOperatorListQuery,
   useLockedOperatorMutation,
   useSetBetConfigOperatorMutation,
} from './lib/hooks/queries'

export default function AllOperators(dataFilter: {
   opId: string
   title: string
   autoRefresh: number
}) {
   const [action, setAction] = React.useState(0)
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const loadingOperatorList = useSelector(selectLoadingOperatorList)
   const [openOperator, setOpenOperator] = React.useState(false)
   const [operator, setOperator] = React.useState({
      opId: '',
      title: '',
      status: OperatorStatus.ACTIVE,
   })
   const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm')
   const [fullWidth, setFullWidth] = React.useState(true)
   const handleCloseOperator = () => {
      setOpenOperator(false)
   }
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const Actions = (data: Operator) => {
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
         hasDetailsPermission(UserPermissionEvent.BACKOFFICE_LOCK_OPERATOR_REQ)
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
                  {data.isLocked ? 'Unlock' : 'Lock'}
               </Typography>
            ),
            onClick: () => {
               handlelockOperator({ opId: data.opId, lock: !data.isLocked })
            },
         })
      }
      if (
         !data.isLocked &&
         hasDetailsPermission(UserPermissionEvent.BACKOFFICE_EDIT_OPERATOR_REQ)
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
                  Edit
               </Typography>
            ),
            onClick: () => {
               setOpenOperator(true)
               setOperator(data)
            },
         })
      }
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_BET_DB_CONFIG_REQ
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
                  Bet DB Config
               </Typography>
            ),
            onClick: () => {
               handleClickBetDBOpen(data)
            },
         })
      }
      return actiondata
   }
   const [dataSort, setDataSort] = React.useState<GetOperatorListSortDto>({
      opId: 1,
   })
   const data = useSelector(selectAuthOperatorsList) as OperatorList
   const betOperatorConfig = useSelector(selectAuthOperatorBetConfig) as {
      connectionString: string
      dbName: string
   }
   const [openBetDBConnection, setOpenBetDBConnection] = React.useState(false)
   const [currentOperator, setCurrentOperator] = React.useState({} as Operator)
   const [Transition, setTransition] = React.useState<any>()
   const [refreshData, setRefreshData] = React.useState<number>(0)
   const boClient = store.getState().socket.boClient
   const columns: GridColDef[] = [
      {
         field: 'opId',
         headerName: 'ID',
         renderCell: (params) =>
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GET_OPERATOR_REQ
            ) ? (
               <PortalCopyValue
                  value={params.value}
                  href={`/operators/details?id=${params.value}`}
               />
            ) : (
               <PortalCopyValue value={params.value} />
            ),
         hideable: false,
         width: 50,
         disableColumnMenu: true,
      },
      {
         field: 'title',
         headerName: 'Name',
         renderCell: (params) =>
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GET_OPERATOR_REQ
            ) ? (
               <PortalCopyValue
                  value={params.value}
                  href={`operators/details?id=${params.row.opId}`}
               />
            ) : (
               <PortalCopyValue value={params.value} />
            ),
         flex: 1,
         minWidth: 100,
         headerAlign: 'center',
         align: 'center',
         disableColumnMenu: true,
      },
      {
         field: 'currency',
         headerName: 'Currency',
         renderCell: (params) => renderCurrencyCell(params.value),
         hideable: false,
         headerAlign: 'center',
         align: 'center',
         minWidth: 80,
         filterable: false,
         disableColumnMenu: true,
         flex: 1,
         sortable: false,
      },
      {
         field: 'lang',
         headerName: 'Language',
         renderCell: (params) => params.value || '--',
         flex: 1,
         headerAlign: 'center',
         align: 'center',
         minWidth: 100,
         sortable: false,
         disableColumnMenu: true,
      },
      {
         field: 'status',
         headerName: 'Status',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => renderOperatorStatusCell(params.value),
         minWidth: 100,
         flex: 1,
         sortable: false,
         disableColumnMenu: true,
      },
      {
         field: 'integrationType',
         headerName: 'Integration Type',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => params.value,
         minWidth: 150,
         flex: 1,
         sortable: false,
         disableColumnMenu: true,
      },
      {
         field: 'islocked',
         headerName: 'Is Locked',
         minWidth: 100,
         flex: 1,
         renderCell: (params) => {
            return (
               <IconButton
                  sx={{
                     position: 'relative',
                     margin: '0 auto',
                     svg: {
                        height: '16px',
                        width: '16px',
                     },
                     color: params.row.isLocked
                        ? `${red[2]} !important`
                        : `${green[500]} !important`,
                  }}
                  onClick={() => {
                     handlelockOperator({
                        opId: params.row.opId,
                        lock: !params.row.isLocked,
                     })
                  }}
               >
                  {params.row.isLocked ? (
                     <FontAwesomeIcon icon={faLock as IconProp} />
                  ) : (
                     <FontAwesomeIcon icon={faUnlock as IconProp} />
                  )}
               </IconButton>
            )
         },
         align: 'center',
         headerAlign: 'center',
         sortable: false,
         disableColumnMenu: true,
      },
      {
         field: 'isAssociated',
         headerName: 'Is Associated',
         minWidth: 100,
         flex: 1,
         renderCell: (params) => {
            return (
               <IconButton
                  sx={{
                     position: 'relative',
                     margin: '0 auto',
                     svg: {
                        height: '16px',
                        width: '16px',
                     },
                     color: params.row.isAssociated
                        ? `${green[500]} !important`
                        : `${red[2]} !important`,
                     cursor: 'default',
                     '&:hover': {
                        background: 'initial',
                     },
                  }}
               >
                  {params.row.isAssociated ? (
                     <FontAwesomeIcon icon={faCheck as IconProp} />
                  ) : (
                     <FontAwesomeIcon icon={faBan as IconProp} />
                  )}
               </IconButton>
            )
         },
         align: 'center',
         headerAlign: 'center',
         sortable: false,
         disableColumnMenu: true,
      },
      {
         field: 'createdAt',
         headerName: 'Created At',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         align: 'center',
         headerAlign: 'center',
         cellClassName: 'caption-column',
         disableColumnMenu: true,
      },
      {
         field: 'updatedAt',
         headerName: 'Updated At',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         align: 'center',
         headerAlign: 'center',
         cellClassName: 'caption-column',
         disableColumnMenu: true,
      },
      {
         field: 'actions',
         headerName: '',
         renderCell: (params) => {
            return hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_EDIT_OPERATOR_REQ
            ) ||
               hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_LOCK_OPERATOR_REQ
               ) ? (
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
         width: 10,
         sortable: false,
         filterable: false,
         disableColumnMenu: true,
      },
   ]
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   const post: {
      opId?: string
      title?: string
      page?: number
      limit?: number
      isAssociated?: boolean
      sort?: GetOperatorListSortDto
      autoRefresh?: number
      key: string
   } = {
      limit: paginationModel.pageSize,
      page: paginationModel.page,
      sort: dataSort,
      opId: dataFilter.opId,
      title: dataFilter.title,
      autoRefresh: dataFilter.autoRefresh,
      key: 'operatorsList',
   }

   useGetOperatorListQuery(post)

   React.useEffect(() => {
      setRowCountState((prevRowCountState: number) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      )
   }, [data?.count, setRowCountState])

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field
         let data = {}
         fieldName === 'opId'
            ? (data = {
                 opId: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'title'
            ? (data = {
                 title: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'createdAt'
            ? (data = {
                 createdAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : (data = {
                 updatedAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
         setDataSort(data)
      },
      []
   )

   const { mutate } = useEditOperatorMutation({
      onSuccess: () => {
         handleCloseOperator()
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const handleSubmit = React.useCallback(
      (dto: EditOperatorDto) => {
         mutate({ dto })
      },
      [mutate]
   )

   const { mutate: mutateLocked } = useLockedOperatorMutation({
      onSuccess: () => {
         // handleCloseOperator()
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const { mutate: mutateBetConfig } = useSetBetConfigOperatorMutation({
      onSuccess: () => {
         toast.success(`You set bet config successfully`, {
            position: toast.POSITION.TOP_CENTER,
         })

         handleCloseBetDBConnection()
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const handlelockOperator = React.useCallback(
      (dto: LockOperatorDto) => {
         mutateLocked({ dto })
      },
      [mutateLocked]
   )

   const handleCloseBetDBConnection = () => {
      setOpenBetDBConnection(false)
   }

   const handleSubmitBetDBConnection = React.useCallback(
      (dto: SetBetDbConfigDto) => {
         mutateBetConfig({ dto: dto })
      },
      [mutateBetConfig]
   )

   const handleClickBetDBOpen = (data: Operator) => {
      setTransition(TransitionSlide)
      setOpenBetDBConnection(true)
      setCurrentOperator(data)
      boClient?.operator.getBetDbConfig(
         { opId: data.opId },
         {
            uuid: uuidv4(),
            meta: {
               type: 'details',
               ts: new Date(),
               sessionId: sessionStorage.getItem('sessionId'),
               event: UserPermissionEvent.BACKOFFICE_GET_BET_DB_CONFIG_REQ,
            },
         }
      )
   }

   useEffect(() => {
      setRefreshData(refreshData + 1)
   }, [betOperatorConfig])

   return (
      <Box
         className="dataGridWrapper"
         mb={'0px'}
         px={isLgUp ? '12px' : '4px'}
         py={'6px'}
         pt={0}
         sx={{
            height: isDesktop ? PageWith3Toolbar : PageWith4Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            rowHeight={isDesktop ? 44 : 30}
            sx={GridStyle}
            getRowId={(row) => row.opId}
            rows={data?.operators || []}
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
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
               setColumnVisibilityModel(newModel)
            }
            loading={loadingOperatorList}
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
            open={openOperator}
            onClose={handleCloseOperator}
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
               Edit Operator {operator.opId}
            </DialogTitle>
            <DialogContent>
               <Formik
                  initialValues={{
                     title: operator.title,
                     opId: operator.opId,
                     status: operator.status,
                  }}
                  enableReinitialize={true}
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
                              Status
                           </InputLabel>
                           <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Status"
                              sx={{
                                 width: '100%',
                              }}
                              value={values.status}
                              name="status"
                              onChange={handleChange}
                           >
                              <MenuItem value={OperatorStatus.ACTIVE}>
                                 <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={2}
                                    textTransform="capitalize"
                                 >
                                    {OperatorStatus.ACTIVE}
                                 </Stack>
                              </MenuItem>
                              <MenuItem value={OperatorStatus.DISABLED}>
                                 <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={2}
                                    textTransform="capitalize"
                                 >
                                    {OperatorStatus.DISABLED}
                                 </Stack>
                              </MenuItem>
                              <MenuItem value={OperatorStatus.MAINTENANCE}>
                                 <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={2}
                                    textTransform="capitalize"
                                 >
                                    {OperatorStatus.MAINTENANCE}
                                 </Stack>
                              </MenuItem>
                           </Select>
                        </FormControl>
                        <DialogActions>
                           <Button
                              onClick={handleCloseOperator}
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
            open={openBetDBConnection}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="form-dialog-title"
            sx={{
               '.MuiDialog-container': {
                  alignItems: 'end',
                  justifyContent: 'end',
               },
               '.MuiPaper-root': {
                  width: '600px',
                  padding: '5px',
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
                  <Typography variant="h5" gutterBottom display="inline" mb={0}>
                     Bet DB Config
                  </Typography>
               </Grid>
               <Grid item xs></Grid>
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleCloseBetDBConnection}
                  />
               </Grid>
            </Grid>
            <DialogContent
               sx={{
                  p: 1,
                  '.MuiButtonBase-root': {
                     p: 0,
                  },
               }}
            >
               <Formik
                  key={refreshData}
                  initialValues={{
                     opId: currentOperator.opId,
                     betDbConnectionString: betOperatorConfig?.connectionString,
                     betDbName: betOperatorConfig?.dbName,
                  }}
                  enableReinitialize={true}
                  validationSchema={Yup.object().shape({
                     // betDbConnectionString: Yup.string().required(
                     //    'Bet DB Config  is required'
                     // ),
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
                           value={values.betDbConnectionString}
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
                              touched.betDbName && errors.betDbName
                           )}
                           fullWidth
                           helperText={touched.betDbName && errors.betDbName}
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_SET_BET_DB_CONFIG_REQ
                        ) && (
                           <DialogActions>
                              <Button
                                 onClick={handleCloseBetDBConnection}
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
                        )}
                     </form>
                  )}
               </Formik>
            </DialogContent>
         </Dialog>
      </Box>
   )
}
