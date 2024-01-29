import CustomLoader from '@/components/custom/CustomLoader'
import PortalCopyValue from '@/components/custom/PortalCopyValue'
import TransitionSlide from '@/components/custom/TransitionSlide'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import { useSetMessagesInLanguageQuery } from '@/components/data/messages/lib/hooks/queries'
import MessagesDataDetails from '@/components/data/messages/message-details-grid'
import StatusTextField from '@/components/data/messages/status-text-field'
import { OperatorMessageCode } from '@alienbackoffice/back-front'
import { SetMessagesInLanguageDto } from '@alienbackoffice/back-front/lib/operator/dto/set-messages-in-language.dto'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faAdd,
   faAngleDown,
   faRectangleXmark,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Autocomplete,
   Box,
   Dialog,
   DialogActions,
   DialogContent,
   Grid,
   Button as MuiButton,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { spacing } from '@mui/system'
import { ImoonGray, darkPurple } from 'colors'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   saveMessagesInLanguageInBrand,
   selectAuthLanguages,
   selectAuthMessagesInLanguageInBrand,
} from 'redux/authSlice'
import { saveLoadingMessagesInLanguageInBrand } from 'redux/loadingSlice'
import { store } from 'redux/store'
import { keysToString } from 'services/globalFunctions'
import DashboardLayout from '../../layouts/Dashboard'

const Button = styled(MuiButton)(spacing)

