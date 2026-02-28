import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="text-2xl">Terms & Agreements</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Please read and accept our Terms of Service and Privacy Policy to continue
          </p>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Terms of Service Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Terms of Service</h3>
            <div className="bg-muted/30 rounded-lg p-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong>1. Acceptance of Terms</strong><br />
                By registering and using the Shift application, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>

              <p>
                <strong>2. User Responsibilities</strong><br />
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>

              <p>
                <strong>3. Acceptable Use</strong><br />
                You agree not to use the Shift application for any unlawful purposes or in any way that could damage, disable, or impair the service. This includes but is not limited to harassment, fraud, or unauthorized access attempts.
              </p>

              <p>
                <strong>4. Intellectual Property Rights</strong><br />
                All content, features, and functionality of the Shift application are owned by Shift, its licensors, or other providers of such material and are protected by international copyright, trademark, and other intellectual property laws.
              </p>

              <p>
                <strong>5. Limitation of Liability</strong><br />
                To the fullest extent permitted by law, Shift shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>

              <p>
                <strong>6. Modifications to Terms</strong><br />
                Shift reserves the right to modify these terms at any time. Your continued use of the application following the posting of revised terms means that you accept and agree to the changes.
              </p>

              <p>
                <strong>7. Termination</strong><br />
                Shift may terminate or suspend your account and access to the service at any time, for any reason, without notice or liability.
              </p>

              <p>
                <strong>8. Governing Law</strong><br />
                These Terms of Service are governed by and construed in accordance with the laws of the Republic of the Philippines, and you irrevocably submit to the exclusive jurisdiction of the courts located in the Philippines.
              </p>
            </div>
          </div>

          {/* Privacy Policy Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Privacy Policy</h3>
            <div className="bg-muted/30 rounded-lg p-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong>1. Information We Collect</strong><br />
                We collect information you provide directly, such as your name, email address, password, and profile information. We also automatically collect certain information about your device and usage patterns when you use our application.
              </p>

              <p>
                <strong>2. How We Use Your Information</strong><br />
                We use the information we collect to provide, maintain, and improve our services, process transactions, send transactional and promotional communications, and comply with legal obligations.
              </p>

              <p>
                <strong>3. Data Protection & Security</strong><br />
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>

              <p>
                <strong>4. Data Retention</strong><br />
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
              </p>

              <p>
                <strong>5. Your Rights (NDPA Compliance)</strong><br />
                Under the National Data Privacy Act (NDPA) of the Philippines, you have the right to: access your personal information, correct inaccurate data, object to processing, request deletion, and lodge complaints with the National Privacy Commission.
              </p>

              <p>
                <strong>6. Sharing of Information</strong><br />
                We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.
              </p>

              <p>
                <strong>7. Cookies and Tracking</strong><br />
                We use cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser preferences.
              </p>

              <p>
                <strong>8. Contact Us</strong><br />
                If you have questions about this Privacy Policy or our privacy practices, please contact us at privacy@shift.app or through our official contact channels.
              </p>

              <p>
                <strong>9. Changes to Privacy Policy</strong><br />
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </div>
          </div>
        </CardContent>

        {/* Close Button */}
        <div className="border-t bg-muted/20 p-6 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 px-6"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TermsModal;
