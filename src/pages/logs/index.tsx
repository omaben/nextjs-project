import CustomLoader from '@/components/custom/CustomLoader';
import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar';
import HeaderToolbar from '@/components/custom/HeaderToolbar';
import MoreFiltersButton from '@/components/custom/MoreFiltersButton';
import { FilterChip } from '@/components/custom/PortalFilterChips';
import TransitionSlide from '@/components/custom/TransitionSlide';
import DateToolbar from '@/components/custom/customDateToolbar';
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar';
import WebhookData from '@/components/data/webhooks/webhook-grid';
import WebhookLaunchData from '@/components/data/webhooks/webhook-launch-grid';
import WebhookRegisterData from '@/components/data/webhooks/webhook-register-grid';
import {
   AuthLogMethod,
   AuthLogType,
   IntegrationType,
   Operator,
   UserPermissionEvent,
} from '@alienbackoffice/back-front';
import { LogLevel } from '@alienbackoffice/back-front/lib/lib/enum/log-level.enum';
import { LogWebhookName } from '@alienbackoffice/back-front/lib/lib/enum/log-webhook-name.enum';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown, faArrowsRotate } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
   Box,
   Button,
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
   useTheme,
} from '@mui/material';
import { darkPurple } from 'colors';
import moment from 'moment';
import React, {
   Dispatch,
   ReactElement,
   SetStateAction,
   useEffect,
} from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import {
   saveWebhookList,
   selectAuthCurrentOperator,
   selectAuthOperator,
} from 'redux/authSlice';
import { saveLoadingWebhookList } from 'redux/loadingSlice';
import { getCrashConfig } from 'redux/slices/crashConfig';
import { store } from 'redux/store';
import {
   getDefaultEndDate,
   getDefaultStartDate,
} from 'services/globalFunctions';
import { hasDetailsPermission } from 'services/permissionHandler';
import { LogsTabs } from 'types';
import DashboardLayout from '../../layouts/Dashboard';

interface FilterProps {
   playerId: string;
   webhook: string;
   playerToken: string;
   gameId: string;
   level: string;
   uniqueId: string;
   betId: string;
   authType: string;
   authMethod: string;
   cashierId: string;
}
const filterInitialState = {
   playerId: '',
   webhook: 'all',
   playerToken: '',
   gameId: '',
   level: 'all',
   uniqueId: '',
   betId: '',
   authType: 'all',
   authMethod: 'all',
   cashierId: '',
};
const timedifference = new Date().getTimezoneOffset();