function MessageList() {
   const router = useRouter()
   const { opId, brandId, code } = router.query
   const dataLanguages = useSelector(selectAuthMessagesInLanguageInBrand)
   const theme = useTheme()
   const [title, setTitle]: any = React.useState()
   const [ignore, setIgnore] = React.useState(false)
   const languages = useSelector(selectAuthLanguages)
   const [open, setOpen] = React.useState(false)
   const [Transition, setTransition]: any = React.useState()
   const [message, setMessage] = React.useState<string>('')
   const [params, setParams] = React.useState<string[]>([])
   const [lang, setLang] = React.useState('')
   const languagesData = languages ? languages.map((item) => item.value) : []
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const [data, setData] = React.useState({
      count: 0,
      messages: [] as {
         msg: string
         language: string
         params?: string[]
      }[],
   })

   const { mutate } = useSetMessagesInLanguageQuery({
      onSuccess: () => {
         toast.success('You added new language Successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         handleClose()
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const handleClose = async () => {
      setOpen(false)
   }

   const handleClickOpen = () => {
      setTransition(TransitionSlide)
      setMessage('')
      setParams(data?.messages[0]?.params || [])
      setOpen(true)
   }

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
      oldMessageTextInLanguage: {
         language: string
         msg: string
         params?: string[]
      }[]
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

   useEffect(() => {
      if (!ignore && code && brandId && opId) {
         store.dispatch(saveLoadingMessagesInLanguageInBrand(true))
         store.dispatch(saveMessagesInLanguageInBrand([]))
         setTitle(OperatorMessageCode[Number(code)])
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   })

   useEffect(() => {
      if (code) {
         const codeMessage = Array.isArray(code)
            ? code[0]?.toString() // Convert the first element of the array to a number
            : code?.toString() // Convert the code to a number if it's a string or undefined
         const dataLast = keysToString(dataLanguages)
         const dataUpdateType =
            codeMessage &&
            (dataLast[codeMessage] as {
               byLanguage?: {
                  [key: string]: {
                     messageText?: string
                  }
               }
               params?: string[]
            })

         let dataMessage: any = []

         if (dataUpdateType && dataUpdateType.byLanguage) {
            Object.keys(dataUpdateType.byLanguage).map((item) => {
               const language = item
               const messageText =
                  dataUpdateType.byLanguage &&
                  dataUpdateType.byLanguage[item]?.messageText // Use optional chaining here
               const params = dataUpdateType.params

               dataMessage.push({
                  language,
                  msg: messageText,
                  params,
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
      brandId &&
      opId &&
      code && (
         <React.Fragment>
            <Helmet title="iMoon | Message List" />
            <CustomOperatorsBrandsToolbar
               title={'Message Details'}
               background={
                  isDesktop
                     ? theme.palette.secondary.dark
                     : theme.palette.primary.main
               }
               actions={
                  <>
                     <Grid item>
                        <Button
                           onClick={() => handleClickOpen()}
                           color="info"
                           variant="contained"
                           sx={{
                              borderRadius: '8px',
                              '&:hover': {
                                 background: '#8098F9',
                              },
                              padding: '4px 8px',
                              letterSpacing: '0.48px',
                              gap: '2px',
                              height: '28px',
                           }}
                        >
                           <FontAwesomeIcon
                              icon={faAdd as IconProp}
                              fixedWidth
                              fontSize={12}
                              height={'initial'}
                              width={'12px'}
                           />{' '}
                           New Language
                        </Button>
                     </Grid>
                  </>
               }
            />
            <Grid
               container
               alignItems="center"
               mb={isDesktop ? 0 : '6px'}
               p={isLgUp ? '12px' : '4px'}
               spacing={2}
               sx={{
                  background: isDesktop ? 'initial' : darkPurple[4],
                  '.MuiGrid-root>.MuiBox-root': {
                     position: 'relative',
                     border: `1px solid ${ImoonGray[10]}`,
                     height: '28px',
                     p: '4px 6px',
                     alignItems: 'center',
                     display: 'grid',
                     textAlign: 'center',
                     borderRadius: '8px',
                     maxWidth: 'fit-content',
                     pl: '20px',
                  },
                  '.MuiBox-root .MuiStack-root svg': {
                     position: 'absolute',
                     left: '4px',
                     top: '6px',
                  },
               }}
            >
               <Grid item pt={0}>
                  <Box
                     mb={0}
                     borderRadius={8}
                     display={'inline-flex'}
                     gap={2}
                     width={'100%'}
                     justifyContent={'center'}
                  >
                     <PortalCopyValue
                        title={'Title:'}
                        value={title}
                        isVisible={true}
                        sx={{
                           color: (props) =>
                              isDesktop
                                 ? '#1570EF'
                                 : props.palette.primary.contrastText,
                        }}
                        whiteSpace={'nowrap'}
                     />
                  </Box>
               </Grid>
               <Grid item pt={0}>
                  <Box
                     mb={0}
                     borderRadius={8}
                     display={'inline-flex'}
                     gap={2}
                     width={'100%'}
                     justifyContent={'center'}
                  >
                     <PortalCopyValue
                        title={' Code:'}
                        value={code.toLocaleString()}
                        isVisible={true}
                        sx={{
                           color: (props) =>
                              isDesktop
                                 ? '#1570EF'
                                 : props.palette.primary.contrastText,
                        }}
                        whiteSpace={'nowrap'}
                     />
                  </Box>
               </Grid>
            </Grid>
            {ignore ? (
               <>
                  <MessagesDataDetails />
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
                              Add new language
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
                           mb={2}
                           spacing={0}
                           mt={0}
                        >
                           <Grid item xs={12}>
                              <Autocomplete
                                 options={languagesData}
                                 id="demo-simple-select"
                                 sx={{
                                    width: '100%',
                                    svg: {
                                       position: 'relative',
                                       top: '-4px',
                                       fontSize: '16px',
                                       height: '16px',
                                    },
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
                                          // Use FontAwesome icon as the select icon
                                          endAdornment: (
                                             <FontAwesomeIcon
                                                className="selectIcon"
                                                icon={faAngleDown as IconProp}
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
                                 messageId={'addSelect'}
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
               </>
            ) : (
               <CustomLoader />
            )}
         </React.Fragment>
      )
   )
}

MessageList.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Message List">{page}</DashboardLayout>
}

export default MessageList
