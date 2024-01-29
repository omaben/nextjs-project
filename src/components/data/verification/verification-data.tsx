import GridStyle from '@/components/custom/GridStyle'
import TransitionSlide from '@/components/custom/TransitionSlide'
import {
   KycVerification,
   SetKycVerificationsDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { KycVerificationsItemDto } from '@alienbackoffice/back-front/lib/operator/dto/set-kyc-verifications.dto'
import { KycVerificationType } from '@alienbackoffice/back-front/lib/operator/enum/kyc-verification-type.enum'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faAngleDown,
   faEdit,
   faRectangleXmark,
   faTrash
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Check from '@mui/icons-material/Check'
import Close from '@mui/icons-material/Close'
import {
   Checkbox,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogProps,
   DialogTitle,
   FormControl,
   FormControlLabel,
   FormGroup,
   Grid,
   InputLabel,
   MenuItem,
   Select,
   Stack,
   TextField,
   Typography,
   useMediaQuery,
   useTheme
} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { grey } from '@mui/material/colors'
import { randomId } from '@mui/x-data-grid-generator'
import {
   DataGridPro,
   GridActionsCellItem,
   GridColDef,
   GridRowModesModel,
   GridRowOrderChangeParams,
   GridRowsProp
} from '@mui/x-data-grid-pro'
import { darkPurple } from 'colors'
import { Field, Formik } from 'formik'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { saveKycVerification, selectAuthkycVerification } from 'redux/authSlice'
import {
   saveLoadingKycVerification,
   selectloadingKycVerification,
} from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import {
   CustomAction,
   CustomNoRowsOverlay,
   PageWithdetails4ToolbarWithButton,
} from 'services/globalFunctions'
import { hasDetailsPermission } from 'services/permissionHandler'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'
import { useSetOperatorKycVerificationMutation } from './lib/hooks/queries'

const initialRows: GridRowsProp = []
interface RowsCellProps {
   id: string
   order: number
   type: KycVerificationType
   title: string
   description?: string
   required: boolean
   visible: boolean
}
export default function VerificationData(dataFilter: {
   opId: string
   brandId: string
}) {
   const { opId, brandId } = dataFilter
   const theme = useTheme()
   const boClient = useSelector(selectBoClient)
   const data = useSelector(selectAuthkycVerification) as KycVerification[]
   const [rows, setRows] = React.useState(initialRows)
   const [initialValues, setInitialValues] = React.useState({
      id: '',
      type: KycVerificationType.FILE,
      order: 0,
      title: '',
      description: '',
      required: false,
      visible: false,
   })
   const [currentField, setCurrentField] = React.useState({} as RowsCellProps)
   const [openEditField, setOpenEditField] = React.useState(false)
   const [openRemoveField, setOpenRemoveField] = React.useState(false)
   const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm')
   const [fullWidth, setFullWidth] = React.useState(true)
   const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
      {}
   )
   const [Transition, setTransition]: any = React.useState()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
   const loadingKycVerification = useSelector(selectloadingKycVerification)

   const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
      setRowModesModel(newRowModesModel)
   }

   const columns: GridColDef[] = [
      {
         field: 'title',
         type: 'string',
         headerName: 'Title',
         align: 'left',
         headerAlign: 'left',
         renderCell: (params) => params.value,
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'type',
         headerName: 'Type',
         headerAlign: 'left',
         align: 'left',
         type: 'singleSelect',
         renderCell: (params) => params.value,
         minWidth: 100,
         hideable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'description',
         type: 'string',
         align: 'left',
         headerAlign: 'left',
         headerName: 'Description',
         renderCell: (params) => params.value,
         minWidth: 100,
         hideable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'required',
         type: 'boolean',
         align: 'left',
         headerAlign: 'left',
         headerName: 'Required',
         renderCell: (params) => {
            return params.value ? (
               <Check
                  style={{
                     color: theme.palette.success.light,
                  }}
               />
            ) : (
               <Close
                  style={{
                     color: grey[500],
                  }}
               />
            )
         },
         minWidth: 100,
         hideable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'visible',
         type: 'boolean',
         align: 'left',
         headerAlign: 'left',
         headerName: 'Visible',
         renderCell: (params) => {
            return params.value ? (
               <Check
                  style={{
                     color: theme.palette.success.light,
                  }}
               />
            ) : (
               <Close
                  style={{
                     color: grey[500],
                  }}
               />
            )
         },
         minWidth: 100,
         hideable: false,
         flex: 1,
         sortable: false,
      },
   ]
   if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_SET_KYC_VERIFICATIONS_REQ
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
                  onClick={() => handleOpenEditField(params.row)}
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
                  onClick={() => handleOpenRemoveFiled(params.row)}
                  color="inherit"
               />,
            ]
         },
      })
   }

   const { mutate } = useSetOperatorKycVerificationMutation({
      onSuccess: () => {
         toast.success('Operator Kyc Verification Updated Successfully', {
            position: toast.POSITION.TOP_CENTER,
         })
         handleCloseEditField()
         handleCloseRemoveField()
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
      },
   })

   function updateRowPosition(
      initialIndex: number,
      newIndex: number,
      rows: any
   ): Promise<any> {
      return new Promise((resolve) => {
         setTimeout(() => {
            const rowsClone = [...rows]
            const row = rowsClone.splice(initialIndex, 1)[0]
            rowsClone.splice(newIndex, 0, row)
            resolve(rowsClone)
         }, Math.random() * 500 + 100) // simulate network latency
      })
   }

   const handleRowOrderChange = async (params: GridRowOrderChangeParams) => {
      const newRows = await updateRowPosition(
         params.oldIndex,
         params.targetIndex,
         rows
      )
      setRows(newRows)
   }

   const handleCloseEditField = async () => {
      setOpenEditField(false)
      setInitialValues({
         id: '',
         order: 0,
         type: KycVerificationType.FILE,
         title: '',
         description: '',
         required: false,
         visible: false,
      })
   }

   const handleOpenEditField = (field: RowsCellProps) => {
      setCurrentField(field)
      setTransition(TransitionSlide)
      setInitialValues({
         id: field.id,
         order: field.order,
         description: field.description || '',
         required: field.required,
         title: field.title,
         type: field.type,
         visible: field.visible,
      })
      setOpenEditField(true)
   }

   const handleOpenRemoveFiled = (field: RowsCellProps) => {
      setCurrentField(field)
      setOpenRemoveField(true)
   }

   const handleCloseRemoveField = () => {
      setOpenRemoveField(false)
   }

   const handleRemoveField = React.useCallback(
      (dataItem: { opId: string; id: string; brandId: string }) => {
         const updatedRows = rows.filter((row) => row.id !== dataItem.id)

         const items: RowsCellProps[] = updatedRows.map(
            ({ id, opId, ...rest }) => rest
         ) as []

         const dto: SetKycVerificationsDto = {
            opId,
            items,
            brandId,
         }
         if (brandId) {
            dto.brandId = brandId
         }
         mutate({ dto })
      },
      [mutate, rows]
   )

   const handleEditField = React.useCallback(
      (dataItem: RowsCellProps) => {
         const updatedRows = rows.map((row) => {
            if (row.id === dataItem.id) {
               // Replace the found row with new data
               return { ...dataItem }
            }
            return row // Leave other rows unchanged
         })
         const items = updatedRows.map(
            ({ id, opId, ...rest }) => rest
         ) as KycVerificationsItemDto[]
         const dto: SetKycVerificationsDto = {
            opId,
            items,
            brandId,
         }
         mutate({ dto })
      },
      [mutate, rows, opId, brandId]
   )

   React.useEffect(() => {
      if (data) {
         const dataRows = data.map(
            (obj: KycVerification) => ({
               id: randomId(),
               type: obj.type,
               title: obj.title,
               description: obj.description,
               required: obj.required,
               order: obj.order,
               visible: obj.visible,
            }),
            []
         )
         const sortedDataRows = dataRows.sort((a, b) => a.order - b.order)
         setRows(sortedDataRows)
      }
   }, [data])

   React.useEffect(() => {
      store.dispatch(saveLoadingKycVerification(true))
      if (opId && brandId && brandId !== 'All Brands') {
         boClient?.operator.getKycVerifications(
            { opId: opId, brandId: brandId },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_KYC_VERIFICATIONS_REQ,
               },
            }
         )
      }
      if (!opId || !brandId) {
         store.dispatch(saveKycVerification([]))
         store.dispatch(saveLoadingKycVerification(false))
      }
   }, [opId, brandId])

   return (
      rows &&
      (brandId ? (
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
                  rowReordering
                  onRowOrderChange={handleRowOrderChange}
                  sx={GridStyle}
                  className={`editToolbar details`}
                  rowHeight={isDesktop ? 44 : 30}
                  rows={rows}
                  columns={columns}
                  editMode="row"
                  rowModesModel={rowModesModel}
                  onRowModesModelChange={handleRowModesModelChange}
                  loading={loadingKycVerification}
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
               open={openEditField}
               fullScreen
               TransitionComponent={Transition}
               keepMounted
               onClose={handleCloseEditField}
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
                        Edit Field {currentField.title}
                     </Typography>
                  </Grid>
                  <Grid item xs></Grid>
                  <Grid item>
                     <FontAwesomeIcon
                        icon={faRectangleXmark as IconProp}
                        onClick={handleCloseEditField}
                     />
                  </Grid>
               </Grid>
               <DialogContent sx={{ p: 1 }}>
                  <Formik
                     initialValues={initialValues}
                     enableReinitialize={true}
                     validationSchema={Yup.object().shape({
                        title: Yup.string().required('Title is required'),
                        type: Yup.string().required('Type is required'),
                     })}
                     onSubmit={handleEditField}
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
                           <TextField
                              name="title"
                              label="Title"
                              value={values.title}
                              error={Boolean(touched.title && errors.title)}
                              fullWidth
                              helperText={touched.title && errors.title}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                           />
                           <FormControl
                              sx={{
                                 width: '100%',
                              }}
                           >
                              <InputLabel id="demo-simple-select-disabled-label">
                                 Type
                              </InputLabel>
                              <Select
                                 labelId="demo-simple-select-label"
                                 id="demo-simple-select"
                                 label="Type"
                                 sx={{
                                    width: '100%',
                                 }}
                                 value={values.type}
                                 name="type"
                                 onChange={handleChange}
                                 IconComponent={() => (
                                    <FontAwesomeIcon
                                       icon={faAngleDown as IconProp}
                                       className="selectIcon"
                                       size="sm"
                                    />
                                 )}
                              >
                                 {Object.keys(KycVerificationType)?.map(
                                    (item: string) => (
                                       <MenuItem value={item} key={`${item}`}>
                                          <Stack
                                             direction="row"
                                             alignItems="center"
                                             gap={2}
                                             textTransform="capitalize"
                                          >
                                             {item}
                                          </Stack>
                                       </MenuItem>
                                    )
                                 )}
                              </Select>
                           </FormControl>
                           <TextField
                              name="description"
                              label="Description"
                              multiline
                              value={values.description}
                              error={Boolean(
                                 touched.description && errors.description
                              )}
                              fullWidth
                              helperText={
                                 touched.description && errors.description
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                           />
                           <FormControl variant="standard" fullWidth>
                              <FormGroup
                                 sx={{
                                    width: 'fit-content',
                                    '.MuiCheckbox-root': {
                                       paddingLeft: 0,
                                    },
                                 }}
                              >
                                 <Field
                                    type="checkbox"
                                    name="required"
                                    value={values.required}
                                    as={FormControlLabel}
                                    onChange={handleChange}
                                    control={
                                       <Checkbox checked={values.required} />
                                    }
                                    label={'Required'}
                                 />
                              </FormGroup>
                              <FormGroup
                                 sx={{
                                    width: 'fit-content',
                                    '.MuiCheckbox-root': {
                                       paddingLeft: 0,
                                    },
                                 }}
                              >
                                 <Field
                                    type="checkbox"
                                    name="visible"
                                    value={values.visible}
                                    as={FormControlLabel}
                                    onChange={handleChange}
                                    control={
                                       <Checkbox checked={values.visible} />
                                    }
                                    label={'Visible'}
                                 />
                              </FormGroup>
                           </FormControl>
                           <DialogActions>
                              <Button
                                 onClick={handleCloseEditField}
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
               open={openRemoveField}
               onClose={handleCloseRemoveField}
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
               <DialogTitle id="form-dialog-title">Delete Field</DialogTitle>
               <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                     Are you sure you want to delete this field?
                  </DialogContentText>
               </DialogContent>
               <DialogActions>
                  <Button
                     onClick={handleCloseRemoveField}
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
                        handleRemoveField({
                           opId: opId,
                           id: currentField.id,
                           brandId,
                        })
                     }
                  >
                     Confirm
                  </Button>
               </DialogActions>
            </Dialog>
         </>
      ) : (
         <Box
            className="dataGridWrapper"
            sx={{
               height: 'calc(100vh - 420px)',
               width: isDesktop
                  ? isLgUp
                     ? 'calc(100vw - 384px)'
                     : 'calc(100vw - 250px)'
                  : '100%',
               '.MuiDataGrid-row:hover, .MuiDataGrid-row:focus': {
                  '.showOnHover,': {
                     opacity: 1,
                  },
               },
               '.MuiDataGrid-row .showOnHover': {
                  opacity: 0.2,
               },
            }}
         >
            <CustomAction />
         </Box>
      ))
   )
}
