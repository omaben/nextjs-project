import CustomLoader from '@/components/custom/CustomLoader';
import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar';
import HeaderToolbar from '@/components/custom/HeaderToolbar';
import MoreFiltersButton from '@/components/custom/MoreFiltersButton';
import { FilterChip } from '@/components/custom/PortalFilterChips';
import TransitionSlide from '@/components/custom/TransitionSlide';
import DateToolbar from '@/components/custom/customDateToolbar';
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar';
import { useGetBanksNameQuery } from '@/components/data/reports/lib/hooks/queries';
import OperatorTransactions from '@/components/data/transactions/operator-transactions-grid';
import {
   BankInfo,
   OperatorTransactionType,
   PaymentGatewayName,
   TransactionStatus,
   TransactionType,
} from '@alienbackoffice/back-front';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowsRotate } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   Button,
   FormControl,
   Grid,
   InputLabel,
   MenuItem,
   Select,
   Stack,
   TextField,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import { darkPurple } from 'colors';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import {
   saveTransactions,
   selectAuthBanksName,
   selectAuthCurrencies,
   selectAuthOperator,
} from 'redux/authSlice';
import { saveLoadingTransactionList } from 'redux/loadingSlice';
import { getCrashConfig } from 'redux/slices/crashConfig';
import { store } from 'redux/store';
import {
   getDefaultEndDate,
   getDefaultStartDate,
} from 'services/globalFunctions';
import DashboardLayout from '../../layouts/Dashboard';

const filterInitialState = {
   playerId: '',
   fromAmount: '',
   toAmount: '',
   fromCurrency: 'all',
   toCurrency: 'all',
   txId: '',
   type: 'all',
   status: 'all',
   gateway: 'all',
   isFun: 'all',
   destinationAddress: '',
   iban: '',
   bankName: 'all',
   isTest: 'false',
};

const filterInitialStateDelete = {
   playerId: '',
   fromAmount: '',
   toAmount: '',
   fromCurrency: 'all',
   toCurrency: 'all',
   txId: '',
   type: 'all',
   status: 'all',
   gateway: 'all',
   isFun: 'all',
   destinationAddress: '',
   iban: '',
   bankName: 'all',
   isTest: 'all',
};
const timedifference = new Date().getTimezoneOffset();

