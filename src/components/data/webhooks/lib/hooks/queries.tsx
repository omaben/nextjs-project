import {
   AuthLogMethod,
   AuthLogType,
   GetAuthLogListDto,
   GetLaunchLogListDto,
   GetWebhookLogListDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { LogLevel } from '@alienbackoffice/back-front/lib/lib/enum/log-level.enum'
import { LogWebhookName } from '@alienbackoffice/back-front/lib/lib/enum/log-webhook-name.enum'
import { useQuery } from '@tanstack/react-query'
import { UseGetQueryProps } from 'lib/types'
import { useSelector } from 'react-redux'
import { saveLoadingAuthLogsList, saveLoadingLaunchLogsList, saveLoadingWebhookList } from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { v4 as uuidv4 } from 'uuid'

export type UseGetWebhookListQueryProps = UseGetQueryProps & {
   opId: string
   uniqueId?: string
   from?: number
   to?: number
   searchText?: string
   playerId?: string
   page?: number
   limit?: number
   // sort?: GetPlayerActivityListSortDto
   webhook?: LogWebhookName | 'all'
   playerToken?: string
   gameId?: string
   level?: LogLevel | 'all'
   betId?: string
   authMethod?: AuthLogMethod | 'all',
   authType?: AuthLogType | 'all',
   refresh?:number,
   cashierId?: string
}
export const useGetWebhookListQuery = ({
   searchText = '',
   page,
   limit,
   from,
   to,
   gameId,
   level,
   playerId,
   playerToken,
   webhook,
   opId,
   uniqueId,
   betId,
   refresh,
   cashierId
}: UseGetWebhookListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetWebhookLogListDto = {
      opId,
   }
   if (from) {
      find.from = from
   }
   if (to) {
      find.to = to
   }
   if (gameId) {
      find.gameId = gameId
   }
   if (uniqueId) {
      find.uuid = uniqueId
   }
   if (level !== 'all') {
      find.level = level
   }
   if (webhook !== 'all') {
      find.webhook = webhook
   }
   if (playerId) {
      find.playerId = playerId
   }
   if (cashierId) {
      find.cashierId = cashierId
   }
   if (playerToken) {
      find.playerToken = playerToken
   }
   if (betId) {
      find.betId = betId
   }
   return useQuery({
      queryKey: ['webhook', { ...find, refresh }],
      queryFn: async () => {
         store.dispatch(saveLoadingWebhookList(true))
         // store.dispatch(saveWebhookList([]))
         boClient?.operator.getWebhookLogList(
            { ...find },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_WEBHOOK_LOG_LIST_REQ,
               },
            }
         )

         return {}
      },
      initialData: { count: 0, webhooks: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetRegiterListQuery = ({
   from,
   to,
   level,
   playerId,
   playerToken,
   opId,
   uniqueId,
   authType,
   authMethod,
   refresh
}: UseGetWebhookListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetAuthLogListDto = {
      opId,
   }
   if (from) {
      find.from = from
   }
   if (to) {
      find.to = to
   }
   if (uniqueId) {
      find.uuid = uniqueId
   }
   if (level !== 'all') {
      find.level = level
   }
   
   if (authType !== 'all') {
      find.authType = authType
   }
   
   if (authMethod !== 'all') {
      find.authMethod = authMethod
   }
   if (playerId) {
      find.playerId = playerId
   }
   if (playerToken) {
      find.playerToken = playerToken
   }
   return useQuery({
      queryKey: ['authLogList', { ...find, refresh }],
      queryFn: async () => {
         store.dispatch(saveLoadingAuthLogsList(true))
         // store.dispatch(saveWebhookList([]))
         boClient?.operator.getAuthLogList(
            { ...find },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_AUTH_LOG_LIST_REQ,
               },
            }
         )

         return {}
      },
      initialData: { count: 0, webhooks: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetLaunchListQuery = ({
   from,
   to,
   level,
   playerId,
   playerToken,
   opId,
   uniqueId,
   refresh
}: UseGetWebhookListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetLaunchLogListDto = {
      opId,
   }
   if (from) {
      find.from = from
   }
   if (to) {
      find.to = to
   }
   if (uniqueId) {
      find.uuid = uniqueId
   }
   if (level !== 'all') {
      find.level = level
   }
   if (playerId) {
      find.playerId = playerId
   }
   if (playerToken) {
      find.playerToken = playerToken
   }
   return useQuery({
      queryKey: ['launchLogList', { ...find, refresh }],
      queryFn: async () => {
         store.dispatch(saveLoadingLaunchLogsList(true))
         // store.dispatch(saveWebhookList([]))
         boClient?.operator.getLaunchLogList(
            { ...find },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_LAUNCH_LOG_LIST_REQ,
               },
            }
         )

         return {}
      },
      initialData: { count: 0, webhooks: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}