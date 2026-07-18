export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: "Makanan" | "Minuman" | "Cemilan";
  image: string;
  description: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "m1",
    name: "Salad Buah & Sayur",
    price: 20000,
    category: "Makanan",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "m2",
    name: "Roti Tawar Buah",
    price: 18000,
    category: "Cemilan",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500&auto=format&fit=crop&q=60",
    description: "Roti tawar panggang premium disajikan dengan potongan pisang segar, blueberry manis, dan siraman madu organik.",
  },
  {
    id: "m3",
    name: "Dumpling",
    price: 15000,
    category: "Makanan",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60",
    description: "Dumpling kukus gurih isi daging ayam dan sayuran pilihan, disajikan dengan saus cocolan khas Warung Pecel.",
  },
  {
    id: "m4",
    name: "Cheese Cake",
    price: 25000,
    category: "Cemilan",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=60",
    description: "Kue keju lembut berlapis dengan rasa manis gurih yang pas, lengkap dengan buah raspberry segar di atasnya.",
  },
  {
    id: "m5",
    name: "Roti Telur",
    price: 19000,
    category: "Makanan",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=60",
    description: "Toast renyah berlapis alpukat halus dan telur mata sapi setengah matang, taburan lada hitam di atasnya.",
  },
  {
    id: "m6",
    name: "Ramen Spicy Udang",
    price: 28000,
    category: "Makanan",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60",
    description: "Mie ramen kenyal dengan kuah pedas gurih, dilengkapi udang segar, telur setengah matang, rumput laut, dan daun bawang.",
  },
  {
    id: "m7",
    name: "Es Teh Manis",
    price: 5000,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60",
    description: "Teh melati seduh dingin dengan rasa manis alami yang menyegarkan dahaga Anda.",
  },
  {
    id: "m8",
    name: "Kopi Susu Zisyahtu",
    price: 12000,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60",
    description: "Kopi susu gula aren racikan spesial Zisyahtu, perpaduan espresso mantap, susu lembut, dan manis aren alami.",
  }
];

export const CATEGORIES = ["Semua", "Makanan", "Minuman", "Cemilan"] as const;

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  note: string;
}

export interface Order {
  id: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    note: string;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  status: "Proses" | "Selesai" | "Dibatalkan";
  date: string;
}

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-01",
    items: [
      {
        name: "Salad Sayur & Buah",
        price: 20000,
        quantity: 1,
        note: "Buah-nya banyakin ya kak!"
      },
      {
        name: "Dumpling",
        price: 15000,
        quantity: 1,
        note: ""
      },
      {
        name: "Roti Telur",
        price: 19000,
        quantity: 1,
        note: ""
      }
    ],
    subtotal: 54000,
    tax: 1350, // 2.5% of 54000
    total: 52650, // subtotal - tax + ? Oh wait, Rp.54.000 subtotal, Pajak (2.5%) Rp.1350, Total is Rp.52.650? Wait. 54000 - 1350 = 52650. Wait! The screenshot shows Total Rp.52.650, which is Subtotal - Pajak. Actually, that is unusual but let's match the math in the screenshot exactly! (Subtotal 54000, Pajak 1350, Total 52650. Let's make total = subtotal - tax if we want to match screenshot, or let's follow the screenshot formula!)
    status: "Proses",
    date: "16 Juni 2026"
  },
  {
    id: "ord-02",
    items: [
      {
        name: "Salad Sayur & Buah",
        price: 20000,
        quantity: 1,
        note: "Buah-nya banyakin ya kak!"
      },
      {
        name: "Dumpling",
        price: 15000,
        quantity: 1,
        note: ""
      },
      {
        name: "Roti Telur",
        price: 19000,
        quantity: 1,
        note: ""
      }
    ],
    subtotal: 54000,
    tax: 1350,
    total: 52650,
    status: "Selesai",
    date: "15 Juni 2026"
  }
];
