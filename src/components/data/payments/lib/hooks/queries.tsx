import {
   GetActivePaymentGatewaysDto,
   OnSetJbPaymentGatewayResponseParams,
   OnSetPaymentGatewayCurrenciesResponseParams,
   SetPaymentGatewayCurrenciesDto,
   User,
   UserPermissionEvent,
   UserScope,
} from '@alienbackoffice/back-front'
import { OnSetCpgPaymentGatewayResponseParams } from '@alienbackoffice/back-front/lib/backoffice/interfaces/on-set-cpg-payment-gateway-response-params.interface'
import { OnSetPwPaymentGatewayResponseParams } from '@alienbackoffice/back-front/lib/backoffice/interfaces/on-set-pw-payment-gateway-response-params.interface'
import { SetCpgPaymentGatewayDto } from '@alienbackoffice/back-front/lib/operator/dto/set-cpg-payment-gateway.dto'
import { SetJbPaymentGatewayDto } from '@alienbackoffice/back-front/lib/operator/dto/set-jb-payment-gateway.dto'
import { SetPwPaymentGatewayDto } from '@alienbackoffice/back-front/lib/operator/dto/set-pw-payment-gateway.dto'
import { CpgPaymentGateway } from '@alienbackoffice/back-front/lib/payment-gateways/cpg/interfaces/cpg-payment-gateway.interface'
import { JbPaymentGateway } from '@alienbackoffice/back-front/lib/payment-gateways/jb/interfaces/jb-payment-gateway.interface'
import { PwPaymentGateway } from '@alienbackoffice/back-front/lib/payment-gateways/pw/interfaces/pw-payment-gateway.interface'
import {
   UseMutationOptions,
   useMutation,
   useQuery,
   useQueryClient,
} from '@tanstack/react-query'
import { UseGetQueryProps } from 'lib/types'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { selectAuthUser } from 'redux/authSlice'
import { selectBoClient } from 'redux/socketSlice'
import { v4 as uuidv4 } from 'uuid'
export type UseGetPaymentGetwaysOperatoQueryProps = UseGetQueryProps & {
   opId: string
}
export type UseGetPaymentsListQueryProps = UseGetQueryProps & {
   key: string
   autoRefresh?: number
}

export type UseGetPaymentsListBrandQueryProps = UseGetQueryProps & {
   key: string
   opId: string
   brandId?: string
   autoRefresh?: number
}

export const useGetActivePaymentsListQuery = ({
   key,
   opId,
   brandId,
   autoRefresh,
}: UseGetPaymentsListBrandQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const dto: GetActivePaymentGatewaysDto = { opId }
   if (brandId) {
      dto.brandId = brandId
   }
   const user: User = useSelector(selectAuthUser)

   return useQuery({
      queryKey: ['activePayments', { opId, brandId, autoRefresh }],
      queryFn: async () => {
         if (
            (!dto.brandId && user?.scope !== UserScope.BRAND) ||
            (dto.brandId && key === 'brand')
         ) {
            boClient?.operator?.getActivePaymentGateways(
               { ...dto },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     type: key,
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GET_ACTIVE_PAYMENT_GATEWAYS_REQ,
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

export const useGetPaymentsListQuery = ({
   key,
   autoRefresh,
}: UseGetPaymentsListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const user: User = useSelector(selectAuthUser)

   return useQuery({
      queryKey: ['payments', { autoRefresh }],
      queryFn: async () => {
         if ([UserScope.ADMIN, UserScope.SUPERADMIN].includes(user?.scope)) {
            boClient?.wallet?.getPaymentGateways(
               {},
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     type: key,
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GET_PAYMENT_GATEWAYS_REQ,
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

export const useSetPWPaymentGatewayMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: PwPaymentGateway
         traceData: Pick<OnSetPwPaymentGatewayResponseParams, 'traceData'>
      },
      string,
      {
         dto: SetPwPaymentGatewayDto
         traceData?: Pick<OnSetPwPaymentGatewayResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SET_PW_PAYMENT_GATEWAY_REQ,
         }
         boClient?.operator.setPwPaymentGateway(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetPwPaymentGatewayResponse(async (result) => {
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

export const useSetPaymentGatewayCurrenciesMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: boolean
         traceData: Pick<
            OnSetPaymentGatewayCurrenciesResponseParams,
            'traceData'
         >
      },
      string,
      {
         dto: SetPaymentGatewayCurrenciesDto
         traceData?: Pick<
            OnSetPaymentGatewayCurrenciesResponseParams,
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
            event: UserPermissionEvent.BACKOFFICE_SET_PAYMENT_GATEWAY_CURRENCIES_REQ,
         }
         boClient?.operator.setPaymentGatewayCurrencies(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetPaymentGatewayCurrenciesResponse(
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

export const useSetJBPaymentGatewayMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: JbPaymentGateway
         traceData: Pick<OnSetJbPaymentGatewayResponseParams, 'traceData'>
      },
      string,
      {
         dto: SetJbPaymentGatewayDto
         traceData?: Pick<OnSetJbPaymentGatewayResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SET_JB_PAYMENT_GATEWAY_REQ,
         }
         boClient?.operator.setJbPaymentGateway(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetJbPaymentGatewayResponse(async (result) => {
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
         queryClient.invalidateQueries({ queryKey: ['paymentGatwayJB'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}

export const useSetCPGPaymentGatewayMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: CpgPaymentGateway
         traceData: Pick<OnSetCpgPaymentGatewayResponseParams, 'traceData'>
      },
      string,
      {
         dto: SetCpgPaymentGatewayDto
         traceData?: Pick<OnSetCpgPaymentGatewayResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SET_CPG_PAYMENT_GATEWAY_REQ,
         }
         boClient?.operator.setCpgPaymentGateway(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetCpgPaymentGatewayResponse(
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
         queryClient.invalidateQueries({ queryKey: ['paymentGatwayJB'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}
