import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
   faBadgeDollar,
   faChartLineDown,
   faCircleStar,
   faSackDollar,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import { ImoonBlue, ImoonGray, imoonWarning, purple } from 'colors'
import React from 'react'
import {
   saveBetsBigLosses,
   saveBetsBigWins,
   saveBetsHighRoller,
   saveBetsLatestWins,
   saveBetsLuckyWins,
} from 'redux/authSlice'
import {
   saveLoadingBigLosses,
   saveLoadingBigWins,
   saveLoadingHighRollers,
   saveLoadingLatestWins,
   saveLoadingLuckWins,
} from 'redux/loadingSlice'
import { store } from 'redux/store'
import { StartEndDateProps, betListType } from 'types'
import BigLoser from './big-loser'
import BigWins from './big-wins'
import HighRollers from './high-rollers'
import LastWinners from './last-wins'
import LuckyWins from './lucky-wins'

export default function Ranking({
   startDate,
   endDate,
   searchDate,
}: StartEndDateProps) {
   const [value, setValue] = React.useState(betListType.LATESTWINS)
   const [borderColorActive, setBorderColorActive] = React.useState(
      ImoonGray[7]
   )
   const [valueIcon, setValueIcon] = React.useState(
      <FontAwesomeIcon
         icon={faCircleStar as IconProp}
         size="sm"
         style={{ marginRight: '5px' }}
      />
   )

   const handleChange = (
      event: React.SyntheticEvent,
      newValue: betListType
   ) => {
      switch (newValue) {
         case betListType.LATESTWINS:
            store.dispatch(saveLoadingLatestWins(true))
            store.dispatch(saveBetsLatestWins([]))
            break
         case betListType.BIGWINS:
            store.dispatch(saveLoadingBigWins(true))
            store.dispatch(saveBetsBigWins([]))
            break
         case betListType.BIGLOSSES:
            store.dispatch(saveLoadingBigLosses(true))
            store.dispatch(saveBetsBigLosses([]))
            break
         case betListType.HIGHROLLERS:
            store.dispatch(saveLoadingHighRollers(true))
            store.dispatch(saveBetsHighRoller([]))
            break
         case betListType.LUCKYWINS:
            store.dispatch(saveLoadingLuckWins(true))
            store.dispatch(saveBetsLuckyWins([]))
            break
      }
      setValue(newValue)
      setTimeout(() => {
         window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
         })
      }, 500)
   }

   React.useEffect(() => {
      switch (value) {
         case betListType.LATESTWINS:
            setBorderColorActive(imoonWarning[5])
            setValueIcon(
               <FontAwesomeIcon
                  icon={faCircleStar as IconProp}
                  size="sm"
                  style={{
                     marginRight: '5px',
                     color: imoonWarning[5],
                  }}
               />
            )
            break
         case betListType.BIGWINS:
            setBorderColorActive('#F04438')
            setValueIcon(
               <svg
                  style={{ marginRight: '5px' }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="12"
                  viewBox="0 0 15 12"
                  fill="none"
               >
                  <g clipPath="url(#clip0_339_38988)">
                     <path
                        d="M0 1.5C0 0.672656 0.670069 0 1.49423 0H11.9538C12.778 0 13.4481 0.672656 13.4481 1.5V4.95C12.9928 4.71562 12.4885 4.56562 11.9538 4.51641V1.5H1.49423V8.25H7.4875C7.47582 8.37422 7.47115 8.49844 7.47115 8.625C7.47115 10.0195 8.1599 11.2523 9.21754 12H3.73558C3.32233 12 2.98846 11.6648 2.98846 11.25C2.98846 10.8352 3.32233 10.5 3.73558 10.5H5.35355L5.60337 9.75H1.49423C0.670069 9.75 0 9.07734 0 8.25V1.5ZM11.2067 2.8125V4.51641C10.8168 4.55156 10.4433 4.64062 10.0931 4.77891C10.0884 4.74844 10.0861 4.71797 10.0861 4.6875V4.16953L7.4945 6.77344C7.38944 6.87891 7.24702 6.9375 7.0976 6.9375C6.94817 6.9375 6.80575 6.87891 6.70069 6.77344L5.22981 5.29688L3.19859 7.33594C2.97912 7.55625 2.62424 7.55625 2.40711 7.33594C2.18998 7.11562 2.18765 6.75938 2.40711 6.54141L4.8329 4.10156C5.05237 3.88125 5.40725 3.88125 5.62438 4.10156L7.09526 5.57812L9.29458 3.375H8.77861C8.46809 3.375 8.21827 3.12422 8.21827 2.8125C8.21827 2.50078 8.46809 2.25 8.77861 2.25H10.6464C10.9569 2.25 11.2067 2.50078 11.2067 2.8125ZM8.21827 8.625C8.21827 7.72989 8.57248 6.87145 9.20298 6.23851C9.83348 5.60558 10.6886 5.25 11.5803 5.25C12.472 5.25 13.3271 5.60558 13.9576 6.23851C14.5881 6.87145 14.9423 7.72989 14.9423 8.625C14.9423 9.52011 14.5881 10.3785 13.9576 11.0115C13.3271 11.6444 12.472 12 11.5803 12C10.6886 12 9.83348 11.6444 9.20298 11.0115C8.57248 10.3785 8.21827 9.52011 8.21827 8.625ZM11.0386 7.86094C11.0526 7.83984 11.0807 7.81172 11.1367 7.78125C11.2558 7.71797 11.4285 7.68516 11.5733 7.6875C11.7647 7.68984 11.9725 7.72969 12.1897 7.78359C12.3904 7.83281 12.5936 7.71094 12.6426 7.50937C12.6916 7.30781 12.5702 7.10391 12.3694 7.05469C12.2387 7.02187 12.0986 6.99141 11.9515 6.96797V6.75C11.9515 6.54375 11.7834 6.375 11.578 6.375C11.3725 6.375 11.2044 6.54375 11.2044 6.75V6.97266C11.062 7.00078 10.9172 7.04766 10.7841 7.12031C10.5086 7.26797 10.2472 7.55156 10.2752 7.99219C10.2985 8.36719 10.5483 8.58516 10.7795 8.71172C10.9849 8.82188 11.2394 8.89453 11.4472 8.95312L11.4892 8.96484C11.7297 9.03281 11.9072 9.08672 12.0309 9.15937C12.136 9.22266 12.1406 9.25781 12.1406 9.29062C12.143 9.34688 12.129 9.37734 12.1173 9.39609C12.1033 9.41953 12.0753 9.44766 12.0239 9.47344C11.9142 9.53203 11.7484 9.5625 11.592 9.55781C11.3702 9.55078 11.16 9.48516 10.8939 9.39844C10.8495 9.38437 10.8052 9.37031 10.7585 9.35625C10.5623 9.29531 10.3522 9.40547 10.2915 9.60234C10.2308 9.79922 10.3405 10.0102 10.5367 10.0711C10.574 10.0828 10.6137 10.0945 10.6534 10.1086C10.8168 10.1625 11.0059 10.2211 11.2067 10.2633V10.5305C11.2067 10.7367 11.3748 10.9055 11.5803 10.9055C11.7857 10.9055 11.9538 10.7367 11.9538 10.5305V10.282C12.0986 10.2563 12.2457 10.2094 12.3811 10.1367C12.6636 9.98438 12.9017 9.69844 12.8877 9.27188C12.8761 8.89219 12.6473 8.65547 12.4091 8.51484C12.1897 8.38359 11.9142 8.30625 11.697 8.24531H11.6924C11.4495 8.17734 11.2651 8.12344 11.1344 8.05313C11.0223 7.99219 11.0223 7.95938 11.0223 7.94766V7.94531C11.02 7.90078 11.0293 7.87734 11.041 7.86094H11.0386Z"
                        fill="#F04438"
                     />
                  </g>
                  <defs>
                     <clipPath id="clip0_339_38988">
                        <rect width="14.9423" height="12" fill="white" />
                     </clipPath>
                  </defs>
               </svg>
            )
            break
         case betListType.BIGLOSSES:
            setBorderColorActive('#12B76A')
            setValueIcon(
               <FontAwesomeIcon
                  icon={faChartLineDown as IconProp}
                  size="sm"
                  style={{ marginRight: '5px', color: '#12B76A' }}
               />
            )
            break
         case betListType.HIGHROLLERS:
            setBorderColorActive(ImoonBlue[5])
            setValueIcon(
               <FontAwesomeIcon
                  icon={faSackDollar as IconProp}
                  size="sm"
                  style={{
                     marginRight: '5px',
                     color: ImoonBlue[5],
                  }}
               />
            )
            break
         case betListType.LUCKYWINS:
            setBorderColorActive(purple[5])
            setValueIcon(
               <FontAwesomeIcon
                  icon={faBadgeDollar as IconProp}
                  size="sm"
                  style={{
                     marginRight: '5px',
                     color: purple[5],
                  }}
               />
            )
            break
      }
   }, [value])

   return (
      <Box width={'100%'} key={searchDate}>
         <TabContext value={value}>
            <TabList
               className="home_tabs"
               onChange={handleChange}
               variant="scrollable"
               scrollButtons={false}
               sx={{
                  justifyContent: 'left',
                  '.MuiTab-root': {
                     display: 'flex',
                     flexDirection: 'row',
                     alignItems: 'left',
                  },
                  '.Mui-selected': {
                     color: `${ImoonGray[3]}!important`,
                  },
                  '.MuiTabs-scroller': {
                     width: 'max-content',
                     maxWidth: 'max-content',
                  },
                  '.MuiTabs-indicator': {
                     background: borderColorActive,
                  },
               }}
            >
               <Tab
                  icon={
                     <FontAwesomeIcon
                        icon={faCircleStar as IconProp}
                        size="sm"
                        style={{
                           marginRight: '5px',
                           color:
                              value === betListType.LATESTWINS
                                 ? imoonWarning[5]
                                 : ImoonGray[7],
                           height: '16px',
                        }}
                     />
                  }
                  label="Latest Wins"
                  value={betListType.LATESTWINS}
               />
               <Tab
                  icon={
                     <svg
                        style={{ marginRight: '5px' }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="12"
                        viewBox="0 0 15 12"
                        fill="none"
                     >
                        <g clipPath="url(#clip0_339_38988)">
                           <path
                              d="M0 1.5C0 0.672656 0.670069 0 1.49423 0H11.9538C12.778 0 13.4481 0.672656 13.4481 1.5V4.95C12.9928 4.71562 12.4885 4.56562 11.9538 4.51641V1.5H1.49423V8.25H7.4875C7.47582 8.37422 7.47115 8.49844 7.47115 8.625C7.47115 10.0195 8.1599 11.2523 9.21754 12H3.73558C3.32233 12 2.98846 11.6648 2.98846 11.25C2.98846 10.8352 3.32233 10.5 3.73558 10.5H5.35355L5.60337 9.75H1.49423C0.670069 9.75 0 9.07734 0 8.25V1.5ZM11.2067 2.8125V4.51641C10.8168 4.55156 10.4433 4.64062 10.0931 4.77891C10.0884 4.74844 10.0861 4.71797 10.0861 4.6875V4.16953L7.4945 6.77344C7.38944 6.87891 7.24702 6.9375 7.0976 6.9375C6.94817 6.9375 6.80575 6.87891 6.70069 6.77344L5.22981 5.29688L3.19859 7.33594C2.97912 7.55625 2.62424 7.55625 2.40711 7.33594C2.18998 7.11562 2.18765 6.75938 2.40711 6.54141L4.8329 4.10156C5.05237 3.88125 5.40725 3.88125 5.62438 4.10156L7.09526 5.57812L9.29458 3.375H8.77861C8.46809 3.375 8.21827 3.12422 8.21827 2.8125C8.21827 2.50078 8.46809 2.25 8.77861 2.25H10.6464C10.9569 2.25 11.2067 2.50078 11.2067 2.8125ZM8.21827 8.625C8.21827 7.72989 8.57248 6.87145 9.20298 6.23851C9.83348 5.60558 10.6886 5.25 11.5803 5.25C12.472 5.25 13.3271 5.60558 13.9576 6.23851C14.5881 6.87145 14.9423 7.72989 14.9423 8.625C14.9423 9.52011 14.5881 10.3785 13.9576 11.0115C13.3271 11.6444 12.472 12 11.5803 12C10.6886 12 9.83348 11.6444 9.20298 11.0115C8.57248 10.3785 8.21827 9.52011 8.21827 8.625ZM11.0386 7.86094C11.0526 7.83984 11.0807 7.81172 11.1367 7.78125C11.2558 7.71797 11.4285 7.68516 11.5733 7.6875C11.7647 7.68984 11.9725 7.72969 12.1897 7.78359C12.3904 7.83281 12.5936 7.71094 12.6426 7.50937C12.6916 7.30781 12.5702 7.10391 12.3694 7.05469C12.2387 7.02187 12.0986 6.99141 11.9515 6.96797V6.75C11.9515 6.54375 11.7834 6.375 11.578 6.375C11.3725 6.375 11.2044 6.54375 11.2044 6.75V6.97266C11.062 7.00078 10.9172 7.04766 10.7841 7.12031C10.5086 7.26797 10.2472 7.55156 10.2752 7.99219C10.2985 8.36719 10.5483 8.58516 10.7795 8.71172C10.9849 8.82188 11.2394 8.89453 11.4472 8.95312L11.4892 8.96484C11.7297 9.03281 11.9072 9.08672 12.0309 9.15937C12.136 9.22266 12.1406 9.25781 12.1406 9.29062C12.143 9.34688 12.129 9.37734 12.1173 9.39609C12.1033 9.41953 12.0753 9.44766 12.0239 9.47344C11.9142 9.53203 11.7484 9.5625 11.592 9.55781C11.3702 9.55078 11.16 9.48516 10.8939 9.39844C10.8495 9.38437 10.8052 9.37031 10.7585 9.35625C10.5623 9.29531 10.3522 9.40547 10.2915 9.60234C10.2308 9.79922 10.3405 10.0102 10.5367 10.0711C10.574 10.0828 10.6137 10.0945 10.6534 10.1086C10.8168 10.1625 11.0059 10.2211 11.2067 10.2633V10.5305C11.2067 10.7367 11.3748 10.9055 11.5803 10.9055C11.7857 10.9055 11.9538 10.7367 11.9538 10.5305V10.282C12.0986 10.2563 12.2457 10.2094 12.3811 10.1367C12.6636 9.98438 12.9017 9.69844 12.8877 9.27188C12.8761 8.89219 12.6473 8.65547 12.4091 8.51484C12.1897 8.38359 11.9142 8.30625 11.697 8.24531H11.6924C11.4495 8.17734 11.2651 8.12344 11.1344 8.05313C11.0223 7.99219 11.0223 7.95938 11.0223 7.94766V7.94531C11.02 7.90078 11.0293 7.87734 11.041 7.86094H11.0386Z"
                              fill={
                                 value === betListType.BIGWINS
                                    ? '#F04438'
                                    : ImoonGray[7]
                              }
                           />
                        </g>
                        <defs>
                           <clipPath id="clip0_339_38988">
                              <rect width="14.9423" height="12" fill="white" />
                           </clipPath>
                        </defs>
                     </svg>
                  }
                  label="Big Wins"
                  value={betListType.BIGWINS}
               />
               <Tab
                  icon={
                     <FontAwesomeIcon
                        icon={faChartLineDown as IconProp}
                        size="sm"
                        style={{
                           marginRight: '5px',
                           color:
                              value === betListType.BIGLOSSES
                                 ? '#12B76A'
                                 : ImoonGray[7],
                        }}
                     />
                  }
                  label="Big Losses"
                  value={betListType.BIGLOSSES}
                  sx={{}}
               />
               <Tab
                  icon={
                     <FontAwesomeIcon
                        icon={faSackDollar as IconProp}
                        size="sm"
                        style={{
                           marginRight: '5px',
                           color:
                              value === betListType.HIGHROLLERS
                                 ? ImoonBlue[5]
                                 : ImoonGray[7],
                        }}
                     />
                  }
                  label="High Rollers"
                  value={betListType.HIGHROLLERS}
               />
               <Tab
                  icon={
                     <FontAwesomeIcon
                        icon={faBadgeDollar as IconProp}
                        size="sm"
                        style={{
                           marginRight: '5px',
                           color:
                              value === betListType.LUCKYWINS
                                 ? purple[5]
                                 : ImoonGray[7],
                        }}
                     />
                  }
                  label="Lucky Wins"
                  value={betListType.LUCKYWINS}
               />
            </TabList>

            <TabPanel
               value={betListType.LATESTWINS}
               sx={{ padding: '8px 0px' }}
            >
               <LastWinners
                  startDate={startDate}
                  endDate={endDate}
                  searchDate={searchDate}
               />
            </TabPanel>
            <TabPanel value={betListType.BIGWINS} sx={{ padding: '8px 0px' }}>
               <BigWins
                  startDate={startDate}
                  endDate={endDate}
                  searchDate={searchDate}
               />
            </TabPanel>
            <TabPanel value={betListType.BIGLOSSES} sx={{ padding: '8px 0px' }}>
               <BigLoser
                  startDate={startDate}
                  endDate={endDate}
                  searchDate={searchDate}
               />
            </TabPanel>
            <TabPanel
               value={betListType.HIGHROLLERS}
               sx={{ padding: '8px 0px' }}
            >
               <HighRollers
                  startDate={startDate}
                  endDate={endDate}
                  searchDate={searchDate}
               />
            </TabPanel>
            <TabPanel value={betListType.LUCKYWINS} sx={{ padding: '8px 0px' }}>
               <LuckyWins
                  startDate={startDate}
                  endDate={endDate}
                  searchDate={searchDate}
               />
            </TabPanel>
         </TabContext>
      </Box>
   )
}
