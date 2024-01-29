import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Grid,
   Button as MuiButton,
   Toolbar,
   ToolbarProps,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { spacing } from '@mui/system'
import PortalFilterChips, { FilterChip } from './PortalFilterChips'

// Define the type for props that this component accepts
export interface HeaderToolbarProps extends ToolbarProps {
   title?: string
   icon?: IconProp
   filterChips?: FilterChip[] // List of filter chips to display
   handleDeleteChip?: Function // Function to render additional filters button
   actions?: React.ReactNode
}

// Create a styled button component using MuiButton and the spacing utility
const CustomButton = styled(MuiButton)(spacing)

// HeaderToolbar component for displaying a common header with title and optional date picker
const HeaderTitleToolbar = ({
   title,
   icon,
   filterChips,
   handleDeleteChip,
   actions,
   ...props
}: HeaderToolbarProps) => {
   const theme = useTheme()
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))

   return (
      <Toolbar
         variant="dense"
         sx={{
            flexDirection: ['row', 'row'],
            justifyContent: 'space-between',
            alignContent: 'center',
            height: '38px',
            minHeight: '28px',
            gap: 2,
            pt: '1px',
            m: 0,
            ...props.sx,
         }}
      >
         <Grid
            container
            alignItems={'center'}
            spacing={1}
            mb={'0px'}
            px={isLgUp ? '12px' : '0px'}
            py={'0'}
         >
            <Grid item>
               {/* Header title and back button */}
               <Typography variant="h3" textTransform={'capitalize'}>
                  {icon && <FontAwesomeIcon icon={icon} fixedWidth />}
                  {title}
               </Typography>
            </Grid>
            {title && <Grid item xs />}
            {filterChips && (
               <PortalFilterChips
                  chips={filterChips}
                  handleDelete={handleDeleteChip}
               />
            )}
            {actions && actions}
         </Grid>
      </Toolbar>
   )
}

export default HeaderTitleToolbar
