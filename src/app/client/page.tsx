"use client"
import useSWR from "swr"

type Album = {
  userId: number
  id: number
  title: string
}

const fetcher = (url: string) =>
  fetch(url).then<Album[]>((r) => r.json())

export default function ClientPage() {
  const {data, error, isLoading} = useSWR<Album[]>(
    "https://jsonplaceholder.typicode.com/albums?_limit=10",
    fetcher
  )

  if (isLoading) return <p>Loading…</p>
  if (error) return <p>Error while loading</p>

  return (
    <ul className="grid gap-2">
      {data?.map((x) => (
        <li key={x.id} className="border rounded-md p-3">{x.title}</li>
      ))}
    </ul>
  )
}