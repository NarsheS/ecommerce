'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import DialogAction, { DialogField } from '@/components/dialog-action'
import ContentBox from '@/components/content-box'
import { Button } from '@/components/ui/button'
import LoadingCircle from '@/components/loading-circle'


import { categoryService } from '@/app/services/category.service'
import handleApiError from '@/app/utils/handleApiError'
import { useCategories } from '@/hooks/useCategories'

const title = 'Categorias'
const description = 'Crie uma nova categoria.'

const formSetup: DialogField[] = [
  {
    id: 1,
    name: 'name',
    label: 'Nome',
    placeholder: 'Digite o nome da categoria',
    type: 'text',
  },
]

const CategoriesPage: React.FC = () => {
  const router = useRouter()
  const { categories, loading: fetching, refresh } = useCategories()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState({ name: '' })

  const handleChange = (name: string, value: any) => {
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await categoryService.create(formValues.name)

      setFormValues({ name: '' })
      setDialogOpen(false)
      toast.success('Categoria criada com sucesso')
      await refresh()
    } catch (error) {
      handleApiError(error, router, 'Erro ao criar categoria')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await categoryService.remove(id)
      toast.success('Categoria deletada com sucesso')
      await refresh()
    } catch (error) {
      handleApiError(error, router, 'Falha ao tentar deletar categoria')
    }
  }

  return (
    <>
      <div className="flex justify-center mb-4">
        <Button
          onClick={() => {
            setFormValues({ name: '' })
            setDialogOpen(true)
          }}
        >
          Nova categoria +
        </Button>
      </div>

      <DialogAction
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={title}
        description={description}
        content={formSetup}
        handleSubmit={handleSubmit}
        loading={loading}
        values={formValues}
        onChange={handleChange}
      />

      <section>
        {fetching ? (
          <LoadingCircle />
        ) : categories.length === 0 ? (
          <p>Nenhuma categoria encontrada.</p>
        ) : (
          <div className="space-y-2">
            {categories.map(cat => (
              <ContentBox
                key={cat.id}
                id={cat.id}
                text={cat.name}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default CategoriesPage
