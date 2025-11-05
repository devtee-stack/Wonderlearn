import Header from "@/components/Header";
import Directory from "@/components/Directory";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useState } from "react";

const DirectoryPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header openAuthModal={openAuthModal} />
      <main className="py-16 md:py-24 bg-secondary">
        <Directory />
      </main>
      <Footer />
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

export default DirectoryPage;
