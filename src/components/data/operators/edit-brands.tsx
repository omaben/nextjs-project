import GridStyle from '@/components/custom/GridStyle';
import PortalCopyValue from '@/components/custom/PortalCopyValue';
import TransitionSlide from '@/components/custom/TransitionSlide';
import {
   Brand,
   EditOperatorBrandsDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
   faEdit,
   faRectangleXmark,
   faTrash,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogProps,
   DialogTitle,
   Grid,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import { randomId } from '@mui/x-data-grid-generator';
import {
   DataGridPro,
   GridActionsCellItem,
   GridColDef,
   GridRowModesModel,
   GridRowsProp,
} from '@mui/x-data-grid-pro';
import { darkPurple } from 'colors';
import { Formik } from 'formik';
import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectAuthBrandsList, selectAuthOperator } from 'redux/authSlice';
import { selectBoClient } from 'redux/socketSlice';
import {
   CustomNoRowsOverlay,
   PageWith2Toolbar,
   PageWith3Toolbar,
} from 'services/globalFunctions';
import { hasDetailsPermission } from 'services/permissionHandler';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import { useEditOperatorBrandMutation } from './lib/hooks/queries';
import { store } from 'redux/store';
import {
   saveLoadingBrandList,
   selectLoadingBrandList,
} from 'redux/loadingSlice';
const initialRows: GridRowsProp = [];
interface RowsCellProps {
   id: string;
   brandId: string;
   brandName: string;
   brandDomain: string;
}

export interface BrandsProps extends BoxProps {
   id: string;
   detail?: boolean;
   autoRefresh?: number;
}

