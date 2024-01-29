import {
   BetStatus,
   ConfigType,
   Currency,
   GameCoreStatus,
   GameStatus,
   IntegrationType,
   Operator,
   OperatorStatus,
   PaymentGatewayName,
   Player,
   PlayerActivityType,
   TransactionStatus,
   TransactionType,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front';
import { LogLevel } from '@alienbackoffice/back-front/lib/lib/enum/log-level.enum';
import { CurrencyType } from '@alienbackoffice/back-front/lib/player/enum/currency-type.enum';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
   faBan,
   faChevronRight,
   faCircleA,
   faCircleCheck,
   faCircleExclamation,
   faCircleM,
   faRobot,
   faShieldCheck,
   faStar,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   Box,
   Chip,
   Grid,
   IconButton,
   Stack,
   Tooltip,
   Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { GridRenderCellParams } from '@mui/x-data-grid';
import _ from 'lodash';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import router from 'next/router';
import numeral from 'numeral';
import { useSelector } from 'react-redux';
import { selectAuthCurrentOperator } from 'redux/authSlice';
import { store } from 'redux/store';
import { getModeIcons } from 'services/globalFunctions';
import { hasDetailsPermission } from 'services/permissionHandler';
import createTheme from 'theme';
import { BetMode, WebhookStatus, WebhookType } from 'types';
import {
   ImoonBlue,
   ImoonGray,
   darkPurple,
   imoonGreen,
   imoonOrange,
   imoonRose,
   neutral,
   red,
   secondary,
   tertiary,
} from '../../colors';
import { THEMES } from '../../constants';
import currencyData from '../../currencies.json';
import PortalCopyValue from './PortalCopyValue';
import PortalCurrencyValue from './PortalCurrencyValue';
import PortalDateTime from './PortalDateTime';
import PortalPlayerTooltip, {
   PortalRelatedPlayerTooltip,
} from './PortalPlayerTooltip';
import { StyledBadge } from './statusBadgeStyle';

export const renderPlayerStatusCell = (
   playerId: string,
   isTest?: boolean,
   status?: boolean,
   displayName?: string,
   blockStatus?: boolean,
   player?: Player,
   firstChild?: boolean
) => {
   if (!displayName) displayName = 'NoName';

   return (
      <Stack direction="row" alignItems="center" gap={1}>
         <Box>
            {status && (
               <StyledBadge
                  overlap="circular"
                  anchorOrigin={{
                     vertical: 'top',
                     horizontal: 'left',
                  }}
                  variant="dot"
                  sx={{
                     '& .MuiBadge-badge': {
                        position: 'absolute',
                        top: '-2px',
                        left: '-6px',
                     },
                  }}
               />
            )}
         </Box>
         <PortalPlayerTooltip
            player={{
               playerId,
               displayName,
               player,
            }}
         >
            <Stack textAlign={firstChild ? 'left' : 'center'}>
               <PortalCopyValue
                  value={playerId}
                  sx={{
                     maxWidth: '100px',
                     overflow: 'hidden',
                     textOverflow: 'ellipsis',
                     '.MuiTypography-root': {
                        lineHeight: 'initial',
                     },
                  }}
               />

               <Box sx={{ 'a:hover': { color: `${secondary[8]} !important` } }}>
                  {router.pathname === '/players/details' ? (
                     <Typography
                        display={'inline-block'}
                        ml={1}
                        variant="h6"
                        sx={{
                           maxWidth: '100px',
                           overflow: 'hidden',
                           textOverflow: 'ellipsis',
                           cursor: 'pointer',
                        }}
                     >
                        {displayName}
                     </Typography>
                  ) : (
                     <Link
                        style={{
                           color: secondary[6],
                           textDecoration: 'none',
                        }}
                        href={`/players/details?id=${playerId}`}
                     >
                        {blockStatus && (
                           <FontAwesomeIcon
                              icon={faBan as IconProp}
                              color={
                                 createTheme(THEMES.DEFAULT).palette.error.main
                              }
                           />
                        )}
                        {isTest && (
                           <Tooltip title={'Test'} placement="left">
                              <FontAwesomeIcon
                                 icon={faRobot as IconProp}
                                 color={'#8098F9'}
                              />
                           </Tooltip>
                        )}
                        <Typography
                           display={'inline-block'}
                           ml={1}
                           variant="h6"
                           color={ImoonBlue[4]}
                           sx={{
                              maxWidth: '100px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                           }}
                        >
                           {displayName}
                        </Typography>
                     </Link>
                  )}
               </Box>
            </Stack>
         </PortalPlayerTooltip>
      </Stack>
   );
};

export const renderRelatedPlayerStatusCell = (
   playerId: string,
   opId: string,
   displayName?: string
) => {
   if (!displayName) displayName = 'NoName';

   return (
      <Stack direction="row" alignItems="flex-end" gap={1}>
         <PortalRelatedPlayerTooltip
            player={{
               playerId,
               displayName,
               opId,
            }}
         >
            <Stack direction="row" alignItems="center" gap={1}>
               <Stack textAlign="left">
                  <PortalCopyValue
                     value={playerId}
                     sx={{
                        '.MuiTypography-root': {
                           textOverflow: 'ellipsis',
                           overflow: 'hidden',
                           whiteSpace: 'nowrap',
                           maxWidth: '100px',
                        },
                     }}
                  />
                  <Box
                     sx={{ 'a:hover': { color: `${secondary[8]} !important` } }}
                  >
                     <Link
                        style={{
                           color: secondary[6],
                           textDecoration: 'none',
                        }}
                        href={`/players/details?id=${playerId}`}
                     >
                        <Typography display={'inline-block'} ml={1}>
                           {displayName}
                        </Typography>
                     </Link>
                  </Box>
               </Stack>
            </Stack>
         </PortalRelatedPlayerTooltip>
      </Stack>
   );
};

export const renderTestStatusCell = (isTest: boolean) => {
   return (
      <Stack direction="row" alignItems="flex-end" gap={1}>
         <Box sx={{ position: 'relative', left: 6 }}>
            {isTest && (
               <Tooltip title={'Test'} placement="left">
                  <FontAwesomeIcon
                     icon={faRobot as IconProp}
                     color={'#8098F9'}
                  />
               </Tooltip>
            )}
         </Box>
      </Stack>
   );
};

export const renderTimeCell = (value: string | number, timezone?: boolean) => {
   const time = new Date(value);

   return (
      <Stack textAlign={'center'} lineHeight={'11.66px'}>
         <PortalDateTime timestamp={time.toString()} timezone={timezone} />
         {value && (
            <Typography variant="h6" color={ImoonBlue[4]} m={0} p={0}>
               {moment(value).fromNow()}
            </Typography>
         )}
      </Stack>
   );
};

export const renderStatusTournamentCell = (from: number, to: number) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };
   let background = imoonGreen[5];
   let status = 'Not Started';
   if (from > moment().utc().unix() * 1000) {
      status = 'Not Started';
      styles = { color: 'warning', variant: 'outlined' };
      background = '#FDB022';
   } else if (from < to && moment().utc().unix() * 1000 < to) {
      status = 'Active ';
      styles = { color: 'success', variant: 'filled' };
      background = '#12B76A';
   } else {
      status = 'Ended  ';
      styles = { color: 'error', variant: 'filled' };
      background = '#F04438';
   }
   return (
      <Chip
         label={status}
         {...styles}
         sx={{
            textTransform: 'uppercase',
            fontSize: '10px',
            height: '20px',
            width: '80px',
            fontFamily: 'Nunito Sans Bold',
            color:
               styles.variant === 'filled'
                  ? createTheme(THEMES.DEFAULT).palette.primary.contrastText
                  : background,
            background:
               styles.variant === 'filled' ? background : 'transparent',
            letterSpacing: '0.4px',
            padding: '0px 8px',
            lineHeight: '13px',
            borderRadius: '6px',
         }}
      />
   );
};

export const renderRoundIndexCell = (roundIndex: number) => {
   return <PortalCopyValue value={`${roundIndex}`} />;
};

export const renderCurrencyCell = (currency: string) => {
   const currenciesInitData = store.getState().auth.currenciesInit;
   const currencyDataInit: Currency | any = currenciesInitData?.find(
      (item: Currency) => item.currency === currency
   );
   let base64Url;
   if (currencyDataInit && currencyDataInit.type === CurrencyType.CRYPTO) {
      base64Url = `https://s2.coinmarketcap.com/static/img/coins/64x64/${currencyDataInit?.cmcId}.png`;
   }
   return (
      <>
         {currency ? (
            <Stack
               direction="row"
               alignItems="center"
               gap={1}
               color={(props) => props.palette.text.primary}
            >
               {base64Url && (
                  <Image
                     src={base64Url}
                     alt="currency flag"
                     width={16}
                     height={16}
                  />
               )}

               <Typography component="span" p={0} variant="bodySmallBold">
                  {currency}
               </Typography>
            </Stack>
         ) : (
            <Typography variant="caption">--</Typography>
         )}
      </>
   );
};

export const renderModeCell = (
   mode: BetMode,
   insurance: boolean,
   autoCashout: boolean
) => {
   let modeObj = { icon: getModeIcons(mode), title: mode || '' };

   const title = modeObj.title.charAt(0).toUpperCase() + modeObj.title.slice(1);

   return (
      <Box justifyContent={'center'} display={'flex'} alignItems={'center'}>
         {insurance && (
            <Box px={0.5} lineHeight={1.2}>
               <Tooltip title="Insurance Enabled" placement="top">
                  <FontAwesomeIcon
                     icon={faShieldCheck as IconProp}
                     color={createTheme(THEMES.DEFAULT).palette.success.main}
                     fontSize={14}
                     fixedWidth
                  />
               </Tooltip>
            </Box>
         )}
         {mode === BetMode.classic && (
            <Box px={0.5} lineHeight={1.2}>
               <Tooltip title="autoCashout Enabled" placement="top">
                  <FontAwesomeIcon
                     icon={
                        autoCashout
                           ? (faCircleA as IconProp)
                           : (faCircleM as IconProp)
                     }
                     color={
                        autoCashout
                           ? createTheme(THEMES.DEFAULT).palette.success.main
                           : createTheme(THEMES.DEFAULT).palette.error.main
                     }
                     fontSize={14}
                     fixedWidth
                  />
               </Tooltip>
            </Box>
         )}

         <Stack direction="row" alignItems="center" gap={2} position="relative">
            <Tooltip title={title} placement={'top'}>
               <>
                  <FontAwesomeIcon
                     icon={modeObj.icon}
                     fontSize={18}
                     fixedWidth
                  />
                  {title}
               </>
            </Tooltip>
         </Stack>
      </Box>
   );
};

export const renderFlagCell = (country: string) => {
   let base64Url;
   let countryFullName;
   switch (country) {
      case 'UK': {
         base64Url = _.find(currencyData, {
            code: 'GB',
         })?.image;
         countryFullName = _.find(currencyData, {
            code: 'GB',
         })?.name;
         break;
      }

      default: {
         base64Url = _.find(currencyData, {
            code: country,
         })?.image;
         countryFullName = _.find(currencyData, {
            code: country,
         })?.name;
      }
   }

   return (
      <>
         {country ? (
            <Stack
               direction="row"
               alignItems="center"
               gap={1}
               color={(props) => props.palette.text.primary}
            >
               {base64Url && (
                  <Image
                     src={base64Url}
                     alt="currency flag"
                     width={16}
                     height={16}
                  />
               )}

               <Typography component="span" p={0} variant="bodySmallBold">
                  {countryFullName}
               </Typography>
            </Stack>
         ) : (
            <Typography variant="caption">--</Typography>
         )}
      </>
   );
};

export const renderPlayerBalanceCell = (balance: number, currency: string) => (
   <>
      {balance !== undefined ? (
         <PortalCurrencyValue
            value={balance}
            currency={currency}
            disableColor
            visibleCurrency={true}
         />
      ) : (
         <Typography variant="caption" sx={{ color: neutral[7] }}>
            --
         </Typography>
      )}
   </>
);

export const renderBetAmountCell = (
   betAmount: number,
   displayCurrency: string
) => (
   <PortalCurrencyValue
      value={betAmount}
      currency={displayCurrency}
      disableColor
      visibleCurrency={true}
   />
);

export const renderAmountCell = (
   betAmount: number,
   displayCurrency: string
) => (
   <PortalCurrencyValue
      value={betAmount}
      currency={displayCurrency}
      visibleCurrency={true}
      sx={{
         p: 0,
      }}
   />
);

export const renderBetCountCell = (betCount: number) => (
   <Typography variant="bodySmallBold">
      {numeral(betCount).format('0,00.[00]')}
   </Typography>
);

export const renderPLCell = (PL: number, displayCurrency: string) => {
   return (
      <PortalCurrencyValue
         value={PL}
         currency={displayCurrency}
         variant="bodySmallBold"
         visibleCurrency={true}
      />
   );
};

export const renderStatusCell = (status: boolean) => {
   return (
      <Typography
         component={'p'}
         variant="headLine"
         color={status ? tertiary[6] : red[2]}
         sx={{
            width: '12px',
            height: '12px',
            background: `${status ? tertiary[6] : red[2]}`,
            border: `2px solid ${grey[200]}`,
            borderRadius: '50%',
            margin: '0 auto',
         }}
      >
         {status}
      </Typography>
   );
};

export const renderActionCell = ({
   row,
}: GridRenderCellParams<any, any, any>) => {
   return (
      <Link
         href={`/crash/bets/logs?id=${row.id}`}
         style={{ textDecoration: 'none' }}
      >
         <IconButton className="showOnHover">
            <FontAwesomeIcon
               icon={faChevronRight as IconProp}
               fixedWidth
               fontSize={16}
            />
         </IconButton>
      </Link>
   );
};

export interface ChipStyles {
   color:
      | 'error'
      | 'success'
      | 'warning'
      | 'info'
      | 'default'
      | 'primary'
      | 'secondary';
   variant?: 'filled' | 'outlined';
}

export const renderCrashPointCell = (params: any) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };
   if (params <= 1.8 || (params && params.value <= 1.8)) {
      if ((params && params.value === 0) || params === 0) {
         styles = { color: 'warning', variant: 'filled' };
      } else if ((params && params.value === 1) || params === 1) {
         styles = { color: 'info', variant: 'filled' };
      } else {
         styles = { color: 'error', variant: 'filled' };
      }
   } else if ((params && params.value > 1.8) || params > 1.8) {
      styles = { color: 'success', variant: 'filled' };
   } else {
      styles = { color: 'warning', variant: 'filled' };
   }

   return (
      <Chip
         label={
            typeof params === 'number'
               ? `${params}x`
               : params && typeof params.value === 'number'
               ? `${params.value}x`
               : `??x`
         }
         {...styles}
         sx={{
            minWidth: '58px',
            width: 'fit-content',
         }}
      />
   );
};

