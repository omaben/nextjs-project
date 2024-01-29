import {
   UserActivityType,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import { GetPlayerActivityListSortDto } from '@alienbackoffice/back-front/lib/player-activity/dto/get-player-activity-list.dto'
import { GetUserActivityListFindDto } from '@alienbackoffice/back-front/lib/user/dto/get-user-activity-list.dto'
import { useQuery } from '@tanstack/react-query'
import { UseGetQueryProps } from 'lib/types'
import { useSelector } from 'react-redux'
import { saveLoadingUserAcitivites } from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { v4 as uuidv4 } from 'uuid'

type UseGetUserActivitiesListQueryProps = UseGetQueryProps & {
   opId: string
   brandId?: string
   affId?: string
   from?: number
   to?: number
   activityType?: UserActivityType
   username?: string
   page: number
   limit: number
   refresh: number
   sort: GetPlayerActivityListSortDto
   autoRefresh: number
}

export const useGetUserActivitiesListQuery = ({
   page,
   limit,
   from,
   to,
   activityType,
   username,
   brandId,
   affId,
   opId,
   refresh,
   sort,
   autoRefresh,
}: UseGetUserActivitiesListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetUserActivityListFindDto = {}
   if (from) find.from = from
   if (to) find.to = to
   if (username) find.username = username
   if (affId) find.affId = affId
   if (activityType) find.activityType = activityType
   const skip = page ? page * limit : 0
   return useQuery({
      queryKey: [
         'activities',
         { skip, limit, ...find, refresh, sort, opId, brandId, autoRefresh },
      ],
      queryFn: async () => {
         store.dispatch(saveLoadingUserAcitivites(true))
         boClient?.user.getUserActivityList(
            { skip, limit, find, sort, brandId, opId },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_USER_ACTIVITY_LIST_REQ,
               },
            }
         )

         return {}
      },
      initialData: { count: 0, activities: [] },
      initialDataUpdatedAt: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      enabled: Boolean(boClient),
   })
}
