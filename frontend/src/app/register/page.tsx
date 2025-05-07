// "use client";
// import { useState } from "react";
// import { register } from "@/app/utils/api";
// import { saveUser } from "@/app/utils/auth";
// import { useRouter } from "next/navigation";

// export default function RegisterPage() {
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const router = useRouter();

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     const data = await register(form);
//     if (data.token) {
//       saveUser(data.user, data.token);
//       router.push("/seats");
//     } else {
//       alert(data.error || "Registration failed");
//     }
//   };
//   return (
//     <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
//       <h1 className="text-xl font-bold mb-4">Register</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           placeholder="Name"
//           type="text"
//           className="w-full p-2 border"
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />
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
//         <button className="bg-green-600 text-white px-4 py-2 rounded">
//           Register
//         </button>
//       </form>
//       <p className="mt-2 text-sm">
//         Already have an account?{" "}
//         <a href="/login" className="text-blue-600 underline">
//           Login
//         </a>
//       </p>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { register } from "@/app/utils/api";
import { saveUser } from "@/app/utils/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = await register(form);
    if (data.token) {
      saveUser(data.user, data.token);
      router.push("/seats");
    } else {
      alert(data.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-8">
          Create an Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                placeholder="Enter your name"
                type="text"
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                placeholder="Enter your email"
                type="email"
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-500"
            >
              Register
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
