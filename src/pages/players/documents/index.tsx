import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import {
   useConfirmPlayerKycVerificationMutation,
   useRejectPlayerKycVerificationMutation,
} from '@/components/data/players/lib/hooks/queries'
import {
   ConfirmPlayerKycVerificationDto,
   Player,
   RejectPlayerKycVerificationDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { PlayerVerificationStatus } from '@alienbackoffice/back-front/lib/player/enum/player-verification-status.enum'
import { PlayerKycVerification } from '@alienbackoffice/back-front/lib/player/interfaces/player-kyc-verification.interface'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faRectangleXmark } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
   Box,
   Button,
   Card,
   CardContent,
   Chip,
   Dialog,
   DialogActions,
   Grid,
   Tab as MuiTab,
   Slide,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { ImoonGray, darkPurple } from 'colors'
import React from 'react'
import { toast } from 'react-toastify'
import { PageWith3Toolbar } from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import DetailDocument from './details'

const Transition = React.forwardRef(function Transition(
   props: TransitionProps & {
      children: React.ReactElement<any, any>
   },
   ref: React.Ref<unknown>
) {
   return <Slide direction="left" ref={ref} {...props} />
})

function Documents(dataFilter: { data: Player; updateDocument: Function }) {
   const documents = dataFilter.data?.kyc
      ?.verifications as PlayerKycVerification[]
   const theme = useTheme()
   const BadgeRole = styled(Chip)`
      height: 20px;
      z-index: 1;
      span.MuiChip-label,
      span.MuiChip-label:hover {
         font-size: 11px;
         cursor: pointer;
         color: ${(props) => props.theme.sidebar.badge.color};
         padding-left: ${(props) => props.theme.spacing(2)};
         padding-right: ${(props) => props.theme.spacing(2)};
      }
   `
   const [keyResponse, setKeyResponse] = React.useState(0)
   const [open, setOpen] = React.useState(false)
   const [editReviewd, setEditReviewd] = React.useState(false)
   const [document, setDocument] = React.useState({} as PlayerKycVerification)
   const [messageForPlayer, setMessageForPlayer] = React.useState('')
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

   const handleClickOpen = (value: PlayerKycVerification) => {
      setDocument(value)
      setMessageForPlayer(value.messageForPlayer || '')
      setEditReviewd(false)
      setOpen(true)
   }

   const handleClose = () => {
      setOpen(false)
   }

   const Tab = styled(MuiTab)`
      color: ${(props) => props.theme.palette.primary};
      &.Mui-selected {
      }
   `

   const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      const documentData =
         (documents.find(
            (item) => item.uuid === newValue
         ) as PlayerKycVerification) || {}
      setDocument(documentData)
   }

   const { mutate: mutateConfirmPlayerKycVerification } =
      useConfirmPlayerKycVerificationMutation({
         onSuccess: (data) => {
            toast.success(`You confirmed ${document.title} successfully `, {
               position: toast.POSITION.TOP_CENTER,
            })
            setKeyResponse(keyResponse + 1)
            dataFilter.updateDocument()
            handleClose()
         },
      })

   const handleConfirmPlayerKycVerificationDto = React.useCallback(
      (dto: ConfirmPlayerKycVerificationDto) => {
         mutateConfirmPlayerKycVerification({ dto })
      },
      [mutateConfirmPlayerKycVerification]
   )

   const { mutate: mutateRejectPlayerKycVerification } =
      useRejectPlayerKycVerificationMutation({
         onSuccess: (data) => {
            toast.success(`You rejected ${document.title} successfully `, {
               position: toast.POSITION.TOP_CENTER,
            })
            setKeyResponse(keyResponse + 1)
            dataFilter.updateDocument()
            handleClose()
         },
      })

   const handleRejectPlayerKycVerificationDto = React.useCallback(
      (dto: RejectPlayerKycVerificationDto) => {
         mutateRejectPlayerKycVerification({ dto })
      },
      [mutateRejectPlayerKycVerification]
   )

   return (
      <React.Fragment key={keyResponse}>
         {dataFilter.data?.kyc?.verifications?.map((item, index) => (
            <Box className="box-texfield-style" key={`document${index}`}>
               <Grid container alignItems="center">
                  <Grid item>
                     <Typography
                        variant="bodySmallBold"
                        component={'p'}
                        letterSpacing={'0.36px'}
                        lineHeight={'15.6px'}
                        color={darkPurple[9]}
                     >
                        {item.title}
                     </Typography>
                     <BadgeRole
                        label={item.status}
                        color={
                           item.status === PlayerVerificationStatus.PENDING
                              ? 'warning'
                              : item.status ===
                                PlayerVerificationStatus.CONFIRMED
                              ? 'success'
                              : 'error'
                        }
                     />
                  </Grid>
                  <Grid item xs></Grid>
                  <Grid item>
                     <Button
                        color="info"
                        fullWidth
                        variant="contained"
                        onClick={() => handleClickOpen(item)}
                        sx={{
                           background: '#444CE7',
                           color: darkPurple[12],
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
                        View Details
                     </Button>
                  </Grid>
               </Grid>
            </Box>
         ))}
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
                  width: '100%',
                  maxWidth: isDesktop
                     ? 'calc(100% - 220px) !important'
                     : '100%',
                  padding: isDesktop ? '0 !Important' : '5px',
               },
               '.MuiTabPanel-root': {
                  height: PageWith3Toolbar,
                  overflow: 'auto',
               },
            }}
         >
            {isDesktop ? (
               <CustomOperatorsBrandsToolbar
                  title={'Documents'}
                  backMethods={handleClose}
                  background={
                     isDesktop
                        ? theme.palette.secondary.dark
                        : theme.palette.primary.main
                  }
               />
            ) : (
               <Grid
                  container
                  direction="row"
                  alignItems="center"
                  p={'12px 8px'}
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
                        Documents
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
            )}

            {document && document.title && (
               <TabContext value={document.uuid}>
                  <TabList
                     className="detail_tabs"
                     onChange={handleChange}
                     aria-label={document.description}
                     variant="scrollable"
                     scrollButtons={true}
                     sx={{
                        '.MuiTab-root': {
                           display: 'flex',
                           flexDirection: 'row',
                           alignItems: 'center',
                        },
                     }}
                  >
                     {dataFilter.data?.kyc?.verifications.map((item) => (
                        <Tab
                           key={`tab${item.uuid}`}
                           label={
                              <Typography variant="bodySmallBold">
                                 {item.title}
                              </Typography>
                           }
                           value={item.uuid}
                        />
                     ))}
                  </TabList>
                  {dataFilter.data?.kyc?.verifications.map((item) => (
                     <TabPanel
                        key={`tabPanel${item.uuid}`}
                        value={item.uuid}
                        sx={{ padding: '8px !important' }}
                     >
                        <Card
                           sx={{
                              width: '100% !important',
                              height: 'initial',
                              overflowY: 'auto',
                              mb: '8px',
                              '.box-texfield-style': {
                                 p: '16px',
                                 border: `1px solid ${darkPurple[11]}`,
                                 borderRadius: '8px',
                                 background: darkPurple[12],
                                 mb: '6px',
                              },
                              '&.MuiPaper-root': {
                                 maxWidth: '100%!important',
                              },
                              fieldset: {
                                 border: `1px solid ${darkPurple[11]}!important`,
                              },
                           }}
                        >
                           <CardContent sx={{ pb: '6px !important' }}>
                              <DetailDocument
                                 document={item}
                                 player={dataFilter.data as Player}
                                 setEditReviewd={() => setEditReviewd(true)}
                              />
                              {((document &&
                                 document.status ===
                                    PlayerVerificationStatus.PENDING) ||
                                 editReviewd) && (
                                 <TextField
                                    name="messageForPlayer"
                                    label="Message"
                                    type="text"
                                    required
                                    error={!messageForPlayer}
                                    multiline
                                    rows={10}
                                    value={messageForPlayer}
                                    autoComplete="off"
                                    fullWidth
                                    onChange={(e) =>
                                       setMessageForPlayer(e.target.value)
                                    }
                                    sx={{}}
                                    variant="outlined"
                                 />
                              )}
                              {((document &&
                                 document.status ===
                                    PlayerVerificationStatus.PENDING) ||
                                 editReviewd) && (
                                 <DialogActions>
                                    {[
                                       PlayerVerificationStatus.CONFIRMED,
                                       PlayerVerificationStatus.REJECTED,
                                    ].includes(document.status) && (
                                       <Button
                                          onClick={() => {
                                             setEditReviewd(false)
                                          }}
                                          variant="outlined"
                                          color="primary"
                                          sx={{
                                             height: 32,
                                             svg: {
                                                marginRight: '5px',
                                                path: {
                                                   color: ImoonGray[6],
                                                },
                                             },
                                             color: `${ImoonGray[6]}!important`,
                                          }}
                                       >
                                          Cancel
                                       </Button>
                                    )}
                                    {hasDetailsPermission(
                                       UserPermissionEvent.BACKOFFICE_REJECT_PLAYER_KYC_VERIFICATION_REQ
                                    ) && (
                                       <Button
                                          onClick={() =>
                                             handleRejectPlayerKycVerificationDto(
                                                {
                                                   opId: dataFilter.data.opId,
                                                   playerId:
                                                      dataFilter.data.playerId,
                                                   uuid: document.uuid,
                                                   messageForPlayer:
                                                      messageForPlayer,
                                                }
                                             )
                                          }
                                          disabled={!messageForPlayer}
                                          color="secondary"
                                          variant="outlined"
                                          sx={{ height: 32 }}
                                       >
                                          Reject
                                       </Button>
                                    )}

                                    {hasDetailsPermission(
                                       UserPermissionEvent.BACKOFFICE_CONFIRM_PLAYER_KYC_VERIFICATION_REQ
                                    ) && (
                                       <Button
                                          onClick={() =>
                                             handleConfirmPlayerKycVerificationDto(
                                                {
                                                   opId: dataFilter.data.opId,
                                                   playerId:
                                                      dataFilter.data.playerId,
                                                   uuid: document.uuid,
                                                   messageForPlayer:
                                                      messageForPlayer,
                                                }
                                             )
                                          }
                                          disabled={!messageForPlayer}
                                          color="secondary"
                                          variant="contained"
                                          sx={{ height: 32 }}
                                       >
                                          Approve
                                       </Button>
                                    )}
                                 </DialogActions>
                              )}
                           </CardContent>
                        </Card>
                     </TabPanel>
                  ))}
               </TabContext>
            )}
         </Dialog>
      </React.Fragment>
   )
}

export default Documents
