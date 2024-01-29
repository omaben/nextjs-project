import {
   AllocateWalletAddressDto,
   ConfirmPlayerKycVerificationDto,
   DeletePlayerDto,
   GetPlayerDto,
   GetRelatedPlayersDto,
   IntegrationType,
   OnSetPlayerChatIsBlockedResponseParams,
   OnSetPlayerIsBlockedResponseParams,
   OnSetPlayerIsTestResponseParams,
   OnSetPlayerNicknameResponseParams,
   OnSetPlayerNoteResponseParams,
   OnUpdatePlayerStatsResponseParams,
   Operator,
   Player,
   RejectPlayerKycVerificationDto,
   SetPlayerChatIsBlockedDto,
   SetPlayerIsBlockedDto,
   SetPlayerIsTestDto,
   SetPlayerNicknameDto,
   SetPlayerNoteDto,
   UpdatePlayerStatsDto,
   UpdateWalletDto,
   UserPermissionEvent
} from '@alienbackoffice/back-front';
import { OnTopupResponseParams } from '@alienbackoffice/back-front/lib/backoffice/interfaces/on-topup-response-params.interface';
import {
   GetPlayerListFindDto,
   GetPlayerListSortDto,
} from '@alienbackoffice/back-front/lib/player/dto/get-player-list.dto';
import { SetPlayerKycVerificationRequirementDto } from '@alienbackoffice/back-front/lib/player/dto/set-player-kyc-verification-requirement.dto';
import { TopupDto } from '@alienbackoffice/back-front/lib/player/dto/topup.dto';
import { PlayerKycVerification } from '@alienbackoffice/back-front/lib/player/interfaces/player-kyc-verification.interface';
import {
   UseMutationOptions,
   useMutation,
   useQuery,
   useQueryClient,
} from '@tanstack/react-query';
import { UseGetQueryProps } from 'lib/types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectAuthCurrentOperator } from 'redux/authSlice';
import {
   saveLoadingPlayersList,
   saveLoadingRelatedAccounts,
} from 'redux/loadingSlice';
import { selectBoClient } from 'redux/socketSlice';
import { store } from 'redux/store';
import { v4 as uuidv4 } from 'uuid';

export type UseGetPlayersListQueryProps = UseGetQueryProps & {
   opId: string;
   playerId?: string;
   brandId?: string;
   brandName?: string;
   nickname?: string;
   isBlocked?: boolean;
   isTest?: boolean;
   isFun?: boolean;
   page: number;
   limit: number;
   refresh?: number;
   autoRefresh?: number;
   emailAddress?: string;
   telegramId?: string;
   sort: GetPlayerListSortDto;
   onlyWithPendingVerification?: boolean;
   playerIds?: string[];
   registeredAtFrom?: number;
   registeredAtTo?: number;
   hasDeposit?: boolean;
   version?: string;
};

type UseGetPlayerQueryProps = UseGetQueryProps & {
   playerId: string;
   opId: string;
   key: number;
};

