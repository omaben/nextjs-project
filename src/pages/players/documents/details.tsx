import PortalCopyValue from '@/components/custom/PortalCopyValue'
import { usePlayerKycVerificationRequirement } from '@/components/data/players/lib/hooks/queries'
import { Player, UserPermissionEvent } from '@alienbackoffice/back-front'
import { KycVerificationType } from '@alienbackoffice/back-front/lib/operator/enum/kyc-verification-type.enum'
import { SetPlayerKycVerificationRequirementDto } from '@alienbackoffice/back-front/lib/player/dto/set-player-kyc-verification-requirement.dto'
import { PlayerVerificationStatus } from '@alienbackoffice/back-front/lib/player/enum/player-verification-status.enum'
import { PlayerKycVerification } from '@alienbackoffice/back-front/lib/player/interfaces/player-kyc-verification.interface'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faEdit } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Box,
   Button,
   Checkbox,
   Chip,
   FormControlLabel,
   Grid,
   Typography,
} from '@mui/material'
import { ImoonGray, darkPurple } from 'colors'
import React from 'react'
import { toast } from 'react-toastify'
import { getFileTypeFromFileName } from 'services/helper'
import { hasDetailsPermission } from 'services/permissionHandler'
import createTheme from 'theme'
import { PLayerFileType } from 'types'
import { THEMES } from '../../../constants'

