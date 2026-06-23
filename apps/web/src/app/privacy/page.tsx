import { LegalPage, generateLegalMetadata } from "@/components/shared/LegalPage";

/**
 * Generates metadata for the privacy policy page.
 *
 * @returns The page metadata configuration.
 */
export async function generateMetadata() {
  return generateLegalMetadata("privacy_policy", "Privacy Policy", "privacy");
}

export default function PrivacyPage() {
  return <LegalPage field="privacy_policy" title="Privacy Policy" />;
}
