// StepCommissionAgreement.tsx
"use client";

import { useState, useEffect } from "react";
import { SellerOnboardingFormData } from "@/types";

interface StepCommissionAgreementProps {
  data: SellerOnboardingFormData;
  onUpdate: (data: SellerOnboardingFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

const PAYMENT_METHODS = [
  "Bank Transfer",
  "PayPal",
  "Wise",
  "Stripe",
  "Direct Deposit"
];

const COMMISSION_TIERS = [
  { 
    range: "Up to $25,000", 
    commission: "5%", 
    platform_fee: "15%",
    platform_net: "15%",
    value: "5%"
  },
  { 
    range: "$25,001 - $75,000", 
    commission: "7.5%", 
    platform_fee: "12.5%",
    platform_net: "12.5%",
    value: "7.5%"
  },
  { 
    range: "$75,001 - $150,000", 
    commission: "10%", 
    platform_fee: "10%",
    platform_net: "10%",
    value: "10%"
  },
  { 
    range: "$150,001+", 
    commission: "12.5%", 
    platform_fee: "7.5%",
    platform_net: "7.5%",
    value: "12.5%"
  }
];

export default function StepCommissionAgreement({ data, onUpdate, onNext, onBack }: StepCommissionAgreementProps) {
  const [selectedModel, setSelectedModel] = useState<"tiered" | "revshare">(
    data.commission_type || "tiered"
  );
  const [selectedTier, setSelectedTier] = useState(data.selected_tier || COMMISSION_TIERS[0].value);
  const [formData, setFormData] = useState(data);

  // Update platform economics when model changes
  useEffect(() => {
    let platformEconomics;
    
    if (selectedModel === "tiered") {
      const tier = COMMISSION_TIERS.find(t => t.value === selectedTier) || COMMISSION_TIERS[0];
      platformEconomics = {
        platform_fee: "20%",
        your_commission: tier.commission,
        platform_net: tier.platform_net
      };
    } else {
      platformEconomics = {
        platform_fee: "20%",
        your_commission: "10%",
        platform_net: "10%"
      };
    }

    const updated: SellerOnboardingFormData = {
      ...formData,
      commission_type: selectedModel,
      selected_tier: selectedModel === "tiered" ? selectedTier : undefined,
      ...platformEconomics
    };
    
    setFormData(updated);
    onUpdate(updated);
  }, [selectedModel, selectedTier]);

  const handleChange = (field: keyof SellerOnboardingFormData, value: unknown) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.payment_method) {
      alert("Please select a payment method to continue.");
      return;
    }
    if (!formData.agreed_to_terms) {
      alert("Please agree to the commission agreement terms to continue.");
      return;
    }
    onNext();
  };

  const calculateExampleEarnings = (dealSize: number) => {
    if (selectedModel === "tiered") {
      const tier = COMMISSION_TIERS.find(t => {
        const range = t.range;
        if (range.includes("Up to")) return dealSize <= 25000;
        if (range.includes("$25,001")) return dealSize > 25000 && dealSize <= 75000;
        if (range.includes("$75,001")) return dealSize > 75000 && dealSize <= 150000;
        return dealSize > 150000;
      });
      const rate = parseFloat(tier?.commission || "5") / 100;
      return dealSize * rate;
    } else {
      return dealSize * 0.10; // 10% for revenue share
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Commission Agreement</h2>
      <p className="text-gray-600 mb-8">Choose your commission model and review the economics.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Commission Model Selection */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Your Commission Model</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <label className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
              selectedModel === "tiered" 
                ? "border-green-500 bg-green-50" 
                : "border-gray-300 hover:border-green-300"
            }`}>
              <input
                type="radio"
                name="commission_model"
                value="tiered"
                checked={selectedModel === "tiered"}
                onChange={(e) => setSelectedModel("tiered")}
                className="sr-only"
              />
              <div className="font-medium text-gray-900 mb-2">Tiered Commission</div>
              <p className="text-sm text-gray-600">Higher commissions for larger deals</p>
              <p className="text-xs text-green-600 mt-2">Best for enterprise sales</p>
            </label>

            <label className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
              selectedModel === "revshare" 
                ? "border-green-500 bg-green-50" 
                : "border-gray-300 hover:border-green-300"
            }`}>
              <input
                type="radio"
                name="commission_model"
                value="revshare"
                checked={selectedModel === "revshare"}
                onChange={(e) => setSelectedModel("revshare")}
                className="sr-only"
              />
              <div className="font-medium text-gray-900 mb-2">Revenue Share (50/50)</div>
              <p className="text-sm text-gray-600">50% of platform fees</p>
              <p className="text-xs text-green-600 mt-2">Simple & predictable</p>
            </label>
          </div>

