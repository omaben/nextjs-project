import {
   AddAllGamesToOperatorDto,
   EditOperatorGameDto,
   GameStatus,
   OnEditOperatorGameResponseParams,
   OnSetOperatorGameTournamentConfigResponseParams,
   OperatorGame,
   SetOperatorGameTournamentConfigDto,
   SetOperatorGamesStatusDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { OnSetOperatorGameLaunchUrlResponseParams } from '@alienbackoffice/back-front/lib/backoffice/interfaces/on-set-operator-game-launch-url-response-params.interface'
import { SetOperatorGameLaunchUrlDto } from '@alienbackoffice/back-front/lib/game/dto/set-operator-game-launch-url.dto'
import { AddAllGamesV2ToOperatorDto } from '@alienbackoffice/back-front/lib/operator/dto/add-all-games-v2-to-operator.dto'
import {
   UseMutationOptions,
   useMutation,
   useQuery,
   useQueryClient,
} from '@tanstack/react-query'
import { UseGetQueryProps } from 'lib/types'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { saveGameOperatorConfigsState } from 'redux/authSlice'
import {
   saveLoadingOperatorGamesList
} from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { v4 as uuidv4 } from 'uuid'

export type useGetOperatorGameListQueryProps = UseGetQueryProps & {
   opId?: string
   title?: string
   gameId?: string
   page?: number
   limit?: number
}

export const useGetOperatorGameListQuery = ({
   searchText = '',
   opId,
   title,
   gameId,
   page = 0,
   limit = 0,
}: useGetOperatorGameListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const skip = page ? page * limit : 0
   return useQuery({
      queryKey: ['operatorGameList', { skip, limit, title, gameId }],
      queryFn: async () => {
         store.dispatch(saveLoadingOperatorGamesList(true))
         boClient?.operator.getOperatorGameList(
            { opId },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_OPERATOR_GAME_LIST_REQ,
               },
            }
         )

         return []
      },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useCreateGameOperatorMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: boolean; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: AddAllGamesToOperatorDto; traceData?: Pick<any, 'traceData'> },
      unknown
   >
) => {
   const boClient = useSelector(selectBoClient)
   const queryClient = useQueryClient()

   return useMutation({
      ...mutationOptions,
      mutationFn: ({ dto, traceData }) => {
         const meta = {
            ts: new Date(),
            ...traceData,
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_OPERATOR_ADD_ALL_GAMES_TO_OPERATOR_REQ,
         }
         boClient?.operator.addAllGamesToOperator(dto, { uuid: uuidv4(), meta })
         return new Promise((resolve, reject) => {
            boClient?.operator.onAddAllGamesToOperatorResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                  } else {
                     let message = result.message
                     if (message === 'Access denied.') {
                        message = `Access denied to ${result.traceData?.meta?.event}`
                     }
                     reject(message)
                  }
               }
            )
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['operatorGameList'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error) => {
         return error
      },
   })
}

export const useCreateGameV2OperatorMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: boolean; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: AddAllGamesV2ToOperatorDto; traceData?: Pick<any, 'traceData'> },
      unknown
   >
) => {
   const boClient = useSelector(selectBoClient)
   const queryClient = useQueryClient()

   return useMutation({
      ...mutationOptions,
      mutationFn: ({ dto, traceData }) => {
         const meta = {
            ts: new Date(),
            ...traceData,
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_OPERATOR_ADD_ALL_GAMES_V2_TO_OPERATOR_REQ,
         }
         boClient?.operator.addAllGamesV2ToOperator(dto, {
            uuid: uuidv4(),
            meta,
         })
         return new Promise((resolve, reject) => {
            boClient?.operator.onAddAllGamesV2ToOperatorResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                  } else {
                     let message = result.message
                     if (message === 'Access denied.') {
                        message = `Access denied to ${result.traceData?.meta?.event}`
                     }
                     reject(message)
                  }
               }
            )
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['operatorGameList'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error) => {
         return error
      },
   })
}

export const useSetGameOperatorStatusMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: OperatorGame; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: SetOperatorGamesStatusDto; traceData?: Pick<any, 'traceData'> },
      unknown
   >
) => {
   const boClient = useSelector(selectBoClient)
   const queryClient = useQueryClient()

   return useMutation({
      ...mutationOptions,
      mutationFn: ({ dto, traceData }) => {
         const meta = {
            ts: new Date(),
            ...traceData,
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_OPERATOR_SET_GAMES_STATUS_REQ,
         }
         boClient?.operator.setOperatorGamesStatus(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetOperatorGamesStatusResponse(
               async (result) => {
                  if (result.success) {
                     toast.success(
                        'Game operator status updated successfully',
                        {
                           position: toast.POSITION.TOP_CENTER,
                        }
                     )
                     resolve({ data: result.data, traceData: result.traceData })
                  } else {
                     let message = result.message
                     if (message === 'Access denied.') {
                        message = `Access denied to ${result.traceData?.meta?.event}`
                     }
                     toast.error(message, {
                        position: toast.POSITION.TOP_CENTER,
                     })
                     reject(message)
                  }
               }
            )
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['operatorGameList'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useGetGameOperatorQuery = ({
   opId = '',
   gameId = '',
}: useGetOperatorGameListQueryProps) => {
   const boClient = useSelector(selectBoClient)

   return useQuery({
      queryKey: ['operatorGame', { opId, gameId }],
      queryFn: async () => {
         if (opId && gameId) {
            boClient?.operator.getOperatorGame(
               { opId: opId, gameId: gameId },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_OPERATOR_GET_GAME_REQ,
                  },
               }
            )
         }
         return {}
      },
      initialData: {
         gameId: '',
         title: '',
         description: '',
         devices: [],
         funModeUrl: '',
         gameProvider: '',
         gameStatus: GameStatus.ACTIVE,
         gameType: '',
         gameSubType: '',
         hasChat: true,
         hasFunMode: true,
         jd: [],
         live: true,
         multiplayer: true,
         rtp: 0,
         launchUrl: '',
         allowableOperatorIDs: [],
         gamePlayURL: '',
         minStake: 0,
         maxStake: 0,
         maxWinAmount: 0,
         theme: '',
         lang: '',
         exchangeRate: 0,
         chatIsEnable: true,
         playMode: '',
         showTotalBetAmount: true,
         showPlayersCount: true,
         soundsIsEnable: true,
         showInfoButton: true,
         tvModeIsEnable: true,
         secretConfig: {},
         gameConfig: {},
         minStakeByCurrency: {},
         maxStakeByCurrency: {},
         maxWinAmountByCurrency: {},
      },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useEditOperatorGameMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: OperatorGame
         traceData: Pick<OnEditOperatorGameResponseParams, 'traceData'>
      },
      string,
      {
         dto: EditOperatorGameDto
         traceData?: Pick<OnEditOperatorGameResponseParams, 'traceData'>
      },
      unknown
   >
) => {
   const boClient = useSelector(selectBoClient)
   const queryClient = useQueryClient()

   return useMutation({
      ...mutationOptions,
      mutationFn: ({ dto, traceData }) => {
         const meta = {
            ts: new Date(),
            ...traceData,
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_OPERATOR_EDIT_GAME_REQ,
         }
         boClient?.operator?.editOperatorGame(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.operator.onEditOperatorGameResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
               } else {
                  let message = result.message
                  if (message === 'Access denied.') {
                     message = `Access denied to ${result.traceData?.meta?.event}`
                  }
                  reject(message)
               }
            })
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['operators'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useSetLaunchUrlMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: OperatorGame
         traceData: Pick<OnSetOperatorGameLaunchUrlResponseParams, 'traceData'>
      },
      string,
      {
         dto: SetOperatorGameLaunchUrlDto
         traceData?: Pick<OnSetOperatorGameLaunchUrlResponseParams, 'traceData'>
      },
      unknown
   >
) => {
   const boClient = useSelector(selectBoClient)
   const queryClient = useQueryClient()

   return useMutation({
      ...mutationOptions,
      mutationFn: ({ dto, traceData }) => {
         const meta = {
            ts: new Date(),
            ...traceData,
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_LAUNCH_URL_REQ,
         }
         boClient?.operator?.setOperatorGameLaunchUrl(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetOperatorGameLaunchUrlResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                  } else {
                     let message = result.message
                     if (message === 'Access denied.') {
                        message = `Access denied to ${result.traceData?.meta?.event}`
                     }
                     reject(message)
                  }
               }
            )
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['operators'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useSetTournamentSettingMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: OperatorGame
         traceData: Pick<
            OnSetOperatorGameTournamentConfigResponseParams,
            'traceData'
         >
      },
      string,
      {
         dto: SetOperatorGameTournamentConfigDto
         traceData?: Pick<
            OnSetOperatorGameTournamentConfigResponseParams,
            'traceData'
         >
      },
      unknown
   >
) => {
   const boClient = useSelector(selectBoClient)
   const queryClient = useQueryClient()

   return useMutation({
      ...mutationOptions,
      mutationFn: ({ dto, traceData }) => {
         const meta = {
            ts: new Date(),
            ...traceData,
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_TOURNAMENT_CONFIG_REQ,
         }
         boClient?.operator?.setOperatorGameTournamentConfig(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetOperatorGameTournamentConfigResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                     store.dispatch(saveGameOperatorConfigsState(result.data))
                  } else {
                     let message = result.message
                     if (message === 'Access denied.') {
                        message = `Access denied to ${result.traceData?.meta?.event}`
                     }
                     reject(message)
                  }
               }
            )
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['operators'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}
