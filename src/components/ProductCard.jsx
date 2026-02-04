// components/ProductCard.jsx

function ProductCard({ product, onAddToCart }) {
    return (
        <div style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            width: "250px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
            {/* Ürün İsmi */}
            <h3 style={{ color: "#333", minHeight: "50px", fontSize: "1.1rem" }}>{product.name}</h3>

            {/* Fiyatı */}
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#27ae60" }}>
                {product.price} TL
            </p>

            {/* Ürünün Resmi */}
            {product.images.length > 0 ? (
                <img
                    src={product.images[0].src}
                    alt={product.name}
                    style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
                />
            ) : (
                <div style={{ width: "100%", height: "200px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
                    Resim Yok
                </div>
            )}

            {/* Sepet Butonu */}
            <button onClick={() => onAddToCart(product)}
                style={{
                    marginTop: "15px",
                    width: "100%",
                    padding: "10px",
                    background: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}>
                Sepete Ekle
            </button>
        </div>
    )
}

export default ProductCard;