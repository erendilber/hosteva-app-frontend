import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// İKONLAR 
const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const BagIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const HeartIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const HeartFilledIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="red" stroke="red" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;

// API AYARLARI
const API_URL = "http://localhost:10011/wp-json/wc/v3";
const CONSUMER_KEY = "ck_27464d4df1a4232ea2989f5d2b425ecca43545ef";
const CONSUMER_SECRET = "cs_a40e83a50faf5b70607cf7c3271184166336e25c";

// ÜRÜN KARTI BİLEŞENİ
const ProductCard = ({ product }) => {
    const { addToCart, toggleFavorite, favorites } = useCart();
    const [quantity, setQuantity] = useState(1);

    const isFav = Array.isArray(favorites) && favorites.some(item => item.id === product.id);

    const getBrandName = () => {
        if (!product.attributes) return "HOSTEVA";
        const brandAttr = product.attributes.find(attr => attr.name.toLowerCase() === "marka");
        if (brandAttr && brandAttr.options && brandAttr.options.length > 0) return brandAttr.options[0];
        return "HOSTEVA";
    };

    const brandName = getBrandName();

    const increaseQty = (e) => { e.preventDefault(); e.stopPropagation(); setQuantity(p => p + 1); };
    const decreaseQty = (e) => { e.preventDefault(); e.stopPropagation(); if (quantity > 1) setQuantity(p => p - 1); };

    const handleAddToCart = (e) => {
        e.preventDefault(); e.stopPropagation();
        for (let i = 0; i < quantity; i++) addToCart(product);
        setQuantity(1);
        toast.success(`${product.name} sepete eklendi!`);
    };

    const handleToggleFav = (e) => {
        e.preventDefault(); e.stopPropagation();
        toggleFavorite(product);
    };

    return (
        <div style={styles.card}>
            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={styles.imageWrapper}>
                    <span style={styles.cardBrandLogo}>{brandName}</span>
                    <button style={styles.favBtn} onClick={handleToggleFav}>
                        {isFav ? <HeartFilledIcon /> : <HeartIcon />}
                    </button>
                    {product.sale_price && <span style={styles.discountBadge}>İNDİRİM</span>}
                    {product.images && product.images.length > 0 ? (
                        <img src={product.images[0].src} alt={product.name} style={styles.productImage} />
                    ) : (
                        <div style={styles.noImage}>Görsel Yok</div>
                    )}
                </div>
                <div style={styles.cardInfo}>
                    <p style={styles.brandName}>{brandName} COLLECTION</p>
                    <h3 style={styles.productName}>{product.name}</h3>
                    <div style={styles.priceActionRow}>
                        <div style={styles.priceBox}>
                            {product.sale_price ? (
                                <><span style={styles.oldPrice}>{product.regular_price} TL</span><span style={styles.newPrice}>{product.price} TL</span></>
                            ) : (
                                <span style={styles.newPrice}>{product.price || '0'} TL</span>
                            )}
                        </div>
                        <div style={styles.miniQtyBox}>
                            <button onClick={decreaseQty} style={styles.miniQtyBtn}>-</button>
                            <span style={styles.miniQtyText}>{quantity}</span>
                            <button onClick={increaseQty} style={styles.miniQtyBtn}>+</button>
                        </div>
                    </div>
                </div>
            </Link>
            <button style={styles.addToCartBtn} onClick={handleAddToCart}>SEPETE EKLE</button>
        </div>
    );
};

