import { IntegrationType, User, UserPermissionEvent, UserScope } from "@alienbackoffice/back-front";
import { store } from "redux/store";
import { MenuModules } from "types";

const standAloneMenu: MenuModules[] = [
    MenuModules.PLAYERACTIVITIES,
    MenuModules.USERACTIVITIES,
    // MenuModules.TOURNAMENT,
    MenuModules.PAYMENTS
]

const noneStandAloneMenu: MenuModules[] = [
    // MenuModules.LOGS,
]

/**
 * Checks if the user has a specific permission based on their role and menu item.
 *
 * @param {UserPermissionEvent} permission - The permission to check.
 * @param {IntegrationType} integrationType - The type of integration.
 * @param {MenuModules} [menuItem] - The menu item for which the permission is checked.
 * @returns {boolean} - Returns true if the user has permission; otherwise, returns false.
 */
export function hasPermission(
    permission: UserPermissionEvent,
    integrationType: IntegrationType,
    menuItem?: MenuModules
): boolean {
    const user = store.getState().auth.user as User;

    if (
        menuItem &&
        ((integrationType !== IntegrationType.ALIEN_STANDALONE &&
            standAloneMenu.includes(menuItem)) ||
            (integrationType === IntegrationType.ALIEN_STANDALONE &&
                noneStandAloneMenu.includes(menuItem))
            ||
            (![
                IntegrationType.ALIEN_WALLET_TRANSFER,
                IntegrationType.PG_WALLET_TRANSFER,
            ].includes(integrationType as IntegrationType) &&
                menuItem === MenuModules.CASHINGCASHOUT)
            || (
                ![
                    IntegrationType.ALIEN_STANDALONE,
                    IntegrationType.PG_WALLET_TRANSFER,
                    IntegrationType.ALIEN_WALLET_TRANSFER,
                ].includes(integrationType as IntegrationType) && menuItem === MenuModules.TRANSACTIONS)
            || (
                ![
                    IntegrationType.ALIEN_STANDALONE,
                    IntegrationType.PG_WALLET_TRANSFER,
                    IntegrationType.ALIEN_WALLET_TRANSFER,
                ].includes(integrationType as IntegrationType) && menuItem === MenuModules.OPERATORTRANSACTIONS)
        )
    ) {
        // If the menu item is restricted based on integration type, return false.
        return false;
    } else if (user?.scope === UserScope.SUPERADMIN || menuItem === MenuModules.DASHBOARD) {
        // Superadmins and users with access to the DASHBOARD menu item have permission.
        return true;
    } else {
        // Check if the user has the specified permission.
        if (menuItem === MenuModules.TOURNAMENT && user?.scope === UserScope.OPERATOR) {
            return user?.permissions?.includes(UserPermissionEvent.BACKOFFICE_GET_TOURNAMENT_IDS_REQ) ?? false;
        } else {
            return user?.permissions?.includes(permission) ?? false;
        }
    }
}

/**
 * Checks if the user has a specific permission based on their role, integration type, and menu item.
 *
 * @param {UserPermissionEvent} permission - The permission to check.
 * @param {IntegrationType} [integrationType] - The type of integration (optional).
 * @param {MenuModules} [menuItem] - The menu item for which the permission is checked (optional).
 * @returns {boolean} - Returns true if the user has permission; otherwise, returns false.
 */
export function hasDetailsPermission(
    permission: UserPermissionEvent,
    integrationType?: IntegrationType,
    menuItem?: MenuModules
): boolean {
    const user = store.getState().auth.user as User;

    // Check if the menu item should be restricted based on integration type.
    if (
        menuItem &&
        integrationType &&
        ((integrationType !== IntegrationType.ALIEN_STANDALONE &&
            standAloneMenu.includes(menuItem)) ||
            (integrationType === IntegrationType.ALIEN_STANDALONE &&
                noneStandAloneMenu.includes(menuItem)))
    ) {
        // If the menu item is restricted based on integration type, return false.
        return false;
    } else if (user?.scope === UserScope.SUPERADMIN || menuItem === MenuModules.DASHBOARD) {
        // Superadmins and users with access to the DASHBOARD menu item have permission.
        return true;
    } else {
        // Check if the user has the specified permission.
        return user?.permissions?.includes(permission) ?? false;
    }
}
