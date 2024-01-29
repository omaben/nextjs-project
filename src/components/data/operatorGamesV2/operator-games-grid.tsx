import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import {
   renderGameCell,
   renderGameStatusCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells'
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
import { selectAuthOperatorGamesV2List } from 'redux/authSlice'
import { selectLoadingOperatorGamesV2List } from 'redux/loadingSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith3Toolbar,
   PageWith4Toolbar,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import { useGetOperatorGameListQueryProps } from '../operatorGames/lib/hooks/queries'
import { useGetOperatorGameV2ListQuery } from './lib/hooks/queries'

export default function OperatorGamesV2(dataFilter: {
   opId: string
   updateGrid: Function
}) {
   const theme = useTheme()
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const post: useGetOperatorGameListQueryProps = {
      opId: dataFilter.opId,
      limit: paginationModel.pageSize,
      page: paginationModel.page,
   }
   const isLoading = useSelector(selectLoadingOperatorGamesV2List)
   const data = useSelector(selectAuthOperatorGamesV2List)
   const columns: GridColDef[] = [
      {
         field: 'gameId',
         headerName: 'Game',
         renderCell: (params) =>
            renderGameCell(
               params.value,
               params.row.title,
               `/operators/operatorGameV2Details?id=${params.value}&opId=${dataFilter.opId}`,
               false,
               true
            ),
         minWidth: 100,
         flex: 1,
         filterable: false,
         hideable: false,
         sortable: false,
      },
      {
         field: 'rtp',
         headerName: 'RTP',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) => params.value,
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'gameProvider',
         headerName: 'Provider',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) => params.value,
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'status',
         headerName: 'Status',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) => renderGameStatusCell(params.value),
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'launchUrl',
         headerName: 'Launch URL',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) => (
            <PortalCopyValue
               color="primary"
               value={params.value}
               sx={{
                  maxWidth: '300px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
               }}
            />
         ),
         minWidth: 300,
         flex: 1,
         sortable: false,
      },
      {
         field: 'createdAt',
         headerName: 'Created At',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
         sortable: false,
      },
      {
         field: 'updatedAt',
         headerName: 'Updated At',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
         sortable: false,
      },
   ]
   const [rowCountState, setRowCountState] = React.useState(data?.length || 0)
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))

   useGetOperatorGameV2ListQuery(post)

   React.useEffect(() => {
      setRowCountState((prevRowCountState: number) =>
         data?.length !== undefined ? data?.length : prevRowCountState
      )
   }, [data?.length, setRowCountState])

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
      },
      []
   )

   return (
      <Box
         className="dataGridWrapper"
         mb={'0px'}
         px={isLgUp ? '12px' : '4px'}
         py={'6px'}
         pt={0}
         sx={{
            height: isDesktop ? PageWith4Toolbar : PageWith3Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            checkboxSelection={hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_OPERATOR_SET_GAMES_V2_STATUS_REQ
            )}
            sx={GridStyle}
            getRowId={(row) => row.gameId}
            rowHeight={isDesktop ? 44 : 30}
            rows={data || []}
            paginationMode="server"
            sortingMode="server"
            rowCount={rowCountState | 0}
            columns={columns}
            disableRowSelectionOnClick
            pagination
            pageSizeOptions={[10, 20, 30, 40, 50, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortingOrder={['desc', 'asc']}
            onSortModelChange={handleSortModelChange}
            onRowSelectionModelChange={(newSelectionModel) => {
               dataFilter.updateGrid(newSelectionModel)
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
               setColumnVisibilityModel(newModel)
            }
            loading={isLoading}
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
