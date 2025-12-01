"use client";

import { Industries } from "@/types";
import { useState } from "react";
import { Industries as INDUSTRY_FOCUS_OPTIONS, GEOGRAPHIC_FOCUS_OPTIONS, SellerOnboardingFormData as SellerProfileFormData } from "@/types"
interface StepNetworkOverviewProps {
  data: SellerProfileFormData
  onUpdate: (data: SellerProfileFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepNetworkOverview({ data, onUpdate, onNext, onBack }: StepNetworkOverviewProps) {
  const [formData, setFormData] = useState(data);
  const [companyInput, setCompanyInput] = useState("");

  const handleChange = (field: string, value: unknown) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const toggleArrayItem = (field: string, item: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    const updatedArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    handleChange(field, updatedArray);
  };

  const addTargetCompany = () => {
    if (companyInput.trim() && !formData.target_companies?.includes(companyInput.trim())) {
      handleChange("target_companies", [...formData.target_companies??"", companyInput.trim()]);
      setCompanyInput("");
    }
  };

  const removeTargetCompany = (company: string) => {
    handleChange("target_companies", formData.target_companies?.filter(c => c !== company));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Network & Target Market</h2>
      <p className="text-gray-600 mb-8">Tell us about your enterprise connections and target market focus.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Enterprise Connections */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Enterprise Connections</h3>
          <div>
            <label htmlFor="enterprise_connections" className="block text-sm font-medium text-blue-900 mb-2">
              How many enterprise-level contacts do you have in your network? *
            </label>
            <input
              id="enterprise_connections"
              type="number"
              min="0"
              max="1000"
              required
              value={formData.enterprise_connections}
              onChange={(e) => handleChange("enterprise_connections", parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 50"
            />
            <p className="mt-1 text-xs text-blue-700">
              Enterprise contacts are decision-makers at companies with 500+ employees or $50M+ revenue
            </p>
          </div>
        </div>

        {/* Target Companies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Target Companies
            <span className="text-xs text-gray-500 ml-2">(Companies you have connections with or plan to target)</span>
          </label>
          
          {/* Selected Companies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.target_companies?.map(company => (
              <span key={company} className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                {company}
                <button
                  type="button"
                  onClick={() => removeTargetCompany(company)}
                  className="ml-2 hover:text-green-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Add Company Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              placeholder="Add company name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTargetCompany())}
            />
            <button
              type="button"
              onClick={addTargetCompany}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Industry Focus */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Industry Focus *
            <span className="text-xs text-gray-500 ml-2">(Select industries where you have strong connections)</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {INDUSTRY_FOCUS_OPTIONS.map(industry => (
              <label key={industry} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.industries_focus?.includes(industry)}
                  onChange={() => toggleArrayItem("industries_focus", industry)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{industry}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Geographic Focus */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Geographic Focus *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {GEOGRAPHIC_FOCUS_OPTIONS.map(region => (
              <label key={region} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.geographic_focus?.includes(region)}
                  onChange={() => toggleArrayItem("geographic_focus", region)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{region}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Network Strength Indicator */}
        <div className="bg-gradien-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Network Potential</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Enterprise Connections</span>
              <span className="text-sm font-medium text-gray-900">
                {formData.enterprise_connections} contacts
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Target Companies</span>
              <span className="text-sm font-medium text-gray-900">
                {formData.target_companies?.length} companies
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Industry Focus Areas</span>
              <span className="text-sm font-medium text-gray-900">
                {formData.industries_focus?.length} industries
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Geographic Coverage</span>
              <span className="text-sm font-medium text-gray-900">
                {formData.geographic_focus?.length} regions
              </span>
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
            Next: Commission Agreement
          </button>
        </div>
      </form>
    </div>
  );
}