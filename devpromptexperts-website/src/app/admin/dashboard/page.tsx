"use client";

import ConsultantGraph from "@/components/ConsultantGraph";
import { useSession } from "next-auth/react";

const incomeData = [
  { month: "Jan", income: 1112.32 },
  { month: "Feb", income: 1931.43 },
  { month: "Mar", income: 2387.32 },
  { month: "Apr", income: 1653.12 },
  { month: "May", income: 1231.87 },
  { month: "Jun", income: 1324.43 },
  { month: "Jul", income: 2334.43 },
  { month: "Aug", income: 3214.33 },
  { month: "Sep", income: 3764.44 },
  { month: "Oct", income: 4324.23 },
  { month: "Nov", income: 5324.91 },
  { month: "Dec", income: 5324.83 },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-serif mb-4">Welcome {session?.user.name}</h1>
      {/*Overview Bar*/}
      <div className="flex flex-wrap gap-4 justify-center">
        {/*Income Section*/}
        <div
          className="
            w-150
            h-60
            bg-white
            border border-gray-300
            text-black
            rounded-xl 
            hover:shadow-xl hover:border-blue-950 transition cursor-pointer
            p-6
            flex flex-col items-center justify-center
          "
        >
          <div className="text-left w-full">
            <p className="font-semibold text-lg mb-2">Monthly Income</p>
            <p className="text-gray-600 mb-6">
              <span className="bg-green-50 text-green-700 px-1 rounded">+1.3%</span> vs last month
            </p>
            <p className="font-semibold text-5xl">$3,432.87</p> 
            
          </div>
        </div>

        {/*Consultation Requests*/}
        <div
          className="
            w-150
            h-60
            bg-white
            border border-gray-300
            text-black
            rounded-xl
            hover:shadow-xl hover:border-blue-950 transition cursor-pointer 
            p-6
            flex flex-col items-center justify-center
          "
        >
          <div className="text-left w-full">
            <p className="font-semibold text-lg mb-2">Total Consultation Requests</p>
            <p className="text-gray-600 mb-6">
              <span className="bg-red-50 text-red-700 px-1 rounded">-0.3%</span> vs last month
            </p>
            <p className="font-semibold text-5xl">80</p> 
            
          </div>
        </div>

        {/*Consultatant Onboardings*/}
        <div
          className="
            w-150
            h-60
            bg-white
            border border-gray-300
            text-black
            rounded-xl
            hover:shadow-xl hover:border-blue-950 transition cursor-pointer 
            p-6
            flex flex-col items-center justify-center
          "
        >
          <div className="text-left w-full">
            <p className="font-semibold text-lg mb-2">Total Consultant Onboardings</p>
            <p className="text-gray-600 mb-6">
              <span className="bg-green-50 text-green-700 px-1 rounded">+30%</span> vs last month
            </p>
            <p className="font-semibold text-5xl">09</p> 
            
          </div>
        </div>

        {/*Customer  Registrations*/}
        <div
          className="
            w-150
            h-60
            bg-white
            border border-gray-300
            text-black
            rounded-xl 
            hover:shadow-xl hover:border-blue-950 transition cursor-pointer
            p-6
            flex flex-col items-center justify-center
          "
        >
          <div className="text-left w-full">
            <p className="font-semibold text-lg mb-2">Total Customer Registrations</p>
            <p className="text-gray-600 mb-6">
              <span className="bg-green-50 text-green-700 px-1 rounded">+20%</span> vs last month
            </p>
            <p className="font-semibold text-5xl">20</p> 
            
          </div>
        </div>
      </div>
      

      {/*Consultant Analysis*/}
      <div className="space-y-7 mt-10">
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-8">
          <ConsultantGraph data={incomeData} />
        </div>
      </div>

      {/* Visitors Graph */}
      <div className="space-y-7 mt-10">
        <div className="bg-white p-6 w-305 rounded-xl shadow-lg">
          <div className="flex items-center justify-around">
            {/* Like */}
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2 ">
                <span className="text-xl">👍</span>
              </div>
              <p className="text-xl font-bold text-gray-800">234</p>
              <p className="text-xs text-gray-500">Likes</p>
            </div>

            {/* Views */}
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                <span className="text-xl">👁️</span>
              </div>
              <p className="text-xl font-bold text-gray-800">123</p>
              <p className="text-xs text-gray-500">Views</p>
            </div>

            {/* Comments */}
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                <span className="text-xl">💬</span>
              </div>
              <p className="text-xl font-bold text-gray-800">523</p>
              <p className="text-xs text-gray-500">Comments</p>
            </div>

            {/* Users */}
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                <span className="text-xl">👥</span>
              </div>
              <p className="text-xl font-bold text-gray-800">1056</p>
              <p className="text-xs text-gray-500">Users</p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
