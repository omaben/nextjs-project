import { BankInfo } from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAdd, faAngleDown } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Delete from '@mui/icons-material/Delete'
import {
   Card,
   CardContent,
   CardHeader,
   FormControl,
   Grid,
   InputLabel,
   MenuItem,
   Button as MuiButton,
   Typography as MuiTypography,
   Select,
   Stack,
} from '@mui/material'
import { spacing } from '@mui/system'
import { ImoonGray, darkPurple } from 'colors'
import { ErrorMessage, FieldArray, Formik } from 'formik'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthBanksName } from 'redux/authSlice'
import { array, object, string } from 'yup'
import { useGetBanksNameQuery } from '../reports/lib/hooks/queries'

function CustomBankNames(dataFilter: {
   data: string[]
   setBankNames: Function
   title: string
}) {
   useGetBanksNameQuery()
   const banksName: BankInfo[] = useSelector(selectAuthBanksName)
   const Button = styled(MuiButton)(spacing)
   const [initialValuesData, setInitialValuesData] = React.useState<
      { value: string }[]
   >([])
   const [refreshData, setRefreshData] = React.useState(0)
   const packageGroup = { value: '' }
   const Typography = styled(MuiTypography)`
      color: ${(props) => props.theme.palette.error.main};
   `
   const handleSubmitValues = React.useCallback(
      async (dto: { packages: { value: string }[]; index?: number }) => {
         const newData = [...dto.packages]
         if (dto.index !== undefined) {
            newData.splice(dto.index, 1)
         }
         await dataFilter.setBankNames(newData)
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
                        value: string().required('value is required'),
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
                        handleSubmit
                     }}
                     onMouseLeave={async (values) => await handleSubmit(values)}
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
                                       Bank Name
                                    </Button>
                                 }
                              />
                              <CardContent
                                 sx={{
                                    p: '0 !important',
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
                                             <FormControl
                                                sx={{
                                                   width: '100%',
                                                }}
                                             >
                                                <InputLabel id="demo-simple-select-disabled-label">
                                                   Bank Name
                                                </InputLabel>
                                                <Select
                                                   fullWidth
                                                   id={`packages[${index}]value`}
                                                   name={`packages.${index}.value`}
                                                   key={`packages.${index}.value`}
                                                   value={
                                                      values.packages[index]
                                                         .value
                                                   }
                                                   onMouseLeave={handleBlur}
                                                   onChange={handleChange}
                                                   IconComponent={() => (
                                                      <FontAwesomeIcon
                                                         icon={
                                                            faAngleDown as IconProp
                                                         }
                                                         size="sm"
                                                      />
                                                   )}
                                                   label="bank Name"
                                                >
                                                   {banksName?.map(
                                                      (item, index: number) => {
                                                         return (
                                                            <MenuItem
                                                               key={item.name}
                                                               value={item.name}
                                                               disabled={
                                                                  item.name ===
                                                                  values
                                                                     ?.packages[
                                                                     index
                                                                  ]?.value
                                                               }
                                                            >
                                                               <Stack
                                                                  direction="row"
                                                                  alignItems="center"
                                                                  gap={2}
                                                                  textTransform="capitalize"
                                                               >
                                                                  {item.name}
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

export default CustomBankNames
