import {
   Avatar,
   Box,
   Grid,
   Stack,
   Tooltip,
   tooltipClasses,
   TooltipProps,
   Typography,
   useTheme,
   Zoom,
} from '@mui/material'
import { primary, secondary } from 'colors'

import {
   IntegrationType,
   Operator,
   Player,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import Balance from '@mui/icons-material/Balance'
import Email from '@mui/icons-material/Email'
import Phone from '@mui/icons-material/Phone'
import Telegram from '@mui/icons-material/Telegram'
import Link from 'next/link'
import numeral from 'numeral'
import React, { FC, ReactElement, useEffect } from 'react'
import { User } from 'react-feather'
import { useSelector } from 'react-redux'
import {
   selectAuthCurrentOperator,
   selectAuthPlayerDetails,
   selectAuthRelatedPlayerDetails,
} from 'redux/authSlice'
import { store } from 'redux/store'
import { v4 as uuidv4 } from 'uuid'
import PortalCopyValue from './PortalCopyValue'

interface PortalPlayerTooltipProps {
   player: { playerId: string; displayName: string; player?: Player }
   children: ReactElement
}

interface PortalRelatedPlayerTooltipProps {
   player: {
      playerId: string
      displayName: string
      player?: Player
      opId?: string
   }
   children: ReactElement
}

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
   <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
   [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      boxShadow: theme.shadows[6],
   },
}))

const PortalPlayerTooltip = (props: PortalPlayerTooltipProps) => {
   return (
      <CustomTooltip
         title={<PlayerDetails {...props.player} />}
         placement="right-start"
         enterDelay={500}
         TransitionComponent={Zoom}
      >
         {props.children}
      </CustomTooltip>
   )
}

