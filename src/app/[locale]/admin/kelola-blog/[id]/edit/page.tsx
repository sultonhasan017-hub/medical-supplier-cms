import { notFound } from 'next/navigation';
import { getBlogById } from './actions';
import EditBlogForm from '../../../../../../components/admin/EditBlogForm';

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const article = await getBlogById(id);

  if (!article) notFound();

  return <EditBlogForm article={article} />;
}
