import {
   GetKycVerificationsDto,
   KycVerification,
   SetKycVerificationsDto,
   SetOperatorBetAmountLimitsDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { OperatorConfig } from '@alienbackoffice/back-front/lib/operator/interfaces/operator-config.interface'
import {
   UseMutationOptions,
   useMutation,
   useQuery,
   useQueryClient,
} from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { saveKycVerification } from 'redux/authSlice'
import { saveLoadingKycVerification } from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { v4 as uuidv4 } from 'uuid'

export const useGetOperatorKycVerificationMutation = ({
   opId,
   brandId,
}: GetKycVerificationsDto) => {
   const boClient = useSelector(selectBoClient)

   return useQuery({
      queryKey: ['KycVerification', { opId, brandId }],
      queryFn: async () => {
         store.dispatch(saveLoadingKycVerification(true))
         // store.dispatch(saveOperatorsList([]))
         boClient?.operator?.getKycVerifications(
            { opId, brandId },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_KYC_VERIFICATIONS_REQ,
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

export const useSetOperatorKycVerificationMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: KycVerification[]; traceData?: Pick<any, 'traceData'> },
      string,
      {
         dto: SetKycVerificationsDto
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
            ...traceData,
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_SET_KYC_VERIFICATIONS_REQ,
         }
         boClient?.operator.setKycVerifications(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetKycVerificationsResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
                  store.dispatch(saveKycVerification(result.data))
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
         queryClient.invalidateQueries({ queryKey: ['kycVerifications'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
   })
}
