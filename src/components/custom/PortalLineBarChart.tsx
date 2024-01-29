import styled from '@emotion/styled'
import {
   CardContent,
   CardHeader,
   Card as MuiCard,
   Skeleton,
} from '@mui/material'
import { spacing } from '@mui/system'
import {
   BubbleDataPoint,
   ChartDataset,
   ChartTypeRegistry,
   Point,
} from 'chart.js'
import numeral from 'numeral'
import { Chart, ChartProps } from 'react-chartjs-2'

export interface PortalLineBarChartProps {
   datasets: ChartDataset<
      keyof ChartTypeRegistry,
      (number | Point | [number, number] | BubbleDataPoint | null)[]
   >[]
   labels: number[] | string[]
   isLoading: boolean
   title: string
}

export const PortalLineBarChart = (props: PortalLineBarChartProps) => {
   const { datasets, labels, isLoading, title } = props

   const chartProps: ChartProps = {
      type: 'bar',
      options: {
         interaction: {
            mode: 'index' as const,
            intersect: false,
         },
         maintainAspectRatio: false,
         plugins: {
            legend: {
               display: true,
            },
         },
         scales: {
            x: {
               stacked: true,
            },
            y: {
               stacked: true,
               type: 'linear' as const,
               grid: { display: false },
               display: true,
               ticks: {
                  callback: (value) => {
                     return numeral(value).format('0a.[00]').toUpperCase()
                  },
               },
            },
         },
      },
      data: {
         datasets,
         labels,
      },
   }

   const Card = styled(MuiCard)(spacing)
   const ChartWrapper = styled.div`
      height: 378px;
   `

   return (
      <Card>
         <CardHeader title={title} />
         <CardContent>
            <ChartWrapper>
               {isLoading ? (
                  <Skeleton variant="rectangular" width="100%" height="100%" />
               ) : (
                  <Chart {...chartProps} />
               )}
            </ChartWrapper>
         </CardContent>
      </Card>
   )
}
