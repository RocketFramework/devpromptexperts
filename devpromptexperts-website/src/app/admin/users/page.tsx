import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/admin/[...nextauth]/route";
import AdminLayout from "../layout";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return <p className="p-6 text-red-600">Access denied. Please login as admin.</p>;
  }

  return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <p>This is a protected admin users page.</p>
      </div>

  );
}
