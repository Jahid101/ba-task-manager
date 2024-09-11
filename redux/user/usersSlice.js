import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    userDetails: null,
}

export const usersSlice = createSlice({
    name: "usersSlice",
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state.userDetails = action.payload;
        },
    }
});


export const {
    setUserDetails,
} = usersSlice.actions;

export default usersSlice.reducer;
