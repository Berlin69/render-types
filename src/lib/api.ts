export const BASE = "https://jsonplaceholder.typicode.com"

export async function getTodos(limit = 10) {
  const res = await fetch(`${BASE}/todos?_limit=${limit}`, { cache: "no-store" }) // SSR
  if (!res.ok) throw new Error("Failed to fetch todos")
  return res.json() as Promise<Array<{ id: number; title: string; completed: boolean }>>
}

export async function getPosts(limit = 10) {
  const res = await fetch(`${BASE}/posts?_limit=${limit}`, { next: { revalidate: false } }) // SSG
  if (!res.ok) throw new Error("Failed to fetch posts")
  return res.json() as Promise<Array<{ id: number; title: string; body: string }>>
}

export async function getUsers() {
  const res = await fetch(`${BASE}/users`, { next: { revalidate: 60 } }) // ISR 60 сек
  if (!res.ok) throw new Error("Failed to fetch users")
  return res.json() as Promise<Array<{ id: number; name: string; email: string }>>
}