          {/* Tiered Commission Structure */}
          {selectedModel === "tiered" && (
            <div className="bg-linear-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Select Your Target Tier</h4>
              <div className="space-y-3">
                {COMMISSION_TIERS.map((tier, index) => (
                  <label key={index} className={`flex justify-between items-start p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTier === tier.value
                      ? "border-green-500 bg-white shadow-sm"
                      : "border-gray-200 hover:border-green-300"
                  }`}>
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="radio"
                        name="commission_tier"
                        value={tier.value}
                        checked={selectedTier === tier.value}
                        onChange={(e) => setSelectedTier(e.target.value)}
                        className="mt-1 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{tier.range}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          You earn: <span className="font-medium text-green-600">{tier.commission}</span> | 
                          Platform keeps: <span className="font-medium text-blue-600">{tier.platform_fee}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">{tier.commission}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Revenue Share Structure */}
          {selectedModel === "revshare" && (
            <div className="bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Revenue Share Model</h4>
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">20%</div>
                  <div className="text-sm text-gray-600">Platform Fee</div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">10%</div>
                  <div className="text-sm text-gray-600">Your Share</div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">10%</div>
                  <div className="text-sm text-gray-600">Platform Net</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                You earn 50% of the platform&#39;s 20% service fee - a clean 10% of every deal.
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Platform Economics */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {selectedModel === "tiered" ? "Tiered Model Economics" : "Revenue Share Economics"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{formData.platform_fee || "20%"}</div>
              <div className="text-gray-600 mt-1">Platform Fee</div>
              <p className="text-xs text-gray-500 mt-2">Total service fee charged to client</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{formData.your_commission || "5-12.5%"}</div>
              <div className="text-gray-600 mt-1">Your Commission</div>
              <p className="text-xs text-gray-500 mt-2">
                {selectedModel === "tiered" ? "Variable based on deal size" : "Fixed 10% of deal value"}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">{formData.platform_net || "7.5-15%"}</div>
              <div className="text-gray-600 mt-1">Platform Net</div>
              <p className="text-xs text-gray-500 mt-2">Funds operations & growth</p>
            </div>
          </div>
        </div>

        {/* Earning Examples */}
        <div className="bg-linear-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Earning Potential</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {[50000, 100000, 200000].map((dealSize) => (
              <div key={dealSize} className="text-center p-4 bg-white rounded-lg border border-green-200">
                <div className="font-medium text-gray-900">${dealSize.toLocaleString()} Deal</div>
                <div className="text-2xl font-bold text-green-600 mt-2">
                  ${calculateExampleEarnings(dealSize).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 mt-1">Your Commission</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Payment Method *
              </label>
              <select
                id="payment_method"
                required
                value={formData.payment_method || ""}
                onChange={(e) => handleChange("payment_method", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select payment method</option>
                {PAYMENT_METHODS.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tax_id" className="block text-sm font-medium text-gray-700 mb-2">
                Tax ID / VAT Number
              </label>
              <input
                id="tax_id"
                type="text"
                value={formData.tax_id || ""}
                onChange={(e) => handleChange("tax_id", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="For invoicing purposes"
              />
            </div>
          </div>
        </div>

        {/* Agreement Terms */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Commission Agreement</h3>
          
          <div className="space-y-4 max-h-60 overflow-y-auto p-4 border border-gray-200 rounded-lg">
            <div className="space-y-3 text-sm text-gray-600">
              <h4 className="font-medium text-gray-900">Commission Structure</h4>
              <p>
                {selectedModel === "tiered" 
                  ? `You have selected the tiered commission model${formData.selected_tier ? ` targeting the ${formData.selected_tier} rate` : ''}. Your actual commission will vary based on final deal size.`
                  : "You have selected the revenue share model. You will earn 10% of all deal values (50% of the platform's 20% service fee)."
                }
              </p>
              
              <h4 className="font-medium text-gray-900">Payment Terms</h4>
              <p>Commissions are paid within 30 days of project completion and client payment. Minimum payout amount is $100.</p>
              
              <h4 className="font-medium text-gray-900">Exclusive Period</h4>
              <p>Clients you refer are exclusively yours for 12 months. You earn commissions on all their projects during this period.</p>
            </div>
          </div>

          <div className="mt-4 flex items-start space-x-3">
            <input
              type="checkbox"
              id="agreed_to_terms"
              checked={formData.agreed_to_terms || false}
              onChange={(e) => handleChange("agreed_to_terms", e.target.checked)}
              className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
              required
            />
            <div>
              <label htmlFor="agreed_to_terms" className="text-sm font-medium text-gray-900">
                I agree to the Commission Agreement terms *
              </label>
              <p className="text-xs text-gray-600 mt-1">
                By checking this box, you acknowledge and agree to the commission structure and payment terms.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Next: Verification
          </button>
        </div>
      </form>
    </div>
  );
}