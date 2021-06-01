import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { NativeEventEmitter } from 'react-native';

import BLEModule from '../../native/BLEModule';

const eventEmitter = new NativeEventEmitter(BLEModule);
const { CONN_STATUS_EVENT } = BLEModule.getConstants();

export const STATUS_FAILED = -2;
export const STATUS_DICONNECTING = -1;
export const STATUS_DISCONNECTED = 0;
export const STATUS_CONNECTING = 1;
export const STATUS_DISCOVERING = 2;
export const STATUS_CONNECTED = 3;

function establishBLEConnection(successCallback, failureCallback) {
    return new Promise((successCallback, failureCallback) => {
        eventEmitter.addListener(CONN_STATUS_EVENT, (status) => {
            const successful = (status === 'connected' || status === 'discovering');
            console.log('Connection state changed!');

            if (successful) {
                successCallback();

            } else {
                failureCallback();
            }
        });
    
        console.log('Connecting to vehicle...');
        BLEModule.connectToVehicle(() => {failureCallback()}, () => {});
    });
}

function closeBLEConnection(successCallback, failureCallback) {
    return new Promise((successCallback, failureCallback) => {
        console.log('Disconnecting from vehicle...');
        BLEModule.disconnectFromVehicle();
        
        setTimeout(() => {
            successCallback();
        }, 1000);
    });
}

export const connectToVehicle = createAsyncThunk('connection/connectToVehicle', () => {
    return establishBLEConnection(() => {}, () => {});
});

export const disconnectFromVehicle = createAsyncThunk('connection/disconnectFromVehicle', () => {
    return closeBLEConnection(() => {}, () => {});
});

export const connectionStateSlice = createSlice({
    name: 'connection',
    initialState: {
        status: STATUS_DISCONNECTED,
        error: null
    },
    reducers: {
    },
    extraReducers: {
        [connectToVehicle.pending]: (state, action) => {
            console.log('Connection pending...');
            state.status = STATUS_CONNECTING;
        },
        [connectToVehicle.fulfilled]: (state, action) => {
            console.log('Connection established!');
            state.status = STATUS_CONNECTED;
        },
        [connectToVehicle.rejected]: (state, action) => {
            console.log('Connection rejected!');
            state.status = STATUS_FAILED;
        },
        [disconnectFromVehicle.pending]: (state, action) => {
            console.log('Disconnection pending...');
            state.status = STAT
        },
        [disconnectFromVehicle.fulfilled]: (state, action) => {
            console.log('Connection closed!');
            state.status = STATUS_DISCONNECTED;
        }
    }
});

export default connectionStateSlice.reducer