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

export interface Toggleable{
 onClose: () => void;
}

  export type Holding = {
    ticker: string
    name: string
    value: number
    change: number  // percentage, can be negative
  }

  export type PortfolioSummaryProps = {
    ownerName: string
    holdings: Holding[] | undefined
  }

  export const portfolioHoldings:PortfolioSummaryProps[] = [
               {ownerName: "Ananya Iyer", holdings: [
                        { ticker: "AAPL", name: "Apple",     value: 8200,  change:  2.4 },
                        { ticker: "AMZN", name: "Amazon",     value: 7200,  change:  -2.4 },
                        { ticker: "NVDA", name: "Nvidia",     value: 4200,  change:  2.1 }
                      ]},
                {ownerName: "Alex Chan", holdings:[
                      { ticker: "MSFT", name: "Microsoft", value: 6500,  change: -0.8 },
                      { ticker: "NVDA", name: "Apple",     value: 4200,  change:  1.4 },
                      { ticker: "TCS", name: "Tata",     value: 5200,  change:  2.3 },
                      { ticker: "RELIANCE", name: "Reliance",     value: 5400,  change:  2.5 },
                ]},
                {ownerName: "Riya Mehta", holdings:[
                      { ticker: "INFY", name: "Infosys",    value: 10550, change:  5.2 },
                      { ticker: "AAPL", name: "Apple",     value: 6700,  change:  2.2},
                      { ticker: "GOOG", name: "GOOGLE",     value: 5500,  change:  -0.5 }
                ]},
          ]