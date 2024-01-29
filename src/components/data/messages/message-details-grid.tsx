import SelectTheme from '@/components/SelectTheme'
import GridStyle from '@/components/custom/GridStyle'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import TransitionSlide from '@/components/custom/TransitionSlide'
import { SetMessagesInLanguageDto } from '@alienbackoffice/back-front/lib/operator/dto/set-messages-in-language.dto'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown, faRectangleXmark } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Autocomplete,
   Box,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogProps,
   DialogTitle,
   Grid,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro'
import { darkPurple } from 'colors'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   selectAuthLanguages,
   selectAuthMessagesInLanguageInBrand,
} from 'redux/authSlice'
import { selectloadingMessagesInLanguageInBrand } from 'redux/loadingSlice'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWith3Toolbar,
   PageWith4Toolbar,
   keysToString,
} from 'services/globalFunctions'
import {
   GetMessagesInLanguageDtoParams,
   useGetMessagesInLanguageQuery,
   useSetMessagesInLanguageQuery,
} from './lib/hooks/queries'
import StatusTextField from './status-text-field'

export default function MessagesDataDetails() {
   const router = useRouter()
   const [lang, setLang] = React.useState('')
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [Transition, setTransition] = React.useState<any>()
   const [message, setMessage] = React.useState('')
   const [params, setParams] = React.useState<string[]>([])
   const [open, setOpen] = React.useState(false)
   const [data, setData] = React.useState({
      count: 0,
      messages: [] as {
         language: string
         msg: string
         params: []
      }[],
   })
   const { opId, brandId, code } = router.query
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   })
   const [action, setAction] = React.useState(0)
   const isLoadingMessage = useSelector(selectloadingMessagesInLanguageInBrand)
   const [openRemoveLang, setOpenRemoveLang] = React.useState(false)
   const [currentLang, setCurrentLang] = React.useState<string>('')
   const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm')
   const [fullWidth, setFullWidth] = React.useState(true)
   const languages = useSelector(selectAuthLanguages)
   const languagesData = languages ? languages.map((item) => item.value) : []
   const dataLanguages = useSelector(selectAuthMessagesInLanguageInBrand)
   const [rowCountState, setRowCountState] = React.useState(data?.count || 0)

   const Actions = (data: {
      msg: string
      language: string
      params?: string[]
   }) => {
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
         {
            value: '2',
            label: (
               <Typography
                  variant="bodySmallBold"
                  sx={{
                     svg: { position: 'relative', top: '3px', mr: '15px' },
                     flex: 1,
                  }}
               >
                  Delete
               </Typography>
            ),
            onClick: () => handleOpenRemoveLang(data.language),
         },
      ]
      return actiondata
   }

   const columns: GridColDef[] = [
      {
         field: 'language',
         headerName: 'Language',
         renderCell: (params) =>
            params && params.value && <PortalCopyValue value={params.value} />,
         width: 150,
         hideable: false,
         filterable: false,
      },
      {
         field: 'msg',
         align: 'left',
         headerAlign: 'left',
         headerName: 'messages',
         renderCell: (params) => (
            <PortalCopyValue
               value={params.value}
               sx={{
                  '.MuiTypography-root': {
                     fontSize: 12,
                     fontFamily: 'Nunito Sans SemiBold',
                     overflow: 'hidden',
                     whiteSpace: 'break-spaces',
                     maxWidth: '500px',
                  },
               }}
            />
         ),
         minWidth: 250,
         flex: 1,
         sortable: false,
         editable: true,
      },
      {
         field: 'params',
         headerName: 'Params',
         headerAlign: 'left',
         align: 'left',
         renderCell: (params) =>
            params && params.value ? (
               <PortalCopyValue
                  value={params.value?.join(', ')}
                  sx={{
                     '.MuiTypography-root': {
                        fontSize: 12,
                        fontFamily: 'Nunito Sans SemiBold',
                        overflow: 'hidden',
                        whiteSpace: 'break-spaces',
                        maxWidth: '260px',
                        textOverflow: 'ellipsis',
                        position: 'relative',
                        top: '-4px',
                     },
                  }}
               />
            ) : (
               ''
            ),
         minWidth: 280,
         hideable: false,
         editable: true,
         flex: 1,
         sortable: false,
      },
      {
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
         width: 30,
         sortable: false,
         filterable: false,
         disableColumnMenu: true,
      },
   ]

   React.useEffect(() => {
      setRowCountState((prevRowCountState: number) =>
         data?.count !== undefined ? data?.count : prevRowCountState
      )
   }, [data?.count, setRowCountState])

   const handleClickOpen = (data: {
      msg: string
      language: string
      params?: string[]
   }) => {
      setLang(data.language)
      setTransition(TransitionSlide)
      setMessage(data.msg)
      setParams(data.params || [])
      setOpen(true)
   }

   const handleClose = async () => {
      setOpen(false)
   }

   const post: GetMessagesInLanguageDtoParams = {}
   if (brandId && opId) {
      post.brandId = Array.isArray(brandId)
         ? brandId[0].toString()
         : brandId?.toString()
      post.opId = Array.isArray(opId) ? opId[0].toString() : opId?.toString()
   }

   useGetMessagesInLanguageQuery(post)

   const handleCloseRemoveLang = () => {
      setOpenRemoveLang(false)
   }

   const handleOpenRemoveLang = (lang: string) => {
      setCurrentLang(lang)
      setOpenRemoveLang(true)
   }

   const { mutate } = useSetMessagesInLanguageQuery({
      onSuccess: () => {
         if (openRemoveLang) {
            toast.success('You deleted the language Successfully', {
               position: toast.POSITION.TOP_CENTER,
            })
            handleCloseRemoveLang()
         } else {
            toast.success('You updated the messages Successfully', {
               position: toast.POSITION.TOP_CENTER,
            })
            handleClose()
         }
      },
      onError(error, variables, context) {
         toast.error(error)
      },
   })

   const handleSubmitMethods = React.useCallback(
      (data: SetMessagesInLanguageDto) => {
         mutate({ dto: data })
      },
      [mutate]
   )

   const handleSubmit = (item: {
      opId: string
      brandId: string
      messageCode: number
      oldMessageTextInLanguage: { language: string; msg: string; params: [] }[]
      newMessageLang: string
      newMessageText: string
   }) => {
      const messageTextInLanguage = item.oldMessageTextInLanguage.reduce(
         (obj, cur) => ({
            ...obj,
            [cur.language]: { messageText: cur.msg },
         }),
         {}
      )
      handleSubmitMethods({
         opId: item.opId,
         brandId: item.brandId,
         messageCode: item.messageCode,
         messageTextInLanguage: {
            ...messageTextInLanguage,
            [item.newMessageLang]: { messageText: item.newMessageText },
         },
      })
   }

   const handleSubmitRemove = (item: {
      opId: string
      brandId: string
      messageCode: number
      oldMessageTextInLanguage: {
         language: string
         msg?: string
         params?: []
      }[]
      langDeleted: string
   }) => {
      const messageTextInLanguage = item.oldMessageTextInLanguage
         .filter((itemOld) => itemOld.language !== item.langDeleted)
         .reduce(
            (obj, cur) => ({
               ...obj,
               [cur.language]: { messageText: cur.msg },
            }),
            {}
         )
      handleSubmitMethods({
         opId: item.opId,
         brandId: item.brandId,
         messageCode: item.messageCode,
         messageTextInLanguage: {
            ...messageTextInLanguage,
         },
      })
   }

   useEffect(() => {
      if (code) {
         const codeMessage = Array.isArray(code)
            ? code[0]?.toString()
            : code?.toString()
         const dataLast = keysToString(dataLanguages)
         const dataUpdateType = dataLast[codeMessage] as {
            byLanguage?: {
               [key: string]: {
                  messageText?: string
               }
            }
            params?: string[]
         }

         let dataMessage: {
            language: string
            msg: string
            params: []
         }[] = []

         if (dataUpdateType && dataUpdateType.byLanguage) {
            Object.keys(dataUpdateType.byLanguage).map((item: string) => {
               const language = item
               const messageText =
                  (dataUpdateType.byLanguage &&
                     dataUpdateType.byLanguage[item]?.messageText) ||
                  '' // Use optional chaining here
               const params = dataUpdateType.params || []

               dataMessage.push({
                  language,
                  msg: messageText,
                  params: params as [],
               })
            })
         } else {
            // Handle the case where dataUpdateType.byLanguage is undefined
            // You can add a default behavior or throw an error, depending on your use case.
         }
         setData({
            count: dataMessage.length,
            messages: dataMessage,
         })
      }
   }, [dataLanguages])

   return (
      opId &&
      brandId &&
      code && (
         <Box
            className="dataGridWrapper"
            mb={'0px'}
            px={isLgUp ? '12px' : '4px'}
            py={'6px'}
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
               getRowId={(row) => row?.language}
               rows={data?.messages || []}
               paginationMode="server"
               sortingMode="server"
               rowCount={rowCountState | 0}
               columns={columns}
               disableRowSelectionOnClick
               paginationModel={paginationModel}
               onPaginationModelChange={setPaginationModel}
               pagination
               pageSizeOptions={[10, 20, 30, 40, 50, 100]}
               sortingOrder={['desc', 'asc']}
               loading={isLoadingMessage}
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
               fullScreen
               TransitionComponent={Transition}
               keepMounted
               onClose={handleClose}
               aria-describedby="alert-dialog-slide-description"
               sx={{
                  '.MuiDialog-container': {
                     alignItems: 'end',
                     justifyContent: 'end',
                  },
                  '.MuiPaper-root': {
                     width: '600px',
                     padding: '5px',
                     p: '12px 4px!important',
                  },
               }}
            >
               <Grid
                  container
                  direction="row"
                  alignItems="center"
                  p={'4px 8px'}
                  spacing={0}
                  sx={{
                     svg: {
                        fontSize: '16px',
                        height: '16px',
                     },
                  }}
               >
                  <Grid item>
                     <Typography
                        variant="h5"
                        gutterBottom
                        display="inline"
                        mb={0}
                     >
                        Message details
                     </Typography>
                  </Grid>
                  <Grid item xs></Grid>
                  <Grid item>
                     <FontAwesomeIcon
                        icon={faRectangleXmark as IconProp}
                        onClick={handleClose}
                     />
                  </Grid>
               </Grid>
               <DialogContent
                  sx={{
                     p: 1,
                     '.MuiButtonBase-root': {
                        p: 0,
                     },
                  }}
               >
                  <Grid
                     container
                     direction="row"
                     alignItems="center"
                     mb={0}
                     spacing={0}
                     mt={0}
                  >
                     <Grid item xs={12}>
                        <Autocomplete
                           options={languagesData}
                           id="demo-simple-select"
                           sx={{
                              width: '100%',
                              '.MuiAutocomplete-input': {
                                 cursor: 'pointer',
                              },
                           }}
                           value={lang}
                           onChange={(_, newValue) =>
                              setLang(newValue as string)
                           }
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label="Select language"
                                 variant="outlined"
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
                        <StatusTextField
                           lang={lang}
                           msg={message}
                           params={params}
                           updateMessage={(e: string) => setMessage(e)}
                           messageId={'editSelect'}
                        />
                     </Grid>
                  </Grid>
               </DialogContent>
               <DialogActions>
                  <Button
                     onClick={() => handleClose()}
                     color="secondary"
                     variant="outlined"
                     sx={{ height: 32, borderColor: darkPurple[10] }}
                  >
                     Cancel
                  </Button>
                  <Button
                     onClick={() =>
                        handleSubmit({
                           opId: Array.isArray(opId)
                              ? opId[0].toString()
                              : opId.toString(),
                           brandId: Array.isArray(brandId)
                              ? brandId[0].toString()
                              : brandId.toString(),
                           messageCode: Array.isArray(code)
                              ? Number(code[0])
                              : Number(code),
                           oldMessageTextInLanguage: data.messages,
                           newMessageLang: lang,
                           newMessageText: message,
                        })
                     }
                     color="secondary"
                     variant="contained"
                     sx={{ height: 32 }}
                     disabled={!message || !lang}
                  >
                     Save
                  </Button>
               </DialogActions>
            </Dialog>
            <Dialog
               open={openRemoveLang}
               onClose={handleCloseRemoveLang}
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
               <DialogTitle id="form-dialog-title">Delete Language</DialogTitle>
               <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                     Are you sure you want to delete this language?
                  </DialogContentText>
               </DialogContent>

               <DialogActions>
                  <Button
                     onClick={handleCloseRemoveLang}
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
                     onClick={() =>
                        handleSubmitRemove({
                           opId: Array.isArray(opId)
                              ? opId[0].toString()
                              : opId.toString(),
                           brandId: Array.isArray(brandId)
                              ? brandId[0].toString()
                              : brandId.toString(),
                           messageCode: Array.isArray(code)
                              ? Number(code[0])
                              : Number(code),
                           oldMessageTextInLanguage: data.messages,
                           langDeleted: currentLang,
                        })
                     }
                  >
                     Confirm
                  </Button>
               </DialogActions>
            </Dialog>
         </Box>
      )
   )
}
