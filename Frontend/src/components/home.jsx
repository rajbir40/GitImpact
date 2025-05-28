import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line
} from "recharts";
import { 
  Github, 
  Star, 
  BookOpen, 
  Users, 
  Calendar, 
  MapPin, 
  Briefcase,
  Code,
  GitPullRequest,
  Bug,
  Award,
  Download,
  Share2
} from "lucide-react";

// Mock data for demonstration
const mockUserData = {
  username: "techdev123",
  name: "Alex Morgan",
  avatar: "/api/placeholder/200/200",
  bio: "Full-stack developer passionate about open source and building scalable applications",
  location: "San Francisco, CA",
  company: "TechInnovate Inc.",
  publicRepos: 47,
  followers: 328,
  joinDate: "April 2018",
  githubUrl: "https://github.com/techdev123"
};

const mockImpactData = {
  overallScore: 87,
  locAdded: 23842,
  locRemoved: 12533,
  meaningfulCommits: 463,
  prsOpened: 182,
  prsMerged: 154,
  issuesOpened: 67,
  issuesClosed: 42
};

const mockChartData = {
  locOverTime: [
    { month: "Jan", added: 1200, removed: 500 },
    { month: "Feb", added: 1800, removed: 800 },
    { month: "Mar", added: 1400, removed: 1100 },
    { month: "Apr", added: 2200, removed: 1400 },
    { month: "May", added: 1800, removed: 1000 },
    { month: "Jun", added: 2400, removed: 1200 }
  ],
  activityData: [
    { date: "2023-01", contributions: 23 },
    { date: "2023-02", contributions: 45 },
    { date: "2023-03", contributions: 32 },
    { date: "2023-04", contributions: 58 },
    { date: "2023-05", contributions: 87 },
    { date: "2023-06", contributions: 63 }
  ],
  prIssueData: [
    { month: "Jan", prs: 12, issues: 5 },
    { month: "Feb", prs: 18, issues: 8 },
    { month: "Mar", prs: 14, issues: 11 },
    { month: "Apr", prs: 22, issues: 14 },
    { month: "May", prs: 18, issues: 10 },
    { month: "Jun", prs: 24, issues: 12 }
  ]
};

const mockTopRepos = [
  {
    name: "react-state-management",
    stars: 1287,
    description: "Lightweight state management solution for React applications",
    locAdded: 4320,
    prsMerged: 37,
    commits: 128
  },
  {
    name: "serverless-api-toolkit",
    stars: 843,
    description: "Tools for building and deploying serverless APIs",
    locAdded: 3850,
    prsMerged: 29,
    commits: 94
  },
  {
    name: "data-visualization-components",
    stars: 612,
    description: "Reusable chart and graph components for data dashboards",
    locAdded: 2930,
    prsMerged: 22,
    commits: 76
  }
];

const mockAchievements = [
  { name: "First PR Merged", icon: "GitPullRequest", earned: true },
  { name: "Bug Fixer – 10+ Issues Closed", icon: "Bug", earned: true },
  { name: "Code Cleaner – 1000+ LOC Removed", icon: "Code", earned: true },
  { name: "Popular Project – 500+ Stars", icon: "Star", earned: true },
  { name: "Consistent Contributor – 30 Day Streak", icon: "Calendar", earned: false }
];

const radarData = [
  {
    subject: "Commits",
    A: 85,
    fullMark: 100,
  },
  {
    subject: "PRs",
    A: 78,
    fullMark: 100,
  },
  {
    subject: "Issues",
    A: 65,
    fullMark: 100,
  },
  {
    subject: "LOC",
    A: 90,
    fullMark: 100,
  },
  {
    subject: "Reviews",
    A: 72,
    fullMark: 100,
  },
];

