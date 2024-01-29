import { renderFlagCell } from '@/components/custom/PortalRenderCells'
import { useGetLaunchesReportsQuery } from '@/components/data/reports/lib/hooks/queries'
import {
   GetLaunchReportDto,
   LaunchReportData,
} from '@alienbackoffice/back-front'
import { withTheme } from '@emotion/react'
import styled from '@emotion/styled'
import {
   Box,
   Button,
   CardActions,
   CardHeader,
   Card as MuiCard,
   CardContent as MuiCardContent,
   Skeleton,
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
import { spacing } from '@mui/system'
import { ImoonGray } from 'colors'
import dynamic from 'next/dynamic'
import numeral from 'numeral'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthLaunchReportData } from 'redux/authSlice'
import { selectloadingLaunchReport } from 'redux/loadingSlice'
import { DataType } from 'types'
import { Countries } from './country-codes'
import WorldMap, { CountryContext } from 'react-svg-worldmap'

const VectorMap = dynamic(
   () => import('react-jvectormap').then((m) => m.VectorMap),
   { ssr: false }
) as any
const Card = styled(MuiCard)(spacing)
const CardContent = styled(MuiCardContent)`
   &:last-child {
      padding-top: 0;
      padding-bottom: ${(props) => props.theme.spacing(4)};
   }
`

