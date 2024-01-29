import styled from '@emotion/styled'
import Delete from '@mui/icons-material/Delete'
import {
   Card,
   CardContent,
   Grid,
   Button as MuiButton,
   TextField as MuiTextField,
   Typography as MuiTypography,
   useTheme,
} from '@mui/material'
import { spacing } from '@mui/system'
import { ErrorMessage, Field, FieldArray, Formik } from 'formik'
import React, { useEffect } from 'react'
import { array, number, object } from 'yup'

function StakePresetsCustom(dataFilter: {
   data: { title?: string; amount: number }[]
   setData: Function
   title?: string
}) {
   const TextField = styled(MuiTextField)(spacing)
   const Button = styled(MuiButton)(spacing)
   const theme = useTheme()
   const [initialValuesData, setInitialValuesData]: any = React.useState([])
   const [refreshData, setRefreshData] = React.useState(0)
   const packageGroup = { title: '', amount: 0 }
   const Typography = styled(MuiTypography)`
      color: ${(props) => props.theme.palette.error.main};
   `

   const handleSubmitValues = React.useCallback(
      async (dto: {
         packages: { title?: string; amount: number }[]
         index?: number
      }) => {
         const newData = [...dto.packages] // Create a shallow copy of the array

         if (dto.index !== undefined) {
            // Check if index is provided
            newData.splice(dto.index, 1) // Remove the item at the specified index
         }

         await dataFilter.setData(newData)
      },
      []
   )

   useEffect(() => {
      if (dataFilter.data) {
         setInitialValuesData(
            dataFilter.data.map(
               (obj, cur) => ({
                  title: obj.title,
                  amount: obj.amount,
               }),
               []
            )
         )
         setRefreshData(refreshData + 1)
      }
   }, [dataFilter.data])

   return (
      dataFilter.data && (
         <React.Fragment>
            <Typography
               variant="h6"
               mt={2}
               color={(props) => `${props.palette.common.black} !important`}
            >
               Stake Preset
            </Typography>
            <Formik
               key={refreshData}
               initialValues={{
                  packages: [...initialValuesData],
               }}
               onSubmit={async (values) => await handleSubmitValues(values)}
               validationSchema={object({
                  packages: array(
                     object({
                        amount: number()
                           .required('value is required')
                           .min(0, 'value should be at least 0'),
                     })
                  ),
               })}
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
                  <form
                     onSubmit={(e) => {
                        handleSubmit // Call the Formik submit handler
                     }}
                     onMouseLeave={async (values) => await handleSubmit(values)}
                  >
                     <FieldArray name="packages">
                        {({ push, remove }) => (
                           <Card
                              sx={{
                                 padding: '0 !important',
                                 background: theme.palette.background.default,
                                 width: '100% !important',
                              }}
                           >
                              <CardContent>
                                 <Grid
                                    container
                                    spacing={2}
                                    sx={{
                                       marginTop: 0,
                                       padding: 0,
                                       paddingX: 0,
                                    }}
                                 >
                                    {values?.packages?.map(
                                       (_: any, index: number) => (
                                          <Grid
                                             container
                                             key={index}
                                             spacing={2}
                                             sx={{
                                                marginTop: 2,
                                                paddingX: 2,
                                             }}
                                          >
                                             <Grid item md={5}>
                                                <Field
                                                   fullWidth
                                                   id={`packages[${index}]title`}
                                                   name={`packages.${index}.title`}
                                                   key={`packages.${index}.title`}
                                                   error={
                                                      errors.packages &&
                                                      errors.packages[index] &&
                                                      Boolean(
                                                         errors.packages[index]
                                                      )
                                                   }
                                                   value={
                                                      values.packages[index]
                                                         .title
                                                   }
                                                   component={TextField}
                                                   onMouseLeave={handleBlur}
                                                   onChange={handleChange}
                                                   label="Title"
                                                />
                                                <ErrorMessage
                                                   name={`packages[${index}]title`}
                                                   component={Typography}
                                                />
                                             </Grid>
                                             <Grid item md={5}>
                                                <Field
                                                   fullWidth
                                                   type="number"
                                                   id={`packages[${index}]amount`}
                                                   name={`packages.${index}.amount`}
                                                   key={`packages.${index}.amount`}
                                                   error={
                                                      errors.packages &&
                                                      errors.packages[index] &&
                                                      Boolean(
                                                         errors.packages[index]
                                                      )
                                                   }
                                                   value={
                                                      values.packages[index]
                                                         .amount
                                                   }
                                                   min="0"
                                                   component={TextField}
                                                   onMouseLeave={handleBlur}
                                                   onChange={handleChange}
                                                   label="Amount"
                                                />
                                                <ErrorMessage
                                                   name={`packages[${index}]amount`}
                                                   component={Typography}
                                                />
                                             </Grid>
                                             <Grid item md={1}>
                                                <Button
                                                   variant="outlined"
                                                   color="error"
                                                   onClick={() => {
                                                      remove(index)
                                                      handleSubmitValues({
                                                         ...values,
                                                         index,
                                                      })
                                                   }}
                                                >
                                                   <Delete />
                                                </Button>
                                             </Grid>
                                          </Grid>
                                       )
                                    )}{' '}
                                    <Grid item xs={12}>
                                       <Button
                                          type="button"
                                          variant="outlined"
                                          onClick={() => push(packageGroup)}
                                       >
                                          Add Stake Preset
                                       </Button>
                                    </Grid>
                                 </Grid>
                              </CardContent>
                           </Card>
                        )}
                     </FieldArray>
                  </form>
               )}
            </Formik>
         </React.Fragment>
      )
   )
}

export default StakePresetsCustom
