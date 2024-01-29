import {
   AddTournamentV2Dto,
   GetTournamentIdsDto,
   GetTournamentV2Dto,
   GetTournamentV2IdsDto,
   OnAddTournamentV2ResponseParams,
   OnSaveTournamentResultResponseParams,
   OnSaveTournamentV2ResultResponseParams,
   OnSendTournamentResultResponseParams,
   OnSendTournamentV2ResultResponseParams,
   OnSetTournamentResponseParams,
   OnSetTournamentV2ResponseParams,
   OnUpdateTournamentResponseParams,
   OnUpdateTournamentV2ResponseParams,
   SaveTournamentResultDto,
   SaveTournamentV2ResultDto,
   SendTournamentResultDto,
   SendTournamentV2ResultDto,
   SetTournamentDto,
   SetTournamentV2Dto,
   Tournament,
   TournamentV2,
   UpdateTournamentDto,
   UpdateTournamentV2Dto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { OnAddTournamentResponseParams } from '@alienbackoffice/back-front/lib/backoffice/interfaces/on-add-tournament-response-params.interface'
import { GetTournamentV2ListFindDto } from '@alienbackoffice/back-front/lib/tournament-v2/dto/get-tournament-v2-list.dto'
import { AddTournamentDto } from '@alienbackoffice/back-front/lib/tournament/dto/add-tournament.dto'
import {
   GetTournamentListFindDto,
   GetTournamentListSortDto,
} from '@alienbackoffice/back-front/lib/tournament/dto/get-tournament-list.dto'
import {
   UseMutationOptions,
   useMutation,
   useQuery,
   useQueryClient,
} from '@tanstack/react-query'
import { UseGetQueryProps } from 'lib/types'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
   saveTournamentV2Details,
   selectAuthCurrentBrand,
   selectAuthOperator,
} from 'redux/authSlice'
import {
   saveLoadingTournament,
   saveLoadingTournamentIDs,
   saveLoadingTournamentV2IDs,
} from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { v4 as uuidv4 } from 'uuid'

export type UseGetTournamentQueryProps = UseGetQueryProps & {
   opId: string
}

export type UseGetTournamentListQueryProps = UseGetQueryProps & {
   title?: string
   searchText?: string
   tournamentId?: string
   uniquePlayer?: boolean
   includeTestPlayers?: boolean
   gameId?: string
   page: number
   limit: number
   refresh: number
   sort: GetTournamentListSortDto
   autoRefresh?: number
}

