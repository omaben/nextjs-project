import { Currency } from '@alienbackoffice/back-front'
import {
   Box,
   Card,
   Grid,
   Skeleton,
   Stack,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   useMediaQuery,
   useTheme
} from '@mui/material'
import { secondary } from 'colors'
import _ from 'lodash'
import Image from 'next/image'
import { FC } from 'react'
import { CustomNoRowsOverlay } from 'services/globalFunctions'
import currencyData from '../../currencies.json'
import CustomLoader from './CustomLoader'
import PortalCopyValue from './PortalCopyValue'

type typeItem = {
   data: Currency
   isLoading: Boolean
}
const Item = ({ data, isLoading }: typeItem) => {
   const theme = useTheme()
   let base64Url
   switch (data.code) {
      case 'USD': {
         base64Url = _.find(currencyData, {
            name: 'United States',
         })?.image
         break
      }

      default: {
         base64Url = _.find(currencyData, {
            code: data.code,
         })?.image
      }
   }
   return (
      <>
         <TableRow
            key={`${data.code}Data`}
            sx={{
               '&:nth-of-type(odd)': {
                  backgroundColor: theme.palette.background.default,
               },

               // hide last border
               'td, th': {
                  border: 0,
                  width: 200,
               },
            }}
         >
            <TableCell component="th" scope="row">
               <Stack
                  direction="row"
                  gap={2}
                  alignItems="center"
                  textTransform="capitalize"
               >
                  <Box
                     sx={{
                        'a:hover': {
                           color: `${secondary[8]} !important`,
                        },
                     }}
                  >
                     <Stack direction="row" alignItems="center" gap={1.5}>
                        {base64Url && (
                           <Image
                              src={base64Url}
                              alt="currency flag"
                              width={20}
                              height={20}
                           />
                        )}
                        {data.code}
                     </Stack>
                  </Box>
               </Stack>
            </TableCell>
            <TableCell
               sx={{
                  color: theme.palette.info.main,
               }}
            >
               {isLoading ? (
                  <Skeleton variant="text" width={50} sx={{ fontSize: 14 }} />
               ) : (
                  <PortalCopyValue
                     value={data.inUSD?.toString() || '0'}
                     sx={{
                        '.MuiTypography-root': {
                           fontSize: 12,
                           fontFamily: 'Nunito Sans SemiBold',
                           overflow: 'hidden',
                        },
                     }}
                  />
               )}
            </TableCell>
         </TableRow>
      </>
   )
}

export const PortalExchangeCurrenciesTable: FC<{
   rows: Currency[]
   linkLabel: string
   isLoading: boolean
}> = ({ rows, isLoading, linkLabel }) => {
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const tableLabels = ['Currency', 'InUSD']

   return (
      <Card>
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
                     }),
                  }}
               >
                  <TableHead
                     sx={{
                        color: theme.palette.secondary.main,
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
                     {rows.length > 0 ? (
                        rows.map((item: Currency) => {
                           return (
                              <Item
                                 key={`${item.currency}`}
                                 data={item as Currency}
                                 isLoading={isLoading}
                              />
                           )
                        })
                     ) : (
                        <TableRow
                           sx={{
                              '&:nth-of-type(odd)': {
                                 backgroundColor:
                                    theme.palette.background.paper,
                              },

                              // hide last border
                              'td, th': {
                                 border: 0,
                                 width: 200,
                              },
                           }}
                        >
                           <TableCell colSpan={5}>
                              <Grid
                                 container
                                 alignItems={'center'}
                                 textAlign={'center'}
                              >
                                 <Grid item xs={12} my={10}>
                                    <CustomNoRowsOverlay />
                                 </Grid>
                              </Grid>
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            ) : (
               <CustomLoader />
            )}
         </TableContainer>
      </Card>
   )
}
