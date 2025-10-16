import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CareersProps {
  openAuthModal: () => void;
}

const jobs = [
  {
    title: "Research Fellow - Ethics in Tech",
    type: "Full-time",
    location: "Remote",
    posted: "5 days ago",
  },
  {
    title: "Lecturer (Philosophy)",
    type: "Part-time",
    location: "UNIZIK",
    posted: "12 days ago",
  },
  {
    title: "Program Coordinator - Alumni Relations",
    type: "Full-time",
    location: "Abuja",
    posted: "2 days ago",
  },
];

const Careers = ({ openAuthModal }: CareersProps) => {
  const { user } = useAuth();

  const handleApply = (jobTitle: string) => {
    if (!user) {
      openAuthModal();
      return;
    }
    toast.success(`Application sent for "${jobTitle}"! Admins will contact you via email.`);
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
        Career Opportunities
      </h2>
      <Card className="p-6 md:p-8 shadow-lg">
        <p className="text-muted-foreground mb-6">
          Employers and alumni post roles here. Guests see listings; registered users can apply directly.
        </p>
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <Card
              key={index}
              className="p-4 md:p-6 hover:shadow-md transition-all animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg mb-1">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {job.type} • {job.location} • Posted {job.posted}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleApply(job.title)}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
                >
                  Apply
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Careers;
