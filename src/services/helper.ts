import { Slide } from "@mui/material";
import { getCookie, setCookie } from "cookies-next";
import router from "next/router";
import React from "react";
import { deleteBackHistory, saveBackButton } from "redux/authSlice";
import { store } from "redux/store";
import { PLayerFileType } from "types";

interface Language {
    '639-1': string;
    name: string;
}

/**
 * Helper function to create language options from a list of languages.
 * It filters out languages with an empty '639-1' code and maps them to label-value pairs.
 *
 * @param {Language[]} languages - An array of languages with '639-1' and 'name' properties.
 * @returns {Object[]} - An array of language options with 'label' and 'value' properties.
 */
export function createLanguageOptions(languages: Language[]) {
    return languages
        .filter(qry => qry['639-1'] !== '') // Filters out languages with an empty '639-1' code
        .map(qry => ({
            label: `${qry['639-1']}-${qry['name']}`,
            value: qry['639-1'],
        }));
}

/**
 * Helper function to redirect to the '/dashboard' route if the current route is '/auth/login' or '/imoon'.
 * It checks the current route using the router pathname and redirects to '/dashboard' if a match is found.
 */
export function redirectToDashboard() {
    if (router.pathname === '/auth/login' || router.pathname === '/imoon') {
        router.push('/dashboard'); // Redirects to the '/dashboard' route
    }
}

/**
 * Helper function to clear a specific cookie named 'access_token'.
 * It sets the value of the 'access_token' cookie to an empty string, effectively removing it.
 */
export const clearCookies = () => {
    setCookie('access_token', ''); // Clears the 'access_token' cookie
};

/**
 * Helper function to redirect to '/auth/login' if the current route is not already '/auth/login'.
 * It checks the current route pathname and redirects to '/auth/login' if necessary.
 */
export const redirectToLogin = () => {
    // Check if the current route pathname is not '/auth/login'
    if (router.pathname !== '/auth/login') {
        // Redirect to '/auth/login'
        router.push('/auth/login');
    }
};

/**
 * Function to handle route changes related to user authentication.
 * This function checks the user's authentication status and performs redirects accordingly.
 */
export const handleRouteChangeAuth = () => {
    // Get the user's access token from cookies
    const accessToken = getCookie('access_token');

    // Check if there is no access token and the current path is not '/auth/login'
    if (!accessToken && router.pathname !== '/auth/login') {
        // Redirect the user to the login page
        router.push('/auth/login');
    } else if (router.pathname === '/auth/login') {
        // If the user is on the login page and has an access token,
        // redirect them to the dashboard
        router.push('/dashboard');
    }
}

export function getFileTypeFromFileName(fileName: string): string | undefined {
    const fileExtension = fileName.split('.').pop();
    if (fileExtension) {
        switch (fileExtension.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                return PLayerFileType.IMAGE;
            case 'pdf':
                return PLayerFileType.PDF;
            // Add more extensions and corresponding types as needed.
            default:
                return 'Unknown';
        }
    }
    return undefined;
}

/**
 * Function to handle navigating back in the user's history.
 * This function checks the user's navigation history and performs redirects accordingly.
 * If there is a previous page in the history stack, it goes back to it.
 * If the previous page is the login page, it redirects to the dashboard.
 */
export function backHistory() {
    // Get the navigation history from Redux state
    const history = store.getState().auth.backHistory;

    // Check if there is a previous page in the history and it's not the login page
    if (history?.length > 1 && history[1] !== '/auth/login') {
        // Redirect to the previous page
        router.push(history[1]);

        // Set the back button state to true (indicating it's a back navigation)
        store.dispatch(saveBackButton(true));

        // Clear the previous page from the history
        store.dispatch(deleteBackHistory());
    } else {
        // If no valid previous page is found, redirect to the dashboard
        router.push('/dashboard');
    }
}