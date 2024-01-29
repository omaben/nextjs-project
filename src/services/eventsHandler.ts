import { AuthLog, BankInfo, Bet, BetAmountLimits, BetsCurrenciesReportData, Brand, CashInCashOut, ConfigType, CpgPaymentGateway, Currency, DnsRecord, GameV2, InitInfo, JbPaymentGateway, KycVerification, LaunchLog, MessagesInLanguageInBrand, Notification, NotificationSeverity, OnBetListResponseParams, OnCashInCashOutListResponseParams, OnDnsRecordListResponseParams, OnGameCoreRealtimeMessageParams, OnGameListResponseParams, OnGameV2ListResponseParams, OnGetActivePaymentGatewaysResponseParams, OnGetAllOperatorGamesWithTournamentV2ResponseParams, OnGetApiAuthorizationTokenResponseParams, OnGetAuthLogListResponseParams, OnGetBanksResponseParams, OnGetBetDbConfigResponseParams, OnGetBetResponseParams, OnGetBetsCurrenciesReportResponseParams, OnGetCpgPaymentGatewayResponseParams, OnGetFinancialReportResponseParams, OnGetJbPaymentGatewayResponseParams, OnGetKycVerificationsResponseParams, OnGetLaunchLogListResponseParams, OnGetLaunchReportResponseParams, OnGetMessagesInLanguageResponseParams, OnGetOperatorBetAmountLimitsResponseParams, OnGetOperatorBrandsResponseParams, OnGetOperatorConfigResponseParams, OnGetOperatorDefaultBetAmountLimitsResponseParams, OnGetOperatorGameResponseParams, OnGetOperatorGameV2ResponseParams, OnGetOperatorResponseParams, OnGetOperatorWebhookBaseUrlResponseParams, OnGetPaymentGatewayCurrenciesResponseParams, OnGetPaymentGatewaysResponseParams, OnGetPermissionsResponseParams, OnGetPlayerResponseParams, OnGetPwPaymentGatewayResponseParams, OnGetRelatedPlayersResponseParams, OnGetReportConfigResponseParams, OnGetRolesResponseParams, OnGetStatsResponseParams, OnGetTopupCurrenciesResponseParams, OnGetTournamentIdsResponseParams, OnGetTournamentListResponseParams, OnGetTournamentV2IdsResponseParams, OnGetTournamentV2ListResponseParams, OnGetTournamentV2ResponseParams, OnGetUiStateResponseParams, OnGetUsedCurrenciesResponseParams, OnGetUserResponseParams, OnGetValidGamesForOperatorResponseParams, OnGetWalletBalanceResponseParams, OnGetWebhookLogListResponseParams, OnOperatorGameListResponseParams, OnOperatorListResponseParams, OnOperatorTransactionListResponseParams, OnPlayerActivityListResponseParams, OnPlayerListResponseParams, OnSetActivePaymentGatewaysResponseParams, OnTransactionListResponseParams, OnUserActivityListResponseParams, OnUserListResponseParams, Operator, OperatorConfig, OperatorGame, OperatorGameV2, OperatorTransaction, PaymentGateway, PaymentGatewayName, PaymentGateways, Player, PlayerActivityList, PwPaymentGateway, RealtimeData, RelatedPlayersParam, ReportConfig, ReportTimeInterval, Roles, Stats, TournamentList, TournamentV2, TournamentV2List, User, UserPermission, UserPermissionEvent, UserScope, WalletBalance, WebhookLog } from "@alienbackoffice/back-front";
import { OnGameCoreListResponseParams } from "@alienbackoffice/back-front/lib/backoffice/interfaces/on-game-core-list-response-params.interface";
import { OnGetCurrenciesResponseParams } from "@alienbackoffice/back-front/lib/backoffice/interfaces/on-get-currencies-response-params.interface";
import { OnOperatorGameV2ListResponseParams } from "@alienbackoffice/back-front/lib/backoffice/interfaces/on-operator-game-v2-list-response-params.interface";
import { BetList } from "@alienbackoffice/back-front/lib/bet/interfaces/bet-list.interface";
import { GameCore } from "@alienbackoffice/back-front/lib/game/interfaces/game-core.interface";
import { GameList } from "@alienbackoffice/back-front/lib/game/interfaces/game-list.interface";
import { GetOperatorListFindDto } from "@alienbackoffice/back-front/lib/operator/dto/get-operator-list.dto";
import { OperatorList } from "@alienbackoffice/back-front/lib/operator/interfaces/operator-list.interface";
import { GetPlayerListFindDto } from "@alienbackoffice/back-front/lib/player/dto/get-player-list.dto";
import { PlayerList } from "@alienbackoffice/back-front/lib/player/interfaces/player-list.interface";
import { LaunchReportData } from "@alienbackoffice/back-front/lib/report/interfaces/launch-report-data.interface";
import { UserActivityList } from "@alienbackoffice/back-front/lib/user/interfaces/user-activity-list.interface";
import { UserList } from "@alienbackoffice/back-front/lib/user/interfaces/user-list.interface";
import { TransactionList } from "@alienbackoffice/back-front/lib/wallet/interfaces/transaction-list.interface";
import router from "next/router";
import { toast } from "react-toastify";
import { logout, saveActivePaymentGatewayBrand, saveActivePaymentGatewayOperator, saveAllOperatorGamesWithTournament, saveApiAuthorizationTokenData, saveAuthList, saveBanksName, saveBetDetails, saveBetsBigLosses, saveBetsBigWins, saveBetsCurrenciesReportData, saveBetsHighRoller, saveBetsLatestWins, saveBetsList, saveBetsLuckyWins, saveBrands, saveBrandsList, saveCashinCashoutList, saveCompleteInit, saveCoreIdRealTime, saveCurrencies, saveCurrenciesDetail, saveCurrenciesInit, saveCurrencyOption, saveCurrentBrand, saveCurrentCurrency, saveCurrentOp, saveCurrentOpData, saveCurrentRole, saveCurrentRoleName, saveCurrentScope, saveDefaultBetAmountLimits, saveDnsRecordList, saveExchangeRates, saveFinancialReportBrands, saveFinancialReportOperators, saveFinancialReportsDaily, saveFinancialReportsDashboard, saveFinancialReportsGraph, saveFinancialReportsHourly, saveFinancialReportsMonthly, saveFinancialReportsYearly, saveGameCoresList, saveGameOperatorConfigsState, saveGameV2List, saveGamesList, saveKycVerification, saveLanguages, saveLaunchList, saveLaunchReportData, saveMessagesInLanguageInBrand, saveNotifications, saveOperatorBetAmountLimits, saveOperatorBetConfigData, saveOperatorConfigsState, saveOperatorDetails, saveOperatorGameV2, saveOperatorGamesList, saveOperatorGamesV2List, saveOperators, saveOperatorsList, savePaymentCPGGatewayOperator, savePaymentGatewayCurrencies, savePaymentGatewayOperator, savePaymentJBGatewayOperator, savePaymentsGateway, savePendingVerification, savePermissions, savePlayerActivitiesList, savePlayerDetails, savePlayersList, saveRealtimeMessages, saveRelatedPlayerDetails, saveRelatedPlayers, saveRelatedPlayersList, saveReportConfig, saveRoles, saveServer, saveStats, saveTopupCurrencies, saveTournament, saveTournamentIDs, saveTournamentV2, saveTournamentV2Details, saveTournamentV2IDs, saveTransactions, saveUiState, saveUser, saveUserActivitiesList, saveUserDetails, saveUserDetails1, saveUserDetails2, saveUsersList, saveValidGamesForOperatorList, saveWalletBalance, saveWebhookBaseURL, saveWebhookList, updateNotifications } from "redux/authSlice";
import { saveLoadingActivePaymentGatewayOperator, saveLoadingAuthLogsList, saveLoadingBetDBConfig, saveLoadingBetsCurrenciesReport, saveLoadingBigLosses, saveLoadingBigWins, saveLoadingBrandList, saveLoadingCashinCashout, saveLoadingDefaultBetAmountLimits, saveLoadingDnsRecordList, saveLoadingFinancialReport, saveLoadingFinancialReportBrands, saveLoadingFinancialReportDashboard, saveLoadingFinancialReportDay, saveLoadingFinancialReportHour, saveLoadingFinancialReportMonth, saveLoadingFinancialReportOperators, saveLoadingFinancialReportYear, saveLoadingGameCoresList, saveLoadingGameV2List, saveLoadingGamesList, saveLoadingHighRollers, saveLoadingKycVerification, saveLoadingLatestWins, saveLoadingLaunchLogsList, saveLoadingLaunchReport, saveLoadingLuckWins, saveLoadingMessagesInLanguageInBrand, saveLoadingOperatorBetAmountLimits, saveLoadingOperatorGameV2, saveLoadingOperatorGamesList, saveLoadingOperatorGamesV2List, saveLoadingOperatorList, saveLoadingOperatorTransactionList, saveLoadingOperatorsGamesListTournament, saveLoadingPaymentGatewayOperator, saveLoadingPaymentsGateway, saveLoadingPlayerActivites, saveLoadingPlayersList, saveLoadingRelatedAccounts, saveLoadingStats, saveLoadingTopUpCurrencies, saveLoadingTournament, saveLoadingTournamentIDs, saveLoadingTournamentV2, saveLoadingTournamentV2Details, saveLoadingTournamentV2IDs, saveLoadingTransactionList, saveLoadingUserAcitivites, saveLoadingUserDetails1, saveLoadingUserDetails2, saveLoadingUsersList, saveLoadingWalletBalanceList, saveLoadingWebhookList, saveloadingBetsList } from "redux/loadingSlice";
import { resetCrashConfig } from "redux/slices/crashConfig";
import { setUser } from "redux/slices/user";
import { resetSocket } from "redux/socketSlice";
import { store } from "redux/store";
import { NotificationItem, betListType, curenciesType } from "types";
import { v4 as uuidv4 } from 'uuid';
import { fetchJsonData } from "./globalFunctions";
import { clearCookies, createLanguageOptions, redirectToDashboard } from "./helper";
import { hasDetailsPermission } from "./permissionHandler";

/**
 * Generates a unique tab ID using the current timestamp and stores it in sessionStorage as 'sessionId'.
 */
const generateTabId = () => {
    const tabId = Date.now().toString();
    sessionStorage.setItem('sessionId', tabId);
};

/**
 * A utility class for handling events and event-related operations.
 * This class provides methods to manage and handle various events within an application.
 */
export class EventsHandler {
    /**
     * Handles the initialization of user-related data and performs various actions based on user permissions.
     * @param {InitInfo} initInfo - An object containing initialization information for the user.
     */
    async handleInforUser(initInfo: InitInfo) {
        // Mark the performance before rendering
        performance.mark('beforeRender');



        // Generate a tab ID
        generateTabId();

        // Destructure properties from the initInfo object for easier access
        const { operator, user, env, languages, currencies, brands } = initInfo;
        const { brandId, scope } = user;
        const boClient = store.getState().socket.boClient;
        const sessionId = sessionStorage.getItem('sessionId');

        // Dispatch actions for initial data
        store.dispatch(saveFinancialReportsGraph([]));
        store.dispatch(setUser(user));
        store.dispatch(saveUser(user));
        store.dispatch(saveServer(env));
        fetchJsonData(`https://alienrates.imoon.com/rates/rates.json`)
            .then((data) =>
                store.dispatch(saveCurrenciesInit((Object.values(data.exchangeRates) as Currency[])))
            )
            .catch((error) => ({ status: 'rejected', error }))
        // Create language options based on 'languages'
        const languageOptions = createLanguageOptions(Object.values(languages));
        store.dispatch(saveLanguages(languageOptions));

        // Handle operator data if it's defined and not a wildcard
        if (operator && operator.opId !== '*') {
            store.dispatch(saveCurrentOp(operator.opId));
            store.dispatch(saveCurrentOpData(operator));
        }

        // Redirect to '/dashboard' if the current route is '/imoon' or '/auth/login'
        redirectToDashboard();

        // Create currency options based on 'currencies'
        const currenciesData = Object.keys(currencies).map((obj: any) => ({
            label: obj,
            value: obj,
            type: currencies[obj].type,
            cmcId: currencies[obj].cmcId
        }));
        // Get the current currency option
        // const currencyOption = store.getState().auth.curencyOption;

        // // If there's no currency option, set it to the first one
        // if (!currencyOption) {
        //     store.dispatch(saveCurrencyOption(curenciesType[0]));
        // }
        store.dispatch(saveCurrencyOption(curenciesType[1]));
        // Check if the user has permissions for getting permissions
        if (hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GET_PERMISSIONS_REQ)) {
            boClient?.user?.getPermissions({}, {
                uuid: uuidv4(),
                meta: {
                    ts: new Date(),
                    sessionId,
                    event: UserPermissionEvent.BACKOFFICE_GET_PERMISSIONS_REQ
                },
            });
        }

