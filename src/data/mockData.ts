// Mock data for demonstration purposes
// In production, this will be replaced with Firestore data

export const siteConfig = {
  title: "Feel-Fly Technology",
  mission: "To deliver high-quality technology services that solve real-world problems, improve operational efficiency, and enable sustainable digital growth for our clients.",
  about: "Feel-Fly Technology is a forward-thinking tech enterprise that delivers end-to-end digital solutions across software development, automation, design, and emerging technologies. We combine technical expertise, creativity, and business understanding to build solutions that are practical, secure, and growth-oriented.",
  contact: {
    email: "info@feel-flytechnology.com",
    phone: "+234 XXX XXX XXXX",
    address: "Nigeria"
  },
  social: {
    github: "https://github.com",
    linkedin: "https://linkedin.com/company/feel-fly-technology",
    twitter: "https://twitter.com/FeelFlyTech",
    instagram: "https://instagram.com/feel.flytechnology"
  },
  logo: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=200&fit=crop",
  theme: "dark",
  splash: {
    image: "", // Empty string means use logo or default
    title: "Feel-Fly Technology",
    tagline: "Designing Your Digital Future"
  }
};

export const companyProjects = [
  {
    title: "Enterprise Cloud Platform",
    description: "Scalable microservices architecture serving enterprise clients with real-time data processing and analytics",
    media: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    type: "image",
    tags: ["Cloud", "Microservices", "Analytics"],
    link: "https://example.com/cloud-platform"
  },
  {
    title: "AI-Powered Customer Support",
    description: "Intelligent chatbot system with natural language processing for automated customer service",
    media: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
    type: "image",
    tags: ["AI/ML", "NLP", "Automation"],
    link: "https://example.com/ai-support"
  },
  {
    title: "Mobile Banking Application",
    description: "Feature-rich banking app with biometric authentication and real-time transaction processing",
    media: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop",
    type: "image",
    tags: ["Mobile", "FinTech", "Security"],
    link: "https://example.com/banking-app"
  },
  {
    title: "E-Commerce Marketplace",
    description: "Multi-vendor marketplace platform with advanced search, recommendations, and payment integration",
    media: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
    type: "image",
    tags: ["E-Commerce", "Web", "Payment Integration"],
    link: "https://example.com/marketplace"
  },
  {
    title: "IoT Fleet Management",
    description: "Real-time tracking and management system for vehicle fleets with predictive maintenance",
    media: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
    type: "image",
    tags: ["IoT", "Real-time", "Tracking"],
    link: "https://example.com/fleet-management"
  },
  {
    title: "Healthcare Portal",
    description: "Patient management system with telemedicine capabilities and electronic health records",
    media: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    type: "image",
    tags: ["Healthcare", "Web", "Telemedicine"],
    link: "https://example.com/healthcare-portal"
  }
];

export const teamMembers = [
  {
    id: "1",
    name: "Alex Thompson",
    role: "Lead Software Architect",
    bio: "10+ years of experience in building scalable systems. Passionate about clean code and innovative solutions.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      portfolio: "https://example.com",
      twitter: "https://twitter.com"
    },
    projects: [
      {
        title: "Cloud Infrastructure Platform",
        description: "Built a microservices architecture serving 1M+ users",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
        link: "https://example.com/cloud-platform"
      },
      {
        title: "AI-Powered Analytics Dashboard",
        description: "Real-time data processing and predictive insights",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        link: "https://example.com/analytics"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop"
    ]
  },
  {
    id: "2",
    name: "Sarah Martinez",
    role: "UI/UX Design Lead",
    bio: "Creating beautiful, intuitive interfaces that users love. Specializing in user-centered design and brand identity.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    socials: {
      linkedin: "https://linkedin.com",
      portfolio: "https://example.com",
      twitter: "https://twitter.com"
    },
    projects: [
      {
        title: "Mobile Banking App",
        description: "Redesigned app increasing user engagement by 300%",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop",
        link: "https://example.com/mobile-banking"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=400&fit=crop"
    ]
  },
  {
    id: "3",
    name: "Michael Chen",
    role: "AI/ML Engineer",
    bio: "Passionate about artificial intelligence and machine learning. Building intelligent systems that make a difference.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    projects: [
      {
        title: "NLP Chatbot Platform",
        description: "AI-powered customer support automation",
        image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
        link: "https://example.com/chatbot"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop"
    ]
  },
  {
    id: "4",
    name: "Emily Johnson",
    role: "Full Stack Developer",
    bio: "Building end-to-end web applications with modern technologies. Focused on performance and user experience.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    socials: {
      github: "https://github.com",
      portfolio: "https://example.com"
    },
    projects: [
      {
        title: "E-Commerce Platform",
        description: "Scalable marketplace with real-time inventory",
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
        link: "https://example.com/ecommerce"
      }
    ],
    gallery: []
  }
];