export default function DetailDocument(data: {
   player: Player
   document: PlayerKycVerification
   setEditReviewd: Function
}) {
   const { player, document } = data
   const [required, setRequired] = React.useState(document.required)
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
   const { mutate: mutatePlayerKycVerificationRequirement } =
      usePlayerKycVerificationRequirement({
         onSuccess: (data) => {
            toast.success(
               `You updated notification document status  successfully `, {
                  position: toast.POSITION.TOP_CENTER,
               }
            )
         },
      })

   const handleConfirmPlayerKycVerificationDto = React.useCallback(
      (dto: SetPlayerKycVerificationRequirementDto) => {
         mutatePlayerKycVerificationRequirement({ dto })
      },
      [mutatePlayerKycVerificationRequirement]
   )

   return (
      document && (
         <Box p={0} sx={{ position: 'relative' }}>
            <Grid
               container
               direction="row"
               alignItems="center"
               mb={2}
               spacing={2}
               justifyContent={'center'}
            >
               <Grid item xs></Grid>
               <Grid item mr={1}>
                  <Typography
                     variant="bodySmallBold"
                     letterSpacing={'0.36px'}
                     lineHeight={'15.6px'}
                     color={darkPurple[9]}
                  >
                     Status:{' '}
                  </Typography>
               </Grid>
               <Grid item>
                  <BadgeRole
                     label={document.status}
                     color={
                        document.status === PlayerVerificationStatus.PENDING
                           ? 'warning'
                           : document.status ===
                             PlayerVerificationStatus.CONFIRMED
                           ? 'success'
                           : 'error'
                     }
                  />
               </Grid>
               <Grid item xs></Grid>
               {[
                  PlayerVerificationStatus.CONFIRMED,
                  PlayerVerificationStatus.REJECTED,
               ].includes(document.status) &&
                  hasDetailsPermission(
                     UserPermissionEvent.BACKOFFICE_SET_KYC_VERIFICATIONS_REQ
                  ) && (
                     <Grid item>
                        <Button
                           variant="outlined"
                           color="primary"
                           sx={{
                              svg: {
                                 marginRight: '5px',
                                 path: {
                                    color: ImoonGray[6],
                                 },
                              },
                              color: `${ImoonGray[6]}!important`,
                           }}
                           onClick={() => data.setEditReviewd()}
                        >
                           <FontAwesomeIcon
                              icon={faEdit as IconProp}
                              color={
                                 createTheme(THEMES.DEFAULT).palette.warning
                                    .main
                              }
                              cursor={'pointer'}
                              fontSize={15}
                           />
                           Edit
                        </Button>
                     </Grid>
                  )}
            </Grid>
            <Grid
               container
               direction="row"
               alignItems="center"
               mb={2}
               spacing={0}
            >
               <Grid item>
                  <FormControlLabel
                     control={
                        <Checkbox
                           value={document.required}
                           checked={required}
                           color="primary"
                           disabled={
                              !hasDetailsPermission(
                                 UserPermissionEvent.BACKOFFICE_SET_PLAYER_KYC_VERIFICATION_REQUIREMENT_REQ
                              )
                           }
                           onChange={(e) => {
                              setRequired(e.target.checked)
                              handleConfirmPlayerKycVerificationDto({
                                 opId: player.opId,
                                 playerId: player.playerId,
                                 isRequired: e.target.checked,
                                 uuid: document.uuid,
                              })
                           }}
                        />
                     }
                     label="Required"
                  />
               </Grid>
            </Grid>
            {document.messageForPlayer && (
               <Grid
                  container
                  direction="row"
                  alignItems="center"
                  mb={2}
                  spacing={0}
               >
                  <Grid item xs={12}>
                     <Typography
                        variant="bodySmallBold"
                        component={'p'}
                        letterSpacing={'0.36px'}
                        lineHeight={'15.6px'}
                        color={darkPurple[9]}
                     >
                        Message for player :
                     </Typography>
                  </Grid>
                  <Grid
                     item
                     xs={12}
                     sx={{
                        '.MuiStack-root': {
                           justifyContent: 'start',
                        },
                     }}
                  >
                     <Typography
                        variant="body2"
                        component={'p'}
                        letterSpacing={'0.24px'}
                     >
                        {document.messageForPlayer}
                     </Typography>
                  </Grid>
               </Grid>
            )}
            {document.type === KycVerificationType.FILE && (
               <Grid
                  container
                  direction="row"
                  alignItems="center"
                  mb={2}
                  spacing={0}
               >
                  <Grid item xs={12}>
                     <Typography
                        variant="bodySmallBold"
                        component={'p'}
                        letterSpacing={'0.36px'}
                        lineHeight={'15.6px'}
                        color={darkPurple[9]}
                     >
                        File URL :
                     </Typography>
                  </Grid>
                  <Grid
                     item
                     xs={12}
                     sx={{
                        '.MuiStack-root': {
                           justifyContent: 'start',
                        },
                     }}
                  >
                     <PortalCopyValue
                        value={document.fileUrl as string}
                        isVisible={true}
                        variant="body2"
                        component={'p'}
                        letterSpacing={'0.24px'}
                     />
                  </Grid>
                  <Grid item xs></Grid>
               </Grid>
            )}
            {document.fileUrl && (
               <Grid
                  container
                  direction="row"
                  alignItems="center"
                  mb={2}
                  spacing={0}
                  justifyContent={'center'}
               >
                  <Grid
                     item
                     xs={12}
                     textAlign={'center'}
                     sx={{
                        img: {
                           borderRadius: '8px',
                        },
                     }}
                  >
                     {getFileTypeFromFileName(document.fileUrl as string) ===
                     PLayerFileType.IMAGE ? (
                        <img width={352} src={document.fileUrl} />
                     ) : (
                        getFileTypeFromFileName(document.fileUrl as string) ===
                           PLayerFileType.PDF && (
                           // <PDFViewer pdfUrl={document.fileUrl as string} />
                           <></>
                        )
                     )}
                  </Grid>
                  {document.fileUrl &&
                     [PLayerFileType.IMAGE, PLayerFileType.PDF].includes(
                        getFileTypeFromFileName(
                           document.fileUrl as string
                        ) as PLayerFileType
                     ) && (
                        <Grid item xs={12} textAlign={'center'}>
                           <Button
                              variant="contained"
                              color="secondary"
                              sx={{
                                 svg: {
                                    marginRight: '10px',
                                 },
                              }}
                              target="_blank"
                              href={document.fileUrl as string}
                           >
                              Download
                           </Button>
                        </Grid>
                     )}
               </Grid>
            )}
         </Box>
      )
   )
}
