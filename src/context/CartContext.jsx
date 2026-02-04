import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Sepet ve Favori Stateleri
    const [cart, setCart] = useState([]);
    const [favorites, setFavorites] = useState([]);

    // Sayfa açılınca LocalStorage'dan verileri çek
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        const storedFavs = localStorage.getItem("favorites");
        if (storedCart) setCart(JSON.parse(storedCart));
        if (storedFavs) setFavorites(JSON.parse(storedFavs));
    }, []);

    // Veriler değişince LocalStoragea kaydet
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    // SEPET FONKSİYONLARI
    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prev, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    // Favorilere Ekle-Çıkar
    const toggleFavorite = (product) => {
        setFavorites((prev) => {
            const exists = prev.find((item) => item.id === product.id);
            if (exists) {
                return prev.filter((item) => item.id !== product.id);
            } else {
                return [...prev, product];
            }
        });
    };

    // Favorilerden SİL
    const removeFromFavorite = (id) => {
        setFavorites((prev) => prev.filter((item) => item.id !== id));
    };

    // TOPLAM TUTAR
    const totalPrice = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            totalPrice,
            favorites,
            toggleFavorite,
            removeFromFavorite // 
        }}>
            {children}
        </CartContext.Provider>
    );
};