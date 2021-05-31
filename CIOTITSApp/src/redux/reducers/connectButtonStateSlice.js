import { createSlice } from '@reduxjs/toolkit'

export const connectButtonStateSlice = createSlice({
    name: 'connectButtonState',
    initialState: {
        value: false
    },
    reducers: {
        doConnect: (state) => {
            state.value = true;
        },
        doFallback: (state) => {
            state.value = false;
        }
    }
});

export const { doConnect, doFallback } = connectButtonStateSlice.actions
export default connectButtonStateSlice.reducer