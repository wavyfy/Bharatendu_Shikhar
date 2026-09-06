import { LegalPage, generateLegalMetadata } from "@/components/shared/LegalPage";

export async function generateMetadata() {
  return generateLegalMetadata("terms_conditions", "नियम और शर्तें", "terms");
}

export default function TermsPage() {
  return <LegalPage field="terms_conditions" title="नियम और शर्तें" />;
}
