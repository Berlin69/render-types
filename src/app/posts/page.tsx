import { getPosts } from "@/lib/api"
export const dynamic = "force-static" // SSG


export default async function PostsPage() {
  const posts = await getPosts(10)
  return (
    <div className="grid gap-3">
      {posts.map(p => (
        <article key={p.id} className="border rounded-md p-4">
          <h3 className="font-medium">{p.title}</h3>
          <p className="text-sm text-muted-foreground">{p.body}</p>
        </article>
      ))}
    </div>
  )
}