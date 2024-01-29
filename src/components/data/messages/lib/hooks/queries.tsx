import {
   MessagesInLanguageInBrand,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { OnSetMessagesInLanguageResponseParams } from '@alienbackoffice/back-front/lib/backoffice/interfaces/on-set-messages-in-language-response-params.interface'
import { SetMessagesInLanguageDto } from '@alienbackoffice/back-front/lib/operator/dto/set-messages-in-language.dto'
import {
   UseMutationOptions,
   useMutation,
   useQuery,
   useQueryClient,
} from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { saveLoadingMessagesInLanguageInBrand } from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { v4 as uuidv4 } from 'uuid'

export type GetMessagesInLanguageDtoParams = {
   opId?: string
   brandId?: string
}
export const useGetMessagesInLanguageQuery = ({
   opId,
   brandId,
}: GetMessagesInLanguageDtoParams) => {
   const boClient = useSelector(selectBoClient)
   return useQuery({
      queryKey: ['messagesInLanguage', { opId, brandId }],
      queryFn: async () => {
         if (opId && brandId) {
            store.dispatch(saveLoadingMessagesInLanguageInBrand(true))
            boClient?.operator.getMessagesInLanguage(
               { brandId, opId },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_GET_MESSAGES_IN_LANGUAGE_REQ,
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

export const useSetMessagesInLanguageQuery = (
   mutationOptions?: UseMutationOptions<
      {
         data?: MessagesInLanguageInBrand
         traceData: Pick<OnSetMessagesInLanguageResponseParams, 'traceData'>
      },
      string,
      {
         dto: SetMessagesInLanguageDto
         traceData?: Pick<OnSetMessagesInLanguageResponseParams, 'traceData'>
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
            event: UserPermissionEvent.BACKOFFICE_SET_MESSAGES_IN_LANGUAGE_REQ,
         }
         boClient?.operator.setMessagesInLanguage(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.operator.onSetMessagesInLanguageResponse(
               async (result) => {
                  if (result.success) {
                     resolve({ data: result.data, traceData: result.traceData })
                     boClient?.operator.getMessagesInLanguage(
                        { brandId: dto.brandId, opId: dto.opId },
                        {
                           uuid: uuidv4(),
                           meta: {
                              ts: new Date(),
                              sessionId: sessionStorage.getItem('sessionId'),
                              event: UserPermissionEvent.BACKOFFICE_GET_MESSAGES_IN_LANGUAGE_REQ,
                           },
                        }
                     )
                  } else {
                     let message = result.message
                     if (message === 'Access denied.') {
                        message = `Access denied to ${result.traceData?.meta?.event}`
                     }
                     reject(message)
                     toast.error(message, {
                        position: toast.POSITION.TOP_CENTER
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
