import SelectTheme from '@/components/SelectTheme'
import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import {
   renderGameCoresGameConfigTypeCell,
   renderGameCoresStatusCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells'
import { IconAngleDown } from '@/components/icons'
import {
   ConfigType,
   GameCore,
   GameCoreStatus,
   GameStatus,
   SetGameCoreStatusDto,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front'
import { SetGameCoreCustomCrashPointsDto } from '@alienbackoffice/back-front/lib/game/dto/set-game-core-custom-crash-points.dto'
import { SortDirection } from '@alienbackoffice/back-front/lib/lib/dto/pagination.dto'
import {
   Box,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogProps,
   DialogTitle,
   FormControl,
   InputLabel,
   MenuItem,
   Select,
   Stack,
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
import { ErrorMessage, Formik } from 'formik'
import React, { MouseEventHandler } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { selectAuthGameCoresList, selectAuthServer } from 'redux/authSlice'
import { selectloadingGameCoresList } from 'redux/loadingSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith3Toolbar,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import { ENV } from 'types'
import * as Yup from 'yup'
import {
   useGetGameCoresListQuery,
   useGetGameCoresListQueryProps,
   useSetGameCoreCustomCrashPointMutation,
   useSetGameCoreStatusMutation,
} from './lib/hooks/queries'
import { getUser } from 'redux/slices/user'

export default function AllGameCores(dataFilter: {
   title: string
   autoRefresh: number
}) {
   const theme = useTheme()
   const loadingGameCoresList = useSelector(selectloadingGameCoresList)
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [action, setAction] = React.useState(0)
   const data = useSelector(selectAuthGameCoresList) as {
      count: number
      games: GameCore<any>[]
   }
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const [dataSort, setDataSort] = React.useState<{
      coreId?: SortDirection
      title?: SortDirection
   }>({
      coreId: 1,
   })
   const [openGameCore, setOpenGameCore] = React.useState(false)
   const [openGameCoreCrashPoint, setOpenGameCoreCrashPoint] =
      React.useState(false)
   const [refreshDataGrid, setRefreshDataGrid] = React.useState(
      dataFilter.autoRefresh
   )
   const [gameCore, setGameCore] = React.useState({
      coreId: '',
      status: '',
   })
   const [gameCoreCrashPoint, setGameCoreCrashPoint] = React.useState({
      coreId: '',
      crashPoints: '',
   })
   const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm')
   const [fullWidth, setFullWidth] = React.useState(true)
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   const server = useSelector(selectAuthServer) as ENV
   const user = useSelector(getUser) as User

   const Actions = (data: GameCore<any>) => {
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
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SET_GAME_CORE_STATUS_REQ
         )
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
                  Set Game Core Status
               </Typography>
            ),
            onClick: () => {
               setOpenGameCore(true)
               setGameCore({
                  coreId: data.coreId,
                  status: data.status ? data.status : '',
               })
            },
         })
      }
      if (
         data.configType === ConfigType.ALIEN_CRASH &&
         data?.status &&
         [GameCoreStatus.ACTIVE, GameCoreStatus.MAINTENANCE].includes(
            data?.status
         ) &&
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SET_GAME_CORE_CUSTOM_CRASH_POINTS_REQ
         ) &&
         [ENV.DEV, ENV.STAGE, ENV.TEST].includes(server) &&
         user.scope === UserScope.SUPERADMIN
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
                  Set Game Core Custom Crash Points
               </Typography>
            ),
            onClick: () => {
               setOpenGameCoreCrashPoint(true)
               setGameCoreCrashPoint({
                  coreId: data.coreId,
                  crashPoints: '',
               })
            },
         })
      }
      return actiondata
   }

   const columns: GridColDef[] = [
      {
         field: 'coreId',
         headerName: 'Id',
         renderCell: (params) => (
            <PortalCopyValue color="primary" value={params.value} hideText />
         ),
         width: 50,
         hideable: false,
         filterable: false,
      },
      {
         field: 'coreServerId',
         headerName: 'Core Server Id',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => (
            <PortalCopyValue color="primary" value={params.value} hideText />
         ),
         width: 100,
         flex: 1,
         hideable: false,
         filterable: false,
      },
      {
         field: 'configType',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Config Type',
         renderCell: (params) =>
            params.value
               ? renderGameCoresGameConfigTypeCell(params.value)
               : '--',
         minWidth: 100,
         sortable: false,
         flex: 1,
         disableColumnMenu: true,
      },
      {
         field: 'status',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Status',
         renderCell: (params) =>
            params.value ? renderGameCoresStatusCell(params.value) : '--',
         minWidth: 100,
         sortable: false,
         flex: 1,
         disableColumnMenu: true,
      },
      {
         field: 'gameServicesGroupName',
         headerAlign: 'center',
         align: 'left',
         headerName: 'Game Services Group Name',
         renderCell: (params) => (
            <PortalCopyValue
               color="primary"
               value={
                  params.row?.connectionConfig?.awps?.gameServicesGroupName
                     ?.value
               }
               sx={{
                  overflow: 'hidden',
                  whiteSpace: 'break-spaces',
                  maxWidth: '260px',
                  textOverflow: 'ellipsis',
                  position: 'relative',
                  top: '-4px',
               }}
            />
         ),
         minWidth: 150,
         sortable: false,
         flex: 1,
         disableColumnMenu: true,
      },
      {
         field: 'createdAt',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Created At',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
         disableColumnMenu: true,
      },
      {
         field: 'updatedAt',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Updated At',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
         disableColumnMenu: true,
      },
   ]

   if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_SET_GAME_CORE_STATUS_REQ
      ) ||
      (hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_SET_GAME_CORE_CUSTOM_CRASH_POINTS_REQ
      ) &&
         user.scope === UserScope.SUPERADMIN &&
         [ENV.DEV, ENV.STAGE, ENV.TEST].includes(server))
   ) {
      columns.push({
         field: 'actions',
         headerName: '',
         renderCell: (params) => {
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
         width: 10,
         sortable: false,
         filterable: false,
         disableColumnMenu: true,
      })
   }

   const post: useGetGameCoresListQueryProps = {
      limit: paginationModel.pageSize,
      page: paginationModel.page,
      sort: dataSort,
      autoRefresh: refreshDataGrid,
   }

   useGetGameCoresListQuery(post)

   const handleCloseGameCore = () => {
      setOpenGameCore(false)
   }

   const handleCloseGameCoreCrashPoint = () => {
      setOpenGameCoreCrashPoint(false)
   }

   const { mutate } = useSetGameCoreStatusMutation({
      onSuccess: () => {
         // setRefreshDataGrid(refreshDataGrid + 1)
         toast.success(`You set game core status successfully`, {
            position: toast.POSITION.TOP_CENTER,
         })
         handleCloseGameCore()
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const { mutate: mutateCustomCrashPoints } =
      useSetGameCoreCustomCrashPointMutation({
         onSuccess: () => {
            // setRefreshDataGrid(refreshDataGrid + 1)
            toast.success(
               `You set game core custom crash points successfully`,
               {
                  position: toast.POSITION.TOP_CENTER,
               }
            )
            handleCloseGameCoreCrashPoint()
         },
         onError: (error) => {
            toast.error(error, {
               position: toast.POSITION.TOP_CENTER,
            })
         },
      })

   const handleSubmit = React.useCallback(
      (dto: SetGameCoreStatusDto) => {
         mutate({ dto })
      },
      [mutate]
   )

   const handleSubmitCoreCrashPoint = React.useCallback(
      (dtoData: { coreId: string; crashPoints?: string }) => {
         const dto: SetGameCoreCustomCrashPointsDto = {
            coreId: dtoData.coreId,
            crashPoints: dtoData.crashPoints
               ? dtoData.crashPoints.split(/\r?\n/).map(Number)
               : [],
         }
         mutateCustomCrashPoints({ dto })
      },
      [mutateCustomCrashPoints]
   )

   React.useEffect(() => {
      setRowCountState((prevRowCountState: number) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      )
   }, [data?.count, setRowCountState])

   React.useEffect(() => {
      setRefreshDataGrid(dataFilter.autoRefresh)
   }, [dataFilter.autoRefresh])

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field
         let data = {}
         fieldName === 'coreId'
            ? (data = {
                 coreId: sortModel[0].sort === 'asc' ? 1 : -1,
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

   return (
      <Box
         className="dataGridWrapper"
         mb={'0px'}
         px={isLgUp ? '12px' : '4px'}
         py={'6px'}
         pt={isDesktop ? '4px' : '6px'}
         sx={{
            height: PageWith3Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            sx={GridStyle}
            rowHeight={isDesktop ? 44 : 30}
            getRowId={(row) => row.coreId}
            rows={data?.games || []}
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
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
               setColumnVisibilityModel(newModel)
            }
            loading={loadingGameCoresList}
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
            open={openGameCore}
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
               Set Game Core Status
            </DialogTitle>
            <DialogContent>
               <Formik
                  initialValues={{
                     coreId: gameCore.coreId,
                     status: gameCore.status as GameCoreStatus,
                  }}
                  enableReinitialize={true}
                  onSubmit={handleSubmit}
                  validationSchema={Yup.object().shape({
                     status: Yup.string().required('Status  is required'),
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
                     <form noValidate onSubmit={handleSubmit}>
                        <FormControl
                           sx={{
                              width: '100%',
                              '.errorInput': {
                                 color: (props) => props.palette.error.main,
                                 ml: '14px',
                                 fontSize: '0.75rem',
                              },
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
                              IconComponent={() => (
                                 <IconAngleDown className="selectIcon" />
                              )}
                           >
                              {Object.keys(GameCoreStatus).map((item) => (
                                 <MenuItem value={item} key={item}>
                                    <Stack
                                       direction="row"
                                       alignItems="center"
                                       gap={2}
                                       textTransform="capitalize"
                                    >
                                       {item}
                                    </Stack>
                                 </MenuItem>
                              ))}
                           </Select>

                           {touched.status && errors.status && (
                              <ErrorMessage
                                 name={'status'}
                                 component={Typography}
                                 className="errorInput"
                              />
                           )}
                        </FormControl>
                        <DialogActions>
                           <Button
                              onClick={handleCloseGameCore}
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
            open={openGameCoreCrashPoint}
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
               Set Game Core Custom Crash Point
            </DialogTitle>
            <DialogContent>
               <Formik
                  initialValues={{
                     coreId: gameCoreCrashPoint.coreId,
                     crashPoints: gameCoreCrashPoint.crashPoints || '',
                  }}
                  enableReinitialize={true}
                  onSubmit={handleSubmitCoreCrashPoint}
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
                        <FormControl
                           sx={{
                              width: '100%',
                              '.errorInput': {
                                 color: (props) => props.palette.error.main,
                                 ml: '14px',
                                 fontSize: '0.75rem',
                              },
                              textarea: {
                                 paddingTop: '0 !important',
                                 marginTop: '12px',
                              },
                              '.MuiInputBase-root':{
                                 paddingRight: '5px !important'
                              }
                           }}
                        >
                           <TextField
                              name="crashPoints"
                              label="Crash Points"
                              type="text" // Use type text to allow custom handling
                              value={values.crashPoints}
                              multiline
                              onChange={(e) => {
                                 const inputValue = e.target.value
                                    .replace(/[^\d\n.]/g, '') // Allow only digits, newline, and decimal point
                                    .replace(/(\.[^.\n]*)\./g, '$1') // Allow only one decimal point

                                 handleChange({
                                    target: {
                                       name: 'crashPoints',
                                       value: inputValue,
                                    },
                                 } as React.ChangeEvent<HTMLInputElement>)
                              }}
                              rows={3}
                              fullWidth
                              variant="outlined"
                              InputLabelProps={{
                                 shrink: true,
                                 sx: {
                                    position: 'absolute',
                                    top: '-8px',
                                    zIndex: 2,
                                 }, // Adjust top and zIndex as needed
                              }}
                              error={Boolean(
                                 touched.crashPoints && errors.crashPoints
                              )}
                              helperText={
                                 touched.crashPoints && errors.crashPoints
                              }
                           />
                        </FormControl>
                        <DialogActions>
                           <Button
                              onClick={handleCloseGameCoreCrashPoint}
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
      </Box>
   )
}
