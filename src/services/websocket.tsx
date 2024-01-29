import {
   AlienBackofficeClient,
   InitInfo,
   Notification,
} from '@alienbackoffice/back-front'
import { saveSocket } from 'redux/socketSlice'
import { store } from 'redux/store'
import { getCookie } from 'typescript-cookie'
import { isValidToken } from 'utils/jwt'
import { v4 as uuidv4 } from 'uuid'
import { EventsHandler } from './eventsHandler'
import { redirectToLogin } from './helper'
import { saveStartCoreMessage } from 'redux/authSlice'

const boClient = new AlienBackofficeClient()
const eventHandler = new EventsHandler()

let TIME_OFFLINE: number = 0
let CURR_INTERVAL: number = 0
let IS_APP_HIDDEN = false
let SOCKET_RESPONSE = true
let ERROR_RESPONSE = false
const VISIBILITY_VISIBLE = 'visible'
const VISIBILITY_HIDDEN = 'hidden'
const MAX_TIME_OFFLINE = 3

/**
 * Event handler for WebSocket messages.
 * @param {string} url - The WebSocket URL.
 */
export const eventMessage = async (url: string) => {
   // Handle socket open event
   boClient.onOpen(async () => {
      console.log('Socket is opened.')
   })

   // Handle socket error event
   boClient.onError(async (event: ErrorEvent) => {
      console.log('Error:', event)
      ERROR_RESPONSE = true
   })

   // Handle socket close event
   boClient.onClose(async () => {
      // Call a function to handle the socket close event
      handleSocketClose()
   })

   // Handle socket initialization event
   boClient.onInit(async (initInfo: InitInfo) => {
      // Dispatch the socket information to the store
      store.dispatch(saveSocket(boClient))

      // Handle user information asynchronously
      await eventHandler.handleInforUser(initInfo)

      // Set up a ping interval for the WebSocket
      CURR_INTERVAL = window.setInterval(socketPing, 30000)
   })

   // Event handler for WebSocket pong responses
   boClient.onPong(async (pongResult) => {
      // Reset the socket response flag
      SOCKET_RESPONSE = true
      // Check if the document is in the 'visible' state, the app is not hidden,
      // and the pong response was not successful
      if (
         document.visibilityState === VISIBILITY_VISIBLE &&
         !IS_APP_HIDDEN &&
         !pongResult.success
      ) {
         // Check if the time offline has exceeded the maximum allowed
         if (TIME_OFFLINE > MAX_TIME_OFFLINE) {
            // Disconnect the WebSocket, handle logout, clear the interval,
            // and reload the window
            boClient.disconnect()
            eventHandler.HandleLogout()
            clearInterval(CURR_INTERVAL)
            window.location.reload()
         } else {
            // Increment the time offline counter
            TIME_OFFLINE += 1
         }
         return // Early return
      }

      // If the document is in the 'hidden' state, mark the app as hidden
      if (document.visibilityState === VISIBILITY_HIDDEN) {
         IS_APP_HIDDEN = true
      }
   })

   // Connect to the WebSocket with auto-reconnect
   boClient.connect(url, { autoReconnect: true })

   // Handle socket notifications
   boClient.onNotification(async (notification: Notification) => {
      eventHandler.notifications(notification)
   })

   // Register a callback for handling financial report responses
   boClient.report.onGetFinancialReportResponse(
      eventHandler.handleFinancialReportResponse
   )

   // Register a callback for handling operator list responses
   boClient.operator.onOperatorListResponse(async (result) => {
      eventHandler.handleOperatorListResponse(result)
   })

   // Register a callback for handling operator detail responses
   boClient.operator.onGetOperatorResponse(async (result) => {
      eventHandler.handleOperatorDetailsResponse(result)
   })

   // Register a callback for handling stats responses
   boClient.report.onGetStatsResponse(async (result) => {
      eventHandler.handleGetStatsResponse(result)
   })

   // Register a callback for handling bets list responses
   boClient.bet.onBetListResponse(async (result) => {
      eventHandler.handleBetListResponse(result)
   })

   
   // Register a callback for handling bets list responses
   boClient.bet.onGetBetResponse(async (result) => {
      eventHandler.handleBetDetailsResponse(result)
   })

   // Register a callback for handling player list responses
   boClient.player.onPlayerListResponse(async (result) => {
      eventHandler.handlePlayerListResponse(result)
   })

   // Register a callback for handling user list responses
   boClient.user.onUserListResponse(async (result) => {
      eventHandler.handleUserListResponse(result)
   })

   // Register a callback for handling game list responses
   boClient.game.onGameListResponse(async (result) => {
      eventHandler.handleGameListResponse(result)
   })

   // Register a callback for handling operator game list responses
   boClient.operator.onOperatorGameListResponse(async (result) => {
      eventHandler.handleOperatorGameListResponse(result)
   })

   // Register a callback for handling get roles responses
   boClient.user.onGetRolesResponse(async (result) => {
      eventHandler.handleGetRolesResponse(result)
   })

   // Register a callback for handling get exchange rates responses
   boClient.onGetCurrenciesResponse(async (result) => {
      eventHandler.handleGetCurrenciesResponse(result)
   })

   // Register a callback for handling get transaction list responses
   boClient.wallet.onTransactionListResponse(async (result) => {
      eventHandler.handleGetTransactionListResponse(result)
   })

   // Register a callback for handling get operator brands list responses
   boClient.operator.onGetOperatorBrandsResponse(async (result) => {
      eventHandler.handleGetOperatorBrandListResponse(result)
   })

   // Register a callback for handling get used currencies responses
   boClient.operator.onGetUsedCurrenciesResponse(async (result) => {
      eventHandler.handleGetUsedCurrenciesResponse(result)
   })

   // Register a callback for handling get player activity list responses
   boClient.player.onPlayerActivityListResponse(async (result) => {
      eventHandler.handlePlayerActivityListResponse(result)
   })

   // Register a callback for handling get user details responses
   boClient.user.onGetUserResponse(async (result) => {
      eventHandler.handleGetUserResponse(result)
   })

   // Register a callback for handling get user ui responses
   boClient.user.onGetUiStateResponse(async (result) => {
      eventHandler.handleGetUiStateResponse(result)
   })

   // Register a callback for handling get permissions responses
   boClient.user.onGetPermissionsResponse(async (result) => {
      eventHandler.handleGetPermissionsResponse(result)
   })

   // Register a callback for handling get user activity list responses
   boClient.user.onUserActivityListResponse(async (result) => {
      eventHandler.handleUserActivityListResponse(result)
   })

   // Register a callback for handling get operator config responses
   boClient.operator.onGetOperatorConfigResponse(async (result) => {
      eventHandler.handleGetOperatorConfigResponse(result)
   })

   // Register a callback for handling get operator game responses
   boClient.operator.onGetOperatorGameResponse(async (result) => {
      eventHandler.handleGetOperatorGameResponse(result)
   })

   // Register a callback for handling get webhook list responses
   boClient.operator.onGetWebhookLogListResponse(async (result) => {
      eventHandler.handleGetWebhookLogListResponse(result)
   })

   // Register a callback for handling get Auth Log list responses
   boClient.operator.onGetAuthLogListResponse(async (result) => {
      eventHandler.handleGetAuthLogListResponse(result)
   })

   // Register a callback for handling get lauch log list responses
   boClient.operator.onGetLaunchLogListResponse(async (result) => {
      eventHandler.handleGetAuthLaunchListResponse(result)
   })

   // Register a callback for handling get tournament list responses
   boClient.tournament.onGetTournamentListResponse(async (result) => {
      eventHandler.handleGetTournamentListResponse(result)
   })

   // Register a callback for handling get tournament V2 list responses
   boClient.tournamentV2.onGetTournamentListResponse(async (result) => {
      eventHandler.handleGetTournamentV2ListResponse(result)
   })

   // Register a callback for handling get tournament V2 responses
   boClient.tournamentV2.onGetTournamentResponse(async (result) => {
      eventHandler.handleGetTournamentV2Response(result)
   })

   // Register a callback for handling get payment gateways responses
   boClient.wallet.onGetPaymentGatewaysResponse(async (result) => {
      eventHandler.handleGetPaymentGatewaysResponse(result)
   })

   // Register a callback for handling get pw payment gateway responses
   boClient.operator.onGetPwPaymentGatewayResponse(async (result) => {
      eventHandler.handleGetPwPaymentGatewayResponse(result)
   })

   // Register a callback for handling get jb payment gateway responses
   boClient.operator.onGetJbPaymentGatewayResponse(async (result) => {
      eventHandler.handleGetJbPaymentGatewayResponse(result)
   })

   // Register a callback for handling get cpg payment gateway responses
   boClient.operator.onGetCpgPaymentGatewayResponse(async (result) => {
      eventHandler.handleGetCpgPaymentGatewayResponse(result)
   })

   // Register a callback for handling get active payment gateways responses
   boClient.operator.onGetActivePaymentGatewaysResponse(async (result) => {
      eventHandler.handleGetActivePaymentGatewaysResponse(result)
   })

   // Register a callback for handling set active payment gateways responses
   boClient.operator.onSetActivePaymentGatewaysResponse(async (result) => {
      eventHandler.handleSetActivePaymentGatewaysResponse(result)
   })

   // Register a callback for handling get kyc verifications responses
   boClient.operator.onGetKycVerificationsResponse(async (result) => {
      eventHandler.handleGetKycVerificationsResponse(result)
   })

   // Register a callback for handling get Messages In Language responses
   boClient.operator.onGetMessagesInLanguageResponse(async (result) => {
      eventHandler.handleGetMessagesInLanguageResponse(result)
   })

   // Register a callback for handling get operator bet amount limits responses
   boClient.operator.onGetOperatorBetAmountLimitsResponse(async (result) => {
      eventHandler.handleGetOperatorBetAmountLimitsResponse(result)
   })

   // Register a callback for handling get player details responses
   boClient.player.onGetPlayerResponse(async (result) => {
      eventHandler.handleGetPlayerResponse(result)
   })

   // Register a callback for handling get retlated players data responses
   boClient.player.onGetRelatedPlayersResponse(async (result) => {
      eventHandler.handleGetRelatedPlayerResponse(result)
   })

   // Register a callback for handling get bank names data responses
   boClient.onGetBanksResponse(async (result) => {
      eventHandler.handleGetBanksResponse(result)
   })

   // Register a callback for handling get report config data responses
   boClient.report.onGetReportConfigResponse(async (result) => {
      eventHandler.handleGetReportConfigResponse(result)
   })

   // Register a callback for handling get top up currencies data responses
   boClient.operator.onGetTopupCurrenciesResponse(async (result) => {
      eventHandler.handleGetTopupCurrenciesResponse(result)
   })

   // Register a callback for handling get games V2 list data responses
   boClient.gameV2.onGameListResponse(async (result) => {
      eventHandler.handleGameV2ListResponse(result)
   })

   // Register a callback for handling get game core list data responses
   boClient.gameCore.onGameCoreListResponse(async (result) => {
      eventHandler.handleGameCoresListResponse(result)
   })
   // Register a callback for handling get Operator games V2 data responses
   boClient.operator.onOperatorGameV2ListResponse(async (result) => {
      eventHandler.handleOperatorGameV2ListResponse(result)
   })

   // Register a callback for handling get valid games V2 for operator data responses
   boClient.gameV2.onGetValidGamesForOperatorResponse(async (result) => {
      eventHandler.handleGetValidGamesForOperatorResponse(result)
   })
   // Register a callback for handling get tournament Ids data responses
   boClient.tournament.onGetTournamentIdsResponse(async (result) => {
      eventHandler.handleGetTournamentIdsResponse(result)
   })

   // Register a callback for handling get valid Tournament IDs V2 for operator data responses
   boClient.tournamentV2.onGetTournamentIdsResponse(async (result) => {
      eventHandler.handleGetTournamentV2IdsResponse(result)
   })
   // Register a callback for handling get webhook base url for operator data responses
   boClient.operator.onGetOperatorWebhookBaseUrlResponse(async (result) => {
      eventHandler.handleGetOperatorWebhookBaseURLResponse(result)
   })

   // Register a callback for handling set webhook base url for operator data responses
   boClient?.operator?.onSetOperatorWebhookBaseUrlResponse(async (result) => {
      eventHandler.handleGetOperatorWebhookBaseURLResponse(result)
   })

   // Register a callback for handling get wallet balance data responses
   boClient?.wallet?.onGetWalletBalanceResponse(async (result) => {
      eventHandler.handleGetWalletBalanceResponse(result)
   })

   // Register a callback for handling get operator transaction list responses
   boClient.wallet.onOperatorTransactionListResponse(async (result) => {
      eventHandler.handleGetOperatorTransactionListResponse(result)
   })

   // Register a callback for handling get operator game V2 responses
   boClient.operator.onGetOperatorGameV2Response(async (result) => {
      eventHandler.handleGetOperatorGameV2Response(result)
   })

   // Register a callback for handling get operator gateway currencies responses
   boClient.operator.onGetPaymentGatewayCurrenciesResponse(async (result) => {
      eventHandler.handleGetPaymentGatewayCurrenciesResponse(result)
   })

   // Register a callback for handling get launch reports responses
   boClient.report.onGetLaunchReportResponse(async (result) => {
      eventHandler.handleGetLaunchReportResponse(result)
   })

   // Register a callback for handling get currencies report responses
   boClient.report.onGetBetsCurrenciesReportResponse(async (result) => {
      eventHandler.handleGetBetsCurrenciesReportResponse(result)
   })

   // Register a callback for handling get Bet DB Connection responses
   boClient.operator.onGetBetDbConfigResponse(async (result) => {
      eventHandler.handleGetBetDbConnectionStringResponse(result)
   })

   // Register a callback for handling get api authorization token responses
   boClient.operator.onGetApiAuthorizationTokenResponse(async (result) => {
      eventHandler.handleGetApiAuthorizationTokenResponse(result)
   })

   // Register a callback for handling get operator default bet amount limits responses
   boClient.operator.onGetOperatorDefaultBetAmountLimitsResponse(
      async (result) => {
         eventHandler.handleGetDefaultBetAmountLimitsResponse(result)
      }
   )

   // Register a callback for handling start game core realtime responses
   boClient.gameCore.onStartGameCoreRealtimeResponse(async (result) => {
      // console.log(result)
      store.dispatch(saveStartCoreMessage(true))
   })

   // Register a callback for handling get game core realtime message responses
   boClient.gameCore.onGameCoreRealtimeMessage(async (result) => {
      // console.log(result)
      eventHandler.handleGetGameCoreRealtimeMessageResponse(result)
   })

   // Register a callback for handling stop game core realtime responses
   boClient.gameCore.onStopGameCoreRealtimeResponse(async (result) => {
      // console.log(result)
      store.dispatch(saveStartCoreMessage(false))
   })

   // Register a callback for handling cashin & Cashout responses
   boClient.cashInCashOut.onCashInCashOutListResponse(async (result) => {
      eventHandler.handleGetCashinCashoutListResponse(result)
   })

   // Register a callback for handling DNS Record List responses
   boClient.devops.onDnsRecordListResponse(async (result) => {
      eventHandler.handleGetDnsRecordListResponse(result)
   })

   // Register a callback for handling get all operators and games List for tournament responses
   boClient.tournamentV2.onGetAllOperatorGamesWithTournamentResponse(async (result) => {
      eventHandler.handleGetAllOperatorGamesWithTournamentResponse(result)
   })
}