export const useGetTournamentListQuery = ({
   searchText = '',
   page,
   limit,
   title,
   gameId,
   includeTestPlayers,
   tournamentId,
   uniquePlayer,
   refresh,
   sort,
   autoRefresh,
}: UseGetTournamentListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetTournamentListFindDto = {}
   if (title) {
      find.title = title
   }
   if (gameId) {
      find.includeGameId = gameId
   }
   if (tournamentId) {
      find.tournamentId = tournamentId
   }
   // if (brandId) {
   //    find.includeBrandId = brandId
   // }
   // if (opId) {
   //    find.includeOpId = opId
   // }
   const skip = page ? page * limit : 0
   return useQuery({
      queryKey: [
         'tournament',
         { skip, limit, ...find, refresh, sort, autoRefresh },
      ],
      queryFn: async () => {
         // store.dispatch(saveLoadingTournament(true))
         // store.dispatch(saveTournament([]))
         boClient?.tournament.getTournamentList(
            { skip, limit, find, sort },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_TOURNAMENT_LIST_REQ,
               },
            }
         )

         return {}
      },
      initialData: { count: 0, tournamentList: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetTournamentIDsListQuery = (autoRefresh: number) => {
   const boClient = useSelector(selectBoClient)
   const opId = useSelector(selectAuthOperator)
   const brandId = useSelector(selectAuthCurrentBrand)
   const find: GetTournamentIdsDto = {}
   if (opId && opId !== '*') {
      find.opId = opId
   }
   if (brandId && brandId !== 'All Brands') {
      find.brandId = brandId
   }
   return useQuery({
      queryKey: ['tournament', { ...find, autoRefresh }],
      queryFn: async () => {
         store.dispatch(saveLoadingTournamentIDs(true))
         boClient?.tournament.getTournamentIds(
            { ...find },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_TOURNAMENT_IDS_REQ,
               },
            }
         )

         return {}
      },
      initialData: { count: 0, tournamentList: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}
export const useGetTournamentV2IDsListQuery = (autoRefresh: number) => {
   const boClient = useSelector(selectBoClient)
   const opId = useSelector(selectAuthOperator)
   const brandId = useSelector(selectAuthCurrentBrand)
   const find: GetTournamentV2IdsDto = {}
   if (opId && opId !== '*') {
      find.opId = opId
   }
   if (brandId && brandId !== 'All Brands') {
      find.brandId = brandId
   }
   return useQuery({
      queryKey: ['tournament', { ...find, autoRefresh }],
      queryFn: async () => {
         store.dispatch(saveLoadingTournamentV2IDs(true))
         boClient?.tournamentV2.getTournamentIds(
            { ...find },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_TOURNAMENT_V2_IDS_REQ,
               },
            }
         )

         return {}
      },
      initialData: { count: 0, tournamentList: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useSetTournamentMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Tournament
         traceData: Pick<OnSetTournamentResponseParams, 'traceData'>
      },
      string,
      {
         dto: SetTournamentDto
         traceData?: Pick<OnSetTournamentResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SET_TOURNAMENT_REQ,
         }
         boClient?.tournament.setTournament(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.tournament.onSetTournamentResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
                  // store.dispatch(saveTournament(result.data))
               } else {
                  let message = result.message
                  if (message === 'Access denied.') {
                     message = `Access denied to ${result.traceData?.meta?.event}`
                  }
                  reject(message)
                  toast.error(message, {
                     position: toast.POSITION.TOP_CENTER,
                  })
               }
            })
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['transaction'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useUpdateTournamentMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Tournament
         traceData: Pick<OnUpdateTournamentResponseParams, 'traceData'>
      },
      string,
      {
         dto: UpdateTournamentDto
         traceData?: Pick<OnUpdateTournamentResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_UPDATE_TOURNAMENT_REQ,
         }
         boClient?.tournament.updateTournament(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.tournament.onUpdateTournamentResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
                  // store.dispatch(saveTournament(result.data))
               } else {
                  let message = result.message
                  if (message === 'Access denied.') {
                     message = `Access denied to ${result.traceData?.meta?.event}`
                  }
                  reject(message)
                  toast.error(message, {
                     position: toast.POSITION.TOP_CENTER,
                  })
               }
            })
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['transaction'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useAddTournamentMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Tournament
         traceData: Pick<OnAddTournamentResponseParams, 'traceData'>
      },
      string,
      {
         dto: AddTournamentDto
         traceData?: Pick<OnAddTournamentResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SET_TOURNAMENT_REQ,
         }
         boClient?.tournament.addTournament(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.tournament.onAddTournamentResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
                  // store.dispatch(saveTournament(result.data))
               } else {
                  let message = result.message
                  if (message === 'Access denied.') {
                     message = `Access denied to ${result.traceData?.meta?.event}`
                  }
                  reject(message)
                  toast.error(message, {
                     position: toast.POSITION.TOP_CENTER,
                  })
               }
            })
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['Tournament'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useSendResultTournamentMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Tournament
         traceData: Pick<OnSendTournamentResultResponseParams, 'traceData'>
      },
      string,
      {
         dto: SendTournamentResultDto
         traceData?: Pick<OnSendTournamentResultResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SEND_TOURNAMENT_RESULT_REQ,
         }
         boClient?.tournament.sendTournamentResult(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.tournament.onSendTournamentResultResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                     // store.dispatch(saveTournament(result.data))
                  } else {
                     let message = result.message
                     if (message === 'Access denied.') {
                        message = `Access denied to ${result.traceData?.meta?.event}`
                     }
                     reject(message)
                     toast.error(message, {
                        position: toast.POSITION.TOP_CENTER,
                     })
                  }
               }
            )
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['Tournament'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useSaveResultTournamentMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Tournament
         traceData: Pick<OnSaveTournamentResultResponseParams, 'traceData'>
      },
      string,
      {
         dto: SaveTournamentResultDto
         traceData?: Pick<OnSaveTournamentResultResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SAVE_TOURNAMENT_RESULT_REQ,
         }
         boClient?.tournament.saveTournamentResult(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.tournament.onSaveTournamentResultResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                     // store.dispatch(saveTournament(result.data))
                  } else {
                     let message = result.message
                     if (message === 'Access denied.') {
                        message = `Access denied to ${result.traceData?.meta?.event}`
                     }
                     reject(message)
                     toast.error(message, {
                        position: toast.POSITION.TOP_CENTER,
                     })
                  }
               }
            )
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['Tournament'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

// tournament V2

export const useGetTournamentListV2Query = ({
   searchText = '',
   page,
   limit,
   title,
   gameId,
   includeTestPlayers,
   tournamentId,
   uniquePlayer,
   refresh,
   sort,
   autoRefresh,
}: UseGetTournamentListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetTournamentV2ListFindDto = {}
   if (title) {
      find.title = title
   }
   if (gameId) {
      find.includeGameId = gameId
   }
   if (tournamentId) {
      find.tournamentId = tournamentId
   }
   const skip = page ? page * limit : 0
   return useQuery({
      queryKey: [
         'tournamentV2',
         { skip, limit, ...find, refresh, sort, autoRefresh },
      ],
      queryFn: async () => {
         boClient?.tournamentV2.getTournamentList(
            { skip, limit, find, sort },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_TOURNAMENT_V2_LIST_REQ,
               },
            }
         )

         return {}
      },
      initialData: { count: 0, tournamentList: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetTournamentV2Query = ({
   tournamentId,
}: GetTournamentV2Dto) => {
   const boClient = useSelector(selectBoClient)
   const find: GetTournamentV2Dto = { tournamentId }

   return useQuery({
      queryKey: ['tournament', { tournamentId }],
      queryFn: async () => {
         if (tournamentId) {
            boClient?.tournamentV2.getTournament(
               { ...find },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GET_TOURNAMENT_V2_REQ,
                  },
               }
            )
         }

         return {}
      },
      initialData: { count: 0, tournamentList: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useAddTournamentV2Mutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: TournamentV2
         traceData: Pick<OnAddTournamentV2ResponseParams, 'traceData'>
      },
      string,
      {
         dto: AddTournamentV2Dto
         traceData?: Pick<OnAddTournamentV2ResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SET_TOURNAMENT_V2_REQ,
         }
         boClient?.tournamentV2.addTournament(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.tournamentV2.onAddTournamentResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
                  // store.dispatch(saveTournament(result.data))
               } else {
                  let message = result.message
                  if (message === 'Access denied.') {
                     message = `Access denied to ${result.traceData?.meta?.event}`
                  }
                  reject(message)
                  toast.error(message, {
                     position: toast.POSITION.TOP_CENTER,
                  })
               }
            })
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['Tournament V2'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useSetTournamentV2Mutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: TournamentV2
         traceData: Pick<OnSetTournamentV2ResponseParams, 'traceData'>
      },
      string,
      {
         dto: SetTournamentV2Dto
         traceData?: Pick<OnSetTournamentV2ResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SET_TOURNAMENT_V2_REQ,
         }
         boClient?.tournamentV2.setTournament(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.tournamentV2.onSetTournamentResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
                  store.dispatch(saveTournamentV2Details(result.data))
               } else {
                  let message = result.message
                  if (message === 'Access denied.') {
                     message = `Access denied to ${result.traceData?.meta?.event}`
                  }
                  reject(message)
                  toast.error(message, {
                     position: toast.POSITION.TOP_CENTER,
                  })
               }
            })
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['transaction'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useUpdateTournamentV2Mutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: TournamentV2
         traceData: Pick<OnUpdateTournamentV2ResponseParams, 'traceData'>
      },
      string,
      {
         dto: UpdateTournamentV2Dto
         traceData?: Pick<OnUpdateTournamentV2ResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_UPDATE_TOURNAMENT_V2_REQ,
         }
         boClient?.tournamentV2.updateTournament(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.tournamentV2.onUpdateTournamentResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                     // store.dispatch(saveTournament(result.data))
                  } else {
                     let message = result.message
                     if (message === 'Access denied.') {
                        message = `Access denied to ${result.traceData?.meta?.event}`
                     }
                     reject(message)
                     toast.error(message, {
                        position: toast.POSITION.TOP_CENTER,
                     })
                  }
               }
            )
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['transaction'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useSendResultTournamentV2Mutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: TournamentV2
         traceData: Pick<OnSendTournamentV2ResultResponseParams, 'traceData'>
      },
      string,
      {
         dto: SendTournamentV2ResultDto
         traceData?: Pick<OnSendTournamentV2ResultResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SEND_TOURNAMENT_V2_RESULT_REQ,
         }
         boClient?.tournamentV2.sendTournamentResult(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.tournamentV2.onSendTournamentResultResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                     // store.dispatch(saveTournament(result.data))
                  } else {
                     let message = result.message
                     if (message === 'Access denied.') {
                        message = `Access denied to ${result.traceData?.meta?.event}`
                     }
                     reject(message)
                     toast.error(message, {
                        position: toast.POSITION.TOP_CENTER,
                     })
                  }
               }
            )
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['Tournament'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useSaveResultTournamentV2Mutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: TournamentV2
         traceData: Pick<OnSaveTournamentV2ResultResponseParams, 'traceData'>
      },
      string,
      {
         dto: SaveTournamentV2ResultDto
         traceData?: Pick<OnSaveTournamentV2ResultResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SAVE_TOURNAMENT_V2_RESULT_REQ,
         }
         boClient?.tournamentV2.saveTournamentResult(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.tournamentV2.onSaveTournamentResultResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                     // store.dispatch(saveTournament(result.data))
                  } else {
                     let message = result.message
                     if (message === 'Access denied.') {
                        message = `Access denied to ${result.traceData?.meta?.event}`
                     }
                     reject(message)
                     toast.error(message, {
                        position: toast.POSITION.TOP_CENTER,
                     })
                  }
               }
            )
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['Tournament'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}
