import {
   GetFinancialReportDto,
   Report,
   ReportTimeInterval,
} from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import {
   Button,
   CardActions,
   CardContent,
   CardHeader,
   Grid,
   Card as MuiCard,
   Skeleton,
   Stack,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableRow,
   Typography,
   useMediaQuery,
} from '@mui/material'
import { Box, spacing, useTheme } from '@mui/system'
import { Chart, Filler } from 'chart.js'
import { ImoonGray, darkPurple } from 'colors'
import moment from 'moment'
import numeral from 'numeral'
import React, { useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { useSelector } from 'react-redux'
import {
   selectAuthCurrencyOption,
   selectAuthCurrentBrand,
   selectAuthCurrenturrency,
   selectAuthFinancialReportsGraph,
   selectAuthOperator,
} from 'redux/authSlice'
import { selectLoadingFinancialReport } from 'redux/loadingSlice'
import { getCrashConfig } from 'redux/slices/crashConfig'
import { CURENCYTYPE, ChartDataName, DataType, Granularity } from 'types'
import { useGetReportFinancialQuery } from '../data/reports/lib/hooks/queries'
import CurrenciesFilter from '../pages/dashboard/default/Currencies'
import { renderBetAmountCell, renderPLCell } from './PortalRenderCells'

export interface PortalStatsChartProps {
   startDate: Date
   endDate: Date
   setData?: Function
   isLoading?: boolean
   playerId?: string
   usedCurrency?: boolean
}

function MemoizedPortalBetsLineChart(props: PortalStatsChartProps) {
   const currencyOption = useSelector(selectAuthCurrencyOption)
   const [datashow, setDatashow] = React.useState(DataType.CHART)
   const opId = useSelector(selectAuthOperator)
   const currency: string = useSelector(selectAuthCurrenturrency) || ''
   let currencyReport = currency
   if (currencyOption?.value !== 0) {
      currencyReport =
         currencyOption.name == CURENCYTYPE.INUSD ? 'totalInUSD' : 'totalInEUR'
   }
   const currentBrandId: string = useSelector(selectAuthCurrentBrand) || ''
   const startDateUnix = new Date(props.startDate)
   const endDateUnix = new Date(props.endDate)
   const diff = endDateUnix.getTime() - startDateUnix.getTime()
   const granularity =
      diff < 2 * 86400000
         ? Granularity.ONEHOUR
         : diff < 32 * 86400000
         ? Granularity.ONEDAY
         : Granularity.ONEMONTH
   const postDays: GetFinancialReportDto = {
      opId: opId,
      from: startDateUnix.getTime(),
      to: endDateUnix.getTime(),
      timeInterval:
         diff < 2 * 3600000
            ? ReportTimeInterval.MINUTE
            : diff < 2 * 86400000
            ? ReportTimeInterval.HOUR
            : diff < 32 * 86400000
            ? ReportTimeInterval.DAY
            : ReportTimeInterval.MONTH,
   }
   if (currentBrandId !== 'All Brands') {
      postDays.brandId = currentBrandId
   }
   if (props.playerId) {
      postDays.playerId = props.playerId
   }
   useGetReportFinancialQuery({
      ...postDays,
      key: 'Graph',
   })
   const [currentActiveChart, setCurrentActiveChart] = React.useState(
      ChartDataName.BETS
   )

   const timezone = useSelector(getCrashConfig).timezone
   const reportBetData = useSelector(
      selectAuthFinancialReportsGraph
   ) as Report[]
   Chart.register(Filler)
   const [data, setData] = React.useState({
      labels: [] as string[],
      datasets: [] as any,
   })

   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const Card = styled(MuiCard)(spacing)
   const ChartWrapper = styled.div`
      height: ${'350px'};
      width: ${isDesktop ? 'initial' : '700px'};
      min-width: 100%;
   `
   const Circle = styled(Box)`
      height: 12px;
      width: 12px;
      border-radius: 16px;
   `
   const [ignore, setIgnore] = React.useState(false)
   useEffect(() => {
      setTimeout(() => {
         setIgnore(true)
      }, 1000)
   }, [])

   const options = {
      maintainAspectRatio: false,
      aspectRatio: 2, // Adjust this value according to your design
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
   const loadingFinancialReport = useSelector(selectLoadingFinancialReport)
   const updateChart = () => {
      const labels = [] as string[]
      reportBetData &&
         reportBetData?.map((report: Report) => {
            let date = moment(report.from).tz(timezone)
            let hour =
               (date.hours() > 9 ? date.hours() : '0' + date.hours()) +
               ':' +
               (date.minutes() > 9 ? date.minutes() : '0' + date.minutes())
            let dateFormat =
               granularity === Granularity.ONEHOUR
                  ? hour
                  : granularity === Granularity.ONEDAY
                  ? date.date()
                  : granularity === Granularity.ONEMONTH
                  ? `${date.month()}/${date.year()}`
                  : date.date() + `(${hour})`
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
               reportBetData?.map(
                  (report: Report) =>
                     (report?.data && report?.data[currencyReport]?.betCount) ||
                     0
               ) || []
            backgroundColor = 'rgba(94, 234, 146, .85)'
            borderColor = '#07932C'
            label = 'Bets'
            dataActiveCumulative = (reportBetData &&
               reportBetData
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
               reportBetData?.map(
                  (report: Report) =>
                     (report?.data &&
                        (currencyReport === 'totalInUSD'
                           ? report?.data[currencyReport]
                                ?.totalBetAmountInCurrentUSD
                           : report?.data[currencyReport]?.totalBetAmount)) ||
                     0
               ) || []
            backgroundColor = 'rgba(255, 84, 135, .7)'
            borderColor = '#FA0082'
            label = 'Bet Amount'
            dataActiveCumulative = (reportBetData &&
               reportBetData
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
               reportBetData?.map(
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
            dataActiveCumulative = (reportBetData &&
               reportBetData
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
               reportBetData?.map(
                  (report: Report) =>
                     (report?.data &&
                        report?.data[currencyReport]?.uniquePlayers) ||
                     0
               ) || []
            backgroundColor = 'rgba(255, 206, 117, .85)'
            borderColor = '#FDB022'
            label = 'Player'
            dataActiveCumulative = (reportBetData &&
               reportBetData
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
               fill: true,
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
   }, [reportBetData, currentActiveChart, currencyReport])
   return (
      <Card>
         <CardHeader
            title={
               <Grid container alignItems={'center'} spacing={2}>
                  <Grid item>
                     <Typography variant="h1">{'Total Bets Chart'}</Typography>
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
            <Grid item>
               <CurrenciesFilter usedCurrency={props.usedCurrency} />
            </Grid>

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
               {!props?.playerId && (
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
               )}
            </Grid>
         </Grid>
         <CardContent
            sx={{
               overflow: 'auto',
               p: 0,
               pb: '0 !important',
            }}
         >
            <Grid container alignItems={'center'} spacing={0}>
               <Grid item xs={12} lg={12} p={'0px, 24px, 0px, 12px'}></Grid>
               <Grid item xs={12} lg={12}>
                  {datashow === DataType.CHART ? (
                     <ChartWrapper>
                        {!ignore || loadingFinancialReport ? (
                           <Skeleton
                              variant="rectangular"
                              width="100%"
                              height="100%"
                           />
                        ) : (
                           <Line data={data} options={options} />
                        )}
                     </ChartWrapper>
                  ) : (
                     <TableContainer
                        sx={{
                           boxShadow: 'none',
                           height: '350px',
                           px: '12px',
                        }}
                     >
                        <Table size="small">
                           <TableBody
                              sx={{
                                 h6: {
                                    color: ImoonGray[1],
                                 },
                              }}
                           >
                              {reportBetData?.map((report: Report) => (
                                 <TableRow key={report.from}>
                                    <TableCell width={'250px'}>
                                       <Typography variant="h6">
                                          {moment(report.from)
                                             .tz(timezone)
                                             .format('yyyy-MM-DD HH:mm')}
                                       </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                       <Typography variant="h6">
                                          {currentActiveChart ===
                                             ChartDataName.BETS &&
                                             (report?.data
                                                ? numeral(
                                                     report?.data[
                                                        currencyReport
                                                     ]?.betCount
                                                  ).format(
                                                     '0a.[00]',
                                                     (n) =>
                                                        (Math.floor(n) * 100) /
                                                        100
                                                  ) || 0
                                                : 0)}
                                          {currentActiveChart ===
                                             ChartDataName.BET_AMOUNT &&
                                             (report?.data
                                                ? renderBetAmountCell(
                                                     report?.data[
                                                        currencyReport
                                                     ]?.totalBetAmount,
                                                     ''
                                                  ) || 0
                                                : 0)}
                                          {currentActiveChart ===
                                             ChartDataName.PL &&
                                             (report?.data
                                                ? renderPLCell(
                                                     report?.data[
                                                        currencyReport
                                                     ]?.totalPl,
                                                     ''
                                                  ) || 0
                                                : 0)}
                                          {currentActiveChart ===
                                             ChartDataName.PLAYER &&
                                             (report?.data
                                                ? numeral(
                                                     report?.data[
                                                        currencyReport
                                                     ]?.uniquePlayers
                                                  ).format(
                                                     '0a.[00]',
                                                     (n) =>
                                                        (Math.floor(n) * 100) /
                                                        100
                                                  ) || 0
                                                : 0)}
                                       </Typography>
                                    </TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </TableContainer>
                  )}
               </Grid>
            </Grid>
         </CardContent>
         <CardActions
            sx={{
               borderTop: `1px solid ${ImoonGray[11]}`,
               textAlign: 'center',
               alignItems: 'center',
               padding: '4px 15px',
               display: 'block',
            }}
         >
            <Button
               variant="contained"
               color={datashow === DataType.TABLE ? 'secondary' : 'inherit'}
               onClick={() => setDatashow(DataType.TABLE)}
               sx={{
                  color: '#fff',
                  background: (props) =>
                     datashow === DataType.TABLE
                        ? props.palette.secondary.main
                        : props.palette.info.light,
               }}
            >
               Table
            </Button>
            <Button
               variant="contained"
               color={datashow === DataType.CHART ? 'secondary' : 'inherit'}
               onClick={() => setDatashow(DataType.CHART)}
               sx={{
                  color: '#fff',
                  background: (props) =>
                     datashow === DataType.CHART
                        ? props.palette.secondary.main
                        : props.palette.info.light,
               }}
            >
               Chart
            </Button>
         </CardActions>
      </Card>
   )
}

const PortalBetsLineChart = React.memo(MemoizedPortalBetsLineChart)

export default PortalBetsLineChart
