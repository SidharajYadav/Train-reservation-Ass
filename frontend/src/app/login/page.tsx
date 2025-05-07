// "use client";
// import { useState } from "react";
// import { login } from "@/app/utils/api";
// import { saveUser } from "@/app/utils/auth";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const router = useRouter();

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     const data = await login(form);
//     if (data.token) {
//       saveUser(data.user, data.token);
//       router.push("/seats");
//     } else {
//       alert(data.error || "Login failed");
//     }
//   };
//   return ( 
//     <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
//       <h1 className="text-xl font-bold mb-4">Login</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           placeholder="Email"
//           type="email"
//           className="w-full p-2 border"
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />
//         <input
//           placeholder="Password"
//           type="password"
//           className="w-full p-2 border"
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />
//         <button className="bg-blue-500 text-white px-4 py-2 rounded">
//           Login
//         </button>
//       </form>
//       <p className="mt-2 text-sm">
//         Don't have an account?{" "}
//         <a href="/register" className="text-blue-600 underline">
//           Register
//         </a>
//       </p>
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import { login } from "@/app/utils/api";
import { saveUser } from "@/app/utils/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = await login(form);
    if (data.token) {
      saveUser(data.user, data.token);
      router.push("/seats");
    } else {
      alert(data.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Welcome Back!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                placeholder="Enter your email"
                type="email"
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                placeholder="Enter your password"
                type="password"
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
