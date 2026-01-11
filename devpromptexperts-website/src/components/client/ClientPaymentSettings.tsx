"use client";

import { useState } from "react";
import { HiCreditCard, HiPlus, HiTrash, HiCheck, HiExclamation } from "react-icons/hi";

// Mock payment method type for clients (Credit Cards)
interface ClientPaymentMethod {
    id: string;
    type: string;
    last4: string;
    brand: string;
    expiry: string;
    isPrimary: boolean;
}

export default function ClientPaymentSettings() {
    const [methods, setMethods] = useState<ClientPaymentMethod[]>([
        {
            id: "1",
            type: "card",
            last4: "4242",
            brand: "Visa",
            expiry: "12/25",
            isPrimary: true
        }
    ]);
    const [showAddForm, setShowAddForm] = useState(false);
    // Mock form state
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [svc, setSvc] = useState("");
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const addMethod = () => {
        // Simulate adding a card
        const newMethod: ClientPaymentMethod = {
            id: Date.now().toString(),
            type: "card",
            last4: cardNumber.slice(-4) || "0000",
            brand: "MasterCard", // Mock
            expiry: expiry || "01/26",
            isPrimary: methods.length === 0
        };

        setMethods([...methods, newMethod]);
        setShowAddForm(false);
        setMessage({ type: 'success', text: 'Payment method added successfully.' });
        setCardNumber("");
        setExpiry("");
        setSvc("");
    };

    const deleteMethod = (id: string) => {
        const updated = methods.filter(m => m.id !== id);
        if (updated.length > 0 && !updated.find(m => m.isPrimary)) {
            updated[0].isPrimary = true;
        }
        setMethods(updated);
        setMessage({ type: 'success', text: 'Payment method removed.' });
    };

    const setPrimary = (id: string) => {
        setMethods(methods.map(m => ({
            ...m,
            isPrimary: m.id === id
        })));
        setMessage({ type: 'success', text: 'Primary payment method updated.' });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Billing Methods</h2>
                    <p className="text-sm text-slate-500">Manage credit cards for project payments.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200"
                >
                    <HiPlus className="mr-2 h-4 w-4" />
                    Add Card
                </button>
            </div>

            <div className="p-6 space-y-4">
                {message && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {message.type === 'success' ? <HiCheck className="w-5 h-5" /> : <HiExclamation className="w-5 h-5" />}
                        <span className="text-sm font-medium">{message.text}</span>
                    </div>
                )}

                {methods.length === 0 && !showAddForm ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <HiCreditCard className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No billing methods</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2 text-sm">Add a credit card to pay for projects securely.</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="mt-6 text-blue-600 font-bold hover:text-blue-700 text-sm"
                        >
                            + Add your first card
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {methods.map((method) => (
                            <div key={method.id} className={`flex items-center justify-between p-4 rounded-xl border ${method.isPrimary ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-white'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center text-white font-bold text-xs tracking-wider">
                                        {method.brand}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-slate-900">•••• •••• •••• {method.last4}</p>
                                            {method.isPrimary && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Primary</span>}
                                        </div>
                                        <p className="text-xs text-slate-500">Expires {method.expiry}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {!method.isPrimary && (
                                        <button onClick={() => setPrimary(method.id)} className="text-slate-400 hover:text-blue-600 p-2" title="Set Primary">
                                            <HiCheck className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button onClick={() => deleteMethod(method.id)} className="text-slate-400 hover:text-red-600 p-2" title="Remove Card">
                                        <HiTrash className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showAddForm && (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-4">
                        <h4 className="font-bold text-slate-900 mb-4">Add New Card</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Card Number</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-slate-200 focus:ring-blue-500"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Expiry Date</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-slate-200 focus:ring-blue-500"
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">CVC</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-slate-200 focus:ring-blue-500"
                                    placeholder="123"
                                    value={svc}
                                    onChange={(e) => setSvc(e.target.value)}
                                />
                            </div>
                            <div className="col-span-2 flex justify-end gap-3 mt-2">
                                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm font-bold text-slate-500">Cancel</button>
                                <button onClick={addMethod} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition">Save Card</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
