import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer"; 

function CartPage() {
    const { cart, removeFromCart } = useCart();

    // Toplam Tutar Hesaplama
    const totalPrice = cart.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            {/* 1. Header */}
            <Header />

            {/* 2. İçerik */}
            <div style={{ flex: 1 }}>

                {/* //Sepet Boşsa */}
                {cart.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <h2 style={styles.emptyTitle}>Sepetinizde Ürün Bulunmamaktadır</h2>
                        <p style={styles.emptyText}>Yeni sezon ürünlerini keşfetmek için alışverişe başlayın.</p>
                        <Link to="/" style={styles.startShoppingBtn}>ALIŞVERİŞE BAŞLA</Link>
                    </div>
                ) : (
                    // Sepet Doluysa
                    <div style={styles.container}>
                        <h1 style={styles.pageTitle}>SEPETİM ({cart.length} Ürün)</h1>

                        <div style={styles.contentWrapper}>

                            {/*ÜRÜNLER */}
                            <div style={styles.productList}>
                                <div style={styles.tableHeader}>
                                    <span style={{ flex: 3 }}>ÜRÜN</span>
                                    <span style={{ flex: 1, textAlign: "center" }}>ADET</span>
                                    <span style={{ flex: 1, textAlign: "right" }}>FİYAT</span>
                                    <span style={{ width: "40px" }}></span>
                                </div>

                                {cart.map((item) => (
                                    <div key={item.id} style={styles.cartItem}>
                                        {/* Resim ve İsim */}
                                        <div style={styles.productInfo}>
                                            <div style={styles.imageBox}>
                                                {item.images && item.images.length > 0 ? (
                                                    <img src={item.images[0].src} alt={item.name} style={styles.image} />
                                                ) : (
                                                    <div style={styles.noImage}>Resim Yok</div>
                                                )}
                                            </div>
                                            <div style={styles.details}>
                                                <span style={styles.brand}>HOSTEVA</span>
                                                <Link to={`/product/${item.id}`} style={styles.productNameLink}>
                                                    <h3 style={styles.productName}>{item.name}</h3>
                                                </Link>
                                                <span style={styles.size}>Beden: Standart</span>
                                            </div>
                                        </div>

                                        {/* Adet */}
                                        <div style={styles.quantityBox}>
                                            <span>{item.quantity}</span>
                                        </div>

                                        {/* Fiyat */}
                                        <div style={styles.priceBox}>
                                            <span style={styles.itemPrice}>{(parseFloat(item.price) * item.quantity).toFixed(2)} TL</span>
                                        </div>

                                        {/* Sil Butonu */}
                                        <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/*SİPARİŞ ÖZETİ */}
                            <div style={styles.summaryBox}>
                                <h3 style={styles.summaryTitle}>SİPARİŞ ÖZETİ</h3>

                                <div style={styles.summaryRow}>
                                    <span>Ürünlerin Toplamı</span>
                                    <span>{totalPrice} TL</span>
                                </div>
                                <div style={styles.summaryRow}>
                                    <span>Kargo Toplamı</span>
                                    <span>0.00 TL</span>
                                </div>

                                <div style={styles.divider}></div>

                                <div style={styles.totalRow}>
                                    <span>TOPLAM</span>
                                    <span>{totalPrice} TL</span>
                                </div>
                                <Link to="/checkout" style={{ textDecoration: "none", width: "100%", display: "block" }}>
                                    <button style={styles.checkoutBtn}>
                                        SEPETİ ONAYLA
                                    </button>
                                </Link>

                                <Link to="/" style={styles.continueLink}>Alışverişe Devam Et</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Footer */}
            <Footer />
        </div>
    );
}

// Stıl
const styles = {
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
        color: "#333",
    },
    pageTitle: {
        fontSize: "24px",
        fontWeight: "400",
        marginBottom: "30px",
        letterSpacing: "1px"
    },
    contentWrapper: {
        display: "flex",
        gap: "40px",
        flexWrap: "wrap"
    },
    // BOŞ SEPET
    emptyContainer: {
        textAlign: "center",
        padding: "100px 20px",
        flex: 1
    },
    emptyTitle: { fontSize: "24px", marginBottom: "10px" },
    emptyText: { color: "#777", marginBottom: "30px" },
    startShoppingBtn: {
        display: "inline-block",
        padding: "15px 40px",
        background: "#000",
        color: "#fff",
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: "14px",
        borderRadius: "4px"
    },
    // SOL LİSTE
    productList: {
        flex: 2,
        minWidth: "300px"
    },
    tableHeader: {
        display: "flex",
        paddingBottom: "15px",
        borderBottom: "1px solid #ddd",
        fontSize: "12px",
        fontWeight: "bold",
        color: "#999",
        letterSpacing: "1px"
    },
    cartItem: {
        display: "flex",
        alignItems: "center",
        padding: "20px 0",
        borderBottom: "1px solid #eee"
    },
    productInfo: {
        flex: 3,
        display: "flex",
        gap: "20px",
        alignItems: "center"
    },
    imageBox: {
        width: "80px",
        height: "100px",
        background: "#f9f9f9",
        flexShrink: 0
    },
    image: { width: "100%", height: "100%", objectFit: "cover" },
    noImage: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#ccc" },
    details: { display: "flex", flexDirection: "column", gap: "5px" },
    brand: { fontSize: "11px", color: "#999", fontWeight: "bold" },
    productNameLink: { textDecoration: "none", color: "#333" },
    productName: { fontSize: "14px", margin: 0, fontWeight: "500" },
    size: { fontSize: "12px", color: "#777" },
    quantityBox: { flex: 1, textAlign: "center", fontSize: "14px" },
    priceBox: { flex: 1, textAlign: "right", fontSize: "14px", fontWeight: "bold" },
    removeBtn: {
        width: "40px",
        background: "transparent",
        border: "none",
        fontSize: "24px",
        color: "#ccc",
        cursor: "pointer",
        transition: "color 0.2s"
    },
    // SAĞ ÖZET KUTUSU
    summaryBox: {
        flex: 1,
        minWidth: "280px",
        background: "#f9f9f9",
        padding: "30px",
        height: "fit-content",
        borderRadius: "4px"
    },
    summaryTitle: { fontSize: "16px", marginBottom: "20px", letterSpacing: "1px" },
    summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "14px", color: "#555" },
    divider: { height: "1px", background: "#ddd", margin: "20px 0" },
    totalRow: { display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold", marginBottom: "30px" },
    checkoutBtn: {
        width: "100%",
        padding: "16px",
        background: "#000",
        color: "#fff",
        border: "none",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        marginBottom: "15px",
        letterSpacing: "1px"
    },
    continueLink: { display: "block", textAlign: "center", fontSize: "13px", color: "#555", textDecoration: "underline" }
};

export default CartPage;