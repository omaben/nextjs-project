import { useRouter } from 'next/router'
import { createContext, ReactNode, useEffect, useReducer } from 'react'
import { getCookie, setCookie } from 'typescript-cookie'
import useAppDispatch from '../hooks/useAppDispatch'
import { login } from '../services'

import { ActionMap, AuthState, AuthUser, JWTContextType } from '../types/auth'

import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { saveCompleteInit, saveUrl } from 'redux/authSlice'
import { store } from 'redux/store'
import { closeWebSocket, eventMessage } from 'services/websocket'
const INITIALIZE = 'INITIALIZE'
const SIGN_IN = 'SIGN_IN'
const SIGN_OUT = 'SIGN_OUT'
const SIGN_UP = 'SIGN_UP'

type AuthActionTypes = {
   [INITIALIZE]: {
      isAuthenticated: boolean
      user: AuthUser
   }
   [SIGN_IN]: {
      user: AuthUser
   }
   [SIGN_OUT]: undefined
   [SIGN_UP]: {
      user: AuthUser
   }
}

const initialState: AuthState = {
   isAuthenticated: false,
   isInitialized: false,
   user: null,
}

const JWTReducer = (
   state: AuthState,
   action: ActionMap<AuthActionTypes>[keyof ActionMap<AuthActionTypes>]
) => {
   switch (action.type) {
      case INITIALIZE:
         return {
            isAuthenticated: action.payload.isAuthenticated,
            isInitialized: true,
            user: action.payload.user,
         }
      case SIGN_IN:
         return {
            ...state,
            isAuthenticated: true,
            user: action.payload.user,
         }
      case SIGN_OUT:
         return {
            ...state,
            isAuthenticated: false,
            user: null,
         }

      case SIGN_UP:
         return {
            ...state,
            isAuthenticated: true,
            user: action.payload.user,
         }

      default:
         return state
   }
}

const AuthContext = createContext<JWTContextType | null>(null)

function AuthProvider({ children }: { children: ReactNode }) {
   const dispatchRedux = useAppDispatch()
   const [state, dispatchSave] = useReducer(JWTReducer, initialState)
   const dispatch = useDispatch()
   const router = useRouter()
   useEffect(() => {
      const initialize = async () => {
         try {
            const accessToken = getCookie('access_token')
            if (accessToken) {
               store.dispatch(saveCompleteInit(false))
               dispatch(saveUrl({ url: accessToken }))
               if (
                  router.pathname === '/imoon' ||
                  router.pathname === '/auth/login'
               ) {
                  router.push('/dashboard')
               }
               await eventMessage(accessToken)
            } else {
               if (router.pathname === '/auth/reset-password') return
               if (router.pathname !== '/auth/login') {
                  router.push('/auth/login')
               }
               store.dispatch(saveCompleteInit(true))
            }
         } catch (err) {
            router.push('/auth/login')
         }
      }

      initialize()
   }, [])

   const signIn = async (email: string, password: string) => {
      const post = {
         username: email,
         password: password,
      }
      let data: any = null
      await login(post).then(async (res) => {
         data = res
         if (res.url) {
            setCookie('access_token', res.url)
            toast.success('You are successfully logged in', {
               position: toast.POSITION.TOP_CENTER,
            })
            dispatch(saveUrl({ url: res.url }))
            await eventMessage(res.url)
         }
      })
      return data
   }
   const signIn2FA = async (
      email: string,
      password: string,
      twoFactorAuthenticationCode: string
   ) => {
      const post = {
         username: email,
         password: password,
         twoFactorAuthenticationCode: twoFactorAuthenticationCode,
      }
      let data: any = null
      await login(post).then(async (res) => {
         data = res
         if (res.url) {
            setCookie('access_token', res.url)
            dispatch(saveUrl({ url: res.url }))
         }
      })
      return data
   }
   const signOut = async () => {
      await closeWebSocket()
   }

   const signUp = async () => {}

   const resetPasswordLogin = async (
      email: string,
      code: string,
      password: string
   ) => {
      const post = {
         email: email,
         code: code,
         password: password,
      }
      let data: any = null
      // data = await SetNewPasswordByRecoveryCode(post)
      return data
   }

   return (
      <AuthContext.Provider
         value={{
            ...state,
            method: 'jwt',
            signIn,
            signIn2FA,
            signOut,
            signUp,
            resetPasswordLogin,
         }}
      >
         {children}
      </AuthContext.Provider>
   )
}
export { AuthContext, AuthProvider }
