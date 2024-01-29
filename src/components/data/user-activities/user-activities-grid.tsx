import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import {
   renderActivityTypeCell,
   renderBrandCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells'
import { Box, Tooltip, useMediaQuery, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridSortModel,
} from '@mui/x-data-grid-pro'
import React from 'react'
import { useSelector } from 'react-redux'
import {
   selectAuthCurrentBrand,
   selectAuthOperator,
   selectAuthUserActivitiesList,
} from 'redux/authSlice'
import { selectLoadingUserAcitivites } from 'redux/loadingSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith4Toolbar,
   PageWith5Toolbar,
} from 'services/globalFunctions'
import { useGetUserActivitiesListQuery } from './lib/hooks/queries'
import { UserActivityType } from '@alienbackoffice/back-front'

export default function UserActivities(dataFilter: {
   from?: number,
   to?: number,
   autoRefresh?: number,
   username?: string
   activityType?: UserActivityType | string
   opId?:string
}) {
   const [dataSort, setDataSort]: any = React.useState({
      timestamp: -1,
   })
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const opId = useSelector(selectAuthOperator)
   const post: any = {
      limit: paginationModel.pageSize,
      page: paginationModel.page,
      sort: dataSort,
      opId: opId,
      from: dataFilter.from,
      username: dataFilter.username,
      to: dataFilter.to,
      autoRefresh: dataFilter.autoRefresh,
   }
   const brandId = useSelector(selectAuthCurrentBrand)
   if (brandId !== 'All Brands') {
      post.brandId = brandId
   }
   if (dataFilter.activityType !== 'all') {
      post.activityType = dataFilter.activityType
   }
   const data = useSelector(selectAuthUserActivitiesList)
   const columns: GridColDef[] = [
      {
         field: 'timestamp',
         headerName: 'Date/Time',
         headerAlign: 'left',
         align: 'left',
         renderCell: (params) => (
            <Box sx={{ '.MuiStack-root': { textAlign: 'left' } }}>
               {renderTimeCell(params.value)}
            </Box>
         ),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
         hideable: false,
      },
      {
         field: 'username',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Username',
         renderCell: (params) => (
            <PortalCopyValue
               value={params.value}
               href={`/users/details?opId=${params.row.user?.opId}&username=${params.row.user?.username}`}
            />
         ),
         flex: 1,
         minWidth: 150,
         hideable: false,
      },
      {
         field: 'title',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Title',
         renderCell: (params) => (
            <Box px={0.5} lineHeight={1.2}>
               <Tooltip title={params.value} placement="top">
                  <Stack>
                     <PortalCopyValue
                        value={params.value}
                        sx={{
                           '.MuiTypography-root': {
                              fontSize: 10,
                              fontFamily: 'Nunito Sans SemiBold',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              maxWidth: '100px',
                              position: 'relative',
                              top: '-4px',
                           },
                        }}
                     />
                  </Stack>
               </Tooltip>
            </Box>
         ),
         flex: 1,
         minWidth: 150,
      },
      {
         field: 'brandId',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Brand',
         renderCell: (params) =>
            renderBrandCell(
               opId,
               params.row.user?.brand?.brandId,
               params.row.user?.brand?.brandName
            ),
         minWidth: 80,
         flex: 1,
         filterable: false,
         disableColumnMenu: true,
      },
      {
         field: 'affId',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Affiliate ID',
         renderCell: (params) => params.row.user?.affId,
         minWidth: 130,
         flex: 1,
         filterable: false,
         disableColumnMenu: true,
      },
      {
         field: 'activityType',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Activity Type',
         renderCell: (params) =>
            params && params.value && renderActivityTypeCell(params.value),
         flex: 1,
         sortable: false,
         minWidth: 150,
      },
   ]
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const loadingUserActivities = useSelector(selectLoadingUserAcitivites)

   useGetUserActivitiesListQuery(post)

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field
         let data = {}
         fieldName === 'playerId'
            ? (data = {
                 playerId: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'brandId'
            ? (data = {
                 brandName: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'isTest'
            ? (data = {
                 isTest: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'isBlocked'
            ? (data = {
                 isBlocked: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'title'
            ? (data = {
                 title: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'createdAt'
            ? (data = {
                 createdAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'updatedAt'
            ? (data = {
                 updatedAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : (data = {
                 createdAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
         setDataSort(data)
      },
      []
   )

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
         py={isLgUp ? '0' : '6px'}
         pt={0}
         sx={{
            height: isDesktop ? PageWith5Toolbar : PageWith4Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            rowHeight={isDesktop ? 44 : 30}
            sx={GridStyle}
            getRowId={(row) => row._id}
            rows={data?.userActivities || []}
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
            loading={loadingUserActivities}
            getRowClassName={(params) =>
               params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            columnVisibilityModel={columnVisibilityModel}
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
      </Box>
   )
}
