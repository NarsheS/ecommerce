'use client'

import React, { useEffect, useMemo, useState } from 'react'
import DialogAction, { DialogField } from '@/components/dialog-action'
import { api } from '@/app/services/api'

const title = 'Products'
const description =
  'Here you can create products and manage their information.'

const ProductsPage: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    stock: '',
    price: '',
    categoryId: '',
  })

  const [images, setImages] = useState<File[]>([])
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([])

  /* -------------------- FETCH CATEGORIES -------------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories')
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  /* -------------------- FORM SETUP -------------------- */
  const formSetup: DialogField[] = useMemo(
    () => [
      { id: 1, name: 'name', type: 'text' },
      { id: 2, name: 'description', type: 'text' },
      { id: 3, name: 'stock', type: 'number' },
      { id: 4, name: 'price', type: 'number' },
      {
        id: 5,
        name: 'categoryId',
        type: 'select',
        placeholder: 'Selecione uma categoria',
        options: categories.map(cat => ({
          value: String(cat.id),
          label: cat.name,
        })),
      },
      { id: 6, name: 'images', type: 'file' },
    ],
    [categories]
  )

  /* -------------------- CHANGE HANDLER -------------------- */
  const handleChange = (name: string, value: any) => {
    if (name === 'images') {
      setImages(Array.from(value as FileList))
      return
    }

    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async () => {
    setLoading(true)

    try {
      // 1️⃣ Create product
      const productResponse = await api.post('/products', {
        name: formValues.name,
        description: formValues.description,
        stock: Number(formValues.stock),
        price: Number(formValues.price),
        category: Number(formValues.categoryId), // matches your TypeORM entity
      })

      const productId = productResponse.data.id

      // 2️⃣ Upload images
      if (images.length > 0) {
        const formData = new FormData()
        images.forEach(image => formData.append('images', image))

        await api.post(`/products/${productId}/images`, formData)
      }

      // reset form
      setFormValues({
        name: '',
        description: '',
        stock: '',
        price: '',
        categoryId: '',
      })
      setImages([])
    } catch (error) {
      console.error('Error creating product:', error)
      throw error // lets DialogAction show error toast
    } finally {
      setLoading(false)
    }
  }

  /* -------------------- RENDER -------------------- */
  return (
    <DialogAction
      title={title}
      description={description}
      content={formSetup}
      handleSubmit={handleSubmit}
      loading={loading}
      values={formValues}
      onChange={handleChange}
      successMessage="Produto criado com sucesso"
      errorMessage="Erro ao criar produto"
    />
  )
}

export default ProductsPage
