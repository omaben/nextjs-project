import { BetStatus } from '@alienbackoffice/back-front'
import createTheme from 'theme'
import { THEMES } from '../../constants'

export const statusData = [
   // {
   //    value: 'all',
   //    label: 'All Status',
   //    color: createTheme(THEMES.DEFAULT).palette.grey[500],
   // },
   {
      value: BetStatus.OPEN,
      label: BetStatus.OPEN,
      color: createTheme(THEMES.DEFAULT).palette.warning.main,
   },
   {
      value: BetStatus.WON,
      label: BetStatus.WON,
      color: createTheme(THEMES.DEFAULT).palette.error.main,
   },
   {
      value: BetStatus.LOST,
      label: BetStatus.LOST,
      color: createTheme(THEMES.DEFAULT).palette.success.main,
   },
   {
      value: BetStatus.CASHBACK,
      label: BetStatus.CASHBACK,
      color: createTheme(THEMES.DEFAULT).palette.info.main,
   },
   {
      value: BetStatus.CANCELED,
      label: BetStatus.CANCELED,
      color: createTheme(THEMES.DEFAULT).palette.grey[200],
   },
]

