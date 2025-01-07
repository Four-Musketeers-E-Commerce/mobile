import { getCurrentUser } from "@/lib/appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCurrentUser().
        then(res => {
            if (res) {
                setUser(res);
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        }).
        catch(err => console.error(err.message)).
        finally(() => setIsLoading(false));
    }, []);

    return (
        <GlobalContext.Provider
        value={{
            user,
            setUser,
            isLoggedIn,
            setIsLoggedIn,
            isLoading
        }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export default GlobalProvider;