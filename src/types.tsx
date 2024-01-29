import {
   GetFinancialReportDto,
   Notification,
   NotificationSeverity,
   NotificationType,
} from '@alienbackoffice/back-front';

export enum DateGraph {
   TODAY = 'today',
   YESTERDAY = 'yesterday',
   LAST7DAYS = 'last7days',
   LAST30DAYS = 'last30days',
   THISMONTH = 'thismonth',
   LASTMONTH = 'lastmonth',
}
export enum Granularity {
   ONEMINUTE = 'oneMinute',
   FIVEMUNITE = 'fiveMunite',
   THIRTYMUNITE = 'thirtyMunite',
   ONEHOUR = 'oneHour',
   SIXHOUR = 'sixHour',
   ONEDAY = 'oneDay',
   ONEMONTH = 'oneMonth',
}

export enum Modules {
   WEBSITE = 'WEBSITE',
   ACTIVITIES = 'ACTIVITIES',
   USER = 'USER',
   OPERATOR = 'OPERATOR',
   PLAYERS = 'PLAYERS',
   BETS = 'BETS',
   REPORTS = 'REPORTS',
   OPREPORTS = 'OPREPORTS',
   OPROLEREPORTS = 'OPROLEREPORTS',
   BRAND = 'BRAND',
   GAMES = 'GAMES',
   SERVICES = 'SERVICES',
   LAUNCHES = 'LAUNCHES',
   DASHBOARD = 'DASHBOARD',
   AFFILIATE = 'AFFILIATE',
   OPERATORGAMES = 'OPERATORGAMES',
   CRASH = 'CRASH',
   SUPPORT = 'SUPPORT',
   PAYMENT = 'PAYMENT',
   SETTING = 'SETTING',
   HELP = 'HELP',
}

export enum MenuModules {
   DASHBOARD = 'DASHBOARD',
   REPORTS = 'REPORTS',
   QUICKREPORT = 'QUICKREPORT',
   STATS = 'STATS',
   STATSC = 'STATSC',
   OPERATORS = 'OPERATORS',
   BETS = 'BETS',
   GAMES = 'GAMES',
   GAMECORES = 'GAMECORES',
   GAMESV2 = 'GAMESV2',
   OPERATORGAMES = 'OPERATORGAMES',
   OPERATORCONFIGS = 'OPERATORCONFIGS',
   PLAYERS = 'PLAYERS',
   USERS = 'USERS',
   PLAYERACTIVITIES = 'PLAYERACTIVITIES',
   USERACTIVITIES = 'USERACTIVITIES',
   TRANSACTIONS = 'TRANSACTIONS',
   AllTRANSACTIONS = 'ALLTRANSACTIONS',
   OPERATORTRANSACTIONS = 'OPERATORTRANSACTIONS',
   DEPOSITS = 'DEPOSITS',
   WITHDRAWS = 'WITHDRAWS',
   TOPUPS = 'TOPUPS',
   PAYMENTS = 'PAYMENTS',
   EXCHANGERATES = 'EXCHANGERATES',
   SETTING = 'SETTING',
   VERIFICATION = 'VERIFICATION',
   LOGS = 'LOGS',
   TOURNAMENT = 'TOURNAMENT',
   TOURNAMENTV2 = 'TOURNAMENTV2',
   BRAND = 'BRAND',
   BRANDDETAILS = 'BRANDDETAILS',
   GATEWAYREPORT = 'GATEWAYREPORT',
   WALLETBALANCE = 'WALLETBALANCE',
   REALTIME = 'REALTIME',
   PG = 'PG',
   PGPLAYERS = 'PGPLAYERS',
   PGBETS = 'PGBETS',
   CASHINGCASHOUT = 'CASHINGCASHOUT',
   DEVOPS = 'DEVOPS',
   CLOUDFLARE = 'CLOUDFLARE',
}

export enum Version {
   NAME = 'v2.0.653',
}

