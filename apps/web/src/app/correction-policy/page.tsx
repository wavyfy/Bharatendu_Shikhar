import { LegalPage, generateLegalMetadata } from "@/components/shared/LegalPage";

export async function generateMetadata() {
  return generateLegalMetadata("correction_policy", "सुधार नीति", "correction-policy");
}

export default function CorrectionPolicyPage() {
  return <LegalPage field="correction_policy" title="सुधार नीति" />;
}
