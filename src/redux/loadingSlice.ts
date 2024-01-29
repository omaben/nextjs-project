import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export type LoadingState = {
  loadingStats: boolean
  loadingFinancialReport: boolean
  loadingFinancialReportDashboard: boolean
  loadingFinancialReportOperators: boolean
  loadingFinancialReportBrands: boolean
  loadingFinancialReportYear: boolean
  loadingFinancialReportMonth: boolean
  loadingFinancialReportDay: boolean
  loadingFinancialReportHour: boolean
  loadingLatestWins: boolean
  loadingBigWins: boolean
  loadingBigLosses: boolean
  loadingHighRollers: boolean
  loadingLuckWins: boolean
  loadingBetsList: boolean
  loadingOperatorList: boolean
  loadingGamesList: boolean
  loadingOperatorGamesV2List: boolean
  loadingOperatorGamesList: boolean
  loadingOperatorGamesV2: boolean
  loadingPlayersList: boolean
  loadingUsersList: boolean
  loadingUsersDetails1: boolean
  loadingUsersDetails2: boolean
  loadingPlayerActivites: boolean
  loadingUserAcitivites: boolean
  loadingPlayerDetails: boolean
  loadingTransactionList: boolean
  loadingOperatorTransactionList: boolean
  loadingWalletBalanceList: boolean
  loadingWebhookList: boolean
  loadingAuthLogList: boolean
  loadingLaunchLogList: boolean
  loadingTournament: boolean
  loadingTournamentV2: boolean
  loadingTournamentV2Details: boolean
  loadingTournamentIDs: boolean
  loadingTournamentV2IDs: boolean
  loadingPaymentsGateway: boolean
  loadingBetDBConfig: boolean
  loadingActivePaymentsGateway: boolean
  loadingPaymentGatewayOperator: boolean
  loadingKycVerification: boolean
  loadingTopUpCurrencies: boolean
  loadingGameV2List: boolean
  loadingGameCoresList: boolean
  loadingLaunchReport: boolean
  loadingBetsCurrenciesReport: boolean
  loadingMessagesInLanguageInBrand: boolean
  loadingOperatorBetAmountLimits: boolean
  loadingDefaultBetAmountLimits: boolean
  loadingRelatedPlayers: boolean
  loadingCashinCashout: boolean
  loadingDnsRecordList: boolean
  loadingOperatorsGamesListTournament: boolean
  loadingBrandList: boolean
};

