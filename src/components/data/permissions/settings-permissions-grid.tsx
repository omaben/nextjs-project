import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import { UserPermissionEvent } from '@alienbackoffice/back-front'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridSortModel,
} from '@mui/x-data-grid-pro'
import React from 'react'
import { useSelector } from 'react-redux'
import {
   selectAuthCurrentRoleName,
   selectAuthCurrentRolePermission,
   selectAuthRoles,
} from 'redux/authSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith4Toolbar,
   PageWithdetails3Toolbar,
} from 'services/globalFunctions'
import { useGetPermissionsListQuery } from './hooks/queries'

export default function PermissionsSettingsData(data: {
   activeAddNewRole: boolean
   userPermissionEventInit: []
}) {
   const roles = useSelector(selectAuthRoles) as {
      name: string
      UserPermissionEvent: UserPermissionEvent[]
   }[]
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const roleName = useSelector(selectAuthCurrentRoleName) as string
   const currentPermissions = useSelector(
      selectAuthCurrentRolePermission
   ) as UserPermissionEvent[]
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const [permissionData, setPermissionData]: any =
      React.useState(currentPermissions)
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const [dataSort, setDataSort]: any = React.useState({
      updatedAt: -1,
   })
   const [rowCountState, setRowCountState] = React.useState(
      data.userPermissionEventInit?.length || 0
   )
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

   React.useEffect(() => {
      setRowCountState((prevRowCountState: any) =>
         data.userPermissionEventInit?.length !== undefined
            ? data.userPermissionEventInit?.length
            : prevRowCountState
      )
   }, [data.userPermissionEventInit?.length, setRowCountState, roles])

   React.useEffect(() => {
      setPermissionData(currentPermissions)
   }, [roles, data.activeAddNewRole, roleName, currentPermissions])

   return (
      <Box
         className="dataGridWrapper"
         mb={'0px'}
         px={'12px'}
         sx={{
            height: isLgUp ? PageWith4Toolbar : PageWithdetails3Toolbar,
            width: isDesktop ? 'calc(100vw - 220px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            rowHeight={isDesktop ? 44 : 30}
            sx={GridStyle}
            getRowId={(row) => row.event}
            rows={
               (permissionData &&
                  data.userPermissionEventInit.filter((item: any) =>
                     permissionData.includes(item.event)
                  )) ||
               []
            }
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
      </Box>
   )
}
