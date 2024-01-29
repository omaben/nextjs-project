import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAdd } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Delete from '@mui/icons-material/Delete'
import {
   Card,
   CardContent,
   CardHeader,
   Grid,
   Button as MuiButton,
   TextField as MuiTextField,
   Typography as MuiTypography,
} from '@mui/material'
import { spacing } from '@mui/system'
import { ImoonGray, darkPurple } from 'colors'
import { ErrorMessage, Field, FieldArray, Formik } from 'formik'
import React, { useEffect } from 'react'
import { array, number, object } from 'yup'

function Packages(dataFilter: {
   data: number[]
   setPackages: Function
   title?: string
}) {
   const TextField = styled(MuiTextField)(spacing)
   const Button = styled(MuiButton)(spacing)
   const [initialValuesData, setInitialValuesData] = React.useState<
      { value: number }[]
   >([])
   const [refreshData, setRefreshData] = React.useState(0)
   const packageGroup = { value: 0 }
   const Typography = styled(MuiTypography)`
      color: ${(props) => props.theme.palette.error.main};
   `

   const handleSubmitValues = React.useCallback(
      async (dto: { packages: { value: number }[]; index?: number }) => {
         const newData = [...dto.packages] // Create a shallow copy of the array

         if (dto.index !== undefined) {
            // Check if index is provided
            newData.splice(dto.index, 1) // Remove the item at the specified index
         }

         await dataFilter.setPackages(newData)
      },
      []
   )

   useEffect(() => {
      if (dataFilter.data) {
         setInitialValuesData(
            dataFilter.data.map(
               (obj, cur) => ({
                  value: obj,
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
            <Formik
               key={refreshData}
               initialValues={{
                  packages: [...initialValuesData],
               }}
               onSubmit={async (values) => await handleSubmitValues(values)}
               validationSchema={object({
                  packages: array(
                     object({
                        value: number()
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
                     onBlur={async (values) => await handleSubmit(values)}
                  >
                     <FieldArray name="packages">
                        {({ push, remove }) => (
                           <Card
                              sx={{
                                 width: '100%',
                                 overflowY: 'auto',
                                 background: 'rgba(237, 235, 244, 0.50)',
                                 '.MuiPaper-root': {
                                    p: '0 !important',
                                 },
                                 '.box-texfield-style': {
                                    p: '16px',
                                    border: `1px solid ${darkPurple[12]}`,
                                    borderRadius: '8px',
                                    background: darkPurple[11],
                                    mb: '6px',
                                 },
                                 '&.MuiPaper-root': {
                                    p: '0!important',
                                 },
                                 mb: '5px',
                              }}
                           >
                              <CardHeader
                                 title={dataFilter.title}
                                 sx={{
                                    background: ImoonGray[4],
                                    p: '12px',
                                    borderTopLeftRadius: '8px',
                                    borderTopRightRadius: '8px',
                                    cursor: 'pointer',
                                 }}
                                 action={
                                    <Button
                                       onClick={() => push(packageGroup)}
                                       color="info"
                                       variant="contained"
                                       sx={{
                                          fontSize: 12,
                                          fontFamily: 'Nunito Sans SemiBold',
                                          borderRadius: '8px',
                                          '&:hover': {
                                             background: '#8098F9',
                                          },
                                          padding: '4px 8px',
                                          letterSpacing: '0.48px',
                                          gap: '2px',
                                          height: '28px',
                                       }}
                                    >
                                       <FontAwesomeIcon
                                          icon={faAdd as IconProp}
                                          fixedWidth
                                          fontSize={12}
                                          height={'initial'}
                                          width={'12px'}
                                       />{' '}
                                       Add package
                                    </Button>
                                 }
                              />
                              <CardContent
                                 sx={{
                                    p: '0 !important',
                                    background: (props) =>
                                       props.palette.primary.contrastText,
                                 }}
                              >
                                 {values?.packages?.map(
                                    (_: any, index: number) => (
                                       <Grid
                                          container
                                          key={index}
                                          spacing={1}
                                          sx={{
                                             padding: 2,
                                             pt: 0,
                                          }}
                                       >
                                          <Grid
                                             item
                                             width={'calc(100% - 25px)'}
                                          >
                                             <Field
                                                fullWidth
                                                type="number"
                                                id={`packages[${index}]value`}
                                                name={`packages.${index}.value`}
                                                key={`packages.${index}.value`}
                                                error={
                                                   errors.packages &&
                                                   errors.packages[index] &&
                                                   Boolean(
                                                      errors.packages[index]
                                                   )
                                                }
                                                value={
                                                   values.packages[index].value
                                                }
                                                min="0"
                                                component={TextField}
                                                onMouseLeave={handleBlur}
                                                onChange={handleChange}
                                                label="Value"
                                             />
                                             <ErrorMessage
                                                name={`packages[${index}]value`}
                                                component={Typography}
                                             />
                                          </Grid>
                                          <Grid
                                             item
                                             width={'20px'}
                                             justifyContent={'center'}
                                             display={'flex'}
                                             alignItems={'center'}
                                          >
                                             <Button
                                                color="error"
                                                onClick={() => {
                                                   remove(index)
                                                   handleSubmitValues({
                                                      ...values,
                                                      index,
                                                   })
                                                }}
                                                sx={{
                                                   width: '20px',
                                                   height: '20px',
                                                   minWidth: '20px',
                                                   svg: {
                                                      width: '20px',
                                                      height: '20px',
                                                   },
                                                }}
                                             >
                                                <Delete />
                                             </Button>
                                          </Grid>
                                       </Grid>
                                    )
                                 )}
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

export default Packages
