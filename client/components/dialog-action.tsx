import React, { useState } from 'react'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'

type DialogActionProps = {
  title: string
  description?: React.ReactNode
  content?: Array<{ id: string | number; name: string; label?: string; type?: string; placeholder?: string }>
  /**
   * submit handler from parent - should NOT call e.preventDefault()
   * DialogAction will call it and handle toast + auto-close.
   */
  handleSubmit?: () => Promise<any>
  loading?: boolean
  values?: Record<string, any>
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  successMessage?: string
  errorMessage?: string
}

const DialogAction: React.FC<DialogActionProps> = ({ title, description, content, handleSubmit, loading, values = {}, onChange, successMessage, errorMessage }) => {
  const [open, setOpen] = useState(false)

  const handleInternalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!handleSubmit) return

    try {
      await handleSubmit()
      toast.success(successMessage ?? `${title} salvo com sucesso`)
      setOpen(false)
    } catch (err) {
      console.error(err)
      toast.error(errorMessage ?? 'Erro ao salvar')
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex justify-center">
          <DialogTrigger asChild>
            <Button variant="outline" className='bg-blue-500 mt-2 mb-4 text-white cursor-pointer hover:bg-blue-600 hover:text-amber-50'>Open Dialog</Button>
          </DialogTrigger>
        </div>
        

        {/* DialogContent rendered in portal - keep form inside it so inputs and submit belong to same form */}
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-hidden flex flex-col">
          <form onSubmit={handleInternalSubmit} className="flex-1 min-h-0 flex flex-col">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                {description}
              </DialogDescription>
            </DialogHeader>

            {/* make this flex-1 + min-h-0 so overflow-auto can work correctly inside a flex column */}
            <div className="flex-1 min-h-0 overflow-auto py-2 px-1 space-y-4">
              {content?.map((item: any) => (
                <div className="grid gap-3" key={String(item.id)}>
                  <Label htmlFor={String(item.id)}>{item.label ?? item.name}</Label>

                  {item.type === 'file' ? (
                    // file inputs can't be fully controlled by value, handle via onChange
                    <Input id={String(item.id)} name={item.name} type="file" onChange={onChange} />
                  ) : (
                    <Input
                      id={String(item.id)}
                      name={item.name}
                      placeholder={item.placeholder ?? item.label ?? item.name}
                      type={item.type}
                      value={values[item.name] ?? ''}
                      onChange={onChange}
                    />
                  )}
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="submit" className='cursor-pointer' disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DialogAction