export const renderBetStatusCell = (status: BetStatus) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };
   let background = imoonGreen[5];
   switch (status) {
      case BetStatus.WON:
         styles = { color: 'error', variant: 'filled' };
         background = '#F04438';
         break;
      case BetStatus.LOST:
         styles = { color: 'success', variant: 'filled' };
         background = '#12B76A';
         break;
      case BetStatus.OPEN:
         styles = { color: 'warning', variant: 'outlined' };
         background = '#FDB022';
         break;
      case BetStatus.CASHBACK:
         styles = { color: 'info', variant: 'filled' };
         background = '#EE6700';
         break;
      case BetStatus.CANCELED:
         styles = { color: 'warning', variant: 'filled' };
         background = '#FDB022';
         break;
   }

   return (
      <Chip
         label={status}
         {...styles}
         sx={{
            textTransform: 'uppercase',
            fontSize: '10px',
            height: '20px',
            width: '80px',
            fontFamily: 'Nunito Sans Bold',
            color:
               styles.variant === 'filled'
                  ? createTheme(THEMES.DEFAULT).palette.primary.contrastText
                  : background,
            background:
               styles.variant === 'filled' ? background : 'transparent',
            letterSpacing: '0.4px',
            padding: '0px 8px',
            lineHeight: '13px',
            borderRadius: '6px',
         }}
      />
   );
};

