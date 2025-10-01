
import FarmPageClient from "@/components/farm-page-client";

export default function FarmPage({ params }: { params: { id: string } }) {
  return <FarmPageClient id={params.id} />;
}
