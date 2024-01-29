import PortalCurrencyValue from '@/components/custom/PortalCurrencyValue';
import { Operator } from '@alienbackoffice/back-front';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faExpand } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   Box,
   Button,
   Card,
   CircularProgress,
   Grid,
   Stack,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Tooltip,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import { ImoonGray, secondary } from 'colors';
import moment from 'moment';
import Link from 'next/link';
import numeral from 'numeral';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
   selectAuthCurrencyOption,
   selectAuthCurrentOperator,
   selectAuthCurrenturrency,
} from 'redux/authSlice';
import { PageWith5Toolbar } from 'services/globalFunctions';
import { CURENCYTYPE, DataType } from 'types';
import PortalStatsLineChartReportsQuick from './PortalStatsLineChartReportsQuick';
const Item = ({ date, data, format, link, setDate, players, inUSD }: any) => {
   const theme = useTheme();
   const currencyOption = useSelector(selectAuthCurrencyOption);
   const currency: string = useSelector(selectAuthCurrenturrency) || '';
   const operator = useSelector(selectAuthCurrentOperator) as Operator;
   const marginAmount =
      (data?.totalBetAmountInUsd - data?.totalWinAmountInUsd) /
      data?.totalBetAmountInUsd;

   return (
      <>
         <TableRow
            key={`${date}Data`}
            sx={{
               fontSize: theme.breakpoints.down('sm') ? '10px' : '12px',
               opacity: moment(date) <= moment() ? 1 : 0.4,
               th: {
                  background: `${theme.palette.background.paper}!important`,
               },
               '.MuiTableCell-root': {
                  padding: '5px',
               },
               '&:nth-of-type(odd), &:nth-of-type(odd) tr th': {
                  background: `${'#F6F5F9'}!important`,
               },
               '&:nth-of-type(odd) th': {
                  background: `${'#F6F5F9'}!important`,
               },
               '&:nth-of-type(even) th': {
                  background: `${theme.palette.background.paper}!important`,
               },

               '&:nth-of-type(even), &:nth-of-type(even) tr th': {
                  background: `${theme.palette.background.paper}!important`,
               },
               'th .MuiStack-root, th a': {
                  color: `${'#1570EF'} !important`,
                  fontFamily: `${'Nunito Sans SemiBold'} !important`,
               },
               'td p, td p span': {
                  color: `${'#04020B'} !important`,
                  fontFamily: `${'Nunito Sans SemiBold'} !important`,
               },
               // hide last border
               'td, th': {
                  border: 0,
                  textAlign: 'center',
                  alignContent: 'center',
               },
            }}
         >
            <TableCell
               component="th"
               scope="row"
               width={'80px'}
               align="left"
               sx={{ minWidth: '120px' }}
            >
               <Stack
                  direction="row"
                  gap={2}
                  alignItems="start"
                  textTransform="capitalize"
               >
                  <Box
                     sx={{
                        color: `${secondary[6]} !important`,
                        cursor: moment(date) <= moment() ? 'pointer' : 'auto',
                        paddingLeft: '10px',
                     }}
                     textAlign={'center'}
                  >
                     <Link
                        href={`/bets?from=${moment(date)
                           .tz('GMT')
                           .unix()}&to=${moment(date)
                           .add('1', 'day')
                           .tz('GMT')
                           .unix()}`}
                        style={{
                           color: secondary[6],
                           textDecoration: 'none',
                        }}
                     >
                        {moment(date).tz('GMT').format(format)}
                     </Link>
                  </Box>
               </Stack>
            </TableCell>
            <TableCell sx={{ minWidth: '120px' }}>
               <Tooltip
                  title={numeral(data?.uniquePlayers).format('0,00.[00]')}
               >
                  <Typography
                     sx={{
                        textAlign: 'center',
                     }}
                  >
                     {numeral(data?.uniquePlayers).format(
                        '0a.[00]',
                        (n) => (Math.floor(n) * 100) / 100
                     )}
                  </Typography>
               </Tooltip>
            </TableCell>
            <TableCell sx={{ minWidth: '120px' }}>
               <Tooltip title={numeral(data?.totalBets).format('0,00.[00]')}>
                  <Typography
                     sx={{
                        textAlign: 'center',
                     }}
                  >
                     {numeral(data?.totalBets).format(
                        '0a.[00]',
                        (n) => (Math.floor(n) * 100) / 100
                     )}
                  </Typography>
               </Tooltip>
            </TableCell>
            <TableCell
               sx={{
                  color:
                     marginAmount > 0
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                  minWidth: '120px',
               }}
            >
               <Tooltip
                  title={numeral(data?.totalBetAmountInUsd || 0).format(
                     '0,00.[00]'
                  )}
               >
                  <Typography
                     sx={{
                        wordBreak: 'keep-all',
                     }}
                  >
                     <PortalCurrencyValue
                        value={data?.totalBetAmountInUsd || 0}
                        currency={'USD'}
                        disableColor={true}
                        format="0a.[00]"
                        textTransform="uppercase"
                        formatter={true}
                        visibleCurrency={true}
                     />
                  </Typography>
               </Tooltip>
            </TableCell>
            <TableCell sx={{ minWidth: '120px' }}>
               <Tooltip title={numeral(data?.totalPlInUsd).format('0,00.[00]')}>
                  <Typography
                     sx={{
                        wordBreak: 'keep-all',
                     }}
                  >
                     <PortalCurrencyValue
                        value={data?.totalPlInUsd}
                        currency={'USD'}
                        disableColor={true}
                        format="0a.[00]"
                        textTransform="uppercase"
                        formatter={true}
                        visibleCurrency={true}
                     />
                  </Typography>
               </Tooltip>
            </TableCell>
         </TableRow>
      </>
   );
};

