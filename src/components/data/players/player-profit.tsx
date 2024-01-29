import GridStyle from '@/components/custom/GridStyle'
import PortalCurrencyValue from '@/components/custom/PortalCurrencyValue'
import {
   renderBetAmountCell,
   renderCurrencyCell,
   renderPLCell,
} from '@/components/custom/PortalRenderCells'
import { Player } from '@alienbackoffice/back-front'
import { CurrencyType } from '@alienbackoffice/back-front/lib/player/enum/currency-type.enum'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridSortModel,
} from '@mui/x-data-grid-pro'
import numeral from 'numeral'
import React from 'react'
import { CustomNoRowsOverlay, PageWith4Toolbar } from 'services/globalFunctions'
export default function PlayerProfit(dataFilter: { data: Player }) {
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [data, setData] = React.useState<{
      count: number
      currencies: {
         currency: string
         balance: number
         type?: CurrencyType
         withdraw?: {
            count: number
            totalAmount: number
         }
         deposit?: {
            count: number
            totalAmount: number
         }
         topup?: {
            count: number
            totalAmount: number
         }
         game?: {
            count: number
            lostCount: number
            wonCount: number
            cashbackCount: number
            totalBetAmount: number
            totalWinAmount: number
            totalPl: number
            totalWinOdds: number
         }
         address?: {
            [key: string]: string
         }
      }[]
   }>({
      count: 0,
      currencies: [],
   })
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})

   const [dataSort, setDataSort]: any = React.useState({
      timestamp: -1,
   })

   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })

   const columns: GridColDef[] = [
      {
         field: 'currency',
         headerName: 'Currency',
         renderCell: (params) =>
            params &&
            params.value && (
               <Box
                  sx={{
                     '.MuiTypography-root': {
                        fontFamily:
                           params.api.getRowId(params.row) === 'inUSD'
                              ? 'Nunito Sans Bold'
                              : 'Nunito Sans SemiBold',
                        color:
                           params.api.getRowId(params.row) === 'inUSD'
                              ? '#6172F3'
                              : '#000',
                     },
                  }}
               >
                  {renderCurrencyCell(params.value)}
               </Box>
            ),

         minWidth: 120,
         filterable: false,
         flex: 1,
      },
      {
         field: 'deposit',
         headerName: 'Deposits',
         renderCell: (params) => (
            <Box
               sx={{
                  fontFamily:
                     params.api.getRowId(params.row) === 'inUSD'
                        ? 'Nunito Sans Bold'
                        : 'Nunito Sans SemiBold',
                  color:
                     params.api.getRowId(params.row) === 'inUSD'
                        ? '#6172F3'
                        : '#000',
               }}
            >
               {numeral(params.row.deposit?.count).format(
                  '0a.[00]',
                  (n) => (Math.floor(n) * 100) / 100
               )}
            </Box>
         ),
         minWidth: 120,
         filterable: false,
         flex: 1,
      },
      {
         field: 'depositAmount',
         headerName: 'Deposit Amount',
         renderCell: (params) => (
            <Box
               sx={{
                  '.MuiTypography-root': {
                     fontFamily:
                        params.api.getRowId(params.row) === 'inUSD'
                           ? 'Nunito Sans Bold'
                           : 'Nunito Sans SemiBold',
                     color:
                        params.api.getRowId(params.row) === 'inUSD'
                           ? '#6172F3'
                           : '#000',
                  },
               }}
            >
               {renderBetAmountCell(
                  params.row.deposit?.totalAmount || 0,
                  params.row.currency
               )}
            </Box>
         ),
         minWidth: 120,
         filterable: false,
         flex: 1,
      },
      {
         field: 'withdraw',
         headerName: 'Withdraw',
         renderCell: (params) => (
            <Box
               sx={{
                  fontFamily:
                     params.api.getRowId(params.row) === 'inUSD'
                        ? 'Nunito Sans Bold'
                        : 'Nunito Sans SemiBold',
                  color:
                     params.api.getRowId(params.row) === 'inUSD'
                        ? '#6172F3'
                        : '#000',
               }}
            >
               {numeral(params.row.withdraw?.count || 0).format(
                  '0a.[00]',
                  (n) => (Math.floor(n) * 100) / 100
               )}
            </Box>
         ),
         minWidth: 120,
         filterable: false,
         flex: 1,
      },
      {
         field: 'withdrawAmount',
         headerName: 'Withdraw Amount',
         renderCell: (params) => (
            <Box
               sx={{
                  '.MuiTypography-root': {
                     fontFamily:
                        params.api.getRowId(params.row) === 'inUSD'
                           ? 'Nunito Sans Bold'
                           : 'Nunito Sans SemiBold',
                     color:
                        params.api.getRowId(params.row) === 'inUSD'
                           ? '#6172F3'
                           : '#000',
                  },
               }}
            >
               {renderBetAmountCell(
                  params.row.withdraw?.totalAmount || 0,
                  params.row.currency
               )}
            </Box>
         ),
         minWidth: 120,
         filterable: false,
         flex: 1,
      },
      {
         field: 'balance',
         headerName: 'Balance',
         renderCell: (params) => (
            <Box
               sx={{
                  '.MuiTypography-root': {
                     fontFamily:
                        params.api.getRowId(params.row) === 'inUSD'
                           ? 'Nunito Sans Bold'
                           : 'Nunito Sans SemiBold',
                     color:
                        params.api.getRowId(params.row) === 'inUSD'
                           ? '#6172F3'
                           : '#000',
                  },
               }}
            >
               <PortalCurrencyValue
                  value={params.row.balance || 0}
                  currency={params.row.currency}
                  textTransform="uppercase"
                  visibleCurrency={true}
               />
            </Box>
         ),
         hideable: false,
         minWidth: 100,
         // sortable: false,
         filterable: false,
         disableColumnMenu: true,
         flex: 1,
      },
      {
         field: 'topup',
         headerName: 'Top up',
         renderCell: (params) => (
            <Box
               sx={{
                  fontFamily:
                     params.api.getRowId(params.row) === 'inUSD'
                        ? 'Nunito Sans Bold'
                        : 'Nunito Sans SemiBold',
                  color:
                     params.api.getRowId(params.row) === 'inUSD'
                        ? '#6172F3'
                        : '#000',
               }}
            >
               {numeral(params.row.topup?.count || 0).format(
                  '0a.[00]',
                  (n) => (Math.floor(n) * 100) / 100
               )}
            </Box>
         ),
         minWidth: 120,
         filterable: false,
         flex: 1,
      },
      {
         field: 'topupAmount',
         headerName: 'Top Up Amount',
         renderCell: (params) => (
            <Box
               sx={{
                  '.MuiTypography-root': {
                     fontFamily:
                        params.api.getRowId(params.row) === 'inUSD'
                           ? 'Nunito Sans Bold'
                           : 'Nunito Sans SemiBold',
                     color:
                        params.api.getRowId(params.row) === 'inUSD'
                           ? '#6172F3'
                           : '#000',
                  },
               }}
            >
               {renderPLCell(
                  params.row.topup?.totalAmount || 0,
                  params.row.currency
               )}
            </Box>
         ),
         minWidth: 120,
         filterable: false,
         flex: 1,
      },
      {
         field: 'pl',
         headerName: 'PL',
         renderCell: (params) => (
            <Box
               sx={{
                  '.MuiTypography-root': {
                     fontFamily:
                        params.api.getRowId(params.row) === 'inUSD'
                           ? 'Nunito Sans Bold'
                           : 'Nunito Sans SemiBold',
                     color:
                        params.api.getRowId(params.row) === 'inUSD'
                           ? '#6172F3'
                           : '#000',
                  },
               }}
            >
               {renderPLCell(
                  params.row?.game?.totalPl || 0,
                  params.row.currency
               )}
            </Box>
         ),
         minWidth: 120,
         filterable: false,
         flex: 1,
      },
   ]

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         let data = {}
         setDataSort(data)
      },
      []
   )

   React.useEffect(() => {
      setRowCountState((prevRowCountState: number) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      )
   }, [data?.count, setRowCountState])

   React.useEffect(() => {
      const currencies: {
         currency: string
         balance: number
         type?: CurrencyType
         withdraw?: {
            count: number
            totalAmount: number
         }
         deposit?: {
            count: number
            totalAmount: number
         }
         topup?: {
            count: number
            totalAmount: number
         }
         game?: {
            count: number
            lostCount: number
            wonCount: number
            cashbackCount: number
            totalBetAmount: number
            totalWinAmount: number
            totalPl: number
            totalWinOdds: number
         }
         address?: {
            [key: string]: string
         }
      }[] = []
      const byCurrency: {
         currency: string
         balance: number
         type?: CurrencyType
         withdraw?: {
            count: number
            totalAmount: number
         }
         deposit?: {
            count: number
            totalAmount: number
         }
         topup?: {
            count: number
            totalAmount: number
         }
         game?: {
            count: number
            lostCount: number
            wonCount: number
            cashbackCount: number
            totalBetAmount: number
            totalWinAmount: number
            totalPl: number
            totalWinOdds: number
         }
         address?: {
            [key: string]: string
         }
      }[] =
         (dataFilter?.data?.wallet?.byCurrency &&
            Object.keys(dataFilter?.data?.wallet?.byCurrency).map(
               (obj, cur) => ({
                  currency: obj,
                  ...dataFilter?.data?.wallet?.byCurrency[obj],
               }),
               []
            )) ||
         []
      currencies.push(...byCurrency)
      const inUSD: {
         currency: string
         balance: number
         type?: CurrencyType
         withdraw?: {
            count: number
            totalAmount: number
         }
         deposit?: {
            count: number
            totalAmount: number
         }
         topup?: {
            count: number
            totalAmount: number
         }
         game?: {
            count: number
            lostCount: number
            wonCount: number
            cashbackCount: number
            totalBetAmount: number
            totalWinAmount: number
            totalPl: number
            totalWinOdds: number
         }
         address?: {
            [key: string]: string
         }
      } = {
         currency: 'inUSD',
         ...dataFilter?.data?.wallet?.inUSD,
      }
      currencies.push(inUSD)
      setData({
         count: currencies.length,
         currencies: currencies,
      })
   }, [dataFilter.data])

   return (
      <Box
         className="dataGridWrapper"
         mb={'0px'}
         px={isLgUp ? '12px' : '4px'}
         py={'6px'}
         pt={0}
         sx={{
            height: PageWith4Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            sx={GridStyle}
            rowHeight={isDesktop ? 44 : 30}
            getRowId={(row) => row.currency}
            rows={data?.currencies || []}
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
            loading={false}
            getRowClassName={(params) =>
               params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
               setColumnVisibilityModel(newModel)
            }
            slots={{
               noRowsOverlay: CustomNoRowsOverlay,
               noResultsOverlay: CustomNoRowsOverlay,
            }}
         />
      </Box>
   )
}
