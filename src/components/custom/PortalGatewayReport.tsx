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
import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import {
   selectAuthCurrencyOption,
   selectAuthCurrentOperator,
   selectAuthCurrenturrency,
} from 'redux/authSlice'
import { CURENCYTYPE, DataType } from 'types'
import PortalStatsLineChartReports from './PortalStatsLineChartReports'
const Item = ({
   keyData,
   date,
   data,
   format,
   link,
   setDate,
   highlighted,
   players,
}: any) => {
   const theme = useTheme()
   const currencyOption = useSelector(selectAuthCurrencyOption)
   const currency: string = useSelector(selectAuthCurrenturrency) || ''
   const operator = useSelector(selectAuthCurrentOperator) as Operator
   let currencyReport = currency
   if (currencyOption?.value !== 0) {
      currencyReport =
         currencyOption.name == CURENCYTYPE.INUSD ? 'totalInUSD' : 'totalInEUR'
   }
   const plAmount =
      currencyOption.name === CURENCYTYPE.INUSD
         ? data?.totalPlInCurrentUSD || 0
         : data?.totalPl || 0
   const marginAmount =
      currencyOption.name === CURENCYTYPE.INUSD
         ? (data?.totalBetAmountInCurrentUSD -
              data?.totalWinAmountInCurrentUSD) /
           data?.totalBetAmountInCurrentUSD
         : (data?.totalBetAmount - data?.totalWinAmount) / data?.totalBetAmount

   return (
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
         <TableCell component="th" scope="row" width={'80px'} align="left" sx={{ minWidth: '120px' }}>
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
         <TableCell sx={{minWidth: '120px', textTransform: 'uppercase' }}>
            <Tooltip
               title={numeral(data?.totalDepositCount).format('0,00.[00]')}
            >
               <Typography textAlign={'center'}>
                  {numeral(data?.totalDepositCount).format(
                     '0a.[00]',
                     (n) => (Math.floor(n) * 100) / 100
                  )}
               </Typography>
            </Tooltip>
         </TableCell>
         <TableCell sx={{ minWidth: '120px', textTransform: 'uppercase' }}>
            <Tooltip
               title={numeral(data?.totalWithdrawCount).format('0,00.[00]')}
            >
               <Typography textAlign={'center'}>
                  {numeral(data?.totalWithdrawCount).format(
                     '0a.[00]',
                     (n) => (Math.floor(n) * 100) / 100
                  )}
               </Typography>
            </Tooltip>
         </TableCell>
         <TableCell sx={{ minWidth: '120px', textTransform: 'uppercase' }}>
            <Tooltip title={numeral(data?.totalTopupCount).format('0,00.[00]')}>
               <Typography textAlign={'center'}>
                  {numeral(data?.totalTopupCount).format(
                     '0a.[00]',
                     (n) => (Math.floor(n) * 100) / 100
                  )}
               </Typography>
            </Tooltip>
         </TableCell>
         <TableCell
            sx={{
               minWidth: '120px',
               color:
                  marginAmount > 0
                     ? theme.palette.success.main
                     : theme.palette.error.main,
            }}
         >
            <Tooltip
               title={numeral(
                  currencyOption.name === CURENCYTYPE.INUSD
                     ? data?.totalDepositAmountInCurrentUSD || 0
                     : data?.totalDepositAmount || 0
               ).format('0,00.[00]')}
            >
               <Typography>
                  <PortalCurrencyValue
                     value={
                        currencyOption.name === CURENCYTYPE.INUSD
                           ? data?.totalDepositAmountInCurrentUSD || 0
                           : data?.totalDepositAmount || 0
                     }
                     currency={
                        currencyOption.name === CURENCYTYPE.INUSD
                           ? 'USD'
                           : currency
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
         <TableCell
            sx={{
               minWidth: '120px',
               color:
                  marginAmount > 0
                     ? theme.palette.success.main
                     : theme.palette.error.main,
            }}
         >
            <Tooltip
               title={numeral(
                  currencyOption.name === CURENCYTYPE.INUSD
                     ? data?.totalWithdrawAmountInCurrentUSD || 0
                     : data?.totalWithdrawAmount || 0
               ).format('0,00.[00]')}
            >
               <PortalCurrencyValue
                  value={
                     currencyOption.name === CURENCYTYPE.INUSD
                        ? data?.totalWithdrawAmountInCurrentUSD || 0
                        : data?.totalWithdrawAmount || 0
                  }
                  currency={
                     currencyOption.name === CURENCYTYPE.INUSD
                        ? 'USD'
                        : currency
                  }
                  color={highlighted === date ? '#6172F3' : '#04020B'}
                  disableColor={true}
                  format="0a.[00]"
                  textTransform="uppercase"
                  formatter={true}
                  visibleCurrency={true}
               />
            </Tooltip>
         </TableCell>
         <TableCell
            sx={{
               minWidth: '120px',
               color:
                  marginAmount > 0
                     ? theme.palette.success.main
                     : theme.palette.error.main,
            }}
         >
            <Tooltip
               title={numeral(
                  currencyOption.name === CURENCYTYPE.INUSD
                     ? data?.totalTopupAmountInCurrentUSD || 0
                     : data?.totalTopupAmount || 0
               ).format('0,00.[00]')}
            >
               <PortalCurrencyValue
                  value={
                     currencyOption.name === CURENCYTYPE.INUSD
                        ? data?.totalTopupAmountInCurrentUSD || 0
                        : data?.totalTopupAmount || 0
                  }
                  currency={
                     currencyOption.name === CURENCYTYPE.INUSD
                        ? 'USD'
                        : currency
                  }
                  color={highlighted === date ? '#6172F3' : '#04020B'}
                  disableColor={true}
                  format="0a.[00]"
                  textTransform="uppercase"
                  formatter={true}
                  visibleCurrency={true}
               />
            </Tooltip>
         </TableCell>
      </TableRow>
   )
}

export const PortalGatewayReport: FC<{
   rows: {}[]
   linkLabel: string
   format: string
   isLoading: boolean
   playerId?: string
   link?: string
   setDate?: Function
   highlighted?: number
   noChart?: boolean
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
}) => {
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

   const currencyOption = useSelector(selectAuthCurrencyOption)
   const currency: string = useSelector(selectAuthCurrenturrency) || ''
   let currencyReport = currency
   if (currencyOption?.value !== 0) {
      currencyReport =
         currencyOption.name == CURENCYTYPE.INUSD ? 'totalInUSD' : 'totalInEUR'
   }
   const [datashow, setDatashow] = React.useState(DataType.TABLE)
   const tableLabels = [
      linkLabel,
      'Deposits',
      'Withdraws',
      'Top Up',
      'Deposit Amount',
      'Withdraw Amount',
      'Top Up Amount',
   ]
   return (
      <Card
         sx={{
            p: 0,
            borderRadius: '16px',
         }}
      >
         {datashow === DataType.TABLE ? (
            <TableContainer sx={{ boxShadow: 'none' }}>
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
                     sx={{
                        th: {
                           textTransform: 'capitalize',
                        },
                        width: isDesktop
                           ? 'calc(100% - 245px)'
                           : 'calc(100% - 12px)',
                        top: isDesktop ? '92px !important' : '80px !important',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                     }}
                  >
                     <TableRow>
                        {tableLabels?.map((label: string, index: number) => (
                           <TableCell
                              key={`${label}${index}`}
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
                        rows.map((item: any, index: number) => {
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
                           return (
                              <Item
                                 key={
                                    `${
                                       item &&
                                       item.from &&
                                       item.from !== undefined
                                          ? `${item.from}${index}`
                                          : `empty${index}`
                                    }` || `empty${index}`
                                 }
                                 keyData={
                                    `${
                                       item &&
                                       item.from &&
                                       item.from !== undefined
                                          ? `${item.from}${index}`
                                          : `empty${index}`
                                    }` || `empty${index}`
                                 }
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
         ) : (
            <PortalStatsLineChartReports
               rows={rows as Report[]}
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
