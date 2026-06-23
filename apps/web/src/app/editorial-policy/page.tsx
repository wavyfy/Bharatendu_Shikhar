import { LegalPage, generateLegalMetadata } from "@/components/shared/LegalPage";

export async function generateMetadata() {
  return generateLegalMetadata("editorial_policy", "Editorial Policy", "editorial-policy");
}

export default function EditorialPolicyPage() {
  return <LegalPage field="editorial_policy" title="Editorial Policy" />;
}
