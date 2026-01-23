'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { api } from '@/app/services/api'
import { toast } from 'sonner'
import handleApiError from '@/app/utils/handleApiError'
import ContentBox from '@/components/content-box'
import { useRouter } from 'next/navigation'
import NewItemDialog, { DialogField } from '@/components/newItemDialog'


const title = 'Produtos'
const description =
  'Aqui você pode criar produtos e gerenciar suas informações.'

type Category = {
  id: number
  name: string
}

type ProductImage = {
  id: number
  url: string
}

type Product = {
  id: number
  name: string
  description: string
  inStock: number
  price: number
  category: Category | null
  images: ProductImage[]
}

const ProductsPage: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    inStock: '',
    price: '',
    categoryId: '',
  })

  const [images, setImages] = useState<File[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [fetching, setFetching] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  const router = useRouter()

  /* -------------------- FETCH DATA -------------------- */
  const fetchCategories = async () => {
    setFetching(true)
    try {
      const response = await api.get('/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      handleApiError(error, router, 'Erro ao buscar categorias')
    } finally {
      setFetching(false)
    }
  }


  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
      handleApiError(error, router, 'Erro ao buscar produtos')
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  /* -------------------- FORM SETUP -------------------- */
  const formSetup: DialogField[] = useMemo(
    () => [
      { id: 1, name: 'name', type: 'text', label: 'Nome', placeholder: 'Digite o nome do produto' },
      { id: 2, name: 'description', type: 'text', label: 'Descrição', placeholder: 'Digite a descrição do produto' },
      { id: 3, name: 'inStock', type: 'number', label: 'Estoque', placeholder: 'Digite o estoque do produto' },
      { id: 4, name: 'price', type: 'number', label: 'Preço', placeholder: 'Digite o preço do produto' },
      {
        id: 5,
        name: 'categoryId',
        type: 'select',
        label: 'Categoria',
        placeholder: 'Selecione uma categoria',
        options: categories.map(cat => ({
          value: String(cat.id),
          label: cat.name,
        })),
      },
      { id: 6, name: 'images', label: 'Imagens', type: 'file' },
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
      const normalizedPrice = Number(
        String(formValues.price).replace(',', '.')
      )

      if (isNaN(normalizedPrice) || normalizedPrice < 0) {
        toast.error('Preço inválido')
        return
      }

      const productResponse = await api.post('/products', {
        name: formValues.name,
        description: formValues.description,
        inStock: Number(formValues.inStock || 0),
        price: normalizedPrice,
        categoryId: Number(formValues.categoryId),
      })

      const productId = productResponse.data.id

      if (images.length > 0) {
        const formData = new FormData()
        images.forEach(image => formData.append('images', image))

        await api.post(
          `/products/${productId}/images`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
      }

      setFormValues({
        name: '',
        description: '',
        inStock: '',
        price: '',
        categoryId: '',
      })
      setImages([])

      await fetchProducts()
    } catch (error: any) {
      console.error('Backend error:', error.response?.data)
      handleApiError(error, router, 'Erro ao criar produto')
    } finally {
      setLoading(false)
    }
  }


  /* -------------------- DELETE -------------------- */
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/products/${id}`)
      await fetchProducts()
    } catch (error) {
      console.error('Erro ao deletar produto:', error)
      handleApiError(error, router, 'Falha ao tentar deletar produto')
    }
  }

  /* -------------------- RENDER -------------------- */
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
        successMessage="Produto criado com sucesso"
        errorMessage="Erro ao criar produto"
      />

      <section>
          {fetching ? (
            <p>Carregando...</p>
          ) : products.length === 0 ? (
            <p>Nenhum produto encontrado.</p>
          ) : (
            <div className="space-y-2">
              {products.map(prod => (
                <ContentBox
                  key={prod.id}
                  id={prod.id}
                  text={prod.name}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
    </>
  )
}

export default ProductsPage
