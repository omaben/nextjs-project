import {
   Currency,
   TournamentV2CurrencyConditionItem,
} from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAdd, faAngleDown } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  Delete  from '@mui/icons-material/Delete'
import {
   Card,
   CardContent,
   CardHeader,
   FormControl,
   Grid,
   InputLabel,
   MenuItem,
   Button as MuiButton,
   TextField as MuiTextField,
   Typography as MuiTypography,
   Select,
   Stack,
} from '@mui/material'
import { spacing } from '@mui/system'
import { ImoonGray, darkPurple } from 'colors'
import { ErrorMessage, Field, FieldArray, Formik } from 'formik'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthCurrenciesInit } from 'redux/authSlice'
import { array, object, string } from 'yup'

function TournamentV2Currencies(dataFilter: {
   data: TournamentV2CurrencyConditionItem[]
   setPackages: Function
   updatePackage?: boolean
}) {
   const TextField = styled(MuiTextField)(spacing)
   const Button = styled(MuiButton)(spacing)
   const [initialValuesData, setInitialValuesData] = React.useState(
      [] as { currency: string; minBetAmount: number; prizes: string }[]
   )
   const [refreshData, setRefreshData] = React.useState(0)
   const [currenciesData, setCurrenciesData] = React.useState(0)
   const packageGroup = { currency: '', minBetAmount: 0 }
   const Typography = styled(MuiTypography)`
      color: ${(props) => props.theme.palette.error.main};
   `
   const currenciesInit = useSelector(selectAuthCurrenciesInit) as Currency[]

   const handleSubmitValues = React.useCallback(
      async (dto: {
         packages: { currency: string; minBetAmount: number; prizes: string }[]
         index?: number
      }) => {
         const dataPackage: TournamentV2CurrencyConditionItem[] =
            dto.packages.map((item) => {
               return {
                  ...item,
                  prizes: item.prizes?.split(/\r?\n/) as string[],
               }
            })
         const newData = [...dataPackage] // Create a shallow copy of the array

         if (dto.index !== undefined) {
            // Check if index is provided
            newData.splice(dto.index, 1) // Remove the item at the specified index
         }
         setCurrenciesData(currenciesData + 1)
         await dataFilter.setPackages(newData)
      },
      []
   )

   useEffect(() => {
      if (dataFilter.data && currenciesData === 0) {
         const dataPackage: {
            currency: string
            minBetAmount: number
            prizes: string
         }[] = dataFilter.data.map((item) => {
            return {
               ...item,
               prizes: item.prizes?.join('\n') || '',
            }
         })
         setInitialValuesData(dataPackage)
         setRefreshData(refreshData + 1)
      }
   }, [dataFilter.data])

   return (
      dataFilter.data && (
         <Formik
            key={refreshData}
            initialValues={{
               packages: [...initialValuesData],
            }}
            onSubmit={async (values) => await handleSubmitValues(values)}
            validationSchema={object({
               packages: array(
                  object({
                     currency: string().required('value is required'),
                     prizes: string().required('prizes is required'),
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
                  onBlur={async (values) => {
                     handleSubmit(values)
                  }}
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
                           }}
                        >
                           <CardHeader
                              title={'Currency Conditions'}
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
                                       () => push(packageGroup)
                                       // Perform any other actions after push is completed
                                    }
                                    color="info"
                                    variant="contained"
                                    sx={{
                                       fontSize: 12,
                                       fontFamily: 'Nunito Sans SemiBold',
                                       borderRadius: '8px',
                                    }}
                                 >
                                    <FontAwesomeIcon
                                       icon={faAdd as IconProp}
                                       fixedWidth
                                       fontSize={14}
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
                              {values?.packages?.map(
                                 (_: any, index: number) => (
                                    <Grid
                                       container
                                       key={`${index}packages`}
                                       spacing={1}
                                       sx={{
                                          padding: 2,
                                          pt: 0,
                                       }}
                                    >
                                       <Grid item width={'calc(100% - 25px)'}>
                                          <Grid container spacing={1}>
                                             <Grid item xs={6}>
                                                <FormControl
                                                   sx={{
                                                      width: '100%',
                                                   }}
                                                >
                                                   <InputLabel id="demo-simple-select-disabled-label">
                                                      Currency
                                                   </InputLabel>
                                                   <Select
                                                      fullWidth
                                                      id={`packages[${index}]currency`}
                                                      name={`packages.${index}.currency`}
                                                      key={`packages.${index}.currency`}
                                                      value={
                                                         values.packages[index]
                                                            .currency
                                                      }
                                                      onMouseLeave={handleBlur}
                                                      onChange={handleChange}
                                                      IconComponent={() => (
                                                         <FontAwesomeIcon
                                                            icon={
                                                               faAngleDown as IconProp
                                                            }
                                                            size="sm"
                                                         /> // Use FontAwesome icon as the select icon
                                                      )}
                                                      label="Currency"
                                                   >
                                                      {currenciesInit?.map(
                                                         (
                                                            item,
                                                            index: number
                                                         ) => {
                                                            return (
                                                               <MenuItem
                                                                  key={`packages[${index}]currency${item.currency}`}
                                                                  value={
                                                                     item.currency
                                                                  }
                                                                  disabled={
                                                                     item.currency ===
                                                                     values
                                                                        ?.packages[
                                                                        index
                                                                     ]?.currency
                                                                  }
                                                               >
                                                                  <Stack
                                                                     direction="row"
                                                                     alignItems="center"
                                                                     gap={2}
                                                                     textTransform="capitalize"
                                                                  >
                                                                     {
                                                                        item.currency
                                                                     }
                                                                  </Stack>
                                                               </MenuItem>
                                                            )
                                                         }
                                                      )}
                                                   </Select>
                                                   <ErrorMessage
                                                      name={`packages[${index}]value`}
                                                      component={Typography}
                                                   />
                                                </FormControl>
                                             </Grid>
                                             <Grid item xs={6}>
                                                <Field
                                                   type="number"
                                                   fullWidth
                                                   id={`packages[${index}]minBetAmount`}
                                                   name={`packages[${index}]minBetAmount`}
                                                   value={
                                                      values.packages[index]
                                                         .minBetAmount
                                                   }
                                                   min="0"
                                                   component={TextField}
                                                   onBlur={handleBlur}
                                                   onChange={handleChange}
                                                   label="Min Bet Amount"
                                                />
                                                <ErrorMessage
                                                   name={`packages[${index}]minBetAmount`}
                                                   component={Typography}
                                                />
                                             </Grid>
                                             <Grid item xs={12}>
                                                <Field
                                                   fullWidth
                                                   id={`packages[${index}]prizes`}
                                                   name={`packages[${index}]prizes`}
                                                   value={
                                                      values.packages[index]
                                                         .prizes
                                                   }
                                                   component={TextField}
                                                   onBlur={handleBlur}
                                                   onChange={handleChange}
                                                   label="Prizes"
                                                   multiline
                                                />
                                                <ErrorMessage
                                                   name={`packages[${index}]prizes`}
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
                              )}{' '}
                           </CardContent>
                        </Card>
                     )}
                  </FieldArray>
               </form>
            )}
         </Formik>
      )
   )
}

export default TournamentV2Currencies
