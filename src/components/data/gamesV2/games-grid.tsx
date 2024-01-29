import SelectTheme from '@/components/SelectTheme'
import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import {
   renderGameCell,
   renderTimeCell,
} from '@/components/custom/PortalRenderCells'
import TransitionSlide from '@/components/custom/TransitionSlide'
import {
   EditGameV2Dto,
   GameSubtype,
   GameType,
   GameV2,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { SortDirection } from '@alienbackoffice/back-front/lib/lib/dto/pagination.dto'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Autocomplete,
   Box,
   Button,
   Checkbox,
   Dialog,
   DialogActions,
   FormControl,
   FormControlLabel,
   FormGroup,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridSortModel,
} from '@mui/x-data-grid-pro'
import { ErrorMessage, Field, Formik } from 'formik'
import React, { MouseEventHandler } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { selectAuthGameV2List, selectAuthLanguages } from 'redux/authSlice'
import { selectloadingGamesV2List } from 'redux/loadingSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import * as Yup from 'yup'
import {
   useEditeGameV2Mutation,
   useGetGameListQueryProps,
   useGetGameV2ListQuery,
} from './lib/hooks/queries'

export default function AllGamesV2(dataFilter: useGetGameListQueryProps) {
   const loadingGamesList = useSelector(selectloadingGamesV2List)
   const languages = useSelector(selectAuthLanguages)
   const languagesData = languages ? languages.map((item) => item.value) : []
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const [dataSort, setDataSort] = React.useState<{
      readonly gameId?: SortDirection
      readonly title?: SortDirection
   }>({
      gameId: 1,
   })
   const [action, setAction] = React.useState(0)
   const [currentGame, setCurrentGame] = React.useState({} as GameV2)
   const [Transition, setTransition] = React.useState<any>()
   const [openEditGame, setOpenEditGame] = React.useState(false)
   const [refresh, setRefresh] = React.useState(0)
   const Actions = (data: GameV2) => {
      let actiondata: {
         value: string
         label: React.ReactElement | string
         onClick?: MouseEventHandler<any> | undefined
         disabled?: boolean
      }[] = [
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
      ]
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_SET_PLAYER_NICKNAME_REQ
         )
      ) {
         actiondata.push({
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
            onClick: () => openEditGameOpen(data),
         })
      }
      return actiondata
   }
   const post: useGetGameListQueryProps = {
      limit: paginationModel.pageSize,
      page: paginationModel.page,
      sort: dataSort,
      gameId: dataFilter.gameId,
      title: dataFilter.title,
      refresh: refresh,
   }
   const data = useSelector(selectAuthGameV2List)
   const columns: GridColDef[] = [
      {
         field: 'gameId',
         headerName: 'Game',
         renderCell: (params) =>
            renderGameCell(params.value, params.row.title, '', true),
         minWidth: 130,
         flex: 1,
         hideable: false,
         filterable: false,
      },
      {
         field: 'title',
         headerName: 'title',
         renderCell: (params) => <PortalCopyValue value={params.value} />,
         minWidth: 100,
         sortable: false,
         flex: 1,
      },
      {
         field: 'rtp',
         headerName: 'RTP',
         renderCell: (params) => params.value,
         minWidth: 100,
         sortable: false,
         flex: 1,
      },
      {
         field: 'gameProvider',
         headerName: 'Provider',
         renderCell: (params) => params.value,
         minWidth: 100,
         sortable: false,
         flex: 1,
      },
      {
         field: 'gameType',
         headerName: 'Type',
         renderCell: (params) => params.value,
         minWidth: 100,
         sortable: false,
         flex: 1,
      },
      {
         field: 'configType',
         headerName: 'Config Type',
         renderCell: (params) => params.value,
         minWidth: 100,
         sortable: false,
         flex: 1,
      },
      {
         field: 'launchUrl',
         headerName: 'Launch URL',
         renderCell: (params) => (
            <PortalCopyValue color="primary" value={params.value} />
         ),
         minWidth: 100,
         sortable: false,
         flex: 1,
      },
      {
         field: 'createdAt',
         headerName: 'Created At',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
      },
      {
         field: 'updatedAt',
         headerName: 'Updated At',
         renderCell: (params) => renderTimeCell(params.value),
         minWidth: 150,
         flex: 1,
         cellClassName: 'caption-column',
      },
   ]
   if (hasDetailsPermission(UserPermissionEvent.BACKOFFICE_EDIT_GAMEV2_REQ)) {
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
         sortable: false,
         filterable: false,
         disableColumnMenu: true,
      })
   }
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)
   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({})
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))

   useGetGameV2ListQuery(post)

   const { mutate } = useEditeGameV2Mutation({
      onSuccess: () => {
         toast.success('You edit the game successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         setRefresh(refresh + 1)
         handleCloseEditGame()
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const handleSubmitAddNewGame = React.useCallback(
      (editdto: {
         gameId: string
         title?: string
         gameProvider: string
         gameType: GameType
         gameSubType?: GameSubtype
         rtp: number
         launchUrl: string
         vipOperatorIds: string[]
         isMultiplayer: boolean
         hasChat: boolean
         hasTournament: boolean
         isLive: boolean
         devices?: string
         jdList: string
         languages: string[]
      }) => {
         const dto: EditGameV2Dto = {
            gameId: editdto.gameId,
            title: editdto.title,
            gameProvider: editdto.gameProvider,
            gameType: editdto.gameType,
            gameSubType: editdto.gameSubType,
            rtp: editdto.rtp,
            launchUrl: editdto.launchUrl,
            vipOperatorIds: editdto.vipOperatorIds,
            isMultiplayer: editdto.isMultiplayer,
            hasChat: editdto.hasChat,
            hasTournament: editdto.hasTournament,
            isLive: editdto.isLive,
            devices: editdto.devices?.split(/\r?\n/),
            jdList: editdto.jdList?.split(/\r?\n/),
            languages:
               languages
                  ?.filter((item) => editdto.languages.includes(item.label))
                  ?.map((item) => item.value) || [],
         }
         mutate({ dto: dto })
      },
      [mutate]
   )

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field
         let data = {}
         fieldName === 'gameId'
            ? (data = {
                 gameId: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'createdAt'
            ? (data = {
                 createdAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : (data = {
                 updatedAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
         setDataSort(data)
      },
      []
   )

   const openEditGameOpen = (game: GameV2) => {
      setTransition(TransitionSlide)
      setCurrentGame(game)
      setOpenEditGame(true)
   }

   const handleCloseEditGame = () => {
      setOpenEditGame(false)
   }

   React.useEffect(() => {
      setRowCountState((prevRowCountState: number) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      )
   }, [data?.count, setRowCountState])

   return (
      <Box
         className="dataGridWrapper"
         sx={{
            height: 'calc(100vh - 235px)',
            width: isDesktop
               ? isLgUp
                  ? 'calc(100vw - 384px)'
                  : 'calc(100vw - 250px)'
               : '100%',
            '.MuiDataGrid-row:hover, .MuiDataGrid-row:focus': {
               '.showOnHover,': {
                  opacity: 1,
               },
            },
            '.MuiDataGrid-row .showOnHover': {
               opacity: 0.2,
            },
         }}
      >
         <DataGridPro
            disableVirtualization
            sx={GridStyle}
            getRowId={(row) => row.gameId}
            rows={data?.games || []}
            paginationMode="server"
            sortingMode="server"
            rowCount={rowCountState | 0}
            columns={columns}
            disableRowSelectionOnClick
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 30, 40, 50, 100]}
            sortingOrder={['desc', 'asc']}
            onSortModelChange={handleSortModelChange}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
               setColumnVisibilityModel(newModel)
            }
            loading={loadingGamesList}
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
            open={openEditGame}
            onClose={handleCloseEditGame}
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
               Edit game
            </Typography>
            <Formik
               initialValues={{
                  gameId: currentGame.gameId,
                  gameProvider: currentGame.gameProvider,
                  gameType: currentGame.gameType,
                  gameSubType: currentGame.gameSubType,
                  hasChat: currentGame.hasChat,
                  hasTournament: currentGame.hasTournament,
                  isLive: currentGame.isLive,
                  isMultiplayer: currentGame.isMultiplayer,
                  languages: currentGame.languages || [],
                  vipOperatorIds: currentGame.vipOperatorIds || [],
                  jdList: currentGame.jdList?.join('\n') || '',
                  launchUrl: currentGame.launchUrl,
                  rtp: currentGame.rtp,
                  title: currentGame.title,
                  devices: currentGame.devices?.join('\n') || '',
               }}
               enableReinitialize={true}
               validationSchema={Yup.object().shape({
                  gameId: Yup.string().required('Game Id is required'),
                  title: Yup.string().required('Title  is required'),
                  gameProvider: Yup.string().required(
                     'Game Provider is required'
                  ),
                  gameType: Yup.string().required('Game Type is required'),
                  rtp: Yup.number().required('rtp  is required'),
                  launchUrl: Yup.string().required('Launch Url is required'),
                  languages: Yup.array()
                     .required('Languages is required')
                     .min(1, 'Languages is required'),
                  vipOperatorIds: Yup.array()
                     .required('Vip Operator  is required')
                     .min(1, 'Vip Operator is required'),
                  jdList: Yup.string().required(
                     'Jurisdiction List is required'
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
                           }}
                        >
                           <Autocomplete
                              options={Object.values(GameType)}
                              sx={{
                                 width: '100%',
                                 mb: 3,
                                 '.MuiAutocomplete-input': {
                                    cursor: 'pointer',
                                 },
                              }}
                              value={values.gameType}
                              onChange={(e, selectedGameType) => {
                                 // Use Formik's setFieldValue to update the 'languages' field
                                 setFieldValue('gameType', selectedGameType)
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label="Game Type"
                                    variant="outlined"
                                    name="gameType"
                                    fullWidth
                                    InputProps={{
                                       ...params.InputProps,
                                       endAdornment: (
                                          <FontAwesomeIcon
                                             icon={faAngleDown as IconProp}
                                             className="selectIcon"
                                             size="sm"
                                          />
                                       ),
                                    }}
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
                              '.MuiAutocomplete-input': {
                                 cursor: 'pointer',
                              },
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
                                    InputProps={{
                                       ...params.InputProps,
                                       endAdornment: (
                                          <FontAwesomeIcon
                                             icon={faAngleDown as IconProp}
                                             className="selectIcon"
                                             size="sm"
                                          />
                                       ),
                                    }}
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
                           onBlur={handleBlur}
                           onKeyDown={(e) => {
                              // Allow only numeric keys, backspace, and delete
                              if (
                                 !(
                                    e.key.match(/^[0-9]$/) ||
                                    e.key === 'Backspace' ||
                                    e.key === 'Delete' ||
                                    (e.ctrlKey && e.key === 'v') ||
                                    (e.key === '.' && values.rtp % 1 === 0)
                                 )
                              ) {
                                 e.preventDefault()
                              }
                           }}
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
                           helperText={touched.launchUrl && errors.launchUrl}
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                           sx={{ mb: 3 }}
                        />
                        <FormControl
                           sx={{
                              width: '100%',
                              mb: 3,
                              '.MuiAutocomplete-input': {
                                 cursor: 'pointer',
                              },
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
                                 setFieldValue('languages', selectedLanguages)
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label="Select language"
                                    variant="outlined"
                                    name="languages"
                                    fullWidth
                                    InputProps={{
                                       ...params.InputProps,
                                       endAdornment: (
                                          <FontAwesomeIcon
                                             icon={faAngleDown as IconProp}
                                             className="selectIcon"
                                             size="sm"
                                          />
                                       ),
                                    }}
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
                                 '.MuiAutocomplete-input': {
                                    cursor: 'pointer',
                                 },
                              }}
                              multiple
                              value={values.vipOperatorIds}
                              onChange={(e, selectedOperator) => {
                                 // Use Formik's setFieldValue to update the 'languages' field
                                 setFieldValue(
                                    'vipOperatorIds',
                                    selectedOperator
                                 )
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label="Vip Operators"
                                    variant="outlined"
                                    name="vipOperatorIds"
                                    fullWidth
                                    InputProps={{
                                       ...params.InputProps,
                                       endAdornment: (
                                          <FontAwesomeIcon
                                             icon={faAngleDown as IconProp}
                                             className="selectIcon"
                                             size="sm"
                                          />
                                       ),
                                    }}
                                 />
                              )}
                           />
                           {touched.vipOperatorIds && errors.vipOperatorIds && (
                              <ErrorMessage
                                 name={'vipOperatorIds'}
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
                           error={Boolean(touched.devices && errors.devices)}
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
                           error={Boolean(touched.jdList && errors.jdList)}
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
                                 control={<Checkbox checked={values.hasChat} />}
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
                                    <Checkbox checked={values.hasTournament} />
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
                                    <Checkbox checked={values.isMultiplayer} />
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
                                 control={<Checkbox checked={values.isLive} />}
                                 label={'Live'}
                              />
                           </FormGroup>
                        </FormControl>
                     </Box>
                     <DialogActions>
                        <Button onClick={handleCloseEditGame} color="error">
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
         </Dialog>
      </Box>
   )
}
