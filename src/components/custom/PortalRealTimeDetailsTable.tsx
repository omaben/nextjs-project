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
import { ImoonGray, neutral, secondary } from 'colors'
import numeral from 'numeral'
import React, { FC } from 'react'
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
} from 'services/globalFunctions'
import { DataType } from 'types'
import DoughnutChartRealTime from '../pages/dashboard/default/DoughnutChartRealTime'
import { renderBetAmountCell } from './PortalRenderCells'

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
                     {title}
                  </Stack>
               </Box>
            </Stack>
         </TableCell>
         <TableCell sx={{ minWidth: '120px' }}>
            {type === 'Currency' ? (
               <Typography sx={{ wordBreak: 'keep-all', textAlign: 'center' }}>
                  {title === 'USD' ? '' : '$'}
                  {renderBetAmountCell(data?.value, title)}
               </Typography>
            ) : (
               <Tooltip title={numeral(data?.value).format('0,00.[00]')}>
                  <Typography
                     sx={{ wordBreak: 'keep-all', textAlign: 'center' }}
                  >
                     {numeral(data?.value).format(
                        '0a.[00]',
                        (n) => (Math.floor(n) * 100) / 100
                     )}
                  </Typography>
               </Tooltip>
            )}
         </TableCell>
      </TableRow>
   ) : (
      <>{keyData}</>
   )
}

export const PortalRealTimeDetailsTable: FC<{
   rows: { label: string; value: number }[]
   linkLabel: string
   isLoading: boolean
   noChart?: boolean
   brands?: Brand[]
   currency?: boolean
}> = ({ rows, isLoading, linkLabel, noChart, brands, currency }) => {
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

   const tableLabels = [linkLabel]
   if (linkLabel === 'Operator') {
      tableLabels.push('Player')
   } else {
      tableLabels.push('Total')
   }
   React.useEffect(() => {
      let sortedDataRows = rows
      if (Array.isArray(rows)) {
         switch (sortItem.field) {
            case linkLabel:
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort((a, b) =>
                          a.label
                             .split('_')[0]
                             .localeCompare(b.label.split('_')[0])
                       )
                     : [...rows].sort((a, b) =>
                          b.label
                             .split('_')[0]
                             .localeCompare(a.label.split('_')[0])
                       )
               break
            case 'Total':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort((a, b) => a.value - b.value)
                     : [...rows].sort((a, b) => b.value - a.value)
               break
            case 'Player':
               sortedDataRows =
                  sortItem.desc === 1
                     ? [...rows].sort((a, b) => a.value - b.value)
                     : [...rows].sort((a, b) => b.value - a.value)
               break
            default:
               break
         }
      } else {
         // Handle the case when rows is not an array.
      }
      setDataRows(sortedDataRows)
   }, [sortItem, rows])

   const sumTotal = dataRows.reduce((sum, entry) => sum + entry.value, 0) || 0

   const gameColors: { [key: string]: string } = {
      '101': '#36BFFA',
      '102': '#F2C605',
      '103': '#0FC943',
      '104': '#A7F25B',
      '105': '#32D583',
      '1001': '#2E90FA',
      '1002': '#9E77ED',
      '1003': '#F63D68',
      '1004': '#37C6AB',
      '1005': '#F97D00',
      '1006': '#FDB022',
      '1007': '#FB6514',
      '2001': '#12B76A',
   }

   const modeColors: { [key: string]: string } = {
      classic: '#FDB022',
      under: '#F04438',
      over: '#12B76A',
      range: '#36BFFA',
   }
   const statsColors: { [key: string]: string } = {
      Open: '#FDB022',
      Won: '#F04438',
      Lost: '#12B76A',
      Cashback: '#36BFFA',
   }
   // data: dataRows.map((item) => (item.value / sumTotal) * 100),
   const data = {
      labels: dataRows.map((item) => item.label),
      datasets: [
         {
            data: dataRows.map((item) => item.value),
            borderWidth: 2,
            backgroundColor:
               linkLabel === 'Bet Per Game'
                  ? dataRows.map((item) => gameColors[item.label.split('_')[0]])
                  : linkLabel === 'Bet Per Mode'
                  ? dataRows.map((item) => modeColors[item.label.split('_')[0]])
                  : linkLabel === 'Stats'
                  ? dataRows.map(
                       (item) => statsColors[item.label.split('_')[0]]
                    )
                  : [
                       '#FDB022',
                       '#F04438',
                       '#12B76A',
                       '#EE6700',
                       '#36BFFA',
                       '#F2C605',
                       '#0FC943',
                       '#A7F25B',
                       '#32D583',
                       '#2E90FA',
                       '#9E77ED',
                       '#F63D68',
                       '#37C6AB',
                       '#F97D00',
                       '#FB6514',
                    ],
         },
      ],
   }
   const options = {
      cutout: '50%',
      maintainAspectRatio: false,
      animation: {
         duration: 0,
      },
      plugins: {
         legend: {
            itemWidth: 200,
            display: true,
            position: 'left',
            align: 'start',

            labels: {
               boxWidth: 15,
               padding: 5,
               font: {
                  family: 'Nunito Sans SemiBold',
                  size: 12,
                  color: neutral[3],
               },
            },
         },
      },
      scales: {},
   }
   return (
      <Card
         sx={{
            p: 0,
            borderRadius: '16px',
            textAlign: 'left',
            '&.MuiPaper-root': {
               height: '100%',
            },
         }}
      >
         {datashow === DataType.TABLE ? (
            <TableContainer
               sx={{
                  boxShadow: 'none',
                  height: '288px',
                  minHeight: 'calc(100% - 31px)',
               }}
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
                              item: { label: string; value: number },
                              index: number
                           ) => {
                              return (
                                 <Item
                                    key={
                                       `${item.label}${index}` ||
                                       `empty${index}`
                                    }
                                    keyData={
                                       `${item.label}${index}` ||
                                       `empty${index}`
                                    }
                                    title={item.label}
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
         ) : (
            <DoughnutChartRealTime
               title={linkLabel}
               currency={currency}
               data={data}
               total={sumTotal}
               isLoading={false}
               options={options}
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
