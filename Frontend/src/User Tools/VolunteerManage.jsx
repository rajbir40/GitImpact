import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Plus, 
  Package 
} from 'lucide-react';

const VolunteerDonationSystem = () => {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([{ item: '', quantity: 0 }]);

  useEffect(() => {
    // Fetch user data from backend after authentication
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const submitDonation = async () => {
    try {
      const response = await fetch('/api/donations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          donations: donations.filter(d => d.item && d.quantity > 0)
        })
      });

      if (response.ok) {
        alert('Donations submitted successfully!');
        setDonations([{ item: '', quantity: 0 }]);
      }
    } catch (error) {
      console.error('Donation submission failed:', error);
    }
  };

  const updateDonation = (index, field, value) => {
    const newDonations = [...donations];
    newDonations[index][field] = value;
    setDonations(newDonations);
  };

  const addDonationRow = () => {
    setDonations([...donations, { item: '', quantity: 0 }]);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <Heart className="mr-2 text-red-500" /> 
        Donation Registration
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2" /> Your Donations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="font-bold">Volunteer: {user.name}</div>
            {donations.map((donation, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input 
                  placeholder="Item Name" 
                  value={donation.item}
                  onChange={(e) => updateDonation(index, 'item', e.target.value)}
                />
                <Input 
                  type="number" 
                  placeholder="Quantity" 
                  value={donation.quantity}
                  onChange={(e) => updateDonation(index, 'quantity', parseInt(e.target.value) || 0)}
                />
              </div>
            ))}
            <div className="flex space-x-2">
              <Button onClick={addDonationRow} variant="outline">
                <Plus className="mr-2" /> Add Donation
              </Button>
              <Button onClick={submitDonation}>
                Submit Donations
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerDonationSystem;