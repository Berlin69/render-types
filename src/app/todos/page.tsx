import { getTodos } from "@/lib/api"
export const dynamic = "force-dynamic" // явно SSR


export default async function TodosPage() {
  const todos = await getTodos(10)
  return (
    <ul className="grid gap-2">
      {todos.map(t => (
        <li key={t.id} className="border rounded-md p-3 flex items-center gap-2">
          <input type="checkbox" checked={t.completed} readOnly />
          <span>{t.title}</span>
        </li>
      ))}
    </ul>
  )
}