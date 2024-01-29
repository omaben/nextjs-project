import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faCalendar,
   faChevronDown,
   faChevronLeft,
   faChevronRight,
   faChevronUp,
   faSearch,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Box,
   Grid,
   IconButton,
   Menu,
   MenuItem,
   Button as MuiButton,
   Stack,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { spacing } from '@mui/system'
import { DateTimePicker, renderTimeViewClock } from '@mui/x-date-pickers'
import { darkPurple } from 'colors'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getCrashConfig } from 'redux/slices/crashConfig'
import { convertDateToDateByTimeZone } from 'services/globalFunctions'
import { DateGraph, LogsTime, LogsTimeText } from '../../../../types'

const Button = styled(MuiButton)(spacing)

function Actions(data: any) {
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
   const { t } = useTranslation()
   const [date, setDate] = React.useState('Last 7 days' as string)
   const [value, setValue] = React.useState(DateGraph.LAST7DAYS)
   const theme = useTheme()
   const matches = useMediaQuery(theme.breakpoints.up('md'))
   const [showDateInputs, setShowDateInputs] = React.useState(true)
   const [time, setTime] = React.useState('1 Hour')
   const [timeValue, setTimeValue] = React.useState(LogsTime.ONEHOUR)
   const [anchorElT, setAnchorElT] = React.useState<null | HTMLElement>(null)
   const [valueStartDate, setValueStartDate] = React.useState<Date | null>(null)
   const [valueEndDate, setValueEndDate] = React.useState<Date | null>(null)
   const startDate = moment(valueStartDate)
   const endDate = moment(valueEndDate)
   const diff = endDate.diff(startDate)
   const timezone = useSelector(getCrashConfig).timezone
   const [ignore, setIgnore] = React.useState(false)
   const timedifference = new Date().getTimezoneOffset()
   const crashConfig = useSelector(getCrashConfig)

   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
   }

   const handleClose = (date: string, value: any) => {
      setDate(date)
      setValue(value)
      if (value === DateGraph.TODAY || value === DateGraph.YESTERDAY) {
         data.setDate(value.ONEHOUR)
      } else {
         data.setDate(value)
      }
      setAnchorEl(null)
   }

   const handleClickT = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorElT(event.currentTarget)
   }

   const handleDecrementDate = () => {
      setTime('Custom Date')
      setValueStartDate(startDate.subtract(diff).toDate())
      setValueEndDate(endDate.subtract(diff).toDate())
      data.setLogDate(startDate, endDate, true)
      setShowDateInputs(true)
   }

   const handleIncrementDate = () => {
      setTime('Custom Date')
      setValueStartDate(startDate.add(diff).toDate())
      setValueEndDate(endDate.add(diff).toDate())
      data.setLogDate(startDate, endDate, true)
      setShowDateInputs(true)
   }

   const handleCloseT = (time: string, value: any, firstLaunch?: Boolean) => {
      setIgnore(true)
      let newDate: any
      let date: any
      date = new Date()
      const dateByTimeZone = convertDateToDateByTimeZone(date, timezone)
      if (data.time) {
         if (value) {
            switch (value) {
               case LogsTime.TODAY:
                  newDate = moment(
                     dateByTimeZone,
                     'YYYY-MM-DD HH:mm:ss:SSS'
                  ).startOf('day')
                  date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                     .add(1, 'day')
                     .startOf('day')
                  break
               case LogsTime.YESTERDAY:
                  newDate = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                     .subtract(1, 'day')
                     .startOf('day')
                  date = moment(
                     dateByTimeZone,
                     'YYYY-MM-DD HH:mm:ss:SSS'
                  ).startOf('day')
                  break
               case LogsTime.LAST3DAYS:
                  newDate = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                     .subtract(3, 'day')
                     .startOf('day')
                  date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                     .add(1, 'day')
                     .startOf('day')
                  break
               case LogsTime.LAST7DAYS:
                  newDate = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                     .subtract(7, 'day')
                     .startOf('day')
                  date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                     .add(1, 'day')
                     .startOf('day')
                  break
               case LogsTime.ONEMINUTE:
                  newDate = moment(
                     dateByTimeZone,
                     'YYYY-MM-DD HH:mm:ss:SSS'
                  ).subtract(1, 'minutes')
                  date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')

                  break
               case LogsTime.FIVEMUNITE:
                  newDate = moment(
                     dateByTimeZone,
                     'YYYY-MM-DD HH:mm:ss:SSS'
                  ).subtract(5, 'minutes')
                  date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                  break
               case LogsTime.THIRTYMUNITE:
                  newDate = moment(
                     dateByTimeZone,
                     'YYYY-MM-DD HH:mm:ss:SSS'
                  ).subtract(30, 'minutes')
                  date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                  break
               case LogsTime.ONEHOUR:
                  newDate = moment(
                     dateByTimeZone,
                     'YYYY-MM-DD HH:mm:ss:SSS'
                  ).subtract(1, 'hour')
                  date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                  break
               case LogsTime.TWOHOUR:
                  newDate = moment(
                     dateByTimeZone,
                     'YYYY-MM-DD HH:mm:ss:SSS'
                  ).subtract(2, 'hours')
                  date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                  break
               case LogsTime.SIXHOUR:
                  newDate = moment(
                     dateByTimeZone,
                     'YYYY-MM-DD HH:mm:ss:SSS'
                  ).subtract(6, 'hours')
                  date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                  break
               case LogsTime.THISWEEK:
                  newDate = moment(
                     dateByTimeZone,
                     'YYYY-MM-DD HH:mm:ss:SSS'
                  ).startOf('week')
                  date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                     .endOf('week')
                     .add(1, 'minute')
                  break
               case LogsTime.THISMONTH:
                  newDate = moment(
                     dateByTimeZone,
                     'YYYY-MM-DD HH:mm:ss:SSS'
                  ).startOf('month')
                  date = moment(newDate, 'YYYY-MM-DD HH:mm:ss:SSS')
                     .endOf('month')
                     .add(1, 'minute')
                  break
               case LogsTime.LAST30DAYS:
                  newDate = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                     .subtract(30, 'days')
                     .startOf('day')
                  date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                     .add(1, 'day')
                     .startOf('day')
                  break
               case LogsTime.LASTMONTH:
                  newDate = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                     .subtract(1, 'month')
                     .startOf('month')
                  date = moment(
                     dateByTimeZone,
                     'YYYY-MM-DD HH:mm:ss:SSS'
                  ).startOf('month')
                  break
               case LogsTime.LAST3MONTH:
                  newDate = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                     .subtract(90, 'days')
                     .startOf('day')
                  date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                     .add(1, 'day')
                     .startOf('day')
                  break
               case LogsTime.LAST6MONTH:
                  newDate = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                     .subtract(180, 'days')
                     .startOf('day')
                  date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
                     .add(1, 'day')
                     .startOf('day')
                  break
            }
            setTime(time)
            setTimeValue(value)
            setValueStartDate(new Date(newDate))
            setValueEndDate(new Date(date))
            data.setLogDate(
               new Date(newDate),
               new Date(date),
               true,
               firstLaunch
            )
         }
      }

      setAnchorElT(null)
      !matches && setShowDateInputs(false)
   }

   const handleClickCustomDate = () => {
      setAnchorElT(null)
      setShowDateInputs(true)
      setTimeValue(LogsTime.CUSTOMDATE)
      setTime('Custom Date')
   }

   const handleStartDate = (startDate: any) => {
      setTimeValue(LogsTime.CUSTOMDATE)
      setTime('Custom Date')
      setValueStartDate(new Date(startDate))
      data.setLogDate(new Date(startDate), valueEndDate, false)
   }

   const handleEndDate = (endDate: any) => {
      setTimeValue(LogsTime.CUSTOMDATE)
      setTime('Custom Date')
      setValueEndDate(data.autoRefresh ? new Date() : new Date(endDate))
      data.setLogDate(
         valueStartDate,
         data.autoRefresh ? new Date() : new Date(endDate),
         false
      )
   }

   useEffect(() => {
      if (!ignore)
         if (data.defaultDate) {
            if (data.from) {
               setTime('Custom Date')
               setValueStartDate(
                  new Date(
                     moment(data.from).utc().startOf('day').unix() * 1000 -
                        crashConfig.timezoneOffset * 60 * 1000 +
                        timedifference * 60 * 1000
                  )
               )
               setValueEndDate(
                  new Date(
                     moment().utc().add(1, 'day').startOf('day').unix() * 1000 -
                        crashConfig.timezoneOffset * 60 * 1000 +
                        timedifference * 60 * 1000
                  )
               )
               data.setLogDate(
                  new Date(
                     moment(data.from).utc().startOf('day').unix() * 1000 -
                        crashConfig.timezoneOffset * 60 * 1000 +
                        timedifference * 60 * 1000
                  ),
                  new Date(
                     moment().utc().add(1, 'day').unix() * 1000 -
                        crashConfig.timezoneOffset * 60 * 1000 +
                        timedifference * 60 * 1000
                  ),
                  true,
                  false
               )
               setIgnore(true)
            } else {
               handleCloseT(LogsTimeText.LAST30DAYS, LogsTime.LAST30DAYS, true)
            }
         } else if (data.from) {
            setTime('Custom Date')
            setValueStartDate(
               new Date(
                  moment(data.from * 1000)
                     .utc()
                     .unix() *
                     1000 -
                     crashConfig.timezoneOffset * 60 * 1000 +
                     timedifference * 60 * 1000
               )
            )
            if (data.to) {
               setValueEndDate(
                  new Date(
                     moment(data.to * 1000)
                        .utc()
                        .unix() *
                        1000 -
                        crashConfig.timezoneOffset * 60 * 1000 +
                        timedifference * 60 * 1000
                  )
               )
               data.setLogDate(
                  new Date(
                     moment(data.from * 1000)
                        .utc()
                        .unix() *
                        1000 -
                        crashConfig.timezoneOffset * 60 * 1000 +
                        timedifference * 60 * 1000
                  ),
                  new Date(
                     moment(data.to * 1000)
                        .utc()
                        .unix() *
                        1000 -
                        crashConfig.timezoneOffset * 60 * 1000 +
                        timedifference * 60 * 1000
                  ),
                  true,
                  false
               )
            } else {
               setValueEndDate(
                  new Date(
                     moment(data.from * 1000)
                        .utc()
                        .add(1, 'hour')
                        .unix() *
                        1000 -
                        crashConfig.timezoneOffset * 60 * 1000 +
                        timedifference * 60 * 1000
                  )
               )
               data.setLogDate(
                  new Date(
                     moment(data.from * 1000)
                        .utc()
                        .unix() *
                        1000 -
                        crashConfig.timezoneOffset * 60 * 1000 +
                        timedifference * 60 * 1000
                  ),
                  new Date(
                     moment(data.from * 1000)
                        .utc()
                        .add(1, 'hour')
                        .unix() *
                        1000 -
                        crashConfig.timezoneOffset * 60 * 1000 +
                        timedifference * 60 * 1000
                  ),
                  true,
                  false
               )
            }

            // hand(data.from * 1000)
            setIgnore(true)
         } else {
            handleCloseT(LogsTimeText.TODAY, LogsTime.TODAY, true)
         }
   })

   return (
      <React.Fragment>
         {data.date && (
            <React.Fragment>
               <Button
                  variant="contained"
                  color="secondary"
                  aria-owns={anchorEl ? 'simple-menu' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                  mr={2}
               >
                  {date}
               </Button>
               <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => handleClose(date, value)}
               >
                  <MenuItem
                     onClick={() =>
                        handleClose(t('app_today'), DateGraph.TODAY)
                     }
                  >
                     {t('app_today')}
                  </MenuItem>
                  <MenuItem
                     onClick={() =>
                        handleClose('Yesterday', DateGraph.YESTERDAY)
                     }
                  >
                     Yesterday
                  </MenuItem>
                  <MenuItem
                     onClick={() =>
                        handleClose('Last 7 days', DateGraph.LAST7DAYS)
                     }
                  >
                     Last 7 days
                  </MenuItem>
                  <MenuItem
                     onClick={() =>
                        handleClose('Last 30 days', DateGraph.LAST30DAYS)
                     }
                  >
                     Last 30 days
                  </MenuItem>
                  <MenuItem
                     onClick={() =>
                        handleClose(t('app_this_month'), DateGraph.THISMONTH)
                     }
                  >
                     {t('app_this_month')}
                  </MenuItem>
                  <MenuItem
                     onClick={() =>
                        handleClose('Last month', DateGraph.LASTMONTH)
                     }
                  >
                     Last month
                  </MenuItem>
               </Menu>
            </React.Fragment>
         )}
         {data.time && (
            <React.Fragment>
               <Stack
                  direction={['column', 'row']}
                  alignItems={'center'}
                  gap={2}
                  sx={{
                     '.MuiFormControl-root': {
                        width: [130, 175],
                        '& .MuiInputBase-input': { pr: 0 },
                        label: {
                           fontSize: '12px !important',
                        },
                     },
                  }}
               >
                  <Stack
                     direction="row"
                     gap={1}
                     // position={'relative'}
                     // top={'3px'}
                  >
                     <IconButton onClick={handleDecrementDate} sx={{ p: 0 }}>
                        <FontAwesomeIcon
                           icon={faChevronLeft as IconProp}
                           fontSize={16}
                           fixedWidth
                        />
                     </IconButton>
                     <Button
                        variant="contained"
                        color="secondary"
                        aria-owns={anchorElT ? 'simple-menu' : undefined}
                        aria-haspopup="true"
                        onClick={handleClickT}
                        fullWidth={matches ? false : true}
                        size={matches ? 'medium' : 'small'}
                        sx={{
                           minWidth: '16ch',
                           padding: '6px 8px',
                           borderRadius: '6px',
                           '&:hover': {
                              background: '#1570EF',
                           },
                        }}
                     >
                        <Stack
                           direction="row"
                           alignItems="center"
                           gap={2}
                           width={'100%'}
                        >
                           <Grid
                              container
                              alignItems="center"
                              spacing={0}
                              width={'100%'}
                           >
                              <Grid item width={'calc(100% - 14px)'}>
                                 <Typography variant="h5">{time}</Typography>
                              </Grid>
                              <Grid item xs={'auto'}>
                                 <FontAwesomeIcon
                                    icon={
                                       anchorElT
                                          ? (faChevronUp as IconProp)
                                          : (faChevronDown as IconProp)
                                    }
                                    color={theme.palette.primary.contrastText}
                                    size="lg"
                                    width={'14px'}
                                 />
                              </Grid>
                           </Grid>
                        </Stack>
                     </Button>
                     <IconButton
                        onClick={handleIncrementDate}
                        disabled={endDate > moment()}
                        sx={{ p: 0 }}
                     >
                        <FontAwesomeIcon
                           icon={faChevronRight as IconProp}
                           fontSize={16}
                           fixedWidth
                        />
                     </IconButton>
                  </Stack>
                  <Menu
                     id="simple-menu"
                     anchorEl={anchorElT}
                     open={Boolean(anchorElT)}
                     onClose={() => setAnchorElT(null)}
                  >
                     <MenuItem
                        onClick={() =>
                           handleCloseT(LogsTimeText.TODAY, LogsTime.TODAY)
                        }
                     >
                        {LogsTimeText.TODAY}
                     </MenuItem>
                     {data.type !== 'crash-dashboard' && (
                        <Box>
                           <MenuItem
                              onClick={() =>
                                 handleCloseT(
                                    LogsTimeText.ONEMINUTE,
                                    LogsTime.ONEMINUTE
                                 )
                              }
                           >
                              {LogsTimeText.ONEMINUTE}
                           </MenuItem>
                           <MenuItem
                              onClick={() =>
                                 handleCloseT(
                                    LogsTimeText.ONEHOUR,
                                    LogsTime.ONEHOUR
                                 )
                              }
                           >
                              {LogsTimeText.ONEHOUR}
                           </MenuItem>
                        </Box>
                     )}
                     <MenuItem
                        onClick={() =>
                           handleCloseT(
                              LogsTimeText.YESTERDAY,
                              LogsTime.YESTERDAY
                           )
                        }
                     >
                        {LogsTimeText.YESTERDAY}
                     </MenuItem>
                     <MenuItem
                        onClick={() =>
                           handleCloseT(
                              LogsTimeText.LAST3DAYS,
                              LogsTime.LAST3DAYS
                           )
                        }
                     >
                        {LogsTimeText.LAST3DAYS}
                     </MenuItem>
                     <MenuItem
                        onClick={() =>
                           handleCloseT(
                              LogsTimeText.LAST7DAYS,
                              LogsTime.LAST7DAYS
                           )
                        }
                     >
                        {LogsTimeText.LAST7DAYS}
                     </MenuItem>
                     <MenuItem
                        onClick={() =>
                           handleCloseT(
                              LogsTimeText.LAST30DAYS,
                              LogsTime.LAST30DAYS
                           )
                        }
                     >
                        {LogsTimeText.LAST30DAYS}
                     </MenuItem>
                     <MenuItem
                        onClick={() =>
                           handleCloseT(
                              LogsTimeText.THISWEEK,
                              LogsTime.THISWEEK
                           )
                        }
                     >
                        {LogsTimeText.THISWEEK}
                     </MenuItem>
                     <MenuItem
                        onClick={() =>
                           handleCloseT(
                              LogsTimeText.THISMONTH,
                              LogsTime.THISMONTH
                           )
                        }
                     >
                        {LogsTimeText.THISMONTH}
                     </MenuItem>
                     <MenuItem
                        onClick={() =>
                           handleCloseT(
                              LogsTimeText.LASTMONTH,
                              LogsTime.LASTMONTH
                           )
                        }
                     >
                        {LogsTimeText.LASTMONTH}
                     </MenuItem>
                     <MenuItem
                        onClick={() =>
                           handleCloseT(
                              LogsTimeText.LAST3MONTH,
                              LogsTime.LAST3MONTH
                           )
                        }
                     >
                        {LogsTimeText.LAST3MONTH}
                     </MenuItem>
                     <MenuItem
                        onClick={() =>
                           handleCloseT(
                              LogsTimeText.LAST6MONTH,
                              LogsTime.LAST6MONTH
                           )
                        }
                     >
                        {LogsTimeText.LAST6MONTH}
                     </MenuItem>
                     <MenuItem onClick={() => handleClickCustomDate()}>
                        {LogsTimeText.CUSTOMDATE}
                     </MenuItem>
                  </Menu>
                  {showDateInputs && (
                     <Stack
                        direction="row"
                        alignItems="center"
                        gap={'10px'}
                        sx={{
                           '.MuiFormControl-root': {
                              maxWidth: '158px',
                              '.MuiIconButton-root': {
                                 pl: 0,
                                 pr: '4px',
                              },
                              fieldset: {
                                 border: `1px solid ${darkPurple[9]}!important`,
                              },
                           },
                        }}
                     >
                        <DateTimePicker
                           sx={{
                              mt: 0,
                           }}
                           ampm={false}
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
                           format="yyyy-MM-dd HH:mm"
                           value={valueStartDate}
                           onChange={(newValue) => {
                              handleStartDate(newValue)
                           }}
                           className="custom-icon-datetime-picker"
                        />
                        <DateTimePicker
                           ampm={false}
                           viewRenderers={{
                              hours: renderTimeViewClock,
                              minutes: renderTimeViewClock,
                              seconds: renderTimeViewClock,
                           }}
                           slots={{
                              openPickerIcon: () => (
                                 <FontAwesomeIcon
                                    icon={faCalendar as IconProp}
                                 />
                              ),
                           }}
                           label="To"
                           format="yyyy-MM-dd HH:mm"
                           disabled={data.autoRefresh}
                           minDateTime={valueStartDate}
                           value={data.autoRefresh ? new Date() : valueEndDate}
                           onChange={(newValue) => {
                              handleEndDate(newValue)
                           }}
                           className="custom-icon-datetime-picker"
                           sx={{ mt: 0 }}
                        />
                        <IconButton
                           color="primary"
                           onClick={() => data.onSearchClick()}
                           sx={{
                              padding: 0,
                              pr: '12px',
                              top: '5px',
                              svg: {
                                 height: '24px',
                              },
                              '&:hover': {
                                 background: 'initial',
                              },
                           }}
                        >
                           <FontAwesomeIcon icon={faSearch as IconProp} />
                        </IconButton>
                     </Stack>
                  )}
               </Stack>
            </React.Fragment>
         )}
      </React.Fragment>
   )
}

export default Actions
