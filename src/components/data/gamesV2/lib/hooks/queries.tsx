import {
   CreateGameV2Dto,
   EditGameDto,
   EditGameV2Dto,
   Game,
   GameV2,
   GetGameListDto,
   GetGameV2ListDto,
   GetValidGamesForOperatorDto,
   OnCreateGameV2ResponseParams,
   OnEditGameResponseParams,
   OnEditGameV2ResponseParams,
   UserPermissionEvent
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
import { saveLoadingGamesList } from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { hasDetailsPermission } from 'services/permissionHandler'
import { v4 as uuidv4 } from 'uuid'

export type useGetGameListQueryProps = UseGetQueryProps & {
   gameId?: string
   title?: string
   page?: number
   limit?: number
   sort?: {}
   refresh?: number
}
export const useGetGameListQuery = ({
   searchText = '',
   gameId,
   title,
   page,
   limit = 50,
   sort = {},
}: useGetGameListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const data: GetGameListDto = { find: {}, sort: sort }
   if (gameId) data.find.gameId = gameId
   if (title) data.find.title = title
   const skip = page ? page * limit : 0
   return useQuery({
      queryKey: ['games', { skip, limit, ...data }],
      queryFn: async () => {
         // store.dispatch(saveLoadingGamesList(true))
         // store.dispatch(saveGamesList([]))
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

export const useGetGameV2ListQuery = ({
   gameId,
   title,
   page,
   limit = 50,
   sort = {},
   refresh,
}: useGetGameListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const data: GetGameV2ListDto = { find: {}, sort: sort }
   if (gameId) data.find.gameId = gameId
   if (title) data.find.title = title
   const skip = page ? page * limit : 0
   return useQuery({
      queryKey: ['gamesV2', { skip, limit, ...data, refresh }],
      queryFn: async () => {
         // store.dispatch(saveLoadingGamesList(true))
         // store.dispatch(saveGamesList([]))
         boClient?.gameV2.getGameList(
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
      onError: (error) => {
         // toast(<Alert error={error} />);
      },
   })
}

export const useCreateGameV2Mutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: GameV2
         traceData: Pick<OnCreateGameV2ResponseParams, 'traceData'>
      },
      string,
      {
         dto: CreateGameV2Dto
         traceData?: Pick<OnCreateGameV2ResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_CREATE_GAMEV2_REQ,
         }
         boClient?.gameV2?.createGame(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.gameV2.onCreateGameResponse(async (result) => {
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
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER
          })
      },
   })
}

export const useEditeGameV2Mutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: GameV2
         traceData: Pick<OnEditGameV2ResponseParams, 'traceData'>
      },
      string,
      {
         dto: EditGameV2Dto
         traceData?: Pick<OnEditGameV2ResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_EDIT_GAMEV2_REQ,
         }
         boClient?.gameV2?.editGame(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.gameV2.onEditGameResponse(async (result) => {
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
      onError: (error) => {
         toast.error(error, {
            position: toast.POSITION.TOP_CENTER
          })
      },
   })
}

export const useGetValidGamesForOperatorQuery = ({
   opId,
   configType,
}: GetValidGamesForOperatorDto) => {
   const boClient = useSelector(selectBoClient)
   const data: GetValidGamesForOperatorDto = { opId, configType }
   return useQuery({
      queryKey: ['gamesV2', { ...data }],
      queryFn: async () => {
         // store.dispatch(saveLoadingGamesList(true))
         // store.dispatch(saveGamesList([]))
         if (
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GET_VALID_GAMES_FOR_OPERATOR_REQ
            )
         ) {
            boClient?.gameV2.getValidGamesForOperator(
               { ...data },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     sessionId: sessionStorage.getItem('sessionId'),
                  },
               }
            )
         }else{
            store.dispatch(saveLoadingGamesList(false))
         }
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
