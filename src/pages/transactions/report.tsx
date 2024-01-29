import CustomLoader from '@/components/custom/CustomLoader'
import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar'
import HeaderToolbar from '@/components/custom/HeaderToolbar'
import { PortalGatewayReport } from '@/components/custom/PortalGatewayReport'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import {
   useGetReportFinancialQuery,
   useGetStatsQuery,
} from '@/components/data/reports/lib/hooks/queries'
import CurrenciesFilter from '@/components/pages/dashboard/default/Currencies'
import DashboardLayout from '@/layouts/Dashboard'
import {
   GetFinancialReportDto,
   Operator,
   PaymentGatewayName,
   ReportTimeInterval,
} from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown, faAngleUp } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Button,
   Grid,
   Menu,
   MenuItem,
   Stack,
   useMediaQuery,
   useTheme
} from '@mui/material'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import {
   saveCurrentOp,
   saveCurrentOpData,
   saveGatewayReport,
   selectAuthCurrencyOption,
   selectAuthCurrentBrand,
   selectAuthCurrenturrency,
   selectAuthFinancialReportsDaily,
   selectAuthFinancialReportsHourly,
   selectAuthFinancialReportsMonthly,
   selectAuthFinancialReportsYearly,
   selectAuthGatewayReport,
   selectAuthOperator,
   selectAuthOperators,
} from 'redux/authSlice'
import {
   selectLoadingFinancialReport,
   selectloadingFinancialReportDay,
   selectloadingFinancialReportHour,
   selectloadingFinancialReportMonth,
   selectloadingFinancialReportYear,
} from 'redux/loadingSlice'
import { store } from 'redux/store'
import { PageWith3Toolbar } from 'services/globalFunctions'

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

