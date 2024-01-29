import {
   CashInCashOut,
   ForceCashOutDto,
   GetCashInCashOutListDto,
   OnForceCashOutResponseParams,
   UserPermissionEvent,
} from '@alienbackoffice/back-front';
import { GetCashInCashOutListFindDto } from '@alienbackoffice/back-front/lib/cash-in-cash-out/dto/get-cash-in-cash-out-list.dto';
import { UseMutationOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UseGetQueryProps } from 'lib/types';
import { useSelector } from 'react-redux';
import { saveLoadingCashinCashout } from 'redux/loadingSlice';
import { selectBoClient } from 'redux/socketSlice';
import { store } from 'redux/store';
import { v4 as uuidv4 } from 'uuid';

export type UseGetCashinCashoutListQueryProps = UseGetQueryProps & {
   opId: string;
   playerId?: string;
   placedAtFrom: number;
   placedAtTo: number;
   status?: 'open' | 'close';
   page: number;
   limit: number;
   sort: {};
   key: string;
   nickname?: string;
   autoRefresh?: number;
   refresh?: number;
   cashierId?: string;
   version?: string;
};

export const useGetCashinCashoutListQuery = ({
   page,
   limit,
   opId,
   playerId,
   placedAtFrom,
   placedAtTo,
   status,
   sort,
   key,
   nickname,
   autoRefresh,
   refresh,
   cashierId,
   version,
}: UseGetCashinCashoutListQueryProps) => {
   const boClient = useSelector(selectBoClient);
   const find: GetCashInCashOutListFindDto = {
      cashedInAtFrom: placedAtFrom,
      cashedInAtTo: placedAtTo,
   };
   if (nickname) find.nickname = nickname;
   if (playerId) find.playerId = playerId;
   if (cashierId) find.cashierId = cashierId;
   if (version) find.version = version;
   if (status) find.isOpen = status === 'open' ? true : false;
   const skip = page ? page * limit : 0;
   return useQuery({
      queryKey: [
         'cashin-cashout-list',
         {
            skip,
            limit,
            ...find,
            sort,
            opId,
            autoRefresh,
            refresh,
         },
      ],
      queryFn: async () => {
         if (opId) {
            const findData: GetCashInCashOutListDto = {
               find,
               sort: sort,
               limit,
               skip,
               opId,
            };
            store.dispatch(saveLoadingCashinCashout(true));
            boClient?.cashInCashOut.getCashInCashOutList(
               { ...findData },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     type: key,
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_CASH_IN_CASH_OUT_LIST_REQ,
                  },
               }
            );
         }
         return {};
      },
      initialData: { count: 0, cashinCashout: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   });
};


export const useForceCashOutMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: CashInCashOut;
         traceData: Pick<OnForceCashOutResponseParams, 'traceData'>;
      },
      string,
      {
         dto: ForceCashOutDto;
         traceData?: Pick<OnForceCashOutResponseParams, 'traceData'>;
      },
      unknown
   >
) => {
   const boClient = useSelector(selectBoClient);
   const queryClient = useQueryClient();

   return useMutation({
      ...mutationOptions,
      mutationFn: ({ dto, traceData }) => {
         const meta = {
            ts: new Date(),
            ...traceData,
            sessionId: sessionStorage.getItem('sessionId'),
            event: UserPermissionEvent.BACKOFFICE_FORCE_CASH_OUT_REQ,
         };
         boClient?.cashInCashOut?.forceCashOut(dto, {
            uuid: uuidv4(),
            meta,
         });

         return new Promise((resolve, reject) => {
            boClient?.cashInCashOut.onForceCashOutResponse(
               async (result) => {
                  if (result.success) {
                     resolve({
                        data: result.data,
                        traceData: result.traceData,
                     });
                  } else {
                     let message = result.message;
                     if (message === 'Access denied.') {
                        message = `Access denied to ${result.traceData?.meta?.event}`;
                     }
                     reject(message);
                  }
               }
            );
         });
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['player'] });
         mutationOptions?.onSuccess?.(data, variables, context);
      },
   });
};
