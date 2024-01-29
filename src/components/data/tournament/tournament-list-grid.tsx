import SelectTheme from '@/components/SelectTheme'
import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import {
   renderStatusTournamentCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells'
import TransitionSlide from '@/components/custom/TransitionSlide'
import {
   SaveTournamentResultDto,
   SendTournamentResultDto,
   SetTournamentDto,
   Tournament,
   TournamentCurrencyConditionItem,
   UpdateTournamentDto,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faAngleDown,
   faCalendar,
   faCopy,
   faRectangleXmark,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
   Box,
   Button,
   Checkbox,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogProps,
   DialogTitle,
   FormControl,
   FormControlLabel,
   FormGroup,
   Grid,
   InputLabel,
   MenuItem,
   Select,
   Tab,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { DataGridPro, GridColDef, GridSortModel } from '@mui/x-data-grid-pro'
import { DateTimePicker, renderTimeViewClock } from '@mui/x-date-pickers'
import { darkPurple } from 'colors'
import { Formik } from 'formik'
import moment from 'moment'
import numeral from 'numeral'
import React, { useState } from 'react'
import { Check } from 'react-feather'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   selectAuthBrandsList,
   selectAuthOperators,
   selectAuthTournament,
   selectAuthUser,
} from 'redux/authSlice'
import { selectLoadingTournament } from 'redux/loadingSlice'
import { getCrashConfig } from 'redux/slices/crashConfig'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith3Toolbar,
   PageWith4Toolbar,
   PageWith5Toolbar,
   fetchJsonData,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'
import TournamentCurrencies from './currencies'
import CustomRow from './customRow'
import {
   UseGetTournamentListQueryProps,
   useGetTournamentListQuery,
   useSaveResultTournamentMutation,
   useSendResultTournamentMutation,
   useSetTournamentMutation,
   useUpdateTournamentMutation,
} from './lib/hooks/queries'

export default function AllTournamentList(dataFilter: any) {
   const boClient = useSelector(selectBoClient)
   const timezone = useSelector(getCrashConfig).timezone
   const loadingTournament = useSelector(selectLoadingTournament)
   const [dataSort, setDataSort]: any = React.useState({
      to: -1,
   })
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const [currencyConditionsValues, setCurrencyConditionsValues] =
      React.useState<TournamentCurrencyConditionItem[]>([])
   const user = useSelector(selectAuthUser) as User
   const theme = useTheme()
   const [boxRefrech, setBoxRefrech] = React.useState(0)
   const timedifference = new Date().getTimezoneOffset()
   const timezoneOffset = store.getState().crashConfig.timezoneOffset
   const post: UseGetTournamentListQueryProps = {
      title: dataFilter.title,
      gameId: dataFilter.gameId,
      tournamentId: dataFilter.tournamentId,
      sort: dataSort,
      limit: paginationModel.pageSize,
      page: paginationModel.page,
      refresh: boxRefrech,
      autoRefresh: dataFilter.autoRefresh,
   }
   const [checked, setChecked] = useState(false)
   const { isLoading } = useGetTournamentListQuery(post)
   const data = useSelector(selectAuthTournament)
   const [action, setAction] = React.useState(0)
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [Transition, setTransition]: any = React.useState()
   const [open, setOpen] = React.useState(false)
   const [openSendTournament, setOpenSendTournament] = React.useState(false)
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   const brandsList = useSelector(selectAuthBrandsList)
   const brands = brandsList
   const operators = useSelector(selectAuthOperators)
   const [openUpdateTournament, setOpenUpdateTournament] = React.useState(false)
   const [openSaveResultTournament, setOpenSaveResultTournament] =
      React.useState(false)
   const [currentTournament, setCurrentTournament] = React.useState(
      {} as Tournament | any
   )
   const [currentTournamentSearch, setCurrentTournamentSearch] = React.useState(
      currentTournament?.tournamentData as Tournament | any
   )
   const [openTournament, setOpenTournament] = React.useState(false)
   const [value, setValue] = React.useState('details')
   const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm')
   const [fullWidth, setFullWidth] = React.useState(true)
   const [searchText, setSearchText] = React.useState('')

   const [initialValues, setInitialValues] = React.useState({
      tournamentId: '',
      title: '',
      description: '',
      from: moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
      to: moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
      opIds: [] as string[],
      brandIds: [] as string[],
      gameIds: '',
      prizes: '',
      currencyConditions: [] as TournamentCurrencyConditionItem[],
      uniqueWinnerOnly: false,
      winnersCount: 0,
      includeTestPlayers: false,
      includeFunPlayers: false,
      includeBlockedPlayers: false,
      excludedPlayerIds: '',
      excludedBrandIds: [] as string[],
      excludedOpIds: [] as string[],
   })
   const [initialValuesSendTournament, setInitialValuesSendTournament] =
      React.useState({
         tournamentId: '',
         opIds: [] as string[],
      })
   const Actions = (data: Tournament) => {
      let actiondata = [
         {
            value: '0',
            label: (
               <Typography
                  variant="caption"
                  sx={{ fontFamily: 'Nunito Sans Bold', fontSize: '0.75rem' }}
               >
                  Actions
               </Typography>
            ),
            disabled: true,
         },
         {
            value: '1',
            label: (
               <Typography
                  variant="bodySmallBold"
                  sx={{
                     svg: { position: 'relative', top: '3px', mr: '15px' },
                     flex: 1,
                  }}
               >
                  Edit
               </Typography>
            ),
            onClick: () => handleClickOpen(data),
         },
      ]
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_UPDATE_TOURNAMENT_REQ
         )
      ) {
         actiondata.push({
            value: '2',
            label: (
               <Typography
                  variant="bodySmallBold"
                  sx={{
                     svg: { position: 'relative', top: '3px', mr: '15px' },
                     flex: 1,
                  }}
               >
                  Update
               </Typography>
            ),
            onClick: () => handleOpenUpdateTournament(data),
         })
      }
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SEND_TOURNAMENT_RESULT_REQ
         )
      ) {
         actiondata.push({
            value: '3',
            label: (
               <Typography
                  variant="bodySmallBold"
                  sx={{
                     svg: { position: 'relative', top: '3px', mr: '15px' },
                     flex: 1,
                  }}
               >
                  Send Result
               </Typography>
            ),
            onClick: () => handleClickSendTournamentOpen(data),
         })
      }
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SAVE_TOURNAMENT_RESULT_REQ
         )
      ) {
         actiondata.push({
            value: '4',
            label: (
               <Typography
                  variant="bodySmallBold"
                  sx={{
                     svg: { position: 'relative', top: '3px', mr: '15px' },
                     flex: 1,
                  }}
               >
                  Save Result
               </Typography>
            ),
            onClick: () => handleOpenSaveTournamentResult(data),
         })
      }
      return actiondata
   }
   const columns: GridColDef[] = [
      {
         field: 'tournamentId',
         headerName: 'ID',
         renderCell: (params) =>
            params &&
            params.value && (
               <PortalCopyValue value={params.value} hideText tooltip={true} />
            ),
         width: 50,
         hideable: false,
         filterable: false,
      },
      {
         field: 'title',
         headerAlign: 'center',
         align: 'center',
         headerName: 'Title',
         renderCell: (params) =>
            params &&
            params.value && (
               <PortalCopyValue
                  sx={{
                     maxWidth: '230px',
                     overflow: 'hidden',
                     textOverflow: 'ellipsis',
                  }}
                  value={params.value}
                  tooltip={true}
               />
            ),
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'description',
         headerName: 'URL',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) => (
            <PortalCopyValue
               value={`https://tournament.imoon.com/stats/new-${params.row.tournamentId}.json`}
               href={`https://tournament.imoon.com/stats/new-${params.row.tournamentId}.json`}
               sx={{
                  maxWidth: '230px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
               }}
               target="_blank"
               isVisible={true}
            />
         ),
         minWidth: 250,
         hideable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'from',
         headerName: 'From',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            params && params.value && renderTimeCell(params.value),
         minWidth: 120,
         hideable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'to',
         headerName: 'To',
         headerAlign: 'center',
         align: 'center',
         renderCell: (params) =>
            params && params.value && renderTimeCell(params.value),
         minWidth: 120,
         flex: 1,
         sortable: false,
      },
      {
         field: 'winnersCount',
         headerAlign: 'center',
         align: 'center',
         type: 'number',
         headerName: 'Winners Count',
         renderCell: (params) =>
            numeral(params.row.winnersCount).format('0,00.[00]'),
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'status',
         align: 'center',
         headerAlign: 'center',
         type: 'number',
         headerName: 'Status',
         renderCell: (params) =>
            params.row?.from && (
               <Box
                  onClick={() => handleOpenTournament(params.row)}
                  sx={{ cursor: 'pointer' }}
               >
                  {renderStatusTournamentCell(params.row?.from, params.row?.to)}
               </Box>
            ),
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
   ]
   if (
      hasDetailsPermission(UserPermissionEvent.BACKOFFICE_SET_TOURNAMENT_REQ)
   ) {
      columns.push({
         field: 'actions',
         headerName: '',
         renderCell: (params) => {
            return (
               <Box className="showOnHover">
                  <SelectTheme
                     noPadd={true}
                     icon={''}
                     data={Actions(params.row)}
                     value={action}
                  />
               </Box>
            )
         },
         width: 10,
         sortable: false,
         filterable: false,
         disableColumnMenu: true,
      })
   }

   const { mutate } = useSetTournamentMutation({
      onSuccess: () => {
         toast.success('You Edit the tournament successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         handleClose()
         setBoxRefrech(boxRefrech + 1)
      },
   })

   const { mutate: mutateUpdate } = useUpdateTournamentMutation({
      onSuccess: () => {
         toast.success('You Update the tournament successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         handleCloseUpdateTournament()
         setBoxRefrech(boxRefrech + 1)
      },
   })

   const { mutate: mutateSendResult } = useSendResultTournamentMutation({
      onSuccess: () => {
         toast.success('You send the result of tournament successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         handleCloseSendTournament()
         setBoxRefrech(boxRefrech + 1)
      },
   })

   const { mutate: mutateSaveResult } = useSaveResultTournamentMutation({
      onSuccess: () => {
         toast.success('You save the tournament result successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         handleCloseSaveTournamentResult()
         setBoxRefrech(boxRefrech + 1)
      },
   })

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {},
      []
   )

   const handleOpenTournament = (tournament: Tournament) => {
      fetchJsonData(
         `https://tournament.imoon.com/stats/new-${tournament.tournamentId}.json`
      )
         .then((data) => {
            setCurrentTournament(data)
            setCurrentTournamentSearch(data?.tournamentData)
            setTransition(TransitionSlide)
            setOpenTournament(true)
         })
         .catch((error) => {
            toast.error(error.message || 'An error occurred', {
               position: toast.POSITION.TOP_CENTER,
            })
         })

      setValue('details')
   }

   const handleCloseTournamentDetails = () => {
      setOpenTournament(false)
   }

   const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue)
   }

   const handleCopyButtonClick = (json: {}) => {
      const data = JSON.stringify(json, null, 2)
      navigator.clipboard.writeText(data)
      setChecked(true)
      setTimeout(() => setChecked(false), 1000)
   }

   const handleClickOpen = (data: Tournament) => {
      setTransition(TransitionSlide)
      setOpen(true)
      setCurrencyConditionsValues(data.currencyConditions)
      setInitialValues({
         tournamentId: data.tournamentId,
         title: data.title,
         from: moment(data.from).tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
         to: moment(data.to).tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
         includeTestPlayers: data.includeTestPlayers || false,
         description: data.description || '',
         gameIds: data.gameIds?.join('\n') || '',
         prizes: data.prizes?.join('\n') || '',
         opIds: data.opIds || [],
         brandIds: data.brandIds || [],
         currencyConditions: data.currencyConditions || [],
         uniqueWinnerOnly: data.uniqueWinnerOnly || false,
         winnersCount: data.winnersCount,
         includeFunPlayers: data.includeFunPlayers || false,
         includeBlockedPlayers: data.includeBlockedPlayers || false,
         excludedPlayerIds: data.excludedPlayerIds?.join('\n') || '',
         excludedBrandIds: data.excludedBrandIds || [],
         excludedOpIds: data.excludedOpIds || [],
      })
   }

   const handleOpenUpdateTournament = (data: Tournament | any) => {
      setCurrentTournament(data)
      setCurrentTournamentSearch(data?.tournamentData)
      setOpenUpdateTournament(true)
   }

   const handleCloseUpdateTournament = () => {
      setOpenUpdateTournament(false)
   }

   const handleOpenSaveTournamentResult = (data: Tournament | any) => {
      setCurrentTournament(data)
      setCurrentTournamentSearch(data?.tournamentData)
      setOpenSaveResultTournament(true)
   }

   const handleCloseSaveTournamentResult = () => {
      setOpenSaveResultTournament(false)
   }

   const handleClickSendTournamentOpen = (data: Tournament) => {
      setTransition(TransitionSlide)
      setOpenSendTournament(true)
      setInitialValuesSendTournament({
         tournamentId: data.tournamentId,
         opIds: [] as string[],
      })
   }

   const handleClose = async () => {
      await setTransition(TransitionSlide)
      setOpen(false)
   }

   const handleCloseSendTournament = async () => {
      await setTransition(TransitionSlide)
      setOpenSendTournament(false)
   }

   const handleSubmitMethods = React.useCallback(
      (dto: SetTournamentDto) => {
         mutate({ dto })
      },
      [mutate, currencyConditionsValues]
   )

   const handleUpdateTournament = (dto: UpdateTournamentDto) => {
      mutateUpdate({ dto })
   }

   const handleSubmitMethodsSendTournament = React.useCallback(
      (dto: SendTournamentResultDto) => {
         mutateSendResult({ dto })
      },
      [mutateSendResult]
   )

   const handleSaveTournamentResult = (dto: SaveTournamentResultDto) => {
      mutateSaveResult({ dto })
   }

   const handleSubmit = React.useCallback(
      (newTournament: {
         tournamentId: string
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
         const dto: SetTournamentDto = {
            tournamentId: newTournament.tournamentId,
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
         }

         if (
            newTournament.gameIds !== '' &&
            newTournament.gameIds?.split(/\r?\n/)
         ) {
            dto.gameIds = newTournament.gameIds?.split(/\r?\n/)
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

   const handleSubmitSendTournament = React.useCallback(
      (tournament: { tournamentId: string; opIds: string[] }) => {
         const dto: SendTournamentResultDto = {
            tournamentId: tournament.tournamentId,
            opIds: tournament.opIds,
         }
         handleSubmitMethodsSendTournament(dto)
      },
      []
   )

   const setCurrencyConditions = (
      currencyConditions: TournamentCurrencyConditionItem[]
   ) => {
      setCurrencyConditionsValues(currencyConditions)
   }

   React.useEffect(() => {
      setRowCountState((prevRowCountState: any) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      )
   }, [data?.count, setRowCountState])

   return (
      <Box
         key={boxRefrech}
         className="dataGridWrapper"
         mb={'0px'}
         p={isLgUp ? '12px' : '6px'}
         pt={0}
         sx={{
            height: isDesktop ? PageWith3Toolbar : PageWith4Toolbar,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            rowHeight={isDesktop ? 44 : 30}
            sx={GridStyle}
            getRowId={(row) => row?.tournamentId}
            disableRowSelectionOnClick
            rows={data?.tournaments || []}
            paginationMode="server"
            sortingMode="server"
            rowCount={rowCountState | 0}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pagination
            pageSizeOptions={[10, 20, 30, 40, 50, 100]}
            sortingOrder={['desc', 'asc']}
            onSortModelChange={handleSortModelChange}
            loading={loadingTournament || isLoading}
            getRowClassName={(params) =>
               params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            disableColumnMenu
            slots={{
               noRowsOverlay: CustomNoRowsOverlay,
               noResultsOverlay: CustomNoRowsOverlay,
               columnSortedAscendingIcon: CustomMenuSortAscendingIcon,
               columnSortedDescendingIcon: CustomMenuSortDescendingIcon,
               columnUnsortedIcon: CustomMenuSortIcon,
            }}
         />

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
                     Edit tournament
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
                                    IconComponent={(_props) => {
                                       return (
                                          <FontAwesomeIcon
                                             icon={faAngleDown as IconProp}
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
                                       IconComponent={(_props) => {
                                          return (
                                             <FontAwesomeIcon
                                                icon={faAngleDown as IconProp}
                                                size="sm"
                                                className="selectIcon"
                                             />
                                          )
                                       }}
                                       onChange={handleChange}
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

         <Dialog
            open={openSendTournament}
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
                     Send tournament result
                  </Typography>
               </Grid>
               <Grid item xs></Grid>
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleCloseSendTournament}
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
               <Formik
                  initialValues={initialValuesSendTournament}
                  enableReinitialize={true}
                  validationSchema={Yup.object().shape({
                     opIds: Yup.array().required('opIds is required'),
                  })}
                  onSubmit={handleSubmitSendTournament}
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
                           </>
                        )}
                        <DialogActions>
                           <Button
                              onClick={handleCloseSendTournament}
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

         <Dialog
            open={openUpdateTournament}
            aria-labelledby="form-dialog-title"
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            sx={{
               p: '12px !important',
               '.MuiPaper-root': {
                  m: 'auto',
                  borderRadius: '8px',
               },
            }}
         >
            <DialogTitle id="form-dialog-title">Update Tournament</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to update the tournament?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleCloseUpdateTournament}
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
                  color="secondary"
                  variant="contained"
                  sx={{ height: 32 }}
                  onClick={() => {
                     const post: UpdateTournamentDto = {
                        tournamentId: currentTournament.tournamentId,
                     }
                     handleUpdateTournament(post)
                  }}
               >
                  Confirm
               </Button>
            </DialogActions>
         </Dialog>

         <Dialog
            open={openSaveResultTournament}
            aria-labelledby="form-dialog-title"
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            sx={{
               p: '12px !important',
               '.MuiPaper-root': {
                  m: 'auto',
                  borderRadius: '8px',
               },
            }}
         >
            <DialogTitle id="form-dialog-title">Save Result</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to save the tournament result?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleCloseSaveTournamentResult}
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
                  color="secondary"
                  variant="contained"
                  sx={{ height: 32 }}
                  onClick={() => {
                     const post: UpdateTournamentDto = {
                        tournamentId: currentTournament.tournamentId,
                     }
                     handleSaveTournamentResult(post)
                  }}
               >
                  Confirm
               </Button>
            </DialogActions>
         </Dialog>

         <Dialog
            open={openTournament}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseTournamentDetails}
            aria-describedby="alert-dialog-slide-description"
            sx={{
               '.MuiDialog-container': {
                  alignItems: 'end',
                  justifyContent: 'end',
                  '.MuiPaper-root': {
                     maxWidth: isDesktop ? '775px' : '100%',
                  },
               },
               '.MuiPaper-root': {
                  p: '12px 4px!important',
               },
               table: {
                  th: {
                     width: 130,
                     background: '#332C4A',
                     color: (props) => props.palette.primary.contrastText,
                     '&.MuiTableCell-root': {
                        fontFamily: 'Nunito Sans SemiBold',
                     },
                  },
                  'tbody tr': {
                     background: `#FFF!important`,
                  },
                  tr: {
                     'td, th': {
                        '&:after': {
                           display: 'none !important',
                        },
                     },
                  },
                  'tr: first-of-type th': {
                     borderTopLeftRadius: '8px',
                  },
                  ' tr: first-of-type td': {
                     borderTopRightRadius: '8px',
                  },
                  'tr: last-child th': {
                     borderBottomLeftRadius: '8px',
                  },
                  'tr: last-child td': {
                     borderBottomRightRadius: '8px',
                  },
                  'td, th': {
                     border: 0,
                     textAlign: 'left',
                     position: 'relative',
                     '.MuiStack-root': {
                        textAlign: 'left',
                        justifyContent: 'start',
                     },
                     '&:before': {
                        content: '""',
                        borderTop: '1px solid #5C5474',
                        position: 'absolute',
                        bottom: 0,
                        width: 'calc(100% - 22px)',
                        left: '11px',
                     },
                  },
                  td: {
                     '&:before': {
                        borderTop: '1px solid #D5D2DF',
                     },
                  },
                  'tr: last-child td, tr: last-child th': {
                     '&:before': {
                        borderTop: '0px solid #D5D2DF',
                     },
                  },
               },
            }}
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
                  <Typography variant="h3" gutterBottom display="inline">
                     Tournament Details{' '}
                  </Typography>
               </Grid>
               <Grid item xs />
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleCloseTournamentDetails}
                     cursor={'pointer'}
                  />
               </Grid>
            </Grid>
            <DialogContent sx={{ p: 1, overflow: 'hidden' }}>
               <Grid
                  item
                  xs={12}
                  sx={{
                     '.MuiTabPanel-root': {
                        padding: '8px 0px',
                        '.dataGridWrapper': {
                           marginLeft: isDesktop ? '-12px' : 0,
                        },
                     },
                  }}
               >
                  <TabContext value={value}>
                     <Grid
                        container
                        direction="row"
                        alignItems="center"
                        p={'8px'}
                        spacing={0.5}
                        sx={{
                           svg: {
                              fontSize: '16px',
                              height: '16px',
                           },
                        }}
                     >
                        <Grid item>
                           <TabList
                              className="detail_tabs"
                              onChange={handleChange}
                              variant="scrollable"
                              scrollButtons={true}
                              sx={{
                                 mb: '0',
                                 pt: 0,
                                 alignItems: 'start',
                                 justifyContent: 'left',
                                 px: isDesktop ? '12px' : '4px',
                                 '.MuiTabs-scroller': {
                                    justifyContent: 'left',
                                    width: 'fit-content',
                                    maxWidth: 'fit-content',
                                 },
                              }}
                              aria-label="lab API tabs example"
                           >
                              <Tab label="Details" value={'details'} />
                              {currentTournament?.tournamentData &&
                                 currentTournament?.tournamentData.length >
                                    0 && (
                                    <Tab label="Winners" value={'winners'} />
                                 )}
                           </TabList>
                        </Grid>
                        <Grid item xs></Grid>
                        <Grid item>
                           <Button
                              variant="outlined"
                              sx={{
                                 color: '#1F1933',
                                 path: {
                                    fill: checked
                                       ? theme.palette.success.main
                                       : darkPurple[9],
                                    stroke: 'unset !important',
                                 },
                                 svg: {
                                    mr: 1,
                                 },
                              }}
                              onClick={() => {
                                 handleCopyButtonClick(currentTournament)
                              }}
                           >
                              {checked ? (
                                 <Check />
                              ) : (
                                 <FontAwesomeIcon
                                    icon={faCopy as IconProp}
                                    fixedWidth
                                 />
                              )}
                              Copy JSON
                           </Button>
                        </Grid>
                        {value === 'winners' && (
                           <Grid item>
                              <TextField
                                 label="Search"
                                 type="search"
                                 value={searchText}
                                 fullWidth
                                 autoComplete="off"
                                 onChange={(e) => {
                                    setSearchText(e.target.value)
                                    if (e.target.value !== '') {
                                       setCurrentTournamentSearch(
                                          currentTournament?.tournamentData?.filter(
                                             (item: any) =>
                                                item.playerId.includes(
                                                   e.target.value
                                                ) ||
                                                item.opId.includes(
                                                   e.target.value
                                                ) ||
                                                item.nickname.includes(
                                                   e.target.value
                                                )
                                          )
                                       )
                                    } else {
                                       setCurrentTournamentSearch(
                                          currentTournament?.tournamentData
                                       )
                                    }
                                    // setPermission(e.target.value)
                                    // e.target.value !== ''
                                    //    ? setUserPermissionEventInit(
                                    //         UserPermissionEventInitKeys.filter(
                                    //            (item: any) =>
                                    //               item.event.includes(
                                    //                  e.target.value
                                    //               )
                                    //         )
                                    //      )
                                    //    : setUserPermissionEventInit(
                                    //         UserPermissionEventInitKeys
                                    //      )
                                 }}
                                 sx={{
                                    mt: 0,
                                    height: '42px',
                                    maxWidth: '226px',
                                    '.MuiInputBase-root': {
                                       minHeight: '42px',
                                       background: darkPurple[12],
                                       border: `1px solid ${darkPurple[11]}`,
                                       borderRadius: '8px',
                                    },
                                    '.MuiFormLabel-root': {
                                       top: '-4px',
                                    },
                                    '.MuiFormLabel-filled, &.Mui-focused, &.MuiInputLabel-shrink':
                                       {
                                          top: '16px !important',
                                       },
                                 }}
                                 className="searchTextField"
                              />
                           </Grid>
                        )}
                     </Grid>
                     <TabPanel
                        value={'details'}
                        sx={{
                           height: PageWith5Toolbar,
                           pt: '6px !important',
                           overflow: 'auto',
                        }}
                     >
                        <Grid
                           container
                           direction="row"
                           alignItems="center"
                           mb={2}
                           spacing={0}
                        >
                           <Table>
                              <TableBody>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Status
                                    </TableCell>
                                    <TableCell>
                                       {currentTournament?.from &&
                                          renderStatusTournamentCell(
                                             currentTournament?.from,
                                             currentTournament?.to
                                          )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Tournament ID
                                    </TableCell>
                                    <TableCell>
                                       <PortalCopyValue
                                          value={
                                             currentTournament?.tournamentId
                                          }
                                          sx={{
                                             textOverflow: 'ellipsis',
                                             overflow: 'hidden',
                                             whiteSpace: 'nowrap',
                                             maxWidth: '300px',
                                          }}
                                       />
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Title
                                    </TableCell>
                                    <TableCell>
                                       <PortalCopyValue
                                          value={currentTournament?.title}
                                          sx={{
                                             textOverflow: 'ellipsis',
                                             overflow: 'hidden',
                                             whiteSpace: 'nowrap',
                                             maxWidth: '300px',
                                          }}
                                       />
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Description
                                    </TableCell>
                                    <TableCell>
                                       <PortalCopyValue
                                          value={
                                             currentTournament?.description ||
                                             ''
                                          }
                                          sx={{
                                             textOverflow: 'ellipsis',
                                             overflow: 'hidden',
                                             whiteSpace: 'nowrap',
                                             maxWidth: '300px',
                                          }}
                                       />
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       From
                                    </TableCell>
                                    <TableCell
                                       sx={{ h6: { p: '0 !important' } }}
                                    >
                                       {currentTournament?.from &&
                                          renderTimeCell(
                                             new Date(
                                                currentTournament?.from
                                             ).toString()
                                          )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       To
                                    </TableCell>
                                    <TableCell
                                       sx={{ h6: { p: '0 !important' } }}
                                    >
                                       {currentTournament?.to &&
                                          renderTimeCell(
                                             new Date(
                                                currentTournament?.to
                                             ).toString()
                                          )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Eligibility
                                    </TableCell>
                                    <TableCell>
                                       {currentTournament?.currencyConditions &&
                                          currentTournament?.currencyConditions.map(
                                             (item: {
                                                currency: string
                                                minBetAmount: number
                                             }) => (
                                                <Typography
                                                   variant="h6"
                                                   key={`currency${item.currency}`}
                                                >
                                                   {item.currency}:{' '}
                                                   {item.minBetAmount}
                                                </Typography>
                                             )
                                          )}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       # of winners
                                    </TableCell>
                                    <TableCell>
                                       {currentTournament?.winnersCount}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Unique winners only
                                    </TableCell>
                                    <TableCell>
                                       {currentTournament?.uniqueWinnerOnly
                                          ? 'Yes'
                                          : 'No'}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell component="th" scope="row">
                                       Game Ids
                                    </TableCell>
                                    <TableCell>
                                       {currentTournament?.gameIds &&
                                          currentTournament?.gameIds.map(
                                             (item: string, index: number) => (
                                                <PortalCopyValue
                                                   value={item}
                                                   key={`${item}index`}
                                                   sx={{
                                                      textOverflow: 'ellipsis',
                                                      overflow: 'hidden',
                                                      whiteSpace: 'nowrap',
                                                      maxWidth: '300px',
                                                   }}
                                                />
                                             )
                                          )}
                                    </TableCell>
                                 </TableRow>
                              </TableBody>
                           </Table>
                        </Grid>
                     </TabPanel>
                     <TabPanel
                        value={'winners'}
                        sx={{
                           height: PageWith5Toolbar,
                           pt: '6px !important',
                           overflow: 'auto',
                        }}
                     >
                        <Grid
                           container
                           direction="row"
                           alignItems="center"
                           mb={2}
                           spacing={0}
                        >
                           <Table
                              sx={{
                                 '.MuiTableBody-root .MuiTableRow-root>th': {
                                    padding: '5px',
                                 },
                                 'tr th,tr td': {
                                    borderRadius: '0 !important',
                                    borderBottomLeftRadius: '0 !important',
                                 },
                                 '.topHead tr th:first-child': {
                                    borderTopLeftRadius: '8px !important',
                                 },
                                 '.topHead tr th:last-child': {
                                    borderTopRightRadius: '8px !important',
                                 },
                              }}
                           >
                              <TableHead className="topHead">
                                 <TableRow>
                                    <TableCell
                                       sx={{ width: '50px !important' }}
                                       component="th"
                                       scope="row"
                                    >
                                       Rank
                                    </TableCell>
                                    <TableCell
                                       component="th"
                                       scope="row"
                                       sx={{
                                          textAlign: 'center !important',
                                       }}
                                    >
                                       Player ID
                                    </TableCell>
                                    <TableCell
                                       component="th"
                                       scope="row"
                                       sx={{ textAlign: 'left !important' }}
                                    >
                                       Nickname
                                    </TableCell>
                                    {[
                                       UserScope.SUPERADMIN,
                                       UserScope.ADMIN,
                                    ].includes(user?.scope) && (
                                       <TableCell
                                          component="th"
                                          scope="row"
                                          sx={{
                                             textAlign: 'center !important',
                                          }}
                                       >
                                          Operator
                                       </TableCell>
                                    )}
                                    <TableCell
                                       component="th"
                                       sx={{
                                          textAlign: 'center !important',
                                       }}
                                       scope="row"
                                    >
                                       Win Odds
                                    </TableCell>
                                    <TableCell
                                       component="th"
                                       scope="row"
                                       sx={{
                                          textAlign: 'center !important',
                                       }}
                                    >
                                       Prizes
                                    </TableCell>
                                    <TableCell
                                       component="th"
                                       sx={{ width: '50px !important' }}
                                    />
                                 </TableRow>
                              </TableHead>
                              <TableBody>
                                 {currentTournament?.tournamentData &&
                                    currentTournament?.tournamentData.length >
                                       0 &&
                                    currentTournament?.tournamentData?.map(
                                       (item: any, index: number) =>
                                          currentTournamentSearch?.findIndex(
                                             (itemSearch: any) =>
                                                itemSearch.playerId ===
                                                item.playerId
                                          ) > -1 && (
                                             <CustomRow
                                                key={item.playerId}
                                                row={{ ...item, index: index }}
                                             />
                                          )
                                    )}
                              </TableBody>
                           </Table>
                        </Grid>
                     </TabPanel>
                  </TabContext>
               </Grid>
            </DialogContent>
         </Dialog>
      </Box>
   )
}
