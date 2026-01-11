
export type Category = 'Masa y Tortilla' | 'Abarrotes' | 'Bebidas' | 'Varios';

export interface Product {
  id: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  category: Category;
}

export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  balance: number;
}

export type PaymentMethod = 'Efectivo' | 'Crédito';

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  cost: number;
}

export interface Sale {
  id: string;
  timestamp: number;
  items: SaleItem[];
  total: number;
  totalCost: number;
  method: PaymentMethod;
  clientId?: string;
}

export interface CreditPayment {
  id: string;
  clientId: string;
  amount: number;
  timestamp: number;
}

export interface POSState {
  products: Product[];
  clients: Client[];
  sales: Sale[];
  payments: CreditPayment[];
}
