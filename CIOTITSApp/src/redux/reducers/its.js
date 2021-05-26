const initialState = {
    v2v: {
        wsMessages: []
    },
    v2i: {
        speedLimit: 50
    },
    monitor: {
        speed: undefined,
        engineTemperature: undefined,
    }
};

export default function(state = initialState, action) {
    switch (action) {
        default:
            return state;
    }
}