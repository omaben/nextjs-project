import CustomLoader from '@/components/custom/CustomLoader'
import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar'
import HeaderToolbar from '@/components/custom/HeaderToolbar'
import MoreFiltersButton from '@/components/custom/MoreFiltersButton'
import { FilterChip } from '@/components/custom/PortalFilterChips'
import TransitionSlide from '@/components/custom/TransitionSlide'
import DateToolbar from '@/components/custom/customDateToolbar'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import PlayerActivities from '@/components/data/activities/player-activities-grid'
import { PlayerActivityType } from '@alienbackoffice/back-front'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faArrowsRotate } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Button,
   Chip,
   FormControl,
   Grid,
   InputLabel,
   MenuItem,
   Select,
   Stack,
   TextField,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { darkPurple } from 'colors'
import moment from 'moment'
import router from 'next/router'
import React, { ReactElement, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { savePlayerActivitiesList } from 'redux/authSlice'
import { saveLoadingPlayerActivites } from 'redux/loadingSlice'
import { getCrashConfig } from 'redux/slices/crashConfig'
import { store } from 'redux/store'
import {
   getDefaultEndDate,
   getDefaultStartDate,
} from 'services/globalFunctions'
import DashboardLayout from '../../layouts/Dashboard'
import { IconAngleDown } from '@/components/icons'

const filterInitialState = {
   playerId: '',
   activityType: 'all',
}
const timedifference = new Date().getTimezoneOffset()
function Activities() {
   const query: {
      from?: number
      to?: number
   } = router.query
   const theme = useTheme()
   const [openFilter, setOpenFilter] = React.useState(false)
   const [ignore, setIgnore] = React.useState(false)
   const BadgeRole = styled(Chip)`
      height: 20px;
      background: ${(props) => props.theme.sidebar.badge.background};
      z-index: 1;
      span.MuiChip-label,
      span.MuiChip-label:hover {
         font-size: 11px;
         cursor: pointer;
         color: ${(props) => props.theme.sidebar.badge.color};
         padding-left: ${(props) => props.theme.spacing(2)};
         padding-right: ${(props) => props.theme.spacing(2)};
      }
   `
   const [transitionFilter, setTransitionFilter]: any = React.useState()
   const crashConfig = useSelector(getCrashConfig)
   const [startDate, setStartDate]: any = React.useState(
      moment(getDefaultStartDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   )
   const [endDate, setEndDate]: any = React.useState(
      moment(getDefaultEndDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   )
   const [startDateUpdate, setStartDateUpdate]: any = React.useState(
      moment(getDefaultStartDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   )
   const [endDateUpdate, setEndDateUpdate]: any = React.useState(
      moment(getDefaultEndDate()).utc().unix() * 1000 +
         crashConfig.timezoneOffset * 60 * 1000 -
         timedifference * 60 * 1000
   )
   const [filters, setFilters] = React.useState(filterInitialState)
   const [filtersInput, setFiltersInput] = React.useState(filterInitialState)
   const [filterChips, setFilterChips] = React.useState<FilterChip[]>([])
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const [autoRefresh, setAutoRefresh] = React.useState(0)

   const handleDeleteChip = (chipToDelete: FilterChip) => () => {
      setFilterChips((chips) =>
         chips.filter((chip) => chip.key !== chipToDelete.key)
      )

      const getObjectKey = (obj: any, value: string) => {
         return Object.keys(obj).find((key) => obj[key] === value)
      }

      const objKey = getObjectKey(filters, chipToDelete.value)
      objKey &&
         setFilters((prev) => ({
            ...prev,
            [objKey]:
               filterInitialState[objKey as keyof typeof filterInitialState],
         }))
   }

   const handlelogDate = async (
      startDate: Date,
      endDate: Date,
      update: Boolean,
      firstLaunch: Boolean
   ) => {
      setStartDateUpdate(moment(startDate).utc())
      setEndDateUpdate(moment(endDate).utc())
      if (update) {
         router.push(
            `/activities?from=${
               moment(startDate).utc().unix() +
               crashConfig.timezoneOffset * 60 -
               timedifference * 60
            }&to=${
               moment(endDate).utc().unix() +
               crashConfig.timezoneOffset * 60 -
               timedifference * 60
            }`
         )
         setStartDate(
            moment(startDate).utc().unix() * 1000 +
               crashConfig.timezoneOffset * 60 * 1000 -
               timedifference * 60 * 1000
         )
         setEndDate(
            moment(endDate).utc().unix() * 1000 +
               crashConfig.timezoneOffset * 60 * 1000 -
               timedifference * 60 * 1000
         )
      }
   }

   const handleSearchClick = () => {
      setStartDate(
         moment(startDateUpdate).utc().unix() * 1000 +
            crashConfig.timezoneOffset * 60 * 1000 -
            timedifference * 60 * 1000
      )
      setEndDate(
         moment(endDateUpdate).utc().unix() * 1000 +
            crashConfig.timezoneOffset * 60 * 1000 -
            timedifference * 60 * 1000
      )
      setAutoRefresh(autoRefresh + 1)
      router.push(
         `/activities?from=${
            moment(startDateUpdate).utc().unix() +
            crashConfig.timezoneOffset * 60 -
            timedifference * 60
         }&to=${
            moment(endDateUpdate).utc().unix() +
            crashConfig.timezoneOffset * 60 -
            timedifference * 60
         }`
      )
   }

   const handleCloseFilter = () => {
      setOpenFilter(false)
   }

   const handleClickOpenFilter = () => {
      setTransitionFilter(TransitionSlide)
      setOpenFilter(true)
   }

   const handleSearchFilter = () => {
      setFilters(filtersInput)
      handleCloseFilter()
   }

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
                  }))
               }}
               autoComplete="off"
            />
            <FormControl
               sx={{
                  width: '100%',
               }}
            >
               <InputLabel id="demo-simple-select-disabled-label">
                  Activity Type
               </InputLabel>
               <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Activity Type"
                  sx={{
                     width: '100%',
                  }}
                  value={filtersInput.activityType}
                  name="activityType"
                  onChange={(e) => {
                     setFiltersInput((prev) => ({
                        ...prev,
                        activityType: e.target.value,
                     }))
                  }}
                  IconComponent={() => <IconAngleDown className="selectIcon" />}
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

                  {Object.keys(PlayerActivityType).map(
                     (item, index: number) => {
                        return (
                           <MenuItem key={`activity${index}`} value={item}>
                              <Stack
                                 direction="row"
                                 alignItems="center"
                                 gap={2}
                                 textTransform="capitalize"
                              >
                                 {item}
                              </Stack>
                           </MenuItem>
                        )
                     }
                  )}
               </Select>
            </FormControl>
         </MoreFiltersButton>
      )
   }

   useEffect(() => {
      if (!query?.from) {
         router.push(
            `/activities?from=${
               moment(getDefaultStartDate()).utc().unix() +
               crashConfig.timezoneOffset * 60 -
               timedifference * 60
            }&to=${
               moment(getDefaultEndDate()).utc().unix() +
               crashConfig.timezoneOffset * 60 -
               timedifference * 60
            }`
         )
      }
      if (!ignore) {
         store.dispatch(saveLoadingPlayerActivites(true))
         store.dispatch(savePlayerActivitiesList([]))
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   }, [query])

   useEffect(() => {
      setFilterChips([
         { key: 0, label: 'Player ID', value: filters.playerId },
         { key: 4, label: 'Activity Type', value: filters.activityType },
      ])
      setFiltersInput(filters)
   }, [filters])

   return (
      <React.Fragment>
         <Helmet title="iMoon | Player Activity List" />
         {isDesktop ? (
            <>
               <CustomOperatorsBrandsToolbar
                  title={`Player Activity List`}
                  filter={true}
                  handleFilter={moreFiltersBtn}
                  background={theme.palette.secondary.dark}
               />
               <HeaderToolbar
                  isVisibleDate={true}
                  sx={{ px: '8px !important' }}
                  handleSearchClick={handleSearchClick}
                  handleLogDate={handlelogDate}
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
               />
               <DateToolbar
                  autoRefresh={false}
                  handleSearchClick={handleSearchClick}
                  handleLogDate={handlelogDate}
                  filter={true}
                  handleFilter={moreFiltersBtn}
                  from={query?.from}
                  to={query?.to}
               />
               <HeaderTitleToolbar
                  title={`Player Activity List`}
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
                              onClick={() => setAutoRefresh(autoRefresh + 1)}
                           >
                              <FontAwesomeIcon
                                 icon={faArrowsRotate as IconProp}
                                 fixedWidth
                              />
                              Refresh
                           </Button>
                        </Grid>
                        <Grid item>
                           <BadgeRole label={'Coming Soon'} />
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
            <PlayerActivities
               from={startDate}
               to={endDate}
               activityType={filters.activityType}
               playerId={filters.playerId}
               autoRefresh={autoRefresh}
            />
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

Activities.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Player Activity List">{page}</DashboardLayout>
}

export default Activities
