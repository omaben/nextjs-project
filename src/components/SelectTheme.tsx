import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { darkPurple } from 'colors'
import React, { MouseEventHandler } from 'react'
import { IconEllipsisVertical } from './icons'
import { faEllipsisVertical } from '@fortawesome/pro-solid-svg-icons'
export default function SelectTheme(data: {
   noPadd: boolean
   icon: string
   value: number
   data: {
      value: string
      label: React.ReactElement | string
      onClick?: MouseEventHandler<any> | undefined
      disabled?: boolean
   }[]
}) {
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
   const [open, setOpen] = React.useState(false)
   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
      setOpen(true)
   }

   const handleClose = () => {
      setOpen(false)
   }

   return (
      <>
         <IconButton
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
            sx={{
               'svg path': {
                  fill: `${darkPurple[6]} !important`,
                  opacity: '1 !important',
               },
            }}
         >
            <FontAwesomeIcon icon={faEllipsisVertical as IconProp} />
         </IconButton>
         <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
               vertical: 'bottom',
               horizontal: 'right',
            }}
            transformOrigin={{
               vertical: 'top',
               horizontal: 'right',
            }}
            onClick={() => handleClose()}
         >
            {data.data.map(
               (option: {
                  value: string
                  label: React.ReactElement | string
                  onClick?: MouseEventHandler<any> | undefined
                  disabled?: boolean
               }) => (
                  <MenuItem
                     sx={{
                        display: `${option.disabled ? 'none' : ''}`,
                        minHeight: 'auto',
                     }}
                     key={option.value}
                     value={option.value}
                     onClick={option.onClick}
                  >
                     {option.label}
                  </MenuItem>
               )
            )}
         </Menu>
      </>
   )
}
