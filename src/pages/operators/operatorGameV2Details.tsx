import CustomLoader from '@/components/custom/CustomLoader'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import {
   useGetGameV2OperatorQuery,
   useSetCrashConfigMutation,
   useSetCrashTimingMutation,
   useSetGameUrlV2Mutation,
   useSetSkinConfigMutation,
   useSetTournamentSettingMutation,
} from '@/components/data/operatorGamesV2/lib/hooks/queries'
import { useGetOperatorQuery } from '@/components/data/operators/lib/hooks/queries'
import {
   ConfigType,
   Operator,
   OperatorGameV2,
   SetOperatorGameV2CrashConfigDto,
   SetOperatorGameV2CrashTimingConfigDto,
   SetOperatorGameV2LaunchUrlDto,
   SetOperatorGameV2SkinConfigDto,
   SetOperatorGameV2TournamentConfigDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
   Avatar,
   Box,
   Card,
   CardContent,
   Checkbox,
   DialogActions,
   FormControlLabel,
   Grid,
   InputLabel,
   MenuItem,
   Button as MuiButton,
   FormControl as MuiFormControl,
   Select,
   Tab,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { Stack, spacing } from '@mui/system'
import { ImoonGray, darkPurple } from 'colors'
import { Field, Formik } from 'formik'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   selectAuthGameOperatorV2,
   selectAuthOperatorDetails,
} from 'redux/authSlice'
import { PageWithdetails4Toolbar } from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import { GamePlay } from 'types'
import * as Yup from 'yup'
import DashboardLayout from '../../layouts/Dashboard'

