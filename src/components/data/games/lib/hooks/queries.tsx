import {
   ConfigType,
   EditGameDto,
   Game,
   GameCoreStatus,
   GetGameListDto,
   OnEditGameResponseParams,
   OnSetGameCoreStatusResponseParams,
   SetGameCoreStatusDto,
   UserPermissionEvent
} from '@alienbackoffice/back-front'
import { OnSetGameCoreCustomCrashPointsResponseParams } from '@alienbackoffice/back-front/lib/backoffice/interfaces/on-set-game-core-custom-crash-points-response-params.interface'
import { GetGameCoreListDto } from '@alienbackoffice/back-front/lib/game/dto/get-game-core-list.dto'
import { SetGameCoreCustomCrashPointsDto } from '@alienbackoffice/back-front/lib/game/dto/set-game-core-custom-crash-points.dto'
import {
   UseMutationOptions,
   useMutation,
   useQuery,
   useQueryClient,
} from '@tanstack/react-query'
import { UseGetQueryProps } from 'lib/types'
import { useSelector } from 'react-redux'
import {
   saveLoadingGameCoresList,
   saveLoadingGamesList,
} from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { v4 as uuidv4 } from 'uuid'

export type useGetGameListQueryProps = UseGetQueryProps & {
   gameId?: string
   title?: string
   page?: number
   limit?: number
   autoRefresh?: number
   sort?: {}
}

export type useGetGameCoresListQueryProps = UseGetQueryProps & {
   page?: number
   limit?: number
   autoRefresh?: number
   coreId?: string
   configType?: ConfigType
   sort?: {}
}
export const useGetGameListQuery = ({
   gameId,
   title,
   page,
   limit = 50,
   autoRefresh,
   sort = {},
}: useGetGameListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const data: GetGameListDto = { find: {}, sort: sort }
   if (gameId) data.find.gameId = gameId
   if (title) data.find.title = title
   const skip = page ? page * limit : 0
   return useQuery({
      queryKey: ['games', { skip, limit, ...data, autoRefresh }],
      queryFn: async () => {
         store.dispatch(saveLoadingGamesList(true))
         boClient?.game.getGameList(
            { skip, limit, ...data },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
               },
            }
         )
         return {}
      },
      initialData: { count: 0, games: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetGameCoresListQuery = ({
   page,
   limit = 50,
   autoRefresh,
   sort = {},
   coreId,
   configType,
}: useGetGameCoresListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const data: GetGameCoreListDto = { find: {}, sort: sort }
   if (coreId) data.find.coreId = coreId
   if (configType) data.find.configType = configType
   const skip = page ? page * limit : 0
   return useQuery({
      queryKey: ['games', { skip, limit, ...data, autoRefresh }],
      queryFn: async () => {
         store.dispatch(saveLoadingGameCoresList(true))
         boClient?.gameCore.getGameCoreList(
            { skip, limit, ...data },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GAME_CORE_LIST_REQ,
               },
            }
         )
         return {}
      },
      initialData: { count: 0, games: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useEditGameMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: Game; traceData: Pick<OnEditGameResponseParams, 'traceData'> },
      string,
      {
         dto: EditGameDto
         traceData?: Pick<OnEditGameResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_EDIT_GAME_REQ,
         }
         boClient?.game?.editGame(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.game.onEditGameResponse(async (result) => {
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
         queryClient.invalidateQueries({ queryKey: ['games'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error) => {},
   })
}

export const useSetGameCoreStatusMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: GameCoreStatus
         traceData: Pick<OnSetGameCoreStatusResponseParams, 'traceData'>
      },
      string,
      {
         dto: SetGameCoreStatusDto
         traceData?: Pick<OnSetGameCoreStatusResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SET_GAME_CORE_STATUS_REQ,
         }
         boClient?.gameCore?.setGameCoreStatus(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.gameCore.onSetGameCoreStatusResponse(async (result) => {
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
         queryClient.invalidateQueries({ queryKey: ['games'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error) => {},
   })
}

export const useSetGameCoreCustomCrashPointMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: GameCoreStatus
         traceData: Pick<OnSetGameCoreCustomCrashPointsResponseParams, 'traceData'>
      },
      string,
      {
         dto: SetGameCoreCustomCrashPointsDto
         traceData?: Pick<OnSetGameCoreCustomCrashPointsResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SET_GAME_CORE_CUSTOM_CRASH_POINTS_REQ,
         }
         boClient?.gameCore?.setGameCoreCustomCrashPoints(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.gameCore.onSetGameCoreCustomCrashPointsResponse(async (result) => {
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
         queryClient.invalidateQueries({ queryKey: ['games'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error) => {},
   })
}