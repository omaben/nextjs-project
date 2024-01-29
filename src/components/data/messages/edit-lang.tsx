import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Delete from '@mui/icons-material/Delete'
import {
   Autocomplete,
   Card,
   CardContent,
   Grid,
   Button as MuiButton,
   TextField as MuiTextField,
   useTheme,
} from '@mui/material'
import { spacing } from '@mui/system'
import { FieldArray, Formik } from 'formik'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthLanguages } from 'redux/authSlice'
import { array, number, object, string } from 'yup'
import StatusTextField from './status-text-field'

function EditLang(dataFilter: {
   data: {
      [key: string]: {
         minAmount: number
      }
   }
   setWithdrawLimitByCurrency: Function
}) {
   const TextField = styled(MuiTextField)(spacing)
   const Button = styled(MuiButton)(spacing)
   const theme = useTheme()
   const [initialValuesData, setInitialValuesData] = React.useState<
      {
         currency: string
         minAmount: number
      }[]
   >([])
   const [refreshData, setRefreshData] = React.useState(0)
   const currencyGroup = { currency: '', minAmount: 0 }
   const languages = useSelector(selectAuthLanguages)
   const languagesData = languages ? languages.map((item) => item.label) : []
   const [lang, setLang] = React.useState('')

   const handleSubmitValues = React.useCallback(
      (dto: {
         withdrawLimitByCurrency: { currency: string; minAmount: number }[]
         index?: number
      }) => {
         const newData = [...dto.withdrawLimitByCurrency]

         if (dto.index !== undefined) {
            newData.splice(dto.index, 1)
         }

         dataFilter.setWithdrawLimitByCurrency(newData)
      },
      []
   )

   useEffect(() => {
      if (dataFilter.data) {
         setInitialValuesData(
            Object.keys(dataFilter.data).map(
               (obj, cur) => ({
                  currency: obj,
                  minAmount: dataFilter.data[obj].minAmount,
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
                  withdrawLimitByCurrency: [...initialValuesData],
               }}
               onSubmit={handleSubmitValues}
               validationSchema={object({
                  withdrawLimitByCurrency: array(
                     object({
                        currency: string().required('Currency is required'),
                        minAmount: number()
                           .required('min amount is required')
                           .min(0, 'min amount should be at least 0'),
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
                     onBlur={handleSubmit}
                  >
                     <FieldArray name="withdrawLimitByCurrency">
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
                                    {values?.withdrawLimitByCurrency?.map(
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
                                             <Grid item xs={12}>
                                                <Autocomplete
                                                   options={languagesData}
                                                   id="demo-simple-select"
                                                   sx={{
                                                      width: '100%',
                                                      mb: 3,
                                                      '.MuiAutocomplete-input':
                                                         {
                                                            cursor: 'pointer',
                                                         },
                                                   }}
                                                   value={lang}
                                                   onChange={(_, newValue) =>
                                                      setLang(
                                                         newValue as string
                                                      )
                                                   }
                                                   renderInput={(params) => (
                                                      <TextField
                                                         {...params}
                                                         label="Select language"
                                                         variant="outlined"
                                                         fullWidth
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
                                                <StatusTextField
                                                   lang={lang}
                                                   msg={''}
                                                   params={[]}
                                                   updateMessage={(e: string) =>
                                                      console.log(e)
                                                   }
                                                   messageId="test1"
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
                                          variant="outlined"
                                          onClick={() => push(currencyGroup)}
                                       >
                                          Add Language
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

export default EditLang
