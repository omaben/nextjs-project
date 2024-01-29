import { withTheme } from '@emotion/react'
import styled from '@emotion/styled'
import {
   Box,
   CardContent,
   CardHeader,
   Grid,
   Card as MuiCard,
   Skeleton,
   Typography,
} from '@mui/material'
import { spacing } from '@mui/system'
import { PortalStats } from 'pages/dashboard'
import React, { useEffect, useRef } from 'react'
import { Doughnut } from 'react-chartjs-2'
import Stats from './Stats'
import { faChartPie } from '@fortawesome/pro-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

const Card = styled(MuiCard)(spacing)

const ChartWrapper = styled.div`
   height: 200px;
   position: relative;
   display: inline-block;
`
const DoughnutChart = (dataset: any) => {
   const [statsData, setStats]: PortalStats[] | any = React.useState([
      {
         primaryTitle: 'USD',
         percentagetext: 17.5 as number,
         icon: faChartPie as IconProp,
         iconColor: '#FB8111',
         iconBackground: '#FFEAD5',
         chart: true,
      },
      {
         primaryTitle: 'USD',
         percentagetext: 17.5 as number,
         icon: faChartPie as IconProp,
         iconColor: '#2E90FA',
         iconBackground: '#EFF8FF',
         chart: true,
      },
      {
         primaryTitle: 'USD',
         percentagetext: 17.5 as number,
         icon: faChartPie as IconProp,
         iconColor: '#444CE7',
         iconBackground: '#EEF4FF',
         chart: true,
      },
      {
         primaryTitle: 'USD',
         percentagetext: -10 as number,
         icon: faChartPie as IconProp,
         iconColor: '#DD2590',
         iconBackground: '#FDF2FA',
         chart: true,
      },
   ])

   const chartRef = useRef<any>(null)

   useEffect(() => {
      if (chartRef.current) {
         const chart = chartRef.current.chartInstance
         if (chart) {
            chart.config.options.onHover = function (
               event: MouseEvent,
               elements: any
            ) {
               if (elements && elements.length > 0) {
                  const element = elements[0]
                  if (element && element._index !== undefined) {
                     const dataset = chart.data.datasets[element._datasetIndex]
                     dataset.additionalRadius = -50 // Adjust this value as needed
                     dataset.innerRadius = 30 // Adjust this value as needed
                     chart.update()
                  }
               }
            }

            chart.config.options.onClick = function (
               event: MouseEvent,
               elements: any
            ) {
               if (elements && elements.length > 0) {
                  const element = elements[0]
                  if (element && element._index !== undefined) {
                     const dataset = chart.data.datasets[element._datasetIndex]
                     dataset.additionalRadius = -80 // Adjust this value as needed
                     dataset.innerRadius = 30 // Adjust this value as needed
                     chart.update()
                  }
               }
            }
         }
      }
   }, [dataset])

   return (
      <Card
         sx={{
            height: '100%',
         }}
      >
         <CardHeader title={dataset.title} />

         <CardContent>
            {dataset.isLoading ? (
               <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  sx={{ minHeight: '418px' }}
               />
            ) : (
               <Grid container spacing={'12px'} p="14px" pt="24px" pb="0">
                  <Grid item xs={12} textAlign={'center'} p={'0 !important'}>
                     <ChartWrapper>
                        <Box
                           textAlign={'center'}
                           position="absolute"
                           top="80px"
                           left="70px"
                        >
                           <Typography
                              lineHeight={'31.68px'}
                              fontFamily={'Nunito Sans ExtraBold'}
                              color={'#1D1929'}
                              fontSize={'24px !important'}
                           >
                              2860
                           </Typography>
                           <Typography
                              variant="h4"
                              fontSize={'12px !important'}
                           >
                              Total
                           </Typography>
                        </Box>
                        <Doughnut
                           ref={chartRef}
                           data={dataset.data}
                           options={dataset.options}
                           width={'200px'}
                           height={'200px'}
                        />
                     </ChartWrapper>
                  </Grid>
                  {statsData?.map((item: PortalStats, index: number) => (
                     <Grid item xs={6} key={`stats${index}`}>
                        <Stats title={item.primaryTitle} {...item} />
                     </Grid>
                  ))}
               </Grid>
            )}
         </CardContent>
      </Card>
   )
}

export default withTheme(DoughnutChart)
