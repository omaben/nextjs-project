import { Report } from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import {
   Box,
   CardContent,
   CardHeader,
   Grid,
   Card as MuiCard,
   Stack,
   Typography,
   useMediaQuery,
} from '@mui/material'
import { spacing, useTheme } from '@mui/system'
import { darkPurple } from 'colors'
import moment from 'moment'
import numeral from 'numeral'
import React, { useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { useSelector } from 'react-redux'
import {
   selectAuthCurrencyOption,
   selectAuthCurrenturrency,
} from 'redux/authSlice'
import { getCrashConfig } from 'redux/slices/crashConfig'
import { CURENCYTYPE, ChartDataName } from 'types'

export interface PortalStatsChartProps {
   rows: Report[]
   format: string
   inUSD?: boolean
}

export default function PortalStatsLineChartReports(
   props: PortalStatsChartProps
) {
   const currencyOption = useSelector(selectAuthCurrencyOption)
   const currency: string = useSelector(selectAuthCurrenturrency) || ''
   const dataLabels: any = []
   const timezone = useSelector(getCrashConfig).timezone
   props.rows &&
      props.rows?.map((report: Report) => {
         let date = moment(report.from).tz('GMT').format(props.format)
         dataLabels.push(date)
      })
   const Circle = styled(Box)`
      height: 12px;
      width: 12px;
      border-radius: 16px;
   `
   let currencyReport =
      currencyOption?.value === 0 && !props.inUSD
         ? currency
         : currencyOption.name === CURENCYTYPE.INUSD || props.inUSD
         ? 'totalInUSD'
         : 'totalInEUR'
   const [data, setData] = React.useState({
      labels: [] as string[],
      datasets: [] as any,
   })
   const theme = useTheme()

   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

   const Card = styled(MuiCard)(spacing)
   const ChartWrapper = styled.div`
      height: ${'350px'};
      width: ${isDesktop ? 'initial' : 'initial'};
   `
   const [currentActiveChart, setCurrentActiveChart] = React.useState(
      ChartDataName.BETS
   )
   const updateChart = () => {
      const labels = [] as string[]
      props.rows &&
         props.rows?.map((report: Report) => {
            let date = moment(report.from).tz(timezone).format(props.format)
            let dateFormat = date
            labels.push(dateFormat.toString())
         })
      let dataActive: number[] = []
      let dataActiveCumulative: number[] = []
      let backgroundColor: string = 'rgba(94, 234, 146, .24)'
      let borderColor: string = '#07932C'
      let label: string = 'Bets'
      switch (currentActiveChart) {
         case ChartDataName.BETS:
            dataActive =
               props.rows?.map(
                  (report: Report) =>
                     (report?.data && report?.data[currencyReport]?.betCount) ||
                     0
               ) || []
            backgroundColor = 'rgba(94, 234, 146, .85)'
            borderColor = '#07932C'
            label = 'Bets'
            dataActiveCumulative = (props.rows &&
               props.rows
                  .flatMap(
                     (report: Report) =>
                        (report?.data &&
                           report?.data[currencyReport]?.betCount) ||
                        0
                  )
                  .reduce((acc: number[], curr: number, index: number) => {
                     acc.push((acc[index - 1] || 0) + curr)
                     return acc
                  }, [])) || [0]
            break

         case ChartDataName.BET_AMOUNT:
            dataActive =
               props.rows?.map(
                  (report: Report) =>
                     (report?.data &&
                        (currencyReport === 'totalInUSD'
                           ? report?.data[currencyReport]
                                ?.totalBetAmountInCurrentUSD
                           : report?.data[currencyReport]?.totalBetAmount)) ||
                     0
               ) || []
            backgroundColor = 'rgba(255, 84, 135, .5)'
            borderColor = '#FA0082'
            label = 'Bet Amount'
            dataActiveCumulative = (props.rows &&
               props.rows
                  .flatMap(
                     (report: Report) =>
                        (report?.data &&
                           (currencyReport === 'totalInUSD'
                              ? report?.data[currencyReport]
                                   ?.totalBetAmountInCurrentUSD
                              : report?.data[currencyReport]
                                   ?.totalBetAmount)) ||
                        0
                  )
                  .reduce((acc: number[], curr: number, index: number) => {
                     acc.push((acc[index - 1] || 0) + curr)
                     return acc
                  }, [])) || [0]
            break

         case ChartDataName.PL:
            dataActive =
               props.rows?.map(
                  (report: Report) =>
                     (report?.data &&
                        (currencyReport === 'totalInUSD'
                           ? report?.data[currencyReport]?.totalPlInCurrentUSD
                           : report?.data[currencyReport]?.totalPl)) ||
                     0
               ) || []
            backgroundColor = 'rgba(127, 86, 217, .5)'
            borderColor = '#7F56D9'
            label = 'PL'
            dataActiveCumulative = (props.rows &&
               props.rows
                  .flatMap(
                     (report: Report) =>
                        (report?.data &&
                           (currencyReport === 'totalInUSD'
                              ? report?.data[currencyReport]
                                   ?.totalPlInCurrentUSD
                              : report?.data[currencyReport]?.totalPl)) ||
                        0
                  )
                  .reduce((acc: number[], curr: number, index: number) => {
                     acc.push((acc[index - 1] || 0) + curr)
                     return acc
                  }, [])) || [0]
            break

         case ChartDataName.PLAYER:
            dataActive =
               props.rows?.map(
                  (report: Report) =>
                     (report?.data &&
                        report?.data[currencyReport]?.uniquePlayers) ||
                     0
               ) || []
            backgroundColor = 'rgba(255, 206, 117, .85)'
            borderColor = '#FDB022'
            label = 'Player'
            dataActiveCumulative = (props.rows &&
               props.rows
                  .flatMap(
                     (report: Report) =>
                        (report?.data &&
                           report?.data[currencyReport]?.uniquePlayers) ||
                        0
                  )
                  .reduce((acc: number[], curr: number, index: number) => {
                     acc.push((acc[index - 1] || 0) + curr)
                     return acc
                  }, [])) || [0]
            break

         case ChartDataName.DEPOSIT:
            dataActive =
               props.rows?.map(
                  (report: Report) =>
                     (report?.data &&
                        (currencyReport === 'totalInUSD'
                           ? report?.data[currencyReport]
                                ?.totalDepositAmountInCurrentUSD
                           : report?.data[currencyReport]
                                ?.totalDepositAmount)) ||
                     0
               ) || []
            backgroundColor = 'rgba(46,144,250,.85)'
            borderColor = '#2E90FA'
            label = 'Deposit'
            dataActiveCumulative = (props.rows &&
               props.rows
                  .flatMap(
                     (report: Report) =>
                        (report?.data &&
                           (currencyReport === 'totalInUSD'
                              ? report?.data[currencyReport]
                                   ?.totalDepositAmountInCurrentUSD
                              : report?.data[currencyReport]
                                   ?.totalDepositAmount)) ||
                        0
                  )
                  .reduce((acc: number[], curr: number, index: number) => {
                     acc.push((acc[index - 1] || 0) + curr)
                     return acc
                  }, [])) || [0]
            break
         case ChartDataName.TOPUP:
            dataActive =
               props.rows?.map(
                  (report: Report) =>
                     (report?.data &&
                        (currencyReport === 'totalInUSD'
                           ? report?.data[currencyReport]
                                ?.totalTopupAmountInCurrentUSD
                           : report?.data[currencyReport]?.totalTopupAmount)) ||
                     0
               ) || []
            backgroundColor = 'rgba(238,103,0,.5)'
            borderColor = '#EE6700'
            label = 'Topup'
            dataActiveCumulative = (props.rows &&
               props.rows
                  .flatMap(
                     (report: Report) =>
                        (report?.data &&
                           (currencyReport === 'totalInUSD'
                              ? report?.data[currencyReport]
                                   ?.totalTopupAmountInCurrentUSD
                              : report?.data[currencyReport]
                                   ?.totalTopupAmount)) ||
                        0
                  )
                  .reduce((acc: number[], curr: number, index: number) => {
                     acc.push((acc[index - 1] || 0) + curr)
                     return acc
                  }, [])) || [0]
            break
         case ChartDataName.WITHDRAW:
            dataActive =
               props.rows?.map(
                  (report: Report) =>
                     (report?.data &&
                        (currencyReport === 'totalInUSD'
                           ? report?.data[currencyReport]
                                ?.totalWithdrawAmountInCurrentUSD
                           : report?.data[currencyReport]
                                ?.totalWithdrawAmount)) ||
                     0
               ) || []
            backgroundColor = 'rgba(240,68,56, .5)'
            borderColor = '#F04438'
            label = 'Withdraw'
            dataActiveCumulative = (props.rows &&
               props.rows
                  .flatMap(
                     (report: Report) =>
                        (report?.data &&
                           (currencyReport === 'totalInUSD'
                              ? report?.data[currencyReport]
                                   ?.totalWithdrawAmountInCurrentUSD
                              : report?.data[currencyReport]
                                   ?.totalWithdrawAmount)) ||
                        0
                  )
                  .reduce((acc: number[], curr: number, index: number) => {
                     acc.push((acc[index - 1] || 0) + curr)
                     return acc
                  }, [])) || [0]
            break
      }
      setData({
         labels: [...labels],
         datasets: [
            {
               type: 'line',
               label: label,
               fill: false,
               backgroundColor: backgroundColor,
               borderColor: borderColor,
               tension: 0.4,
               data: dataActiveCumulative,
            },
            {
               type: 'bar',
               label: label,
               fill: false,
               backgroundColor: backgroundColor,
               borderColor: borderColor,
               tension: 0.4,
               data: dataActive,
            },
         ],
      })
   }
   useEffect(() => {
      updateChart()
   }, [props.rows, currentActiveChart, currencyReport])

   const options = {
      maintainAspectRatio: false,
      plugins: {
         legend: {
            display: false,
         },
      },
      scales: {
         x: {
            grid: {
               color: 'rgba(0,0,0,0.05)',
            },
         },
         y: {
            display: true,
            beginAtZero: true,
            borderDash: [5, 5],
            grid: {
               color: 'rgba(0,0,0,0)',
               fontColor: '#fff',
            },
            ticks: {
               callback: (value: any) => {
                  return numeral(value)
                     .format(
                        `${
                           [
                              ChartDataName.BET_AMOUNT,
                              ChartDataName.PL,
                           ].includes(currentActiveChart) &&
                           currencyOption.name == CURENCYTYPE.INUSD &&
                           '$'
                        }0a.[00]`
                     )
                     .toUpperCase()
               },
               stepSize: 1,
            },
         },
      },
   }
   return (
      <Card>
         <CardHeader
            title={
               <Grid container alignItems={'center'} spacing={2}>
                  <Grid item>
                     <Typography variant="h1">{'Report Chart'}</Typography>
                  </Grid>
               </Grid>
            }
         />
         <Grid
            container
            alignItems={'center'}
            spacing={0}
            gap={'6px'}
            p={'12px'}
            sx={{
               '.itemChart.MuiStack-root': {
                  height: '21px',
                  border: '1px solid #8b859f',
                  padding: '4px',
                  borderRadius: '6px',
                  p: {
                     color: darkPurple[3],
                  },
               },
               '.active .itemChart.MuiStack-root': {
                  border: 'none',
                  '.MuiBox-root': {
                     background: (props) => props.palette.primary.contrastText,
                  },
                  '.MuiTypography-root': {
                     color: (props) => props.palette.primary.contrastText,
                  },
               },
            }}
         >
            {/* <Grid item>
               <CurrenciesFilter />
            </Grid> */}

            <Grid
               item
               sx={{
                  display: 'flex',
                  '&.active .itemChart.MuiStack-root': {
                     background: '#07932C',
                  },
               }}
               className={
                  currentActiveChart === ChartDataName.BETS ? 'active' : ''
               }
            >
               <Stack
                  direction="row"
                  className="itemChart"
                  alignItems="center"
                  gap={2}
                  onClick={() => setCurrentActiveChart(ChartDataName.BETS)}
                  sx={{ cursor: 'pointer' }}
               >
                  <Circle
                     sx={{
                        background: '#07932C',
                     }}
                  />
                  <Typography variant="body1">Bets</Typography>
               </Stack>
            </Grid>
            <Grid
               item
               sx={{
                  display: 'flex',
                  '&.active .itemChart.MuiStack-root': {
                     background: '#FA0082',
                  },
               }}
               className={
                  currentActiveChart === ChartDataName.BET_AMOUNT
                     ? 'active'
                     : ''
               }
            >
               <Stack
                  direction="row"
                  className="itemChart"
                  alignItems="center"
                  gap={2}
                  onClick={() =>
                     setCurrentActiveChart(ChartDataName.BET_AMOUNT)
                  }
                  sx={{ cursor: 'pointer' }}
               >
                  <Circle
                     sx={{
                        background: '#FA0082',
                     }}
                  />
                  <Typography variant="body1">Bet Amount</Typography>
               </Stack>
            </Grid>
            <Grid
               item
               sx={{
                  display: 'flex',
                  cursor: 'pointer',
                  '&.active .itemChart.MuiStack-root': {
                     background: '#7F56D9',
                  },
               }}
               className={
                  currentActiveChart === ChartDataName.PL ? 'active' : ''
               }
            >
               <Stack
                  direction="row"
                  className="itemChart"
                  alignItems="center"
                  gap={2}
                  onClick={() => setCurrentActiveChart(ChartDataName.PL)}
               >
                  <Circle
                     sx={{
                        background: '#7F56D9',
                     }}
                  />
                  <Typography variant="body1">PL</Typography>
               </Stack>
            </Grid>
            <Grid
               item
               sx={{
                  display: 'flex',
                  cursor: 'pointer',
                  '&.active .itemChart.MuiStack-root': {
                     background: '#FDB022',
                  },
               }}
               className={
                  currentActiveChart === ChartDataName.PLAYER ? 'active' : ''
               }
            >
               <Stack
                  direction="row"
                  className="itemChart"
                  alignItems="center"
                  gap={2}
                  onClick={() => setCurrentActiveChart(ChartDataName.PLAYER)}
               >
                  <Circle
                     sx={{
                        background: '#FDB022',
                     }}
                  />
                  <Typography variant="body1">Player</Typography>
               </Stack>
            </Grid>
            <Grid
               item
               sx={{
                  display: 'flex',
                  cursor: 'pointer',
                  '&.active .itemChart.MuiStack-root': {
                     background: '#2E90FA',
                  },
               }}
               className={
                  currentActiveChart === ChartDataName.DEPOSIT ? 'active' : ''
               }
            >
               <Stack
                  direction="row"
                  className="itemChart"
                  alignItems="center"
                  gap={2}
                  onClick={() => setCurrentActiveChart(ChartDataName.DEPOSIT)}
               >
                  <Circle
                     sx={{
                        background: '#2E90FA',
                     }}
                  />
                  <Typography variant="body1">Deposit</Typography>
               </Stack>
            </Grid>
            <Grid
               item
               sx={{
                  display: 'flex',
                  cursor: 'pointer',
                  '&.active .itemChart.MuiStack-root': {
                     background: '#EE6700',
                  },
               }}
               className={
                  currentActiveChart === ChartDataName.TOPUP ? 'active' : ''
               }
            >
               <Stack
                  direction="row"
                  className="itemChart"
                  alignItems="center"
                  gap={2}
                  onClick={() => setCurrentActiveChart(ChartDataName.TOPUP)}
               >
                  <Circle
                     sx={{
                        background: '#EE6700',
                     }}
                  />
                  <Typography variant="body1">Topup</Typography>
               </Stack>
            </Grid>
            <Grid
               item
               sx={{
                  display: 'flex',
                  cursor: 'pointer',
                  '&.active .itemChart.MuiStack-root': {
                     background: '#F04438',
                  },
               }}
               className={
                  currentActiveChart === ChartDataName.WITHDRAW ? 'active' : ''
               }
            >
               <Stack
                  direction="row"
                  className="itemChart"
                  alignItems="center"
                  gap={2}
                  onClick={() => setCurrentActiveChart(ChartDataName.WITHDRAW)}
               >
                  <Circle
                     sx={{
                        background: '#F04438',
                     }}
                  />
                  <Typography variant="body1">Withdraw</Typography>
               </Stack>
            </Grid>
         </Grid>
         <CardContent
            sx={{
               overflow: 'auto',
               p: 0,
               pb: '0 !important',
            }}
         >
            <ChartWrapper>
               <Line data={data} options={options} />
            </ChartWrapper>
         </CardContent>
      </Card>
   )
}
