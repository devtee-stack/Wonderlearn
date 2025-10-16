import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const alumni = [
  {
    name: "Chinedu Okoro",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    degree: "M.A. Ethics",
    year: "2018",
    profession: "Education Consultant",
    location: "Lagos, Nigeria",
  },
  {
    name: "Amina Yusuf",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    degree: "Ph.D. African Philosophy",
    year: "2015",
    profession: "University Professor",
    location: "Abuja, Nigeria",
  },
  {
    name: "Emeka Nwosu",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    degree: "B.A. Logic",
    year: "2020",
    profession: "Software Developer",
    location: "Berlin, Germany",
  },
];

const Directory = () => {
  const [filters, setFilters] = useState({
    specialization: "",
    year: "",
    location: "",
    industry: "",
  });

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
        Find Alumni - Directory
      </h2>
      <Card className="p-6 md:p-8 shadow-lg">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-2 block">Specialization</label>
            <Select value={filters.specialization} onValueChange={(value) => setFilters({ ...filters, specialization: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="ethics">Ethics</SelectItem>
                <SelectItem value="metaphysics">Metaphysics</SelectItem>
                <SelectItem value="logic">Logic</SelectItem>
                <SelectItem value="african">African Philosophy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-2 block">Graduation Year</label>
            <Select value={filters.year} onValueChange={(value) => setFilters({ ...filters, year: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="2020-2023">2020-2023</SelectItem>
                <SelectItem value="2010-2019">2010-2019</SelectItem>
                <SelectItem value="2000-2009">2000-2009</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-2 block">Location</label>
            <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="abuja">Abuja</SelectItem>
                <SelectItem value="international">International</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-2 block">Industry</label>
            <Select value={filters.industry} onValueChange={(value) => setFilters({ ...filters, industry: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="government">Government</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            <Search className="mr-2 h-4 w-4" />
            Search Alumni
          </Button>
          <p className="text-sm text-muted-foreground">
            Tip: Guests can browse — register to contact alumni.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {alumni.map((person, index) => (
            <Card key={index} className="p-4 hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex gap-4">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-primary truncate">{person.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {person.degree}, {person.year}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {person.profession}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {person.location}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Directory;
