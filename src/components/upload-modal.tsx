"use client"

import {useState} from "react"

import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Progress} from "@/components/ui/progress"

import {z} from "zod"
import {toast} from "sonner"


const schema = z.object({
  name: z.string().min(1, "Fill this field"),
  comment: z.string().optional(),
  file: z.instanceof(File).refine(f => f.size > 0, "You should add file"),
})


type Form = z.infer<typeof schema>


export function UploadModal({open, onOpenChange}: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [progress, setProgress] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {register, handleSubmit, formState: {errors}, reset, setValue} = useForm<Form>({resolver: zodResolver(schema)})


  const onSubmit = async (data: Form) => {
    setIsSubmitting(true)
    setProgress(0)
    try {
      const fd = new FormData()
      fd.append("name", data.name)
      fd.append("comment", data.comment ?? "")
      fd.append("file", data.file)


// XHR с прогрессом
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("POST", "/api/submit")
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            const p = Math.round((ev.loaded / ev.total) * 100)
            setProgress(p)
          }
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const json = JSON.parse(xhr.responseText)
              toast.success(`Uploaded: ${json.file?.name} (${json.file?.size} bytes)`) // sonner
            } catch { /* ignore */
            }
            resolve()
          } else {
            reject(new Error("Request failed"))
          }
        }
        xhr.onerror = () => reject(new Error("Network error"))
        xhr.send(fd)
      })


      setProgress(100)
      reset()
      onOpenChange(false)
    } catch (e) {
      toast.error("Error while sending form")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setProgress(0), 300)
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload form</DialogTitle>
          <DialogDescription>Text + file → POST на /api/submit</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea id="comment" rows={3} {...register("comment")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="file">File</Label>
            <Input id="file" type="file" accept="*/*" onChange={e => {
              const f = e.target.files?.[0]
              if (f) setValue("file", f, {shouldValidate: true})
            }}/>
            {errors.file && <p className="text-sm text-destructive">{errors.file.message}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send"}</Button>
          </div>
          {isSubmitting && (
            <div className="grid gap-2">
              <p className="text-xs text-muted-foreground">Uploading file… {progress}%</p>
              <Progress value={progress}/>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}