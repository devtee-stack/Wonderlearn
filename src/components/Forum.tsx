import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ForumProps {
  openAuthModal: () => void;
}

const categories = [
  "All",
  "Ethics",
  "Logic",
  "Metaphysics",
  "Epistemology",
  "African Philosophy",
  "Careers",
  "Research",
];

const threads = [
  {
    title: "How do we teach ethics to students entering tech?",
    author: "Dr. A. Yusuf",
    replies: 3,
    category: "Ethics",
    preview: "Let's discuss content, pedagogy and practical case studies useful for undergraduates going into tech.",
  },
  {
    title: "Postgraduate Funding Opportunities",
    author: "Chinedu Okoro",
    replies: 1,
    category: "Careers",
    preview: "Share scholarship links and advice for PhD applicants.",
  },
];

const Forum = ({ openAuthModal }: ForumProps) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { user } = useAuth();

  const handleNewThread = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    toast.info("Forum thread creation coming soon!");
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
        Discussion Forum
      </h2>
      
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Categories Sidebar */}
        <Card className="p-6 h-fit animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Categories</h3>
            <Button size="sm" variant="outline" onClick={handleNewThread}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Tap a category to filter threads. Create your own category anytime.
          </p>
        </Card>

        {/* Main Forum Area */}
        <div>
          <Card className="p-4 md:p-6 bg-gold/10 border-gold mb-6">
            <p className="text-sm font-semibold">
              <strong>Note:</strong> Guests can read topics. You must register and login to post replies or start new threads.
            </p>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
            <Button onClick={handleNewThread} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              <MessageSquare className="mr-2 h-4 w-4" />
              Start New Thread
            </Button>
            <p className="text-sm text-muted-foreground">
              Example threads: Philosophy & Tech, Career Advice, Research Opportunities
            </p>
          </div>

          <div className="space-y-4">
            {threads.map((thread, index) => (
              <Card
                key={index}
                className="p-4 md:p-6 hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-2">
                  <h4 className="text-xl font-bold text-foreground flex-1">
                    {thread.title}
                  </h4>
                  <Badge variant="outline" className="w-fit">
                    {thread.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  by {thread.author} • {thread.replies} {thread.replies === 1 ? 'comment' : 'comments'}
                </p>
                <p className="text-foreground">{thread.preview}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
