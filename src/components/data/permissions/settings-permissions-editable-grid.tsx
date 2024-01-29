import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import {
   Roles,
   SetRolesDto,
   UserPermission,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import {
   Box,
   DialogActions,
   Grid,
   Button as MuiButton,
   TextField,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { spacing } from '@mui/system'
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridSortModel,
} from '@mui/x-data-grid-pro'
import { darkPurple } from 'colors'
import React from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   selectAuthCurrentRoleName,
   selectAuthCurrentRolePermission,
   selectAuthCurrentScope,
   selectAuthPermissions,
   selectAuthRoles,
} from 'redux/authSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWithdetails3Toolbar,
} from 'services/globalFunctions'
import { useSetRolesMutation } from '../users/lib/hooks/queries'
import { useGetPermissionsListQuery } from './hooks/queries'

export default function PermissionsSettingsDataEditable(data: {
   activeAddNewRole: boolean
   handleClose: Function
}) {
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const roles = useSelector(selectAuthRoles) as {
      name: string
      UserPermissionEvent: UserPermissionEvent[]
   }[]
   const roleName = useSelector(selectAuthCurrentRoleName) as string
   const currentPermissions = useSelector(
      selectAuthCurrentRolePermission
   ) as UserPermissionEvent[]
   const currentScope = useSelector(selectAuthCurrentScope)
   const [permission, setPermission] = React.useState('')
   const [role, setRole] = React.useState(roleName)
   const [permissionData, setPermissionData]: any =
      React.useState(currentPermissions)
   const UserPermissionEventInitKeysData: UserPermission[] = useSelector(
      selectAuthPermissions
   )
   const [UserPermissionEventInitKeys, setUserPermissionEventInitKeys]: any[] =
      React.useState(UserPermissionEventInitKeysData)
   const [UserPermissionEventInit, setUserPermissionEventInit]: any[] =
      React.useState(UserPermissionEventInitKeys)
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const [dataSort, setDataSort]: any = React.useState({
      updatedAt: -1,
   })
   const columns: GridColDef[] = [
      {
         field: 'title',
         headerName: 'Title',
         renderCell: (params) => <PortalCopyValue value={params.value} />,
         minWidth: 250,
         hideable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'description',
         headerName: 'Description',
         renderCell: (params) => params.value,
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'tags',
         headerName: 'Tags',
         renderCell: (params) => params.value,
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'event',
         headerName: 'Event',
         renderCell: (params) => (
            <PortalCopyValue
               value={params.value}
               sx={{
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
               }}
            />
         ),
         minWidth: 250,
         hideable: false,
         flex: 1,
         sortable: false,
      },
   ]
   const [rowCountState, setRowCountState] = React.useState(
      UserPermissionEventInit?.length || 0
   )
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const Button = styled(MuiButton)(spacing)

   useGetPermissionsListQuery({})

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field
         let data = {}
         fieldName === 'gameId'
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

   const { mutate } = useSetRolesMutation({
      onSuccess: () => {
         toast.success('You Set Roles Successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         data.handleClose()
      },
   })

   const handleManagePermissions = React.useCallback(
      (handleDto: {
         userScope: UserScope
         roles: Roles
         newRole: boolean
         role: string
         oldRoles: {
            name: string
            UserPermissionEvent: UserPermissionEvent[]
         }[]
      }) => {
         const previousRole = handleDto.newRole
            ? handleDto.oldRoles
            : handleDto.oldRoles.filter((item) => item.name !== handleDto.role)
         let prevRole: any = []
         if (previousRole.length > 0) {
            prevRole = previousRole.reduce(
               (obj, cur) => ({
                  ...obj,
                  [cur.name]: cur.UserPermissionEvent,
               }),
               []
            )
         }
         const dto: SetRolesDto = {
            userScope: handleDto.userScope,
            roles: {
               ...prevRole,
               ...handleDto.roles,
            },
         }
         mutate({ dto })
      },
      [mutate]
   )

   React.useEffect(() => {
      setRowCountState((prevRowCountState: any) =>
         UserPermissionEventInit?.length !== undefined
            ? UserPermissionEventInit?.length
            : prevRowCountState
      )
   }, [UserPermissionEventInit?.length, setRowCountState, roles])

   React.useEffect(() => {
      setUserPermissionEventInitKeys(
         UserPermissionEventInitKeysData.filter((item) =>
            item.scopes?.includes(currentScope)
         )
      )
      setUserPermissionEventInit(
         UserPermissionEventInitKeysData.filter((item) =>
            item.scopes?.includes(currentScope)
         )
      )
   }, [UserPermissionEventInitKeysData])

   React.useEffect(() => {
      setPermissionData(currentPermissions)
      setRole(roles?.length > 0 && !data.activeAddNewRole ? roleName : '')
   }, [roles, data.activeAddNewRole, roleName, currentPermissions])

   return (
      <>
         <Grid container spacing={2}>
            <Grid item xs={6}>
               <TextField
                  label="Role Name"
                  type="text"
                  name={'role'}
                  value={role}
                  fullWidth
                  onChange={(e) => {
                     setRole(e.target.value)
                  }}
                  autoComplete="off"
               />
            </Grid>
            <Grid item xs={6}>
               <TextField
                  label="Search"
                  type="search"
                  value={permission}
                  fullWidth
                  onChange={(e) => {
                     setPermission(e.target.value)
                     e.target.value !== ''
                        ? setUserPermissionEventInit(
                             UserPermissionEventInitKeys.filter(
                                (item: any) =>
                                   item.event
                                      .toLowerCase()
                                      .includes(e.target.value.toLowerCase()) ||
                                   item.title
                                      .toLowerCase()
                                      .includes(e.target.value.toLowerCase())
                             )
                          )
                        : setUserPermissionEventInit(
                             UserPermissionEventInitKeys
                          )
                  }}
                  autoComplete="off"
               />
            </Grid>
         </Grid>
         <Box
            className="dataGridWrapper"
            sx={{
               height: PageWithdetails3Toolbar,
               width: '100%',
               '.MuiDataGrid-row:hover, .MuiDataGrid-row:focus': {
                  '.showOnHover,': {
                     opacity: 1,
                  },
               },
               '.MuiDataGrid-row .showOnHover': {
                  opacity: 0.2,
               },
               pt: '8px',
            }}
         >
            <DataGridPro
               disableVirtualization
               checkboxSelection={true}
               rowHeight={isDesktop ? 44 : 30}
               sx={GridStyle}
               getRowId={(row) => row.event}
               rows={UserPermissionEventInit || []}
               paginationMode="server"
               sortingMode="server"
               rowCount={rowCountState | 0}
               columns={columns}
               disableRowSelectionOnClick
               pageSizeOptions={[10, 20, 30, 40, 50, 100]}
               paginationModel={paginationModel}
               onPaginationModelChange={setPaginationModel}
               sortingOrder={['desc', 'asc']}
               rowSelectionModel={permissionData}
               onSortModelChange={handleSortModelChange}
               onRowSelectionModelChange={(newSelectionModel) => {
                  if (permission !== '') {
                     const data = UserPermissionEventInit.map(
                        (item: any) => item.event
                     )
                     const lastData =
                        permissionData?.filter(
                           (item: any) =>
                              !data.includes(item) &&
                              !newSelectionModel.includes(item)
                        ) || []
                     setPermissionData([...lastData, ...newSelectionModel])
                  } else {
                     setPermissionData(newSelectionModel)
                  }
               }}
               columnVisibilityModel={columnVisibilityModel}
               onColumnVisibilityModelChange={(newModel) =>
                  setColumnVisibilityModel(newModel)
               }
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
            <DialogActions>
               <Button
                  onClick={() => {
                     data.handleClose()
                     setPermissionData(currentPermissions)
                  }}
                  color="secondary"
                  variant="outlined"
                  sx={{ height: 32, borderColor: darkPurple[10] }}
               >
                  Cancel
               </Button>
               <Button
                  color="secondary"
                  variant="contained"
                  sx={{ height: 32 }}
                  onClick={() => {
                     handleManagePermissions({
                        userScope: currentScope,
                        roles: {
                           [role]: permissionData,
                        },
                        newRole: data.activeAddNewRole,
                        role: roleName,
                        oldRoles: roles,
                     })
                  }}
               >
                  Save
               </Button>
            </DialogActions>
         </Box>
      </>
   )
}
