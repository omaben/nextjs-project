import {
   AddOperatorAlienCrashGameV2Dto,
   EditOperatorGameDto,
   GameStatus,
   OnAddOperatorAlienCrashGameV2ResponseParams,
   OnEditOperatorGameResponseParams,
   OnSetOperatorGameV2CrashConfigResponseParams,
   OnSetOperatorGameV2CrashTimingConfigResponseParams,
   OnSetOperatorGameV2LaunchUrlResponseParams,
   OnSetOperatorGameV2SkinConfigResponseParams,
   OnSetOperatorGameV2TournamentConfigResponseParams,
   OperatorGame,
   OperatorGameV2,
   SetOperatorGameV2CrashConfigDto,
   SetOperatorGameV2CrashTimingConfigDto,
   SetOperatorGameV2LaunchUrlDto,
   SetOperatorGameV2SkinConfigDto,
   SetOperatorGameV2TournamentConfigDto,
   SetOperatorGamesV2StatusDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import {
   UseMutationOptions,
   useMutation,
   useQuery,
   useQueryClient,
} from '@tanstack/react-query'
import { UseGetQueryProps } from 'lib/types'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { saveOperatorGameV2 } from 'redux/authSlice'
import { saveLoadingOperatorGamesV2List } from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { v4 as uuidv4 } from 'uuid'

type useGetOperatorGameListQueryProps = UseGetQueryProps & {
   opId?: string
   title?: string
   gameId?: string
   page?: number
   limit?: number
}
export const useGetOperatorGameV2ListQuery = ({
   searchText = '',
   opId,
   title,
   page = 0,
   limit = 0,
}: useGetOperatorGameListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const skip = page ? page * limit : 0
   return useQuery({
      queryKey: ['operatorGameV2List', { skip, limit }],
      queryFn: async () => {
         if (opId) {
            store.dispatch(saveLoadingOperatorGamesV2List(true))
            boClient?.operator.getOperatorGameV2List(
               { opId },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_OPERATOR_GAME_V2_LIST_REQ,
                  },
               }
            )
         }

         return []
      },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetGameV2OperatorQuery = ({
   opId = '',
   gameId = '',
}: useGetOperatorGameListQueryProps) => {
   const boClient = useSelector(selectBoClient)

   return useQuery({
      queryKey: ['operatorGame', { opId, gameId }],
      queryFn: async () => {
         if (opId && gameId) {
            boClient?.operator.getOperatorGameV2(
               { opId: opId, gameId: gameId },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GET_GAMEV2_REQ,
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

export const useSetGameUrlV2Mutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: OperatorGameV2<any>
         traceData: Pick<
            OnSetOperatorGameV2LaunchUrlResponseParams,
            'traceData'
         >
      },
      string,
      {
         dto: SetOperatorGameV2LaunchUrlDto
         traceData?: Pick<
            OnSetOperatorGameV2LaunchUrlResponseParams,
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
            event: UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_LAUNCH_URL_REQ,
         }
         boClient?.operator?.setOperatorGameV2LaunchUrl(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetOperatorGameV2LaunchUrlResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                     store.dispatch(saveOperatorGameV2(result.data))
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
         data?: OperatorGameV2<any>
         traceData: Pick<
            OnSetOperatorGameV2TournamentConfigResponseParams,
            'traceData'
         >
      },
      string,
      {
         dto: SetOperatorGameV2TournamentConfigDto
         traceData?: Pick<
            OnSetOperatorGameV2TournamentConfigResponseParams,
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
            event: UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_TOURNAMENT_CONFIG_REQ,
         }
         boClient?.operator?.setOperatorGameV2TournamentConfig(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetOperatorGameV2TournamentConfigResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                     store.dispatch(saveOperatorGameV2(result.data))
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

export const useCreateOperatorGameV2Mutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: OperatorGameV2<any>
         traceData: Pick<
            OnAddOperatorAlienCrashGameV2ResponseParams,
            'traceData'
         >
      },
      string,
      {
         dto: AddOperatorAlienCrashGameV2Dto
         traceData?: Pick<
            OnAddOperatorAlienCrashGameV2ResponseParams,
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
            event: UserPermissionEvent.BACKOFFICE_OPERATOR_ADD_ALIEN_CRASH_GAME_V2_REQ,
         }
         boClient?.operator?.addOperatorAlienCrashGameV2(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator.onAddOperatorAlienCrashGameV2Response(
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
         queryClient.invalidateQueries({ queryKey: ['games'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
         })
         // toast(<Alert error={error} />);
      },
   })
}

export const useSetCrashConfigMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: OperatorGameV2<any>
         traceData: Pick<
            OnSetOperatorGameV2CrashConfigResponseParams,
            'traceData'
         >
      },
      string,
      {
         dto: SetOperatorGameV2CrashConfigDto
         traceData?: Pick<
            OnSetOperatorGameV2CrashConfigResponseParams,
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
            event: UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_CRASH_CONFIG_REQ,
         }
         boClient?.operator?.setOperatorGameV2CrashConfig(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetOperatorGameV2CrashConfigResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                     store.dispatch(saveOperatorGameV2(result.data))
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

export const useSetCrashTimingMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: OperatorGameV2<any>
         traceData: Pick<
            OnSetOperatorGameV2CrashTimingConfigResponseParams,
            'traceData'
         >
      },
      string,
      {
         dto: SetOperatorGameV2CrashTimingConfigDto
         traceData?: Pick<
            OnSetOperatorGameV2CrashTimingConfigResponseParams,
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
            event: UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_CRASH_TIMING_CONFIG_REQ,
         }
         boClient?.operator?.setOperatorGameV2CrashTimingConfig(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetOperatorGameV2CrashTimingConfigResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                     store.dispatch(saveOperatorGameV2(result.data))
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

export const useSetSkinConfigMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: OperatorGameV2<any>
         traceData: Pick<
            OnSetOperatorGameV2SkinConfigResponseParams,
            'traceData'
         >
      },
      string,
      {
         dto: SetOperatorGameV2SkinConfigDto
         traceData?: Pick<
            OnSetOperatorGameV2SkinConfigResponseParams,
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
            event: UserPermissionEvent.BACKOFFICE_SET_OPERATOR_GAME_V2_SKIN_CONFIG_REQ,
         }
         boClient?.operator?.setOperatorGameV2SkinConfig(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetOperatorGameV2SkinConfigResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                     store.dispatch(saveOperatorGameV2(result.data))
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

export const useSetGameOperatorStatusV2Mutation = (
   mutationOptions?: UseMutationOptions<
      { data?: OperatorGameV2<any>; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: SetOperatorGamesV2StatusDto; traceData?: Pick<any, 'traceData'> },
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
            event: UserPermissionEvent.BACKOFFICE_OPERATOR_SET_GAMES_V2_STATUS_REQ,
         }
         boClient?.operator.setOperatorGamesV2Status(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetOperatorGamesV2StatusResponse(
               async (result) => {
                  if (result.success) {
                     toast.success(
                        'Game V2 operator status updated successfully',
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
         queryClient.invalidateQueries({ queryKey: ['operatorGameV2List'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}