const initialState: LoadingState = {
  loadingStats: false,
  loadingFinancialReport: false,
  loadingFinancialReportDashboard: false,
  loadingFinancialReportOperators: false,
  loadingFinancialReportBrands: false,
  loadingFinancialReportYear: false,
  loadingFinancialReportMonth: false,
  loadingFinancialReportDay: false,
  loadingFinancialReportHour: false,
  loadingLatestWins: false,
  loadingBigWins: false,
  loadingHighRollers: false,
  loadingLuckWins: false,
  loadingBigLosses: false,
  loadingBetsList: false,
  loadingOperatorList: false,
  loadingGamesList: false,
  loadingOperatorGamesV2List: false,
  loadingOperatorGamesList: false,
  loadingOperatorGamesV2: false,
  loadingPlayersList: false,
  loadingUsersList: false,
  loadingPlayerActivites: false,
  loadingUserAcitivites: false,
  loadingPlayerDetails: false,
  loadingTransactionList: false,
  loadingOperatorTransactionList: false,
  loadingWalletBalanceList: false,
  loadingWebhookList: false,
  loadingAuthLogList: false,
  loadingLaunchLogList: false,
  loadingTournament: false,
  loadingTournamentV2: false,
  loadingTournamentV2Details: false,
  loadingTournamentIDs: false,
  loadingTournamentV2IDs: false,
  loadingPaymentsGateway: false,
  loadingActivePaymentsGateway: false,
  loadingPaymentGatewayOperator: false,
  loadingKycVerification: false,
  loadingTopUpCurrencies: false,
  loadingMessagesInLanguageInBrand: false,
  loadingOperatorBetAmountLimits: false,
  loadingDefaultBetAmountLimits: false,
  loadingRelatedPlayers: false,
  loadingGameV2List: false,
  loadingGameCoresList: false,
  loadingLaunchReport: false,
  loadingBetsCurrenciesReport: false,
  loadingBetDBConfig: false,
  loadingUsersDetails1: false,
  loadingUsersDetails2: false,
  loadingCashinCashout: false,
  loadingDnsRecordList: false,
  loadingBrandList: false,
  loadingOperatorsGamesListTournament: false
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    saveLoadingStats: (state, action: PayloadAction<any>) => {
      state.loadingStats = action.payload;
    },
    saveLoadingFinancialReport: (state, action: PayloadAction<any>) => {
      state.loadingFinancialReport = action.payload;
    },
    saveLoadingFinancialReportDashboard: (state, action: PayloadAction<any>) => {
      state.loadingFinancialReportDashboard = action.payload;
    },
    saveLoadingFinancialReportOperators: (state, action: PayloadAction<any>) => {
      state.loadingFinancialReportOperators = action.payload;
    },
    saveLoadingLatestWins: (state, action: PayloadAction<any>) => {
      state.loadingLatestWins = action.payload;
    },
    saveLoadingBigWins: (state, action: PayloadAction<any>) => {
      state.loadingBigWins = action.payload;
    },
    saveLoadingBigLosses: (state, action: PayloadAction<any>) => {
      state.loadingBigLosses = action.payload;
    },
    saveLoadingHighRollers: (state, action: PayloadAction<any>) => {
      state.loadingHighRollers = action.payload;
    },
    saveLoadingLuckWins: (state, action: PayloadAction<any>) => {
      state.loadingLuckWins = action.payload;
    },
    saveloadingBetsList: (state, action: PayloadAction<any>) => {
      state.loadingBetsList = action.payload;
    },
    saveLoadingOperatorList: (state, action: PayloadAction<any>) => {
      state.loadingOperatorList = action.payload;
    },
    saveLoadingGamesList: (state, action: PayloadAction<any>) => {
      state.loadingGamesList = action.payload;
    },
    saveLoadingOperatorGamesV2List: (state, action: PayloadAction<any>) => {
      state.loadingOperatorGamesV2List = action.payload;
    },
    saveLoadingPlayersList: (state, action: PayloadAction<any>) => {
      state.loadingPlayersList = action.payload;
    },
    saveLoadingUsersList: (state, action: PayloadAction<any>) => {
      state.loadingUsersList = action.payload;
    },
    saveLoadingPlayerActivites: (state, action: PayloadAction<any>) => {
      state.loadingPlayerActivites = action.payload;
    },
    saveLoadingUserAcitivites: (state, action: PayloadAction<any>) => {
      state.loadingUserAcitivites = action.payload;
    },
    saveLoadingPlayerDetails: (state, action: PayloadAction<any>) => {
      state.loadingPlayerDetails = action.payload;
    },
    saveLoadingTransactionList: (state, action: PayloadAction<any>) => {
      state.loadingTransactionList = action.payload;
    },
    saveLoadingOperatorTransactionList: (state, action: PayloadAction<any>) => {
      state.loadingOperatorTransactionList = action.payload;
    },
    saveLoadingWalletBalanceList: (state, action: PayloadAction<any>) => {
      state.loadingWalletBalanceList = action.payload;
    },
    saveLoadingWebhookList: (state, action: PayloadAction<any>) => {
      state.loadingWebhookList = action.payload;
    },
    saveLoadingAuthLogsList: (state, action: PayloadAction<any>) => {
      state.loadingAuthLogList = action.payload;
    },
    saveLoadingLaunchLogsList: (state, action: PayloadAction<any>) => {
      state.loadingLaunchLogList = action.payload;
    },
    saveLoadingTournament: (state, action: PayloadAction<any>) => {
      state.loadingTournament = action.payload;
    },
    saveLoadingTournamentV2: (state, action: PayloadAction<any>) => {
      state.loadingTournamentV2 = action.payload;
    },
    saveLoadingTournamentV2Details: (state, action: PayloadAction<any>) => {
      state.loadingTournamentV2Details = action.payload;
    },
    saveLoadingTournamentIDs: (state, action: PayloadAction<any>) => {
      state.loadingTournamentIDs = action.payload;
    },
    saveLoadingTournamentV2IDs: (state, action: PayloadAction<any>) => {
      state.loadingTournamentV2IDs = action.payload;
    },
    saveLoadingPaymentsGateway: (state, action: PayloadAction<any>) => {
      state.loadingPaymentsGateway = action.payload;
    },
    saveLoadingPaymentGatewayOperator: (state, action: PayloadAction<any>) => {
      state.loadingPaymentGatewayOperator = action.payload;
    },
    saveLoadingActivePaymentGatewayOperator: (state, action: PayloadAction<any>) => {
      state.loadingActivePaymentsGateway = action.payload;
    },
    saveLoadingKycVerification: (state, action: PayloadAction<any>) => {
      state.loadingKycVerification = action.payload;
    },
    saveLoadingTopUpCurrencies: (state, action: PayloadAction<any>) => {
      state.loadingTopUpCurrencies = action.payload;
    },
    saveLoadingMessagesInLanguageInBrand: (state, action: PayloadAction<any>) => {
      state.loadingMessagesInLanguageInBrand = action.payload;
    },
    saveLoadingOperatorBetAmountLimits: (state, action: PayloadAction<any>) => {
      state.loadingOperatorBetAmountLimits = action.payload;
    },
    saveLoadingDefaultBetAmountLimits: (state, action: PayloadAction<any>) => {
      state.loadingDefaultBetAmountLimits = action.payload;
    },
    saveLoadingRelatedAccounts: (state, action: PayloadAction<any>) => {
      state.loadingRelatedPlayers = action.payload;
    },
    saveLoadingGameV2List: (state, action: PayloadAction<any>) => {
      state.loadingGameV2List = action.payload;
    },
    saveLoadingGameCoresList: (state, action: PayloadAction<any>) => {
      state.loadingGameCoresList = action.payload;
    },
    saveLoadingLaunchReport: (state, action: PayloadAction<any>) => {
      state.loadingLaunchReport = action.payload;
    },
    saveLoadingBetsCurrenciesReport: (state, action: PayloadAction<any>) => {
      state.loadingBetsCurrenciesReport = action.payload;
    },
    saveLoadingFinancialReportBrands: (state, action: PayloadAction<any>) => {
      state.loadingFinancialReportBrands = action.payload;
    },
    saveLoadingFinancialReportYear: (state, action: PayloadAction<any>) => {
      state.loadingFinancialReportYear = action.payload;
    },
    saveLoadingFinancialReportMonth: (state, action: PayloadAction<any>) => {
      state.loadingFinancialReportMonth = action.payload;
    },
    saveLoadingFinancialReportDay: (state, action: PayloadAction<any>) => {
      state.loadingFinancialReportDay = action.payload;
    },
    saveLoadingFinancialReportHour: (state, action: PayloadAction<any>) => {
      state.loadingFinancialReportHour = action.payload;
    },
    saveLoadingOperatorGameV2: (state, action: PayloadAction<any>) => {
      state.loadingOperatorGamesV2 = action.payload;
    },
    saveLoadingOperatorGamesList: (state, action: PayloadAction<any>) => {
      state.loadingOperatorGamesList = action.payload;
    },
    saveLoadingBetDBConfig: (state, action: PayloadAction<any>) => {
      state.loadingBetDBConfig = action.payload;
    },
    saveLoadingUserDetails1: (state, action: PayloadAction<any>) => {
      state.loadingUsersDetails1 = action.payload;
    },
    saveLoadingUserDetails2: (state, action: PayloadAction<any>) => {
      state.loadingUsersDetails2 = action.payload;
    },
    saveLoadingCashinCashout: (state, action: PayloadAction<any>) => {
      state.loadingCashinCashout = action.payload;
    },
    saveLoadingDnsRecordList: (state, action: PayloadAction<any>) => {
      state.loadingDnsRecordList = action.payload;
    },
    saveLoadingBrandList: (state, action: PayloadAction<any>) => {
      state.loadingBrandList = action.payload;
    },
    saveLoadingOperatorsGamesListTournament: (state, action: PayloadAction<any>) => {
      state.loadingOperatorsGamesListTournament = action.payload;
    },
  },
});

