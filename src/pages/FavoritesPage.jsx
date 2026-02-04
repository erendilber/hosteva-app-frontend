import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; 
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: "none" }}>
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

function FavoritesPage() {
    const { favorites, toggleFavorite, addToCart } = useCart();
    const { logout } = useAuth(); 

    const handleRemove = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product);
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        toast.success(`${product.name} sepete eklendi!`);
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <div style={{ flex: 1 }}>
                <div style={styles.container}>
                    <div style={styles.layout}>
                        {/* SOL MENÜ*/}
                        <aside style={styles.sidebar}>
                            <ul style={styles.menuList}>
                                <li style={styles.menuItem}><Link to="/profile" style={styles.link}>HESABIM</Link></li>
                                <li style={styles.menuItem}><Link to="/profile" style={styles.link}>SİPARİŞLERİM</Link></li>
                                <li style={styles.menuItem}><Link to="/profile" style={styles.link}>ADRES</Link></li>
                                <li style={styles.activeMenuItem}>FAVORİLERİM</li>
                                <li style={styles.menuItem}><Link to="/profile" style={styles.link}>İADELER</Link></li>
                                <li style={styles.menuItem}><Link to="/profile" style={styles.link}>HESABIMI SİL</Link></li>
                                <li style={{ ...styles.menuItem, marginTop: "20px", color: "#999", cursor: "pointer" }} onClick={logout}>ÇIKIŞ YAP</li>
                            </ul>
                        </aside>

                        {/*SAĞ TARAF İÇERİK*/}
                        <main style={styles.content}>
                            {favorites.length === 0 ? (
                                <div style={styles.emptyContainer}>
                                    <h3 style={styles.emptyText}>Alışveriş listeniz boş.</h3>
                                    <div style={styles.divider}></div>
                                    <div style={{ textAlign: "right" }}>
                                        <Link to="/"><button style={styles.continueBtn}>DEVAM</button></Link>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 style={styles.pageTitle}>FAVORİLERİM ({favorites.length} Ürün)</h3>
                                    <div style={styles.grid}>
                                        {favorites.map(product => (
                                            <div key={product.id} style={styles.card}>
                                                <button
                                                    style={styles.deleteBtn}
                                                    onClick={(e) => handleRemove(e, product)}
                                                    title="Favorilerden Kaldır"
                                                >
                                                    <TrashIcon />
                                                </button>

                                                <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                                    <div style={styles.imageWrapper}>
                                                        {product.images && product.images.length > 0 ? (
                                                            <img src={product.images[0].src} alt={product.name} style={styles.image} />
                                                        ) : (
                                                            <div style={styles.noImage}>Görsel Yok</div>
                                                        )}
                                                    </div>
                                                </Link>

                                                <div style={styles.info}>
                                                    <p style={styles.brand}>HOSTEVA COLLECTION</p>
                                                    <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                                        <h4 style={styles.name}>{product.name}</h4>
                                                    </Link>
                                                    <p style={styles.price}>{product.price} TL</p>

                                                    <button
                                                        style={styles.addToCartBtn}
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        SEPETE EKLE
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

const styles = {
    container: { padding: "50px 20px", maxWidth: "1400px", margin: "0 auto", color: "#333" },
    layout: { display: "flex", gap: "60px", flexDirection: "row" },
    sidebar: { width: "220px", flexShrink: 0, borderRight: "1px solid #eee", minHeight: "400px" },
    menuList: { listStyle: "none", padding: 0, margin: 0 },
    menuItem: { padding: "12px 0", fontSize: "12px", fontWeight: "600", color: "#888", letterSpacing: "0.5px" },
    activeMenuItem: { padding: "12px 0", fontSize: "12px", fontWeight: "800", color: "#000", letterSpacing: "0.5px" },
    link: { textDecoration: "none", color: "inherit", display: "block", cursor: "pointer" },
    content: { flex: 1, paddingLeft: "20px" },
    emptyContainer: { padding: "20px 0" },
    emptyText: { fontSize: "14px", fontWeight: "400", color: "#333", marginBottom: "20px" },
    divider: { height: "1px", background: "#eee", width: "100%", marginBottom: "20px" },
    continueBtn: { background: "#fff", border: "1px solid #000", padding: "10px 30px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase" },
    pageTitle: { fontSize: "16px", fontWeight: "400", marginBottom: "30px", textAlign: "center", textTransform: "uppercase" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "30px" },
    card: { position: "relative", display: "flex", flexDirection: "column" },
    deleteBtn: { position: "absolute", top: "10px", right: "10px", background: "#fff", border: "1px solid #eee", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "red", zIndex: 50 },
    imageWrapper: { height: "300px", background: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "15px" },
    image: { width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply" },
    noImage: { fontSize: "12px", color: "#999" },
    info: { textAlign: "left" },
    brand: { fontSize: "10px", color: "#888", textTransform: "uppercase", marginBottom: "5px", letterSpacing: "0.5px" },
    name: { fontSize: "13px", fontWeight: "400", color: "#000", margin: "0 0 10px 0", height: "36px", overflow: "hidden", lineHeight: "1.4" },
    price: { fontSize: "14px", fontWeight: "700", marginBottom: "15px" },
    addToCartBtn: { width: "100%", background: "#000", color: "#fff", border: "none", padding: "12px", fontSize: "11px", fontWeight: "bold", letterSpacing: "1px", cursor: "pointer" }
};

export default FavoritesPage;