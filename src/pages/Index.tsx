import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import PresidentDesk from "@/components/PresidentDesk";
import About from "@/components/About";
import Directory from "@/components/Directory";
import Careers from "@/components/Careers";
import Events from "@/components/Events";
import News from "@/components/News";
import Mentorship from "@/components/Mentorship";
import Forum from "@/components/Forum";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const { user } = useAuth();

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header openAuthModal={openAuthModal} />
      
      <main>
        <section id="home">
          <HeroCarousel openAuthModal={() => openAuthModal("register")} />
        </section>

        <section id="president" className="py-16 md:py-24">
          <PresidentDesk />
        </section>

        <section id="about" className="py-16 md:py-24 bg-secondary">
          <About />
        </section>

        <section id="directory" className="py-16 md:py-24">
          <Directory />
        </section>

        <section id="careers" className="py-16 md:py-24 bg-secondary">
          <Careers openAuthModal={() => openAuthModal("register")} />
        </section>

        <section id="events" className="py-16 md:py-24">
          <Events />
        </section>

        <section id="news" className="py-16 md:py-24 bg-secondary">
          <News />
        </section>

        <section id="mentorship" className="py-16 md:py-24">
          <Mentorship openAuthModal={() => openAuthModal("register")} />
        </section>

        <section id="forum" className="py-16 md:py-24 bg-secondary">
          <Forum openAuthModal={() => openAuthModal("register")} />
        </section>

        <section id="contact" className="py-16 md:py-24">
          <Contact />
        </section>
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

export default Index;
