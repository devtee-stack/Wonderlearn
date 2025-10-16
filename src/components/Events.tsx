import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const events = [
  {
    date: "Nov 28, 2025",
    location: "UNIZIK",
    title: "Philosophy & AI Symposium",
    description:
      "A one-day symposium exploring ethical design, algorithmic bias, and normative theory for AI practitioners and philosophers. Hybrid (UNIZIK / Zoom).",
  },
  {
    date: "Jan 20, 2026",
    location: "UNIZIK",
    title: "Alumni Homecoming 2026",
    description:
      "Reconnect with classmates and faculty — lectures, panels, and a keynote on 'Philosophy in Public Life'.",
  },
  {
    date: "Mar 12, 2026",
    location: "Zoom",
    title: "Mentorship Workshop: Philosophy to Practice",
    description:
      "Practical sessions for translating philosophical training into careers in policy, education, and tech.",
  },
  {
    date: "May 15, 2026",
    location: "UNIZIK / Hybrid",
    title: "Annual Conference on African Philosophy",
    description:
      "Call for papers and panels on contemporary African thought, decolonial philosophies, and community-engaged research.",
  },
];

const Events = () => {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
        Upcoming Events
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {events.map((event, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-lg font-bold text-sm mb-4">
              <Calendar className="h-4 w-4" />
              {event.date} • {event.location}
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">{event.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {event.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Events;
