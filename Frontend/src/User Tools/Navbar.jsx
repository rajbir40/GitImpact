import React from 'react'
import { 
      NavigationMenu, 
      NavigationMenuItem, 
      NavigationMenuList,
      NavigationMenuLink 
    } from "@/components/ui/navigation-menu";
    import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <div>
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-primary">DisasterResponse</h1>
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-4">
                <NavigationMenuItem>
                  <NavigationMenuLink href="/dashboard" className="hover:text-primary">
                    Dashboard
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/report" className="hover:text-primary">
                    Report Disaster
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/volunteer" className="hover:text-primary">
                    Volunteer
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline">Login</Button>
            <Button>Register</Button>
          </div>
        </div>
      </nav>
    </div>
  )
}
