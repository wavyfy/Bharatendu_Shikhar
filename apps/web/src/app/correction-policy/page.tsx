import { LegalPage, generateLegalMetadata } from "@/components/shared/LegalPage";

/**
 * Generates metadata for the Correction Policy page.
 *
 * @returns Metadata configuration for the correction policy page.
 */
export async function generateMetadata() {
  return generateLegalMetadata("correction_policy", "Correction Policy", "correction-policy");
}

/**
 * Displays the correction policy page.
 */
export default function CorrectionPolicyPage() {
  return <LegalPage field="correction_policy" title="Correction Policy" />;
}
