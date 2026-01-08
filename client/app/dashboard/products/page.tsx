'use client'
import React, { useState } from 'react'
import DialogAction from '@/components/dialog-action'
import { api } from '@/app/services/api'

const description = "Aqui estão os produtos disponíveis em nosso catálogo. Você pode visualizar detalhes, preços e outras informações relevantes sobre cada produto listado abaixo."
const title = "Lista de Produtos"

const formSetup = [
  { id: 1, name: 'nome', type: 'text' },
  { id: 2, name: 'descricao', type: 'text' },
  { id: 3, name: 'estoque', type: 'number' },
  { id: 4, name: 'preco', type: 'number' },
  { id: 5, name: 'categoria', type: 'text' },
  { id: 6, name: 'imagens', type: 'file' },
]

const Products = () => {
  const [loading, setLoading] = useState(false)

  // controlled state for the form values
  const [formValues, setFormValues] = useState<Record<string, any>>({
    name: '',
    description: '',
    inStock: '',
    price: '',
    category: '',
    images: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, files } = e.target as HTMLInputElement
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'file' ? (files && files[0]) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Build FormData from controlled state so files are included
      const fd = new FormData()
      Object.keys(formValues).forEach((key) => {
        const val = formValues[key]
        if (val instanceof File) {
          fd.append(key, val)
        } else if (val !== null && val !== undefined) {
          fd.append(key, String(val))
        }
      })

      // axios instance usage: pass FormData directly
      const res = await api.post('/products', fd) // don't set Content-Type manually

      console.log('Created product', res.data)
      // optionally reset form or show success
    } catch (err) {
      console.error('Submit error', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogAction
      title={title}
      description={description}
      content={formSetup}
      handleSubmit={handleSubmit}
      loading={loading}
      values={formValues}
      onChange={handleChange}
    />
  )
}

export default Products