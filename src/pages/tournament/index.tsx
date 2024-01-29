import CustomLoader from '@/components/custom/CustomLoader'
import HeaderFilterToolbar from '@/components/custom/HeaderFilterToolbar'
import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar'
import MoreFiltersButton from '@/components/custom/MoreFiltersButton'
import { FilterChip } from '@/components/custom/PortalFilterChips'
import TransitionSlide from '@/components/custom/TransitionSlide'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import TournamentCurrencies from '@/components/data/tournament/currencies'
import { useAddTournamentMutation } from '@/components/data/tournament/lib/hooks/queries'
import AllTournamentList from '@/components/data/tournament/tournament-list-grid'
import AllTournamentNewIdsList from '@/components/data/tournament/tournament-new-ids-list-grid'
import {
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front'
import { AddTournamentDto } from '@alienbackoffice/back-front/lib/tournament/dto/add-tournament.dto'
import { TournamentCurrencyConditionItem } from '@alienbackoffice/back-front/lib/tournament/interfaces/tournament-currency-condition-item.interface'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faAdd,
   faAngleDown,
   faArrowsRotate,
   faCalendar,
   faRectangleXmark,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Checkbox,
   Dialog,
   DialogActions,
   DialogContent,
   FormControl,
   FormControlLabel,
   FormGroup,
   Grid,
   InputLabel,
   MenuItem,
   Button as MuiButton,
   Select,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { spacing } from '@mui/system'
import { DateTimePicker, renderTimeViewClock } from '@mui/x-date-pickers'
import { darkPurple } from 'colors'
import { Formik } from 'formik'
import moment from 'moment'
import React, { ReactElement, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   saveTournament,
   selectAuthBrandsList,
   selectAuthOperators,
   selectAuthUser,
} from 'redux/authSlice'
import { saveLoadingTournament } from 'redux/loadingSlice'
import { getCrashConfig } from 'redux/slices/crashConfig'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { hasDetailsPermission } from 'services/permissionHandler'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'
import DashboardLayout from '../../layouts/Dashboard'

const Button = styled(MuiButton)(spacing)

const filterInitialState = {
   currencies: '',
   title: '',
   tournamentId: '',
   gameId: '',
}
const timedifference = new Date().getTimezoneOffset()
const timezoneOffset = store.getState().crashConfig.timezoneOffset

function TournamentList() {
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const [openFilter, setOpenFilter] = React.useState(false)
   const [transitionFilter, setTransitionFilter]: any = React.useState()
   const [filters, setFilters] = React.useState(filterInitialState)
   const [filtersInput, setFiltersInput] = React.useState(filterInitialState)
   const [filterChips, setFilterChips] = React.useState<FilterChip[]>([])
   const [currencyConditionsValues, setCurrencyConditionsValues] =
      React.useState<TournamentCurrencyConditionItem[]>([])
   const boClient = useSelector(selectBoClient)
   const user = useSelector(selectAuthUser) as User
   const [autoRefresh, setAutoRefresh] = React.useState(0)
   const brandsList = useSelector(selectAuthBrandsList)
   const brands = brandsList
   const [ignore, setIgnore] = React.useState(false)
   const [Transition, setTransition]: any = React.useState()
   const [open, setOpen] = React.useState(false)
   const timezone = useSelector(getCrashConfig).timezone
   const [boxRefrech, setBoxRefrech] = React.useState(0)
   const operators = useSelector(selectAuthOperators)
   const [initialValues, setInitialValues] = React.useState({
      title: '',
      description: '',
      from: moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
      to: moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
      opIds: [],
      brandIds: [],
      gameIds: '',
      prizes: '',
      currencyConditions: [],
      uniqueWinnerOnly: false,
      winnersCount: 0,
      includeTestPlayers: false,
      includeFunPlayers: false,
      includeBlockedPlayers: false,
      excludedPlayerIds: '',
      excludedBrandIds: [],
      excludedOpIds: [],
   })

   const { mutate } = useAddTournamentMutation({
      onSuccess: () => {
         toast.success('You Added the tournament successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         handleClose()
         setBoxRefrech(boxRefrech + 1)
      },
      onError(error, variables, context) {
         const dataRows: any[] = []
      },
   })

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

   const handleCloseFilter = () => {
      setOpenFilter(false)
   }

   const handleClickOpenFilter = () => {
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
            <TextField
               label="Tournament ID"
               type="text"
               value={filtersInput.tournamentId}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     tournamentId: e.target.value,
                  }))
               }}
               autoComplete="off"
            />
            <TextField
               label="Title"
               type="text"
               value={filtersInput.title}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     title: e.target.value,
                  }))
               }}
               autoComplete="off"
            />
            <TextField
               label="Game ID"
               type="text"
               value={filtersInput.gameId}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     gameId: e.target.value,
                  }))
               }}
               autoComplete="off"
            />
         </MoreFiltersButton>
      )
   }

   const handleClickOpen = () => {
      setTransition(TransitionSlide)
      setOpen(true)
      setCurrencyConditionsValues([])
      setInitialValues({
         title: '',
         description: '',
         from: moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
         to: moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
         opIds: [],
         brandIds: [],
         gameIds: '',
         prizes: '',
         currencyConditions: [],
         uniqueWinnerOnly: false,
         winnersCount: 0,
         includeTestPlayers: false,
         includeFunPlayers: false,
         includeBlockedPlayers: false,
         excludedPlayerIds: '',
         excludedBrandIds: [],
         excludedOpIds: [],
      })
   }

   const handleClose = async () => {
      setOpen(false)
   }

   const handleSubmitMethods = React.useCallback(
      (dto: AddTournamentDto) => {
         mutate({ dto })
      },
      [mutate, currencyConditionsValues]
   )

   const handleSubmit = React.useCallback(
      (newTournament: {
         title: string
         description?: string
         from: string
         to: string
         opIds?: string[]
         brandIds?: string[]
         gameIds?: string
         prizes: string
         currencyConditions: TournamentCurrencyConditionItem[]
         uniqueWinnerOnly: boolean
         winnersCount: number
         includeTestPlayers?: boolean
         includeFunPlayers?: boolean
         includeBlockedPlayers?: boolean
         excludedPlayerIds?: string
         excludedBrandIds?: string[]
         excludedOpIds?: string[]
      }) => {
         const from =
            moment(newTournament.from).valueOf() -
            timedifference * 60 * 1000 +
            timezoneOffset * 60 * 1000
         const to =
            moment(newTournament.to).valueOf() -
            timedifference * 60 * 1000 +
            timezoneOffset * 60 * 1000
         const dto: AddTournamentDto = {
            title: newTournament.title,
            from: from,
            to: to,
            prizes: newTournament.prizes.split(/\r?\n/),
            currencyConditions: currencyConditionsValues,
            uniqueWinnerOnly: newTournament.uniqueWinnerOnly,
            winnersCount: newTournament.winnersCount,
            includeTestPlayers: newTournament.includeTestPlayers,
            includeBlockedPlayers: newTournament.includeBlockedPlayers,
            includeFunPlayers: newTournament.includeFunPlayers,
            excludedPlayerIds:
               newTournament.excludedPlayerIds?.split(/\r?\n/) || [],
            gameIds: newTournament.gameIds?.split(/\r?\n/) || [],
         }
         if (newTournament.description && newTournament.description !== '') {
            dto.description = newTournament.description
         }
         if (newTournament.opIds) {
            dto.opIds = newTournament.opIds
         }
         if (newTournament.brandIds) {
            dto.brandIds =
               newTournament.opIds?.length === 1 ? newTournament.brandIds : []
         }

         if (newTournament.excludedBrandIds) {
            dto.excludedBrandIds =
               newTournament.opIds?.length === 1
                  ? newTournament.excludedBrandIds
                  : []
         }
         if (newTournament.excludedOpIds) {
            dto.excludedOpIds = newTournament.excludedOpIds
         }
         handleSubmitMethods(dto)
      },
      [currencyConditionsValues]
   )

   const setCurrencyConditions = (
      currencyConditions: TournamentCurrencyConditionItem[]
   ) => {
      setCurrencyConditionsValues(currencyConditions)
   }

   useEffect(() => {
      if (!ignore) {
         store.dispatch(saveLoadingTournament(true))
         store.dispatch(saveTournament({}))
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   })

   useEffect(() => {
      setFilterChips([
         { key: 1, label: 'Currency', value: filters.currencies },
         { key: 2, label: 'Title', value: filters.title },
         { key: 3, label: 'Game ID', value: filters.gameId },
         { key: 4, label: 'Tournament Id', value: filters.tournamentId },
      ])
      setFiltersInput(filters)
   }, [filters])

   return (
      <React.Fragment>
         <Helmet title="iMoon | Tournament List" />
         {isDesktop ? (
            <CustomOperatorsBrandsToolbar
               title={'Tournament List'}
               filter={
                  [UserScope.OPERATOR, UserScope.BRAND].includes(user?.scope)
                     ? false
                     : true
               }
               handleFilter={moreFiltersBtn}
               sx={{
                  mb:
                     filterChips.filter(
                        (chip) => chip.value && chip.value !== 'all'
                     ).length > 0
                        ? 0
                        : '12px',
               }}
               background={theme.palette.secondary.dark}
               actions={
                  <>
                     {hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_ADD_TOURNAMENT_REQ
                     ) &&
                        [UserScope.SUPERADMIN, UserScope.ADMIN].includes(
                           user?.scope
                        ) && (
                           <Grid item>
                              <Button
                                 onClick={() => handleClickOpen()}
                                 color="info"
                                 variant="contained"
                                 sx={{
                                    fontSize: 12,
                                    fontFamily: 'Nunito Sans SemiBold',
                                    borderRadius: '8px',
                                    p: '4px',
                                    px: '8px',
                                    '&:hover': {
                                       background: '#8098F9',
                                    },
                                    padding: '4px 8px',
                                    letterSpacing: '0.48px',
                                    gap: '2px',
                                    height: '28px',
                                 }}
                              >
                                 {' '}
                                 <FontAwesomeIcon
                                    icon={faAdd as IconProp}
                                    fixedWidth
                                    fontSize={12}
                                    height={'initial'}
                                    width={'12px'}
                                 />{' '}
                                 New Tournament
                              </Button>
                           </Grid>
                        )}
                     <Grid item>
                        <Button
                           onClick={() => setAutoRefresh(autoRefresh + 1)}
                           color="primary"
                           variant={isDesktop ? 'outlined' : 'text'}
                           sx={{
                              p: isDesktop ? '4px 8px 4px 8px' : 0,
                              borderRadius: '8px',
                              height: '28px',
                              justifyContent: isDesktop ? 'initial' : 'end',
                              minWidth: 'auto !important',
                              borderColor: `${darkPurple[12]} !important`,
                              svg: {
                                 width: '16px !important',
                              },
                              gap: '10px',
                           }}
                        >
                           <FontAwesomeIcon
                              icon={faArrowsRotate as IconProp}
                              fixedWidth
                              fontSize={'16px'}
                              color={darkPurple[12]}
                           />
                           {isDesktop && (
                              <Typography
                                 component="p"
                                 variant="button"
                                 fontFamily={'Nunito Sans SemiBold'}
                                 fontSize={'14px'}
                                 whiteSpace="nowrap"
                                 color={darkPurple[12]}
                              >
                                 Refresh
                              </Typography>
                           )}
                        </Button>
                     </Grid>
                  </>
               }
            />
         ) : (
            <>
               <CustomOperatorsBrandsToolbar
                  title={'Tournament List'}
                  filter={
                     [UserScope.OPERATOR, UserScope.BRAND].includes(user?.scope)
                        ? false
                        : true
                  }
                  actions={
                     <Grid item>
                        <Button
                           onClick={() => setAutoRefresh(autoRefresh + 1)}
                           color="primary"
                           variant={'text'}
                           sx={{
                              p: 0,
                              height: '28px',
                              justifyContent: 'end',
                              minWidth: 'auto !important',
                              ml: '5px',
                              borderColor: `${darkPurple[12]} !important`,
                              svg: {
                                 width: '16px !important',
                              },
                              gap: '10px',
                           }}
                        >
                           <FontAwesomeIcon
                              icon={faArrowsRotate as IconProp}
                              fixedWidth
                              fontSize={'16px'}
                              color={darkPurple[12]}
                           />
                        </Button>
                     </Grid>
                  }
               />
               <HeaderFilterToolbar
                  filterChips={filterChips}
                  handleDeleteChip={handleDeleteChip}
                  moreFiltersBtn={moreFiltersBtn}
                  sx={{
                     mb:
                        filterChips.filter(
                           (chip) => chip.value && chip.value !== 'all'
                        ).length > 0
                           ? 0
                           : '6px',
                  }}
                  actions={
                     <>
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_ADD_TOURNAMENT_REQ
                        ) && (
                           <Grid item>
                              <Button
                                 onClick={() => handleClickOpen()}
                                 color="info"
                                 variant="contained"
                                 sx={{
                                    fontSize: 12,
                                    fontFamily: 'Nunito Sans SemiBold',
                                    borderRadius: '8px',
                                    p: '4px',
                                    px: '8px',
                                    '&:hover': {
                                       background: '#8098F9',
                                    },
                                    padding: '4px 8px',
                                    letterSpacing: '0.48px',
                                    gap: '2px',
                                    height: '28px',
                                 }}
                              >
                                 {' '}
                                 <FontAwesomeIcon
                                    icon={faAdd as IconProp}
                                    fixedWidth
                                    fontSize={12}
                                    height={'initial'}
                                    width={'12px'}
                                 />{' '}
                                 New Tournament
                              </Button>
                           </Grid>
                        )}
                     </>
                  }
               />
            </>
         )}
         {filterChips.filter((chip) => chip.value && chip.value !== 'all')
            .length > 0 && (
            <HeaderTitleToolbar
               filterChips={filterChips}
               handleDeleteChip={handleDeleteChip}
               sx={{
                  '.MuiStack-root': {
                     maxWidth: '100%',
                  },
               }}
            />
         )}
         {ignore ? (
            [UserScope.OPERATOR, UserScope.BRAND].includes(user?.scope) ? (
               <AllTournamentNewIdsList
                  key={boxRefrech}
                  autoRefresh={autoRefresh}
               />
            ) : (
               <AllTournamentList
                  key={boxRefrech}
                  title={filters.title}
                  currency={filters.currencies}
                  tournamentId={filters.tournamentId}
                  gameId={filters.gameId}
                  autoRefresh={autoRefresh}
               />
            )
         ) : (
            <CustomLoader />
         )}

         <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            sx={{ '.MuiPaper-root': { p: '12px 4px!important' } }}
            fullScreen
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
                     Add new tournament
                  </Typography>
               </Grid>
               <Grid item xs></Grid>
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleClose}
                     cursor={'pointer'}
                  />
               </Grid>
            </Grid>
            <DialogContent
               sx={{
                  p: 1,
                  '.MuiPaper-root': {
                     p: '0 !important',
                  },
               }}
            >
               <TournamentCurrencies
                  data={initialValues?.currencyConditions || []}
                  setPackages={setCurrencyConditions}
               />
               <Formik
                  initialValues={initialValues}
                  enableReinitialize={true}
                  validationSchema={Yup.object().shape({
                     title: Yup.string().required('title is required'),
                     from: Yup.string().required('From is required'),
                     prizes: Yup.string().required('prizes is required'),
                     to: Yup.string()
                        .required('To is required')
                        .test(
                           'is-greater-than-from',
                           'To should be greater than From ',
                           function (value) {
                              const { from } = this.parent
                              return (
                                 !from ||
                                 !value ||
                                 moment(from).utc().unix() <=
                                    moment(value).utc().unix()
                              )
                           }
                        ),
                     winnersCount: Yup.number()
                        .required('winners count is required')
                        .min(0, 'winners count should be at least 0'),
                  })}
                  onSubmit={handleSubmit}
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
                     <form
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                     >
                        <TextField
                           name="title"
                           label="Title "
                           type="text"
                           value={values.title}
                           error={Boolean(touched.title && errors.title)}
                           autoComplete="off"
                           fullWidth
                           helperText={touched.title && errors.title}
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        <TextField
                           name="description"
                           label="Description"
                           type="text"
                           value={values.description}
                           error={Boolean(
                              touched.description && errors.description
                           )}
                           autoComplete="off"
                           fullWidth
                           helperText={
                              touched.description && errors.description
                           }
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        <DateTimePicker
                           sx={{
                              width: '100%',
                           }}
                           slots={{
                              openPickerIcon: () => (
                                 <FontAwesomeIcon
                                    icon={faCalendar as IconProp}
                                 />
                              ),
                           }}
                           viewRenderers={{
                              hours: renderTimeViewClock,
                              minutes: renderTimeViewClock,
                              seconds: renderTimeViewClock,
                           }}
                           label="From"
                           format="yyyy-MM-dd HH:mm:ss"
                           value={
                              new Date(
                                 moment(values.from).format(
                                    'YYYY-MM-DD HH:mm:ss'
                                 )
                              )
                           }
                           slotProps={{
                              textField: {
                                 variant: 'outlined',
                                 error: Boolean(
                                    (touched.to || touched.from) && errors.from
                                 ),
                                 helperText:
                                    (touched.to || touched.from) && errors.from,
                              },
                           }}
                           onChange={(e, newValue) => {
                              // Use Formik's setFieldValue to update the 'languages' field
                              setFieldValue('from', e)
                           }}
                           className="custom-icon-datetime-picker"
                        />
                        <DateTimePicker
                           ampm={false}
                           sx={{
                              width: '100%',
                           }}
                           slots={{
                              openPickerIcon: () => (
                                 <FontAwesomeIcon
                                    icon={faCalendar as IconProp}
                                 />
                              ),
                           }}
                           viewRenderers={{
                              hours: renderTimeViewClock,
                              minutes: renderTimeViewClock,
                              seconds: renderTimeViewClock,
                           }}
                           label="To"
                           format="yyyy-MM-dd HH:mm:ss"
                           value={
                              new Date(
                                 moment(values.to).format('YYYY-MM-DD HH:mm:ss')
                              )
                           }
                           onChange={(e, newValue) => {
                              // Use Formik's setFieldValue to update the 'languages' field
                              setFieldValue('to', e)
                           }}
                           slotProps={{
                              textField: {
                                 variant: 'outlined',
                                 error: Boolean(
                                    (touched.to || touched.from) && errors.to
                                 ),
                                 helperText:
                                    (touched.to || touched.from) && errors.to,
                              },
                           }}
                           className="custom-icon-datetime-picker"
                        />
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_OPERATOR_LIST_REQ
                        ) && (
                           <>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                 }}
                              >
                                 <InputLabel id="demo-simple-select-disabled-label">
                                    Operators
                                 </InputLabel>
                                 <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Operators"
                                    sx={{
                                       width: '100%',
                                    }}
                                    multiple
                                    value={values.opIds}
                                    name="opIds"
                                    IconComponent={(_props) => {
                                       return (
                                          <FontAwesomeIcon
                                             icon={faAngleDown as IconProp}
                                             size="sm"
                                             className="selectIcon"
                                          />
                                       )
                                    }}
                                    onChange={(e) => {
                                       hasDetailsPermission(
                                          UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ
                                       ) &&
                                          e.target.value.length === 1 &&
                                          boClient?.operator?.getOperatorBrands(
                                             { opId: e.target.value[0] },
                                             {
                                                uuid: uuidv4(),
                                                meta: {
                                                   ts: new Date(),
                                                   type: 'list',
                                                   sessionId:
                                                      sessionStorage.getItem(
                                                         'sessionId'
                                                      ),
                                                   event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ,
                                                },
                                             }
                                          )
                                       handleChange(e)
                                    }}
                                 >
                                    {operators &&
                                       operators.operators?.map(
                                          (item, index: number) => {
                                             return (
                                                <MenuItem
                                                   key={`operators${index}`}
                                                   value={item.opId}
                                                >
                                                   {item.opId}-{item.title}
                                                </MenuItem>
                                             )
                                          }
                                       )}
                                 </Select>
                              </FormControl>
                              <FormControl
                                 sx={{
                                    width: '100%',
                                 }}
                              >
                                 <InputLabel id="demo-simple-select-disabled-label">
                                    Excluded Operators
                                 </InputLabel>
                                 <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Excluded Operators"
                                    sx={{
                                       width: '100%',
                                    }}
                                    multiple
                                    value={values.excludedOpIds}
                                    name="excludedOpIds"
                                    onChange={handleChange}
                                    IconComponent={(_props) => {
                                       return (
                                          <FontAwesomeIcon
                                             icon={faAngleDown as IconProp}
                                             size="sm"
                                             className="selectIcon"
                                          />
                                       )
                                    }}
                                 >
                                    {operators &&
                                       operators.operators?.map(
                                          (item, index: number) => {
                                             return (
                                                <MenuItem
                                                   key={`excludedOperators${index}`}
                                                   value={item.opId}
                                                >
                                                   {item.opId}-{item.title}
                                                </MenuItem>
                                             )
                                          }
                                       )}
                                 </Select>
                              </FormControl>
                           </>
                        )}
                        {brands && brands?.length > 0 && (
                           <>
                              {values.opIds?.length === 1 && (
                                 <FormControl
                                    sx={{
                                       width: '100%',
                                    }}
                                 >
                                    <InputLabel id="demo-simple-select-disabled-label">
                                       Brands
                                    </InputLabel>
                                    <Select
                                       labelId="demo-simple-select-label"
                                       id="demo-simple-select"
                                       label="Excluded Brands"
                                       sx={{
                                          width: '100%',
                                       }}
                                       multiple
                                       value={values.brandIds}
                                       name="brandIds"
                                       onChange={handleChange}
                                       IconComponent={(_props) => {
                                          return (
                                             <FontAwesomeIcon
                                                icon={faAngleDown as IconProp}
                                                size="sm"
                                                className="selectIcon"
                                             />
                                          )
                                       }}
                                    >
                                       {brands?.map((item, index: number) => {
                                          return (
                                             <MenuItem
                                                key={`brand${index}`}
                                                value={item.brandId}
                                             >
                                                {item.brandId}-{item.brandName}
                                             </MenuItem>
                                          )
                                       })}
                                    </Select>
                                 </FormControl>
                              )}
                              {values.opIds?.length === 1 && (
                                 <FormControl
                                    sx={{
                                       width: '100%',
                                    }}
                                 >
                                    <InputLabel id="demo-simple-select-disabled-label">
                                       Excluded Brands
                                    </InputLabel>
                                    <Select
                                       labelId="demo-simple-select-label"
                                       id="demo-simple-select"
                                       label="Excluded Brands"
                                       sx={{
                                          width: '100%',
                                       }}
                                       multiple
                                       value={values.excludedBrandIds}
                                       name="excludedBrandIds"
                                       onChange={handleChange}
                                       IconComponent={(_props) => {
                                          return (
                                             <FontAwesomeIcon
                                                icon={faAngleDown as IconProp}
                                                size="sm"
                                                className="selectIcon"
                                             />
                                          )
                                       }}
                                    >
                                       {brands?.map((item, index: number) => {
                                          return (
                                             <MenuItem
                                                key={`Excludedbrand${index}`}
                                                value={item.brandId}
                                             >
                                                {item.brandId}-{item.brandName}
                                             </MenuItem>
                                          )
                                       })}
                                    </Select>
                                 </FormControl>
                              )}
                           </>
                        )}
                        <TextField
                           name="gameIds"
                           label="game Ids"
                           type="text"
                           value={values.gameIds}
                           error={Boolean(touched.gameIds && errors.gameIds)}
                           multiline
                           autoComplete="off"
                           fullWidth
                           helperText={touched.gameIds && errors.gameIds}
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        <TextField
                           name="prizes"
                           label="prizes"
                           type="text"
                           value={values.prizes}
                           error={Boolean(touched.prizes && errors.prizes)}
                           multiline
                           autoComplete="off"
                           fullWidth
                           helperText={touched.prizes && errors.prizes}
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        <TextField
                           name="excludedPlayerIds"
                           label="Excluded Players ID"
                           type="text"
                           value={values.excludedPlayerIds}
                           error={Boolean(
                              touched.excludedPlayerIds && errors.gameIds
                           )}
                           multiline
                           autoComplete="off"
                           fullWidth
                           helperText={
                              touched.excludedPlayerIds &&
                              errors.excludedPlayerIds
                           }
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        <TextField
                           name="winnersCount"
                           label="Winners Count"
                           value={values.winnersCount}
                           error={Boolean(
                              touched.winnersCount && errors?.winnersCount
                           )}
                           fullWidth
                           type="number"
                           helperText={
                              touched?.winnersCount && errors?.winnersCount
                           }
                           inputProps={{
                              min: 0,
                           }}
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        <FormControl
                           component="fieldset"
                           variant="standard"
                           fullWidth
                        >
                           <FormGroup>
                              <FormControlLabel
                                 sx={{
                                    width: 'max-content',
                                 }}
                                 control={
                                    <Checkbox
                                       checked={Boolean(
                                          values.uniqueWinnerOnly
                                       )}
                                       onChange={handleChange}
                                       name="uniqueWinnerOnly"
                                    />
                                 }
                                 label="Unique Winner Only"
                              />
                           </FormGroup>
                        </FormControl>
                        <FormControl
                           component="fieldset"
                           variant="standard"
                           fullWidth
                        >
                           <FormGroup>
                              <FormControlLabel
                                 sx={{
                                    width: 'max-content',
                                 }}
                                 control={
                                    <Checkbox
                                       checked={Boolean(
                                          values.includeTestPlayers
                                       )}
                                       onChange={handleChange}
                                       name="includeTestPlayers"
                                    />
                                 }
                                 label="Include Test Players"
                              />
                           </FormGroup>
                        </FormControl>
                        <FormControl
                           component="fieldset"
                           variant="standard"
                           fullWidth
                        >
                           <FormGroup>
                              <FormControlLabel
                                 sx={{
                                    width: 'max-content',
                                 }}
                                 control={
                                    <Checkbox
                                       checked={Boolean(
                                          values.includeFunPlayers
                                       )}
                                       onChange={handleChange}
                                       name="includeFunPlayers"
                                    />
                                 }
                                 label="Include Fun Players"
                              />
                           </FormGroup>
                        </FormControl>
                        <FormControl
                           component="fieldset"
                           variant="standard"
                           fullWidth
                        >
                           <FormGroup>
                              <FormControlLabel
                                 sx={{
                                    width: 'max-content',
                                 }}
                                 control={
                                    <Checkbox
                                       checked={Boolean(
                                          values.includeBlockedPlayers
                                       )}
                                       onChange={handleChange}
                                       name="includeBlockedPlayers"
                                    />
                                 }
                                 label="Include Blocked Players"
                              />
                           </FormGroup>
                        </FormControl>
                        <DialogActions>
                           <Button
                              onClick={handleClose}
                              color="secondary"
                              variant="outlined"
                              sx={{ height: 32, borderColor: darkPurple[10] }}
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
                     </form>
                  )}
               </Formik>
            </DialogContent>
         </Dialog>
      </React.Fragment>
   )
}

TournamentList.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Tournament List">{page}</DashboardLayout>
}

export default TournamentList