export const useGetPlayersListQuery = ({
   searchText = '',
   page,
   limit,
   opId,
   playerId,
   brandId,
   brandName,
   nickname,
   isBlocked,
   isTest,
   isFun,
   refresh,
   sort,
   emailAddress,
   telegramId,
   onlyWithPendingVerification,
   playerIds,
   hasDeposit,
   registeredAtFrom,
   registeredAtTo,
   autoRefresh,
   version,
}: UseGetPlayersListQueryProps) => {
   const boClient = useSelector(selectBoClient);
   const find: GetPlayerListFindDto = {};
   if (searchText) find.searchText = searchText;
   if (playerId) find.playerId = playerId;
   if (playerIds) find.playerIds = playerIds;
   if (telegramId) find.telegramId = telegramId;
   if (emailAddress) find.emailAddress = emailAddress;
   if (nickname) find.nickname = nickname;
   if (version) find.version = version;
   if (isBlocked !== null) find.isBlocked = isBlocked;
   if (isTest !== undefined) find.isTest = isTest;
   if (isFun !== undefined) find.isFun = isFun;
   if (hasDeposit !== undefined) find.hasDeposit = hasDeposit;
   if (registeredAtFrom) find.registeredAtFrom = registeredAtFrom;
   if (registeredAtTo) find.registeredAtTo = registeredAtTo;
   if (onlyWithPendingVerification !== undefined)
      find.onlyWithPendingVerification = onlyWithPendingVerification;
   const skip = page ? page * limit : 0;
   return useQuery({
      queryKey: [
         'players',
         { skip, limit, ...find, refresh, sort, opId, brandId, autoRefresh },
      ],
      queryFn: async () => {
         store.dispatch(saveLoadingPlayersList(true));
         boClient?.player.getPlayerList(
            { skip, limit, find, sort, brandId, opId },
            {
               uuid: uuidv4(),
               meta: {
                  type: find.playerIds ? 'relatedList' : 'list',
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_PLAYER_LIST_REQ,
               },
            }
         );
         // const findPendingCount: GetPlayerListFindDto = {}
         // const limitPendingCount = 1
         // const skipPendingCount = 0
         // findPendingCount.onlyWithPendingVerification = true
         // boClient?.player.getPlayerList(
         //    {
         //       skip: skipPendingCount,
         //       limit: limitPendingCount,
         //       sort,
         //       find: findPendingCount,
         //       brandId,
         //       opId,
         //    },
         //    {
         //       uuid: uuidv4(),
         //       meta: {
         //          type: 'pendingVerification',
         //          ts: new Date(),
         //          sessionId: sessionStorage.getItem('sessionId'),
         //          event: UserPermissionEvent.BACKOFFICE_PLAYER_LIST_REQ,
         //       },
         //    }
         // )

         return {};
      },
      initialData: { count: 0, players: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   });
};

export const useGetPlayersPendingVerificationQuery = ({
   opId,
   brandId,
   sort,
}: UseGetPlayersListQueryProps) => {
   const boClient = useSelector(selectBoClient);
   const operator = useSelector(selectAuthCurrentOperator) as Operator;
   const find: GetPlayerListFindDto = {};

   find.onlyWithPendingVerification = true;
   const skip = 0;
   const limit = 1;
   return useQuery({
      queryKey: ['players', { skip, ...find, opId, brandId }],
      queryFn: async () => {
         if (
            opId &&
            operator?.integrationType === IntegrationType.ALIEN_STANDALONE
         ) {
            boClient?.player.getPlayerList(
               { skip, limit, sort, find, brandId, opId },
               {
                  uuid: uuidv4(),
                  meta: {
                     type: 'pendingVerification',
                     ts: new Date(),
                     sessionId: sessionStorage.getItem('sessionId'),
                     event: UserPermissionEvent.BACKOFFICE_PLAYER_LIST_REQ,
                  },
               }
            );
         }

         return {};
      },
      initialData: { count: 0, players: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   });
};

export const useGetPlayerQuery = ({
   playerId = '',
   opId = '',
   key,
}: UseGetPlayerQueryProps) => {
   const boClient = useSelector(selectBoClient);

   return useQuery({
      queryKey: ['player', { ...GetPlayerDto, key }],
      queryFn: async () => {
         boClient?.player.getPlayer(
            { playerId: playerId, opId },
            {
               uuid: uuidv4(),
               meta: {
                  type: 'details',
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_PLAYER_REQ,
               },
            }
         );
         return {};
      },
      initialData: {
         opId: '',
         playerId: '',
         fullId: '',
         nicknameIsSet: true,
         activeCurrency: '',
         wallet: {} as any,
         isTest: false,
         isNewPlayer: true,
         isBlocked: false,
         isDeleted: false,
         integrationType: IntegrationType.ALIEN,
         chatIsBlocked: false,
      },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   });
};

export const useIsTestPlayerMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Player;
         traceData: Pick<OnSetPlayerIsTestResponseParams, 'traceData'>;
      },
      string,
      {
         dto: SetPlayerIsTestDto;
         traceData?: Pick<OnSetPlayerIsTestResponseParams, 'traceData'>;
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
            event: UserPermissionEvent.BACKOFFICE_SET_PLAYER_IS_TEST_REQ,
         };
         boClient?.player?.setPlayerIsTest(dto, { uuid: uuidv4(), meta });

         return new Promise((resolve, reject) => {
            boClient?.player.onSetPlayerIsTestResponse(async (result) => {
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

export const useIsBlockedPlayerMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Player;
         traceData: Pick<OnSetPlayerIsBlockedResponseParams, 'traceData'>;
      },
      string,
      {
         dto: SetPlayerIsBlockedDto;
         traceData?: Pick<OnSetPlayerIsBlockedResponseParams, 'traceData'>;
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
            event: UserPermissionEvent.BACKOFFICE_SET_PLAYER_IS_BLOCKED_REQ,
         };
         boClient?.player?.setPlayerIsBlocked(dto, { uuid: uuidv4(), meta });

         return new Promise((resolve, reject) => {
            boClient?.player.onSetPlayerIsBlockedResponse(async (result) => {
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

export const useChatIsBlockedPlayerMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Player;
         traceData: Pick<OnSetPlayerChatIsBlockedResponseParams, 'traceData'>;
      },
      string,
      {
         dto: SetPlayerChatIsBlockedDto;
         traceData?: Pick<OnSetPlayerChatIsBlockedResponseParams, 'traceData'>;
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
            event: UserPermissionEvent.BACKOFFICE_SET_PLAYER_CHAT_IS_BLOCKED_REQ,
         };
         boClient?.player?.setPlayerChatIsBlocked(dto, {
            uuid: uuidv4(),
            meta,
         });

         return new Promise((resolve, reject) => {
            boClient?.player.onSetPlayerChatIsBlockedResponse(
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

export const useIsTopUpPlayerMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Player;
         traceData: Pick<OnTopupResponseParams, 'traceData'>;
      },
      string,
      {
         dto: TopupDto;
         traceData?: Pick<OnTopupResponseParams, 'traceData'>;
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
            event: UserPermissionEvent.BACKOFFICE_TOPUP_REQ,
         };
         boClient?.player?.topup(dto, { uuid: uuidv4(), meta });

         return new Promise((resolve, reject) => {
            boClient?.player.onTopupResponse(async (result) => {
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

export const useSetNicknamePlayerMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Player;
         traceData: Pick<OnSetPlayerNicknameResponseParams, 'traceData'>;
      },
      string,
      {
         dto: SetPlayerNicknameDto;
         traceData?: Pick<OnSetPlayerNicknameResponseParams, 'traceData'>;
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
            event: UserPermissionEvent.BACKOFFICE_SET_PLAYER_NICKNAME_REQ,
         };
         boClient?.player?.setPlayerNickname(dto, { uuid: uuidv4(), meta });

         return new Promise((resolve, reject) => {
            boClient?.player.onSetPlayerNicknameResponse(async (result) => {
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

export const useRemovePlayerMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: Boolean; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: DeletePlayerDto; traceData?: Pick<any, 'traceData'> },
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
            event: UserPermissionEvent.BACKOFFICE_DELETE_PLAYER_REQ,
         };
         boClient?.player.deletePlayer(dto, { uuid: uuidv4(), meta });

         return new Promise((resolve, reject) => {
            boClient?.player.onDeletePlayerResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData });
               } else {
                  let message = result.message;
                  if (message === 'Access denied.') {
                     message = `Access denied to ${result.traceData?.meta?.event}`;
                  }
                  toast.error(message, {
                     position: toast.POSITION.TOP_CENTER,
                  });
                  reject(message);
               }
            });
         });
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['users'] });
         mutationOptions?.onSuccess?.(data, variables, context);
      },
      onError: (error) => {
         // toast(error);
      },
   });
};

export const useUpdateWalletPlayerMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: Boolean; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: UpdateWalletDto; traceData?: Pick<any, 'traceData'> },
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
            event: UserPermissionEvent.BACKOFFICE_UPDATE_WALLET_REQ,
         };
         boClient?.wallet.updateWallet(dto, { uuid: uuidv4(), meta });

         return new Promise((resolve, reject) => {
            boClient?.wallet.onUpdateWalletResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData });
               } else {
                  let message = result.message;
                  if (message === 'Access denied.') {
                     message = `Access denied to ${result.traceData?.meta?.event}`;
                  }
                  reject(message);
                  toast.error(message, {
                     position: toast.POSITION.TOP_CENTER,
                  });
               }
            });
         });
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['users'] });
         mutationOptions?.onSuccess?.(data, variables, context);
      },
      onError: (error) => {
         // toast(error);
      },
   });
};

export const useAllocateWalletPlayerMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: Boolean; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: AllocateWalletAddressDto; traceData?: Pick<any, 'traceData'> },
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
            event: UserPermissionEvent.BACKOFFICE_ALLOCATE_WALLET_ADDRESS_REQ,
         };
         boClient?.player.allocateWalletAddress(dto, { uuid: uuidv4(), meta });

         return new Promise((resolve, reject) => {
            boClient?.player.onAllocateWalletAddressResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData });
               } else {
                  let message = result.message;
                  if (message === 'Access denied.') {
                     message = `Access denied to ${result.traceData?.meta?.event}`;
                  }
                  reject(message);
                  toast.error(message, {
                     position: toast.POSITION.TOP_CENTER,
                  });
               }
            });
         });
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['users'] });
         mutationOptions?.onSuccess?.(data, variables, context);
      },
   });
};

export const useConfirmPlayerKycVerificationMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: PlayerKycVerification; traceData?: Pick<any, 'traceData'> },
      string,
      {
         dto: ConfirmPlayerKycVerificationDto;
         traceData?: Pick<any, 'traceData'>;
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
            event: UserPermissionEvent.BACKOFFICE_CONFIRM_PLAYER_KYC_VERIFICATION_REQ,
         };
         boClient?.player.confirmPlayerKycVerification(dto, {
            uuid: uuidv4(),
            meta,
         });

         return new Promise((resolve, reject) => {
            boClient?.player.onConfirmPlayerKycVerificationResponse(
               async (result) => {
                  if (result.success) {
                     resolve({
                        data: result.data,
                        traceData: result.traceData,
                     });
                     boClient?.player.getPlayer(
                        { opId: dto.opId, playerId: dto.playerId },
                        {
                           uuid: uuidv4(),
                           meta: {
                              ts: new Date(),
                              sessionId: sessionStorage.getItem('sessionId'),
                              event: UserPermissionEvent.BACKOFFICE_GET_PLAYER_REQ,
                           },
                        }
                     );
                  } else {
                     let message = result.message;
                     if (message === 'Access denied.') {
                        message = `Access denied to ${result.traceData?.meta?.event}`;
                     }
                     toast.error(message, {
                        position: toast.POSITION.TOP_CENTER,
                     });
                     reject(message);
                  }
               }
            );
         });
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['users'] });
         mutationOptions?.onSuccess?.(data, variables, context);
      },
      onError: (error) => {
         // toast(error);
      },
   });
};

export const useRejectPlayerKycVerificationMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: PlayerKycVerification; traceData?: Pick<any, 'traceData'> },
      string,
      {
         dto: RejectPlayerKycVerificationDto;
         traceData?: Pick<any, 'traceData'>;
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
            event: UserPermissionEvent.BACKOFFICE_REJECT_PLAYER_KYC_VERIFICATION_REQ,
         };
         boClient?.player.rejectPlayerKycVerification(dto, {
            uuid: uuidv4(),
            meta,
         });

         return new Promise((resolve, reject) => {
            boClient?.player.onRejectPlayerKycVerificationResponse(
               async (result) => {
                  if (result.success) {
                     resolve({
                        data: result.data,
                        traceData: result.traceData,
                     });
                     boClient?.player.getPlayer(
                        { opId: dto.opId, playerId: dto.playerId },
                        {
                           uuid: uuidv4(),
                           meta: {
                              ts: new Date(),
                              sessionId: sessionStorage.getItem('sessionId'),
                              event: UserPermissionEvent.BACKOFFICE_GET_PLAYER_REQ,
                           },
                        }
                     );
                  } else {
                     let message = result.message;
                     if (message === 'Access denied.') {
                        message = `Access denied to ${result.traceData?.meta?.event}`;
                     }
                     toast.error(message, {
                        position: toast.POSITION.TOP_CENTER,
                     });
                     reject(message);
                  }
               }
            );
         });
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['users'] });
         mutationOptions?.onSuccess?.(data, variables, context);
      },
      onError: (error) => {
         // toast(error);
      },
   });
};

