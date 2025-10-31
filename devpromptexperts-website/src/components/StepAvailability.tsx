// components/onboarding/steps/StepAvailability.tsx
import React from "react";

interface AvailabilityData {
  hoursPerWeek: number;
  preferredEngagement: 'advisory' | 'implementation' | 'assessment' | 'mentoring';
  timeSlots: string[];
  startDate: string;
  noticePeriod?: string;
}


interface StepAvailabilityProps {
  data: AvailabilityData;
  onUpdate: (data: Partial<AvailabilityData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const TIME_SLOTS = [
  'Morning (8AM-12PM)',
  'Afternoon (12PM-5PM)', 
  'Evening (5PM-9PM)',
  'Weekends',
  'Flexible'
];

const ENGAGEMENT_TYPES = [
  {
    value: 'advisory',
    label: 'Strategic Advisory',
    description: 'High-level guidance, board-level consulting, strategy sessions'
  },
  {
    value: 'implementation',
    label: 'Hands-on Implementation',
    description: 'Technical development, coding, system architecture'
  },
  {
    value: 'assessment',
    label: 'Technical Assessment',
    description: 'Code reviews, architecture evaluation, due diligence'
  },
  {
    value: 'mentoring',
    label: 'Team Mentoring',
    description: 'Training, coaching, team development'
  }
];

export default function StepAvailability({ data, onUpdate, onNext, onBack }: StepAvailabilityProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const toggleTimeSlot = (slot: string) => {
    const newSlots = data.timeSlots.includes(slot)
      ? data.timeSlots.filter((s) => s !== slot)
      : [...data.timeSlots, slot];
    onUpdate({ timeSlots: newSlots });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Availability & Engagement</h2>
        <p className="text-gray-600">Set your consulting preferences and availability</p>
      </div>

      {/* Hours Per Week */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hours Available Per Week for Consulting *
        </label>
        <select
          required
          value={data.hoursPerWeek}
          onChange={(e) => onUpdate({ hoursPerWeek: parseInt(e.target.value) })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={5}>5 hours</option>
          <option value={10}>10 hours</option>
          <option value={15}>15 hours</option>
          <option value={20}>20 hours</option>
          <option value={25}>25 hours</option>
          <option value={30}>30+ hours</option>
        </select>
        <p className="text-sm text-gray-500 mt-1">This helps us match you with appropriately sized projects</p>
      </div>

      {/* Preferred Engagement Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Preferred Engagement Types *
        </label>
        <div className="grid grid-cols-1 gap-4">
          {ENGAGEMENT_TYPES.map((type) => (
            <label
              key={type.value}
              className="flex items-start p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="radio"
                name="engagementType"
                value={type.value}
                checked={data.preferredEngagement === type.value}
                onChange={() =>
                  onUpdate({
                    preferredEngagement: type.value as AvailabilityData['preferredEngagement']
                  })
                }
                className="mt-1 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <div>
                <div className="font-medium text-gray-900">{type.label}</div>
                <div className="text-sm text-gray-600 mt-1">{type.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Preferred Time Slots (Select all that apply)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TIME_SLOTS.map((slot) => (
            <label key={slot} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={data.timeSlots.includes(slot)}
                onChange={() => toggleTimeSlot(slot)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <span className="text-sm text-gray-700">{slot}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Earliest Start Date for New Projects *
        </label>
        <input
          type="date"
          required
          value={data.startDate}
          onChange={(e) => onUpdate({ startDate: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">When can you begin taking on new consulting projects?</p>
      </div>

      {/* Notice Period */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Typical Notice Period for New Projects
        </label>
          <select
            value={(data as typeof data & { noticePeriod?: string }).noticePeriod || '2 weeks'}
            onChange={(e) => onUpdate({ noticePeriod: e.target.value as 'immediately' | '1 week' | '2 weeks' | '1 month' | '2 months'})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
          <option value="immediately">Immediately</option>
          <option value="1 week">1 week</option>
          <option value="2 weeks">2 weeks</option>
          <option value="1 month">1 month</option>
          <option value="2 months">2+ months</option>
        </select>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Continue to Founder Benefits
        </button>
      </div>
    </form>
  );
}