export enum LogsTime {
   CUSTOMDATE = 'customDate',
   TODAY = 'today',
   LAST3DAYS = 'Last3Days',
   LAST7DAYS = 'Last7Days',
   THISWEEK = 'thisWeek',
   THISMONTH = 'thisMonth',
   LASTMONTH = 'LastMonth',
   LAST3MONTH = 'Last3Months',
   LAST6MONTH = 'Last6Months',
   YESTERDAY = 'yesterday',
   ONEMINUTE = 'oneMinute',
   FIVEMUNITE = 'fiveMunite',
   THIRTYMUNITE = 'thirtyMunite',
   ONEHOUR = 'oneHour',
   TWOHOUR = 'twoHour',
   SIXHOUR = 'sixHour',
   LAST30DAYS = 'Last30Days',
}

export enum LogsTimeText {
   CUSTOMDATE = 'Custom Date',
   TODAY = 'Today',
   YESTERDAY = 'Yesterday',
   THISWEEK = 'This Week',
   THISMONTH = 'This Month',
   LASTMONTH = 'Last Month',
   LAST3MONTH = 'Last 3 Months',
   LAST6MONTH = 'Last 6 Months',
   ONEMINUTE = 'Last min',
   FIVEMUNITE = 'Last 5 min',
   THIRTYMUNITE = 'Last 30 min',
   ONEHOUR = 'Last 1 Hour',
   TWOHOUR = 'Last 2 Hours',
   SIXHOUR = 'Last 6 Hours',
   LAST3DAYS = 'Last 3 Days',
   LAST7DAYS = 'Last 7 Days',
   LAST30DAYS = 'Last 30 Days',
}

export interface StartEndDateProps {
   startDate: Date;
   endDate: Date;
   searchDate?: number;
}

export enum THEME {
   LIGHT = 'light',
   DARK = 'dark',
}

export enum ENV {
   STAGE = 'STAGE',
   DEV = 'DEV',
   PROD = 'PROD',
   TEST = 'TEST',
}

export enum COLORBADGEENV {
   STAGE = 'orange',
   DEV = '#F79009',
   PROD = '',
   TEST = '#407ad6',
}

export const localeEn = {
   format: '{reason} at line {line}',
   symbols: {
      colon: 'colon', // :
      comma: 'comma', // ,  ،  、
      semicolon: 'semicolon', // ;
      slash: 'slash', // /  relevant for comment syntax support
      backslash: 'backslash', // \  relevant for escaping character
      brackets: {
         round: 'round brackets', // ( )
         square: 'square brackets', // [ ]
         curly: 'curly brackets', // { }
         angle: 'angle brackets', // < >
      },
      period: 'period', // . Also known as full point, full stop, or dot
      quotes: {
         single: 'single quote', // '
         double: 'double quote', // "
         grave: 'grave accent', // ` used on Javascript ES6 Syntax for String Templates
      },
      space: 'space', //
      ampersand: 'ampersand', // &
      asterisk: 'asterisk', // *  relevant for some comment sytanx
      at: 'at sign', // @  multiple uses in other coding languages including certain data types
      equals: 'equals sign', // =
      hash: 'hash', // #
      percent: 'percent', // %
      plus: 'plus', // +
      minus: 'minus', // −
      dash: 'dash', // −
      hyphen: 'hyphen', // −
      tilde: 'tilde', // ~
      underscore: 'underscore', // _
      bar: 'vertical bar', // |
   },
   types: {
      // ... Reference: https://en.wikipedia.org/wiki/List_of_data_structures
      key: 'key',
      value: 'value',
      number: 'number',
      string: 'string',
      primitive: 'primitive',
      boolean: 'boolean',
      character: 'character',
      integer: 'integer',
      array: 'array',
      float: 'float',
   },
   invalidToken: {
      tokenSequence: {
         prohibited:
            "'{firstToken}' token cannot be followed by '{secondToken}' token(s)",
         permitted:
            "'{firstToken}' token can only be followed by '{secondToken}' token(s)",
      },
      termSequence: {
         prohibited: 'A {firstTerm} cannot be followed by a {secondTerm}',
         permitted: 'A {firstTerm} can only be followed by a {secondTerm}',
      },
      double: "'{token}' token cannot be followed by another '{token}' token",
      useInstead:
         "'{badToken}' token is not accepted. Use '{goodToken}' instead",
      unexpected: "Unexpected '{token}' token found",
   },
   brace: {
      curly: {
         missingOpen: "Missing '{' open curly brace",
         missingClose:
            "Open '{' curly brace is missing closing '}' curly brace",
         cannotWrap: "'{token}' token cannot be wrapped in '{}' curly braces",
      },
      square: {
         missingOpen: "Missing '[' open square brace",
         missingClose:
            "Open '[' square brace is missing closing ']' square brace",
         cannotWrap: "'{token}' token cannot be wrapped in '[]' square braces",
      },
   },
   string: {
      missingOpen: "Missing/invalid opening string '{quote}' token",
      missingClose: "Missing/invalid closing string '{quote}' token",
      mustBeWrappedByQuotes: 'Strings must be wrapped by quotes',
      nonAlphanumeric:
         "Non-alphanumeric token '{token}' is not allowed outside string notation",
      unexpectedKey: 'Unexpected key found at string position',
   },
   key: {
      numberAndLetterMissingQuotes:
         'Key beginning with number and containing letters must be wrapped by quotes',
      spaceMissingQuotes: 'Key containing space must be wrapped by quotes',
      unexpectedString: 'Unexpected string found at key position',
   },
   noTrailingOrLeadingComma:
      'Trailing or leading commas in arrays and objects are not permitted',
};