export const renderCashinCashoutStatusCell = (status: boolean) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };
   let background = imoonGreen[5];
   switch (status) {
      case true:
         styles = { color: 'warning', variant: 'outlined' };
         background = '#FDB022';
         break;
      case false:
         styles = { color: 'success', variant: 'filled' };
         background = '#12B76A';
         break;
   }

   return (
      <Chip
         label={status ? 'Open' : 'Closed'}
         {...styles}
         sx={{
            textTransform: 'uppercase',
            fontSize: '10px',
            height: '20px',
            width: '80px',
            fontFamily: 'Nunito Sans Bold',
            color:
               styles.variant === 'filled'
                  ? createTheme(THEMES.DEFAULT).palette.primary.contrastText
                  : background,
            background:
               styles.variant === 'filled' ? background : 'transparent',
            letterSpacing: '0.4px',
            padding: '0px 8px',
            lineHeight: '13px',
            borderRadius: '6px',
         }}
      />
   );
};

export const renderWinStatusCell = (status: BetStatus, value: string) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };
   let background = imoonGreen[5];
   switch (status) {
      case BetStatus.WON:
         styles = { color: 'success', variant: 'filled' };
         background = '#F04438';
         break;
      case BetStatus.LOST:
         styles = { color: 'error', variant: 'filled' };
         background = '#12B76A';
         break;
      case BetStatus.OPEN:
         styles = { color: 'warning', variant: 'outlined' };
         background = '#FDB022';
         break;
      case BetStatus.CASHBACK:
         styles = { color: 'info', variant: 'filled' };
         background = '#EE6700';
         break;
      case BetStatus.CANCELED:
         styles = { color: 'warning', variant: 'filled' };
         background = '#FDB022';
         break;
   }

   return (
      <Chip
         label={value}
         {...styles}
         sx={{
            textTransform: 'uppercase',
            fontSize: '10px',
            height: '20px',
            width: '80px',
            fontFamily: 'Nunito Sans Bold',
            color:
               styles.variant === 'filled'
                  ? createTheme(THEMES.DEFAULT).palette.primary.contrastText
                  : background,
            background:
               styles.variant === 'filled' ? background : 'transparent',
            letterSpacing: '0.4px',
            padding: '0px 8px',
            lineHeight: '13px',
            borderRadius: '6px',
         }}
      />
   );
};