export const PortalRelatedPlayerTooltip = (
   props: PortalRelatedPlayerTooltipProps
) => {
   return (
      <CustomTooltip
         title={<PlayerDetails {...props.player} />}
         placement="right-start"
         enterDelay={500}
         TransitionComponent={Zoom}
      >
         {props.children}
      </CustomTooltip>
   )
}
function delay(ms: number) {
   return new Promise((resolve) => setTimeout(resolve, ms))
}
const PlayerDetails: FC<{
   playerId: string
   displayName: string
   player?: Player
   opId?: string
}> = (props) => {
   const { playerId, displayName } = props
   const currentOpId = useSelector(selectAuthCurrentOperator) as Operator
   const playerRelatedData = useSelector(
      selectAuthRelatedPlayerDetails
   ) as Player
   const playerDetailsData = useSelector(selectAuthPlayerDetails) as Player
   const [player, setPlayer] = React.useState(
      props.opId ? playerRelatedData : playerDetailsData
   )
   const boClient = store.getState().socket.boClient
   const opId = props.opId || props.player?.opId || currentOpId.opId

   useEffect(() => {
      setPlayer(props.opId ? playerRelatedData : playerDetailsData)
   }, [playerRelatedData, playerDetailsData])
   // useEffect(() => {
   //    if (opId && player?.playerId !== playerId) {
   //       const fetchData = async () => {
   //          console.log(new Date().getMilliseconds())
   //          await delay(800)
   //          boClient?.player.getPlayer(
   //             { playerId: playerId, opId: opId },
   //             {
   //                uuid: uuidv4(),
   //                meta: {
   //                   type: props.opId ? 'relatedDetails' : 'details',
   //                   ts: new Date(),
   //                   sessionId: sessionStorage.getItem('sessionId'),
   //                   event: UserPermissionEvent.BACKOFFICE_GET_PLAYER_REQ,
   //                },
   //             }
   //          )
   //       }

   //       // Call the async function
   //       fetchData()
   //    }
   // }, [playerId, opId])

   useEffect(() => {
      let cursorTimer: number
      const fetchData = async () => {
         if (opId && player?.playerId !== playerId) {
            boClient?.player.getPlayer(
               { playerId: playerId, opId: opId },
               {
                  uuid: uuidv4(),
                  meta: {
                     type: props.opId ? 'relatedDetails' : 'details',
                     ts: new Date(),
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GET_PLAYER_REQ,
                  },
               }
            )
         }
      }
      const handleMouseMove = () => {
         clearTimeout(cursorTimer) // Clear the previous timer
         // Set a new timer to detect cursor stop after a certain delay (e.g., 800ms)
         cursorTimer = setTimeout(() => {
            fetchData() // Cursor has stopped
         }, 800) as any
      }

      document.addEventListener('mousemove', handleMouseMove)

      return () => {
         document.removeEventListener('mousemove', handleMouseMove)
         clearTimeout(cursorTimer) // Clear the timer when the component unmounts
      }
   }, [playerId, opId])
   const theme = useTheme()
   const AboutIcon = styled.span`
      display: flex;
      padding-right: ${(props) => props.theme.spacing(2)};

      svg {
         width: 14px;
         height: 14px;
      }
   `

   const formatSmall = (val: number, format: string) => {
      if (val > 0 && val < 1e-6) {
         return numeral(val * 1000000)
            .format(format)
            .replace('0.0', '0.0000000')
      }
      return numeral(val).format(format, (n) => (Math.floor(n) * 100) / 100)
   }

   const format = player?.activeCurrency === 'IRT' ? '0,00' : '0,00.[00]'

   const activeBalance =
      (player &&
         player?.wallet?.byCurrency &&
         player.activeCurrency &&
         player.wallet?.byCurrency[player.activeCurrency] &&
         player.wallet?.byCurrency[player.activeCurrency].balance) ||
      0
   const balance = `${player?.activeCurrency} ${formatSmall(
      activeBalance,
      format
   )} ($${
      player ? formatSmall(player?.wallet?.inUSD?.balance, '0,00.[00]') : 0
   })`
   const operator = store.getState().auth.operatorData as Operator

   return (
      <Stack>
         <Stack direction="row" gap={2} alignItems="flex-start">
            <Avatar sx={{ width: 36, height: 36 }} />
            <Stack>
               <Typography
                  variant="caption"
                  sx={{
                     wordBreak: 'break-all',
                  }}
               >
                  {playerId}
               </Typography>

               {displayName && player && player.playerId === playerId && (
                  <Grid
                     container
                     direction="row"
                     alignItems="center"
                     mb={2}
                     spacing={0}
                  >
                     <Grid
                        item
                        sx={{
                           svg: {
                              color: theme.palette.success.main,
                           },
                        }}
                     >
                        <AboutIcon>
                           <User />
                        </AboutIcon>
                     </Grid>
                     <Grid item mr={1}>
                        <Typography variant="bodySmallBold">
                           Nickname :
                        </Typography>
                     </Grid>
                     <Grid item>
                        <PortalCopyValue
                           value={
                              props.opId && player?.nickname
                                 ? player?.nickname
                                 : displayName
                           }
                           color={secondary[6]}
                        />
                     </Grid>
                  </Grid>
               )}
               {player &&
                  player.playerId === playerId &&
                  player?.profile?.email && (
                     <Grid
                        container
                        direction="row"
                        alignItems="center"
                        mb={2}
                        spacing={0}
                     >
                        <Grid
                           item
                           sx={{
                              svg: {
                                 color: player.profile?.email.verified
                                    ? theme.palette.success.main
                                    : primary[5],
                              },
                           }}
                        >
                           <AboutIcon>
                              <Email />
                           </AboutIcon>
                        </Grid>
                        <Grid item mr={1}>
                           <Typography variant="bodySmallBold">
                              Email :
                           </Typography>
                        </Grid>
                        <Grid item>
                           <PortalCopyValue
                              value={player.profile?.email.address}
                              color={secondary[6]}
                           />
                        </Grid>
                     </Grid>
                  )}
               {player &&
                  player.playerId === playerId &&
                  player.profile?.phone && (
                     <Grid
                        container
                        direction="row"
                        alignItems="center"
                        mb={2}
                        spacing={0}
                     >
                        <Grid
                           item
                           sx={{
                              svg: {
                                 color: player.profile?.phone.verified
                                    ? theme.palette.success.main
                                    : primary[5],
                              },
                           }}
                        >
                           <AboutIcon>
                              <Phone />
                           </AboutIcon>
                        </Grid>
                        <Grid item mr={1}>
                           <Typography variant="bodySmallBold">
                              Phone Number :
                           </Typography>
                        </Grid>
                        <Grid item>
                           <PortalCopyValue
                              value={player.profile?.phone.number}
                              color={secondary[6]}
                           />
                        </Grid>
                     </Grid>
                  )}
               {player &&
                  player.playerId === playerId &&
                  player.profile?.telegram && (
                     <Grid
                        container
                        direction="row"
                        alignItems="center"
                        mb={2}
                        spacing={0}
                     >
                        <Grid
                           item
                           sx={{
                              svg: {
                                 color: player.profile?.telegram.verified
                                    ? theme.palette.success.main
                                    : primary[5],
                              },
                           }}
                        >
                           <AboutIcon>
                              <Telegram />
                           </AboutIcon>
                        </Grid>
                        <Grid item mr={1}>
                           <Typography variant="bodySmallBold">
                              Telegram Id :
                           </Typography>
                        </Grid>
                        <Grid item>
                           <PortalCopyValue
                              value={player.profile?.telegram.telegramId}
                              color={secondary[6]}
                           />
                        </Grid>
                     </Grid>
                  )}
               {operator?.integrationType ===
                  IntegrationType.ALIEN_STANDALONE &&
                  player &&
                  player.playerId === playerId &&
                  player.wallet?.inUSD && (
                     <Grid container direction="row" alignItems="center" mb={2}>
                        <Grid
                           item
                           sx={{
                              svg: {
                                 color: primary[5],
                              },
                           }}
                        >
                           <AboutIcon>
                              <Balance />
                           </AboutIcon>
                        </Grid>
                        <Grid item mr={1}>
                           <Typography variant="bodySmallBold">
                              Balance :
                           </Typography>
                        </Grid>
                        <Grid item>
                           <Typography
                              variant="bodySmallBold"
                              color={
                                 player.wallet?.inUSD.balance > 0
                                    ? theme.palette.success.main
                                    : player.wallet?.inUSD.balance === 0
                                    ? theme.palette.grey[500]
                                    : theme.palette.error.main
                              }
                           >
                              {balance}
                           </Typography>
                        </Grid>
                     </Grid>
                  )}
            </Stack>
         </Stack>
         {player && player.playerId === playerId && (
            <Box
               textAlign="right"
               mt={2}
               sx={{ 'a:hover': { color: `${secondary[8]} !important` } }}
            >
               <Link
                  href={`/players/details?id=${playerId}`}
                  style={{
                     color: secondary[6],
                     textDecoration: 'none',
                  }}
               >
                  View More Details
               </Link>
            </Box>
         )}
      </Stack>
   )
}

export default PortalPlayerTooltip