const Button = styled(MuiButton)(spacing)
const OperatorGameV2Details = () => {
   const router = useRouter()
   const { id, opId }: any = router.query
   const operatorDetails = useSelector(selectAuthOperatorDetails) as Operator
   const FormControlSpacing = styled(MuiFormControl)(spacing)
   const FormControl = styled(FormControlSpacing)`
      min-width: 148px;
   `
   const [value, setValue] = React.useState('LaunchURL')
   const data = useSelector(selectAuthGameOperatorV2) as OperatorGameV2<any>
   const [ignore, setIgnore] = React.useState(false)
   const [initialGameUrl, setInitialGameUrl] = React.useState({
      gameId: data?.gameId,
      opId: operatorDetails?.opId,
      launchUrl: data?.launchUrl,
      gameplay: data?.gameSpecificConfig?.gameplay,
      gamePlayURL: data?.gameSpecificConfig?.gamePlayURL,
      gameInfoUrl: data?.uiConfig?.gameInfoUrl || '',
   })
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))

   const handleChangeTabs = (event: React.SyntheticEvent, newValue: string) => {
      event.preventDefault()
      setValue(newValue)
   }

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

   const { mutate: mutateLaunchUrl } = useSetGameUrlV2Mutation({
      onSuccess: () => {
         toast.success('You update the Game URL successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const { mutate: mutateCrashConfig } = useSetCrashConfigMutation({
      onSuccess: () => {
         toast.success('You update the crash Config settings successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const { mutate: mutateCrashTiming } = useSetCrashTimingMutation({
      onSuccess: () => {
         toast.success('You update the crash timing settings successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const { mutate: mutateSkinConfig } = useSetSkinConfigMutation({
      onSuccess: () => {
         toast.success('You update the crash Config settings successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   useGetGameV2OperatorQuery({
      gameId: id,
      opId: opId,
   })

   useGetOperatorQuery({ opId: opId, key: 'details' })

   const crashConfigGame = React.useCallback(
      (dto: SetOperatorGameV2CrashConfigDto) => {
         mutateCrashConfig({ dto })
      },
      [mutateCrashConfig]
   )

   const crashTimingGame = React.useCallback(
      (dtoData: {
         gameId: string
         opId: string
         betCloseDurationAfterStartCountdownInMs?: any
      }) => {
         const dto: SetOperatorGameV2CrashTimingConfigDto = {
            gameId: dtoData.gameId,
            opId: dtoData.opId,
         }
         if (
            dtoData.betCloseDurationAfterStartCountdownInMs !== undefined &&
            dtoData.betCloseDurationAfterStartCountdownInMs !== ''
         ) {
            dto.betCloseDurationAfterStartCountdownInMs =
               dtoData.betCloseDurationAfterStartCountdownInMs
         }
         mutateCrashTiming({ dto })
      },
      [mutateCrashTiming]
   )

   const skinConfigGame = React.useCallback(
      (dto: SetOperatorGameV2SkinConfigDto) => {
         mutateSkinConfig({ dto })
      },
      [mutateSkinConfig]
   )

   const launchUrlSubmit = React.useCallback(
      (dto: SetOperatorGameV2LaunchUrlDto) => {
         mutateLaunchUrl({ dto })
      },
      [mutateLaunchUrl]
   )

   const tournamentSettingSubmit = React.useCallback(
      (dto: SetOperatorGameV2TournamentConfigDto) => {
         const post: SetOperatorGameV2TournamentConfigDto = {
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
      setInitialGameUrl({
         gameId: data?.gameId,
         opId: operatorDetails?.opId,
         launchUrl: data?.launchUrl,
         gameplay: data?.gameSpecificConfig?.gameplay,
         gamePlayURL: data?.gameSpecificConfig?.gamePlayURL,
         gameInfoUrl: data?.uiConfig?.gameInfoUrl || '',
      })
   }, [data])

   return (
      <React.Fragment>
         <Helmet title="Game Operator Details" />
         <CustomOperatorsBrandsToolbar
            title={'Game operator Details V2'}
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
                           justifyContent: 'left',
                        }}
                     >
                        <Tab
                           label={
                              <Typography
                                 variant="bodySmallBold"
                                 component="span"
                              >
                                 Game URL Settings
                              </Typography>
                           }
                           value="LaunchURL"
                        />
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
                        {data.configType === ConfigType.ALIEN_CRASH && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Crash Config
                                 </Typography>
                              }
                              value="crashConfig"
                           />
                        )}

                        <Tab
                           label={
                              <Typography
                                 variant="bodySmallBold"
                                 component="span"
                              >
                                 Skin Config
                              </Typography>
                           }
                           value="skinConfig"
                        />
                        {data.configType === ConfigType.ALIEN_CRASH && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Crash Timing
                                 </Typography>
                              }
                              value="crashTiming"
                           />
                        )}
                     </TabList>
                     <TabPanel value="LaunchURL">
                        {data && (
                           <Formik
                              initialValues={initialGameUrl}
                              enableReinitialize={true}
                              validationSchema={Yup.object().shape({
                                 launchUrl: Yup.string()
                                    .url('Enter a valid URL')
                                    .required('Launch URL is required'),
                                 gamePlayURL: Yup.string()
                                    .url('Enter a valid URL')
                                    .required('Game Play URL is required'),
                                 gameInfoUrl: Yup.string()
                                    .url('Enter a valid URL')
                                    .required('Game info URL is required'),
                                 gameplay: Yup.string()
                                    .required('Game play is required')
                                    .test(
                                       'not-url',
                                       'Game play cannot be a URL',
                                       (value) => {
                                          // Use a regex or any other method to check if the value is not a URL
                                          const isNotUrl =
                                             !/^https?:\/\/\S+$/.test(value)
                                          return isNotUrl
                                       }
                                    ),
                              })}
                              onSubmit={launchUrlSubmit}
                           >
                              {({
                                 errors,
                                 handleBlur,
                                 handleChange,
                                 handleSubmit,
                                 isSubmitting,
                                 touched,
                                 values,
                                 status,
                                 resetForm,
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
                                                name="launchUrl"
                                                label="Game launch URL"
                                                disabled={
                                                   !hasDetailsPermission(
                                                      UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_LAUNCH_URL_REQ
                                                   )
                                                }
                                                value={values.launchUrl}
                                                error={Boolean(
                                                   touched.launchUrl &&
                                                      errors.launchUrl
                                                )}
                                                fullWidth
                                                helperText={
                                                   touched.launchUrl &&
                                                   errors.launchUrl
                                                }
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                variant="outlined"
                                             />
                                             <TextField
                                                name="gamePlayURL"
                                                label="Game play URL"
                                                disabled={
                                                   !hasDetailsPermission(
                                                      UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_LAUNCH_URL_REQ
                                                   )
                                                }
                                                value={values.gamePlayURL}
                                                error={Boolean(
                                                   touched.gamePlayURL &&
                                                      errors.gamePlayURL
                                                )}
                                                fullWidth
                                                helperText={
                                                   touched.gamePlayURL &&
                                                   errors.gamePlayURL
                                                }
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                variant="outlined"
                                             />
                                             <TextField
                                                name="gameInfoUrl"
                                                label="Game Info Url"
                                                disabled={
                                                   !hasDetailsPermission(
                                                      UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_LAUNCH_URL_REQ
                                                   )
                                                }
                                                value={values.gameInfoUrl}
                                                error={Boolean(
                                                   touched.gameInfoUrl &&
                                                      errors.gameInfoUrl
                                                )}
                                                fullWidth
                                                helperText={
                                                   touched.gameInfoUrl &&
                                                   errors.gameInfoUrl
                                                }
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                variant="outlined"
                                             />
                                          </FormControl>
                                          <FormControl
                                             sx={{
                                                width: '100%',
                                                '.MuiInputBase-root': {
                                                   py: '2px',
                                                },
                                                maxWidth: '300px',
                                                minWidth: 'fit-content',
                                             }}
                                          >
                                             <InputLabel id="demo-simple-select-disabled-label">
                                                Game Play
                                             </InputLabel>
                                             <Select
                                                disabled={
                                                   !hasDetailsPermission(
                                                      UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_LAUNCH_URL_REQ
                                                   )
                                                }
                                                fullWidth
                                                name="gameplay"
                                                value={values.gameplay}
                                                onMouseLeave={handleBlur}
                                                onChange={handleChange}
                                                label="Game Play"
                                                IconComponent={() => (
                                                   <FontAwesomeIcon
                                                      icon={
                                                         faAngleDown as IconProp
                                                      }
                                                      className="selectIcon"
                                                      size="sm"
                                                   /> // Use FontAwesome icon as the select icon
                                                )}
                                             >
                                                {GamePlay?.map(
                                                   (item, index: number) => {
                                                      return (
                                                         <MenuItem
                                                            key={`Gameplay.${item}`}
                                                            value={item}
                                                         >
                                                            <Stack
                                                               direction="row"
                                                               alignItems="center"
                                                               gap={2}
                                                               textTransform="lowercase"
                                                            >
                                                               {item}
                                                            </Stack>
                                                         </MenuItem>
                                                      )
                                                   }
                                                )}
                                             </Select>
                                          </FormControl>
                                       </CardContent>
                                    </Card>
                                    {hasDetailsPermission(
                                       UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_LAUNCH_URL_REQ
                                    ) &&
                                       data &&
                                       data.gameId && (
                                          <DialogActions
                                             sx={{ justifyContent: 'center' }}
                                          >
                                             <Button
                                                type="reset"
                                                color="secondary"
                                                variant="outlined"
                                                onClick={() => resetForm()}
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
                        )}
                     </TabPanel>
                     <TabPanel value="tournamentSettings">
                        <Formik
                           initialValues={{
                              gameId: data?.gameId,
                              opId: operatorDetails.opId,
                              tournamentUrl:
                                 data?.tournamentConfig?.statsFileUrl || '',
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
                                                   UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_TOURNAMENT_CONFIG_REQ
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
                                    UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_TOURNAMENT_CONFIG_REQ
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
                     {data.configType === ConfigType.ALIEN_CRASH && (
                        <TabPanel value="crashConfig">
                           <Formik
                              initialValues={{
                                 gameId: data?.gameId,
                                 opId: operatorDetails.opId,
                                 defaultCashoutOdds:
                                    data?.gameSpecificConfig
                                       ?.defaultCashoutOdds,
                                 autoCashoutIsEnable:
                                    data?.gameSpecificConfig
                                       ?.autoCashoutIsEnable,
                                 convertCurrentRoundBetToPlayerCurrency:
                                    data?.gameSpecificConfig
                                       ?.convertCurrentRoundBetToPlayerCurrency ||
                                    false,
                                 uiLogIsEnable:
                                    data?.gameSpecificConfig?.uiLogIsEnable ||
                                    false,
                                 gameTimingsLogIsEnable:
                                    data?.gameSpecificConfig?.gameTimingsLogIsEnable ||
                                    false,
                              }}
                              enableReinitialize={true}
                              onSubmit={crashConfigGame}
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
                                                name="defaultCashoutOdds"
                                                label="Default cashout odds"
                                                type="number"
                                                disabled={
                                                   !hasDetailsPermission(
                                                      UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_CRASH_CONFIG_REQ
                                                   )
                                                }
                                                value={
                                                   values.defaultCashoutOdds
                                                }
                                                error={Boolean(
                                                   touched.defaultCashoutOdds &&
                                                      errors.defaultCashoutOdds
                                                )}
                                                fullWidth
                                                helperText={
                                                   touched.defaultCashoutOdds &&
                                                   errors.defaultCashoutOdds
                                                }
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                variant="outlined"
                                             />
                                          </FormControl>
                                          <FormControl
                                             variant="standard"
                                             fullWidth
                                          >
                                             <Field
                                                type="checkbox"
                                                name="autoCashoutIsEnable"
                                                value={
                                                   values.autoCashoutIsEnable
                                                }
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.autoCashoutIsEnable
                                                      }
                                                   />
                                                }
                                                sx={{
                                                   paddingLeft: 0,
                                                   width: 'fit-content',
                                                }}
                                                label={
                                                   'Default auto cashout is ON'
                                                }
                                             />
                                          </FormControl>
                                          <FormControl
                                             variant="standard"
                                             fullWidth
                                          >
                                             <Field
                                                type="checkbox"
                                                name="convertCurrentRoundBetToPlayerCurrency"
                                                value={
                                                   values.convertCurrentRoundBetToPlayerCurrency
                                                }
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.convertCurrentRoundBetToPlayerCurrency
                                                      }
                                                   />
                                                }
                                                sx={{
                                                   paddingLeft: 0,
                                                   width: 'fit-content',
                                                }}
                                                label={
                                                   'Convert current round bet to player currency'
                                                }
                                             />
                                          </FormControl>
                                          <FormControl
                                             variant="standard"
                                             fullWidth
                                          >
                                             <Field
                                                type="checkbox"
                                                name="uiLogIsEnable"
                                                value={values.uiLogIsEnable}
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.uiLogIsEnable
                                                      }
                                                   />
                                                }
                                                sx={{
                                                   paddingLeft: 0,
                                                   width: 'fit-content',
                                                }}
                                                label={'Enable ui Log'}
                                             />
                                          </FormControl>
                                          <FormControl
                                             variant="standard"
                                             fullWidth
                                          >
                                             <Field
                                                type="checkbox"
                                                name="gameTimingsLogIsEnable"
                                                value={values.gameTimingsLogIsEnable}
                                                as={FormControlLabel}
                                                control={
                                                   <Checkbox
                                                      checked={
                                                         values.gameTimingsLogIsEnable
                                                      }
                                                   />
                                                }
                                                sx={{
                                                   paddingLeft: 0,
                                                   width: 'fit-content',
                                                }}
                                                label={'Enable game timings log'}
                                             />
                                          </FormControl>
                                       </CardContent>
                                    </Card>
                                    {hasDetailsPermission(
                                       UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_CRASH_CONFIG_REQ
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
                     )}

                     <TabPanel value="skinConfig">
                        <Formik
                           initialValues={{
                              gameId: data?.gameId,
                              opId: operatorDetails?.opId,
                              skinId: data?.skinConfig?.skinId,
                              extraData: JSON.stringify(
                                 data?.skinConfig?.extraData
                              ),
                           }}
                           enableReinitialize={true}
                           validationSchema={Yup.object().shape({
                              skinId: Yup.string().required(
                                 'skin Id is required'
                              ),
                           })}
                           onSubmit={skinConfigGame}
                        >
                           {({
                              errors,
                              handleBlur,
                              handleChange,
                              handleSubmit,
                              isSubmitting,
                              touched,
                              values,
                              status,
                              resetForm,
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
                                             name="skinId"
                                             label="Skin Id"
                                             disabled={
                                                !hasDetailsPermission(
                                                   UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_SKIN_CONFIG_REQ
                                                )
                                             }
                                             value={values.skinId}
                                             error={Boolean(
                                                touched.skinId && errors.skinId
                                             )}
                                             fullWidth
                                             helperText={
                                                touched.skinId && errors.skinId
                                             }
                                             onBlur={handleBlur}
                                             onChange={handleChange}
                                             variant="outlined"
                                          />
                                          <TextField
                                             name="extraData"
                                             label="Extra Data"
                                             disabled={
                                                !hasDetailsPermission(
                                                   UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_SKIN_CONFIG_REQ
                                                )
                                             }
                                             value={values.extraData}
                                             error={Boolean(
                                                touched.extraData &&
                                                   errors.extraData
                                             )}
                                             fullWidth
                                             helperText={
                                                touched.extraData &&
                                                errors.extraData
                                             }
                                             onBlur={handleBlur}
                                             onChange={handleChange}
                                             variant="outlined"
                                          />
                                       </FormControl>
                                    </CardContent>
                                 </Card>
                                 {hasDetailsPermission(
                                    UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_SKIN_CONFIG_REQ
                                 ) &&
                                    data &&
                                    data.gameId && (
                                       <DialogActions
                                          sx={{ justifyContent: 'center' }}
                                       >
                                          <Button
                                             type="reset"
                                             color="secondary"
                                             variant="outlined"
                                             onClick={() => resetForm()}
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

                     {data.configType === ConfigType.ALIEN_CRASH && (
                        <TabPanel value="crashTiming">
                           <Formik
                              initialValues={{
                                 gameId: data?.gameId,
                                 opId: operatorDetails.opId,
                                 betCloseDurationAfterStartCountdownInMs:
                                    data?.gameSpecificConfig
                                       ?.betCloseDurationAfterStartCountdownInMs,
                              }}
                              enableReinitialize={true}
                              onSubmit={crashTimingGame}
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
                                                name="betCloseDurationAfterStartCountdownInMs"
                                                label="Bet Close Duration After Start Count down In Ms"
                                                type="number"
                                                disabled={
                                                   !hasDetailsPermission(
                                                      UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_CRASH_CONFIG_REQ
                                                   )
                                                }
                                                value={
                                                   values.betCloseDurationAfterStartCountdownInMs
                                                }
                                                error={Boolean(
                                                   touched.betCloseDurationAfterStartCountdownInMs &&
                                                      errors.betCloseDurationAfterStartCountdownInMs
                                                )}
                                                fullWidth
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                variant="outlined"
                                             />
                                          </FormControl>
                                       </CardContent>
                                    </Card>
                                    {hasDetailsPermission(
                                       UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_CRASH_TIMING_CONFIG_REQ
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
                     )}
                  </TabContext>
               </Grid>
            </>
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

OperatorGameV2Details.getLayout = function getLayout(page: ReactElement) {
   return (
      <DashboardLayout title="Operator Game V2 Details">{page}</DashboardLayout>
   )
}

export default OperatorGameV2Details
