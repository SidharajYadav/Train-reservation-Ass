const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function register(data: any) {
  return fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json()); 
}   
export async function login(data: any) {
  return fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}
export async function fetchSeats(token: string) {
  return fetch(`${API_URL}/seats`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());
}
export async function reserveSeats(token: string, seatIds: number[], userId: number) {
  return fetch(`${API_URL}/reserve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ seatIds, userId }),
  }).then((res) => res.json());
}
export async function cancelSeats(token: string, seatIds: number[], userId: number) {
  return fetch(`${API_URL}/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ seatIds, userId }),
  }).then((res) => res.json());
}
