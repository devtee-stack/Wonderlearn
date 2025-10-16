import { Card } from "@/components/ui/card";

const newsItems = [
  {
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=60",
    title: "UNIZIK Launches Philosophy Research Fellowship",
    description:
      "A new fellowship supporting early-career researchers working on ethics, African philosophy, and philosophy of technology has been announced. Applications open Nov 2025.",
  },
  {
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=60",
    title: "Call for Papers: Annual Conference on African Philosophy",
    description:
      "Organizers request submissions on decolonial methodologies, indigenous knowledge systems, and contemporary African thought. Deadline: Jan 15, 2026.",
  },
  {
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=60",
    title: "Alumni Spotlight: Dr. Funmi Adebayo",
    description:
      "Dr. Adebayo discusses community-focused research and new pedagogies in ethics. Her interview highlights paths from scholarship to public engagement.",
  },
  {
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=60",
    title: "New Centre for Philosophy & Public Policy",
    description:
      "The department announced plans to convene cross-disciplinary projects on ethics and governance. The centre will host policy fellowships and public lectures.",
  },
  {
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=60",
    title: "Workshop: Ethics of AI for Humanitarian Practice",
    description:
      "A two-day workshop for researchers and practitioners covering ethical impact assessment, data governance, and community consent. Registration opens soon.",
  },
];

const News = () => {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
        Latest News
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map((item, index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h4 className="font-bold text-lg mb-2 text-foreground">{item.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default News;
