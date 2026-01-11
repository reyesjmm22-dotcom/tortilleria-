
import React, { useState, useEffect } from 'react';
import { POSState, Product, Client, Sale, SaleItem, PaymentMethod } from './types';
import { loadState, saveState } from './db';
import Layout from './components/Layout';
import POSModule from './components/POSModule';
import InventoryModule from './components/InventoryModule';
import ClientsModule from './components/ClientsModule';
import ReportsModule from './components/ReportsModule';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [state, setState] = useState<POSState>(loadState());

  // Persist state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleCompleteSale = (items: SaleItem[], method: PaymentMethod, clientId?: string) => {
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalCost = items.reduce((acc, item) => acc + (item.cost * item.quantity), 0);

    const newSale: Sale = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      items,
      total,
      totalCost,
      method,
      clientId,
    };

    setState(prev => {
      // 1. Update Inventory
      const newProducts = prev.products.map(p => {
        const saleItem = items.find(item => item.productId === p.id);
        if (saleItem) {
          return { ...p, stock: p.stock - saleItem.quantity };
        }
        return p;
      });

      // 2. Update Client Balance if Credit
      const newClients = prev.clients.map(c => {
        if (method === 'Crédito' && c.id === clientId) {
          return { ...c, balance: c.balance + total };
        }
        return c;
      });

      return {
        ...prev,
        products: newProducts,
        clients: newClients,
        sales: [...prev.sales, newSale],
      };
    });
  };

  const handleUpdateProduct = (updated: Product) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === updated.id ? updated : p)
    }));
  };

  const handleAddProduct = (p: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...p,
      id: Date.now().toString(),
    };
    setState(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
  };

  const handleAddClient = (c: Omit<Client, 'id' | 'balance'>) => {
    const newClient: Client = {
      ...c,
      id: 'c' + Date.now().toString(),
      balance: 0,
    };
    setState(prev => ({
      ...prev,
      clients: [...prev.clients, newClient]
    }));
  };

  const handleAddPayment = (clientId: string, amount: number) => {
    const newPayment = {
      id: 'pay' + Date.now().toString(),
      clientId,
      amount,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      payments: [...prev.payments, newPayment],
      clients: prev.clients.map(c => c.id === clientId ? { ...c, balance: c.balance - amount } : c)
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'pos':
        return <POSModule products={state.products} clients={state.clients} onCompleteSale={handleCompleteSale} />;
      case 'inventory':
        return <InventoryModule products={state.products} onUpdateProduct={handleUpdateProduct} onAddProduct={handleAddProduct} />;
      case 'clients':
        return <ClientsModule clients={state.clients} payments={state.payments} onAddPayment={handleAddPayment} onAddClient={handleAddClient} />;
      case 'reports':
        return <ReportsModule state={state} />;
      default:
        return <POSModule products={state.products} clients={state.clients} onCompleteSale={handleCompleteSale} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
