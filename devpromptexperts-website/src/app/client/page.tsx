// app/hello-world/page.tsx
export default function client() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Hello World - Client!
        </h1>
        <p className="text-lg text-gray-600">
          Welcome to your first TSX page
        </p>
      </div>
    </div>
  );
}