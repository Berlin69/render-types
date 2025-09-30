export async function POST(req: Request) {
  const form = await req.formData()
  const name = String(form.get("name") ?? "")
  const comment = String(form.get("comment") ?? "")
  const file = form.get("file") as File | null
  return new Response(
    JSON.stringify({ ok: true, name, comment, file: file ? { name: file.name, size: file.size, type: file.type } : null }),
    { headers: { "content-type": "application/json" } }
  )
}