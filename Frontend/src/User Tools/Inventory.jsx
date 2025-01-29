import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  Package, 
  Warehouse, 
  PlusCircle, 
  Minus, 
  Edit 
} from 'lucide-react';

const DisasterInventorySystem = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Water Bottles', category: 'Drinking', quantity: 5000, criticalThreshold: 1000 },
    { id: 2, name: 'Medical Kits', category: 'Medical', quantity: 500, criticalThreshold: 100 },
    { id: 3, name: 'Blankets', category: 'Shelter', quantity: 2000, criticalThreshold: 500 }
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: 0,
    criticalThreshold: 0
  });

  const handleQuantityChange = (id, delta) => {
    setInventory(inventory.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ));
  };

  const addNewItem = () => {
    if (newItem.name && newItem.category) {
      setInventory([
        ...inventory, 
        { 
          ...newItem, 
          id: inventory.length + 1 
        }
      ]);
      setNewItem({ name: '', category: '', quantity: 0, criticalThreshold: 0 });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <AlertTriangle className="mr-2 text-red-500" /> 
        Disaster Relief Inventory Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Warehouse className="mr-2" /> Current Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th>Item</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr 
                    key={item.id} 
                    className={item.quantity <= item.criticalThreshold 
                      ? 'bg-red-50 font-bold' 
                      : ''}
                  >
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <Minus size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <PlusCircle size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2" /> Add New Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input 
                placeholder="Item Name" 
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              />
              <Input 
                placeholder="Category" 
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              />
              <Input 
                type="number" 
                placeholder="Quantity" 
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
              />
              <Input 
                type="number" 
                placeholder="Critical Threshold" 
                value={newItem.criticalThreshold}
                onChange={(e) => setNewItem({...newItem, criticalThreshold: parseInt(e.target.value) || 0})}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={addNewItem} className="w-full">
              <PlusCircle className="mr-2" /> Add Item
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DisasterInventorySystem;