function GatewayReports() {
   const theme = useTheme()
   const router = useRouter()
   const query = router.query
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const currentBrandId = useSelector(selectAuthCurrentBrand)
   const loadingFinancialReport = useSelector(selectLoadingFinancialReport)
   const operators = useSelector(selectAuthOperators)
   const currencyOption = useSelector(selectAuthCurrencyOption)
   const currency: string = useSelector(selectAuthCurrenturrency) || ''
   const gatewayReport = useSelector(selectAuthGatewayReport)
   const gateway = query?.gateway || gatewayReport || PaymentGatewayName.PW
   const [anchorElT, setAnchorElT] = React.useState<null | HTMLElement>(null)
   const operatorCurrent = useSelector(selectAuthOperator)
   const matches = useMediaQuery(theme.breakpoints.up('md'))
   const [startYearSelected, setStartYearSelected] = React.useState(
      moment('2022-01-01T00:00:00Z').utc().startOf('year').toLocaleString()
   )
   const [yearSelected, setYearSelected] = React.useState(
      moment('2023-01-01T00:00:00Z').utc().startOf('year').toLocaleString()
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

   // Create report DTO objects for different time intervals
   const postYear: GetFinancialReportDto = {
      opId: query.opId as string,
      from: moment(startYearSelected).utc().unix() * 1000,
      to: moment().utc().add(1, 'year').endOf('year').unix() * 1000,
      timeInterval: ReportTimeInterval.YEAR,
      gateway: gateway as string,
   }

   const postMonths: GetFinancialReportDto = {
      opId: query.opId as string,
      from: moment(yearSelected).utc().startOf('year').unix() * 1000,
      to: moment(yearSelected).utc().endOf('year').unix() * 1000,
      timeInterval: ReportTimeInterval.MONTH,
      gateway: gateway as string,
   }

   const postDays: GetFinancialReportDto = {
      opId: query.opId as string,
      from: moment(monthSelected).utc().startOf('month').unix() * 1000,
      to: moment(monthSelected).utc().endOf('month').unix() * 1000,
      timeInterval: ReportTimeInterval.DAY,
      gateway: gateway as string,
   }

   const postHours: GetFinancialReportDto = {
      opId: query.opId as string,
      from: moment(daySelected).utc().startOf('day').unix() * 1000,
      to: moment(daySelected).utc().endOf('day').unix() * 1000,
      timeInterval: ReportTimeInterval.HOUR,
      gateway: gateway as string,
   }

   // Set brand ID in report DTOs if it's not 'All Brands'
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
   // Fetch financial reports using queries
   useGetStatsQuery(post)

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

   const handleClickT = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorElT(event.currentTarget)
   }

   const handleUpdateGateway = (gateway: PaymentGatewayName) => {
      store.dispatch(saveGatewayReport(gateway))
      router.push(
         `/transactions/report?gateway=${gateway}&opId=${operatorCurrent}${
            currentBrandId !== 'All Brands' ? '&brandId=' + currentBrandId : ''
         }`
      )
      setAnchorElT(null)
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
               title={`Gateway Report
               ${
                  currencyOption?.value === 0
                     ? `In ${currency}`
                     : currencyOption.name
               }`}
               sx={{ px: isLgUp ? '12px' : '6px' }}
               isVisibleDate={false}
               handleSearchClick={() => ({})}
               handleLogDate={() => ({})}
               noBack={true}
               actions={
                  <>
                     <Grid item>
                        {currencyOption?.value === 0 && <CurrenciesFilter />}
                     </Grid>
                     <Grid item>
                        {
                           <Stack
                              direction={['column', 'row']}
                              alignItems={'center'}
                              gap={2}
                              sx={{
                                 '.MuiFormControl-root': {
                                    width: [130, 175],
                                    '& .MuiInputBase-input': { pr: 0 },
                                 },
                              }}
                           >
                              <Button
                                 variant="contained"
                                 color="secondary"
                                 aria-owns={
                                    anchorElT ? 'simple-menu' : undefined
                                 }
                                 aria-haspopup="true"
                                 onClick={handleClickT}
                                 fullWidth={matches ? false : true}
                                 size={'small'}
                                 sx={{
                                    minWidth: '10ch',
                                 }}
                                 endIcon={
                                    <FontAwesomeIcon
                                       icon={
                                          anchorElT
                                             ? (faAngleUp as IconProp)
                                             : (faAngleDown as IconProp)
                                       }
                                       color={
                                          theme.palette.primary.contrastText
                                       }
                                       size="xs"
                                    />
                                 }
                              >
                                 {gateway}
                              </Button>
                              <Menu
                                 id="simple-menu"
                                 anchorEl={anchorElT}
                                 open={Boolean(anchorElT)}
                                 onClose={() => setAnchorElT(null)}
                              >
                                 {Object.values(PaymentGatewayName).map(
                                    (item: PaymentGatewayName) => (
                                       <MenuItem
                                          key={item}
                                          sx={{
                                             minWidth: '10ch',
                                          }}
                                          onClick={() =>
                                             handleUpdateGateway(item)
                                          }
                                       >
                                          {item}
                                       </MenuItem>
                                    )
                                 )}
                              </Menu>
                           </Stack>
                        }
                     </Grid>
                  </>
               }
            />
         ) : (
            <>
               <CustomOperatorsBrandsToolbar
                  title=" "
                  brandFilter={true}
                  operatorFilter={true}
                  background={theme.palette.secondary.dark}
                  actions={
                     <Grid item>
                        {/* <Button
                           onClick={() => setAutoRefresh(autoRefresh + 1)}
                           color="primary"
                           variant={'text'}
                           sx={{
                              p: 0,
                              height: '28px',
                              justifyContent: 'end',
                              minWidth: 'auto !important',
                              ml: '5px',
                              borderColor: `${darkPurple[12]} !important`,
                              svg: {
                                 width: '16px !important',
                              },
                              gap: '10px',
                           }}
                        >
                           <FontAwesomeIcon
                              icon={faArrowsRotate as IconProp}
                              fixedWidth
                              fontSize={'16px'}
                              color={darkPurple[12]}
                           />
                        </Button> */}
                     </Grid>
                  }
               />
               <HeaderTitleToolbar
                  title={`Gateway Report
                  ${
                     currencyOption?.value === 0
                        ? `In ${currency}`
                        : currencyOption.name
                  }`}
                  actions={
                     <>
                        <Grid item>
                           {currencyOption?.value === 0 && <CurrenciesFilter />}
                        </Grid>
                        <Grid item>
                           {
                              <Stack
                                 direction={['column', 'row']}
                                 alignItems={'center'}
                                 gap={2}
                                 sx={{
                                    '.MuiFormControl-root': {
                                       width: [130, 175],
                                       '& .MuiInputBase-input': { pr: 0 },
                                    },
                                 }}
                              >
                                 <Button
                                    variant="contained"
                                    color="secondary"
                                    aria-owns={
                                       anchorElT ? 'simple-menu' : undefined
                                    }
                                    aria-haspopup="true"
                                    onClick={handleClickT}
                                    fullWidth={matches ? false : true}
                                    size={'small'}
                                    sx={{
                                       minWidth: '10ch',
                                    }}
                                    endIcon={
                                       <FontAwesomeIcon
                                          icon={
                                             anchorElT
                                                ? (faAngleUp as IconProp)
                                                : (faAngleDown as IconProp)
                                          }
                                          color={
                                             theme.palette.primary.contrastText
                                          }
                                          size="xs"
                                       />
                                    }
                                 >
                                    {gateway}
                                 </Button>
                                 <Menu
                                    id="simple-menu"
                                    anchorEl={anchorElT}
                                    open={Boolean(anchorElT)}
                                    onClose={() => setAnchorElT(null)}
                                 >
                                    {Object.values(PaymentGatewayName).map(
                                       (item: PaymentGatewayName) => (
                                          <MenuItem
                                             key={item}
                                             sx={{
                                                minWidth: '10ch',
                                             }}
                                             onClick={() =>
                                                handleUpdateGateway(item)
                                             }
                                          >
                                             {item}
                                          </MenuItem>
                                       )
                                    )}
                                 </Menu>
                              </Stack>
                           }
                        </Grid>
                     </>
                  }
               />
            </>
         )}

         {!loadingFinancialReport ? (
            <Grid
               container
               spacing={'6px'}
               px={isLgUp ? '12px' : '6px'}
               py={'6px'}
               height={PageWith3Toolbar}
               pt={'0'}
               mt={0}
               position={'relative'}
               sx={{
                  overflow: 'hidden',
                  width: isDesktop ? 'calc(100vw - 216px)' : '100%',
                  overflowY: loadingFinancialReportYear ? 'hidden' : 'auto',
               }}
               ref={gridRef}
            >
               <Grid item xs={12}>
                  {/* Yearly reports */}
                  <Stack gap={0} mb={2} ref={stackRefs[0]}>
                     <PortalGatewayReport
                        rows={dataYearly}
                        format="YYYY"
                        isLoading={loadingFinancialReportYear}
                        link="Yearly Stats"
                        highlighted={
                           moment(yearSelected).tz('GMT').unix() * 1000
                        }
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
                  <Stack gap={0} mb={2} ref={stackRefs[1]}>
                     <PortalGatewayReport
                        rows={dataMonthly}
                        format="MMM"
                        isLoading={loadingFinancialReportMonth}
                        link="Monthly Stats"
                        highlighted={
                           moment(monthSelected).tz('GMT').unix() * 1000
                        }
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
                           .format('YYYY')}`}
                        noChart={true}
                     />
                  </Stack>

                  {/* Daily reports */}
                  <Stack gap={0} mb={2} ref={stackRefs[2]}>
                     <PortalGatewayReport
                        rows={dataDaily}
                        format="DD (ddd)"
                        isLoading={loadingFinancialReportDay}
                        highlighted={
                           moment(daySelected).tz('GMT').unix() * 1000
                        }
                        link="Daily Stats"
                        setDate={(e: any) => {
                           setDaySelected(
                              moment(e).tz('GMT').startOf('day').toString()
                           )
                        }}
                        linkLabel={`${moment(monthSelected)
                           .tz('GMT')
                           .format('MMMM')}`}
                        noChart={true}
                     />
                  </Stack>

                  {/* Hourly reports */}
                  <Stack gap={0} mb={2} ref={stackRefs[3]}>
                     <PortalGatewayReport
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
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

GatewayReports.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout>{page}</DashboardLayout>
}

export default GatewayReports
