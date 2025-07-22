"use client";
import { useEffect, useState } from "react"; 
import { fetchSeats, reserveSeats, cancelSeats } from "@/app/utils/api";
import { getUser, getToken, logout } from "@/app/utils/auth";
import { useRouter } from "next/navigation";
 
export default function SeatsPage() {
  const [seats, setSeats] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
 
  const loadSeats = async (authToken: string) => {
    const data = await fetchSeats(authToken);
    setSeats(data);
  };

  const handleReserve = async () => {
    if (!token || !user) return;
    const res = await reserveSeats(token, selected, user.id);
    alert(res.message || res.error);
    setSelected([]);
    loadSeats(token);
  };

  const handleCancel = async () => {
    if (!token || !user) return;
    const res = await cancelSeats(token, selected, user.id);
    alert(res.message || res.error);
    setSelected([]);
    loadSeats(token);
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const storedUser = getUser();
    const storedToken = getToken();

    if (!storedUser || !storedToken) {
      router.push("/login");
    } else {
      setUser(storedUser);
      setToken(storedToken);
      loadSeats(storedToken);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Seat Booking</h1>
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="text-red-500"
        >
          Logout
        </button>
      </div>

      {/* <div className="grid grid-cols-7 gap-2">
        {seats.map((seat) => {
          const isSelected = selected.includes(seat.id);
          const isBooked = seat.is_reserved;

          let bgClass = "bg-green-200 text-black";
          let borderClass = "border border-gray-300";
          let content = `Row ${seat.row_number}, Seat ${seat.seat_number}`;

          if (isBooked) {
            bgClass = "bg-blue-400 text-white";
            borderClass = "border border-blue-500";
          }

          if (isSelected && !isBooked) {
            bgClass = "bg-yellow-400 text-black";
            borderClass = "ring-2 ring-yellow-600 border-yellow-500";
            content = `✅ Selected`;
          }

          return (
            <button
              key={seat.id}
              onClick={() => {
                if (!isBooked) toggleSelect(seat.id);
              }}
              disabled={isBooked}
              className={`transition-all duration-200 m-auto p-8 rounded-lg text-sm font-semibold shadow-sm ${bgClass} ${borderClass} disabled:cursor-not-allowed hover:scale-105`}
            >
              {content}
            </button>
          );
        })}
      </div> */} 
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 p-4">
        {seats.map((seat) => {
          const isSelected = selected.includes(seat.id);
          const isBooked = seat.is_reserved;

          let bgClass = "bg-green-100 text-black";
          let borderClass = "border border-gray-300";
          let content = `R${seat.row_number} - S${seat.seat_number}`;

          if (isBooked) {
            bgClass = "bg-gray-300 text-gray-500";
            borderClass = "border-2 border-green-600"; // Green border for booked seat
            content = "Booked";
          }

          if (isSelected && !isBooked) {
            bgClass = "bg-yellow-300 text-black";
            borderClass = "ring-2 ring-yellow-500 border-yellow-500";
            content = "✅ Selected";
          }

          return (
            <button
              key={seat.id}
              onClick={() => {
                if (!isBooked) toggleSelect(seat.id);
              }}
              disabled={isBooked}
              className={`w-full aspect-square transition-all duration-300 rounded-md text-xs font-medium flex items-center justify-center shadow-md ${bgClass} ${borderClass} disabled:cursor-not-allowed hover:scale-105`}
            >
              {content}
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-x-4 ml-4 mr-4 mb-4 ">
        <button
          onClick={handleReserve}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ✅ Reserve Selected
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          ❌ Cancel Selected
        </button>
      </div>
    </div>
  );
}