export const dark_vscode_tribute = {
   default: '#D4D4D4',
   background: '#1E1E1E',
   background_warning: '#1E1E1E',
   string: '#CE8453',
   number: '#B5CE9F',
   colon: '#49B8F7',
   keys: '#9CDCFE',
   keys_whiteSpace: '#AF74A5',
   primitive: '#6392C6',
};

export enum CURENCYTYPE {
   ORIGINAL = 'Original Currency',
   INUSD = 'InUSD',
   INEUR = 'InEUR',
}

export const curenciesType = [
   {
      value: 0,
      name: CURENCYTYPE.ORIGINAL,
   },
   {
      value: 1,
      name: CURENCYTYPE.INUSD,
   },
   {
      value: 2,
      name: CURENCYTYPE.INEUR,
   },
];

export declare class NotificationItem extends Notification {
   read: boolean;
   id: string;
   type: NotificationType;
   severity: NotificationSeverity;
   title: string;
   data: any;
   timestamp: number;
}

export declare class GetFinancialReportDtoWithSearch extends GetFinancialReportDto {
   searchDate?: number;
}

export enum betListType {
   LIST = 'LIST',
   LATESTWINS = 'LATESTWINS',
   BIGWINS = 'BIGWINS',
   BIGLOSSES = 'BIGLOSSES',
   HIGHROLLERS = 'HIGHROLLERS',
   LUCKYWINS = 'LUCKYWINS',
}

export enum betListTypeText {
   LIST = 'LIST',
   LATESTWINS = 'Latest Wins',
   BIGWINS = 'Big Wins',
   BIGLOSSES = 'Big Losses',
   HIGHROLLERS = 'High Rollers',
   LUCKYWINS = 'Lucky Wins',
}

export enum roleNameText {
   CURRENTUSEDROLE = 'Current',
}

export enum PLayerFileType {
   PDF = 'PDF',
   IMAGE = 'IMAGE',
}

export enum PlayerDetailsTabs {
   DETAILS = 'DETAILS',
   BETS = 'BETS',
   TRANSACTIONS = 'TRANSACTIONS',
   ACTIVITIES = 'ACTIVITIES',
   DOCUMENTS = 'DOCUMENTS',
   PROFIT = 'PROFIT',
   RELATED_ACCOUNTS = 'RELATED_ACCOUNTS',
   CASHIN_CASHOUT = 'CASHIN_CASHOUT',
   NOTE = 'NOTE',
   REPORT = 'REPORT',
   ACTIONS = 'ACTIONS',
}

