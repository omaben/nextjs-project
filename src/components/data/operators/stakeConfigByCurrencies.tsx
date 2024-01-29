import { Currency } from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import Delete from '@mui/icons-material/Delete'
import {
   Autocomplete,
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
import { useSelector } from 'react-redux'
import { selectAuthCurrenciesInit } from 'redux/authSlice'
import { array, number, object } from 'yup'
import StakePresetsCustom from './stakePresets'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
function StakePresetsByCurrenciesCustom(dataFilter: {
   data: {
      currency: string
      minStake: number
      maxStake: number
      maxWinAmount: number
      defaultBetAmount: number
      stakePresets?: { title?: string; amount: number }[]
   }[]
   setData: Function
   title?: string
}) {
   const TextField = styled(MuiTextField)(spacing)
   const Button = styled(MuiButton)(spacing)
   const theme = useTheme()
   const [initialValuesData, setInitialValuesData]: any = React.useState([])
   const [refreshData, setRefreshData] = React.useState(0)
   const packageGroup = {
      currency: '',
      minStake: 0,
      maxStake: 0,
      maxWinAmount: 0,
      defaultBetAmount: 0,
      stakePresets: [],
   }
   const Typography = styled(MuiTypography)`
      color: ${(props) => props.theme.palette.error.main};
   `
   const currenciesInit = useSelector(selectAuthCurrenciesInit) as Currency[]

   const handleSubmitValues = React.useCallback(
      async (dto: {
         packages: {
            currency: string
            minStake: number
            maxStake: number
            maxWinAmount: number
            defaultBetAmount: number
            stakePresets?: { title?: string; amount: number }[]
         }[]
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
                  minStake: obj.minStake || 0,
                  maxStake: obj.maxStake || 0,
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
                        minStake: number()
                           .required('Min Stake is required')
                           .min(0, 'Min Stake should be at least 0'),
                        maxStake: number()
                           .required('Max Stake is required')
                           .min(0, 'Max Stake should be at least 0'),
                        maxWinAmount: number()
                           .required('Max Win Amount is required')
                           .min(0, 'Max Win Amount should be at least 0'),
                        defaultBetAmount: number()
                           .required('Default Bet Amount is required')
                           .min(0, 'Default Bet Amount should be at least 0'),
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
                     onMouseLeave={async (values) => await handleSubmit(values)}
                  >
                     <FieldArray name="packages">
                        {({ push, remove }) => (
                           <Card
                              sx={{
                                 padding: '0 !important',
                                 background: theme.palette.background.paper,
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
                                                padding: 2,
                                                background:
                                                   theme.palette.background
                                                      .default,
                                             }}
                                          >
                                             <Grid item xs />
                                             <Grid item md={'auto'}>
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
                                             <Grid item md={12} />
                                             <Grid item md={12}>
                                                <Autocomplete
                                                   onChange={(
                                                      event,
                                                      newValue
                                                   ) => {
                                                      values.packages[
                                                         index
                                                      ].currency = newValue
                                                   }}
                                                   id={`packages[${index}]currency`}
                                                   options={currenciesInit?.map(
                                                      (item) => item.currency
                                                   )}
                                                   defaultValue={
                                                      values.packages[index]
                                                         .currency
                                                   }
                                                   getOptionLabel={(option) =>
                                                      option
                                                   }
                                                   sx={{
                                                      '.MuiAutocomplete-input':
                                                         {
                                                            cursor: 'pointer',
                                                         },
                                                   }}
                                                   renderInput={(params) => (
                                                      <TextField
                                                         {...params}
                                                         label="Currency"
                                                         placeholder="Currency"
                                                         name={`packages[${index}]currency`}
                                                         id={`packages[${index}]currency`}
                                                         InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
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
                                             </Grid>
                                             <Grid item md={6}>
                                                <Field
                                                   fullWidth
                                                   id={`packages[${index}]minStake`}
                                                   name={`packages.${index}.minStake`}
                                                   key={`packages.${index}.minStake`}
                                                   error={
                                                      errors.packages &&
                                                      errors.packages[index] &&
                                                      Boolean(
                                                         errors.packages[index]
                                                      )
                                                   }
                                                   value={
                                                      values.packages[index]
                                                         .minStake
                                                   }
                                                   component={TextField}
                                                   onMouseLeave={handleBlur}
                                                   onChange={handleChange}
                                                   label="Min Stake"
                                                   type="number"
                                                   min="0"
                                                />
                                                <ErrorMessage
                                                   name={`packages[${index}]minStake`}
                                                   component={Typography}
                                                />
                                             </Grid>
                                             <Grid item md={6}>
                                                <Field
                                                   fullWidth
                                                   type="number"
                                                   id={`packages[${index}]maxStake`}
                                                   name={`packages.${index}.maxStake`}
                                                   key={`packages.${index}.maxStake`}
                                                   error={
                                                      errors.packages &&
                                                      errors.packages[index] &&
                                                      Boolean(
                                                         errors.packages[index]
                                                      )
                                                   }
                                                   value={
                                                      values.packages[index]
                                                         .maxStake
                                                   }
                                                   min="0"
                                                   component={TextField}
                                                   onMouseLeave={handleBlur}
                                                   onChange={handleChange}
                                                   label="Max Stake"
                                                />
                                                <ErrorMessage
                                                   name={`packages[${index}]maxStake`}
                                                   component={Typography}
                                                />
                                             </Grid>
                                             <Grid item md={6}>
                                                <Field
                                                   fullWidth
                                                   id={`packages[${index}]maxWinAmount`}
                                                   name={`packages.${index}.maxWinAmount`}
                                                   key={`packages.${index}.maxWinAmount`}
                                                   error={
                                                      errors.packages &&
                                                      errors.packages[index] &&
                                                      Boolean(
                                                         errors.packages[index]
                                                      )
                                                   }
                                                   value={
                                                      values.packages[index]
                                                         .maxWinAmount
                                                   }
                                                   component={TextField}
                                                   onMouseLeave={handleBlur}
                                                   onChange={handleChange}
                                                   label="Max Win Amount"
                                                   min="0"
                                                   type="number"
                                                />
                                                <ErrorMessage
                                                   name={`packages[${index}]maxWinAmount`}
                                                   component={Typography}
                                                />
                                             </Grid>
                                             <Grid item md={6}>
                                                <Field
                                                   fullWidth
                                                   type="number"
                                                   id={`packages[${index}]defaultBetAmount`}
                                                   name={`packages.${index}.defaultBetAmount`}
                                                   key={`packages.${index}.defaultBetAmount`}
                                                   error={
                                                      errors.packages &&
                                                      errors.packages[index] &&
                                                      Boolean(
                                                         errors.packages[index]
                                                      )
                                                   }
                                                   value={
                                                      values.packages[index]
                                                         .defaultBetAmount
                                                   }
                                                   min="0"
                                                   component={TextField}
                                                   onMouseLeave={handleBlur}
                                                   onChange={handleChange}
                                                   label="Default Bet Amount"
                                                />
                                                <ErrorMessage
                                                   name={`packages[${index}]defaultBetAmount`}
                                                   component={Typography}
                                                />
                                             </Grid>
                                             <Grid
                                                item
                                                md={12}
                                                sx={{
                                                   '.MuiCardContent-root': {
                                                      padding: 0,
                                                   },
                                                }}
                                             >
                                                <StakePresetsCustom
                                                   data={
                                                      values.packages[index]
                                                         .stakePresets || []
                                                   }
                                                   setData={(
                                                      stakePresetsDefaultData: {
                                                         title?: string
                                                         amount: number
                                                      }[]
                                                   ) =>
                                                      setFieldValue(
                                                         `packages.${index}.stakePresets`,
                                                         stakePresetsDefaultData
                                                      )
                                                   }
                                                />
                                             </Grid>
                                          </Grid>
                                       )
                                    )}{' '}
                                    <Grid item xs={12}>
                                       <Button
                                          type="button"
                                          variant="outlined"
                                          onClick={
                                             () => push(packageGroup)
                                             // Perform any other actions after push is completed
                                          }
                                       >
                                          Add Stake Config
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

export default StakePresetsByCurrenciesCustom
