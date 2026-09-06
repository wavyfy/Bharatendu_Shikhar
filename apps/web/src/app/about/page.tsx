import { LegalPage, generateLegalMetadata } from "@/components/shared/LegalPage";

export async function generateMetadata() {
  return generateLegalMetadata("about_us", "हमारे बारे में", "about");
}

export default function AboutPage() {
  return <LegalPage field="about_us" title="हमारे बारे में" />;
}
