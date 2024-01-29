import {
   NotificationSeverity,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faBell } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Badge,
   Box,
   Button,
   Dialog,
   DialogContent,
   DialogTitle,
   IconButton,
   List,
   ListItem,
   ListItemAvatar,
   ListItemText,
   Avatar as MuiAvatar,
   Popover as MuiPopover,
   SvgIcon,
   Tooltip,
   Typography,
   useTheme,
} from '@mui/material'
import React, { useRef, useState } from 'react'
import {
   AlertCircle,
   AlertOctagon,
   AlertTriangle,
   Info,
   Server,
} from 'react-feather'
import { useSelector } from 'react-redux'
import { selectAuthNotifications, updateNotifications } from 'redux/authSlice'
import { store } from 'redux/store'
import { NotificationItem } from 'types'
import { v4 as uuidv4 } from 'uuid'
import { renderTimeCell } from '../custom/PortalRenderCells'
import TransitionSlide from '../custom/TransitionSlide'

const Popover = styled(MuiPopover)`
   .MuiPaper-root {
      width: 300px;
      ${(props) => props.theme.shadows[1]};
      border: 1px solid ${(props) => props.theme.palette.divider};
   }
`

const Indicator = styled(Badge)`
   .MuiBadge-badge {
      background: ${(props) => props.theme.header.indicator.background};
      color: ${(props) => props.theme.palette.common.white};
   }
`

const NotificationHeader = styled(Box)`
   text-align: center;
   border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`

interface NotificationProps {
   title: string
   description: string
   Icon: React.ElementType
   severity: NotificationSeverity
   timestamp: any
   details?: boolean
   read?: boolean
}

function Notification({
   title,
   description,
   Icon,
   severity,
   timestamp,
   details,
   read,
}: NotificationProps) {
   const theme = useTheme()
   let background = theme.palette.primary.main
   switch (severity) {
      case NotificationSeverity.ERROR:
         background = theme.palette.error.dark
         break
      case NotificationSeverity.WARNING:
         background = theme.palette.warning.dark
         break
      case NotificationSeverity.ALERT:
         background = theme.palette.secondary.dark
         break
      case NotificationSeverity.INFORMATION:
         background = theme.palette.info.light
         break
      case NotificationSeverity.VERBOSE:
         background = theme.palette.primary.main
         break
      default:
         break
   }
   const Avatar = styled(MuiAvatar)`
      background: ${(props) => background};
   `
   return (
      <ListItem
         divider
         sx={{
            backgroundColor: !read
               ? theme.palette.background.default
               : theme.palette.background.paper,
         }}
      >
         <ListItemAvatar>
            <Avatar>
               <SvgIcon fontSize="small">
                  <Icon />
               </SvgIcon>
            </Avatar>
         </ListItemAvatar>
         <ListItemText
            primary={title}
            primaryTypographyProps={{
               variant: 'subtitle2',
               color: 'textPrimary',
            }}
            secondary={description}
         />
         {details && (
            <ListItemText
               primary={renderTimeCell(timestamp)}
               primaryTypographyProps={{
                  variant: 'caption',
                  color: 'textPrimary',
                  textAlign: 'right',
               }}
            />
         )}
      </ListItem>
   )
}

