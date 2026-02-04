# Hosteva E-Commerce Frontend 🛍️

Bu proje, **Headless WordPress** mimarisi kullanılarak geliştirilmiş modern bir e-ticaret arayüzüdür. Ürün verileri, yerel bir WordPress/WooCommerce kurulumundan REST API aracılığıyla dinamik olarak çekilmektedir.



## 🚀 Öne Çıkan Özellikler
- **WooCommerce Entegrasyonu:** Ürünlerin REST API üzerinden çekilmesi ve listelenmesi.
- **Context API Yönetimi:** Sepet (Cart) ve Yetkilendirme (Auth) süreçlerinin merkezi yönetimi.
- **Modern UI:** React ve Vite kullanılarak geliştirilmiş, hızlı ve responsive arayüz.
- **Dinamik Sayfalar:** Ürün detay, kategori filtreleme ve profil yönetimi.

## 🛠️ Teknik Yığın (Tech Stack)
- **Frontend:** React.js + Vite
- **State Management:** React Context API
- **API Bağlantısı:** Axios / WooCommerce REST API
- **Tasarım:** CSS3 / Modern UI Components

## ⚙️ Kurulum ve Yerel Çalıştırma

### 1. WordPress (Backend) Kurulumu
Bu uygulama verilerini yerel bir WordPress sitesinden alır:
- **LocalWP** üzerinden bir site kurun (Varsayılan Port: `10011`).
- WooCommerce eklentisini aktif edin.
- `Settings > Advanced > REST API` kısmından Read/Write yetkili Key'lerinizi alın.

### 2. Frontend Kurulumu
```bash
# Projeyi klonlayın
git clone https://github.com/erendilber/hosteva-app-frontend.git

# Bağımlılıkları yükleyin
npm install

# .env dosyası oluşturun ve anahtarlarınızı ekleyin
VITE_API_URL=http://localhost:10011/wp-json/wc/v3
VITE_CONSUMER_KEY=your_key
VITE_CONSUMER_SECRET=your_secret

# Uygulamayı başlatın
npm run dev
