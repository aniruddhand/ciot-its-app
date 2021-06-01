import { configureStore } from '@reduxjs/toolkit'

import connectionStateReducer from './reducers/connectionStateSlice';

export default configureStore({
    reducer: {
        connection: connectionStateReducer
    }
})