export const useSeNotePlayerMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Player;
         traceData: Pick<OnSetPlayerNoteResponseParams, 'traceData'>;
      },
      string,
      {
         dto: SetPlayerNoteDto;
         traceData?: Pick<OnSetPlayerNoteResponseParams, 'traceData'>;
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
            event: UserPermissionEvent.BACKOFFICE_SET_PLAYER_NOTE_REQ,
         };
         boClient?.player?.setPlayerNote(dto, { uuid: uuidv4(), meta });

         return new Promise((resolve, reject) => {
            boClient?.player.onSetPlayerNoteResponse(async (result) => {
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

export const useUpdatePlayerStatsMutation = (
   mutationOptions?: UseMutationOptions<
      {
         data?: Player;
         traceData: Pick<OnUpdatePlayerStatsResponseParams, 'traceData'>;
      },
      string,
      {
         dto: UpdatePlayerStatsDto;
         traceData?: Pick<OnUpdatePlayerStatsResponseParams, 'traceData'>;
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
            event: UserPermissionEvent.BACKOFFICE_UPDATE_PLAYER_STATS_REQ,
         };
         boClient?.player?.updatePlayerStats(dto, { uuid: uuidv4(), meta });

         return new Promise((resolve, reject) => {
            boClient?.player.onUpdatePlayerStatsResponse(async (result) => {
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

export const useGetRelatedPlayers = ({
   opId,
   brandId,
   playerId,
   relatedParams,
}: GetRelatedPlayersDto) => {
   const boClient = useSelector(selectBoClient);
   return useQuery({
      queryKey: ['players', { opId, brandId, playerId, relatedParams }],
      queryFn: async () => {
         store.dispatch(saveLoadingRelatedAccounts(true));
         boClient?.player.getRelatedPlayers(
            { opId, brandId, playerId, relatedParams },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_RELATED_PLAYERS_REQ,
               },
            }
         );

         return {};
      },
      initialData: { count: 0, players: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   });
};

export const usePlayerKycVerificationRequirement = (
   mutationOptions?: UseMutationOptions<
      { data?: PlayerKycVerification; traceData?: Pick<any, 'traceData'> },
      string,
      {
         dto: SetPlayerKycVerificationRequirementDto;
         traceData?: Pick<any, 'traceData'>;
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
            event: UserPermissionEvent.BACKOFFICE_SET_PLAYER_KYC_VERIFICATION_REQUIREMENT_REQ,
         };
         boClient?.player.setPlayerKycVerificationRequirement(dto, {
            uuid: uuidv4(),
            meta,
         });

         return new Promise((resolve, reject) => {
            boClient?.player.onSetPlayerKycVerificationRequirementResponse(
               async (result) => {
                  if (result.success) {
                     resolve({
                        data: result.data,
                        traceData: result.traceData,
                     });
                     boClient?.player.getPlayer(
                        { opId: dto.opId, playerId: dto.playerId },
                        {
                           uuid: uuidv4(),
                           meta: {
                              ts: new Date(),
                              sessionId: sessionStorage.getItem('sessionId'),
                              event: UserPermissionEvent.BACKOFFICE_GET_PLAYER_REQ,
                           },
                        }
                     );
                  } else {
                     let message = result.message;
                     if (message === 'Access denied.') {
                        message = `Access denied to ${result.traceData?.meta?.event}`;
                     }
                     toast.error(message, {
                        position: toast.POSITION.TOP_CENTER,
                     });
                     reject(message);
                  }
               }
            );
         });
      },
      onSuccess: (data, variables, context) => {
         queryClient.invalidateQueries({ queryKey: ['users'] });
         mutationOptions?.onSuccess?.(data, variables, context);
      },
      onError: (error) => {
         // toast(error);
      },
   });
};
