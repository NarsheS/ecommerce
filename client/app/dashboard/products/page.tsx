'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '@/app/services/api'
import { toast } from 'sonner'
import handleApiError from '@/app/utils/handleApiError'
import ContentBox from '@/components/content-box'
import { useRouter } from 'next/navigation'
import DialogAction, { DialogField } from '@/components/dialog-action'
import { Button } from '@/components/ui/button'
import LoadingCircle from '@/components/loading-circle'
import { ProductCard } from '@/components/product-card'
import ConfirmDialog from '@/components/confirm-dialog' // ✅ NOVO

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
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  /* -------- DELETE CONFIRMATION -------- */

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

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

  const fetchProductById = async (productId: number) => {
    const response = await api.get(`/products/${productId}`)
    return response.data as Product
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

  /* -------------------- FORM HANDLERS -------------------- */

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

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload)
      } else {
        await api.post('/products', payload)
      }

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

  /* -------------------- DELETE PRODUCT -------------------- */

  const handleDelete = (id: number) => {
    setProductToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return

    setDeleteLoading(true)
    try {
      await api.delete(`/products/${productToDelete}`)
      toast.success('Produto excluído com sucesso')
      await fetchProducts()
    } catch (error) {
      handleApiError(error, router, 'Erro ao deletar produto')
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
      setProductToDelete(null)
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
      categoryId: product.category?.id ? String(product.category.id) : '',
    })

    setDialogOpen(true)
  }

  /* -------------------- IMAGES (SEM CONFIRMAÇÃO) -------------------- */

  const handleImages = async (id: number) => {
    try {
      const product = await fetchProductById(id)
      setSelectedProduct(product)
      setImageDialogOpen(true)
    } catch (error) {
      handleApiError(error, router, 'Erro ao buscar imagens do produto')
    }
  }

  const handleAddImages = async () => {
    if (!selectedProduct || selectedImages.length === 0) return

    setImagesLoading(true)
    try {
      const formData = new FormData()
      selectedImages.forEach(file => formData.append('images', file))

      await api.post(`/products/${selectedProduct.id}/images`, formData)

      const updated = await fetchProductById(selectedProduct.id)
      setSelectedProduct(updated)
      setSelectedImages([])
      await fetchProducts()
    } catch (error) {
      handleApiError(error, router, 'Erro ao adicionar imagens')
    } finally {
      setImagesLoading(false)
    }
  }

  const handleRemoveImage = async (imageId: number) => {
    if (!selectedProduct) return
    try {
      await api.delete(`/products/${selectedProduct.id}/images/${imageId}`)
      setSelectedProduct(prev =>
        prev ? { ...prev, images: prev.images.filter(i => i.id !== imageId) } : prev
      )
      await fetchProducts()
    } catch (error) {
      handleApiError(error, router, 'Erro ao remover imagem')
    }
  }

  const handleRemoveAllImages = async () => {
    if (!selectedProduct) return
    try {
      await api.delete(`/products/${selectedProduct.id}/images`)
      setSelectedProduct(prev => (prev ? { ...prev, images: [] } : prev))
      await fetchProducts()
    } catch (error) {
      handleApiError(error, router, 'Erro ao remover imagens')
    }
  }

  /* -------------------- RENDER -------------------- */

  return (
    <>
      <div className="flex justify-center mb-4">
        <Button className="cursor-pointer" onClick={() => setDialogOpen(true)}>
          Novo produto +
        </Button>
      </div>

      <DialogAction
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingProduct ? 'Atualização' : title}
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
            <ProductCard
              dashboard={true}
              key={prod.id}
              product={prod}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onImages={handleImages}
            />
          ))
        )}
      </section>

      {/* ✅ CONFIRM DIALOG REUTILIZÁVEL */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Excluir produto"
        description="Tem certeza que deseja excluir este produto? Essa ação não pode ser desfeita."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        loading={deleteLoading}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setProductToDelete(null)
        }}
        onConfirm={confirmDeleteProduct}
      />

      {/* Image Manager continua igual */}
      {imageDialogOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
            <h2 className="font-bold">Imagens — {selectedProduct.name}</h2>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e =>
                setSelectedImages(e.target.files ? Array.from(e.target.files) : [])
              }
            />
            <Button className="w-full cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              Selecionar imagens
            </Button>

            {selectedImages.length > 0 && (
              <p className="text-sm text-gray-600">
                {selectedImages.length} imagem(ns) selecionada(s)
              </p>
            )}

            <Button
              onClick={handleAddImages}
              disabled={imagesLoading || selectedImages.length === 0}
              className="w-full cursor-pointer"
            >
              {imagesLoading ? 'Enviando...' : 'Adicionar imagens'}
            </Button>

            <div className="grid grid-cols-3 gap-2">
              {selectedProduct.images.map(img => (
                <div key={img.id} className="relative">
                  <img src={img.url} className="w-full h-24 object-cover rounded" />
                  <button
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded cursor-pointer"
                    onClick={() => handleRemoveImage(img.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {selectedProduct.images.length > 0 && (
              <Button
                variant="destructive"
                className="w-full cursor-pointer"
                onClick={handleRemoveAllImages}
              >
                Remover todas as imagens
              </Button>
            )}

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
