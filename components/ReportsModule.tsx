
import React from 'react';
import { Sale, POSState } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { DollarSign, TrendingUp, ShoppingBag, Users, FileText, Download } from 'lucide-react';

interface ReportsModuleProps {
  state: POSState;
}

const ReportsModule: React.FC<ReportsModuleProps> = ({ state }) => {
  const { sales, products, clients } = state;

  const today = new Date().setHours(0, 0, 0, 0);
  const todaySales = sales.filter(s => s.timestamp >= today);

  const totalRevenue = todaySales.reduce((acc, s) => acc + s.total, 0);
  const totalCost = todaySales.reduce((acc, s) => acc + s.totalCost, 0);
  const netProfit = totalRevenue - totalCost;
  const creditSalesCount = todaySales.filter(s => s.method === 'Crédito').length;

  // Data for charts
  const salesByCategory = todaySales.reduce((acc: any, s) => {
    s.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const cat = prod?.category || 'Varios';
      acc[cat] = (acc[cat] || 0) + (item.price * item.quantity);
    });
    return acc;
  }, {});

  const pieData = Object.keys(salesByCategory).map(name => ({
    name,
    value: salesByCategory[name]
  }));

  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#a855f7'];

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Corte del Día</h2>
          <p className="text-gray-500">Resumen financiero y métricas de rendimiento de hoy.</p>
        </div>
        <button 
          onClick={printReport}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-all shadow-md"
        >
          <FileText size={20} />
          Imprimir Reporte PDF
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 text-orange-600 mb-2">
            <DollarSign size={20} />
            <span className="text-sm font-bold uppercase">Ventas Totales</span>
          </div>
          <p className="text-3xl font-black text-gray-900">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">Bruto antes de costos</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 text-red-600 mb-2">
            <TrendingUp size={20} className="rotate-180" />
            <span className="text-sm font-bold uppercase">Costos Totales</span>
          </div>
          <p className="text-3xl font-black text-gray-900">${totalCost.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">Basado en compra a proveedores</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm ring-2 ring-green-500 ring-offset-2">
          <div className="flex items-center gap-3 text-green-600 mb-2">
            <TrendingUp size={20} />
            <span className="text-sm font-bold uppercase">Ganancia Neta</span>
          </div>
          <p className="text-3xl font-black text-green-700">${netProfit.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">Beneficio real (Margen)</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <ShoppingBag size={20} />
            <span className="text-sm font-bold uppercase">Operaciones</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{todaySales.length}</p>
          <p className="text-xs text-gray-400 mt-1">{creditSalesCount} ventas a crédito</p>
        </div>
      </div>

      {/* Charts & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-4">Ventas por Categoría</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Table Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-4 mb-4">Detalle de Ventas Hoy</h3>
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-gray-400 uppercase border-b border-gray-50">
                  <th className="py-2">Hora</th>
                  <th className="py-2">Método</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {todaySales.sort((a,b) => b.timestamp - a.timestamp).map(s => (
                  <tr key={s.id}>
                    <td className="py-3 text-sm text-gray-500">{new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${s.method === 'Efectivo' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {s.method}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-gray-800">${s.total.toFixed(2)}</td>
                  </tr>
                ))}
                {todaySales.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-400 italic">No hay ventas registradas hoy.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Print Only Content */}
      <div className="print-only p-8">
        <h1 className="text-3xl font-bold mb-4">Reporte Diario - TortiPOS</h1>
        <p className="mb-8">Fecha: {new Date().toLocaleDateString()} | Hora: {new Date().toLocaleTimeString()}</p>
        
        <div className="grid grid-cols-2 gap-8 mb-8 border-y py-4">
          <div>
            <p className="text-sm text-gray-500 uppercase">Ventas Totales</p>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase">Ganancia Neta</p>
            <p className="text-2xl font-bold text-green-600">${netProfit.toFixed(2)}</p>
          </div>
        </div>

        <h2 className="font-bold mb-2">Desglose de Ventas</h2>
        <table className="w-full mb-8">
          <thead className="border-b">
            <tr>
              <th className="text-left py-2">Producto</th>
              <th className="text-center py-2">Cant.</th>
              <th className="text-right py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {todaySales.flatMap(s => s.items).reduce((acc: any[], item) => {
              const existing = acc.find(a => a.name === item.name);
              if (existing) {
                existing.quantity += item.quantity;
                existing.subtotal += (item.price * item.quantity);
              } else {
                acc.push({ name: item.name, quantity: item.quantity, subtotal: (item.price * item.quantity) });
              }
              return acc;
            }, []).map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-2">{row.name}</td>
                <td className="py-2 text-center">{row.quantity}</td>
                <td className="py-2 text-right">${row.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsModule;