export const PortalQuickReportData: FC<{
   rows: {}[];
   linkLabel: string;
   format: string;
   isLoading: boolean;
   playerId?: string;
   link?: string;
   setDate?: Function;
   highlighted?: number;
   noChart?: boolean;
   inUSD?: boolean;
}> = ({
   rows,
   linkLabel,
   isLoading,
   format,
   link,
   playerId,
   setDate,
   noChart,
   inUSD,
}) => {
   const theme = useTheme();
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const tableBodyRef = useRef<HTMLTableElement | null>(null);
   const [isScrolled, setIsScrolled] = useState(false);
   const currencyOption = useSelector(selectAuthCurrencyOption);
   const currency: string = useSelector(selectAuthCurrenturrency) || '';
   let currencyReport = currency;
   if (currencyOption?.value !== 0 || inUSD) {
      currencyReport =
         currencyOption.name == CURENCYTYPE.INUSD || inUSD
            ? 'totalInUSD'
            : 'totalInEUR';
   }
   const [datashow, setDatashow] = React.useState(DataType.TABLE);
   const tableLabels = [
      linkLabel,
      'Active Players',
      'Total Bets',
      'Bet Amount',
      'PL Amount',
   ];
   useEffect(() => {
      const handleScroll = () => {
         const tableBody = tableBodyRef.current;
         if (tableBody) {
            const { scrollLeft } = tableBody;

            // Synchronize the horizontal scroll position of the thead and tbody
            const header = tableBody.querySelectorAll('.sticky-header');
            if (header) {
               header[0].scrollLeft = scrollLeft;
            }

            setIsScrolled(scrollLeft > 0);
         }
      };

      const tableBody = tableBodyRef.current;
      if (tableBody) {
         tableBody.addEventListener('scroll', handleScroll);

         return () => {
            tableBody.removeEventListener('scroll', handleScroll);
         };
      }
   }, []);

   return (
      <Card
         sx={{
            p: 0,
            borderRadius: '16px',
         }}
      >
         {datashow === DataType.TABLE ? (
            <TableContainer
               sx={{ boxShadow: 'none', height: PageWith5Toolbar }}
               ref={tableBodyRef}
            >
               <Table
                  size="small"
                  stickyHeader
                  sx={{
                     ...(!isDesktop && {
                        'tr>th:first-of-type,tr>td:nth-of-type(0)': {
                           position: 'sticky',
                           left: 0,
                           zIndex: 1,
                        },
                        'thead th:first-of-type': {
                           zIndex: 3,
                        },

                        '.MuiTableBody-root .MuiTableRow-root:nth-of-type(odd)>th':
                           { padding: '5px' },
                     }),
                  }}
               >
                  <TableHead
                     className="sticky-header"
                     sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        th: {
                           textTransform: 'capitalize',
                        },
                        width: isDesktop
                           ? 'calc(100% - 245px)'
                           : 'calc(100% - 12px)',
                        // top: isDesktop ? '100px !important' : '80px !important',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                     }}
                  >
                     <TableRow>
                        {tableLabels?.map((label) => (
                           <TableCell
                              key={label}
                              align={
                                 label === 'JSON' || label === 'Brands'
                                    ? 'center'
                                    : 'left'
                              }
                              sx={{ minWidth: '120px' }}
                           >
                              <Typography component="h6">{label}</Typography>
                           </TableCell>
                        ))}
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {!isLoading ? (
                        rows &&
                        rows.map((item: any) => {
                           return (
                              <Item
                                 key={`${item.from}`}
                                 date={item.from}
                                 data={item}
                                 players={item.uniquePlayers}
                                 link={link}
                                 format={format}
                                 playerId={playerId}
                                 isLoading={isLoading}
                                 linkLabel={linkLabel}
                                 setDate={setDate}
                                 inUSD={inUSD}
                              />
                           );
                        })
                     ) : (
                        <TableRow>
                           <TableCell colSpan={9}>
                              <Stack
                                 minHeight={100}
                                 justifyContent="center"
                                 alignItems="center"
                              >
                                 <CircularProgress color="primary" />
                              </Stack>
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </TableContainer>
         ) : isLoading ? (
            <Stack minHeight={380} justifyContent="center" alignItems="center">
               <CircularProgress color="primary" />
            </Stack>
         ) : (
            <PortalStatsLineChartReportsQuick
               rows={
                  rows as {
                     from: number;
                     uniquePlayers: number;
                     totalBets: number;
                     totalBetAmountInUsd: number;
                     totalWinAmountInUsd: number;
                     totalPlInUsd: number;
                  }[]
               }
               inUSD={inUSD}
               format={format}
            />
         )}

         <Grid
            container
            height={30}
            textAlign={'center'}
            alignItems={'center'}
            padding={'4px 15px'}
            borderTop={`1px solid ${ImoonGray[11]}`}
         >
            <Grid
               item
               xs
               textAlign={'center'}
               sx={{
                  button: {
                     textAlign: 'center',
                     fontSize: theme.breakpoints.down('sm') ? '10px' : '12px',
                     letterSpacing: '0.4px',
                     fontFamily: 'Nunito Sans Regular',
                     padding: '4px',
                     gap: '8px',
                     borderRadius: '6px',
                     height: '21px',
                     marginRight: '5px',
                  },
               }}
            >
               {!noChart && (
                  <>
                     <Button
                        variant="contained"
                        color={datashow === DataType.TABLE ? 'info' : 'inherit'}
                        onClick={() => setDatashow(DataType.TABLE)}
                     >
                        Table
                     </Button>
                     <Button
                        variant="contained"
                        color={datashow === DataType.CHART ? 'info' : 'inherit'}
                        onClick={() => setDatashow(DataType.CHART)}
                     >
                        Chart
                     </Button>
                  </>
               )}
            </Grid>
            <Grid item>
               <FontAwesomeIcon
                  icon={faExpand as IconProp}
                  color={ImoonGray[7]}
               />
            </Grid>
         </Grid>
      </Card>
   );
};
