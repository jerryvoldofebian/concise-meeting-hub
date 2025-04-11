
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users } from "lucide-react";
import { useState } from "react";

export default function Teams() {
  const [activeTab, setActiveTab] = useState("my-teams");
  
  // Sample teams data
  const teams = [
    {
      id: "1",
      name: "Product Team",
      description: "Product development and roadmap planning",
      members: 8
    },
    {
      id: "2",
      name: "Engineering",
      description: "Software development and infrastructure",
      members: 12
    },
    {
      id: "3",
      name: "Marketing",
      description: "Marketing strategy and campaigns",
      members: 6
    },
    {
      id: "4",
      name: "Leadership",
      description: "Executive planning and company direction",
      members: 5
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppNavbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
                  <p className="text-muted-foreground">Manage your teams and team members.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="bg-brand-600 hover:bg-brand-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Team
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="my-teams" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="my-teams">My Teams</TabsTrigger>
                  <TabsTrigger value="all-teams">All Teams</TabsTrigger>
                </TabsList>
                
                <TabsContent value="my-teams" className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {teams.map((team) => (
                      <Card key={team.id} className="overflow-hidden">
                        <CardHeader>
                          <CardTitle>{team.name}</CardTitle>
                          <CardDescription>{team.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-muted-foreground" />
                              <span>{team.members} members</span>
                            </div>
                            <Button variant="outline" size="sm">View Team</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="all-teams" className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {teams.map((team) => (
                      <Card key={team.id} className="overflow-hidden">
                        <CardHeader>
                          <CardTitle>{team.name}</CardTitle>
                          <CardDescription>{team.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{team.members} members</span>
                            </div>
                            <Button variant="outline" size="sm">Join Team</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
