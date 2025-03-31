import React, { useEffect, useReducer } from "react";
import { IAction } from "../../types/app/store";
import { LibraryItem } from "../../context/auth/api/types/libraryitem";
import { useAuth } from "../../context/auth/auth.context";

export interface TimelineState {
    loading?: boolean;
    items?: LibraryItem[];
    selectedItem?: LibraryItem
}

const TimelineContext = React.createContext<[TimelineState, React.Dispatch<TimelineActions>]>([{}, () => {
    console.warn("You are atempting to use the Timeline Page dispatch outise of it's provider")
}]);

export const useTimeline = () => React.useContext(TimelineContext);

export type TimelineActions =
    IAction<'loading', boolean>
    | IAction<'items', LibraryItem[]>
    | IAction<'selectedItem', LibraryItem>

const reducer = (state: TimelineState, action: TimelineActions) => {
    switch (action.type) {
        case 'loading':
        case 'items':
        case 'selectedItem':
            return { ...state, [action.type]: action.payload }

    }
    return state;
}

export const TimelineProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [{ api }] = useAuth();
    const context = useReducer(reducer, {});

    const [, dispatch] = context;
    useEffect(() => {
        api.getLibraryItems().then(l => {
            dispatch({ type: 'items', payload: l })
        })
    }, [api, dispatch])

    return <TimelineContext.Provider value={context}>
        {children}
    </TimelineContext.Provider>
}