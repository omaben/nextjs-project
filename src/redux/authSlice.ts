import { AuthLog, BankInfo, Bet, BetAmountLimits, BetsCurrenciesReportData, Brand, CashInCashOut, CpgPaymentGateway, Currency, DnsRecord, GameV2, JbPaymentGateway, KycVerification, LaunchLog, MessagesInLanguageInBrand, Operator, OperatorConfig, OperatorGame, OperatorGameV2, OperatorTransaction, PaymentGateway, PaymentGatewayName, Player, PlayerActivityList, PwPaymentGateway, RealtimeData, RelatedPlayersParam, Report, ReportConfig, Stats, TournamentCurrencyConditionItem, TournamentList, TournamentV2, TournamentV2List, UserPermissionEvent, UserScope, WebhookLog } from "@alienbackoffice/back-front";
import { BetList } from "@alienbackoffice/back-front/lib/bet/interfaces/bet-list.interface";
import { GameList } from "@alienbackoffice/back-front/lib/game/interfaces/game-list.interface";
import { OperatorList } from "@alienbackoffice/back-front/lib/operator/interfaces/operator-list.interface";
import { PlayerList } from "@alienbackoffice/back-front/lib/player/interfaces/player-list.interface";
import { LaunchReportData } from "@alienbackoffice/back-front/lib/report/interfaces/launch-report-data.interface";
import { UserActivityList } from "@alienbackoffice/back-front/lib/user/interfaces/user-activity-list.interface";
import { UserList } from "@alienbackoffice/back-front/lib/user/interfaces/user-list.interface";
import { TransactionList } from "@alienbackoffice/back-front/lib/wallet/interfaces/transaction-list.interface";
import { User } from "@auth0/auth0-spa-js";
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { CURENCYTYPE, NotificationItem } from "types";
import { RootState } from "./store";
import { GameCore } from "@alienbackoffice/back-front/lib/game/interfaces/game-core.interface";

export type AuthState = {
  pendingVerification?: 0
  completeInit?: boolean;
  uiState?: any;
  supportUrl?: string;
  coreIdRealtime?: string;
  operatorConfigs?: OperatorConfig | {};
  gameOperatorConfigs?: OperatorGame | {};
  gameOperatorV2?: OperatorGameV2<any> | {};
  backButton?: boolean;
  url?: string;
  server?: string;
  user?: any;
  userDetails?: User;
  userDetails1?: User;
  userDetails2?: User;
  operator: string;
  roles: {
    name: string,
    UserPermissionEvent: UserPermissionEvent[]
  }[],
  realtimeMessages: {
    coreId: string;
    realtimeData: RealtimeData;
  } | {},
  permissions: [],
  startCoreMessages: boolean,
  currentLimit: [],
  webhookList: {
    webhookLogList: WebhookLog[]
    count: number
  },
  cashinCashoutList: {
    count: number;
    cashInCashOuts: CashInCashOut[];
  },
  dnsRecordList: {
    count: number;
    dnsRecords: DnsRecord[];
  },
  allOperatorGamesWithTournament: {
    opId: string;
    gameId: string;
    statsFileUrl: string;
    tournamentId: string;
  }[] | any,
  authList: {
    authLogList: AuthLog[]
    count: number
  },
  launchList: {
    launchLogList: LaunchLog[]
    count: number
  },
  currenciesTournament: TournamentCurrencyConditionItem[],
  gameV2List: {
    count: number;
    games: GameV2[];
  },
  gameCoresList: {
    count: number;
    games: GameCore<any>[];
  },
  operatorDetails: {};
  webhookBaseURLOperator: string,
  PaymentsGateway: {
    count: number,
    paymentsGateway: {
      name: PaymentGatewayName;
      title: string;
      description: string;
      types: string[];
    }[]
  }
  stats: Stats;
  operators?: OperatorList;
  playerActivities?: PlayerActivityList;
  userActivities?: UserActivityList;
  transactions?: TransactionList;
  operatorTransactions?: {
    count: number;
    transactions: OperatorTransaction[];
  }
  paymentGatewayCurrencies?: {
    validCurrenciesToDeposit: string[];
    validCurrenciesToWithdraw: string[];
  }
  walletBalance?: {
    walletBalance: {
      totalDepositByPlayers: number
      totalWithdrawByPlayers: number
      totalWithdrawByOperator: number
      totalPendingWithdrawByOperator: number
      balance: number
      walletId: string
      withdrawIsEnable: boolean
    }[]
    count: number
  };
  tournament?: TournamentList;
  tournamentV2?: TournamentV2List;
  tournamentV2Details?: TournamentV2 | {};
  paymentGatewayOperator?: PwPaymentGateway;
  paymentJBGatewayOperator?: JbPaymentGateway;
  paymentCPGGatewayOperator?: CpgPaymentGateway;
  activePaymentGatewayOperator: {
    [PaymentGatewayName.CPG]?: PaymentGateway;
    [PaymentGatewayName.JB]?: PaymentGateway;
    [PaymentGatewayName.PW]?: PaymentGateway;
  };
  activePaymentGatewayBrand: {
    [PaymentGatewayName.CPG]?: PaymentGateway;
    [PaymentGatewayName.JB]?: PaymentGateway;
    [PaymentGatewayName.PW]?: PaymentGateway;
  };
  operatorsList?: OperatorList;
  betsList?: BetList;
  betDetails?: Bet | {};
  playersList?: PlayerList;
  relatedPlayersList?: PlayerList
  usersList?: UserList;
  gamesList?: GameList;
  operatorGamesList?: OperatorGame[];
  operatorGamesV2List?: OperatorGameV2<any>[];
  validGamesForOperator?: GameV2[]
  tournamentIDs?: string[],
  tournamentV2IDs?: string[],
  backHistory: string[];
  betsLatestWins?: BetList;
  betsBigWins?: BetList;
  betsBigLosses?: BetList;
  betsHighRoller?: BetList;
  betsLuckyWins?: BetList;
  currencies?: [];
  currenciesInit?: Currency[];
  currenciesDetail?: [];
  exchangeRates?: Currency[];
  notifications?: NotificationItem[];
  curencyOption: {
    value: number,
    name: CURENCYTYPE
  };
  brands?: Brand[];
  brandsList?: Brand[];
  currentCurrency?: string;
  currentBrand?: string;
  financialReportOperators?: Report[];
  financialReportBrands?: Report[];
  financialReportGraph?: Report[];
  financialReportYearly?: Report[];
  financialReportDashboard?: Report[];
  financialReportMonthly?: Report[];
  financialReportDaily?: Report[];
  financialReportHourly?: Report[];
  languages?: { label: string, value: string }[];
  operatorData: Operator | {},
  currentRolePermissions: UserPermissionEvent[]
  currentRoleName: string
  currentScope: UserScope
  kycVerification: KycVerification[]
  messagesInLanguageInBrand: MessagesInLanguageInBrand | {}
  operatorBetAmountLimits: BetAmountLimits | {}
  defaultBetAmountLimits: BetAmountLimits | {}
  playerDetails: Player | {}
  relatedPlayerDetails: Player | {}
  relatedPlayers: {
    opId: string;
    relatedPlayers: {
      playerId: string;
      relatedParams: RelatedPlayersParam;
    }[]
  } | {}
  banksName: BankInfo[]
  reportConfigs: ReportConfig | {}
  reportRestart: ReportConfig | {}
  topupCurrencies: string[] | []
  gatewayReport: PaymentGatewayName
  launchReportData: LaunchReportData | {}
  betsCurrenciesReportData: BetsCurrenciesReportData | {}
  operatorBetConfig: {
    connectionString: string;
    dbName: string;
  } | {}
  apiAuthorizationTokenData: string
};

