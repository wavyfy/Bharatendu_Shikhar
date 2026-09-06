import { LegalPage, generateLegalMetadata } from "@/components/shared/LegalPage";

export async function generateMetadata() {
  return generateLegalMetadata("privacy_policy", "गोपनीयता नीति", "privacy");
}

export default function PrivacyPage() {
  return <LegalPage field="privacy_policy" title="गोपनीयता नीति" />;
}
