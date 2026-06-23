import { LegalPage, generateLegalMetadata } from "@/components/shared/LegalPage";

export async function generateMetadata() {
  return generateLegalMetadata("about_us", "About Us", "about");
}

export default function AboutPage() {
  return <LegalPage field="about_us" title="About Us" />;
}
