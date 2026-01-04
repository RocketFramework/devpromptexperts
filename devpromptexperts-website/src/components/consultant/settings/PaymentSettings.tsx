"use client";

import { useState, useEffect } from "react";
import { HiCreditCard, HiPlus, HiTrash, HiCheck, HiExclamation } from "react-icons/hi";
import { ExtendedConsultantsService } from "@/services/extended/ExtendedConsultantsService";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PaymentMethod {
    id: string;
    type: string;
    details: string;
    isPrimary: boolean;
}

export default function PaymentSettings({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMethod, setNewMethod] = useState({ type: "Bank Transfer", details: "" });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadSettings();
    }, [userId]);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const data = await ExtendedConsultantsService.findByUser_Id(userId);
            if (data && data.payment_methods) {
                setMethods(data.payment_methods as unknown as PaymentMethod[]);
            }
        } catch (error) {
            console.error("Failed to load payment settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (updatedMethods: PaymentMethod[]) => {
        setSaving(true);
        setMessage(null);
        try {
            const result = await ExtendedConsultantsService.updateByUser_Id(userId, {
                payment_methods: updatedMethods as any
            });
            if (result) {
                setMethods(updatedMethods);
                setMessage({ type: 'success', text: 'Payment settings saved successfully.' });
            }
        } catch (error) {
            console.error("Failed to save payment settings", error);
            setMessage({ type: 'error', text: 'Failed to save payment settings.' });
        } finally {
            setSaving(false);
        }
    };

    const addMethod = () => {
        if (!newMethod.details.trim()) return;
        const method: PaymentMethod = {
            id: Date.now().toString(),
            type: newMethod.type,
            details: newMethod.details,
            isPrimary: methods.length === 0
        };
        const updated = [...methods, method];
        handleSave(updated);
        setNewMethod({ type: "Bank Transfer", details: "" });
        setShowAddForm(false);
    };

    const deleteMethod = (id: string) => {
        const updated = methods.filter(m => m.id !== id);
        // Ensure at least one is primary if any exist
        if (updated.length > 0 && !updated.find(m => m.isPrimary)) {
            updated[0].isPrimary = true;
        }
        handleSave(updated);
    };

    const setPrimary = (id: string) => {
        const updated = methods.map(m => ({
            ...m,
            isPrimary: m.id === id
        }));
        handleSave(updated);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Payment Methods</h2>
                    <p className="text-sm text-slate-500">Manage how you receive payments from clients.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200"
                >
                    <HiPlus className="mr-2 h-4 w-4" />
                    Add Method
                </button>
            </div>

            <div className="p-6 space-y-4">
                {message && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                        {message.type === 'success' ? <HiCheck className="w-5 h-5" /> : <HiExclamation className="w-5 h-5" />}
                        <span className="text-sm font-medium">{message.text}</span>
                    </div>
                )}

                {methods.length === 0 && !showAddForm ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <HiCreditCard className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No payment methods set</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2 text-sm">Add your bank details or PayPal address so clients can pay you for your work.</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="mt-6 text-blue-600 font-bold hover:text-blue-700 text-sm"
                        >
                            + Add your first method
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {methods.map((method) => (
                            <div key={method.id} className={`p-5 rounded-2xl border transition-all ${method.isPrimary ? 'border-blue-200 bg-blue-50/30 ring-1 ring-blue-100' : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.isPrimary ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            <HiCreditCard className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-slate-900">{method.type}</h4>
                                                {method.isPrimary && (
                                                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">Primary</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap font-mono">{method.details}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {!method.isPrimary && (
                                            <button
                                                onClick={() => setPrimary(method.id)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Set as Primary"
                                            >
                                                <HiCheck className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteMethod(method.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete Method"
                                        >
                                            <HiTrash className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showAddForm && (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h4 className="font-bold text-slate-900 mb-4">Add Payment Method</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Method Type</label>
                                <select
                                    value={newMethod.type}
                                    onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value })}
                                    className="block w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                >
                                    <option>Bank Transfer</option>
                                    <option>PayPal</option>
                                    <option>Payoneer</option>
                                    <option>Wise</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Payment Details / Instructions</label>
                                <textarea
                                    value={newMethod.details}
                                    onChange={(e) => setNewMethod({ ...newMethod, details: e.target.value })}
                                    className="block w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all text-sm min-h-[100px]"
                                    placeholder="Enter your bank account holder name, IBAN, SWIFT code, or email address..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addMethod}
                                    disabled={!newMethod.details.trim() || saving}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Method'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
