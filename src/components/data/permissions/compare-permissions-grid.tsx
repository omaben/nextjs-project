import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import {
   UserPermission,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faBan, faCheck } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { green } from '@mui/material/colors'
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridSortModel,
} from '@mui/x-data-grid-pro'
import { red } from 'colors'
import React from 'react'
import { useSelector } from 'react-redux'
import {
   selectAuthPermissions
} from 'redux/authSlice'
import { selectloadingUserDetails1 } from 'redux/loadingSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith4Toolbar,
   PageWithdetails3Toolbar,
} from 'services/globalFunctions'
import { useGetPermissionsListQuery } from './hooks/queries'

export default function PermissionsCompareData(data: {
   users: {
      username: string
      userPermissionEventInit: UserPermissionEvent[]
   }[]
}) {
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const isLoading = useSelector(selectloadingUserDetails1)
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const permissionData = useSelector(selectAuthPermissions)
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const [dataSort, setDataSort]: any = React.useState({
      updatedAt: -1,
   })
   const [dataRows, setDataRows]: any = React.useState([])
   const [rowCountState, setRowCountState] = React.useState(
      permissionData?.length || 0
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
   if (data.users && data.users.length > 0) {
      data.users.map((item, index) => {
         columns.push({
            field: item.username,
            headerName: item.username,
            headerAlign: 'center',
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
                        color: params.row[item.username]
                           ? `${green[500]} !important`
                           : `${red[2]} !important`,
                        cursor: 'default',
                        '&:hover': {
                           background: 'initial',
                        },
                     }}
                  >
                     {params.row[item.username] ? (
                        <FontAwesomeIcon icon={faCheck as IconProp} />
                     ) : (
                        <FontAwesomeIcon icon={faBan as IconProp} />
                     )}
                  </IconButton>
               )
            },
            minWidth: 100,
            hideable: false,
            flex: 1,
            sortable: false,
         })
      })
   }

   useGetPermissionsListQuery({})

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field
         let data = {}
         setDataSort(data)
      },
      []
   )

   React.useEffect(() => {
      setRowCountState((prevRowCountState: any) =>
      permissionData?.length !== undefined
            ? permissionData?.length
            : prevRowCountState
      )
   }, [permissionData?.length, setRowCountState])

   React.useEffect(() => {
      const dataPermissions: any = []

      permissionData.map((item: UserPermission) => {
         const dataItem: any = {
            title: item.title,
            event: item.event,
         }
         if (data.users && data.users.length > 0) {
            data.users.map((user) => {
               dataItem[user.username] =
                  user.userPermissionEventInit?.findIndex(
                     (findPermission) => findPermission === item.event
                  ) > -1
                     ? true
                     : false
            })
         }
         dataPermissions.push(dataItem)
      })
      const sortedDataPermissions = [...dataPermissions]
      if (data.users && data.users.length > 1) {
         sortedDataPermissions.sort((a, b) => {
            const permissionA1 = a[data.users[0].username] || false
            const permissionB1 = b[data.users[0].username] || false

            const permissionA2 = a[data.users[1].username] || false
            const permissionB2 = b[data.users[1].username] || false

            // Check if both users 1 and 2 have false values
            const bothFalseA: any = !permissionA1 && !permissionA2
            const bothFalseB: any = !permissionB1 && !permissionB2

            return bothFalseB - bothFalseA
         })
         sortedDataPermissions.sort((a, b) => {
            const permissionA1 = a[data.users[0].username] || false
            const permissionB1 = b[data.users[0].username] || false

            const permissionA2 = a[data.users[1].username] || false
            const permissionB2 = b[data.users[1].username] || false

            // Check if both users 1 and 2 have true values
            const bothTrueA = permissionA1 && permissionA2
            const bothTrueB = permissionB1 && permissionB2

            return bothTrueB - bothTrueA
         })
      } else if (data.users && data.users.length > 0) {
         sortedDataPermissions.sort((a, b) => {
            const permissionA = a[data.users[0].username] || false
            const permissionB = b[data.users[0].username] || false

            return permissionB - permissionA
         })
      }

      setDataRows(sortedDataPermissions)
   }, [data.users])
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
            rows={dataRows}
            paginationMode="server"
            sortingMode="server"
            rowCount={rowCountState | 0}
            columns={columns}
            loading={isLoading}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 20, 30, 40, 50, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortingOrder={['desc', 'asc']}
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
