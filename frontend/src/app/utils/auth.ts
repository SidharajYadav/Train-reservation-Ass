export function saveUser(user: any, token: string) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
}
export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
export function getToken() {
  return localStorage.getItem("token");
}
export function logout() {
  localStorage.clear();
}
 
 
