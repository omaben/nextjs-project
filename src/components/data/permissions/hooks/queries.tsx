import { UserPermissionEvent } from '@alienbackoffice/back-front'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { selectBoClient } from 'redux/socketSlice'
import { v4 as uuidv4 } from 'uuid'

export const useGetPermissionsListQuery = ({}) => {
   const boClient = useSelector(selectBoClient)

   return useQuery({
      queryKey: ['permissions'],
      queryFn: async () => {
         boClient?.user?.getPermissions(
            {},
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_GET_PERMISSIONS_REQ
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
