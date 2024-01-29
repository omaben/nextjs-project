import { UserPermissionEvent } from '@alienbackoffice/back-front'
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
import React from 'react'
import { useSelector } from 'react-redux'
import {
   saveCurrentRole,
   saveCurrentRoleName,
   selectAuthCurrentRoleName,
   selectAuthRoles,
} from 'redux/authSlice'
import { store } from 'redux/store'
import { roleNameText } from 'types'

function UserRolesFilter(data: any) {
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const roles = useSelector(selectAuthRoles) as {
      name: string
      UserPermissionEvent: UserPermissionEvent[]
   }[]
   const roleName = useSelector(selectAuthCurrentRoleName) as string
   const [role, setRole] = React.useState(roleName)

   const handleUpdateRole = (event: SelectChangeEvent) => {
      if (event.target.value === 'empty') {
         setRole(roleNameText.CURRENTUSEDROLE)
         store.dispatch(saveCurrentRoleName(roleNameText.CURRENTUSEDROLE))
      } else {
         store.dispatch(
            saveCurrentRole(
               roles?.length > 0
                  ? roles.find((item) => item.name === event.target.value)
                       ?.UserPermissionEvent
                  : []
            )
         )
         store.dispatch(saveCurrentRoleName(event.target.value))
         setRole(event.target.value)
      }
   }

   React.useEffect(() => {
      setRole(roles?.length > 0 && !data.activeAddNewRole ? roleName : '')
      store.dispatch(
         saveCurrentRole(
            roles?.length > 0
               ? roles.find((item) => item.name === roleName)
                    ?.UserPermissionEvent
               : []
         )
      )
   }, [roleName])

   React.useEffect(() => {
      store.dispatch(
         saveCurrentRole(
            roles?.length > 0
               ? roles.find((item) => item.name === role)?.UserPermissionEvent
               : []
         )
      )
      if (data.withEmptyValue) {
         store.dispatch(saveCurrentRoleName(roleNameText.CURRENTUSEDROLE))
      } else {
         store.dispatch(
            saveCurrentRoleName(
               roles?.length > 0 && !data.activeAddNewRole
                  ? roles.findIndex((item) => item.name === roleName) > -1
                     ? roleName
                     : roles[0].name
                  : ''
            )
         )
      }
   }, [roles])

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
               value={role}
               onChange={handleUpdateRole}
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
                     color: darkPurple[12],
                     right: '0px !important',
                     opacity:isDesktop ? 1 : 0,
                     top: isDesktop ? '6px !important' : '5px !important',
                  },
               }}
               IconComponent={() => (
                  <FontAwesomeIcon icon={faAngleDown as IconProp} className="selectIcon" size="sm" /> // Use FontAwesome icon as the select icon
               )}
            >
               {data.withEmptyValue && (
                  <MenuItem key={`rolesEmpty}`} value={'Current'}>
                     {roleNameText.CURRENTUSEDROLE} Permissions
                  </MenuItem>
               )}
               {roles &&
                  roles.map(
                     (
                        item: {
                           name: string
                           UserPermissionEvent: UserPermissionEvent[]
                        },
                        index: number
                     ) => {
                        return (
                           <MenuItem key={`scope${index}`} value={item.name}>
                              {!data.withEmptyValue && 'Role: '}
                              {item.name} {data.withEmptyValue && 'Permissions'}
                           </MenuItem>
                        )
                     }
                  )}
            </Select>
         </FormControl>
      </React.Fragment>
   )
}

export default UserRolesFilter
