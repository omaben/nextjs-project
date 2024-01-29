import CustomLoader from '@/components/custom/CustomLoader';
import MoreFiltersButton from '@/components/custom/MoreFiltersButton';
import { FilterChip } from '@/components/custom/PortalFilterChips';
import TransitionSlide from '@/components/custom/TransitionSlide';
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar';
import { PortalExchanges } from '@/components/custom/exchangeRates';
import DefaultLimitsData from '@/components/data/operators/default-limits';
import { useSetDefaultBetAmountLimitsMutation } from '@/components/data/operators/lib/hooks/queries';
import { useGetCurrenciesQuery } from '@/components/data/reports/lib/hooks/queries';
import DashboardLayout from '@/layouts/Dashboard';
import {
   BetAmountLimits,
   Currency,
   SetOperatorDefaultBetAmountLimitsDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front';
import { CurrencyType } from '@alienbackoffice/back-front/lib/player/enum/currency-type.enum';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
   faAdd,
   faAngleDown,
   faRectangleXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
   Autocomplete,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   FormControl,
   Grid,
   InputLabel,
   MenuItem,
   Select,
   Stack,
   Tab,
   TextField,
   Typography,
   useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/system';
import { randomId } from '@mui/x-data-grid-generator';
import { darkPurple } from 'colors';
import { Formik } from 'formik';
import React, { ReactElement, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
   selectAuthCurrenciesInit,
   selectAuthDefaultBetAmountLimits
} from 'redux/authSlice';
import { PageWith3Toolbar, fetchJsonData } from 'services/globalFunctions';
import { hasDetailsPermission } from 'services/permissionHandler';
import { ExchangeType } from 'types';
import * as Yup from 'yup';

interface RowsCellPropsLimit {
   currency: string;
   minStack: number;
   maxStack: number;
   maxWinAmount: number;
   defaultBetAmount: number;
}

function ExchangeRates() {
   const [data, setData] = React.useState([] as Currency[]);
   // const data = useSelector(selectAuthExchangeRates) as Currency[];
   const [ignore, setIgnore] = React.useState(false);
   const theme = useTheme();
   const filterInitialState = {
      currencyCode: '',
      active: 'all',
      locked: 'all',
   };
   const [filters, setFilters] = React.useState(filterInitialState);
   const dataLimit = useSelector(
      selectAuthDefaultBetAmountLimits
   ) as BetAmountLimits;
   const [rows, setRows] = React.useState([] as Currency[]);
   const [rowsLimit, setRowsLimit] = React.useState([] as RowsCellPropsLimit[]);
   const [filtersInput, setFiltersInput] = React.useState(filterInitialState);
   const [Transition, setTransition]: any = React.useState();
   const [filterChips, setFilterChips] = React.useState<FilterChip[]>([]);
   const [openFilter, setOpenFilter] = React.useState(false);
   const [transitionFilter, setTransitionFilter]: any = React.useState();
   const [value, setValue] = React.useState(ExchangeType.FIAT);
   const [openEditLimit, setOpenEditLimit] = React.useState(false);
   const currenciesInit = useSelector(selectAuthCurrenciesInit) as Currency[];
   const [initialValuesLimit, setInitialValuesLimit] = React.useState({
      currency: '',
      minStack: 0,
      maxStack: 0,
      maxWinAmount: 0,
      defaultBetAmount: 0,
   });

   useGetCurrenciesQuery();

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

   const { mutate: mutateLimit } = useSetDefaultBetAmountLimitsMutation({
      onSuccess: () => {
         toast.success('Default bet amount limits Updated Successfully');
         handleCloseEditLimit();
      },
      onError(error, variables, context) {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const handleSubmitEditLimit = React.useCallback(
      (dataItem: RowsCellPropsLimit) => {
         const currencies: RowsCellPropsLimit[] = [...rowsLimit, dataItem];

         const minStakeByCurrency = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.minStack),
            }),
            {}
         );

         const maxStakeByCurrency = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.maxStack),
            }),
            {}
         );

         const maxWinAmountByCurrency = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.maxWinAmount),
            }),
            {}
         );

         const defaultBetAmount = currencies.reduce(
            (obj, cur) => ({
               ...obj,
               [cur.currency]: Number(cur.defaultBetAmount),
            }),
            {}
         );
         const dto: SetOperatorDefaultBetAmountLimitsDto = {
            minStakeByCurrency: minStakeByCurrency,
            maxStakeByCurrency: maxStakeByCurrency,
            maxWinAmountByCurrency: maxWinAmountByCurrency,
            defaultBetAmountByCurrency: defaultBetAmount,
         };
         mutateLimit({ dto });
      },
      [mutateLimit, rowsLimit]
   );

   const handleCloseFilter = () => {
      setOpenFilter(false);
   };

   const handleClickOpenFilter = () => {
      setTransitionFilter(TransitionSlide);
      setOpenFilter(true);
   };

   const handleSearchFilter = () => {
      setFilters(filtersInput);
      handleCloseFilter();
   };

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
               label="Currency Code"
               type="search"
               value={filtersInput.currencyCode}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     currencyCode: e.target.value,
                  }));
               }}
               autoComplete="off"
            />
            <FormControl
               sx={{
                  width: '100%',
               }}
            >
               <InputLabel id="demo-simple-select-disabled-label">
                  Locked Status
               </InputLabel>
               <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Locked Status"
                  sx={{
                     width: '100%',
                  }}
                  value={filtersInput.locked}
                  name="locked"
                  onChange={(e) => {
                     setFiltersInput((prev) => ({
                        ...prev,
                        locked: e.target.value,
                     }));
                  }}
               >
                  <MenuItem value={'all'}>
                     <Stack
                        direction="row"
                        alignItems="center"
                        gap={2}
                        textTransform="capitalize"
                     >
                        All
                     </Stack>
                  </MenuItem>
                  <MenuItem value={'true'}>
                     <Stack
                        direction="row"
                        alignItems="center"
                        gap={2}
                        textTransform="capitalize"
                     >
                        Locked
                     </Stack>
                  </MenuItem>
                  <MenuItem value={'false'}>
                     <Stack
                        direction="row"
                        alignItems="center"
                        gap={2}
                        textTransform="capitalize"
                     >
                        Unlocked
                     </Stack>
                  </MenuItem>
               </Select>
            </FormControl>
         </MoreFiltersButton>
      );
   };

   const handleChange = (
      event: React.SyntheticEvent,
      newValue: ExchangeType
   ) => {
      setValue(newValue);
   };

   const handleOpenEditLimit = () => {
      setTransition(TransitionSlide);
      setOpenEditLimit(true);
   };

   const handleCloseEditLimit = async () => {
      setOpenEditLimit(false);
      setInitialValuesLimit({
         currency: '',
         defaultBetAmount: 0,
         maxStack: 0,
         minStack: 0,
         maxWinAmount: 0,
      });
   };

   useEffect(() => {
      if (!ignore) {
         fetchJsonData(`https://alienrates.imoon.com/rates/rates.json`)
            .then((data) =>
               setData(Object.values(data.exchangeRates) as Currency[])
            )
            .catch((error) => ({ status: 'rejected', error }));
         setTimeout(() => {
            setIgnore(true);
         }, 1000);
      }
   });

   useEffect(() => {
      setFilterChips([
         { key: 0, label: 'Currency Code', value: filters.currencyCode },
         { key: 1, label: 'Active Status', value: filters.active },
         { key: 2, label: 'Locked Status', value: filters.locked },
      ]);
      setFiltersInput(filters);
      const rowDataActived = data.filter((item) =>
         filters.active !== 'all'
            ? item.active === JSON.parse(filters.active.toLowerCase())
            : item
      );
      const rowDataIsLocked = rowDataActived.filter((item) =>
         filters.locked !== 'all'
            ? item.isLocked === JSON.parse(filters.locked.toLowerCase())
            : item
      );
      const rowData = rowDataIsLocked.filter((item) =>
         filters.currencyCode !== ''
            ? item.code.toLowerCase() === filters.currencyCode.toLowerCase()
            : item
      );
      setRows(rowData);
   }, [filters, data]);

   React.useEffect(() => {
      if (dataLimit) {
         const currencies =
            (dataLimit.minStakeByCurrency &&
               Object.keys(dataLimit.minStakeByCurrency)) ||
            [];
         const dataRows =
            currencies &&
            currencies.map(
               (obj: string) => ({
                  id: randomId(),
                  currency: obj,
                  minStack:
                     dataLimit?.minStakeByCurrency &&
                     dataLimit?.minStakeByCurrency[obj],
                  maxStack:
                     dataLimit?.maxStakeByCurrency &&
                     dataLimit?.maxStakeByCurrency[obj],
                  maxWinAmount:
                     dataLimit?.maxWinAmountByCurrency &&
                     dataLimit?.maxWinAmountByCurrency[obj],
                  defaultBetAmount:
                     dataLimit?.defaultBetAmountByCurrency &&
                     dataLimit?.defaultBetAmountByCurrency[obj],
               }),
               []
            );
         setRowsLimit(dataRows as RowsCellPropsLimit[]);
      }
   }, [dataLimit]);
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

   return (
      <React.Fragment>
         <Helmet title="iMoon | Exchange" />

         <CustomOperatorsBrandsToolbar
            title={`Exchange Rates in USD`}
            filter={false}
            handleFilter={moreFiltersBtn}
            background={theme.palette.secondary.dark}
            actions={
               <>
                  {value === ExchangeType.LIMIT &&
                     hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_SET_OPERATOR_DEFAULT_BET_AMOUNT_LIMITS_REQ
                     ) && (
                        <Grid item>
                           <Button
                              onClick={handleOpenEditLimit}
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
                              New Currency
                           </Button>
                        </Grid>
                     )}
               </>
            }
         />
         {ignore ? (
            <>
               <TabContext value={value}>
                  <TabList
                     className="detail_tabs"
                     onChange={handleChange}
                     variant="scrollable"
                     sx={{
                        mb: '0',
                        pt: '6px',
                        '.MuiTabs-scroller': {
                           width: 'fit-content',
                           maxWidth: 'fit-content',
                        },
                        pl: '5px',
                        justifyContent: isDesktop ? 'left' : 'center',
                     }}
                     scrollButtons={true}
                  >
                     <Tab label="Fiat Currencies" value={ExchangeType.FIAT} />
                     <Tab
                        label="Crypto Currencies"
                        value={ExchangeType.CRYPTO}
                     />
                     {hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_GET_OPERATOR_DEFAULT_BET_AMOUNT_LIMITS_REQ
                     ) && (
                        <Tab label="Default Limit" value={ExchangeType.LIMIT} />
                     )}
                  </TabList>
                  <TabPanel
                     value={ExchangeType.FIAT}
                     sx={{
                        padding: '8px 12px !important',
                        height: PageWith3Toolbar,
                        overflow: 'auto',
                     }}
                  >
                     <PortalExchanges
                        rows={rows.filter(
                           (item) =>
                              item.type === CurrencyType.FIAT && item.active
                        )}
                     />
                  </TabPanel>
                  <TabPanel
                     value={ExchangeType.CRYPTO}
                     sx={{
                        padding: '8px 12px !important',
                        height: PageWith3Toolbar,
                        overflow: 'auto',
                     }}
                  >
                     <PortalExchanges
                        rows={rows.filter(
                           (item) =>
                              item.type === CurrencyType.CRYPTO && item.active
                        )}
                     />
                  </TabPanel>
                  <TabPanel
                     value={ExchangeType.LIMIT}
                     sx={{
                        padding: '8px 0px !important',
                        height: PageWith3Toolbar,
                        overflow: 'auto',
                     }}
                  >
                     <DefaultLimitsData />
                  </TabPanel>
               </TabContext>

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
                           Add new currency
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
                        initialValues={initialValuesLimit}
                        enableReinitialize={true}
                        validationSchema={Yup.object().shape({
                           currency: Yup.string().required(
                              'Currency is required'
                           ),
                           minStack: Yup.number()
                              .required('Min Stake count is required')
                              .min(0, 'Min Stake should be greater than 0.'),
                           maxStack: Yup.number()
                              .required('Max Stake count is required')
                              .test(
                                 'is-greater-than-minStack',
                                 'Max Stake should be greater than Min Stake',
                                 function (value) {
                                    const { minStack } = this.parent;

                                    if (!minStack || !value) {
                                       return true; // Validation will pass if either date is not provided.
                                    }

                                    if (minStack < value) {
                                       return true;
                                    }

                                    return false; // Validation fails if "to" is not greater than or equal to "from"
                                 }
                              ),
                           maxWinAmount: Yup.number()
                              .required('Max win amount is required')
                              .test(
                                 'is-between-minStack-maxStack',
                                 'Max Win Amount value should be greater or equal than Max Stake.',
                                 function (value) {
                                    const { maxStack } = this.parent;

                                    if (!maxStack || !value) {
                                       return true; // Validation will pass if either date is not provided.
                                    }

                                    if (maxStack <= value) {
                                       return true;
                                    }

                                    return false; // Validation fails if "to" is not greater than or equal to "from"
                                 }
                              ),
                           defaultBetAmount: Yup.number()
                              .required('Default bet amount is required')
                              .test(
                                 'is-between-minStack-maxStack',
                                 'The Default Bet Amount value should be within the range of Min Stake and Max Stake values.',
                                 function (value) {
                                    const { minStack, maxStack } = this.parent;

                                    if (!minStack || !value || !maxStack) {
                                       return true; // Validation will pass if either date is not provided.
                                    }

                                    if (
                                       minStack <= value &&
                                       value <= maxStack
                                    ) {
                                       return true;
                                    }

                                    return false; // Validation fails if "to" is not greater than or equal to "from"
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
                                       setFieldValue(
                                          `currency`,
                                          selectedCurrency
                                       );
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
                                 helperText={
                                    touched.minStack && errors.minStack
                                 }
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
                                 helperText={
                                    touched.maxStack && errors.maxStack
                                 }
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
            </>
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   );
}

ExchangeRates.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout>{page}</DashboardLayout>;
};

export default ExchangeRates;
