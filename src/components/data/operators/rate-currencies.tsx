import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAdd, faAngleDown } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Delete from '@mui/icons-material/Delete'
import {
   Autocomplete,
   Card,
   CardContent,
   CardHeader,
   FormControl,
   Grid,
   Button as MuiButton,
   TextField as MuiTextField,
   Typography as MuiTypography,
} from '@mui/material'
import { spacing } from '@mui/system'
import { ImoonGray, darkPurple } from 'colors'
import { ErrorMessage, Field, FieldArray, Formik } from 'formik'
import React, { useEffect } from 'react'
import { array, number, object, string } from 'yup'

function RatetoCurrency(dataFilter: {
   data: {
      [key: string]: {
         toCurrency: string
         rate: number
      }
   }
   setWithdrawRateByCurrency: Function
   title?: string
   currencies: string[]
}) {
   const TextField = styled(MuiTextField)(spacing)
   const Button = styled(MuiButton)(spacing)
   const [initialValuesData, setInitialValuesData] = React.useState<
      {
         currency: string
         toCurrency: string
         rate: number
      }[]
   >([])
   const [refreshData, setRefreshData] = React.useState(0)
   const toCurrencyGroup = { currency: '', toCurrency: '', rate: 0 }
   const Typography = styled(MuiTypography)`
      color: ${(props) => props.theme.palette.error.main};
   `
   const handleSubmitValues = React.useCallback(
      (dto: {
         withdrawRateByCurrency: {
            currency: string
            toCurrency: string
            rate: number
         }[]
         index?: number
      }) => {
         const newData = [...dto.withdrawRateByCurrency] // Create a shallow copy of the array

         if (dto.index !== undefined) {
            newData.splice(dto.index, 1) // Remove the item at the specified index
         }

         dataFilter.setWithdrawRateByCurrency(newData)
      },
      []
   )
   useEffect(() => {
      if (dataFilter.data) {
         setInitialValuesData(
            Object.keys(dataFilter.data).map(
               (obj, cur) => ({
                  currency: obj,
                  toCurrency: dataFilter.data[obj].toCurrency,
                  rate: dataFilter.data[obj].rate,
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
                  withdrawRateByCurrency: [...initialValuesData],
               }}
               onSubmit={async (values) => await handleSubmitValues(values)}
               validationSchema={object({
                  withdrawRateByCurrency: array(
                     object({
                        currency: string().required('currency is required'),
                        toCurrency: string().required(
                           'to currency is required'
                        ),
                        rate: number()
                           .required('rate is required')
                           .min(0, 'rate should be at least 0'),
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
                  setFieldValue,
               }) => (
                  <form
                     onSubmit={(e) => {
                        handleSubmit // Call the Formik submit handler
                     }}
                     onBlur={async (values) => await handleSubmit(values)}
                  >
                     <FieldArray name="withdrawRateByCurrency">
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
                                       onClick={
                                          () => push(toCurrencyGroup)
                                          // Perform any other actions after push is completed
                                       }
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
                                       Add Rate
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
                                 {values?.withdrawRateByCurrency?.map(
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
                                             <Grid container spacing={1}>
                                                <Grid item xs={4}>
                                                   <FormControl
                                                      sx={{
                                                         width: '100%',
                                                      }}
                                                   >
                                                      <Autocomplete
                                                         id={`withdrawRateByCurrency.${index}.currency`}
                                                         key={`withdrawRateByCurrency.${index}.currency`}
                                                         options={
                                                            dataFilter.currencies
                                                         }
                                                         disableClearable
                                                         sx={{
                                                            width: '100%',
                                                            mb: 0,
                                                            '.MuiAutocomplete-input':
                                                               {
                                                                  cursor:
                                                                     'pointer',
                                                               },
                                                         }}
                                                         value={
                                                            values
                                                               .withdrawRateByCurrency[
                                                               index
                                                            ].currency
                                                         }
                                                         onMouseLeave={
                                                            handleBlur
                                                         }
                                                         onChange={(
                                                            e,
                                                            selectedCurrency
                                                         ) => {
                                                            setFieldValue(
                                                               `withdrawRateByCurrency.${index}.currency`,
                                                               selectedCurrency
                                                            )
                                                         }}
                                                         renderInput={(
                                                            params
                                                         ) => (
                                                            <TextField
                                                               {...params}
                                                               variant="outlined"
                                                               label={'From'}
                                                               name={`withdrawRateByCurrency.${index}.currency`}
                                                               fullWidth
                                                               InputProps={{
                                                                  ...params.InputProps,
                                                                  endAdornment:
                                                                     (
                                                                        <FontAwesomeIcon
                                                                           icon={
                                                                              faAngleDown as IconProp
                                                                           }
                                                                           className="selectIcon"
                                                                           size="sm"
                                                                        />
                                                                     ),
                                                               }}
                                                            />
                                                         )}
                                                      />
                                                      <ErrorMessage
                                                         name={`withdrawRateByCurrency[${index}]currency`}
                                                         component={Typography}
                                                      />
                                                   </FormControl>
                                                </Grid>
                                                <Grid item xs={4}>
                                                   <FormControl
                                                      sx={{
                                                         width: '100%',
                                                      }}
                                                   >
                                                      <Autocomplete
                                                         id={`withdrawRateByCurrency.${index}.toCurrency`}
                                                         key={`withdrawRateByCurrency.${index}.toCurrency`}
                                                         options={
                                                            dataFilter.currencies
                                                         }
                                                         disableClearable
                                                         sx={{
                                                            width: '100%',
                                                            mb: 0,
                                                            '.MuiAutocomplete-input':
                                                               {
                                                                  cursor:
                                                                     'pointer',
                                                               },
                                                         }}
                                                         value={
                                                            values
                                                               .withdrawRateByCurrency[
                                                               index
                                                            ].currency
                                                         }
                                                         onMouseLeave={
                                                            handleBlur
                                                         }
                                                         onChange={(
                                                            e,
                                                            selectedCurrency
                                                         ) => {
                                                            setFieldValue(
                                                               `withdrawRateByCurrency.${index}.toCurrency`,
                                                               selectedCurrency
                                                            )
                                                         }}
                                                         renderInput={(
                                                            params
                                                         ) => (
                                                            <TextField
                                                               {...params}
                                                               variant="outlined"
                                                               label={'To'}
                                                               name={`withdrawRateByCurrency.${index}.toCurrency`}
                                                               fullWidth
                                                               InputProps={{
                                                                  ...params.InputProps,
                                                                  endAdornment:
                                                                     (
                                                                        <FontAwesomeIcon
                                                                           icon={
                                                                              faAngleDown as IconProp
                                                                           }
                                                                           className="selectIcon"
                                                                           size="sm"
                                                                        />
                                                                     ),
                                                               }}
                                                            />
                                                         )}
                                                      />
                                                      <ErrorMessage
                                                         name={`withdrawRateByCurrency[${index}]toCurrency`}
                                                         component={Typography}
                                                      />
                                                   </FormControl>
                                                </Grid>
                                                <Grid item xs={4}>
                                                   <Field
                                                      type="number"
                                                      fullWidth
                                                      id={`withdrawRateByCurrency[${index}]rate`}
                                                      name={`withdrawRateByCurrency.${index}.rate`}
                                                      value={
                                                         values
                                                            .withdrawRateByCurrency[
                                                            index
                                                         ].rate
                                                      }
                                                      min="0"
                                                      component={TextField}
                                                      onBlur={handleBlur}
                                                      onChange={handleChange}
                                                      label="Rate"
                                                   />
                                                   <ErrorMessage
                                                      name={`withdrawRateByCurrency[${index}]rate`}
                                                      component={Typography}
                                                   />
                                                </Grid>
                                             </Grid>
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

export default RatetoCurrency