function OperatorTransactionsList() {
   const theme = useTheme();
   const currencies = useSelector(selectAuthCurrencies);
   const router = useRouter();
   const banksName: BankInfo[] = useSelector(selectAuthBanksName);
   const query: any = router.query;
   const [openFilter, setOpenFilter] = React.useState(false);
   const [transitionFilter, setTransitionFilter]: any = React.useState();
   const crashConfig = useSelector(getCrashConfig);
   const opId = useSelector(selectAuthOperator);
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const [autoRefresh, setAutoRefresh] = React.useState(0);
   const [startDate, setStartDate]: any = React.useState(
      moment(getDefaultStartDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   );
   const [endDate, setEndDate]: any = React.useState(
      moment(getDefaultEndDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   );
   const [startDateUpdate, setStartDateUpdate]: any = React.useState(
      moment(getDefaultStartDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   );
   const [endDateUpdate, setEndDateUpdate]: any = React.useState(
      moment(getDefaultEndDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   );
   const [filters, setFilters] = React.useState(filterInitialState);
   const [filtersInput, setFiltersInput] = React.useState(filterInitialState);
   const [filterChips, setFilterChips] = React.useState<FilterChip[]>([]);
   const [ignore, setIgnore] = React.useState(false);

   useGetBanksNameQuery();

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
               filterInitialStateDelete[
                  objKey as keyof typeof filterInitialStateDelete
               ],
         }));
   };

   const handlelogDate = async (
      startDate: Date,
      endDate: Date,
      update: Boolean,
      firstLaunch: Boolean
   ) => {
      setStartDateUpdate(moment(startDate).utc());
      setEndDateUpdate(moment(endDate).utc());
      if (update) {
         router.push(
            `/operator-transactions?type=all&from=${
               moment(startDate).utc().unix() +
               crashConfig.timezoneOffset * 60 -
               timedifference * 60
            }&to=${
               moment(endDate).utc().unix() +
               crashConfig.timezoneOffset * 60 -
               timedifference * 60
            }`
         );
         setStartDate(
            moment(startDate).utc().unix() * 1000 +
               crashConfig.timezoneOffset * 60 * 1000 -
               timedifference * 60 * 1000
         );
         setEndDate(
            moment(endDate).utc().unix() * 1000 +
               crashConfig.timezoneOffset * 60 * 1000 -
               timedifference * 60 * 1000
         );
      }
   };

   const handleSearchClick = () => {
      setStartDate(
         moment(startDateUpdate).utc().unix() * 1000 +
            crashConfig.timezoneOffset * 60 * 1000 -
            timedifference * 60 * 1000
      );
      setEndDate(
         moment(endDateUpdate).utc().unix() * 1000 +
            crashConfig.timezoneOffset * 60 * 1000 -
            timedifference * 60 * 1000
      );
      setAutoRefresh(autoRefresh + 1);
      router.push(
         `/operator-transactions?type=all&from=${
            moment(startDateUpdate).utc().unix() +
            crashConfig.timezoneOffset * 60 -
            timedifference * 60
         }&to=${
            moment(endDateUpdate).utc().unix() +
            crashConfig.timezoneOffset * 60 -
            timedifference * 60
         }`
      );
   };

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
               label="Player ID"
               type="search"
               value={filtersInput.playerId}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     playerId: e.target.value,
                  }));
               }}
               autoComplete="off"
            />
            <TextField
               label="Tx ID"
               type="search"
               value={filtersInput.txId}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     txId: e.target.value,
                  }));
               }}
               autoComplete="off"
            />
            <TextField
               label="From Amount"
               type="number"
               value={filtersInput.fromAmount}
               fullWidth
               inputProps={{ min: 0 }}
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     fromAmount: e.target.value,
                  }));
               }}
               autoComplete="off"
            />
            <TextField
               label="To Amount"
               type="number"
               inputProps={{ min: 0 }}
               value={filtersInput.toAmount}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     toAmount: e.target.value,
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
                  Bank Name
               </InputLabel>
               <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Bank Name"
                  sx={{
                     width: '100%',
                  }}
                  value={filtersInput.bankName}
                  name="bankName"
                  onChange={(e) => {
                     setFiltersInput((prev) => ({
                        ...prev,
                        bankName: e.target.value,
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
                        All Banks
                     </Stack>
                  </MenuItem>
                  {banksName?.map((item, index: number) => {
                     return (
                        <MenuItem key={item.name} value={item.name}>
                           <Stack
                              direction="row"
                              alignItems="center"
                              gap={2}
                              textTransform="capitalize"
                           >
                              {item.name}
                           </Stack>
                        </MenuItem>
                     );
                  })}
               </Select>
            </FormControl>
            <TextField
               label="Iban"
               type="search"
               value={filtersInput.iban}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     iban: e.target.value,
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
                  From Currency
               </InputLabel>
               <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="From Currency"
                  sx={{
                     width: '100%',
                  }}
                  value={filtersInput.fromCurrency}
                  name="fromCurrency"
                  onChange={(e) => {
                     setFiltersInput((prev) => ({
                        ...prev,
                        fromCurrency: e.target.value,
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
                  {currencies &&
                     currencies.map((item, index: number) => {
                        return (
                           <MenuItem key={`currency${index}`} value={item}>
                              <Stack
                                 direction="row"
                                 alignItems="center"
                                 gap={2}
                                 textTransform="capitalize"
                              >
                                 {item}
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
               <InputLabel id="demo-simple-select-disabled-label">
                  To Currency
               </InputLabel>
               <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="To Currency"
                  sx={{
                     width: '100%',
                  }}
                  value={filtersInput.toCurrency}
                  name="toCurrency"
                  onChange={(e) => {
                     setFiltersInput((prev) => ({
                        ...prev,
                        toCurrency: e.target.value,
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
                  {currencies &&
                     currencies.map((item, index: number) => {
                        return (
                           <MenuItem key={`toCurrency${index}`} value={item}>
                              <Stack
                                 direction="row"
                                 alignItems="center"
                                 gap={2}
                                 textTransform="capitalize"
                              >
                                 {item}
                              </Stack>
                           </MenuItem>
                        );
                     })}
               </Select>
            </FormControl>
            {query.type === 'all' && (
               <FormControl
                  sx={{
                     width: '100%',
                  }}
               >
                  <InputLabel id="demo-simple-select-disabled-label">
                     Transaction Type
                  </InputLabel>
                  <Select
                     labelId="demo-simple-select-label"
                     id="demo-simple-select"
                     label="Transaction Type"
                     sx={{
                        width: '100%',
                     }}
                     value={filtersInput.type}
                     name="currency"
                     onChange={(e) => {
                        setFiltersInput((prev) => ({
                           ...prev,
                           type: e.target.value,
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
                           All Types
                        </Stack>
                     </MenuItem>
                     {Object.keys(OperatorTransactionType).map(
                        (item, index: number) => {
                           return (
                              <MenuItem
                                 key={`transaction${index}`}
                                 value={item}
                              >
                                 <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={2}
                                    textTransform="capitalize"
                                 >
                                    {item}
                                 </Stack>
                              </MenuItem>
                           );
                        }
                     )}
                  </Select>
               </FormControl>
            )}
            {(query.type === 'all' ||
               query.type === TransactionType.DEPOSIT ||
               query.type === TransactionType.WITHDRAW) && (
               <FormControl
                  sx={{
                     width: '100%',
                  }}
               >
                  <InputLabel id="demo-simple-select-disabled-label">
                     Gateways
                  </InputLabel>
                  <Select
                     labelId="demo-simple-select-label"
                     id="demo-simple-select"
                     label="Gateways"
                     sx={{
                        width: '100%',
                     }}
                     value={filtersInput.gateway}
                     name="currency"
                     onChange={(e) => {
                        setFiltersInput((prev) => ({
                           ...prev,
                           gateway: e.target.value,
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
                           All Gateways
                        </Stack>
                     </MenuItem>
                     {[
                        PaymentGatewayName.CPG,
                        PaymentGatewayName.JB,
                        PaymentGatewayName.PW,
                     ].map((item, index: number) => {
                        return (
                           <MenuItem key={`transaction${index}`} value={item}>
                              <Stack
                                 direction="row"
                                 alignItems="center"
                                 gap={2}
                                 textTransform="capitalize"
                              >
                                 {item}
                              </Stack>
                           </MenuItem>
                        );
                     })}
                  </Select>
               </FormControl>
            )}
            <FormControl
               sx={{
                  width: '100%',
               }}
            >
               <InputLabel id="demo-simple-select-disabled-label">
                  Transaction Status
               </InputLabel>
               <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Transaction Status"
                  sx={{
                     width: '100%',
                  }}
                  value={filtersInput.status}
                  name="transactionStatus"
                  onChange={(e) => {
                     setFiltersInput((prev) => ({
                        ...prev,
                        status: e.target.value,
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
                        All Status
                     </Stack>
                  </MenuItem>
                  {Object.keys(TransactionStatus).map((item, index: number) => {
                     return (
                        <MenuItem
                           key={`transactionStatus${index}`}
                           value={item}
                        >
                           <Stack
                              direction="row"
                              alignItems="center"
                              gap={2}
                              textTransform="capitalize"
                           >
                              {item}
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
               <InputLabel id="demo-simple-select-disabled-label">
                  Fun status
               </InputLabel>
               <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Fun Status "
                  sx={{
                     width: '100%',
                  }}
                  value={filtersInput.isFun}
                  name="isFun"
                  onChange={(e) => {
                     setFiltersInput((prev) => ({
                        ...prev,
                        isFun: e.target.value,
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
                        All Status
                     </Stack>
                  </MenuItem>
                  <MenuItem value={'true'}>
                     <Stack
                        direction="row"
                        alignItems="center"
                        gap={2}
                        textTransform="capitalize"
                     >
                        Fun
                     </Stack>
                  </MenuItem>
                  <MenuItem value={'false'}>
                     <Stack
                        direction="row"
                        alignItems="center"
                        gap={2}
                        textTransform="capitalize"
                     >
                        Real
                     </Stack>
                  </MenuItem>
               </Select>
            </FormControl>
            <FormControl
               sx={{
                  width: '100%',
               }}
            >
               <InputLabel id="demo-simple-select-disabled-label">
                  Test status
               </InputLabel>
               <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Test Status "
                  sx={{
                     width: '100%',
                  }}
                  value={filtersInput.isTest}
                  name="isTest"
                  onChange={(e) => {
                     setFiltersInput((prev) => ({
                        ...prev,
                        isTest: e.target.value,
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
                        All Status
                     </Stack>
                  </MenuItem>
                  <MenuItem value={'true'}>
                     <Stack
                        direction="row"
                        alignItems="center"
                        gap={2}
                        textTransform="capitalize"
                     >
                        Test
                     </Stack>
                  </MenuItem>
                  <MenuItem value={'false'}>
                     <Stack
                        direction="row"
                        alignItems="center"
                        gap={2}
                        textTransform="capitalize"
                     >
                        Real
                     </Stack>
                  </MenuItem>
               </Select>
            </FormControl>
            {query.type === TransactionType.WITHDRAW && (
               <TextField
                  label="Destination Address"
                  type="search"
                  value={filtersInput.destinationAddress}
                  fullWidth
                  onChange={(e) => {
                     setFiltersInput((prev) => ({
                        ...prev,
                        destinationAddress: e.target.value,
                     }));
                  }}
                  autoComplete="off"
               />
            )}
         </MoreFiltersButton>
      );
   };

   useEffect(() => {
      setFilterChips([
         { key: 0, label: 'Player ID', value: filters.playerId },
         { key: 1, label: 'From Amount', value: filters.fromAmount },
         { key: 2, label: 'To Amount', value: filters.toAmount },
         { key: 3, label: 'From Currency', value: filters.fromCurrency },
         { key: 4, label: 'To Currency', value: filters.toCurrency },
         { key: 5, label: 'TXID', value: filters.txId },
         { key: 6, label: 'Transaction Type', value: filters.type },
         { key: 7, label: 'Transaction Status', value: filters.status },
         { key: 8, label: 'Gateways', value: filters.gateway },
         { key: 9, label: 'Is Fun', value: filters.isFun },
         {
            key: 10,
            label: 'Destination Address',
            value: filters.destinationAddress,
         },
         {
            key: 11,
            label: 'Iban',
            value: filters.iban,
         },
         {
            key: 12,
            label: 'Bank Name',
            value: filters.bankName,
         },
         {
            key: 13,
            label: 'Is Test',
            value: filters.isTest,
         },
      ]);
      setFiltersInput(filters);
   }, [filters]);

   useEffect(() => {
      if (!query?.from) {
         router.push(
            `/operator-transactions?type=all&from=${
               moment(getDefaultStartDate()).utc().unix() +
               crashConfig.timezoneOffset * 60 -
               timedifference * 60
            }&to=${
               moment(getDefaultEndDate()).utc().unix() +
               crashConfig.timezoneOffset * 60 -
               timedifference * 60
            }`
         );
      }
      if (!ignore) {
         store.dispatch(saveLoadingTransactionList(true));
         store.dispatch(saveTransactions([]));
         setTimeout(() => {
            setIgnore(true);
         }, 500);
      }
   });

   return (
      <React.Fragment>
         <Helmet title={'Operator Transaction List'} />
         {isDesktop ? (
            <>
               <CustomOperatorsBrandsToolbar
                  title={'Operator Transaction List'}
                  filter={true}
                  handleFilter={moreFiltersBtn}
                  background={theme.palette.secondary.dark}
               />
               <HeaderToolbar
                  isVisibleDate={true}
                  handleSearchClick={handleSearchClick}
                  handleLogDate={handlelogDate}
                  sx={{ px: '8px !important' }}
                  from={query?.from}
                  to={query?.to}
               />
            </>
         ) : (
            <>
               <CustomOperatorsBrandsToolbar
                  title=" "
                  brandFilter={true}
                  operatorFilter={true}
                  actions={
                     <Grid item>
                        <Button
                           onClick={() => setAutoRefresh(autoRefresh + 1)}
                           color="primary"
                           variant={'text'}
                           sx={{
                              p: 0,
                              height: '28px',
                              justifyContent: 'end',
                              minWidth: 'auto !important',
                              ml: '5px',
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
               <DateToolbar
                  autoRefresh={false}
                  handleSearchClick={handleSearchClick}
                  handleLogDate={handlelogDate}
                  filter={true}
                  from={query?.from}
                  to={query?.to}
                  handleFilter={moreFiltersBtn}
               />
               <HeaderTitleToolbar title={'Operator Transaction List'} />
            </>
         )}
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
         {ignore ? (
            <OperatorTransactions
               key={'keyList'}
               playerId={filters.playerId}
               iban={filters.iban}
               opId={opId}
               fromCurrency={filters.fromCurrency}
               toCurrency={filters.toCurrency}
               fromAmount={Number(filters.fromAmount)}
               toAmount={Number(filters.toAmount)}
               gateway={filters.gateway}
               txId={filters.txId}
               type={query.type === 'all' ? (filters.type as any) : query.type}
               status={filters.status as any}
               destinationAddress={filters.destinationAddress}
               from={startDate}
               to={endDate}
               isFun={filters.isFun}
               isTest={filters.isTest}
               bankName={filters.bankName}
               autoRefresh={autoRefresh}
            />
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   );
}

OperatorTransactionsList.getLayout = function getLayout(page: ReactElement) {
   return (
      <DashboardLayout title="Operator Transaction List">
         {page}
      </DashboardLayout>
   );
};

export default OperatorTransactionsList;
