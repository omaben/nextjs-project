import CustomLoader from '@/components/custom/CustomLoader'
import { PortalRealTimeDetailsTable } from '@/components/custom/PortalRealTimeDetailsTable'
import { PortalRealTimeTable } from '@/components/custom/PortalRealTimeTable'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import { BetStatus, RealtimeData } from '@alienbackoffice/back-front'
import { OperatorList } from '@alienbackoffice/back-front/lib/operator/interfaces/operator-list.interface'
import {
   Box,
   Card,
   CardContent,
   Grid,
   TextField,
   Typography,
   styled,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { darkPurple } from 'colors'
import type { ReactElement } from 'react'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import {
   selectAuthOperators,
   selectAuthRealTimeMessages,
} from 'redux/authSlice'
import { PageWith2Toolbar } from 'services/globalFunctions'
import { BetMode } from 'types'
import DashboardLayout from '../../layouts/Dashboard'

function GameCores() {
   const theme = useTheme()
   const [ignore, setIgnore] = React.useState(false)
   const FixedHeightTable = styled(PortalRealTimeTable)`
      height: 450px;
   `
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const operatorList = useSelector(selectAuthOperators) as OperatorList
   const [searchText, setSearchText] = React.useState('')
   const [totalBets, setTotalBets] = React.useState(0)
   const [totalPlayers, setTotalPlayers] = React.useState(0)
   const [statsData, setStatsData] = React.useState<
      { label: string; value: number }[]
   >([])
   const [operators, setOperators] = React.useState<
      { label: string; value: number }[]
   >([])
   const [betsPerMode, setBetsPerMode] = React.useState<
      { label: string; value: number }[]
   >([])
   const [betsPerGame, setBetsPerGame] = React.useState<
      { label: string; value: number }[]
   >([])
   const [betsPerCurrency, setBetsPerCurrency] = React.useState<
      { label: string; value: number }[]
   >([])
   const [bets, setBets] = React.useState<
      {
         betId: string
         playerNickname?: string
         playerId: string
         operator: string
         brandId?: string
         brandName?: string
         gameId: string
         gameTitle: string
         currency: string
         mode: string
         betsAmount: number
         odds: number
         oddsRange: number
         winOdds: number
         opId: string
         insurance: boolean
         autoCashout: boolean
         status: BetStatus
      }[]
   >([])
   const realtimeMessage = useSelector(selectAuthRealTimeMessages) as {
      coreId: string
      realtimeData: RealtimeData
   }
   useEffect(() => {
      if (!ignore) {
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   })
   // .reduce((acc, currentValue) => acc + currentValue, 0)
   useEffect(() => {
      setStatsData([
         {
            label: 'Open',
            value: realtimeMessage?.realtimeData?.list.filter(
               (item) =>
                  item.status === BetStatus.OPEN &&
                  (searchText === '' || item?.player?.opId.includes(searchText))
            ).length,
         },
         {
            label: 'Won',
            value: realtimeMessage?.realtimeData?.list.filter(
               (item) => item.status === BetStatus.WON
            ).length,
         },
         {
            label: 'Lost',
            value: realtimeMessage?.realtimeData?.list.filter(
               (item) =>
                  item.status === BetStatus.LOST &&
                  (searchText === '' || item?.player?.opId.includes(searchText))
            ).length,
         },
         {
            label: 'Cashback',
            value: realtimeMessage?.realtimeData?.list.filter(
               (item) =>
                  item.status === BetStatus.CASHBACK &&
                  (searchText === '' || item?.player?.opId.includes(searchText))
            ).length,
         },
      ])
      const betData = [] as {
         betId: string
         playerNickname?: string
         playerId: string
         operator: string
         brandId?: string
         brandName?: string
         gameId: string
         gameTitle: string
         currency: string
         mode: string
         betsAmount: number
         odds: number
         oddsRange: number
         winOdds: number
         opId: string
         insurance: boolean
         autoCashout: boolean
         status: BetStatus
      }[]
      realtimeMessage?.realtimeData?.list.map((item) => {
         betData.push({
            betId: item.id,
            betsAmount: item.betAmount,
            brandId: item.player?.brand?.brandId,
            brandName: item.player?.brand?.brandName,
            currency: item.currency,
            gameId: item.gameId,
            gameTitle: item.gameTitle,
            mode: item.gameData?.mode,
            odds: item.odds,
            oddsRange: item.gameData?.oddsRange,
            playerId: item.player?.playerId,
            playerNickname: item.player?.nickname,
            operator: `${item.player?.opId}_${
               operatorList?.operators.find(
                  (row) => row.opId === item.player?.opId
               )?.title ?? ''
            }`,
            winOdds: item.winOdds,
            opId: item.player?.opId,
            insurance: item.gameData?.insurance,
            autoCashout: item.gameData?.autoCashout,
            status: item.status,
         })
      })
      if (searchText === '') {
         setBets(betData)
      } else {
         setBets(betData.filter((item) => item.opId.includes(searchText)))
      }
      const operatorsData = [] as { label: string; value: number }[]
      const modeData = [] as { label: string; value: number }[]
      const gameData = [] as { label: string; value: number }[]
      const currencyData = [] as { label: string; value: number }[]
      const groupedDataByOpId: { [opId: string]: Set<string> } = {}
      const groupedDataByGame: { [mode: string]: number } = {}
      const groupedDataByMode: { [mode: string]: number } = {}
      const groupedDataByCurrency: { [mode: string]: number } = {}
      const uniquePlayerIds = new Set<string>()
      const staticGames = [
         '101',
         '102',
         '103',
         '104',
         '105',
         '1001',
         '1002',
         '1003',
         '1004',
         '1005',
         '1006',
         '1007',
         '2001',
      ]
      realtimeMessage?.realtimeData?.list.forEach((item) => {
         const {
            player,
            gameId,
            gameData,
            gameTitle,
            betAmountInUSD,
            currency,
         } = item
         if (player && player.playerId) {
            uniquePlayerIds.add(player.playerId)
         }
         if (player?.opId) {
            if (!groupedDataByOpId[player.opId]) {
               if (searchText === '' || player.opId.includes(searchText)) {
                  groupedDataByOpId[player.opId] = new Set()
               }
            }
            if (searchText === '' || player.opId.includes(searchText)) {
               groupedDataByOpId[player.opId].add(player?.playerId)
            }
         }

         if (gameData && gameData.mode) {
            const mode = gameData.mode

            if (!groupedDataByMode[mode]) {
               if (searchText === '' || player.opId.includes(searchText)) {
                  groupedDataByMode[mode] = 1
               }
            } else {
               if (searchText === '' || player.opId.includes(searchText)) {
                  groupedDataByMode[mode]++
               }
            }
         }

         if (gameId) {
            // const game = `${gameId}_${gameTitle}`
            const game = `${gameId}`

            if (!groupedDataByGame[game]) {
               if (searchText === '' || player.opId.includes(searchText)) {
                  groupedDataByGame[game] = 1
               }
            } else {
               if (searchText === '' || player.opId.includes(searchText)) {
                  groupedDataByGame[game]++
               }
            }
         }

         if (betAmountInUSD !== undefined && currency) {
            if (!groupedDataByCurrency[currency]) {
               if (searchText === '' || player.opId.includes(searchText)) {
                  groupedDataByCurrency[currency] = betAmountInUSD
               }
            } else {
               if (searchText === '' || player.opId.includes(searchText)) {
                  groupedDataByCurrency[currency] += betAmountInUSD
               }
            }
         }
      })
      Object.entries(groupedDataByOpId).forEach(([opId, playerIds]) => {
         operatorsData.push({
            label: `${opId}_${
               operatorList?.operators.find((row) => row.opId === opId)
                  ?.title ?? ''
            }`,
            value: playerIds.size,
         })
      })
      Object.entries(groupedDataByMode).forEach(([mode, count]) => {
         modeData.push({
            label: mode,
            value: count,
         })
      })
      Object.entries(BetMode).forEach(([string, BetMode]) => {
         if (modeData.findIndex((row) => row.label === BetMode) < 0) {
            modeData.push({
               label: BetMode,
               value: 0,
            })
         }
      })
      Object.entries(groupedDataByGame).forEach(([game, count]) => {
         gameData.push({
            label: game,
            value: count,
         })
      })
      staticGames.forEach((item) => {
         if (gameData.findIndex((row) => row.label === item) < 0) {
            gameData.push({
               label: item,
               value: 0,
            })
         }
      })
      Object.entries(groupedDataByCurrency).forEach(([currency, count]) => {
         currencyData.push({
            label: currency,
            value: count,
         })
      })
      setOperators(operatorsData.sort((a, b) => a.value - b.value))
      // setOperators([
      //    {
      //       label: '2001_alien-demo',
      //       value: 50,
      //    },
      //    {
      //       label: '2001_alien-demo-test',
      //       value: 20,
      //    },
      //    {
      //       label: '2001_alien',
      //       value: 100,
      //    },
      //    {
      //       label: '2001_alien-demo',
      //       value: 5,
      //    },
      //    {
      //       label: '2001_alien-demo',
      //       value: 1500,
      //    },
      //    {
      //       label: '2001_alien-demo',
      //       value: 50,
      //    },
      // ])
      setBetsPerMode(modeData.sort((a, b) => b.value - a.value))
      setBetsPerGame(gameData.sort((a, b) => b.value - a.value))
      setBetsPerCurrency(currencyData)
      setTotalBets(betData.reduce((sum, entry) => sum + 1, 0) || 0)
      setTotalPlayers(uniquePlayerIds.size)
   }, [realtimeMessage, searchText])

   return (
      <React.Fragment>
         <Helmet title="Game Cores" />
         <CustomOperatorsBrandsToolbar
            title={`Monitoring`}
            background={theme.palette.secondary.dark}
            sx={{
               mb: '8px',
            }}
         />
         {ignore ? (
            <Box
               className="dataGridWrapper"
               mb={'0px'}
               px={isLgUp ? '12px' : '4px'}
               py={'6px'}
               pt={0}
               sx={{
                  height: PageWith2Toolbar,
                  width: isDesktop ? 'calc(100vw - 225px)' : '100%',
                  overflowY: 'auto',
               }}
            >
               <Grid container spacing={1} overflow={'hidden'}>
                  <Grid item xs={12}>
                     <Grid
                        container
                        direction={['column-reverse', null, 'row']}
                        spacing={1}
                     >
                        <Grid item sm={3} xs={12}>
                           <TextField
                              label="Search"
                              type="search"
                              value={searchText}
                              fullWidth
                              autoComplete="off"
                              sx={{
                                 mt: 0,
                                 height: '48px',
                                 width: '100%',
                                 '.MuiInputBase-root': {
                                    minHeight: '48px',
                                    background: darkPurple[12],
                                    border: `1px solid ${darkPurple[11]}`,
                                    borderRadius: '8px',
                                 },
                                 '.MuiFormLabel-root': {
                                    top: '-4px',
                                 },
                                 '.MuiFormLabel-filled, &.Mui-focused, &.MuiInputLabel-shrink':
                                    {
                                       top: '16px !important',
                                    },
                              }}
                              onChange={(e) => setSearchText(e.target.value)}
                              className="searchTextField"
                           />
                        </Grid>
                        <Grid item sm={3} xs={12}>
                           <Card
                              sx={{
                                 flex: 1,
                                 mb: 0,
                                 border: 'none',
                              }}
                           >
                              <CardContent
                                 sx={{
                                    paddingBottom: '0!important',
                                    p: '16px !important',
                                 }}
                              >
                                 <Typography
                                    variant="h4"
                                    textAlign={'center'}
                                    alignItems={'center'}
                                    color={(props) => '#000'}
                                 >
                                    Total Bets : {totalBets}
                                 </Typography>
                              </CardContent>
                           </Card>
                        </Grid>
                        <Grid item sm={3} xs={12}>
                           <Card
                              sx={{
                                 flex: 1,
                                 mb: 0,
                                 border: 'none',
                              }}
                           >
                              <CardContent
                                 sx={{
                                    paddingBottom: '0!important',
                                    p: '16px !important',
                                 }}
                              >
                                 <Typography
                                    variant="h4"
                                    textAlign={'center'}
                                    alignItems={'center'}
                                    color={(props) => '#000'}
                                 >
                                    Total Players : {totalPlayers}
                                 </Typography>
                              </CardContent>
                           </Card>
                        </Grid>
                        <Grid item sm={3} xs={12}>
                           <Box
                              sx={{
                                 width: '100%',
                                 textAlign: 'center',
                                 background: '#1F1933',
                                 border: '0.503px solid #332C4A',
                                 borderRadius: '8px',
                                 fontSize: '40px',
                                 letterSpacing: '0.2px',
                                 gap: '6.04px',
                                 height: '48px',
                                 fontFamily: 'Nunito Sans Bold',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 color: '#fff',
                              }}
                           >
                              999.99x
                           </Box>
                        </Grid>
                     </Grid>
                  </Grid>
                  <Grid item xs={12}>
                     <FixedHeightTable
                        rows={bets}
                        isLoading={false}
                        linkLabel={'BetId'}
                        noChart={true}
                     />
                  </Grid>
                  <Grid item sm={6} xs={12} p={0}>
                     <PortalRealTimeDetailsTable
                        rows={operators}
                        isLoading={false}
                        linkLabel={'Operator'}
                     />
                  </Grid>
                  <Grid item sm={6} xs={12} p={0}>
                     <PortalRealTimeDetailsTable
                        rows={betsPerGame}
                        isLoading={false}
                        linkLabel={'Bet Per Game'}
                     />
                  </Grid>
                  <Grid item sm={4} xs={12} p={0}>
                     <PortalRealTimeDetailsTable
                        rows={betsPerMode}
                        isLoading={false}
                        linkLabel={'Bet Per Mode'}
                     />
                  </Grid>
                  <Grid item sm={4} xs={12} p={0}>
                     <PortalRealTimeDetailsTable
                        rows={betsPerCurrency}
                        isLoading={false}
                        linkLabel={'Currency'}
                        currency={true}
                     />
                  </Grid>
                  <Grid item sm={4} xs={12} p={0}>
                     <PortalRealTimeDetailsTable
                        rows={statsData}
                        isLoading={false}
                        linkLabel={'Stats'}
                     />
                  </Grid>
               </Grid>
            </Box>
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

GameCores.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="RealTime">{page}</DashboardLayout>
}

export default GameCores