/**
 * Closes the WebSocket, redirects to the login page, and performs cleanup.
 */
export const closeWebSocket = () => {
   // Redirect to '/auth/login' if not already on that page
   redirectToLogin()

   // Clear the interval for periodic tasks
   clearInterval(CURR_INTERVAL)

   // Delayed actions after clearing the interval
   setTimeout(() => {
      // Disconnect from the WebSocket
      boClient.disconnect()

      // Handle logout in the event handler
      eventHandler.HandleLogout()
   }, 500)
}

/**
 * Function to ping the socket.
 */
function socketPing() {
   // Check if a socket response has been received
   if (SOCKET_RESPONSE) {
      // Check if the document is in the 'visible' state and the app is not hidden
      if (document.visibilityState === 'visible' && !IS_APP_HIDDEN) {
         // Reset the socket response flag
         SOCKET_RESPONSE = false

         // Send a ping request to the WebSocket server
         boClient.ping(
            {},
            {
               uuid: uuidv4(),
               meta: {
                  sentAt: new Date(),
               },
            }
         )
      }
   } else {
      // If no socket response has been received, reload the page
      window.location.reload()
   }
}

/**
 * Handles the WebSocket close event.
 */
async function handleSocketClose() {
   // Check if an access token exists in cookies
   if (getCookie('access_token')) {
      // Extract the access token from the cookie
      const access_token_url: string = getCookie('access_token') as string
      const token: string[] = access_token_url.split('access_token=')
      // Check if the token is invalid
      if (!isValidToken(token[1])) {
         // Handle the case of an invalid token
         handleInvalidToken()
      } else {
         // Reload the window if the token is valid
         window.location.reload()
      }
   } else {
      // Handle the case when there is no access token
      handleInvalidToken()
   }
}

/**
 * Handles the case of an invalid token by redirecting to the login page and performing logout actions.
 */
function handleInvalidToken() {
   // Redirect to the login page
   redirectToLogin()

   // Perform logout actions
   eventHandler.HandleLogout()

   // Clear the interval for periodic tasks
   clearInterval(CURR_INTERVAL)

   ERROR_RESPONSE = false
}
