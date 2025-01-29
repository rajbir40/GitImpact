import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Shield, 
  Users, 
  Bell, 
  MapPin, 
  HandHelping 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuList,
  NavigationMenuLink 
} from "@/components/ui/navigation-menu";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

const DisasterResponseHomePage = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const mockAlerts = [
        { id: 1, type: 'Earthquake', location: 'California', severity: 'High' },
        { id: 2, type: 'Hurricane', location: 'Florida Coast', severity: 'Medium' }
      ];
      setAlerts(mockAlerts);
    };

    fetchAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      

      {/* Hero Section */}
      <header className="container mx-auto text-center py-20 space-y-6">
        <h2 className="text-5xl font-bold">Respond. Recover. Rebuild.</h2>
        <p className="text-xl text-muted-foreground">Empowering communities in times of crisis</p>
        <Button size="lg" className="mt-6">Get Started</Button>
      </header>

      <Separator />

      {/* Features Overview */}
      <section className="container mx-auto py-16 space-y-12">
        <h3 className="text-3xl text-center font-semibold">Our Key Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: Shield, 
              title: "AI Disaster Prediction", 
              description: "Advanced AI technology to forecast and mitigate potential disasters.",
              color: "text-blue-600"
            },
            { 
              icon: MapPin, 
              title: "Inventory Management", 
              description: "Real-time tracking of resources and supplies for efficient distribution.",
              color: "text-green-600"
            },
            { 
              icon: Users, 
              title: "Volunteer Management", 
              description: "Connect volunteers with critical disaster response efforts.",
              color: "text-purple-600"
            }
          ].map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className={`mx-auto mb-4 ${feature.color}`} size={64} />
                <CardTitle className="text-center">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Real-Time Alerts */}
      <section className="bg-secondary/10 py-16">
        <div className="container mx-auto space-y-12">
          <h3 className="text-3xl text-center font-semibold">Current Disaster Alerts</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {alerts.map(alert => (
              <Card key={alert.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{alert.type} Alert</CardTitle>
                  <Badge variant="destructive">{alert.severity}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Bell className="text-destructive" size={48} />
                    <div>
                      <p>Location: {alert.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Button variant="link" className="text-left">Privacy Policy</Button>
              <Button variant="link" className="text-left">Terms of Service</Button>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <Button variant="outline">Facebook</Button>
              <Button variant="outline">Twitter</Button>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Contact</h4>
            <p>support@disasterresponse.org</p>
            <p>1-800-DISASTER</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DisasterResponseHomePage;