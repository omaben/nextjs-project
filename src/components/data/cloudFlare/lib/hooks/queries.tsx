import {
   DnsRecord,
   GetDnsRecordListDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front';
import { CreateDnsRecordDto } from '@alienbackoffice/back-front/lib/devops/dto/create-dns-record.dto';
import { DeleteDnsRecordDto } from '@alienbackoffice/back-front/lib/devops/dto/delete-dns-record.dto';
import { UpdateDnsRecordDto } from '@alienbackoffice/back-front/lib/devops/dto/update-dns-record.dto';
import {
   UseMutationOptions,
   useMutation,
   useQuery,
   useQueryClient,
} from '@tanstack/react-query';
import { UseGetQueryProps } from 'lib/types';
import { useSelector } from 'react-redux';
import { saveLoadingDnsRecordList } from 'redux/loadingSlice';
import { selectBoClient } from 'redux/socketSlice';
import { store } from 'redux/store';
import { v4 as uuidv4 } from 'uuid';

export type useGetDnsRecordListQueryProps = UseGetQueryProps & {
   name?: string;
   page?: number;
   limit?: number;
   autoRefresh?: number;
   sort?: {};
};

export const useGetDnsRecordListQuery = ({
   name,
   page,
   limit = 50,
   autoRefresh,
   sort = {},
}: useGetDnsRecordListQueryProps) => {
   const boClient = useSelector(selectBoClient);
   const data: GetDnsRecordListDto = { find: {}, sort: sort };
   if (name) data.find.name = name;
   const skip = page ? page * limit : 0;
   return useQuery({
      queryKey: ['dnsRecord', { skip, limit, ...data, autoRefresh }],
      queryFn: async () => {
         store.dispatch(saveLoadingDnsRecordList(true));
         boClient?.devops.getDnsRecordList(
            { skip, limit, ...data },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_DNS_RECORD_LIST_REQ,
               },
            }
         );
         return {};
      },
      initialData: { count: 0, dnsRecord: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   });
};

export const useCreateDNSMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: DnsRecord; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: CreateDnsRecordDto; traceData?: Pick<any, 'traceData'> },
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
            event: UserPermissionEvent.BACKOFFICE_CREATE_DNS_RECORD_REQ,
         };
         const data: CreateDnsRecordDto = {
            ...dto,
         };
         boClient?.devops.createDnsRecord(data, { uuid: uuidv4(), meta });

         return new Promise((resolve, reject) => {
            boClient?.devops.onCreateDnsRecordResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData });
                  store.dispatch(saveLoadingDnsRecordList(true));
                  boClient?.devops.getDnsRecordList(
                     { skip: 0, limit: 50, find: {}, sort: {} },
                     {
                        uuid: uuidv4(),
                        meta: {
                           ts: new Date(),
                           sessionId: sessionStorage.getItem('sessionId'),
                           event: UserPermissionEvent.BACKOFFICE_DNS_RECORD_LIST_REQ,
                        },
                     }
                  );
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
         queryClient.invalidateQueries({ queryKey: ['operators'] });
         mutationOptions?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
         mutationOptions?.onError?.(error, variables, context);
      },
   });
};

export const useUpdateDNSMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: DnsRecord; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: UpdateDnsRecordDto; traceData?: Pick<any, 'traceData'> },
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
            event: UserPermissionEvent.BACKOFFICE_UPDATE_DNS_RECORD_REQ,
         };
         const data: UpdateDnsRecordDto = {
            ...dto,
         };
         boClient?.devops.updateDnsRecord(data, { uuid: uuidv4(), meta });

         return new Promise((resolve, reject) => {
            boClient?.devops.onUpdateDnsRecordResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData });
                  store.dispatch(saveLoadingDnsRecordList(true));
                  boClient?.devops.getDnsRecordList(
                     { skip: 0, limit: 50, find: {}, sort: {} },
                     {
                        uuid: uuidv4(),
                        meta: {
                           ts: new Date(),
                           sessionId: sessionStorage.getItem('sessionId'),
                           event: UserPermissionEvent.BACKOFFICE_DNS_RECORD_LIST_REQ,
                        },
                     }
                  );
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
         queryClient.invalidateQueries({ queryKey: ['operators'] });
         mutationOptions?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
         mutationOptions?.onError?.(error, variables, context);
      },
   });
};

export const useDeleteDNSMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: DnsRecord; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: DeleteDnsRecordDto; traceData?: Pick<any, 'traceData'> },
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
            event: UserPermissionEvent.BACKOFFICE_DELETE_DNS_RECORD_REQ,
         };
         const data: DeleteDnsRecordDto = {
            ...dto,
         };
         boClient?.devops.deleteDnsRecord(data, { uuid: uuidv4(), meta });

         return new Promise((resolve, reject) => {
            boClient?.devops.onDeleteDnsRecordResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData });
                  store.dispatch(saveLoadingDnsRecordList(true));
                  boClient?.devops.getDnsRecordList(
                     { skip: 0, limit: 50, find: {}, sort: {} },
                     {
                        uuid: uuidv4(),
                        meta: {
                           ts: new Date(),
                           sessionId: sessionStorage.getItem('sessionId'),
                           event: UserPermissionEvent.BACKOFFICE_DNS_RECORD_LIST_REQ,
                        },
                     }
                  );
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
         queryClient.invalidateQueries({ queryKey: ['operators'] });
         mutationOptions?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
         mutationOptions?.onError?.(error, variables, context);
      },
   });
};
