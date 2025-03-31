import React from "react";
import { Auth } from "./Auth";
import { useReactive } from "../../types/reactive/usereactive";
import { ExcludeMethods, ReactiveState } from "../../types/reactive/type";

const initAuth = new Auth();
const AuthContext = React.createContext<ReactiveState<Auth, ExcludeMethods<Auth>>>([initAuth.createState(), initAuth]);
export const useAuth = () => React.useContext(AuthContext)

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const auth = useReactive(() => new Auth());
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}