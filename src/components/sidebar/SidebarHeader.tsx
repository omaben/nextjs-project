import styled from '@emotion/styled'

import { Avatar, Badge, Chip, Grid, Typography, useTheme } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { darkPurple } from 'colors'
import useAuth from 'hooks/useAuth'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUser } from 'redux/slices/user'
import { BadgeRole } from 'services/globalFunctions'
import { faUser } from '@fortawesome/pro-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

const FooterText = styled(Typography)`
   white-space: nowrap;
   overflow: hidden;
   text-align
   text-overflow: ellipsis;
`

const HeaderBadge = styled(Badge)`
   span {
      background-color: ${(props) =>
         props.theme.sidebar.footer.online.background};
      border: 1.5px solid #394143;
      height: 12px;
      width: 12px;
      border-radius: 50%;
   }
`
const BadgeVersion = styled(Chip)`
   height: 20px;
   background: transparent;
   z-index: 1;
   span.MuiChip-label,
   span.MuiChip-label:hover {
      font-size: 11px;
      cursor: pointer;
      color: #746d89;
      padding-left: ${(props) => props.theme.spacing(2)};
      padding-right: ${(props) => props.theme.spacing(2)};
   }
   position: absolute;
   top: 5px;
   left: 5px;
`

const SidebarHeader = ({ ...rest }) => {
   const router = useRouter()
   const user = useSelector(getUser) as any
   const { signOut } = useAuth()
   const handleSignOut = async () => {
      await signOut()
   }
   const theme = useTheme()
   const [currentTime, setCurrentTime] = useState(moment().format('HH:mm:ss'))

   useEffect(() => {
      // Update the current time every second
      const intervalId = setInterval(() => {
         setCurrentTime(moment().format('HH:mm:ss'))
      }, 1000)

      // Clean up the interval when the component unmounts
      return () => clearInterval(intervalId)
   }, [])
   return (
      <Grid
         container
         spacing={0}
         direction="column"
         alignItems="center"
         justifyContent="center"
         height={'142px'}
         sx={{
            background: '#110C20',
         }}
         {...rest}
      >
         <Grid
            container
            sx={{ cursor: 'pointer' }}
            spacing={2}
            mb={2}
            textAlign={'center'}
         >
            <Grid item md={12} sm={12} width={'100%'}>
               <HeaderBadge
                  overlap="circular"
                  anchorOrigin={{
                     vertical: 'bottom',
                     horizontal: 'right',
                  }}
                  variant="dot"
               >
                  {!!user && (
                     <Avatar
                        alt={user.username}
                        src={user.avatar}
                        sx={{
                           padding: '3px',
                           border: ' 1px solid #5C5474',
                           strokeWidth: '1px',
                           stroke: '#5C5474',
                           width: 60,
                           height: 60,
                        }}
                     />
                  )}
                  {!user && <FontAwesomeIcon icon={faUser as IconProp} />}
               </HeaderBadge>
            </Grid>
         </Grid>
         <Grid
            container
            sx={{ cursor: 'pointer' }}
            spacing={1}
            mb={2}
            textAlign={'center'}
         >
            <Grid item md={12} sm={12} width={'100%'}>
               {!!user && (
                  <>
                     <FooterText
                        variant="bodySmallBold"
                        fontFamily="Nunito Sans SemiBold"
                        textAlign={'center'}
                        color={darkPurple[12]}
                        fontSize={'14px !important'}
                        textTransform={'capitalize'}
                     >
                        {user.username}
                     </FooterText>
                  </>
               )}
            </Grid>
            <Grid item mt={0} md={12} sm={12} width={'100%'}>
               <BadgeRole label={user?.scope} />
               <BadgeVersion label={currentTime} />
            </Grid>
         </Grid>
      </Grid>
   )
}

export default SidebarHeader