        // Handle operator data if it's defined and not a wildcard
        if (operator && operator.opId !== '*') {
            store.dispatch(saveCurrentOp(operator.opId));
            store.dispatch(saveCurrentOpData(operator));

            // Check if the brandId is a wildcard
            if (brandId === '*') {
                // Fetch operator brands if the user has the necessary permission
                if (hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ)) {
                    boClient?.operator?.getOperatorBrands(
                        { opId: operator.opId },
                        {
                            uuid: uuidv4(),
                            meta: {
                                ts: new Date(),
                                type: 'navBar',
                                sessionId,
                                event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ
                            }
                        }
                    );
                }
            } else {
                // Dispatch actions for the current brand and brands list
                store.dispatch(saveBrands(brands));
                store.dispatch(saveCurrentBrand(brandId));
                store.dispatch(saveBrandsList(brands));
            }

            // Dispatch action to indicate loading of statistics
            store.dispatch(saveLoadingStats(true));

            // Fetch statistics if the user has the necessary permission
            if (hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GET_STATS_REQ)) {
                boClient?.report?.getStats({ opId: operator.opId }, {
                    uuid: uuidv4(),
                    meta: {
                        ts: new Date(),
                        sessionId,
                        event: UserPermissionEvent.BACKOFFICE_GET_STATS_REQ
                    }
                });
            }

            // Fetch used currencies if the user has the necessary permission
            if (hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GET_USED_CURRENCIES_REQ)) {
                boClient?.operator.getUsedCurrencies({ opId: operator.opId }, {
                    uuid: uuidv4(),
                    meta: {
                        ts: new Date(),
                        type: 'navBar',
                        sessionId,
                        event: UserPermissionEvent.BACKOFFICE_GET_USED_CURRENCIES_REQ
                    }
                });
            }
        } else if (scope === UserScope.SUPERADMIN || scope === UserScope.ADMIN) {
            // Define parameters for fetching operator list
            const find: GetOperatorListFindDto = { isAssociated: true };
            const skip = 0;
            const limit = 100;

            // Fetch operator list if the user has the necessary permission
            if (hasDetailsPermission(UserPermissionEvent.BACKOFFICE_OPERATOR_LIST_REQ)) {
                boClient?.operator?.getOperatorList(
                    { skip, limit, find, sort: { opId: 1 } },
                    {
                        uuid: uuidv4(),
                        meta: {
                            ts: new Date(),
                            type: 'navBar',
                            sessionId,
                            event: UserPermissionEvent.BACKOFFICE_OPERATOR_LIST_REQ
                        }
                    }
                );
            }
        }

        // Check if the user has permissions for getting UI state
        if (hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GET_UI_STATE_REQ)) {
            boClient?.user?.getUiState({
                uuid: uuidv4(),
                meta: {
                    ts: new Date(),
                    sessionId,
                    event: UserPermissionEvent.BACKOFFICE_GET_UI_STATE_REQ
                },
            });
        }

        // Mark the performance after rendering
        performance.mark('afterRender');
        performance.measure('renderTime', 'beforeRender', 'afterRender');
        console.log('complete loader');
        if (hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GAME_CORE_LIST_REQ) && [UserScope.SUPERADMIN, UserScope.ADMIN].includes(user.scope)) {
            boClient?.gameCore.getGameCoreList(
                { find: {}, sort: {} },
                {
                    uuid: uuidv4(),
                    meta: {
                        ts: new Date(),
                        sessionId: sessionStorage.getItem('sessionId'),
                        event: UserPermissionEvent.BACKOFFICE_GAME_CORE_LIST_REQ,
                    },
                }
            )
        }

        if (router.pathname === '/real-time') {

            const coreList = store.getState().auth.gameCoresList
            if (coreList.count > 0) {
                const coreListCrash = coreList.games.filter(item => item.configType === ConfigType.ALIEN_CRASH)
                if (coreListCrash.length > 0) {
                    store.dispatch(saveCoreIdRealTime(coreListCrash[0]?.coreId))
                    boClient?.gameCore?.startGameCoreRealtime(
                        {
                            coreId: coreListCrash[0]?.coreId,
                        },
                        {
                            uuid: uuidv4(),
                        }
                    )
                }
            } else {
                store.dispatch(saveCoreIdRealTime(''))
            }

        }
        store.dispatch(saveCompleteInit(true));
    }

    /**
     * Displays a notification and handles related state updates.
     * @param {Notification} notification - The notification to display.
     */
    async notifications(notification: Notification) {
        // Display the notification based on its severity
        switch (notification.severity) {
            case NotificationSeverity.ERROR:
                toast.error(notification.data, {
                    position: toast.POSITION.TOP_CENTER,
                })
                break;
            case NotificationSeverity.ALERT:
                toast.warn(notification.data, {
                    position: toast.POSITION.TOP_CENTER,
                })
                break;
            case NotificationSeverity.INFORMATION:
                toast.info(notification.data, {
                    position: toast.POSITION.TOP_CENTER,
                })
                break;
            case NotificationSeverity.WARNING:
                toast.warning(notification.data, {
                    position: toast.POSITION.TOP_CENTER,
                })
                break;
            case NotificationSeverity.VERBOSE:
                toast(notification.data, {
                    position: toast.POSITION.TOP_CENTER,
                })
                break;
            default:
                break;
        }

        // Save the notification to the store
        store.dispatch(saveNotifications({ ...notification, read: false }));

        const boClient = store.getState().socket.boClient;
        const notificationStore = store.getState().auth.notifications?.slice(0, 100);
        const uiStats = store.getState().auth.uiState;

        // Update the UI state with the latest notifications
        boClient && boClient.user.setUiState(
            {
                uiState: { ...uiStats, notification: notificationStore }
            },
            {
                uuid: uuidv4(),
                meta: {
                    ts: new Date(),
                    sessionId: sessionStorage.getItem('sessionId'),
                    event: UserPermissionEvent.BACKOFFICE_SET_UI_STATE_REQ
                },
            }
        );
    }

    /**
     * Handles financial report data and updates the store accordingly.
     * @param {OnGetFinancialReportResponseParams} result - The financial report data.
     * @param {{ type: string, sessionId: string }} meta - Metadata for the operation.
     */
    async handleFinancialReport(result: OnGetFinancialReportResponseParams, meta: { type: string, sessionId: string }) {
        const { traceData, data } = result;
        const { type, sessionId } = meta;

        // Determine the type of financial report data and dispatch the appropriate action
        switch (traceData?.meta?.timeInterval) {
            case 'Graph':
                store.dispatch(saveFinancialReportsGraph(data));
                store.dispatch(saveLoadingFinancialReport(false))
                break;
            case ReportTimeInterval.YEAR:
                store.dispatch(saveFinancialReportsYearly(data));
                store.dispatch(saveLoadingFinancialReportYear(false))
                break;
            case 'reportDashboard':
                store.dispatch(saveFinancialReportsDashboard(data));
                store.dispatch(saveLoadingFinancialReportDashboard(false))
                break;
            case ReportTimeInterval.MONTH:
                store.dispatch(saveFinancialReportsMonthly(data));
                store.dispatch(saveLoadingFinancialReportMonth(false))
                break;
            case ReportTimeInterval.DAY:
                store.dispatch(saveFinancialReportsDaily(data));
                store.dispatch(saveLoadingFinancialReportDay(false))
                break;
            case ReportTimeInterval.HOUR:
                store.dispatch(saveFinancialReportsHourly(data));
                store.dispatch(saveLoadingFinancialReportHour(false))
                break;
            case 'operatorsReport':
                const allOperators = {} as any
                allOperators.opFullId = 'All Operators'
                allOperators.from = 'All Operators'
                allOperators.data = {
                    totalInUSD: {
                        registration: {
                            total: data?.reduce(
                                (sum, entry) => sum + (entry.data?.totalInUSD?.registration?.total ?? 0),
                                0
                            ) || 0,
                            telegram: data?.reduce(
                                (sum, entry) => sum + (entry.data?.totalInUSD?.registration?.telegram ?? 0),
                                0
                            ) || 0,
                            google: data?.reduce(
                                (sum, entry) => sum + (entry.data?.totalInUSD?.registration?.google ?? 0),
                                0
                            ) || 0,
                        },
                        betCount: data?.reduce(
                            (sum, entry) => sum + (entry.data?.totalInUSD?.betCount ?? 0),
                            0
                        ) || 0,
                        ftd: data?.reduce(
                            (sum, entry) => sum + (entry.data?.totalInUSD?.ftd ?? 0),
                            0
                        ) || 0,
                        totalBetAmountInCurrentUSD: data?.reduce(
                            (sum, entry) => sum + (entry.data?.totalInUSD?.totalBetAmountInCurrentUSD ?? 0),
                            0
                        ) || 0,
                        totalDepositAmountInCurrentUSD: data?.reduce(
                            (sum, entry) => sum + (entry.data?.totalInUSD?.totalDepositAmountInCurrentUSD ?? 0),
                            0
                        ) || 0,
                        totalPlInCurrentUSD: data?.reduce(
                            (sum, entry) => sum + (entry.data?.totalInUSD?.totalPlInCurrentUSD ?? 0),
                            0
                        ) || 0,
                        totalTopupAmountInCurrentUSD: data?.reduce(
                            (sum, entry) => sum + (entry.data?.totalInUSD?.totalTopupAmountInCurrentUSD ?? 0),
                            0
                        ) || 0,
                        totalWinAmountInCurrentUSD: data?.reduce(
                            (sum, entry) => sum + (entry.data?.totalInUSD?.totalWinAmountInCurrentUSD ?? 0),
                            0
                        ) || 0,
                        totalWithdrawAmountInCurrentUSD: data?.reduce(
                            (sum, entry) => sum + (entry.data?.totalInUSD?.totalWithdrawAmountInCurrentUSD ?? 0),
                            0
                        ) || 0,
                        uniquePlayers: data?.reduce(
                            (sum, entry) => sum + (entry.data?.totalInUSD?.uniquePlayers ?? 0),
                            0
                        ) || 0,
                    }
                }
                data?.unshift(allOperators)
                store.dispatch(saveFinancialReportOperators(data));
                store.dispatch(saveLoadingFinancialReportOperators(false))
                break;
            case 'brandsReport':
                store.dispatch(saveFinancialReportBrands(data));
                store.dispatch(saveLoadingFinancialReportBrands(false))
                break;
            default:
                break;
        }
    }

    /**
     * Handles operator list data and updates the store accordingly.
     * @param {OperatorList} data - The operator list data.
     * @param {{ type: string, sessionId: string }} meta - Metadata for the operation.
     */
    async handleOperatorList(data: OperatorList, meta: { type: string, sessionId: string }) {
        const boClient = store.getState().socket.boClient
        switch (meta?.type) {
            case 'navBar':
                // Sort operators alphabetically by opId
                data.operators.sort((a, b) => a.opId.localeCompare(b.opId));

                // Save the operators list to the store
                store.dispatch(saveOperators(data));

                const currentOpId = store.getState().auth.operator

                if (!currentOpId || (currentOpId && data?.operators && data?.operators.length > 0 && data?.operators?.findIndex((qry: Operator) => qry.opId === currentOpId) < 0)) {
                    // Set the current operator to the first one in the list
                    const firstOperator = data?.operators[0];
                    store.dispatch(saveCurrentOp(firstOperator?.opId));
                    store.dispatch(saveCurrentOpData(firstOperator));

                    if (hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GET_OPERATOR_REQ)) {
                        // Fetch operator details if permission is granted
                        boClient?.operator.getOperator(
                            { opId: firstOperator?.opId },
                            {
                                uuid: uuidv4(),
                                meta: {
                                    ts: new Date(),
                                    type: 'navBar',
                                    sessionId: sessionStorage.getItem('sessionId'),
                                    event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_REQ
                                }
                            }
                        );
                    }
                } else if (currentOpId && hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GET_OPERATOR_REQ)) {
                    // Fetch operator details for the current operator if permission is granted
                    boClient?.operator.getOperator(
                        { opId: currentOpId },
                        {
                            uuid: uuidv4(),
                            meta: {
                                ts: new Date(),
                                sessionId: sessionStorage.getItem('sessionId'),
                                event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_REQ
                            }
                        }
                    );
                }
                break;
            case 'operatorsList':
                // Save the complete operators list and set loading to false
                store.dispatch(saveLoadingOperatorList(false));
                store.dispatch(saveOperatorsList(data));
                break;
            default:
                break;
        }
    }

    /**
     * Handles operator data and updates the store accordingly.
     * @param {Operator} data - The operator data.
     * @param {{ type: string, sessionId: string }} meta - Metadata for the operation.
     */
    async handleGetOperator(data: Operator, meta: { type: string, sessionId: string }) {
        const boClient = store.getState().socket.boClient;

        switch (meta.type) {
            case 'details':
                // Save operator details to the store
                store.dispatch(saveOperatorDetails(data));
                store.dispatch(saveCurrentOp(data?.opId));
                store.dispatch(saveCurrentOpData(data));
                boClient?.operator?.getOperatorBrands(
                    { opId: data?.opId },
                    {
                        uuid: uuidv4(),
                        meta: {
                            ts: new Date(),
                            type: 'navBar',
                            sessionId: sessionStorage.getItem('sessionId'),
                            event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ
                        }
                    }
                );

                // Fetch used currencies
                boClient?.operator?.getUsedCurrencies(
                    { opId: data?.opId },
                    {
                        uuid: uuidv4(),
                        meta: {
                            ts: new Date(),
                            type: 'navBar',
                            sessionId: sessionStorage.getItem('sessionId'),
                            event: UserPermissionEvent.BACKOFFICE_GET_USED_CURRENCIES_REQ
                        }
                    }
                );

                // Set loading stats flag
                store.dispatch(saveLoadingStats(true));

                // Fetch statistics
                boClient?.report?.getStats(
                    { opId: data?.opId },
                    {
                        uuid: uuidv4(),
                        meta: {
                            ts: new Date(),
                            sessionId: sessionStorage.getItem('sessionId'),
                            event: UserPermissionEvent.BACKOFFICE_GET_STATS_REQ
                        }
                    }
                );
                break;
            case 'navBar':
                store.dispatch(saveCurrentOpData(data));
                // Fetch operator brands
                boClient?.operator?.getOperatorBrands(
                    { opId: data?.opId },
                    {
                        uuid: uuidv4(),
                        meta: {
                            ts: new Date(),
                            type: 'navBar',
                            sessionId: sessionStorage.getItem('sessionId'),
                            event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ
                        }
                    }
                );

                // Fetch used currencies
                boClient?.operator?.getUsedCurrencies(
                    { opId: data?.opId },
                    {
                        uuid: uuidv4(),
                        meta: {
                            ts: new Date(),
                            type: 'navBar',
                            sessionId: sessionStorage.getItem('sessionId'),
                            event: UserPermissionEvent.BACKOFFICE_GET_USED_CURRENCIES_REQ
                        }
                    }
                );

                // Set loading stats flag
                store.dispatch(saveLoadingStats(true));

                // Fetch statistics
                boClient?.report?.getStats(
                    { opId: data?.opId },
                    {
                        uuid: uuidv4(),
                        meta: {
                            ts: new Date(),
                            sessionId: sessionStorage.getItem('sessionId'),
                            event: UserPermissionEvent.BACKOFFICE_GET_STATS_REQ
                        }
                    }
                );

                // Update current brand and set complete initialization

                // store.dispatch(saveCurrentBrand('All Brands'));
                store.dispatch(saveCompleteInit(true));
                break;
            default:
                break;
        }
    }

    /**
     * Handles brand data and updates the store accordingly.
     * @param {Brand[]} data - The brand data.
     * @param {{ type: string, sessionId: string }} meta - Metadata for the operation.
     */
    async handleGetBrands(data: Brand[], meta: { type: string, sessionId: string }) {
        switch (meta.type) {
            case 'list':
                // Save brands list to the store

                store.dispatch(saveBrandsList(data || []));
                store.dispatch(saveLoadingBrandList(false))
                break;
            case 'navBar':
                // Save brands to the store
                const brand = store.getState().auth.currentBrand
                const findIndex = data?.findIndex((item => item.brandId === brand))
                if (findIndex < 0) {
                    store.dispatch(saveCurrentBrand('All Brands'));
                }
                store.dispatch(saveBrandsList(data || []));
                store.dispatch(saveBrands(data || []));
                store.dispatch(saveLoadingBrandList(false))
                break;
            default:
                break;
        }
    }


    /**
     * Handles currency data and updates the store accordingly.
     * @param {string[]} data - The currency data.
     * @param {{ type: string, sessionId: string }} meta - Metadata for the operation.
     */
    async handleGetCurrencies(data: string[], meta: { type: string, sessionId: string }) {
        switch (meta.type) {
            case 'details':
                // Save detailed currencies data to the store
                store.dispatch(saveCurrenciesDetail(data.sort()));
                break;
            case 'navBar':
                // Get the current currency from the store
                const currency = store.getState().auth.currentCurrency;
                const currencies: string[] = [...data];

                // If no current currency or it's not in the updated list, set the first currency as the current one
                if (data?.length > 0 && (!currency || data?.indexOf(currency) === -1)) {
                    store.dispatch(saveCurrentCurrency(currencies.sort()[0]));
                }
                store.dispatch(saveCurrencyOption(curenciesType[1]))
                // Save currencies list to the store
                store.dispatch(saveCurrencies(currencies.sort()));
                break;
            default:
                break;
        }
    }

    /**
     * Handles statistics data and updates the store accordingly.
     * @param {Stats} data - The statistics data to be saved.
     */
    async handleGetStats(data: Stats) {
        // Set loading stats flag to false
        store.dispatch(saveLoadingStats(false));

        // Save the received statistics data to the store
        store.dispatch(saveStats(data));
    }

    /**
     * Handles bet data and updates the store accordingly.
     * @param {Bet} data - The bet data to be saved.
     */
    async HandleGetBetDetails(data: Bet) {

        // Save the received bet data to the store
        store.dispatch(saveBetDetails(data));
    }

    /**
     * Handles various types of bet lists and updates the store accordingly.
     * @param {BetList} data - The bet list data to be saved.
     * @param {{ type: string, sessionId: string }} meta - Metadata for the operation.
     */
    async HandleGetBetsList(data: BetList, meta: { type: string, sessionId: string }) {
        switch (meta?.type) {
            case betListType.LIST:
                // Save the complete bet list and set loading to false
                store.dispatch(saveloadingBetsList(false));
                store.dispatch(saveBetsList(data));
                break;
            case betListType.BIGLOSSES:
                // Save big losses bet list and set loading to false
                store.dispatch(saveLoadingBigLosses(false));
                store.dispatch(saveBetsBigLosses(data));
                break;
            case betListType.BIGWINS:
                // Save big wins bet list and set loading to false
                store.dispatch(saveLoadingBigWins(false));
                store.dispatch(saveBetsBigWins(data));
                break;
            case betListType.HIGHROLLERS:
                // Save high rollers bet list and set loading to false
                store.dispatch(saveLoadingHighRollers(false));
                store.dispatch(saveBetsHighRoller(data));
                break;
            case betListType.LATESTWINS:
                // Save latest wins bet list and set loading to false
                store.dispatch(saveLoadingLatestWins(false));
                store.dispatch(saveBetsLatestWins(data));
                break;
            case betListType.LUCKYWINS:
                // Save lucky wins bet list and set loading to false
                store.dispatch(saveLoadingLuckWins(false));
                store.dispatch(saveBetsLuckyWins(data));
                break;
            default:
                break;
        }
    }

    /**
     * Handles player list data and updates the store accordingly.
     * @param {PlayerList} data - The player list data to be saved.
     */
    async HandleGetPlayersList(data: PlayerList, meta: { type: string, sessionId: string }) {
        // Save the player list and set loading to false
        switch (meta.type) {
            case 'list':
                // Save active payment gateway operator data to the store
                store.dispatch(savePlayersList(data));
                store.dispatch(saveLoadingPlayersList(false));
                break;
            case 'relatedList':
                // Save active payment gateway brand data to the store
                store.dispatch(saveRelatedPlayersList(data));
                store.dispatch(saveLoadingPlayersList(false));
                break;
            case 'pendingVerification':
                // Save active payment gateway brand data to the store
                store.dispatch(savePendingVerification(data.count));
                break;

            default:
                break;
        }

        // store.dispatch(saveLoadingPlayersList(false));
    }

    /**
     * Handles user list data and updates the store accordingly.
     * @param {UserList} data - The user list data to be saved.
     */
    async HandleGetUsersList(data: UserList) {
        // Save the user list and set loading to false
        store.dispatch(saveUsersList(data));
        store.dispatch(saveLoadingUsersList(false));
    }

    /**
     * Handles game list data and updates the store accordingly.
     * @param {GameList} data - The game list data to be saved.
     */
    async HandleGetGamesList(data: GameList) {
        // Save the game list and set loading to false
        store.dispatch(saveGamesList(data));
        store.dispatch(saveLoadingGamesList(false));
    }

    /**
     * Handles operator game list data and updates the store accordingly.
     * @param {OperatorGame[]} data - The operator game list data to be saved.
     */
    async HandleGetOperatorGamesList(data: OperatorGame[]) {
        // Save the operator game list and set loading to false
        store.dispatch(saveOperatorGamesList(data));
        store.dispatch(saveLoadingOperatorGamesList(false));
    }

    /**
     * Handles exchange rate data and updates the store accordingly.
     * @param {Currency[]} data - The exchange rate data to be saved.
     */
    async HandleGetExchangeRates(data: Currency[]) {
        // Save the exchange rate data to the store
        store.dispatch(saveExchangeRates(data));
    }

    /**
     * Handles roles list data and updates the store accordingly.
     * @param {Roles} data - The roles list data to be saved.
     */
    async HandleGetRolesList(data: Roles) {
        // Convert the roles object to an array of objects
        const roles = data ? Object.entries(data).map(([name, UserPermissionEvent]) => ({ name, UserPermissionEvent })) : [];

        // Save the roles list to the store
        store.dispatch(saveRoles(roles));

        // Save the current role and its name
        const firstRole = roles?.length > 0 ? roles[0] : { name: '', UserPermissionEvent: [] };
        store.dispatch(saveCurrentRole(firstRole.UserPermissionEvent));
        store.dispatch(saveCurrentRoleName(firstRole.name));
    }

    /**
     * Handles transaction list data and updates the store accordingly.
     * @param {TransactionList} data - The transaction list data to be saved.
     */
    async HandleGetTransactionList(data: TransactionList) {
        // Save the transaction list data to the store
        store.dispatch(saveTransactions(data));

        // Set loading flag to false
        store.dispatch(saveLoadingTransactionList(false));
    }

    /**
     * Handles transaction list data and updates the store accordingly.
     * @param {TransactionList} data - The transaction list data to be saved.
     */
    async HandleGetOperatorTransactionList(data: {
        count: number;
        transactions: OperatorTransaction[];
    }) {
        // Save the transaction list data to the store
        store.dispatch(saveTransactions(data));

        // Set loading flag to false
        store.dispatch(saveLoadingOperatorTransactionList(false));
    }

    /**
     * Handles operator game V2 data and updates the store accordingly.
     * @param {OperatorGameV2} data - The operator game V2 data to be saved.
     */
    async HandleGetOperatorGameV2(data: OperatorGameV2<any>) {
        // Save the operator game V2 data to the store
        store.dispatch(saveOperatorGameV2(data));

        // Set loading flag to false
        store.dispatch(saveLoadingOperatorGameV2(false));
    }

    /**
     * Handles  get operator gateway currencies and updates the store accordingly.
     * @param {{validCurrenciesToDeposit: string[], validCurrenciesToWithdraw: string[]}} data -  get operator gateway currencies data to be saved.
     */
    async HandleGetPaymentGatewayCurrencies(data: {
        validCurrenciesToDeposit: string[];
        validCurrenciesToWithdraw: string[];
    }) {
        // Save  get operator gateway currencies data to the store
        store.dispatch(savePaymentGatewayCurrencies(data));
    }

    /**
     * Handles player activities list data and updates the store accordingly.
     * @param {PlayerActivityList} data - The player activities list data to be saved.
     */
    async HandleGetPlayerActivitiesList(data: PlayerActivityList) {
        // Save the player activities list data to the store
        store.dispatch(savePlayerActivitiesList(data));

        // Set loading flag to false
        store.dispatch(saveLoadingPlayerActivites(false));
    }

    /**
     * Handles user details data, updates the store, and fetches user roles.
     * @param {User} data - The user details data to be saved.
     */
    async HandleGetUserDetails(data: User, meta: { type: string, sessionId: string }) {


        switch (meta.type) {
            case 'username1':
                // Save active payment gateway operator data to the store
                store.dispatch(saveUserDetails1(data));
                store.dispatch(saveLoadingUserDetails1(false));
                break;
            case 'username2':
                // Save active payment gateway brand data to the store
                store.dispatch(saveUserDetails2(data));
                store.dispatch(saveLoadingUserDetails2(false));
                store.dispatch(saveLoadingUserDetails1(false));
                break;

            default:
                // Get the BO client from the store's state
                const boClient = store.getState().socket.boClient;

                // Save user details to the store
                store.dispatch(saveUserDetails(data));

                // Save the current user scope
                store.dispatch(saveCurrentScope(data.scope));

                // Fetch user roles based on user scope
                boClient?.user?.getRoles(
                    { userScope: data.scope },
                    {
                        uuid: uuidv4(),
                        meta: {
                            ts: new Date(),
                            type: 'list',
                            sessionId: sessionStorage.getItem('sessionId'),
                            event: UserPermissionEvent.BACKOFFICE_GET_ROLES_REQ
                        },
                    }
                );
                break;
        }

    }

    /**
     * Handles UI stats data, updates the store, and processes notifications.
     * @param {any} data - The UI stats data to be saved.
     */
    async HandleGetUiStats(data: any) {
        // Save UI state data to the store
        store.dispatch(saveUiState(data));

        // Check if there are notifications in the UI stats data
        if (data?.notification) {
            // Extract and update notifications from the UI stats data
            const notifications = data.notification as NotificationItem[];
            store.dispatch(updateNotifications(notifications));
        }
    }

    /**
     * Handles permission data, extracts and saves the permission values to the store.
     * @param {Record<UserPermissionEvent, UserPermission>} data - The permission data to be processed and saved.
     */
    async handlePermissions(data: Record<UserPermissionEvent, UserPermission>) {
        // Extract and save the permission values to the store
        store.dispatch(savePermissions(Object.values(data)));
    }

    /**
     * Handles user activities list data and updates the store accordingly.
     * @param {UserActivityList} data - The user activities list data to be saved.
     */
    async HandleGetUserActivitiesList(data: UserActivityList) {
        // Save the user activities list data to the store
        store.dispatch(saveUserActivitiesList(data));

        // Set loading flag to false
        store.dispatch(saveLoadingUserAcitivites(false));
    }

    /**
     * Handles operator configurations data and updates the store accordingly.
     * @param {OperatorConfig} data - The operator configurations data to be saved.
     */
    async HandleGetOperatorConfigs(data: OperatorConfig) {
        // Save the operator configurations data to the store
        store.dispatch(saveOperatorConfigsState(data));
    }

    /**
     * Handles operator game configurations data and updates the store accordingly.
     * @param {OperatorGame} data - The operator game configurations data to be saved.
     */
    async HandleGetOperatorGameConfigs(data: OperatorGame) {
        // Save the operator game configurations data to the store
        store.dispatch(saveGameOperatorConfigsState(data));
    }

    /**
     * Handles webhook log list data and updates the store accordingly.
     * @param {{
    *   webhookLogList: WebhookLog[];
    *   count: number;
    * }} data - The webhook log list data to be saved.
    */
    async HandleGetWebhookList(data: {
        webhookLogList: WebhookLog[];
        count: number;
    }) {
        // Save the webhook log list data to the store
        store.dispatch(saveWebhookList(data));

        // Set loading flag to false
        store.dispatch(saveLoadingWebhookList(false));
    }


    /**
     * Handles auth log list data and updates the store accordingly.
     * @param {{
    *   authLogList: AuthLog[]
    *   count: number
    * }} data - The auth log list data to be saved.
    */
    async HandleGetAuthList(data: {
        authLogList: AuthLog[]
        count: number
    }) {
        // Save the auth log list data to the store
        store.dispatch(saveAuthList(data));

        // Set loading flag to false
        store.dispatch(saveLoadingAuthLogsList(false));
    }

    /**
     * Handles auth log list data and updates the store accordingly.
     * @param {{
    *   launchLogList: LaunchLog[]
    *   count: number
    * }} data - The auth log list data to be saved.
    */
    async HandleGetLaunchList(data: {
        launchLogList: LaunchLog[]
        count: number
    }) {
        // Save the auth log list data to the store
        store.dispatch(saveLaunchList(data));

        // Set loading flag to false
        store.dispatch(saveLoadingLaunchLogsList(false));
    }

    /**
     * Handles tournament list data and updates the store accordingly.
     * @param {TournamentList} data - The tournament list data to be saved.
     */
    async HandleGetTournament(data: TournamentList) {
        // Save the tournament list data to the store
        store.dispatch(saveTournament(data));

        // Set loading flag to false
        store.dispatch(saveLoadingTournament(false));
    }

    /**
     * Handles tournament V2 list data and updates the store accordingly.
     * @param {TournamentV2List} data - The tournament list data to be saved.
     */
    async HandleGetTournamentV2(data: TournamentV2List) {
        // Save the tournament V2 list data to the store
        store.dispatch(saveTournamentV2(data));

        // Set loading flag to false
        store.dispatch(saveLoadingTournamentV2(false));
    }

    /**
     * Handles tournament V2 details data and updates the store accordingly.
     * @param {TournamentV2} data - The tournament data to be saved.
     */
    async HandleGetTournamentV2Details(data: TournamentV2) {
        // Save the tournament V2 details data to the store
        store.dispatch(saveTournamentV2Details(data));

        // Set loading flag to false
        store.dispatch(saveLoadingTournamentV2Details(false));
    }

    /**
     * Handles payment gateways data, processes and sorts it, and updates the store accordingly.
     * @param {PaymentGateways | any} data - The payment gateways data to be saved.
     */
    async HandleGetPaymentsGateway(data: PaymentGateways | any) {
        // Process and sort the payment gateways data into an array of objects
        const dataRows = data && Object.keys(data).sort().map(
            (obj, cur) => ({
                'name': obj,
                ...data[obj]
            }),
            []
        );

        // Create a structured payment gateways object with count and data
        const paymentsGateway = {
            count: dataRows.length,
            paymentsGateway: dataRows
        };

        // Save the structured payment gateways data to the store
        store.dispatch(savePaymentsGateway(paymentsGateway));

        // Set loading flag to false
        store.dispatch(saveLoadingPaymentsGateway(false));
    }

    /**
     * Handles PW payment gateway operator data and updates the store accordingly.
     * @param {PwPaymentGateway | any} data - The PW payment gateway operator data to be saved.
     */
    async HandleGetPaymentGatewayOperator(data: PwPaymentGateway | any) {
        // Save the payment gateway operator data to the store
        store.dispatch(savePaymentGatewayOperator(data));

        // Set loading flag to false
        store.dispatch(saveLoadingPaymentGatewayOperator(false));
    }

    /**
     * Handles JB payment gateway operator data and updates the store accordingly.
     * @param {JbPaymentGateway | any} data - The JB payment gateway operator data to be saved.
     */
    async HandleGetPaymentJBGatewayOperator(data: JbPaymentGateway | any) {
        // Save the JB payment gateway operator data to the store
        store.dispatch(savePaymentJBGatewayOperator(data));

        // Set loading flag to false
        store.dispatch(saveLoadingPaymentGatewayOperator(false));
    }

    /**
     * Handles CPG payment gateway operator data and updates the store accordingly.
     * @param {CpgPaymentGateway | any} data - The CPG payment gateway operator data to be saved.
     */
    async HandleGetPaymenCPGGatewayOperator(data: CpgPaymentGateway | any) {
        // Save the CPG payment gateway operator data to the store
        store.dispatch(savePaymentCPGGatewayOperator(data));

        // Set loading flag to false
        store.dispatch(saveLoadingPaymentGatewayOperator(false));
    }

    /**
     * Handles active payment gateway operator or brand data and updates the store accordingly.
     * @param {{
    *   [PaymentGatewayName.CPG]?: PaymentGateway;
    *   [PaymentGatewayName.JB]?: PaymentGateway;
    *   [PaymentGatewayName.PW]?: PaymentGateway;
    * } | any} data - The active payment gateway data to be saved.
    * @param {{ type: string, sessionId: string }} meta - Metadata specifying the type of data being handled.
    */
    async HandleGetActivePaymentGatewayOperator(data: {
        [PaymentGatewayName.CPG]?: PaymentGateway;
        [PaymentGatewayName.JB]?: PaymentGateway;
        [PaymentGatewayName.PW]?: PaymentGateway;
    } | any, meta: { type: string, sessionId: string }) {
        // Handle based on the specified type in meta
        switch (meta.type) {
            case 'operator':
                // Save active payment gateway operator data to the store
                store.dispatch(saveActivePaymentGatewayOperator(data));
                break;
            case 'brand':
                // Save active payment gateway brand data to the store
                store.dispatch(saveActivePaymentGatewayBrand(data));
                break;
            default:
                break;
        }

        // Set loading flags to false for both operator and brand data
        store.dispatch(saveLoadingActivePaymentGatewayOperator(false));
        store.dispatch(saveLoadingPaymentsGateway(false));
    }

    /**
     * Handles kyc verifications  data and updates the store accordingly.
     * @param {KycVerification[] | any} data - The kyc verifications data to be saved.
     */
    async HandleGetKycVerificationsOperator(data: KycVerification[] | any) {
        // Save the kyc verifications data to the store
        store.dispatch(saveKycVerification(data || []));

        // Set loading flag to false
        store.dispatch(saveLoadingKycVerification(false));
    }


    /**
         * Handles get Launch Reports data and updates the store accordingly.
         * @param {LaunchReportData | any} data - The get Launch Reports data to be saved.
         */
    async HandleLaunchReportData(data: LaunchReportData | any) {
        // Save the Launch Reports data to the store
        store.dispatch(saveLaunchReportData(data || {}));
        // Set loading flag to false
        store.dispatch(saveLoadingLaunchReport(false));

    }

    /**
         * Handles get Bets Currencies Report data and updates the store accordingly.
         * @param {BetsCurrenciesReportData | any} data - The Bets Currencies Report In Language data to be saved.
         */
    async HandleBetsCurrenciesReportData(data: BetsCurrenciesReportData | any) {
        // Save the bets currencies data to the store
        store.dispatch(saveBetsCurrenciesReportData(data || {}));
        // Set loading bet currencies to false
        store.dispatch(saveLoadingBetsCurrenciesReport(false));

    }

    /**
         * Handles get Bet DB Connection  data and updates the store accordingly.
         * @param {{config: string, dbName: string} | any} data - The get Bet DB Connection data to be saved.
         */
    async HandleBetDbConnectionStringData(data: {
        connectionString: string;
        dbName: string;
    } | any) {
        // Save the Bet DB Connection data to the store
        store.dispatch(saveOperatorBetConfigData(data || {}));
        store.dispatch(saveLoadingBetDBConfig(false))

    }

    /**
         * Handles get Api Authorization token  data and updates the store accordingly.
         * @param {string | any} data - The get Api Authorization token data to be saved.
         */
    async HandleGetApiAuthorizationTokenData(data: string | any) {
        // Save get Api Authorization token data to the store
        store.dispatch(saveApiAuthorizationTokenData(data || ''));

    }
    /**
     * Handles get Messages In Language  data and updates the store accordingly.
     * @param {MessagesInLanguageInBrand[] | any} data - The get Messages In Language data to be saved.
     */
    async HandleGetMessagesInLanguage(data: MessagesInLanguageInBrand | any) {
        // Save get Messages In Language data to the store
        store.dispatch(saveMessagesInLanguageInBrand(data || {}));
        // Set loading flag to false
        store.dispatch(saveLoadingMessagesInLanguageInBrand(false));

    }

    /**
     * Handles get Operator Bet Amount Limits  data and updates the store accordingly.
     * @param {BetAmountLimits | any} data - The get Operator Bet Amount Limits data to be saved.
     */
    async HandleOperatorBetAmountLimits(data: BetAmountLimits | any) {
        // Save the Operator Bet Amount Limits data to the store
        store.dispatch(saveOperatorBetAmountLimits(data || {}));
        // Set loading flag to false
        store.dispatch(saveLoadingOperatorBetAmountLimits(false));

    }

    /**
     * Handles get default bet amount limit  data and updates the store accordingly.
     * @param {BetAmountLimits | any} data - The get default bet amount limit data to be saved.
     */
    async HandleDefaultBetAmountLimits(data: BetAmountLimits | any) {
        // Save the default bet amount limit data to the store
        store.dispatch(saveDefaultBetAmountLimits(data || {}));
        // Set loading flag to false
        store.dispatch(saveLoadingDefaultBetAmountLimits(false));

    }

    /**
     * Handles get player details  data and updates the store accordingly.
     * @param {Player | any} data - The get player details data to be saved.
     * @param {{ type: string, sessionId: string }} meta - Metadata for the operation.
     */
    async HandlePlayerDetails(data: Player | any, meta: { type: string, sessionId: string }) {
        switch (meta.type) {
            case 'details':
                // Save brands list to the store
                store.dispatch(savePlayerDetails(data || {}));
                const findPendingCount: GetPlayerListFindDto = {}
                const limitPendingCount = 1
                const skipPendingCount = 0
                findPendingCount.onlyWithPendingVerification = true
                const currentBrand = store.getState().auth.currentBrand;
                const boClient = store.getState().socket.boClient;
                let brandId
                if (currentBrand && currentBrand !== 'All Brands') {
                    brandId = currentBrand
                }
                // boClient?.player.getPlayerList(
                //     {
                //         skip: skipPendingCount,
                //         limit: limitPendingCount,
                //         sort: {
                //             createdAt: -1,
                //         },
                //         find: findPendingCount,
                //         brandId,
                //         opId: data?.opId,
                //     },
                //     {
                //         uuid: uuidv4(),
                //         meta: {
                //             type: 'pendingVerification',
                //             ts: new Date(),
                //             sessionId: sessionStorage.getItem('sessionId'),
                //             event: UserPermissionEvent.BACKOFFICE_PLAYER_LIST_REQ,
                //         },
                //     }
                // )
                break;
            case 'relatedDetails':
                // Save brands to the store
                store.dispatch(saveRelatedPlayerDetails(data || {}));
                break;
            default:
                break;
        }

        // Set loading flag to false
        // store.dispatch(saveLoadingOperatorBetAmountLimits(false));

    }

    /**
     * Handles get related player data and updates the store accordingly.
     * @param {Player[] | any} data - The get related players data to be saved.
     */
    async HandleRelatedPlayers(data:
        {
            opId: string;
            relatedPlayers: {
                playerId: string;
                relatedParams: RelatedPlayersParam;
            }[]
        } | any) {
        // Save the related player data to the store
        store.dispatch(saveRelatedPlayers(data || {}));
        // Set loading flag to false
        store.dispatch(saveLoadingRelatedAccounts(false));

    }

    /**
     * Handles get Banks name data and updates the store accordingly.
     * @param {BankInfo[] | any} data - The get Banks name data to be saved.
     */
    async HandleBanksName(data:
        BankInfo[] | any) {
        // Save the Banks name data to the store
        store.dispatch(saveBanksName(data || []));
    }

    /**
     * Handles get Report configs data and updates the store accordingly.
     * @param {ReportConfig | any} data - The get Report configs data to be saved.
     */
    async HandleReportConfigs(data:
        ReportConfig | any) {
        // Save the Report configs data to the store
        store.dispatch(saveReportConfig(data || {}));
    }

    /**
     * Handles get topup currencies data and updates the store accordingly.
     * @param {string[] | any} data - The get topup currencies data to be saved.
     */
    async HandleTopupCurrencies(data:
        string[] | any) {
        // Save the topup currencies data to the store
        store.dispatch(saveTopupCurrencies(data || []));
        store.dispatch(saveLoadingTopUpCurrencies(false))
    }

    /**
     * Handles get Game V2 List data and updates the store accordingly.
     * @param {{ count: number,games: GameV2[]} | any} data - The get  Game V2 List data to be saved.
     */
    async HandleGameV2List(data: {
        count: number;
        games: GameV2[];
    } | any) {
        // Save the get Game V2 List data to the store
        store.dispatch(saveGameV2List(data || []));
        store.dispatch(saveLoadingGameV2List(false))
    }

    /**
     * Handles get Game Cores List data and updates the store accordingly.
     * @param {{ count: number,games:GameCore<any>[]} | any} data - The get Game Cores List data to be saved.
     */
    async HandleGameCoresList(data: {
        count: number;
        games: GameCore<any>[];
    } | any) {
        // Save the Game Cores List data to the store
        store.dispatch(saveGameCoresList(data || []));
        const coreIdRealtime = store.getState().auth.coreIdRealtime
        if (data.count > 0 && coreIdRealtime === '') {
            const coreListCrash = data.games.filter((item: GameCore<any>) => item.configType === ConfigType.ALIEN_CRASH)
            if (coreListCrash.length > 0) {
                store.dispatch(saveCoreIdRealTime(coreListCrash[0]?.coreId))

            }

        }
        store.dispatch(saveLoadingGameCoresList(false))
    }

    /**
     * Handles get Operator Game V2 data and updates the store accordingly.
     * @param {OperatorGameV2<any>[] | any} data - The get Operator Game V2 data to be saved.
     */
    async HandleOperatorGameV2List(data: OperatorGameV2<any>[] | any) {
        // Save the Operator Game V2 data to the store
        store.dispatch(saveOperatorGamesV2List(data || []));
        store.dispatch(saveLoadingOperatorGamesV2List(false))
    }

    /**
     * Handles get valid games V2 for operator data and updates the store accordingly.
     * @param {GameV2[] | any} data - The get valid games V2 for operator data to be saved.
     */
    async HandleGetValidGameV2ForOperators(data: GameV2[] | any) {
        // Save get valid games V2 for operator data to the store
        store.dispatch(saveValidGamesForOperatorList(data || []));
    }

    /**
     * Handles get Tournament IDs for operator data and updates the store accordingly.
     * @param {string[] | any} data - The get Tournament IDs for operator data to be saved.
     */
    async HandleGetTournamentIDs(data: string[] | any) {
        // Save get valid tournament IDs for operator data to the store
        store.dispatch(saveTournamentIDs(data || []));
        store.dispatch(saveLoadingTournamentIDs(false))
    }

    /**
     * Handles get Tournament IDs V2 for operator data and updates the store accordingly.
     * @param {string[] | any} data - The get Tournament IDs V2 for operator data to be saved.
     */
    async HandleGetTournamentV2IDs(data: string[] | any) {
        // Save get valid tournament IDs V2 for operator data to the store
        store.dispatch(saveTournamentV2IDs(data || []));
        store.dispatch(saveLoadingTournamentV2IDs(false))
    }


    /**
     * Handles get Tournament IDs for operator data and updates the store accordingly.
     * @param {string} data - The get Tournament IDs for operator data to be saved.
     */
    async HandleGetOperatorWebhookBaseURL(data: string) {
        // Save get valid tournament IDs for operator data to the store
        store.dispatch(saveWebhookBaseURL(data));
    }


    /**
     * Handles get Cashin Cashout List data and updates the store accordingly.
     * @param {{ count: number,cashinCashouts: cashinCashout[]} | any} data - The get Cashin Cashout List data to be saved.
     */
    async HandleCashinCashoutList(data: {
        count: number
        cashInCashOuts: CashInCashOut[]
    } | any) {
        // Save the get Cashin Cashout List data to the store
        store.dispatch(saveCashinCashoutList(data || []));
        store.dispatch(saveLoadingCashinCashout(false))
    }

    /**
     * Handles get Dns List data and updates the store accordingly.
     * @param {{ count: number,dnsRecords: DnsRecord[]} | any} data - The get Dns List data to be saved.
     */
    async HandleDnsRecordList(data: {
        count: number;
        dnsRecords: DnsRecord[];
    } | any) {
        // Save the get Dns List data to the store
        store.dispatch(saveDnsRecordList(data || []));
        store.dispatch(saveLoadingDnsRecordList(false))
    }

    /**
     * Handles get Dns List data and updates the store accordingly.
     * @param {{{opId: string; gameId: string; statsFileUrl: string; tournamentId: string;}[]} | any} data - The get Dns List data to be saved.
     */
    async HandleAllOperatorGamesWithTournament(data: {
        opId: string;
        gameId: string;
        statsFileUrl: string;
        tournamentId: string;
    }[] | any, meta: { type: string, sessionId: string }) {
        // Save the get Dns List data to the store
        switch (meta.type) {
            case 'all':
                store.dispatch(saveAllOperatorGamesWithTournament(data || []));
                break;
            case 'tournament':
                store.dispatch(saveAllOperatorGamesWithTournament(data || []));
                break

        }
        store.dispatch(saveLoadingOperatorsGamesListTournament(false))
    }


    /**
         * Handles get Wallet balance  data, processes and sorts it, and updates the store accordingly.
         * @param {WalletBalance | any} data - The get Wallet balance  data to be saved.
         */
    async HandleGetWalletBalance(data: WalletBalance | any) {
        // Process and sort get Wallet balance  data into an array of objects
        const dataRows = data && Object.keys(data).sort().map(
            (obj, cur) => ({
                'walletId': obj,
                ...data[obj]
            }),
            []
        );

        // Create a structured payment gateways object with count and data
        const walletBalances = {
            count: dataRows.length,
            walletBalance: dataRows
        };

        // Save the structured payment gateways data to the store
        store.dispatch(saveWalletBalance(walletBalances));

        // Set loading flag to false
        store.dispatch(saveLoadingWalletBalanceList(false));
    }


    /**
         * Handles get default core realTime Message data, processes and sorts it, and updates the store accordingly.
         * @param {{coreId: string; realtimeData: RealtimeData;} | any} data - The get default core realTime Message data to be saved.
         */
    async HandleDefaultCoreRealTimeMessage(data: {
        coreId: string;
        realtimeData: RealtimeData;
    } | any) {


        // Save the structured realtime messages data to the store
        store.dispatch(saveRealtimeMessages(data));
    }

    /**
     * Handles the logout process:
     * 1. Dispatches a logout action (assuming it's a Redux action).
     * 2. Clears cookies to log the user out.
     * 3. Resets relevant store states.
     */
    async HandleLogout() {
        // Step 1: Dispatch logout action (assuming it's a Redux action)
        store.dispatch(logout());

        // Step 2: Clear cookies to log the user out
        clearCookies();

        // Step 3: Reset relevant store states
        store.dispatch(saveCompleteInit(false));
        store.dispatch(resetSocket());
        store.dispatch(resetCrashConfig());
    }

    /**
     * Callback function for handling API responses.
     * @param {any} result - The API response object.
     * @param {(result: any) => void} successHandler - A callback function to handle a successful response.
     * @param {() => void} updateLoader - A callback function to update the loader or loading state.
     */
    handleResponse = async (result: any, successHandler: (result: any) => void, updateLoader: () => void) => {
        if (result.success) {
            // Handle a successful response using the provided successHandler
            successHandler(result);
        } else {
            // Update the loader or loading state
            updateLoader();

            // Handle the error response
            this.handleError(result);
        }
    };


    /**
     * Function to handle and display error messages from API responses.
     * @param {any} result - The API error response object.
     */
    handleError = (result: any) => {
        let message = result.message;

        // Improve error message for "Access denied"
        if (message === 'Access denied.') {
            // Provide context about the denied access event
            message = `Access denied to ${result.traceData?.meta?.event}`;
        }

        // Show an error message (e.g., using toast) with the updated message
        toast.error(message, {
            position: toast.POSITION.TOP_CENTER,
        });
    };


    /**
     * Callback function for handling responses related to financial reports.
     * @param {OnGetFinancialReportResponseParams} result - The financial report response object.
     */
    handleFinancialReportResponse = async (result: OnGetFinancialReportResponseParams) => {
        // Ensure that the session ID matches the current session
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetFinancialReportResponseParams) => {
                const traceDataMeta = result.traceData?.meta;

                // Handle the financial report data
                await this.handleFinancialReport(result, traceDataMeta);
            }, async () => {
                // Update the loading state for financial reports
                store.dispatch(saveLoadingFinancialReport(false));
            });
        }
    };

    /**
     * Callback function for handling responses related to operator lists.
     * @param {OnOperatorListResponseParams} result - The operator list response object.
     */
    handleOperatorListResponse = async (result: OnOperatorListResponseParams) => {
        // Ensure that the session ID matches the current session
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnOperatorListResponseParams) => {
                // Handle operator list data
                await this.handleOperatorList(result.data as OperatorList, result.traceData?.meta);
            }, async () => {
                // Update the loading state for operator lists
                store.dispatch(saveLoadingOperatorList(false));
            });
        }
    };

    /**
     * Callback function for handling responses related to operator details.
     * @param {OnGetOperatorResponseParams} result - The operator details response object.
     */
    handleOperatorDetailsResponse = async (result: OnGetOperatorResponseParams) => {
        // Ensure that the session ID matches the current session
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetOperatorResponseParams) => {
                // Handle operator details data
                await this.handleGetOperator(
                    result.data as Operator,
                    result.traceData?.meta
                );
            }, async () => {
                // Update the loading state for operator details
                store.dispatch(saveLoadingOperatorList(false));
            });
        }
    };

    /**
     * Callback function for handling responses related to statistics data.
     * @param {OnGetStatsResponseParams} result - The statistics data response object.
     */
    handleGetStatsResponse = async (result: OnGetStatsResponseParams) => {
        // Ensure that the session ID matches the current session
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetStatsResponseParams) => {
                // Handle statistics data
                await this.handleGetStats(result.data as Stats);
            }, async () => {
                // Update the loading state for statistics data
                store.dispatch(saveLoadingStats(false));
            });
        }
    };

    /**
     * Callback function for handling responses related to bet lists.
     * @param {OnBetListResponseParams} result - The bet list response object.
     */
    handleBetListResponse = async (result: OnBetListResponseParams) => {
        // Ensure that the session ID matches the current session
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnBetListResponseParams) => {
                // Handle bet list data
                await this.HandleGetBetsList(result.data as BetList, result.traceData?.meta);
            }, async () => {
                // Update the loading state for various bet lists
                store.dispatch(saveLoadingLatestWins(false));
                store.dispatch(saveLoadingBigLosses(false));
                store.dispatch(saveLoadingBigWins(false));
                store.dispatch(saveLoadingHighRollers(false));
                store.dispatch(saveLoadingLuckWins(false));
                store.dispatch(saveloadingBetsList(false));
            });
        }
    };

    /**
     * Callback function for handling responses related to bet details.
     * @param {OnGetBetResponseParams} result - The bet details response object.
     */
    handleBetDetailsResponse = async (result: OnGetBetResponseParams) => {
        // Ensure that the session ID matches the current session
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetBetResponseParams) => {
                // Handle bet details data
                await this.HandleGetBetDetails(result.data as Bet);
            }, async () => {
                // Update the loading state for various bet lists
            });
        }
    };

    /**
     * Callback function for handling responses related to player lists.
     * @param {OnPlayerListResponseParams} result - The player list response object.
     */
    handlePlayerListResponse = async (result: OnPlayerListResponseParams) => {
        // Ensure that the session ID matches the current session
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnPlayerListResponseParams) => {
                // Handle player list data
                await this.HandleGetPlayersList(result.data as PlayerList, result.traceData?.meta);
            }, async () => {
                // Update the loading state for player lists
                store.dispatch(saveLoadingPlayersList(false));
            });
        }
    };

    /**
     * Callback function for handling responses related to user lists.
     * @param {OnUserListResponseParams} result - The user list response object.
     */
    handleUserListResponse = async (result: OnUserListResponseParams) => {
        // Ensure that the session ID matches the current session
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnUserListResponseParams) => {
                // Handle user list data
                await this.HandleGetUsersList(result.data as UserList);
            }, async () => {
                // Update the loading state for user lists
                store.dispatch(saveLoadingUsersList(false));
            });
        }
    };

    /**
     * Callback function for handling responses related to game lists.
     * @param {OnGameListResponseParams} result - The game list response object.
     */
    handleGameListResponse = async (result: OnGameListResponseParams) => {
        // Ensure that the session ID matches the current session
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGameListResponseParams) => {
                // Handle game list data
                await this.HandleGetGamesList(result.data as GameList);
            }, async () => {
                // Update the loading state for game lists
                store.dispatch(saveLoadingGamesList(false));
            });
        }
    };

    /**
     * Callback function for handling responses related to operator game lists.
     * @param {OnOperatorGameListResponseParams} result - The operator game list response object.
     */
    handleOperatorGameListResponse = async (result: OnOperatorGameListResponseParams) => {
        // Ensure that the session ID matches the current session
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnOperatorGameListResponseParams) => {
                // Handle operator game list data
                await this.HandleGetOperatorGamesList(result.data as OperatorGame[]);
            }, async () => {
                // Update the loading state for operator game lists
                store.dispatch(saveLoadingOperatorGamesList(false));
            });
        }
    };

    /**
     * Callback function for handling responses related to roles.
     * @param {OnGetRolesResponseParams} result - The roles response object.
     */
    handleGetRolesResponse = async (result: OnGetRolesResponseParams) => {
        // Ensure that the session ID matches the current session
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetRolesResponseParams) => {
                // Handle roles data
                await this.HandleGetRolesList(result.data as Roles);
            }, async () => { });
        }
    };

    /**
     * Callback function for handling responses related to exchange rates.
     * @param {OnGetCurrenciesResponseParams} result - The exchange rates response object.
     */
    handleGetCurrenciesResponse = async (result: OnGetCurrenciesResponseParams) => {
        // Ensure that the session ID matches the current session
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetCurrenciesResponseParams) => {
                // Extract and sort exchange rates data
                const exchangeRatesData = result.data ? Object.values(result.data).sort((a: Currency, b: Currency) => {
                    const fa = a.code.toLowerCase();
                    const fb = b.code.toLowerCase();
                    if (fa < fb) {
                        return -1;
                    }
                    if (fa > fb) {
                        return 1;
                    }
                    return 0;
                }) as Currency[] : [];

                // Handle exchange rates data
                await this.HandleGetExchangeRates(exchangeRatesData);
            }, async () => { });
        }
    };


    /**
     * Callback function for handling transaction list responses.
     *
     * @param {OnTransactionListResponseParams} result - The response data.
     */
    handleGetTransactionListResponse = async (result: OnTransactionListResponseParams) => {
        // Ensure that the session ID in the response matches the current session's ID
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnTransactionListResponseParams) => {
                // Handle the transaction list data
                await this.HandleGetTransactionList(
                    result.data as TransactionList
                );
            }, async () => {
                // Dispatch an action to save loading state when there's an error
                store.dispatch(saveLoadingTransactionList(false));
            });

        }
    };

    /**
     * Callback function for handling operator transaction list responses.
     *
     * @param {OnOperatorTransactionListResponseParams} result - The response data.
     */
    handleGetOperatorTransactionListResponse = async (result: OnOperatorTransactionListResponseParams) => {
        // Ensure that the session ID in the response matches the current session's ID
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnOperatorTransactionListResponseParams) => {
                // Handle the operator transaction list data
                await this.HandleGetOperatorTransactionList(
                    result.data as {
                        count: number;
                        transactions: OperatorTransaction[];
                    }
                );
            }, async () => {
                // Dispatch an action to save loading state when there's an error
                store.dispatch(saveLoadingOperatorTransactionList(false));
            });

        }
    };

    /**
     * Callback function for handling operator game V2 responses.
     *
     * @param {OnGetOperatorGameV2ResponseParams} result - The response data.
     */
    handleGetOperatorGameV2Response = async (result: OnGetOperatorGameV2ResponseParams) => {
        // Ensure that the session ID in the response matches the current session's ID
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetOperatorGameV2ResponseParams) => {
                // Handle the operator transaction list data
                await this.HandleGetOperatorGameV2(
                    result.data as OperatorGameV2<any>
                );
            }, async () => {
                // Dispatch an action to save loading state when there's an error
                store.dispatch(saveLoadingOperatorTransactionList(false));
            });

        }
    };

    /**
     * Callback function for handling  get operator gateway currencies responses.
     *
     * @param {OnGetPaymentGatewayCurrenciesResponseParams} result - The response data.
     */
    handleGetPaymentGatewayCurrenciesResponse = async (result: OnGetPaymentGatewayCurrenciesResponseParams) => {
        // Ensure that the session ID in the response matches the current session's ID
        const sessionId = sessionStorage.getItem('sessionId');
        if (result.traceData?.meta?.sessionId === sessionId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetPaymentGatewayCurrenciesResponseParams) => {
                // Handle the  get operator gateway currencies data
                await this.HandleGetPaymentGatewayCurrencies(
                    result.data as {
                        validCurrenciesToDeposit: string[];
                        validCurrenciesToWithdraw: string[];
                    }
                );
            }, async () => {
                // Dispatch an action to save loading state when there's an error
                // store.dispatch(saveLoadingOperatorTransactionList(false));
            });

        }
    };


    /**
     * Callback function for handling operator brand list responses.
     *
     * @param {OnGetOperatorBrandsResponseParams} result - The response data.
     */
    handleGetOperatorBrandListResponse = async (result: OnGetOperatorBrandsResponseParams) => {
        // Ensure that the session ID in the response matches the current session's ID
        if (result.traceData?.meta?.sessionId !== sessionStorage.getItem('sessionId')) {
            return; // Session ID mismatch, exit early
        }

        // Handle the response using the common response handler
        await this.handleResponse(result, async (result: OnGetOperatorBrandsResponseParams) => {
            // Handle operator brand list data
            if (result.data) {
                await this.handleGetBrands(
                    result.data as Brand[],
                    result.traceData?.meta
                );
            } else {
                store.dispatch(saveLoadingBrandList(false))
                store.dispatch(saveBrandsList([]));
                store.dispatch(saveBrands([]));
            }

        }, async () => {
            // Handle any errors or additional logic when needed
        });
    };

    /**
     * Callback function for handling responses related to used currencies.
     *
     * @param {OnGetUsedCurrenciesResponseParams} result - The response data.
     */
    handleGetUsedCurrenciesResponse = async (result: OnGetUsedCurrenciesResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetUsedCurrenciesResponseParams) => {
                // Handle used currencies data
                await this.handleGetCurrencies(
                    result.data as string[],
                    result.traceData?.meta
                )
            }, async () => {
                // Handle any errors or additional logic when needed
            });
        }
    };

    /**
     * Callback function for handling player activity list responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the player activity list data.
     *
     * @param {OnPlayerActivityListResponseParams} result - The response data received.
     */
    handlePlayerActivityListResponse = async (result: OnPlayerActivityListResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnPlayerActivityListResponseParams) => {
                // Handle player activity list data
                await this.HandleGetPlayerActivitiesList(
                    result.data as PlayerActivityList
                )
            }, async () => {
                // Dispatch an action to save loading state when there's an error
                store.dispatch(saveLoadingPlayerActivites(false));
            });

        }
    };

    /**
     * Callback function for handling get user details responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the get user details data.
     *
     * @param {OnGetUserResponseParams} result - The response data received.
     */
    handleGetUserResponse = async (result: OnGetUserResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetUserResponseParams) => {
                // Handle get user details data
                if (result.data) {
                    await this.HandleGetUserDetails(
                        result.data as User,
                        result.traceData?.meta
                    )
                }
            }, async () => {
                // Handle any errors or additional logic when needed
            });

        }
    };


    /**
     * Callback function for handling get user UI state responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the UI state data.
     *
     * @param {OnGetUiStateResponseParams} result - The response data received.
     */
    handleGetUiStateResponse = async (result: OnGetUiStateResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetUiStateResponseParams) => {
                // Handle get user ui data
                await this.HandleGetUiStats(
                    result.data as any
                )
            }, async () => {
                // Handle any errors or additional logic when needed
            });

        }
    };

    /**
     * Callback function for handling get permissions responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the permissions data.
     *
     * @param {OnGetPermissionsResponseParams} result - The response data received.
     */
    handleGetPermissionsResponse = async (result: OnGetPermissionsResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetPermissionsResponseParams) => {
                // Handle get permissions data
                await this.handlePermissions(
                    result.data as Record<UserPermissionEvent, UserPermission>
                )
            }, async () => {
                // Handle any errors or additional logic when needed
            });

        }
    };

    /**
     * Callback function for handling get user activity list responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the user activity list data.
     *
     * @param {OnUserActivityListResponseParams} result - The response data received.
     */
    handleUserActivityListResponse = async (result: OnUserActivityListResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnUserActivityListResponseParams) => {
                // Handle get user activity list data
                await this.HandleGetUserActivitiesList(
                    result.data as UserActivityList
                )
            }, async () => {
                store.dispatch(saveLoadingUserAcitivites(false))
            });

        }
    };

    /**
     * Callback function for handling get operator config responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the operator config data.
     *
     * @param {OnGetOperatorConfigResponseParams} result - The response data received.
     */
    handleGetOperatorConfigResponse = async (result: OnGetOperatorConfigResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetOperatorConfigResponseParams) => {
                // Handle get operator config  data
                await this.HandleGetOperatorConfigs(
                    result.data as OperatorConfig
                )
            }, async () => {
                // Handle any errors or additional logic when needed
            });

        }
    };

    /**
     * Callback function for handling get operator game responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the operator game data.
     *
     * @param {OnGetOperatorGameResponseParams} result - The response data received.
     */
    handleGetOperatorGameResponse = async (result: OnGetOperatorGameResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetOperatorGameResponseParams) => {
                // Handle get operator game  data
                await this.HandleGetOperatorGameConfigs(
                    result.data as OperatorGame
                )
            }, async () => {
                // Handle any errors or additional logic when needed
            });

        }
    };

    /**
     * Callback function for handling get webhook list responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the webhook list data.
     *
     * @param {OnGetWebhookLogListResponseParams} result - The response data received.
     */
    handleGetWebhookLogListResponse = async (result: OnGetWebhookLogListResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetWebhookLogListResponseParams) => {
                // Handle get webhook list  data
                await this.HandleGetWebhookList(
                    result.data as {
                        webhookLogList: WebhookLog[]
                        count: number
                    }
                )
            }, async () => {
                store.dispatch(saveLoadingWebhookList(false))
                store.dispatch(saveWebhookList({ webhookLogList: [], count: 0 }))
            });

        }
    };

    /**
     * Callback function for handling get webhook list responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the webhook list data.
     *
     * @param {OnGetAuthLogListResponseParams} result - The response data received.
     */
    handleGetAuthLogListResponse = async (result: OnGetAuthLogListResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetAuthLogListResponseParams) => {
                // Handle get webhook list  data
                await this.HandleGetAuthList(
                    result.data as {
                        authLogList: AuthLog[]
                        count: number
                    }
                )
            }, async () => {
                store.dispatch(saveLoadingAuthLogsList(false))
                store.dispatch(saveAuthList({ authLogList: [], count: 0 }))
            });

        }
    };

    /**
     * Callback function for handling get webhook list responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the webhook list data.
     *
     * @param {OnGetLaunchLogListResponseParams} result - The response data received.
     */
    handleGetAuthLaunchListResponse = async (result: OnGetLaunchLogListResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetLaunchLogListResponseParams) => {
                // Handle get webhook list  data
                await this.HandleGetLaunchList(
                    result.data as {
                        launchLogList: LaunchLog[]
                        count: number
                    }
                )
            }, async () => {
                store.dispatch(saveLoadingLaunchLogsList(false))
                store.dispatch(saveLaunchList({ launchLogList: [], count: 0 }))
            });

        }
    };
    /**
     * Callback function for handling get tournament list responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the tournament list data.
     *
     * @param {OnGetTournamentListResponseParams} result - The response data received.
     */
    handleGetTournamentListResponse = async (result: OnGetTournamentListResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetTournamentListResponseParams) => {
                // Handle get tournament list  data
                await this.HandleGetTournament(
                    result.data as TournamentList
                )
            }, async () => {
                store.dispatch(saveLoadingTournament(false))
            });

        }
    };

    /**
     * Callback function for handling get tournament V2 list responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the tournament V2 list data.
     *
     * @param {OnGetTournamentV2ListResponseParams} result - The response data received.
     */
    handleGetTournamentV2ListResponse = async (result: OnGetTournamentV2ListResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetTournamentV2ListResponseParams) => {
                // Handle get tournament list  data
                await this.HandleGetTournamentV2(
                    result.data as TournamentV2List
                )
            }, async () => {
                store.dispatch(saveLoadingTournamentV2(false))
            });

        }
    };

    /**
     * Callback function for handling get tournament V2  responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the tournament V2  data.
     *
     * @param {OnGetTournamentV2ResponseParams} result - The response data received.
     */
    handleGetTournamentV2Response = async (result: OnGetTournamentV2ResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetTournamentV2ResponseParams) => {
                // Handle get tournament V2  data
                await this.HandleGetTournamentV2Details(
                    result.data as TournamentV2
                )
            }, async () => {
                store.dispatch(saveLoadingTournamentV2Details(false))
            });

        }
    };

    /**
     * Callback function for handling get payment gateways responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the payment gateways data.
     *
     * @param {OnGetPaymentGatewaysResponseParams} result - The response data received.
     */
    handleGetPaymentGatewaysResponse = async (result: OnGetPaymentGatewaysResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetPaymentGatewaysResponseParams) => {
                // Handle get payment gateways  data
                await this.HandleGetPaymentsGateway(
                    result.data as PaymentGateways
                )
            }, async () => {
                store.dispatch(saveLoadingPaymentsGateway(false))
            });

        }
    };

    /**
     * Callback function for handling get Payment PW gateway responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the Payment PW gateway data.
     *
     * @param {OnGetPwPaymentGatewayResponseParams} result - The response data received.
     */
    handleGetPwPaymentGatewayResponse = async (result: OnGetPwPaymentGatewayResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetPwPaymentGatewayResponseParams) => {
                // Handle get payment pw gateway  data
                await this.HandleGetPaymentGatewayOperator(
                    result.data as PwPaymentGateway
                )
            }, async () => {
                store.dispatch(saveLoadingPaymentGatewayOperator(false))
            });

        }
    };

    /**
     * Callback function for handling get Payment JB gateway responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the Payment JB gateway data.
     *
     * @param {OnGetJbPaymentGatewayResponseParams} result - The response data received.
     */
    handleGetJbPaymentGatewayResponse = async (result: OnGetJbPaymentGatewayResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetJbPaymentGatewayResponseParams) => {
                // Handle get payment jb gateway  data
                await this.HandleGetPaymentJBGatewayOperator(
                    result.data as JbPaymentGateway
                )
            }, async () => {
                store.dispatch(saveLoadingPaymentGatewayOperator(false))
            });

        }
    };

    /**
     * Callback function for handling get Payment CPG gateway responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the Payment CPG gateway data.
     *
     * @param {OnGetCpgPaymentGatewayResponseParams} result - The response data received.
     */
    handleGetCpgPaymentGatewayResponse = async (result: OnGetCpgPaymentGatewayResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetCpgPaymentGatewayResponseParams) => {
                // Handle get payment cpg gateway  data
                await this.HandleGetPaymenCPGGatewayOperator(
                    result.data as CpgPaymentGateway
                )
            }, async () => {
                store.dispatch(saveLoadingPaymentGatewayOperator(false))
            });

        }
    };

    /**
     * Callback function for handling get active payment gateways responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the active payment gateways data.
     *
     * @param {OnGetActivePaymentGatewaysResponseParams} result - The response data received.
     */
    handleGetActivePaymentGatewaysResponse = async (result: OnGetActivePaymentGatewaysResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetActivePaymentGatewaysResponseParams) => {
                // Handle get active payment gateways  data

                await this.HandleGetActivePaymentGatewayOperator(
                    result.data as {
                        [PaymentGatewayName.CPG]?: PaymentGateway
                        [PaymentGatewayName.JB]?: PaymentGateway
                        [PaymentGatewayName.PW]?: PaymentGateway
                    },
                    result.traceData?.meta
                )
            }, async () => {
                store.dispatch(saveLoadingActivePaymentGatewayOperator(false))
                store.dispatch(saveLoadingPaymentsGateway(false))
            });

        }
    };

    /**
     * Callback function for handling set active payment gateways responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles the set active payment gateways data.
     *
     * @param {OnSetActivePaymentGatewaysResponseParams} result - The response data received.
     */
    handleSetActivePaymentGatewaysResponse = async (result: OnSetActivePaymentGatewaysResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: any) => {
                // Handle set active payment gateways  data
                toast.success('You updated payment gateways successfully', {
                    position: toast.POSITION.TOP_CENTER,
                })
                await this.HandleGetActivePaymentGatewayOperator(
                    result.data as {
                        [PaymentGatewayName.CPG]?: PaymentGateway
                        [PaymentGatewayName.JB]?: PaymentGateway
                        [PaymentGatewayName.PW]?: PaymentGateway
                    },
                    result.traceData?.meta
                )
            }, async () => {
                store.dispatch(saveLoadingActivePaymentGatewayOperator(false))
                store.dispatch(saveLoadingPaymentsGateway(false))
            });
        }
    };

    /**
     * Callback function for handling get kyc verifications responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles kyc verifications data.
     *
     * @param {OnGetKycVerificationsResponseParams} result - The response data received.
     */
    handleGetKycVerificationsResponse = async (result: OnGetKycVerificationsResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetKycVerificationsResponseParams) => {
                // Handle get get kyc verifications  data
                await this.HandleGetKycVerificationsOperator(
                    result.data as KycVerification[]
                )
            }, async () => {
                store.dispatch(saveLoadingKycVerification(false))
            });

        }
    };

    /**
     * Callback function for handling get Messages In Language responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles Messages In Language data.
     *
     * @param {OnGetKycVerificationsResponseParams} result - The response data received.
     */
    handleGetMessagesInLanguageResponse = async (result: OnGetMessagesInLanguageResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetMessagesInLanguageResponseParams) => {
                // Handle get Messages In Language  data
                await this.HandleGetMessagesInLanguage(
                    result.data as MessagesInLanguageInBrand
                )
            }, async () => {
                store.dispatch(saveLoadingMessagesInLanguageInBrand(false))
            });

        }
    };

    /**
     * Callback function for handling get operator bet amount limits responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get operator bet amount limits data.
     *
     * @param {OnGetOperatorBetAmountLimitsResponseParams} result - The response data received.
     */
    handleGetOperatorBetAmountLimitsResponse = async (result: OnGetOperatorBetAmountLimitsResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetOperatorBetAmountLimitsResponseParams) => {
                // Handle get get operator bet amount limits  data
                await this.HandleOperatorBetAmountLimits(
                    result.data as BetAmountLimits
                )
            }, async () => {
                store.dispatch(saveLoadingOperatorBetAmountLimits(false))
            });

        }
    };

    /**
     * Callback function for handling get default bet amount limits responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get default bet amount limits data.
     *
     * @param {OnGetOperatorDefaultBetAmountLimitsResponseParams} result - The response data received.
     */
    handleGetDefaultBetAmountLimitsResponse = async (result: OnGetOperatorDefaultBetAmountLimitsResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetOperatorDefaultBetAmountLimitsResponseParams) => {
                // Handle get get operator bet amount limits  data
                await this.HandleDefaultBetAmountLimits(
                    result.data as BetAmountLimits
                )
            }, async () => {
                store.dispatch(saveLoadingDefaultBetAmountLimits(false))
            });

        }
    };
    /**
     * Callback function for handling get operator bet amount limits responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get operator bet amount limits data.
     *
     * @param {OnGetPlayerResponseParams} result - The response data received.
     */
    handleGetPlayerResponse = async (result: OnGetPlayerResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetPlayerResponseParams) => {
                // Handle get get operator bet amount limits  data
                await this.HandlePlayerDetails(
                    result.data as Player,
                    result.traceData?.meta
                )
            }, async () => {
                // store.dispatch(saveLoadingOperatorBetAmountLimits(false))
            });

        }
    };

    /**
     * Callback function for handling get operator bet amount limits responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get operator bet amount limits data.
     *
     * @param {OnGetLaunchReportResponseParams} result - The response data received.
     */
    handleGetLaunchReportResponse = async (result: OnGetLaunchReportResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetLaunchReportResponseParams) => {
                // Handle get get operator bet amount limits  data
                await this.HandleLaunchReportData(
                    result.data as LaunchReportData,
                )
            }, async () => {
                // store.dispatch(saveLoadingOperatorBetAmountLimits(false))
            });

        }
    };

    /**
     * Callback function for handling get operator bet amount limits responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get operator bet amount limits data.
     *
     * @param {OnGetBetsCurrenciesReportResponseParams} result - The response data received.
     */
    handleGetBetsCurrenciesReportResponse = async (result: OnGetBetsCurrenciesReportResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetBetsCurrenciesReportResponseParams) => {
                // Handle get get operator bet amount limits  data
                await this.HandleBetsCurrenciesReportData(
                    result.data as BetsCurrenciesReportData,
                )
            }, async () => {
                store.dispatch(saveLoadingBetsCurrenciesReport(false))
            });

        }
    };

    /**
     * Callback function for handling get operator bet amount limits responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get operator bet amount limits data.
     *
     * @param {OnGetBetDbConfigResponseParams} result - The response data received.
     */
    handleGetBetDbConnectionStringResponse = async (result: OnGetBetDbConfigResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetBetDbConfigResponseParams) => {
                // Handle get get operator bet amount limits  data
                await this.HandleBetDbConnectionStringData(
                    result.data as {
                        connectionString: string;
                        dbName: string;
                    },
                )
            }, async () => {
                store.dispatch(saveLoadingBetDBConfig(false))
            });

        }
    };

    /**
     * Callback function for handling get operator bet amount limits responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get operator bet amount limits data.
     *
     * @param {OnGetApiAuthorizationTokenResponseParams} result - The response data received.
     */
    handleGetApiAuthorizationTokenResponse = async (result: OnGetApiAuthorizationTokenResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetApiAuthorizationTokenResponseParams) => {
                // Handle get get operator bet amount limits  data
                await this.HandleGetApiAuthorizationTokenData(
                    result.data as string,
                )
            }, async () => {
            });

        }
    };


    /**
     * Callback function for handling get retlated players responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get retlated players data.
     *
     * @param {OnGetRelatedPlayersResponseParams} result - The response data received.
     */
    handleGetRelatedPlayerResponse = async (result: OnGetRelatedPlayersResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetRelatedPlayersResponseParams) => {
                // Handle get retlated players  data
                await this.HandleRelatedPlayers(
                    result.data?.relatedPlayers
                )
            }, async () => {
                store.dispatch(saveLoadingRelatedAccounts(false))
            });

        }
    };

    /**
     * Callback function for handling get bank names responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get bank names data.
     *
     * @param {OnGetBanksResponseParams} result - The response data received.
     */
    handleGetBanksResponse = async (result: OnGetBanksResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetBanksResponseParams) => {
                // Handle get bank names  data
                await this.HandleBanksName(
                    result.data
                )
            }, async () => {
            });

        }
    };

    /**
     * Callback function for handling get report configs responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get report configs data.
     *
     * @param {OnGetReportConfigResponseParams} result - The response data received.
     */
    handleGetReportConfigResponse = async (result: OnGetReportConfigResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetReportConfigResponseParams) => {
                // Handle get report configs  data
                await this.HandleReportConfigs(
                    result.data
                )
            }, async () => {
            });

        }
    };

    /**
     * Callback function for handling get topup currencies responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get topup currencies data.
     *
     * @param {OnGetTopupCurrenciesResponseParams} result - The response data received.
     */
    handleGetTopupCurrenciesResponse = async (result: OnGetTopupCurrenciesResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetTopupCurrenciesResponseParams) => {
                // Handle get topup currencies  data
                await this.HandleTopupCurrencies(
                    result.data
                )
            }, async () => {
                store.dispatch(saveLoadingTopUpCurrencies(false))
            });

        }
    };

    /**
     * Callback function for handling get games V2 responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get games V2 data.
     *
     * @param {OnGameV2ListResponseParams} result - The response data received.
     */
    handleGameV2ListResponse = async (result: OnGameV2ListResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGameV2ListResponseParams) => {
                // Handle get games V2  data
                await this.HandleGameV2List(
                    result.data
                )
            }, async () => {
                store.dispatch(saveLoadingGameV2List(false))
            });

        }
    };


    /**
     * Callback function for handling get games V2 responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get games V2 data.
     *
     * @param {OnGameCoreListResponseParams} result - The response data received.
     */
    handleGameCoresListResponse = async (result: OnGameCoreListResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGameCoreListResponseParams) => {
                // Handle get games V2  data
                await this.HandleGameCoresList(
                    result.data
                )
            }, async () => {
                store.dispatch(saveLoadingGameCoresList(false))
            });

        }
    };

    /**
     * Callback function for handling get operator games V2 responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get operator games V2 data.
     *
     * @param {OnOperatorGameV2ListResponseParams} result - The response data received.
     */
    handleOperatorGameV2ListResponse = async (result: OnOperatorGameV2ListResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnOperatorGameV2ListResponseParams) => {
                // Handle get operator games V2  data
                await this.HandleOperatorGameV2List(
                    result.data
                )
            }, async () => {
                store.dispatch(saveLoadingOperatorGamesV2List(false))
            });

        }
    };

    /**
     * Callback function for handling get valid games V2 for operator responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get valid games V2 for operator data.
     *
     * @param {OnGetValidGamesForOperatorResponseParams} result - The response data received.
     */
    handleGetValidGamesForOperatorResponse = async (result: OnGetValidGamesForOperatorResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetValidGamesForOperatorResponseParams) => {
                // Handle get valid games V2 for operator  data
                await this.HandleGetValidGameV2ForOperators(
                    result.data
                )
            }, async () => {
            });

        }
    };

    /**
     * Callback function for handling get Tournament IDs for operator responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get Tournament IDs for operator data.
     *
     * @param {OnGetTournamentIdsResponseParams} result - The response data received.
     */
    handleGetTournamentIdsResponse = async (result: OnGetTournamentIdsResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetTournamentIdsResponseParams) => {
                // Handle get Tournament IDs for operator  data
                await this.HandleGetTournamentIDs(
                    result.data
                )
            }, async () => {
                store.dispatch(saveLoadingTournamentIDs(false))
            });

        }
    };

    /**
     * Callback function for handling get Tournament IDs V2 for operator responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get Tournament IDs V2 for operator data.
     *
     * @param {OnGetTournamentV2IdsResponseParams} result - The response data received.
     */
    handleGetTournamentV2IdsResponse = async (result: OnGetTournamentV2IdsResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetTournamentV2IdsResponseParams) => {
                // Handle get Tournament IDs for operator  data
                await this.HandleGetTournamentV2IDs(
                    result.data
                )
            }, async () => {
                store.dispatch(saveLoadingTournamentV2IDs(false))
            });

        }
    };

    /**
     * Callback function for handling get Webhook Base URL for operator responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get Tournament IDs for operator data.
     *
     * @param {OnGetOperatorWebhookBaseUrlResponseParams} result - The response data received.
     */
    handleGetOperatorWebhookBaseURLResponse = async (result: OnGetOperatorWebhookBaseUrlResponseParams) => {
        // Ensure that the session ID matches the current session

        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetOperatorWebhookBaseUrlResponseParams) => {
                // Handle get Tournament IDs for operator  data
                await this.HandleGetOperatorWebhookBaseURL(
                    result.data || ''
                )
            }, async () => {
            });

        }
    };

    /**
     * Callback function for handling get Wallet balance responses.
     * This function ensures that the session ID matches the current session and then
     * handles the response using the common response handler.
     * It then processes and handles get Wallet balance data.
     *
     * @param {OnGetWalletBalanceResponseParams} result - The response data received.
     */
    handleGetWalletBalanceResponse = async (result: OnGetWalletBalanceResponseParams) => {
        // Ensure that the session ID matches the current session

        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {

            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetWalletBalanceResponseParams) => {
                // Handle get Wallet balance  data
                await this.HandleGetWalletBalance(
                    result.data || ''
                )
            }, async () => {
            });

        }
    };

    /**
         * Callback function for handling get default bet amount limits responses.
         * This function ensures that the session ID matches the current session and then
         * handles the response using the common response handler.
         * It then processes and handles get default bet amount limits data.
         *
         * @param {OnGameCoreRealtimeMessageParams} result - The response data received.
         */
    handleGetGameCoreRealtimeMessageResponse = async (result: OnGameCoreRealtimeMessageParams) => {
        // Ensure that the session ID matches the current session
        const coreId = store.getState().auth.coreIdRealtime
        if (result?.data?.coreId === coreId) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGameCoreRealtimeMessageParams) => {
                // Handle get get operator bet amount limits  data
                await this.HandleDefaultCoreRealTimeMessage(
                    result.data as {
                        coreId: string;
                        realtimeData: RealtimeData;
                    }
                )
            }, async () => {
                // store.dispatch(saveLoadingDefaultBetAmountLimits(false))
            });

        }
    };

    /**
         * Callback function for handling get default cashin & cashout responses.
         * This function ensures that the session ID matches the current session and then
         * handles the response using the common response handler.
         * It then processes and handles get cashin & cashout data.
         *
         * @param {OnCashinCashoutListResponseParams} result - The response data received.
         */
    handleGetCashinCashoutListResponse = async (result: OnCashInCashOutListResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnCashInCashOutListResponseParams) => {
                // Handle get get operator bet amount limits  data
                await this.HandleCashinCashoutList(
                    result.data as {
                        count: number;
                        cashInCashOuts: CashInCashOut[];
                    }
                )
            }, async () => {
                store.dispatch(saveLoadingCashinCashout(false))
            });

        }
    };

    /**
         * Callback function for handling get default cashin & cashout responses.
         * This function ensures that the session ID matches the current session and then
         * handles the response using the common response handler.
         * It then processes and handles get cashin & cashout data.
         *
         * @param {OnDnsRecordListResponseParams} result - The response data received.
         */
    handleGetDnsRecordListResponse = async (result: OnDnsRecordListResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnDnsRecordListResponseParams) => {
                // Handle get get operator bet amount limits  data
                await this.HandleDnsRecordList(
                    result.data as {
                        count: number;
                        dnsRecords: DnsRecord[];
                    }
                )
            }, async () => {
                store.dispatch(saveLoadingDnsRecordList(false))
            });

        }
    };

    /**
         * Callback function for handling get all operators and games list responses.
         * This function ensures that the session ID matches the current session and then
         * handles the response using the common response handler.
         * It then processes and handles get all operators and games data.
         *
         * @param {OnGetAllOperatorGamesWithTournamentV2ResponseParams} result - The response data received.
         */
    handleGetAllOperatorGamesWithTournamentResponse = async (result: OnGetAllOperatorGamesWithTournamentV2ResponseParams) => {
        // Ensure that the session ID matches the current session
        if (result.traceData?.meta?.sessionId === sessionStorage.getItem('sessionId')) {
            // Handle the response using the common response handler
            await this.handleResponse(result, async (result: OnGetAllOperatorGamesWithTournamentV2ResponseParams) => {
                // Handle get get operator bet amount limits  data
                await this.HandleAllOperatorGamesWithTournament(
                    result.data as {
                        opId: string;
                        gameId: string;
                        statsFileUrl: string;
                        tournamentId: string;
                    }[],
                    result.traceData?.meta
                )
            }, async () => {
                store.dispatch(saveLoadingOperatorsGamesListTournament(false))
            });

        }
    };

}


