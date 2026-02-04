import { Link } from "react-router-dom";

// SM İcon
const InstagramIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const TwitterIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>;
const FacebookIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>

                {/*LİNKLER VE BÜLTEN */}
                <div style={styles.topSection}>

                    {/* 1. Kolon: Marka & Hakkında */}
                    <div style={styles.column}>
                        <h2 style={styles.logoText}>HOSTEVA</h2>
                        <p style={styles.text}>
                            Stil ve konforun buluşma noktası. En yeni trendleri ve kaliteli ürünleri sizlerle buluşturuyoruz.
                        </p>
                        <div style={styles.socialIcons}>
                            <a href="#" style={styles.icon}><InstagramIcon /></a>
                            <a href="#" style={styles.icon}><TwitterIcon /></a>
                            <a href="#" style={styles.icon}><FacebookIcon /></a>
                        </div>
                    </div>

                    {/* 2. Kolon: Hızlı Linkler */}
                    <div style={styles.column}>
                        <h3 style={styles.heading}>KURUMSAL</h3>
                        <ul style={styles.list}>
                            <li><Link to="/" style={styles.link}>Hakkımızda</Link></li>
                            <li><Link to="/" style={styles.link}>Kariyer</Link></li>
                            <li><Link to="/" style={styles.link}>Gizlilik Politikası</Link></li>
                            <li><Link to="/" style={styles.link}>Kullanım Koşulları</Link></li>
                        </ul>
                    </div>

                    {/* 3. Kolon: Yardım */}
                    <div style={styles.column}>
                        <h3 style={styles.heading}>YARDIM</h3>
                        <ul style={styles.list}>
                            <li><Link to="/profile" style={styles.link}>Sipariş Takibi</Link></li>
                            <li><Link to="/profile" style={styles.link}>İade ve Değişim</Link></li>
                            <li><Link to="/" style={styles.link}>Sıkça Sorulan Sorular</Link></li>
                            <li><Link to="/" style={styles.link}>İletişim</Link></li>
                        </ul>
                    </div>

                    {/* 4. Kolon: Bülten */}
                    <div style={styles.column}>
                        <h3 style={styles.heading}>BÜLTENİMİZE ABONE OLUN</h3>
                        <p style={{ ...styles.text, fontSize: "12px" }}>Kampanyalardan ilk siz haberdar olun.</p>
                        <div style={styles.newsletterBox}>
                            <input type="email" placeholder="E-posta adresiniz" style={styles.input} />
                            <button style={styles.button}>KAYIT OL</button>
                        </div>
                    </div>
                </div>

                <div style={styles.divider}></div>

                {/* TELİF VE KARTLAR */}
                <div style={styles.bottomSection}>
                    <span style={styles.copyright}>© 2025 HOSTEVA. Tüm hakları saklıdır.</span>
                    <div style={styles.paymentMethods}>
                        <span style={styles.cardText}>VISA</span>
                        <span style={styles.cardText}>MasterCard</span>
                        <span style={styles.cardText}>AMEX</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// CSS STİLİ
const styles = {
    footer: {
        background: "#111", 
        color: "#fff",
        padding: "60px 0 30px 0",
        marginTop: "auto", 
        fontFamily: "'Inter', sans-serif"
    },
    container: {
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 40px"
    },
    topSection: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "40px",
        marginBottom: "40px"
    },
    column: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },
    logoText: {
        fontFamily: "'Playfair Display', serif",
        fontSize: "24px",
        fontWeight: "700",
        letterSpacing: "2px",
        margin: 0
    },
    heading: {
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "1px",
        color: "#888",
        marginBottom: "5px"
    },
    text: {
        fontSize: "13px",
        lineHeight: "1.6",
        color: "#ccc",
        margin: 0
    },
    list: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },
    link: {
        color: "#ccc",
        textDecoration: "none",
        fontSize: "13px",
        transition: "color 0.3s",
        cursor: "pointer"
    },
    socialIcons: {
        display: "flex",
        gap: "15px",
        marginTop: "10px"
    },
    icon: {
        color: "#fff",
        textDecoration: "none"
    },
    newsletterBox: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },
    input: {
        padding: "12px",
        background: "#222",
        border: "1px solid #333",
        color: "#fff",
        fontSize: "13px",
        outline: "none"
    },
    button: {
        padding: "12px",
        background: "#fff",
        color: "#000",
        border: "none",
        fontSize: "12px",
        fontWeight: "bold",
        cursor: "pointer",
        letterSpacing: "1px"
    },
    divider: {
        height: "1px",
        background: "#333",
        margin: "30px 0"
    },
    bottomSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px"
    },
    copyright: {
        fontSize: "12px",
        color: "#666"
    },
    paymentMethods: {
        display: "flex",
        gap: "15px"
    },
    cardText: {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#888",
        border: "1px solid #444",
        padding: "2px 6px",
        borderRadius: "2px"
    }
};

export default Footer;