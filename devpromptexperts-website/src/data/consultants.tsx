const baseConsultants = [
  {
    name: 'Sarah Johnson',
    title: 'AI Prompt Engineering Expert',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    rating: 4.9,
    expertise: ['GPT-4', 'Claude AI', 'Prompt Engineering'],
    availability: 'Weekends - 10 hours',
    projectsCompleted: 89,
    featured: true
  },
  {
    name: 'Michael Chen',
    title: 'Full-Stack AI Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    rating: 4.8,
    expertise: ['React', 'Next.js', 'AI Integration'],
    availability: 'Evenings - 15 hours/week',
    projectsCompleted: 62,
    featured: true
  },
  {
    name: 'Emily Rodriguez',
    title: 'Machine Learning Consultant',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    rating: 4.9,
    expertise: ['PyTorch', 'TensorFlow', 'MLOps'],
    availability: 'Flexible - 20 hours/week',
    projectsCompleted: 94,
    featured: true
  },
  {
    name: 'Raj Patel',
    title: 'Enterprise AI Architect',
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400',
    rating: 4.7,
    expertise: ['AI Strategy', 'Enterprise Solutions', 'Cloud AI'],
    availability: 'Weekdays - 12 hours/week',
    projectsCompleted: 77,
    featured: false
  },
  {
    name: 'Linda Kim',
    title: 'NLP Specialist',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    rating: 4.8,
    expertise: ['NLP', 'Text Analytics', 'Chatbots'],
    availability: 'Weekends - 8 hours',
    projectsCompleted: 65,
    featured: false
  },
  {
    name: 'Carlos Martinez',
    title: 'AI Product Manager',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
    rating: 4.6,
    expertise: ['Product Management', 'AI Roadmaps', 'Team Leadership'],
    availability: 'Flexible - 10 hours/week',
    projectsCompleted: 54,
    featured: false
  },
  {
    name: 'Anna Lee',
    title: 'Vision AI Developer',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400',
    rating: 4.7,
    expertise: ['Computer Vision', 'Image Recognition', 'Deep Learning'],
    availability: 'Weekdays - 14 hours/week',
    projectsCompleted: 81,
    featured: false
  },
  {
    name: 'James Smith',
    title: 'AI Security Consultant',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400',
    rating: 4.5,
    expertise: ['AI Security', 'Risk Assessment', 'Compliance'],
    availability: 'Weekends - 6 hours',
    projectsCompleted: 39,
    featured: false
  },
  {
    name: 'Maria Garcia',
    title: 'AI Data Scientist',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400',
    rating: 4.8,
    expertise: ['Data Science', 'Predictive Analytics', 'Big Data'],
    availability: 'Flexible - 18 hours/week',
    projectsCompleted: 72,
    featured: false
  },
  {
    name: 'Tom Becker',
    title: 'AI DevOps Engineer',
    image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400',
    rating: 4.6,
    expertise: ['DevOps', 'MLOps', 'Automation'],
    availability: 'Weekdays - 16 hours/week',
    projectsCompleted: 58,
    featured: false
  }
];

// Generate 100 consultants by repeating and varying base data
export const consultants = Array.from({ length: 100 }, (_, i) => {
  const base = baseConsultants[i % baseConsultants.length];
  return {
    ...base,
    id: (i + 1).toString(),
    name: `${base.name} ${i + 1}`,
    email: `consultant${i + 2}',@example.com`,
    bioSummary: `Experienced ${base.title} with expertise in ${base.expertise.join(", ")}.`,
    expertise: base.expertise,
    availability: base.availability,
    country: ["USA", "Canada", "UK", "Germany", "Australia"][i % 5],
    workExperience: 3 + (i % 10), // 3 to 12 years
    skills: base.expertise,
    publications: [`Publication ${i + 1}`, `Publication ${i + 2}`], // Dummy publications 
    rating: Math.round((base.rating + (Math.random() - 0.5) * 0.4) * 10) / 10,
    projectsCompleted: base.projectsCompleted + Math.floor(Math.random() * 50),
    featured: i < 10 ? true : false // First 10 are featured
  };
});

export const featuredConsultants = consultants.filter(c => c.featured);
export const allExpertise = Array.from(
  new Set(consultants.flatMap((c) => c.expertise))
);