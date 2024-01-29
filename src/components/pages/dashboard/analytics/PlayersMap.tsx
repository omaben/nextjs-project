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

function PlayersMap(prop: {
   startDate: number
   endDate: number
   opId?: string
   brandId?: string
}) {
   const dataCountries = useSelector(
      selectAuthLaunchReportData
   ) as LaunchReportData
   const [datashow, setDatashow] = React.useState(DataType.CHART)
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
      height: ${isDesktop ? '418px' : '268px'};
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
   const options = {
      map: 'world_mill',
      regionStyle: {
         initial: {
            fill: '#e3eaef',
         },
         hover: {
            fill: '#D1EBFF',
         },
         selected: {
            fill: '#2E90FA',
         },
      },
      backgroundColor: 'transparent',
      containerStyle: {
         width: '100%',
         height: '100%',
      },
      markerStyle: {
         initial: {
            r: 2,
            fill: '#332C4A',
            'fill-opacity': 1,
            stroke: '#332C4A',
            'stroke-width': 1,
            'stroke-opacity': 0.4,
         },
         hover: {
            stroke: '#332C4A',
            'fill-opacity': 1,
            'stroke-width': 1,
            fill: '#332C4A',
         },
      },
      zoomOnScroll: false,
      markers: [] as {
         latLng: number[]
         name: string
      }[],
      selectedRegions: [] as string[],
   }

   useGetLaunchesReportsQuery(post)

   dataCountries?.launchesReport?.map(
      (item: { countryCode: string; uniquePlayers: number }) => {
         const country = Countries.find((qry) => {
            if (
               (item.countryCode === 'UK' && qry.alpha2 === 'GB') ||
               (item.countryCode === 'GF' && qry.alpha2 === 'FR')
            ) {
               return qry
            } else {
               if (qry.alpha2 === item.countryCode && item.countryCode !== 'SG')
                  return qry
            }
         })
         options?.markers.push({
            latLng: [country?.latitude as number, country?.longitude as number],
            name: `${country?.country as string} (${item.uniquePlayers} player${
               item.uniquePlayers > 1 ? 's' : ''
            })`,
         })
         if (country?.alpha2) {
            options?.selectedRegions.push(
               country?.alpha2 === 'IO' ? 'IN' : country?.alpha2
            )
         }
      }
   )

   setTimeout(() => {
      Array.from(document.getElementsByClassName('jvectormap-tip')).forEach(
         (el: any) => {
            el.style.display = 'none'
         }
      )
   }, 100)
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
      }
   }, [dataCountries])
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
                        <VectorMap {...options} />
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
                           height: isDesktop ? '458px' : '308px',
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

export default withTheme(PlayersMap)