export default function GitHubDashboard() {
  const [loading, setLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
        <p className="mt-4 text-xl font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400">GitHub Contribution Analyzer</h1>
          <p className="text-gray-400">Visualizing developer impact and contributions</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* User Info Card - 3 columns */}
          <div className="lg:col-span-3 bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
            <div className="flex items-center mb-4">
              <img src={mockUserData.avatar} alt="User avatar" className="w-16 h-16 rounded-full" />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{mockUserData.name}</h2>
                <div className="flex items-center text-gray-400">
                  <Github size={16} className="mr-1" />
                  <span>{mockUserData.username}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">{mockUserData.bio}</p>
            
            <div className="flex flex-col space-y-2 mb-4 text-gray-300">
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-gray-400" />
                <span>{mockUserData.location}</span>
              </div>
              <div className="flex items-center">
                <Briefcase size={16} className="mr-2 text-gray-400" />
                <span>{mockUserData.company}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-gray-400" />
                <span>Joined {mockUserData.joinDate}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{mockUserData.publicRepos}</div>
                <div className="text-xs text-gray-400">Public Repos</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{mockUserData.followers}</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
            </div>
            
            <a 
              href={mockUserData.githubUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              <Github size={16} className="mr-2" />
              View GitHub Profile
            </a>
          </div>
          
          {/* Impact Summary Section - 4 columns */}
          <div className="lg:col-span-5 bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-400">Impact Summary</h2>
              <div className="bg-blue-600 text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center">
                {mockImpactData.overallScore}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center text-gray-300 mb-1">
                  <Code size={16} className="mr-2 text-green-400" />
                  <span>LOC Added</span>
                </div>
                <div className="text-2xl font-bold text-green-400">{mockImpactData.locAdded.toLocaleString()}</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center text-gray-300 mb-1">
                  <Code size={16} className="mr-2 text-red-400" />
                  <span>LOC Removed</span>
                </div>
                <div className="text-2xl font-bold text-red-400">{mockImpactData.locRemoved.toLocaleString()}</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center text-gray-300 mb-1">
                  <Github size={16} className="mr-2 text-blue-400" />
                  <span>Meaningful Commits</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">{mockImpactData.meaningfulCommits}</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center text-gray-300 mb-1">
                  <GitPullRequest size={16} className="mr-2 text-purple-400" />
                  <span>PRs Merged</span>
                </div>
                <div className="text-2xl font-bold text-purple-400">{mockImpactData.prsMerged} / {mockImpactData.prsOpened}</div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Contribution Balance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid stroke="#4B5563" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF' }} />
                    <PolarRadiusAxis stroke="#4B5563" tick={{ fill: '#9CA3AF' }} />
                    <Radar
                      name="Developer"
                      dataKey="A"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
                    />
                    <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Achievements Section - 4 columns */}
          <div className="lg:col-span-4 bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-400">Achievements</h2>
            <div className="grid grid-cols-1 gap-4">
              {mockAchievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className={`flex items-center rounded-lg p-3 ${
                    achievement.earned ? 'bg-blue-900/30 border border-blue-500/30' : 'bg-gray-700/50 border border-gray-600'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    achievement.earned ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    {achievement.icon === "GitPullRequest" && <GitPullRequest size={24} />}
                    {achievement.icon === "Bug" && <Bug size={24} />}
                    {achievement.icon === "Code" && <Code size={24} />}
                    {achievement.icon === "Star" && <Star size={24} />}
                    {achievement.icon === "Calendar" && <Calendar size={24} />}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${achievement.earned ? 'text-blue-300' : 'text-gray-400'}`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-xs ${achievement.earned ? 'text-blue-200/70' : 'text-gray-500'}`}>
                      {achievement.earned ? 'Earned' : 'Not yet earned'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Activity Charts - Full width */}
          <div className="lg:col-span-12 bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-blue-400">Activity Charts</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Code Contribution (LOC)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockChartData.locOverTime}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                      <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
                      />
                      <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                      <Bar dataKey="added" name="LOC Added" fill="#4ADE80" />
                      <Bar dataKey="removed" name="LOC Removed" fill="#F87171" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-300">PRs & Issues</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={mockChartData.prIssueData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                      <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
                      />
                      <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                      <Line type="monotone" dataKey="prs" name="Pull Requests" stroke="#A78BFA" strokeWidth={2} />
                      <Line type="monotone" dataKey="issues" name="Issues" stroke="#38BDF8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Contribution Heatmap</h3>
              <div className="py-4">
                <div className="grid grid-cols-52 gap-1 w-full overflow-x-auto">
                  <div className="flex flex-col gap-1">
                    {/* Create 7 rows for each day of the week */}
                    {Array.from({ length: 7 }).map((_, rowIndex) => (
                      <div key={`row-${rowIndex}`} className="flex gap-1">
                        {/* Create 52 columns for weeks in a year */}
                        {Array.from({ length: 52 }).map((_, colIndex) => {
                          // Generate a random activity level for demonstration
                          const activity = Math.floor(Math.random() * 5);
                          let bgColor;
                          switch(activity) {
                            case 0: bgColor = 'bg-gray-700'; break;
                            case 1: bgColor = 'bg-green-900'; break;
                            case 2: bgColor = 'bg-green-700'; break;
                            case 3: bgColor = 'bg-green-500'; break;
                            case 4: bgColor = 'bg-green-300'; break;
                            default: bgColor = 'bg-gray-700';
                          }
                          return <div key={`${rowIndex}-${colIndex}`} className={`w-3 h-3 rounded-sm ${bgColor}`}></div>;
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <div className="flex items-center text-xs text-gray-400">
                  <span className="mr-1">Less</span>
                  <div className="w-3 h-3 rounded-sm bg-gray-700 mr-1"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-900 mr-1"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-700 mr-1"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-500 mr-1"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-300 mr-1"></div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Top Repository Contributions - Full width */}
          <div className="lg:col-span-12 bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-blue-400">Top Repository Contributions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTopRepos.map((repo, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-5 border border-gray-600 hover:border-blue-500 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white">{repo.name}</h3>
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-400 mr-1" />
                      <span className="text-gray-300">{repo.stars}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{repo.description}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-gray-800 rounded p-2 text-center">
                      <div className="text-green-400 font-bold">{repo.locAdded}</div>
                      <div className="text-xs text-gray-400">LOC Added</div>
                    </div>
                    <div className="bg-gray-800 rounded p-2 text-center">
                      <div className="text-purple-400 font-bold">{repo.prsMerged}</div>
                      <div className="text-xs text-gray-400">PRs Merged</div>
                    </div>
                    <div className="bg-gray-800 rounded p-2 text-center">
                      <div className="text-blue-400 font-bold">{repo.commits}</div>
                      <div className="text-xs text-gray-400">Commits</div>
                    </div>
                  </div>
                  
                  <a 
                    href="#" 
                    className="block bg-gray-600 hover:bg-gray-500 text-white text-center py-2 rounded-md transition-colors text-sm"
                  >
                    View Contributions
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          {/* Export/Share Buttons - Full width */}
          <div className="lg:col-span-12 flex flex-col sm:flex-row justify-center gap-4 mt-2">
            <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors">
              <Download size={18} className="mr-2" />
              Download as Portfolio (PDF)
            </button>
            <button className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-md transition-colors">
              <Share2 size={18} className="mr-2" />
              Share Profile
            </button>
          </div>
        </div>
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>GitHub Contribution Analyzer &copy; 2025</p>
        </footer>
      </div>
    </div>
  );
}