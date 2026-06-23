import { LegalPage, generateLegalMetadata } from "@/components/shared/LegalPage";

export async function generateMetadata() {
  return generateLegalMetadata("privacy_policy", "Privacy Policy", "privacy");
}

export default function PrivacyPage() {
  return <LegalPage field="privacy_policy" title="Privacy Policy" />;
}
