import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import {
   renderActivityTypeCell,
   renderBrandCell,
   renderPlayerStatusCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells'
import { PlayerActivityType } from '@alienbackoffice/back-front'
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
   selectAuthPlayerActivitiesList,
} from 'redux/authSlice'
import { selectLoadingPlayerActivites } from 'redux/loadingSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith5Toolbar,
} from 'services/globalFunctions'
import SortedDescendingIcon from '../../../Assets/Icons/Basics/caret-vertical-small.svg'
import {
   UseGetPlayersActivitiesListQueryProps,
   useGetPlayersActivitiesListQuery,
} from './lib/hooks/queries'
import { GetPlayerActivityListSortDto } from '@alienbackoffice/back-front/lib/player-activity/dto/get-player-activity-list.dto'
import { SortDirection } from '@alienbackoffice/back-front/lib/lib/dto/pagination.dto'

export default function PlayerActivities(dataFilter: {
   from?: number
   playerId?: string
   to?: number
   autoRefresh?: number
   activityType?: string | PlayerActivityType
}) {
   const opId = useSelector(selectAuthOperator)
   const brandId = useSelector(selectAuthCurrentBrand)
   const data = useSelector(selectAuthPlayerActivitiesList)
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   const [dataSort, setDataSort] = React.useState<GetPlayerActivityListSortDto>(
      {
         timestamp: -1,
      }
   )
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const loadingPlayersActivities = useSelector(selectLoadingPlayerActivites)
   
   const post: UseGetPlayersActivitiesListQueryProps = {
      limit: paginationModel.pageSize,
      page: paginationModel.page,
      sort: dataSort,
      opId: opId,
      from: dataFilter.from,
      playerId: dataFilter.playerId,
      to: dataFilter.to,
      autoRefresh: dataFilter.autoRefresh,
   }
   if (brandId !== 'All Brands') {
      post.brandId = brandId
   }
   if (dataFilter.activityType !== 'all') {
      post.activityType = dataFilter.activityType as PlayerActivityType
   }

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
         field: 'playerId',
         headerName: 'Player',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderPlayerStatusCell(
               params.row.player?.playerId,
               params.row.player?.isTest,
               params.row.player?.playerStatus === true,
               params.row.player?.nicknameIsSet && params.row.player?.nickname,
               params.row.player?.blocked,
               params.row.player
            ),
         minWidth: 150,
         flex: 1,
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
         headerName: 'Brand',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderBrandCell(
               opId,
               params.row.player?.brand?.brandId,
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
         renderCell: (params) => params.row.player?.affId,
         minWidth: 130,
         flex: 1,
         filterable: false,
         disableColumnMenu: true,
      },
      {
         field: 'activityType',
         headerName: 'Activity Type',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            params && params.value && renderActivityTypeCell(params.value),
         flex: 1,
         sortable: false,
         minWidth: 150,
      },
   ]

   useGetPlayersActivitiesListQuery(post)

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
            getRowId={(row) => row._id}
            rows={data?.activities || []}
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
            components={{
               ColumnSortedDescendingIcon: SortedDescendingIcon,
               ColumnSortedAscendingIcon: SortedDescendingIcon,
            }}
            loading={loadingPlayersActivities}
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
