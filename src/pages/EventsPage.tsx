import Header from "@/components/Header";
import Events from "@/components/Events";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useState } from "react";

const EventsPage = () => {
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
        <Events />
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

export default EventsPage;
