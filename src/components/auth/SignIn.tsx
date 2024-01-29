import { LoadingButton } from '@mui/lab'
import {
   Box,
   Checkbox,
   FormControlLabel,
   Grid,
   IconButton,
   TextField,
   Typography,
} from '@mui/material'
import { ImoonGray, darkPurple } from 'colors'
import { Formik } from 'formik'
import React from 'react'
import { toast } from 'react-toastify'
import { store } from 'redux/store'
import * as Yup from 'yup'
import useAuth from '../../hooks/useAuth'
import { IconEye, IconEyeSlash } from '../icons'

function SignIn() {
   const { signIn } = useAuth()
   const [showPassword, setShowPassword] = React.useState(false)
   const [dataGet, setDataGet] = React.useState(false)
   const CurrentopId = store.getState().auth.operator
   return (
      <Box>
         <Formik
            initialValues={{
               email: '',
               password: '',
               submit: false,
            }}
            validationSchema={Yup.object().shape({
               email: Yup.string().max(255).required(`Username is required`),
               password: Yup.string().max(255).required('Password is required'),
            })}
            onSubmit={async (
               values,
               { setErrors, setStatus, setSubmitting }
            ) => {
               try {
                  setSubmitting(true)
                  const data: any = await signIn(values.email, values.password)
                  if (data && data.url) {
                     setDataGet(true)
                  } else if (data.waitForTwoFactorAuthenticationCode) {
                     // handleOpen(values)
                  } else {
                     const message = data
                        ? data.message || 'Something went wrong'
                        : 'Something went wrong Try again !'
                     setStatus({ success: false })
                     setErrors({ submit: message })
                     toast.error(message.toString(), {
                        position: toast.POSITION.TOP_CENTER,
                     })
                     setSubmitting(false)
                  }
               } catch (error: any) {
                  const message = error.message || 'Something went wrong'
                  setStatus({ success: false })
                  setErrors({ submit: message })
                  toast.error(message, {
                     position: toast.POSITION.TOP_CENTER,
                  })
                  setSubmitting(false)
               }
            }}
         >
            {({
               errors,
               handleBlur,
               handleChange,
               handleSubmit,
               isSubmitting,
               touched,
               values,
            }) => (
               <>
                  <form noValidate onSubmit={handleSubmit}>
                     <Box textAlign={'center'} mt={'16px'}>
                        <Typography variant="h3">WELCOME</Typography>

                        {(errors.email && touched.email) ||
                        (errors.password && touched.password) ? (
                           <Typography
                              component="p"
                              color={'error.light'}
                              sx={{
                                 path: { opacity: '1 !important' },
                              }}
                           >
                              Invalid Credentials!
                           </Typography>
                        ) : (
                           <Typography
                              component="p"
                              variant="bodySmallBold"
                              align="center"
                              color={(props) => props.palette.grey[900]}
                           >
                              Sign in to your account to continue
                           </Typography>
                        )}
                     </Box>

                     <TextField
                        focused
                        type="text"
                        name="email"
                        label="Username"
                        value={values.email}
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{
                           '.MuiInputBase-root': {
                              background: darkPurple[12],
                           },
                           mt: '16px',
                        }}
                     />
                     <TextField
                        focused
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        label="Password"
                        value={values.password}
                        error={Boolean(touched.password && errors.password)}
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{
                           '.MuiInputBase-root': {
                              background: darkPurple[12],
                           },
                           mt: '16px',
                        }}
                        InputProps={{
                           endAdornment: (
                              <IconButton
                                 size="small"
                                 onClick={() =>
                                    setShowPassword((prev) => !prev)
                                 }
                                 sx={{
                                    background: 'transparent',
                                    padding: 0,
                                    borderRadius: 0,
                                    top: '-3px',
                                    color: darkPurple[7],
                                    path: {
                                       opacity: '1 !important',
                                       fill: darkPurple[7],
                                    },
                                 }}
                              >
                                 {showPassword ? <IconEye /> : <IconEyeSlash />}
                              </IconButton>
                           ),
                        }}
                     />
                     <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        sx={{
                           color: ImoonGray[9],
                           mt: '16px',
                        }}
                        label="Remember me"
                     />
                     <Grid
                        container
                        display={'flex'}
                        justifyContent={'center'}
                        mt="16px"
                     >
                        <LoadingButton
                           type="submit"
                           variant="contained"
                           color="secondary"
                           loading={isSubmitting || (dataGet && !CurrentopId)}
                           // loadingIndicator="..."
                           sx={{
                              p: '8px',
                           }}
                        >
                           Login
                        </LoadingButton>
                     </Grid>
                  </form>
               </>
            )}
         </Formik>
      </Box>
   )
}

export default SignIn
