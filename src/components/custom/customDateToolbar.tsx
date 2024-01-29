import {
   Button,
   Dialog,
   Grid,
   IconButton,
   Stack,
   Toolbar,
   ToolbarProps,
   Typography,
   useTheme,
} from '@mui/material'
import { DateTimePicker, renderTimeViewClock } from '@mui/x-date-pickers'
import { darkPurple } from 'colors'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getCrashConfig } from 'redux/slices/crashConfig'
import { convertDateToDateByTimeZone } from 'services/globalFunctions'
import { FrequentlyText, LogsTimeText, OtherFrequentlyText } from 'types'
import {
   IconArrowsLeftRight,
   IconCalendar,
   IconChevronLeft,
   IconChevronRight,
   IconClock,
   IconClockRotateLeft,
} from '../icons'
import TransitionSlide from './TransitionSlide'

export interface DateToolbarProps extends ToolbarProps {
   from?: number
   to?: number
   autoRefresh: boolean
   handleLogDate: Function
   handleSearchClick: Function
   filter?: boolean
   handleFilter?: Function
   defaultDate?: boolean
   background?: string
}

const DateToolbar = ({
   from,
   to,
   onTouchCancel,
   handleLogDate,
   autoRefresh,
   handleSearchClick,
   filter,
   handleFilter,
   defaultDate,
   background,
   ...props
}: DateToolbarProps) => {
   const [time, setTime] = React.useState('')
   const theme = useTheme()
   const [valueStartDate, setValueStartDate] = React.useState<Date | null>(null)
   const [valueEndDate, setValueEndDate] = React.useState<Date | null>(null)
   const startDate = moment(valueStartDate)
   const endDate = moment(valueEndDate)
   const diff = endDate.diff(startDate)
   const timezone = useSelector(getCrashConfig).timezone
   const [ignore, setIgnore] = React.useState(false)
   const timedifference = new Date().getTimezoneOffset()
   const crashConfig = useSelector(getCrashConfig)
   const [open, setOpen] = React.useState(false)
   const [transitionDate, setTransitionDate] = React.useState<any>()

   const handleDecrementDate = () => {
      setTime(LogsTimeText.CUSTOMDATE)
      setValueStartDate(startDate.subtract(diff).toDate())
      setValueEndDate(endDate.subtract(diff).toDate())
      handleLogDate(startDate, endDate, true)
   }

   const handleIncrementDate = () => {
      setTime(LogsTimeText.CUSTOMDATE)
      setValueStartDate(startDate.add(diff).toDate())
      setValueEndDate(endDate.add(diff).toDate())
      handleLogDate(startDate, endDate, true)
   }

   const handleUpdateDate = async (
      time: FrequentlyText | OtherFrequentlyText,
      firstLaunch?: Boolean
   ) => {
      setIgnore(true)
      let newDate: any
      let date: any
      date = new Date()
      const dateByTimeZone = convertDateToDateByTimeZone(date, timezone)
      if (time) {
         switch (time) {
            case FrequentlyText.TODAY:
               newDate = moment(date, 'YYYY-MM-DD HH:mm:ss:SSS').startOf('day')
               date = moment(date, 'YYYY-MM-DD HH:mm:ss:SSS')
                  .add(1, 'day')
                  .startOf('day')
               break
            case FrequentlyText.YESTERDAY:
               newDate = moment(date, 'YYYY-MM-DD HH:mm:ss:SSS')
                  .subtract(1, 'day')
                  .startOf('day')
               date = moment(date, 'YYYY-MM-DD HH:mm:ss:SSS').startOf('day')
               break
            case FrequentlyText.THISWEEK:
               newDate = moment(date, 'YYYY-MM-DD HH:mm:ss:SSS').startOf('week')
               date = moment(date, 'YYYY-MM-DD HH:mm:ss:SSS')
                  .endOf('week')
                  .add(1, 'minute')
               break
            case FrequentlyText.THISMONTH:
               newDate = moment(date, 'YYYY-MM-DD HH:mm:ss:SSS').startOf(
                  'month'
               )
               date = moment(newDate, 'YYYY-MM-DD HH:mm:ss:SSS')
                  .endOf('month')
                  .add(1, 'minute')
               break
            case FrequentlyText.THISYEAR:
               newDate = moment(date, 'YYYY-MM-DD HH:mm:ss:SSS').startOf('year')
               date = moment(newDate, 'YYYY-MM-DD HH:mm:ss:SSS')
                  .endOf('year')
                  .add(1, 'minute')
               break
            case FrequentlyText.LAST24HOURS:
               newDate = moment(
                  dateByTimeZone,
                  'YYYY-MM-DD HH:mm:ss:SSS'
               ).subtract(24, 'hours')
               date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
               break
            case FrequentlyText.LAST48HOURS:
               newDate = moment(
                  dateByTimeZone,
                  'YYYY-MM-DD HH:mm:ss:SSS'
               ).subtract(48, 'hours')
               date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
               break
            case FrequentlyText.LAST7DAYS:
               newDate = moment(date, 'YYYY-MM-DD HH:mm:ss:SSS')
                  .subtract(7, 'days')
                  .startOf('day')
               date = moment(date, 'YYYY-MM-DD HH:mm:ss:SSS')
                  .add(1, 'day')
                  .startOf('day')
               break
            case FrequentlyText.LAST30DAYS:
               newDate = moment(date, 'YYYY-MM-DD HH:mm:ss:SSS')
                  .subtract(30, 'days')
                  .startOf('day')
               date = moment(date, 'YYYY-MM-DD HH:mm:ss:SSS')
                  .add(1, 'day')
                  .startOf('day')
               break
            case FrequentlyText.LAST90DAYS:
               newDate = moment(date, 'YYYY-MM-DD HH:mm:ss:SSS')
                  .subtract(90, 'days')
                  .startOf('day')
               date = moment(date, 'YYYY-MM-DD HH:mm:ss:SSS')
                  .add(1, 'day')
                  .startOf('day')
               break
            case OtherFrequentlyText.LAST1MINUTE:
               newDate = moment(
                  dateByTimeZone,
                  'YYYY-MM-DD HH:mm:ss:SSS'
               ).subtract(1, 'minutes')
               date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')

               break
            case OtherFrequentlyText.LAST5MINUTE:
               newDate = moment(
                  dateByTimeZone,
                  'YYYY-MM-DD HH:mm:ss:SSS'
               ).subtract(5, 'minutes')
               date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
               break
            case OtherFrequentlyText.LAST15MINUTE:
               newDate = moment(
                  dateByTimeZone,
                  'YYYY-MM-DD HH:mm:ss:SSS'
               ).subtract(15, 'minutes')
               date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
               break
            case OtherFrequentlyText.LAST30MINUTE:
               newDate = moment(
                  dateByTimeZone,
                  'YYYY-MM-DD HH:mm:ss:SSS'
               ).subtract(30, 'minutes')
               date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
               break
            case OtherFrequentlyText.LAST45MINUTE:
               newDate = moment(
                  dateByTimeZone,
                  'YYYY-MM-DD HH:mm:ss:SSS'
               ).subtract(45, 'minutes')
               date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
               break
            case OtherFrequentlyText.LAST1HOURS:
               newDate = moment(
                  dateByTimeZone,
                  'YYYY-MM-DD HH:mm:ss:SSS'
               ).subtract(1, 'hour')
               date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
               break
            case OtherFrequentlyText.LAST2HOURS:
               newDate = moment(
                  dateByTimeZone,
                  'YYYY-MM-DD HH:mm:ss:SSS'
               ).subtract(2, 'hours')
               date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
               break
            case OtherFrequentlyText.LAST6HOURS:
               newDate = moment(
                  dateByTimeZone,
                  'YYYY-MM-DD HH:mm:ss:SSS'
               ).subtract(6, 'hours')
               date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
               break
            case OtherFrequentlyText.LAST9HOURS:
               newDate = moment(
                  dateByTimeZone,
                  'YYYY-MM-DD HH:mm:ss:SSS'
               ).subtract(9, 'hours')
               date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
               break
            case OtherFrequentlyText.LAST12HOURS:
               newDate = moment(
                  dateByTimeZone,
                  'YYYY-MM-DD HH:mm:ss:SSS'
               ).subtract(12, 'hours')
               date = moment(dateByTimeZone, 'YYYY-MM-DD HH:mm:ss:SSS')
               break
         }
         setTime(time)
         setValueStartDate(new Date(newDate))
         setValueEndDate(new Date(date))
         await handleLogDate(
            new Date(newDate),
            new Date(date),
            true,
            firstLaunch
         )
      }
   }

   const handleStartDate = (startDate: any) => {
      setTime(LogsTimeText.CUSTOMDATE)
      setValueStartDate(new Date(startDate))
      handleLogDate(new Date(startDate), valueEndDate, false)
   }

   const handleEndDate = (endDate: any) => {
      setTime(LogsTimeText.CUSTOMDATE)
      setValueEndDate(autoRefresh ? new Date() : new Date(endDate))
      handleLogDate(
         valueStartDate,
         autoRefresh ? new Date() : new Date(endDate),
         false
      )
   }

   useEffect(() => {
      if (!ignore) {
         if (from) {
            setTime('Custom Date')
            setValueStartDate(
               new Date(
                  moment(from * 1000)
                     .utc()
                     .unix() *
                     1000 -
                     crashConfig.timezoneOffset * 60 * 1000 +
                     timedifference * 60 * 1000
               )
            )
            if (to) {
               setValueEndDate(
                  new Date(
                     moment(to * 1000)
                        .utc()
                        .unix() *
                        1000 -
                        crashConfig.timezoneOffset * 60 * 1000 +
                        timedifference * 60 * 1000
                  )
               )
               handleLogDate(
                  new Date(
                     moment(from * 1000)
                        .utc()
                        .unix() *
                        1000 -
                        crashConfig.timezoneOffset * 60 * 1000 +
                        timedifference * 60 * 1000
                  ),
                  new Date(
                     moment(to * 1000)
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
                     moment(from * 1000)
                        .utc()
                        .add(1, 'hour')
                        .unix() *
                        1000 -
                        crashConfig.timezoneOffset * 60 * 1000 +
                        timedifference * 60 * 1000
                  )
               )
               handleLogDate(
                  new Date(
                     moment(from * 1000)
                        .utc()
                        .unix() *
                        1000 -
                        crashConfig.timezoneOffset * 60 * 1000 +
                        timedifference * 60 * 1000
                  ),
                  new Date(
                     moment(from * 1000)
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
            handleUpdateDate(FrequentlyText.TODAY, true)
         }
      }
   }, [ignore])

   const handleClickOpen = () => {
      setTransitionDate(TransitionSlide)
      setOpen(true)
   }

   const handleClose = async () => {
      handleSearchClick()
      setOpen(false)
   }

   return (
      <Toolbar
         variant="dense"
         sx={{
            flexDirection: ['column', 'row'],
            justifyContent: 'space-between',
            height: '38px',
            minHeight: '38px',
            gap: 2,
            mb: 0,
            px: '8px',
            background: (props) =>
               background ? background : props.palette.secondary.dark,
            ...props.sx,
         }}
      >
         <Grid
            container
            sx={{ width: '100%', height: '100%' }}
            alignItems="center"
         >
            <Grid item>
               <Button onClick={handleClickOpen}>
                  <Stack
                     direction="row"
                     alignItems="center"
                     gap={2}
                     sx={{
                        svg: {
                           width: '12px',
                           path: {
                              fill: (props) =>
                                 props.palette.primary.contrastText,
                           },
                        },
                     }}
                  >
                     <IconCalendar />
                     <Typography
                        color={(props) => props.palette.primary.contrastText}
                        variant="h5"
                        sx={{
                           svg: {
                              marginLeft: '5px',
                              marginRight: '5px',
                              position: 'relative',
                              top: '2px',
                              path: {
                                 fill: '#6172F3',
                              },
                              width: '12px',
                           },
                        }}
                     >
                        {time === LogsTimeText.CUSTOMDATE ? (
                           <>
                              {moment(valueStartDate).format(
                                 'yyyy-MM-DD HH:mm'
                              )}

                              <IconArrowsLeftRight />
                              {moment(valueEndDate).format('yyyy-MM-DD HH:mm')}
                           </>
                        ) : (
                           time
                        )}
                     </Typography>
                  </Stack>
               </Button>
            </Grid>
            <Grid item xs></Grid>
            <Grid item>
               <Stack direction="row" gap={2}>
                  <IconButton
                     color={'info'}
                     onClick={handleDecrementDate}
                     sx={{
                        'svg path': {
                           opacity: '1 !important',
                        },
                        svg: {
                           fontSize: 16,
                           width: '10px',
                           path: {
                              fill: (props) =>
                                 props.palette.primary.contrastText,
                           },
                        },
                        color: '#fff', // Set the icon color here
                     }}
                  >
                     <IconChevronLeft />
                  </IconButton>

                  <IconButton
                     disabled={endDate > moment()}
                     color={'info'}
                     onClick={handleIncrementDate}
                     sx={{
                        'svg path': {
                           opacity: '1 !important',
                        },
                        svg: {
                           fontSize: 16,
                           width: '10px',
                           path: {
                              fill: (props) =>
                                 props.palette.primary.contrastText,
                           },
                        },
                        color: '#fff', // Set the icon color here
                     }}
                  >
                     <IconChevronRight />
                  </IconButton>
               </Stack>
            </Grid>
            {filter && handleFilter && handleFilter()}
            <Dialog
               open={open}
               className="dateToolbar"
               sx={{
                  alignContent: 'start',
                  alignItems: 'start',
                  top: '38px',
                  background: 'rgba(213, 210, 223, .8)',
                  '.MuiPaper-root': {
                     width: '100%',
                     maxWidth: '100% !important',
                     margin: 0,
                     borderRadius: 0,
                  },
                  '.MuiDialog-container': {
                     display: 'block',
                  },
               }}
               onClose={handleClose}
               TransitionComponent={transitionDate}
               keepMounted
            >
               <Grid container alignItems="center" height={'38px'}>
                  <Grid item>
                     <IconButton
                        color={'primary'}
                        onClick={handleClose}
                        sx={{
                           'svg path': {
                              opacity: '1 !important',
                           },
                           svg: {
                              fontSize: 16,
                              width: '10px',
                           },
                           padding: 0,
                        }}
                     >
                        <IconChevronLeft />
                     </IconButton>
                  </Grid>
                  <Grid item xs textAlign={'center'}>
                     <Typography
                        fontSize={'10px !important'}
                        fontFamily="Nunito Sans Bold"
                        color={darkPurple[7]}
                        pl={'24px'}
                        sx={{
                           svg: {
                              marginLeft: 5,
                              marginRight: 5,
                              fill: '#6172F3',
                              width: '10px',
                           },
                        }}
                     >
                        {moment(valueStartDate).format('yyyy-MM-DD HH:mm')}
                        <IconArrowsLeftRight />
                        {moment(valueEndDate).format('yyyy-MM-DD HH:mm')}
                     </Typography>
                  </Grid>
                  <Grid item>
                     <Stack direction="row" gap={4}>
                        <IconButton
                           color={'primary'}
                           onClick={handleDecrementDate}
                           sx={{
                              'svg path': {
                                 opacity: '1 !important',
                              },
                              svg: {
                                 fontSize: 16,
                                 width: '10px',
                              },
                              p: 0,
                           }}
                        >
                           <IconChevronLeft />
                        </IconButton>

                        <IconButton
                           disabled={endDate > moment()}
                           color={'primary'}
                           onClick={handleIncrementDate}
                           sx={{
                              'svg path': {
                                 opacity: '1 !important',
                              },
                              svg: {
                                 fontSize: 16,
                                 width: '10px',
                              },
                              p: 0,
                           }}
                        >
                           <IconChevronRight />
                        </IconButton>
                     </Stack>
                  </Grid>
               </Grid>
               <Grid
                  container
                  alignItems="center"
                  textAlign={'left'}
                  maxWidth={312}
                  margin={'0 auto'}
                  p={'0 24px'}
                  spacing={0}
                  mb={20}
                  sx={{
                     button: {
                        padding: '4px',
                        height: '32px',
                        fontSize: theme.breakpoints.down('sm')
                           ? '10px'
                           : '11px',
                        textTransform: 'capitalize',
                        fontFamily: 'Nunito Sans Bold',
                        color: darkPurple[7],
                     },
                     '.MuiFormControl-root': {
                        margin: 0,
                        '.MuiInputBase-root': {
                           padding: '4px !important',
                           height: '32px',
                           minHeight: '32px',
                           '.MuiInputAdornment-root': {
                              display: 'none',
                           },
                           input: {
                              fontSize: '10px  !important',
                              textTransform: 'capitalize',
                              fontFamily: 'Nunito Sans Bold',
                              color: darkPurple[7],
                              textAlign: 'center',
                           },
                        },
                     },
                     '.active button': {
                        background: '#6172F3',
                        borderColor: '#6172F3',
                        color: (props) => props.palette.primary.contrastText,
                     },
                     '.active .MuiInputBase-root': {
                        background: '#6172F3',
                        fieldset: {
                           borderColor: '#6172F3 !important',
                        },
                        input: {
                           color: (props) => props.palette.primary.contrastText,
                        },
                     },
                  }}
               >
                  <Grid item xs={12} mb={'8px'}>
                     <Typography
                        fontFamily={'Nunito Sans Bold'}
                        fontSize={'12px !important'}
                        sx={{
                           svg: {
                              marginLeft: 5,
                              marginRight: 5,
                              color: theme.palette.primary.main,
                              width: '12px',
                           },
                        }}
                     >
                        <IconClock />
                        Frequently used:
                     </Typography>
                  </Grid>
                  <Grid item xs={12} mb={'12px'}>
                     <Grid
                        container
                        alignItems="center"
                        textAlign={'left'}
                        margin={'0 auto'}
                        spacing={4}
                        paddingRight={4}
                     >
                        {Object.values(FrequentlyText).map((item) => (
                           <Grid
                              item
                              xs={6}
                              key={item}
                              paddingTop={'4px !important'}
                              className={time === item ? 'active' : ''}
                           >
                              <Button
                                 onClick={() => handleUpdateDate(item)}
                                 variant="outlined"
                                 fullWidth
                              >
                                 {item}
                              </Button>
                           </Grid>
                        ))}
                     </Grid>
                  </Grid>
                  <Grid item xs={12} mb={'8px'}>
                     <Typography
                        fontFamily={'Nunito Sans Bold'}
                        fontSize={'12px !important'}
                        sx={{
                           svg: {
                              marginLeft: 5,
                              marginRight: 5,
                              color: theme.palette.primary.main,
                              width: '12px',
                           },
                        }}
                     >
                        <IconClockRotateLeft />
                        Other
                     </Typography>
                  </Grid>
                  <Grid item xs={12} mb={'12px'}>
                     <Grid
                        container
                        alignItems="center"
                        textAlign={'left'}
                        margin={'0 auto'}
                        spacing={4}
                        paddingRight={4}
                     >
                        {Object.values(OtherFrequentlyText).map((item) => (
                           <Grid
                              item
                              xs={6}
                              key={`1${item}`}
                              paddingTop={'4px !important'}
                              className={time === item ? 'active' : ''}
                           >
                              <Button
                                 onClick={() => handleUpdateDate(item)}
                                 variant="outlined"
                                 fullWidth
                              >
                                 {item}
                              </Button>
                           </Grid>
                        ))}
                     </Grid>
                  </Grid>
                  <Grid item xs={12} mb={'12px'}>
                     <Typography
                        fontFamily={'Nunito Sans Bold'}
                        fontSize={'12px !important'}
                        sx={{
                           svg: {
                              marginLeft: 5,
                              marginRight: 5,
                              color: theme.palette.primary.main,
                              width: '12px',
                           },
                        }}
                     >
                        <IconArrowsLeftRight />
                        Custom Range:
                     </Typography>
                  </Grid>
                  <Grid item mb={'12px'}>
                     <Stack
                        direction="row"
                        alignItems="center"
                        gap={2}
                        pl={'16px'}
                        sx={{
                           fieldset: {
                              border: `1px solid ${darkPurple[9]}!important`,
                           },
                        }}
                        className={
                           time === LogsTimeText.CUSTOMDATE ? 'active' : ''
                        }
                     >
                        <DateTimePicker
                           ampm={false}
                           viewRenderers={{
                              hours: renderTimeViewClock,
                              minutes: renderTimeViewClock,
                              seconds: renderTimeViewClock,
                           }}
                           format="yyyy-MM-dd HH:mm"
                           value={valueStartDate}
                           onChange={(newValue) => {
                              handleStartDate(newValue)
                           }}
                        />
                        <DateTimePicker
                           ampm={false}
                           viewRenderers={{
                              hours: renderTimeViewClock,
                              minutes: renderTimeViewClock,
                              seconds: renderTimeViewClock,
                           }}
                           disabled={autoRefresh}
                           minDateTime={valueStartDate}
                           value={autoRefresh ? new Date() : valueEndDate}
                           format="yyyy-MM-dd HH:mm"
                           onChange={(newValue) => {
                              handleEndDate(newValue)
                           }}
                        />
                     </Stack>
                  </Grid>
               </Grid>
            </Dialog>
         </Grid>
      </Toolbar>
   )
}

export default DateToolbar
