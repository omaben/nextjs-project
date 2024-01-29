import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Box } from '@mui/system'
import React, { useState } from 'react'

const StatusTextField = (data: {
   lang: string
   msg: string
   params: string[]
   updateMessage: Function
   messageId: string
}) => {
   const [userMessage, setUserMessage] = useState<string>(data.msg as string)

   const handleUserMessageChange = (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      setUserMessage(event.target.value)
      data.updateMessage(event.target.value)
   }

   // Function to insert a constant at the cursor position in the input
   const insertConstant = (constantKey: string) => {
      const constant = data.params.find((item) => item === constantKey)
      if (constant) {
         const input = document.getElementById(
            data.messageId
         ) as HTMLInputElement
         if (input) {
            const start = input.selectionStart || 0
            const end = input.selectionEnd || 0
            const newMessage =
               userMessage.slice(0, start) +
               ` {${constant}} ` +
               userMessage.slice(end)
            setUserMessage(newMessage)
            data.updateMessage(newMessage)
            // Calculate the position based on the length of the message after insertion
            const newPosition = start + constant.length + 4
            setTimeout(() => {
               input.focus()
               input.setSelectionRange(newPosition, newPosition)
            })
         }
      }
   }

   return (
      <Box>
         <Autocomplete
            options={data.params}
            id="demo-simple-select"
            sx={{
               width: '100%',
               '.MuiAutocomplete-input': {
                  cursor: 'pointer',
               },
            }}
            renderInput={(params) => (
               <TextField
                  {...params}
                  label="Select params"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                     ...params.InputProps,
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
            onChange={(_, newValue) => {
               if (newValue) {
                  insertConstant(newValue)
               }
            }}
         />
         <TextField
            id={data.messageId}
            label="Enter Your Message"
            variant="outlined"
            autoFocus
            fullWidth
            multiline
            value={userMessage}
            onChange={handleUserMessageChange}
            dir={['ar', 'fa'].includes(data.lang) ? 'rtl' : 'ltr'}
         />
      </Box>
   )
}

export default StatusTextField
