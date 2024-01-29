import JSONEditor from '@/components/custom/CustomJsonEditor'
import CustomLoader from '@/components/custom/CustomLoader'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import OperatorConfigs from '@/components/data/operatorGames/edit-configs'
import {
   useEditOperatorGameMutation,
   useGetGameOperatorQuery,
   useSetLaunchUrlMutation,
   useSetTournamentSettingMutation,
} from '@/components/data/operatorGames/lib/hooks/queries'
import { useGetOperatorQuery } from '@/components/data/operators/lib/hooks/queries'
import {
   EditOperatorGameDto,
   Operator,
   OperatorGame,
   SetOperatorGameTournamentConfigDto,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front'
import { SetOperatorGameLaunchUrlDto } from '@alienbackoffice/back-front/lib/game/dto/set-operator-game-launch-url.dto'
import styled from '@emotion/styled'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
   Avatar,
   Box,
   Card,
   CardContent,
   DialogActions,
   Grid,
   Button as MuiButton,
   FormControl as MuiFormControl,
   Tab,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { Stack, spacing } from '@mui/system'
import { ImoonGray, darkPurple } from 'colors'
import { Formik } from 'formik'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   selectAuthGameOperatorConfigs,
   selectAuthOperatorDetails,
   selectAuthUser,
} from 'redux/authSlice'
import { EventsHandler } from 'services/eventsHandler'
import { PageWithdetails4Toolbar } from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import * as Yup from 'yup'
import DashboardLayout from '../../layouts/Dashboard'

