export interface Profile {
  id: number;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  isActive?:boolean;
  avatarUrl?: string;   // optional
  featured?: boolean;  // optional — defaults to false
  onSelect?: (name: string) => void   // a function prop
}

export const profiles: Profile[] = [
   {
    id: 1,
    name: 'Alex Chan',
    role: 'Portfolio Manager',
    bio: 'Builds and manages investment portfolios to maximize returns while balancing risk.',
    skills: ['Equities', 'Fixed Income', 'ETFs'],
    isActive: true,
    featured: true,
    avatarUrl:`https://api.dicebear.com/9.x/adventurer/svg?seed=1`
  },

  {
    id: 2,
    name: 'Riya Mehta',
    role: 'Risk Analyst',
    bio: 'Identifies, measures, and mitigates financial risks to protect assets and ensure stability.',
    skills: ['Risk Modeling', 'VaR', 'Stress Testing'],
    isActive: true,
    featured: false,
    avatarUrl:`https://api.dicebear.com/9.x/adventurer/svg?seed=2`
  },
  {
    id: 3,
    name: 'Daniel Kim',
    role: 'Quant Researcher',
    bio: 'Develops data-driven models and algorithms to uncover market insights and optimize trading strategies.',
    skills: ['Python', 'Machine Learning', 'Statistical Modeling'],
    isActive: true,
    featured: true,
    avatarUrl:`https://api.dicebear.com/9.x/adventurer/svg?seed=3`
  },
  {
    id: 4,
    name: 'Priya Sharma',
    role: 'Financial Analyst',
    bio: 'Analyzes financial data and trends to support strategic investment and business decisions.',
    skills: ['Financial Modeling', 'Valuation', 'Excel'],
    isActive: true,
    featured: false,
    avatarUrl:`https://api.dicebear.com/9.x/adventurer/svg?seed=4`
  },
  {
    id: 5,
    name: 'Michael Brown',
    role: 'Trader',
    bio: 'Executes trades and monitors market movements to capitalize on short-term opportunities.',
    skills: ['Derivatives', 'Technical Analysis', 'Market Timing'],
    isActive: false,
    featured: false,
    avatarUrl:`https://api.dicebear.com/9.x/adventurer/svg?seed=5`
  },
  {
    id: 6,
    name: 'Ananya Iyer',
    role: 'Data Scientist',
    bio: 'Leverages data analytics and machine learning to generate actionable financial insights.',
    skills: ['Python', 'Pandas', 'Deep Learning'],
    isActive: true,
    featured: true,
    avatarUrl:`https://api.dicebear.com/9.x/adventurer/svg?seed=6`
  }
];
