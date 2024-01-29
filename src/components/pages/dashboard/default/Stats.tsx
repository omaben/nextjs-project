import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { rgba } from 'polished'
import PortalCurrencyValue from '@/components/custom/PortalCurrencyValue'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
   Box,
   Grid,
   Card as MuiCard,
   CardContent as MuiCardContent,
   Typography as MuiTypography,
   Skeleton,
   Tooltip,
} from '@mui/material'
import { spacing } from '@mui/system'
import { ImoonGray } from 'colors'
import numeral from 'numeral'
import { useSelector } from 'react-redux'
import { selectAuthCurrencyOption } from 'redux/authSlice'
import { selectloadingFinancialReportDashboard } from 'redux/loadingSlice'
import { handleFormat } from 'services/globalFunctions'
import { CURENCYTYPE } from 'types'

const illustrationCardStyle = (props: any) => css`
   ${props.illustration &&
   props.theme.palette.mode !== 'dark' &&
   `
    background: ${rgba(props.theme.palette.primary.main, 0.125)};
    color: ${props.theme.palette.primary.main};
  `}
`

const Card = styled(MuiCard)<{ illustration?: string }>`
   position: relative;
   border-radius: 16px;
   ${illustrationCardStyle}
`

const Typography = styled(MuiTypography)(spacing)

const CardContent = styled(MuiCardContent)`
   position: relative;
   &:last-child {
      padding-bottom: ${'10px'};
   }
`

interface StatsProps {
   title: string
   amount?: number | string
   infoText?: string
   chip?: string
   percentagetext?: number | string
   percentagecolor?: string
   illustration?: string
   icon?: IconProp
   disableFormatting?: boolean
   disableColor?: boolean
   reverseColors?: boolean
   currency?: boolean
   isLoading?: boolean
   iconColor?: string
   iconBackground?: string
   chart?: boolean
   currencyData?: string
}

const Stats = ({
   title,
   amount,
   chip,
   infoText,
   percentagetext,
   percentagecolor,
   illustration,
   icon,
   disableFormatting = false,
   disableColor = false,
   reverseColors = false,
   currency = false,
   isLoading = false,
   iconColor,
   iconBackground,
   chart,
   currencyData,
}: StatsProps) => {
   const currencyOption = useSelector(selectAuthCurrencyOption)
   const loadingReportDashboard = useSelector(
      selectloadingFinancialReportDashboard
   )

   return (
      <Card
         illustration={illustration}
         sx={{ flex: 1, mb: 0, border: chart ? '1px solid #EDEBF4' : 'none' }}
      >
         <CardContent
            sx={{
               p: '10px 16px',
               paddingBottom: '10px',
            }}
         >
            <Grid container spacing={0}>
               {icon && (
                  <Grid
                     item
                     width={'40px'}
                     display={'flex'}
                     alignItems={'center'}
                  >
                     <Box
                        height={'40px'}
                        width={'40px'}
                        borderRadius={'48px'}
                        sx={{
                           textAlign: 'center',
                           display: 'flex',
                           alignItems: 'center',
                           background: iconBackground,
                           padding: '12px 10px',
                           svg: {
                              margin: '0 auto',
                           },
                        }}
                     >
                        <FontAwesomeIcon
                           icon={icon as IconProp}
                           fontSize={16}
                           color={iconColor}
                        />
                     </Box>
                  </Grid>
               )}

               <Grid
                  item
                  width={'calc(100% - 40px)'}
                  p={'4px 0px'}
                  position={'relative'}
                  top={'3px'}
                  textAlign={'center'}
               >
                  <Typography variant="h4">{title}</Typography>
                  {!loadingReportDashboard ? (
                     <>
                        {!percentagetext &&
                           (!disableFormatting && typeof amount === 'number' ? (
                              <Box>
                                 {currency ? (
                                    <Tooltip
                                       title={handleFormat(
                                          amount,
                                          currencyOption.name ===
                                             CURENCYTYPE.INUSD
                                             ? 'USD'
                                             : currencyData
                                       )}
                                    >
                                       <Typography
                                          sx={{
                                             wordBreak: 'keep-all',
                                             textAlign: 'center',
                                          }}
                                       >
                                          <PortalCurrencyValue
                                             value={amount}
                                             currency={
                                                currencyOption.name ===
                                                CURENCYTYPE.INUSD
                                                   ? 'USD'
                                                   : currencyData
                                             }
                                             fontFamily="Nunito Sans Bold"
                                             color={ImoonGray[1]}
                                             fontSize="16px !important"
                                             lineHeight="23.52px"
                                             textTransform="uppercase"
                                             disableColor={true}
                                             format="0a.[00]"
                                             formatter={true}
                                             visibleCurrency={true}
                                          />
                                       </Typography>
                                    </Tooltip>
                                 ) : (
                                    <Tooltip title={amount}>
                                       <Typography variant="h3">
                                          {numeral(amount)
                                             .format(
                                                '0a.[00]',
                                                (n) =>
                                                   (Math.floor(n) * 100) / 100
                                             )
                                             .toUpperCase()}
                                       </Typography>
                                    </Tooltip>
                                 )}
                              </Box>
                           ) : (
                              <Box>
                                 <Typography variant="h3">
                                    {numeral(amount)
                                       .format('0a.[00]')
                                       .toUpperCase()}
                                 </Typography>
                              </Box>
                           ))}

                        {percentagetext && typeof percentagetext === 'number' && (
                           <Typography
                              display={'flex'}
                              justifyContent={'center'}
                              variant="h5"
                              color={
                                 percentagetext >= 0 ? '#32D583' : '#F97066'
                              }
                              fontFamily="Nunito Sans SemiBold"
                           >
                              {percentagetext > 0 ? (
                                 <>
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       width="15"
                                       height="15"
                                       viewBox="0 0 15 15"
                                       fill="none"
                                    >
                                       <path
                                          d="M8.10359 5.39651L3.89648 9.60362H12.3107L8.10359 5.39651Z"
                                          fill="#32D583"
                                       />
                                    </svg>{' '}
                                    +
                                 </>
                              ) : (
                                 <>
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       width="15"
                                       height="16"
                                       viewBox="0 0 15 16"
                                       fill="none"
                                    >
                                       <path
                                          d="M8.10359 10.1036L12.3107 5.89648L3.89648 5.89648L8.10359 10.1036Z"
                                          fill="#F97066"
                                       />
                                    </svg>
                                 </>
                              )}
                              {percentagetext} %
                           </Typography>
                        )}
                     </>
                  ) : (
                     <Skeleton variant="text" sx={{ margin: '0 auto' }}>
                        <Typography lineHeight={'23.52px'}>0000</Typography>
                     </Skeleton>
                  )}
               </Grid>
            </Grid>
         </CardContent>
      </Card>
   )
}

export default Stats
