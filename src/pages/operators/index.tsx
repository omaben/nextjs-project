import CustomLoader from '@/components/custom/CustomLoader';
import HeaderFilterToolbar from '@/components/custom/HeaderFilterToolbar';
import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar';
import MoreFiltersButton from '@/components/custom/MoreFiltersButton';
import { FilterChip } from '@/components/custom/PortalFilterChips';
import TransitionSlide from '@/components/custom/TransitionSlide';
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar';
import {
   useCreateEmptyOperatorMutation,
   useCreateOperatorMutation,
} from '@/components/data/operators/lib/hooks/queries';
import AllOperators from '@/components/data/operators/operators-grid';
import {
   CreateEmptyOperatorDto,
   CreateOperatorDto,
   Currency,
   DatabaseType,
   IntegrationType,
   UserPermissionEvent,
} from '@alienbackoffice/back-front';
import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
   faAdd,
   faAngleDown,
   faArrowsRotate,
   faChartLineDown,
   faChartLineUp,
   faGaugeMax,
   faRectangleXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   Autocomplete,
   Checkbox,
   Dialog,
   DialogActions,
   DialogContent,
   FormControlLabel,
   Grid,
   InputLabel,
   MenuItem,
   Button as MuiButton,
   FormControl as MuiFormControl,
   Select,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import { Stack, spacing } from '@mui/system';
import { darkPurple } from 'colors';
import { Field, Formik } from 'formik';
import type { ReactElement } from 'react';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
   saveOperatorsList,
   selectAuthCurrenciesInit,
   selectAuthLanguages,
} from 'redux/authSlice';
import { saveLoadingOperatorList } from 'redux/loadingSlice';
import { store } from 'redux/store';
import { preventInvalidCharacters } from 'services/globalFunctions';
import { hasDetailsPermission } from 'services/permissionHandler';
import { THEME } from 'types';
import * as Yup from 'yup';
import DashboardLayout from '../../layouts/Dashboard';

const Button = styled(MuiButton)(spacing);
const FormControlSpacing = styled(MuiFormControl)(spacing);
const FormControl = styled(FormControlSpacing)`
   min-width: 148px;
`;

