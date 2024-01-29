import CustomLoader from '@/components/custom/CustomLoader'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import { useGetPlayerQuery } from '@/components/data/players/lib/hooks/queries'
import RelatedAccounts from '@/components/data/players/player-related-accounts'
import { Player } from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faBan,
   faCaretLeft,
   faMicroscope,
   faUsersBetweenLines,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Avatar,
   Box,
   Grid,
   Button as MuiButton,
   Divider as MuiDivider,
   Toolbar,
   Tooltip,
   Typography,
} from '@mui/material'
import { blue } from '@mui/material/colors'
import { Stack, spacing } from '@mui/system'
import { secondary } from 'colors'
import moment from 'moment'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { selectAuthOperator, selectAuthPlayerDetails } from 'redux/authSlice'
import { backHistory } from 'services/helper'
import createTheme from 'theme'
import { THEMES } from '../../constants'
import DashboardLayout from '../../layouts/Dashboard'

const Button = styled(MuiButton)(spacing)
const Divider = styled(MuiDivider)(spacing)

function RelatedAccountsList() {
   const router = useRouter()
   const { id }: any = router.query
   const opId = useSelector(selectAuthOperator)
   const [refresh, setRefresh] = React.useState(0)
   const data = useSelector(selectAuthPlayerDetails) as Player
   const [ignore, setIgnore] = React.useState(false)

   useGetPlayerQuery({
      playerId: id,
      opId: opId,
      key: refresh,
   })

   useEffect(() => {
      if (!ignore) {
         setTimeout(() => {
            setIgnore(true)
         }, 1000)
      }
   })

   useEffect(() => {
      if (!ignore) {
         setTimeout(() => {
            setIgnore(true)
         }, 1000)
      }
   }, [data])

   return (
      <React.Fragment key={refresh}>
         <Helmet title="Related Accounts" />
         <Toolbar
            variant="dense"
            sx={{
               flexDirection: ['column', 'row'],
               justifyContent: 'space-between',
               gap: 2,
               mb: 2,
            }}
         >
            <Grid container alignItems="center">
               <Grid item sm={'auto'} xs={12} mb={2}>
                  <Typography variant="h3">
                     <Button
                        color="primary"
                        variant="contained"
                        mr={2}
                        p={'.5px 8px .5px 0px'}
                        mb={0.5}
                        onClick={backHistory}
                     >
                        <FontAwesomeIcon
                           icon={faCaretLeft as IconProp}
                           fixedWidth
                           fontSize={18}
                        />
                        Back
                     </Button>{' '}
                     <FontAwesomeIcon
                        icon={faUsersBetweenLines as IconProp}
                        fixedWidth
                     />{' '}
                     Related Accounts
                  </Typography>
               </Grid>
               <Grid item xs />
            </Grid>
         </Toolbar>
         <Divider my={2} />
         {ignore && id && data ? (
            <>
               {data && (
                  <Grid container alignItems="center">
                     <Grid>
                        <Stack
                           direction={['column', null, 'row']}
                           justifyContent={['center', null, 'space-between']}
                           alignItems="center"
                           gap={3}
                        >
                           <Stack
                              alignItems="center"
                              justifyContent="center"
                              direction={['column', 'row']}
                              gap={4}
                              my={2}
                           >
                              <Stack
                                 alignItems="center"
                                 justifyContent="center"
                                 direction={'row'}
                                 gap={4}
                                 my={2}
                              >
                                 <Stack
                                    alignItems="center"
                                    direction="row"
                                    gap={2}
                                    position={'relative'}
                                 >
                                    <Avatar
                                       sx={{
                                          width: [40, 50, 65],
                                          height: [40, 50, 65],
                                       }}
                                    />
                                    {data?.isBlocked && (
                                       <Box
                                          sx={{
                                             position: 'absolute',
                                             right: 0,
                                             bottom: 0,
                                          }}
                                       >
                                          <FontAwesomeIcon
                                             icon={faBan as IconProp}
                                             color={
                                                createTheme(THEMES.DEFAULT)
                                                   .palette.error.main
                                             }
                                          />
                                       </Box>
                                    )}
                                 </Stack>
                                 <Stack>
                                    <Grid
                                       container
                                       direction="row"
                                       alignItems="center"
                                       mb={2}
                                       spacing={2}
                                    >
                                       <Grid item mr={1}>
                                          <Typography variant="bodySmallBold">
                                             Player ID :
                                          </Typography>
                                       </Grid>
                                       {data.isTest && (
                                          <Grid item>
                                             <Tooltip
                                                title={'Test'}
                                                placement="left"
                                             >
                                                <FontAwesomeIcon
                                                   icon={
                                                      faMicroscope as IconProp
                                                   }
                                                   color={
                                                      createTheme(
                                                         THEMES.DEFAULT
                                                      ).palette.warning.main
                                                   }
                                                />
                                             </Tooltip>
                                          </Grid>
                                       )}

                                       <Grid item>
                                          <PortalCopyValue
                                             value={data?.playerId}
                                             color={secondary[6]}
                                          />
                                       </Grid>
                                    </Grid>
                                    {data.nicknameIsSet && data?.nickname && (
                                       <Grid
                                          container
                                          direction="row"
                                          alignItems="center"
                                          mb={2}
                                          spacing={2}
                                       >
                                          <Grid item mr={1}>
                                             <Typography variant="bodySmallBold">
                                                Nickname :
                                             </Typography>
                                          </Grid>
                                          <Grid item>
                                             <PortalCopyValue
                                                sx={{
                                                   maxWidth: '250px',
                                                   overflow: 'hidden',
                                                   whiteSpace: 'nowrap',
                                                   textOverflow: 'ellipsis',
                                                }}
                                                color={blue[500]}
                                                value={
                                                   data.nicknameIsSet
                                                      ? data?.nickname
                                                      : 'NoName'
                                                }
                                             />
                                          </Grid>
                                       </Grid>
                                    )}
                                    <Typography
                                       whiteSpace="nowrap"
                                       variant="caption"
                                       lineHeight={1}
                                    >
                                       Last Activity:{' '}
                                       {moment(data?.updatedAt).fromNow()}
                                    </Typography>
                                 </Stack>
                              </Stack>
                           </Stack>
                        </Stack>
                     </Grid>
                     <Grid item xs />
                  </Grid>
               )}

               <Grid item xs={12}>
                  <Box sx={{ flexGrow: 1, p: 3, paddingTop: 0 }}>
                     {data && <RelatedAccounts data={data} />}
                  </Box>
               </Grid>
            </>
         ) : ignore && id && data === null ? (
            <></>
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

RelatedAccountsList.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Related Accounts">{page}</DashboardLayout>
}

export default RelatedAccountsList
