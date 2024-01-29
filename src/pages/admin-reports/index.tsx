import CustomLoader from '@/components/custom/CustomLoader'
import { FilterChip } from '@/components/custom/PortalFilterChips'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import { useGetOperatorListQuery } from '@/components/data/operators/lib/hooks/queries'
import {
   ReportGranularityType,
   ReportTimeInterval,
} from '@alienbackoffice/back-front'
import { OperatorList } from '@alienbackoffice/back-front/lib/operator/interfaces/operator-list.interface'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown, faCalendar } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Box,
   Button,
   DialogActions,
   FormControl,
   Grid,
   InputLabel,
   MenuItem,
   Select,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { DateTimePicker, renderTimeViewClock } from '@mui/x-date-pickers'
import { ImoonGray } from 'colors'
import moment from 'moment'
import dynamic from 'next/dynamic'
import type { ReactElement } from 'react'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { selectAuthOperators } from 'redux/authSlice'
import { getCrashConfig } from 'redux/slices/crashConfig'
import DashboardLayout from '../../layouts/Dashboard'

function AdminReports() {
   const theme = useTheme()
   const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false })
   const [filterChips, setFilterChips] = React.useState<FilterChip[]>([])
   const [data, setData] = React.useState<{}>({})
   const [granularity, setGranularity] = React.useState<ReportTimeInterval>(
      ReportTimeInterval.YEAR
   )
   const operators = useSelector(selectAuthOperators) as OperatorList
   const [breakdownKey, setBreakdownKey] =
      React.useState<ReportGranularityType>(
         ReportGranularityType.BY_TIME_INTERVAL
      )
   const [operatorsSeleted, setOperatorSeleted] = React.useState<string[]>([])
   const [ignore, setIgnore] = React.useState(false)
   const timezone = useSelector(getCrashConfig).timezone
   const [generateReportFrom, setGenerateReportFrom]: any = React.useState(
      moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss')
   )
   const [generateReportTo, setGenerateReportTo]: any = React.useState(
      moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss')
   )
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

   useGetOperatorListQuery({
      isAssociated: true,
      key: 'navBar',
   })

   useEffect(() => {
      if (!ignore) {
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   })

   return (
      <React.Fragment>
         <Helmet title="Admin Reports" />
         <CustomOperatorsBrandsToolbar
            title={`Admin Reports`}
            background={theme.palette.secondary.dark}
            sx={{
               mb:
                  isDesktop &&
                  filterChips.filter(
                     (chip) => chip.value && chip.value !== 'all'
                  ).length === 0
                     ? '8px'
                     : '0',
            }}
         />
         {ignore ? (
            <Grid
               container
               alignItems="center"
               p={2}
               px={isDesktop ? '12px' : '4px'}
               spacing={2}
               sx={{
                  background: 'initial',
               }}
            >
               <Grid item xs={12}>
                  <Box
                     borderRadius={'8px'}
                     sx={{
                        background: '#fff',
                        width: '100%',
                        '.react-json-view': {
                           maxHeight: 350,
                           width: '100%',
                           overflow: 'auto',
                           borderBottomLeftRadius: '8px',
                           borderBottomRightRadius: '8px',
                        },
                     }}
                  >
                     <Box
                        sx={{
                           background: ImoonGray[4],
                           p: '12px',
                           borderTopLeftRadius: '8px',
                           borderTopRightRadius: '8px',
                           cursor: 'pointer',
                           color: '#fff',
                        }}
                     >
                        Generate Report
                     </Box>
                     <Box
                        sx={{
                           background: '#fff',
                           p: '6px 12px',
                           borderBottomLeftRadius: '8px',
                           borderBottomRightRadius: '8px',
                        }}
                     >
                        <Grid container spacing={2}>
                           <Grid item xs={6}>
                              <DateTimePicker
                                 sx={{
                                    width: '100%',
                                 }}
                                 slots={{
                                    openPickerIcon: () => (
                                       <FontAwesomeIcon
                                          icon={faCalendar as IconProp}
                                       />
                                    ),
                                 }}
                                 viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                 }}
                                 label="From"
                                 format="yyyy-MM-dd HH:mm:ss"
                                 value={
                                    new Date(
                                       moment(generateReportFrom).format(
                                          'YYYY-MM-DD HH:mm:ss'
                                       )
                                    )
                                 }
                                 slotProps={{
                                    textField: {
                                       variant: 'outlined',
                                    },
                                 }}
                                 onChange={(e, newValue) => {
                                    // Use Formik's setFieldValue to update the 'languages' field
                                    // setFieldValue('from', e)
                                    setGenerateReportFrom(newValue)
                                 }}
                                 className="custom-icon-datetime-picker"
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <DateTimePicker
                                 ampm={false}
                                 sx={{
                                    width: '100%',
                                 }}
                                 slots={{
                                    openPickerIcon: () => (
                                       <FontAwesomeIcon
                                          icon={faCalendar as IconProp}
                                       />
                                    ),
                                 }}
                                 viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                 }}
                                 label="To"
                                 format="yyyy-MM-dd HH:mm:ss"
                                 value={
                                    new Date(
                                       moment(generateReportTo).format(
                                          'YYYY-MM-DD HH:mm:ss'
                                       )
                                    )
                                 }
                                 onChange={(e, newValue) => {
                                    setGenerateReportTo(newValue)
                                    // Use Formik's setFieldValue to update the 'languages' field
                                 }}
                                 slotProps={{
                                    textField: {
                                       variant: 'outlined',
                                    },
                                 }}
                                 className="custom-icon-datetime-picker"
                              />
                           </Grid>
                        </Grid>
                        <DialogActions sx={{ textAlign: 'center' }}>
                           <Button
                              color="secondary"
                              variant="contained"
                              sx={{ height: 32 }}
                           >
                              Generate Report
                           </Button>
                        </DialogActions>
                     </Box>
                  </Box>
               </Grid>
               <Grid item xs={12}>
                  <Box
                     borderRadius={'8px'}
                     sx={{
                        background: '#fff',
                        width: '100%',
                        '.react-json-view': {
                           maxHeight: 350,
                           width: '100%',
                           overflow: 'auto',
                           borderBottomLeftRadius: '8px',
                           borderBottomRightRadius: '8px',
                        },
                     }}
                  >
                     <Box
                        sx={{
                           background: ImoonGray[4],
                           p: '12px',
                           borderTopLeftRadius: '8px',
                           borderTopRightRadius: '8px',
                           cursor: 'pointer',
                           color: '#fff',
                        }}
                     >
                        Report
                     </Box>
                     <Box
                        sx={{
                           background: '#fff',
                           p: '6px 12px',
                           borderBottomLeftRadius: '8px',
                           borderBottomRightRadius: '8px',
                        }}
                     >
                        <Grid container spacing={2}>
                           <Grid item xs={6}>
                              <DateTimePicker
                                 sx={{
                                    width: '100%',
                                 }}
                                 slots={{
                                    openPickerIcon: () => (
                                       <FontAwesomeIcon
                                          icon={faCalendar as IconProp}
                                       />
                                    ),
                                 }}
                                 viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                 }}
                                 label="From"
                                 format="yyyy-MM-dd HH:mm:ss"
                                 value={
                                    new Date(
                                       moment(generateReportFrom).format(
                                          'YYYY-MM-DD HH:mm:ss'
                                       )
                                    )
                                 }
                                 slotProps={{
                                    textField: {
                                       variant: 'outlined',
                                    },
                                 }}
                                 onChange={(e, newValue) => {
                                    // Use Formik's setFieldValue to update the 'languages' field
                                    // setFieldValue('from', e)
                                    setGenerateReportFrom(newValue)
                                 }}
                                 className="custom-icon-datetime-picker"
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <DateTimePicker
                                 ampm={false}
                                 sx={{
                                    width: '100%',
                                 }}
                                 slots={{
                                    openPickerIcon: () => (
                                       <FontAwesomeIcon
                                          icon={faCalendar as IconProp}
                                       />
                                    ),
                                 }}
                                 viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                 }}
                                 label="To"
                                 format="yyyy-MM-dd HH:mm:ss"
                                 value={
                                    new Date(
                                       moment(generateReportTo).format(
                                          'YYYY-MM-DD HH:mm:ss'
                                       )
                                    )
                                 }
                                 onChange={(e, newValue) => {
                                    setGenerateReportTo(newValue)
                                    // Use Formik's setFieldValue to update the 'languages' field
                                 }}
                                 slotProps={{
                                    textField: {
                                       variant: 'outlined',
                                    },
                                 }}
                                 className="custom-icon-datetime-picker"
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                 }}
                              >
                                 <InputLabel id="demo-simple-select-disabled-label">
                                    break down Key
                                 </InputLabel>
                                 <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Excluded Operators"
                                    sx={{
                                       width: '100%',
                                    }}
                                    value={breakdownKey}
                                    name="breakdownKey"
                                    onChange={(e) =>
                                       setBreakdownKey(
                                          e.target
                                             .value as ReportGranularityType
                                       )
                                    }
                                    IconComponent={(_props) => {
                                       return (
                                          <FontAwesomeIcon
                                             icon={faAngleDown as IconProp}
                                             size="sm"
                                             className="selectIcon"
                                          />
                                       )
                                    }}
                                 >
                                    {ReportGranularityType &&
                                       Object.keys(ReportGranularityType).map(
                                          (item, index: number) => {
                                             return (
                                                <MenuItem
                                                   key={`ReportTimeInterval${index}`}
                                                   value={item}
                                                >
                                                   {item}
                                                </MenuItem>
                                             )
                                          }
                                       )}
                                 </Select>
                              </FormControl>
                           </Grid>
                           {breakdownKey ===
                              ReportGranularityType.BY_TIME_INTERVAL && (
                              <Grid item xs={6}>
                                 <FormControl
                                    sx={{
                                       width: '100%',
                                    }}
                                 >
                                    <InputLabel id="demo-simple-select-disabled-label">
                                       Granularity
                                    </InputLabel>
                                    <Select
                                       labelId="demo-simple-select-label"
                                       id="demo-simple-select"
                                       label="Excluded Operators"
                                       sx={{
                                          width: '100%',
                                       }}
                                       value={granularity}
                                       name="granularity"
                                       onChange={(e) =>
                                          setGranularity(
                                             e.target
                                                .value as ReportTimeInterval
                                          )
                                       }
                                       IconComponent={(_props) => {
                                          return (
                                             <FontAwesomeIcon
                                                icon={faAngleDown as IconProp}
                                                size="sm"
                                                className="selectIcon"
                                             />
                                          )
                                       }}
                                    >
                                       {ReportTimeInterval &&
                                          Object.keys(ReportTimeInterval).map(
                                             (item, index: number) => {
                                                return (
                                                   <MenuItem
                                                      key={`ReportTimeInterval${index}`}
                                                      value={item}
                                                   >
                                                      {item}
                                                   </MenuItem>
                                                )
                                             }
                                          )}
                                    </Select>
                                 </FormControl>
                              </Grid>
                           )}
                           <Grid item xs={6}>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                 }}
                              >
                                 <InputLabel id="demo-simple-select-disabled-label">
                                    Operators
                                 </InputLabel>
                                 <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Excluded Operators"
                                    sx={{
                                       width: '100%',
                                    }}
                                    multiple
                                    value={operatorsSeleted}
                                    name="operators"
                                    onChange={(e) =>
                                       setOperatorSeleted(
                                          e.target.value as string[]
                                       )
                                    }
                                    IconComponent={(_props) => {
                                       return (
                                          <FontAwesomeIcon
                                             icon={faAngleDown as IconProp}
                                             size="sm"
                                             className="selectIcon"
                                          />
                                       )
                                    }}
                                 >
                                    {operators &&
                                       operators.operators.map(
                                          (item, index: number) => {
                                             return (
                                                <MenuItem
                                                   key={`operators${index}`}
                                                   value={item.opId}
                                                >
                                                   {item.opId}-{item.title}
                                                </MenuItem>
                                             )
                                          }
                                       )}
                                 </Select>
                              </FormControl>
                           </Grid>
                        </Grid>
                        <DialogActions sx={{ textAlign: 'center' }}>
                           <Button
                              color="secondary"
                              variant="contained"
                              sx={{ height: 32 }}
                           >
                              Get Report
                           </Button>
                        </DialogActions>

                        <DynamicReactJson
                           key={`json`}
                           src={data}
                           theme="tomorrow"
                           collapsed={false}
                        />
                     </Box>
                  </Box>
               </Grid>
            </Grid>
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

AdminReports.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Admin Reports">{page}</DashboardLayout>
}

export default AdminReports
