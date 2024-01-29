import PortalCurrencyValue from '@/components/custom/PortalCurrencyValue'
import {
   FinancialReportData,
   IntegrationType,
   Operator,
} from '@alienbackoffice/back-front'
import {
   Box,
   Card,
   CardHeader,
   CircularProgress,
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
import { secondary } from 'colors'
import moment from 'moment'
import Link from 'next/link'
import numeral from 'numeral'
import { FC } from 'react'
import { useSelector } from 'react-redux'
import {
   selectAuthCurrencyOption,
   selectAuthCurrentOperator,
   selectAuthCurrenturrency,
} from 'redux/authSlice'
import { CURENCYTYPE } from 'types'
const Item = ({
   date,
   data,
   mode,
   rounds,
   format,
   isLoading,
   link,
   playerId,
   linkLabel,
   setDate,
   highlighted,
   players,
}: any) => {
   const theme = useTheme()
   const currencyOption = useSelector(selectAuthCurrencyOption)
   const plAmount =
      currencyOption.name === CURENCYTYPE.INUSD
         ? data?.totalPlInCurrentUSD
         : data?.totalPl
   const marginAmount =
      currencyOption.name === CURENCYTYPE.INUSD
         ? (data?.totalBetAmountInCurrentUSD -
              data?.totalWinAmountInCurrentUSD) /
           data?.totalBetAmountInCurrentUSD
         : (data?.totalBetAmount - data?.totalWinAmount) / data?.totalBetAmount
   let hexOdd =
      highlighted === date
         ? theme.palette.info.main
         : theme.palette.background.default

   // Convert each hex character pair into an integer
   let redOdd = parseInt(hexOdd.substring(1, 3), 16)
   let greenOdd = parseInt(hexOdd.substring(3, 5), 16)
   let blueOdd = parseInt(hexOdd.substring(5, 7), 16)
   let opacity = highlighted === date ? 0.2 : 1

   let hexEven =
      highlighted === date
         ? theme.palette.info.main
         : theme.palette.background.paper
   let redEven = parseInt(hexEven.substring(1, 3), 16)
   let greenEven = parseInt(hexEven.substring(3, 5), 16)
   let blueEven = parseInt(hexEven.substring(5, 7), 16)
   let rgbaOdd = ` rgba(${redOdd}, ${greenOdd}, ${blueOdd}, ${opacity})`
   let rgbaEven = ` rgba(${redEven}, ${greenEven}, ${blueEven}, ${opacity})`
   const operator = useSelector(selectAuthCurrentOperator) as Operator
   return (
      <>
         <TableRow
            key={`${date}Data`}
            sx={{
               opacity: moment(date) <= moment() ? 1 : 0.4,
               '&:nth-of-type(odd)': {
                  background: rgbaOdd,
               },
               '&:nth-of-type(even)': {
                  backgroundColor: rgbaEven,
               },
               // hide last border
               'td, th': {
                  border: 0,
                  textAlign: 'center',
                  alignContent: 'center',
               },
            }}
         >
            <TableCell component="th" scope="row" width={'120px'}>
               <Stack
                  direction="row"
                  gap={2}
                  alignItems="center"
                  textTransform="capitalize"
               >
                  <Box
                     sx={{
                        color: `${secondary[6]} !important`,
                        cursor: moment(date) <= moment() ? 'pointer' : 'auto',
                        margin: '0 auto',
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
                           {/* <FontAwesomeIcon icon={faClock} /> */}
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
                           {/* <FontAwesomeIcon icon={faClock} /> */}
                           {moment(date).tz('GMT').format(format)}
                        </Stack>
                     )}
                  </Box>
               </Stack>
            </TableCell>
            <TableCell sx={{ textTransform: 'uppercase' }}>
               <Tooltip title={numeral(data?.betCount).format('0,00.[00]')}>
                  <Typography>
                     {numeral(data?.betCount).format(
                        '0a.[00]',
                        (n) => (Math.floor(n) * 100) / 100
                     )}
                  </Typography>
               </Tooltip>
            </TableCell>
            {/* <TableCell>
               <Tooltip title={numeral(0).format('0,00.[00]')}>
                  <Typography>
                     {numeral(0).format(
                        '0a.[00]',
                        (n) => (Math.floor(n) * 100) / 100
                     )}
                  </Typography>
               </Tooltip>
            </TableCell> */}
            <TableCell>
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
            <TableCell
               sx={{
                  color:
                     marginAmount > 0
                        ? theme.palette.success.main
                        : theme.palette.error.main,
               }}
            >
               <Tooltip
                  title={numeral(
                     currencyOption.name === CURENCYTYPE.INUSD
                        ? data?.totalBetAmountInCurrentUSD
                        : data?.totalBetAmount
                  ).format('0,00.[00]')}
               >
                  <Typography>
                     <PortalCurrencyValue
                        value={
                           currencyOption.name === CURENCYTYPE.INUSD
                              ? data?.totalBetAmountInCurrentUSD
                              : data?.totalBetAmount
                        }
                        currency={
                           currencyOption.name === CURENCYTYPE.INUSD
                              ? 'USD'
                              : ''
                        }
                        format="0a.[00]"
                        textTransform="uppercase"
                        visibleCurrency={true}
                     />
                  </Typography>
               </Tooltip>
            </TableCell>
            <TableCell>
               <Tooltip title={numeral(plAmount).format('0,00.[00]')}>
                  <Typography>
                     <PortalCurrencyValue
                        value={plAmount}
                        currency={
                           currencyOption.name === CURENCYTYPE.INUSD
                              ? 'USD'
                              : ''
                        }
                        format="0a.[00]"
                        textTransform="uppercase"
                        visibleCurrency={true}
                     />
                  </Typography>
               </Tooltip>
            </TableCell>
            {operator?.integrationType === IntegrationType.ALIEN_STANDALONE && (
               <>
                  <TableCell>
                     <Tooltip
                        title={numeral(data?.registration?.total).format(
                           '0,00.[00]'
                        )}
                     >
                        <Typography>
                           {numeral(data?.registration?.total).format(
                              '0a.[00]',
                              (n) => (Math.floor(n) * 100) / 100
                           )}
                        </Typography>
                     </Tooltip>
                  </TableCell>
                  <TableCell>
                     <Tooltip
                        title={numeral(
                           currencyOption.name === CURENCYTYPE.INUSD
                              ? data?.totalDepositAmountInCurrentUSD
                              : data?.totalDepositAmount
                        ).format('0,00.[00]')}
                     >
                        <Typography>
                           <PortalCurrencyValue
                              value={
                                 currencyOption.name === CURENCYTYPE.INUSD
                                    ? data?.totalDepositAmountInCurrentUSD
                                    : data?.totalDepositAmount
                              }
                              currency={
                                 currencyOption.name === CURENCYTYPE.INUSD
                                    ? 'USD'
                                    : ''
                              }
                              format="0a.[00]"
                              textTransform="uppercase"
                              visibleCurrency={true}
                           />
                        </Typography>
                     </Tooltip>
                  </TableCell>
                  <TableCell>
                     <Tooltip
                        title={numeral(
                           currencyOption.name === CURENCYTYPE.INUSD
                              ? data?.totalWithdrawAmountInCurrentUSD
                              : data?.totalWithdrawAmount
                        ).format('0,00.[00]')}
                     >
                        <Typography>
                           <PortalCurrencyValue
                              value={
                                 currencyOption.name === CURENCYTYPE.INUSD
                                    ? data?.totalWithdrawAmountInCurrentUSD
                                    : data?.totalWithdrawAmount
                              }
                              currency={
                                 currencyOption.name === CURENCYTYPE.INUSD
                                    ? 'USD'
                                    : ''
                              }
                              format="0a.[00]"
                              textTransform="uppercase"
                              visibleCurrency={true}
                           />
                        </Typography>
                     </Tooltip>
                  </TableCell>
               </>
            )}
         </TableRow>
      </>
   )
}

export const PortalOperatorReportTableTime: FC<{
   rows: {}[]
   linkLabel: string
   format: string
   isLoading: boolean
   playerId?: string
   link?: string
   setDate?: Function
   highlighted?: number
}> = ({
   rows,
   linkLabel,
   isLoading,
   format,
   link,
   playerId,
   setDate,
   highlighted,
}) => {
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const currencyOption = useSelector(selectAuthCurrencyOption)
   const operator = useSelector(selectAuthCurrentOperator) as Operator
   const currency: string = useSelector(selectAuthCurrenturrency) || ''
   let currencyReport = currency
   if (currencyOption?.value !== 0) {
      currencyReport =
         currencyOption.name == CURENCYTYPE.INUSD ? 'totalInUSD' : 'totalInEUR'
   }

   const tableLabels = [
      linkLabel,
      'Bets',
      // 'Number of Players',
      'Active Players',
      'Total Bet Amount',
      'Total PL',
   ]
   if (operator?.integrationType === IntegrationType.ALIEN_STANDALONE) {
      tableLabels.push('Registered Players', 'Deposit', 'Withdraw')
   }
   return (
      <Card
         sx={{
            p: 2,
         }}
      >
         <CardHeader title={link} sx={{ px: 0 }} />
         <TableContainer>
            {rows ? (
               <Table
                  size="small"
                  sx={{
                     th: {
                        whiteSpace: 'nowrap',
                     },

                     ...(!isDesktop && {
                        'tr>th:first-of-type,tr>td:nth-of-type(0)': {
                           position: 'sticky',
                           left: 0,
                        },
                        'thead th:first-of-type': {
                           zIndex: 3,
                        },

                        '.MuiTableBody-root .MuiTableRow-root:nth-of-type(odd)>th':
                           {},
                     }),
                     'td, th': {
                        textAlign: 'center',
                        alignContent: 'center',
                     },
                  }}
               >
                  <TableHead
                     sx={{
                        th: {
                           textTransform: 'capitalize',
                        },
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
                           >
                              {label}
                           </TableCell>
                        ))}
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {rows &&
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
                           return (
                              <Item
                                 key={`${item.from}`}
                                 date={item.from}
                                 data={data as FinancialReportData}
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
                        })}
                  </TableBody>
               </Table>
            ) : (
               <Stack
                  minHeight={600}
                  justifyContent="center"
                  alignItems="center"
               >
                  <CircularProgress color="primary" />
               </Stack>
            )}
         </TableContainer>
      </Card>
   )
}
