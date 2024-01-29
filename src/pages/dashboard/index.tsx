import CustomLoader from '@/components/custom/CustomLoader'
import HeaderToolbar from '@/components/custom/HeaderToolbar'
import PortalBetsLineChart from '@/components/custom/PortalBetsLineChart'
import DateToolbar from '@/components/custom/customDateToolbar'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import Ranking from '@/components/custom/ranking/ranking'
import RankingMobile from '@/components/custom/ranking/ranking-mobile'
import {
   UseGetReportsTableQueryProps,
   useGetReportFinancialGenericQuery,
   useGetStatsQuery,
} from '@/components/data/reports/lib/hooks/queries'
import PlayersMap from '@/components/pages/dashboard/analytics/PlayersMap'
import CurrenciesChart from '@/components/pages/dashboard/analytics/currencies-chart'
import Stats from '@/components/pages/dashboard/default/Stats'
import {
   IntegrationType,
   Operator,
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
import { Grid, useMediaQuery, useTheme } from '@mui/material'
import moment from 'moment'
import router from 'next/router'
import type { ReactElement } from 'react'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import {
   selectAuthCurrentBrand,
   selectAuthCurrentOperator,
   selectAuthFinancialReportsDashboard,
   selectAuthOperator,
   selectAuthStats,
} from 'redux/authSlice'
import { selectLoadingFinancialReport } from 'redux/loadingSlice'
import { getCrashConfig } from 'redux/slices/crashConfig'
import { getUser } from 'redux/slices/user'
import {
   PageWith2Toolbar,
   PageWith3Toolbar,
   getDefaultEndDate,
   getDefaultStartDate,
   sumFieldInArray,
} from 'services/globalFunctions'
import { hasDetailsPermission, hasPermission } from 'services/permissionHandler'
import { GetFinancialReportDtoWithSearch } from 'types'
import DashboardLayout from '../../layouts/Dashboard'
import PlayersMapNew from '@/components/pages/dashboard/analytics/PlayersMapNew'

export interface PortalStats {
   primaryTitle: string
   amoun?: number | string
   infoText?: string
   disableFormatting?: boolean
   disableColor?: boolean
   reverseColors?: boolean
   currency?: boolean
   percentagetext?: number | string
   percentagecolor?: string
   chart?: boolean
}
const timedifference = new Date().getTimezoneOffset()
function Dashboard() {
   // Redux selectors for retrieving authentication, user, operator, crash configuration, and statistics data
   const opId = useSelector(selectAuthOperator)
   const user = useSelector(getUser) as User
   const query: {
      from?: number
      to?: number
   } = router.query
   const [searchDate, setSearchDate] = React.useState(0)
   const operator = useSelector(selectAuthCurrentOperator) as Operator
   const crashConfig = useSelector(getCrashConfig)
   const data = useSelector(selectAuthStats)
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [refreshData, setRefreshData] = React.useState(0)
   const [ignore, setIgnore] = React.useState(false)
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
   // Array of statistics to be displayed on the dashboard
   const [stats, setStats]: PortalStats[] | any = React.useState([
      {
         primaryTitle: 'Total Players',
         amount: data?.numberOfPlayers as number,
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
         primaryTitle: 'PL',
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
         currency: true,
      },
   ])

   // Retrieving current brand ID and managing date range for financial reports
   const currentBrandId: string = useSelector(selectAuthCurrentBrand) || ''

   // Calculating date difference, preparing data for financial report query
   const startDateUnix = new Date(startDate)
   const endDateUnix = new Date(endDate)
   const diff = endDateUnix.getTime() - startDateUnix.getTime()
   const postDays: GetFinancialReportDtoWithSearch = {
      opId: opId,
      searchDate: searchDate,
      from: startDateUnix.getTime(),
      to: endDateUnix.getTime(),
      timeInterval:
         diff < 2 * 86400000 ? ReportTimeInterval.HOUR : ReportTimeInterval.DAY,
   }
   if (currentBrandId !== 'All Brands') {
      postDays.brandId = currentBrandId
   }

   // Handling loading state for financial reports
   useSelector(selectLoadingFinancialReport)

   // Preparing data for operator-specific queries and fetching statistics
   const post: {
      opId: string
      brandId?: string
   } = {
      opId: opId,
   }
   const brandId = useSelector(selectAuthCurrentBrand)
   if (brandId !== 'All Brands') {
      post.brandId = brandId
   }
   useGetStatsQuery(post)

   // Function to handle date selection and navigation
   const handlelogDate = async (
      startDate: Date,
      endDate: Date,
      update: Boolean,
      firstLaunch: Boolean
   ) => {
      setStartDateUpdate(moment(startDate).utc())
      setEndDateUpdate(moment(endDate).utc())
      if (update) {
         router.push(
            `/dashboard?from=${
               moment(startDate).utc().unix() +
               crashConfig.timezoneOffset * 60 -
               timedifference * 60
            }&to=${
               moment(endDate).utc().unix() +
               crashConfig.timezoneOffset * 60 -
               timedifference * 60
            }`
         )
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

   // Function to handle search button click, updating date range and triggering data refresh
   const handleSearchClick = () => {
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
      setSearchDate(searchDate + 1)
      router.push(
         `/dashboard?from=${
            moment(startDateUpdate).utc().unix() +
            crashConfig.timezoneOffset * 60 -
            timedifference * 60
         }&to=${
            moment(endDateUpdate).utc().unix() +
            crashConfig.timezoneOffset * 60 -
            timedifference * 60
         }`
      )
   }

   // Retrieving financial report data for the dashboard
   const reportDashboardData = useSelector(
      selectAuthFinancialReportsDashboard
   ) as Report[]

   // Preparing data for financial report statistics query
   const postReportStats: UseGetReportsTableQueryProps = {
      opId: opId,
      from: startDateUnix.getTime(),
      to: endDateUnix.getTime(),
      refresh: searchDate,
   }

   if (currentBrandId !== 'All Brands') {
      postReportStats.brandId = currentBrandId
   }

   // Fetching financial report statistics data
   useGetReportFinancialGenericQuery({
      ...postReportStats,
      key: 'reportDashboard',
   })

   // Effect to update statistics data based on financial report and user information
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
               sumFieldInArray(reportDashboardData, 'uniquePlayers')) ||
               0) as number,
            icon: faUsersBetweenLines,
            iconColor: '#2E90FA',
            iconBackground: '#EFF8FF',
         },
         {
            primaryTitle: 'Bets',
            amount: ((reportDashboardData &&
               sumFieldInArray(reportDashboardData, 'betCount')) ||
               0) as number,
            icon: faCoins,
            iconColor: '#444CE7',
            iconBackground: '#EEF4FF',
         },
         {
            primaryTitle: 'PL',
            amount: ((reportDashboardData &&
               sumFieldInArray(reportDashboardData, 'totalPlInCurrentUSD')) ||
               0) as number,
            icon: faChartPie,
            iconColor: '#DD2590',
            iconBackground: '#FDF2FA',
            currency: true,
            currencyData: 'USD',
         },
         {
            primaryTitle: 'Bet Amount',
            amount: ((reportDashboardData &&
               sumFieldInArray(
                  reportDashboardData,
                  'totalBetAmountInCurrentUSD'
               )) ||
               0) as number,
            icon: faHandHoldingDollar,
            iconColor: '#12B76A',
            iconBackground: '#ECFDF3',
            currency: true,
            currencyData: 'USD',
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
                        true
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
                     sumFieldInArray(reportDashboardData, 'ftd')) ||
                     0) as number,
                  icon: faCircleDollarToSlot as IconProp,
                  iconColor: '#048A89',
                  iconBackground: '#E7FFF5',
                  disableFormatting: true,
               },
            ]
         )
      }
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
            amount: data?.numberOfOperators as number,
            icon: faUsersViewfinder,
            iconColor: '#FB8111',
            iconBackground: '#FFEAD5',
         })
      }

      setStats(statsData)
   }, [data, reportDashboardData])

   // Effect to handle initial URL query parameters and avoid unnecessary redirects
   useEffect(() => {
      if (!query?.from) {
         router.push(
            `/dashboard?from=${
               moment(getDefaultStartDate()).utc().unix() +
               crashConfig.timezoneOffset * 60 -
               timedifference * 60
            }&to=${
               moment(getDefaultEndDate()).utc().unix() +
               crashConfig.timezoneOffset * 60 -
               timedifference * 60
            }`
         )
         setRefreshData(refreshData + 1)
      }
      if (!ignore) {
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   }, [query])

   // Dashboard component rendering various statistics and charts
   return (
      <React.Fragment>
         <Helmet title="Dashboard" />

         {/* Rendering different toolbar components based on the device screen size */}
         {isDesktop ? (
            <HeaderToolbar
               isVisibleDate={true}
               handleSearchClick={handleSearchClick}
               sx={{ px: '8px !important' }}
               handleLogDate={handlelogDate}
               from={query?.from}
               to={query?.to}
               key={`${refreshData}dateTool`}
            />
         ) : (
            <>
               <CustomOperatorsBrandsToolbar
                  brandFilter={true}
                  operatorFilter={true}
               />
               <DateToolbar
                  autoRefresh={false}
                  key={refreshData + 'date'}
                  handleSearchClick={handleSearchClick}
                  handleLogDate={handlelogDate}
                  from={query?.from}
                  to={query?.to}
               />
            </>
         )}

         {/* Displaying the content based on the ignore state */}
         {ignore ? (
            <Grid
               container
               spacing={'6px'}
               px={isLgUp ? '12px' : '6px'}
               py={'6px'}
               pt={'0'}
               mt={0}
               height={isDesktop ? PageWith2Toolbar : PageWith3Toolbar}
               position={'relative'}
               justifyContent={'center'}
               sx={{
                  overflow: 'hidden',
                  overflowY: 'auto',
               }}
               key={searchDate}
            >
               {/* Mapping over the stats array and rendering the Stats component */}
               {hasPermission(
                  UserPermissionEvent.BACKOFFICE_GET_STATS_REQ,
                  operator?.integrationType as IntegrationType
               ) &&
                  stats.map((item: PortalStats, index: number) => (
                     <Grid
                        item
                        xs={
                           index < stats.length - 1
                              ? 6
                              : stats.length === 5
                              ? 12
                              : 6
                        }
                        md={
                           stats.length === 4
                              ? 3
                              : stats.length === 6
                              ? 4
                              : operator?.integrationType ===
                                IntegrationType.ALIEN_STANDALONE
                              ? index < stats.length - 3
                                 ? stats.length === 5
                                    ? 4
                                    : 3
                                 : stats.length === 5
                                 ? 4
                                 : 3
                              : index < stats.length - 2
                              ? stats.length === 5
                                 ? 4
                                 : 2
                              : stats.length === 5
                              ? 6
                              : 6
                        }
                        lg={
                           stats.length === 4
                              ? 3
                              : stats.length === 6
                              ? 4
                              : stats.length === 5
                              ? 2.4
                              : operator?.integrationType ===
                                IntegrationType.ALIEN_STANDALONE
                              ? index < stats.length - 3
                                 ? 3
                                 : 3
                              : 2
                        }
                        xl={
                           stats.length === 4
                              ? 3
                              : stats.length === 5
                              ? 2.4
                              : operator?.integrationType ===
                                IntegrationType.ALIEN_STANDALONE
                              ? stats.length === 6
                                 ? 2
                                 : 1.5
                              : 2
                        }
                        key={`stats${index}`}
                     >
                        <Stats title={item.primaryTitle} {...item} />
                     </Grid>
                  ))}

               {/* Rendering PortalBetsLineChart based on permissions and loading state */}
               {hasPermission(
                  UserPermissionEvent.BACKOFFICE_GET_FINANCIAL_REPORT_REQ,
                  operator?.integrationType as IntegrationType
               ) && (
                  <Grid
                     item
                     xs={12}
                     lg={
                        hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_LAUNCH_REPORT_REQ
                        ) ||
                        !hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_BETS_CURRENCIES_REPORT_REQ
                        )
                           ? 12
                           : 8
                     }
                  >
                     <PortalBetsLineChart
                        startDate={startDate}
                        endDate={endDate}
                        // isLoading={loadingFinancialReport}
                        key={searchDate}
                     />
                  </Grid>
               )}

               {/* Rendering PlayersMap based on permissions */}
               {hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_GET_LAUNCH_REPORT_REQ
               ) && (
                  <Grid
                     item
                     xs={12}
                     lg={
                        hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_BETS_CURRENCIES_REPORT_REQ
                        )
                           ? 8
                           : 12
                     }
                  >
                     {/* <PlayersMap
                        key={searchDate}
                        startDate={startDate}
                        endDate={endDate}
                        opId={opId}
                        brandId={brandId}
                     /> */}
                     <PlayersMapNew
                        key={searchDate}
                        startDate={startDate}
                        endDate={endDate}
                        opId={opId}
                        brandId={brandId}
                     />
                     
                  </Grid>
               )}

               {/* Rendering CurrenciesChart based on permissions */}
               {hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_GET_BETS_CURRENCIES_REPORT_REQ
               ) && (
                  <Grid item xs={12} lg={4}>
                     <CurrenciesChart
                        key={searchDate}
                        startDate={startDate}
                        endDate={endDate}
                        opId={opId}
                        brandId={brandId}
                     />
                  </Grid>
               )}

               {/* Rendering Ranking or RankingMobile component based on permissions and screen size */}
               {hasPermission(
                  UserPermissionEvent.BACKOFFICE_BET_LIST_REQ,
                  operator?.integrationType as IntegrationType
               ) && (
                  <Grid item xs={12} md={12}>
                     {isDesktop ? (
                        <Ranking
                           startDate={startDate}
                           endDate={endDate}
                           searchDate={searchDate}
                        />
                     ) : (
                        <RankingMobile
                           startDate={startDate}
                           endDate={endDate}
                           searchDate={searchDate}
                        />
                     )}
                  </Grid>
               )}
            </Grid>
         ) : (
            // Displaying CustomLoader component when ignore state is false
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout>{page}</DashboardLayout>
}

export default Dashboard
