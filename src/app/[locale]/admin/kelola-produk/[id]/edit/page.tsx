import { notFound } from 'next/navigation';
import { getProductById, getBrandsForEdit } from './actions';
import EditProductForm from '../../../../../../components/admin/EditProductForm';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const [product, brands] = await Promise.all([
    getProductById(id),
    getBrandsForEdit(),
  ]);

  if (!product) notFound();

  return <EditProductForm product={product} brands={brands} />;
}