export const renderMinStackCell = (value: string) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };
   let background = imoonGreen[5];
   const matchResult = value.match(/\d+(\.\d+)?/);
   const numericValue: number = matchResult ? parseFloat(matchResult[0]) : 0;
   if (numericValue < 0.05) {
      styles = { color: 'error', variant: 'filled' };
      background = '#F04438';
   } else if (numericValue < 0.1) {
      styles = { color: 'warning', variant: 'filled' };
      background = '#FDB022';
   } else {
      styles = { color: 'success', variant: 'filled' };
      background = '#12B76A';
   }

   return (
      <Chip
         label={`${value}`}
         {...styles}
         sx={{
            textTransform: 'uppercase',
            fontSize: '10px',
            height: '20px',
            width: '80px',
            fontFamily: 'Nunito Sans Bold',
            color:
               styles.variant === 'filled'
                  ? createTheme(THEMES.DEFAULT).palette.primary.contrastText
                  : background,
            background:
               styles.variant === 'filled' ? background : 'transparent',
            letterSpacing: '0.4px',
            padding: '0px 8px',
            lineHeight: '13px',
            borderRadius: '6px',
         }}
      />
   );
};

export const renderIntegrationTypeCell = (integrationType: IntegrationType) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };

   switch (integrationType) {
      case IntegrationType.ALIEN:
         styles = { color: 'info', variant: 'filled' };
         break;
      case IntegrationType.ALIEN_STANDALONE:
         styles = { color: 'success', variant: 'filled' };
         break;
      case IntegrationType.EVERYMATRIX:
         styles = { color: 'default', variant: 'outlined' };
         break;
   }

   return (
      <Chip
         label={integrationType}
         {...styles}
         sx={{
            textTransform: 'capitalize',
         }}
      />
   );
};

