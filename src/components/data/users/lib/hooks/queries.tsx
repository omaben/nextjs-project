import {
   CreateUserDto,
   DeleteUserDto,
   EditUserDto,
   GetUserDto,
   Roles,
   SetRolesDto,
   User,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import {
   GetUserListFindDto,
   GetUserListSortDto,
} from '@alienbackoffice/back-front/lib/user/dto/get-user-list.dto'
import {
   UseMutationOptions,
   useMutation,
   useQuery,
   useQueryClient,
} from '@tanstack/react-query'
import { UseGetQueryProps } from 'lib/types'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { saveRoles } from 'redux/authSlice'
import { saveLoadingUsersList } from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { v4 as uuidv4 } from 'uuid'

export type useGetUserListQueryProps = UseGetQueryProps & {
   opId?: string
   username?: string
   enabled?: boolean
   page: number
   limit: number
   autoRefresh?: number
   sort: GetUserListSortDto
}

type useGetUserDetailsQueryProps = UseGetQueryProps & {
   opId: string
   username: string
}
export const useGetUserListQuery = ({
   searchText = '',
   opId,
   username,
   page,
   limit,
   sort,
   autoRefresh,
}: useGetUserListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetUserListFindDto = {}
   if (username) find.username = username

   const skip = page ? page * limit : 0

   return useQuery({
      queryKey: ['users', { skip, limit, ...find, sort, opId, autoRefresh }],
      queryFn: async () => {
         store.dispatch(saveLoadingUsersList(true))
         boClient?.user.getUserList(
            { skip, limit, find, sort, opId },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_USER_LIST_REQ,
               },
            }
         )
         return {}
      },
      initialData: { count: 0, users: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}

export const useCreateUserMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: User; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: CreateUserDto; traceData?: Pick<any, 'traceData'> },
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
            event: UserPermissionEvent.BACKOFFICE_CREATE_USER_REQ,
         }
         boClient?.user.createUser(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.user.onCreateUserResponse(async (result) => {
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
         queryClient.invalidateQueries({ queryKey: ['users'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error, variables, context) => {
         mutationOptions?.onError?.(error, variables, context)
      },
   })
}

export const useEditUserMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: User; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: EditUserDto; traceData?: Pick<any, 'traceData'> },
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
            event: UserPermissionEvent.BACKOFFICE_EDIT_USER_REQ,
         }
         boClient?.user.editUser(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.user.onEditUserResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
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
         queryClient.invalidateQueries({ queryKey: ['users'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error) => {},
   })
}

export const useRemoveUserMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: Boolean; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: DeleteUserDto; traceData?: Pick<any, 'traceData'> },
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
            event: UserPermissionEvent.BACKOFFICE_DELETE_USER_REQ,
         }
         boClient?.user.deleteUser(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.user.onDeleteUserResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
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
         queryClient.invalidateQueries({ queryKey: ['users'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error) => {},
   })
}

export const useGetUserDetailsQuery = ({
   opId,
   username,
}: useGetUserDetailsQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetUserDto = {
      username,
   }
   if (opId && opId !== '*') {
      find.opId = opId
   }
   return useQuery({
      queryKey: ['user'],
      queryFn: async () => {
         boClient?.user.getUser(
            { ...find },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_USER_REQ,
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

export const useSetRolesMutation = (
   mutationOptions?: UseMutationOptions<
      { data?: Roles; traceData?: Pick<any, 'traceData'> },
      string,
      { dto: SetRolesDto; traceData?: Pick<any, 'traceData'> },
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
            event: UserPermissionEvent.BACKOFFICE_SET_ROLES_REQ,
         }
         boClient?.user.setRoles(dto, { uuid: uuidv4(), meta })

         return new Promise((resolve, reject) => {
            boClient?.user.onSetRolesResponse(async (result) => {
               if (result.success) {
                  resolve({ data: result.data, traceData: result.traceData })
                  const roles: {
                     name: string
                     UserPermissionEvent: UserPermissionEvent[]
                  }[] = []
                  if (result.data?.[dto.userScope]) {
                     for (var i in Object.keys(result.data?.[dto.userScope])) {
                        roles.push({
                           name: Object.keys(result.data?.[dto.userScope])[i],
                           UserPermissionEvent: Object.values(
                              result.data?.[dto.userScope]
                           )[i] as any,
                        })
                     }
                     store.dispatch(saveRoles(roles))
                  }
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
         queryClient.invalidateQueries({ queryKey: ['users'] })
         mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error) => {},
   })
}
