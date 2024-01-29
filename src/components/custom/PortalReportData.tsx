import PortalCurrencyValue from '@/components/custom/PortalCurrencyValue'
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
} from '@mui/material'
import { ImoonGray, secondary } from 'colors'
import { Operator, Report } from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faExpand } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import Link from 'next/link'
import numeral from 'numeral'
import React, { FC, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
   selectAuthCurrencyOption,
   selectAuthCurrentOperator,
   selectAuthCurrenturrency,
} from 'redux/authSlice'
import { CURENCYTYPE, DataType } from 'types'
import PortalStatsLineChartReports from './PortalStatsLineChartReports'
const Item = ({
   date,
   data,
   format,
   link,
   setDate,
   highlighted,
   players,
   inUSD,
}: any) => {
   const theme = useTheme()
   const currencyOption = useSelector(selectAuthCurrencyOption)
   const currency: string = useSelector(selectAuthCurrenturrency) || ''
   const operator = useSelector(selectAuthCurrentOperator) as Operator
   let currencyReport = currency
   if (currencyOption?.value !== 0 || inUSD) {
      currencyReport =
         currencyOption.name == CURENCYTYPE.INUSD || inUSD
            ? 'totalInUSD'
            : 'totalInEUR'
   }
   const plAmount =
      currencyOption.name === CURENCYTYPE.INUSD || inUSD
         ? data?.totalPlInCurrentUSD
         : data?.totalPl
   const marginAmount =
      currencyOption.name === CURENCYTYPE.INUSD || inUSD
         ? (data?.totalBetAmountInCurrentUSD -
              data?.totalWinAmountInCurrentUSD) /
           data?.totalBetAmountInCurrentUSD
         : (data?.totalBetAmount - data?.totalWinAmount) / data?.totalBetAmount

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
                  background: `${
                     highlighted === date ? '#E0EAFF' : '#F6F5F9'
                  }!important`,
               },
               '&:nth-of-type(odd) th': {
                  background: `${
                     highlighted === date ? '#E0EAFF' : '#F6F5F9'
                  }!important`,
               },
               '&:nth-of-type(even) th': {
                  background: `${
                     highlighted === date
                        ? '#E0EAFF'
                        : theme.palette.background.paper
                  }!important`,
               },

               '&:nth-of-type(even), &:nth-of-type(even) tr th': {
                  background: `${
                     highlighted === date
                        ? '#E0EAFF'
                        : theme.palette.background.paper
                  }!important`,
               },
               'th .MuiStack-root, th a': {
                  color: `${
                     highlighted === date ? '#6172F3' : '#1570EF'
                  } !important`,
                  fontFamily: `${
                     highlighted === date
                        ? 'Nunito Sans ExtraBold'
                        : 'Nunito Sans SemiBold'
                  } !important`,
               },
               'td p, td p span': {
                  color: `${
                     highlighted === date ? '#6172F3' : '#04020B'
                  } !important`,
                  fontFamily: `${
                     highlighted === date
                        ? 'Nunito Sans ExtraBold'
                        : 'Nunito Sans SemiBold'
                  } !important`,
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
                     {link === 'Hourly Stats' ? (
                        <Link
                           href={`/bets?from=${moment(date).tz('GMT').unix()}`}
                           style={{
                              color: secondary[6],
                              textDecoration: 'none',
                           }}
                        >
                           {moment(date).tz('GMT').format(format)}
                        </Link>
                     ) : (
                        <Stack
                           direction="row"
                           alignItems="center"
                           textAlign={'center'}
                           gap={1.5}
                           onClick={() =>
                              highlighted !== date &&
                              moment(date) <= moment() &&
                              setDate(moment(date))
                           }
                        >
                           {moment(date).tz('GMT').format(format)}
                        </Stack>
                     )}
                  </Box>
               </Stack>
            </TableCell>
            <TableCell sx={{ minWidth: '120px' }}>
               <Tooltip
                  title={numeral(data?.registration?.total).format('0,00.[00]')}
               >
                  <Typography sx={{ textAlign: 'center' }}>
                     {numeral(data?.registration?.total).format(
                        '0a.[00]',
                        (n) => (Math.floor(n) * 100) / 100
                     )}
                  </Typography>
               </Tooltip>
            </TableCell>
            <TableCell sx={{ minWidth: '120px' }}>
               <Tooltip
                  title={numeral(data?.uniquePlayers).format('0,00.[00]')}
               >
                  <Typography>
                     {numeral(data?.uniquePlayers).format(
                        '0a.[00]',
                        (n) => (Math.floor(n) * 100) / 100
                     )}
                  </Typography>
               </Tooltip>
            </TableCell>
            <TableCell sx={{ minWidth: '120px' }}>
               <Tooltip title={numeral(data?.ftd).format('0,00.[00]')}>
                  <Typography>
                     {numeral(data?.ftd).format(
                        '0a.[00]',
                        (n) => (Math.floor(n) * 100) / 100
                     )}
                  </Typography>
               </Tooltip>
            </TableCell>
            <TableCell sx={{ minWidth: '120px' }}>
               <Tooltip
                  title={numeral(
                     currencyOption.name === CURENCYTYPE.INUSD || inUSD
                        ? data?.totalDepositAmountInCurrentUSD
                        : data?.totalDepositAmount
                  ).format('0,00.[00]')}
               >
                  <Typography>
                     <PortalCurrencyValue
                        value={
                           currencyOption.name === CURENCYTYPE.INUSD || inUSD
                              ? data?.totalDepositAmountInCurrentUSD
                              : data?.totalDepositAmount
                        }
                        currency={
                           currencyOption.name === CURENCYTYPE.INUSD || inUSD
                              ? 'USD'
                              : ''
                        }
                        format="0a.[00]"
                        textTransform="uppercase"
                        formatter={true}
                        visibleCurrency={true}
                     />
                  </Typography>
               </Tooltip>
            </TableCell>
            <TableCell sx={{ minWidth: '120px' }}>
               <Tooltip
                  title={numeral(
                     currencyOption.name === CURENCYTYPE.INUSD || inUSD
                        ? data?.totalWithdrawAmountInCurrentUSD
                        : data?.totalWithdrawAmount
                  ).format('0,00.[00]')}
               >
                  <Typography>
                     <PortalCurrencyValue
                        value={
                           currencyOption.name === CURENCYTYPE.INUSD || inUSD
                              ? data?.totalWithdrawAmountInCurrentUSD
                              : data?.totalWithdrawAmount
                        }
                        currency={
                           currencyOption.name === CURENCYTYPE.INUSD || inUSD
                              ? 'USD'
                              : ''
                        }
                        format="0a.[00]"
                        textTransform="uppercase"
                        formatter={true}
                        visibleCurrency={true}
                     />
                  </Typography>
               </Tooltip>
            </TableCell>
            <TableCell sx={{ minWidth: '120px' }}>
               <Tooltip
                  title={numeral(
                     currencyOption.name === CURENCYTYPE.INUSD || inUSD
                        ? data?.totalTopupAmountInCurrentUSD
                        : data?.totalTopupAmount
                  ).format('0,00.[00]')}
               >
                  <Typography>
                     <PortalCurrencyValue
                        value={
                           currencyOption.name === CURENCYTYPE.INUSD || inUSD
                              ? data?.totalTopupAmountInCurrentUSD
                              : data?.totalTopupAmount
                        }
                        currency={
                           currencyOption.name === CURENCYTYPE.INUSD || inUSD
                              ? 'USD'
                              : ''
                        }
                        format="0a.[00]"
                        textTransform="uppercase"
                        formatter={true}
                        visibleCurrency={true}
                     />
                  </Typography>
               </Tooltip>
            </TableCell>
            <TableCell sx={{ textTransform: 'uppercase', minWidth: '120px' }}>
               <Tooltip title={numeral(data?.betCount).format('0,00.[00]')}>
                  <Typography textAlign={'center'}>
                     {numeral(data?.betCount).format(
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
                  title={numeral(
                     currencyOption.name === CURENCYTYPE.INUSD || inUSD
                        ? data?.totalBetAmountInCurrentUSD
                        : data?.totalBetAmount
                  ).format('0,00.[00]')}
               >
                  <Typography>
                     <PortalCurrencyValue
                        value={
                           currencyOption.name === CURENCYTYPE.INUSD || inUSD
                              ? data?.totalBetAmountInCurrentUSD
                              : data?.totalBetAmount
                        }
                        currency={
                           currencyOption.name === CURENCYTYPE.INUSD || inUSD
                              ? 'USD'
                              : ''
                        }
                        color={highlighted === date ? '#6172F3' : '#04020B'}
                        disableColor={true}
                        formatter={true}
                        format="0a.[00]"
                        textTransform="uppercase"
                        visibleCurrency={true}
                     />
                  </Typography>
               </Tooltip>
            </TableCell>
            <TableCell sx={{ minWidth: '120px' }}>
               <Tooltip title={numeral(plAmount).format('0,00.[00]')}>
                  <Typography>
                     <PortalCurrencyValue
                        value={plAmount}
                        currency={
                           currencyOption.name === CURENCYTYPE.INUSD || inUSD
                              ? 'USD'
                              : ''
                        }
                        color={highlighted === date ? '#6172F3' : '#04020B'}
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
   )
}

export const PortalReportData: FC<{
   rows: {}[]
   linkLabel: string
   format: string
   isLoading: boolean
   playerId?: string
   link?: string
   setDate?: Function
   highlighted?: number
   noChart?: boolean
   inUSD?: boolean
}> = ({
   rows,
   linkLabel,
   isLoading,
   format,
   link,
   playerId,
   setDate,
   highlighted,
   noChart,
   inUSD,
}) => {
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const tableBodyRef = useRef<HTMLTableElement | null>(null)
   const [isScrolled, setIsScrolled] = useState(false)
   const currencyOption = useSelector(selectAuthCurrencyOption)
   const currency: string = useSelector(selectAuthCurrenturrency) || ''
   let currencyReport = currency
   if (currencyOption?.value !== 0 || inUSD) {
      currencyReport =
         currencyOption.name == CURENCYTYPE.INUSD || inUSD
            ? 'totalInUSD'
            : 'totalInEUR'
   }
   const [datashow, setDatashow] = React.useState(DataType.TABLE)
   const tableLabels = [
      linkLabel,
      'Signup',
      'Active Players',
      'FTD',
      'Deposit',
      'Withdraw',
      'Top Up',
      'Bets',
      'Bets Amount',
      'PL',
   ]

   useEffect(() => {
      const handleScroll = () => {
         const tableBody = tableBodyRef.current
         if (tableBody) {
            const { scrollLeft } = tableBody

            // Synchronize the horizontal scroll position of the thead and tbody
            const header = tableBody.querySelectorAll('.sticky-header')
            if (header) {
               header[0].scrollLeft = scrollLeft
            }

            setIsScrolled(scrollLeft > 0)
         }
      }

      const tableBody = tableBodyRef.current
      if (tableBody) {
         tableBody.addEventListener('scroll', handleScroll)

         return () => {
            tableBody.removeEventListener('scroll', handleScroll)
         }
      }
   }, [])

   return (
      <Card
         sx={{
            p: 0,
            borderRadius: '16px',
         }}
      >
         {datashow === DataType.TABLE ? (
            <TableContainer sx={{ boxShadow: 'none' }} ref={tableBodyRef}>
               <Table
                  size="small"
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
                        th: {
                           textTransform: 'capitalize',
                        },
                        width: isDesktop
                           ? 'calc(100% - 245px)'
                           : 'calc(100% - 12px)',
                        top: isDesktop ? '100px !important' : '80px !important',
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
                           let data = []
                           switch (currencyOption.name) {
                              case CURENCYTYPE.ORIGINAL:
                                 data = item.data && item.data[currency]
                                 break
                              case CURENCYTYPE.INUSD:
                                 data = item.data?.totalInUSD
                                 break
                              case CURENCYTYPE.INEUR:
                                 data = item.data?.totalInEUR
                                 break
                              default:
                                 break
                           }
                           if (inUSD) {
                              data = item.data?.totalInUSD
                           }
                           return (
                              <Item
                                 key={`${item.from}`}
                                 date={item.from}
                                 data={data}
                                 players={item.uniquePlayers}
                                 link={link}
                                 format={format}
                                 playerId={playerId}
                                 highlighted={highlighted}
                                 isLoading={isLoading}
                                 linkLabel={linkLabel}
                                 setDate={setDate}
                                 inUSD={inUSD}
                              />
                           )
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
            <PortalStatsLineChartReports
               rows={rows as Report[]}
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
   )
}
