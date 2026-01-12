'use client'

import React, { useState } from 'react'
import DialogAction from '@/components/dialog-action'
import { api } from '@/app/services/api'

const title = 'Products'
const description =
  'Here you can create products and manage their information.'

/**
 * Form fields configuration
 * `name` MUST match the API field name
 */
const formSetup = [
  { id: 1, name: 'name', type: 'text' },
  { id: 2, name: 'description', type: 'text' },
  { id: 3, name: 'stock', type: 'number' },
  { id: 4, name: 'price', type: 'number' },
  { id: 5, name: 'category', type: 'text' },
  { id: 6, name: 'images', type: 'file' },
]

const ProductsPage = () => {
  const [loading, setLoading] = useState(false)

  // Product data (JSON)
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    stock: '',
    price: '',
    category: '',
  })

  // Images are handled separately
  const [images, setImages] = useState<File[]>([])

  /**
   * Handles both text/number inputs and file inputs
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, files } = e.target

    if (type === 'file' && files) {
      setImages(Array.from(files))
      return
    }

    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  /**
   * Submit handler:
   * 1. Create product
   * 2. Upload images to /products/:id/images
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1️⃣ Create product (JSON)
      const productResponse = await api.post('/products', {
        name: formValues.name,
        description: formValues.description,
        stock: Number(formValues.stock),
        price: Number(formValues.price),
        category: formValues.category,
      })

      const productId = productResponse.data.id

      // 2️⃣ Upload images (multipart/form-data)
      if (images.length > 0) {
        const formData = new FormData()

        images.forEach(image => {
          formData.append('images', image)
        })

        await api.post(
          `/products/${productId}/images`,
          formData
        )
      }

      console.log('Product created successfully')

      // Optional: reset form
      setFormValues({
        name: '',
        description: '',
        stock: '',
        price: '',
        category: '',
      })
      setImages([])
    } catch (error) {
      console.error('Error creating product:', error)
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

export default ProductsPage