export default function EditBrandsData({
   id,
   detail,
   autoRefresh,
   ...props
}: BrandsProps) {
   const data = useSelector(selectAuthBrandsList) as Brand[];
   const theme = useTheme();
   const [rows, setRows] = React.useState(initialRows);
   const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
      {}
   );
   const opId = useSelector(selectAuthOperator);
   const [ignore, setIgnore] = React.useState(false);
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
   const boClient = useSelector(selectBoClient);
   const loadingBrandList = useSelector(selectLoadingBrandList);
   const [openRemoveBrand, setOpenRemoveBrand] = React.useState(false);
   const [openEditBrand, setOpenEditBrand] = React.useState(false);
   const [currentBrand, setCurrentBrand] = React.useState({} as RowsCellProps);
   const [maxWidth, setMaxWidth] =
      React.useState<DialogProps['maxWidth']>('sm');
   const [fullWidth, setFullWidth] = React.useState(true);
   const [Transition, setTransition] = React.useState<any>();
   const [initialValues, setInitialValues] = React.useState({
      id: '',
      opId: opId,
      brandId: '',
      brandName: '',
      brandDomain: '',
   });
   const handleCloseRemoveBrand = () => {
      setOpenRemoveBrand(false);
   };

   const handleOpenEditBrand = (brand: RowsCellProps) => {
      setCurrentBrand(brand);
      setTransition(TransitionSlide);
      setInitialValues({
         id: brand.id,
         opId: opId,
         brandId: brand.brandId,
         brandName: brand.brandName,
         brandDomain: brand.brandDomain,
      });
      setOpenEditBrand(true);
   };

   const handleCloseEditBrand = async () => {
      setOpenEditBrand(false);
      setInitialValues({
         id: '',
         opId: opId,
         brandId: '',
         brandName: '',
         brandDomain: '',
      });
   };
   const handleOpenRemoveBrand = (brand: RowsCellProps) => {
      setCurrentBrand(brand);
      setOpenRemoveBrand(true);
   };

   const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
      setRowModesModel(newRowModesModel);
   };

   const columns: GridColDef[] = [
      {
         field: 'brandId',
         headerName: 'ID',
         headerAlign: 'left',
         align: 'left',
         renderCell: (params) => (
            <PortalCopyValue
               value={params.value?.toString()}
               href={`/brands/details?id=${id}&brandId=${params.value}`}
            />
         ),
         minWidth: 80,
         hideable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'brandName',
         headerName: 'Brand Name',
         align: 'left',
         headerAlign: 'left',
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'brandDomain',
         align: 'left',
         headerAlign: 'left',

         headerName: 'Brand Domain',
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
   ];

   if (
      hasDetailsPermission(
         UserPermissionEvent.BACKOFFICE_EDIT_OPERATOR_BRANDS_REQ
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
                  key={'edit1'}
                  className="textPrimary"
                  onClick={() => handleOpenEditBrand(params.row)}
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
                  key={'delete1'}
                  label="Delete"
                  onClick={() => handleOpenRemoveBrand(params.row)}
                  color="inherit"
               />,
            ];
         },
      });
   }

   const { mutate: brandMutate } = useEditOperatorBrandMutation({
      onSuccess: () => {
         toast.success('You update Successfully operator Brands', {
            position: toast.POSITION.TOP_CENTER,
         });
         boClient?.operator.getOperatorBrands(
            { opId: opId },
            {
               uuid: uuidv4(),
               meta: {
                  type: 'list',
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ,
               },
            }
         );
         handleCloseRemoveBrand();
         handleCloseEditBrand();
      },
   });

   const handleRemoveBrand = React.useCallback(
      (dataItem: { opId: string; id: string }) => {
         const rowsData = rows.filter((row) => row.id !== dataItem.id);
         const brands = rowsData.map(({ id, ...rest }) => rest) as Brand[];
         const dto: EditOperatorBrandsDto = {
            opId: dataItem.opId,
            brands: [...brands],
         };
         brandMutate({ dto });
      },
      [brandMutate, rows]
   );

   const handleEditBrand = React.useCallback(
      (dataItem: RowsCellProps) => {
         const updatedRows = rows.map((row) => {
            if (row.id === dataItem.id) {
               // Replace the found row with new data
               return { ...dataItem };
            }
            return row; // Leave other rows unchanged
         });
         const brands = updatedRows.map(
            ({ id, opId, ...rest }) => rest
         ) as Brand[];
         const dto: EditOperatorBrandsDto = {
            opId: opId,
            brands: [...brands],
         };
         brandMutate({ dto });
      },
      [brandMutate, rows, opId]
   );

   useEffect(() => {
      if (!ignore) {
         boClient?.operator.getOperatorBrands(
            { opId: id },
            {
               uuid: uuidv4(),
               meta: {
                  type: 'list',
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ,
               },
            }
         );
         setIgnore(true);
      }
   });

   useEffect(() => {
      const dataRows =
         data &&
         data.map(
            (obj, cur) => ({
               id: randomId(),
               brandId: obj.brandId,
               brandName: obj.brandName,
               brandDomain: obj.brandDomain,
            }),
            []
         );
      setRows(dataRows);
   }, [data]);

   useEffect(() => {
      store.dispatch(saveLoadingBrandList(true));
      boClient?.operator.getOperatorBrands(
         { opId: opId },
         {
            uuid: uuidv4(),
            meta: {
               type: 'list',
               ts: new Date(),
               sessionId: sessionStorage.getItem('sessionId'),
               event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ,
            },
         }
      );
   }, [opId, autoRefresh]);

   return (
      <>
         <Box
            className={'dataGridWrapper'}
            mb={0}
            px={isLgUp ? '12px' : '4px'}
            py={isDesktop ? '12px' : 0}
            sx={{
               height: isDesktop ? PageWith2Toolbar : PageWith3Toolbar,
               width: isDesktop ? 'calc(100vw - 225px)' : '100%',
               ...props.sx,
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
               slotProps={{
                  toolbar: { setRows, setRowModesModel, rows },
               }}
               slots={{
                  noRowsOverlay: CustomNoRowsOverlay,
                  noResultsOverlay: CustomNoRowsOverlay,
               }}
               loading={loadingBrandList}
               getRowClassName={(params) =>
                  params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
               }
            />
         </Box>
         <Dialog
            open={openRemoveBrand}
            onClose={handleCloseRemoveBrand}
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
            <DialogTitle id="form-dialog-title">Delete Brand</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this brand?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleCloseRemoveBrand}
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
                     handleRemoveBrand({
                        opId: opId,
                        id: currentBrand.id,
                     })
                  }
               >
                  Confirm
               </Button>
            </DialogActions>
         </Dialog>

         <Dialog
            open={openEditBrand}
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
                  <Typography variant="h5" gutterBottom display="inline" mb={0}>
                     Edit Brand ({currentBrand.brandId}-
                     {currentBrand.brandName && currentBrand.brandName})
                  </Typography>
               </Grid>
               <Grid item xs></Grid>
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleCloseEditBrand}
                  />
               </Grid>
            </Grid>
            <DialogContent sx={{ p: 1 }}>
               <Formik
                  initialValues={initialValues}
                  enableReinitialize={true}
                  validationSchema={Yup.object().shape({
                     brandId: Yup.string().required('brand id is required'),
                  })}
                  onSubmit={handleEditBrand}
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
                           name="brandId"
                           label="ID"
                           value={values.brandId}
                           error={Boolean(touched.brandId && errors.brandId)}
                           fullWidth
                           helperText={touched.brandId && errors.brandId}
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        <TextField
                           name="brandName"
                           label="Brand Name"
                           value={values.brandName}
                           error={Boolean(
                              touched.brandName && errors.brandName
                           )}
                           fullWidth
                           helperText={touched.brandName && errors.brandName}
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        <TextField
                           name="brandDomain"
                           label="Brand Domain"
                           value={values.brandDomain}
                           error={Boolean(
                              touched.brandDomain && errors.brandDomain
                           )}
                           fullWidth
                           helperText={
                              touched.brandDomain && errors.brandDomain
                           }
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        <DialogActions>
                           <Button
                              onClick={handleCloseEditBrand}
                              color="secondary"
                              variant="outlined"
                              sx={{ height: 32, borderColor: darkPurple[10] }}
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
      </>
   );
}
