import { WebhookLog } from '@alienbackoffice/back-front'
import { useTheme } from '@emotion/react'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faClose, faCopy } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Check from '@mui/icons-material/Check'
import Fullscreen from '@mui/icons-material/Fullscreen'
import {
   Box,
   Dialog,
   DialogContent,
   DialogProps,
   IconButton,
   Stack,
   Tooltip,
   Typography,
   TypographyProps,
   useMediaQuery,
} from '@mui/material'
import { darkPurple, primary, secondary } from 'colors'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useState } from 'react'

export interface PortalCopyValueProps extends TypographyProps {
   value: string
   hideText?: boolean
   isVisible?: boolean
   href?: string
   target?: string
   json?: WebhookLog
   title?: string
   tooltip?: boolean
}

const PortalCopyValue = ({
   value,
   hideText,
   isVisible,
   href,
   variant,
   target,
   json,
   title,
   tooltip,
   ...props
}: PortalCopyValueProps) => {
   const theme = useTheme()
   const desktop = useMediaQuery(theme.breakpoints.up('md'))
   const [showIcon, setShowIcon] = useState(false)
   const [checked, setChecked] = useState(false)
   const [jsonData, setJsonData] = useState(json as WebhookLog)
   const [openFullScreen, setOpenFullScreen] = React.useState(false)
   const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('xl')
   const [fullWidth, setFullWidth] = React.useState(true)

   const handleCopyButtonClick = () => {
      const data = json ? JSON.stringify(json, null, 2) : value
      navigator.clipboard.writeText(data)
      setChecked(true)
      setTimeout(() => setChecked(false), 1000)
   }

   const handleOpenFullClick = () => {
      setJsonData(json as WebhookLog)
      setOpenFullScreen(true)
   }

   const handleCloseFullScreen = () => {
      setOpenFullScreen(false)
   }

   const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false })
   const isDesktopSize = useMediaQuery(theme.breakpoints.up('md'))
   return (
      <Stack
         direction={['row-reverse', null, 'row']}
         gap={0.5}
         onMouseEnter={() => setShowIcon(true)}
         onMouseLeave={() => setShowIcon(false)}
         alignItems="center"
         // justifyContent={['center', null, 'center']}
         justifyContent={'left'}
         sx={{
            ...props.sx,
            cursor: 'pointer',
            a: {
               fontSize: isDesktopSize ? '12px !important' : '10px !important',
            },
         }}
      >
         {!hideText &&
            (href ? (
               <Box
                  sx={{
                     'a:hover': { color: `${secondary[8]} !important` },
                     ...props.sx,
                     color: secondary[6],
                  }}
               >
                  <Link
                     target={target}
                     style={{
                        color: secondary[6],
                        textDecoration: 'none',
                     }}
                     href={href}
                  >
                     {title && title}
                     {value}
                  </Link>
               </Box>
            ) : (
               <Typography
                  variant={variant || 'bodySmallBold'}
                  sx={{
                     ...props.sx,
                  }}
                  fontSize={theme.breakpoints.down('sm') ? '10px' : '12px'}
               >
                  {title && title} {value}
               </Typography>
            ))}
         {value && (
            <Stack
               onClick={() => {
                  handleCopyButtonClick()
               }}
               sx={{
                  visibility:
                     !desktop || hideText || showIcon || isVisible
                        ? 'initial'
                        : 'hidden',
               }}
            >
               <Tooltip title={value}>
                  <Box
                     component="svg"
                     sx={{
                        cursor: 'pointer',
                        width: 12,
                        height: 12,
                        path: {
                           fill: checked
                              ? theme.palette.success.main
                              : darkPurple[9],
                           stroke: 'unset !important',
                        },
                     }}
                  >
                     {checked ? (
                        <Check />
                     ) : (
                        <FontAwesomeIcon icon={faCopy as IconProp} fixedWidth />
                     )}
                  </Box>
               </Tooltip>
            </Stack>
         )}
         {json && (
            <Stack
               onClick={() => {
                  handleOpenFullClick()
               }}
               sx={{
                  visibility:
                     !desktop || hideText || showIcon || isVisible
                        ? 'initial'
                        : 'hidden',
               }}
            >
               <Box
                  component="svg"
                  sx={{
                     cursor: 'pointer',
                     width: 20,
                     height: 20,
                     path: {
                        fill: primary[5],
                        stroke: 'unset !important',
                     },
                  }}
               >
                  {json && <Fullscreen />}
                  {title && title}
               </Box>
            </Stack>
         )}
         <Dialog
            open={openFullScreen}
            onClose={handleCloseFullScreen}
            aria-labelledby="form-dialog-title"
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            sx={{
               '.MuiPaper-root': {
                  background: 'rgb(29, 31, 33)',
               },
            }}
         >
            <IconButton
               edge="end"
               color="inherit"
               onClick={handleCloseFullScreen}
               sx={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  zIndex: 1,
                  color: (props) => props.palette.primary.contrastText,
               }}
            >
               <FontAwesomeIcon
                  icon={faClose as IconProp}
                  fixedWidth
                  fontSize={18}
               />
            </IconButton>
            <DialogContent sx={{ p: 1 }}>
               {json && json.uuid && (
                  <DynamicReactJson
                     key={`jsonDialog${jsonData.uuid}`}
                     src={jsonData}
                     theme="tomorrow"
                     enableClipboard={false}
                  />
               )}
            </DialogContent>
         </Dialog>
      </Stack>
   )
}

export default PortalCopyValue
