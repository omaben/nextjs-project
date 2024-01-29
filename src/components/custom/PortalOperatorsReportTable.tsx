import PortalCurrencyValue from '@/components/custom/PortalCurrencyValue'
import { Brand } from '@alienbackoffice/back-front'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faExpand } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
import numeral from 'numeral'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import {
   saveCurrentBrand,
   saveCurrentOp,
   selectAuthCurrencyOption
} from 'redux/authSlice'
import { store } from 'redux/store'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
} from 'services/globalFunctions'
import { CURENCYTYPE, DataType } from 'types'
import { useGetOperatorQuery } from '../data/operators/lib/hooks/queries'
const Item = ({
   keyData,
   data,
   format,
   isLoading,
   highlighted,
   title,
   type,
   opFullId,
   brands,
}: any) => {
   const theme = useTheme()
   const currencyOption = useSelector(selectAuthCurrencyOption)
   const plAmount = data?.totalPlInCurrentUSD || 0
   const marginAmount =
      currencyOption.name === CURENCYTYPE.INUSD
         ? (data?.totalBetAmountInCurrentUSD -
              data?.totalWinAmountInCurrentUSD) /
           data?.totalBetAmountInCurrentUSD
         : (data?.totalBetAmount - data?.totalWinAmount) / data?.totalBetAmount

   const titleOpId = title && title.split('-')[0]
   const fullBrandId =
      brands && brands.find((item: Brand) => item.brandId === title)?.brandName
   const handleUpdateOperator = () => {
      if (type === 'Brands') {
         store.dispatch(
            saveCurrentBrand(title === 'All' ? 'All Brands' : (title as string))
         )
      } else {
         if (title === 'All Operators') {
            return
         }
         store.dispatch(saveCurrentOp(title.split('-')[0] as string))
      }
   }
   useGetOperatorQuery({
      opId: type === 'Brands' ? null : highlighted,
      key: 'navBar',
   })
   return keyData ? (
      <TableRow
         key={`${keyData}Data`}
         sx={{
            fontSize: theme.breakpoints.down('sm') ? '10px' : '12px',
            th: {
               background: `${theme.palette.background.paper}!important`,
            },
            '.MuiTableCell-root': {
               padding: '5px',
            },
            '&:nth-of-type(odd), &:nth-of-type(odd) tr th': {
               background: `${
                  highlighted === titleOpId ? '#E0EAFF' : '#F6F5F9'
               }!important`,
            },
            '&:nth-of-type(odd) th': {
               background: `${
                  highlighted === titleOpId ? '#E0EAFF' : '#F6F5F9'
               }!important`,
            },
            '&:nth-of-type(even) th': {
               background: `${
                  highlighted === titleOpId
                     ? '#E0EAFF'
                     : theme.palette.background.paper
               }!important`,
            },

            '&:nth-of-type(even), &:nth-of-type(even) tr th': {
               background: `${
                  highlighted === titleOpId
                     ? '#E0EAFF'
                     : theme.palette.background.paper
               }!important`,
            },
            'th .MuiStack-root, th a': {
               color: `${
                  title === 'All Operators'
                     ? '#000'
                     : highlighted === titleOpId
                     ? '#6172F3'
                     : '#1570EF'
               } !important`,
               fontFamily: `${
                  highlighted === titleOpId
                     ? 'Nunito Sans ExtraBold'
                     : 'Nunito Sans SemiBold'
               } !important`,
            },
            'td p, td p span': {
               color: `${
                  highlighted === titleOpId ? '#6172F3' : '#04020B'
               } !important`,
               fontFamily: `${
                  highlighted === titleOpId
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
                     color: `${
                        title !== 'All Operators' ? secondary[6] : '#000'
                     } !important`,
                     paddingLeft: '10px',
                     cursor: `${
                        title !== 'All Operators' ? 'pointer' : 'initial'
                     }`,
                  }}
                  textAlign={'center'}
               >
                  <Stack
                     direction="row"
                     alignItems="center"
                     textAlign={'center'}
                     gap={1.5}
                     onClick={() => {
                        highlighted !== title.split('-')[0] &&
                           handleUpdateOperator()
                     }}
                  >
                     {opFullId ||
                        (fullBrandId && `${title}-${fullBrandId}`) ||
                        title}
                  </Stack>
               </Box>
            </Stack>
         </TableCell>
         <TableCell sx={{ minWidth: '120px' }}>
            <Tooltip
               title={numeral(data?.registration?.total).format('0,00.[00]')}
            >
               <Typography sx={{ wordBreak: 'keep-all', textAlign: 'center' }}>
                  {numeral(data?.registration?.total).format(
                     '0a.[00]',
                     (n) => (Math.floor(n) * 100) / 100
                  )}
               </Typography>
            </Tooltip>
         </TableCell>
         <TableCell sx={{ minWidth: '120px' }}>
            <Tooltip title={numeral(data?.uniquePlayers).format('0,00.[00]')}>
               <Typography
                  sx={{
                     wordBreak: 'keep-all',
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
            <Tooltip title={numeral(data?.ftd).format('0,00.[00]')}>
               <Typography
                  sx={{
                     wordBreak: 'keep-all',
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
               title={numeral(data?.totalDepositAmountInCurrentUSD).format(
                  '0,00.[00]'
               )}
            >
               <Typography
                  sx={{
                     wordBreak: 'keep-all',
                  }}
               >
                  <PortalCurrencyValue
                     value={data?.totalDepositAmountInCurrentUSD || 0}
                     currency={'USD'}
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
               title={numeral(data?.totalWithdrawAmountInCurrentUSD).format(
                  '0,00.[00]'
               )}
            >
               <Typography
                  sx={{
                     wordBreak: 'keep-all',
                  }}
               >
                  <PortalCurrencyValue
                     value={data?.totalWithdrawAmountInCurrentUSD || 0}
                     currency={'USD'}
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
               title={numeral(data?.totalTopupAmountInCurrentUSD).format(
                  '0,00.[00]'
               )}
            >
               <Typography
                  sx={{
                     wordBreak: 'keep-all',
                  }}
               >
                  <PortalCurrencyValue
                     value={data?.totalTopupAmountInCurrentUSD || 0}
                     currency={'USD'}
                     format="0a.[00]"
                     textTransform="uppercase"
                     formatter={true}
                     visibleCurrency={true}
                  />
               </Typography>
            </Tooltip>
         </TableCell>
         <TableCell sx={{ textTransform: 'uppercase', minWidth: '100px' }}>
            <Tooltip title={numeral(data?.betCount).format('0,00.[00]')}>
               <Typography
                  textAlign={'center'}
                  sx={{
                     wordBreak: 'keep-all',
                  }}
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
               title={numeral(data?.totalBetAmountInCurrentUSD || 0).format(
                  '0,00.[00]'
               )}
            >
               <Typography
                  sx={{
                     wordBreak: 'keep-all',
                  }}
               >
                  <PortalCurrencyValue
                     value={data?.totalBetAmountInCurrentUSD || 0}
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
            <Tooltip title={numeral(plAmount).format('0,00.[00]')}>
               <Typography
                  sx={{
                     wordBreak: 'keep-all',
                  }}
               >
                  <PortalCurrencyValue
                     value={plAmount}
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
   ) : (
      <>{keyData}</>
   )
}

export const PortalOperatorsReportTable: FC<{
   rows: any[]
   linkLabel: string
   isLoading: boolean
   highlighted: string
   noChart?: boolean
   brands?: Brand[]
}> = ({ rows, isLoading, linkLabel, highlighted, noChart, brands }) => {
   const theme = useTheme()
   const [datashow, setDatashow] = React.useState(DataType.TABLE)
   const [dataRows, setDataRows] = React.useState(rows) as any[]
   const [sortItem, setSortItem] = React.useState(
      {} as {
         field: string
         desc: number
      }
   )

   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const tableLabels = [
      linkLabel,

      // 'Number of Players',
      'Signup',
      'Active Players',
      'FTD',
      'Deposit',
      'Withdraw',
      'Top Up',
      'Total Bets',
      'Bets Amount',
      'PL',
   ]
   React.useEffect(() => {
      let sortedDataRows = rows
      if (Array.isArray(rows)) {
         switch (sortItem.field) {
            case linkLabel:
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort((a, b) => a.from - b.from)
                     : [...rows].sort((a, b) => b.from - a.from)
               break
            case 'Signup':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort(
                          (a, b) =>
                             a.data.totalInUSD.registration.total -
                             b.data.totalInUSD.registration.total
                       )
                     : [...rows].sort(
                          (a, b) =>
                             b.data.totalInUSD.registration.total -
                             a.data.totalInUSD.registration.total
                       )
               break
            case 'Active Players':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort(
                          (a, b) =>
                             a.data.totalInUSD.uniquePlayers -
                             b.data.totalInUSD.uniquePlayers
                       )
                     : [...rows].sort(
                          (a, b) =>
                             b.data.totalInUSD.uniquePlayers -
                             a.data.totalInUSD.uniquePlayers
                       )
               break
            case 'FTD':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort(
                          (a, b) =>
                             a.data.totalInUSD.ftd - b.data.totalInUSD.ftd
                       )
                     : [...rows].sort(
                          (a, b) =>
                             b.data.totalInUSD.ftd - a.data.totalInUSD.ftd
                       )
               break
            case 'Deposit':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort(
                          (a, b) =>
                             a.data.totalInUSD.totalDepositAmountInCurrentUSD -
                             b.data.totalInUSD.totalDepositAmountInCurrentUSD
                       )
                     : [...rows].sort(
                          (a, b) =>
                             b.data.totalInUSD.totalDepositAmountInCurrentUSD -
                             a.data.totalInUSD.totalDepositAmountInCurrentUSD
                       )
               break
            case 'Withdraw':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort(
                          (a, b) =>
                             a.data.totalInUSD.totalWithdrawAmountInCurrentUSD -
                             b.data.totalInUSD.totalWithdrawAmountInCurrentUSD
                       )
                     : [...rows].sort(
                          (a, b) =>
                             b.data.totalInUSD.totalWithdrawAmountInCurrentUSD -
                             a.data.totalInUSD.totalWithdrawAmountInCurrentUSD
                       )
               break
            case 'Top Up':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort(
                          (a, b) =>
                             a.data.totalInUSD.totalTopupAmountInCurrentUSD -
                             b.data.totalInUSD.totalTopupAmountInCurrentUSD
                       )
                     : [...rows].sort(
                          (a, b) =>
                             b.data.totalInUSD.totalTopupAmountInCurrentUSD -
                             a.data.totalInUSD.totalTopupAmountInCurrentUSD
                       )
               break
            case 'Total Bets':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort(
                          (a, b) =>
                             a.data.totalInUSD.betCount -
                             b.data.totalInUSD.betCount
                       )
                     : [...rows].sort(
                          (a, b) =>
                             b.data.totalInUSD.betCount -
                             a.data.totalInUSD.betCount
                       )
               break
            case 'Bets Amount':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort(
                          (a, b) =>
                             a.data.totalInUSD.totalBetAmountInCurrentUSD -
                             b.data.totalInUSD.totalBetAmountInCurrentUSD
                       )
                     : [...rows].sort(
                          (a, b) =>
                             b.data.totalInUSD.totalBetAmountInCurrentUSD -
                             a.data.totalInUSD.totalBetAmountInCurrentUSD
                       )
               break
            case 'PL':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort(
                          (a, b) =>
                             a.data.totalInUSD.totalPlInCurrentUSD -
                             b.data.totalInUSD.totalPlInCurrentUSD
                       )
                     : [...rows].sort(
                          (a, b) =>
                             b.data.totalInUSD.totalPlInCurrentUSD -
                             a.data.totalInUSD.totalPlInCurrentUSD
                       )
               break
            default:
               break
         }
      } else {
         // Handle the case when rows is not an array.
      }
      setDataRows(sortedDataRows)
   }, [sortItem, rows])
   return (
      <Card
         sx={{
            p: 0,
            borderRadius: '16px',
         }}
      >
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
                     top: isDesktop ? '100px !important' : '80px !important',
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
                           <Typography
                              component="h6"
                              sx={{
                                 cursor: 'pointer',
                                 display: 'inline-block',
                              }}
                              onClick={() =>
                                 setSortItem({
                                    field: label,
                                    desc:
                                       sortItem.field === label
                                          ? sortItem.desc === 1
                                             ? -1
                                             : 1
                                          : 1,
                                 })
                              }
                           >
                              {label}

                              {sortItem.field === label ? (
                                 sortItem.desc === 1 ? (
                                    <CustomMenuSortAscendingIcon />
                                 ) : sortItem.desc === -1 ? (
                                    <CustomMenuSortDescendingIcon />
                                 ) : (
                                    <CustomMenuSortIcon />
                                 )
                              ) : (
                                 <CustomMenuSortIcon />
                              )}
                           </Typography>
                        </TableCell>
                     ))}
                  </TableRow>
               </TableHead>
               <TableBody>
                  {!isLoading ? (
                     dataRows &&
                     dataRows.map((item: any, index: number) => {
                        let data = []
                        // switch (currencyOption.name) {
                        //    case CURENCYTYPE.ORIGINAL:
                        //       data = item.data && item.data[currency]
                        //       break
                        //    case CURENCYTYPE.INUSD:
                        //       data = item.data?.totalInUSD
                        //       break
                        //    case CURENCYTYPE.INEUR:
                        //       data = item.data?.totalInEUR
                        //       break
                        //    default:
                        //       break
                        // }
                        data = item.data?.totalInUSD

                        return (
                           <Item
                              key={
                                 `${
                                    item && item.from && item.from !== undefined
                                       ? `${item.from}${index}`
                                       : `empty${index}`
                                 }` || `empty${index}`
                              }
                              keyData={`${
                                 item && item.from && item.from !== undefined
                                    ? `${item.from}${index}`
                                    : `empty${index}`
                              }` || `empty${index}`}
                              title={item.from}
                              data={data}
                              opFullId={item?.opFullId || ''}
                              isLoading={isLoading}
                              highlighted={highlighted}
                              type={linkLabel}
                              brands={brands}
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
