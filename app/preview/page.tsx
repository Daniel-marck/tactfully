import type { Metadata } from "next"
import { ProductPreview } from "./product-preview"

export const metadata: Metadata = {
  title: "Tactfully product preview",
  description: "Preview the new Tactfully client communication workspace.",
  robots: { index: false, follow: false },
}

export default function PreviewPage() {
  return <ProductPreview />
}