function Logs() {
   const [openFilter, setOpenFilter] = React.useState(false);
   const [refresh, setRefresh] = React.useState(0);
   const [transitionFilter, setTransitionFilter]: React.ReactElement | any =
      React.useState();
   const crashConfig = useSelector(getCrashConfig);
   const [startDate, setStartDate] = React.useState(
      moment(getDefaultStartDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   );
   const [endDate, setEndDate]: [number, Dispatch<SetStateAction<number>>] =
      React.useState(
         moment(getDefaultEndDate()).utc().unix() * 1000 +
            crashConfig.timezoneOffset * 60 * 1000 -
            timedifference * 60 * 1000
      );
   const [startDateUpdate, setStartDateUpdate]: [
      number,
      Dispatch<SetStateAction<number>>
   ] = React.useState(
      moment(getDefaultStartDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   );
   const [endDateUpdate, setEndDateUpdate] = React.useState(
      moment(getDefaultEndDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   );
   const [filters, setFilters] = React.useState(filterInitialState);
   const [filtersInput, setFiltersInput] = React.useState(filterInitialState);
   const [filterChips, setFilterChips] = React.useState<FilterChip[]>([]);
   const [ignore, setIgnore] = React.useState(false);
   const opId = useSelector(selectAuthOperator);
   const operator = useSelector(selectAuthCurrentOperator) as Operator;
   const theme = useTheme();
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const [value, setValue] = React.useState<keyof typeof LogsTabs>(
      operator.integrationType === IntegrationType.ALIEN_STANDALONE
         ? LogsTabs.REGISTER
         : LogsTabs.WEBHOOK
   );

   const handleLogDate = async (
      startDate: Date,
      endDate: Date,
      update: Boolean
   ) => {
      setStartDateUpdate(moment(startDate).utc().valueOf());
      setEndDateUpdate(moment(endDate).utc().valueOf());
      if (update) {
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
               label="Unique ID"
               type="search"
               value={filtersInput.uniqueId}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     uniqueId: e.target.value,
                  }));
               }}
               autoComplete="off"
            />
            {[LogsTabs.WEBHOOK, LogsTabs.REGISTER].includes(
               value as LogsTabs
            ) && (
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
            )}
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
               label="Player Token"
               type="search"
               value={filtersInput.playerToken}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     playerToken: e.target.value,
                  }));
               }}
               autoComplete="off"
            />
            {value === LogsTabs.WEBHOOK && (
               <>
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
                  <FormControl
                     sx={{
                        width: '100%',
                     }}
                  >
                     <InputLabel id="demo-simple-select-disabled-label">
                        Webhook
                     </InputLabel>
                     <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Webhook"
                        fullWidth
                        value={filtersInput.webhook}
                        name="webhook"
                        onChange={(e) => {
                           setFiltersInput((prev) => ({
                              ...prev,
                              webhook: e.target.value,
                           }));
                        }}
                        IconComponent={() => (
                           <FontAwesomeIcon
                              icon={faAngleDown as IconProp}
                              className="selectIcon"
                              size="sm"
                           /> // Use FontAwesome icon as the select icon
                        )}
                     >
                        <MenuItem value={'all'}>
                           <Stack direction="row" alignItems="center" gap={2}>
                              All webhook
                           </Stack>
                        </MenuItem>
                        {Object.keys(LogWebhookName).map(
                           (item, index: number) => {
                              return (
                                 <MenuItem key={`webhook${index}`} value={item}>
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
               </>
            )}
            {[LogsTabs.WEBHOOK, LogsTabs.LAUNCH, LogsTabs.REGISTER].includes(
               value as LogsTabs
            ) && (
               <FormControl
                  sx={{
                     width: '100%',
                  }}
               >
                  <InputLabel id="demo-simple-select-disabled-label">
                     Level
                  </InputLabel>
                  <Select
                     labelId="demo-simple-select-label"
                     id="demo-simple-select"
                     label="Level"
                     sx={{
                        width: '100%',
                     }}
                     value={filtersInput.level}
                     name="level"
                     onChange={(e) => {
                        setFiltersInput((prev) => ({
                           ...prev,
                           level: e.target.value,
                        }));
                     }}
                     IconComponent={() => (
                        <FontAwesomeIcon
                           icon={faAngleDown as IconProp}
                           className="selectIcon"
                           size="sm"
                        /> // Use FontAwesome icon as the select icon
                     )}
                  >
                     <MenuItem value={'all'}>
                        <Stack direction="row" alignItems="center" gap={2}>
                           All level
                        </Stack>
                     </MenuItem>
                     {Object.keys(LogLevel).map((item, index: number) => {
                        return (
                           <MenuItem key={`level${index}`} value={item}>
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
            {value === LogsTabs.REGISTER && (
               <>
                  <FormControl
                     sx={{
                        width: '100%',
                     }}
                  >
                     <InputLabel id="demo-simple-select-disabled-label">
                        AuthType
                     </InputLabel>
                     <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Webhook"
                        fullWidth
                        value={filtersInput.authType}
                        name="authType"
                        onChange={(e) => {
                           setFiltersInput((prev) => ({
                              ...prev,
                              authType: e.target.value,
                           }));
                        }}
                        IconComponent={() => (
                           <FontAwesomeIcon
                              icon={faAngleDown as IconProp}
                              className="selectIcon"
                              size="sm"
                           /> // Use FontAwesome icon as the select icon
                        )}
                     >
                        <MenuItem value={'all'}>
                           <Stack direction="row" alignItems="center" gap={2}>
                              All Auth Type
                           </Stack>
                        </MenuItem>
                        {Object.keys(AuthLogType).map((item, index: number) => {
                           return (
                              <MenuItem key={`webhook${index}`} value={item}>
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
                        AuthMethod
                     </InputLabel>
                     <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Level"
                        sx={{
                           width: '100%',
                        }}
                        value={filtersInput.authMethod}
                        name="authMethod"
                        onChange={(e) => {
                           setFiltersInput((prev) => ({
                              ...prev,
                              authMethod: e.target.value,
                           }));
                        }}
                        IconComponent={() => (
                           <FontAwesomeIcon
                              icon={faAngleDown as IconProp}
                              className="selectIcon"
                              size="sm"
                           /> // Use FontAwesome icon as the select icon
                        )}
                     >
                        <MenuItem value={'all'}>
                           <Stack direction="row" alignItems="center" gap={2}>
                              All Methods
                           </Stack>
                        </MenuItem>
                        {Object.keys(AuthLogMethod).map(
                           (item, index: number) => {
                              return (
                                 <MenuItem key={`level${index}`} value={item}>
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
               </>
            )}
         </MoreFiltersButton>
      );
   };

   const handleDeleteChip = (chipToDelete: FilterChip) => () => {
      setFilterChips((chips) =>
         chips.filter((chip) => chip.key !== chipToDelete.key)
      );

      const getObjectKey = (
         obj: FilterProps,
         value: string,
         keyData: number
      ) => {
         return Object.keys(obj).find(
            (key, index) =>
               obj[key as keyof FilterProps] === value && index === keyData
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
               filterInitialState[objKey as keyof typeof filterInitialState],
         }));
   };

   useEffect(() => {
      setFilterChips([
         { key: 0, label: 'Player ID', value: filters.playerId },
         { key: 1, label: 'Webhook', value: filters.webhook },
         { key: 2, label: 'Player Token', value: filters.playerToken },
         { key: 3, label: 'Game ID', value: filters.gameId },
         { key: 4, label: 'Level', value: filters.level },
         { key: 5, label: 'Unique Id', value: filters.uniqueId },
         { key: 6, label: 'bet Id', value: filters.betId },
         { key: 7, label: 'Auth Type', value: filters.authType },
         { key: 8, label: 'Auth Method', value: filters.authMethod },
         { key: 9, label: 'Cashier ID', value: filters.cashierId },
      ]);
      setFiltersInput(filters);
   }, [filters]);

   useEffect(() => {
      if (!ignore) {
         store.dispatch(saveLoadingWebhookList(true));
         store.dispatch(saveWebhookList([]));
         setTimeout(() => {
            setIgnore(true);
         }, 500);
      }
   });

   useEffect(() => {
      if (
         operator.integrationType !== IntegrationType.ALIEN_STANDALONE &&
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_WEBHOOK_LOG_LIST_REQ
         )
      ) {
         setValue(LogsTabs.WEBHOOK);
      } else if (
         operator.integrationType === IntegrationType.ALIEN_STANDALONE &&
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_AUTH_LOG_LIST_REQ
         )
      ) {
         setValue(LogsTabs.REGISTER);
      } else if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_LAUNCH_LOG_LIST_REQ
         )
      ) {
         setValue(LogsTabs.LAUNCH);
      }
      setFiltersInput(filterInitialState);
      setFilters(filterInitialState);
   }, [opId]);

   const handleChangeTabs = (
      event: React.SyntheticEvent,
      newValue: LogsTabs
   ) => {
      event.preventDefault();
      setFiltersInput(filterInitialState);
      setFilters(filterInitialState);
      setValue(newValue);
   };
   return (
      <React.Fragment>
         <Helmet title="iMoon | Logs" />
         {isDesktop ? (
            <>
               <CustomOperatorsBrandsToolbar
                  title={`Logs List`}
                  filter={true}
                  handleFilter={moreFiltersBtn}
                  background={theme.palette.secondary.dark}
               />
               <HeaderToolbar
                  title={''}
                  isVisibleDate={true}
                  handleSearchClick={handleSearchClick}
                  handleLogDate={handleLogDate}
                  sx={{ px: '8px !important' }}
                  actions={
                     <Box
                        sx={{
                           position: 'relative',
                           top: '4px',
                        }}
                     >
                        <TabContext value={value}>
                           <TabList
                              className="detail_tabs"
                              onChange={handleChangeTabs}
                              variant="scrollable"
                              sx={{
                                 mb: '6px',
                                 pl: isDesktop ? '12px' : '6px',
                                 pt: isDesktop ? 0 : '6px',
                                 justifyContent: 'left',
                              }}
                              scrollButtons={true}
                           >
                              {operator.integrationType !==
                                 IntegrationType.ALIEN_STANDALONE &&
                                 hasDetailsPermission(
                                    UserPermissionEvent.BACKOFFICE_GET_WEBHOOK_LOG_LIST_REQ
                                 ) && (
                                    <Tab
                                       label={
                                          <Typography
                                             variant="bodySmallBold"
                                             component="span"
                                          >
                                             Webhook Logs
                                          </Typography>
                                       }
                                       value={LogsTabs.WEBHOOK}
                                    />
                                 )}

                              {operator.integrationType ===
                                 IntegrationType.ALIEN_STANDALONE &&
                                 hasDetailsPermission(
                                    UserPermissionEvent.BACKOFFICE_GET_AUTH_LOG_LIST_REQ
                                 ) && (
                                    <Tab
                                       label={
                                          <Typography
                                             variant="bodySmallBold"
                                             component="span"
                                          >
                                             Register/Login Logs
                                          </Typography>
                                       }
                                       value={LogsTabs.REGISTER}
                                    />
                                 )}
                              {hasDetailsPermission(
                                 UserPermissionEvent.BACKOFFICE_GET_LAUNCH_LOG_LIST_REQ
                              ) && (
                                 <Tab
                                    label={
                                       <Typography
                                          variant="bodySmallBold"
                                          component="span"
                                       >
                                          Launch Logs
                                       </Typography>
                                    }
                                    value={LogsTabs.LAUNCH}
                                 />
                              )}
                           </TabList>
                        </TabContext>
                     </Box>
                  }
               />
            </>
         ) : (
            <>
               <CustomOperatorsBrandsToolbar
                  brandFilter={true}
                  operatorFilter={true}
                  title={'Logs List'}
               />
               <DateToolbar
                  autoRefresh={false}
                  handleSearchClick={handleSearchClick}
                  handleLogDate={handleLogDate}
                  filter={true}
                  handleFilter={moreFiltersBtn}
               />
               <HeaderTitleToolbar
                  title={`Logs List`}
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

         {ignore ? (
            <TabContext value={value}>
               {!isDesktop && (
                  <TabList
                     className="detail_tabs"
                     onChange={handleChangeTabs}
                     variant="scrollable"
                     sx={{
                        mb: '6px',
                        pl: isDesktop ? '12px' : '6px',
                        pt: isDesktop ? 0 : '6px',
                        justifyContent: 'left',
                     }}
                     scrollButtons={true}
                  >
                     {operator.integrationType !==
                        IntegrationType.ALIEN_STANDALONE &&
                        hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_WEBHOOK_LOG_LIST_REQ
                        ) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Webhook Logs
                                 </Typography>
                              }
                              value={LogsTabs.WEBHOOK}
                           />
                        )}

                     {operator.integrationType ===
                        IntegrationType.ALIEN_STANDALONE &&
                        hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_AUTH_LOG_LIST_REQ
                        ) && (
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    Register/Login Logs
                                 </Typography>
                              }
                              value={LogsTabs.REGISTER}
                           />
                        )}
                     {hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_GET_LAUNCH_LOG_LIST_REQ
                     ) && (
                        <Tab
                           label={
                              <Typography
                                 variant="bodySmallBold"
                                 component="span"
                              >
                                 Launch Logs
                              </Typography>
                           }
                           value={LogsTabs.LAUNCH}
                        />
                     )}
                  </TabList>
               )}
               {operator.integrationType !== IntegrationType.ALIEN_STANDALONE &&
                  hasDetailsPermission(
                     UserPermissionEvent.BACKOFFICE_GET_WEBHOOK_LOG_LIST_REQ
                  ) && (
                     <TabPanel
                        value={LogsTabs.WEBHOOK}
                        sx={{
                           padding: '8px 0px',
                           // height: PageWithdetails3Toolbar,
                           overflow: 'auto',
                        }}
                     >
                        <WebhookData
                           from={startDate}
                           to={endDate}
                           opId={opId}
                           betId={filters.betId}
                           playerId={filters.playerId}
                           webhook={filters.webhook as LogWebhookName | 'all'}
                           gameId={filters.gameId}
                           uniqueId={filters.uniqueId}
                           level={filters.level as LogLevel | 'all'}
                           playerToken={filters.playerToken}
                           refresh={refresh}
                           cashierId={filters.cashierId}
                        />
                     </TabPanel>
                  )}

               {operator.integrationType === IntegrationType.ALIEN_STANDALONE &&
                  hasDetailsPermission(
                     UserPermissionEvent.BACKOFFICE_GET_AUTH_LOG_LIST_REQ
                  ) && (
                     <TabPanel
                        value={LogsTabs.REGISTER}
                        sx={{
                           padding: '8px 0px',
                           // height: PageWithdetails3Toolbar,
                           overflow: 'auto',
                        }}
                     >
                        <WebhookRegisterData
                           from={startDate}
                           to={endDate}
                           opId={opId}
                           betId={filters.betId}
                           playerId={filters.playerId}
                           authMethod={
                              filters.authMethod as AuthLogMethod | 'all'
                           }
                           gameId={filters.gameId}
                           uniqueId={filters.uniqueId}
                           authType={filters.authType as AuthLogType | 'all'}
                           playerToken={filters.playerToken}
                           level={filters.level as LogLevel | 'all'}
                           refresh={refresh}
                        />
                     </TabPanel>
                  )}
               {hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_GET_LAUNCH_LOG_LIST_REQ
               ) && (
                  <TabPanel
                     value={LogsTabs.LAUNCH}
                     sx={{
                        padding: '8px 0px',
                        // height: PageWithdetails3Toolbar,
                        overflow: 'auto',
                     }}
                  >
                     <WebhookLaunchData
                        from={startDate}
                        to={endDate}
                        opId={opId}
                        betId={filters.betId}
                        playerId={filters.playerId}
                        gameId={filters.gameId}
                        uniqueId={filters.uniqueId}
                        playerToken={filters.playerToken}
                        level={filters.level as LogLevel | 'all'}
                        refresh={refresh}
                     />
                  </TabPanel>
               )}
            </TabContext>
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   );
}

// Define the layout for the Webhooks page
Logs.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Logs List">{page}</DashboardLayout>;
};

export default Logs;
