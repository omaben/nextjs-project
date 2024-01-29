import { useEditUserMutation } from '@/components/data/users/lib/hooks/queries'
import {
   EditUserDto,
   User,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faEdit } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   DialogActions,
   InputAdornment,
   Button as MuiButton,
   TextField as MuiTextField,
} from '@mui/material'
import { spacing } from '@mui/system'
import { darkPurple } from 'colors'
import { Formik } from 'formik'
import React from 'react'
import { toast } from 'react-toastify'
import { hasDetailsPermission } from 'services/permissionHandler'
import * as Yup from 'yup'

function PersonalInformation(data: { user: User }) {
   const TextField = styled(MuiTextField)(spacing)
   const Button = styled(MuiButton)(spacing)
   const [edit, setEdit] = React.useState(false)

   const { mutate } = useEditUserMutation({
      onSuccess: () => {
         toast.success('You Change username Successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const handleSubmit = React.useCallback(
      (editUserdto: { opId: string; username: string }) => {
         const dto: EditUserDto = {
            username: editUserdto.username,
         }
         mutate({ dto })
      },
      [mutate]
   )

   function handleEditPersonalInfo() {
      setEdit(!edit)
   }

   return (
      <React.Fragment>
         <Formik
            initialValues={{
               opId: data.user?.opId,
               username: data.user?.username,
            }}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
               username: Yup.string()
                  .min(4)
                  .max(20)
                  .required('username is required'),
            })}
            onSubmit={handleSubmit}
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
            }) => (
               <form onSubmit={handleSubmit}>
                  {hasDetailsPermission(
                     UserPermissionEvent.BACKOFFICE_OPERATOR_LIST_REQ
                  ) && (
                     <TextField
                        name="opId"
                        label="Operator Id"
                        disabled={true}
                        value={values.opId}
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                     />
                  )}
                  <TextField
                     name="username"
                     label="Username"
                     disabled={!edit}
                     value={values.username}
                     error={Boolean(touched.username && errors.username)}
                     fullWidth
                     helperText={touched.username && errors.username}
                     onBlur={handleBlur}
                     onChange={handleChange}
                     variant="outlined"
                     sx={{
                        svg: {
                           width: '16px !important',
                           height: '16px  !important',
                           position: 'relative',
                           right: '-12px',
                           top: '-4px',
                        },
                     }}
                     InputProps={{
                        endAdornment: (
                           <InputAdornment position="start">
                              {!edit &&
                              hasDetailsPermission(
                                 UserPermissionEvent.BACKOFFICE_EDIT_USER_REQ
                              ) ? (
                                 <FontAwesomeIcon
                                    icon={faEdit as IconProp}
                                    onClick={handleEditPersonalInfo}
                                 />
                              ) : (
                                 ''
                              )}
                           </InputAdornment>
                        ),
                     }}
                  />
                  <DialogActions
                     sx={{
                        display: edit ? 'flex' : 'none',
                        justifyContent: 'center',
                     }}
                  >
                     <Button
                        onClick={handleEditPersonalInfo}
                        color="secondary"
                        variant="outlined"
                        sx={{ height: 32, borderColor: darkPurple[10] }}
                     >
                        Cancel
                     </Button>
                     <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                        sx={{ height: 32 }}
                     >
                        Save
                     </Button>
                  </DialogActions>
               </form>
            )}
         </Formik>
      </React.Fragment>
   )
}

export default PersonalInformation
