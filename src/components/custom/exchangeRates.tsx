import { Currency } from '@alienbackoffice/back-front';
import { CurrencyType } from '@alienbackoffice/back-front/lib/player/enum/currency-type.enum';
import {
   Box,
   Card,
   CardContent,
   Grid,
   Typography,
   useTheme,
} from '@mui/material';
import { ImoonGray } from 'colors';
import Image from 'next/image';
import { FC } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import PortalCurrencyValue from './PortalCurrencyValue';

export const PortalExchanges: FC<{
   rows: { cmcId?: number; image?: string } & Currency[];
}> = ({ rows }) => {
   return (
      <Grid container spacing={1}>
         {rows.map((data: Currency, index: number) => (
            <Grid item xs={4} sm={3} lg={2} key={data?.code}>
               <PortalItemExchange data={data} key={`${data.code}${index}`} />
            </Grid>
         ))}
      </Grid>
   );
};

export interface ExchangeProps {
   data: { cmcId?: number; image?: string } & Currency;
}

export const PortalItemExchange = (props: ExchangeProps) => {
   const { data } = props;
   const theme = useTheme();

   if (!data) return <></>;
   let base64Url;
   if (data.type === CurrencyType.CRYPTO || data.image) {
      base64Url = data.image
         ? data.image
         : `https://s2.coinmarketcap.com/static/img/coins/64x64/${data?.cmcId}.png`;
   }

   return (
      <Card
         sx={{
            background: theme.palette.background.paper,
            minWidth: '80px',
            height: '100%',
         }}
      >
         <CardContent
            sx={{
               p: '16px 8px',
               pb: '16px!important',
            }}
         >
            <Grid container spacing={0}>
               {base64Url && (
                  <Grid
                     item
                     width={'28px'}
                     display={'flex'}
                     alignItems={'center'}
                  >
                     <Box
                        height={'28px'}
                        width={'28px'}
                        borderRadius={'48px'}
                        sx={{
                           textAlign: 'center',
                           display: 'flex',
                           alignItems: 'center',
                           padding: '0',
                           svg: {
                              margin: '0 auto',
                           },
                        }}
                     >
                        <Image
                           src={base64Url}
                           alt="currency flag"
                           width={20}
                           height={20}
                        />
                     </Box>
                  </Grid>
               )}
               <Grid
                  item
                  width={base64Url ? 'calc(100% - 30px)' : '100%'}
                  p={'0'}
                  position={'relative'}
                  top={'3px'}
                  textAlign={'center'}
               >
                  <Typography variant="h4">{data.code}</Typography>
                  <Box>
                     {data.type === CurrencyType.FIAT ? (
                        <>
                           <Typography
                              color={ImoonGray[1]}
                              variant="bodySmallBold"
                           >
                              {data.currency} 1 =
                           </Typography>
                           <Typography
                              color={(props) =>
                                 `${props.palette.success.main} !important`
                              }
                              variant="bodySmallBold"
                           >
                              {' '}
                              $
                           </Typography>
                           <PortalCurrencyValue
                              currency={'BTC'}
                              value={Number(data.inUSD)}
                              format={'0,00.[00]'}
                              disableColor={true}
                              fontFamily="Nunito Sans Bold"
                              color={(props) =>
                                 `${props.palette.success.main} !important`
                              }
                              fontSize="12px !important"
                              lineHeight="13.92px"
                              visibleCurrency={true}
                           />
                        </>
                     ) : (
                        <>
                           <Typography
                              variant="bodySmallBold"
                           >
                              {' '}
                              $
                           </Typography>
                           <PortalCurrencyValue
                              currency={'BTC'}
                              value={Number(data.inUSD)}
                              format={'0,00.[00]'}
                              disableColor={true}
                              fontFamily="Nunito Sans Bold"
                              color={ImoonGray[1]}
                              fontSize="12px !important"
                              lineHeight="13.92px"
                              visibleCurrency={true}
                           />
                        </>
                     )}
                  </Box>
               </Grid>
            </Grid>
         </CardContent>
      </Card>
   );
};