const Button = styled(MuiButton)(spacing)
function OperatorGameDetails() {
   const router = useRouter()
   const { id, opId }: any = router.query
   const user = useSelector(selectAuthUser) as User
   const operatorDetails = useSelector(selectAuthOperatorDetails) as Operator
   const FormControlSpacing = styled(MuiFormControl)(spacing)
   const FormControl = styled(FormControlSpacing)`
      min-width: 148px;
   `
   const [value, setValue] = React.useState('config')
   const data = useSelector(selectAuthGameOperatorConfigs) as OperatorGame
   const dataWithoutSecretConfig = { ...data, secretConfig: {} }
   const [extraData, setExtraData] = React.useState(data as OperatorGame)
   const [launchUrlInput, setLaunchUrlInput] = React.useState(data?.launchUrl)
   const [extraDataError, setExtraDataError] = React.useState(false)
   const [ignore, setIgnore] = React.useState(false)
   const eventHandler = new EventsHandler()
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))

   useGetOperatorQuery({ opId: opId, key: 'details' })

   useGetGameOperatorQuery({
      gameId: id,
      opId: opId,
   })

   const { mutate } = useEditOperatorGameMutation({
      onSuccess: (data: any) => {
         eventHandler.HandleGetOperatorGameConfigs(data.data as OperatorGame)
         toast.success('You Edited Game Operator successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const { mutate: mutateLaunchUrl } = useSetLaunchUrlMutation({
      onSuccess: () => {
         toast.success('You update the launch URL successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const { mutate: mutateTournamentSettingUrl } =
      useSetTournamentSettingMutation({
         onSuccess: () => {
            toast.success('You update the tournament settings successfully', {
               position: toast.POSITION.TOP_CENTER,
            })
         },
         onError: (error) => {
            toast.error(error, {
               position: toast.POSITION.TOP_CENTER,
            })
         },
      })

   const handleSubmit = React.useCallback(
      (dto: EditOperatorGameDto) => {
         const editData: any = dto
         delete editData._id
         delete editData.__v
         delete editData.updatedAt
         delete editData.createdAt
         mutate({ dto: editData })
      },
      [mutate]
   )

   const launchUrlSubmit = React.useCallback(
      (dto: SetOperatorGameLaunchUrlDto) => {
         mutateLaunchUrl({ dto })
      },
      [mutateLaunchUrl]
   )

   const handleChangeTabs = (event: React.SyntheticEvent, newValue: string) => {
      event.preventDefault()
      setValue(newValue)
   }

   const tournamentSettingSubmit = React.useCallback(
      (dto: SetOperatorGameTournamentConfigDto) => {
         const post: SetOperatorGameTournamentConfigDto = {
            gameId: dto.gameId,
            opId: dto.opId,
         }
         if (dto.tournamentUrl) {
            post.tournamentUrl = dto.tournamentUrl
         }
         mutateTournamentSettingUrl({ dto: post })
      },
      [mutateTournamentSettingUrl]
   )

   useEffect(() => {
      if (!ignore) {
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   })

   useEffect(() => {
      setLaunchUrlInput(data?.launchUrl)
   }, [data])

   return (
      <React.Fragment>
         <Helmet title="Game Operator Details" />
         <CustomOperatorsBrandsToolbar
            title={'Game Operator Details'}
            background={
               isDesktop
                  ? theme.palette.secondary.dark
                  : theme.palette.primary.main
            }
         />
         {id && opId && ignore ? (
            <>
               <Grid
                  container
                  alignItems="center"
                  p={2}
                  px={isLgUp ? '12px' : '4px'}
                  spacing={2}
                  sx={{
                     background: isDesktop ? 'initial' : darkPurple[4],
                  }}
               >
                  <Grid item xs={12}>
                     {data && (
                        <Grid
                           container
                           alignItems="center"
                           p={2}
                           px={isLgUp ? '0' : '4px'}
                           spacing={0.5}
                        >
                           <Grid
                              item
                              textAlign={'center'}
                              p={1}
                              display={'flex'}
                              justifyContent={'center'}
                           >
                              <Stack
                                 width={'fit-content'}
                                 alignItems="center"
                                 direction="column"
                                 gap={2}
                                 position={'relative'}
                              >
                                 <Avatar
                                    sx={{
                                       width: [54],
                                       height: [54],
                                    }}
                                 />
                              </Stack>
                           </Grid>
                           <Grid
                              item
                              textAlign={'center'}
                              p={1}
                              justifyContent={'center'}
                              maxWidth={
                                 isLgUp
                                    ? '385px'
                                    : isDesktop
                                    ? '200px'
                                    : '385px'
                              }
                              width={
                                 isDesktop ? 'initial' : 'calc(100% - 60px)'
                              }
                           >
                              <Grid
                                 container
                                 alignItems="center"
                                 spacing={2}
                                 sx={{
                                    '.MuiGrid-root>.MuiBox-root': {
                                       position: 'relative',
                                       border: `1px solid ${ImoonGray[10]}`,
                                       height: '28px',
                                       p: '4px 6px',
                                       alignItems: 'center',
                                       display: 'grid',
                                       textAlign: 'center',
                                       borderRadius: '8px',
                                       pl: '20px',
                                    },
                                 }}
                              >
                                 <Grid item lg={6} md={12} sm={6} xs={6} pt={0}>
                                    <Box
                                       mb={0}
                                       borderRadius={8}
                                       display={'inline-flex'}
                                       gap={2}
                                       width={'100%'}
                                       justifyContent={'center'}
                                    >
                                       <PortalCopyValue
                                          title={'Game ID:'}
                                          value={data?.gameId}
                                          sx={{
                                             cursor: 'default',
                                             color: (props) =>
                                                isDesktop
                                                   ? ImoonGray[1]
                                                   : props.palette.primary
                                                        .contrastText,
                                          }}
                                          whiteSpace={'nowrap'}
                                          isVisible={true}
                                       />
                                    </Box>
                                 </Grid>
                                 {data?.title && (
                                    <Grid
                                       item
                                       lg={6}
                                       md={12}
                                       sm={6}
                                       xs={6}
                                       pt={0}
                                    >
                                       <Box
                                          mb={0}
                                          borderRadius={8}
                                          display={'inline-flex'}
                                          gap={2}
                                          width={'100%'}
                                          justifyContent={'center'}
                                       >
                                          <PortalCopyValue
                                             title={'Game Name :'}
                                             value={data?.title}
                                             isVisible={true}
                                             whiteSpace={'nowrap'}
                                             sx={{
                                                maxWidth: '100%',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                cursor: 'default',
                                                color: (props) =>
                                                   isDesktop
                                                      ? ImoonGray[1]
                                                      : props.palette.primary
                                                           .contrastText,
                                             }}
                                          />
                                       </Box>
                                    </Grid>
                                 )}
                                 <Grid item sm={12} xs={12} pt={0}>
                                    <Box
                                       mb={0}
                                       borderRadius={8}
                                       sx={{
                                          background: (props) =>
                                             isDesktop
                                                ? 'initial'
                                                : ImoonGray[5],
                                       }}
                                    >
                                       <Typography
                                          color={(props) =>
                                             isDesktop
                                                ? ImoonGray[1]
                                                : props.palette.primary
                                                     .contrastText
                                          }
                                          variant="bodySmallBold"
                                          whiteSpace={'nowrap'}
                                       >
                                          Operator :{opId} -{' '}
                                          {operatorDetails.title}
                                       </Typography>
                                    </Box>
                                 </Grid>
                              </Grid>
                           </Grid>
                        </Grid>
                     )}
                  </Grid>
               </Grid>
               <Grid
                  item
                  xs={12}
                  px={isDesktop ? '12px' : '4px'}
                  sx={{
                     '.MuiTabPanel-root': {
                        padding: '8px 0px',
                     },
                     '.MuiTabs-scroller': {
                        width: '230px !important',
                        maxWidth: 'fit-content !important',
                     },
                  }}
               >
                  <TabContext value={value}>
                     <TabList
                        className="detail_tabs"
                        onChange={handleChangeTabs}
                        variant="scrollable"
                        scrollButtons={true}
                        sx={{
                           mb: '6px',
                           pt: isDesktop ? 0 : '6px',
                           alignContent: 'left',
                           justifyContent: 'left',
                        }}
                     >
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_OPERATOR_GET_GAME_REQ
                        ) && (
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
                        )}
                        {(user?.scope === UserScope.SUPERADMIN ||
                           user?.scope === UserScope.ADMIN) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    OP Configs JSON
                                 </Typography>
                              }
                              value="OPConfigsJson"
                           />
                        )}
                        {(user?.scope === UserScope.SUPERADMIN ||
                           user?.scope === UserScope.ADMIN) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Game Settings
                                 </Typography>
                              }
                              value="LaunchURL"
                           />
                        )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_TOURNAMENT_CONFIG_REQ
                        ) &&
                           [
                              UserScope.ADMIN,
                              UserScope.OPERATOR,
                              UserScope.SUPERADMIN,
                           ].includes(user?.scope) && (
                              <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       Tournament Settings
                                    </Typography>
                                 }
                                 value="tournamentSettings"
                              />
                           )}
                     </TabList>
                     {hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_OPERATOR_GET_GAME_REQ
                     ) &&
                        opId &&
                        id && (
                           <TabPanel value="config">
                              <OperatorConfigs id={opId} gameId={id} />
                           </TabPanel>
                        )}
                     <TabPanel value="OPConfigsJson">
                        <Card
                           sx={{
                              m: 0,
                              '.box-texfield-style': {
                                 p: '16px',
                                 border: `1px solid ${darkPurple[11]}`,
                                 borderRadius: '8px',
                                 background: darkPurple[12],
                                 mb: '6px',
                              },
                           }}
                        >
                           <CardContent
                              sx={{
                                 p: 0,
                                 pb: '0 !important',
                                 height: PageWithdetails4Toolbar,
                                 overflowY: 'auto',
                              }}
                           >
                              <JSONEditor
                                 editable={false}
                                 data={dataWithoutSecretConfig}
                                 setExtraData={(data: OperatorGame) =>
                                    setExtraData(data)
                                 }
                                 setExtraDataError={(data: any) =>
                                    setExtraDataError(data)
                                 }
                              />
                           </CardContent>
                        </Card>
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_OPERATOR_EDIT_GAME_REQ
                        ) && (
                           <DialogActions sx={{ justifyContent: 'center' }}>
                              <Button
                                 onClick={() =>
                                    handleSubmit({
                                       ...extraData,
                                       secretConfig: data.secretConfig,
                                       opId: opId,
                                    })
                                 }
                                 disabled={extraDataError !== false}
                                 color="secondary"
                                 variant="contained"
                                 sx={{ height: 32 }}
                              >
                                 Save
                              </Button>
                           </DialogActions>
                        )}
                     </TabPanel>
                     <TabPanel value="LaunchURL">
                        <Card
                           sx={{
                              m: 0,
                              '.box-texfield-style': {
                                 p: '16px',
                                 border: `1px solid ${darkPurple[11]}`,
                                 borderRadius: '8px',
                                 background: darkPurple[12],
                                 mb: '6px',
                              },
                           }}
                        >
                           <CardContent
                              sx={{
                                 px: '6px',
                                 pb: '6px !important',
                                 height: PageWithdetails4Toolbar,
                                 overflowY: 'auto',
                              }}
                           >
                              <FormControl variant="standard" fullWidth mt={0}>
                                 <TextField
                                    name="launchUrlInput"
                                    label="Launch URL"
                                    disabled={
                                       !hasDetailsPermission(
                                          UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_LAUNCH_URL_REQ
                                       )
                                    }
                                    onChange={(e) =>
                                       setLaunchUrlInput(e.target.value)
                                    }
                                    value={launchUrlInput}
                                    minRows={5}
                                    fullWidth
                                    autoFocus
                                    variant="outlined"
                                 />
                              </FormControl>
                           </CardContent>
                        </Card>
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_LAUNCH_URL_REQ
                        ) && (
                           <DialogActions sx={{ justifyContent: 'center' }}>
                              <Button
                                 onClick={() =>
                                    setLaunchUrlInput(data?.launchUrl || '')
                                 }
                                 color="secondary"
                                 variant="outlined"
                                 sx={{
                                    height: 32,
                                    borderColor: darkPurple[10],
                                 }}
                              >
                                 Cancel
                              </Button>
                              <Button
                                 onClick={() =>
                                    launchUrlSubmit({
                                       gameId: data.gameId,
                                       opId: operatorDetails.opId,
                                       launchUrl: launchUrlInput,
                                    })
                                 }
                                 color="secondary"
                                 variant="contained"
                                 sx={{ height: 32 }}
                              >
                                 Save
                              </Button>
                           </DialogActions>
                        )}
                     </TabPanel>
                     <TabPanel value="tournamentSettings">
                        <Formik
                           initialValues={{
                              gameId: data?.gameId,
                              opId: operatorDetails.opId,
                              tournamentUrl:
                                 data?.gameConfig?.extraData?.tournamentConfig
                                    ?.statsFileUrl || '',
                           }}
                           validationSchema={Yup.object().shape({
                              tournamentUrl:
                                 Yup.string().url('Enter a valid URL'),
                           })}
                           enableReinitialize={true}
                           onSubmit={tournamentSettingSubmit}
                        >
                           {({
                              errors,
                              handleBlur,
                              handleChange,
                              handleSubmit,
                              resetForm,
                              isSubmitting,
                              touched,
                              values,
                              status,
                           }) => (
                              <form noValidate onSubmit={handleSubmit}>
                                 <Card
                                    sx={{
                                       m: 0,
                                       '.box-texfield-style': {
                                          p: '16px',
                                          border: `1px solid ${darkPurple[11]}`,
                                          borderRadius: '8px',
                                          background: darkPurple[12],
                                          mb: '6px',
                                       },
                                    }}
                                 >
                                    <CardContent
                                       sx={{
                                          px: '6px',
                                          pb: '6px !important',
                                          height: PageWithdetails4Toolbar,
                                          overflowY: 'auto',
                                       }}
                                    >
                                       <FormControl
                                          variant="standard"
                                          fullWidth
                                          mt={0}
                                          sx={{ gap: '6px' }}
                                       >
                                          <TextField
                                             name="tournamentUrl"
                                             label="Tournament URL"
                                             disabled={
                                                !hasDetailsPermission(
                                                   UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_TOURNAMENT_CONFIG_REQ
                                                )
                                             }
                                             value={values.tournamentUrl}
                                             error={Boolean(
                                                touched.tournamentUrl &&
                                                   errors.tournamentUrl
                                             )}
                                             fullWidth
                                             helperText={
                                                touched.tournamentUrl &&
                                                errors.tournamentUrl
                                             }
                                             onBlur={handleBlur}
                                             onChange={handleChange}
                                             variant="outlined"
                                          />
                                       </FormControl>
                                    </CardContent>
                                 </Card>
                                 {hasDetailsPermission(
                                    UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_TOURNAMENT_CONFIG_REQ
                                 ) &&
                                    data &&
                                    data.gameId && (
                                       <DialogActions
                                          sx={{ justifyContent: 'center' }}
                                       >
                                          <Button
                                             type="reset"
                                             color="secondary"
                                             onClick={() => resetForm()}
                                             variant="outlined"
                                             sx={{
                                                height: 32,
                                                borderColor: darkPurple[10],
                                             }}
                                          >
                                             Cancel
                                          </Button>
                                          <Button
                                             type="submit"
                                             color="secondary"
                                             variant="contained"
                                             sx={{ height: 32 }}
                                          >
                                             Save
                                          </Button>
                                       </DialogActions>
                                    )}
                              </form>
                           )}
                        </Formik>
                     </TabPanel>
                  </TabContext>
               </Grid>
            </>
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

OperatorGameDetails.getLayout = function getLayout(page: ReactElement) {
   return (
      <DashboardLayout title="Operator Game Details">{page}</DashboardLayout>
   )
}

export default OperatorGameDetails
