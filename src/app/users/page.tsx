import {getUsers} from "@/lib/api"

export const revalidate = 60 // ISR 60 сек


export default async function UsersPage() {
  const users = await getUsers()
  return (
    <table className="w-full text-sm">
      <thead>
      <tr className="text-left border-b">
        <th className="py-2">ID</th>
        <th>Name</th>
        <th>Email</th>
      </tr>
      </thead>
      <tbody>
      {users.map(u => (
        <tr key={u.id} className="border-b last:border-0">
          <td className="py-2">{u.id}</td>
          <td>{u.name}</td>
          <td>{u.email}</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}