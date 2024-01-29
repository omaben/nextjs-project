import {
   Bet,
   BetStatus,
   OnRollbackOpenBetResponseParams,
   RollbackOpenBetDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front';
import {
   GetBetListDto,
   GetBetListFindDto,
} from '@alienbackoffice/back-front/lib/bet/dto/get-bet-list.dto';
import {
   UseMutationOptions,
   useMutation,
   useQuery,
   useQueryClient,
} from '@tanstack/react-query';
import { UseGetQueryProps } from 'lib/types';
import { useSelector } from 'react-redux';
import {
   saveLoadingBigLosses,
   saveLoadingBigWins,
   saveLoadingHighRollers,
   saveLoadingLatestWins,
   saveLoadingLuckWins,
   saveloadingBetsList,
} from 'redux/loadingSlice';
import { selectBoClient } from 'redux/socketSlice';
import { store } from 'redux/store';
import { betListType } from 'types';
import { v4 as uuidv4 } from 'uuid';

export type UseGetBetsListQueryProps = UseGetQueryProps & {
   opId: string;
   betId?: string;
   gameId?: string;
   playerId?: string;
   placedAtFrom?: number;
   placedAtTo?: number;
   currency?: string;
   status?: BetStatus[];
   page: number;
   limit: number;
   brandId?: string;
   statuses?: BetStatus[];
   sort: {};
   key: string;
   browserId?: string;
   isTest?: boolean;
   nickname?: string;
   gameTitle?: string;
   isFun?: boolean;
   searchDate?: number;
   autoRefresh?: number;
   refresh?: number;
   version?: string;
   cashierId?: string;
};

export const useGetBetsListQuery = ({
   searchText = '',
   page,
   limit,
   opId,
   betId,
   gameId,
   playerId,
   placedAtFrom,
   placedAtTo,
   currency,
   status,
   statuses,
   brandId,
   sort,
   key,
   isTest,
   nickname,
   gameTitle,
   isFun,
   searchDate,
   autoRefresh,
   refresh,
   version,
   cashierId,
}: UseGetBetsListQueryProps) => {
   const boClient = useSelector(selectBoClient);
   const find: GetBetListFindDto = {};
   if (betId) find.betId = betId;
   if (nickname) find.nickname = nickname;
   if (gameTitle) find.gameTitle = gameTitle;
   if (playerId) find.playerId = playerId;
   if (statuses) find.statuses = statuses;
   if (gameId) find.gameId = gameId;
   if (version) find.version = version;
   if (cashierId) find.cashierId = cashierId;
   if (currency !== 'all') find.currency = currency;
   if (status && status?.length > 0) find.statuses = status;
   if (placedAtFrom) find.placedAtFrom = placedAtFrom;
   if (placedAtTo) find.placedAtTo = placedAtTo;
   if (isTest !== undefined) find.isTest = isTest;
   if (isFun !== undefined) find.isFun = isFun;
   const skip = page ? page * limit : 0;
   return useQuery({
      queryKey: [
         'bets',
         {
            skip,
            limit,
            ...find,
            sort,
            opId,
            brandId,
            searchDate,
            autoRefresh,
            refresh,
         },
      ],
      queryFn: async () => {
         if (opId) {
            const findData: GetBetListDto = {
               find,
               sort: sort,
               limit,
               skip,
               opId,
            };
            if (brandId) {
               findData.brandId = brandId;
            }
            boClient?.bet.getBetList(
               { ...findData },
               {
                  uuid: uuidv4(),
                  meta: {
                     ts: new Date(),
                     type: key,
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_BET_LIST_REQ,
                  },
               }
            );
            if (key === betListType.LATESTWINS) {
               store.dispatch(saveLoadingLatestWins(true));
            }
            if (key === betListType.BIGWINS) {
               store.dispatch(saveLoadingBigWins(true));
            }
            if (key === betListType.BIGLOSSES) {
               store.dispatch(saveLoadingBigLosses(true));
            }
            if (key === betListType.HIGHROLLERS) {
               store.dispatch(saveLoadingHighRollers(true));
            }
            if (key === betListType.LUCKYWINS) {
               store.dispatch(saveLoadingLuckWins(true));
            }
            if (key === betListType.LIST) {
               store.dispatch(saveloadingBetsList(true));
            }
         }
         return {};
      },
      initialData: { count: 0, bets: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   });
};

export const useRollBackMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Bet;
         traceData: Pick<OnRollbackOpenBetResponseParams, 'traceData'>;
      },
      string,
      {
         dto: RollbackOpenBetDto;
         traceData?: Pick<OnRollbackOpenBetResponseParams, 'traceData'>;
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
            event: UserPermissionEvent.BACKOFFICE_ROLLBACK_OPEN_BET_REQ,
         };
         boClient?.bet?.rollbackOpenBet(dto, { uuid: uuidv4(), meta });

         return new Promise((resolve, reject) => {
            boClient?.bet.onRollbackOpenBetResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData });
               } else {
                  let message = result.message;
                  if (message === 'Access denied.') {
                     message = `Access denied to ${result.traceData?.meta?.event}`;
                  }
                  reject(message);
               }
            });
         });
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['player'] });
         mutationOptions?.onSuccess?.(data, variables, context);
      },
   });
};
