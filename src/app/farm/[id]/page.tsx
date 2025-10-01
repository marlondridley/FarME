
import FarmPageClient from "@/components/farm-page-client";

export default async function FarmPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <FarmPageClient id={id} />;
}
