
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
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Team {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  members_count?: number;
  is_member?: boolean;
  is_admin?: boolean;
}

export default function Teams() {
  const [activeTab, setActiveTab] = useState("my-teams");
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTeams();
    }
  }, [user]);

  const fetchTeams = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch teams the user is a member of
      const { data: memberTeamsData, error: memberError } = await supabase
        .from('team_members')
        .select(`
          team_id,
          is_admin,
          teams:team_id (
            id,
            name,
            description,
            created_by,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      // Format my teams
      const formattedMyTeams = memberTeamsData
        .filter(item => item.teams) // Ensure teams data exists
        .map(item => ({
          ...item.teams,
          is_member: true,
          is_admin: item.is_admin
        }));

      setMyTeams(formattedMyTeams);

      // Fetch all teams
      const { data: allTeamsData, error: allTeamsError } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          description,
          created_by,
          created_at
        `);

      if (allTeamsError) throw allTeamsError;

      // Get member counts for each team
      const teamMemberCounts = await Promise.all(
        allTeamsData.map(async (team) => {
          const { count, error } = await supabase
            .from('team_members')
            .select('id', { count: 'exact', head: true })
            .eq('team_id', team.id);
          
          return {
            teamId: team.id,
            count: error ? 0 : (count || 0)
          };
        })
      );

      // Format all teams with member counts and member status
      const formattedAllTeams = allTeamsData.map(team => {
        const memberCount = teamMemberCounts.find(t => t.teamId === team.id)?.count || 0;
        const isMember = formattedMyTeams.some(t => t.id === team.id);
        
        return {
          ...team,
          members_count: memberCount,
          is_member: isMember
        };
      });

      setAllTeams(formattedAllTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast({
        title: "Error fetching teams",
        description: "Could not load your teams. Please try again later.",
        variant: "destructive"
      });
      
      // Fallback to empty arrays
      setMyTeams([]);
      setAllTeams([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!newTeam.name.trim()) {
      toast({
        title: "Team name required",
        description: "Please provide a name for your team.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Create the team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: newTeam.name.trim(),
          description: newTeam.description.trim() || null,
          created_by: user.id
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // 2. Add the creator as an admin member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: teamData.id,
          user_id: user.id,
          is_admin: true
        });

      if (memberError) throw memberError;

      toast({
        title: "Team created",
        description: `${newTeam.name} has been created successfully.`
      });

      // Reset form and reload data
      setNewTeam({ name: "", description: "" });
      setIsOpen(false);
      fetchTeams();
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Error creating team",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: user.id,
          is_admin: false
        });

      if (error) throw error;

      toast({
        title: "Team joined",
        description: "You have successfully joined the team."
      });

      fetchTeams();
    } catch (error) {
      console.error("Error joining team:", error);
      toast({
        title: "Error joining team",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Helper to format member count text
  const getMemberCountText = (count?: number) => {
    if (count === undefined) return "Loading...";
    return count === 1 ? "1 member" : `${count} members`;
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AppNavbar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Loading teams...</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

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
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-brand-600 hover:bg-brand-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Team
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <form onSubmit={handleCreateTeam}>
                        <DialogHeader>
                          <DialogTitle>Create New Team</DialogTitle>
                          <DialogDescription>
                            Add a new team to collaborate with your colleagues.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="team-name">Team Name</Label>
                            <Input 
                              id="team-name" 
                              placeholder="Enter team name"
                              value={newTeam.name}
                              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                              disabled={isSubmitting}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="team-description">Description (Optional)</Label>
                            <Textarea 
                              id="team-description" 
                              placeholder="Enter team description"
                              value={newTeam.description}
                              onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                              disabled={isSubmitting}
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            type="button" 
                            onClick={() => setIsOpen(false)}
                            disabled={isSubmitting}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            className="bg-brand-600 hover:bg-brand-700"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                              </>
                            ) : "Create Team"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="my-teams">My Teams</TabsTrigger>
                  <TabsTrigger value="all-teams">All Teams</TabsTrigger>
                </TabsList>
                
                <TabsContent value="my-teams" className="space-y-6">
                  {myTeams.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {myTeams.map((team) => (
                        <Card key={team.id} className="overflow-hidden">
                          <CardHeader>
                            <CardTitle>{team.name}</CardTitle>
                            <CardDescription>{team.description || "No description"}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <span>{getMemberCountText(team.members_count)}</span>
                              </div>
                              <Button variant="outline" size="sm">View Team</Button>
                            </div>
                          </CardContent>
                          {team.is_admin && (
                            <CardFooter className="bg-muted/50 px-6 py-3">
                              <span className="text-xs text-muted-foreground">You're an admin</span>
                            </CardFooter>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-white">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No teams yet</h3>
                      <p className="text-muted-foreground text-center max-w-md">
                        You are not a member of any teams yet. Create a new team or join an existing one.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="mt-6 bg-brand-600 hover:bg-brand-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Team
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Team</DialogTitle>
                            <DialogDescription>
                              Add a new team to collaborate with your colleagues.
                            </DialogDescription>
                          </DialogHeader>
                          {/* Form content would be here */}
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="all-teams" className="space-y-6">
                  {allTeams.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {allTeams.map((team) => (
                        <Card key={team.id} className="overflow-hidden">
                          <CardHeader>
                            <CardTitle>{team.name}</CardTitle>
                            <CardDescription>{team.description || "No description"}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{getInitials(team.name)}</AvatarFallback>
                                </Avatar>
                                <span>{getMemberCountText(team.members_count)}</span>
                              </div>
                              {team.is_member ? (
                                <Button variant="outline" size="sm">View Team</Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleJoinTeam(team.id)}
                                >
                                  Join Team
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-white">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No teams available</h3>
                      <p className="text-muted-foreground text-center max-w-md">
                        There are no teams in the system yet. Be the first to create a team!
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="mt-6 bg-brand-600 hover:bg-brand-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Team
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Team</DialogTitle>
                            <DialogDescription>
                              Add a new team to collaborate with your colleagues.
                            </DialogDescription>
                          </DialogHeader>
                          {/* Form content would be here */}
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
