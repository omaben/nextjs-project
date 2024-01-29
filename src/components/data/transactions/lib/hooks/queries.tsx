import {
   AddOperatorWithdrawDto,
   OnAddOperatorWithdrawResponseParams,
   OnSetOperatorWithdrawStatusResponseParams,
   OnSetWithdrawStatusResponseParams,
   OnValidatePaymentResponseParams,
   OperatorTransaction,
   SetOperatorWithdrawStatusDto,
   SetWithdrawStatusDto,
   Transaction,
   TransactionType,
   UserPermissionEvent,
   ValidatePaymentDto,
} from '@alienbackoffice/back-front'
import { GetOperatorTransactionListFindDto } from '@alienbackoffice/back-front/lib/wallet/dto/get-operator-transaction-list.dto'
import {
   GetTransactionListFindDto,
   GetTransactionListSortDto,
} from '@alienbackoffice/back-front/lib/wallet/dto/get-transaction-list.dto'
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
   saveLoadingOperatorTransactionList,
   saveLoadingTransactionList,
   saveLoadingWalletBalanceList,
} from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { v4 as uuidv4 } from 'uuid'

export type UseGetTransactionListQueryProps = UseGetQueryProps & {
   searchText?: string
   playerId?: string
   nickname?: string
   txId?: string
   fromCurrency?: string
   toCurrency?: string
   fromAmount?: number
   toAmount?: number
   type?: any
   types?: TransactionType[]
   isTest?: boolean
   isFun?: boolean
   page?: number
   limit?: number
   sort?: GetTransactionListSortDto
   key: string
   opId: string
   refresh?: number
   from?: number
   to?: number
   status?: any
   excludePendingDeposit?: boolean
   brandId?: string
   gateway?: string
   destinationAddress?: string
   iban?: string
   bankName?: string
   autoRefresh?: number
}

