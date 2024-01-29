import {
   BetAmountLimits,
   CreateEmptyOperatorDto,
   CreateOperatorDto,
   EditOperatorBrandsDto,
   EditOperatorDto,
   IntegrationType,
   LockOperatorDto,
   OnEditOperatorBrandsResponseParams,
   OnEditOperatorResponseParams,
   OnLockOperatorResponseParams,
   OnSetBetDbConfigResponseParams,
   OnSetOperatorWebhookBaseUrlResponseParams,
   Operator,
   OperatorStatus,
   SetBetDbConfigDto,
   SetOperatorBetAmountLimitsDto,
   SetOperatorConfigDto,
   SetOperatorDefaultBetAmountLimitsDto,
   SetOperatorWebhookBaseUrlDto,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front'
import {
   GetOperatorListDto,
   GetOperatorListFindDto,
   GetOperatorListSortDto,
} from '@alienbackoffice/back-front/lib/operator/dto/get-operator-list.dto'
import { OperatorConfig } from '@alienbackoffice/back-front/lib/operator/interfaces/operator-config.interface'
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
   saveDefaultBetAmountLimits,
   saveOperatorBetAmountLimits,
   saveOperatorBetConfigData,
   saveOperatorDetails,
   selectAuthCurrentOperator,
   selectAuthUser,
} from 'redux/authSlice'
import { saveLoadingOperatorList } from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { hasDetailsPermission } from 'services/permissionHandler'
import { v4 as uuidv4 } from 'uuid'

export type UseGetOperatorListQueryProps = UseGetQueryProps & {
   opId?: string
   title?: string
   page?: number
   limit?: number
   isAssociated?: boolean
   sort?: GetOperatorListSortDto
   key: string
   autoRefresh?: number
}

type UseGetOperatorQueryProps = UseGetQueryProps & {
   opId?: string
   key?: string
}

type UseGetOperatorBrandsQueryProps = UseGetQueryProps & {
   opId: string
   key?: string
}

export const useGetOperatorListQuery = ({
   opId,
   title,
   page,
   isAssociated,
   limit = 50,
   sort = {},
   key,
   autoRefresh,
}: UseGetOperatorListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetOperatorListFindDto = {}
   if (title) find.title = title
   if (isAssociated) find.isAssociated = isAssociated
   const skip = page ? page * limit : 0
   const datafilter: GetOperatorListDto = { skip, limit, find, sort }
   if (opId) datafilter.opId = opId
   return useQuery({
      queryKey: [
         'operators',
         { skip, limit, ...find, sort, opId, autoRefresh },
      ],
      queryFn: async () => {
         store.dispatch(saveLoadingOperatorList(true))
         if (
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_OPERATOR_LIST_REQ
            )
         ) {
            boClient?.operator?.getOperatorList(
               { ...datafilter },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     type: key,
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_OPERATOR_LIST_REQ,
                  },
               }
            )
         }
         return {}
      },
      initialData: {},
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetOperatorBrandListQuery = ({
   opId,
   key,
}: UseGetOperatorBrandsQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const user: User = useSelector(selectAuthUser)

   return useQuery({
      queryKey: ['brands', { opId }],
      queryFn: async () => {
         if (user && user?.scope !== UserScope.BRAND) {
            boClient?.operator?.getOperatorBrands(
               { opId: opId },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     type: key,
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_BRANDS_REQ,
                  },
               }
            )
         }
         return {}
      },
      initialData: {},
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetOperatorWebhookBaseURL = ({
   opId,
   key,
}: UseGetOperatorBrandsQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const operator = useSelector(selectAuthCurrentOperator) as Operator

   return useQuery({
      queryKey: ['webhookbaseURL', { opId, operator }],
      queryFn: async () => {
         if (
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GET_OPERATOR_WEBHOOK_BASE_URL_REQ
            ) &&
            operator?.integrationType !== IntegrationType.ALIEN_STANDALONE
         ) {
            boClient?.operator?.getOperatorWebhookBaseUrl(
               { opId: opId },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     type: key,
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_WEBHOOK_BASE_URL_REQ,
                  },
               }
            )
         }
         return {}
      },
      initialData: {},
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetOperatorQuery = ({
   opId,
   key,
}: UseGetOperatorQueryProps) => {
   const boClient = useSelector(selectBoClient)

   return useQuery({
      queryKey: ['operator', { opId }],
      queryFn: async () => {
         if (opId) {
            if (
               hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_GET_OPERATOR_REQ
               )
            ) {
               boClient?.operator.getOperator(
                  { opId },
                  {
                     uuid: uuidv4(),
                     meta: {
                        ts: new Date(),
                        type: key,
                        sessionId: sessionStorage.getItem('sessionId'),
                        event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_REQ,
                     },
                  }
               )
            }
            if (
               hasDetailsPermission(
                  UserPermissionEvent.BACKOFFICE_GET_USED_CURRENCIES_REQ
               )
            ) {
               boClient?.operator.getUsedCurrencies(
                  { opId },
                  {
                     uuid: uuidv4(),
                     meta: {
                        ts: new Date(),
                        type: key,
                        sessionId: sessionStorage.getItem('sessionId'),
                        event: UserPermissionEvent.BACKOFFICE_GET_USED_CURRENCIES_REQ,
                     },
                  }
               )
            }
         }

         return {}
      },
      initialData: {
         opId: '',
         title: '',
         isAssociated: false,
         isLocked: false,
         status: OperatorStatus.ACTIVE,
         history: [],
         webhookAuthorizationToken: '',
         webhookBaseUrl: '',
         ips: [],
         currency: '',
         minStake: 0,
         maxStake: 0,
         maxWinAmount: 0,
         minStakeByCurrency: {},
         maxStakeByCurrency: {},
         maxWinAmountByCurrency: {},
         lang: '',
         theme: '',
         waitForPlayerDisconnectProcess: 0,
         awpsExpirationTime: 0,
         idlePlayerTimeout: 0,
         retryTiming: [],
         webhookPlayerInfoTimeout: 0,
         webhookBetTimeout: 0,
         webhookResultTimeout: 0,
         webhookRollbackTimeout: 0,
         validateCurrency: true,
         databaseConnectionString: '',
         usedCurrencies: [],
         brands: [],
         apiAuthorizationToken: '',
      },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useGetOperatorConfigQuery = ({
   opId = '',
}: UseGetOperatorQueryProps) => {
   const boClient = useSelector(selectBoClient)

   return useQuery({
      queryKey: ['config', { opId }],
      queryFn: async () => {
         if (
            opId &&
            hasDetailsPermission(
               UserPermissionEvent.BACKOFFICE_GET_OPERATOR_CONFIG_REQ
            )
         ) {
            boClient?.operator.getOperatorConfig(
               { opId },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_CONFIG_REQ,
                  },
               }
            )
         }

         return {}
      },
      initialData: {
         webhookAuthorizationToken: '',
         webhookBaseUrl: '',
         ips: [],
         currency: '',
         minStake: 0,
         maxStake: 0,
         maxWinAmount: 0,
         lang: '',
         theme: '',
         waitForPlayerDisconnectProcess: 0,
         awpsExpirationTime: 0,
         idlePlayerTimeout: 0,
         retryTiming: [],
         webhookPlayerInfoTimeout: 0,
         webhookBetTimeout: 0,
         webhookResultTimeout: 0,
         webhookRollbackTimeout: 0,
         validateCurrency: true,
         databaseConnectionString: '',
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

export const useCreateOperatorMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: Operator; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: CreateOperatorDto; traceData?: Pick<any, 'traceData'> },
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
            event: UserPermissionEvent.BACKOFFICE_CREATE_OPERATOR_REQ,
         }
         boClient?.operator.createOperator(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.operator.onCreateOperatorResponse(async (result) => {
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
      onError: (error, variables, context) => {
         mutationOptions?.onError?.(error, variables, context)
      },
   })
}

export const useCreateEmptyOperatorMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: Operator; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: CreateEmptyOperatorDto; traceData?: Pick<any, 'traceData'> },
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
            event: UserPermissionEvent.BACKOFFICE_CREATE_EMPTY_OPERATOR_REQ,
         }
         const data: CreateEmptyOperatorDto = {
            ...dto,
         }
         if (!dto.databaseName || dto.databaseName === '') {
            delete data.databaseName
         }
         if (
            !dto.databaseConnectionString ||
            dto.databaseConnectionString === ''
         ) {
            delete data.databaseConnectionString
         }
         boClient?.operator.createEmptyOperator(data, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.operator.onCreateEmptyOperatorResponse(async (result) => {
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
      onError: (error, variables, context) => {
         mutationOptions?.onError?.(error, variables, context)
      },
   })
}

export const useSetOperatorConfigMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: OperatorConfig; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: SetOperatorConfigDto; traceData?: Pick<any, 'traceData'> },
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
            type: 'details',
            ...traceData,
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_SET_OPERATOR_CONFIG_REQ,
         }
         boClient?.operator.setOperatorConfig(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetOperatorConfigResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
                  boClient.operator.getOperator(
                     { opId: dto.opId },
                     { uuid: uuidv4(), meta }
                  )
                  boClient.operator.getOperatorConfig(
                     { opId: dto.opId },
                     { uuid: uuidv4(), meta }
                  )
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
         queryClient.invalidateQueries({ queryKey: ['operatorConfig'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useEditOperatorMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Operator
         traceData: Pick<OnEditOperatorResponseParams, 'traceData'>
      },
      string,
      {
         dto: EditOperatorDto
         traceData?: Pick<OnEditOperatorResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_EDIT_OPERATOR_REQ,
         }
         boClient?.operator?.editOperator(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.operator.onEditOperatorResponse(async (result) => {
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

export const useLockedOperatorMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Operator
         traceData: Pick<OnLockOperatorResponseParams, 'traceData'>
      },
      string,
      {
         dto: LockOperatorDto
         traceData?: Pick<OnLockOperatorResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_LOCK_OPERATOR_REQ,
         }
         boClient?.operator?.lockOperator(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.operator.onLockOperatorResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
                  toast.success(
                     `You ${
                        result.data?.isLocked ? 'locked' : 'unlocked'
                     } the operator successfully`,
                     {
                        position: toast.POSITION.TOP_CENTER,
                     }
                  )
                  store.dispatch(saveOperatorDetails(result.data))
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
            })
         })
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['operators'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useEditOperatorBrandMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Operator
         traceData: Pick<OnEditOperatorBrandsResponseParams, 'traceData'>
      },
      string,
      {
         dto: EditOperatorBrandsDto
         traceData?: Pick<OnEditOperatorBrandsResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_EDIT_OPERATOR_BRANDS_REQ,
         }
         boClient?.operator?.editOperatorBrands(dto, { uuid: uuidv4(), meta })
         return new Promise((resolve, reject) => {
            boClient?.operator.onEditOperatorBrandsResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
                  store.dispatch(saveOperatorDetails(result.data))
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
         queryClient.invalidateQueries({ queryKey: ['operators'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useSetOperatorBetAmountLimitsMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: BetAmountLimits; traceData?: Pick<any, 'traceData'> },
      string,
      {
         dto: SetOperatorBetAmountLimitsDto
         traceData?: Pick<any, 'traceData'>
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
            type: 'details',
            ...traceData,
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_SET_OPERATOR_BET_AMOUNT_LIMITS_REQ,
         }
         boClient?.operator.setOperatorBetAmountLimits(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetOperatorBetAmountLimitsResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                     if (
                        hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_OPERATOR_REQ
                        )
                     ) {
                        boClient.operator.getOperator(
                           { opId: dto.opId },
                           {
                              uuid: uuidv4(),
                              meta: {
                                 ...meta,
                                 event: UserPermissionEvent.BACKOFFICE_GET_OPERATOR_REQ,
                              },
                           }
                        )
                     }
                     if (
                        hasDetailsPermission(
                           UserPermissionEvent.BACKOFFICE_GET_OPERATOR_CONFIG_REQ
                        )
                     ) {
                        boClient.operator.getOperatorConfig(
                           { opId: dto.opId },
                           { uuid: uuidv4(), meta }
                        )
                     }
                     store.dispatch(saveOperatorBetAmountLimits(result.data))
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
         queryClient.invalidateQueries({ queryKey: ['operatorConfig'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useSetDefaultBetAmountLimitsMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: BetAmountLimits; traceData?: Pick<any, 'traceData'> },
      string,
      {
         dto: SetOperatorDefaultBetAmountLimitsDto
         traceData?: Pick<any, 'traceData'>
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
            type: 'details',
            ...traceData,
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_SET_OPERATOR_DEFAULT_BET_AMOUNT_LIMITS_REQ,
         }
         boClient?.operator.setOperatorDefaultBetAmountLimits(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetOperatorDefaultBetAmountLimitsResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                     store.dispatch(saveDefaultBetAmountLimits(result.data))
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
         queryClient.invalidateQueries({ queryKey: ['operatorConfig'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useSetWebhookBaseURLMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: string
         traceData: Pick<OnSetOperatorWebhookBaseUrlResponseParams, 'traceData'>
      },
      string,
      {
         dto: SetOperatorWebhookBaseUrlDto
         traceData?: Pick<
            OnSetOperatorWebhookBaseUrlResponseParams,
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
            type: 'details',
            ...traceData,
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_SET_OPERATOR_WEBHOOK_BASE_URL_REQ,
         }
         boClient?.operator?.setOperatorWebhookBaseUrl(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator?.onSetOperatorWebhookBaseUrlResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                     boClient.operator.getOperator(
                        { opId: dto.opId },
                        { uuid: uuidv4(), meta }
                     )
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
         queryClient.invalidateQueries({ queryKey: ['player'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useSetBetConfigOperatorMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: {
            connectionString: string
            dbName: string
         }
         traceData: Pick<OnSetBetDbConfigResponseParams, 'traceData'>
      },
      string,
      {
         dto: SetBetDbConfigDto
         traceData?: Pick<OnSetBetDbConfigResponseParams, 'traceData'>
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
            type: 'details',
            ...traceData,
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_SET_BET_DB_CONFIG_REQ,
         }
         boClient?.operator?.setBetDbConfig(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator?.onSetBetDbConfigResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
                  store.dispatch(saveOperatorBetConfigData(result.data))
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