function NavbarNotificationsDropdown() {
   const notifications = useSelector(selectAuthNotifications)
   const [openHistory, setOpenHistory] = React.useState(false)
   const [keyDate, setKeyDate] = React.useState(0)
   const [Transition, setTransition]: any = React.useState()
   const ref = useRef(null)
   const [isOpen, setOpen] = useState(false)
   const handleOpen = () => {
      if (notifications && notifications.length > 0) {
         setOpen(true)
      }
   }
   const handleClose = () => {
      setOpen(false)
   }
   const handleClickOpen = () => {
      if (notifications && notifications.length > 0) {
         setTransition(TransitionSlide)
         handleClose()
         setOpenHistory(true)
      }
   }
   const handleCloseHistory = async () => {
      if (notifications && notifications.length > 0) {
         const notification_upd = notifications.map(
            (item: NotificationItem) => {
               return { ...item, read: true }
            }
         )
         store.dispatch(updateNotifications(notification_upd))
         const boClient = store.getState().socket.boClient
         const notificationStore = notification_upd.slice(0, 100)
         const uiStats = store.getState().auth.uiState
         boClient &&
            boClient.user.setUiState(
               { uiState: { ...uiStats, notification: notificationStore } },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_SET_UI_STATE_REQ,
                  },
               }
            )
      }
      setKeyDate(keyDate + 1)
      await setTransition(TransitionSlide)
      setOpenHistory(false)
   }
   const theme = useTheme()

   return (
      <React.Fragment>
         <Tooltip title="Notifications">
            <IconButton
               color="inherit"
               ref={ref}
               onClick={handleOpen}
               size="medium"
            >
               <Indicator
                  badgeContent={
                     notifications && notifications.length > 0
                        ? notifications.filter(
                             (item: NotificationItem) => !item.read
                          ).length
                        : null
                  }
               >
                  <FontAwesomeIcon
                     icon={faBell as IconProp}
                     fontSize={'14px'}
                     color={theme.palette.info.contrastText}
                     fixedWidth
                  />
               </Indicator>
            </IconButton>
         </Tooltip>
         <Popover
            anchorOrigin={{
               vertical: 'bottom',
               horizontal: 'center',
            }}
            anchorEl={ref.current}
            onClose={handleClose}
            open={isOpen}
         >
            {notifications &&
               notifications.length > 0 &&
               notifications.filter((item: NotificationItem) => !item.read)
                  .length > 0 && (
                  <NotificationHeader p={2}>
                     <Typography variant="subtitle1" color="textPrimary">
                        {
                           notifications.filter(
                              (item: NotificationItem) => !item.read
                           ).length
                        }{' '}
                        New Notifications
                     </Typography>
                  </NotificationHeader>
               )}
            {notifications && notifications.length > 0 && (
               <React.Fragment>
                  <List disablePadding>
                     {notifications.slice(0, 5).map((qry: NotificationItem) => {
                        let icon = Server
                        switch (qry.severity) {
                           case NotificationSeverity.ERROR:
                              icon = AlertCircle
                              break
                           case NotificationSeverity.WARNING:
                              icon = AlertTriangle
                              break
                           case NotificationSeverity.ALERT:
                              icon = AlertOctagon
                              break
                           case NotificationSeverity.INFORMATION:
                              icon = Info
                              break
                           case NotificationSeverity.VERBOSE:
                              icon = Server
                              break
                           default:
                              break
                        }
                        return (
                           <Notification
                              key={qry.id}
                              title={qry.title}
                              description={qry.data}
                              Icon={icon}
                              read={qry.read}
                              severity={qry.severity}
                              timestamp={qry.timestamp}
                           />
                        )
                     })}
                  </List>
                  <Box p={1} display="flex" justifyContent="center">
                     <Button onClick={handleClickOpen} size="small">
                        Show all notifications
                     </Button>
                  </Box>
               </React.Fragment>
            )}
         </Popover>
         <Dialog
            open={openHistory}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
            key={keyDate}
            onClose={handleCloseHistory}
            aria-describedby="alert-dialog-slide-description"
            sx={{
               '.MuiDialog-container': {
                  alignItems: 'end',
                  justifyContent: 'end',
               },
               '.MuiPaper-root': {
                  width: '600px',
                  padding: '25px',
               },
            }}
         >
            <DialogTitle variant="h3" gutterBottom display="inline" m={0}>
               Notifications
            </DialogTitle>
            <DialogContent
               sx={{
                  p: 0,
               }}
            >
               <List disablePadding>
                  {notifications &&
                     notifications.map((qry: NotificationItem) => {
                        let icon = Server
                        switch (qry.severity) {
                           case NotificationSeverity.ERROR:
                              icon = AlertCircle
                              break
                           case NotificationSeverity.WARNING:
                              icon = AlertTriangle
                              break
                           case NotificationSeverity.ALERT:
                              icon = AlertOctagon
                              break
                           case NotificationSeverity.INFORMATION:
                              icon = Info
                              break
                           case NotificationSeverity.VERBOSE:
                              icon = Server
                              break
                           default:
                              break
                        }
                        return (
                           <Notification
                              key={qry.id}
                              title={qry.title}
                              description={qry.data}
                              Icon={icon}
                              severity={qry.severity}
                              timestamp={qry.timestamp}
                              read={qry.read}
                              details={true}
                           />
                        )
                     })}
               </List>
            </DialogContent>
         </Dialog>
      </React.Fragment>
   )
}

export default NavbarNotificationsDropdown
