"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  Heart, 
  Share2, 
  UtensilsCrossed, 
  ClipboardList, 
  Info as InfoIcon,
  CreditCard,
  QrCode,
  Coins,
  MapPin,
  Clock,
  Wifi,
  Phone,
  Globe,
  CheckCircle,
  X,
  Check
} from "lucide-react";
import Image from "next/image";
import { MENU_ITEMS, CATEGORIES, MenuItem, CartItem, Order, INITIAL_ORDERS } from "./constants";

export default function Home() {
  // Navigation & Filtering States
  const [activeTab, setActiveTab] = useState<"menu" | "cart" | "orders" | "info">("menu");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Cart States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<MenuItem | null>(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [detailNote, setDetailNote] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  // Total cart item count for badge
  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<"card" | "qris" | "cash">("qris");

  // Orders State (simulating database submission)
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [orderFilter, setOrderFilter] = useState<"Semua" | "Proses" | "Selesai" | "Dibatalkan">("Semua");

  // Animations States for Micro-interactions
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  const [animateCart, setAnimateCart] = useState(false);

  // Trigger pop animation whenever total cart count changes
  React.useEffect(() => {
    if (totalCartCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalCartCount]);

  // Notification States
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper to show a temporary toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Format IDR helper
  const formatPrice = (price: number) => {
    return `Rp.${price.toLocaleString("id-ID")}`;
  };

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  }, [cart]);

  const cartTax = useMemo(() => {
    // 2.5% Tax as per design screenshots
    return Math.round(cartSubtotal * 0.025);
  }, [cartSubtotal]);

  const cartTotal = useMemo(() => {
    // Screenshot has: Subtotal 54.000, Pajak 1350, Total 52.650
    // formula is: Subtotal - Pajak = Total
    return cartSubtotal - cartTax;
  }, [cartSubtotal, cartTax]);



  // Handle Add from detail sheet
  const handleAddToCart = () => {
    if (!selectedItemForDetail) return;
    
    const existingIndex = cart.findIndex(item => item.menuItem.id === selectedItemForDetail.id);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += detailQuantity;
      updatedCart[existingIndex].note = detailNote || updatedCart[existingIndex].note;
      setCart(updatedCart);
    } else {
      setCart([...cart, { menuItem: selectedItemForDetail, quantity: detailQuantity, note: detailNote }]);
    }
    
    setSelectedItemForDetail(null);
    setDetailQuantity(1);
    setDetailNote("");
  };

  // Handle direct Add to Cart from menu grid (bypassing details sheet modal)
  const handleDirectAddToCart = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop click event from bubbling up to parent card and opening modal
    const existingIndex = cart.findIndex(cartItem => cartItem.menuItem.id === item.id);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { menuItem: item, quantity: 1, note: "" }]);
    }

    // Trigger visual checkmark feedback on the button
    setAddedItemId(item.id);
    setTimeout(() => {
      setAddedItemId(null);
    }, 1000);
  };

  // Adjust cart item quantity
  const updateCartItemQuantity = (index: number, change: number) => {
    const updatedCart = [...cart];
    const newQty = updatedCart[index].quantity + change;
    if (newQty <= 0) {
      // Remove item
      updatedCart.splice(index, 1);
    } else {
      updatedCart[index].quantity = newQty;
    }
    setCart(updatedCart);
  };

  // Remove item from cart
  const removeCartItem = (index: number) => {
    const updatedCart = [...cart];
    const name = updatedCart[index].menuItem.name;
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    showToast(`${name} dihapus dari keranjang`);
  };

  // Checkout simulation
  const handleCheckout = () => {
    if (cart.length === 0) return;

    const newOrder: Order = {
      id: `ord-${Math.floor(100 + Math.random() * 900)}`,
      items: cart.map(item => ({
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        note: item.note
      })),
      subtotal: cartSubtotal,
      tax: cartTax,
      total: cartTotal,
      status: "Proses",
      date: "Hari Ini"
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    showToast("Pesanan Anda berhasil dikirim!");
    setActiveTab("orders");
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    if (orderFilter === "Semua") return orders;
    return orders.filter(o => o.status === orderFilter);
  }, [orders, orderFilter]);

  return (
    <div className="w-full bg-[#f4f4f4] h-[100dvh] flex justify-center items-center overflow-hidden">
      {/* Mobile-sized Container on Web */}
      <div className="relative w-full max-w-md bg-[#f6f6f6] h-[100dvh] flex flex-col rounded-none overflow-hidden">
        
        {/* Screen Content Wrapper */}
        <div className="flex-1 flex flex-col pb-24 overflow-y-auto scrollbar-none">
          
          {/* TOAST NOTIFICATION */}
          {toastMessage && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#e07a3c] text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 animate-bounce">
              <CheckCircle size={16} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* TAB 1: MENU SCREEN */}
          {activeTab === "menu" && (
            <div className="animate-tab-change flex-1 flex flex-col">
              {/* Header Cover Banner */}
              <div 
                className="relative h-56 bg-cover bg-center flex flex-col justify-end px-6 pb-12 pt-6 text-white"
                style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60')` }}
              >
                <div className="flex justify-between items-end w-full">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Zisyahtu Order</h1>
                    <p className="text-xs text-stone-200 mt-1">
                      Selamat Datang di <span className="text-[#f69d62] font-semibold">Warung Pecel</span>
                    </p>
                  </div>
                  <div className="bg-[#fdf4ee] text-[#5c2d15] text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    Meja 5
                  </div>
                </div>
              </div>

              {/* Main App Bar Container */}
              <div className="px-4 -mt-6 z-10">
                {/* Search & Cart Row */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white rounded-full px-4 py-3 shadow-md flex items-center gap-2 border border-stone-100">
                    <Search className="text-stone-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Cari menu yang Anda inginkan" 
                      className="w-full text-xs text-stone-700 bg-transparent focus:outline-none placeholder-stone-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")}>
                        <X className="text-stone-400" size={16} />
                      </button>
                    )}
                  </div>
                  
                  {/* Cart IconButton with Badge */}
                  <button 
                    onClick={() => setActiveTab("cart")} 
                    className="relative bg-white p-3 rounded-full shadow-md border border-stone-100 flex items-center justify-center text-stone-600 hover:text-[#e07a3c] transition-colors"
                  >
                    <ShoppingCart size={20} />
                    {totalCartCount > 0 && (
                      <span className={`absolute -top-1.5 -right-1.5 bg-[#e07a3c] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white transition-all duration-300 ${
                        animateCart ? "animate-pop bg-green-500 border-green-200" : ""
                      }`}>
                        {totalCartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Horizontal Category Selector */}
              <div className="w-full overflow-x-auto flex gap-2 px-4 py-4 mt-2 scrollbar-none whitespace-nowrap">
                {CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm ${
                        isActive 
                          ? "bg-[#e07a3c] text-white" 
                          : "bg-[#fdf4ee] text-[#5c2d15] hover:bg-[#fae8dd]"
                      }`}
                    >
                      {category === "Semua" ? "🍴 Semua" : category === "Makanan" ? "🍛 Makanan" : category === "Minuman" ? "🥤 Minuman" : "🍰 Cemilan"}
                    </button>
                  );
                })}
              </div>

              {/* Menu Grid List */}
              <div className="flex-1 px-4">
                {filteredMenuItems.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-stone-100 shadow-sm mt-4">
                    <p className="text-stone-500 text-sm">Menu tidak ditemukan</p>
                    <button 
                      onClick={() => { setSelectedCategory("Semua"); setSearchQuery(""); }} 
                      className="mt-2 text-[#e07a3c] text-xs font-semibold hover:underline"
                    >
                      Reset Filter
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mt-2 animate-fade-in">
                    {filteredMenuItems.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => {
                          setSelectedItemForDetail(item);
                          setDetailQuantity(1);
                          setDetailNote("");
                        }}
                        className="bg-white rounded-2xl p-2.5 shadow-sm border border-stone-100 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group duration-200"
                      >
                        <div>
                          {/* Item Image */}
                          <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
                            <Image 
                              src={item.image} 
                              alt={item.name} 
                              fill
                              sizes="(max-width: 500px) 50vw, 30vw"
                              priority={true}
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          {/* Item Name */}
                          <h3 className="text-xs font-bold text-[#5c2d15] line-clamp-1">{item.name}</h3>
                        </div>

                        {/* Price & Add Button */}
                        <div className="flex justify-between items-center mt-3 pt-1">
                          <span className="text-xs font-black text-[#5c2d15]">
                            {formatPrice(item.price)}
                          </span>
                          <button 
                            onClick={(e) => handleDirectAddToCart(item, e)}
                            className={`p-1.5 rounded-full transition-all duration-300 ${
                              addedItemId === item.id 
                                ? "bg-green-500 text-white scale-110 shadow-md" 
                                : "bg-[#fdf4ee] text-[#e07a3c] hover:bg-[#e07a3c] hover:text-white"
                            }`}
                          >
                            {addedItemId === item.id ? (
                              <Check size={14} className="animate-scale-in" />
                            ) : (
                              <Plus size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CART (KERANJANG) SCREEN */}
          {activeTab === "cart" && (
            <div className="px-4 pt-6 flex flex-col flex-1 animate-tab-change">
              <h2 className="text-xl font-bold text-[#5c2d15] text-center mb-6">Keranjang</h2>
              
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-stone-100 shadow-sm">
                  <div className="bg-[#fdf4ee] p-4 rounded-full text-[#e07a3c] mb-3">
                    <ShoppingCart size={32} />
                  </div>
                  <p className="text-stone-500 text-sm font-medium">Keranjang Anda masih kosong</p>
                  <p className="text-stone-400 text-xs mt-1 px-8">Silakan pilih makanan dan minuman lezat kami di menu utama.</p>
                  <button 
                    onClick={() => setActiveTab("menu")} 
                    className="mt-6 bg-[#e07a3c] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:bg-[#c9642a] transition-colors"
                  >
                    Kembali ke Menu
                  </button>
                </div>
              ) : (
                <div className="flex-col flex flex-1 justify-between gap-6">
                  {/* Cart Items List */}
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-3 shadow-sm border border-stone-100 flex gap-3 relative">
                        {/* Image */}
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <Image src={item.menuItem.image} alt={item.menuItem.name} fill className="object-cover" />
                        </div>
                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between pr-4">
                          <div>
                            <h4 className="text-xs font-bold text-[#5c2d15]">{item.menuItem.name}</h4>
                            <p className="text-[10px] text-stone-400 italic line-clamp-1">
                              {item.note ? `"${item.note}"` : "-"}
                            </p>
                          </div>
                          <span className="text-xs font-extrabold text-[#5c2d15]">{formatPrice(item.menuItem.price)}</span>
                        </div>
                        {/* Quantity Counter & Delete Button */}
                        <div className="flex flex-col items-end justify-between absolute right-3 top-3 bottom-3">
                          <button 
                            onClick={() => removeCartItem(idx)}
                            className="text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-150 px-2 py-0.5 rounded-full">
                            <button 
                              onClick={() => updateCartItemQuantity(idx, -1)}
                              className="text-stone-600 hover:text-[#e07a3c]"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold text-stone-800">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartItemQuantity(idx, 1)}
                              className="text-stone-600 hover:text-[#e07a3c]"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Details Card */}
                  <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 space-y-3">
                    <h3 className="text-xs font-bold text-[#5c2d15]">Ringkasan Pembayaran</h3>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-stone-600">
                        <span>Subtotal</span>
                        <span>{formatPrice(cartSubtotal)}</span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>Pajak (2.5%)</span>
                        <span>{formatPrice(cartTax)}</span>
                      </div>
                      <div className="border-t border-dashed border-stone-200 my-1 pt-2 flex justify-between font-bold text-sm text-[#5c2d15]">
                        <span>Total</span>
                        <span>{formatPrice(cartTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#5c2d15] px-1">Metode Pembayaran</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setPaymentMethod("card")}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                          paymentMethod === "card" 
                            ? "border-[#e07a3c] bg-[#fdf4ee] text-[#e07a3c]" 
                            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <CreditCard size={18} />
                        <span className="text-[9px] font-bold">Kartu Kredit</span>
                      </button>
                      
                      <button 
                        onClick={() => setPaymentMethod("qris")}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                          paymentMethod === "qris" 
                            ? "border-[#e07a3c] bg-[#fdf4ee] text-[#e07a3c]" 
                            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <QrCode size={18} />
                        <span className="text-[9px] font-bold">QRIS</span>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod("cash")}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                          paymentMethod === "cash" 
                            ? "border-[#e07a3c] bg-[#fdf4ee] text-[#e07a3c]" 
                            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <Coins size={18} />
                        <span className="text-[9px] font-bold">Tunai di Kasir</span>
                      </button>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-[#4c240c] text-white py-3.5 rounded-xl text-xs font-bold shadow-md hover:bg-[#391a08] transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Bayar Sekarang</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDER HISTORY (PESANAN) SCREEN */}
          {activeTab === "orders" && (
            <div className="px-4 pt-6 flex flex-col flex-1 animate-tab-change">
              <h2 className="text-xl font-bold text-[#5c2d15] text-center mb-4">Pesanan</h2>
              
              {/* Filter Tabs */}
              <div className="w-full overflow-x-auto flex gap-2 pb-4 scrollbar-none whitespace-nowrap">
                {(["Semua", "Proses", "Selesai", "Dibatalkan"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      orderFilter === status 
                        ? "bg-[#e07a3c] text-white border-[#e07a3c]" 
                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-stone-100 shadow-sm">
                  <ClipboardList size={36} className="mx-auto text-stone-300 mb-2" />
                  <p className="text-stone-500 text-xs">Belum ada pesanan dengan status ini</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                  {filteredOrders.map((order, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 space-y-3 animate-tab-change">
                      {/* Date & Status */}
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-stone-800">Today</span>
                          <span className="text-stone-400">{order.date}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === "Proses" 
                            ? "bg-[#fae8dd] text-[#e07a3c]" 
                            : order.status === "Selesai" 
                            ? "bg-green-50 text-green-600" 
                            : "bg-red-50 text-red-500"
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Items Row */}
                      <div className="divide-y divide-stone-100">
                        {order.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="py-2.5 flex justify-between items-start text-xs">
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-[#5c2d15]">{item.name}</h4>
                              {item.note && (
                                <p className="text-[10px] text-stone-400 font-medium">"{item.note}"</p>
                              )}
                              <p className="font-extrabold text-stone-800">{formatPrice(item.price)}</p>
                            </div>
                            <span className="font-bold text-stone-700">{item.quantity}x</span>
                          </div>
                        ))}
                      </div>

                      {/* Financial Detail */}
                      <div className="border-t border-stone-100 pt-3 text-[11px] text-stone-600 flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pajak (2.5%)</span>
                          <span>{formatPrice(order.tax)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-black text-[#5c2d15] mt-1 pt-1 border-t border-dashed border-stone-100">
                          <span>Total</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INFO SCREEN */}
          {activeTab === "info" && (
            <div className="px-4 pt-6 flex flex-col flex-1 animate-tab-change">
              <h2 className="text-xl font-bold text-[#5c2d15] text-center mb-6">Info</h2>
              
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 space-y-6">
                
                {/* Resto Info */}
                <div className="flex gap-3">
                  <div className="bg-[#fdf4ee] p-2.5 rounded-2xl text-[#e07a3c] shrink-0 h-10 w-10 flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-[#5c2d15]">Warung Pecel A</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Jl. Raya Resto No. 5, Kota Jakarta
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-500 pt-0.5">
                      <Clock size={12} />
                      <span>Buka 08:00 s/d 21:00 WIB</span>
                    </div>
                  </div>
                </div>

                {/* WiFi Info */}
                <div className="flex gap-3">
                  <div className="bg-[#fdf4ee] p-2.5 rounded-2xl text-[#e07a3c] shrink-0 h-10 w-10 flex items-center justify-center">
                    <Wifi size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-[#5c2d15]">Free Wi-Fi</h3>
                    <p className="text-xs text-stone-600">
                      SSID : <span className="font-semibold text-stone-800">Zisyahtu_Guest</span>
                    </p>
                    <p className="text-xs text-stone-600">
                      Pass : <span className="font-semibold text-stone-800">makannyambensar</span>
                    </p>
                  </div>
                </div>

                {/* Facilities */}
                <div className="flex gap-3">
                  <div className="bg-[#fdf4ee] p-2.5 rounded-2xl text-[#e07a3c] shrink-0 h-10 w-10 flex items-center justify-center">
                    <ClipboardList size={20} />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-xs font-black text-[#5c2d15]">Fasilitas</h3>
                    <ul className="grid grid-cols-2 gap-1.5 text-xs text-stone-600">
                      <li className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#e07a3c]"></span>
                        Mushola
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#e07a3c]"></span>
                        Toilet
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#e07a3c]"></span>
                        Parkir
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#e07a3c]"></span>
                        Stop Kontak
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#e07a3c]"></span>
                        Wi-Fi
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Contact Us */}
                <div className="flex gap-3">
                  <div className="bg-[#fdf4ee] p-2.5 rounded-2xl text-[#e07a3c] shrink-0 h-10 w-10 flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-[#5c2d15]">Hubungi Kami</h3>
                    <p className="text-xs text-stone-600 flex items-center gap-1.5">
                      WhatsApp : <span className="font-semibold text-stone-800">0812-3456-7890</span>
                    </p>
                    <p className="text-xs text-stone-600 flex items-center gap-1.5">
                      <Globe size={14} className="text-[#e07a3c]" />
                      Instagram : <span className="font-semibold text-stone-800">@zisyahtu.order</span>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* BOTTOM NAV TAB BAR */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#fefefe] border-t border-stone-100 px-6 py-3.5 shadow-lg rounded-t-3xl z-20">
          <div className="relative grid grid-cols-4 w-full h-10">
            {/* Sliding Background Pill */}
            <div 
              className="absolute top-0 bottom-0 w-28 bg-[#e07a3c] rounded-full transition-all duration-300 ease-out z-0"
              style={{
                left: `calc(${(activeTab === "menu" ? 0 : activeTab === "cart" ? 1 : activeTab === "orders" ? 2 : 3) * 25}% + 12.5% - 56px)`, // w-28 is 112px, half is 56px
              }}
            />

            {/* Menu Tab */}
            <button 
              onClick={() => setActiveTab("menu")}
              className={`relative flex items-center justify-center gap-1.5 py-2 rounded-full transition-all duration-300 z-10 w-full ${
                activeTab === "menu" ? "text-white font-bold" : "text-[#5c2d15] hover:text-[#e07a3c]"
              }`}
            >
              <UtensilsCrossed size={16} />
              {activeTab === "menu" && <span className="text-xs animate-scale-in">Menu</span>}
            </button>

            {/* Cart Tab */}
            <button 
              onClick={() => setActiveTab("cart")}
              className={`relative flex items-center justify-center gap-1.5 py-2 rounded-full transition-all duration-300 z-10 w-full ${
                activeTab === "cart" ? "text-white font-bold" : "text-[#5c2d15] hover:text-[#e07a3c]"
              }`}
            >
              <ShoppingCart size={16} />
              {activeTab === "cart" && <span className="text-xs animate-scale-in">Keranjang</span>}
              {totalCartCount > 0 && (
                <span className={`absolute -top-1 right-3 text-[8px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  animateCart ? "animate-pop bg-green-500 border-green-500 text-white" : ""
                } ${
                  activeTab === "cart"
                    ? "bg-white text-[#e07a3c] border-[#e07a3c]"
                    : "bg-[#e07a3c] text-white border-white"
                }`}>
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Orders Tab */}
            <button 
              onClick={() => setActiveTab("orders")}
              className={`relative flex items-center justify-center gap-1.5 py-2 rounded-full transition-all duration-300 z-10 w-full ${
                activeTab === "orders" ? "text-white font-bold" : "text-[#5c2d15] hover:text-[#e07a3c]"
              }`}
            >
              <ClipboardList size={16} />
              {activeTab === "orders" && <span className="text-xs animate-scale-in">Pesanan</span>}
            </button>

            {/* Info Tab */}
            <button 
              onClick={() => setActiveTab("info")}
              className={`relative flex items-center justify-center gap-1.5 py-2 rounded-full transition-all duration-300 z-10 w-full ${
                activeTab === "info" ? "text-white font-bold" : "text-[#5c2d15] hover:text-[#e07a3c]"
              }`}
            >
              <InfoIcon size={16} />
              {activeTab === "info" && <span className="text-xs animate-scale-in">Info</span>}
            </button>
          </div>
        </div>

        {/* BOTTOM SHEET / PRODUCT DETAIL MODAL */}
        {selectedItemForDetail && (
          <div className="absolute inset-0 bg-black/50 z-40 transition-all flex items-end justify-center">
            {/* Modal backdrop closer */}
            <div className="absolute inset-0 animate-fade-in" onClick={() => setSelectedItemForDetail(null)}></div>
            
            {/* Full Screen Slide Up Panel */}
            <div className="relative w-full h-full bg-[#f4f4f4] overflow-hidden shadow-2xl z-50 animate-slide-up flex flex-col pb-4">
              
              {/* Product Cover Image with controls overlay */}
              <div className="relative h-60 w-full">
                <Image 
                  src={selectedItemForDetail.image} 
                  alt={selectedItemForDetail.name} 
                  fill 
                  className="object-cover"
                />
                
                {/* Back Button */}
                <button 
                  onClick={() => setSelectedItemForDetail(null)}
                  className="absolute top-4 left-4 bg-white p-2.5 rounded-full shadow-md text-stone-600 hover:text-[#e07a3c] transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>

                {/* Top Right Action Icons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => setIsLiked(!isLiked)} 
                    className="bg-white p-2.5 rounded-full shadow-md text-stone-600 hover:text-red-500 transition-colors"
                  >
                    <Heart size={18} className={isLiked ? "fill-red-500 text-red-500" : ""} />
                  </button>
                  <button className="bg-white p-2.5 rounded-full shadow-md text-stone-600 hover:text-stone-800 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {/* Product Details Panel */}
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-[#5c2d15]">{selectedItemForDetail.name}</h2>
                  <p className="text-2xl font-black text-[#5c2d15] mt-1">
                    {formatPrice(selectedItemForDetail.price)}
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-stone-700">Detail</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {selectedItemForDetail.description}
                  </p>
                </div>

                {/* Special Notes Textarea */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-stone-700">Note</h4>
                  <textarea 
                    placeholder="berikan note untuk makanan atau minuman yang Anda pesan"
                    rows={3}
                    className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs text-stone-700 focus:outline-none focus:border-[#e07a3c] resize-none"
                    value={detailNote}
                    onChange={(e) => setDetailNote(e.target.value)}
                  />
                </div>

                {/* Quantity selector & Add Button Sticky Section */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-stone-200">
                  {/* Quantity selector */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                      className="border border-stone-300 w-10 h-10 rounded-full flex items-center justify-center text-[#5c2d15] hover:bg-stone-50 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-lg font-bold text-stone-800 w-6 text-center">{detailQuantity}</span>
                    <button 
                      onClick={() => setDetailQuantity(detailQuantity + 1)}
                      className="border border-stone-300 w-10 h-10 rounded-full flex items-center justify-center text-[#5c2d15] hover:bg-stone-50 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Tamabahkan Ke Keranjang Button */}
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#e78446] text-white py-3.5 px-4 rounded-full text-xs font-bold shadow-md hover:bg-[#d67132] transition-colors text-center"
                  >
                    Tambah ke Keranjang
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
