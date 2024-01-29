import GridStyle from '@/components/custom/GridStyle'
import TransitionSlide from '@/components/custom/TransitionSlide'
import {
   BetAmountLimits,
   Currency,
   SetOperatorDefaultBetAmountLimitsDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faAngleDown,
   faEdit,
   faRectangleXmark,
   faTrash,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogProps,
   DialogTitle,
   FormControl,
   Grid,
   InputLabel,
   MenuItem,
   Select,
   Stack,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { randomId } from '@mui/x-data-grid-generator'
import {
   DataGridPro,
   GridActionsCellItem,
   GridColDef,
   GridRowModesModel,
   GridRowsProp,
} from '@mui/x-data-grid-pro'
import { darkPurple } from 'colors'
import { Formik } from 'formik'
import numeral from 'numeral'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   saveOperatorBetAmountLimits,
   selectAuthCurrenciesInit,
   selectAuthDefaultBetAmountLimits,
} from 'redux/authSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import {
   CustomNoRowsOverlay,
   PageWithdetails4ToolbarWithButton,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'
import { useSetDefaultBetAmountLimitsMutation } from './lib/hooks/queries'

const initialRows: GridRowsProp = []
interface RowsCellProps {
   id: string
   currency: string
   minStack: number
   maxStack: number
   maxWinAmount: number
   defaultBetAmount: number
}