function Operators() {
   // Define constants and state variables
   const theme = useTheme();
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const [open, setOpen] = React.useState(false);
   const [Transition, setTransition]: any = React.useState();
   const [openFilter, setOpenFilter] = React.useState(false);
   const [ignore, setIgnore] = React.useState(false);
   const [keyDateFilter, setKeyDateFilter] = React.useState(0);
   const [openAddOperator, setOpenAddOperator] = React.useState(false);
   const languages = useSelector(selectAuthLanguages);
   const [transitionFilter, setTransitionFilter]: any = React.useState();
   const filterInitialState = {
      opId: '',
      title: '',
   };
   const [filters, setFilters] = React.useState(filterInitialState);
   const [filtersInput, setFiltersInput] = React.useState(filterInitialState);
   const [filterChips, setFilterChips] = React.useState<FilterChip[]>([]);
   const [autoRefresh, setAutoRefresh] = React.useState(0);
   const [fullWidth, setFullWidth] = React.useState(true);
   const currenciesInit = useSelector(selectAuthCurrenciesInit) as Currency[];

   // Mutation hook for creating an operator
   const { mutate } = useCreateOperatorMutation({
      onSuccess: () => {
         handleClose();
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   // Mutation hook for creating an empty operator
   const { mutate: mutateEmptyOperator } = useCreateEmptyOperatorMutation({
      onSuccess: () => {
         toast.success('You Add Empty Operator successfully', {
            position: toast.POSITION.TOP_CENTER,
         });
         handleCloseOperator();
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   // Handle closing the Add Operator dialog
   const handleCloseOperator = () => {
      setOpenAddOperator(false);
   };

   // Handle opening the main dialog
   const handleClickOpen = () => {
      setTransition(TransitionSlide);
      setOpen(true);
   };

   // Handle closing the main dialog
   const handleClose = async () => {
      setOpen(false);
   };

   // Handle closing the filter dialog
   const handleCloseFilter = async () => {
      setKeyDateFilter(keyDateFilter + 1);
      await setTransition(TransitionSlide);
      setOpenFilter(false);
   };

   // Handle opening the filter dialog
   const handleClickOpenFilter = () => {
      setTransitionFilter(TransitionSlide);
      setOpenFilter(true);
   };

   // Submit handler for empty operator form
   const handleSubmitEmptyOperator = React.useCallback(
      (dto: CreateEmptyOperatorDto) => {
         mutateEmptyOperator({ dto: dto });
      },
      [mutate]
   );

   // Submit handler for operator form
   const handleSubmit = React.useCallback(
      (data: CreateOperatorDto) => {
         data.ips = data.ips.toString().split(/\r?\n/);
         mutate({ dto: data });
      },
      [mutate]
   );

   // Handle search filter and close filter dialog
   const handleSearchFilter = () => {
      setFilters(filtersInput);
      handleCloseFilter();
   };

   // Render more filters button and input fields
   const moreFiltersBtn = () => {
      return (
         <MoreFiltersButton
            open={openFilter}
            onClick={handleClickOpenFilter}
            TransitionComponent={transitionFilter}
            onClose={handleCloseFilter}
            onSearch={handleSearchFilter}
         >
            <TextField
               name="opId"
               label="Operator Id"
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     opId: e.target.value,
                  }));
               }}
               value={filtersInput.opId}
               fullWidth
               variant="outlined"
            />
            <TextField
               name="title"
               label="Title"
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     title: e.target.value,
                  }));
               }}
               value={filtersInput.title}
               fullWidth
               variant="outlined"
            />
         </MoreFiltersButton>
      );
   };

   // Handle chip deletion and update filter state
   const handleDeleteChip = (chipToDelete: FilterChip) => () => {
      setFilterChips((chips) =>
         chips.filter((chip) => chip.key !== chipToDelete.key)
      );

      const getObjectKey = (obj: any, value: string) => {
         return Object.keys(obj).find((key) => obj[key] === value);
      };

      const objKey = getObjectKey(filters, chipToDelete.value);
      objKey &&
         setFilters((prev) => ({
            ...prev,
            [objKey]:
               filterInitialState[objKey as keyof typeof filterInitialState],
         }));
   };

   // Update filter chips and input fields on filter state change
   useEffect(() => {
      setFilterChips([
         { key: 0, label: 'Op ID', value: filters.opId },
         { key: 1, label: 'Title', value: filters.title },
      ]);
      setFiltersInput(filters);
   }, [filters]);

   // Ignore effect on initial mount to prevent unnecessary API calls
   useEffect(() => {
      if (!ignore) {
         store.dispatch(saveLoadingOperatorList(true));
         store.dispatch(saveOperatorsList([]));
         setTimeout(() => {
            setIgnore(true);
         }, 500);
      }
   });

   return ignore ? (
      <React.Fragment>
         <Helmet title="iMoon | Operators" />
         {isDesktop ? (
            <>
               {/* Custom toolbar for desktop */}
               <CustomOperatorsBrandsToolbar
                  title={'Operator List'}
                  filter={true}
                  handleFilter={moreFiltersBtn}
                  sx={{
                     mb:
                        filterChips.filter(
                           (chip) => chip.value && chip.value !== 'all'
                        ).length > 0
                           ? 0
                           : '12px',
                  }}
                  background={theme.palette.secondary.dark}
                  actions={
                     <>
                        {/* Button for creating a new operator */}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_CREATE_OPERATOR_REQ
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
                                 New Operator
                              </Button>
                           </Grid>
                        )}
                        {/* Button for creating an empty operator */}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_CREATE_EMPTY_OPERATOR_REQ
                        ) && (
                           <Grid item>
                              <Button
                                 color="info"
                                 variant="contained"
                                 onClick={() => {
                                    setTransition(TransitionSlide);
                                    setOpenAddOperator(true);
                                 }}
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
                                 Empty Operator
                              </Button>
                           </Grid>
                        )}
                        {/* Button for refreshing the view */}
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
               {/* Display filter title toolbar if filters are applied */}
               {filterChips.filter((chip) => chip.value && chip.value !== 'all')
                  .length > 0 && (
                  <HeaderTitleToolbar
                     filterChips={filterChips}
                     handleDeleteChip={handleDeleteChip}
                     sx={{
                        '.MuiStack-root': {
                           maxWidth: '100%',
                        },
                     }}
                  />
               )}
            </>
         ) : (
            <>
               {/* Custom toolbar for mobile */}
               <CustomOperatorsBrandsToolbar
                  title={'Operator List'}
                  actions={
                     <Grid item>
                        {/* Button for refreshing the view in mobile */}
                        <Button
                           onClick={() => setAutoRefresh(autoRefresh + 1)}
                           color="primary"
                           variant={'text'}
                           sx={{
                              p: 0,
                              height: '28px',
                              justifyContent: 'end',
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
                        </Button>
                     </Grid>
                  }
               />
               {/* Header filter toolbar for mobile */}
               <HeaderFilterToolbar
                  filterChips={filterChips}
                  handleDeleteChip={handleDeleteChip}
                  moreFiltersBtn={moreFiltersBtn}
                  sx={{
                     mb:
                        filterChips.filter(
                           (chip) => chip.value && chip.value !== 'all'
                        ).length > 0
                           ? 0
                           : '6px',
                  }}
                  actions={
                     <>
                        {/* Button for creating a new operator in mobile */}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_CREATE_OPERATOR_REQ
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
                                 New Operator
                              </Button>
                           </Grid>
                        )}
                        {/* Button for creating an empty operator in mobile */}
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_CREATE_EMPTY_OPERATOR_REQ
                        ) && (
                           <Grid item>
                              <Button
                                 color="info"
                                 variant="contained"
                                 onClick={() => {
                                    setTransition(TransitionSlide);
                                    setOpenAddOperator(true);
                                 }}
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
                                 Empty Operator
                              </Button>
                           </Grid>
                        )}
                     </>
                  }
               />
               {/* Display filter title toolbar if filters are applied in mobile */}
               {filterChips.filter((chip) => chip.value && chip.value !== 'all')
                  .length > 0 && (
                  <HeaderTitleToolbar
                     filterChips={filterChips}
                     handleDeleteChip={handleDeleteChip}
                     sx={{
                        '.MuiStack-root': {
                           maxWidth: '100%',
                        },
                     }}
                  />
               )}
            </>
         )}

         {/* Render the component displaying all operators */}
         <AllOperators
            opId={filters.opId}
            title={filters.title}
            autoRefresh={autoRefresh}
         />

         {/* dialog for adding a new operator */}
         <Dialog
            open={open}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
            fullWidth={fullWidth}
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
                     Add New Operator
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
                  initialValues={{
                     opId: '',
                     title: '',
                     minStake: 0,
                     maxStake: 0,
                     maxWinAmount: 0,
                     minStakeByCurrency: {},
                     maxStakeByCurrency: {},
                     maxWinAmountByCurrency: {},
                     defaultBetAmountByCurrency: {},
                     webhookBaseUrl: '',
                     ips: [],
                     currency: '',
                     integrationType: IntegrationType.ALIEN,
                     lang: '',
                     theme: '',
                  }}
                  enableReinitialize={true}
                  validationSchema={Yup.object().shape({
                     title: Yup.string().required('title is required'),
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
                     setFieldValue,
                  }) => (
                     <form noValidate onSubmit={handleSubmit}>
                        <FormControl fullWidth>
                           <InputLabel id="demo-simple-select-disabled-label">
                              Languages
                           </InputLabel>
                           <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Languages"
                              fullWidth
                              value={values.lang}
                              name="lang"
                              onChange={handleChange}
                              IconComponent={(_props) => {
                                 return (
                                    <FontAwesomeIcon
                                       icon={faAngleDown as IconProp}
                                       size="sm"
                                       className="selectIcon"
                                    />
                                 );
                              }}
                           >
                              {languages &&
                                 languages.map((item: any, index: number) => {
                                    return (
                                       <MenuItem
                                          key={`currency${index}`}
                                          value={item.value}
                                       >
                                          <Stack
                                             direction="row"
                                             alignItems="center"
                                             gap={2}
                                             textTransform="capitalize"
                                          >
                                             {item.label}
                                          </Stack>
                                       </MenuItem>
                                    );
                                 })}
                           </Select>
                        </FormControl>
                        <FormControl
                           sx={{
                              width: '100%',
                           }}
                        >
                           <Autocomplete
                              id={`currency`}
                              options={
                                 currenciesInit
                                    ? [
                                         'all',
                                         ...currenciesInit?.map(
                                            (item) => item.currency
                                         ),
                                      ]
                                    : ['all']
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
                                 setFieldValue(`currency`, selectedCurrency);
                              }}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    variant="outlined"
                                    name={`currency`}
                                    label={'Currencies'}
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
                        <FormControl fullWidth>
                           <InputLabel id="demo-simple-select-disabled-label">
                              Theme
                           </InputLabel>
                           <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Theme"
                              fullWidth
                              value={values.theme}
                              name="theme"
                              onChange={handleChange}
                              IconComponent={(_props) => {
                                 return (
                                    <FontAwesomeIcon
                                       icon={faAngleDown as IconProp}
                                       size="sm"
                                       className="selectIcon"
                                    />
                                 );
                              }}
                           >
                              <MenuItem value={THEME.DARK}>
                                 <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={2}
                                    textTransform="capitalize"
                                 >
                                    {THEME.DARK}
                                 </Stack>
                              </MenuItem>
                              <MenuItem value={THEME.LIGHT}>
                                 <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={2}
                                    textTransform="capitalize"
                                 >
                                    {THEME.LIGHT}
                                 </Stack>
                              </MenuItem>
                           </Select>
                        </FormControl>
                        <FormControl fullWidth>
                           <InputLabel id="demo-simple-select-disabled-label">
                              Integration Type
                           </InputLabel>
                           <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Integration Type"
                              fullWidth
                              value={values?.integrationType}
                              name="integrationType"
                              onChange={handleChange}
                              IconComponent={(_props) => {
                                 return (
                                    <FontAwesomeIcon
                                       icon={faAngleDown as IconProp}
                                       size="sm"
                                       className="selectIcon"
                                    />
                                 );
                              }}
                           >
                              {Object.keys(IntegrationType).map((item) => (
                                 <MenuItem value={item} key={item}>
                                    <Stack
                                       direction="row"
                                       alignItems="center"
                                       gap={2}
                                    >
                                       {item}
                                    </Stack>
                                 </MenuItem>
                              ))}
                           </Select>
                        </FormControl>
                        <TextField
                           name="opId"
                           label="ID"
                           value={values.opId}
                           error={Boolean(touched.opId && errors.opId)}
                           fullWidth
                           helperText={touched.opId && errors.opId}
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
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
                        <FormControl fullWidth className="withLeftIcon">
                           <FontAwesomeIcon
                              icon={faChartLineDown as IconProp}
                              fixedWidth
                           />
                           <TextField
                              label="Min Stake"
                              type="number"
                              onKeyDown={preventInvalidCharacters}
                              value={values.minStake}
                              fullWidth
                              onChange={handleChange}
                              name="minStake"
                              autoComplete="off"
                           />
                        </FormControl>
                        <FormControl fullWidth className="withLeftIcon">
                           <FontAwesomeIcon
                              icon={faChartLineUp as IconProp}
                              fixedWidth
                           />
                           <TextField
                              label="Max Stake"
                              name="maxStake"
                              type="number"
                              onKeyDown={preventInvalidCharacters}
                              value={values.maxStake}
                              fullWidth
                              onChange={handleChange}
                              autoComplete="off"
                           />
                        </FormControl>
                        <FormControl fullWidth className="withLeftIcon">
                           <FontAwesomeIcon
                              icon={faGaugeMax as IconProp}
                              fixedWidth
                           />
                           <TextField
                              label="Max Win Amount"
                              name="maxWinAmount"
                              type="number"
                              onKeyDown={preventInvalidCharacters}
                              value={values.maxWinAmount}
                              fullWidth
                              onChange={handleChange}
                              autoComplete="off"
                           />
                        </FormControl>
                        <TextField
                           name="webhookBaseUrl"
                           label="Operator webhook endpoint"
                           value={values.webhookBaseUrl}
                           error={Boolean(
                              touched.webhookBaseUrl && errors.webhookBaseUrl
                           )}
                           fullWidth
                           helperText={
                              touched.webhookBaseUrl && errors.webhookBaseUrl
                           }
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        <TextField
                           name="ips"
                           label="operator IPs"
                           value={values.ips}
                           multiline
                           error={Boolean(touched.ips && errors.ips)}
                           fullWidth
                           helperText={touched.ips && errors.ips}
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

         {/* dialog for adding an empty operator */}
         <Dialog
            open={openAddOperator}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="form-dialog-title"
            sx={{
               '.MuiDialog-container': {
                  alignItems: 'end',
                  justifyContent: 'end',
               },
               '.MuiPaper-root': {
                  width: '600px',
                  padding: '5px',
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
                     Add Empty Operator
                  </Typography>
               </Grid>
               <Grid item xs></Grid>
               <Grid item>
                  <FontAwesomeIcon
                     icon={faRectangleXmark as IconProp}
                     onClick={handleCloseOperator}
                  />
               </Grid>
            </Grid>
            <DialogContent
               sx={{
                  p: 1,
                  '.MuiButtonBase-root': {
                     p: 0,
                  },
               }}
            >
               <Formik
                  initialValues={{
                     opId: '',
                     createResources: false,
                     databaseConnectionString: '',
                     databaseType: DatabaseType.AZURE_COSMOS_DB_FOR_MONGODB,
                     withoutAwpsHandlers: false,
                     withoutAcrWebhook: false,
                     withoutAppService: false,
                     withoutDatabase: false,
                     withoutOperator: false,
                     withoutServiceBusQueue: false,
                     databaseName: '',
                  }}
                  enableReinitialize={true}
                  validationSchema={Yup.object().shape({
                     opId: Yup.string()
                        .min(4)
                        .required('Operator Id  is required'),
                  })}
                  onSubmit={handleSubmitEmptyOperator}
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
                           name="opId"
                           label="Operator ID"
                           value={values.opId}
                           error={Boolean(touched.opId && errors.opId)}
                           fullWidth
                           helperText={touched.opId && errors.opId}
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        <TextField
                           name="databaseName"
                           label="Database Name"
                           value={values.databaseName}
                           error={Boolean(
                              touched.databaseName && errors.databaseName
                           )}
                           fullWidth
                           helperText={
                              touched.databaseName && errors.databaseName
                           }
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        <TextField
                           name="databaseConnectionString"
                           label="Database Connection String"
                           value={values.databaseConnectionString}
                           error={Boolean(
                              touched.databaseConnectionString &&
                                 errors.databaseConnectionString
                           )}
                           fullWidth
                           helperText={
                              touched.databaseConnectionString &&
                              errors.databaseConnectionString
                           }
                           onBlur={handleBlur}
                           onChange={handleChange}
                           variant="outlined"
                        />
                        <FormControl fullWidth>
                           <InputLabel id="demo-simple-select-disabled-label">
                              Database Type
                           </InputLabel>
                           <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Database Type"
                              fullWidth
                              value={values.databaseType}
                              name="databaseType"
                              onChange={handleChange}
                              IconComponent={(_props) => {
                                 return (
                                    <FontAwesomeIcon
                                       icon={faAngleDown as IconProp}
                                       size="sm"
                                       className="selectIcon"
                                    />
                                 );
                              }}
                           >
                              <MenuItem key={`databaseTypeempty`} value={''}>
                                 <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={2}
                                    textTransform="capitalize"
                                 >
                                    No database Type
                                 </Stack>
                              </MenuItem>
                              {Object.values(DatabaseType).map(
                                 (item: any, index: number) => {
                                    return (
                                       <MenuItem
                                          key={`databaseType${index}`}
                                          value={item}
                                       >
                                          <Stack
                                             direction="row"
                                             alignItems="center"
                                             gap={2}
                                          >
                                             {item}
                                          </Stack>
                                       </MenuItem>
                                    );
                                 }
                              )}
                           </Select>
                        </FormControl>
                        <FormControl variant="standard" fullWidth>
                           <Field
                              type="checkbox"
                              name="createResources"
                              value={values.createResources}
                              as={FormControlLabel}
                              control={
                                 <Checkbox checked={values.createResources} />
                              }
                              label={'Create Resources'}
                           />
                        </FormControl>
                        <FormControl variant="standard" fullWidth>
                           <Field
                              type="checkbox"
                              name="withoutOperator"
                              value={values.withoutOperator}
                              as={FormControlLabel}
                              control={
                                 <Checkbox checked={values.withoutOperator} />
                              }
                              label={'Without Operator'}
                           />
                        </FormControl>
                        <FormControl variant="standard" fullWidth>
                           <Field
                              type="checkbox"
                              name="withoutDatabase"
                              value={values.withoutDatabase}
                              as={FormControlLabel}
                              control={
                                 <Checkbox checked={values.withoutDatabase} />
                              }
                              label={'Without Database'}
                           />
                        </FormControl>
                        <FormControl variant="standard" fullWidth>
                           <Field
                              type="checkbox"
                              name="withoutAppService"
                              value={values.withoutAppService}
                              as={FormControlLabel}
                              control={
                                 <Checkbox checked={values.withoutAppService} />
                              }
                              label={'Without App Service'}
                           />
                        </FormControl>
                        <FormControl variant="standard" fullWidth>
                           <Field
                              type="checkbox"
                              name="withoutAcrWebhook"
                              value={values.withoutAcrWebhook}
                              as={FormControlLabel}
                              control={
                                 <Checkbox checked={values.withoutAcrWebhook} />
                              }
                              label={'Without Acr Webhook'}
                           />
                        </FormControl>
                        <FormControl variant="standard" fullWidth>
                           <Field
                              type="checkbox"
                              name="withoutServiceBusQueue"
                              value={values.withoutServiceBusQueue}
                              as={FormControlLabel}
                              control={
                                 <Checkbox
                                    checked={values.withoutServiceBusQueue}
                                 />
                              }
                              label={'Without Service Bus Queue'}
                           />
                        </FormControl>
                        <FormControl variant="standard" fullWidth>
                           <Field
                              type="checkbox"
                              name="withoutAwpsHandlers"
                              value={values.withoutAwpsHandlers}
                              as={FormControlLabel}
                              control={
                                 <Checkbox
                                    checked={values.withoutAwpsHandlers}
                                 />
                              }
                              label={'Without Awps Handlers'}
                           />
                        </FormControl>
                        <DialogActions>
                           <Button
                              onClick={() => {
                                 handleCloseOperator();
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
   ) : (
      <CustomLoader />
   );
}

Operators.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Operator List">{page}</DashboardLayout>;
};

export default Operators;
