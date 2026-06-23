import { LegalPage, generateLegalMetadata } from "@/components/shared/LegalPage";

export async function generateMetadata() {
  return generateLegalMetadata("terms_conditions", "Terms & Conditions", "terms");
}

export default function TermsPage() {
  return <LegalPage field="terms_conditions" title="Terms & Conditions" />;
}
