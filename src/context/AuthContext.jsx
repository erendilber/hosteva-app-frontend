import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // LOGIN
    const login = async (username, password) => {
        const toastId = toast.loading("Giriş yapılıyor...");

        try {
            // WordPress, kullanıcı var mı?
            const res = await axios.post('http://localhost:10011/wp-json/jwt-auth/v1/token', {
                username: username,
                password: password
            });

            // Varsa bilgileri al
            if (res.status === 200 && res.data.token) {
                const userData = {
                    token: res.data.token,
                    email: res.data.user_email,
                    name: res.data.user_display_name,
                    id: res.data.user_id
                };

                // Hafızaya kaydet
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));

                // Giriş yapınca hemen sipariş geçmişini çek
                fetchUserOrders(userData.id);

                toast.update(toastId, { render: `Hoş geldin, ${userData.name}! 👋`, type: "success", isLoading: false, autoClose: 3000 });
                return true;
            }
        } catch (error) {
            console.error("Login Hatası:", error);
            const errorMsg = error.response?.data?.message?.replace(/<[^>]+>/g, '') || "Giriş başarısız.";
            toast.update(toastId, { render: errorMsg, type: "error", isLoading: false, autoClose: 4000 });
            return false;
        }
    };

    // (REGISTER)
    const register = async (name, username, email, password) => {
        const toastId = toast.loading("Kayıt olunuyor...");

        try {
            const res = await axios.post('http://localhost:10011/wp-json/hosteva/v1/register', {
                name: name,
                username: username,
                email: email,
                password: password
            });

            if (res.status === 200) {
                toast.update(toastId, { render: "Kayıt Başarılı! 🎉 Giriş yapabilirsiniz.", type: "success", isLoading: false, autoClose: 3000 });
                return true;
            }
        } catch (error) {
            console.error("Kayıt Hatası:", error);
            const errorMsg = error.response?.data?.message || "Kayıt başarısız oldu.";
            toast.update(toastId, { render: errorMsg, type: "error", isLoading: false, autoClose: 4000 });
            return false;
        }
    };

    // FETCH ORDERS
    const fetchUserOrders = async (userId) => {
        if (!userId) return;
        try {
            const res = await axios.get("http://localhost:10011/wp-json/wc/v3/orders", {
                params: {
                    customer: userId, 
                    consumer_key: "ck_27464d4df1a4232ea2989f5d2b425ecca43545ef",
                    consumer_secret: "cs_a40e83a50faf5b70607cf7c3271184166336e25c"
                }
            });
            setOrders(res.data);
        } catch (error) {
            console.error("Siparişler çekilemedi:", error);
        }
    };

    // SİPARİŞ EKLEME 
    const addOrder = (newOrder) => {
        setOrders(prev => [newOrder, ...prev]);
    };

    // ÇIKIŞ
    const logout = () => {
        setUser(null);
        setOrders([]);
        localStorage.removeItem("user");
        toast.info("Çıkış yapıldı.");
    };

    // Sayfa Yenilenince Hatırla
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Kullanıcı varsa siparişlerini de çek
            fetchUserOrders(parsedUser.id);
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, orders, addOrder }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};