export const useGetTransactionListQuery = ({
   page,
   limit = 50,
   sort = {},
   playerId,
   fromCurrency,
   toCurrency,
   fromAmount,
   toAmount,
   type,
   txId,
   key,
   opId,
   from,
   refresh,
   to,
   status,
   excludePendingDeposit,
   brandId,
   gateway,
   isFun,
   destinationAddress,
   iban,
   bankName,
   isTest,
   autoRefresh,
}: UseGetTransactionListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetTransactionListFindDto = {}
   find.excludePendingDeposit = excludePendingDeposit
   if (destinationAddress) {
      find.destination = destinationAddress
   }
   if (playerId) {
      find.playerId = playerId
   }
   if (status !== 'all') {
      find.status = status
   }
   if (bankName !== 'all') {
      find.bankName = bankName
   }
   if (gateway !== 'all') {
      find.gateway = gateway
   }
   if (txId) {
      find.txId = txId
   }
   if (fromAmount) {
      find.fromAmount = fromAmount
   }
   if (toAmount) {
      find.toAmount = toAmount
   }
   if (fromCurrency !== 'all') {
      find.fromCurrency = fromCurrency
   }
   if (toCurrency !== 'all') {
      find.toCurrency = toCurrency
   }
   if (type !== 'all') {
      find.type = type
   }
   if (from) find.from = from
   if (iban) find.iban = iban
   if (to) find.to = to
   if (isFun !== undefined) find.isFun = isFun
   if (isTest !== undefined) find.isTest = isTest
   const skip = page ? page * limit : 0

   return useQuery({
      queryKey: [
         'transactions',
         {
            skip,
            limit,
            ...find,
            sort,
            refresh,
            opId: opId,
            brandId,
            autoRefresh,
         },
      ],
      queryFn: async () => {
         store.dispatch(saveLoadingTransactionList(true))
         // store.dispatch(saveTransactions([]))
         boClient?.wallet?.getTransactionList(
            { skip, limit, find, sort, opId: opId, brandId },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  type: key,
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_TRANSACTION_LIST_REQ,
               },
            }
         )
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

export const useGetOperatorTransactionListQuery = ({
   page,
   limit = 50,
   sort = {},
   fromCurrency,
   toCurrency,
   fromAmount,
   toAmount,
   type,
   txId,
   key,
   opId,
   from,
   refresh,
   to,
   status,
   excludePendingDeposit,
   brandId,
   autoRefresh,
}: UseGetTransactionListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetOperatorTransactionListFindDto = {}
   find.excludePendingDeposit = excludePendingDeposit
   if (status !== 'all') {
      find.status = status
   }
   if (txId) {
      find.txId = txId
   }
   if (fromAmount) {
      find.fromAmount = fromAmount
   }
   if (toAmount) {
      find.toAmount = toAmount
   }
   if (fromCurrency !== 'all') {
      find.fromCurrency = fromCurrency
   }
   if (toCurrency !== 'all') {
      find.toCurrency = toCurrency
   }
   if (type !== 'all') {
      find.type = type
   }
   if (from) find.from = from
   if (to) find.to = to
   const skip = page ? page * limit : 0

   return useQuery({
      queryKey: [
         'transactions',
         {
            skip,
            limit,
            ...find,
            sort,
            refresh,
            opId: opId,
            brandId,
            autoRefresh,
         },
      ],
      queryFn: async () => {
         store.dispatch(saveLoadingOperatorTransactionList(true))
         // store.dispatch(saveTransactions([]))
         boClient?.wallet?.getOperatorTransactionList(
            { skip, limit, find, sort, opId: opId, brandId },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  type: key,
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_OPERATOR_TRANSACTION_LIST_REQ,
               },
            }
         )
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

export const useGetWalletBalanceListQuery = ({
   opId,
   brandId,
   autoRefresh,
}: {
   opId: string
   brandId?: string
   autoRefresh?: number
}) => {
   const boClient = useSelector(selectBoClient)

   return useQuery({
      queryKey: ['walletBalance', { opId: opId, brandId, autoRefresh }],
      queryFn: async () => {
         store.dispatch(saveLoadingWalletBalanceList(true))
         if (brandId) {
            boClient?.wallet?.GetWalletBalance(
               { opId: opId, brandId },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GET_WALLET_BALANCE_REQ,
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

export const useWithdrawStatusMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Transaction
         traceData: Pick<OnSetWithdrawStatusResponseParams, 'traceData'>
      },
      string,
      {
         dto: SetWithdrawStatusDto
         traceData?: Pick<OnSetWithdrawStatusResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SET_WITHDRAW_STATUS_REQ,
         }
         boClient?.wallet.setWithdrawStatus(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.wallet.onSetWithdrawStatusResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
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

export const useOperatorWithdrawStatusMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: OperatorTransaction
         traceData: Pick<OnSetOperatorWithdrawStatusResponseParams, 'traceData'>
      },
      string,
      {
         dto: SetOperatorWithdrawStatusDto
         traceData?: Pick<
            OnSetOperatorWithdrawStatusResponseParams,
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
            event: UserPermissionEvent.BACKOFFICE_SET_OPERATOR_WITHDRAW_STATUS_REQ,
         }
         boClient?.wallet.setOperatorWithdrawStatus(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.wallet.onSetOperatorWithdrawStatusResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
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

export const useDepositStatusMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Transaction
         traceData: Pick<OnValidatePaymentResponseParams, 'traceData'>
      },
      string,
      {
         dto: ValidatePaymentDto
         traceData?: Pick<OnValidatePaymentResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_VALIDATE_PAYMENT_REQ,
         }
         boClient?.wallet.validatePayment(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.wallet.onValidatePaymentResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
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

export const useAddOperatorWithdrawMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: boolean
         traceData: Pick<OnAddOperatorWithdrawResponseParams, 'traceData'>
      },
      string,
      {
         dto: AddOperatorWithdrawDto
         traceData?: Pick<OnAddOperatorWithdrawResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_ADD_OPERATOR_WITHDRAW_REQ,
         }
         boClient?.wallet.addOperatorWithdraw(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.wallet.onAddOperatorWithdrawResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
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
