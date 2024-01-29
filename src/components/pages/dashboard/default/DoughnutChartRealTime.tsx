import PortalCurrencyValue from '@/components/custom/PortalCurrencyValue'
import { withTheme } from '@emotion/react'
import styled from '@emotion/styled'
import {
   CardContent,
   CardHeader,
   Grid,
   Card as MuiCard,
   Skeleton,
   Tooltip,
   Typography,
} from '@mui/material'
import { spacing } from '@mui/system'
import { ImoonGray } from 'colors'
import numeral from 'numeral'
import { useEffect, useRef } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { handleFormat } from 'services/globalFunctions'

const Card = styled(MuiCard)(spacing)

const ChartWrapper = styled.div`
   min-height: 280px;
   width: 100%;
   position: relative;
   display: inline-block;
`
const DoughnutChartRealTime = (dataset: {
   title: string
   isLoading: boolean
   data: any
   total: number
   options: {}
   currency?: boolean
}) => {
   const chartRef = useRef<any>(null)

   useEffect(() => {
      if (chartRef.current) {
         const chart = chartRef.current.chartInstance
         if (chart) {
            // chart.config.options.tooltips = {
            //    callbacks: {
            //       label: function (tooltipItem: any, data: any) {
            //          const dataset = data.datasets[tooltipItem.datasetIndex]
            //          const value = dataset.data[tooltipItem.index]
            //          const percentage = value.toFixed(2) + '%'
            //          return `${
            //             data.labels[tooltipItem.index]
            //          }: ${value} (${percentage})`
            //       },
            //    },
            // }

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
      // sx={{
      //    height: '100%',
      // }}
      >
         <CardHeader
            title={
               <Typography
                  component="h6"
                  sx={{
                     cursor: 'pointer',
                     display: 'inline-block',
                  }}
               >
                  {dataset.title}
               </Typography>
            }
         />

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
                  <Grid item xs={12} textAlign={'left'} p={'0 !important'}>
                     <ChartWrapper>
                        {dataset.total > 0 && (
                           <div
                              style={{
                                 position: 'absolute',
                                 top: '135px',
                                 left:
                                    dataset.title === 'Operator'
                                       ? 'calc(50% + 55px)'
                                       : dataset.title === 'Currency'
                                       ? 'calc(50% + 25px)'
                                       : dataset.title === 'Stats'
                                       ? 'calc(50% + 45px)'
                                       : 'calc(50% + 35px)',
                                 transform: 'translate(-50%, -50%)',
                                 textAlign: 'center',
                              }}
                           >
                              {dataset.currency ? (
                                 <Tooltip
                                    title={handleFormat(dataset.total, 'USD')}
                                 >
                                    <PortalCurrencyValue
                                       value={dataset.total}
                                       currency={'USD'}
                                       fontFamily="Nunito Sans Bold"
                                       color={ImoonGray[1]}
                                       fontSize="16px !important"
                                       lineHeight="23.52px"
                                       textTransform="uppercase"
                                       disableColor={true}
                                       format="0a.[00]"
                                       formatter={true}
                                       visibleCurrency={true}
                                       sx={{ cursor: 'pointer' }}
                                    />
                                 </Tooltip>
                              ) : (
                                 <Tooltip title={dataset.total}>
                                    <Typography
                                       fontSize="16px !important"
                                       lineHeight="23.52px"
                                       textTransform="uppercase"
                                       fontFamily="Nunito Sans Bold"
                                       color={'#1D1929'}
                                       sx={{ cursor: 'pointer' }}
                                    >
                                       {numeral(dataset.total)
                                          .format(
                                             '0a.[00]',
                                             (n) => (Math.floor(n) * 100) / 100
                                          )
                                          .toUpperCase()}
                                    </Typography>
                                 </Tooltip>
                              )}

                              <Typography
                                 variant="h4"
                                 fontSize={'12px !important'}
                              >
                                 Total
                              </Typography>
                           </div>
                        )}

                        <Doughnut
                           ref={chartRef}
                           data={dataset.data}
                           options={dataset.options}
                        />
                     </ChartWrapper>
                  </Grid>
               </Grid>
            )}
         </CardContent>
      </Card>
   )
}

export default withTheme(DoughnutChartRealTime)