export enum LogsTabs {
   WEBHOOK = 'WEBHOOK',
   REGISTER = 'REGISTER',
   LAUNCH = 'LAUNCH',
}

export enum OperatorDetailsTabs {
   USERS = 'USERS',
   GAMES = 'GAMES',
   GAMESV2 = 'GAMESV2',
   OPCONFIGS = 'OPCONFIGS',
   OPCONFIGSJSON = 'OPCONFIGSJSON',
   EDITBRANDS = 'EDITBRANDS',
   EDITLIMITS = 'EDITLIMITS',
   PAYMENT_GATEWAYS = 'PAYMENT_GATEWAYS',
   TOPUP_CURRENCIES = 'TOPUP_CURRENCIES',
   WEBHOOK_BASE_URL = 'WEBHOOK_BASE_URL',
   BET_DB_CONFIG = 'BET_DB_CONFIG',
   API_AUTHORIZATION_TOKEN = 'API_AUTHORIZATION_TOKEN',
}

export enum BrandDetailsTab {
   PAYMENTGATEWAYS = 'PAYMENTGATEWAYS',
   VERIFICATION = 'VERIFICATION',
   SYSTEM_MESSAGES = 'SYSTEM_MESSAGES',
   TOPUP_CURRENCIES = 'TOPUP_CURRENCIES',
}

export enum FrequentlyText {
   LAST24HOURS = 'Last 24 Hours',
   TODAY = 'Today',
   LAST48HOURS = 'Last 48 Hours',
   YESTERDAY = 'Yesterday',
   LAST7DAYS = 'Last 7 Days',
   THISWEEK = 'This Week',
   LAST30DAYS = 'Last 30 Days',
   THISMONTH = 'This Month',
   LAST90DAYS = 'Last 90 Days',
   THISYEAR = 'This Year',
}

export enum OtherFrequentlyText {
   LAST1MINUTE = 'Last 1 Minute',
   LAST1HOURS = 'Last 1 Hours',
   LAST5MINUTE = 'Last 5 Minutes',
   LAST2HOURS = 'Last 2 Hours',
   LAST15MINUTE = 'Last 15 Minutes',
   LAST6HOURS = 'Last 6 Hours',
   LAST30MINUTE = 'Last 30 Minutes',
   LAST9HOURS = 'Last 9 Hours',
   LAST45MINUTE = 'Last 45 Minutes',
   LAST12HOURS = 'Last 12 Hours',
}

export enum DataType {
   TABLE = 'TABLE',
   CHART = 'CHART',
}

export enum ChartDataName {
   BETS = 'BETS',
   BET_AMOUNT = 'BET_AMOUNT',
   PL = 'PL',
   PLAYER = 'PLAYER',
   DEPOSIT = 'DEPOSIT',
   WITHDRAW = 'WITHDRAW',
   TOPUP = 'TOPUP',
}

export enum ExchangeType {
   FIAT = 'FIAT',
   CRYPTO = 'CRYPTO',
   LIMIT = 'LIMIT',
}

export enum WebhookType {
   WEBHOOK_RESULT = 'WEBHOOK_RESULT',
   WEBHOOK_BET = 'WEBHOOK_BET',
   WEBHOOK_ROLLBACK = 'WEBHOOK_ROLLBACK',
   WEBHOOK_GET_BALANCE = 'WEBHOOK_GET_BALANCE',
   WEBHOOK_PLAYER_INFO = 'WEBHOOK_PLAYER_INFO',
   WEBHOOK_END_PLAY = 'WEBHOOK_END_PLAY',
}

export enum WebhookStatus {
   OK = 'OK',
   ERROR = 'ERROR',
   TIMEOUT_ERROR = 'TIMEOUT_ERROR',
   HTTP_ERROR = 'HTTP_ERROR',
   VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export const GamePlay = [
   'crashroyale',
   'bloodburst',
   'crashghostly',
   'crash1917',
   'crashwitch',
   'crash3dx',
];

export enum BetMode {
   classic = 'classic',
   over = 'over',
   under = 'under',
   range = 'range',
}

export enum CloudFlareTabs {
   DNS = 'DNS',
}