export const renderActivityTypeCell = (type: PlayerActivityType) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };

   switch (type) {
      case PlayerActivityType.LAUNCH:
         styles = { color: 'success', variant: 'filled' };
         break;
      case PlayerActivityType.LOGOUT:
         styles = { color: 'warning', variant: 'filled' };
         break;
      case PlayerActivityType.LOGIN:
         styles = { color: 'info', variant: 'filled' };
         break;
      case PlayerActivityType.CONNECT:
         styles = { color: 'info', variant: 'filled' };
         break;
      case PlayerActivityType.CONNECTED:
         styles = { color: 'success', variant: 'filled' };
         break;
      case PlayerActivityType.DISCONNECTED:
         styles = { color: 'error', variant: 'filled' };
         break;
   }

   return (
      <Chip
         label={type}
         {...styles}
         sx={{
            textTransform: 'capitalize',
            fontSize: createTheme(THEMES.DEFAULT).breakpoints.down('sm')
               ? '10px'
               : '12px',
            height: '17px',
            fontFamily: 'Nunito Sans Regular',
            color: createTheme(THEMES.DEFAULT).palette.primary.contrastText,
            letterSpacing: '0.4px',
            padding: '2px',
         }}
      />
   );
};

export const renderGameStatusCell = (status: GameStatus) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };

   switch (status) {
      case GameStatus.DISABLED:
         styles = { color: 'error', variant: 'filled' };
         break;
      case GameStatus.ACTIVE:
         styles = { color: 'success', variant: 'filled' };
         break;
      case GameStatus.MAINTENANCE:
         styles = { color: 'warning', variant: 'outlined' };
         break;
      case GameStatus.DEPRECATE:
         styles = { color: 'info', variant: 'filled' };
         break;
   }

   return (
      <Chip
         label={status}
         {...styles}
         sx={{
            textTransform: 'uppercase',
            fontSize: '10px',
            height: '20px',
            width: '91px',
            fontFamily: 'Nunito Sans Bold',
            color: createTheme(THEMES.DEFAULT).palette.primary.contrastText,
            letterSpacing: '0.4px',
            padding: '0px 8px',
            lineHeight: '13px',
            borderRadius: '6px',
         }}
      />
   );
};

export const renderGameCoresStatusCell = (status: GameCoreStatus) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };

   switch (status) {
      case GameCoreStatus.DISABLED:
         styles = { color: 'error', variant: 'filled' };
         break;
      case GameCoreStatus.ACTIVE:
         styles = { color: 'success', variant: 'filled' };
         break;
      case GameCoreStatus.MAINTENANCE:
         styles = { color: 'warning', variant: 'filled' };
         break;
      case GameCoreStatus.DEPRECATE:
         styles = { color: 'info', variant: 'filled' };
         break;
   }

   return (
      <Chip
         label={status}
         {...styles}
         sx={{
            textTransform: 'uppercase',
            fontSize: '10px',
            height: '20px',
            width: '91px',
            fontFamily: 'Nunito Sans Bold',
            color: createTheme(THEMES.DEFAULT).palette.primary.contrastText,
            letterSpacing: '0.4px',
            padding: '0px 8px',
            lineHeight: '13px',
            borderRadius: '6px',
         }}
      />
   );
};

export const renderGameCoresGameConfigTypeCell = (status: ConfigType) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };

   switch (status) {
      case ConfigType.ALIEN_CRASH:
         styles = { color: 'success', variant: 'filled' };
         break;
      case ConfigType.ALIEN_JDB:
         styles = { color: 'warning', variant: 'filled' };
         break;
   }

   return (
      <Chip
         label={status}
         {...styles}
         sx={{
            textTransform: 'uppercase',
            fontSize: '10px',
            height: '20px',
            width: '91px',
            fontFamily: 'Nunito Sans Bold',
            color: createTheme(THEMES.DEFAULT).palette.primary.contrastText,
            letterSpacing: '0.4px',
            padding: '0px 8px',
            lineHeight: '13px',
            borderRadius: '6px',
         }}
      />
   );
};

export const renderUserScopeCell = (scope: UserScope) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };
   let background = imoonGreen[5];
   switch (scope) {
      case UserScope.AFFILIATE:
         styles = { color: 'error', variant: 'filled' };
         background = imoonOrange[5];
         break;
      case UserScope.SUPERADMIN:
         styles = { color: 'success', variant: 'filled' };
         background = '#2E90FA';
         break;
      case UserScope.OPERATOR:
         styles = { color: 'warning', variant: 'filled' };
         background = imoonGreen[5];
         break;
      case UserScope.ADMIN:
         styles = { color: 'info', variant: 'filled' };
         background = imoonRose[5];
         break;
      case UserScope.BRAND:
         styles = { color: 'default', variant: 'filled' };
         background = darkPurple[5];
         break;
   }

   return (
      <Chip
         label={scope}
         {...styles}
         sx={{
            textTransform: 'uppercase',
            fontSize: '10px',
            height: '20px',
            width: '91px',
            background: background,
            fontFamily: 'Nunito Sans Bold',
            color: createTheme(THEMES.DEFAULT).palette.primary.contrastText,
            letterSpacing: '0.4px',
            padding: '0px 8px',
            lineHeight: '13px',
            borderRadius: '6px',
         }}
      />
   );
};

