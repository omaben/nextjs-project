import CustomLoader from '@/components/custom/CustomLoader'
import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar'
import HeaderToolbar from '@/components/custom/HeaderToolbar'
import MoreFiltersButton from '@/components/custom/MoreFiltersButton'
import { FilterChip } from '@/components/custom/PortalFilterChips'
import TransitionSlide from '@/components/custom/TransitionSlide'
import DateToolbar from '@/components/custom/customDateToolbar'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import UserActivities from '@/components/data/user-activities/user-activities-grid'
import { UserActivityType } from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faArrowsRotate } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
} from '@mui/material'
import { darkPurple } from 'colors'
import moment from 'moment'
import router from 'next/router'
import React, { ReactElement, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { saveUserActivitiesList } from 'redux/authSlice'
import { saveLoadingUserAcitivites } from 'redux/loadingSlice'
import { getCrashConfig } from 'redux/slices/crashConfig'
import { store } from 'redux/store'
import {
   getDefaultEndDate,
   getDefaultStartDate,
} from 'services/globalFunctions'
import DashboardLayout from '../../layouts/Dashboard'

const filterInitialState = {
   username: '',
   activityType: 'all',
}
const timedifference = new Date().getTimezoneOffset()

function UserActivitiesList() {
   const query: {
      from?: number
      to?: number
   } = router.query
   const theme = useTheme()
   const [openFilter, setOpenFilter] = React.useState(false)
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
   const [ignore, setIgnore] = React.useState(false)
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
            `/user-activities?from=${
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
         `/user-activities?from=${
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
               label="Username"
               type="search"
               value={filtersInput.username}
               fullWidth
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     username: e.target.value,
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
                  {Object.keys(UserActivityType).map((item, index: number) => {
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
                  })}
               </Select>
            </FormControl>
         </MoreFiltersButton>
      )
   }

   useEffect(() => {
      setFilterChips([
         { key: 0, label: 'Username', value: filters.username },
         { key: 4, label: 'Activity Type', value: filters.activityType },
      ])
      setFiltersInput(filters)
   }, [filters])

   useEffect(() => {
      if (!query?.from) {
         router.push(
            `/user-activities?from=${
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
         store.dispatch(saveLoadingUserAcitivites(true))
         store.dispatch(saveUserActivitiesList([]))
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   }, [query])

   return (
      <React.Fragment>
         <Helmet title="iMoon | User Activity List" />
         {isDesktop ? (
            <>
               <CustomOperatorsBrandsToolbar
                  title={`User Activity List`}
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
                  title={`User Activity List`}
                  actions={
                     <Grid item>
                        <Button
                           onClick={() => setAutoRefresh(autoRefresh + 1)}
                           color="primary"
                           variant={'text'}
                           sx={{
                              p: 0,
                              ml: '5px',
                              height: '28px',
                              justifyContent: 'end',
                              minWidth: 'auto !important',
                              borderColor: `${darkPurple[12]} !important`,
                              svg: {
                                 width: '16px !important',
                              },
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
                  from={query?.from}
                  to={query?.to}
                  filter={true}
                  handleFilter={moreFiltersBtn}
                  sx={{
                     mb:
                        filterChips.filter(
                           (chip) => chip.value && chip.value !== 'all'
                        ).length > 0
                           ? 0
                           : '6px',
                  }}
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
            <UserActivities
               from={startDate}
               to={endDate}
               activityType={filters.activityType}
               username={filters.username}
               autoRefresh={autoRefresh}
            />
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

UserActivitiesList.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="User Activity List">{page}</DashboardLayout>
}

export default UserActivitiesList
