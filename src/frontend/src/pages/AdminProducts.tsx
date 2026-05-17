import AdminGuard from "@/components/AdminGuard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Category,
  StockStatus,
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useSeedProducts,
  useUpdateProduct,
} from "@/hooks/useQueries";
import type { ExternalBlob, Product } from "@/types";
import { formatINR } from "@/utils/format";
import {
  ImagePlus,
  Loader2,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  { value: Category.Clothing, label: "Clothing" },
  { value: Category.Diapers, label: "Diapers" },
  { value: Category.Gear, label: "Gear" },
  { value: Category.Toys, label: "Toys" },
];

const STOCK_STATUSES = [
  { value: StockStatus.InStock, label: "In Stock" },
  { value: StockStatus.OutOfStock, label: "Out of Stock" },
];

interface ProductFormValues {
  name: string;
  description: string;
  priceRupees: string;
  category: Category;
  stockStatus: StockStatus;
  imageFile: File | null;
  existingBlob: ExternalBlob | null;
}

const EMPTY_FORM: ProductFormValues = {
  name: "",
  description: "",
  priceRupees: "",
  category: Category.Clothing,
  stockStatus: StockStatus.InStock,
  imageFile: null,
  existingBlob: null,
};

function stockBadge(status: StockStatus) {
  return status === StockStatus.InStock ? (
    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs">
      In Stock
    </Badge>
  ) : (
    <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-0 text-xs">
      Out of Stock
    </Badge>
  );
}

