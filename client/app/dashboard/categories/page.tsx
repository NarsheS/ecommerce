'use client'

import React, { useState, useEffect } from 'react'
import { api, setAuthToken } from '@/app/services/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ContentBox from '@/components/content-box'
import handleApiError from '@/app/utils/handleApiError'
import NewItemDialog, { DialogField } from '@/components/newItemDialog'

const title = 'Categorias'
const description = 'Crie uma nova categoria.'

/**
 * Form fields configuration
 * `name` is the API key; `label` is what the user sees
 */
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
  const [loading, setLoading] = useState(false)

  const [formValues, setFormValues] = useState({
    name: '',
  })

  // categories list
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([])
  const [fetching, setFetching] = useState(false)

  /* ---------------------- FORM CHANGE HANDLER ---------------------- */
  const handleChange = (name: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  /* ---------------------- FETCH CATEGORIES ------------------------- */
  const fetchContent = async (endpoint: string) => {
    setFetching(true)
    try {
      const token = localStorage.getItem('token')
      if (token) setAuthToken(token)

      const resp = await api.get(endpoint)
      setCategories(resp.data)
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      handleApiError(error, router, 'Erro ao buscar categorias')
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchContent('/categories')
  }, [])

  /* -------------------------- SUBMIT ------------------------------- */
  const handleSubmit = async () => {
    setLoading(true)

    try {
      await api.post('/categories', {
        name: formValues.name,
      })

      // reset form
      setFormValues({ name: '' })

      // refresh list
      await fetchContent('/categories')
    } catch (error) {
      console.error('Error creating category:', error)
      handleApiError(error, router, 'Erro ao criar categoria')
      throw error // DialogAction will handle toast
    } finally {
      setLoading(false)
    }
  }

  /* -------------------------- DELETE ------------------------------- */
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`)
      toast.success('Categoria deletada com sucesso')
      await fetchContent('/categories')
    } catch (error) {
      console.error('Erro ao deletar categoria:', error)
      handleApiError(error, router, 'Falha ao tentar deletar categoria')
      toast.error('Falha ao tentar deletar categoria')
    }
  }

  /* --------------------------- RENDER ------------------------------ */
  return (
    <>
      <NewItemDialog
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
