import * as React from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = {
  title: "Nouveau produit",
};

export default function NewProductPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Nouveau produit"
        subtitle="Remplissez les informations puis enregistrez."
      />
      <ProductForm />
    </>
  );
}