function PlayersMapNew(prop: {
   startDate: number
   endDate: number
   opId?: string
   brandId?: string
}) {
   const dataCountries = useSelector(
      selectAuthLaunchReportData
   ) as LaunchReportData
   const [datashow, setDatashow] = React.useState(DataType.CHART)
   const [data, setData] = React.useState(
      [] as {
         country: string
         value: number
      }[]
   )
   const [someUniquePlayers, setSomeUniquePlayers] = React.useState(0)
   const [otherPercent, setOtherPercent] = React.useState(0)
   const [sortedCountries, setSortedCountries] = React.useState(
      [] as {
         countryCode: string
         uniquePlayers: number
      }[]
   )
   const theme = useTheme()
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
   const MapContainer = styled.div`
      position: relative;
   `
   const loadingLaunchReport = useSelector(selectloadingLaunchReport)
   const post: GetLaunchReportDto = {
      from: prop.startDate,
      to: prop.endDate,
      opId: prop.opId,
   }
   if (prop.brandId !== 'All Brands') {
      post.brandId = prop.brandId
   }

   useGetLaunchesReportsQuery(post)

   useEffect(() => {
      if (dataCountries?.launchesReport) {
         const some: number =
            dataCountries?.launchesReport?.reduce(
               (sum, entry) => sum + entry.uniquePlayers,
               0
            ) || 0

         setSomeUniquePlayers(some)
         // Create a copy of the array before sorting
         const sortedLaunches = [...dataCountries.launchesReport].sort(
            (a, b) => b.uniquePlayers - a.uniquePlayers
         )

         const topThreeItems = sortedLaunches.slice(0, 3)
         setSortedCountries(topThreeItems)

         const otherPercentData =
            topThreeItems.reduce(
               (sum, entry) => sum + entry.uniquePlayers,
               0
            ) || 0

         setOtherPercent(100 - (otherPercentData / some) * 100)
         const dataItem: {
            country: string
            value: number
         }[] = []
         dataCountries?.launchesReport?.map(
            (item: { countryCode: string; uniquePlayers: number }) => {
               dataItem.push({
                  country: item.countryCode,
                  value: item.uniquePlayers,
               })
            }
         )
         setData(dataItem)
      }
   }, [dataCountries])

   // const data = [
   //    { country: 'cn', value: 1389618778 }, // china
   //    { country: 'in', value: 1311559204 }, // india
   //    { country: 'us', value: 331883986 }, // united states
   //    { country: 'id', value: 264935824 }, // indonesia
   //    { country: 'pk', value: 210797836 }, // pakistan
   //    { country: 'br', value: 210301591 }, // brazil
   //    { country: 'ng', value: 208679114 }, // nigeria
   //    { country: 'bd', value: 161062905 }, // bangladesh
   //    { country: 'ru', value: 141944641 }, // russia
   //    { country: 'mx', value: 127318112 }, // mexico
   // ]

   const getStyle = ({
      countryValue,
      countryCode,
      minValue,
      maxValue,
      color,
   }: CountryContext) => ({
      fill: '#2E90FA',
      fillOpacity: countryValue ? 1 : 0.1,
      stroke: 'gray',
      strokeWidth: 1,
      strokeOpacity: 0.2,
      cursor: 'pointer',
   })
   return (
      <Card>
         {datashow === DataType.CHART && (
            <CardHeader
               title={
                  <Typography variant="h1">
                     Player Launches{' '}
                     {dataCountries?.launchesReport?.length > 0
                        ? `(${dataCountries?.launchesReport?.length} countries)`
                        : ''}
                  </Typography>
               }
            />
         )}

         <CardContent
            sx={{
               padding: 0,
               '.worldmap__figure-container': {
                  textAlign: 'center',
               },
            }}
         >
            {loadingLaunchReport ? (
               <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={isDesktop ? '418px' : '268px'}
               />
            ) : (
               <>
                  {datashow === DataType.CHART ? (
                     <MapContainer>
                        <WorldMap
                           color="#2E90FA"
                           value-suffix="player"
                           size={'responsive'}
                           data={data}
                           styleFunction={getStyle}
                           richInteraction
                           valueSuffix="players"
                        />
                        <Box
                           sx={{
                              position: 'absolute',
                              bottom: 0,
                              background: '#fff',
                              zIndex: 1000,
                           }}
                        >
                           {sortedCountries?.map((item) => (
                              <>
                                 <TableRow key={item.countryCode}>
                                    <TableCell>
                                       {renderFlagCell(item.countryCode)}
                                    </TableCell>
                                    <TableCell align="center">
                                       <Typography variant="h6">
                                          {(
                                             (item.uniquePlayers /
                                                someUniquePlayers) *
                                             100
                                          ).toFixed(2)}
                                          %
                                       </Typography>
                                    </TableCell>
                                 </TableRow>
                              </>
                           ))}
                           {dataCountries?.launchesReport?.length > 3 && (
                              <TableRow>
                                 <TableCell>Other</TableCell>
                                 <TableCell align="center">
                                    <Typography variant="h6">
                                       {otherPercent.toFixed(2)}%
                                    </Typography>
                                 </TableCell>
                              </TableRow>
                           )}
                        </Box>
                     </MapContainer>
                  ) : (
                     <TableContainer
                        sx={{
                           boxShadow: 'none',
                           height: isDesktop ? '598px' : '308px',
                        }}
                     >
                        <Table stickyHeader>
                           <TableHead
                              sx={{
                                 position: 'sticky',
                                 top: 0,
                                 zIndex: 1,
                              }}
                           >
                              <TableRow>
                                 <TableCell
                                    align="center"
                                    sx={{
                                       th: {
                                          textTransform: 'capitalize',
                                       },
                                    }}
                                 >
                                    <Typography
                                       variant="h6"
                                       color={(props) =>
                                          props.palette.primary.contrastText
                                       }
                                    >
                                       Countries{' '}
                                       {dataCountries?.launchesReport?.length >
                                       0
                                          ? `(${dataCountries?.launchesReport?.length})`
                                          : ''}
                                    </Typography>
                                 </TableCell>
                                 <TableCell
                                    align="center"
                                    sx={{
                                       th: {
                                          textTransform: 'capitalize',
                                       },
                                    }}
                                 >
                                    <Typography
                                       variant="h6"
                                       color={(props) =>
                                          props.palette.primary.contrastText
                                       }
                                    >
                                       Players
                                    </Typography>
                                 </TableCell>
                                 <TableCell
                                    align="center"
                                    sx={{
                                       th: {
                                          textTransform: 'capitalize',
                                       },
                                    }}
                                 >
                                    <Typography
                                       variant="h6"
                                       color={(props) =>
                                          props.palette.primary.contrastText
                                       }
                                    >
                                       Percentage
                                    </Typography>
                                 </TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody
                              sx={{
                                 h6: {
                                    color: ImoonGray[1],
                                 },
                              }}
                           >
                              {dataCountries?.launchesReport?.map((item) => (
                                 <>
                                    <TableRow key={item.countryCode}>
                                       <TableCell>
                                          {renderFlagCell(item.countryCode)}
                                       </TableCell>
                                       <TableCell align="center">
                                          <Typography variant="h6">
                                             {numeral(
                                                item.uniquePlayers
                                             ).format('0,00')}
                                          </Typography>
                                       </TableCell>
                                       <TableCell align="center">
                                          <Typography variant="h6">
                                             {(
                                                (item.uniquePlayers /
                                                   someUniquePlayers) *
                                                100
                                             ).toFixed(2)}
                                             %
                                          </Typography>
                                       </TableCell>
                                    </TableRow>
                                 </>
                              ))}
                           </TableBody>
                        </Table>
                     </TableContainer>
                  )}
               </>
            )}
         </CardContent>
         <CardActions
            sx={{
               borderTop: `1px solid ${ImoonGray[11]}`,
               textAlign: 'center',
               alignItems: 'center',
               padding: '4px 15px',
               display: 'block',
            }}
         >
            <Button
               variant="contained"
               color={datashow === DataType.TABLE ? 'secondary' : 'inherit'}
               onClick={() => setDatashow(DataType.TABLE)}
               sx={{
                  color: '#fff',
                  background: (props) =>
                     datashow === DataType.TABLE
                        ? props.palette.secondary.main
                        : props.palette.info.light,
               }}
            >
               Table
            </Button>
            <Button
               variant="contained"
               color={datashow === DataType.CHART ? 'secondary' : 'inherit'}
               onClick={() => setDatashow(DataType.CHART)}
               sx={{
                  color: '#fff',
                  background: (props) =>
                     datashow === DataType.CHART
                        ? props.palette.secondary.main
                        : props.palette.info.light,
               }}
            >
               Map
            </Button>
         </CardActions>
      </Card>
   )
}

export default withTheme(PlayersMapNew)
