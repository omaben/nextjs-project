import {
   PlayerActivityType,
   UserPermissionEvent,
} from '@alienbackoffice/back-front'
import {
   GetPlayerActivityListFindDto,
   GetPlayerActivityListSortDto,
} from '@alienbackoffice/back-front/lib/player-activity/dto/get-player-activity-list.dto'
import { useQuery } from '@tanstack/react-query'
import { UseGetQueryProps } from 'lib/types'
import { useSelector } from 'react-redux'
import { saveLoadingPlayerActivites } from 'redux/loadingSlice'
import { selectBoClient } from 'redux/socketSlice'
import { store } from 'redux/store'
import { v4 as uuidv4 } from 'uuid'

export type UseGetPlayersActivitiesListQueryProps = UseGetQueryProps & {
   opId: string
   brandId?: string
   affId?: string
   from?: number
   to?: number
   activityType?: PlayerActivityType
   searchText?: string
   playerId?: string
   nickname?: string
   isTest?: boolean
   isBlocked?: boolean
   page: number
   limit: number
   refresh?: number
   sort: GetPlayerActivityListSortDto
   autoRefresh?: number
}
export const useGetPlayersActivitiesListQuery = ({
   searchText = '',
   page,
   limit,
   from,
   to,
   activityType,
   playerId,
   nickname,
   brandId,
   affId,
   isTest,
   isBlocked,
   opId,
   refresh,
   sort,
   autoRefresh,
}: UseGetPlayersActivitiesListQueryProps) => {
   const boClient = useSelector(selectBoClient)
   const find: GetPlayerActivityListFindDto = {}
   if (searchText) find.searchText = searchText
   if (from) find.from = from
   if (to) find.to = to
   if (playerId) find.playerId = playerId
   if (nickname) find.nickname = nickname
   if (activityType) find.activityType = activityType
   if (isTest) find.isTest = isTest
   if (isBlocked) find.isBlocked = isBlocked
   const skip = page ? page * limit : 0
   return useQuery({
      queryKey: [
         'activities',
         { skip, limit, ...find, refresh, sort, opId, brandId, autoRefresh },
      ],
      queryFn: async () => {
         store.dispatch(saveLoadingPlayerActivites(true))
         boClient?.player.getPlayerActivityList(
            { skip, limit, find, sort, brandId, opId },
            {
               uuid: uuidv4(),
               meta: {
                  ts: new Date(),
                  sessionId: sessionStorage.getItem('sessionId'),
                  event: UserPermissionEvent.BACKOFFICE_PLAYER_ACTIVITY_LIST_REQ,
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
