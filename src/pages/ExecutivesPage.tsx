import Header from "@/components/Header";
import Executives from "@/components/Executives";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useState } from "react";

const ExecutivesPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header openAuthModal={openAuthModal} />
      <main className="py-16 md:py-24">
        <Executives />
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

export default ExecutivesPage;
