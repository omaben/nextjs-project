import HeaderTitleToolbar from '@/components/custom/HeaderTitleToolbar';
import HeaderToolbar from '@/components/custom/HeaderToolbar';
import { PortalQuickReportData } from '@/components/custom/PortalQuickReportData';
import DateToolbar from '@/components/custom/customDateToolbar';
import DashboardLayout from '@/layouts/Dashboard';
import { RegistrationData } from '@alienbackoffice/back-front';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Grid, Stack, useMediaQuery, useTheme } from '@mui/material';
import moment from 'moment';
import React, { ReactElement, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { selectAuthOperator } from 'redux/authSlice';
import { getCrashConfig } from 'redux/slices/crashConfig';
import { getQuickReport } from 'services';
import {
   PageWith2Toolbar,
   getDefaultEndDate,
   getDefaultStartDate,
} from 'services/globalFunctions';

export interface PortalStats {
   primaryTitle: string;
   amount?: number | string;
   infoText?: string;
   disableFormatting?: boolean;
   disableColor?: boolean;
   reverseColors?: boolean;
   currency?: boolean;
   percentagetext?: number | string;
   percentagecolor?: string;
   icon?: IconProp;
   iconColor?: string;
   iconBackground?: string;
}

export interface reportOperator {
   opId: string;
   betCount: number;
   totalBetAmount: number;
   totalWinAmount: number;
   totalPl: number;
   totalTopupAmount: number;
   totalDepositAmount: number;
   totalWithdrawAmount: number;
   totalTopupCount: number;
   totalDepositCount: number;
   totalWithdrawCount: number;
   ftd: number;
   registration: RegistrationData;
   uniquePlayers: number;
   totalBetAmountInCurrentUSD: number;
   totalWinAmountInCurrentUSD: number;
   totalPlInCurrentUSD: number;
   totalTopupAmountInCurrentUSD: number;
   totalDepositAmountInCurrentUSD: number;
   totalWithdrawAmountInCurrentUSD: number;
}
const timedifference = new Date().getTimezoneOffset();
function wait(ms: number) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}
function Reports() {
   // Redux selectors
   const crashConfig = useSelector(getCrashConfig);
   const opId = useSelector(selectAuthOperator);
   const theme = useTheme();
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   // Initial state for statistics and date selection
   const [refresh, setRefresh]: any = React.useState(0);
   const [dataReport, setDataReport]: any = React.useState(
      [] as {
         from: number;
         uniquePlayers: number;
         totalBets: number;
         totalBetAmountInUsd: number;
         totalWinAmountInUsd: number;
         totalPlInUsd: number;
      }[]
   );
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
   const [daySelected, setDaySelected] = React.useState(
      moment().utc().startOf('day').toISOString()
   );
   const gridRef = useRef<HTMLDivElement | null>(null);
   const stackRefs = [
      useRef<HTMLDivElement | null>(null),
      useRef<HTMLDivElement | null>(null),
      useRef<HTMLDivElement | null>(null),
      useRef<HTMLDivElement | null>(null),
      useRef<HTMLDivElement | null>(null),
      useRef<HTMLDivElement | null>(null),
      useRef<HTMLDivElement | null>(null),
   ];
   // const dataDaily = useSelector(selectAuthFinancialReportsDaily) as
   //    | Report[]
   //    | [];

   // Function to update date and fetch reports
   const handlelogDate = async (
      startDate: Date,
      endDate: Date,
      update: Boolean,
      firstLaunch: Boolean
   ) => {
      // Update selected dates
      setStartDateUpdate(moment(startDate).utc());
      setEndDateUpdate(moment(endDate).utc());
      if (update) {
         // Update start and end dates for fetching reports
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

   // Function to handle search button click
   const handleSearchClick = () => {
      // Update start and end dates for fetching reports
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

   const [ignore, setIgnore] = React.useState(false);
   const getRows = async () => {
      if (!ignore) {
         setIgnore(true);
         await wait(1000);
      }
      getQuickReport({
         from: startDate,
         to: endDate,
      })
         .then((res) => {
            res &&
               res.labels.map((item: string, index: number) => {
                  if (res.datasets.length > 0) {
                     setDataReport(
                        (
                           prevState: {
                              from: number;
                              uniquePlayers: number;
                              totalBets: number;
                              totalBetAmountInUsd: number;
                              totalWinAmountInUsd: number;
                              totalPlInUsd: number;
                           }[]
                        ) => {
                           return [
                              ...prevState,
                              {
                                 from: item,
                                 uniquePlayers:
                                    res.datasets[0].uniquePlayers[index],
                                 totalBets:
                                    res.datasets[0].totalBets ?
                                    res.datasets[0].totalBets[index] : 0,
                                 totalBetAmountInUsd:
                                    res.datasets[0].totalBetAmountInUsd ?
                                    res.datasets[0].totalBetAmountInUsd[index] :
                                       0,
                                 totalWinAmountInUsd:
                                    res.datasets[0].totalWinAmountInUsd ?
                                    res.datasets[0].totalWinAmountInUsd[index] :
                                       0,
                                 totalPlInUsd:
                                    res.datasets[0].totalWinAmountInUsd ?
                                    res.datasets[0].totalPlInUsd[index] : 0,
                              },
                           ];
                        }
                     );
                  }
               });
               console.log(dataReport);
         })
         .catch((error) => {
            console.error('Error fetching data:', error);
         });
   };
   useEffect(() => {
      if (!ignore && startDate && endDate) {
         setDataReport([]);
         getRows();
      }
   });
   useEffect(() => {
      if (ignore && startDate && endDate) {
         setDataReport([]);
         getRows();
      }
   }, [startDate, endDate, opId]);
   return (
      <React.Fragment>
         {/* Set the page title */}
         <Helmet title="iMoon | Quick Reports" />

         {/* Render the appropriate toolbar based on screen size */}
         {isDesktop ? (
            <HeaderToolbar
               title={`Quick Reports`}
               isVisibleDate={true}
               handleSearchClick={handleSearchClick}
               handleLogDate={handlelogDate}
               sx={{ px: '8px !important' }}
               // actions={<CurrenciesFilter />}
            />
         ) : (
            <>
               <DateToolbar
                  autoRefresh={false}
                  handleSearchClick={handleSearchClick}
                  handleLogDate={handlelogDate}
               />
               <HeaderTitleToolbar
                  title={`Reports In USD`}
                  sx={{
                     pt: '6px',
                     mb: '6px',
                  }}
               />
            </>
         )}
         {dataReport && (
            <Grid
               container
               spacing={1}
               px={isDesktop ? '12px' : '4px'}
               py={'6px'}
               height={PageWith2Toolbar}
               position={'relative'}
               sx={{
                  overflow: 'hidden',
                  width: isDesktop ? 'calc(100vw - 216px)' : '100%',
                  overflowY: 'auto',
               }}
               ref={gridRef}
            >
               <Grid item xs={12} py={'6px'}>
                  {/* Daily reports */}
                  <Stack gap={10} ref={stackRefs[4]}>
                     <PortalQuickReportData
                        inUSD={true}
                        rows={dataReport}
                        format="DD/MM/YYYY HH:mm:ss"
                        isLoading={false}
                        highlighted={
                           moment(daySelected).tz('GMT').unix() * 1000
                        }
                        link="Daily Stats"
                        setDate={(e: any) => {
                           setDaySelected(
                              moment(e).tz('GMT').startOf('day').toString()
                           );
                        }}
                        linkLabel={`Date/time`}
                     />
                  </Stack>
               </Grid>
            </Grid>
         )}
      </React.Fragment>
   );
}

Reports.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout>{page}</DashboardLayout>;
};

export default Reports;