export const { saveLoadingOperatorsGamesListTournament, saveLoadingBrandList, saveLoadingDnsRecordList, saveLoadingCashinCashout, saveLoadingUserDetails1, saveLoadingUserDetails2, saveLoadingBetDBConfig, saveLoadingGameCoresList, saveLoadingLaunchLogsList, saveLoadingAuthLogsList, saveLoadingDefaultBetAmountLimits, saveLoadingTournamentV2IDs, saveLoadingTournamentV2Details, saveLoadingTournamentV2, saveLoadingOperatorGameV2, saveLoadingFinancialReportHour, saveLoadingFinancialReportDay, saveLoadingFinancialReportMonth, saveLoadingFinancialReportYear, saveLoadingFinancialReportBrands, saveLoadingFinancialReportOperators, saveLoadingFinancialReportDashboard, saveLoadingBetsCurrenciesReport, saveLoadingLaunchReport, saveLoadingWalletBalanceList, saveLoadingOperatorGamesV2List, saveLoadingOperatorGamesList, saveLoadingTopUpCurrencies, saveLoadingRelatedAccounts, saveLoadingOperatorBetAmountLimits, saveLoadingMessagesInLanguageInBrand, saveLoadingKycVerification, saveLoadingActivePaymentGatewayOperator, saveLoadingPaymentGatewayOperator, saveLoadingPaymentsGateway, saveLoadingTournament, saveLoadingTournamentIDs, saveLoadingWebhookList, saveLoadingTransactionList, saveLoadingPlayerDetails, saveLoadingUserAcitivites, saveLoadingPlayerActivites, saveLoadingStats, saveLoadingFinancialReport, saveLoadingLatestWins, saveLoadingBigWins, saveLoadingBigLosses, saveLoadingUsersList, saveLoadingHighRollers, saveLoadingLuckWins, saveloadingBetsList, saveLoadingOperatorList, saveLoadingGamesList, saveLoadingPlayersList, saveLoadingGameV2List, saveLoadingOperatorTransactionList } = loadingSlice.actions;

