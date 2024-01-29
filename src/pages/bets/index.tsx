import CustomLoader from '@/components/custom/CustomLoader';
import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar';
import HeaderToolbar from '@/components/custom/HeaderToolbar';
import MoreFiltersButton from '@/components/custom/MoreFiltersButton';
import { FilterChip } from '@/components/custom/PortalFilterChips';
import TransitionSlide from '@/components/custom/TransitionSlide';
import DateToolbar from '@/components/custom/customDateToolbar';
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar';
import AllBets from '@/components/data/bets/bets-grid';
import { useRollBackMutation } from '@/components/data/bets/lib/hooks/queries';
import { statusData } from '@/components/data/filters';
import {
   BetStatus,
   RollbackOpenBetDto,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
   faAngleDown,
   faArrowsRotate,
   faCircle,
   faCircle as faCircleOutline,
   faCopy,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';
import {
   Autocomplete,
   Button,
   Checkbox,
   Chip,
   FormControl,
   FormControlLabel,
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
import { toast } from 'react-toastify';
import {
   saveBetsList,
   selectAuthBetsList,
   selectAuthCurrencies,
   selectAuthCurrencyOption,
   selectAuthOperator,
   selectAuthUser,
} from 'redux/authSlice';
import { saveloadingBetsList } from 'redux/loadingSlice';
import { getCrashConfig } from 'redux/slices/crashConfig';
import { store } from 'redux/store';
import {
   getDefaultEndDate,
   getDefaultStartDate,
} from 'services/globalFunctions';
import { hasDetailsPermission } from 'services/permissionHandler';
import DashboardLayout from '../../layouts/Dashboard';

const filterInitialState = {
   playerId: '',
   betId: '',
   gameId: '',
   roundIndex: '',
   status: [] as string[],
   mode: 'all',
   cashOut: 'all',
   currencies: 'all',
   isTest: 'false',
   nickname: '',
   gameTitle: '',
   isFun: 'all',
   version: '',
   cashierId: '',
};

const filterInitialStateDelete = {
   playerId: '',
   betId: '',
   gameId: '',
   roundIndex: '',
   status: [],
   mode: 'all',
   cashOut: 'all',
   currencies: 'all',
   isTest: 'all',
   nickname: '',
   gameTitle: '',
   isFun: 'all',
   version: '',
   cashierId: '',
};

const timedifference = new Date().getTimezoneOffset();

function Bets() {
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
   const currencies = useSelector(selectAuthCurrencies);
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
   const [rollbackIds, setRollbackIds] = React.useState([]);
   const [rollbackActiveIndex, setRollbackActive] = React.useState(0);

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
            `/bets?from=${
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
      setSearchDate(searchDate + 1);
      router.push(
         `/bets?from=${
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
               label="Bet ID"
               type="search"
               value={filtersInput.betId}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     betId: e.target.value,
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

            <TextField
               label="Game ID"
               type="search"
               value={filtersInput.gameId}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     gameId: e.target.value,
                  }));
               }}
               autoComplete="off"
            />
            <TextField
               label="Game Title"
               type="search"
               value={filtersInput.gameTitle}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     gameTitle: e.target.value,
                  }));
               }}
               autoComplete="off"
            />

            <FormControl
               sx={{
                  width: '100%',
               }}
            >
               <Autocomplete
                  id={`currency`}
                  options={currencies ? ['all', ...currencies] : ['all']}
                  sx={{
                     width: '100%',
                     mb: 0,
                     '.MuiAutocomplete-input': {
                        textTransform: 'capitalize',
                        cursor: 'pointer',
                     },
                  }}
                  value={filtersInput.currencies}
                  onChange={(e, selectedCurrency) => {
                     setFiltersInput((prev) => ({
                        ...prev,
                        currencies: selectedCurrency || '',
                     }));
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
                  Bet Status
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
                  multiple
                  value={filtersInput.status}
                  onChange={(e) => {
                     const selectedValues = Array.isArray(e.target.value)
                        ? e.target.value
                        : [e.target.value];
                     setFiltersInput((prev) => ({
                        ...prev,
                        status: selectedValues, // Always set it as an array
                     }));
                  }}
                  renderValue={(selected) => (
                     <div>
                        {selected.map((item) => (
                           <Chip
                              key={item}
                              label={item}
                              style={{ marginRight: 2 }}
                              sx={{
                                 height: '17px',
                                 marginTop: '7px',
                              }}
                           />
                        ))}
                     </div>
                  )}
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
                                    status: [], // Always set it as an array
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
                  {statusData.map((item, index: number) => {
                     return (
                        <MenuItem key={`status${index}`} value={item.value}>
                           <Stack
                              direction="row"
                              alignItems="center"
                              gap={2}
                              textTransform="capitalize"
                           >
                              <FontAwesomeIcon
                                 icon={
                                    item.value === BetStatus.OPEN
                                       ? (faCircleOutline as IconProp)
                                       : (faCircle as IconProp)
                                 }
                                 fixedWidth
                                 color={item.color}
                              />
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
               <InputLabel id="demo-simple-select-disabled-label">
                  Test Status
               </InputLabel>
               <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Test Status "
                  fullWidth
                  value={filtersInput.isTest}
                  name="isTest"
                  onChange={(e) => {
                     setFiltersInput((prev) => ({
                        ...prev,
                        isTest: e.target.value,
                     }));
                  }}
                  IconComponent={() => (
                     <FontAwesomeIcon
                        icon={faAngleDown as IconProp}
                        className="selectIcon"
                        size="sm"
                     />
                  )}
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
                  IconComponent={() => (
                     <FontAwesomeIcon
                        icon={faAngleDown as IconProp}
                        className="selectIcon"
                        size="sm"
                     />
                  )}
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
         </MoreFiltersButton>
      );
   };

   const handleChangeCanceled = () => {
      setCanceled(!canceled);
   };

   const handleCopyButtonClick = (json: {}) => {
      const data = JSON.stringify(json, null, 2);
      navigator.clipboard.writeText(data);
      setChecked(true);
      setTimeout(() => setChecked(false), 1000);
   };

   const updateRollbackList = (data: []) => {
      setRollbackIds(data);
   };

   const { mutate: mutateRollBack } = useRollBackMutation({
      onSuccess: (data) => {
         if (rollbackActiveIndex === rollbackIds.length - 1) {
            setRefresh(refresh + 1);
            toast.success(`You rolledback the bets successfully`, {
               position: toast.POSITION.TOP_CENTER,
            });
         }
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         });
      },
   });

   const handleSetRollBackOpenBet = React.useCallback(
      (dto: RollbackOpenBetDto) => {
         mutateRollBack({ dto });
      },
      [mutateRollBack]
   );

   useEffect(() => {
      if (!query?.from) {
         router.push(
            `/bets?from=${
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
         store.dispatch(saveloadingBetsList(true));
         store.dispatch(saveBetsList([]));
         setTimeout(() => {
            setIgnore(true);
         }, 500);
      }
   }, [query]);

   useEffect(() => {
      setFilterChips([
         { key: 0, label: 'Player ID', value: filters.playerId },
         { key: 1, label: 'Bet ID', value: filters.betId },
         { key: 2, label: 'Game ID', value: filters.gameId },
         { key: 3, label: 'Round Index', value: filters.roundIndex },
         { key: 4, label: 'Bet Status', value: filters.status.join('\n') },
         { key: 5, label: 'Mode', value: filters.mode },
         { key: 6, label: 'CashOut', value: filters.cashOut },
         { key: 7, label: 'Currencies', value: filters.currencies },
         { key: 8, label: 'Is Test', value: filters.isTest },
         { key: 9, label: 'Nickname', value: filters.nickname },
         { key: 10, label: 'Game Title', value: filters.gameTitle },
         { key: 11, label: 'Is Fun', value: filters.isFun },
         { key: 12, label: 'Version', value: filters.version },
         { key: 13, label: 'Cashier ID', value: filters.cashierId },
      ]);
      setFiltersInput(filters);
   }, [filters]);

   return ignore ? (
      <React.Fragment>
         <Helmet title="iMoon | Bets" />
         {isDesktop ? (
            <>
               <CustomOperatorsBrandsToolbar
                  title={`Bet List`}
                  filter={true}
                  handleFilter={moreFiltersBtn}
                  background={theme.palette.secondary.dark}
                  actions={
                     hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_ROLLBACK_OPEN_BET_REQ
                     ) && rollbackIds.length > 0 ? (
                        <Grid item>
                           <Button
                              variant="outlined"
                              sx={{
                                 color: theme.palette.primary.contrastText,
                                 borderColor: `${darkPurple[12]} !important`,
                                 lineHeight: '10.6px',
                              }}
                              onClick={() =>
                                 rollbackIds.map((item, index) => {
                                    setTimeout(() => {
                                       setRollbackActive(index);
                                       const post: RollbackOpenBetDto = {
                                          betId: item,
                                          opId: opId,
                                       };
                                       handleSetRollBackOpenBet(post);
                                    }, 500);
                                 })
                              }
                           >
                              Rollback
                           </Button>
                        </Grid>
                     ) : (
                        <></>
                     )
                  }
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
                        {/* <Grid item>
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
                        </Grid> */}
                        <Grid item>
                           <FormControlLabel
                              control={
                                 <Checkbox
                                    value="canceled"
                                    color="primary"
                                    onChange={handleChangeCanceled}
                                    sx={{}}
                                 />
                              }
                              label="Canceled"
                           />
                        </Grid>
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
                  actions={
                     hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_ROLLBACK_OPEN_BET_REQ
                     ) && rollbackIds.length > 0 ? (
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
                              onClick={() => {
                                 rollbackIds.map((item, index) => {
                                    setTimeout(() => {
                                       setRollbackActive(index);
                                       const post: RollbackOpenBetDto = {
                                          betId: item,
                                          opId: opId,
                                       };
                                       handleSetRollBackOpenBet(post);
                                    }, 500);
                                 });
                              }}
                           >
                              Rollback
                           </Button>
                        </Grid>
                     ) : (
                        ''
                     )
                  }
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
                  title={`Bet List`}
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
                        <Grid item mt={0}>
                           <FormControlLabel
                              control={
                                 <Checkbox
                                    value="canceled"
                                    color="primary"
                                    onChange={handleChangeCanceled}
                                 />
                              }
                              label="Canceled"
                           />
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

         {query.from && query.from * 1000 === startDate && opId && (
            <AllBets
               placedAtFrom={startDate}
               playerId={filters.playerId}
               placedAtTo={endDate}
               betId={filters.betId}
               gameId={filters.gameId}
               version={filters.version}
               cashierId={filters.cashierId}
               gameTitle={filters.gameTitle}
               currencies={filters.currencies}
               status={filters.status}
               selectedCurrency={currencyOption?.value}
               canceled={canceled}
               isTest={filters.isTest}
               refresh={refresh}
               isFun={filters.isFun}
               nickname={filters.nickname}
               searchDate={searchDate}
               rollbackData={updateRollbackList}
            />
         )}
      </React.Fragment>
   ) : (
      <CustomLoader />
   );
}

Bets.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Bets List">{page}</DashboardLayout>;
};

export default Bets;
