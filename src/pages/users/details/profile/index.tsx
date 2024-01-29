import { useEditUserMutation } from '@/components/data/users/lib/hooks/queries'
import { EditUserDto, User } from '@alienbackoffice/back-front'
import {
   Accordion,
   AccordionDetails,
   AccordionSummary,
   Button,
   DialogActions,
   Grid,
   TextField,
   Typography,
   useTheme,
} from '@mui/material'
import { darkPurple } from 'colors'
import { Formik } from 'formik'
import * as React from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import PersonalInformation from './personal-information'

export default function Profile({ userDetail, updateUser }: any) {
   const theme = useTheme()
   const [expanded, setExpanded] = React.useState<string | false>(
      'personalInformation'
   )
   const [expanded2, setExpanded2] = React.useState<string | false>('Security')

   const { mutate } = useEditUserMutation({
      onSuccess: () => {
         toast.success('You update the password Successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const handleSubmit = React.useCallback(
      (editUserdto: {
         username: string
         password: string
         confirmPassword: string
      }) => {
         const dto: EditUserDto = {
            username: editUserdto.username,
            password: editUserdto.password,
         }
         mutate({ dto })
      },
      [mutate]
   )
   return (
      <React.Fragment>
         <Grid container p={0} px={0} spacing={2} position={'relative'}>
            <Grid item md={6} xs={12} py={'0 !important'} mb={1}>
               <Accordion
                  expanded={expanded === 'personalInformation'}
                  sx={{
                     height: '100%',
                     background: darkPurple[12],
                     boxShadow: 'none',
                  }}
               >
                  <AccordionSummary>
                     <Typography variant="h6">Personal Information</Typography>
                  </AccordionSummary>
                  <AccordionDetails
                     sx={{
                        borderTop: `1px solid ${theme.palette.background.default}`,
                     }}
                  >
                     <PersonalInformation user={userDetail as User} />
                  </AccordionDetails>
               </Accordion>
            </Grid>
            <Grid item md={6} xs={12} py={'0 !important'} mb={1}>
               <Accordion
                  expanded={expanded2 === 'Security'}
                  sx={{
                     height: '100%',
                     background: darkPurple[12],

                     boxShadow: 'none',
                  }}
               >
                  <AccordionSummary>
                     <Typography variant="h6">Secret Config</Typography>
                  </AccordionSummary>
                  <AccordionDetails
                     sx={{
                        borderTop: `1px solid ${theme.palette.background.default}`,
                     }}
                  >
                     <Formik
                        initialValues={{
                           username: userDetail.username,
                           password: '',
                           confirmPassword: '',
                        }}
                        enableReinitialize={true}
                        validationSchema={Yup.object().shape({
                           username: Yup.string()
                              .min(4)
                              .max(20)
                              .required('username is required'),
                           password: Yup.string()
                              .matches(
                                 /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])/,
                                 'Password must contain at least one uppercase, one lowercase character, numbers, and special characters'
                              )
                              .min(6)
                              .max(20)
                              .required('Password is Required'),
                           confirmPassword: Yup.string().when('password', {
                              is: (val: any) =>
                                 val && val.length > 0 ? true : false,
                              then: () =>
                                 Yup.string().oneOf(
                                    [Yup.ref('password')],
                                    'Both password need to be the same'
                                 ),
                           }),
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
                           <form noValidate onSubmit={handleSubmit}>
                              <TextField
                                 name="password"
                                 label="Password"
                                 value={values.password}
                                 inputProps={{
                                    autoComplete: 'new-password',
                                    'aria-autocomplete': 'none',
                                 }}
                                 error={Boolean(errors?.password)}
                                 fullWidth
                                 type="password"
                                 helperText={
                                    touched?.password && errors?.password
                                 }
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 variant="outlined"
                              />
                              <TextField
                                 type="password"
                                 name="confirmPassword"
                                 label="Confirm password"
                                 value={values.confirmPassword}
                                 error={Boolean(
                                    touched.confirmPassword &&
                                       errors.confirmPassword
                                 )}
                                 fullWidth
                                 helperText={
                                    touched.confirmPassword &&
                                    errors.confirmPassword
                                 }
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                              />
                              <DialogActions sx={{ justifyContent: 'center' }}>
                                 <Button
                                    type="submit"
                                    color="secondary"
                                    variant="contained"
                                    sx={{ height: 32 }}
                                 >
                                    Set User Password
                                 </Button>
                              </DialogActions>
                           </form>
                        )}
                     </Formik>
                  </AccordionDetails>
               </Accordion>
            </Grid>
         </Grid>
      </React.Fragment>
   )
}
