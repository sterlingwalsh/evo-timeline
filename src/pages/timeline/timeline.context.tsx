import React, { useReducer } from "react";
import { IAction } from "../../types/app/store";

export interface TimelineState {
    loading?: boolean;
}

const TimelineContext = React.createContext<[TimelineState, React.Dispatch<TimelineActions>]>([{}, () => {
    console.warn("You are atempting to use the Timeline Page dispatch outise of it's provider")
}]);

export type TimelineActions = IAction<'loading', boolean>

const reducer = (state: TimelineState, action: TimelineActions) => {
    switch (action.type) {
        case 'loading':
            return { ...state, [action.type]: action.payload }
    }
    return state;
}

export const TimelineProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const context = useReducer(reducer, {});

    return <TimelineContext.Provider value={context}>
        {children}
    </TimelineContext.Provider>
}