const initialState: AuthState = {
  allOperatorGamesWithTournament: [],
  cashinCashoutList: {
    count: 0,
    cashInCashOuts: []
  },
  dnsRecordList: {
    count: 0,
    dnsRecords: []
  },
  coreIdRealtime: '',
  startCoreMessages: false,
  realtimeMessages: {},
  pendingVerification: 0,
  currenciesTournament: [],
  webhookBaseURLOperator: '',
  PaymentsGateway: {
    count: 0,
    paymentsGateway: []
  },
  gameV2List: {
    count: 0,
    games: []
  },
  gameCoresList: {
    count: 0,
    games: []
  },
  tournament: {
    count: 0,
    tournaments: []
  },

  tournamentV2: {
    count: 0,
    tournaments: []
  },
  tournamentV2Details: {},
  operatorConfigs: {},
  gameOperatorConfigs: {},
  gameOperatorV2: {},
  webhookList: {
    webhookLogList: [],
    count: 0
  },
  authList: {
    authLogList: [],
    count: 0
  },
  launchList: {
    launchLogList: [],
    count: 0
  },
  permissions: [],
  currentLimit: [],
  currentScope: UserScope.SUPERADMIN,
  supportUrl: '',
  completeInit: false,
  backButton: false,
  uiState: {},
  stats: {},
  roles: [],
  currentRolePermissions: [],
  currentRoleName: '',
  userDetails: {},
  userDetails1: {},
  userDetails2: {},
  operator: '',
  operatorDetails: {},
  currentBrand: 'All Brands',
  currencies: [],
  currenciesInit: [],
  currenciesDetail: [],
  exchangeRates: [],
  operatorGamesList: [],
  operatorGamesV2List: [],
  validGamesForOperator: [],
  operators: {
    count: 0,
    operators: []
  },
  transactions: {
    count: 0,
    transactions: []
  },
  operatorTransactions: {
    count: 0,
    transactions: []
  },
  paymentGatewayCurrencies: {
    validCurrenciesToDeposit: [],
    validCurrenciesToWithdraw: []
  },
  walletBalance: {
    count: 0,
    walletBalance: []
  },
  operatorsList: {
    count: 0,
    operators: []
  },
  playerActivities: {
    count: 0,
    activities: []
  },
  userActivities: {
    count: 0,
    userActivities: []
  },
  betsList: {
    count: 0,
    bets: []
  },
  betDetails: {},
  playersList: {
    count: 0,
    players: []
  },
  relatedPlayersList: {
    count: 0,
    players: []
  },
  usersList: {
    count: 0,
    users: []
  },
  gamesList: {
    count: 0,
    games: []
  },
  betsLuckyWins: {
    count: 0,
    bets: []
  },
  betsLatestWins: {
    count: 0,
    bets: []
  },
  betsBigWins: {
    count: 0,
    bets: []
  },
  betsBigLosses: {
    count: 0,
    bets: []
  },
  betsHighRoller: {
    count: 0,
    bets: []
  },
  financialReportGraph: [],
  financialReportYearly: [],
  financialReportDashboard: [],
  financialReportMonthly: [],
  financialReportDaily: [],
  financialReportHourly: [],
  financialReportOperators: [],
  financialReportBrands: [],
  curencyOption: {
    value: 0,
    name: CURENCYTYPE.ORIGINAL
  },
  brandsList: [],
  backHistory: [],
  operatorData: {
    opId: '',
    title: ''
  },
  paymentGatewayOperator: {
    order: 0,
    visible: false,
    enableToDeposit: false,
    enableToWithdraw: false,
    config: {
      type: '',
      userlevel: '',
      currency: '',
      endpoint: ''
    },
    secret: {
      key: ''
    },
    withdrawLimitByCurrency: {},
    withdrawFeeByCurrency: {},
    validCurrenciesToDeposit: [],
    validCurrenciesToWithdraw: []
  },
  paymentJBGatewayOperator: {
    order: 0,
    withdrawLimitByCurrency: {},
    visible: false,
    enableToDeposit: false,
    enableToWithdraw: false,
    config: {
      type: '',
      endpoint: '',
      bankNames: [],
      bankNameIsRequired: false,
      ibanIsRequired: false
    },
    secret: {
      key: ''
    },
    withdrawFeeByCurrency: {},
    validCurrenciesToDeposit: [],
    validCurrenciesToWithdraw: []
  },
  paymentCPGGatewayOperator: {
    order: 0,
    withdrawLimitByCurrency: {},
    visible: false,
    enableToDeposit: false,
    enableToWithdraw: false,
    config: {},
    secret: {},
    withdrawFeeByCurrency: {},
    validCurrenciesToDeposit: [],
    validCurrenciesToWithdraw: []
  },
  activePaymentGatewayOperator: {
  },
  activePaymentGatewayBrand: {
  },
  kycVerification: [],
  messagesInLanguageInBrand: {},
  operatorBetAmountLimits: {},
  defaultBetAmountLimits: {},
  playerDetails: {},
  relatedPlayerDetails: {},
  relatedPlayers: [],
  banksName: [],
  reportConfigs: {},
  reportRestart: {},
  topupCurrencies: [],
  gatewayReport: PaymentGatewayName.PW,
  tournamentIDs: [],
  tournamentV2IDs: [],
  launchReportData: {},
  betsCurrenciesReportData: {},
  operatorBetConfig: {},
  apiAuthorizationTokenData: ''
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveCompleteInit: (state, action: PayloadAction<any>) => {
      state.completeInit = action.payload;
    },
    saveGatewayReport: (state, action: PayloadAction<any>) => {
      state.gatewayReport = action.payload;
    },
    saveWebhookList: (state, action: PayloadAction<any>) => {
      state.webhookList = action.payload;
    },
    saveAuthList: (state, action: PayloadAction<any>) => {
      state.authList = action.payload;
    },
    saveLaunchList: (state, action: PayloadAction<any>) => {
      state.launchList = action.payload;
    },
    saveOperatorConfigsState: (state, action: PayloadAction<any>) => {
      state.operatorConfigs = action.payload;
    },
    saveGameOperatorConfigsState: (state, action: PayloadAction<any>) => {
      state.gameOperatorConfigs = action.payload;
    },
    saveUiState: (state, action: PayloadAction<any>) => {
      state.uiState = action.payload;
    },
    saveCurrenciesInit: (state, action: PayloadAction<any>) => {
      state.currenciesInit = action.payload;
    },
    saveCurrentScope: (state, action: PayloadAction<any>) => {
      state.currentScope = action.payload;
    },
    savePermissions: (state, action: PayloadAction<any>) => {
      state.permissions = action.payload;
    },
    saveCurrentLimit: (state, action: PayloadAction<any>) => {
      state.currentLimit = action.payload;
    },

    saveBackButton: (state, action: PayloadAction<any>) => {
      state.backButton = action.payload;
    },
    saveUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    saveCurrentRole: (state, action: PayloadAction<any>) => {
      state.currentRolePermissions = action.payload;
    },
    saveCurrentRoleName: (state, action: PayloadAction<any>) => {
      state.currentRoleName = action.payload;
    },
    saveUserDetails: (state, action: PayloadAction<any>) => {
      state.userDetails = action.payload;
    },
    saveUserDetails1: (state, action: PayloadAction<any>) => {
      state.userDetails1 = action.payload;
    },
    saveUserDetails2: (state, action: PayloadAction<any>) => {
      state.userDetails2 = action.payload;
    },
    saveRoles: (state, action: PayloadAction<any>) => {
      state.roles = action.payload;
    },
    saveCurrentOp: (state, action: PayloadAction<any>) => {
      state.operator = action.payload;
    },
    saveCurrencyOption: (state, action: PayloadAction<any>) => {
      state.curencyOption = action.payload;
    },
    saveUrl: (state, action: PayloadAction<any>) => {
      state.url = action.payload.url;
    },
    saveOperators: (state, action: PayloadAction<any>) => {
      state.operators = action.payload;
    },
    saveTransactions: (state, action: PayloadAction<any>) => {
      state.transactions = action.payload;
    },
    saveOperatorTransactions: (state, action: PayloadAction<any>) => {
      state.operatorTransactions = action.payload;
    },
    savePaymentGatewayCurrencies: (state, action: PayloadAction<any>) => {
      state.paymentGatewayCurrencies = action.payload;
    },
    saveOperatorDetails: (state, action: PayloadAction<any>) => {
      state.operatorDetails = action.payload;
    },
    saveStats: (state, action: PayloadAction<any>) => {
      state.stats = action.payload;
    },
    saveOperatorsList: (state, action: PayloadAction<any>) => {
      state.operatorsList = action.payload;
    },
    savePlayerActivitiesList: (state, action: PayloadAction<any>) => {
      state.playerActivities = action.payload;
    },
    saveUserActivitiesList: (state, action: PayloadAction<any>) => {
      state.userActivities = action.payload;
    },
    savePlayersList: (state, action: PayloadAction<any>) => {
      state.playersList = action.payload;
    },
    saveRelatedPlayersList: (state, action: PayloadAction<any>) => {
      state.relatedPlayersList = action.payload;
    },
    saveUsersList: (state, action: PayloadAction<any>) => {
      state.usersList = action.payload;
    },
    saveGamesList: (state, action: PayloadAction<any>) => {
      state.gamesList = action.payload;
    },
    saveOperatorGamesList: (state, action: PayloadAction<any>) => {
      state.operatorGamesList = action.payload;
    },
    saveOperatorGamesV2List: (state, action: PayloadAction<any>) => {
      state.operatorGamesV2List = action.payload;
    },
    saveOperatorGameV2: (state, action: PayloadAction<any>) => {
      state.gameOperatorV2 = action.payload;
    },
    saveBetsList: (state, action: PayloadAction<any>) => {
      state.betsList = action.payload;
    },
    saveBetDetails: (state, action: PayloadAction<any>) => {
      state.betDetails = action.payload;
    },
    saveBetsLatestWins: (state, action: PayloadAction<any>) => {
      state.betsLatestWins = action.payload;
    },
    saveBetsHighRoller: (state, action: PayloadAction<any>) => {
      state.betsHighRoller = action.payload;
    },
    saveBetsBigWins: (state, action: PayloadAction<any>) => {
      state.betsBigWins = action.payload;
    },
    saveBetsBigLosses: (state, action: PayloadAction<any>) => {
      state.betsBigLosses = action.payload;
    },
    saveBetsLuckyWins: (state, action: PayloadAction<any>) => {
      state.betsLuckyWins = action.payload;
    },
    saveCurrencies: (state, action: PayloadAction<any>) => {
      state.currencies = action.payload;
    },
    saveCurrenciesDetail: (state, action: PayloadAction<any>) => {
      state.currenciesDetail = action.payload;
    },
    saveExchangeRates: (state, action: PayloadAction<any>) => {
      state.exchangeRates = action.payload;
    },
    saveFinancialReportsGraph: (state, action: PayloadAction<any>) => {
      state.financialReportGraph = action.payload;
    },
    saveFinancialReportsYearly: (state, action: PayloadAction<any>) => {
      state.financialReportYearly = action.payload;
    },
    saveFinancialReportsDashboard: (state, action: PayloadAction<any>) => {
      state.financialReportDashboard = action.payload;
    },
    saveFinancialReportsMonthly: (state, action: PayloadAction<any>) => {
      state.financialReportMonthly = action.payload;
    },
    saveFinancialReportOperators: (state, action: PayloadAction<any>) => {
      state.financialReportOperators = action.payload;
    },
    saveFinancialReportBrands: (state, action: PayloadAction<any>) => {
      state.financialReportBrands = action.payload;
    },
    saveFinancialReportsDaily: (state, action: PayloadAction<any>) => {
      state.financialReportDaily = action.payload;
    },
    saveFinancialReportsHourly: (state, action: PayloadAction<any>) => {
      state.financialReportHourly = action.payload;
    },
    saveNotifications: (state, action: PayloadAction<any>) => {
      if (state.notifications && state.notifications?.findIndex((item: NotificationItem) => item.id === action.payload.id) < 0) {
        state.notifications = [
          { ...action.payload },
          ...state.notifications
        ]
      } else if (!state.notifications) {
        state.notifications = []
      } else {
        const notification_upd = state.notifications.map(
          (item: NotificationItem) => {
            if (item.id === action.payload.id) return { ...action.payload }
          }
        )
        updateNotifications(notification_upd)
      }

    },
    updateNotifications: (state, action: PayloadAction<any>) => {
      state.notifications = action.payload;
    },
    saveCurrentCurrency: (state, action: PayloadAction<any>) => {
      state.currentCurrency = action.payload;
    },
    saveBrands: (state, action: PayloadAction<any>) => {
      state.brands = action.payload;
    },
    saveBrandsList: (state, action: PayloadAction<any>) => {
      state.brandsList = action.payload;
    },
    saveCurrentBrand: (state, action: PayloadAction<any>) => {
      state.currentBrand = action.payload;
    },
    saveLanguages: (state, action: PayloadAction<any>) => {
      state.languages = action.payload;
    },
    saveServer: (state, action: PayloadAction<any>) => {
      state.server = action.payload;
    },
    saveCurrentOpData: (state, action: PayloadAction<any>) => {
      state.operatorData = action.payload;
    },
    saveTournament: (state, action: PayloadAction<any>) => {
      state.tournament = action.payload;
    },
    saveTournamentV2: (state, action: PayloadAction<any>) => {
      state.tournamentV2 = action.payload;
    },
    saveTournamentV2Details: (state, action: PayloadAction<any>) => {
      state.tournamentV2Details = action.payload;
    },
    saveBackHistory: (state, action: PayloadAction<any>) => {
      const routeWithoutParams = action.payload.split('?')[0]
      const historyWithoutParams =
        state?.backHistory?.length > 0 ? state?.backHistory[0].split('?')[0] : ''
      if (state?.backHistory && routeWithoutParams !== historyWithoutParams) {
        state.backHistory = [
          action.payload,
          ...state.backHistory,
        ]
      }
    },
    deleteBackHistory: (state) => {
      state.backHistory.splice(0, 2)
    },
    saveSupportURL: (state, action: PayloadAction<any>) => {
      state.supportUrl = action.payload;
    },
    savePaymentsGateway: (state, action: PayloadAction<any>) => {
      state.PaymentsGateway = action.payload;
    },
    savePaymentGatewayOperator: (state, action: PayloadAction<any>) => {
      state.paymentGatewayOperator = action.payload;
    },
    savePaymentJBGatewayOperator: (state, action: PayloadAction<any>) => {
      state.paymentJBGatewayOperator = action.payload;
    },
    savePaymentCPGGatewayOperator: (state, action: PayloadAction<any>) => {
      state.paymentCPGGatewayOperator = action.payload;
    },
    saveActivePaymentGatewayOperator: (state, action: PayloadAction<any>) => {
      state.activePaymentGatewayOperator = action.payload;
    },
    saveActivePaymentGatewayBrand: (state, action: PayloadAction<any>) => {
      state.activePaymentGatewayBrand = action.payload;
    },
    saveKycVerification: (state, action: PayloadAction<any>) => {
      state.kycVerification = action.payload;
    },
    saveMessagesInLanguageInBrand: (state, action: PayloadAction<any>) => {
      state.messagesInLanguageInBrand = action.payload;
    },
    saveOperatorBetAmountLimits: (state, action: PayloadAction<any>) => {
      state.operatorBetAmountLimits = action.payload;
    },
    saveDefaultBetAmountLimits: (state, action: PayloadAction<any>) => {
      state.defaultBetAmountLimits = action.payload;
    },
    savePlayerDetails: (state, action: PayloadAction<any>) => {
      state.playerDetails = action.payload;
    },
    saveRelatedPlayerDetails: (state, action: PayloadAction<any>) => {
      state.relatedPlayerDetails = action.payload;
    },
    saveRelatedPlayers: (state, action: PayloadAction<any>) => {
      state.relatedPlayers = action.payload;
    },
    saveBanksName: (state, action: PayloadAction<any>) => {
      state.banksName = action.payload;
    },
    saveReportConfig: (state, action: PayloadAction<any>) => {
      state.reportConfigs = action.payload;
    },
    saveReportRestart: (state, action: PayloadAction<any>) => {
      state.reportRestart = action.payload;
    },
    saveTopupCurrencies: (state, action: PayloadAction<any>) => {
      state.topupCurrencies = action.payload;
    },
    saveGameV2List: (state, action: PayloadAction<any>) => {
      state.gameV2List = action.payload;
    },
    saveGameCoresList: (state, action: PayloadAction<any>) => {
      state.gameCoresList = action.payload;
    },
    saveValidGamesForOperatorList: (state, action: PayloadAction<any>) => {
      state.validGamesForOperator = action.payload;
    },
    savePendingVerification: (state, action: PayloadAction<any>) => {
      state.pendingVerification = action.payload;
    },
    saveTournamentIDs: (state, action: PayloadAction<any>) => {
      state.tournamentIDs = action.payload;
    },
    saveTournamentV2IDs: (state, action: PayloadAction<any>) => {
      state.tournamentV2IDs = action.payload;
    },
    saveWebhookBaseURL: (state, action: PayloadAction<any>) => {
      state.webhookBaseURLOperator = action.payload;
    },
    saveWalletBalance: (state, action: PayloadAction<any>) => {
      state.walletBalance = action.payload;
    },
    saveLaunchReportData: (state, action: PayloadAction<any>) => {
      state.launchReportData = action.payload;
    },
    saveBetsCurrenciesReportData: (state, action: PayloadAction<any>) => {
      state.betsCurrenciesReportData = action.payload;
    },
    saveCurrenciesTournamentData: (state, action: PayloadAction<any>) => {
      state.currenciesTournament = action.payload;
    },
    saveOperatorBetConfigData: (state, action: PayloadAction<any>) => {
      state.operatorBetConfig = action.payload;
    },
    saveApiAuthorizationTokenData: (state, action: PayloadAction<any>) => {
      state.apiAuthorizationTokenData = action.payload;
    },
    saveRealtimeMessages: (state, action: PayloadAction<any>) => {
      state.realtimeMessages = action.payload;
    },
    saveCoreIdRealTime: (state, action: PayloadAction<any>) => {
      state.coreIdRealtime = action.payload;
    },
    saveStartCoreMessage: (state, action: PayloadAction<any>) => {
      state.startCoreMessages = action.payload;
    },
    saveCashinCashoutList: (state, action: PayloadAction<any>) => {
      state.cashinCashoutList = action.payload;
    },
    saveDnsRecordList: (state, action: PayloadAction<any>) => {
      state.dnsRecordList = action.payload;
    },
    saveAllOperatorGamesWithTournament: (state, action: PayloadAction<any>) => {
      state.allOperatorGamesWithTournament = action.payload;
    },
    logout: () => {
      return initialState;
    },
  },
});

