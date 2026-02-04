import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Toast Bildirim

function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const { user, addOrder } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const calculateTotal = () => cart.reduce((total, item) => total + (parseFloat(item.price || 0) * item.quantity), 0);
    const cartTotal = calculateTotal();

    const [formData, setFormData] = useState({
        first_name: user?.name?.split(" ")[0] || "",
        last_name: user?.name?.split(" ")[1] || "",
        address_1: "",
        city: "",
        phone: "",
        email: user?.email || "misafir@hosteva.com",
        cardName: "", cardNumber: "", expDate: "", cvv: ""
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // SİPARİŞ GÖNDERME POST
    const handlePayment = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const orderData = {
            payment_method: "bacs",
            payment_method_title: "Kredi Kartı (Simülasyon)",
            set_paid: true,
            billing: {
                first_name: formData.first_name,
                last_name: formData.last_name,
                address_1: formData.address_1,
                city: formData.city,
                phone: formData.phone,
                email: formData.email
            },
            line_items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }))
        };

        try {
            // WC API'ye POST İstek
            const response = await axios.post("http://localhost:10011/wp-json/wc/v3/orders", orderData, {
                params: {
                    consumer_key: "ck_27464d4df1a4232ea2989f5d2b425ecca43545ef",
                    consumer_secret: "cs_a40e83a50faf5b70607cf7c3271184166336e25c"
                }
            });

            console.log("Sipariş Başarılı:", response.data);

            // Profil sayfasına eklemek
            addOrder({
                id: response.data.id,
                date: new Date().toLocaleDateString(),
                status: "Hazırlanıyor",
                total: cartTotal.toFixed(2) + " TL",
                items: cart
            });

            toast.success(`Sipariş #${response.data.id} başarıyla oluşturuldu! 🎉`);
            clearCart();
            navigate("/profile");

        } catch (error) {
            console.error("Sipariş Hatası:", error.response ? error.response.data : error);
            toast.error("Sipariş oluşturulurken bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };
    /* Boş Sepet Ekranı */
    if (cart.length === 0) return ( 
        <div style={{ ...styles.container, display: "flex", flexDirection: "column" }}>
            <Header /><div style={{ flex: 1, textAlign: "center", padding: "50px" }}><h2>Sepetiniz Boş</h2><Link to="/" style={styles.blackBtn}>ALIŞVERİŞE DÖN</Link></div><Footer />
        </div>
    );

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: "#f9f9f9", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <div style={{ flex: 1, padding: "40px 20px" }}>
                <div style={styles.layout}>
                    <div style={styles.leftColumn}>
                        <h2 style={styles.sectionTitle}>TESLİMAT BİLGİLERİ</h2>
                        <form id="checkout-form" onSubmit={handlePayment}>
                            <div style={styles.row}>
                                <div style={styles.formGroup}><label style={styles.label}>Ad</label><input type="text" name="first_name" style={styles.input} value={formData.first_name} onChange={handleChange} required /></div>
                                <div style={styles.formGroup}><label style={styles.label}>Soyad</label><input type="text" name="last_name" style={styles.input} value={formData.last_name} onChange={handleChange} required /></div>
                            </div>
                            <div style={styles.formGroup}><label style={styles.label}>Telefon</label><input type="tel" name="phone" style={styles.input} value={formData.phone} onChange={handleChange} required /></div>
                            <div style={styles.formGroup}><label style={styles.label}>Adres</label><textarea name="address_1" style={{ ...styles.input, height: "80px" }} value={formData.address_1} onChange={handleChange} required /></div>
                            <div style={styles.formGroup}><label style={styles.label}>Şehir</label><input type="text" name="city" style={styles.input} value={formData.city} onChange={handleChange} required /></div>

                            <h2 style={{ ...styles.sectionTitle, marginTop: "40px" }}>ÖDEME</h2>
                            <div style={styles.cardBox}>
                                <div style={styles.formGroup}><label style={styles.label}>Kart No</label><input type="text" name="cardNumber" style={styles.input} placeholder="0000 0000 0000 0000" maxLength="19" required /></div>
                                <div style={{ display: "flex", gap: "20px" }}>
                                    <div style={{ flex: 1 }}><label style={styles.label}>SKT</label><input type="text" name="expDate" style={styles.input} placeholder="AA/YY" required /></div>
                                    <div style={{ flex: 1 }}><label style={styles.label}>CVV</label><input type="text" name="cvv" style={styles.input} placeholder="123" required /></div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div style={styles.rightColumn}>
                        <div style={styles.summaryBox}>
                            <h3 style={styles.summaryTitle}>ÖZET</h3>
                            <div style={styles.totalRow}><span>TOPLAM</span><span>{cartTotal.toFixed(2)} TL</span></div>
                            <button type="submit" form="checkout-form" style={styles.checkoutBtn} disabled={isSubmitting}>
                                {isSubmitting ? "İŞLENİYOR..." : "ÖDEMEYİ TAMAMLA"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

const styles = {
    //sadece container ekle
    container: { fontFamily: "'Inter', sans-serif", background: "#f9f9f9", minHeight: "100vh" },
    layout: { display: "flex", gap: "40px", maxWidth: "1200px", margin: "0 auto", flexWrap: "wrap" },
    leftColumn: { flex: 2, background: "#fff", padding: "30px", borderRadius: "8px", minWidth: "300px" },
    rightColumn: { flex: 1, minWidth: "300px" },
    sectionTitle: { fontSize: "16px", fontWeight: "700", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" },
    formGroup: { marginBottom: "15px", flex: 1 },
    row: { display: "flex", gap: "20px" },
    label: { display: "block", marginBottom: "5px", fontSize: "13px", fontWeight: "600", color: "#555" },
    input: { width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" },
    cardBox: { background: "#f8f9fa", padding: "20px", borderRadius: "6px", border: "1px solid #eee" },
    summaryBox: { background: "#fff", padding: "30px", borderRadius: "8px", position: "sticky", top: "20px" },
    summaryTitle: { fontSize: "16px", fontWeight: "700", marginBottom: "20px", textAlign: "center" },
    totalRow: { display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold", marginTop: "10px" },
    checkoutBtn: { width: "100%", background: "#000", color: "#fff", border: "none", padding: "15px", fontSize: "14px", fontWeight: "bold", marginTop: "25px", cursor: "pointer", opacity: 1 },
    blackBtn: { textDecoration: "none", background: "#000", color: "#fff", padding: "10px 20px", borderRadius: "4px" }
};

export default CheckoutPage;