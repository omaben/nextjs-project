import {
   Grid,
   Stack,
   Toolbar,
   ToolbarProps,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import React from 'react'
import PortalFilterChips, { FilterChip } from './PortalFilterChips'

/**
 * Props for HeaderFilterToolbar component
 */
export interface HeaderFilterToolbarProps extends ToolbarProps {
   filterChips?: FilterChip[] // List of filter chips to display
   moreFiltersBtn?: Function // Function to render additional filters button
   handleDeleteChip?: Function // Function to handle chip deletion
   actions?: React.ReactNode
}

/**
 * HeaderFilterToolbar component displays filter chips and additional filters button.
 * @param {HeaderFilterToolbarProps} props - Component properties
 */
const HeaderFilterToolbar = ({
   filterChips,
   moreFiltersBtn,
   handleDeleteChip,
   actions,
   ...props
}: HeaderFilterToolbarProps) => {
   // Access the MUI theme and check if the screen size is desktop
   const theme = useTheme()
   const isDesktopSize = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   return (
      <Toolbar
         variant="dense"
         sx={{
            flexDirection: ['column', 'row'],
            justifyContent: 'space-between',
            height: '38px',
            minHeight: '38px',
            gap: 2,
            mb: isDesktopSize ? 0 : '6px',
            px: '4px',
            background: (props) =>
               isDesktopSize ? 'transparent' : props.palette.secondary.dark,
            ...props.sx,
         }}
      >
         <Grid
            container
            alignItems={'center'}
            spacing={1}
            px={isLgUp ? '12px' : '4px'}
            py={'0'}
            height={'100%'}
            m={0}
            sx={{
               '.MuiGrid-item': {
                  pt: 0,
               },
            }}
         >
            {actions && actions}

            {/* Grid item for controlling visibility on all screen sizes */}
            {moreFiltersBtn && (
               <>
                  <Grid item xs></Grid>
                  <Grid item>
                     {/* Render the moreFiltersBtn when not on desktop */}
                     {!isDesktopSize && moreFiltersBtn()}
                  </Grid>
               </>
            )}

            {/* Grid item for controlling visibility on all screen sizes */}
            {isDesktopSize && filterChips && (
               <Grid item xs={12} md>
                  <Stack
                     direction="row"
                     justifyContent={['flex-start', null, 'flex-end']}
                     gap={1}
                  >
                     {/* Render the filter chips using PortalFilterChips component */}
                     <PortalFilterChips
                        chips={filterChips}
                        handleDelete={handleDeleteChip}
                     />
                     {/* Render the moreFiltersBtn when on desktop */}
                     {moreFiltersBtn && moreFiltersBtn()}
                  </Stack>
               </Grid>
            )}
         </Grid>
      </Toolbar>
   )
}

export default HeaderFilterToolbar
