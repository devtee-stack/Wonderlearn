import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface MentorshipProps {
  openAuthModal: () => void;
}

const Mentorship = ({ openAuthModal }: MentorshipProps) => {
  const [goals, setGoals] = useState("");
  const { user } = useAuth();

  const handleSubmit = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (!goals.trim()) {
      toast.error("Please describe your goals briefly");
      return;
    }
    toast.success("Mentorship application submitted! We will notify you by email.");
    setGoals("");
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
        Mentorship Program
      </h2>
      <Card className="p-6 md:p-8 shadow-lg max-w-3xl mx-auto animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <Users className="h-8 w-8 text-accent" />
          <h3 className="text-2xl font-bold text-foreground">Apply for Mentorship</h3>
        </div>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Our mentorship program connects recent graduates and early-career professionals with experienced alumni. Whether you're seeking guidance in academia, transitioning to industry, or exploring new career paths, our mentors are here to help.
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="goals" className="block text-sm font-semibold text-foreground mb-2">
              Describe your goals and what you hope to achieve through mentorship:
            </label>
            <Textarea
              id="goals"
              placeholder="Tell us about your career aspirations, challenges you're facing, or specific areas where you'd like guidance..."
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={5}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleSubmit}
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
          >
            Submit Application
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          {!user && "Please register or login to apply for mentorship."}
        </p>
      </Card>
    </div>
  );
};

export default Mentorship;
