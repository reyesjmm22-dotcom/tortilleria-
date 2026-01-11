
import { Product, Client, Category } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Kilo de Tortilla', buyPrice: 18.00, sellPrice: 24.00, stock: 200, category: 'Masa y Tortilla' },
  { id: '2', name: 'Paquete de Tostadas', buyPrice: 25.00, sellPrice: 35.00, stock: 50, category: 'Masa y Tortilla' },
  { id: '3', name: 'Coca-Cola 600ml', buyPrice: 14.50, sellPrice: 19.00, stock: 24, category: 'Bebidas' },
  { id: '4', name: 'Pepsi 600ml', buyPrice: 13.00, sellPrice: 17.50, stock: 24, category: 'Bebidas' },
  { id: '5', name: 'Galletas Surtidas', buyPrice: 15.00, sellPrice: 22.00, stock: 15, category: 'Abarrotes' },
  { id: '6', name: 'Kilo de Masa', buyPrice: 15.00, sellPrice: 20.00, stock: 100, category: 'Masa y Tortilla' },
];

export const INITIAL_CLIENTS: Client[] = [
  { id: 'c1', name: 'Doña María', address: 'Calle 5 de Mayo #12', phone: '555-0101', balance: 150.00 },
  { id: 'c2', name: 'Don José (El de la esquina)', address: 'Av. Principal #45', phone: '555-0202', balance: 0.00 },
  { id: 'c3', name: 'Fonda "Las Delicias"', address: 'Callejón de la Paz #3', phone: '555-0303', balance: 450.50 },
];

export const CATEGORIES: Category[] = ['Masa y Tortilla', 'Abarrotes', 'Bebidas', 'Varios'];
