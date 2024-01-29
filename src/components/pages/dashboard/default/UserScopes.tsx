import { UserPermissionEvent, UserScope } from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   FormControl,
   MenuItem,
   Select,
   SelectChangeEvent,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { darkPurple } from 'colors'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { saveCurrentScope, selectAuthCurrentScope } from 'redux/authSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { v4 as uuidv4 } from 'uuid'

function UserScopeFilter() {
   const theme = useTheme()
   const boClient = useSelector(selectBoClient)
   const currentScope = useSelector(selectAuthCurrentScope)
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const [ignore, setIgnore] = React.useState(false)

   const handleUpdateScope = (event: SelectChangeEvent) => {
      boClient?.user?.getRoles(
         { userScope: event.target.value as UserScope },
         {
            uuid: uuidv4(),
            meta: {
               ts: new Date(),
               type: 'list',
               sessionId: sessionStorage.getItem('sessionId'),
               event: UserPermissionEvent.BACKOFFICE_GET_ROLES_REQ,
            },
         }
      )
      store.dispatch(saveCurrentScope(event.target.value))
   }

   useEffect(() => {
      if (!ignore) {
         boClient?.user?.getRoles(
            { userScope: currentScope as UserScope },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  type: 'list',
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_ROLES_REQ,
               },
            }
         )
         setIgnore(true)
      }
   })

   return (
      <React.Fragment>
         <FormControl
            size="small"
            sx={{
               width: isDesktop ? 'auto' : '100%',
               marginTop: 0,
               svg: {
                  marginRight: '5px',
               },
               '.MuiInputBase-root': {
                  p: '4px 8px!important',
               },
            }}
         >
            <Select
               value={currentScope}
               onChange={handleUpdateScope}
               size="small"
               sx={{
                  height: '28px',
                  bgcolor: 'transparent',
                  color: theme.palette.primary.contrastText,
                  minHeight: 'initial',
                  padding: '0 !important',
                  textTransform: 'capitalize',
                  '.MuiSelect-select': {
                     p: 1,
                     display: 'flex',
                     alignItems: 'center',
                  },
                  '.MuiInputBase-input': {
                     pr: isDesktop ? '16px !important' : '26px !important',
                     display: 'flex',
                  },
                  fieldset: {
                     border: `1px solid ${darkPurple[6]} !important`,
                  },
                  width: isDesktop ? 'auto' : '100%',
                  svg: {
                     opacity:isDesktop ? 1 : 0,
                     color: darkPurple[12],
                     right: '0px !important',
                     top: isDesktop ? '6px !important' : '5px !important',
                  },
               }}
               IconComponent={() => (
                  <FontAwesomeIcon icon={faAngleDown as IconProp} className="selectIcon" size="sm" /> // Use FontAwesome icon as the select icon
               )}
            >
               {Object.keys(UserScope).map((item: any, index: number) => {
                  return (
                     <MenuItem key={`scope${index}`} value={item}>
                        Scope : {item}
                     </MenuItem>
                  )
               })}
            </Select>
         </FormControl>
      </React.Fragment>
   )
}

export default UserScopeFilter
