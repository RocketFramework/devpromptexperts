"use client";

import Stars from "@/data/ratings";
import IncomeGraph from "@/components/IncomeGraph";
import BarChart from "@/components/BarChart";
import ProgressBar from "@/components/ProgressBar"
import StarRating  from "@/components/FeaturedStarRating"
import ConsultationTable from "@/components/ConsultationTable"
import { totalIncome } from "@/data/sallary";
import { totalRevenue } from "@/data/sallary";
import { totalExpenses } from "@/data/sallary";
import { averageIncome } from "@/data/sallary";
import { averageRevenue } from "@/data/sallary";
import { averageExpenses } from "@/data/sallary";
import { highestRevenueMonth } from "@/data/sallary";
import { rating } from "@/data/ratings"; 
import { useSession } from "next-auth/react";
import { revenueData } from "@/data/sallary";


export default function DashboardPage() {
  const { data: session, status } = useSession();

  return (
    <div className="mb-6 ">
      <h1 className="text-3xl font-serif mb-4">Welcome {session?.user.name}</h1>
      {/*Overview Bar*/}
      <div className="flex flex-wrap gap-4 justify-center">
        {/*Income Section*/}
        <div
          className="
            w-143
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
            <p className="font-semibold text-5xl">${averageIncome.toLocaleString()}</p> 
            
          </div>
        </div>

        {/*Consultation Requests*/}
        <div
          className="
            w-143
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
            w-143
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
            w-143
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
      

      {/*Income Analysis*/}
      <div className="space-y-7 mt-10">
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-8">
          <IncomeGraph data={revenueData} />
        </div>
      </div>

      {/* Likes, Comments, Views */}
      <div className="space-y-7 mt-10">
        <div className="bg-white p-6 w-full rounded-xl shadow-lg">
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
      <div className="flex gap-7 mt-10 py-1">
        {/*Revenue*/}
        <div className="bg-white p-6 mt-10 rounded-xl w-full h-auto shadow-lg space-y-8 flex flex-col items-center justify-center">
          <b className="mb-4 text-lg">Monthly Revenue</b>
          <BarChart />
          <p className="text-left w-full text-gray-700 text-sm">Average Revenue: $ {averageRevenue.toLocaleString()}</p>
          <p className="text-left w-full text-gray-700 text-sm">Total Revenue: $ {totalRevenue.toLocaleString()}</p>
          <p className="text-left w-full text-gray-700 text-sm">Most Revenued Month: {highestRevenueMonth.month}</p>
        </div>

        {/*Reviews*/}
        <div className="bg-white p-6 mt-10 rounded-xl w-full h-auto shadow-lg space-y-8 flex flex-col items-center justify-center ">
          <b className="mb-4 text-lg">Customer Satisfaction</b>
          <div className="flex-1 w-full">
            <StarRating rating={Stars(rating)} />
            <p className="p-2 text-center">({Stars(rating)} Stars out of 5)</p>
            <ProgressBar counts={rating} />
          </div>
          <a href="/admin/review" className="bg-sky-600 text-white px-4 py-2 w-100 rounded-xl hover:bg-sky-700 text-center hover:shadow-xl">
            See all Customer Reviews
          </a>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-7 bg-white py-6 px-4 py-3 rounded-xl w-full h-auto shadow-lg ">
        <p className="text-center text-xl mb-4 text-gray-600 font-semibold ">Averege Financial Overview (Monthly)</p>
        <div className="flex justify-around items-center">
          {/* Revenue */}
          <div className="flex flex-col items-center">
            <span className="text-gray-600 font-semibold text-lg">Revenue</span>
            <span className="text-green-600 text-2xl font-normal">+${averageRevenue.toLocaleString()}</span>
          </div>

          {/* Expenses */}
          <div className="flex flex-col items-center">
            <span className="text-gray-600 font-semibold text-lg">Expenses</span>
            <span className="text-red-600 text-2xl font-normal">-${averageExpenses.toLocaleString()}</span>
          </div>

          {/* Income */}
          <div className="flex flex-col items-center">
            <span className="text-gray-600 font-semibold text-lg">Income</span>
            <span className="text-blue-600 text-2xl font-normal">+${(Math.round((
                            averageRevenue - averageExpenses) * 100) / 100).toLocaleString()}</span>
          </div>

        </div>
      </div>

      <div className="space-y-7 mt-10">
        <div className="bg-white p-6 w-full h-auto rounded-xl shadow-lg space-y-8">
          <p className="text-center text-gray-600 text-lg font-semibold">
            Recent Consultations
          </p>
          <ConsultationTable />
        </div>
      </div>

    </div>
  );
}