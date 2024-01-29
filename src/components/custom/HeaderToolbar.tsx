import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Grid,
   Button as MuiButton,
   Stack,
   Toolbar,
   ToolbarProps,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { spacing } from '@mui/system'
import { backHistory } from 'services/helper'
import { LogsTime } from 'types'
import Actions from '../pages/dashboard/default/Actions'

// Define the type for props that this component accepts
export interface HeaderToolbarProps extends ToolbarProps {
   title?: string
   isVisibleDate: boolean
   handleLogDate?: Function // Function to handle date selection
   handleSearchClick?: Function // Function to handle search button click
   icon?: IconProp
   defaultDate?: boolean
   from?: number
   to?: number
   noBack?: boolean
   actions?: React.ReactNode
}

// Create a styled button component using MuiButton and the spacing utility
const CustomButton = styled(MuiButton)(spacing)

// HeaderToolbar component for displaying a common header with title and optional date picker
const HeaderToolbar = ({
   title,
   isVisibleDate,
   handleLogDate,
   handleSearchClick,
   icon,
   defaultDate,
   from,
   to,
   noBack,
   actions,
   ...props
}: HeaderToolbarProps) => {
   const theme = useTheme()
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))

   return (
      <Toolbar
         variant="dense"
         sx={{
            flexDirection: ['column', 'row'],
            justifyContent: 'space-between',
            gap: 0,
            m: 0,
            px: '0 !important',
            py: '6px',
            ...props.sx,
         }}
      >
         <Grid
            container
            spacing={1}
            alignItems={'center'}
            m={'0px'}
            px={isLgUp ? '0' : '4px'}
            pb={'0px'}
         >
            {title && (
               <Grid
                  item
                  sm={'auto'}
                  xs={12}
                  p={0}
                  m={0}
                  display={'inline-flex'}
                  justifyContent={'center'}
               >
                  {/* Header title and back button */}

                  <CustomButton
                     color="primary"
                     mr={2}
                     p={'.5px 8px .5px 0px'}
                     m={0}
                     sx={{
                        background: 'initial',
                        '&:hover': {
                           background: 'initial',
                        },
                     }}
                     onClick={!noBack ? backHistory : () => ({})} // Handle back button click
                  >
                     {!noBack && (
                        <FontAwesomeIcon
                           icon={faArrowLeft as IconProp}
                           fixedWidth
                           fontSize={18}
                        />
                     )}

                     <Typography variant="h3" textTransform={'capitalize'}>
                        {title}
                     </Typography>
                  </CustomButton>
               </Grid>
            )}
            {actions && actions}
            <Grid item xs />
            {isVisibleDate && (
               <Grid item sm={'auto'} xs={12} pt={'5px!important'}>
                  <Stack direction={['column', null, 'row']} gap={3}>
                     {/* Actions component for handling date selection and search */}
                     <Actions
                        defaultDate={defaultDate}
                        from={from}
                        to={to}
                        time={LogsTime.CUSTOMDATE}
                        autoRefresh={false}
                        setLogDate={handleLogDate} // Pass the handleLogDate function
                        onSearchClick={handleSearchClick} // Pass the handleSearchClick function
                     />
                  </Stack>
               </Grid>
            )}
         </Grid>
      </Toolbar>
   )
}

export default HeaderToolbar
