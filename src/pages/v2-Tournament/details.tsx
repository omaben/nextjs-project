import CustomLoader from '@/components/custom/CustomLoader'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import {
   useAddTournamentV2Mutation,
   useGetTournamentV2Query,
   useSetTournamentV2Mutation,
} from '@/components/data/tournament/lib/hooks/queries'
import {
   AddTournamentV2Dto,
   Currency,
   SetTournamentV2Dto,
   TournamentV2,
   TournamentV2CurrencyConditionItem,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faAdd,
   faAngleDown,
   faCalendar,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Autocomplete,
   Button,
   Card,
   CardContent,
   Checkbox,
   DialogActions,
   FormControl,
   FormControlLabel,
   FormGroup,
   FormHelperText,
   Grid,
   InputAdornment,
   InputLabel,
   MenuItem,
   Select,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableRow,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { DateTimePicker, renderTimeViewClock } from '@mui/x-date-pickers'
import { darkPurple } from 'colors'
import { ErrorMessage, Field, FieldArray, Formik } from 'formik'
import moment from 'moment'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   selectAuthBrandsList,
   selectAuthCurrenciesInit,
   selectAuthOperators,
   selectAuthTournamentV2Details,
} from 'redux/authSlice'
import { getCrashConfig } from 'redux/slices/crashConfig'
import { selectBoClient } from 'redux/socketSlice'
import {
   PageWith2Toolbar,
   PageWithdetails3Toolbar,
   handleConvertToUSD,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import { v4 as uuidv4 } from 'uuid'
import { array, number, object, string } from 'yup'
import DashboardLayout from '../../layouts/Dashboard'

function DetailsTournamentV2() {
   const router = useRouter()
   const theme = useTheme()
   const { id } = router.query
   const boClient = useSelector(selectBoClient)
   const brandsList = useSelector(selectAuthBrandsList)
   const brands = brandsList
   const timedifference = new Date().getTimezoneOffset()
   const timezoneOffset = useSelector(getCrashConfig).timezoneOffset
   const operators = useSelector(selectAuthOperators)
   const [ignore, setIgnore] = React.useState(false)
   const [autoRefresh, setAutoRefresh] = React.useState(0)
   const timezone = useSelector(getCrashConfig).timezone
   const [initialValues, setInitialValues] = React.useState({
      tournamentId: '',
      title: '',
      description: '',
      from: moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
      to: moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
      opIds: [] as string[],
      brandIds: [] as string[],
      gameIds: '',
      currencyConditions: [
         {
            currency: '',
            minBetAmount: 0,
            prizes: '',
         },
      ] as {
         currency: string
         minBetAmount: number
         prizes: string
      }[],
      uniqueWinnerOnly: false,
      winnersCount: 0,
      includeTestPlayers: false,
      includeFunPlayers: false,
      includeBlockedPlayers: false,
      excludedPlayerIds: '',
      excludedBrandIds: [] as string[],
      excludedOpIds: [] as string[],
   })
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isMobile = useMediaQuery(theme.breakpoints.up(400))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const data = useSelector(selectAuthTournamentV2Details) as TournamentV2
   useGetTournamentV2Query({ tournamentId: id as string })
   const currenciesInit = useSelector(selectAuthCurrenciesInit) as Currency[]
   const packageGroup = { currency: '', minBetAmount: 0, prizes: '' }

   const { mutate } = useSetTournamentV2Mutation({
      onSuccess: () => {
         toast.success('You Edit the tournament successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
      }
   })

   const { mutate: mutateAdd } = useAddTournamentV2Mutation({
      onSuccess: () => {
         toast.success('You Added the tournament successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         router.push('/v2-Tournament')
      },
   })

   const handleSubmitMethods = React.useCallback(
      (dto: SetTournamentV2Dto) => {
         mutate({ dto })
      },
      [mutate]
   )

   const handleSubmitAddMethods = React.useCallback(
      (dto: AddTournamentV2Dto) => {
         mutateAdd({ dto })
      },
      [mutateAdd]
   )

   const handleSubmitValues = React.useCallback(
      async (newTournament: {
         tournamentId: string
         title: string
         description: string
         from: string
         to: string
         opIds?: string[]
         brandIds?: string[]
         gameIds?: string
         currencyConditions: {
            currency: string
            minBetAmount: number
            prizes: string
         }[]
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
         const currencyConditions: TournamentV2CurrencyConditionItem[] = []
         newTournament.currencyConditions.map((item) => {
            if (item.currency !== '' && item.prizes !== '') {
               currencyConditions.push({
                  ...item,
                  prizes: item.prizes?.split(/\r?\n/) as string[],
               })
            }
         })
         if (id) {
            const dto: SetTournamentV2Dto = {
               tournamentId: newTournament.tournamentId,
               title: newTournament.title,
               from: from,
               to: to,
               currencyConditions: currencyConditions,
               uniqueWinnerOnly: newTournament.uniqueWinnerOnly,
               winnersCount: newTournament.winnersCount,
               includeTestPlayers: newTournament.includeTestPlayers,
               includeBlockedPlayers: newTournament.includeBlockedPlayers,
               includeFunPlayers: newTournament.includeFunPlayers,
            }
            if (
               newTournament.gameIds !== '' &&
               newTournament.gameIds?.split(/\r?\n/)
            ) {
               dto.gameIds = newTournament.gameIds?.split(/\r?\n/)
            }
            if (
               newTournament.excludedPlayerIds !== '' &&
               newTournament.excludedPlayerIds?.split(/\r?\n/)
            ) {
               dto.excludedPlayerIds =
                  newTournament.excludedPlayerIds?.split(/\r?\n/) || []
            }
            if (newTournament.description && newTournament.description !== '') {
               dto.description = newTournament.description
            }
            if (newTournament.opIds) {
               dto.opIds = newTournament.opIds
            }
            if (newTournament.brandIds) {
               dto.brandIds =
                  newTournament.opIds?.length === 1
                     ? newTournament.brandIds
                     : []
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
         } else {
            const dto: AddTournamentV2Dto = {
               title: newTournament.title,
               from: from,
               to: to,
               currencyConditions: currencyConditions,
               uniqueWinnerOnly: newTournament.uniqueWinnerOnly,
               winnersCount: newTournament.winnersCount,
               includeTestPlayers: newTournament.includeTestPlayers,
               includeBlockedPlayers: newTournament.includeBlockedPlayers,
               includeFunPlayers: newTournament.includeFunPlayers,
            }
            if (
               newTournament.gameIds !== '' &&
               newTournament.gameIds?.split(/\r?\n/)
            ) {
               dto.gameIds = newTournament.gameIds?.split(/\r?\n/)
            }
            if (
               newTournament.excludedPlayerIds !== '' &&
               newTournament.excludedPlayerIds?.split(/\r?\n/)
            ) {
               dto.excludedPlayerIds =
                  newTournament.excludedPlayerIds?.split(/\r?\n/) || []
            }
            if (newTournament.description && newTournament.description !== '') {
               dto.description = newTournament.description
            }
            if (newTournament.opIds) {
               dto.opIds = newTournament.opIds
            }
            if (newTournament.brandIds) {
               dto.brandIds =
                  newTournament.opIds?.length === 1
                     ? newTournament.brandIds
                     : []
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
            handleSubmitAddMethods(dto)
         }
      },
      []
   )

   useEffect(() => {
      if (id && data) {
         const dataPackage: {
            currency: string
            minBetAmount: number
            prizes: string
         }[] = data?.currencyConditions?.map((item) => {
            return {
               ...item,
               prizes: item.prizes?.join('\n') || '',
            }
         })
         setInitialValues({
            tournamentId: data.tournamentId,
            title: data.title,
            from: moment(data.from).tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
            to: moment(data.to).tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
            includeTestPlayers: data.includeTestPlayers || false,
            description: data.description || '',
            gameIds: data.gameIds?.join('\n') || '',
            opIds: data.opIds || [],
            brandIds: data.brandIds || [],
            currencyConditions: dataPackage,
            uniqueWinnerOnly: data.uniqueWinnerOnly || false,
            winnersCount: data.winnersCount,
            includeFunPlayers: data.includeFunPlayers || false,
            includeBlockedPlayers: data.includeBlockedPlayers || false,
            excludedPlayerIds: data.excludedPlayerIds?.join('\n') || '',
            excludedBrandIds: data.excludedBrandIds || [],
            excludedOpIds: data.excludedOpIds || [],
         })
      }
   }, [data, autoRefresh, id])

   useEffect(() => {
      if (!ignore) {
         setTimeout(() => {
            setIgnore(true)
         }, 1000)
      }
   })

   return (
      <React.Fragment>
         <Helmet
            title={id ? 'Tournament V2 Details' : 'Add new tournament V2'}
         />
         <CustomOperatorsBrandsToolbar
            title={id ? 'Tournament V2 Details' : 'Add new tournament V2'}
            background={
               isDesktop
                  ? theme.palette.secondary.dark
                  : theme.palette.primary.main
            }
         />
         {ignore ? (
            <Grid
               item
               xs={12}
               p={isDesktop ? '12px' : '4px'}
               sx={{
                  width: isDesktop ? 'calc(100vw - 225px)' : '100%',
                  height: PageWith2Toolbar,
                  overflowY: 'auto',
                  '.MuiTabPanel-root': {
                     padding: '8px 0px',
                     '.dataGridWrapper': {
                        marginLeft: isDesktop ? '-12px' : 0,
                        height: PageWithdetails3Toolbar,
                     },
                  },
                  '.MuiButtonBase-root.MuiTabScrollButton-root ': {
                     display: isMobile
                        ? 'none !important'
                        : 'initial !important',
                  },
               }}
            >
               <Formik
                  initialValues={{
                     ...initialValues,
                  }}
                  key={autoRefresh}
                  onSubmit={handleSubmitValues}
                  validationSchema={object({
                     title: string().required('Title is required'),
                     from: string().required('From is required'),
                     to: string()
                        .required('To is required')
                        .test(
                           'is-greater-than-from',
                           'To should be greater than From',
                           function (value) {
                              const { from } = this.parent

                              if (!from || !value) {
                                 return true // Validation will pass if either date is not provided.
                              }

                              // Convert "from" and "to" to JavaScript Date objects
                              const fromDate = moment(from).unix() * 1000
                              const toDate = moment(value).unix() * 1000
                              // Compare hours and minutes to check if "to" is greater than or equal to "from"
                              if (fromDate < toDate) {
                                 return true
                              }

                              return false // Validation fails if "to" is not greater than or equal to "from"
                           }
                        ),
                     winnersCount: number()
                        .required('winners count is required')
                        .min(0, 'winners count should be at least 0'),
                     currencyConditions: array(
                        object({
                           currency: string().required('Currency is required'),
                           prizes: number().required('Prizes is required'),
                        })
                     ),
                  })}
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
                     setFieldValue,
                  }) => (
                     <form onSubmit={handleSubmit}>
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
                                 overflowY: 'auto',
                              }}
                           >
                              <Grid
                                 container
                                 alignItems="center"
                                 p={2}
                                 px={isLgUp ? '12px' : '4px'}
                                 spacing={2}
                                 sx={{}}
                              >
                                 <Grid item xl={3} lg={4} sm={6} xs={12}>
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
                                       label="From"
                                       format="yyyy-MM-dd HH:mm:ss"
                                       value={new Date(values.from)}
                                       slotProps={{
                                          textField: {
                                             variant: 'outlined',
                                             error: Boolean(
                                                (touched.to || touched.from) &&
                                                   errors.from
                                             ),
                                             helperText:
                                                (touched.to || touched.from) &&
                                                errors.from
                                                   ? errors.from
                                                   : ' ',
                                          },
                                       }}
                                       onChange={(e, newValue) => {
                                          // Use Formik's setFieldValue to update the 'languages' field
                                          setFieldValue('from', e)
                                       }}
                                       className="custom-icon-datetime-picker"
                                    />
                                 </Grid>
                                 <Grid item xl={3} lg={4} sm={6} xs={12}>
                                    <DateTimePicker
                                       ampm={false}
                                       sx={{
                                          width: '100%',
                                       }}
                                       slots={{
                                          openPickerIcon: () => (
                                             <FontAwesomeIcon
                                                icon={faCalendar}
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
                                       value={new Date(values.to)}
                                       onChange={(e, newValue) => {
                                          // Use Formik's setFieldValue to update the 'languages' field
                                          setFieldValue('to', e)
                                       }}
                                       slotProps={{
                                          textField: {
                                             variant: 'outlined',
                                             error: Boolean(
                                                (touched.to || touched.from) &&
                                                   errors.to
                                             ),
                                             helperText:
                                                (touched.to || touched.from) &&
                                                errors.to
                                                   ? errors.to
                                                   : ' ',
                                          },
                                       }}
                                       className="custom-icon-datetime-picker"
                                    />
                                 </Grid>
                                 <Grid item xl={3} lg={4} sm={6} xs={12}>
                                    <TextField
                                       name="title"
                                       label="Title "
                                       type="text"
                                       value={values.title}
                                       error={Boolean(
                                          touched.title && errors.title
                                       )}
                                       autoComplete="off"
                                       fullWidth
                                       helperText={
                                          touched.title && errors.title
                                             ? errors.title
                                             : ' '
                                       }
                                       onBlur={handleBlur}
                                       onChange={handleChange}
                                       variant="outlined"
                                    />
                                 </Grid>
                                 <Grid
                                    item
                                    xl={3}
                                    lg={4}
                                    sm={6}
                                    xs={12}
                                    pt={'0 !important'}
                                 >
                                    <TextField
                                       name="description"
                                       label="Description"
                                       type="text"
                                       value={values.description}
                                       error={Boolean(
                                          touched.description &&
                                             errors.description
                                       )}
                                       autoComplete="off"
                                       fullWidth
                                       helperText={
                                          touched.description &&
                                          errors.description
                                             ? errors.description
                                             : ' '
                                       }
                                       onBlur={handleBlur}
                                       onChange={handleChange}
                                       variant="outlined"
                                    />
                                 </Grid>
                                 {hasDetailsPermission(
                                    UserPermissionEvent.BACKOFFICE_OPERATOR_LIST_REQ
                                 ) && (
                                    <>
                                       <Grid
                                          item
                                          xl={3}
                                          lg={4}
                                          sm={6}
                                          xs={12}
                                          pt={'0 !important'}
                                       >
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
                                                         icon={
                                                            faAngleDown as IconProp
                                                         }
                                                         size="sm"
                                                         className="selectIcon"
                                                      />
                                                   )
                                                }}
                                                onChange={(e) => {
                                                   hasDetailsPermission(
                                                      UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ
                                                   ) &&
                                                      e.target.value.length ===
                                                         1 &&
                                                      boClient?.operator?.getOperatorBrands(
                                                         {
                                                            opId: e.target
                                                               .value[0],
                                                         },
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
                                                               {item.opId}-
                                                               {item.title}
                                                            </MenuItem>
                                                         )
                                                      }
                                                   )}
                                             </Select>
                                             <FormHelperText> </FormHelperText>
                                          </FormControl>
                                       </Grid>
                                       <Grid
                                          item
                                          xl={3}
                                          lg={4}
                                          sm={6}
                                          xs={12}
                                          pt={'0 !important'}
                                       >
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
                                                IconComponent={(_props) => {
                                                   return (
                                                      <FontAwesomeIcon
                                                         icon={
                                                            faAngleDown as IconProp
                                                         }
                                                         size="sm"
                                                         className="selectIcon"
                                                      />
                                                   )
                                                }}
                                                onChange={handleChange}
                                             >
                                                {operators &&
                                                   operators.operators?.map(
                                                      (item, index: number) => {
                                                         return (
                                                            <MenuItem
                                                               key={`excludedOperators${index}`}
                                                               value={item.opId}
                                                            >
                                                               {item.opId}-
                                                               {item.title}
                                                            </MenuItem>
                                                         )
                                                      }
                                                   )}
                                             </Select>
                                             <FormHelperText> </FormHelperText>
                                          </FormControl>
                                       </Grid>
                                    </>
                                 )}
                                 {brands && brands?.length > 0 && (
                                    <>
                                       {values.opIds?.length === 1 && (
                                          <Grid
                                             item
                                             xl={3}
                                             lg={4}
                                             sm={6}
                                             xs={12}
                                             pt={'0 !important'}
                                          >
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
                                                   IconComponent={(_props) => {
                                                      return (
                                                         <FontAwesomeIcon
                                                            icon={
                                                               faAngleDown as IconProp
                                                            }
                                                            size="sm"
                                                            className="selectIcon"
                                                         />
                                                      )
                                                   }}
                                                   onChange={handleChange}
                                                >
                                                   {brands?.map(
                                                      (item, index: number) => {
                                                         return (
                                                            <MenuItem
                                                               key={`brand${index}`}
                                                               value={
                                                                  item.brandId
                                                               }
                                                            >
                                                               {item.brandId}-
                                                               {item.brandName}
                                                            </MenuItem>
                                                         )
                                                      }
                                                   )}
                                                </Select>
                                                <FormHelperText>
                                                   {' '}
                                                </FormHelperText>
                                             </FormControl>
                                          </Grid>
                                       )}
                                       {values.opIds?.length === 1 && (
                                          <Grid
                                             item
                                             xl={3}
                                             lg={4}
                                             sm={6}
                                             xs={12}
                                             pt={'0 !important'}
                                          >
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
                                                   value={
                                                      values.excludedBrandIds
                                                   }
                                                   name="excludedBrandIds"
                                                   onChange={handleChange}
                                                   IconComponent={(_props) => {
                                                      return (
                                                         <FontAwesomeIcon
                                                            icon={
                                                               faAngleDown as IconProp
                                                            }
                                                            size="sm"
                                                            className="selectIcon"
                                                         />
                                                      )
                                                   }}
                                                >
                                                   {brands?.map(
                                                      (item, index: number) => {
                                                         return (
                                                            <MenuItem
                                                               key={`Excludedbrand${index}`}
                                                               value={
                                                                  item.brandId
                                                               }
                                                            >
                                                               {item.brandId}-
                                                               {item.brandName}
                                                            </MenuItem>
                                                         )
                                                      }
                                                   )}
                                                </Select>
                                                <FormHelperText>
                                                   {' '}
                                                </FormHelperText>
                                             </FormControl>
                                          </Grid>
                                       )}
                                    </>
                                 )}
                                 <Grid
                                    item
                                    xl={3}
                                    lg={4}
                                    sm={6}
                                    xs={12}
                                    pt={'0 !important'}
                                 >
                                    <TextField
                                       name="gameIds"
                                       label="game Ids"
                                       type="text"
                                       value={values.gameIds}
                                       error={Boolean(
                                          touched.gameIds && errors.gameIds
                                       )}
                                       multiline
                                       autoComplete="off"
                                       fullWidth
                                       helperText={
                                          touched.gameIds && errors.gameIds
                                             ? errors.gameIds
                                             : ' '
                                       }
                                       onBlur={handleBlur}
                                       onChange={handleChange}
                                       variant="outlined"
                                    />
                                 </Grid>
                                 <Grid
                                    item
                                    xl={3}
                                    lg={4}
                                    sm={6}
                                    xs={12}
                                    pt={'0 !important'}
                                 >
                                    <TextField
                                       name="excludedPlayerIds"
                                       label="Excluded Players ID"
                                       type="text"
                                       value={values.excludedPlayerIds}
                                       error={Boolean(
                                          touched.excludedPlayerIds &&
                                             errors.gameIds
                                       )}
                                       multiline
                                       autoComplete="off"
                                       fullWidth
                                       helperText={
                                          touched.excludedPlayerIds &&
                                          errors.excludedPlayerIds
                                             ? errors.excludedPlayerIds
                                             : ' '
                                       }
                                       onBlur={handleBlur}
                                       onChange={handleChange}
                                       variant="outlined"
                                    />
                                 </Grid>
                                 <Grid
                                    item
                                    xl={3}
                                    lg={4}
                                    sm={6}
                                    xs={12}
                                    pt={'0 !important'}
                                 >
                                    <TextField
                                       name="winnersCount"
                                       label="Winners Count"
                                       value={values.winnersCount}
                                       error={Boolean(
                                          touched.winnersCount &&
                                             errors?.winnersCount
                                       )}
                                       fullWidth
                                       type="number"
                                       helperText={
                                          touched?.winnersCount &&
                                          errors?.winnersCount
                                             ? errors?.winnersCount
                                             : ' '
                                       }
                                       inputProps={{
                                          min: 0,
                                       }}
                                       onBlur={handleBlur}
                                       onChange={handleChange}
                                       variant="outlined"
                                    />
                                 </Grid>
                              </Grid>
                              <Grid
                                 container
                                 alignItems="center"
                                 p={2}
                                 pt={'0 !important'}
                                 px={isLgUp ? '12px' : '4px'}
                                 spacing={2}
                              >
                                 <Grid item>
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
                                 </Grid>
                                 <Grid item>
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
                                 </Grid>
                                 <Grid item>
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
                                 </Grid>
                              </Grid>
                           </CardContent>
                        </Card>
                        <FieldArray name="currencyConditions">
                           {({ push, remove }) => (
                              <>
                                 <Button
                                    onClick={
                                       () => push(packageGroup)
                                       // Perform any other actions after push is completed
                                    }
                                    color="info"
                                    variant="contained"
                                    sx={{
                                       fontSize: 12,
                                       fontFamily: 'Nunito Sans SemiBold',
                                       borderRadius: '8px',
                                       my: 2,
                                    }}
                                 >
                                    <FontAwesomeIcon
                                       icon={faAdd as IconProp}
                                       fixedWidth
                                       fontSize={14}
                                    />{' '}
                                    Add Currency
                                 </Button>
                                 <TableContainer
                                    sx={{
                                       boxShadow: 'none',
                                       borderRadius: '10px',
                                    }}
                                 >
                                    <Table
                                       size="small"
                                       sx={{
                                          'tr>th:first-of-type,tr>td:nth-of-type(0)':
                                             {
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 1,
                                             },
                                          'thead th:first-of-type': {
                                             zIndex: 3,
                                          },

                                          '.MuiTableBody-root .MuiTableRow-root:nth-of-type(odd)>th':
                                             { padding: '5px' },
                                       }}
                                    >
                                       <TableBody
                                          sx={{
                                             tr: {
                                                fontSize:
                                                   theme.breakpoints.down('sm')
                                                      ? '10px'
                                                      : '12px',
                                                th: {
                                                   background: `${theme.palette.background.paper}!important`,
                                                },
                                                '.MuiTableCell-root': {
                                                   padding: '5px',
                                                },
                                                '&:nth-of-type(odd), &:nth-of-type(odd) tr th':
                                                   {
                                                      background: `${'#F6F5F9'}!important`,
                                                   },
                                                '&:nth-of-type(odd) th': {
                                                   background: `#332C4A!important`,
                                                },
                                                '&:nth-of-type(even) th': {
                                                   background: `#332C4A!important`,
                                                },

                                                '&:nth-of-type(even), &:nth-of-type(even) tr th':
                                                   {
                                                      background: `${theme.palette.background.paper}!important`,
                                                   },
                                                'th .MuiStack-root, th a': {
                                                   color: `${'#1570EF'} !important`,
                                                   fontFamily: `${'Nunito Sans SemiBold'} !important`,
                                                },
                                                'td p, td p span': {
                                                   color: `red !important`,
                                                   fontFamily: `${'Nunito Sans SemiBold'} !important`,
                                                },
                                                // hide last border
                                                'td, th': {
                                                   border: 0,
                                                   textAlign: 'left',
                                                   alignContent: 'center',
                                                },
                                                td: {
                                                   minWidth: '116px',
                                                },
                                                '.MuiTableCell-root:first-of-type':
                                                   {
                                                      textAlign: 'left',
                                                   },
                                                'th:after': {
                                                   display: 'none',
                                                },
                                                'th:before': {
                                                   content: '""',
                                                   position: 'absolute',
                                                   width: '100%',
                                                   height: '1px',
                                                   right: 0,
                                                   bottom: 0,
                                                   background: '#EDEBF4',
                                                },
                                             },
                                          }}
                                       >
                                          <TableRow>
                                             <TableCell
                                                component="th"
                                                width={'80px'}
                                             >
                                                Currency
                                             </TableCell>
                                             {values?.currencyConditions?.map(
                                                (item, index) => (
                                                   <TableCell
                                                      key={`currencyConditions.${index}.currency`}
                                                   >
                                                      <FormControl
                                                         sx={{
                                                            width: '100%',
                                                         }}
                                                      >
                                                         <Autocomplete
                                                            id={`currencyConditions[${index}]currency`}
                                                            options={currenciesInit
                                                               ?.filter(
                                                                  (currency) =>
                                                                     values.currencyConditions.findIndex(
                                                                        (
                                                                           itemCurrency
                                                                        ) =>
                                                                           itemCurrency.currency ===
                                                                           currency.currency
                                                                     ) < 0
                                                               )
                                                               ?.map(
                                                                  (item) =>
                                                                     item.currency
                                                               )}
                                                            sx={{
                                                               width: '100%',
                                                               mb: 0,
                                                               '.MuiAutocomplete-input':
                                                                  {
                                                                     cursor:
                                                                        'pointer',
                                                                  },
                                                            }}
                                                            value={
                                                               values
                                                                  .currencyConditions[
                                                                  index
                                                               ].currency
                                                            }
                                                            onChange={(
                                                               e,
                                                               selectedCurrency
                                                            ) => {
                                                               setFieldValue(
                                                                  `currencyConditions[${index}]currency`,
                                                                  selectedCurrency
                                                               )
                                                            }}
                                                            renderInput={(
                                                               params
                                                            ) => (
                                                               <TextField
                                                                  {...params}
                                                                  variant="outlined"
                                                                  name={`currencyConditions.${index}.currency`}
                                                                  fullWidth
                                                                  InputProps={{
                                                                     ...params.InputProps,
                                                                     endAdornment:
                                                                        (
                                                                           <FontAwesomeIcon
                                                                              icon={
                                                                                 faAngleDown as IconProp
                                                                              }
                                                                              className="selectIcon"
                                                                              size="sm"
                                                                           />
                                                                        ),
                                                                  }}
                                                               />
                                                            )}
                                                         />
                                                         <div
                                                            style={{
                                                               minHeight: '1em',
                                                            }}
                                                         >
                                                            <ErrorMessage
                                                               name={`currencyConditions[${index}]currency`}
                                                               component={
                                                                  Typography
                                                               }
                                                            />
                                                         </div>
                                                      </FormControl>
                                                   </TableCell>
                                                )
                                             )}
                                          </TableRow>
                                          <TableRow>
                                             <TableCell
                                                component="th"
                                                width={'80px'}
                                             >
                                                Min Bet Amount
                                             </TableCell>
                                             {values?.currencyConditions?.map(
                                                (item, index) => (
                                                   <TableCell
                                                      key={`currencyConditions.${index}.minBetAmount`}
                                                   >
                                                      <Field
                                                         type="number"
                                                         fullWidth
                                                         id={`currencyConditions[${index}]minBetAmount`}
                                                         name={`currencyConditions[${index}]minBetAmount`}
                                                         value={
                                                            values
                                                               .currencyConditions[
                                                               index
                                                            ].minBetAmount
                                                         }
                                                         min="0"
                                                         component={TextField}
                                                         onBlur={handleBlur}
                                                         onChange={handleChange}
                                                         sx={{
                                                            '.MuiInputBase-root':
                                                               {
                                                                  paddingTop:
                                                                     '0!important',
                                                               },
                                                         }}
                                                      />
                                                      <ErrorMessage
                                                         name={`currencyConditions[${index}]minBetAmount`}
                                                         component={Typography}
                                                      />
                                                      <Typography
                                                         variant="body2"
                                                         component={'h6'}
                                                         textAlign={'left'}
                                                         p={'6px'}
                                                         sx={{
                                                            color: `${theme.palette.success.main} !important`,
                                                         }}
                                                      >
                                                         {handleConvertToUSD(
                                                            values
                                                               .currencyConditions[
                                                               index
                                                            ].minBetAmount,
                                                            currenciesInit?.find(
                                                               (currency) =>
                                                                  currency.currency ===
                                                                  values
                                                                     .currencyConditions[
                                                                     index
                                                                  ].currency
                                                            )?.inUSD
                                                         )}{' '}
                                                      </Typography>
                                                   </TableCell>
                                                )
                                             )}
                                          </TableRow>
                                          <TableRow>
                                             <TableCell
                                                component="th"
                                                width={'80px'}
                                             >
                                                Prizes
                                             </TableCell>
                                             {values?.currencyConditions?.map(
                                                (item, index) => (
                                                   <TableCell
                                                      key={`currencyConditions.${index}.prizes`}
                                                      style={{
                                                         minWidth: '250px',
                                                      }}
                                                      sx={{
                                                         '.MuiOutlinedInput-root':
                                                            {
                                                               alignItems:
                                                                  'baseline !important',
                                                               '.MuiInputAdornment-root':
                                                                  {
                                                                     display:
                                                                        'block',
                                                                     '.notranslate':
                                                                        {
                                                                           display:
                                                                              'none',
                                                                        },
                                                                     'p.MuiTypography-root':
                                                                        {
                                                                           textAlign:
                                                                              'end',
                                                                           color: `${theme.palette.success.main} !important`,
                                                                        },
                                                                  },
                                                            },
                                                      }}
                                                   >
                                                      <Field
                                                         fullWidth
                                                         id={`currencyConditions[${index}]prizes`}
                                                         name={`currencyConditions[${index}]prizes`}
                                                         value={
                                                            values
                                                               .currencyConditions[
                                                               index
                                                            ].prizes
                                                         }
                                                         component={TextField}
                                                         onBlur={handleBlur}
                                                         onChange={handleChange}
                                                         minRows={10}
                                                         multiline
                                                         onKeyPress={(
                                                            event: React.KeyboardEvent<HTMLInputElement>
                                                         ) => {
                                                            const key =
                                                               event.key
                                                            const keyCode =
                                                               event.keyCode ||
                                                               event.which

                                                            // Allow Enter key (keyCode 13) and numeric characters
                                                            if (
                                                               keyCode !== 13 &&
                                                               (isNaN(
                                                                  parseInt(
                                                                     key,
                                                                     10
                                                                  )
                                                               ) ||
                                                                  key === ' ')
                                                            ) {
                                                               event.preventDefault()
                                                            }
                                                         }}
                                                         InputProps={{
                                                            endAdornment: (
                                                               <InputAdornment position="start">
                                                                  {values.currencyConditions[
                                                                     index
                                                                  ].prizes
                                                                     .split(
                                                                        /\r?\n/
                                                                     )
                                                                     .map(
                                                                        (
                                                                           prize,
                                                                           indexItem
                                                                        ) => (
                                                                           <Typography
                                                                              key={
                                                                                 prize +
                                                                                 indexItem
                                                                              }
                                                                              variant="body2"
                                                                              component={
                                                                                 'p'
                                                                              }
                                                                              textAlign={
                                                                                 'left'
                                                                              }
                                                                              sx={{
                                                                                 color: `${theme.palette.success.main} !important`,
                                                                                 lineHeight:
                                                                                    '1.4375em',
                                                                              }}
                                                                           >
                                                                              {handleConvertToUSD(
                                                                                 Number(
                                                                                    prize
                                                                                 ),
                                                                                 currenciesInit?.find(
                                                                                    (
                                                                                       currency
                                                                                    ) =>
                                                                                       currency.currency ===
                                                                                       values
                                                                                          ?.currencyConditions[
                                                                                          index
                                                                                       ]
                                                                                          ?.currency
                                                                                 )
                                                                                    ?.inUSD
                                                                              )}{' '}
                                                                           </Typography>
                                                                        )
                                                                     )}
                                                               </InputAdornment>
                                                            ),
                                                         }}
                                                         inputProps={{
                                                            inputMode:
                                                               'numeric',
                                                            pattern: '[0-9]*',
                                                         }}
                                                         sx={{
                                                            '.MuiInputBase-inputMultiline':
                                                               {
                                                                  paddingTop:
                                                                     '0!important',
                                                               },
                                                         }}
                                                      />
                                                      <div
                                                         style={{
                                                            minHeight: '1em',
                                                         }}
                                                      >
                                                         <ErrorMessage
                                                            name={`currencyConditions[${index}]prizes`}
                                                            component={
                                                               Typography
                                                            }
                                                         />
                                                      </div>
                                                   </TableCell>
                                                )
                                             )}
                                          </TableRow>
                                          {values?.currencyConditions.length >
                                             1 && (
                                             <TableRow>
                                                <TableCell
                                                   component="th"
                                                   width={'80px'}
                                                >
                                                   Actions
                                                </TableCell>
                                                {values?.currencyConditions?.map(
                                                   (item, index) => (
                                                      <TableCell
                                                         key={`currencyConditions.${index}.delete`}
                                                      >
                                                         <Button
                                                            onClick={() => {
                                                               remove(index)
                                                            }}
                                                            color="error"
                                                            variant="outlined"
                                                            sx={{ height: 32 }}
                                                         >
                                                            Delete
                                                         </Button>
                                                      </TableCell>
                                                   )
                                                )}
                                             </TableRow>
                                          )}
                                       </TableBody>
                                    </Table>
                                 </TableContainer>
                              </>
                           )}
                        </FieldArray>
                        <DialogActions>
                           <Button
                              onClick={() => router.push('/v2-Tournament')}
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
            </Grid>
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

DetailsTournamentV2.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout>{page}</DashboardLayout>
}

export default DetailsTournamentV2
