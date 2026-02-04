import { Link } from "react-router-dom";

// --- İKONLAR ---
const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const BagIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const HeartIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;

const Header = () => {
    return (
        <header style={styles.header}>
            <div style={styles.headerLeft}>
                <div style={styles.searchBox}>
                    <input type="text" placeholder="Ürün Ara..." style={styles.searchInput} />
                    <button style={styles.searchButton}><SearchIcon /></button>
                </div>
            </div>

            <div style={styles.headerCenter}>
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                    <h1 style={styles.logoText}>HOSTEVA</h1>
                </Link>
            </div>

            <div style={styles.headerRight}>
                <Link to="/profile" style={styles.iconLink}><div style={styles.iconItem}><UserIcon /></div></Link>
                <Link to="/favorites" style={styles.iconLink}><div style={styles.iconItem}><HeartIcon /></div></Link>
                <Link to="/cart" style={styles.iconLink}><div style={styles.iconItem}><BagIcon /></div></Link>
            </div>
        </header>
    );
};

const styles = {
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 40px", borderBottom: "1px solid #f1f1f1", height: "80px", background: "#fff" },
    headerLeft: { flex: 1 },
    searchBox: { display: "flex", alignItems: "center", borderBottom: "1px solid #ddd", width: "200px", paddingBottom: "5px" },
    searchInput: { border: "none", outline: "none", fontSize: "13px", flex: 1, color: "#555" },
    searchButton: { background: "none", border: "none", cursor: "pointer", color: "#555" },
    headerCenter: { flex: 1, textAlign: "center" },
    logoText: { fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", letterSpacing: "3px", margin: 0, cursor: "pointer" },
    headerRight: { flex: 1, display: "flex", justifyContent: "flex-end", gap: "20px" },
    iconItem: { cursor: "pointer", color: "#333" },
    iconLink: { textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }
};

export default Header;