import type { Metadata } from "next"
import { ProductPreview } from "./product-preview"

export const metadata: Metadata = {
  title: "Tactfully — Product Preview",
  description: "A complete visual preview of the new Tactfully workspace.",
  robots: { index: false, follow: false },
}

export default function PreviewPage() {
  return <ProductPreview />
}
