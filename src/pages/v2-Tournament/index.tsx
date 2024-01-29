import CustomLoader from '@/components/custom/CustomLoader';
import HeaderFilterToolbar from '@/components/custom/HeaderFilterToolbar';
import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar';
import MoreFiltersButton from '@/components/custom/MoreFiltersButton';
import { FilterChip } from '@/components/custom/PortalFilterChips';
import TransitionSlide from '@/components/custom/TransitionSlide';
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar';
import AllTournamentV2IdsList from '@/components/data/tournament/tournament-v2-ids-list-grid';
import AllTournamentV2List from '@/components/data/tournament/tournamentV2-list-grid';
import {
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front';
import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAdd, faArrowsRotate } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   Grid,
   Button as MuiButton,
   Tab,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import { spacing } from '@mui/system';
import { darkPurple } from 'colors';
import router from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import {
   saveTournament,
   selectAuthAllOperatorGamesWithTournament,
   selectAuthUser,
} from 'redux/authSlice';
import { saveLoadingTournament } from 'redux/loadingSlice';
import { store } from 'redux/store';
import { hasDetailsPermission } from 'services/permissionHandler';
import DashboardLayout from '../../layouts/Dashboard';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { PageWithdetails3Toolbar } from 'services/globalFunctions';
import { v4 as uuidv4 } from 'uuid';
import { selectBoClient } from 'redux/socketSlice';
import CustomRowReport from '@/components/data/tournament/customRowReport';

