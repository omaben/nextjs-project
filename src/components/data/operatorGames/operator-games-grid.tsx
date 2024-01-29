import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import {
   renderGameCell,
   renderGameStatusCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells'
import { UserPermissionEvent } from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faChartLineUp } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridSortModel,
} from '@mui/x-data-grid-pro'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectAuthOperatorGamesList } from 'redux/authSlice'
import { selectLoadingOperatorGamesList } from 'redux/loadingSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith3Toolbar,
   PageWith4Toolbar,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import {
   useGetOperatorGameListQuery,
   useGetOperatorGameListQueryProps,
} from './lib/hooks/queries'

export default function OperatorGames(dataFilter: {
   opId: string
   gameId?: string
   title?: string
   updateGrid: Function
}) {
   const theme = useTheme()
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   let find: { opId?: string } = {}
   dataFilter.opId === '' ? delete find['opId'] : (find.opId = dataFilter.opId)
   const post: useGetOperatorGameListQueryProps = {
      opId: dataFilter.opId,
      limit: paginationModel.pageSize,
      page: paginationModel.page,
   }
   if (dataFilter.gameId) {
      post.gameId = dataFilter.gameId
   }
   useGetOperatorGameListQuery(post)
   const data = useSelector(selectAuthOperatorGamesList)
   const isLoading = useSelector(selectLoadingOperatorGamesList)
   const columns: GridColDef[] = [
      {
         field: 'gameId',
         headerName: 'Game',
         renderCell: (params) =>
            renderGameCell(
               params.value,
               params.row.title,
               `/operators/operatorGameDetails?id=${params.value}&opId=${dataFilter.opId}`,
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
         renderCell: (params) => params.value,
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'gameProvider',
         headerName: 'Provider',
         renderCell: (params) => params.value,
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'gameStatus',
         headerName: 'Status',
         renderCell: (params) => renderGameStatusCell(params.value),
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'launchUrl',
         headerName: 'Launch URL',
         renderCell: (params) => (
            <PortalCopyValue color="primary" value={params.value} />
         ),
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'funModeUrl',
         headerName: 'Fun Mode URL',
         renderCell: (params) =>
            params.value ? (
               <>
                  <FontAwesomeIcon
                     icon={faChartLineUp as IconProp}
                     fontSize={14}
                     fixedWidth
                  />
                  <PortalCopyValue
                     color="primary"
                     value={params.value}
                     href={params.value}
                  />
               </>
            ) : (
               '--'
            ),
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'createdAt',
         headerName: 'Created At',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
         sortable: false,
      },
      {
         field: 'updatedAt',
         headerName: 'Updated At',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
         sortable: false,
      },
   ]
   const [rowCountState, setRowCountState] = React.useState(data?.length || 0)

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

   React.useEffect(() => {
      setRowCountState((prevRowCountState: number) =>
         data?.length !== undefined ? data?.length : prevRowCountState
      )
   }, [data?.length, setRowCountState])

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
               UserPermissionEvent.BACKOFFICE_OPERATOR_SET_GAMES_STATUS_REQ
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