// --- ANA SAYFA ---
function HomePage() {
    const [products, setProducts] = useState([]); // API'den gelen ham ürünler
    const [filteredProducts, setFilteredProducts] = useState([]); // Ekrana basılan (filtrelenmiş) ürünler
    const [categories, setCategories] = useState([]); // Kategori ID'lerini bulmak için
    const [loading, setLoading] = useState(true);

    // Filtre Stateleri
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(""); // Gecikmeli Arama
    const [selectedCategoryName, setSelectedCategoryName] = useState(null); // UI için isim
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState("all");

    // Kategorileri Çek ID Eşleşmesi İçin
    useEffect(() => {
        axios.get(`${API_URL}/products/categories`, {
            params: { consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET, per_page: 50 }
        }).then(res => setCategories(res.data)).catch(err => console.error("Kategori Hatası:", err));
    }, []);

    // Arama Gecikmesi Debounce
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // SERVER-SIDE DATA FETCHING
    useEffect(() => {
        setLoading(true);

        // API Parametreleri
        const params = {
            consumer_key: CONSUMER_KEY,
            consumer_secret: CONSUMER_SECRET,
            per_page: 50, 
            status: 'publish'
        };

        // Eğer arama varsa ekle
        if (debouncedSearch) {
            params.search = debouncedSearch;
        }

        // Eğer kategori seçiliyse IDyi bul ekle
        if (selectedCategoryName) {
            // "Ayakkabı" içeriyorsa o kategoriyi bul
            const cat = categories.find(c => c.name.toLowerCase().includes(selectedCategoryName.toLowerCase().split(" ")[0]));
            if (cat) params.category = cat.id;
        }

        // API İsteği
        axios.get(`${API_URL}/products`, { params })
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : [];
                setProducts(data); // Ham veriyi kaydet
                setLoading(false);
            })
            .catch((err) => {
                console.error("Ürün Çekme Hatası:", err);
                setProducts([]);
                setLoading(false);
                toast.error("Ürünler yüklenemedi.");
            });

    }, [debouncedSearch, selectedCategoryName, categories]); // Bu değişkenler değişirse API'ye bak

    // CLIENT-SIDE FILTRELEME 
    useEffect(() => {
        let result = products;

        // Marka Filtresi
        if (selectedBrands.length > 0) {
            result = result.filter(p =>
                selectedBrands.some(brand => {
                    const nameMatch = p.name.toLowerCase().includes(brand.toLowerCase());
                    const attrMatch = p.attributes && p.attributes.some(attr =>
                        attr.name.toLowerCase() === "marka" &&
                        attr.options.some(opt => opt.toLowerCase() === brand.toLowerCase())
                    );
                    return nameMatch || attrMatch;
                })
            );
        }

        // Fiyat Filtresi
        if (priceRange !== "all") {
            result = result.filter(p => {
                const price = parseFloat(p.price || 0);
                if (priceRange === "0-3000") return price <= 3000;
                if (priceRange === "3000-10000") return price > 3000 && price <= 10000;
                if (priceRange === "10000+") return price > 10000;
                return true;
            });
        }

        setFilteredProducts(result);
    }, [products, selectedBrands, priceRange]);


    // Handlerlar
    const handleCategoryClick = (catName) => {
        setSelectedCategoryName(prev => prev === catName ? null : catName);
    };

    const handleBrandChange = (brand) => {
        setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    };

    return (
        <div style={{ ...styles.container, display: "flex", flexDirection: "column" }}>

            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Ürün Ara..."
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button style={styles.searchButton}><SearchIcon /></button>
                    </div>
                </div>
                <div style={styles.headerCenter} onClick={() => { setSelectedCategoryName(null); setSearchTerm(""); setSelectedBrands([]); setPriceRange("all"); }}>
                    <h1 style={styles.logoText}>HOSTEVA</h1>
                </div>
                <div style={styles.headerRight}>
                    <Link to="/profile" style={styles.iconLink}><div style={styles.iconItem}><UserIcon /></div></Link>
                    <Link to="/favorites" style={styles.iconLink}><div style={styles.iconItem}><HeartIcon /></div></Link>
                    <Link to="/cart" style={styles.iconLink}><div style={styles.iconItem}><BagIcon /></div></Link>
                </div>
            </header>

            {/* Slider */}
            <div style={styles.sliderContainer}>
                <Swiper modules={[Navigation, Pagination, Autoplay]} spaceBetween={0} slidesPerView={1} navigation pagination={{ clickable: true }} autoplay={{ delay: 3000, disableOnInteraction: false }} loop={true} style={{ height: "100%" }}>
                    <SwiperSlide><div style={{ ...styles.slide, background: "#000", color: "#fff" }}><h2 style={{ fontSize: "3vw", marginBottom: "10px" }}>YENİ SEZON BAŞLADI</h2><p style={{ fontSize: "1.2vw" }}>En trend ürünleri keşfedin.</p></div></SwiperSlide>
                    <SwiperSlide><div style={{ ...styles.slide, background: "#f5f5f5", color: "#000" }}><h2 style={{ fontSize: "3vw", marginBottom: "10px" }}>%50'YE VARAN İNDİRİMLER</h2><p style={{ fontSize: "1.2vw" }}>Sınırlı süre için geçerli fırsatlar.</p></div></SwiperSlide>
                </Swiper>
            </div>

            {/* İçerik */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

                <nav style={styles.navBar}>
                    <span style={{ ...styles.navLink, fontWeight: selectedCategoryName === "Ayakkabı" ? "800" : "600", borderBottom: selectedCategoryName === "Ayakkabı" ? "2px solid black" : "none" }} onClick={() => handleCategoryClick("Ayakkabı")}>AYAKKABI</span>
                    <span style={{ ...styles.navLink, fontWeight: selectedCategoryName === "Çanta" ? "800" : "600", borderBottom: selectedCategoryName === "Çanta" ? "2px solid black" : "none" }} onClick={() => handleCategoryClick("Çanta")}>ÇANTA & AKSESUAR</span>
                </nav>

                <div style={styles.mainContent}>
                    {/* Sidebar */}
                    <aside style={styles.sidebar}>
                        <div style={styles.filterGroup}>
                            <h3 style={styles.filterTitle}>MARKALAR</h3>
                            <ul style={styles.filterList}>
                                {["Adidas", "Nike", "Puma", "Hosteva", "Guess", "Armani", "Calvin Klein"].map(brand => (
                                    <li key={brand}>
                                        <label style={styles.checkboxLabel}>
                                            <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)} />
                                            {brand}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={styles.filterGroup}>
                            <h3 style={styles.filterTitle}>FİYAT ARALIĞI</h3>
                            <ul style={styles.filterList}>
                                <li><label style={styles.checkboxLabel}><input type="radio" name="price" checked={priceRange === "all"} onChange={() => setPriceRange("all")} /> Tüm Fiyatlar</label></li>
                                <li><label style={styles.checkboxLabel}><input type="radio" name="price" checked={priceRange === "0-3000"} onChange={() => setPriceRange("0-3000")} /> 0 - 3.000 TL</label></li>
                                <li><label style={styles.checkboxLabel}><input type="radio" name="price" checked={priceRange === "3000-10000"} onChange={() => setPriceRange("3000-10000")} /> 3.000 - 10.000 TL</label></li>
                                <li><label style={styles.checkboxLabel}><input type="radio" name="price" checked={priceRange === "10000+"} onChange={() => setPriceRange("10000+")} /> 10.000 TL +</label></li>
                            </ul>
                        </div>
                    </aside>

                    {/* Ürün Listesi */}
                    <div style={styles.productGridWrapper}>
                        <div style={styles.sortBar}>
                            <span style={styles.resultCount}>
                                {selectedCategoryName ? `${selectedCategoryName.toUpperCase()} - ` : ""}
                                {filteredProducts.length} Ürün Listeleniyor
                            </span>
                            <select style={styles.sortSelect}><option>Sırala: Varsayılan</option></select>
                        </div>

                        <div style={styles.grid}>
                            {loading ? (
                                Array(8).fill(0).map((_, i) => (
                                    <div key={i} style={styles.card}>
                                        <div style={{ height: "350px", marginBottom: "15px" }}><Skeleton height="100%" /></div>
                                        <Skeleton count={2} />
                                    </div>
                                ))
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "50px", color: "#999" }}>
                                    <p style={{ fontSize: "18px", marginBottom: "10px" }}>Bu kriterlere uygun ürün bulunamadı.</p>
                                    <button onClick={() => { setSelectedCategoryName(null); setSearchTerm(""); setSelectedBrands([]); setPriceRange("all"); }} style={{ background: "#000", color: "#fff", border: "none", padding: "10px 20px", cursor: "pointer" }}>Tümünü Göster</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

//CSS STIL
const styles = {
    container: { fontFamily: "'Inter', sans-serif", color: "#333", background: "#fff", minHeight: "100vh" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 40px", borderBottom: "1px solid #f1f1f1", height: "80px" },
    headerLeft: { flex: 1 },
    searchBox: { display: "flex", alignItems: "center", borderBottom: "1px solid #ddd", width: "200px", paddingBottom: "5px" },
    searchInput: { border: "none", outline: "none", fontSize: "13px", flex: 1, color: "#555" },
    searchButton: { background: "none", border: "none", cursor: "pointer", color: "#555" },
    headerCenter: { flex: 1, textAlign: "center", cursor: "pointer" },
    logoText: { fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", letterSpacing: "3px", margin: 0 },
    headerRight: { flex: 1, display: "flex", justifyContent: "flex-end", gap: "20px" },
    iconItem: { cursor: "pointer", color: "#333" },
    iconLink: { textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" },
    sliderContainer: { width: "100%", height: "400px", marginBottom: "40px" },
    slide: { width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" },
    navBar: { display: "flex", justifyContent: "center", gap: "60px", padding: "20px 0", fontSize: "13px", color: "#444" },
    navLink: { cursor: "pointer", transition: "all 0.2s", paddingBottom: "5px", letterSpacing: "1px" },
    mainContent: { display: "flex", padding: "40px", maxWidth: "1600px", margin: "0 auto", gap: "50px", width: "100%", boxSizing: "border-box" },
    sidebar: { width: "240px", flexShrink: 0 },
    filterGroup: { marginBottom: "35px" },
    filterTitle: { fontSize: "12px", fontWeight: "700", letterSpacing: "1px", marginBottom: "15px", textTransform: "uppercase" },
    filterList: { listStyle: "none", padding: 0, margin: 0 },
    checkboxLabel: { display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#666", marginBottom: "10px", cursor: "pointer" },
    productGridWrapper: { flex: 1 },
    sortBar: { display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "13px", color: "#666" },
    sortSelect: { border: "none", background: "transparent", fontSize: "13px", color: "#666", cursor: "pointer", outline: "none" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "40px 20px" },
    card: { display: "flex", flexDirection: "column", height: "100%", cursor: "pointer", position: "relative" },
    imageWrapper: { background: "#f5f5f5", height: "350px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "15px" },
    productImage: { width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply" },
    cardBrandLogo: { position: "absolute", top: "15px", left: "15px", fontSize: "10px", fontWeight: "bold", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase" },
    discountBadge: { position: "absolute", bottom: "10px", left: "10px", fontSize: "10px", color: "#fff", background: "red", padding: "3px 6px", borderRadius: "2px", fontWeight: "bold" },
    noImage: { color: "#999", fontSize: "14px" },
    favBtn: { position: "absolute", top: "10px", right: "10px", background: "rgba(255,255,255,0.8)", border: "none", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 },
    cardInfo: { textAlign: "left", flex: 1 },
    brandName: { fontSize: "11px", color: "#888", margin: "0 0 5px 0", textTransform: "uppercase", letterSpacing: "0.5px" },
    productName: { fontSize: "14px", fontWeight: "400", color: "#000", margin: "0 0 8px 0", lineHeight: "1.4", height: "38px", overflow: "hidden" },
    priceActionRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" },
    priceBox: { display: "flex", flexDirection: "column" },
    oldPrice: { fontSize: "11px", textDecoration: "line-through", color: "#999" },
    newPrice: { fontSize: "15px", fontWeight: "700", color: "#000" },
    miniQtyBox: { display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "4px", height: "24px" },
    miniQtyBtn: { background: "none", border: "none", width: "20px", height: "100%", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#555" },
    miniQtyText: { fontSize: "12px", padding: "0 5px", fontWeight: "600", borderLeft: "1px solid #eee", borderRight: "1px solid #eee" },
    addToCartBtn: { width: "100%", padding: "10px", marginTop: "15px", background: "#000", color: "#fff", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer", letterSpacing: "1px", borderRadius: "2px" }
};

export default HomePage;