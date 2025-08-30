import { CollectionTemplate } from '@/types/collections';

export const collectionTemplates: CollectionTemplate[] = [
  {
    id: 'frontend-fundamentals',
    name: 'Frontend Fundamentals',
    description: 'Master the basics of modern web development',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Web Development'],
    category: 'frontend',
    difficulty: 'beginner',
    estimatedTime: 480, // 8 hours
    icon: '🎨'
  },
  {
    id: 'backend-basics',
    name: 'Backend Basics',
    description: 'Learn server-side development and APIs',
    tags: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'API Design', 'REST'],
    category: 'backend',
    difficulty: 'beginner',
    estimatedTime: 600, // 10 hours
    icon: '⚙️'
  },
  {
    id: 'devops-mastery',
    name: 'DevOps Mastery',
    description: 'Master containerization, CI/CD, and cloud deployment',
    tags: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'DevOps'],
    category: 'devops',
    difficulty: 'intermediate',
    estimatedTime: 720, // 12 hours
    icon: '🐳'
  },
  {
    id: 'ai-ml-journey',
    name: 'AI & ML Journey',
    description: 'Explore artificial intelligence and machine learning',
    tags: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP'],
    category: 'ai-ml',
    difficulty: 'intermediate',
    estimatedTime: 900, // 15 hours
    icon: '🤖'
  },
  {
    id: 'game-development',
    name: 'Game Development',
    description: 'Create amazing games with modern tools',
    tags: ['Unity', 'C#', 'Game Design', '3D Modeling', 'Unreal Engine', 'Game Dev'],
    category: 'game-dev',
    difficulty: 'intermediate',
    estimatedTime: 840, // 14 hours
    icon: '🎮'
  },
  {
    id: 'system-architecture',
    name: 'System Architecture',
    description: 'Design scalable and robust systems',
    tags: ['Microservices', 'System Design', 'Database Design', 'Scalability', 'Architecture'],
    category: 'system-design',
    difficulty: 'advanced',
    estimatedTime: 600, // 10 hours
    icon: '🏗️'
  },
  {
    id: 'mobile-development',
    name: 'Mobile Development',
    description: 'Build native and cross-platform mobile apps',
    tags: ['React Native', 'Flutter', 'iOS', 'Android', 'Mobile Development', 'App Development'],
    category: 'mobile',
    difficulty: 'intermediate',
    estimatedTime: 780, // 13 hours
    icon: '📱'
  },
  {
    id: 'data-science',
    name: 'Data Science',
    description: 'Analyze data and extract insights',
    tags: ['Python', 'Pandas', 'NumPy', 'Data Analysis', 'Statistics', 'Data Visualization'],
    category: 'data-science',
    difficulty: 'intermediate',
    estimatedTime: 660, // 11 hours
    icon: '📊'
  }
];

export const getTemplatesByCategory = (category: string) => {
  return collectionTemplates.filter(template => template.category === category);
};

export const getTemplatesByDifficulty = (difficulty: string) => {
  return collectionTemplates.filter(template => template.difficulty === difficulty);
};
