import {
   renderBetAmountCell,
   renderBrandCell,
   renderCurrencyCell,
   renderGameCell,
   renderPlayerStatusCell,
   renderPLCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells'
import {
   useGetBetsListQuery,
   UseGetBetsListQueryProps,
} from '@/components/data/bets/lib/hooks/queries'
import { BetStatus } from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faRobot } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import { GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid'
import { DataGridPro } from '@mui/x-data-grid-pro'
import moment from 'moment'
import React from 'react'
import { useSelector } from 'react-redux'
import {
   selectAuthBetsLuckyWins,
   selectAuthCurrencyOption,
   selectAuthCurrentBrand,
   selectAuthOperator,
} from 'redux/authSlice'
import { selectLoadingLuckWins } from 'redux/loadingSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
} from 'services/globalFunctions'
import { betListType, CURENCYTYPE, StartEndDateProps } from 'types'
import GridStyle from '../GridStyle'
import PortalCopyValue from '../PortalCopyValue'

export function CustomFooterStatusComponent(props: {}) {
   return <Box></Box>
}

export default function LuckyWins({
   startDate,
   endDate,
   searchDate,
}: StartEndDateProps) {
   const opId = useSelector(selectAuthOperator)
   const currenctBrandId = useSelector(selectAuthCurrentBrand)
   const currencyOption = useSelector(selectAuthCurrencyOption)
   const data = useSelector(selectAuthBetsLuckyWins)
   const columns: GridColDef[] = [
      {
         field: 'id',
         headerName: 'ID',
         renderCell: (params) =>
            params &&
            params.value && (
               <>
                  <PortalCopyValue
                     value={params.value}
                     hideText
                     sx={{
                        mr: 1,
                     }}
                  />
                  {params.row.isTest && (
                     <Tooltip title={'Test'} placement="left">
                        <FontAwesomeIcon
                           icon={faRobot as IconProp}
                           color={'#8098F9'}
                        />
                     </Tooltip>
                  )}
               </>
            ),
         width: 50,
         hideable: false,
         filterable: false,
         disableColumnMenu: true,
         hideSortIcons: true,
      },
      {
         field: 'placedAt',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Date/Time',
         renderCell: (params) =>
            params && params.value && renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         sortable: true,
         cellClassName: 'caption-column',
         disableColumnMenu: true,
         hideSortIcons: true,
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
               params.row.playerStatus === true,
               params.row.player?.nicknameIsSet && params.row.player?.nickname,
               false,
               params.row.player
            ),
         minWidth: 150,
         flex: 1,
         disableColumnMenu: true,
         hideSortIcons: true,
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
         minWidth: 130,
         flex: 1,
         filterable: false,
         disableColumnMenu: true,
         hideSortIcons: true,
      },
      {
         field: 'gameId',
         headerName: 'Game',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            params &&
            params.value &&
            renderGameCell(params.value, params.row.gameTitle),
         minWidth: 130,
         flex: 1,
         filterable: false,
         disableColumnMenu: true,
         hideSortIcons: true,
      },
      {
         field: 'currency',
         headerName: 'Currency',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            params && params.value && renderCurrencyCell(params.value),

         minWidth: 120,
         filterable: false,
         flex: 1,
         disableColumnMenu: true,
         hideSortIcons: true,
      },
      {
         field: 'betAmount',
         headerName: 'Bet Amount',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderBetAmountCell(params.row.betAmount, params.row.currency),
         minWidth: 120,
         filterable: false,
         flex: 1,
         disableColumnMenu: true,
         hideSortIcons: true,
      },
      {
         field: 'betAmountInUSD',
         headerName: 'Bet amount USD',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderBetAmountCell(params.row.betAmountInUSD, 'USD'),

         minWidth: 120,
         filterable: false,
         flex: 1,
         disableColumnMenu: true,
         hideSortIcons: true,
      },
      {
         field: 'betAmountInEUR',
         headerName: 'Bet Amount EUR',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            renderBetAmountCell(params.row.betAmountInEUR, 'EUR'),

         minWidth: 120,
         filterable: false,
         flex: 1,
         disableColumnMenu: true,
         hideSortIcons: true,
      },
      {
         field: 'plInUSD',
         headerName: 'PL USD',
         headerAlign: 'center',
         align: 'center',
         minWidth: 100,
         flex: 1,
         renderCell: (params) => (
            <Stack>{renderPLCell(params.row.plInUSD, 'USD')}</Stack>
         ),
         cellClassName: 'caption-column',
         disableColumnMenu: true,
         hideSortIcons: true,
      },
      {
         field: 'plInEUR',
         headerName: 'PL EUR',
         headerAlign: 'center',
         align: 'center',
         minWidth: 100,
         flex: 1,
         renderCell: (params) => (
            <Stack>{renderPLCell(params.row.plInEUR, 'EUR')}</Stack>
         ),
         cellClassName: 'caption-column',
         disableColumnMenu: true,
         hideSortIcons: true,
      },
      {
         field: 'pl',
         headerName: 'PL',
         headerAlign: 'center',
         align: 'center',
         minWidth: 150,
         flex: 1,
         renderCell: (params) => (
            <Stack>{renderPLCell(params.row.pl, params.row.currency)}</Stack>
         ),
         cellClassName: 'caption-column',
         disableColumnMenu: true,
         hideSortIcons: true,
      },
      {
         field: 'winOdds',
         headerName: 'Win Odds',
         headerAlign: 'center',
         align: 'center',
         minWidth: 150,
         flex: 1,
         disableColumnMenu: true,
         hideSortIcons: true,
         renderCell: (params) => (
            <Stack>
               <Typography variant="bodySmallBold">
                  {(Math.floor(params.row.winOdds * 100) / 100).toFixed(2)}x
               </Typography>
            </Stack>
         ),
      },
   ]
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const loadingLuckWins = useSelector(selectLoadingLuckWins)
   const post: UseGetBetsListQueryProps = {
      limit: 10,
      opId: opId,
      page: 0,
      sort: {
         winOdds: -1,
      },
      status: [BetStatus.WON],
      placedAtFrom: moment(startDate).utc().unix() * 1000,
      placedAtTo: moment(endDate).utc().unix() * 1000,
      key: betListType.LUCKYWINS,
      searchDate: searchDate,
   }
   if (currenctBrandId !== 'All Brands') {
      post.brandId = currenctBrandId
   }

   useGetBetsListQuery(post)

   return (
      <Box
         className="dataGridWrapper"
         mb={'0px'}
         py={'6px'}
         sx={{
            height: isDesktop ? 520 : 440,
            minHeight: 310,
            width: isDesktop
               ? isLgUp
                  ? 'calc(100vw - 245px)'
                  : 'calc(100vw - 232px)'
               : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            sx={GridStyle}
            getRowId={(row) => row.id}
            rows={data?.bets || []}
            rowHeight={isDesktop ? 44 : 30}
            columns={columns}
            disableRowSelectionOnClick
            loading={loadingLuckWins}
            getRowClassName={(params) =>
               params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            columnVisibilityModel={{
               betAmount: currencyOption.name === CURENCYTYPE.ORIGINAL,
               betAmountInUSD: currencyOption.name === CURENCYTYPE.INUSD,
               betAmountInEUR: currencyOption.name === CURENCYTYPE.INEUR,
               pl: currencyOption.name === CURENCYTYPE.ORIGINAL,
               plInUSD: currencyOption.name === CURENCYTYPE.INUSD,
               plInEUR: currencyOption.name === CURENCYTYPE.INEUR,
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
