import CustomLoader from '@/components/custom/CustomLoader'
import MoreFiltersButton from '@/components/custom/MoreFiltersButton'
import PortalFilterChips, {
   FilterChip,
} from '@/components/custom/PortalFilterChips'
import TransitionSlide from '@/components/custom/TransitionSlide'
import AllGamesV2 from '@/components/data/gamesV2/games-grid'
import { useCreateGameV2Mutation } from '@/components/data/gamesV2/lib/hooks/queries'
import {
   UserPermissionEvent
} from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faCaretLeft, faDice } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Add from '@mui/icons-material/Add'
import {
   Grid,
   Button as MuiButton,
   Divider as MuiDivider,
   FormControl as MuiFormControl,
   TextField,
   Toolbar,
   Typography,
   useMediaQuery,
   useTheme
} from '@mui/material'
import { Stack, spacing } from '@mui/system'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   deleteBackHistory,
   saveBackButton,
   saveGameV2List,
   selectAuthBackHistory,
   selectAuthLanguages,
} from 'redux/authSlice'
import { saveLoadingGameV2List } from 'redux/loadingSlice'
import { store } from 'redux/store'
import { hasDetailsPermission } from 'services/permissionHandler'
import DashboardLayout from '../../layouts/Dashboard'

const Button = styled(MuiButton)(spacing)
const FormControlSpacing = styled(MuiFormControl)(spacing)
const FormControl = styled(FormControlSpacing)`
   min-width: 148px;
`
const Divider = styled(MuiDivider)(spacing)
function GamesV2() {
   const theme = useTheme()
   const [initForm, setInitForm] = React.useState(0)
   const languages = useSelector(selectAuthLanguages)
   const router = useRouter()
   const history = useSelector(selectAuthBackHistory)
   const isDesktopSize = useMediaQuery(theme.breakpoints.up('md'))
   const languagesData = languages ? languages.map((item) => item.label) : []
   const [openAddGame, setOpenAddGame] = React.useState(false)
   const [refresh, setRefresh] = React.useState(0)
   const [Transition, setTransition]: any = React.useState()
   const [openFilter, setOpenFilter] = React.useState(false)
   const [keyDateFilter, setKeyDateFilter] = React.useState(0)
   const [transitionFilter, setTransitionFilter]: any = React.useState()
   const [ignore, setIgnore] = React.useState(false)
   const filterInitialState = {
      gameId: '',
      title: '',
   }
   const [filters, setFilters] = React.useState(filterInitialState)
   const [filtersInput, setFiltersInput] = React.useState(filterInitialState)
   const [filterChips, setFilterChips] = React.useState<FilterChip[]>([])

   const handleCloseFilter = async () => {
      setKeyDateFilter(keyDateFilter + 1)
      await setTransition(TransitionSlide)
      setOpenFilter(false)
   }
   const handleClickOpenFilter = (value: any) => {
      setTransitionFilter(TransitionSlide)
      setOpenFilter(true)
   }

   const handleSearchFilter = () => {
      setFilters(filtersInput)
      handleCloseFilter()
   }

   const moreFiltersBtn = () => {
      return (
         <MoreFiltersButton
            open={openFilter}
            onClick={handleClickOpenFilter}
            TransitionComponent={transitionFilter}
            onClose={handleCloseFilter}
            onSearch={handleSearchFilter}
         >
            <FormControl
               mr={2}
               mb={2}
               sx={{
                  width: '100%',
                  '.MuiOutlinedInput-notchedOutline': {
                     borderColor: theme.palette.divider,
                  },
               }}
            >
               <TextField
                  name="gameId"
                  label="Game Id"
                  onChange={(e) => {
                     setFiltersInput((prev) => ({
                        ...prev,
                        gameId: e.target.value,
                     }))
                  }}
                  value={filtersInput.gameId}
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 5 }}
               />
               <TextField
                  name="title"
                  label="Title"
                  onChange={(e) => {
                     setFiltersInput((prev) => ({
                        ...prev,
                        title: e.target.value,
                     }))
                  }}
                  value={filtersInput.title}
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 5 }}
               />
            </FormControl>
         </MoreFiltersButton>
      )
   }

   const handleDeleteChip = (chipToDelete: FilterChip) => () => {
      setFilterChips((chips) =>
         chips.filter((chip) => chip.key !== chipToDelete.key)
      )

      const getObjectKey = (obj: any, value: string) => {
         return Object.keys(obj).find((key) => obj[key] === value)
      }

      const objKey = getObjectKey(filters, chipToDelete.value)
      objKey &&
         setFilters((prev) => ({
            ...prev,
            [objKey]:
               filterInitialState[objKey as keyof typeof filterInitialState],
         }))
   }

   useEffect(() => {
      setFilterChips([
         { key: 0, label: 'Game ID', value: filters.gameId },
         { key: 1, label: 'Title', value: filters.title },
      ])
      setFiltersInput(filters)
   }, [filters])

   const backHistory = () => {
      if (history?.length > 1 && history[1] !== '/auth/login') {
         router.push(history[1])
         store.dispatch(saveBackButton(true))
         store.dispatch(deleteBackHistory())
      } else {
         router.push('/dashboard')
      }
   }

   useEffect(() => {
      if (!ignore) {
         store.dispatch(saveLoadingGameV2List(true))
         store.dispatch(saveGameV2List([]))
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   })

   const handleCloseNewGame = () => {
      setOpenAddGame(false)
   }

   const { mutate } = useCreateGameV2Mutation({
      onSuccess: () => {
         toast.success('You add new game successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         setRefresh(refresh + 1)
         handleCloseNewGame()
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })
   // const handleSubmitAddNewGame = React.useCallback(
   //    (editdto: {
   //       gameId: string
   //       description: string
   //       title: string
   //       gameProvider: string
   //       gameType: GameType
   //       gameSubType?: GameSubtype
   //       rtp: number
   //       launchUrl: string
   //       isPrivate: boolean
   //       isMultiplayer: boolean
   //       hasChat: boolean
   //       hasTournament: boolean
   //       isLive: boolean
   //       devices?: string
   //       jdList: string
   //       languages: string[]
   //       configType: ConfigType
   //    }) => {
   //       const dto: CreateGameV2Dto = {
   //          gameId: editdto.gameId,
   //          title: editdto.title,
   //          gameProvider: editdto.gameProvider,
   //          gameType: editdto.gameType,
   //          gameSubType: editdto.gameSubType,
   //          rtp: editdto.rtp,
   //          launchUrl: editdto.launchUrl,
   //          isPrivate: editdto.isPrivate,
   //          isMultiplayer: editdto.isMultiplayer,
   //          hasChat: editdto.hasChat,
   //          hasTournament: editdto.hasTournament,
   //          isLive: editdto.isLive,
   //          devices: editdto.devices?.split(/\r?\n/),
   //          jdList: editdto.jdList?.split(/\r?\n/),
   //          languages:
   //             languages
   //                ?.filter((item) => editdto.languages.includes(item.label))
   //                ?.map((item) => item.value) || [],
   //          configType: editdto.configType,
   //          description: editdto.description,
   //       }
   //       mutate({ dto: dto })
   //    },
   //    [mutate]
   // )
   return (
      <React.Fragment>
         <Helmet title="Game List" />
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
               <Grid item sm={'auto'} xs={12}>
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
                     <FontAwesomeIcon icon={faDice as IconProp} fixedWidth />{' '}
                     Games V2 List
                  </Typography>
               </Grid>
            </Grid>
         </Toolbar>
         <Divider my={2} />
         <Toolbar
            variant="dense"
            sx={{
               flexDirection: ['column', 'row'],
               justifyContent: 'space-between',
               textAlign: 'center',
               alignItems: 'center',
               gap: 2,
               mb: 2,
            }}
         >
            <Grid container alignItems="center" spacing={3}>
               <Grid item xs />
               <Grid item md={0}>
                  {!isDesktopSize && moreFiltersBtn()}
               </Grid>
               <Grid item xs={12} md>
                  <Stack
                     direction="row"
                     justifyContent={['flex-start', null, 'flex-end']}
                     gap={3}
                  >
                     <PortalFilterChips
                        chips={filterChips}
                        handleDelete={handleDeleteChip}
                     />
                     {isDesktopSize && moreFiltersBtn()}
                  </Stack>
               </Grid>
               {hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_CREATE_GAMEV2_REQ
               ) && (
                  <Grid
                     item
                     sx={{
                        svg: { mr: 2 },
                     }}
                  >
                     <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                           setInitForm(initForm + 1)
                           setTransition(TransitionSlide)
                           setOpenAddGame(true)
                        }}
                        sx={{
                           width: isDesktopSize ? 'initial' : '100%',
                        }}
                     >
                        {' '}
                        <Add /> Create New Game
                     </Button>
                  </Grid>
               )}
            </Grid>
         </Toolbar>

         {ignore ? (
            <Toolbar
               variant="dense"
               sx={{
                  flexDirection: ['column', 'row'],
                  justifyContent: 'space-between',
                  gap: 2,
                  mb: 2,
               }}
            >
               <Grid container spacing={6}>
                  <Grid item xs={12}>
                     <AllGamesV2
                        gameId={filters.gameId}
                        title={filters.title}
                        key={refresh}
                     />
                  </Grid>
               </Grid>
               {/* <Dialog
                  open={openAddGame}
                  onClose={handleCloseNewGame}
                  fullScreen
                  TransitionComponent={Transition}
                  keepMounted
                  sx={{
                     '.MuiDialog-container': {
                        alignItems: 'end',
                        justifyContent: 'end',
                     },
                     '.MuiPaper-root': {
                        width: '600px',
                        padding: '25px',
                     },
                     '.errorInput': {
                        color: (props) => props.palette.error.main,
                        ml: '14px',
                        fontSize: '0.75rem',
                     },
                  }}
               >
                  <Typography variant="h3" gutterBottom display="inline">
                     Add new game
                  </Typography>
                  <Formik
                     key={initForm}
                     initialValues={{
                        gameId: '',
                        gameProvider: '',
                        gameType: GameType.FAST_GAME,
                        configType: ConfigType.ALIEN_CRASH,
                        hasChat: false,
                        hasTournament: false,
                        isLive: false,
                        isMultiplayer: false,
                        isPrivate: false,
                        languages: [],
                        jdList: '',
                        launchUrl: '',
                        rtp: 0,
                        title: '',
                        description: '',
                        devices: '',
                     }}
                     enableReinitialize={true}
                     validationSchema={Yup.object().shape({
                        gameId: Yup.string().required('Game Id is required'),
                        title: Yup.string().required('Title  is required'),
                        gameProvider: Yup.string().required(
                           'Game Provider is required'
                        ),
                        gameType: Yup.string().required(
                           'Game Type is required'
                        ),
                        rtp: Yup.number().required('RTP  is required'),
                        launchUrl: Yup.string().required(
                           'Launch Url is required'
                        ),
                        languages: Yup.array()
                           .required('Languages is required')
                           .min(1, 'Languages is required'),
                        jdList: Yup.string().required(
                           'Jurisdiction List is required'
                        ),
                        configType: Yup.string().required(
                           'Config Type is required'
                        ),
                     })}
                     onSubmit={handleSubmitAddNewGame}
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
                        setFieldValue,
                     }) => (
                        <form noValidate onSubmit={handleSubmit}>
                           <Box sx={{ flexGrow: 1, paddingTop: 0 }} mt={5}>
                              <TextField
                                 name="gameId"
                                 label="Game ID"
                                 value={values.gameId}
                                 error={Boolean(
                                    touched.gameId && errors.gameId
                                 )}
                                 fullWidth
                                 helperText={touched.gameId && errors.gameId}
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                                 sx={{ mb: 3 }}
                              />
                              <TextField
                                 name="title"
                                 label="Title"
                                 value={values.title}
                                 error={Boolean(touched.title && errors.title)}
                                 fullWidth
                                 helperText={touched.title && errors.title}
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                                 sx={{ mb: 3 }}
                              />
                              <TextField
                                 name="description"
                                 label="Description"
                                 value={values.description}
                                 error={Boolean(
                                    touched.description && errors.description
                                 )}
                                 fullWidth
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                                 sx={{ mb: 3 }}
                              />
                              <TextField
                                 name="gameProvider"
                                 label="Game Provider"
                                 value={values.gameProvider}
                                 error={Boolean(
                                    touched.gameProvider && errors.gameProvider
                                 )}
                                 fullWidth
                                 helperText={
                                    touched.gameProvider && errors.gameProvider
                                 }
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                                 sx={{ mb: 3 }}
                              />
                              <FormControl
                                 sx={{
                                    width: '100%',
                                    mb: 3,
                                 }}
                              >
                                 <Autocomplete
                                    options={Object.values(GameType)}
                                    sx={{
                                       width: '100%',
                                    }}
                                    value={values.gameType}
                                    onChange={(e, selectedGameType) => {
                                       // Use Formik's setFieldValue to update the 'languages' field
                                       setFieldValue(
                                          'gameType',
                                          selectedGameType
                                       )
                                    }}
                                    renderInput={(params) => (
                                       <TextField
                                          {...params}
                                          label="Game Type"
                                          variant="outlined"
                                          name="gameType"
                                          fullWidth
                                       />
                                    )}
                                 />
                                 {touched.gameType && errors.gameType && (
                                    <ErrorMessage
                                       name={'gameType'}
                                       component={Typography}
                                       className="errorInput"
                                    />
                                 )}
                              </FormControl>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                    mb: 3,
                                 }}
                              >
                                 <Autocomplete
                                    options={Object.values(ConfigType)}
                                    sx={{
                                       width: '100%',
                                    }}
                                    value={values.configType}
                                    onChange={(e, selectedConfigType) => {
                                       // Use Formik's setFieldValue to update the 'languages' field
                                       setFieldValue(
                                          'configType',
                                          selectedConfigType
                                       )
                                    }}
                                    renderInput={(params) => (
                                       <TextField
                                          {...params}
                                          label="Config Type"
                                          variant="outlined"
                                          name="configType"
                                          fullWidth
                                       />
                                    )}
                                 />
                                 {touched.configType && errors.configType && (
                                    <ErrorMessage
                                       name={'configType'}
                                       component={Typography}
                                       className="errorInput"
                                    />
                                 )}
                              </FormControl>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                    mb: 3,
                                 }}
                              >
                                 <Autocomplete
                                    options={Object.values(GameSubtype)}
                                    sx={{
                                       width: '100%',
                                    }}
                                    value={values.gameSubType}
                                    onChange={(e, selectedGameSubType) => {
                                       // Use Formik's setFieldValue to update the 'languages' field
                                       setFieldValue(
                                          'gameSubType',
                                          selectedGameSubType
                                       )
                                    }}
                                    renderInput={(params) => (
                                       <TextField
                                          {...params}
                                          label="Game Sub Type"
                                          variant="outlined"
                                          name="gameSubType"
                                          fullWidth
                                       />
                                    )}
                                 />
                                 {touched.gameSubType && errors.gameSubType && (
                                    <ErrorMessage
                                       name={'gameSubType'}
                                       component={Typography}
                                       className="errorInput"
                                    />
                                 )}
                              </FormControl>
                              <TextField
                                 name="rtp"
                                 label="RTP"
                                 type="number"
                                 value={values.rtp}
                                 error={Boolean(touched.rtp && errors.rtp)}
                                 fullWidth
                                 helperText={touched.rtp && errors.rtp}
                                 onKeyDown={(e) => {
                                    // Allow only numeric keys, backspace, and delete
                                    if (
                                       !(
                                          e.key.match(/^[0-9]$/) ||
                                          e.key === 'Backspace' ||
                                          e.key === 'Delete' ||
                                          (e.ctrlKey && e.key === 'v') ||
                                          (e.key === '.' &&
                                             values.rtp % 1 === 0)
                                       )
                                    ) {
                                       e.preventDefault()
                                    }
                                 }}
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                                 sx={{ mb: 3 }}
                                 inputProps={{
                                    min: 0, // Minimum value
                                 }}
                              />
                              <TextField
                                 name="launchUrl"
                                 label="Launch Url"
                                 value={values.launchUrl}
                                 error={Boolean(
                                    touched.launchUrl && errors.launchUrl
                                 )}
                                 fullWidth
                                 helperText={
                                    touched.launchUrl && errors.launchUrl
                                 }
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                                 sx={{ mb: 3 }}
                              />
                              <FormControl
                                 sx={{
                                    width: '100%',
                                    mb: 3,
                                 }}
                              >
                                 <Autocomplete
                                    options={languagesData}
                                    sx={{
                                       width: '100%',
                                    }}
                                    multiple
                                    value={values.languages}
                                    onChange={(e, selectedLanguages) => {
                                       // Use Formik's setFieldValue to update the 'languages' field
                                       setFieldValue(
                                          'languages',
                                          selectedLanguages
                                       )
                                    }}
                                    renderInput={(params) => (
                                       <TextField
                                          {...params}
                                          label="Select language"
                                          variant="outlined"
                                          name="languages"
                                          fullWidth
                                       />
                                    )}
                                 />
                                 {touched.languages && errors.languages && (
                                    <ErrorMessage
                                       name={'languages'}
                                       component={Typography}
                                       className="errorInput"
                                    />
                                 )}
                              </FormControl>
                              <TextField
                                 name="devices"
                                 label="Devices"
                                 value={values.devices}
                                 multiline
                                 error={Boolean(
                                    touched.devices && errors.devices
                                 )}
                                 fullWidth
                                 helperText={touched.devices && errors.devices}
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                                 sx={{ mb: 3 }}
                              />
                              <TextField
                                 name="jdList"
                                 label="Jurisdiction List"
                                 value={values.jdList}
                                 multiline
                                 error={Boolean(
                                    touched.jdList && errors.jdList
                                 )}
                                 fullWidth
                                 helperText={touched.jdList && errors.jdList}
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                                 sx={{ mb: 3 }}
                              />
                              <FormControl variant="standard" fullWidth>
                                 <FormGroup sx={{ width: 'fit-content' }}>
                                    <Field
                                       type="checkbox"
                                       name="hasChat"
                                       value={values.hasChat}
                                       as={FormControlLabel}
                                       control={
                                          <Checkbox checked={values.hasChat} />
                                       }
                                       label={'Has Chat'}
                                    />
                                 </FormGroup>
                              </FormControl>
                              <FormControl variant="standard" fullWidth>
                                 <FormGroup sx={{ width: 'fit-content' }}>
                                    <Field
                                       type="checkbox"
                                       name="hasTournament"
                                       value={values.hasTournament}
                                       as={FormControlLabel}
                                       control={
                                          <Checkbox
                                             checked={values.hasTournament}
                                          />
                                       }
                                       label={'Has Tournament'}
                                    />
                                 </FormGroup>
                              </FormControl>
                              <FormControl variant="standard" fullWidth>
                                 <FormGroup sx={{ width: 'fit-content' }}>
                                    <Field
                                       type="checkbox"
                                       name="isMultiplayer"
                                       value={values.isMultiplayer}
                                       as={FormControlLabel}
                                       control={
                                          <Checkbox
                                             checked={values.isMultiplayer}
                                          />
                                       }
                                       label={'Is Multiplayer'}
                                    />
                                 </FormGroup>
                              </FormControl>
                              <FormControl variant="standard" fullWidth>
                                 <FormGroup sx={{ width: 'fit-content' }}>
                                    <Field
                                       type="checkbox"
                                       name="isLive"
                                       value={values.isLive}
                                       as={FormControlLabel}
                                       control={
                                          <Checkbox checked={values.isLive} />
                                       }
                                       label={'Live'}
                                    />
                                 </FormGroup>
                              </FormControl>
                              <FormControl variant="standard" fullWidth>
                                 <FormGroup sx={{ width: 'fit-content' }}>
                                    <Field
                                       type="checkbox"
                                       name="isPrivate"
                                       value={values.isPrivate}
                                       as={FormControlLabel}
                                       control={
                                          <Checkbox
                                             checked={values.isPrivate}
                                          />
                                       }
                                       label={'Private'}
                                    />
                                 </FormGroup>
                              </FormControl>
                           </Box>
                           <DialogActions>
                              <Button
                                 onClick={handleCloseNewGame}
                                 color="error"
                              >
                                 Cancel
                              </Button>
                              <Button
                                 type="submit"
                                 color="success"
                                 variant="contained"
                              >
                                 Save
                              </Button>
                           </DialogActions>
                        </form>
                     )}
                  </Formik>
               </Dialog> */}
            </Toolbar>
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

GamesV2.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Games V2 List">{page}</DashboardLayout>
}

export default GamesV2
