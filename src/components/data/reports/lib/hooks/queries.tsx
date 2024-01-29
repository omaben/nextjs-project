import {
   GetBetsCurrenciesReportDto,
   GetFinancialReportDto,
   GetLaunchReportDto,
   GetStatsDto,
   OnRestartReportProviderResponseParams,
   OnSetReportConfigResponseParams,
   ReportConfig,
   RestartReportProviderDto,
   SetReportConfigDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { ReportGranularityType } from '@alienbackoffice/back-front/lib/report/enum/report-granularity-type.enum'
import { ReportTimeInterval } from '@alienbackoffice/back-front/lib/report/enum/report-time-interval.enum'
import {
   UseMutationOptions,
   useMutation,
   useQuery,
   useQueryClient,
} from '@tanstack/react-query'
import { UseGetQueryProps } from 'lib/types'
import { useSelector } from 'react-redux'
import {
   saveLoadingBetsCurrenciesReport,
   saveLoadingFinancialReport,
   saveLoadingFinancialReportBrands,
   saveLoadingFinancialReportDashboard,
   saveLoadingFinancialReportDay,
   saveLoadingFinancialReportHour,
   saveLoadingFinancialReportMonth,
   saveLoadingFinancialReportOperators,
   saveLoadingFinancialReportYear,
   saveLoadingLaunchReport,
} from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { hasDetailsPermission } from 'services/permissionHandler'
import { v4 as uuidv4 } from 'uuid'

type UseGetReportsQueryProps = UseGetQueryProps & {
   opId: string
   brandId?: string
}

export type UseGetReportsTableQueryProps = UseGetQueryProps & {
   opId?: string
   brandId?: string
   from: number
   to: number
   timeInterval?: ReportTimeInterval
   key?: string
   playerId?: string
   searchDate?: number
   gateway?: string
   refresh?: number
}

export const useGetStatsQuery = ({
   opId,
   brandId,
}: UseGetReportsQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetStatsDto = {
      opId: opId,
      brandId: brandId,
   }
   return useQuery({
      queryKey: ['report', { ...find }],
      queryFn: async () => {
         if (
            opId &&
            opId !== 'all' &&
            hasDetailsPermission(UserPermissionEvent.BACKOFFICE_GET_STATS_REQ)
         ) {
            boClient?.report.getStats(
               { ...find },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GET_STATS_REQ,
                  },
               }
            )
         }
         return {}
      },
      initialData: {
         numberOfOperators: 0,
         numberOfTodayBets: 0,
         numberOfPlayers: 0,
         numberOfOnlinePlayers: 0,
      },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetReportFinancialQuery = ({
   opId,
   brandId,
   from,
   to,
   timeInterval,
   key,
   playerId,
   searchDate,
   gateway,
   refresh,
}: UseGetReportsTableQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetFinancialReportDto = {
      from: from,
      to: to,
      includeEmpty: true,
      granularityType: ReportGranularityType.BY_TIME_INTERVAL,
   }
   if (timeInterval) {
      find.timeInterval = timeInterval
   }
   if (opId) {
      find.opId = opId
   }
   if (brandId) {
      find.brandId = brandId
   }
   if (playerId) {
      find.playerId = playerId
   }
   if (gateway) {
      find.gateway = gateway
   }
   return useQuery({
      queryKey: ['report', { ...find, searchDate, key, refresh }],
      queryFn: async () => {
         switch (key) {
            case 'Graph':
               store.dispatch(saveLoadingFinancialReport(true))
               break
            case ReportTimeInterval.YEAR:
               store.dispatch(saveLoadingFinancialReportYear(true))
               break
            case ReportTimeInterval.MONTH:
               store.dispatch(saveLoadingFinancialReportMonth(true))
               break
            case ReportTimeInterval.DAY:
               store.dispatch(saveLoadingFinancialReportDay(true))
               break
            case ReportTimeInterval.HOUR:
               store.dispatch(saveLoadingFinancialReportHour(true))
               break
         }
         boClient?.report.getFinancialReport(
            { ...find },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  timeInterval: key,
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_FINANCIAL_REPORT_REQ,
               },
            }
         )
         return []
      },
      initialData: [],
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetReportFinancialGenericQuery = ({
   opId,
   brandId,
   from,
   to,
   timeInterval,
   key,
   playerId,
   searchDate,
   gateway,
   refresh,
}: UseGetReportsTableQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetFinancialReportDto = {
      from: from,
      to: to,
      includeEmpty: true,
      granularityType: ReportGranularityType.BY_OP_ID,
   }
   if (opId) {
      find.opId = opId
   }
   if (brandId) {
      find.brandId = brandId
   }
   if (playerId) {
      find.playerId = playerId
   }
   if (gateway) {
      find.gateway = gateway
   }
   return useQuery({
      queryKey: ['report', { ...find, searchDate, key, refresh }],
      queryFn: async () => {
         if (
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GET_FINANCIAL_REPORT_REQ
            )
         ) {
            switch (key) {
               case 'Graph':
                  store.dispatch(saveLoadingFinancialReport(true))
                  break
               case 'reportDashboard':
                  store.dispatch(saveLoadingFinancialReportDashboard(true))
                  break
               case 'operatorsReport':
                  store.dispatch(saveLoadingFinancialReportOperators(true))
                  break
            }
            boClient?.report.getFinancialReport(
               { ...find },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     timeInterval: key,
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GET_FINANCIAL_REPORT_REQ,
                  },
               }
            )
         }
         return []
      },
      initialData: [],
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetReportFinancialBrandsQuery = ({
   opId,
   brandId,
   from,
   to,
   timeInterval,
   key,
   playerId,
   searchDate,
   gateway,
   refresh,
}: UseGetReportsTableQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetFinancialReportDto = {
      from: from,
      to: to,
      includeEmpty: true,
      granularityType: ReportGranularityType.BY_BRAND_ID,
   }
   if (opId) {
      find.opId = opId
   }
   if (brandId) {
      find.brandId = brandId
   }
   if (playerId) {
      find.playerId = playerId
   }
   if (gateway) {
      find.gateway = gateway
   }
   return useQuery({
      queryKey: ['report', { ...find, searchDate, key, refresh }],
      queryFn: async () => {
         store.dispatch(saveLoadingFinancialReportBrands(true))
         boClient?.report.getFinancialReport(
            { ...find },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  timeInterval: key,
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_FINANCIAL_REPORT_REQ,
               },
            }
         )
         return []
      },
      initialData: [],
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetCurrenciesQuery = () => {
   const boClient = useSelector(selectBoClient)
   return useQuery({
      queryKey: ['currencies'],
      queryFn: async () => {
         const meta = {
            ts: new Date(),
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_GET_CURRENCIES_REQ,
         }
         boClient?.getCurrencies({}, { uuid: uuidv4(), meta })
         return {}
      },
      initialData: [],
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetBanksNameQuery = () => {
   const boClient = useSelector(selectBoClient)
   return useQuery({
      queryKey: ['banksName'],
      queryFn: async () => {
         const meta = {
            ts: new Date(),
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_GET_BANKS_REQ,
         }
         boClient?.getBanks({}, { uuid: uuidv4(), meta })
         return {}
      },
      initialData: [],
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetReportConfigQuery = () => {
   const boClient = useSelector(selectBoClient)
   return useQuery({
      queryKey: ['ReportConfig'],
      queryFn: async () => {
         const meta = {
            ts: new Date(),
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_GET_REPORT_CONFIG_REQ,
         }
         boClient?.report.getReportConfig({}, { uuid: uuidv4(), meta })
         return {}
      },
      initialData: [],
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useSetReportConfigMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: ReportConfig
         traceData: Pick<OnSetReportConfigResponseParams, 'traceData'>
      },
      string,
      {
         dto: SetReportConfigDto
         traceData?: Pick<OnSetReportConfigResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SET_REPORT_CONFIG_REQ,
         }
         boClient?.report?.setReportConfig(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.report.onSetReportConfigResponse(async (result) => {
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
         queryClient.invalidateQueries({ queryKey: ['player'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useSetReportRestartMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: ReportConfig
         traceData: Pick<OnRestartReportProviderResponseParams, 'traceData'>
      },
      string,
      {
         dto: RestartReportProviderDto
         traceData?: Pick<OnRestartReportProviderResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SET_REPORT_CONFIG_REQ,
         }
         boClient?.report?.restartReportProvider(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.report.onRestartReportProviderResponse(async (result) => {
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
         queryClient.invalidateQueries({ queryKey: ['player'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useGetLaunchesReportsQuery = ({
   opId,
   brandId,
   from,
   to,
}: GetLaunchReportDto) => {
   const boClient = useSelector(selectBoClient)
   const find: GetLaunchReportDto = { from: from, to: to }
   if (opId) {
      find.opId = opId
   }
   if (brandId) {
      find.brandId = brandId
   }
   return useQuery({
      queryKey: ['reports', { ...find }],
      queryFn: async () => {
         store.dispatch(saveLoadingLaunchReport(true))
         const meta = {
            ts: new Date(),
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_GET_LAUNCH_REPORT_REQ,
         }
         boClient?.report.getLaunchReport({ ...find }, { uuid: uuidv4(), meta })
         return {}
      },
      initialData: [],
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetBetsCurrenciesReportsQuery = ({
   opId,
   brandId,
   from,
   to,
}: GetBetsCurrenciesReportDto) => {
   const boClient = useSelector(selectBoClient)
   const find: GetBetsCurrenciesReportDto = { from: from, to: to }
   if (opId) {
      find.opId = opId
   }
   if (brandId) {
      find.brandId = brandId
   }
   return useQuery({
      queryKey: ['betsreports', { ...find }],
      queryFn: async () => {
         store.dispatch(saveLoadingBetsCurrenciesReport(true))
         const meta = {
            ts: new Date(),
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_GET_BETS_CURRENCIES_REPORT_REQ,
         }
         boClient?.report.getBetsCurrenciesReport(
            { ...find },
            { uuid: uuidv4(), meta }
         )
         return {}
      },
      initialData: [],
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}
