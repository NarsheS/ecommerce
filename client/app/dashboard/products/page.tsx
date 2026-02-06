'use client'

import React, { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import DialogAction, { DialogField } from '@/components/dialog-action'
import ConfirmDialog from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import LoadingCircle from '@/components/loading-circle'
import { ProductCard } from '@/components/product-card'

import { productService } from '@/app/services/product.service'
import handleApiError from '@/app/utils/handleApiError'

import type { Product } from '@/app/types/product'
import { useProducts } from '@/hooks/useProduct'
import { useCategories } from '@/hooks/useCategories'

const ProductsPage: React.FC = () => {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { products, loading: fetching, refresh } = useProducts()
  const { categories } = useCategories()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

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

  const formSetup: DialogField[] = useMemo(() => [
    { id: 1, name: 'name', type: 'text', label: 'Nome' },
    { id: 2, name: 'description', type: 'text', label: 'Descrição' },
    { id: 3, name: 'inStock', type: 'number', label: 'Estoque' },
    { id: 4, name: 'price', type: 'number', label: 'Preço' },
    {
      id: 5,
      name: 'categoryId',
      type: 'select',
      label: 'Categoria',
      options: categories.map(cat => ({
        value: String(cat.id),
        label: cat.name,
      })),
    },
  ], [categories])

  const handleChange = (name: string, value: any) =>
    setFormValues(prev => ({ ...prev, [name]: value }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        name: formValues.name,
        description: formValues.description,
        inStock: Number(formValues.inStock || 0),
        price: Number(String(formValues.price).replace(',', '.')),
        categoryId: Number(formValues.categoryId),
      }

      if (editingProduct) {
        await productService.update(editingProduct.id, payload)
      } else {
        await productService.create(payload)
      }

      setDialogOpen(false)
      setEditingProduct(null)
      setFormValues({ name: '', description: '', inStock: '', price: '', categoryId: '' })
      await refresh()
    } catch (error) {
      handleApiError(error, router, 'Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return
    setDeleteLoading(true)
    try {
      await productService.remove(productToDelete)
      toast.info('Produto excluído com sucesso')
      await refresh()
    } catch (error) {
      handleApiError(error, router, 'Erro ao deletar produto')
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const openImageManager = async (id: number) => {
    try {
      const product = await productService.getById(id)
      setSelectedProduct(product)
      setImageDialogOpen(true)
    } catch (error) {
      handleApiError(error, router, 'Erro ao buscar produto')
    }
  }

  const uploadImages = async () => {
    if (!selectedProduct || selectedImages.length === 0) return
    setImagesLoading(true)
    try {
      await productService.addImages(selectedProduct.id, selectedImages)
      const updated = await productService.getById(selectedProduct.id)
      setSelectedProduct(updated)
      setSelectedImages([])
      await refresh()
      toast.success('Imagens adicionadas')
    } catch (error) {
      handleApiError(error, router, 'Erro ao enviar imagens')
    } finally {
      setImagesLoading(false)
    }
  }


  return (
    <>
      <div className="flex justify-center mb-4">
        <Button
          className="cursor-pointer"
          onClick={() => {
            setEditingProduct(null)
            setFormValues({ name: '', description: '', inStock: '', price: '', categoryId: '' })
            setDialogOpen(true)
          }}
        >
          Novo produto +
        </Button>
      </div>

      <DialogAction
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        description="Gerencie os produtos da sua loja"
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
              dashboard
              key={prod.id}
              product={prod}
              onEdit={() => {
                setEditingProduct(prod)
                setFormValues({
                  name: prod.name,
                  description: prod.description ?? '',
                  inStock: String(prod.inStock),
                  price: String(prod.price),
                  categoryId: prod.category?.id ? String(prod.category.id) : '',
                })
                setDialogOpen(true)
              }}
              onDelete={(id) => {
                setProductToDelete(id)
                setDeleteDialogOpen(true)
              }}
              onImages={openImageManager}
            />
          ))
        )}
      </section>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Excluir produto"
        description="Tem certeza que deseja excluir este produto?"
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        loading={deleteLoading}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteProduct}
      />

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

            <Button
              className="w-full cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              Selecionar imagens
            </Button>

            {/* ✅ LISTA DE NOMES DOS ARQUIVOS */}
            {selectedImages.length > 0 && (
              <div className="text-sm bg-gray-100 p-2 rounded max-h-24 overflow-auto">
                <p className="font-medium mb-1">Arquivos selecionados:</p>
                <ul className="list-disc list-inside space-y-1">
                  {selectedImages.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedImages.length > 0 && (
              <Button
                className="w-full cursor-pointer"
                onClick={uploadImages}
                disabled={imagesLoading}
              >
                {imagesLoading ? 'Enviando...' : 'Adicionar imagens'}
              </Button>
            )}

            <div className="grid grid-cols-3 gap-2">
              {(selectedProduct.images ?? []).map(img => (
                <div key={img.id} className="relative">
                  <img src={img.url} className="w-full h-24 object-cover rounded" />
                  <button
                    className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                    onClick={async () => {
                      await productService.removeImage(selectedProduct.id, img.id)
                      setSelectedProduct(prev =>
                        prev ? { ...prev, images: (prev.images ?? []).filter(i => i.id !== img.id) } : prev
                      )
                      await refresh()
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {(selectedProduct.images ?? []).length > 0 && (
              <Button
                variant="destructive"
                className="w-full cursor-pointer"
                onClick={async () => {
                  await productService.removeAllImages(selectedProduct.id)
                  setSelectedProduct(prev => (prev ? { ...prev, images: [] } : prev))
                  await refresh()
                }}
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
