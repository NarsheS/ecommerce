'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/* ----------------------------- Types ----------------------------- */

export type SelectOption = {
  value: string
  label: string
}

export type DialogField = {
  id: string | number
  name: string
  label?: string
  type?: 'text' | 'number' | 'file' | 'select'
  placeholder?: string
  options?: SelectOption[]
}

type DialogActionProps = {
  title: string
  description?: React.ReactNode
  content?: DialogField[]

  /**
   * submit handler from parent
   * DialogAction will handle preventDefault, toast and auto-close
   */
  handleSubmit?: () => Promise<any>

  loading?: boolean
  values?: Record<string, any>

  /**
   * Generic change handler for all field types
   */
  onChange?: (name: string, value: any) => void

  successMessage?: string
  errorMessage?: string
}

/* --------------------------- Component --------------------------- */

const DialogAction: React.FC<DialogActionProps> = ({
  title,
  description,
  content,
  handleSubmit,
  loading,
  values = {},
  onChange,
  successMessage,
  errorMessage,
}) => {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex justify-center">
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-500 mt-2 mb-4 text-white cursor-pointer hover:bg-blue-600 hover:text-amber-50 shadow-xl border-0 font-bold"
          >
            Novo +
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-hidden flex flex-col">
        <form
          onSubmit={handleInternalSubmit}
          className="flex-1 min-h-0 flex flex-col"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-auto py-2 px-1 space-y-4">
            {content?.map((item) => (
              <div className="grid gap-3" key={String(item.id)}>
                <Label htmlFor={String(item.id)}>
                  {item.label ?? item.name}
                </Label>

                {/* ----------- SELECT ----------- */}
                {item.type === 'select' ? (
                  <Select
                    value={values[item.name] ?? ''}
                    onValueChange={(value) =>
                      onChange?.(item.name, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={item.placeholder} />
                    </SelectTrigger>

                    <SelectContent>
                      {item.options?.map((opt: SelectOption) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                /* ----------- FILE ----------- */
                ) : item.type === 'file' ? (
                  <Input
                    id={String(item.id)}
                    name={item.name}
                    type="file"
                    className="cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files) {
                        onChange?.(item.name, e.target.files)
                      }
                    }}
                  />

                /* ----------- INPUT ----------- */
                ) : (
                  <Input
                    id={String(item.id)}
                    name={item.name}
                    placeholder={
                      item.placeholder ?? item.label ?? item.name
                    }
                    type={item.type}
                    value={values[item.name] ?? ''}
                    onChange={(e) =>
                      onChange?.(item.name, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogAction
