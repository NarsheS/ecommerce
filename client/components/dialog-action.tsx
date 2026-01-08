import React from 'react'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type DialogActionProps = {
  title: string
  description?: React.ReactNode
  content?: Array<{ id: string | number; name: string; type?: string }>
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  loading?: boolean
  values?: Record<string, any>
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const DialogAction: React.FC<DialogActionProps> = ({ title, description, content, handleSubmit, loading, values = {}, onChange }) => {
  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button variant="outline" className='bg-blue-500 text-white cursor-pointer hover:bg-blue-600 hover:text-amber-50'>Open Dialog</Button>
        </DialogTrigger>

        {/* DialogContent is a column; header and footer stay fixed, middle area scrolls */}
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-hidden flex flex-col">
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
                <Label htmlFor={String(item.id)}>{item.name}</Label>

                {item.type === 'file' ? (
                  // file inputs can't be fully controlled by value, handle via onChange
                  <Input id={String(item.id)} name={item.name} type="file" onChange={onChange} />
                ) : (
                  <Input
                    id={String(item.id)}
                    name={item.name}
                    placeholder={item.name}
                    type={item.type}
                    value={values[item.name] ?? ''}
                    onChange={onChange}
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" className='cursor-pointer' disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default DialogAction