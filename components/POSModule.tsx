
import React from 'react';
import { Product, SaleItem, PaymentMethod, Client } from '../types';
import { Search, ShoppingCart, User, Plus, Minus, Trash2, Printer, CreditCard, Banknote } from 'lucide-react';

interface POSModuleProps {
  products: Product[];
  clients: Client[];
  onCompleteSale: (items: SaleItem[], method: PaymentMethod, clientId?: string) => void;
}

const POSModule: React.FC<POSModuleProps> = ({ products, clients, onCompleteSale }) => {
  const [cart, setCart] = React.useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('Efectivo');
  const [selectedClientId, setSelectedClientId] = React.useState<string>('');

  const availableProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.stock > 0
  );

  const addToCart = (p: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === p.id);
      if (existing) {
        if (existing.quantity >= p.stock) return prev;
        return prev.map(item => 
          item.productId === p.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { 
        productId: p.id, 
        name: p.name, 
        quantity: 1, 
        price: p.sellPrice,
        cost: p.buyPrice
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.productId === id) {
          const product = products.find(p => p.id === id);
          const newQty = Math.max(0, item.quantity + delta);
          if (product && newQty > product.stock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.productId !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleFinish = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'Crédito' && !selectedClientId) {
      alert("Debes seleccionar un cliente para ventas a crédito.");
      return;
    }
    
    // Safety check: Don't allow high debt
    if (paymentMethod === 'Crédito') {
      const client = clients.find(c => c.id === selectedClientId);
      if (client && client.balance > 1000) {
        if (!confirm(`El cliente ${client.name} tiene un saldo deudor alto ($${client.balance}). ¿Deseas continuar?`)) {
          return;
        }
      }
    }

    onCompleteSale(cart, paymentMethod, selectedClientId || undefined);
    setCart([]);
    setSelectedClientId('');
    setPaymentMethod('Efectivo');
    alert("¡Venta realizada con éxito!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      {/* Products Selection */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar producto..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {availableProducts.map(p => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-orange-500 hover:shadow-md transition-all text-left flex flex-col h-full group"
            >
              <span className="text-xs font-bold text-orange-600 uppercase mb-1">{p.category}</span>
              <span className="font-semibold text-gray-800 flex-1 leading-tight group-hover:text-orange-700">{p.name}</span>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-xl font-bold text-gray-900">${p.sellPrice.toFixed(2)}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                  Stock: {p.stock}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart and Checkout */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg flex flex-col h-full overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-gray-800">
              <ShoppingCart size={20} className="text-orange-500" />
              <span>Carrito</span>
            </div>
            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">
              {cart.length} items
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 opacity-50">
                <ShoppingCart size={48} strokeWidth={1} />
                <p>Carrito vacío</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.productId} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg group">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 leading-none">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">${item.price.toFixed(2)} c/u</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-gray-200 rounded">
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-gray-200 rounded">
                      <Plus size={16} />
                    </button>
                    <button onClick={() => removeFromCart(item.productId)} className="ml-1 p-1 text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-4">
            {/* Payment Options */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentMethod('Efectivo')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    paymentMethod === 'Efectivo' 
                      ? 'bg-green-100 border-green-500 text-green-700 shadow-inner' 
                      : 'bg-white border-gray-200 text-gray-500'
                  }`}
                >
                  <Banknote size={18} />
                  Contado
                </button>
                <button
                  onClick={() => setPaymentMethod('Crédito')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    paymentMethod === 'Crédito' 
                      ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-inner' 
                      : 'bg-white border-gray-200 text-gray-500'
                  }`}
                >
                  <CreditCard size={18} />
                  Fiado
                </button>
              </div>

              {paymentMethod === 'Crédito' && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                    <User size={12} /> Seleccionar Cliente
                  </div>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                  >
                    <option value="">-- Elige un cliente --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} (Saldo: ${c.balance.toFixed(2)})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Total and Checkout */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>${(total / 1.16).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600 text-sm border-b border-gray-200 pb-2">
                <span>IVA (16%)</span>
                <span>${(total - total / 1.16).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-3xl font-black text-orange-600">${total.toFixed(2)}</span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={handleFinish}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:bg-gray-400 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <Printer size={24} />
                Pagar e Imprimir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSModule;
