
import FarmPageClient from "@/components/farm-page-client";

export default function FarmPage({ params }: { params: { id: string } }) {
  const id = params.id;
  return <FarmPageClient id={id} />;
}
