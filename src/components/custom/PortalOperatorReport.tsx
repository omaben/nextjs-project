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
import {
   IntegrationType,
   Operator,
   Report,
   User,
   UserScope,
} from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faExpand } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import numeral from 'numeral'
import React, { FC, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
   selectAuthCurrencyOption,
   selectAuthCurrentOperator,
   selectAuthCurrenturrency,
} from 'redux/authSlice'
import { getUser } from 'redux/slices/user'
import { handleFormat } from 'services/globalFunctions'
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
}: any) => {
   const theme = useTheme()
   const currencyOption = useSelector(selectAuthCurrencyOption)
   const currency: string = useSelector(selectAuthCurrenturrency) || ''
   const operator = useSelector(selectAuthCurrentOperator) as Operator
   const router = useRouter()

   // Check if the current route's href contains 'detailsB2c'
   const containsDetailsB2c = router.asPath.includes('detailsB2c')
   const user = useSelector(getUser) as User

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
            {operator?.integrationType === IntegrationType.ALIEN_STANDALONE &&
               containsDetailsB2c && (
                  <TableCell sx={{ minWidth: '120px' }}>
                     <Tooltip
                        title={numeral(data?.registration?.total).format(
                           '0,00.[00]'
                        )}
                     >
                        <Typography
                           sx={{ wordBreak: 'keep-all', textAlign: 'center' }}
                        >
                           {numeral(data?.registration?.total).format(
                              '0a.[00]',
                              (n) => (Math.floor(n) * 100) / 100
                           )}
                        </Typography>
                     </Tooltip>
                  </TableCell>
               )}
            {containsDetailsB2c && (
               <TableCell sx={{ minWidth: '120px' }}>
                  <Tooltip
                     title={numeral(data?.uniquePlayers).format('0,00.[00]')}
                  >
                     <Typography
                        sx={{ wordBreak: 'keep-all', textAlign: 'center' }}
                     >
                        {numeral(data?.uniquePlayers).format(
                           '0a.[00]',
                           (n) => (Math.floor(n) * 100) / 100
                        )}
                     </Typography>
                  </Tooltip>
               </TableCell>
            )}

            {operator?.integrationType === IntegrationType.ALIEN_STANDALONE &&
               containsDetailsB2c && (
                  <>
                     <TableCell sx={{ minWidth: '120px' }}>
                        <Tooltip title={numeral(data?.ftd).format('0,00.[00]')}>
                           <Typography
                              sx={{
                                 wordBreak: 'keep-all',
                                 textAlign: 'center',
                              }}
                           >
                              {numeral(data?.ftd).format(
                                 '0a.[00]',
                                 (n) => (Math.floor(n) * 100) / 100
                              )}
                           </Typography>
                        </Tooltip>
                     </TableCell>
                     <TableCell sx={{ minWidth: '120px' }}>
                        <Tooltip
                           title={handleFormat(
                              currencyOption.name === CURENCYTYPE.INUSD || 0
                                 ? data?.totalDepositAmountInCurrentUSD || 0
                                 : data?.totalDepositAmount,
                              currencyOption.name === CURENCYTYPE.INUSD
                                 ? 'USD'
                                 : currency
                           )}
                        >
                           <Typography
                              sx={{
                                 wordBreak: 'keep-all',
                                 textAlign: 'center',
                              }}
                           >
                              <PortalCurrencyValue
                                 value={
                                    currencyOption.name === CURENCYTYPE.INUSD
                                       ? data?.totalDepositAmountInCurrentUSD ||
                                         0
                                       : data?.totalDepositAmount || 0
                                 }
                                 currency={
                                    currencyOption.name === CURENCYTYPE.INUSD
                                       ? 'USD'
                                       : currency
                                 }
                                 format="0a.[00]"
                                 formatter={true}
                                 textTransform="uppercase"
                                 visibleCurrency={true}
                              />
                           </Typography>
                        </Tooltip>
                     </TableCell>
                     <TableCell sx={{ minWidth: '120px' }}>
                        <Tooltip
                           title={handleFormat(
                              currencyOption.name === CURENCYTYPE.INUSD
                                 ? data?.totalWithdrawAmountInCurrentUSD || 0
                                 : data?.totalWithdrawAmount || 0,
                              currencyOption.name === CURENCYTYPE.INUSD
                                 ? 'USD'
                                 : currency
                           )}
                        >
                           <Typography
                              sx={{
                                 wordBreak: 'keep-all',
                                 textAlign: 'center',
                              }}
                           >
                              <PortalCurrencyValue
                                 value={
                                    currencyOption.name === CURENCYTYPE.INUSD
                                       ? data?.totalWithdrawAmountInCurrentUSD ||
                                         0
                                       : data?.totalWithdrawAmount || 0
                                 }
                                 currency={
                                    currencyOption.name === CURENCYTYPE.INUSD
                                       ? 'USD'
                                       : currency
                                 }
                                 format="0a.[00]"
                                 formatter={true}
                                 textTransform="uppercase"
                                 visibleCurrency={true}
                              />
                           </Typography>
                        </Tooltip>
                     </TableCell>
                     <TableCell sx={{ minWidth: '120px' }}>
                        <Tooltip
                           title={handleFormat(
                              currencyOption.name === CURENCYTYPE.INUSD
                                 ? data?.totalTopupAmountInCurrentUSD || 0
                                 : data?.totalTopupAmount || 0,
                              currencyOption.name === CURENCYTYPE.INUSD
                                 ? 'USD'
                                 : currency
                           )}
                        >
                           <Typography
                              sx={{
                                 wordBreak: 'keep-all',
                                 textAlign: 'center',
                              }}
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
                                 format="0a.[00]"
                                 formatter={true}
                                 textTransform="uppercase"
                                 visibleCurrency={true}
                              />
                           </Typography>
                        </Tooltip>
                     </TableCell>
                  </>
               )}
            <TableCell sx={{ textTransform: 'uppercase', minWidth: '120px' }}>
               <Tooltip title={numeral(data?.betCount).format('0,00.[00]')}>
                  <Typography
                     textAlign={'center'}
                     sx={{ wordBreak: 'keep-all', textAlign: 'center' }}
                  >
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
                  title={handleFormat(
                     currencyOption.name === CURENCYTYPE.INUSD
                        ? data?.totalBetAmountInCurrentUSD || 0
                        : data?.totalBetAmount || 0,
                     currencyOption.name === CURENCYTYPE.INUSD
                        ? 'USD'
                        : currency
                  )}
               >
                  <Typography
                     sx={{ wordBreak: 'keep-all', textAlign: 'center' }}
                  >
                     <PortalCurrencyValue
                        value={
                           currencyOption.name === CURENCYTYPE.INUSD
                              ? data?.totalBetAmountInCurrentUSD || 0
                              : data?.totalBetAmount || 0
                        }
                        currency={
                           currencyOption.name === CURENCYTYPE.INUSD
                              ? 'USD'
                              : currency
                        }
                        color={highlighted === date ? '#6172F3' : '#04020B'}
                        disableColor={true}
                        format="0a.[00]"
                        formatter={true}
                        textTransform="uppercase"
                        visibleCurrency={true}
                     />
                  </Typography>
               </Tooltip>
            </TableCell>
            <TableCell sx={{ minWidth: '150px' }}>
               <Tooltip
                  title={handleFormat(
                     plAmount,
                     currencyOption.name === CURENCYTYPE.INUSD
                        ? 'USD'
                        : currency
                  )}
               >
                  <Typography
                     sx={{ wordBreak: 'keep-all', textAlign: 'center' }}
                  >
                     <PortalCurrencyValue
                        value={plAmount}
                        currency={
                           currencyOption.name === CURENCYTYPE.INUSD
                              ? 'USD'
                              : currency
                        }
                        color={highlighted === date ? '#6172F3' : '#04020B'}
                        disableColor={true}
                        format="0a.[00]"
                        formatter={true}
                        textTransform="uppercase"
                        visibleCurrency={true}
                     />
                  </Typography>
               </Tooltip>
            </TableCell>
            {!containsDetailsB2c && user.scope === UserScope.SUPERADMIN && (
               <>
                  <TableCell sx={{ minWidth: '150px' }}>
                     <Tooltip
                        title={handleFormat(
                           5,
                           currencyOption.name === CURENCYTYPE.INUSD
                              ? 'USD'
                              : currency
                        )}
                     >
                        <Typography
                           sx={{ wordBreak: 'keep-all', textAlign: 'center' }}
                        >
                           <PortalCurrencyValue
                              value={5}
                              currency={
                                 currencyOption.name === CURENCYTYPE.INUSD
                                    ? 'USD'
                                    : currency
                              }
                              color={
                                 highlighted === date ? '#6172F3' : '#04020B'
                              }
                              disableColor={true}
                              format="0a.[00]"
                              formatter={true}
                              textTransform="uppercase"
                              visibleCurrency={true}
                           />
                        </Typography>
                     </Tooltip>
                  </TableCell>
                  <TableCell sx={{ minWidth: '150px' }}>
                     <Tooltip title={numeral(5).format('0,00.[00]')}>
                        <Typography
                           textAlign={'center'}
                           sx={{ wordBreak: 'keep-all', textAlign: 'center' }}
                        >
                           {numeral(5).format(
                              '0a.[00]',
                              (n) => (Math.floor(n) * 100) / 100
                           )}
                           %
                        </Typography>
                     </Tooltip>
                  </TableCell>
               </>
            )}
         </TableRow>
      </>
   )
}

export const PortalOperatorReport: FC<{
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

   const isLg = useMediaQuery(theme.breakpoints.up(1130))
   const router = useRouter()
   const user = useSelector(getUser) as User

   // Check if the current route's href contains 'detailsB2c'
   const containsDetailsB2c = router.asPath.includes('detailsB2c')
   const currencyOption = useSelector(selectAuthCurrencyOption)
   const currency: string = useSelector(selectAuthCurrenturrency) || ''
   let currencyReport = currency
   if (currencyOption?.value !== 0) {
      currencyReport =
         currencyOption.name == CURENCYTYPE.INUSD ? 'totalInUSD' : 'totalInEUR'
   }
   const [datashow, setDatashow] = React.useState(DataType.TABLE)
   const operator = useSelector(selectAuthCurrentOperator) as Operator
   const tableLabels = [linkLabel]
   if (
      operator?.integrationType === IntegrationType.ALIEN_STANDALONE &&
      containsDetailsB2c
   ) {
      tableLabels.push('Signup')
   }
   if (containsDetailsB2c) {
      tableLabels.push('Active Players')
   }
   if (
      operator?.integrationType === IntegrationType.ALIEN_STANDALONE &&
      containsDetailsB2c
   ) {
      tableLabels.push('FTD', 'Deposit', 'Withdraw', 'Top Up')
   }
   tableLabels.push('Total Bets', 'Bets Amount', 'PL')
   if (!containsDetailsB2c && user.scope === UserScope.SUPERADMIN) {
      tableLabels.push('Commission', 'Commission Percentage')
   }
   const tableBodyRef = useRef<HTMLTableElement | null>(null)
   const [isScrolled, setIsScrolled] = useState(false)
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
                        top: isLg
                           ? '100px !important'
                           : isDesktop
                           ? '138px !important'
                           : '80px !important',
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
