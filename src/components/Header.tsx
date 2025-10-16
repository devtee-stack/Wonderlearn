import { useState, useEffect } from "react";
import { Menu, X, GraduationCap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface HeaderProps {
  openAuthModal: (mode: "login" | "register") => void;
}

const Header = ({ openAuthModal }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Executives", id: "executives" },
    { label: "Directory", id: "directory" },
    { label: "Careers", id: "careers" },
    { label: "Events", id: "events" },
    { label: "Forum", id: "forum" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-primary/95 backdrop-blur-lg shadow-lg"
          : "bg-primary"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-3 group"
          >
            <div className="bg-gold p-2 rounded-lg shadow-md group-hover:scale-110 transition-transform">
              <GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-gold-foreground" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-primary-foreground font-bold text-sm lg:text-base leading-tight">
                UNIZIK PHILOSOPHY
                <br />
                <span className="text-gold">ALUMNI ASSOCIATION</span>
              </h1>
            </div>
            <div className="block md:hidden">
              <h1 className="text-primary-foreground font-bold text-xs leading-tight">
                UNIZIK
                <br />
                <span className="text-gold">ALUMNI</span>
              </h1>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-4 py-2 text-sm font-semibold text-primary-foreground hover:text-gold transition-colors rounded-lg hover:bg-primary-foreground/10"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="gold">
                    Hi, {user.name.split(" ")[0]} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card">
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="gold"
                  onClick={() => openAuthModal("login")}
                  className="hidden sm:inline-flex"
                >
                  Login
                </Button>
                <Button
                  variant="gold"
                  onClick={() => openAuthModal("register")}
                  className="hidden sm:inline-flex"
                >
                  Register
                </Button>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-primary-foreground">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-primary border-primary-foreground/20">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className="text-left px-4 py-3 text-primary-foreground hover:text-gold transition-colors rounded-lg hover:bg-primary-foreground/10 font-semibold"
                    >
                      {link.label}
                    </button>
                  ))}
                  {!user && (
                    <div className="flex flex-col gap-2 mt-4">
                      <Button
                        variant="gold"
                        onClick={() => {
                          openAuthModal("login");
                          setMobileOpen(false);
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        variant="gold"
                        onClick={() => {
                          openAuthModal("register");
                          setMobileOpen(false);
                        }}
                      >
                        Register
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
