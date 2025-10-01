
import FarmPageClient from "@/components/farm-page-client";

export default function FarmPage({ params: { id } }: { params: { id: string } }) {
  return <FarmPageClient id={id} />;
}
