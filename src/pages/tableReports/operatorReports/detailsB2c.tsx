import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar'
import HeaderToolbar from '@/components/custom/HeaderToolbar'
import { PortalOperatorReport } from '@/components/custom/PortalOperatorReport'
import DateToolbar from '@/components/custom/customDateToolbar'
import {
   UseGetReportsTableQueryProps,
   useGetReportFinancialGenericQuery,
   useGetReportFinancialQuery,
   useGetStatsQuery,
} from '@/components/data/reports/lib/hooks/queries'
import CurrenciesFilter from '@/components/pages/dashboard/default/Currencies'
import Stats from '@/components/pages/dashboard/default/Stats'
import DashboardLayout from '@/layouts/Dashboard'
import {
   IntegrationType,
   Operator,
   ReportTimeInterval,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faChartPie,
   faCircleDollarToSlot,
   faCoins,
   faHandHoldingDollar,
   faHandsHoldingDollar,
   faUserPlus,
   faUsersBetweenLines,
   faUsersViewfinder,
} from '@fortawesome/pro-solid-svg-icons'
import { Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import {
   saveCurrentOp,
   saveCurrentOpData,
   selectAuthCurrencyOption,
   selectAuthCurrentBrand,
   selectAuthCurrentOperator,
   selectAuthCurrenturrency,
   selectAuthFinancialReportsDaily,
   selectAuthFinancialReportsDashboard,
   selectAuthFinancialReportsHourly,
   selectAuthFinancialReportsMonthly,
   selectAuthFinancialReportsYearly,
   selectAuthOperators,
   selectAuthStats,
} from 'redux/authSlice'
import {
   selectloadingFinancialReportDay,
   selectloadingFinancialReportHour,
   selectloadingFinancialReportMonth,
   selectloadingFinancialReportYear,
} from 'redux/loadingSlice'
import { getCrashConfig } from 'redux/slices/crashConfig'
import { getUser } from 'redux/slices/user'
import { store } from 'redux/store'
import {
   PageWith2Toolbar,
   PageWith3Toolbar,
   getDefaultEndDate,
   getDefaultStartDate,
   sumFieldInArray,
} from 'services/globalFunctions'
import { hasPermission } from 'services/permissionHandler'

export interface PortalStats {
   primaryTitle: string
   amount?: number | string
   infoText?: string
   disableFormatting?: boolean
   disableColor?: boolean
   reverseColors?: boolean
   currency?: boolean
   percentagetext?: number | string
   percentagecolor?: string
   icon?: IconProp
   iconColor?: string
   iconBackground?: string
}

const timedifference = new Date().getTimezoneOffset()

function OperatorReportsB2C() {
   const crashConfig = useSelector(getCrashConfig)
   const theme = useTheme()
   const data = useSelector(selectAuthStats)
   const user = useSelector(getUser) as User
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const currentBrandId = useSelector(selectAuthCurrentBrand)
   const loadingFinancialReportYear = useSelector(
      selectloadingFinancialReportYear
   )
   const loadingFinancialReportMonth = useSelector(
      selectloadingFinancialReportMonth
   )
   const loadingFinancialReportDay = useSelector(
      selectloadingFinancialReportDay
   )
   const loadingFinancialReportHour = useSelector(
      selectloadingFinancialReportHour
   )
   const operators = useSelector(selectAuthOperators)
   const operator = useSelector(selectAuthCurrentOperator) as Operator
   const currencyOption = useSelector(selectAuthCurrencyOption)
   const currency: string = useSelector(selectAuthCurrenturrency) || ''
   const router = useRouter()
   const query = router.query
   const [refresh, setRefresh]: any = React.useState(0)
   const [stats, setStats]: PortalStats[] | any = React.useState([
      {
         primaryTitle: 'Total Operators',
         amount: 250 as number,
         icon: faUsersViewfinder,
         iconColor: '#FB8111',
         iconBackground: '#FFEAD5',
      },
      {
         primaryTitle: 'Active Players',
         amount: 250 as number,
         icon: faUsersBetweenLines,
         iconColor: '#2E90FA',
         iconBackground: '#EFF8FF',
      },
      {
         primaryTitle: 'Total Bets',
         amount: 250 as number,
         icon: faCoins,
         iconColor: '#444CE7',
         iconBackground: '#EEF4FF',
      },
      {
         primaryTitle: 'Total PL',
         amount: 250 as number,
         icon: faChartPie,
         iconColor: '#DD2590',
         iconBackground: '#FDF2FA',
      },
      {
         primaryTitle: 'Total Commission',
         amount: 250 as number,
         icon: faHandsHoldingDollar,
         iconColor: '#7F56D9',
         iconBackground: '#F9F5FF',
      },
      {
         primaryTitle: 'Total Bet Amount',
         amount: 27004000 as number,
         icon: faHandHoldingDollar,
         iconColor: '#12B76A',
         iconBackground: '#ECFDF3',
      },
   ])
   const [startDate, setStartDate]: any = React.useState(
      moment(getDefaultStartDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   )
   const [endDate, setEndDate]: any = React.useState(
      moment(getDefaultEndDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   )
   const [startDateUpdate, setStartDateUpdate]: any = React.useState(
      moment(getDefaultStartDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   )
   const [endDateUpdate, setEndDateUpdate]: any = React.useState(
      moment(getDefaultEndDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   )
   const [startYearSelected, setStartYearSelected] = React.useState(
      moment('2022-01-01T00:00:00Z').utc().startOf('year').toLocaleString()
   )
   const [yearSelected, setYearSelected] = React.useState(
      moment().utc().startOf('year').toISOString()
   )
   const [monthSelected, setMonthSelected] = React.useState(
      moment().utc().startOf('month').toLocaleString()
   )
   const [daySelected, setDaySelected] = React.useState(
      moment().utc().startOf('day').toLocaleString()
   )
   const gridRef = useRef<HTMLDivElement | null>(null)
   const stackRefs = [
      useRef<HTMLDivElement | null>(null),
      useRef<HTMLDivElement | null>(null),
      useRef<HTMLDivElement | null>(null),
      useRef<HTMLDivElement | null>(null),
      useRef<HTMLDivElement | null>(null),
      useRef<HTMLDivElement | null>(null),
      useRef<HTMLDivElement | null>(null),
   ]
   const dataYearly = useSelector(selectAuthFinancialReportsYearly) as
      | Report[]
      | []
   const dataMonthly = useSelector(selectAuthFinancialReportsMonthly) as
      | Report[]
      | []
   const dataDaily = useSelector(selectAuthFinancialReportsDaily) as
      | Report[]
      | []
   const dataHourly = useSelector(selectAuthFinancialReportsHourly) as
      | Report[]
      | []
   const reportDashboardData = useSelector(
      selectAuthFinancialReportsDashboard
   ) as Report[] | []

   const postYear: UseGetReportsTableQueryProps = {
      opId: query.opId as string,
      from: moment(startYearSelected).utc().unix() * 1000,
      to: moment().utc().add(1, 'year').endOf('year').unix() * 1000,
      timeInterval: ReportTimeInterval.YEAR,
      refresh: refresh,
   }

   const postMonths: UseGetReportsTableQueryProps = {
      opId: query.opId as string,
      from: moment(yearSelected).utc().startOf('year').unix() * 1000,
      to: moment(yearSelected).utc().endOf('year').unix() * 1000,
      timeInterval: ReportTimeInterval.MONTH,
      refresh: refresh,
   }

   const postDays: UseGetReportsTableQueryProps = {
      opId: query.opId as string,
      from: moment(monthSelected).utc().startOf('month').unix() * 1000,
      to: moment(monthSelected).utc().endOf('month').unix() * 1000,
      timeInterval: ReportTimeInterval.DAY,
      refresh: refresh,
   }

   const postHours: UseGetReportsTableQueryProps = {
      opId: query.opId as string,
      from: moment(daySelected).utc().startOf('day').unix() * 1000,
      to: moment(daySelected).utc().endOf('day').unix() * 1000,
      timeInterval: ReportTimeInterval.HOUR,
      refresh: refresh,
   }

   if (currentBrandId !== 'All Brands') {
      postYear.brandId = currentBrandId
      postMonths.brandId = currentBrandId
      postDays.brandId = currentBrandId
      postHours.brandId = currentBrandId
   }
   const post: {
      opId: string
   } = {
      opId: query.opId as string,
   }
   const startDateUnix = new Date(startDate)
   const endDateUnix = new Date(endDate)
   const postReportStats: UseGetReportsTableQueryProps = {
      opId: query.opId as string,
      from: startDateUnix.getTime(),
      to: endDateUnix.getTime(),
      refresh: refresh,
   }
   if (currentBrandId !== 'All Brands') {
      postReportStats.brandId = currentBrandId
   }

   // Fetch financial reports using queries
   useGetStatsQuery(post)

   useGetReportFinancialGenericQuery({
      ...postReportStats,
      key: 'reportDashboard',
   })
   useGetReportFinancialQuery({
      ...postYear,
      key: postYear.timeInterval as string,
   })
   useGetReportFinancialQuery({
      ...postMonths,
      key: postMonths.timeInterval as string,
   })
   useGetReportFinancialQuery({
      ...postDays,
      key: postDays.timeInterval as string,
   })
   useGetReportFinancialQuery({
      ...postHours,
      key: postHours.timeInterval as string,
   })

   // Function to update date and fetch reports
   const handlelogDate = async (
      startDate: Date,
      endDate: Date,
      update: Boolean,
      firstLaunch: Boolean
   ) => {
      // Update selected dates
      setStartDateUpdate(moment(startDate).utc())
      setEndDateUpdate(moment(endDate).utc())
      if (update) {
         // Update start and end dates for fetching reports
         setStartDate(
            moment(startDate).utc().unix() * 1000 +
               crashConfig.timezoneOffset * 60 * 1000 -
               timedifference * 60 * 1000
         )
         setEndDate(
            moment(endDate).utc().unix() * 1000 +
               crashConfig.timezoneOffset * 60 * 1000 -
               timedifference * 60 * 1000
         )
      }
   }

   // Function to handle search button click
   const handleSearchClick = () => {
      // Update start and end dates for fetching reports
      setStartDate(
         moment(startDateUpdate).utc().unix() * 1000 +
            crashConfig.timezoneOffset * 60 * 1000 -
            timedifference * 60 * 1000
      )
      setEndDate(
         moment(endDateUpdate).utc().unix() * 1000 +
            crashConfig.timezoneOffset * 60 * 1000 -
            timedifference * 60 * 1000
      )
      setRefresh(refresh + 1)
   }

   useEffect(() => {
      store.dispatch(saveCurrentOp(query.opId as string))
      if (operators && operators?.count > 0) {
         const operator = operators.operators.find(
            (item: Operator) => item.opId === (query.opId as string)
         )
         store.dispatch(saveCurrentOpData(operator))
      }
   }, [query.opId as string])

   useEffect(() => {
      const statsData: {
         primaryTitle: string
         amount: number
         icon?: IconProp
         iconColor?: string
         iconBackground?: string
         disableFormatting?: boolean
         currency?: boolean
         currencyData?: string
      }[] = [
         {
            primaryTitle: 'Active Players',
            amount: ((reportDashboardData &&
               sumFieldInArray(
                  reportDashboardData,
                  'uniquePlayers',
                  false,
                  currencyOption.value === 0 ? currency : 'totalInUSD'
               )) ||
               0) as number,
            icon: faUsersBetweenLines,
            iconColor: '#2E90FA',
            iconBackground: '#EFF8FF',
         },
         {
            primaryTitle: 'Bets',
            amount: ((reportDashboardData &&
               sumFieldInArray(
                  reportDashboardData,
                  'betCount',
                  false,
                  currencyOption.value === 0 ? currency : 'totalInUSD'
               )) ||
               0) as number,
            icon: faCoins,
            iconColor: '#444CE7',
            iconBackground: '#EEF4FF',
         },
         {
            primaryTitle: 'Bet Amount',
            amount: ((reportDashboardData &&
               sumFieldInArray(
                  reportDashboardData,
                  currencyOption.value === 0
                     ? 'totalBetAmount'
                     : 'totalBetAmountInCurrentUSD',
                  false,
                  currencyOption.value === 0 ? currency : 'totalInUSD'
               )) ||
               0) as number,
            icon: faHandHoldingDollar,
            iconColor: '#12B76A',
            iconBackground: '#ECFDF3',
            currency: true,
            currencyData: currency,
         },
         {
            primaryTitle: 'PL',
            amount: ((reportDashboardData &&
               sumFieldInArray(
                  reportDashboardData,
                  currencyOption.value === 0
                     ? 'totalPl'
                     : 'totalPlInCurrentUSD',
                  false,
                  currencyOption.value === 0 ? currency : 'totalInUSD'
               )) ||
               0) as number,
            icon: faChartPie,
            iconColor: '#DD2590',
            iconBackground: '#FDF2FA',
            currency: true,
            currencyData: currency,
         },
      ]
      if (operator?.integrationType === IntegrationType.ALIEN_STANDALONE) {
         statsData.unshift(
            ...[
               {
                  primaryTitle: 'Signup',
                  amount: ((reportDashboardData &&
                     sumFieldInArray(
                        reportDashboardData,
                        'registration',
                        true,
                        currencyOption.value === 0 ? currency : 'totalInUSD'
                     )) ||
                     0) as number,
                  icon: faUserPlus as IconProp,
                  iconColor: '#F5C909',
                  iconBackground: '#FFFDE7',
                  disableFormatting: true,
               },
               {
                  primaryTitle: 'FTD',
                  amount: ((reportDashboardData &&
                     sumFieldInArray(
                        reportDashboardData,
                        'ftd',
                        false,
                        currencyOption.value === 0 ? currency : 'totalInUSD'
                     )) ||
                     0) as number,
                  icon: faCircleDollarToSlot as IconProp,
                  iconColor: '#048A89',
                  iconBackground: '#E7FFF5',
                  disableFormatting: true,
               },
            ]
         )
      }
      // if ([UserScope.SUPERADMIN, UserScope.ADMIN].includes(user?.scope)) {
      //    statsData.unshift({
      //       primaryTitle: 'Commissions',
      //       amount: 20 as number,
      //       icon: faHandsHoldingDollar,
      //       iconColor: '#7F56D9',
      //       iconBackground: '#F9F5FF',
      //    })
      // }
      if (user?.scope === UserScope.SUPERADMIN) {
         statsData.unshift({
            primaryTitle: 'Total Operators',
            amount: data?.numberOfOperators as number,
            icon: faUsersViewfinder,
            iconColor: '#FB8111',
            iconBackground: '#FFEAD5',
         })
      }

      setStats(statsData)
   }, [data, reportDashboardData, currency, currencyOption])

   useEffect(() => {
      const handleScroll = () => {
         const gridElement = gridRef.current
         if (!gridElement) return

         const gridRect = gridElement.getBoundingClientRect()

         const currentStackRef = stackRefs.filter((stackRef) =>
            isDesktop
               ? stackRef.current?.getBoundingClientRect().top! <=
                 gridRect.top + 40
               : stackRef.current?.getBoundingClientRect().top! <=
                 gridRect.top - 40
         )
         const currentStackRefNone = stackRefs.filter((stackRef) =>
            isDesktop
               ? stackRef.current?.getBoundingClientRect().top! >
                 gridRect.top + 80
               : stackRef.current?.getBoundingClientRect().top! >
                 gridRect.top + 20
         )
         if (currentStackRefNone && currentStackRefNone.length > 0) {
            currentStackRefNone.map((item, index) => {
               const otherHeaderRows =
                  currentStackRefNone[index].current?.querySelectorAll('thead')
               otherHeaderRows &&
                  otherHeaderRows.forEach((headerRow) => {
                     headerRow.style.position = 'initial'
                     headerRow.style.top = 'initial'
                  })
            })
         }
         if (currentStackRef && currentStackRef.length > 0) {
            const headerRows =
               currentStackRef[
                  currentStackRef.length - 1
               ].current?.querySelectorAll('thead')
            if (headerRows) {
               headerRows.forEach((headerRow) => {
                  const headerCells = headerRow.querySelectorAll('th')
                  const bodyCells =
                     currentStackRef[
                        currentStackRef.length - 1
                     ].current?.querySelectorAll('tbody td')

                  if (headerRow && bodyCells) {
                     headerCells.forEach((headerCell, index) => {
                        const hedearCellWidth =
                           headerCell.getBoundingClientRect().width
                        ;(
                           headerCell as HTMLElement
                        ).style.width = `${hedearCellWidth}px`
                     })
                     headerRow.style.position = 'fixed'
                     headerRow.style.overflow = 'auto'
                     headerRow.style.zIndex = '100'
                  }
               })
            }
         }
      }

      const gridElement = gridRef.current
      if (gridElement) {
         gridElement.addEventListener('scroll', handleScroll)
      }

      return () => {
         if (gridElement) {
            gridElement.removeEventListener('scroll', handleScroll)
         }
      }
   }, [gridRef, ...stackRefs])

   return (
      <React.Fragment>
         <Helmet title="iMoon | Reports" />
         {isDesktop ? (
            <HeaderToolbar
               title={`${operator?.title} Report ${
                  currencyOption?.value === 0
                     ? `In ${currency}`
                     : currencyOption.name
               }`}
               sx={{ px: isDesktop ? '12px' : '6px', pt: '6px' }}
               isVisibleDate={true}
               handleSearchClick={handleSearchClick}
               handleLogDate={handlelogDate}
               noBack={true}
               actions={<CurrenciesFilter />}
            />
         ) : (
            <>
               <DateToolbar
                  autoRefresh={false}
                  handleSearchClick={handleSearchClick}
                  handleLogDate={handlelogDate}
               />
               <HeaderTitleToolbar
                  title={`${operator?.title} Report ${
                     currencyOption?.value === 0
                        ? `In ${currency}`
                        : currencyOption.name
                  }`}
                  sx={{
                     pt: '6px',
                     mb: '6px',
                  }}
                  actions={<CurrenciesFilter />}
               />
            </>
         )}

         <Grid
            container
            spacing={1}
            px={isDesktop ? '12px' : '4px'}
            py={'6px'}
            position={'relative'}
            sx={{
               height: isDesktop ? PageWith2Toolbar : PageWith3Toolbar,
               width: isDesktop ? 'calc(100vw - 216px)' : '100%',
               overflow: 'hidden',
               overflowY:
                  loadingFinancialReportYear || loadingFinancialReportMonth
                     ? 'hidden'
                     : 'auto',
            }}
            ref={gridRef}
         >
            {hasPermission(
               UserPermissionEvent.BACKOFFICE_GET_STATS_REQ,
               operator?.integrationType as IntegrationType
            ) && (
               <Grid container spacing={'6px'} px={isDesktop ? '12px' : '6px'}>
                  {stats.map((item: PortalStats, index: number) => (
                     <Grid
                        item
                        xs={
                           stats.length === 7
                              ? index < stats.length - 1
                                 ? 6
                                 : 12
                              : 6
                        }
                        md={
                           stats.length === 4
                              ? 3
                              : stats.length === 6
                              ? 4
                              : stats.length === 7
                              ? index < stats.length - 3
                                 ? 3
                                 : 4
                              : 3
                        }
                        lg={
                           stats.length === 4
                              ? 3
                              : stats.length === 6
                              ? 4
                              : stats.length === 7
                              ? index < stats.length - 3
                                 ? 3
                                 : 4
                              : 3
                        }
                        xl={
                           stats.length === 4
                              ? 3
                              : stats.length === 6
                              ? 2
                              : stats.length === 7
                              ? 1.7
                              : 1.5
                        }
                        key={`stats${index}`}
                     >
                        <Stats title={item.primaryTitle} {...item} />
                     </Grid>
                  ))}
               </Grid>
            )}
            <Grid item xs={12}>
               {/* Yearly reports */}
               <Typography variant="h3" textTransform={'capitalize'}>
                  Yearly Table
               </Typography>
               <Stack gap={0} mb={2} ref={stackRefs[0]}>
                  <PortalOperatorReport
                     rows={dataYearly}
                     format="YYYY"
                     isLoading={loadingFinancialReportYear}
                     link="Yearly Stats"
                     highlighted={moment(yearSelected).tz('GMT').unix() * 1000}
                     setDate={(e: any) => {
                        setYearSelected(
                           moment(e).tz('GMT').startOf('year').toString()
                        )
                        setMonthSelected(
                           moment(e).tz('GMT').startOf('month').toString()
                        )
                        setDaySelected(
                           moment(e).tz('GMT').startOf('day').toString()
                        )
                     }}
                     linkLabel={'Year'}
                     noChart={true}
                  />
               </Stack>

               {/* Monthly reports */}
               <Typography variant="h3" textTransform={'capitalize'}>
                  Monthly Table
               </Typography>
               <Stack gap={0} mb={2} ref={stackRefs[1]}>
                  <PortalOperatorReport
                     rows={dataMonthly}
                     format="MMM"
                     isLoading={loadingFinancialReportMonth}
                     link="Monthly Stats"
                     highlighted={moment(monthSelected).tz('GMT').unix() * 1000}
                     setDate={(e: any) => {
                        setMonthSelected(
                           moment(e).tz('GMT').startOf('month').toString()
                        )
                        setDaySelected(
                           moment(e).tz('GMT').startOf('day').toString()
                        )
                     }}
                     linkLabel={`${moment(yearSelected)
                        .tz('GMT')
                        .format('YYYY')} `}
                     noChart={true}
                  />
               </Stack>

               {/* Daily reports */}
               <Typography variant="h3" textTransform={'capitalize'}>
                  Daily Table
               </Typography>
               <Stack gap={0} mb={2} ref={stackRefs[2]}>
                  <PortalOperatorReport
                     rows={dataDaily}
                     format="DD (ddd)"
                     isLoading={loadingFinancialReportDay}
                     highlighted={moment(daySelected).tz('GMT').unix() * 1000}
                     link="Daily Stats"
                     setDate={(e: any) => {
                        setDaySelected(
                           moment(e).tz('GMT').startOf('day').toString()
                        )
                     }}
                     linkLabel={`${moment(monthSelected)
                        .tz('GMT')
                        .format('MMMM')} `}
                     noChart={true}
                  />
               </Stack>

               {/* Hourly reports */}
               <Typography variant="h3" textTransform={'capitalize'}>
                  Hourly Table
               </Typography>
               <Stack gap={0} mb={2} ref={stackRefs[3]}>
                  <PortalOperatorReport
                     rows={dataHourly}
                     format="HH:mm"
                     isLoading={loadingFinancialReportHour}
                     link="Hourly Stats"
                     setDate={(e: any) => {}}
                     linkLabel={`${moment(daySelected).format('DD (ddd)')} `}
                     noChart={true}
                  />
               </Stack>
            </Grid>
         </Grid>
      </React.Fragment>
   )
}

OperatorReportsB2C.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout>{page}</DashboardLayout>
}

export default OperatorReportsB2C
