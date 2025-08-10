
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="prose prose-stone dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold font-headline">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <Alert variant="destructive" className="mt-8">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Not Legal Advice</AlertTitle>
            <AlertDescription>
                This is a sample Terms of Service and is not legally binding. You must consult with a qualified legal professional to ensure your Terms are compliant with all applicable laws, including those in India.
            </AlertDescription>
        </Alert>

        <p className="mt-6">
          Welcome to MyAppStore. These Terms of Service ("Terms") govern your use of our website. By accessing or using our website, you agree to be bound by these Terms.
        </p>

        <h2>1. Use of Our Service</h2>
        <p>
          MyAppStore provides a platform for discovering and downloading applications ("Apps"). You agree to use our service in compliance with all applicable local, state, national, and international laws, rules, and regulations, including the laws of India.
        </p>

        <h2>2. Admin Accounts</h2>
        <p>
          To manage apps on our platform, you must register for an admin account. You are responsible for safeguarding your account password and for any activities or actions under your password. You agree not to disclose your password to any third party.
        </p>

        <h2>3. Content</h2>
        <p>
          You are responsible for the content you post to the Service, including its legality, reliability, and appropriateness. By posting content, you represent and warrant that: (i) the content is yours (you own it) or you have the right to use it and (ii) the posting of your content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights, or any other rights of any person.
        </p>
        <p>
            We reserve the right to remove any content that we determine to be unlawful, offensive, threatening, libelous, defamatory, obscene, or otherwise objectionable or violates any party's intellectual property or these Terms of Service.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of MyAppStore and its licensors. The Service is protected by copyright, trademark, and other laws of both India and foreign countries.
        </p>

        <h2>5. Termination</h2>
        <p>
          We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          In no event shall MyAppStore, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>
        
        <h2>7. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
        </p>

        <h2>8. Changes</h2>
        <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page.
        </p>

        <h2>9. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at: [Your Contact Email/Address Here]</p>
      </div>
    </div>
  );
}