export const RenderTransactionStatusCell = ({
   status,
   transactionType,
   openDetails,
}: {
   status: TransactionStatus;
   transactionType?: TransactionType;
   openDetails?: Function;
}) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };
   const operator = useSelector(selectAuthCurrentOperator) as Operator;
   switch (status) {
      case TransactionStatus.REJECTED:
         styles = { color: 'error', variant: 'filled' };
         break;
      case TransactionStatus.CONFIRMED:
         styles = { color: 'success', variant: 'filled' };
         break;
      case TransactionStatus.PENDING:
         styles = { color: 'warning', variant: 'filled' };
         break;
      default:
         styles = { color: 'info', variant: 'filled' };
         break;
   }

   return (
      <Chip
         label={status}
         {...styles}
         sx={{
            textTransform: 'uppercase',
            fontSize: '10px',
            height: '20px',
            width: '91px',
            fontFamily: 'Nunito Sans Bold',
            background:
               status === TransactionStatus.CANCELED
                  ? ImoonGray[5]
                  : styles.color,
            color: createTheme(THEMES.DEFAULT).palette.primary.contrastText,
            letterSpacing: '0.4px',
            padding: '0px 8px',
            lineHeight: '13px',
            borderRadius: '6px',
         }}
         onClick={() => {
            if (
               operator?.integrationType === IntegrationType.ALIEN_STANDALONE
            ) {
               openDetails && openDetails();
            }
         }}
      />
   );
};
export const renderOperatorStatusCell = (status: OperatorStatus) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };
   let background = imoonGreen[5];
   switch (status) {
      case OperatorStatus.DISABLED:
         styles = { color: 'error', variant: 'filled' };
         background = '#F04438';
         break;
      case OperatorStatus.ACTIVE:
         styles = { color: 'success', variant: 'filled' };
         background = '#12B76A';
         break;
      case OperatorStatus.MAINTENANCE:
         styles = { color: 'warning', variant: 'filled' };
         background = '#175CD3';
         break;
   }

   return (
      <Chip
         label={status}
         {...styles}
         sx={{
            textTransform: 'uppercase',
            fontSize: '10px',
            height: '20px',
            width: '91px',
            fontFamily: 'Nunito Sans Bold',
            color: createTheme(THEMES.DEFAULT).palette.primary.contrastText,
            background: background,
            letterSpacing: '0.4px',
            padding: '0px 8px',
            lineHeight: '13px',
            borderRadius: '6px',
         }}
      />
   );
};

export const renderTransactionTypeCell = (type: TransactionType) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };
   let background = imoonGreen[5];
   switch (type) {
      case TransactionType.WITHDRAW:
         styles = { color: 'success', variant: 'filled' };
         background = '#ffab40';
         break;
      case TransactionType.DEPOSIT:
         styles = { color: 'success', variant: 'filled' };
         background = '#07932C';
         break;
      case TransactionType.TOPUP:
         styles = { color: 'warning', variant: 'filled' };
         background = '#175CD3';
         break;
   }

   return (
      <Chip
         label={type}
         {...styles}
         sx={{
            textTransform: 'uppercase',
            fontSize: '10px',
            height: '20px',
            width: '91px',
            fontFamily: 'Nunito Sans Bold',
            color: createTheme(THEMES.DEFAULT).palette.primary.contrastText,
            background: background,
            letterSpacing: '0.4px',
            padding: '0px 8px',
            lineHeight: '13px',
            borderRadius: '6px',
         }}
      />
   );
};

export const renderGameCell = (
   gameId: string,
   title?: string,
   href?: string,
   V2?: boolean,
   firstChild?: boolean
) => {
   const user = store.getState().auth.user as User;
   const opId = store.getState().auth.operator;

   return (
      <Stack direction="row" alignItems="flex-end" gap={1}>
         <Stack direction="row" alignItems="center" gap={1}>
            <Stack
               textAlign={firstChild ? 'left' : 'center'}
               sx={{
                  span: {
                     textOverflow: 'ellipsis',
                     overflow: 'hidden',
                     whiteSpace: 'nowrap',
                     maxWidth: '100px',
                  },
               }}
            >
               <Typography component="span" variant="bodySmallBold">
                  {gameId}
               </Typography>

               <Box sx={{ 'a:hover': { color: `${secondary[8]} !important` } }}>
                  {(hasDetailsPermission(
                     UserPermissionEvent.BACKOFFICE_OPERATOR_GET_GAME_REQ
                  ) ||
                     hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_OPERATOR_GET_GAME_V2_REQ
                     )) &&
                  [
                     UserScope.SUPERADMIN,
                     UserScope.ADMIN,
                     UserScope.OPERATOR,
                  ].includes(user?.scope) &&
                  !V2 ? (
                     <Link
                        href={
                           href ||
                           (user?.scope === UserScope.SUPERADMIN ||
                           user?.scope === UserScope.ADMIN
                              ? `/games/details?id=${gameId}`
                              : `operators/operatorGameDetails?id=${gameId}&opId=${opId}`)
                        }
                     >
                        <Typography
                           variant="h6"
                           color={ImoonBlue[4]}
                           sx={{
                              maxWidth: '100px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              px: '2px',
                           }}
                        >
                           {title}
                        </Typography>
                     </Link>
                  ) : (
                     <Typography
                        variant="h6"
                        color={ImoonBlue[4]}
                        sx={{
                           maxWidth: '100px',
                           overflow: 'hidden',
                           textOverflow: 'ellipsis',
                           px: '2px',
                        }}
                     >
                        {title}
                     </Typography>
                  )}
               </Box>
            </Stack>
         </Stack>
      </Stack>
   );
};

