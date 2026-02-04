import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

// İkonlar
const HeartIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const HeartFilledIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="red" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;

function ProductDetail() {
    const { id } = useParams(); // URL'den ID'yi al (ör: /product/124)
    const { addToCart, toggleFavorite, favorites } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [mainImage, setMainImage] = useState("");

    const isFav = product && favorites.some(item => item.id === product.id);

    // API'den Ürün Verisini Çek
    useEffect(() => {
        axios.get(`http://localhost:10011/wp-json/wc/v3/products/${id}`, {
            params: {
                consumer_key: "ck_27464d4df1a4232ea2989f5d2b425ecca43545ef",
                consumer_secret: "cs_a40e83a50faf5b70607cf7c3271184166336e25c"
            }
        })
            .then(res => {
                setProduct(res.data);
                if (res.data.images.length > 0) {
                    setMainImage(res.data.images[0].src);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div style={{ textAlign: "center", padding: "100px" }}>Yükleniyor...</div>;
    if (!product) return <div style={{ textAlign: "center", padding: "100px" }}>Ürün bulunamadı.</div>;

    // HTML etiketlerini temizler
    const cleanDescription = product.description.replace(/<[^>]+>/g, '');

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />

            <div style={{ flex: 1, padding: "50px 20px" }}>
                <div style={styles.container}>

                    {/*SOL TARAF: GÖRSELLER */}
                    <div style={styles.imageSection}>
                        <div style={styles.mainImageWrapper}>
                            {mainImage ? (
                                <img src={mainImage} alt={product.name} style={styles.mainImage} />
                            ) : (
                                <div style={styles.noImage}>Görsel Yok</div>
                            )}
                        </div>
                        {/*Küçük Resimler*/}
                        <div style={styles.gallery}>
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    style={{ ...styles.thumbWrapper, border: mainImage === img.src ? "1px solid #000" : "1px solid #eee" }}
                                    onClick={() => setMainImage(img.src)}
                                >
                                    <img src={img.src} style={styles.thumbImage} alt="" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SAĞ TARAF:BİLGİLER*/}
                    <div style={styles.infoSection}>
                        <h2 style={styles.brand}>HOSTEVA COLLECTION</h2>
                        <h1 style={styles.title}>{product.name}</h1>

                        <div style={styles.priceBox}>
                            {product.sale_price ? (
                                <>
                                    <span style={styles.oldPrice}>{product.regular_price} TL</span>
                                    <span style={styles.newPrice}>{product.price} TL</span>
                                </>
                            ) : (
                                <span style={styles.newPrice}>{product.price} TL</span>
                            )}
                        </div>

                        {/*BEDEN SEÇİMİ*/}
                        <div style={styles.sizeSection}>
                            <p style={styles.label}>BEDEN SEÇİN</p>
                            <div style={styles.sizes}>
                                {["S", "M", "L", "XL"].map(size => (
                                    <button
                                        key={size}
                                        style={selectedSize === size ? styles.activeSizeBtn : styles.sizeBtn}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/*BUTONLAR*/}
                        <div style={styles.actionButtons}>
                            <button
                                style={styles.addToCartBtn}
                                onClick={() => {
                                    addToCart(product);
                                    alert("Ürün sepete eklendi!");
                                }}
                            >
                                SEPETE EKLE
                            </button>
                            <button style={styles.favBtn} onClick={() => toggleFavorite(product)}>
                                {isFav ? <HeartFilledIcon /> : <HeartIcon />}
                            </button>
                        </div>

                        {/* AÇIKLAMA */}
                        <div style={styles.descSection}>
                            <h3 style={styles.descTitle}>ÜRÜN AÇIKLAMASI</h3>
                            <p style={styles.descText}>
                                {cleanDescription || "Bu ürün için açıklama bulunmamaktadır."}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

const styles = {
    container: { maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "60px", flexWrap: "wrap" },

    // Sol Taraf
    imageSection: { flex: 1.5, minWidth: "300px" },
    mainImageWrapper: { width: "100%", height: "500px", background: "#f9f9f9", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
    mainImage: { width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply" },
    noImage: { color: "#999" },
    gallery: { display: "flex", gap: "10px" },
    thumbWrapper: { width: "80px", height: "100px", background: "#f9f9f9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
    thumbImage: { width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply" },

    // Sağ Taraf
    infoSection: { flex: 1, minWidth: "300px", paddingTop: "20px" },
    brand: { fontSize: "12px", color: "#888", letterSpacing: "1px", marginBottom: "10px" },
    title: { fontSize: "28px", fontWeight: "400", margin: "0 0 20px 0", lineHeight: "1.3" },

    priceBox: { marginBottom: "30px", display: "flex", alignItems: "center", gap: "15px" },
    oldPrice: { fontSize: "16px", textDecoration: "line-through", color: "#999" },
    newPrice: { fontSize: "24px", fontWeight: "700", color: "#000" },

    sizeSection: { marginBottom: "30px" },
    label: { fontSize: "12px", fontWeight: "bold", marginBottom: "10px", display: "block" },
    sizes: { display: "flex", gap: "10px" },
    sizeBtn: { width: "50px", height: "40px", border: "1px solid #ddd", background: "none", cursor: "pointer", fontSize: "13px" },
    activeSizeBtn: { width: "50px", height: "40px", border: "1px solid #000", background: "#000", color: "#fff", cursor: "pointer", fontSize: "13px" },

    actionButtons: { display: "flex", gap: "15px", marginBottom: "40px" },
    addToCartBtn: { flex: 1, background: "#000", color: "#fff", border: "none", height: "50px", fontSize: "14px", fontWeight: "bold", letterSpacing: "1px", cursor: "pointer" },
    favBtn: { width: "50px", height: "50px", border: "1px solid #ddd", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },

    descSection: { borderTop: "1px solid #eee", paddingTop: "30px" },
    descTitle: { fontSize: "14px", fontWeight: "bold", marginBottom: "15px" },
    descText: { fontSize: "14px", lineHeight: "1.6", color: "#555" }
};

export default ProductDetail;