function ProductFormDialog({
  open,
  onClose,
  initial,
  editId,
}: {
  open: boolean;
  onClose: () => void;
  initial?: ProductFormValues;
  editId?: bigint;
}) {
  const [form, setForm] = useState<ProductFormValues>(initial ?? EMPTY_FORM);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initial?.existingBlob?.getDirectURL() ?? null,
  );
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const isEdit = !!editId;
  const isPending = createMutation.isPending || updateMutation.isPending;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setForm((f) => ({ ...f, imageFile: file }));
    if (file) setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const priceRupees = Number.parseFloat(form.priceRupees);
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      Number.isNaN(priceRupees) ||
      priceRupees <= 0
    ) {
      toast.error("Please fill all required fields correctly.");
      return;
    }
    try {
      if (isEdit && editId !== undefined) {
        await updateMutation.mutateAsync({
          id: editId,
          name: form.name,
          description: form.description,
          priceRupees,
          category: form.category,
          imageFile: form.imageFile,
          existingBlob: form.existingBlob,
          stockStatus: form.stockStatus,
        });
        toast.success("Product updated successfully!");
      } else {
        await createMutation.mutateAsync({
          name: form.name,
          description: form.description,
          priceRupees,
          category: form.category,
          imageFile: form.imageFile,
          stockStatus: form.stockStatus,
        });
        toast.success("Product added successfully!");
      }
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg w-full max-h-[90vh] overflow-y-auto"
        data-ocid="product_form.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-lg">
            {isEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Image upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <label
              htmlFor="product-image"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-input rounded-xl cursor-pointer hover:bg-muted/40 transition-smooth overflow-hidden relative"
              data-ocid="product_form.dropzone"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImagePlus size={28} />
                  <span className="text-sm">Click to upload image</span>
                </div>
              )}
              <input
                id="product-image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
                data-ocid="product_form.upload_button"
              />
            </label>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="product-name">Product Name *</Label>
            <Input
              id="product-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Organic Cotton Onesie"
              required
              data-ocid="product_form.input"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="product-desc">Description *</Label>
            <Textarea
              id="product-desc"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Describe the product…"
              rows={3}
              required
              data-ocid="product_form.textarea"
            />
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <Label htmlFor="product-price">Price (₹) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
                ₹
              </span>
              <Input
                id="product-price"
                type="number"
                min="1"
                step="1"
                value={form.priceRupees}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priceRupees: e.target.value }))
                }
                placeholder="299"
                className="pl-7"
                required
                data-ocid="product_form.price_input"
              />
            </div>
          </div>

          {/* Category + Stock row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, category: v as Category }))
                }
              >
                <SelectTrigger data-ocid="product_form.category_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Stock Status *</Label>
              <Select
                value={form.stockStatus}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, stockStatus: v as StockStatus }))
                }
              >
                <SelectTrigger data-ocid="product_form.stock_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              data-ocid="product_form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isPending}
              data-ocid="product_form.submit_button"
            >
              {isPending && <Loader2 size={16} className="animate-spin mr-2" />}
              {isEdit ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminProductsContent() {
  const { data: products = [], isLoading } = useProducts();
  const deleteMutation = useDeleteProduct();
  const seedMutation = useSeedProducts();

  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);

  function openAdd() {
    setEditProduct(null);
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setEditProduct(p);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditProduct(null);
  }

  async function handleDelete() {
    if (deleteTarget == null) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget);
      toast.success("Product deleted.");
    } catch {
      toast.error("Could not delete product.");
    } finally {
      setDeleteTarget(null);
    }
  }

  async function handleSeed() {
    try {
      await seedMutation.mutateAsync();
      toast.success("Sample products added successfully!");
    } catch {
      toast.error("Could not seed products.");
    }
  }

  const editInitial: ProductFormValues | undefined = editProduct
    ? {
        name: editProduct.name,
        description: editProduct.description,
        priceRupees: String(Number(editProduct.price) / 100),
        category: editProduct.category,
        stockStatus: editProduct.stockStatus,
        imageFile: null,
        existingBlob: editProduct.imageKey,
      }
    : undefined;

  return (
    <div
      className="max-w-5xl mx-auto px-4 py-8"
      data-ocid="admin_products.page"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex-1">
          <h1 className="font-display font-bold text-2xl text-foreground">
            Products
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading
              ? "Loading…"
              : `${products.length} product${products.length !== 1 ? "s" : ""} in catalogue`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeed}
            disabled={seedMutation.isPending}
            data-ocid="admin_products.seed_button"
          >
            {seedMutation.isPending && (
              <Loader2 size={14} className="animate-spin mr-1.5" />
            )}
            Seed Sample Products
          </Button>
          <Button
            size="sm"
            onClick={openAdd}
            data-ocid="admin_products.add_button"
          >
            <Plus size={16} className="mr-1.5" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Product list */}
      {isLoading ? (
        <div
          className="grid grid-cols-1 gap-3"
          data-ocid="admin_products.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="admin_products.empty_state"
        >
          <Package size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No products yet</p>
          <p className="text-sm mt-1">
            Add your first product or seed sample data to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {products.map((p, idx) => (
            <Card
              key={String(p.id)}
              className="p-4 flex items-center gap-4 shadow-card border-border hover:shadow-md transition-smooth"
              data-ocid={`admin_products.item.${idx + 1}`}
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                {p.imageKey?.getDirectURL() ? (
                  <img
                    src={p.imageKey.getDirectURL()}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={24} className="text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">
                  {p.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {p.category}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-bold text-primary text-sm">
                    {formatINR(p.price)}
                  </span>
                  {stockBadge(p.stockStatus)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => openEdit(p)}
                  aria-label="Edit product"
                  data-ocid={`admin_products.edit_button.${idx + 1}`}
                >
                  <Pencil size={15} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(p.id)}
                  aria-label="Delete product"
                  data-ocid={`admin_products.delete_button.${idx + 1}`}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit form modal */}
      <ProductFormDialog
        open={showForm}
        onClose={closeForm}
        initial={editInitial}
        editId={editProduct?.id}
      />

      {/* Delete confirm */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="product_delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be permanently
              removed from your catalogue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="product_delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              data-ocid="product_delete.confirm_button"
            >
              {deleteMutation.isPending ? (
                <Loader2 size={14} className="animate-spin mr-1.5" />
              ) : null}
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminProducts() {
  return (
    <AdminGuard>
      <AdminProductsContent />
    </AdminGuard>
  );
}
