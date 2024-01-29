import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import {
   renderGameCell,
   renderGameStatusCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells'
import { SortDirection } from '@alienbackoffice/back-front/lib/lib/dto/pagination.dto'
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
import { selectAuthGamesList } from 'redux/authSlice'
import { selectLoadingGamesList } from 'redux/loadingSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith3Toolbar,
} from 'services/globalFunctions'
import {
   useGetGameListQuery,
   useGetGameListQueryProps,
} from './lib/hooks/queries'

export default function AllGames(dataFilter: {
   gameId: string
   title: string
   autoRefresh: number
}) {
   const theme = useTheme()
   const loadingGamesList = useSelector(selectLoadingGamesList)
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const data = useSelector(selectAuthGamesList)
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const [dataSort, setDataSort] = React.useState<{
      readonly gameId?: SortDirection
      readonly title?: SortDirection
   }>({
      gameId: 1,
   })
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   const columns: GridColDef[] = [
      {
         field: 'gameId',
         headerName: 'Game',
         renderCell: (params) =>
            renderGameCell(params.value, params.row.title, '', false, true),
         minWidth: 100,
         flex: 1,
         hideable: false,
         filterable: false,
      },
      {
         field: 'rtp',
         headerAlign: 'center',
         align: 'center',
         headerName: 'RTP',
         renderCell: (params) => params.value,
         minWidth: 80,
         sortable: false,
         flex: 1,
         disableColumnMenu: true,
      },
      {
         field: 'gameProvider',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Provider',
         renderCell: (params) => params.value,
         minWidth: 100,
         sortable: false,
         flex: 1,
         disableColumnMenu: true,
      },
      {
         field: 'gameStatus',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Status',
         renderCell: (params) => renderGameStatusCell(params.value),
         minWidth: 100,
         sortable: false,
         flex: 1,
         disableColumnMenu: true,
      },
      {
         field: 'launchUrl',
         headerAlign: 'center',
         align: 'left',
         headerName: 'Launch URL',
         renderCell: (params) => (
            <PortalCopyValue
               color="primary"
               value={params.value}
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
         field: 'funModeUrl',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Mode URL',
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
                     sx={{
                        overflow: 'hidden',
                        whiteSpace: 'break-spaces',
                        maxWidth: '260px',
                        textOverflow: 'ellipsis',
                        position: 'relative',
                        top: '-4px',
                     }}
                  />
               </>
            ) : (
               '--'
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

   const post: useGetGameListQueryProps = {
      limit: paginationModel.pageSize,
      page: paginationModel.page,
      sort: dataSort,
      gameId: dataFilter.gameId,
      title: dataFilter.title,
      autoRefresh: dataFilter.autoRefresh,
   }

   useGetGameListQuery(post)

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field
         let data = {}
         fieldName === 'gameId'
            ? (data = {
                 gameId: sortModel[0].sort === 'asc' ? 1 : -1,
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
            getRowId={(row) => row.gameId}
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
            loading={loadingGamesList}
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