export const { saveAllOperatorGamesWithTournament, saveBetDetails, saveDnsRecordList, saveCashinCashoutList, saveStartCoreMessage, saveCoreIdRealTime, saveRealtimeMessages, saveGameCoresList, saveLaunchList, saveAuthList, saveDefaultBetAmountLimits, saveApiAuthorizationTokenData, saveTournamentV2IDs, saveTournamentV2Details, saveTournamentV2, saveOperatorBetConfigData, saveCurrenciesTournamentData, saveOperatorGameV2, saveBetsCurrenciesReportData, saveLaunchReportData, saveFinancialReportBrands, savePaymentGatewayCurrencies, saveOperatorTransactions, saveWalletBalance, saveWebhookBaseURL, saveTournamentIDs, saveGatewayReport, saveReportRestart, savePendingVerification, saveValidGamesForOperatorList, saveFinancialReportsDashboard, saveOperatorGamesV2List, saveGameV2List, saveTopupCurrencies, saveReportConfig, saveBanksName, saveRelatedPlayersList, saveRelatedPlayerDetails, saveRelatedPlayers, savePlayerDetails, saveOperatorBetAmountLimits, saveMessagesInLanguageInBrand, saveKycVerification, saveActivePaymentGatewayBrand, saveActivePaymentGatewayOperator, savePaymentCPGGatewayOperator, savePaymentJBGatewayOperator, savePaymentGatewayOperator, savePaymentsGateway, saveCurrenciesInit, saveTournament, saveWebhookList, saveCurrentLimit, saveGameOperatorConfigsState, saveOperatorConfigsState, saveCurrentScope, saveCurrentRoleName, saveCurrentRole, savePermissions, saveSupportURL, saveUiState, saveUserDetails, saveUserDetails1, saveUserDetails2, saveCurrenciesDetail, saveBrandsList, saveTransactions, saveCurrentOpData, saveRoles, saveBackButton, saveBackHistory, deleteBackHistory, updateNotifications, saveExchangeRates, saveOperatorGamesList, saveFinancialReportOperators, saveGamesList, saveUsersList, savePlayersList, saveCompleteInit, saveStats, saveUser, saveUrl, saveCurrencies, saveOperators, saveOperatorsList, saveUserActivitiesList, savePlayerActivitiesList, saveBetsList, saveOperatorDetails, saveLanguages, saveServer, logout, saveCurrentOp, saveCurrentCurrency, saveCurrencyOption, saveCurrentBrand, saveBrands, saveNotifications, saveFinancialReportsGraph, saveFinancialReportsMonthly, saveFinancialReportsDaily, saveFinancialReportsHourly, saveBetsBigLosses, saveBetsBigWins, saveBetsHighRoller, saveBetsLatestWins, saveBetsLuckyWins, saveFinancialReportsYearly } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectAuthCOmpleteInit = createSelector(selectAuth, (state) => state.completeInit);
export const selectAuthOperatorConfigs = createSelector(selectAuth, (state) => state.operatorConfigs);
export const selectAuthGameOperatorConfigs = createSelector(selectAuth, (state) => state.gameOperatorConfigs);
export const selectAuthBackButton = createSelector(selectAuth, (state) => state.backButton);
export const selectAuthCurrentRoleName = createSelector(selectAuth, (state) => state.currentRoleName);
export const selectAuthCurrentScope = createSelector(selectAuth, (state) => state.currentScope);
export const selectAuthCurrentRolePermission = createSelector(selectAuth, (state) => state.currentRolePermissions);
export const selectAuthSupportURL = createSelector(selectAuth, (state) => state.supportUrl);
export const selectAuthPermissions = createSelector(selectAuth, (state) => state.permissions);
export const selectAuthCurrentLimit = createSelector(selectAuth, (state) => state.currentLimit);
export const selectAuthStats = createSelector(selectAuth, (state) => state.stats);
export const selectAuthUiStats = createSelector(selectAuth, (state) => state.uiState);
export const selectAuthUser = createSelector(selectAuth, (state) => state.user);
export const selectAuthUserDetails = createSelector(selectAuth, (state) => state.userDetails);
export const selectAuthUserDetails1 = createSelector(selectAuth, (state) => state.userDetails1);
export const selectAuthUserDetails2 = createSelector(selectAuth, (state) => state.userDetails2);
export const selectAuthBrandsList = createSelector(selectAuth, (state) => state.brandsList);
export const selectAuthRoles = createSelector(selectAuth, (state) => state.roles);
export const selectAuthOperators = createSelector(selectAuth, (state) => state.operators);
export const selectAuthCurrentOperator = createSelector(selectAuth, (state) => state.operatorData);
export const selectAuthBackHistory = createSelector(selectAuth, (state) => state.backHistory);
export const selectAuthOperatorDetails = createSelector(selectAuth, (state) => state.operatorDetails);
export const selectAuthWebhookBaseURL = createSelector(selectAuth, (state) => state.webhookBaseURLOperator);
export const selectAuthValidGamesForOperator = createSelector(selectAuth, (state) => state.validGamesForOperator);
export const selectAuthOperatorsList = createSelector(selectAuth, (state) => state.operatorsList);
export const selectAuthPlayerActivitiesList = createSelector(selectAuth, (state) => state.playerActivities);
export const selectAuthUserActivitiesList = createSelector(selectAuth, (state) => state.userActivities);
export const selectAuthTransactionList = createSelector(selectAuth, (state) => state.transactions);
export const selectAuthOperatorTransactionList = createSelector(selectAuth, (state) => state.operatorTransactions);
export const selectAuthPlayersList = createSelector(selectAuth, (state) => state.playersList);
export const selectAuthRelatedPlayersList = createSelector(selectAuth, (state) => state.relatedPlayersList);
export const selectAuthUsersList = createSelector(selectAuth, (state) => state.usersList);
export const selectAuthGamesList = createSelector(selectAuth, (state) => state.gamesList);
export const selectAuthOperatorGamesList = createSelector(selectAuth, (state) => state.operatorGamesList);
export const selectAuthOperatorGamesV2List = createSelector(selectAuth, (state) => state.operatorGamesV2List);
export const selectAuthBetsList = createSelector(selectAuth, (state) => state.betsList);
export const selectAuthBetsLatestWins = createSelector(selectAuth, (state) => state.betsLatestWins);
export const selectAuthBetsBigWins = createSelector(selectAuth, (state) => state.betsBigWins);
export const selectAuthBetsBigLosses = createSelector(selectAuth, (state) => state.betsBigLosses);
export const selectAuthBetsHighRollers = createSelector(selectAuth, (state) => state.betsHighRoller);
export const selectAuthBetsLuckyWins = createSelector(selectAuth, (state) => state.betsLuckyWins);
export const selectAuthCurrencies = createSelector(selectAuth, (state) => state.currencies);
export const selectAuthCurrenciesDetail = createSelector(selectAuth, (state) => state.currenciesDetail);
export const selectAuthExchangeRates = createSelector(selectAuth, (state) => state.exchangeRates);
export const selectAuthFinancialReportsGraph = createSelector(selectAuth, (state) => state.financialReportGraph);
export const selectAuthFinancialReportsYearly = createSelector(selectAuth, (state) => state.financialReportYearly);
export const selectAuthFinancialReportsDashboard = createSelector(selectAuth, (state) => state.financialReportDashboard);
export const selectAuthFinancialReportsMonthly = createSelector(selectAuth, (state) => state.financialReportMonthly);
export const selectAuthFinancialReportsDaily = createSelector(selectAuth, (state) => state.financialReportDaily);
export const selectAuthFinancialReportsHourly = createSelector(selectAuth, (state) => state.financialReportHourly);
export const selectAuthFinancialReportOperators = createSelector(selectAuth, (state) => state.financialReportOperators);
export const selectAuthNotifications = createSelector(selectAuth, (state) => state.notifications);
export const selectAuthCurrenturrency = createSelector(selectAuth, (state) => state.currentCurrency);
export const selectAuthCurrencyOption = createSelector(selectAuth, (state) => state.curencyOption);
export const selectAuthBrands = createSelector(selectAuth, (state) => state.brands);
export const selectAuthCurrentBrand = createSelector(selectAuth, (state) => state.currentBrand);
export const selectAuthLanguages = createSelector(selectAuth, (state) => state.languages);
export const selectAuthUrl = createSelector(selectAuth, (state) => state.url);
export const selectAuthServer = createSelector(selectAuth, (state) => state.server);
export const selectAuthOperator = createSelector(selectAuth, (state) => state.operator);
export const selectAuthWebhookList = createSelector(selectAuth, (state) => state.webhookList);
export const selectAuthList = createSelector(selectAuth, (state) => state.authList);
export const selectLaunchList = createSelector(selectAuth, (state) => state.launchList);
export const selectAuthTournament = createSelector(selectAuth, (state) => state.tournament);
export const selectAuthTournamentV2 = createSelector(selectAuth, (state) => state.tournamentV2);
export const selectAuthTournamentV2Details = createSelector(selectAuth, (state) => state.tournamentV2Details);
export const selectAuthCurrenciesInit = createSelector(selectAuth, (state) => state.currenciesInit);
export const selectAuthPaymentsGateway = createSelector(selectAuth, (state) => state.PaymentsGateway);
export const selectAuthPaymentGatewayOperator = createSelector(selectAuth, (state) => state.paymentGatewayOperator);
export const selectAuthPaymentJBGatewayOperator = createSelector(selectAuth, (state) => state.paymentJBGatewayOperator);
export const selectAuthPaymentCPGGatewayOperator = createSelector(selectAuth, (state) => state.paymentCPGGatewayOperator);
export const selectAuthActivePaymentGatewayOperator = createSelector(selectAuth, (state) => state.activePaymentGatewayOperator);
export const selectAuthActivePaymentGatewayBrand = createSelector(selectAuth, (state) => state.activePaymentGatewayBrand);
export const selectAuthkycVerification = createSelector(selectAuth, (state) => state.kycVerification);
export const selectAuthMessagesInLanguageInBrand = createSelector(selectAuth, (state) => state.messagesInLanguageInBrand);
export const selectAuthOperatorBetAmountLimits = createSelector(selectAuth, (state) => state.operatorBetAmountLimits);
export const selectAuthDefaultBetAmountLimits = createSelector(selectAuth, (state) => state.defaultBetAmountLimits);
export const selectAuthPlayerDetails = createSelector(selectAuth, (state) => state.playerDetails);
export const selectAuthRelatedPlayerDetails = createSelector(selectAuth, (state) => state.relatedPlayerDetails);
export const selectAuthRelatedPlayer = createSelector(selectAuth, (state) => state.relatedPlayers);
export const selectAuthBanksName = createSelector(selectAuth, (state) => state.banksName);
export const selectAuthReportConfig = createSelector(selectAuth, (state) => state.reportConfigs);
export const selectAuthReportRestart = createSelector(selectAuth, (state) => state.reportRestart);
export const selectAuthTopupCurrencies = createSelector(selectAuth, (state) => state.topupCurrencies);
export const selectAuthGameV2List = createSelector(selectAuth, (state) => state.gameV2List);
export const selectAuthGameCoresList = createSelector(selectAuth, (state) => state.gameCoresList);
export const selectAuthPendingVerification = createSelector(selectAuth, (state) => state.pendingVerification);
export const selectAuthGatewayReport = createSelector(selectAuth, (state) => state.gatewayReport);
export const selectAuthTournamentIDs = createSelector(selectAuth, (state) => state.tournamentIDs);
export const selectAuthTournamentV2IDs = createSelector(selectAuth, (state) => state.tournamentV2IDs);
export const selectAuthWalletBalance = createSelector(selectAuth, (state) => state.walletBalance);
export const selectAuthFinancialReportBrands = createSelector(selectAuth, (state) => state.financialReportBrands);
export const selectAuthPaymentGatewayCurrencies = createSelector(selectAuth, (state) => state.paymentGatewayCurrencies);
export const selectAuthLaunchReportData = createSelector(selectAuth, (state) => state.launchReportData);
export const selectAuthBetsCurrenciesReportData = createSelector(selectAuth, (state) => state.betsCurrenciesReportData);
export const selectAuthGameOperatorV2 = createSelector(selectAuth, (state) => state.gameOperatorV2);
export const selectAuthCurrenciesTournament = createSelector(selectAuth, (state) => state.currenciesTournament);
export const selectAuthOperatorBetConfig = createSelector(selectAuth, (state) => state.operatorBetConfig);
export const selectAuthAuthorizationTokenData = createSelector(selectAuth, (state) => state.apiAuthorizationTokenData);
export const selectAuthRealTimeMessages = createSelector(selectAuth, (state) => state.realtimeMessages);
export const selectAuthCoreIdRealTime = createSelector(selectAuth, (state) => state.coreIdRealtime);
export const selectAuthStartCoreMessages = createSelector(selectAuth, (state) => state.startCoreMessages);
export const selectAuthCashinCashoutList = createSelector(selectAuth, (state) => state.cashinCashoutList);
export const selectAuthDnsRecordList = createSelector(selectAuth, (state) => state.dnsRecordList);
export const selectAuthbetDetails = createSelector(selectAuth, (state) => state.betDetails);
export const selectAuthAllOperatorGamesWithTournament = createSelector(selectAuth, (state) => state.allOperatorGamesWithTournament);
export default authSlice.reducer;
