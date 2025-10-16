import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
}

const AuthModal = ({ open, onClose, mode, onModeChange }: AuthModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { login, register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "register") {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Please complete all fields");
        return;
      }
      register({ name: formData.name, email: formData.email, role: "member" });
      toast.success("Account created successfully! Welcome to UNIZIK Alumni.");
    } else {
      if (!formData.email || !formData.password) {
        toast.error("Please enter email and password");
        return;
      }
      login({ name: formData.email.split("@")[0], email: formData.email, role: "member" });
      toast.success("Signed in successfully!");
    }
    
    onClose();
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {mode === "register" ? "Create Account" : "Welcome Back"}
          </DialogTitle>
          <DialogDescription>
            {mode === "register"
              ? "Create an account to unlock posting, applying for mentorship, and applying to jobs."
              : "Sign in to access all features and connect with alumni."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              variant="gold"
            >
              {mode === "register" ? "Create Account" : "Sign In"}
            </Button>
          </div>
          <div className="text-center text-sm">
            {mode === "register" ? (
              <button
                type="button"
                onClick={() => onModeChange("login")}
                className="text-primary hover:text-accent font-semibold"
              >
                Already have an account? Sign in
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onModeChange("register")}
                className="text-primary hover:text-accent font-semibold"
              >
                Don't have an account? Register
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