export const selectLoading = (state: RootState) => state.loading;
export const selectLoadingStats = createSelector(selectLoading, (state) => state.loadingStats);
export const selectLoadingFinancialReport = createSelector(selectLoading, (state) => state.loadingFinancialReport);
export const selectLoadingLatestWins = createSelector(selectLoading, (state) => state.loadingLatestWins);
export const selectLoadingBigWins = createSelector(selectLoading, (state) => state.loadingBigWins);
export const selectLoadingBigLosses = createSelector(selectLoading, (state) => state.loadingBigLosses);
export const selectLoadingHighRollers = createSelector(selectLoading, (state) => state.loadingHighRollers);
export const selectLoadingLuckWins = createSelector(selectLoading, (state) => state.loadingLuckWins);
export const selectloadingBetsList = createSelector(selectLoading, (state) => state.loadingBetsList);
export const selectLoadingOperatorList = createSelector(selectLoading, (state) => state.loadingOperatorList);
export const selectLoadingGamesList = createSelector(selectLoading, (state) => state.loadingGamesList);
export const selectLoadingOperatorGamesV2List = createSelector(selectLoading, (state) => state.loadingOperatorGamesV2List);
export const selectLoadingOperatorGamesList = createSelector(selectLoading, (state) => state.loadingOperatorGamesList);
export const selectLoadingPlayersList = createSelector(selectLoading, (state) => state.loadingPlayersList);
export const selectLoadingUsersList = createSelector(selectLoading, (state) => state.loadingUsersList);
export const selectLoadingPlayerActivites = createSelector(selectLoading, (state) => state.loadingPlayerActivites);
export const selectLoadingUserAcitivites = createSelector(selectLoading, (state) => state.loadingUserAcitivites);
export const selectLoadingPlayerDetails = createSelector(selectLoading, (state) => state.loadingPlayerDetails);
export const selectLoadingTransactionList = createSelector(selectLoading, (state) => state.loadingTransactionList);
export const selectLoadingOperatorTransactionList = createSelector(selectLoading, (state) => state.loadingOperatorTransactionList);
export const selectLoadingWalletBalanceList = createSelector(selectLoading, (state) => state.loadingWalletBalanceList);
export const selectLoadingWebhookList = createSelector(selectLoading, (state) => state.loadingWebhookList);
export const selectLoadingAuthLogList = createSelector(selectLoading, (state) => state.loadingAuthLogList);
export const selectLoadingAuthLaunchList = createSelector(selectLoading, (state) => state.loadingLaunchLogList);
export const selectLoadingTournament = createSelector(selectLoading, (state) => state.loadingTournament);
export const selectLoadingTournamentV2 = createSelector(selectLoading, (state) => state.loadingTournamentV2);
export const selectLoadingTournamentV2Details = createSelector(selectLoading, (state) => state.loadingTournamentV2Details);
export const selectLoadingTournamentIDs = createSelector(selectLoading, (state) => state.loadingTournamentIDs);
export const selectLoadingTournamentV2IDs = createSelector(selectLoading, (state) => state.loadingTournamentV2IDs);
export const selectLoadingPaymentsGateway = createSelector(selectLoading, (state) => state.loadingPaymentsGateway);
export const selectloadingPaymentGatewayOperator = createSelector(selectLoading, (state) => state.loadingPaymentGatewayOperator);
export const selectloadingActivePaymentsGateway = createSelector(selectLoading, (state) => state.loadingActivePaymentsGateway);
export const selectloadingKycVerification = createSelector(selectLoading, (state) => state.loadingKycVerification);
export const selectloadingTopUpCurrencies = createSelector(selectLoading, (state) => state.loadingTopUpCurrencies);
export const selectloadingMessagesInLanguageInBrand = createSelector(selectLoading, (state) => state.loadingMessagesInLanguageInBrand);
export const selectloadingOperatorBetAmountLimits = createSelector(selectLoading, (state) => state.loadingOperatorBetAmountLimits);
export const selectloadingDefaultBetAmountLimits = createSelector(selectLoading, (state) => state.loadingDefaultBetAmountLimits);
export const selectloadingRelatedPlayers = createSelector(selectLoading, (state) => state.loadingRelatedPlayers);
export const selectloadingGamesV2List = createSelector(selectLoading, (state) => state.loadingGameV2List);
export const selectloadingGameCoresList = createSelector(selectLoading, (state) => state.loadingGameCoresList);
export const selectloadingLaunchReport = createSelector(selectLoading, (state) => state.loadingLaunchReport);
export const selectloadingBetsCurrenciesReport = createSelector(selectLoading, (state) => state.loadingBetsCurrenciesReport);
export const selectloadingFinancialReportDashboard = createSelector(selectLoading, (state) => state.loadingFinancialReportDashboard);
export const selectloadingFinancialReportOperators = createSelector(selectLoading, (state) => state.loadingFinancialReportOperators);
export const selectloadingFinancialReportBrands = createSelector(selectLoading, (state) => state.loadingFinancialReportBrands);
export const selectloadingFinancialReportYear = createSelector(selectLoading, (state) => state.loadingFinancialReportYear);
export const selectloadingFinancialReportMonth = createSelector(selectLoading, (state) => state.loadingFinancialReportMonth);
export const selectloadingFinancialReportDay = createSelector(selectLoading, (state) => state.loadingFinancialReportDay);
export const selectloadingFinancialReportHour = createSelector(selectLoading, (state) => state.loadingFinancialReportHour);
export const selectloadingLoadingOperatorGamesV2 = createSelector(selectLoading, (state) => state.loadingOperatorGamesV2);
export const selectloadingBetDBConfig = createSelector(selectLoading, (state) => state.loadingBetDBConfig);
export const selectloadingUserDetails1 = createSelector(selectLoading, (state) => state.loadingUsersDetails1);
export const selectloadingUserDetails2 = createSelector(selectLoading, (state) => state.loadingUsersDetails2);
export const selectloadingCashinCashout = createSelector(selectLoading, (state) => state.loadingCashinCashout);
export const selectloadingDnsRecordList = createSelector(selectLoading, (state) => state.loadingDnsRecordList);
export const selectLoadingBrandList = createSelector(selectLoading, (state) => state.loadingBrandList);
export const selectLoadingOperatorsGamesListTournament = createSelector(selectLoading, (state) => state.loadingOperatorsGamesListTournament);

export default loadingSlice.reducer;
