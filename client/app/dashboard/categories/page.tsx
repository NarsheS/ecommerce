'use client'

import React, { useState, useEffect } from 'react'
import DialogAction, { DialogField } from '@/components/dialog-action'
import { api, setAuthToken } from '@/app/services/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ContentBox from '@/components/content-box'
import handleApiError from '@/app/utils/handleApiError'
import { Button } from '@/components/ui/button'

const title = 'Categorias'
const description = 'Crie uma nova categoria.'

/* ---------------------- FORM CONFIG ---------------------- */

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

  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  const [formValues, setFormValues] = useState({
    name: '',
  })

  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([])

  /* ---------------------- FORM CHANGE ---------------------- */

  const handleChange = (name: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  /* ---------------------- FETCH ---------------------------- */

  const fetchCategories = async () => {
    setFetching(true)
    try {
      const token = localStorage.getItem('token')
      if (token) setAuthToken(token)

      const resp = await api.get('/categories')
      setCategories(resp.data)
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      handleApiError(error, router, 'Erro ao buscar categorias')
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  /* ---------------------- SUBMIT --------------------------- */

  const handleSubmit = async () => {
    setLoading(true)

    try {
      await api.post('/categories', {
        name: formValues.name,
      })

      setFormValues({ name: '' })
      await fetchCategories()
    } catch (error) {
      console.error('Error creating category:', error)
      handleApiError(error, router, 'Erro ao criar categoria')
      throw error
    } finally {
      setLoading(false)
    }
  }

  /* ---------------------- DELETE --------------------------- */

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`)
      toast.success('Categoria deletada com sucesso')
      await fetchCategories()
    } catch (error) {
      console.error('Erro ao deletar categoria:', error)
      handleApiError(error, router, 'Falha ao tentar deletar categoria')
    }
  }

  /* ---------------------- RENDER --------------------------- */

  return (
    <>
      {/* Create button */}
      <div className="flex justify-center mb-4">
        <Button
          onClick={() => {
            setFormValues({ name: '' })
            setDialogOpen(true)
          }}
          className="bg-blue-500 text-white hover:bg-blue-600 font-bold cursor-pointer"
        >
          Nova categoria +
        </Button>
      </div>

      {/* Dialog */}
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
        successMessage="Categoria criada com sucesso"
        errorMessage="Falha ao criar categoria"
      />

      {/* List */}
      <section>
        {fetching ? (
          <p>Carregando...</p>
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
