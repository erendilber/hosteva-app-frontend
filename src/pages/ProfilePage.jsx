import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const MOCK_ADDRESS = { title: "Ev Adresim", detail: "Örnek Mah. Test Sok.", city: "İstanbul", phone: "0555 000 00 00" };

function ProfilePage() {
    const { user, login, register, logout, orders } = useAuth();

    const [activeTab, setActiveTab] = useState("dashboard");
    const [authMode, setAuthMode] = useState("login");

    // Form Stateleri
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");

    // Eğer kullanıcı sayfayı yenilediyse ve orders boşsa, AuthContext zaten çekiyor ama
    // yine de orders'ın geldiğinden emin olmak için UI'ı güncel tutuyoruz.

    // İÇERİK
    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <div>
                        <h3 style={styles.sectionTitle}>HESABIM</h3>
                        <p style={styles.text}>Merhaba <strong>{user.name}</strong>,</p>
                        <div style={{ marginTop: "30px", padding: "20px", background: "#f9f9f9", borderRadius: "5px" }}>
                            <h4 style={{ fontSize: "14px", marginBottom: "10px" }}>ÜYELİK BİLGİLERİ</h4>
                            <p style={styles.text}>{user.name}</p>
                            <p style={styles.text}>{user.email}</p>
                            <p style={{ ...styles.text, fontSize: "11px", color: "#999" }}>Müşteri ID: {user.id}</p>
                        </div>
                    </div>
                );

            case "orders":
                return (
                    <div>
                        <h3 style={styles.sectionTitle}>SİPARİŞLERİM</h3>
                        {orders && orders.length > 0 ? (
                            orders.map(order => (
                                <div key={order.id} style={styles.orderCard}>
                                    <div style={styles.orderHeader}>
                                        <span style={{ fontWeight: "600" }}>Sipariş No: #{order.id}</span>
                                        <span style={{ fontSize: "12px", color: "#888" }}>
                                            {new Date(order.date_created || Date.now()).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={styles.statusBadge(order.status)}>{order.status === 'processing' ? 'İşleniyor' : order.status}</span>
                                        <span style={{ fontWeight: "bold" }}>{order.total} {order.currency_symbol || 'TL'}</span>
                                    </div>

                                    {/*ÜRÜN LİSTESİ*/}
                                    <div style={styles.orderItemsList}>
                                        {(order.line_items || order.items || []).map((item, index) => (
                                            <div key={index} style={styles.orderItemRow}>
                                                <div style={styles.orderItemImageWrapper}>
                                                    {item.image ? (
                                                        <img src={item.image.src} alt={item.name} style={styles.orderItemImage} />
                                                    ) : (
                                                        <div style={styles.noImage}>Görsel Yok</div>
                                                    )}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontSize: "13px", fontWeight: "500", margin: "0" }}>{item.name}</p>
                                                    <p style={{ fontSize: "11px", color: "#888" }}>Adet: {item.quantity}</p>
                                                </div>
                                                <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                                                    {item.total || item.price} TL
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={styles.emptyState}>
                                <p>Henüz siparişiniz bulunmuyor.</p>
                                <button style={styles.blackBtn} onClick={() => window.location.href = '/'}>ALIŞVERİŞE BAŞLA</button>
                            </div>
                        )}
                    </div>
                );

            case "address":
                return (<div><h3 style={styles.sectionTitle}>ADRESLERİM</h3><div style={styles.addressCard}><h4 style={{ fontSize: "14px", fontWeight: "bold" }}>{MOCK_ADDRESS.title}</h4><p style={styles.text}>{MOCK_ADDRESS.detail}</p></div></div>);
            case "returns":
                return (<div><h3 style={styles.sectionTitle}>İADELERİM</h3><div style={styles.emptyState}><p>İade talebiniz yok.</p></div></div>);
            case "delete":
                return (<div><h3 style={styles.sectionTitle}>HESABIMI SİL</h3><button style={{ ...styles.blackBtn, background: "red", borderColor: "red" }}>SİL</button></div>);
            default: return null;
        }
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <div style={{ flex: 1 }}>
                {!user ? (
                    // LOGİN / REGİSTER EKRANI
                    <div style={styles.authContainer}>
                        <div style={styles.authBox}>
                            <h2 style={styles.authTitle}>HESABIM</h2>
                            <div style={styles.authTabs}>
                                <button style={{ ...styles.authTab, borderBottom: authMode === "login" ? "2px solid black" : "1px solid #eee" }} onClick={() => setAuthMode("login")}>GİRİŞ YAP</button>
                                <button style={{ ...styles.authTab, borderBottom: authMode === "register" ? "2px solid black" : "1px solid #eee" }} onClick={() => setAuthMode("register")}>ÜYE OL</button>
                            </div>

                            {authMode === "login" ? (
                                <form onSubmit={async (e) => { e.preventDefault(); await login(email, password) }} style={styles.form}>
                                    <input type="text" placeholder="Kullanıcı Adı veya E-Posta" style={styles.input} value={email} onChange={e => setEmail(e.target.value)} required />
                                    <input type="password" placeholder="Şifre" style={styles.input} value={password} onChange={e => setPassword(e.target.value)} required />
                                    <button type="submit" style={styles.blackBtn}>GİRİŞ YAP</button>
                                </form>
                            ) : (
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const success = await register(name, username, email, password);
                                    if (success) {
                                        setAuthMode("login");
                                        setEmail(username);
                                    }
                                }} style={styles.form}>
                                    <input type="text" placeholder="Ad Soyad" style={styles.input} value={name} onChange={e => setName(e.target.value)} required />
                                    <input type="text" placeholder="Kullanıcı Adı (Örn: ahmet123)" style={styles.input} value={username} onChange={e => setUsername(e.target.value)} required />
                                    <input type="email" placeholder="E-Posta" style={styles.input} value={email} onChange={e => setEmail(e.target.value)} required />
                                    <input type="password" placeholder="Şifre" style={styles.input} value={password} onChange={e => setPassword(e.target.value)} required />
                                    <button type="submit" style={styles.blackBtn}>ÜYE OL</button>
                                </form>
                            )}
                        </div>
                    </div>
                ) : (
                    // LOGİN OLMUŞ KULLANICI EKRANI
                    <div style={styles.container}>
                        <div style={styles.layout}>
                            <aside style={styles.sidebar}>
                                {/*MENÜ SIRALAMASI*/}
                                <ul style={styles.menuList}>
                                    <li style={activeTab === "dashboard" ? styles.activeMenuItem : styles.menuItem} onClick={() => setActiveTab("dashboard")}>HESABIM</li>
                                    <li style={activeTab === "orders" ? styles.activeMenuItem : styles.menuItem} onClick={() => setActiveTab("orders")}>SİPARİŞLERİM</li>
                                    <li style={activeTab === "address" ? styles.activeMenuItem : styles.menuItem} onClick={() => setActiveTab("address")}>ADRES</li>
                                    <li style={styles.menuItem}><Link to="/favorites" style={{ textDecoration: "none", color: "inherit" }}>FAVORİLERİM</Link></li>
                                    <li style={activeTab === "returns" ? styles.activeMenuItem : styles.menuItem} onClick={() => setActiveTab("returns")}>İADELER</li>
                                    <li style={activeTab === "delete" ? styles.activeMenuItem : styles.menuItem} onClick={() => setActiveTab("delete")}>HESABIMI SİL</li>
                                    <li style={{ ...styles.menuItem, marginTop: "20px", color: "#999" }} onClick={logout}>ÇIKIŞ YAP</li>
                                </ul>
                            </aside>
                            <main style={styles.content}>{renderContent()}</main>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

const styles = {
    container: { padding: "50px 20px", maxWidth: "1400px", margin: "0 auto", color: "#333" },
    authContainer: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", padding: "40px" },
    authBox: { width: "100%", maxWidth: "400px", padding: "20px" },
    authTitle: { textAlign: "center", fontSize: "24px", marginBottom: "30px", letterSpacing: "1px" },
    authTabs: { display: "flex", marginBottom: "30px" },
    authTab: { flex: 1, padding: "10px", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
    form: { display: "flex", flexDirection: "column", gap: "15px" },
    input: { padding: "12px", border: "1px solid #ddd", fontSize: "14px", outline: "none" },
    layout: { display: "flex", gap: "60px", flexDirection: "row" },
    sidebar: { width: "220px", flexShrink: 0, borderRight: "1px solid #eee", minHeight: "400px" },
    content: { flex: 1, paddingLeft: "20px" },
    menuList: { listStyle: "none", padding: 0, margin: 0 },
    menuItem: { fontSize: "12px", fontWeight: "600", color: "#888", padding: "12px 0", cursor: "pointer", letterSpacing: "0.5px", transition: "color 0.2s" },
    activeMenuItem: { fontSize: "12px", fontWeight: "800", color: "#000", padding: "12px 0", cursor: "pointer", letterSpacing: "0.5px" },
    sectionTitle: { fontSize: "16px", fontWeight: "700", marginBottom: "20px", letterSpacing: "1px", textTransform: "uppercase" },
    text: { fontSize: "14px", lineHeight: "1.6", color: "#555", margin: "0 0 10px 0" },
    blackBtn: { background: "#000", color: "#fff", border: "1px solid #000", padding: "12px 25px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", letterSpacing: "1px" },
    orderCard: { border: "1px solid #eee", padding: "20px", marginBottom: "20px", borderRadius: "4px" },
    orderHeader: { display: "flex", justifyContent: "space-between", marginBottom: "15px", borderBottom: "1px solid #f5f5f5", paddingBottom: "10px" },
    statusBadge: (status) => ({ fontSize: "11px", fontWeight: "bold", padding: "3px 8px", borderRadius: "2px", background: status.includes("Teslim") ? "#eaffea" : "#fff4e6", color: status.includes("Teslim") ? "green" : "orange" }),
    addressCard: { border: "1px solid #eee", padding: "20px", maxWidth: "400px", borderRadius: "4px" },
    emptyState: { padding: "40px", textAlign: "center", background: "#f9f9f9", color: "#666", fontSize: "14px" },
    orderItemsList: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" },
    orderItemRow: { display: "flex", alignItems: "center", gap: "15px", borderTop: "1px solid #fafafa", paddingTop: "10px" },
    orderItemImageWrapper: { width: "50px", height: "60px", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", overflow: "hidden" },
    orderItemImage: { width: "100%", height: "100%", objectFit: "cover" },
    noImage: { fontSize: "8px", color: "#999", textAlign: "center" }
};

export default ProfilePage;