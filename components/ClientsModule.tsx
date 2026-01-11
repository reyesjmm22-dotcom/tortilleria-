
import React from 'react';
import { Client, CreditPayment } from '../types';
import { UserPlus, Search, Phone, MapPin, Wallet, History, ArrowRight } from 'lucide-react';

interface ClientsModuleProps {
  clients: Client[];
  payments: CreditPayment[];
  onAddPayment: (clientId: string, amount: number) => void;
  onAddClient: (client: Omit<Client, 'id' | 'balance'>) => void;
}

const ClientsModule: React.FC<ClientsModuleProps> = ({ clients, payments, onAddPayment, onAddClient }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);
  const [paymentAmount, setPaymentAmount] = React.useState('');
  const [isAddingClient, setIsAddingClient] = React.useState(false);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayment = () => {
    if (!selectedClient || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    onAddPayment(selectedClient.id, amount);
    setPaymentAmount('');
    setSelectedClient(prev => prev ? { ...prev, balance: prev.balance - amount } : null);
    alert(`Abono de $${amount} registrado para ${selectedClient.name}`);
  };

  const clientPayments = payments
    .filter(p => p.clientId === selectedClient?.id)
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Cartera de Clientes</h2>
          <button 
            onClick={() => setIsAddingClient(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus size={20} />
            Nuevo Cliente
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Contacto</th>
                  <th className="px-6 py-3 text-right">Saldo Deudor</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClients.map(c => (
                  <tr 
                    key={c.id} 
                    className={`hover:bg-blue-50 cursor-pointer transition-colors ${selectedClient?.id === c.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedClient(c)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={10} /> {c.address}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        {c.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-black text-lg ${c.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${c.balance.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ArrowRight size={20} className="text-gray-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6">
        {selectedClient ? (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            {/* Payment Section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Registrar Abono</h3>
                <Wallet className="text-blue-500" />
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-600 font-bold uppercase">Deuda Actual de {selectedClient.name}:</p>
                <p className="text-3xl font-black text-blue-900 mt-1">${selectedClient.balance.toFixed(2)}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Monto a abonar ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              <button
                onClick={handlePayment}
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 transition-all shadow-lg"
              >
                Confirmar Abono
              </button>
            </div>

            {/* History Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <History size={18} className="text-gray-400" />
                  Últimos Movimientos
                </h3>
              </div>
              <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                {clientPayments.length === 0 ? (
                  <p className="p-6 text-center text-gray-400 text-sm italic">Sin abonos registrados.</p>
                ) : (
                  clientPayments.map(p => (
                    <div key={p.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <p className="text-sm font-bold text-gray-800">Abono Recibido</p>
                        <p className="text-xs text-gray-400">{new Date(p.timestamp).toLocaleDateString()} {new Date(p.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <span className="font-bold text-green-600">+${p.amount.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
            <UserPlus size={64} strokeWidth={1} className="mb-4" />
            <h3 className="text-xl font-semibold mb-1">Detalles del Cliente</h3>
            <p>Selecciona un cliente de la lista para ver su saldo y registrar abonos.</p>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {isAddingClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-lg">Nuevo Cliente</h3>
              <button onClick={() => setIsAddingClient(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={24} />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onAddClient({
                name: formData.get('name') as string,
                address: formData.get('address') as string,
                phone: formData.get('phone') as string,
              });
              setIsAddingClient(false);
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input required name="name" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input required name="address" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input required name="phone" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddingClient(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

export default ClientsModule;
