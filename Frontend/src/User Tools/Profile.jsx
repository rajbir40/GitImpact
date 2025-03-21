import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Github, Link2, Users, Star, GitFork } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  // Sample data - would come from your API
  const activityData = [
    { month: 'Jan', prs: 12, issues: 8, loc: 1200 },
    { month: 'Feb', prs: 15, issues: 10, loc: 1500 },
    { month: 'Mar', prs: 8, issues: 12, loc: 800 },
    { month: 'Apr', prs: 20, issues: 15, loc: 2000 },
  ];

  const repositories = [
    { name: 'awesome-project', stars: 120, forks: 35, description: 'A groundbreaking open source project' },
    { name: 'cool-library', stars: 89, forks: 22, description: 'Useful utility functions for developers' },
  ];

  const achievements = [
    { name: 'Super Contributor', description: '100+ PRs merged' },
    { name: 'Bug Hunter', description: '50+ issues resolved' },
    { name: 'Team Player', description: 'Collaborated with 20+ developers' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-6 bg-white rounded-lg p-6 shadow-lg"
      >
        <Avatar className="w-24 h-24">
          <img src="/api/placeholder/96/96" alt="Profile" className="rounded-full" />
        </Avatar>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Sarah Developer</h1>
          <p className="text-gray-600">Senior Software Engineer passionate about open source</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>1.2k followers</span>
            </div>
            <div className="flex items-center gap-2">
              <Github size={16} />
              <a href="#" className="text-blue-600">@sarahdev</a>
            </div>
            <div className="flex items-center gap-2">
              <Link2 size={16} />
              <a href="#" className="text-blue-600">portfolio.dev</a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contribution Score */}
      <Card>
        <CardHeader>
          <CardTitle>Contribution Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-center text-green-600">856</div>
          <p className="text-center text-gray-600 mt-2">Based on impact and collaboration</p>
        </CardContent>
      </Card>

      {/* Activity Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="prs" stroke="#8884d8" />
                <Line type="monotone" dataKey="issues" stroke="#82ca9d" />
                <Line type="monotone" dataKey="loc" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Repositories */}
      <Card>
        <CardHeader>
          <CardTitle>Top Repositories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {repositories.map((repo) => (
              <div key={repo.name} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{repo.name}</h3>
                    <p className="text-gray-600">{repo.description}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <Star size={16} />
                      <span>{repo.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork size={16} />
                      <span>{repo.forks}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Badges & Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.name}
                whileHover={{ scale: 1.05 }}
                className="p-4 border rounded-lg text-center"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2" />
                <h3 className="font-semibold">{achievement.name}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;