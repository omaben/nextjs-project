import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface UserState {
    user: {};
}
const initialState: UserState = {
    user: {},
};
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, Action) {
            state.user = Action.payload
        },
        logout: () => {
            return initialState;
        },
    }
})

export const getUser = (state: RootState) => state.user.user;
export const { setUser } = userSlice.actions;

export default userSlice.reducer;