import { UserPermissionEvent } from '@alienbackoffice/back-front'
import {
   Button,
   Grid,
   Stack,
   Toolbar,
   ToolbarProps,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { darkPurple } from 'colors'
import { backHistory } from 'services/helper'
import { hasDetailsPermission } from 'services/permissionHandler'
import { IconArrowLeft } from '../icons'
import OpList from '../pages/dashboard/crash/list-operators'
import BrandsFilter from '../pages/dashboard/default/brands'
// Define the type for props that this component accepts
export interface OperatorsBrandsProps extends ToolbarProps {
   title?: string
   operatorFilter?: boolean
   brandFilter?: boolean
   filter?: boolean
   handleFilter?: Function
   backMethods?: Function
   background?: string
   actions?: React.ReactNode
   fullWidthBlock?: boolean
}

const CustomOperatorsBrandsToolbar = ({
   title,
   operatorFilter,
   brandFilter,
   filter,
   handleFilter,
   background,
   actions,
   fullWidthBlock,
   backMethods,
   ...props
}: OperatorsBrandsProps) => {
   const theme = useTheme()
   const matches = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const minMobile = useMediaQuery(theme.breakpoints.up(400))

   return (
      <Toolbar
         variant="dense"
         sx={{
            flexDirection: ['row', 'row'],
            justifyContent: 'space-between',
            alignContent: 'center',
            height: matches ? '44px' : '38px',
            minHeight: '38px',
            gap: 2,
            pt: '0',
            m: 0,
            borderTop: `1px solid ${darkPurple[2]}`,
            px: '8px',
            paddingBottom: '1px',
            background: (props) =>
               background ? background : props.palette.primary.main,
            ...props.sx,
         }}
      >
         <Grid
            container
            px={isLgUp ? '12px' : '4px'}
            sx={{ width: '100%' }}
            alignItems="center"
            justifyItems={'center'}
            spacing={1}
         >
            {title && (
               <Grid item>
                  <Button
                     onClick={() =>
                        backMethods ? backMethods() : backHistory()
                     }
                     // fullWidth={matches ? false : true}
                     sx={{
                        textAlign: 'left',
                        justifyContent: 'left',
                        minWidth: 'max-content',
                     }}
                  >
                     <Stack
                        direction="row"
                        alignItems="center"
                        gap={2}
                        textAlign={'left'}
                        sx={{
                           svg: {
                              width: '12px',
                              path: {
                                 fill: theme.palette.primary.contrastText,
                              },
                           },
                        }}
                     >
                        <IconArrowLeft />
                     </Stack>
                     {((actions && minMobile) ||
                        minMobile ||
                        (!minMobile && !actions)) && (
                        <Typography
                           color={darkPurple[12]}
                           ml={2}
                           textTransform={'capitalize'}
                        >
                           {title}
                        </Typography>
                     )}
                  </Button>
               </Grid>
            )}
            <Grid item xs></Grid>
            {operatorFilter &&
               hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_OPERATOR_LIST_REQ
               ) && (
                  <Grid item>
                     <OpList />
                  </Grid>
               )}
            {brandFilter &&
               hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ
               ) && (
                  <Grid item>
                     <BrandsFilter />
                  </Grid>
               )}
            {actions &&
               (fullWidthBlock ? (
                  <Grid container alignItems="center" spacing={1} mt={'8px'}>
                     {actions}
                  </Grid>
               ) : (
                  actions
               ))}
            {filter && handleFilter && <Grid item> {handleFilter()}</Grid>}
         </Grid>
      </Toolbar>
   )
}

export default CustomOperatorsBrandsToolbar
