import { createSlice } from '@reduxjs/toolkit'

export const connectButtonLabelSlice = createSlice({
    name: 'connectButtonLabel',
    initialState: {
        value: "CONNECT"
    },
    reducers: {
        setScanningLabel: (state) => {
            state.value = "SCANNING...";
        },
        setConnectingLabel: (state) => {
            state.value = "CONNECTING...";
        },
        setDefaultLabel: (state) => {
            state.value = "CONNECT"
        }
    }
});

export const { setConnectingLabel, setScanningLabel, setDefaultLabel } = connectButtonLabelSlice.actions
export default connectButtonLabelSlice.reducer