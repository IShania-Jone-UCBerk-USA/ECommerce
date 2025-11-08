import { useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: "",
    });
    const [isContextLoading, setIsContextLoading] = useState(true);

    useEffect(() => {
        const data = Cookies.get("auth");
        if (data) {
            const parsedData = JSON.parse(data);
            setAuth({
                user: parsedData.user,
                token: parsedData.token,
            });
        }
        setIsContextLoading(false);
    }, []);

    //Function to Logout user
    const LogOut = () => {
        setAuth({
            ...auth,
            user: null,
            token: "",
        });
        Cookies.remove("auth");
        // Clear all cart and user data from localStorage on logout
        localStorage.removeItem("cart");
        localStorage.removeItem("saveLater");
        localStorage.removeItem("shippingInfo");
        toast.success("Logged out Successfully!", {
            toastId: "LogOut",
        });
    };

    // isAdmin is now calculated directly from the auth state
    const isAdmin = auth?.user?.role === 1;

    return (
        <AuthContext.Provider
            value={{ auth, setAuth, LogOut, isAdmin, isContextLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

//custom hook->
const useAuth = () => {
    return useContext(AuthContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };