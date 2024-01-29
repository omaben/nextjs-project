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

function WithdrawFeeCurrency(dataFilter: {
   data: {
      [key: string]: {
         amount: number
      }
   }
   currencies: string[]
   setWithdrawFeeByCurrency: Function
   title?: string
}) {
   const TextField = styled(MuiTextField)(spacing)
   const Button = styled(MuiButton)(spacing)
   const [initialValuesData, setInitialValuesData]: any = React.useState([])
   const [refreshData, setRefreshData] = React.useState(0)
   const currencyGroup = { currency: '', amount: 0 }
   const Typography = styled(MuiTypography)`
      color: ${(props) => props.theme.palette.error.main};
   `
   const handleSubmitValues = React.useCallback(
      (dto: {
         withdrawFeeByCurrency: { currency: string; amount: number }[]
         index?: number
      }) => {
         const newData = [...dto.withdrawFeeByCurrency]

         if (dto.index !== undefined) {
            newData.splice(dto.index, 1)
         }
         dataFilter.setWithdrawFeeByCurrency(newData)
      },
      []
   )

   useEffect(() => {
      if (dataFilter.data) {
         setInitialValuesData(
            Object.keys(dataFilter.data).map(
               (obj, cur) => ({
                  currency: obj,
                  amount: dataFilter.data[obj].amount,
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
                  withdrawFeeByCurrency: [...initialValuesData],
               }}
               onSubmit={async (values) => await handleSubmitValues(values)}
               validationSchema={object({
                  withdrawFeeByCurrency: array(
                     object({
                        currency: string().required('Currency is required'),
                        amount: number()
                           .required('Amount is required')
                           .min(0, 'Amount should be at least 0'),
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
                     <FieldArray name="withdrawFeeByCurrency">
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
                                       onClick={() => push(currencyGroup)}
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
                                       Add Currency
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
                                 {values?.withdrawFeeByCurrency?.map(
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
                                                <Grid item xs={6}>
                                                   <FormControl
                                                      sx={{
                                                         width: '100%',
                                                      }}
                                                   >
                                                      <Autocomplete
                                                         id={`withdrawFeeByCurrency.${index}.currency`}
                                                         key={`withdrawFeeByCurrency.${index}.currency`}
                                                         options={
                                                            dataFilter.currencies
                                                         }
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
                                                               .withdrawFeeByCurrency[
                                                               index
                                                            ].currency
                                                         }
                                                         onMouseLeave={
                                                            handleBlur
                                                         }
                                                         disableClearable
                                                         onChange={(
                                                            e,
                                                            selectedCurrency
                                                         ) => {
                                                            setFieldValue(
                                                               `withdrawFeeByCurrency.${index}.currency`,
                                                               selectedCurrency
                                                            )
                                                         }}
                                                         renderInput={(
                                                            params
                                                         ) => (
                                                            <TextField
                                                               {...params}
                                                               label={
                                                                  'Currency'
                                                               }
                                                               variant="outlined"
                                                               name={`withdrawLimitByCurrency.${index}.currency`}
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
                                                         name={`withdrawFeeByCurrency[${index}]currency`}
                                                         component={Typography}
                                                      />
                                                   </FormControl>
                                                </Grid>
                                                <Grid item xs={6}>
                                                   <Field
                                                      type="number"
                                                      fullWidth
                                                      id={`withdrawFeeByCurrency[${index}]amount`}
                                                      name={`withdrawFeeByCurrency.${index}.amount`}
                                                      value={
                                                         values
                                                            .withdrawFeeByCurrency[
                                                            index
                                                         ].amount
                                                      }
                                                      min="0"
                                                      component={TextField}
                                                      onBlur={handleBlur}
                                                      onChange={handleChange}
                                                      label="Amount"
                                                   />
                                                   <ErrorMessage
                                                      name={`withdrawFeeByCurrency[${index}]amount`}
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

export default WithdrawFeeCurrency