export const renderBrandCell = (
   opId: string,
   brandId: string,
   title?: string,
   href?: string
) => {
   const handlePermissionBrand = () => {
      if (
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_ACTIVE_PAYMENT_GATEWAYS_REQ
         ) ||
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_KYC_VERIFICATIONS_REQ
         ) ||
         hasDetailsPermission(
            UserPermissionEvent.BACKOFFICE_GET_MESSAGES_IN_LANGUAGE_REQ
         )
      ) {
         return true;
      } else {
         return false;
      }
   };
   return (
      <Stack
         direction="column"
         alignItems="center"
         gap={0}
         sx={{
            'svg path': { opacity: '1 !important' },
         }}
      >
         {opId === '*' || brandId === '*' ? (
            <FontAwesomeIcon
               icon={faStar as IconProp}
               fixedWidth
               color={imoonOrange[6]}
               fontSize={14}
            />
         ) : handlePermissionBrand() ? (
            <Box
               sx={{
                  'a:hover': { color: `${secondary[8]} !important` },
                  lineHeight: '11.6px',
                  a: {
                     lineHeight: '11.6px',
                  },
               }}
            >
               <Link
                  style={{ textDecoration: 'none' }}
                  href={`/brands/details?id=${opId}&brandId=${brandId}`}
               >
                  <Typography
                     display={'inline-block'}
                     ml={1}
                     variant="bodySmallBold"
                     color={darkPurple[1]}
                  >
                     {brandId}
                  </Typography>
               </Link>
            </Box>
         ) : (
            <Typography component="span" variant="bodySmallBold">
               {brandId}
            </Typography>
         )}
         <Box sx={{ 'a:hover': { color: `${secondary[8]} !important` } }}>
            {opId === '*' || brandId === '*' ? (
               <></>
            ) : handlePermissionBrand() ? (
               <Box
                  sx={{
                     'a:hover': { color: `${secondary[8]} !important` },
                  }}
               >
                  <Link
                     style={{ textDecoration: 'none' }}
                     href={`/brands/details?id=${opId}&brandId=${brandId}`}
                  >
                     <Typography
                        display={'inline-block'}
                        ml={1}
                        variant="h6"
                        color={ImoonBlue[4]}
                     >
                        {title}
                     </Typography>
                  </Link>
               </Box>
            ) : (
               <Typography component="span" variant="h6" color={ImoonBlue[4]}>
                  {title}
               </Typography>
            )}
         </Box>
      </Stack>
   );
};

export const renderPaymentStatusCell = (status: boolean) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };

   switch (status) {
      case false:
         styles = { color: 'error', variant: 'filled' };
         break;
      case true:
         styles = { color: 'success', variant: 'filled' };
         break;
   }

   return (
      <Chip
         label={status ? 'Active' : 'Inactive'}
         {...styles}
         sx={{
            textTransform: 'uppercase',
            fontSize: '10px',
            height: '20px',
            width: '91px',
            fontFamily: 'Nunito Sans Bold',
            color: createTheme(THEMES.DEFAULT).palette.primary.contrastText,
            letterSpacing: '0.4px',
            padding: '0px 8px',
            lineHeight: '13px',
            borderRadius: '6px',
         }}
      />
   );
};

export const renderWithdrawCell = (
   gateway: PaymentGatewayName,
   status: TransactionStatus,
   destinationCard?: string,
   nameOnDestinationCard?: string
) => {
   return (
      <Stack direction="row" gap={2} alignItems="flex-start">
         <Stack>
            <Typography
               variant="caption"
               sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  maxWidth: '100px',
               }}
            >
               {gateway}
            </Typography>

            {destinationCard && (
               <Grid
                  container
                  direction="row"
                  alignItems="center"
                  mb={2}
                  spacing={0}
               >
                  <Grid item mr={1}>
                     <Typography variant="bodySmallBold">
                        Destination Card :
                     </Typography>
                  </Grid>
                  <Grid item>
                     <PortalCopyValue
                        value={destinationCard}
                        color={secondary[6]}
                     />
                  </Grid>
               </Grid>
            )}
            {nameOnDestinationCard && (
               <Grid
                  container
                  direction="row"
                  alignItems="center"
                  mb={2}
                  spacing={0}
               >
                  <Grid item mr={1}>
                     <Typography variant="bodySmallBold">
                        Name On Destination Card :
                     </Typography>
                  </Grid>
                  <Grid item>
                     <PortalCopyValue
                        value={nameOnDestinationCard}
                        color={secondary[6]}
                     />
                  </Grid>
               </Grid>
            )}
         </Stack>
      </Stack>
   );
};

