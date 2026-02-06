'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  type?: 'text' | 'number' | 'select'
  inputType?: string 
  placeholder?: string
  options?: SelectOption[]
  disabled?: boolean
}

type DialogActionProps = {
  open: boolean
  onOpenChange: (open: boolean) => void

  title: string
  description?: React.ReactNode
  content?: DialogField[]

  handleSubmit: () => Promise<void>

  loading?: boolean
  values?: Record<string, any>
  onChange?: (name: string, value: any) => void

  successMessage?: string
  errorMessage?: string
}

/* --------------------------- Component --------------------------- */

const DialogAction: React.FC<DialogActionProps> = ({
  open,
  onOpenChange,
  title,
  description,
  content,
  handleSubmit,
  loading = false,
  values = {},
  onChange,
  successMessage,
  errorMessage,
}) => {
  const handleInternalSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    try {
      await handleSubmit()
      toast.success(successMessage ?? `${title} salvo com sucesso`)
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast.error(errorMessage ?? 'Erro ao salvar')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25 max-h-[80vh] overflow-hidden flex flex-col">
        <form
          onSubmit={handleInternalSubmit}
          className="flex-1 min-h-0 flex flex-col"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-auto py-2 px-1 space-y-4">
            {content?.map(field => (
              <div className="grid gap-3" key={String(field.id)}>
                <Label>{field.label ?? field.name}</Label>

                {field.type === 'select' ? (
                  <Select
                    value={values[field.name] ?? ''}
                    onValueChange={value => onChange?.(field.name, value)}
                    disabled={field.disabled}
                  >
                    <SelectTrigger disabled={field.disabled}>
                      <SelectValue
                        placeholder={
                          field.placeholder ??
                          `Selecione ${field.label?.toLowerCase() ?? field.name}`
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {field.options?.map(opt => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={field.inputType ?? field.type ?? 'text'}
                    placeholder={
                      field.placeholder ??
                      field.label ??
                      field.name
                    }
                    value={values[field.name] ?? ''}
                    onChange={e =>
                      onChange?.(field.name, e.target.value)
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
