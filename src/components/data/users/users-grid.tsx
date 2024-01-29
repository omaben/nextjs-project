import SelectTheme from '@/components/SelectTheme'
import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import {
   renderBrandCell,
   renderTimeCell,
   renderUserScopeCell,
} from '@/components/custom/PortalRenderCells'
import {
   DeleteUserDto,
   EditUserDto,
   User,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faStar } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
import { darkPurple, imoonOrange } from 'colors'
import { Formik } from 'formik'
import { useRouter } from 'next/router'
import React, { MouseEventHandler } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { selectAuthUsersList } from 'redux/authSlice'
import { selectLoadingUsersList } from 'redux/loadingSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith3Toolbar,
   PageWith4Toolbar,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import * as Yup from 'yup'
import SortedDescendingIcon from '../../../Assets/Icons/Basics/caret-vertical-small.svg'
import {
   useEditUserMutation,
   useGetUserListQuery,
   useGetUserListQueryProps,
   useRemoveUserMutation,
} from './lib/hooks/queries'

export default function AllUsers(dataFilter: {
   username?: string
   autoRefresh?: number
   opId?: string
}) {
   const loadingUsersList = useSelector(selectLoadingUsersList)
   const theme = useTheme()
   const data = useSelector(selectAuthUsersList)
   const [currentUser, setCurrentUser] = React.useState({} as User)
   const [action, setAction] = React.useState(0)
   const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm')
   const [fullWidth, setFullWidth] = React.useState(true)
   const [openChangePassword, setOpenChangePassword] = React.useState(false)
   const [openPermissions, setOpenPermissions] = React.useState(false)
   const [openRemoveUser, setOpenRemoveUser] = React.useState(false)
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const [username, setUsername] = React.useState('')
   const router = useRouter()
   const Actions = (data: any) => {
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
      if (hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GET_USER_REQ)) {
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
                  Details
               </Typography>
            ),
            onClick: () =>
               router.push(
                  `/users/details?opId=${data.opId}&username=${data.username}`
               ),
         })
      }
      if (hasDetailsPermission(UserPermissionEvent.BACKOFFICE_EDIT_USER_REQ)) {
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
                  Change Password
               </Typography>
            ),
            onClick: () => handleOpenChangePassword(data),
         })
      }
      if (
         hasDetailsPermission(UserPermissionEvent.BACKOFFICE_DELETE_USER_REQ)
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
                  Delete user
               </Typography>
            ),
            onClick: () => handleOpenRemoveUser(data),
         })
      }
      return actiondata
   }
   const [dataSort, setDataSort]: any = React.useState({
      username: 1,
   })
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   const post: useGetUserListQueryProps = {
      limit: paginationModel.pageSize,
      page: paginationModel.page,
      username: dataFilter.username,
      autoRefresh: dataFilter.autoRefresh,
      sort: dataSort,
   }
   if (dataFilter.opId && dataFilter.opId !== '*') {
      post.opId = dataFilter.opId
   }
   const columns: GridColDef[] = [
      {
         field: 'username',
         headerName: 'Username',
         renderCell: (params) =>
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GET_USER_REQ
            ) ? (
               <PortalCopyValue
                  value={params.value}
                  href={`/users/details?opId=${params.row.opId}&username=${params.row.username}`}
               />
            ) : (
               <PortalCopyValue value={params.value} />
            ),
         flex: 1,
         minWidth: 150,
         hideable: false,
      },
      {
         field: 'opId',
         headerAlign: 'center',
         align: 'center',
         headerName: 'opId',
         renderCell: (params) => (
            <>
               {!params.value || params.value === '*' ? (
                  <FontAwesomeIcon
                     icon={faStar as IconProp}
                     fixedWidth
                     color={imoonOrange[6]}
                     fontSize={14}
                  />
               ) : hasDetailsPermission(
                    UserPermissionEvent.BACKOFFICE_GET_OPERATOR_REQ
                 ) && params.value !== '*' ? (
                  <PortalCopyValue
                     value={params.value}
                     href={`/operators/details?id=${params.row.opId}`}
                  />
               ) : (
                  <PortalCopyValue value={params.value} />
               )}
            </>
         ),
         minWidth: 100,
         disableColumnMenu: true,
         flex: 1,
      },
      {
         field: 'brandId',
         headerName: 'Brand',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderBrandCell(
               params.row.opId,
               params.value,
               params.row.player?.brand?.brandName
            ),
         minWidth: 80,
         flex: 1,
         filterable: false,
         disableColumnMenu: true,
      },
      {
         field: 'affId',
         headerName: 'Affiliate ID',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => (
            <>
               {params.value === '*' || !params.value ? (
                  params.value === '*' && (
                     <FontAwesomeIcon
                        icon={faStar as IconProp}
                        fixedWidth
                        color={imoonOrange[6]}
                        fontSize={14}
                     />
                  )
               ) : (
                  <PortalCopyValue value={params.value} />
               )}
            </>
         ),
         minWidth: 120,
         disableColumnMenu: true,
         flex: 1,
      },
      {
         field: 'scope',
         headerName: 'Scope',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            params && params.value && renderUserScopeCell(params.value),
         minWidth: 150,
         flex: 1,
         sortable: false,
         disableColumnMenu: true,
      },
      {
         field: 'createdAt',
         headerName: 'Created At',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
         disableColumnMenu: true,
      },
      {
         field: 'updatedAt',
         headerName: 'Updated At',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
         disableColumnMenu: true,
      },
   ]
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})

   const UserPermissionEventInit: any = Object.values(
      UserPermissionEvent
   ).reduce(
      (obj, cur) => ({
         ...obj,
         [cur]:
            currentUser?.permissions?.findIndex((item) => item === cur) > -1
               ? true
               : false,
      }),
      []
   )

   useGetUserListQuery(post)

   const { mutate } = useEditUserMutation({
      onSuccess: () => {
         setOpenChangePassword(false)
         setOpenPermissions(false)
         toast.success('User Edited successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const { mutate: mutateRemoveUser } = useRemoveUserMutation({
      onSuccess: () => {
         setOpenRemoveUser(false)
      },
   })

   const hasActionPermission = () => {
      if (
         hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GET_USER_REQ) ||
         hasDetailsPermission(UserPermissionEvent.BACKOFFICE_EDIT_USER_REQ) ||
         hasDetailsPermission(UserPermissionEvent.BACKOFFICE_DELETE_USER_REQ)
      ) {
         return true
      } else {
         return false
      }
   }

   if (hasActionPermission()) {
      columns.push({
         field: 'actions',
         headerName: '',
         headerAlign: 'center',
         align: 'center',
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
         sortable: false,
         filterable: false,
         width: 10,
         disableColumnMenu: true,
      })
   }

   const handleCloseChangePassword = () => {
      setOpenChangePassword(false)
   }

   const handleClosePermissions = () => {
      setOpenPermissions(false)
   }

   const handleCloseRemoveUser = () => {
      setOpenRemoveUser(false)
   }

   const handleSubmit = React.useCallback(
      (dto: EditUserDto) => {
         mutate({ dto })
      },
      [mutate]
   )

   const handleManagePermissions = React.useCallback(
      (CreatePermission: any) => {
         const permissions = Object.keys(CreatePermission).filter(
            (item: string) => CreatePermission[item] === true
         )
         const dto: EditUserDto = {
            username: CreatePermission.username,
            permissions: permissions as UserPermissionEvent[],
         }
         mutate({ dto })
      },
      [mutate]
   )

   const handleRemoveUser = React.useCallback(
      (dto: DeleteUserDto) => {
         mutateRemoveUser({ dto })
         setOpenRemoveUser(false)
      },
      [mutateRemoveUser]
   )

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field
         let data = {}
         fieldName === 'opId'
            ? (data = {
                 opId: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'username'
            ? (data = {
                 username: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'createdAt'
            ? (data = {
                 createdAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'brandId'
            ? (data = {
                 brandId: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : (data = {
                 updatedAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
         setDataSort(data)
      },
      []
   )

   const handleOpenChangePassword = (user: User) => {
      setUsername(user.username)
      setCurrentUser(user)
      setOpenChangePassword(true)
   }

   const handleOpenRemoveUser = (user: User) => {
      setCurrentUser(user)
      setOpenRemoveUser(true)
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
            height: isDesktop ? PageWith3Toolbar : PageWith4Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            sx={GridStyle}
            rowHeight={isDesktop ? 44 : 30}
            getRowId={(row) => row._id}
            rows={data?.users || []}
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
            components={{
               ColumnSortedDescendingIcon: SortedDescendingIcon,
               ColumnSortedAscendingIcon: SortedDescendingIcon,
            }}
            loading={loadingUsersList}
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
            open={openChangePassword}
            onClose={handleCloseChangePassword}
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
            <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
            {currentUser && currentUser.opId && (
               <Formik
                  initialValues={{
                     password: '',
                     username: username,
                  }}
                  enableReinitialize={true}
                  validationSchema={Yup.object().shape({
                     username: Yup.string()
                        .min(4)
                        .max(20)
                        .required('username is required'),
                     password: Yup.string()
                        .matches(
                           /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])/,
                           'Password must contain at least one uppercase, one lowercase character, numbers, and special characters'
                        )
                        .min(6)
                        .max(20)
                        .required('Password is Required'),
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
                        <DialogContent sx={{ py: 0 }}>
                           <TextField
                              name="username"
                              label="Username"
                              disabled
                              value={values.username}
                              error={Boolean(
                                 touched.username && errors.username
                              )}
                              fullWidth
                              helperText={touched.username && errors.username}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                           />
                           <TextField
                              autoFocus
                              name="password"
                              label="Password"
                              value={values.password}
                              error={Boolean(errors?.password)}
                              fullWidth
                              type="password"
                              helperText={touched?.password && errors?.password}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                           />
                        </DialogContent>
                        <DialogActions>
                           <Button
                              onClick={handleCloseChangePassword}
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
            )}
         </Dialog>
         <Dialog
            open={openPermissions}
            onClose={handleClosePermissions}
            aria-labelledby="form-dialog-title"
            maxWidth={maxWidth}
            fullWidth={fullWidth}
         >
            <DialogTitle id="form-dialog-title">
               Manage Permissions User {currentUser.username}
            </DialogTitle>
            <DialogContent dividers={true}>
               {currentUser && currentUser.opId && (
                  <Formik
                     initialValues={{
                        username: currentUser.username,
                        ...UserPermissionEventInit,
                     }}
                     enableReinitialize={true}
                     onSubmit={handleManagePermissions}
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
                           <Box
                              sx={{ flexGrow: 1, paddingTop: 0 }}
                              mt={5}
                              p={5}
                           >
                              <FormControl
                                 component="fieldset"
                                 variant="standard"
                              >
                                 <FormGroup>
                                    {Object.keys(UserPermissionEventInit).map(
                                       (item: any) => (
                                          <FormControlLabel
                                             key={item}
                                             control={
                                                <Checkbox
                                                   checked={values[item] as any}
                                                   onChange={handleChange}
                                                   name={item}
                                                />
                                             }
                                             label={item}
                                          />
                                       )
                                    )}
                                 </FormGroup>
                              </FormControl>
                           </Box>
                           <DialogActions>
                              <Button
                                 onClick={handleClosePermissions}
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
               )}
            </DialogContent>
         </Dialog>
         <Dialog
            open={openRemoveUser}
            onClose={handleCloseRemoveUser}
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
            <DialogTitle id="form-dialog-title">Delete User</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this user?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleCloseRemoveUser}
                  color="secondary"
                  variant="outlined"
                  sx={{
                     height: 32,
                     borderColor: darkPurple[10],
                  }}
               >
                  Cancel
               </Button>
               {currentUser && currentUser.opId && (
                  <Button
                     color="secondary"
                     variant="contained"
                     sx={{ height: 32 }}
                     onClick={() =>
                        handleRemoveUser({
                           opId: currentUser.opId,
                           username: currentUser.username,
                           brandId: currentUser.brandId,
                        })
                     }
                  >
                     Confirm
                  </Button>
               )}
            </DialogActions>
         </Dialog>
      </Box>
   )
}
