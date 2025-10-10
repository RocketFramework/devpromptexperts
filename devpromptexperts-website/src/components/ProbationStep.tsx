import React from "react";

export default function ProbationStep() {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Step 3: Probation Period</h3>
      <p className="mb-4">
        Congratulations! You are now onboarded and in probation. Offer free sessions and collect ratings to upgrade to <span className="font-bold text-blue-600">Professional Consultant</span> status.
      </p>
      <div className="flex gap-4 justify-center mb-4">
        <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold">Probation</span>
        <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-semibold">No Badges Yet</span>
      </div>
      <p className="text-center text-gray-500">Earn badges as you complete sessions and receive positive ratings!</p>
    </div>
  );
}