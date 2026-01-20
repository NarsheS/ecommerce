'use client'

import React, { useState, useEffect } from 'react'
import DialogAction from '@/components/dialog-action'
import { api, setAuthToken } from '@/app/services/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ContentBox from '@/components/content-box'

const title = 'Categorias'
const description = 'Crie uma nova categoria.'

/**
 * Form fields configuration
 * `name` is the API key; `label` is what the user sees
 */
const formSetup = [{ id: 1, name: 'name', label: 'Nome', placeholder: 'Digite o nome da categoria' , type: 'text' }]

const CategoriesPage: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formValues, setFormValues] = useState({
    name: '',
  })

  // new: categories state + fetching indicator
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  const [fetching, setFetching] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  // fetch categories from /categories
  const fetchContent = async (endpoint: string) => {
    setFetching(true)
    try {
      // If you store a token in localStorage/sessionStorage, ensure it's set:
      const token = localStorage.getItem('token')
      if (token) setAuthToken(token)

      const resp = await api.get(endpoint)
      setCategories(resp.data)
    } catch (error: any) {
      // better diagnostics
      console.error('Error fetching categories:', error)
      if (error?.response) {
        console.error('status:', error.response.status)
        console.error('data:', error.response.data)
        // 401 handling
        if (error.response.status === 401) {
          // clear stored auth and redirect to login
          setAuthToken(null)
          localStorage.removeItem('token')
          toast.error('Sessão expirada. Faça login novamente.')
          router.push('/login')
        } else {
          toast.error('Falha ao carregar categorias')
        }
      } else {
        toast.error('Erro de rede ao carregar categorias')
      }
    } finally {
      setFetching(false)
    }
  }

  // run once on mount
  useEffect(() => {
    fetchContent('/categories')
  }, [])

  /**
   * NOTE: no event param here. DialogAction will call this and handle default prevention,
   * toast, and auto-close. This function must throw on error so DialogAction can show an error toast.
   */
  const handleSubmit = async () => {
    setLoading(true)

    try {
      await api.post('/categories', {
        name: formValues.name,
      })

      // success: reset form
      setFormValues({ name: '' })

      // refresh list
      await fetchContent('/categories')
    } catch (error) {
      console.error('Error creating category:', error)
      // re-throw so DialogAction can catch and show toast
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`)
      await fetchContent('/categories')
    } catch (error) {
      console.error('Erro ao deletar categoria:', error)
      throw error
    }
  }

  return (
    <>
      <DialogAction
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

        {/* criar um component para lista de categorias */}
        {fetching ? (
          <p>Carregando...</p>
        ) : categories.length === 0 ? (
          <p>Nenhuma categoria encontrada.</p>
        ) : (
          <div className="space-y-2">
            {categories.map(cat => (
              <ContentBox id={cat.id} text={cat.name} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default CategoriesPage