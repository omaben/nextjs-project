import GridStyle from '@/components/custom/GridStyle'
import TransitionSlide from '@/components/custom/TransitionSlide'
import {
   GetTopupCurrenciesDto,
   SetTopupCurrenciesDto,
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
   Autocomplete,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogProps,
   DialogTitle,
   FormControl,
   Grid,
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
   GridEventListener,
   GridRowEditStopReasons,
   GridRowModel,
   GridRowModesModel,
   GridRowsProp,
} from '@mui/x-data-grid-pro'
import { darkPurple } from 'colors'
import { Formik } from 'formik'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   saveTopupCurrencies,
   selectAuthCurrenciesInit,
   selectAuthTopupCurrencies,
} from 'redux/authSlice'
import {
   saveLoadingTopUpCurrencies,
   selectloadingTopUpCurrencies,
} from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import {
   CustomNoRowsOverlay,
   PageWithdetails4ToolbarWithButton,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'
import { useSetOperatorTopUpCurrenciesMutation } from './lib/hooks/queries'

const initialRows: GridRowsProp = []
interface RowsCellProps {
   id: string
   currency: string
}
export default function TopUpCurrenciesData(dataFilter: {
   opId: string
   brandId?: string
}) {
   const { opId, brandId } = dataFilter
   const theme = useTheme()
   const boClient = useSelector(selectBoClient)
   const data = useSelector(selectAuthTopupCurrencies) as string[]
   const [rows, setRows] = React.useState(initialRows)
   const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
      {}
   )
   const currenciesInit = useSelector(selectAuthCurrenciesInit)
   const [currentTopUp, setCurrentTopUp] = React.useState({} as RowsCellProps)
   const [Transition, setTransition]: any = React.useState()
   const [initialValues, setInitialValues] = React.useState({
      id: '',
      currency: '',
   })
   const [openEditTopUp, setOpenEditTopUp] = React.useState(false)
   const [openRemoveTopUp, setOpenRemoveTopUp] = React.useState(false)
   const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm')
   const [fullWidth, setFullWidth] = React.useState(true)
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const loadingTopUpCurrencies = useSelector(selectloadingTopUpCurrencies)
   const columns: GridColDef[] = [
      {
         field: 'currency',
         headerName: 'Currency',
         headerAlign: 'left',
         align: 'left',
         type: 'singleSelect',
         renderCell: (params) => params.value,
         minWidth: 100,
         hideable: false,
         flex: 1,
         sortable: false,
      },
   ]
   if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_SET_TOPUP_CURRENCIES_REQ
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
                  icon={
                     <FontAwesomeIcon
                        icon={faEdit as IconProp}
                        fixedWidth
                        color={theme.palette.grey[100]}
                        fontSize={14}
                     />
                  }
                  label="Edit"
                  key={`editTopUp${params.id}`}
                  className="textPrimary"
                  onClick={() => handleOpenEditTopUp(params.row)}
                  color="inherit"
               />,
               <GridActionsCellItem
                  icon={
                     <FontAwesomeIcon
                        icon={faTrash as IconProp}
                        fixedWidth
                        color={theme.palette.error.main}
                        fontSize={14}
                     />
                  }
                  key={`deleteTopUp${params.id}`}
                  label="Delete"
                  onClick={() => handleOpenRemoveTopUp(params.row)}
                  color="inherit"
               />,
            ]
         },
      })
   }

   const { mutate } = useSetOperatorTopUpCurrenciesMutation({
      onSuccess: () => {
         toast.success('Operator top up currencies Updated Successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         handleCloseEditTopUp()
         handleCloseRemoveTopUp()
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   const handleRowEditStop: GridEventListener<'rowEditStop'> = (
      params,
      event
   ) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
         event.defaultMuiPrevented = true
      }
   }

   const processRowUpdate = (newRow: GridRowModel) => {
      const updatedRow = {
         ...newRow,
         isNew: false,
         validTitle: true,
      }
      if (newRow.title === '') {
         updatedRow.validTitle = false
      }
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
      return updatedRow
   }

   const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
      setRowModesModel(newRowModesModel)
   }

   const handleOpenEditTopUp = (topUp: RowsCellProps) => {
      setCurrentTopUp(topUp)
      setTransition(TransitionSlide)
      setInitialValues({
         id: topUp.id,
         currency: topUp.currency,
      })
      setOpenEditTopUp(true)
   }

   const handleOpenRemoveTopUp = (topUp: RowsCellProps) => {
      setCurrentTopUp(topUp)
      setOpenRemoveTopUp(true)
   }

   const handleCloseRemoveTopUp = () => {
      setOpenRemoveTopUp(false)
   }
   
   const handleSubmitMethods = React.useCallback(
      (data: SetTopupCurrenciesDto) => {
         mutate({ dto: data })
      },
      [mutate]
   )

   const handleRemoveCurrency = React.useCallback(
      (dataItem: { opId: string; id: string }) => {
         const updatedRows = rows.filter((row) => row.id !== dataItem.id)

         const currencies: RowsCellProps[] = updatedRows.map(
            ({ id, opId, ...rest }) => rest
         ) as []

         const dto: SetTopupCurrenciesDto = {
            opId,
            currencies: currencies.map((obj) => obj.currency),
         }
         if (brandId) {
            dto.brandId = brandId
         }
         mutate({ dto })
      },
      [mutate, rows]
   )

   const handleCloseEditTopUp = async () => {
      setOpenEditTopUp(false)
      setInitialValues({
         id: '',
         currency: '',
      })
   }

   const handleSubmitEditTopUp = (dataItem: RowsCellProps) => {
      const updatedRows = rows.map((row) => {
         if (row.id === dataItem.id) {
            return { ...dataItem }
         }
         return row // Leave other rows unchanged
      })

      const currencies: RowsCellProps[] = updatedRows.map(
         ({ id, opId, ...rest }) => rest
      ) as []
      const items: SetTopupCurrenciesDto = {
         opId,
         currencies: currencies.map((obj) => obj.currency),
      }
      if (brandId) {
         items.brandId = brandId
      }
      handleSubmitMethods(items)
   }

   React.useEffect(() => {
      store.dispatch(saveLoadingTopUpCurrencies(true))
      if (opId) {
         const dto: GetTopupCurrenciesDto = {
            opId: opId,
         }
         if (brandId) {
            dto.brandId = brandId
         }
         boClient?.operator.getTopupCurrencies(
            { ...dto },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_TOPUP_CURRENCIES_REQ,
               },
            }
         )
      }
      if (!opId) {
         store.dispatch(saveTopupCurrencies([]))
         store.dispatch(saveLoadingTopUpCurrencies(false))
      }
   }, [opId, brandId])

   React.useEffect(() => {
      if (data) {
         const dataRows = data?.map(
            (obj: string) => ({
               id: randomId(),
               currency: obj,
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
               mt={0}
               px={isLgUp ? '12px' : '4px'}
               py={'0'}
               sx={{
                  height: PageWithdetails4ToolbarWithButton,
                  width: isDesktop ? 'calc(100vw - 225px)' : '100%',
                  '.MuiDataGrid-main': {
                     marginTop: '0 !important',
                  },
               }}
            >
               <DataGridPro
                  sx={GridStyle}
                  className={
                     hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_SET_TOPUP_CURRENCIES_REQ
                     )
                        ? `editToolbar details`
                        : ''
                  }
                  rowHeight={isDesktop ? 44 : 30}
                  rows={rows}
                  columns={columns}
                  editMode="row"
                  rowModesModel={rowModesModel}
                  onRowModesModelChange={handleRowModesModelChange}
                  onRowEditStop={handleRowEditStop}
                  processRowUpdate={processRowUpdate}
                  loading={loadingTopUpCurrencies}
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
               open={openEditTopUp}
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
                        Edit Top up {currentTopUp.currency}
                     </Typography>
                  </Grid>
                  <Grid item xs></Grid>
                  <Grid item>
                     <FontAwesomeIcon
                        icon={faRectangleXmark as IconProp}
                        onClick={handleCloseEditTopUp}
                     />
                  </Grid>
               </Grid>
               <DialogContent sx={{ p: 1 }}>
                  <Formik
                     initialValues={initialValues}
                     enableReinitialize={true}
                     validationSchema={Yup.object().shape({
                        currency: Yup.string().required('Currency is required'),
                     })}
                     onSubmit={handleSubmitEditTopUp}
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
                        <form noValidate onSubmit={handleSubmit}>
                           <FormControl
                              sx={{
                                 width: '100%',
                              }}
                           >
                              <Autocomplete
                                 id={`currency`}
                                 options={
                                    currenciesInit?.map(
                                       (item) => item.currency
                                    ) || []
                                 }
                                 sx={{
                                    width: '100%',
                                    mb: 0,
                                    '.MuiAutocomplete-input': {
                                       cursor: 'pointer',
                                    },
                                 }}
                                 value={values.currency}
                                 onChange={(e, selectedCurrency) => {
                                    setFieldValue(`currency`, selectedCurrency)
                                 }}
                                 renderInput={(params) => (
                                    <TextField
                                       {...params}
                                       variant="outlined"
                                       name={`currency`}
                                       label={'Currency'}
                                       fullWidth
                                       InputProps={{
                                          ...params.InputProps,
                                          endAdornment: (
                                             <FontAwesomeIcon
                                                icon={faAngleDown as IconProp}
                                                className="selectIcon"
                                                size="sm"
                                             />
                                          ),
                                       }}
                                    />
                                 )}
                              />
                           </FormControl>
                           <DialogActions>
                              <Button
                                 onClick={handleCloseEditTopUp}
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
               open={openRemoveTopUp}
               onClose={handleCloseRemoveTopUp}
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
                     onClick={handleCloseRemoveTopUp}
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
                           opId: opId,
                           id: currentTopUp.id,
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
