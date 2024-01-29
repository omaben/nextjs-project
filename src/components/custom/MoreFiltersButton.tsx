import { useTheme } from '@emotion/react'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faBarsFilter,
   faRectangleXmark,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Button,
   ButtonProps,
   Dialog,
   DialogActions,
   DialogContent,
   Grid,
   DialogProps as MuiDialogProps,
   Typography,
   useMediaQuery,
} from '@mui/material'
import { darkPurple } from 'colors'
import { FormEvent } from 'react'

type CloseReason = 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick'

interface FilterDialogProps extends MuiDialogProps {
   onClose: (reason: CloseReason) => void
   onSearch: () => void
}

const MoreFiltersButton = (props: ButtonProps & FilterDialogProps) => {
   const theme = useTheme()
   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()
      props.onSearch()
   }

   return (
      <>
         <Button
            onClick={props.onClick}
            color="primary"
            variant={
               useMediaQuery(theme.breakpoints.up('md')) ? 'outlined' : 'text'
            }
            sx={{
               p: useMediaQuery(theme.breakpoints.up('md'))
                  ? '4px 8px 4px 8px'
                  : 0,
               height: '28px',
               borderRadius: '8px',
               justifyContent: useMediaQuery(theme.breakpoints.up('md'))
                  ? 'initial'
                  : 'end',
               minWidth: 'auto !important',
               borderColor: `${darkPurple[12]} !important`,
               svg: {
                  width: '16px !important',
               },
               gap: '10px',
            }}
         >
            <FontAwesomeIcon
               icon={faBarsFilter as IconProp}
               fixedWidth
               fontSize={'16px'}
               color={
                  useMediaQuery(theme.breakpoints.up('md'))
                     ? darkPurple[12]
                     : darkPurple[12]
               }
            />
            {useMediaQuery(theme.breakpoints.up('md')) && (
               <Typography
                  component="p"
                  variant="button"
                  fontFamily={'Nunito Sans SemiBold'}
                  fontSize={'14px'}
                  whiteSpace="nowrap"
                  color={darkPurple[12]}
               >
                  Filter
               </Typography>
            )}
         </Button>
         <Dialog
            open={props.open}
            TransitionComponent={props.TransitionComponent}
            keepMounted
            onClose={props.onClose}
            sx={{ '.MuiPaper-root': { p: '12px 4px!important' } }}
            fullScreen
            // fullScreen={isDesktop ? true : false}
            aria-describedby="alert-dialog-slide-description"
         >
            <Grid
               container
               direction="row"
               alignItems="center"
               p={'8px'}
               spacing={0}
               sx={{
                  svg: {
                     fontSize: '16px',
                     height: '16px',
                     cursor: 'pointer',
                  },
               }}
            >
               <Grid item>
                  <Typography variant="h5" gutterBottom display="inline" mb={0}>
                     More Filters
                  </Typography>
               </Grid>
               <Grid item xs></Grid>
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={() => props.onClose('closeButtonClick')}
                     cursor={'pointer'}
                  />
               </Grid>
            </Grid>
            <DialogContent sx={{ p: 1 }}>
               <form onSubmit={handleSubmit}>
                  {props.children}
                  <DialogActions sx={{ justifyContent: 'center' }}>
                     <Button
                        onClick={() => props.onClose('closeButtonClick')}
                        color="secondary"
                        variant="outlined"
                        sx={{ height: 32, borderColor: darkPurple[10] }}
                     >
                        Cancel
                     </Button>
                     <Button
                        type="submit"
                        onClick={props.onSearch}
                        color="secondary"
                        variant="contained"
                        sx={{ height: 32 }}
                     >
                        Search
                     </Button>
                  </DialogActions>
               </form>
            </DialogContent>
         </Dialog>
      </>
   )
}

export default MoreFiltersButton