export const renderWebhookResultCell = (webhook: string) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };
   switch (webhook) {
      case WebhookType.WEBHOOK_RESULT:
         styles = { color: 'info', variant: 'filled' };
         break;
      case WebhookType.WEBHOOK_END_PLAY:
         styles = { color: 'info', variant: 'filled' };
         break;
      case WebhookType.WEBHOOK_BET:
         styles = { color: 'success', variant: 'filled' };
         break;
      case WebhookType.WEBHOOK_ROLLBACK:
         styles = { color: 'warning', variant: 'filled' };
         break;
      case WebhookType.WEBHOOK_GET_BALANCE:
         styles = { color: 'primary', variant: 'filled' };
         break;
      case WebhookType.WEBHOOK_PLAYER_INFO:
         styles = { color: 'secondary', variant: 'filled' };
         break;
   }

   return (
      <Chip
         label={webhook}
         {...styles}
         sx={{
            textTransform: 'capitalize',
            fontSize: createTheme(THEMES.DEFAULT).breakpoints.down('sm')
               ? '10px'
               : '12px',
            height: '17px',
            fontFamily: 'Nunito Sans Regular',
            color: createTheme(THEMES.DEFAULT).palette.primary.contrastText,
            letterSpacing: '0.4px',
            padding: '2px',
         }}
      />
   );
};

export const renderWebhookLevelCell = (webhook: string) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };
   switch (webhook) {
      case LogLevel.INFORMATION:
         styles = { color: 'info', variant: 'filled' };
         break;
      case LogLevel.VERBOSE:
         styles = { color: 'success', variant: 'filled' };
         break;
      case LogLevel.WARNING:
         styles = { color: 'warning', variant: 'filled' };
         break;
      case LogLevel.ALERT:
         styles = { color: 'warning', variant: 'filled' };
         break;
      case LogLevel.ERROR:
         styles = { color: 'error', variant: 'filled' };
         break;
   }

   return (
      <Chip
         label={webhook}
         {...styles}
         sx={{
            textTransform: 'capitalize',
            fontSize: createTheme(THEMES.DEFAULT).breakpoints.down('sm')
               ? '10px'
               : '12px',
            height: '17px',
            fontFamily: 'Nunito Sans Regular',
            color: createTheme(THEMES.DEFAULT).palette.primary.contrastText,
            letterSpacing: '0.4px',
            padding: '2px',
         }}
      />
   );
};

export const renderWebhookStatusCell = (webhookStatus: string) => {
   let styles: ChipStyles = { color: 'default', variant: 'filled' };
   let icon = <FontAwesomeIcon icon={faCircleCheck as IconProp} size="sm" />;
   switch (webhookStatus) {
      case WebhookStatus.OK:
         styles = { color: 'success', variant: 'filled' };
         icon = <FontAwesomeIcon icon={faCircleCheck as IconProp} size="sm" />;
         break;
      case WebhookStatus.ERROR:
         styles = { color: 'error', variant: 'filled' };
         icon = (
            <FontAwesomeIcon icon={faCircleExclamation as IconProp} size="sm" />
         );
         break;
      case WebhookStatus.TIMEOUT_ERROR:
         styles = { color: 'error', variant: 'filled' };
         icon = (
            <FontAwesomeIcon icon={faCircleExclamation as IconProp} size="sm" />
         );
         break;
      case WebhookStatus.HTTP_ERROR:
         styles = { color: 'error', variant: 'filled' };
         icon = (
            <FontAwesomeIcon icon={faCircleExclamation as IconProp} size="sm" />
         );
         break;
      case WebhookStatus.VALIDATION_ERROR:
         styles = { color: 'error', variant: 'filled' };
         icon = (
            <FontAwesomeIcon icon={faCircleExclamation as IconProp} size="sm" />
         );
         break;
   }

   return (
      <Chip
         label={webhookStatus}
         {...styles}
         icon={icon}
         sx={{
            textTransform: 'capitalize',
            fontSize: createTheme(THEMES.DEFAULT).breakpoints.down('sm')
               ? '10px'
               : '12px',
            height: '17px',
            fontFamily: 'Nunito Sans Regular',
            color: createTheme(THEMES.DEFAULT).palette.primary.contrastText,
            letterSpacing: '0.4px',
            padding: '2px',
         }}
      />
   );
};

export const renderWebhookLatencyCell = (webhookLatency: number) => {
   let styles = { color: '#000' };
   switch (true) {
      case webhookLatency < 200:
         styles = { color: '#12B76A' };
         break;
      case webhookLatency >= 200 && webhookLatency < 400:
         styles = { color: '#F79009' };
         break;
      case webhookLatency >= 500 && webhookLatency < 800:
         styles = { color: '#EE6700' };
         break;
      case webhookLatency >= 800:
         styles = { color: '#D92D20' };
         break;
   }

   return (
      <Chip
         label={webhookLatency}
         sx={{
            background: 'transparent',
            textTransform: 'capitalize',
            fontSize: createTheme(THEMES.DEFAULT).breakpoints.down('sm')
               ? '10px'
               : '12px',
            fontFamily: 'Nunito Sans SemiBold',
            color: styles.color,
            padding: '0',
            height: '17px',
            span: {
               padding: 0,
            },
         }}
      />
   );
};
