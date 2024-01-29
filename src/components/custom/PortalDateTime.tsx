import { Typography, TypographyProps } from '@mui/material'
import { darkPurple } from 'colors'
import moment from 'moment-timezone'
import { useSelector } from 'react-redux'
import { getCrashConfig } from 'redux/slices/crashConfig'

interface PortalDateTimeProps {
   timestamp: string
   format?: 'milliseconds' | 'unix'
   timezone?: boolean
}

const PortalDateTime = ({
   timestamp,
   format,
   timezone,
   ...props
}: PortalDateTimeProps & TypographyProps) => {
   const timezoneData = useSelector(getCrashConfig).timezone
   const timezoneAbrev = useSelector(getCrashConfig).abbrev
   const dateAndTime = formatTimestamp(timestamp, timezoneData, format)

   return (
      <Typography variant="bodySmallBold" {...props} color={darkPurple[1]}>
         {dateAndTime}{' '}
         {timezone && (
            <Typography
               component="span"
               variant="bodySmall"
               fontSize={'10px !important'}
               color={'#e31b54'}
            >
               {timezoneAbrev}
            </Typography>
         )}
      </Typography>
   )
}

const formatTimestamp = (
   timestamp: string,
   timezone: string,
   format?: 'milliseconds' | 'unix'
) => {
   let time
   if (moment(timestamp).isValid())
      switch (format) {
         case 'unix':
            time = moment(timestamp).tz(timezone).format('x')
            break
         case 'milliseconds':
            time = moment(timestamp)
               .tz(timezone)
               .format('YYYY-MM-DD HH:mm:ss:SSS')
            break
         default:
            time = moment(timestamp).tz(timezone).format('YYYY-MM-DD HH:mm:ss')
      }
   else return '--'

   return time
}

export default PortalDateTime
