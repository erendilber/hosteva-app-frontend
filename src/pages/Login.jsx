import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError(""); // Önceki hataları temizle

        // Giriş İstek Port 10011
        axios.post('http://localhost:10011/wp-json/jwt-auth/v1/token', {
            username: username,
            password: password
        })
            .then(response => {
                console.log("Giriş Başarılı!", response.data);

                // Tokeni tarayıcıya kaydet
                localStorage.setItem("user_token", response.data.token);
                localStorage.setItem("user_name", response.data.user_display_name);

                alert("Giriş Başarılı! Yönlendiriliyorsunuz...");
                navigate("/"); // Ana sayfaya at
            })
            .catch(err => {
                console.error(err);
                setError("Kullanıcı adı veya şifre hatalı! Lütfen kontrol et.");
            });
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginCard}>
                <h1 style={styles.logo}>HOSTEVA</h1>
                <h2 style={styles.title}>GİRİŞ YAP</h2>
                <p style={styles.subtitle}>Hesabınıza erişmek için bilgilerinizi girin.</p>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Kullanıcı Adı veya E-posta</label>
                        <input
                            type="text"
                            style={styles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Şifre</label>
                        <input
                            type="password"
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                        />
                    </div>

                    <button type="submit" style={styles.button}>GİRİŞ YAP</button>
                </form>
            </div>
        </div>
    );
}

// Stil
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        background: "#f9f9f9",
        fontFamily: "'Inter', sans-serif"
    },
    loginCard: {
        width: "100%",
        maxWidth: "400px",
        padding: "40px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        textAlign: "center"
    },
    logo: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "10px",
        letterSpacing: "2px"
    },
    title: {
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "5px",
        color: "#333"
    },
    subtitle: {
        fontSize: "14px",
        color: "#777",
        marginBottom: "30px"
    },
    inputGroup: {
        marginBottom: "20px",
        textAlign: "left"
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontSize: "13px",
        fontWeight: "600",
        color: "#333"
    },
    input: {
        width: "100%",
        padding: "14px",
        border: "1px solid #eee",
        borderRadius: "6px",
        fontSize: "14px",
        outline: "none",
        background: "#fafafa",
        boxSizing: "border-box" 
    },
    button: {
        width: "100%",
        padding: "16px",
        background: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        letterSpacing: "1px",
        marginTop: "10px",
        transition: "background 0.3s"
    },
    errorBox: {
        background: "#ffebee",
        color: "#c62828",
        padding: "12px",
        borderRadius: "6px",
        fontSize: "13px",
        marginBottom: "20px",
        textAlign: "left",
        border: "1px solid #ef9a9a"
    }
};

export default Login;