export default function DefaultLimitsData() {
   const data = useSelector(selectAuthDefaultBetAmountLimits) as BetAmountLimits
   const theme = useTheme()
   const [rows, setRows] = React.useState(initialRows)
   const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
      {}
   )
   const [currentLimit, setCurrentLimit] = React.useState({} as RowsCellProps)
   const [Transition, setTransition] = React.useState<any>()
   const [initialValues, setInitialValues] = React.useState({
      id: '',
      currency: '',
      minStack: 0,
      maxStack: 0,
      maxWinAmount: 0,
      defaultBetAmount: 0,
   })
   const [openEditLimit, setOpenEditLimit] = React.useState(false)
   const [openRemoveLimit, setOpenRemoveLimit] = React.useState(false)
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const currenciesInit = useSelector(selectAuthCurrenciesInit)
   const [ignore, setIgnore] = React.useState(false)
   const boClient = useSelector(selectBoClient)
   const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm')
   const [fullWidth, setFullWidth] = React.useState(true)
   const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
      setRowModesModel(newRowModesModel)
   }

   const handleOpenEditLimit = (limit: RowsCellProps) => {
      setCurrentLimit(limit)
      setTransition(TransitionSlide)
      setInitialValues({
         id: limit.id,
         currency: limit.currency,
         defaultBetAmount: limit.defaultBetAmount,
         maxStack: limit.maxStack,
         minStack: limit.minStack,
         maxWinAmount: limit.maxWinAmount,
      })
      setOpenEditLimit(true)
   }

   const handleCloseEditLimit = async () => {
      setOpenEditLimit(false)
      setInitialValues({
         id: '',
         currency: '',
         defaultBetAmount: 0,
         maxStack: 0,
         minStack: 0,
         maxWinAmount: 0,
      })
   }

   const handleOpenRemoveLimit = (limit: RowsCellProps) => {
      setCurrentLimit(limit)
      setOpenRemoveLimit(true)
   }

   const columns: GridColDef[] = [
      {
         field: 'currency',
         headerName: 'Currency',
         headerAlign: 'center',
         align: 'center',
         type: 'singleSelect',
         renderCell: (params) => params.value,
         minWidth: 100,
         hideable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'minStack',
         type: 'text',
         headerName: 'Min Stake',
         align: 'center',
         headerAlign: 'center',
         renderCell: (params) => numeral(params.value).format('0,00.[000000]'),
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'maxStack',
         align: 'center',
         headerAlign: 'center',
         headerName: 'Max Stake',
         renderCell: (params) => numeral(params.value).format('0,00.[000000]'),
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'maxWinAmount',
         align: 'center',
         headerAlign: 'center',
         headerName: 'Max Win Amount',
         renderCell: (params) => numeral(params.value).format('0,00.[000000]'),
         minWidth: 100,
         hideable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'defaultBetAmount',
         align: 'center',
         headerAlign: 'center',
         headerName: 'Default Bet Amount',
         renderCell: (params) => numeral(params.value).format('0,00.[000000]'),
         minWidth: 100,
         hideable: false,
         flex: 1,
         sortable: false,
      },
   ]

   if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_SET_OPERATOR_DEFAULT_BET_AMOUNT_LIMITS_REQ
      )
   ) {
      columns.push({
         field: 'actions',
         type: 'actions',
         headerName: 'Actions',
         width: 100,
         cellClassName: 'actions',
         getActions: (params) => {
            return [
               <GridActionsCellItem
                  key={`editLimits${params.id}`}
                  icon={
                     <FontAwesomeIcon
                        icon={faEdit}
                        fixedWidth
                        color={theme.palette.grey[100]}
                        fontSize={14}
                     />
                  }
                  label="Edit"
                  className="textPrimary"
                  onClick={() => handleOpenEditLimit(params.row)}
                  color="inherit"
               />,
               <GridActionsCellItem
                  key={`deleteLimits${params.id}`}
                  icon={
                     <FontAwesomeIcon
                        icon={faTrash as IconProp}
                        fixedWidth
                        color={theme.palette.error.main}
                        fontSize={14}
                     />
                  }
                  label="Delete"
                  onClick={() => handleOpenRemoveLimit(params.row)}
                  color="inherit"
               />,
            ]
         },
      })
   }

   const { mutate } = useSetDefaultBetAmountLimitsMutation({
      onSuccess: () => {
         toast.success('Default bet amount limits Updated Successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         handleCloseEditLimit()
         handleCloseRemoveLimit()
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const handleSubmitEditLimit = React.useCallback(
      (dataItem: RowsCellProps) => {
         const updatedRows = rows.map((row) => {
            if (row.id === dataItem.id) {
               // Replace the found row with new data
               return { ...dataItem }
            }
            return row // Leave other rows unchanged
         })

         const currencies: RowsCellProps[] = updatedRows.map(
            ({ id, ...rest }) => rest
         ) as []

         const minStakeByCurrency = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.minStack),
            }),
            {}
         )

         const maxStakeByCurrency = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.maxStack),
            }),
            {}
         )

         const maxWinAmountByCurrency = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.maxWinAmount),
            }),
            {}
         )

         const defaultBetAmount = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.defaultBetAmount),
            }),
            {}
         )
         const dto: SetOperatorDefaultBetAmountLimitsDto = {
            minStakeByCurrency: minStakeByCurrency,
            maxStakeByCurrency: maxStakeByCurrency,
            maxWinAmountByCurrency: maxWinAmountByCurrency,
            defaultBetAmountByCurrency: defaultBetAmount,
         }
         mutate({ dto })
      },
      [mutate, rows]
   )

   const handleRemoveCurrency = React.useCallback(
      (dataItem: { id: string }) => {
         const updatedRows = rows.filter((row) => row.id !== dataItem.id)

         const currencies: RowsCellProps[] = updatedRows.map(
            ({ id, ...rest }) => rest
         ) as []

         const minStakeByCurrency = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.minStack),
            }),
            {}
         )

         const maxStakeByCurrency = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.maxStack),
            }),
            {}
         )

         const maxWinAmountByCurrency = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.maxWinAmount),
            }),
            {}
         )

         const defaultBetAmount = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.defaultBetAmount),
            }),
            {}
         )
         const dto: SetOperatorDefaultBetAmountLimitsDto = {
            minStakeByCurrency: minStakeByCurrency,
            maxStakeByCurrency: maxStakeByCurrency,
            maxWinAmountByCurrency: maxWinAmountByCurrency,
            defaultBetAmountByCurrency: defaultBetAmount,
         }
         mutate({ dto })
      },
      [mutate, rows]
   )

   const handleCloseRemoveLimit = () => {
      setOpenRemoveLimit(false)
   }
   
   React.useEffect(() => {
      if (!ignore) {
         store.dispatch(saveOperatorBetAmountLimits({}))
         boClient?.operator.getOperatorDefaultBetAmountLimits(
            {},
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_DEFAULT_BET_AMOUNT_LIMITS_REQ,
               },
            }
         )
         setIgnore(true)
      }
   })

   React.useEffect(() => {
      if (data) {
         const currencies =
            (data.minStakeByCurrency && Object.keys(data.minStakeByCurrency)) ||
            []
         const dataRows =
            currencies &&
            currencies.map(
               (obj: string) => ({
                  id: randomId(),
                  currency: obj,
                  minStack:
                     data?.minStakeByCurrency && data?.minStakeByCurrency[obj],
                  maxStack:
                     data?.maxStakeByCurrency && data?.maxStakeByCurrency[obj],
                  maxWinAmount:
                     data?.maxWinAmountByCurrency &&
                     data?.maxWinAmountByCurrency[obj],
                  defaultBetAmount:
                     data?.defaultBetAmountByCurrency &&
                     data?.defaultBetAmountByCurrency[obj],
               }),
               []
            )
         setRows(dataRows)
      }
   }, [data])


   return (
      rows && (
         <>
            <Box
               className={'dataGridWrapper'}
               mb={0}
               px={isLgUp ? '12px' : '4px'}
               py={'0'}
               sx={{
                  height: PageWithdetails4ToolbarWithButton,
                  width: isDesktop ? 'calc(100vw - 225px)' : '100%',
               }}
            >
               <DataGridPro
                  sx={GridStyle}
                  rowHeight={isDesktop ? 44 : 30}
                  rows={rows}
                  columns={columns}
                  editMode="row"
                  rowModesModel={rowModesModel}
                  onRowModesModelChange={handleRowModesModelChange}
                  slots={{
                     noRowsOverlay: CustomNoRowsOverlay,
                     noResultsOverlay: CustomNoRowsOverlay,
                  }}
                  slotProps={{
                     toolbar: { setRows, setRowModesModel, rows },
                  }}
                  getRowClassName={(params) =>
                     params.indexRelativeToCurrentPage % 2 === 0
                        ? 'even'
                        : 'odd'
                  }
               />
            </Box>
            <Dialog
               open={openEditLimit}
               fullScreen
               TransitionComponent={Transition}
               keepMounted
               aria-describedby="alert-dialog-slide-description"
               sx={{
                  '.MuiPaper-root': {
                     p: '12px 4px!important',
                  },
               }}
            >
               <Grid
                  container
                  direction="row"
                  alignItems="center"
                  p={'4px 8px'}
                  spacing={0}
                  sx={{
                     svg: {
                        fontSize: '16px',
                        height: '16px',
                        cursor: 'pointer',
                     },
                  }}
               >
                  <Grid item>
                     <Typography
                        variant="h5"
                        gutterBottom
                        display="inline"
                        mb={0}
                     >
                        Edit Limit {currentLimit.currency}
                     </Typography>
                  </Grid>
                  <Grid item xs></Grid>
                  <Grid item>
                     <FontAwesomeIcon
                        icon={faRectangleXmark as IconProp}
                        onClick={handleCloseEditLimit}
                     />
                  </Grid>
               </Grid>
               <DialogContent sx={{ p: 1 }}>
                  <Formik
                     initialValues={initialValues}
                     enableReinitialize={true}
                     validationSchema={Yup.object().shape({
                        currency: Yup.string().required('Currency is required'),
                        minStack: Yup.number()
                           .required('Min Stake count is required')
                           .min(0, 'Min Stake should be greater than 0.'),
                        maxStack: Yup.number()
                           .required('Max Stake count is required')
                           .test(
                              'is-greater-than-minStack',
                              'Max Stake should be greater than Min Stake',
                              function (value) {
                                 const { minStack } = this.parent

                                 if (!minStack || !value) {
                                    return true // Validation will pass if either date is not provided.
                                 }

                                 if (minStack < value) {
                                    return true
                                 }

                                 return false // Validation fails if "to" is not greater than or equal to "from"
                              }
                           ),
                        maxWinAmount: Yup.number()
                           .required('Max win amount is required')
                           .test(
                              'is-between-minStack-maxStack',
                              'Max Win Amount value should be greater or equal than Max Stake.',
                              function (value) {
                                 const { maxStack } = this.parent

                                 if (!maxStack || !value) {
                                    return true // Validation will pass if either date is not provided.
                                 }

                                 if (maxStack <= value) {
                                    return true
                                 }

                                 return false // Validation fails if "to" is not greater than or equal to "from"
                              }
                           ),
                        defaultBetAmount: Yup.number()
                           .required('Default bet amount is required')
                           .test(
                              'is-between-minStack-maxStack',
                              'The Default Bet Amount value should be within the range of Min Stake and Max Stake values.',
                              function (value) {
                                 const { minStack, maxStack } = this.parent

                                 if (!minStack || !value || !maxStack) {
                                    return true // Validation will pass if either date is not provided.
                                 }

                                 if (minStack <= value && value <= maxStack) {
                                    return true
                                 }

                                 return false // Validation fails if "to" is not greater than or equal to "from"
                              }
                           ),
                     })}
                     onSubmit={handleSubmitEditLimit}
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
                           <FormControl
                              sx={{
                                 width: '100%',
                              }}
                           >
                              <InputLabel id="demo-simple-select-disabled-label">
                                 Currency
                              </InputLabel>
                              <Select
                                 labelId="demo-simple-select-label"
                                 id="demo-simple-select"
                                 label="Currency"
                                 sx={{
                                    width: '100%',
                                 }}
                                 value={values.currency}
                                 name="currency"
                                 onChange={handleChange}
                                 IconComponent={() => (
                                    <FontAwesomeIcon
                                       icon={faAngleDown as IconProp}
                                       className="selectIcon"
                                       size="sm"
                                    />
                                 )}
                              >
                                 {currenciesInit?.map((item: Currency) => (
                                    <MenuItem value={item.currency} key={item.currency}>
                                       <Stack
                                          direction="row"
                                          alignItems="center"
                                          gap={2}
                                          textTransform="capitalize"
                                       >
                                          {item.currency}
                                       </Stack>
                                    </MenuItem>
                                 ))}
                              </Select>
                           </FormControl>
                           <TextField
                              name="minStack"
                              label="Min Stake"
                              type="number"
                              value={values.minStack}
                              onChange={handleChange}
                              fullWidth
                              variant="outlined"
                              error={Boolean(
                                 touched.minStack && errors.minStack
                              )}
                              helperText={touched.minStack && errors.minStack}
                           />
                           <TextField
                              name="maxStack"
                              label="Max Stake"
                              type="number"
                              value={values.maxStack}
                              onChange={handleChange}
                              error={Boolean(
                                 touched.maxStack && errors.maxStack
                              )}
                              helperText={touched.maxStack && errors.maxStack}
                              fullWidth
                              variant="outlined"
                           />
                           <TextField
                              name="maxWinAmount"
                              label="Max Win Amount"
                              type="number"
                              value={values.maxWinAmount}
                              error={Boolean(
                                 touched.maxWinAmount && errors.maxWinAmount
                              )}
                              helperText={
                                 touched.maxWinAmount && errors.maxWinAmount
                              }
                              onChange={handleChange}
                              fullWidth
                              variant="outlined"
                           />
                           <TextField
                              name="defaultBetAmount"
                              label="Default Bet Amount"
                              type="number"
                              value={values.defaultBetAmount}
                              error={Boolean(
                                 touched.defaultBetAmount &&
                                    errors.defaultBetAmount
                              )}
                              helperText={
                                 touched.defaultBetAmount &&
                                 errors.defaultBetAmount
                              }
                              onChange={handleChange}
                              fullWidth
                              variant="outlined"
                           />
                           <DialogActions>
                              <Button
                                 onClick={handleCloseEditLimit}
                                 color="secondary"
                                 variant="outlined"
                                 sx={{
                                    height: 32,
                                    borderColor: darkPurple[10],
                                 }}
                              >
                                 Cancel
                              </Button>
                              <Button
                                 type="submit"
                                 color="secondary"
                                 variant="contained"
                                 sx={{ height: 32 }}
                              >
                                 Save
                              </Button>
                           </DialogActions>
                        </form>
                     )}
                  </Formik>
               </DialogContent>
            </Dialog>
            <Dialog
               open={openRemoveLimit}
               onClose={handleCloseRemoveLimit}
               aria-labelledby="form-dialog-title"
               maxWidth={maxWidth}
               fullWidth={fullWidth}
               sx={{
                  p: '12px !important',
                  '.MuiPaper-root': {
                     m: 'auto',
                     borderRadius: '8px',
                  },
               }}
            >
               <DialogTitle id="form-dialog-title">Delete Currency</DialogTitle>
               <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                     Are you sure you want to delete this currency?
                  </DialogContentText>
               </DialogContent>
               <DialogActions>
                  <Button
                     onClick={handleCloseRemoveLimit}
                     color="secondary"
                     variant="outlined"
                     sx={{
                        height: 32,
                        borderColor: darkPurple[10],
                     }}
                  >
                     Cancel
                  </Button>
                  <Button
                     color="secondary"
                     variant="contained"
                     sx={{ height: 32 }}
                     onClick={() =>
                        handleRemoveCurrency({
                           id: currentLimit.id,
                        })
                     }
                  >
                     Confirm
                  </Button>
               </DialogActions>
            </Dialog>
         </>
      )
   )
}
