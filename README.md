# Zisyahtu Order (Warung Pecel App)

Zisyahtu Order adalah sebuah aplikasi pemesanan makanan berbasis web (Web App) dengan pendekatan **Mobile-First Design**. Aplikasi ini dirancang untuk memudahkan pelanggan restoran (seperti "Warung Pecel") dalam melihat menu, menambahkan makanan ke keranjang, melakukan checkout, hingga melihat riwayat pesanan langsung dari meja mereka.

Aplikasi ini menggunakan desain antarmuka (*User Interface*) yang sangat modern, bersih, dan interaktif dengan berbagai animasi mikro (*micro-interactions*).

## ✨ Fitur Utama

- **Mobile-First Experience**: Tampilan responsif yang membentang penuh (full-screen) tanpa *border radius* atau *margin* di desktop, menciptakan ilusi aplikasi *native* pada perangkat seluler.
- **Smart Bottom Navigation**: Navigasi bawah dengan animasi bergeser (sliding background pill) yang menampilkan teks hanya pada tab yang sedang aktif.
- **Micro-Interactions**: Animasi *pop/bounce* pada *badge* keranjang setiap kali item ditambahkan, efek memudar (*fade*), hingga animasi *slide-up* interaktif untuk melihat detail produk ukuran layar penuh.
- **Keranjang & Checkout**: Sistem keranjang belanja dengan kalkulasi otomatis untuk *Subtotal*, *Pajak (Tax)*, dan *Total*, serta pilihan metode pembayaran (Card, QRIS, Tunai).
- **Order Tracking**: Fitur manajemen status pesanan (Semua, Proses, Selesai, Dibatalkan) dengan tampilan antarmuka riwayat (*Order History*).

## 🚀 Tech Stack

Project ini dibangun dengan menggunakan teknologi modern:
- **[Next.js 16](https://nextjs.org/)** - React Framework (App Router & Turbopack)
- **[React 19](https://react.dev/)** - Library UI Core
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework untuk styling cepat dan desain responsif.
- **[TypeScript](https://www.typescriptlang.org/)** - Untuk penulisan kode yang lebih aman (*type-safe*).
- **[Lucide React](https://lucide.dev/)** - Koleksi ikon SVG yang indah dan ringan.

## 📂 Struktur Folder Penting

- `app/page.tsx`: Berisi seluruh logika antarmuka pengguna (Single-Page Application). Dari keranjang, daftar menu, hingga tampilan detail menu.
- `app/constants.ts`: File konfigurasi statis yang berisi *mock-data* menu makanan (`MENU_ITEMS`), struktur/tipe data TypeScript (`MenuItem`, `Order`, dll), dan data *dummy* riwayat pesanan.
- `app/globals.css`: Menyimpan konfigurasi dasar Tailwind CSS dan kustomisasi *keyframes* animasi yang digunakan oleh komponen UI.

## 💻 Cara Menjalankan Project (Local Development)

Pastikan Anda sudah menginstal **Node.js** atau **Bun** di sistem Anda.

1. **Install Dependencies**
   ```bash
   npm install
   # atau menggunakan bun:
   bun install
   ```

2. **Jalankan Server Development**
   ```bash
   npm run dev
   # atau menggunakan bun:
   bun dev
   ```

3. **Buka di Browser**
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda. Aplikasi akan me-reload secara otomatis (*Fast Refresh*) jika ada perubahan kode.

## 🔗 Kebutuhan API (Untuk Backend)

Saat ini UI aplikasi beroperasi menggunakan *state* lokal. Untuk integrasi penuh dengan sistem Backend, aplikasi membutuhkan API RESTful. Spesifikasi *endpoint* (seperti `GET /api/menu` atau `POST /api/orders`) beserta format struktur payloadnya dapat dilihat pada dokumen spesifikasi API terpisah.

---
*Dibuat menggunakan Next.js dan Tailwind CSS.*
