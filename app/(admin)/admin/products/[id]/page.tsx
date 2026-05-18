import * as React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { Mono } from "@/components/ui/typography";
import { api } from "@/lib/api/client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await api.products.getById(id);
  return { title: p ? `Édition — ${p.name}` : "Produit introuvable" };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await api.products.getById(id);
  if (!product) notFound();

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalogue"
        title={product.name}
        subtitle={`SKU ${product.sku}`}
        actions={
          <div className="flex items-center gap-3 rounded-md bg-parchment px-3 py-1.5">
            <span className="relative size-9 overflow-hidden rounded-md bg-cream">
              <Image
                src={product.images[0]?.url ?? "/api/placeholder/80/80"}
                alt=""
                fill
                sizes="36px"
                className="object-cover"
              />
            </span>
            <Mono className="text-wood-700">
              {product.stock} en stock
            </Mono>
          </div>
        }
      />
      <ProductForm product={product} />
    </>
  );
}
