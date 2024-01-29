import GridStyle from '@/components/custom/GridStyle'
import PortalCurrencyValue from '@/components/custom/PortalCurrencyValue'
import {
   renderRelatedPlayerStatusCell,
   renderTimeCell
} from '@/components/custom/PortalRenderCells'
import {
   GetRelatedPlayersDto,
   Player,
   UserPermissionEvent
} from '@alienbackoffice/back-front'
import { GetPlayerListFindDto } from '@alienbackoffice/back-front/lib/player/dto/get-player-list.dto'
import { RelatedPlayersParam } from '@alienbackoffice/back-front/lib/player/enum/related-players-param.enum'
import { PlayerList } from '@alienbackoffice/back-front/lib/player/interfaces/player-list.interface'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridSortModel,
} from '@mui/x-data-grid-pro'
import React from 'react'
import { useSelector } from 'react-redux'
import {
   saveRelatedPlayersList,
   selectAuthCurrentBrand,
   selectAuthRelatedPlayer,
   selectAuthRelatedPlayersList,
} from 'redux/authSlice'
import { selectloadingRelatedPlayers } from 'redux/loadingSlice'
import { store } from 'redux/store'
import { CustomNoRowsOverlay, PageWith4Toolbar } from 'services/globalFunctions'
import { v4 as uuidv4 } from 'uuid'
import { useGetRelatedPlayers } from './lib/hooks/queries'

export default function RelatedAccounts(dataFilter: { data: Player }) {
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [ignore, setIgnore] = React.useState(false)
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const boClient = store.getState().socket.boClient
   const [data, setData] = React.useState<{
      count: number
      players: []
   }>({
      count: 0,
      players: [],
   })
   const [dataSort, setDataSort]: any = React.useState({
      createdAt: -1,
   })
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 20,
      page: 0,
   })
   const columns: GridColDef[] = [
      {
         field: 'playerId',
         headerName: 'Player',
         renderCell: (params) =>
            renderRelatedPlayerStatusCell(
               params.value,
               params.row.opId,
               params.row.nicknameIsSet && params.row.nickname
            ),
         minWidth: 150,
         flex: 1,
         hideable: false,
      },
      {
         field: 'balance',
         headerName: 'Balance',
         renderCell: (params: { row: Player }) => (
            <Typography>
               <PortalCurrencyValue
                  value={params.row.wallet?.inUSD?.balance}
                  currency={'USD'}
                  textTransform="uppercase"
                  visibleCurrency={true}
               />
            </Typography>
         ),
         hideable: false,
         minWidth: 100,
         // sortable: false,
         filterable: false,
         disableColumnMenu: true,
         flex: 1,
      },
      {
         field: 'relatedParams',
         headerName: 'Relation',
         renderCell: (params) => params.value && params.value.join('\n'),
         hideable: false,
         minWidth: 100,
         // sortable: false,
         filterable: false,
         sortable: false,
         disableColumnMenu: true,
         flex: 1,
      },
      {
         field: 'createdAt',
         headerName: 'Joined At',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
      },
      {
         field: 'updatedAt',
         headerName: 'Last activity',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
      },
   ]
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   const relatedPlayersList = useSelector(
      selectAuthRelatedPlayersList
   ) as PlayerList
   const relatedPlayers = useSelector(selectAuthRelatedPlayer) as {
      opId: string
      relatedPlayers: {
         playerId: string
         relatedParams: RelatedPlayersParam
      }[]
   }
   const post: GetRelatedPlayersDto = {
      opId: dataFilter?.data?.opId,
      playerId: dataFilter?.data?.playerId,
      relatedParams: [RelatedPlayersParam.IP],
   }
   const brandId = useSelector(selectAuthCurrentBrand)
   if (brandId && brandId !== 'All Brands') {
      post.brandId = brandId
   }
   const loadingRelatedAccounts = useSelector(selectloadingRelatedPlayers)

   useGetRelatedPlayers(post)

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field
         let data = {}
         fieldName === 'playerId'
            ? (data = {
                 playerId: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'createdAt'
            ? (data = {
                 createdAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'balance'
            ? (data = {
                 balance: sortModel[0].sort === 'asc' ? 1 : -1,
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

   React.useEffect(() => {
      const startIndex = paginationModel.page * 20
      const endIndex = startIndex + 20
      const playerIds = relatedPlayers?.relatedPlayers
         ?.slice(startIndex, endIndex)
         .map((item) => item.playerId)
      if (playerIds?.length > 0) {
         const skip = 0
         const find: GetPlayerListFindDto = {}
         find.playerIds = playerIds
         boClient?.player.getPlayerList(
            {
               skip,
               limit: paginationModel.pageSize,
               find,
               sort: dataSort,
               opId: dataFilter.data.opId,
            },
            {
               uuid: uuidv4(),
               meta: {
                  type: 'relatedList',
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_PLAYER_LIST_REQ,
               },
            }
         )
      } else {
         setData({ count: 0, players: [] })
      }
   }, [relatedPlayers, paginationModel.page, dataSort])

   React.useEffect(() => {
      const updateRelatedPlayers: Player[] = relatedPlayersList?.players?.map(
         (item) => {
            const matchingPlayer1 = relatedPlayers?.relatedPlayers?.find(
               (player) => player.playerId === item.playerId
            )

            if (matchingPlayer1) {
               // Merge properties from player1 into player2 (you can customize this as needed)
               return { ...item, ...matchingPlayer1 }
            } else {
               return item // If no match is found, keep player2 as is
            }
         }
      )
      setData({
         count: relatedPlayers?.relatedPlayers?.length || 0,
         players: updateRelatedPlayers as [],
      })
   }, [relatedPlayersList])

   React.useEffect(() => {
      if (!ignore) {
         store.dispatch(saveRelatedPlayersList([]))
         setIgnore(true)
      }
   })

   return (
      <Box
         className="dataGridWrapper"
         mb={'0px'}
         px={isLgUp ? '12px' : '4px'}
         py={'0'}
         sx={{
            height: PageWith4Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
            '.MuiTablePagination-root .MuiTablePagination-selectLabel, .MuiTablePagination-root .MuiInputBase-root':
               {
                  display: 'none',
               },
         }}
      >
         <DataGridPro
            disableVirtualization
            sx={GridStyle}
            rowHeight={isDesktop ? 44 : 30}
            getRowId={(row) => row?.playerId}
            rows={data?.players || []}
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
            loading={loadingRelatedAccounts}
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
