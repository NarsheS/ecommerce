'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { api } from '@/app/services/api'
import { toast } from 'sonner'
import handleApiError from '@/app/utils/handleApiError'
import ContentBox from '@/components/content-box'
import { useRouter } from 'next/navigation'
import DialogAction, { DialogField } from '@/components/dialog-action'
import { Button } from '@/components/ui/button'
import LoadingCircle from '@/components/loading-circle'

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

  /* -------------------- Images State -------------------- */

  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagesLoading, setImagesLoading] = useState(false)

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
      handleApiError(error, router, 'Erro ao buscar categorias')
    }
  }

  const fetchProducts = async () => {
    setFetching(true)
    try {
      const response = await api.get('/products')
      setProducts(response.data)
    } catch (error) {
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

  /* -------------------- FORM -------------------- */

  const handleChange = (name: string, value: any) => {
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const price = Number(String(formValues.price).replace(',', '.'))
      if (isNaN(price) || price < 0) {
        toast.error('Preço inválido')
        return
      }

      const payload = {
        name: formValues.name,
        description: formValues.description,
        inStock: Number(formValues.inStock || 0),
        price,
        categoryId: Number(formValues.categoryId),
      }

      editingProduct
        ? await api.put(`/products/${editingProduct.id}`, payload)
        : await api.post('/products', payload)

      setDialogOpen(false)
      setEditingProduct(null)
      setFormValues({
        name: '',
        description: '',
        inStock: '',
        price: '',
        categoryId: '',
      })

      await fetchProducts()
    } catch (error) {
      handleApiError(error, router, 'Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  /* -------------------- PRODUCTS -------------------- */

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/products/${id}`)
      await fetchProducts()
    } catch (error) {
      handleApiError(error, router, 'Erro ao deletar produto')
    }
  }

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

  /* -------------------- IMAGES -------------------- */

  const handleImages = (id: number) => {
    const product = products.find(p => p.id === id)
    if (!product) return
    setSelectedProduct(product)
    setImageDialogOpen(true)
  }

  const handleAddImages = async () => {
    if (!selectedProduct || selectedImages.length === 0) return

    setImagesLoading(true)

    try {
      const formData = new FormData()
      selectedImages.forEach(file => formData.append('images', file))

      await api.post(
        `/products/${selectedProduct.id}/images`,
        formData
      )

      toast.success('Imagens adicionadas')

      setSelectedImages([])
      await fetchProducts()

      // Atualiza produto selecionado
      const updated = products.find(p => p.id === selectedProduct.id)
      if (updated) setSelectedProduct(updated)
    } catch (error) {
      handleApiError(error, router, 'Erro ao adicionar imagens')
    } finally {
      setImagesLoading(false)
    }
  }

  const handleRemoveImage = async (imageId: number) => {
    if (!selectedProduct) return

    try {
      await api.delete(
        `/products/${selectedProduct.id}/images/${imageId}`
      )

      setSelectedProduct(prev =>
        prev
          ? { ...prev, images: prev.images.filter(i => i.id !== imageId) }
          : prev
      )

      toast.success('Imagem removida')
    } catch (error) {
      handleApiError(error, router, 'Erro ao remover imagem')
    }
  }

  /* -------------------- RENDER -------------------- */

  return (
    <>
      <div className="flex justify-center mb-4">
        <Button
          className="cursor-pointer"
          onClick={() => setDialogOpen(true)}
        >
          Novo produto +
        </Button>
      </div>

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
      />

      <section>
        {fetching ? (
          <LoadingCircle />
        ) : (
          products.map(prod => (
            <ContentBox
              key={prod.id}
              id={prod.id}
              text={prod.name}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onImages={handleImages}
            />
          ))
        )}
      </section>

      {/* Image Manager */}
      {imageDialogOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
            <h2 className="font-bold">
              Imagens — {selectedProduct.name}
            </h2>

            <input
              type="file"
              accept="image/*"
              multiple
              className="cursor-pointer"
              onChange={e =>
                setSelectedImages(
                  e.target.files ? Array.from(e.target.files) : []
                )
              }
            />

            <Button
              onClick={handleAddImages}
              disabled={imagesLoading}
              className="w-full cursor-pointer"
            >
              {imagesLoading ? 'Enviando...' : 'Adicionar imagens'}
            </Button>

            <div className="grid grid-cols-3 gap-2">
              {selectedProduct.images.map(img => (
                <div key={img.id} className="relative">
                  <img
                    src={img.url}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded cursor-pointer"
                    onClick={() => handleRemoveImage(img.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => setImageDialogOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductsPage
