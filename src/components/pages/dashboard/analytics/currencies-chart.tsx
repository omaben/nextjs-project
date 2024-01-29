import { useGetBetsCurrenciesReportsQuery } from '@/components/data/reports/lib/hooks/queries'
import { GetBetsCurrenciesReportDto } from '@alienbackoffice/back-front'
import { Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import {
   selectAuthBetsCurrenciesReportData
} from 'redux/authSlice'
import { selectloadingBetsCurrenciesReport } from 'redux/loadingSlice'
import { neutral } from '../../../../colors'
import DoughnutChart from '../default/DoughnutChart'

export default function CurrenciesChart(prop: {
   startDate: number
   endDate: number
   opId?: string
   brandId?: string
}) {
   const isLoading = useSelector(selectloadingBetsCurrenciesReport)
   const dataReport = useSelector(selectAuthBetsCurrenciesReportData)
   const post: GetBetsCurrenciesReportDto = {
      from: prop.startDate,
      to: prop.endDate,
   }
   if (prop.opId) {
      post.opId = prop.opId
   }
   if (prop.brandId !== 'All Brands') {
      post.brandId = prop.brandId
   }

   useGetBetsCurrenciesReportsQuery(post)
   const data = {
      labels: ['test1', 'test1', 'test1', 'test1'],
      datasets: [
         {
            data: [20, 45, 120, 30],
            borderWidth: 0,
            backgroundColor: ['#32D583', '#53B1FD', '#F78E2C', '#B692F6'],
            additionalRadius: -30,
         },
      ],
   }
   const options = {
      cutout: '60',
      stacked: true,
      maintainAspectRatio: true,
      borderWidth: 0,
      hoverBorderWidth: 0,
      additionalRadius: 0,
      plugins: {
         legend: {
            display: false,
            align: 'center' as const,
            position: 'right' as const,
            fullSize: false,
            fullWidth: false,
            labels: {
               boxWidth: 15,
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
      <DoughnutChart
         title={<Typography variant="h1">Currencies Distribution </Typography>}
         data={data}
         isLoading={isLoading}
         options={options}
      />
   )
}
