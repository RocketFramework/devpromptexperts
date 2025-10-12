import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import ConsultantGraph from "@/components/ConsultantGraph";

const consultantData = [
  { month: "Jan", total: 40 },
  { month: "Feb", total: 55 },
  { month: "Mar", total: 70 },
  { month: "Apr", total: 65 },
  { month: "May", total: 90 },
  { month: "Jun", total: 120 },
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return <p className="p-6 text-red-600">Access denied. Please login as admin.</p>;
  }

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {/*Overview Bar*/}
      <div
        className="
          w-full
          bg-gray-200
          text-black
          rounded-xl 
          p-6
          shadow-xl
          flex flex-wrap justify-around
        "
      >
        <div className="mb-4 md:mb-0 text-center">
          <h2 className="text-xl font-semibold">Total Consultants</h2>
          <p className="text-2xl font-bold">500</p>
        </div>

        <div className="mb-4 md:mb-0 text-center">
          <h2 className="text-xl font-semibold">Pending Onboarding</h2>
          <p className="text-2xl font-bold">20</p>
        </div>

        <div className="mb-4 md:mb-0 text-center">
          <h2 className="text-xl font-semibold">Completed Consultations</h2>
          <p className="text-2xl font-bold">1500</p>
        </div>

        <div className="mb-4 md:mb-0 text-center">
          <h2 className="text-xl font-semibold">Active Consultants</h2>
          <p className="text-2xl font-bold">100</p>
        </div>

        <div className="mb-4 md:mb-0 text-center">
          <h2 className="text-xl font-semibold">Average Rating</h2>
          <p className="text-2xl font-bold">99%</p>
        </div>
      </div>

      {/*Consultant Analysis*/}
      <div className="space-y-7 mt-10">
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-8">
          <ConsultantGraph data={consultantData} />
        </div>
      </div>
    </div>
  );
}