const Button = styled(MuiButton)(spacing);
const filterInitialState = {
   currencies: '',
   title: '',
   tournamentId: '',
   gameId: '',
};
interface MappedData {
   opId: string;
   gameIds: string[];
}
function TournamentV2List() {
   const theme = useTheme();
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const [openFilter, setOpenFilter] = React.useState(false);
   const [transitionFilter, setTransitionFilter]: any = React.useState();
   const [filters, setFilters] = React.useState(filterInitialState);
   const [filtersInput, setFiltersInput] = React.useState(filterInitialState);
   const [filterChips, setFilterChips] = React.useState<FilterChip[]>([]);
   const user = useSelector(selectAuthUser) as User;
   const [autoRefresh, setAutoRefresh] = React.useState(0);
   const [ignore, setIgnore] = React.useState(false);
   const [boxRefrech, setBoxRefrech] = React.useState(0);
   const [value, setValue]: any = React.useState('list');
   const boClient = useSelector(selectBoClient);
   const [dataAllOperatorGames, setDataAllOperatorGames] = React.useState<
      MappedData[]
   >([]);
   const dataAllOperatorGamesWithTournament = useSelector(
      selectAuthAllOperatorGamesWithTournament
   ) as {
      opId: string;
      gameId: string;
      statsFileUrl: string;
      tournamentId: string;
   }[];
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
               label="Tournament ID"
               type="text"
               value={filtersInput.tournamentId}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     tournamentId: e.target.value,
                  }));
               }}
               autoComplete="off"
            />
            <TextField
               label="Title"
               type="text"
               value={filtersInput.title}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     title: e.target.value,
                  }));
               }}
               autoComplete="off"
            />
            <TextField
               label="Game ID"
               type="text"
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
         </MoreFiltersButton>
      );
   };
   const handleChangeTabs = (event: React.SyntheticEvent, newValue: string) => {
      event.preventDefault();
      if (newValue === 'reports') {
         if (
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GET_ALL_OPERATOR_GAMES_WITH_TOURNAMENT_REQ
            )
         ) {
            boClient?.tournamentV2.getAllOperatorGamesWithTournament(
               {},
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     type: 'all',
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GET_ALL_OPERATOR_GAMES_WITH_TOURNAMENT_REQ,
                  },
               }
            );
         }
      }
      setValue(newValue);
   };

   useEffect(() => {
      if (!ignore) {
         store.dispatch(saveLoadingTournament(true));
         store.dispatch(saveTournament({}));
         setTimeout(() => {
            setIgnore(true);
         }, 500);
      }
   });

   useEffect(() => {
      setFilterChips([
         { key: 1, label: 'Currency', value: filters.currencies },
         { key: 2, label: 'Title', value: filters.title },
         { key: 3, label: 'Game ID', value: filters.gameId },
         { key: 4, label: 'Tournament Id', value: filters.tournamentId },
      ]);
      setFiltersInput(filters);
   }, [filters]);

   React.useEffect(() => {
      const result: Record<string, MappedData> = {};

      for (const entry of dataAllOperatorGamesWithTournament) {
         const { opId, gameId } = entry;

         if (!result[opId]) {
            result[opId] = { opId, gameIds: [] };
         }

         if (!result[opId].gameIds.includes(gameId)) {
            result[opId].gameIds.push(gameId);
         }
      }
      setDataAllOperatorGames(
         result ? (Object.values(result) as MappedData[]) : []
      );
   }, [dataAllOperatorGamesWithTournament]);
   return (
      <React.Fragment>
         <Helmet title="iMoon | Tournament List" />
         {isDesktop ? (
            <CustomOperatorsBrandsToolbar
               title={'Tournament V2 List'}
               filter={
                  [UserScope.OPERATOR, UserScope.BRAND].includes(user?.scope)
                     ? false
                     : true
               }
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
                     {hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_ADD_TOURNAMENT_REQ
                     ) &&
                        [UserScope.SUPERADMIN, UserScope.ADMIN].includes(
                           user?.scope
                        ) && (
                           <Grid item>
                              <Button
                                 onClick={() =>
                                    router.push(`/v2-Tournament/details`)
                                 }
                                 color="info"
                                 variant="contained"
                                 sx={{
                                    fontSize: 12,
                                    fontFamily: 'Nunito Sans SemiBold',
                                    borderRadius: '8px',
                                    p: '4px',
                                    px: '8px',
                                    '&:hover': {
                                       background: '#8098F9',
                                    },
                                    padding: '4px 8px',
                                    letterSpacing: '0.48px',
                                    gap: '2px',
                                    height: '28px',
                                 }}
                              >
                                 {' '}
                                 <FontAwesomeIcon
                                    icon={faAdd as IconProp}
                                    fixedWidth
                                    fontSize={12}
                                    height={'initial'}
                                    width={'12px'}
                                 />{' '}
                                 New Tournament
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
                              borderRadius: '8px',
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
         ) : (
            <>
               <CustomOperatorsBrandsToolbar
                  title={'Tournament V2 List'}
                  filter={
                     [UserScope.OPERATOR, UserScope.BRAND].includes(user?.scope)
                        ? false
                        : true
                  }
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
                        {hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_ADD_TOURNAMENT_REQ
                        ) && (
                           <Grid item>
                              <Button
                                 onClick={() =>
                                    router.push(`/v2-Tournament/details`)
                                 }
                                 color="info"
                                 variant="contained"
                                 sx={{
                                    fontSize: 12,
                                    fontFamily: 'Nunito Sans SemiBold',
                                    borderRadius: '8px',
                                    p: '4px',
                                    px: '8px',
                                    '&:hover': {
                                       background: '#8098F9',
                                    },
                                    padding: '4px 8px',
                                    letterSpacing: '0.48px',
                                    gap: '2px',
                                    height: '28px',
                                 }}
                              >
                                 {' '}
                                 <FontAwesomeIcon
                                    icon={faAdd as IconProp}
                                    fixedWidth
                                    fontSize={12}
                                    height={'initial'}
                                    width={'12px'}
                                 />{' '}
                                 New Tournament
                              </Button>
                           </Grid>
                        )}
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
            [UserScope.OPERATOR, UserScope.BRAND].includes(user?.scope) ? (
               <AllTournamentV2IdsList
                  key={boxRefrech}
                  autoRefresh={autoRefresh}
               />
            ) : (
               <Grid
                  container
                  alignItems="center"
                  p={2}
                  px={isDesktop ? '12px' : '4px'}
                  spacing={2}
                  sx={{
                     background: isDesktop ? 'initial' : darkPurple[4],
                  }}
               >
                  <Grid item xs={12} px={0}>
                     <TabContext value={value}>
                        <TabList
                           className="detail_tabs"
                           onChange={handleChangeTabs}
                           variant="scrollable"
                           sx={{
                              mb: '6px',
                              pt: isDesktop ? 0 : '6px',
                              justifyContent: isDesktop ? 'left' : 'center',
                           }}
                           scrollButtons={true}
                        >
                           <Tab
                              label={
                                 <Typography
                                    variant="bodySmallBold"
                                    component="span"
                                 >
                                    List
                                 </Typography>
                              }
                              value={'list'}
                           />
                           {hasDetailsPermission(
                              UserPermissionEvent.BACKOFFICE_GET_ALL_OPERATOR_GAMES_WITH_TOURNAMENT_REQ
                           ) && (
                              <Tab
                                 label={
                                    <Typography
                                       variant="bodySmallBold"
                                       component="span"
                                    >
                                       Operators
                                    </Typography>
                                 }
                                 value={'reports'}
                              />
                           )}
                        </TabList>
                        <TabPanel
                           value={'list'}
                           sx={{
                              padding: '8px 0px',
                              height: PageWithdetails3Toolbar,
                              '.dataGridWrapper': {
                                 padding: '0px !important',
                                 width: isDesktop
                                    ? 'calc(100vw - 240px)'
                                    : '100%',
                                 height: isDesktop
                                    ? PageWithdetails3Toolbar
                                    : PageWithdetails3Toolbar,
                              },
                           }}
                        >
                           <AllTournamentV2List
                              key={boxRefrech}
                              title={filters.title}
                              currency={filters.currencies}
                              tournamentId={filters.tournamentId}
                              gameId={filters.gameId}
                              autoRefresh={autoRefresh}
                           />
                        </TabPanel>
                        <TabPanel
                           value={'reports'}
                           sx={{
                              height: PageWithdetails3Toolbar,
                              pt: '6px !important',
                              overflow: 'auto',
                           }}
                        >
                           <Grid
                              container
                              direction="row"
                              alignItems="center"
                              mb={2}
                              spacing={0}
                           >
                              <Table
                                 sx={{
                                    '.MuiTableBody-root .MuiTableRow-root>th': {
                                       padding: '5px',
                                    },
                                    'tr th,tr td': {
                                       borderRadius: '0 !important',
                                       borderBottomLeftRadius: '0 !important',
                                    },

                                    '.topHead tr th:first-child': {
                                       borderTopLeftRadius: '8px !important',
                                    },
                                    '.topHead tr th:last-child': {
                                       borderTopRightRadius: '8px !important',
                                    },
                                 }}
                              >
                                 <TableHead className="topHead">
                                    <TableRow>
                                       {[
                                          UserScope.SUPERADMIN,
                                          UserScope.ADMIN,
                                       ].includes(user?.scope) && (
                                          <TableCell
                                             component="th"
                                             scope="row"
                                             sx={{
                                                textAlign: 'left !important',
                                             }}
                                          >
                                             Operator
                                          </TableCell>
                                       )}
                                       <TableCell
                                          component="th"
                                          scope="row"
                                          sx={{
                                             textAlign: 'left !important',
                                          }}
                                       >
                                          Game ID
                                       </TableCell>
                                    </TableRow>
                                 </TableHead>
                                 <TableBody>
                                    {dataAllOperatorGames &&
                                       dataAllOperatorGames.length > 0 &&
                                       dataAllOperatorGames?.map(
                                          (item: MappedData, index: number) => (
                                             <CustomRowReport
                                                key={`${item.opId}`}
                                                row={{ ...item, index: index }}
                                             />
                                          )
                                       )}
                                 </TableBody>
                              </Table>
                           </Grid>
                        </TabPanel>
                     </TabContext>
                  </Grid>
               </Grid>
            )
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   );
}

TournamentV2List.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Tournament List">{page}</DashboardLayout>;
};

export default TournamentV2List;
