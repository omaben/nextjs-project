import CustomLoader from '@/components/custom/CustomLoader'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import { Configs } from '@/components/data/games/edit-configs'
import {
   useEditGameMutation,
   useGetGameListQuery,
} from '@/components/data/games/lib/hooks/queries'
import { EditGameDto, Game, User, UserScope } from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faCaretLeft, faDice } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
   Avatar,
   Box,
   Grid,
   Button as MuiButton,
   Divider as MuiDivider,
   Tab,
   Toolbar,
   Typography
} from '@mui/material'
import { blue } from '@mui/material/colors'
import { Stack, spacing } from '@mui/system'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import JSONInput from 'react-json-editor-ajrm'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   deleteBackHistory,
   saveBackButton,
   selectAuthBackHistory,
   selectAuthGamesList,
   selectAuthUser,
} from 'redux/authSlice'
import { store } from 'redux/store'
import { dark_vscode_tribute, localeEn } from 'types'
import DashboardLayout from '../../layouts/Dashboard'
const Divider = styled(MuiDivider)(spacing)
const Button = styled(MuiButton)(spacing)

function GameV2Details() {
   const router = useRouter()
   const { id }: any = router.query
   const [value, setValue] = React.useState('config')
   const handleChangeTabs = (event: React.SyntheticEvent, newValue: string) => {
      event.preventDefault()
      setValue(newValue)
   }
   useGetGameListQuery({ gameId: id })
   const data = useSelector(selectAuthGamesList)
   const user = useSelector(selectAuthUser) as User
   const [extraData, setExtraData] = React.useState([] as any)
   const [extraDataError, setExtraDataError] = React.useState(false)
   const UpdateExtraData = (data: { jsObject: {}; error: any }) => {
      setExtraDataError(data.error)
      setExtraData(data.jsObject as Game)
   }
   const { mutate } = useEditGameMutation({
      onSuccess: (data) => {
         toast.success('You Edit Game successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })
   const handleSubmit = React.useCallback(
      (dto: EditGameDto) => {
         mutate({ dto: dto })
      },
      [mutate]
   )
   const [ignore, setIgnore] = React.useState(false)

   useEffect(() => {
      if (!ignore) {
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   })
   useEffect(() => {
      setExtraData((data && data.count > 0 && (data.games[0] as Game)) || [])
   }, [data])
   const history = useSelector(selectAuthBackHistory)
   const backHistory = () => {
      if (history?.length > 1 && history[1] !== '/auth/login') {
         router.push(history[1])
         store.dispatch(saveBackButton(true))
         store.dispatch(deleteBackHistory())
      } else {
         router.push('/dashboard')
      }
   }
   return (
      <React.Fragment>
         <Helmet title="Game Details" />
         <Grid container alignItems="center">
            <Grid>
               <Toolbar
                  variant="dense"
                  sx={{
                     flexDirection: ['column', 'row'],
                     justifyContent: 'space-between',
                     gap: 2,
                     mb: 3,
                  }}
               >
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
                     </Button>
                     <FontAwesomeIcon icon={faDice as IconProp} fixedWidth />{' '}
                     Game Details
                  </Typography>
               </Toolbar>
            </Grid>
         </Grid>
         {id && ignore && data && data?.games?.length > 0 ? (
            <>
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
                              >
                                 <Avatar
                                    sx={{
                                       width: [40, 50, 65],
                                       height: [40, 50, 65],
                                    }}
                                 />
                                 <Stack>
                                    <PortalCopyValue
                                       value={`Game ID : ${data?.games[0]?.gameId}`}
                                    />
                                    <PortalCopyValue
                                       sx={{
                                          maxWidth: '250px',
                                          overflow: 'hidden',
                                          whiteSpace: 'nowrap',
                                          textOverflow: 'ellipsis',
                                       }}
                                       color={blue[500]}
                                       value={data?.games[0]?.title || ''}
                                    />
                                 </Stack>
                              </Stack>
                           </Stack>
                        </Stack>
                     </Stack>
                  </Grid>
                  <Grid item xs />
               </Grid>
               <Divider my={2} />
               <Grid item xs={12}>
                  <Box sx={{ flexGrow: 1, p: 3, paddingTop: 0 }}>
                     <TabContext value={value}>
                        <Box
                           sx={{
                              boxShadow: 'inset 0px -1px 0px rgb(0 0 0 / 8%)',
                           }}
                        >
                           <TabList
                              className="detail_tabs"
                              onChange={handleChangeTabs}
                              variant="scrollable"
                              scrollButtons={false}
                              aria-label="lab API tabs example"
                           >
                              <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       Configs
                                    </Typography>
                                 }
                                 value="config"
                              />
                              <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       Configs JSON
                                    </Typography>
                                 }
                                 value="OPConfigsJson"
                              />
                              {/* <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       Report
                                    </Typography>
                                 }
                                 value="report"
                              /> */}
                           </TabList>
                        </Box>
                        <TabPanel value="config" sx={{ padding: '8px 0px' }}>
                           {id && <Configs configs={id} />}
                        </TabPanel>
                        <TabPanel
                           value="report"
                           sx={{ padding: '8px 0px' }}
                        ></TabPanel>
                        <TabPanel
                           value="OPConfigsJson"
                           sx={{ padding: '8px 0px' }}
                        >
                           <JSONInput
                              waitAfterKeyPress={2000}
                              viewOnly={
                                 user?.scope !== UserScope.SUPERADMIN &&
                                 user?.scope !== UserScope.ADMIN
                                    ? true
                                    : false
                              }
                              id="a_unique_id"
                              placeholder={data?.games[0]}
                              colors={dark_vscode_tribute}
                              locale={localeEn}
                              onChange={(e: any) => UpdateExtraData(e)}
                              width="100%"
                           />
                           {(user?.scope === UserScope.SUPERADMIN ||
                              user?.scope === UserScope.ADMIN) && (
                              <Grid
                                 container
                                 sx={{
                                    justifyContent: 'end',
                                    mt: 4,
                                 }}
                              >
                                 {extraData && (
                                    <Button
                                       onClick={() =>
                                          handleSubmit({ ...extraData })
                                       }
                                       disabled={extraDataError !== false}
                                       color="success"
                                       variant="contained"
                                    >
                                       Save
                                    </Button>
                                 )}
                              </Grid>
                           )}
                        </TabPanel>
                     </TabContext>
                  </Box>
               </Grid>
            </>
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

GameV2Details.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="game v2 Details">{page}</DashboardLayout>
}

export default GameV2Details
