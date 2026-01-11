
import { POSState, Product, Client, Sale, CreditPayment } from './types';
import { INITIAL_PRODUCTS, INITIAL_CLIENTS } from './constants';

const STORAGE_KEY = 'tortipos_data_v1';

export const saveState = (state: POSState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const loadState = (): POSState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error loading state", e);
    }
  }
  return {
    products: INITIAL_PRODUCTS,
    clients: INITIAL_CLIENTS,
    sales: [],
    payments: [],
  };
};
