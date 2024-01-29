import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar'
import HeaderToolbar from '@/components/custom/HeaderToolbar'
import { PortalOperatorsReportTable } from '@/components/custom/PortalOperatorsReportTable'
import { PortalReportData } from '@/components/custom/PortalReportData'
import DateToolbar from '@/components/custom/customDateToolbar'
import {
   UseGetReportsTableQueryProps,
   useGetReportFinancialBrandsQuery,
   useGetReportFinancialGenericQuery,
   useGetReportFinancialQuery,
   useGetStatsQuery,
} from '@/components/data/reports/lib/hooks/queries'
import Stats from '@/components/pages/dashboard/default/Stats'
import DashboardLayout from '@/layouts/Dashboard'
import {
   Brand,
   IntegrationType,
   Operator,
   RegistrationData,
   Report,
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
import React, { ReactElement, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import {
   saveCurrentBrand,
   saveCurrentOp,
   selectAuthBrandsList,
   selectAuthCurrentBrand,
   selectAuthCurrentOperator,
   selectAuthFinancialReportBrands,
   selectAuthFinancialReportOperators,
   selectAuthFinancialReportsDaily,
   selectAuthFinancialReportsDashboard,
   selectAuthFinancialReportsHourly,
   selectAuthFinancialReportsMonthly,
   selectAuthFinancialReportsYearly,
   selectAuthOperator,
   selectAuthStats,
} from 'redux/authSlice'
import {
   selectloadingFinancialReportBrands,
   selectloadingFinancialReportDay,
   selectloadingFinancialReportHour,
   selectloadingFinancialReportMonth,
   selectloadingFinancialReportOperators,
   selectloadingFinancialReportYear,
} from 'redux/loadingSlice'
import { getCrashConfig } from 'redux/slices/crashConfig'
import { getUser } from 'redux/slices/user'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import {
   PageWith2Toolbar,
   getDefaultEndDate,
   getDefaultStartDate,
   sumFieldInArray,
} from 'services/globalFunctions'
import { hasPermission } from 'services/permissionHandler'
import { v4 as uuidv4 } from 'uuid'

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

export interface reportOperator {
   opId: string
   betCount: number
   totalBetAmount: number
   totalWinAmount: number
   totalPl: number
   totalTopupAmount: number
   totalDepositAmount: number
   totalWithdrawAmount: number
   totalTopupCount: number
   totalDepositCount: number
   totalWithdrawCount: number
   ftd: number
   registration: RegistrationData
   uniquePlayers: number
   totalBetAmountInCurrentUSD: number
   totalWinAmountInCurrentUSD: number
   totalPlInCurrentUSD: number
   totalTopupAmountInCurrentUSD: number
   totalDepositAmountInCurrentUSD: number
   totalWithdrawAmountInCurrentUSD: number
}
const timedifference = new Date().getTimezoneOffset()

function Reports() {
   // Redux selectors
   const crashConfig = useSelector(getCrashConfig)
   const theme = useTheme()
   const user = useSelector(getUser) as User
   const dataStats = useSelector(selectAuthStats)
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const currentBrandId = useSelector(selectAuthCurrentBrand)
   const boClient = useSelector(selectBoClient)
   const opId = useSelector(selectAuthOperator)
   const loadingFinancialReportOperators = useSelector(
      selectloadingFinancialReportOperators
   )
   const loadingFinancialReportBrands = useSelector(
      selectloadingFinancialReportBrands
   )
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
   const operator = useSelector(selectAuthCurrentOperator) as Operator
   // Initial state for statistics and date selection
   const [refresh, setRefresh]: any = React.useState(0)
   const data = useSelector(selectAuthBrandsList) as Brand[]
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
      moment().utc().startOf('month').toISOString()
   )
   const [daySelected, setDaySelected] = React.useState(
      moment().utc().startOf('day').toISOString()
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
   // Select financial reports data from Redux
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
   const operatorsReport = useSelector(selectAuthFinancialReportOperators) as
      | Report[]
      | []
      | any
   const brandsReport = useSelector(selectAuthFinancialReportBrands) as
      | Report[]
      | []

   // Create report DTO objects for different time intervals
   const postYear: UseGetReportsTableQueryProps = {
      opId: opId as string,
      from: moment(startYearSelected).utc().unix() * 1000,
      to: moment().utc().add(1, 'year').endOf('year').unix() * 1000,
      timeInterval: ReportTimeInterval.YEAR,
      refresh: refresh,
   }

   const postMonths: UseGetReportsTableQueryProps = {
      opId: opId as string,
      from: moment(yearSelected).utc().startOf('year').unix() * 1000,
      to: moment(yearSelected).utc().endOf('year').unix() * 1000,
      timeInterval: ReportTimeInterval.MONTH,
      refresh: refresh,
   }

   const postDays: UseGetReportsTableQueryProps = {
      opId: opId as string,
      from: moment(monthSelected).utc().startOf('month').unix() * 1000,
      to: moment(monthSelected).utc().endOf('month').unix() * 1000,
      timeInterval: ReportTimeInterval.DAY,
      refresh: refresh,
   }

   const postHours: UseGetReportsTableQueryProps = {
      opId: opId as string,
      from: moment(daySelected).utc().startOf('day').unix() * 1000,
      to: moment(daySelected).utc().endOf('day').unix() * 1000,
      timeInterval: ReportTimeInterval.HOUR,
      refresh: refresh,
   }

   const startDateUnix = new Date(startDate)
   const endDateUnix = new Date(endDate)
   const postReportStats: UseGetReportsTableQueryProps = {
      from: startDateUnix.getTime(),
      to: endDateUnix.getTime(),
      refresh: refresh,
   }
   const postOperators: UseGetReportsTableQueryProps = {
      from: startDateUnix.getTime(),
      to: endDateUnix.getTime(),
      refresh: refresh,
   }

   const postBrands: UseGetReportsTableQueryProps = {
      from: startDateUnix.getTime(),
      opId: opId,
      to: endDateUnix.getTime(),
      refresh: refresh,
   }
   // Set brand ID in report DTOs if it's not 'All Brands'
   if (currentBrandId !== 'All Brands') {
      postYear.brandId = currentBrandId
      postMonths.brandId = currentBrandId
      postDays.brandId = currentBrandId
      postHours.brandId = currentBrandId
   }

   // Fetch financial reports using queries
   useGetReportFinancialGenericQuery({
      ...postOperators,
      key: 'operatorsReport',
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
   useGetReportFinancialGenericQuery({
      ...postReportStats,
      key: 'reportDashboard',
   })

   useGetReportFinancialBrandsQuery({
      ...postBrands,
      key: 'brandsReport',
   })

   const postStats: {
      opId: string
      brandId?: string
   } = {
      opId: opId,
   }

   useGetStatsQuery(postStats)
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
                  'totalInUSD'
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
                  'totalInUSD'
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
                  'totalBetAmountInCurrentUSD',
                  false,
                  'totalInUSD'
               )) ||
               0) as number,
            icon: faHandHoldingDollar,
            iconColor: '#12B76A',
            iconBackground: '#ECFDF3',
            currency: true,
            currencyData: 'USD',
         },
         {
            primaryTitle: 'PL',
            amount: ((reportDashboardData &&
               sumFieldInArray(
                  reportDashboardData,
                  'totalPlInCurrentUSD',
                  false,
                  'totalInUSD'
               )) ||
               0) as number,
            icon: faChartPie,
            iconColor: '#DD2590',
            iconBackground: '#FDF2FA',
            currency: true,
            currencyData: 'USD',
         },
      ]
      statsData.unshift(
         ...[
            {
               primaryTitle: 'Signup',
               amount: ((reportDashboardData &&
                  sumFieldInArray(
                     reportDashboardData,
                     'registration',
                     true,
                     'totalInUSD'
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
                     'totalInUSD'
                  )) ||
                  0) as number,
               icon: faCircleDollarToSlot as IconProp,
               iconColor: '#048A89',
               iconBackground: '#E7FFF5',
               disableFormatting: true,
            },
         ]
      )
      if ([UserScope.SUPERADMIN, UserScope.ADMIN].includes(user?.scope)) {
         statsData.unshift({
            primaryTitle: 'Commissions',
            amount: 5 as number,
            icon: faHandsHoldingDollar,
            iconColor: '#7F56D9',
            iconBackground: '#F9F5FF',
         })
      }
      if (user?.scope === UserScope.SUPERADMIN) {
         statsData.unshift({
            primaryTitle: 'Total Operators',
            amount: dataStats?.numberOfOperators as number,
            icon: faUsersViewfinder,
            iconColor: '#FB8111',
            iconBackground: '#FFEAD5',
         })
      }

      setStats(statsData)
   }, [dataStats, reportDashboardData])

   useEffect(() => {
      if (operatorsReport?.findIndex((item: any) => item.opId === opId) < 0) {
         store.dispatch(saveCurrentOp(operatorsReport[1]?.opId as string))
      }
      if (
         brandsReport?.findIndex(
            (item: Report) => item.brandId === currentBrandId
         ) < 0
      ) {
         store.dispatch(saveCurrentBrand('All Brands'))
      }
      if (opId) {
         boClient?.operator.getOperatorBrands(
            { opId: opId },
            {
               uuid: uuidv4(),
               meta: {
                  type: 'list',
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ,
               },
            }
         )
      }
   }, [operatorsReport, opId])

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
         {/* Set the page title */}
         <Helmet title="iMoon | Reports" />

         {/* Render the appropriate toolbar based on screen size */}
         {isDesktop ? (
            <HeaderToolbar
               title={`Reports In USD`}
               isVisibleDate={true}
               handleSearchClick={handleSearchClick}
               handleLogDate={handlelogDate}
               sx={{ px: '8px !important' }}
               // actions={<CurrenciesFilter />}
            />
         ) : (
            <>
               <DateToolbar
                  autoRefresh={false}
                  handleSearchClick={handleSearchClick}
                  handleLogDate={handlelogDate}
               />
               <HeaderTitleToolbar
                  title={`Reports In USD`}
                  sx={{
                     pt: '6px',
                     mb: '6px',
                  }}
               />
            </>
         )}

         <Grid
            container
            spacing={1}
            px={isDesktop ? '12px' : '4px'}
            py={'6px'}
            height={PageWith2Toolbar}
            position={'relative'}
            sx={{
               overflow: 'hidden',
               width: isDesktop ? 'calc(100vw - 216px)' : '100%',
               overflowY:
                  loadingFinancialReportOperators ||
                  loadingFinancialReportBrands ||
                  loadingFinancialReportYear
                     ? 'hidden'
                     : 'auto',
            }}
            ref={gridRef}
         >
            {/* <Grid
                  item
                  xs={12}
                  sx={{
                     position: 'absolute',
                     zIndex: 1,
                     textAlign: 'center',
                     width: '100%',
                  }}
               >
                  <BadgeRole label={`${operator.opId} - ${operator.title}`} />
               </Grid> */}
            {/* Grid container for displaying statistics */}
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

            <Grid item xs={12} py={'6px'}>
               <Typography variant="h3" textTransform={'capitalize'}>
                  Operators
               </Typography>
               <Stack gap={10} mb={2} ref={stackRefs[0]}>
                  <PortalOperatorsReportTable
                     rows={operatorsReport}
                     isLoading={loadingFinancialReportOperators}
                     linkLabel={'Operators'}
                     highlighted={opId}
                     noChart={true}
                  />
               </Stack>
               <Typography variant="h3" textTransform={'capitalize'}>
                  {`${
                     operatorsReport.find((item: any) => item.opId === opId)
                        ?.opFullId
                  } > Brands`}
               </Typography>
               <Stack gap={10} mb={2} ref={stackRefs[1]}>
                  <PortalOperatorsReportTable
                     rows={brandsReport}
                     isLoading={loadingFinancialReportBrands}
                     linkLabel={'Brands'}
                     highlighted={
                        (currentBrandId === 'All Brands'
                           ? 'All'
                           : currentBrandId) || 'All'
                     }
                     noChart={true}
                     brands={data}
                  />
               </Stack>
               {/* Yearly reports */}
               <Typography variant="h3" textTransform={'capitalize'}>
                  {`${
                     operatorsReport.find((item: any) => item.opId === opId)
                        ?.opFullId
                  } > ${
                     currentBrandId === 'All Brands'
                        ? 'All Brands'
                        : `${currentBrandId}-${
                             data.find(
                                (item) => item.brandId === currentBrandId
                             )?.brandName
                          }`
                  } > Yearly Table`}
               </Typography>
               <Stack gap={10} mb={2} ref={stackRefs[2]}>
                  <PortalReportData
                     rows={dataYearly}
                     format="YYYY"
                     isLoading={loadingFinancialReportYear}
                     link="Yearly Stats"
                     inUSD={true}
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
                  />
               </Stack>

               {/* Monthly reports */}
               <Typography variant="h3" textTransform={'capitalize'}>
                  {`${
                     operatorsReport.find((item: any) => item.opId === opId)
                        ?.opFullId
                  } > ${
                     currentBrandId === 'All Brands'
                        ? 'All Brands'
                        : `${currentBrandId}-${
                             data.find(
                                (item) => item.brandId === currentBrandId
                             )?.brandName
                          }`
                  } > Monthly Table`}
               </Typography>
               <Stack gap={10} mb={2} ref={stackRefs[3]}>
                  <PortalReportData
                     rows={dataMonthly}
                     format="MMM"
                     inUSD={true}
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
                     linkLabel={`${moment(yearSelected).format('YYYY')} `}
                  />
               </Stack>

               {/* Daily reports */}
               <Typography variant="h3" textTransform={'capitalize'}>
                  {`${
                     operatorsReport.find((item: any) => item.opId === opId)
                        ?.opFullId
                  } > ${
                     currentBrandId === 'All Brands'
                        ? 'All Brands'
                        : `${currentBrandId}-${
                             data.find(
                                (item) => item.brandId === currentBrandId
                             )?.brandName
                          }`
                  } > Daily Table`}
               </Typography>
               <Stack gap={10} mb={2} ref={stackRefs[4]}>
                  <PortalReportData
                     inUSD={true}
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
                     linkLabel={`${moment(monthSelected).format('MMMM')} `}
                  />
               </Stack>

               {/* Hourly reports */}
               <Typography variant="h3" textTransform={'capitalize'}>
                  {`${
                     operatorsReport.find((item: any) => item.opId === opId)
                        ?.opFullId
                  } > ${
                     currentBrandId === 'All Brands'
                        ? 'All Brands'
                        : `${currentBrandId}-${
                             data.find(
                                (item) => item.brandId === currentBrandId
                             )?.brandName
                          }`
                  } > Hourly Table`}
               </Typography>
               <Stack gap={10} mb={2} ref={stackRefs[5]}>
                  <PortalReportData
                     inUSD={true}
                     rows={dataHourly}
                     format="HH:mm"
                     isLoading={loadingFinancialReportHour}
                     link="Hourly Stats"
                     setDate={(e: any) => {}}
                     linkLabel={`${moment(daySelected)
                        .tz('GMT')
                        .format('DD (ddd)')} `}
                  />
               </Stack>
            </Grid>
         </Grid>
      </React.Fragment>
   )
}

Reports.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout>{page}</DashboardLayout>
}

export default Reports
