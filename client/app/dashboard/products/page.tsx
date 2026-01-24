'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { api } from '@/app/services/api'
import { toast } from 'sonner'
import handleApiError from '@/app/utils/handleApiError'
import ContentBox from '@/components/content-box'
import { useRouter } from 'next/navigation'
import DialogAction, { DialogField } from '@/components/dialog-action'
import { Button } from '@/components/ui/button'

const title = 'Produtos'
const description =
  'Aqui você pode criar produtos e gerenciar suas informações.'

/* -------------------- Types -------------------- */

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
  const router = useRouter()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    inStock: '',
    price: '',
    categoryId: '',
  })

  /* -------------------- FETCH DATA -------------------- */

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      handleApiError(error, router, 'Erro ao buscar categorias')
    }
  }

  const fetchProducts = async () => {
    setFetching(true)
    try {
      const response = await api.get('/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
      handleApiError(error, router, 'Erro ao buscar produtos')
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  /* -------------------- FORM SETUP -------------------- */

  const formSetup: DialogField[] = useMemo(
    () => [
      { id: 1, name: 'name', type: 'text', label: 'Nome' },
      { id: 2, name: 'description', type: 'text', label: 'Descrição' },
      { id: 3, name: 'inStock', type: 'number', label: 'Estoque' },
      { id: 4, name: 'price', type: 'number', label: 'Preço' },
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
    ],
    [categories]
  )

  /* -------------------- CHANGE HANDLER -------------------- */

  const handleChange = (name: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  /* -------------------- SUBMIT (CREATE & EDIT) -------------------- */

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

      const payload = {
        name: formValues.name,
        description: formValues.description,
        inStock: Number(formValues.inStock || 0),
        price: normalizedPrice,
        categoryId: Number(formValues.categoryId),
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload)
      } else {
        await api.post('/products', payload)
      }

      setEditingProduct(null)
      setFormValues({
        name: '',
        description: '',
        inStock: '',
        price: '',
        categoryId: '',
      })

      setDialogOpen(false)
      await fetchProducts()
    } catch (error) {
      handleApiError(error, router, 'Erro ao salvar produto')
      throw error
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

  /* -------------------- EDIT -------------------- */

  const handleEdit = (id: number) => {
    const product = products.find(p => p.id === id)
    if (!product) return

    setEditingProduct(product)
    setFormValues({
      name: product.name,
      description: product.description,
      inStock: String(product.inStock),
      price: String(product.price),
      categoryId: product.category?.id
        ? String(product.category.id)
        : '',
    })

    setDialogOpen(true)
  }

  /* -------------------- IMAGES (PLACEHOLDER) -------------------- */

  const handleImages = (id: number) => {
    console.log('Open image manager for product:', id)
    toast.info('Gerenciamento de imagens em breve 👀')
  }

  /* -------------------- RENDER -------------------- */

  return (
    <>
      {/* Create button */}
      <div className="flex justify-center mb-4">
        <Button
          onClick={() => {
            setEditingProduct(null)
            setFormValues({
              name: '',
              description: '',
              inStock: '',
              price: '',
              categoryId: '',
            })
            setDialogOpen(true)
          }}
          className="bg-blue-500 text-white hover:bg-blue-600 font-bold cursor-pointer"
        >
          Novo produto +
        </Button>
      </div>

      {/* Dialog */}
      <DialogAction
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingProduct ? 'Editar produto' : title}
        description={description}
        content={formSetup}
        handleSubmit={handleSubmit}
        loading={loading}
        values={formValues}
        onChange={handleChange}
        successMessage={
          editingProduct
            ? 'Produto atualizado com sucesso'
            : 'Produto criado com sucesso'
        }
      />

      {/* List */}
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
                onEdit={handleEdit}
                onDelete={handleDelete}
                onImages={handleImages}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default ProductsPage
