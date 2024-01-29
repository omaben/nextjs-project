import CustomLoader from '@/components/custom/CustomLoader';
import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar';
import HeaderToolbar from '@/components/custom/HeaderToolbar';
import MoreFiltersButton from '@/components/custom/MoreFiltersButton';
import { FilterChip } from '@/components/custom/PortalFilterChips';
import TransitionSlide from '@/components/custom/TransitionSlide';
import DateToolbar from '@/components/custom/customDateToolbar';
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar';
import CashinCashoutData from '@/components/data/cashinCashout/cashin-cashout-grid';
import { User, UserScope } from '@alienbackoffice/back-front';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
   faAngleDown,
   faArrowsRotate,
   faCopy,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';
import {
   Button,
   FormControl,
   Grid,
   IconButton,
   InputAdornment,
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
import router from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import {
   saveBetsList,
   selectAuthBetsList,
   selectAuthCurrencyOption,
   selectAuthOperator,
   selectAuthUser,
} from 'redux/authSlice';
import { saveLoadingCashinCashout } from 'redux/loadingSlice';
import { getCrashConfig } from 'redux/slices/crashConfig';
import { store } from 'redux/store';
import {
   getDefaultEndDate,
   getDefaultStartDate,
} from 'services/globalFunctions';
import DashboardLayout from '../../layouts/Dashboard';

const filterInitialState = {
   playerId: '',
   status: 'all',
   nickname: '',
   cashierId: '',
   version: '',
};

const filterInitialStateDelete = {
   playerId: '',
   status: 'all',
   nickname: '',
   cashierId: '',
   version: '',
};

const timedifference = new Date().getTimezoneOffset();

function CashinCashout() {
   const theme = useTheme();
   const query: {
      from?: number;
      to?: number;
   } = router.query;
   const currencyOption = useSelector(selectAuthCurrencyOption);
   const [refreshData, setRefreshData] = React.useState(0);
   const [refresh, setRefresh] = React.useState(0);
   const [openFilter, setOpenFilter] = React.useState(false);
   const [searchDate, setSearchDate] = React.useState(0);
   const [transitionFilter, setTransitionFilter]: any = React.useState();
   const [canceled, setCanceled] = React.useState(false);
   const [ignore, setIgnore] = React.useState(false);
   const crashConfig = useSelector(getCrashConfig);
   const user = useSelector(selectAuthUser) as User;
   const data = useSelector(selectAuthBetsList);
   const [checked, setChecked] = useState(false);
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
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
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
   const opId = useSelector(selectAuthOperator);

   const handleDeleteChip = (chipToDelete: FilterChip) => () => {
      setFilterChips((chips) =>
         chips.filter((chip) => chip.key !== chipToDelete.key)
      );

      const getObjectKey = (obj: any, value: string, keyData: number) => {
         return Object.keys(obj).find(
            (key, index) =>
               (Array.isArray(obj[key])
                  ? obj[key].join('\n') === value
                  : obj[key] === value) && index === keyData
         );
      };

      const objKey = getObjectKey(
         filters,
         chipToDelete.value,
         chipToDelete.key
      );
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
            `/cashin-cashout?from=${
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
      setRefresh(refresh + 1);
      router.push(
         `/cashin-cashout?from=${
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
               label="Version"
               type="search"
               value={filtersInput.version}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     version: e.target.value,
                  }));
               }}
               autoComplete="off"
            />
            <TextField
               label="Cashier ID"
               type="search"
               value={filtersInput.cashierId}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     cashierId: e.target.value,
                  }));
               }}
               autoComplete="off"
            />
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
               label="Nickname"
               type="search"
               value={filtersInput.nickname}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     nickname: e.target.value,
                  }));
               }}
               autoComplete="off"
            />

            <FormControl fullWidth>
               <InputLabel id="demo-simple-select-disabled-label">
                  Status
               </InputLabel>
               <Select
                  IconComponent={() => (
                     <FontAwesomeIcon
                        icon={faAngleDown as IconProp}
                        className="selectIcon"
                        size="sm"
                     />
                  )}
                  labelId="demo-simple-select-label"
                  label="Bet Status "
                  id="demo-simple-select"
                  sx={{
                     width: '100%',
                     '.MuiPaper-root': {
                        background: 'red !important',
                     },
                     '.MuiButtonBase-root': {
                        background: 'transparent',
                        padding: 0,
                     },
                  }}
                  value={filtersInput.status}
                  onChange={(e) => {
                     const selectedValues = e.target.value;
                     setFiltersInput((prev) => ({
                        ...prev,
                        status: selectedValues, // Always set it as an array
                     }));
                  }}
                  endAdornment={
                     filtersInput.status?.length > 0 && (
                        <InputAdornment
                           position="end"
                           sx={{
                              marginRight: 2,
                           }}
                        >
                           <IconButton
                              onClick={() =>
                                 setFiltersInput((prev) => ({
                                    ...prev,
                                    status: '', // Always set it as an array
                                 }))
                              }
                              size="small"
                           >
                              <Clear />
                           </IconButton>
                        </InputAdornment>
                     )
                  }
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
                  {['open', 'close'].map((item, index: number) => {
                     return (
                        <MenuItem key={`status${index}`} value={item}>
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
         </MoreFiltersButton>
      );
   };

   const handleCopyButtonClick = (json: {}) => {
      const data = JSON.stringify(json, null, 2);
      navigator.clipboard.writeText(data);
      setChecked(true);
      setTimeout(() => setChecked(false), 1000);
   };

   useEffect(() => {
      if (!query?.from) {
         router.push(
            `/cashin-cashout?from=${
               moment(getDefaultStartDate()).utc().unix() +
               crashConfig.timezoneOffset * 60 -
               timedifference * 60
            }&to=${
               moment(getDefaultEndDate()).utc().unix() +
               crashConfig.timezoneOffset * 60 -
               timedifference * 60
            }`
         );
         setRefreshData(refreshData + 1);
      }
      if (!ignore) {
         store.dispatch(saveLoadingCashinCashout(true));
         store.dispatch(saveBetsList([]));
         setTimeout(() => {
            setIgnore(true);
         }, 500);
      }
   }, [query]);

   useEffect(() => {
      setFilterChips([
         { key: 0, label: 'Player ID', value: filters.playerId },
         { key: 1, label: 'Status', value: filters.status },
         { key: 2, label: 'Nickname', value: filters.nickname },
         { key: 3, label: 'Cashier ID', value: filters.cashierId },
         { key: 4, label: 'Version', value: filters.version },
      ]);
      setFiltersInput(filters);
   }, [filters]);

   return ignore ? (
      <React.Fragment>
         <Helmet title="iMoon | Cashin & Cashout" />
         {isDesktop ? (
            <>
               <CustomOperatorsBrandsToolbar
                  title={`Cashin & Cashout`}
                  filter={true}
                  handleFilter={moreFiltersBtn}
                  background={theme.palette.secondary.dark}
               />
               <HeaderToolbar
                  title={''}
                  isVisibleDate={true}
                  handleSearchClick={handleSearchClick}
                  handleLogDate={handlelogDate}
                  key={refreshData}
                  from={query?.from}
                  to={query?.to}
                  sx={{ px: '12px !important', pt: '6px' }}
                  actions={
                     <>
                        {user?.scope === UserScope.SUPERADMIN &&
                        data?.count &&
                        data?.count > 0 &&
                        data?.bets ? (
                           <Grid item>
                              <Button
                                 variant="outlined"
                                 sx={{
                                    color: '#1F1933',
                                    path: {
                                       fill: checked
                                          ? theme.palette.success.main
                                          : darkPurple[9],
                                       stroke: 'unset !important',
                                    },
                                    svg: {
                                       mr: 1,
                                    },
                                 }}
                                 onClick={() => {
                                    handleCopyButtonClick(data?.bets);
                                 }}
                              >
                                 {checked ? (
                                    <Check />
                                 ) : (
                                    <FontAwesomeIcon
                                       icon={faCopy as IconProp}
                                       fixedWidth
                                    />
                                 )}
                                 Copy JSON
                              </Button>
                           </Grid>
                        ) : (
                           ''
                        )}
                     </>
                  }
               />
            </>
         ) : (
            <>
               <CustomOperatorsBrandsToolbar
                  title=" "
                  brandFilter={true}
                  operatorFilter={true}
               />
               <DateToolbar
                  autoRefresh={false}
                  handleSearchClick={handleSearchClick}
                  handleLogDate={handlelogDate}
                  filter={true}
                  key={refreshData}
                  handleFilter={moreFiltersBtn}
                  from={query?.from}
                  to={query?.to}
               />
               <HeaderTitleToolbar
                  title={`Cashin & Cashout`}
                  actions={
                     <>
                        {user?.scope === UserScope.SUPERADMIN &&
                        data?.count &&
                        data?.count > 0 &&
                        data?.bets ? (
                           <Grid item>
                              <Button
                                 variant="outlined"
                                 sx={{
                                    color: '#1F1933',
                                    path: {
                                       fill: checked
                                          ? theme.palette.success.main
                                          : darkPurple[9],
                                       stroke: 'unset !important',
                                    },
                                    svg: {
                                       mr: 1,
                                    },
                                 }}
                                 onClick={() => {
                                    handleCopyButtonClick(data?.bets);
                                 }}
                              >
                                 {checked ? (
                                    <Check />
                                 ) : (
                                    <FontAwesomeIcon
                                       icon={faCopy as IconProp}
                                       fixedWidth
                                    />
                                 )}
                                 Copy JSON
                              </Button>
                           </Grid>
                        ) : (
                           ''
                        )}
                        <Grid item>
                           <Button
                              variant="outlined"
                              sx={{
                                 color: '#1F1933',
                                 path: {
                                    fill: darkPurple[9],
                                    stroke: 'unset !important',
                                 },
                                 svg: {
                                    mr: 1,
                                 },
                              }}
                              onClick={() => setRefresh(refresh + 1)}
                           >
                              <FontAwesomeIcon
                                 icon={faArrowsRotate as IconProp}
                                 fixedWidth
                              />
                              Refresh
                           </Button>
                        </Grid>
                     </>
                  }
               />
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

         {opId && (
            <CashinCashoutData
               placedAtFrom={startDate}
               playerId={filters.playerId}
               placedAtTo={endDate}
               status={filters.status as 'open' | 'close'}
               selectedCurrency={currencyOption?.value}
               canceled={canceled}
               refresh={refresh}
               nickname={filters.nickname}
               searchDate={searchDate}
               cashierId={filters.cashierId}
               version={filters.version}
            />
         )}
      </React.Fragment>
   ) : (
      <CustomLoader />
   );
}

CashinCashout.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Cashin Cashout List">{page}</DashboardLayout>;
};

export default CashinCashout;
