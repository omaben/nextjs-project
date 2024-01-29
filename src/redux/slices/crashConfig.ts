import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface CurrentOperatorsCurrencyState {
   timezone: string
   timezoneOffset: number
   abbrev: string
}

const initialState: CurrentOperatorsCurrencyState = {
   timezone: 'Etc/GMT',
   timezoneOffset: 0,
   abbrev: 'GMT'
}
export const configCrashSlice = createSlice({
   name: 'config',
   initialState,
   reducers: {
      setCrashConfig(state, Action) {
         state.timezone = Action.payload.timezone
         state.timezoneOffset = Action.payload.timezoneOffset
         state.abbrev = Action.payload.abbrev
      },
      resetCrashConfig: () => {
         return initialState;
       },
   },
})

export const getCrashConfig = (state: RootState) => state.crashConfig
export const { setCrashConfig, resetCrashConfig } = configCrashSlice.actions

export default configCrashSlice.reducer
