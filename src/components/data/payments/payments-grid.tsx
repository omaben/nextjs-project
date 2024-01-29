import GridStyle from '@/components/custom/GridStyle'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridSortModel,
} from '@mui/x-data-grid-pro'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectAuthPaymentsGateway } from 'redux/authSlice'
import { selectLoadingPaymentsGateway } from 'redux/loadingSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith2Toolbar,
} from 'services/globalFunctions'
import {
   UseGetPaymentsListQueryProps,
   useGetPaymentsListQuery,
} from './lib/hooks/queries'

export default function PaymentGatewayData(
   dataFilter: UseGetPaymentsListQueryProps
) {
   const [dataSort, setDataSort]: any = React.useState({
      createdAt: -1,
   })
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const loadingPaymentsGateway = useSelector(selectLoadingPaymentsGateway)
   const data = useSelector(selectAuthPaymentsGateway)
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   const columns: GridColDef[] = [
      {
         field: 'name',
         headerName: 'Gateway',
         renderCell: (params) => params.value,
         minWidth: 120,
         filterable: false,
         sortable: false,
         flex: 1,
      },
      {
         field: 'title',
         headerName: 'Title',
         renderCell: (params) => params.value,
         minWidth: 120,
         filterable: false,
         sortable: false,
         flex: 1,
      },
      {
         field: 'description',
         headerName: 'Description',
         minWidth: 100,
         renderCell: (params) => params.value,
         sortable: false,
         flex: 1,
      },
      {
         field: 'types',
         headerName: 'Types',
         minWidth: 100,
         renderCell: (params) => params.value,
         sortable: false,
         flex: 1,
      },
   ]
   
   const post: UseGetPaymentsListQueryProps = {
      key: 'list',
   }

   useGetPaymentsListQuery(post)

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         let data = {}
         setDataSort(data)
      },
      []
   )

   React.useEffect(() => {
      setRowCountState((prevRowCountState: any) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      )
   }, [data?.count, setRowCountState])

   return (
      <Box
         className="dataGridWrapper"
         sx={{
            height: PageWith2Toolbar,
            width: isDesktop
               ? isLgUp
                  ? 'calc(100vw - 384px)'
                  : 'calc(100vw - 250px)'
               : '100%',
            '.MuiDataGrid-row:hover, .MuiDataGrid-row:focus': {
               '.showOnHover,': {
                  opacity: 1,
               },
            },
            '.MuiDataGrid-row .showOnHover': {
               opacity: 0.2,
            },
         }}
      >
         <DataGridPro
            disableVirtualization
            sx={GridStyle}
            getRowId={(row) => row.name}
            rows={data?.paymentsGateway || []}
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
            loading={loadingPaymentsGateway}
            getRowClassName={(params) =>
               params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            columnVisibilityModel={{
               ...columnVisibilityModel,
            }}
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
