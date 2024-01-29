import { UserPermissionEvent, UserScope } from "@alienbackoffice/back-front"
import { IconDefinition } from "@fortawesome/pro-solid-svg-icons"

export type SidebarItemsType = {
  href: string
  module: UserScope[]
  type?: string
  permission?: UserPermissionEvent
  title: string
  icon?: IconDefinition
  children?: SidebarItemsType[]
  badge?: string
  section: number
}
