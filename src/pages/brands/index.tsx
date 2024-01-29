import CustomLoader from '@/components/custom/CustomLoader';
import HeaderFilterToolbar from '@/components/custom/HeaderFilterToolbar';
import TransitionSlide from '@/components/custom/TransitionSlide';
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar';
import EditBrandsData from '@/components/data/operators/edit-brands';
import {
   useEditOperatorBrandMutation,
   useLockedOperatorMutation,
} from '@/components/data/operators/lib/hooks/queries';
import {
   Brand,
   EditOperatorBrandsDto,
   LockOperatorDto,
   Operator,
   UserPermissionEvent,
} from '@alienbackoffice/back-front';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
   faAdd,
   faArrowsRotate,
   faRectangleXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   Grid,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import { darkPurple } from 'colors';
import { Formik } from 'formik';
import React, { ReactElement, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
   selectAuthBrandsList,
   selectAuthOperator,
   selectAuthOperatorDetails,
} from 'redux/authSlice';
import { selectBoClient } from 'redux/socketSlice';
import { hasDetailsPermission } from 'services/permissionHandler';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import DashboardLayout from '../../layouts/Dashboard';

interface RowsCellProps {
   brandId: string;
   brandName: string;
   brandDomain: string;
}

function Brands() {
   const theme = useTheme();
   const [ignore, setIgnore] = React.useState(false);
   const opId = useSelector(selectAuthOperator);
   const [Transition, setTransition]: any = React.useState();
   const [open, setOpen] = React.useState(false);
   const dataOperator = useSelector(selectAuthOperatorDetails) as Operator;
   const [autoRefresh, setAutoRefresh] = React.useState(0);
   const [initialValues, setInitialValues] = React.useState({
      opId: opId,
      brandId: '',
      brandName: '',
      brandDomain: '',
   });
   const data = useSelector(selectAuthBrandsList) as Brand[];
   const boClient = useSelector(selectBoClient);
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

   const { mutate } = useEditOperatorBrandMutation({
      onSuccess: () => {
         toast.success('You add Successfully operator Brand', {
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
         handleClose();
      },
   });

   const { mutate: mutateLocked } = useLockedOperatorMutation({
      onSuccess: (data) => {},
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const handleClickOpen = () => {
      setTransition(TransitionSlide);
      setOpen(true);
      setInitialValues({
         opId: opId,
         brandId: '',
         brandName: '',
         brandDomain: '',
      });
   };

   const handleClose = async () => {
      setOpen(false);
      setInitialValues({
         opId: opId,
         brandId: '',
         brandName: '',
         brandDomain: '',
      });
   };

   const handleSubmit = React.useCallback(
      (dataItem: RowsCellProps) => {
         const brand: Brand = {
            brandId: dataItem.brandId,
         };
         if (dataItem.brandName) {
            brand.brandName = dataItem.brandName;
         }
         if (dataItem.brandDomain) {
            brand.brandDomain = dataItem.brandDomain;
         }
         const dto: EditOperatorBrandsDto = {
            opId: opId,
            brands: [...data, brand],
         };
         mutate({ dto });
      },
      [mutate, opId, data]
   );

   const handlelockOperator = React.useCallback(
      (dto: LockOperatorDto) => {
         mutateLocked({ dto });
      },
      [mutateLocked]
   );

   useEffect(() => {
      if (!ignore) {
         setTimeout(() => {
            setIgnore(true);
         }, 500);
      }
   });

   return (
      <React.Fragment>
         <Helmet title="iMoon | Brand list" />
         {isDesktop ? (
            <CustomOperatorsBrandsToolbar
               title={'Brand List'}
               operatorFilter={!isDesktop && true}
               actions={
                  <>
                     {hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_LOCK_OPERATOR_REQ
                     ) && (
                        <Grid item>
                           <Button
                              onClick={() =>
                                 handlelockOperator({
                                    opId: opId,
                                    lock: !dataOperator?.isLocked,
                                 })
                              }
                              color="info"
                              variant="contained"
                              sx={{
                                 '&:hover': {
                                    background: '#8098F9',
                                 },
                                 borderRadius: '8px',
                                 padding: '4px 8px',
                                 letterSpacing: '0.48px',
                                 gap: '2px',
                                 height: '28px',
                              }}
                           >
                              {dataOperator?.isLocked
                                 ? 'Unlock Operator'
                                 : 'Lock Operator'}
                           </Button>
                        </Grid>
                     )}
                     {hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_EDIT_OPERATOR_BRANDS_REQ
                     ) && (
                        <Grid item>
                           <Button
                              onClick={() => handleClickOpen()}
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
                              New Brand
                           </Button>
                        </Grid>
                     )}
                     <Grid item>
                        <Button
                           onClick={() => setAutoRefresh(autoRefresh + 1)}
                           color="primary"
                           variant={isDesktop ? 'outlined' : 'text'}
                           sx={{
                              p: isDesktop ? '4px 8px 4px 8px' : 0,
                              height: '28px',
                              borderRadius: '8px',
                              justifyContent: isDesktop ? 'initial' : 'end',
                              minWidth: 'auto !important',
                              borderColor: `${darkPurple[12]} !important`,
                              svg: {
                                 width: '16px !important',
                              },
                              gap: '10px',
                           }}
                        >
                           <FontAwesomeIcon
                              icon={faArrowsRotate as IconProp}
                              fixedWidth
                              fontSize={'16px'}
                              color={darkPurple[12]}
                           />
                           {isDesktop && (
                              <Typography
                                 component="p"
                                 variant="button"
                                 fontFamily={'Nunito Sans SemiBold'}
                                 fontSize={'14px'}
                                 whiteSpace="nowrap"
                                 color={darkPurple[12]}
                              >
                                 Refresh
                              </Typography>
                           )}
                        </Button>
                     </Grid>
                  </>
               }
            />
         ) : (
            <>
               <CustomOperatorsBrandsToolbar
                  title={'Brand List'}
                  operatorFilter={!isDesktop && true}
               />
               <HeaderFilterToolbar
                  actions={
                     <>
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_LOCK_OPERATOR_REQ
                        ) && (
                           <Grid item>
                              <Button
                                 onClick={() =>
                                    handlelockOperator({
                                       opId: opId,
                                       lock: !dataOperator?.isLocked,
                                    })
                                 }
                                 color="info"
                                 variant="contained"
                                 sx={{
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
                                 {dataOperator?.isLocked
                                    ? 'Unlock Operator'
                                    : 'Lock Operator'}
                              </Button>
                           </Grid>
                        )}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_EDIT_OPERATOR_BRANDS_REQ
                        ) && (
                           <Grid item>
                              <Button
                                 onClick={() => handleClickOpen()}
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
                                 New Brand
                              </Button>
                           </Grid>
                        )}
                        <Grid item xs></Grid>
                        <Grid item>
                           <Button
                              onClick={() => setAutoRefresh(autoRefresh + 1)}
                              color="primary"
                              variant={isDesktop ? 'outlined' : 'text'}
                              sx={{
                                 p: isDesktop ? '4px 8px 4px 8px' : 0,
                                 height: '28px',
                                 justifyContent: isDesktop ? 'initial' : 'end',
                                 minWidth: 'auto !important',
                                 borderColor: `${darkPurple[12]} !important`,
                                 svg: {
                                    width: '16px !important',
                                 },
                                 gap: '10px',
                              }}
                           >
                              <FontAwesomeIcon
                                 icon={faArrowsRotate as IconProp}
                                 fixedWidth
                                 fontSize={'16px'}
                                 color={darkPurple[12]}
                              />
                              {isDesktop && (
                                 <Typography
                                    component="p"
                                    variant="button"
                                    fontFamily={'Nunito Sans SemiBold'}
                                    fontSize={'14px'}
                                    whiteSpace="nowrap"
                                    color={darkPurple[12]}
                                 >
                                    Refresh
                                 </Typography>
                              )}
                           </Button>
                        </Grid>
                     </>
                  }
               />
            </>
         )}
         {ignore ? (
            <EditBrandsData
               id={opId}
               detail={true}
               autoRefresh={autoRefresh}
               sx={{
                  '.MuiDataGrid-toolbarContainer.isMobile': {
                     right: '160px !important',
                  },
               }}
            />
         ) : (
            <CustomLoader />
         )}
         <Dialog
            open={open}
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
                     Add New Brand
                  </Typography>
               </Grid>
               <Grid item xs></Grid>
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleClose}
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
                  onSubmit={handleSubmit}
               >
                  {({
                     errors,
                     resetForm,
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
                              onClick={() => {
                                 handleClose();
                                 resetForm();
                              }}
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
      </React.Fragment>
   );
}

// Define the layout for the Webhooks page
Brands.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Brands List">{page}</DashboardLayout>;
};

export default Brands;
