import CustomLoader from '@/components/custom/CustomLoader';
import HeaderFilterToolbar from '@/components/custom/HeaderFilterToolbar';
import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar';
import MoreFiltersButton from '@/components/custom/MoreFiltersButton';
import { FilterChip } from '@/components/custom/PortalFilterChips';
import TransitionSlide from '@/components/custom/TransitionSlide';
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar';
import AllPlayers from '@/components/data/players/players-grid';
import { IntegrationType, Operator } from '@alienbackoffice/back-front';
import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
   faAngleDown,
   faArrowsRotate,
   faCalendar,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   Checkbox,
   FormControl,
   FormControlLabel,
   Grid,
   InputLabel,
   MenuItem,
   Button as MuiButton,
   Select,
   Stack,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import { spacing } from '@mui/system';
import { DateTimePicker, renderTimeViewClock } from '@mui/x-date-pickers';
import { darkPurple } from 'colors';
import moment from 'moment';
import React, { ReactElement, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import {
   savePlayersList,
   selectAuthCurrentBrand,
   selectAuthCurrentOperator,
} from 'redux/authSlice';
import { saveLoadingPlayersList } from 'redux/loadingSlice';
import { getCrashConfig } from 'redux/slices/crashConfig';
import { store } from 'redux/store';
import DashboardLayout from '../../layouts/Dashboard';

const timedifference = new Date().getTimezoneOffset();

const filterInitialState = {
   playerId: '',
   brandId: '',
   brandName: '',
   nickname: '',
   isBlocked: 'all',
   isTest: 'false',
   telegramId: '',
   emailAddress: '',
   isFun: 'all',
   hasDeposit: 'all',
   registeredAtFrom: 0,
   registeredAtTo: 0,
   version: '',
};

const filterInitialStateDelete = {
   playerId: '',
   brandId: '',
   brandName: '',
   nickname: '',
   isBlocked: 'all',
   isTest: 'all',
   telegramId: '',
   emailAddress: '',
   isFun: 'all',
   hasDeposit: 'all',
   registeredAtFrom: 0,
   registeredAtTo: 0,
   version: '',
};

function Players() {
   const theme = useTheme();
   const Button = styled(MuiButton)(spacing);
   const timezone = useSelector(getCrashConfig).timezone;
   const crashConfig = useSelector(getCrashConfig);
   const [openFilter, setOpenFilter] = React.useState(false);
   const [transitionFilter, setTransitionFilter]: any = React.useState();
   const operator = useSelector(selectAuthCurrentOperator) as Operator;
   const [filters, setFilters] = React.useState(filterInitialState);
   const [filtersInput, setFiltersInput] = React.useState(filterInitialState);
   const [filterChips, setFilterChips] = React.useState<FilterChip[]>([]);
   const [ignore, setIgnore] = React.useState(false);
   const brandId = useSelector(selectAuthCurrentBrand);
   const [pendingVerification, setPendingVerification] = React.useState(false);
   const handleChangePendingVerification = () => {
      setPendingVerification(!pendingVerification);
   };
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const [refresh, setRefresh] = React.useState(0);

   const handleDeleteChip = (chipToDelete: FilterChip) => () => {
      setFilterChips((chips) =>
         chips.filter((chip) => chip.key !== chipToDelete.key)
      );

      const getObjectKey = (obj: any, value: number) => {
         return Object.keys(obj).find((key, index) => index === value);
      };

      const objKey = getObjectKey(filters, chipToDelete.key);
      objKey &&
         setFilters((prev) => ({
            ...prev,
            [objKey]:
               filterInitialStateDelete[
                  objKey as keyof typeof filterInitialStateDelete
               ],
         }));
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
            {operator?.integrationType === IntegrationType.ALIEN_STANDALONE && (
               <>
                  <TextField
                     label="Telegram ID"
                     type="search"
                     value={filtersInput.telegramId}
                     fullWidth
                     onChange={(e) => {
                        setFiltersInput((prev) => ({
                           ...prev,
                           telegramId: e.target.value,
                        }));
                     }}
                     autoComplete="off"
                  />
                  <TextField
                     label="Email"
                     type="search"
                     value={filtersInput.emailAddress}
                     fullWidth
                     onChange={(e) => {
                        setFiltersInput((prev) => ({
                           ...prev,
                           emailAddress: e.target.value,
                        }));
                     }}
                     autoComplete="off"
                  />
               </>
            )}
            <FormControl
               sx={{
                  width: '100%',
               }}
            >
               <InputLabel id="demo-simple-select-disabled-label">
                  Blocked Status
               </InputLabel>
               <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label=" Blocked Status"
                  sx={{
                     width: '100%',
                  }}
                  value={filtersInput.isBlocked}
                  name="Blocked"
                  onChange={(e) => {
                     setFiltersInput((prev) => ({
                        ...prev,
                        isBlocked: e.target.value,
                     }));
                  }}
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
                        Blocked
                     </Stack>
                  </MenuItem>
                  <MenuItem value={'false'}>
                     <Stack
                        direction="row"
                        alignItems="center"
                        gap={2}
                        textTransform="capitalize"
                     >
                        Unblocked
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
                  Test Status
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
                  Has Deposit
               </InputLabel>
               <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Test Status "
                  sx={{
                     width: '100%',
                  }}
                  value={filtersInput.hasDeposit}
                  name="hasDeposit"
                  onChange={(e) => {
                     setFiltersInput((prev) => ({
                        ...prev,
                        hasDeposit: e.target.value,
                     }));
                  }}
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
                        Deposit
                     </Stack>
                  </MenuItem>
                  <MenuItem value={'false'}>
                     <Stack
                        direction="row"
                        alignItems="center"
                        gap={2}
                        textTransform="capitalize"
                     >
                        No deposit
                     </Stack>
                  </MenuItem>
               </Select>
            </FormControl>
            <DateTimePicker
               ampm={false}
               sx={{
                  width: '100%',
               }}
               slots={{
                  openPickerIcon: () => (
                     <FontAwesomeIcon icon={faCalendar as IconProp} />
                  ),
               }}
               viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
               }}
               label="Registered From"
               format="yyyy-MM-dd HH:mm:ss"
               value={
                  filtersInput.registeredAtFrom > 0
                     ? new Date(
                          moment(filtersInput.registeredAtFrom)
                             .tz(timezone)
                             .format('YYYY-MM-DD HH:mm:ss')
                       )
                     : new Date(
                          moment('2022-01-01T00:00:00Z')
                             .tz(timezone)
                             .startOf('year')
                             .format('YYYY-MM-DD HH:mm:ss')
                       )
               }
               onChange={(newValue) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     registeredAtFrom:
                        moment(newValue).utc().unix() * 1000 +
                        crashConfig.timezoneOffset * 60 * 1000 -
                        timedifference * 60 * 1000,
                  }));
               }}
               className="custom-icon-datetime-picker"
            />
            <DateTimePicker
               ampm={false}
               sx={{
                  width: '100%',
               }}
               slots={{
                  openPickerIcon: () => (
                     <FontAwesomeIcon icon={faCalendar as IconProp} />
                  ),
               }}
               viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
               }}
               label="Registered To"
               format="yyyy-MM-dd HH:mm:ss"
               value={
                  filtersInput.registeredAtTo > 0
                     ? new Date(
                          moment(filtersInput.registeredAtTo)
                             .tz(timezone)
                             .format('YYYY-MM-DD HH:mm:ss')
                       )
                     : new Date(
                          moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss')
                       )
               }
               onChange={(newValue) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     registeredAtTo:
                        moment(newValue).utc().unix() * 1000 +
                        crashConfig.timezoneOffset * 60 * 1000 -
                        timedifference * 60 * 1000,
                  }));
               }}
               className="custom-icon-datetime-picker"
            />
         </MoreFiltersButton>
      );
   };

   useEffect(() => {
      if (!ignore) {
         store.dispatch(saveLoadingPlayersList(true));
         store.dispatch(savePlayersList([]));
         setTimeout(() => {
            setIgnore(true);
         }, 500);
      }
   });

   useEffect(() => {
      if (brandId && brandId !== 'All Brands') {
         setFiltersInput((prev) => ({
            ...prev,
            brandId: brandId,
         }));
      } else {
         setFiltersInput((prev) => ({
            ...prev,
            brandId: '',
         }));
      }
      setFilters(filtersInput);
   }, [brandId]);

   useEffect(() => {
      setFilterChips([
         { key: 0, label: 'Player ID', value: filters.playerId },
         { key: 3, label: 'Nickname', value: filters.nickname },
         // { key: 2, label: 'Brand Id', value: filters.brandId },
         { key: 2, label: 'Brand Name', value: filters.brandName },
         { key: 4, label: 'Is Blocked', value: filters.isBlocked },
         { key: 5, label: 'Is Test', value: filters.isTest },
         { key: 6, label: 'Telegram Id', value: filters.telegramId },
         { key: 7, label: 'Email', value: filters.emailAddress },
         { key: 8, label: 'Is Fun', value: filters.isFun },
         { key: 9, label: 'Has Deposit', value: filters.hasDeposit },
         {
            key: 10,
            label: 'Registered From',
            value:
               filters.registeredAtFrom > 0
                  ? moment(filters.registeredAtFrom)
                       .tz(timezone)
                       .format('YYYY-MM-DD HH:mm:ss')
                  : '',
         },
         {
            key: 11,
            label: 'Registered To',
            value:
               filters.registeredAtTo > 0
                  ? moment(filters.registeredAtTo)
                       .tz(timezone)
                       .format('YYYY-MM-DD HH:mm:ss')
                  : '',
         },
         { key: 12, label: 'Version', value: filters.version },
      ]);
      setFiltersInput(filters);
   }, [filters]);

   return (
      <React.Fragment>
         <Helmet title="iMoon | Players" />
         {isDesktop ? (
            <>
               <CustomOperatorsBrandsToolbar
                  title={'Player List'}
                  filter={true}
                  background={theme.palette.secondary.dark}
                  handleFilter={moreFiltersBtn}
               />
               <HeaderFilterToolbar
                  filterChips={filterChips}
                  handleDeleteChip={handleDeleteChip}
                  actions={
                     <>
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
                        {operator?.integrationType ===
                        IntegrationType.ALIEN_STANDALONE ? (
                           <Grid item mt={0}>
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       value="pendingVerification"
                                       color="primary"
                                       onChange={
                                          handleChangePendingVerification
                                       }
                                    />
                                 }
                                 label="Players with pending verification"
                              />
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
                  brandFilter={true}
                  operatorFilter={true}
               />
               <CustomOperatorsBrandsToolbar
                  title={`Player list`}
                  filter={true}
                  handleFilter={moreFiltersBtn}
                  background={theme.palette.secondary.dark}
                  sx={{
                     mb:
                        filterChips.filter(
                           (chip) => chip.value && chip.value !== 'all'
                        ).length === 0
                           ? '8px'
                           : '0px',
                  }}
                  actions={
                     <Grid item>
                        <Button
                           onClick={() => setRefresh(refresh + 1)}
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
                  }
               />
               {operator?.integrationType ===
                  IntegrationType.ALIEN_STANDALONE && (
                  <HeaderTitleToolbar
                     actions={
                        <>
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
                           <Grid item mt={0}>
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       value="pendingVerification"
                                       color="primary"
                                       onChange={
                                          handleChangePendingVerification
                                       }
                                    />
                                 }
                                 label="Players with pending verification"
                              />
                           </Grid>
                        </>
                     }
                  />
               )}
               {filterChips.filter((chip) => chip.value && chip.value !== 'all')
                  .length > 0 && (
                  <HeaderTitleToolbar
                     filterChips={filterChips}
                     handleDeleteChip={handleDeleteChip}
                  />
               )}
            </>
         )}
         {ignore ? (
            <AllPlayers
               playerId={filters.playerId}
               brandId={filters.brandId}
               nickname={filters.nickname}
               brandName={filters.brandName}
               isBlocked={filters.isBlocked}
               isTest={filters.isTest}
               isFun={filters.isFun}
               emailAddress={filters.emailAddress}
               telegramId={filters.telegramId}
               onlyWithPendingVerification={pendingVerification}
               hasDeposit={filters.hasDeposit}
               registeredAtFrom={filters.registeredAtFrom}
               registeredAtTo={filters.registeredAtTo}
               refresh={refresh}
               version={filters.version}
            />
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   );
}

Players.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Players List">{page}</DashboardLayout>;
};

export default Players;
