import CustomLoader from '@/components/custom/CustomLoader'
import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar'
import MoreFiltersButton from '@/components/custom/MoreFiltersButton'
import { FilterChip } from '@/components/custom/PortalFilterChips'
import TransitionSlide from '@/components/custom/TransitionSlide'
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar'
import AllGames from '@/components/data/games/games-grid'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faArrowsRotate } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Button,
   Grid,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { darkPurple } from 'colors'
import type { ReactElement } from 'react'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { saveGamesList } from 'redux/authSlice'
import { saveLoadingGamesList } from 'redux/loadingSlice'
import { store } from 'redux/store'
import DashboardLayout from '../../layouts/Dashboard'

function Games() {
   const theme = useTheme()
   const [Transition, setTransition]: any = React.useState()
   const [openFilter, setOpenFilter] = React.useState(false)
   const [keyDateFilter, setKeyDateFilter] = React.useState(0)
   const [transitionFilter, setTransitionFilter]: any = React.useState()
   const filterInitialState = {
      gameId: '',
      title: '',
   }
   const [filters, setFilters] = React.useState(filterInitialState)
   const [filtersInput, setFiltersInput] = React.useState(filterInitialState)
   const [filterChips, setFilterChips] = React.useState<FilterChip[]>([])
   const [ignore, setIgnore] = React.useState(false)
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const [autoRefresh, setAutoRefresh] = React.useState(0)

   const handleCloseFilter = async () => {
      setKeyDateFilter(keyDateFilter + 1)
      await setTransition(TransitionSlide)
      setOpenFilter(false)
   }

   const handleClickOpenFilter = (value: any) => {
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
               name="gameId"
               label="Game Id"
               onChange={(e) => {
                  setFiltersInput((prev) => ({
                     ...prev,
                     gameId: e.target.value,
                  }))
               }}
               value={filtersInput.gameId}
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
                  }))
               }}
               value={filtersInput.title}
               fullWidth
               variant="outlined"
            />
         </MoreFiltersButton>
      )
   }

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

   useEffect(() => {
      setFilterChips([
         { key: 0, label: 'Game ID', value: filters.gameId },
         { key: 1, label: 'Title', value: filters.title },
      ])
      setFiltersInput(filters)
   }, [filters])

   useEffect(() => {
      if (!ignore) {
         store.dispatch(saveLoadingGamesList(true))
         store.dispatch(saveGamesList([]))
         setTimeout(() => {
            setIgnore(true)
         }, 500)
      }
   })

   return (
      <React.Fragment>
         <Helmet title="Game List" />
         <CustomOperatorsBrandsToolbar
            title={`Game List`}
            filter={true}
            handleFilter={moreFiltersBtn}
            background={theme.palette.secondary.dark}
            sx={{
               mb:
                  isDesktop &&
                  filterChips.filter(
                     (chip) => chip.value && chip.value !== 'all'
                  ).length === 0
                     ? '8px'
                     : '0',
            }}
            actions={
               <Grid item>
                  <Button
                     onClick={() => setAutoRefresh(autoRefresh + 1)}
                     color="primary"
                     variant={
                        useMediaQuery(theme.breakpoints.up('md'))
                           ? 'outlined'
                           : 'text'
                     }
                     sx={{
                        p: useMediaQuery(theme.breakpoints.up('md'))
                           ? '4px 8px 4px 8px'
                           : 0,
                        height: '28px',
                        borderRadius: '8px',
                        justifyContent: useMediaQuery(
                           theme.breakpoints.up('md')
                        )
                           ? 'initial'
                           : 'end',
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
                     {useMediaQuery(theme.breakpoints.up('md')) && (
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
            <AllGames
               gameId={filters.gameId}
               title={filters.title}
               autoRefresh={autoRefresh}
            />
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   )
}

Games.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Games List">{page}</DashboardLayout>
}

export default Games
