import { BetStatus, Brand } from '@alienbackoffice/back-front'
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
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material'
import { ImoonGray, secondary } from 'colors'
import React, { FC } from 'react'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
} from 'services/globalFunctions'
import { DataType } from 'types'
import PortalCopyValue from './PortalCopyValue'
import {
   renderBetAmountCell,
   renderBrandCell,
   renderCurrencyCell,
   renderGameCell,
   renderModeCell,
   renderWinStatusCell,
} from './PortalRenderCells'
const Item = ({ keyData, data, title, type, opFullId }: any) => {
   const theme = useTheme()
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
               color: `${
                  title === 'All Operators' ? '#000' : '#1570EF'
               } !important`,
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
                  >
                     <PortalCopyValue
                        value={title}
                        hideText
                        sx={{
                           mr: 1,
                        }}
                     />
                  </Stack>
               </Box>
            </Stack>
         </TableCell>
         <TableCell sx={{ minWidth: '120px' }}>
            <PortalCopyValue
               value={data.playerId || ''}
               href={`/players/details?id=${data.playerId}&opId=${data.opId}`}
               sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  maxWidth: '300px',
                  justifyContent: 'center !important',
                  textAlign: 'center !important',
               }}
            />
         </TableCell>
         <TableCell sx={{ minWidth: '120px' }}>
            <PortalCopyValue
               value={data.playerNickname || ''}
               href={`/players/details?id=${data.playerId}&opId=${data.opId}`}
               sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  maxWidth: '300px',
                  justifyContent: 'center !important',
                  textAlign: 'center !important',
               }}
            />
         </TableCell>
         <TableCell sx={{ minWidth: '120px' }}>
            <Typography
               sx={{
                  wordBreak: 'keep-all',
               }}
            >
               {data.operator}
            </Typography>
         </TableCell>
         <TableCell sx={{ minWidth: '120px' }}>
            {renderBrandCell(data.opId, data.brandId, data.brandName)}
         </TableCell>
         <TableCell
            sx={{
               minWidth: '120px',
               textAlign: 'center',
               '.MuiStack-root': {
                  justifyContent: 'center',
               },
            }}
         >
            {renderGameCell(data.gameId, data.gameTitle)}
         </TableCell>
         <TableCell
            sx={{
               minWidth: '120px',
               textAlign: 'center',
               '.MuiStack-root': {
                  justifyContent: 'center',
               },
            }}
         >
            {renderCurrencyCell(data.currency)}
         </TableCell>
         <TableCell sx={{ minWidth: '120px' }}>
            <Typography
               sx={{
                  wordBreak: 'keep-all',
               }}
            >
               {renderModeCell(data.mode, data.insurance, data.autoCashout)}
            </Typography>
         </TableCell>
         <TableCell sx={{ textTransform: 'uppercase', minWidth: '100px' }}>
            {renderBetAmountCell(data.betsAmount, data.currency)}
         </TableCell>
         <TableCell sx={{ textTransform: 'uppercase', minWidth: '100px' }}>{`${
            data?.odds
         }x${
            data?.mode === 'range' ? ` ~ ${data.oddsRange}x` : ''
         }`}</TableCell>
         <TableCell sx={{ textTransform: 'uppercase', minWidth: '100px' }}>
            {renderWinStatusCell(
               data.status,
               `${
                  data.winOdds
                     ? (Math.floor(data.winOdds * 100) / 100).toFixed(2)
                     : (Math.floor(0 * 100) / 100).toFixed(2)
               }x`
            )}
         </TableCell>
      </TableRow>
   ) : (
      <>{keyData}</>
   )
}

