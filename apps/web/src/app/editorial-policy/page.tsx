import { LegalPage, generateLegalMetadata } from "@/components/shared/LegalPage";

/**
 * Generates metadata for the Editorial Policy page.
 *
 * @returns The metadata configuration for the Editorial Policy page.
 */
export async function generateMetadata() {
  return generateLegalMetadata("editorial_policy", "Editorial Policy", "editorial-policy");
}

/**
 * Renders the Editorial Policy page.
 */
export default function EditorialPolicyPage() {
  return <LegalPage field="editorial_policy" title="Editorial Policy" />;
}
