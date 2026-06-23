import { LegalPage, generateLegalMetadata } from "@/components/shared/LegalPage";

/**
 * Generates metadata for the terms and conditions page.
 *
 * @returns The metadata for the terms and conditions page
 */
export async function generateMetadata() {
  return generateLegalMetadata("terms_conditions", "Terms & Conditions", "terms");
}

/**
 * Renders the terms and conditions page.
 */
export default function TermsPage() {
  return <LegalPage field="terms_conditions" title="Terms & Conditions" />;
}