export const PortalRealTimeTable: FC<{
   rows: {
      betId: string
      playerNickname?: string
      playerId: string
      operator: string
      brandId?: string
      brandName?: string
      gameId: string
      gameTitle: string
      currency: string
      mode: string
      betsAmount: number
      odds: number
      oddsRange: number
      winOdds: number
      opId: string
      insurance: boolean
      autoCashout: boolean
      status: BetStatus
   }[]
   linkLabel: string
   isLoading: boolean
   noChart?: boolean
   brands?: Brand[]
}> = ({ rows, isLoading, linkLabel, noChart, brands }) => {
   const theme = useTheme()
   const [datashow, setDatashow] = React.useState(DataType.TABLE)
   const [dataRows, setDataRows] = React.useState(rows)
   const [sortItem, setSortItem] = React.useState(
      {} as {
         field: string
         desc: number
      }
   )

   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

   const tableLabels = [
      linkLabel,
      'Player Id',
      'Player Nickname',
      'Operator',
      'Brand',
      'Game ID',
      'Currency',
      'Mode',
      'Bets Amount',
      'Odds',
      'Win',
   ]
   React.useEffect(() => {
      let sortedDataRows = rows
      if (Array.isArray(rows)) {
         switch (sortItem.field) {
            case linkLabel:
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort((a, b) => a.betId.localeCompare(b.betId))
                     : [...rows].sort((a, b) => b.betId.localeCompare(a.betId))
               break
            case 'Player Id':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort((a, b) =>
                          a.playerId.localeCompare(b.playerId)
                       )
                     : [...rows].sort((a, b) =>
                          b.playerId.localeCompare(a.playerId)
                       )

               break
            case 'Player Nickname':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort((a, b) =>
                          (a.playerNickname ?? '').localeCompare(
                             b.playerNickname ?? ''
                          )
                       )
                     : [...rows].sort((a, b) =>
                          (b.playerNickname ?? '').localeCompare(
                             a.playerNickname ?? ''
                          )
                       )

               break
            case 'Operator':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort((a, b) => a.opId.localeCompare(b.opId))
                     : [...rows].sort((a, b) => b.opId.localeCompare(a.opId))

               break
            case 'Brand':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort((a, b) =>
                          (a.brandId ?? '').localeCompare(b.brandId ?? '')
                       )
                     : [...rows].sort((a, b) =>
                          (b.brandId ?? '').localeCompare(a.brandId ?? '')
                       )

               break
            case 'Game ID':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort((a, b) =>
                          a.gameId.localeCompare(b.gameId)
                       )
                     : [...rows].sort((a, b) =>
                          b.gameId.localeCompare(a.gameId)
                       )

               break
            case 'Currency':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort((a, b) =>
                          a.currency.localeCompare(b.currency)
                       )
                     : [...rows].sort((a, b) =>
                          b.currency.localeCompare(a.currency)
                       )

               break
            case 'Mode':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort((a, b) => a.mode.localeCompare(b.mode))
                     : [...rows].sort((a, b) => b.mode.localeCompare(a.mode))

               break
            case 'Bets Amount':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort((a, b) => a.betsAmount - b.betsAmount)
                     : [...rows].sort((a, b) => b.betsAmount - a.betsAmount)

               break
            case 'Odds':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort((a, b) => a.odds - b.odds)
                     : [...rows].sort((a, b) => b.odds - a.odds)

               break
            case 'Win':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort((a, b) => a.winOdds - b.winOdds)
                     : [...rows].sort((a, b) => b.winOdds - a.winOdds)

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
         <TableContainer
            sx={{ boxShadow: 'none', height: 450, overflowY: 'auto' }}
         >
            <Table
               stickyHeader
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
                     position: 'sticky',
                     top: 0,
                     zIndex: 1,
                     th: {
                        textTransform: 'capitalize',
                     },
                     width: isDesktop
                        ? 'calc(100% - 245px)'
                        : 'calc(100% - 12px)',
                     borderTopLeftRadius: '8px',
                     borderTopRightRadius: '8px',
                  }}
               >
                  <TableRow>
                     {tableLabels?.map((label: string, index: number) => (
                        <TableCell
                           key={`${label}${index}`}
                           align={'left'}
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
                     dataRows.map(
                        (
                           item: {
                              betId: string
                              playerNickname?: string
                              playerId: string
                              operator: string
                              brandId?: string
                              brandName?: string
                              gameId: string
                              gameTitle: string
                              currency: string
                              mode: string
                              betsAmount: number
                              odds: number
                              oddsRange: number
                              winOdds: number
                              opId: string
                              insurance: boolean
                              autoCashout: boolean
                              status: BetStatus
                           },
                           index: number
                        ) => {
                           return (
                              <Item
                                 key={`${item.betId}` || `empty${index}`}
                                 keyData={`${item.betId}` || `empty${index}`}
                                 title={item.betId}
                                 data={item}
                                 isLoading={isLoading}
                                 type={linkLabel}
                              />
                           )
                        }
                     )
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
