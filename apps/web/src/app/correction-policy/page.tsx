import { LegalPage, generateLegalMetadata } from "@/components/shared/LegalPage";

export async function generateMetadata() {
  return generateLegalMetadata("correction_policy", "Correction Policy", "correction-policy");
}

export default function CorrectionPolicyPage() {
  return <LegalPage field="correction_policy" title="Correction Policy" />;
}
