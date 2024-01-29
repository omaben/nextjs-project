import {
   SetTopupCurrenciesDto,
   UserPermissionEvent
} from '@alienbackoffice/back-front'
import {
   UseMutationOptions,
   useMutation,
   useQueryClient
} from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { saveTopupCurrencies } from 'redux/authSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { v4 as uuidv4 } from 'uuid'

export const useSetOperatorTopUpCurrenciesMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: string[]; traceData?: Pick<any, 'traceData'> },
      string,
      {
         dto: SetTopupCurrenciesDto
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
            event: UserPermissionEvent.BACKOFFICE_SET_TOPUP_CURRENCIES_REQ,
         }
         boClient?.operator.setTopupCurrencies(dto, {
            uuid: uuidv4(),
            meta,
         })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetTopupCurrenciesResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
                  store.dispatch(saveTopupCurrencies(result.data))
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
