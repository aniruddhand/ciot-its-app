import { configureStore } from '@reduxjs/toolkit'

import connectButtonStateReducer from './reducers/connectButtonStateSlice';
import connectButtonLabelReducer from './reducers/connectButtonLabelSlice';

export default configureStore({
    reducer: {
        connectButtonState: connectButtonStateReducer,
        connectButtonLabel: connectButtonLabelReducer
    }
})