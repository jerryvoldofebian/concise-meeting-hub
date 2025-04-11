
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BadgeInfo,
  Bell,
  Check,
  Cog,
  FileText,
  Loader2,
  Mail,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [saveLoading, setSaveLoading] = useState(false);
  
  const [users] = useState([
    { id: "1", name: "John Doe", email: "john@example.com", role: "admin", status: "active" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user", status: "active" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "user", status: "active" },
    { id: "4", name: "Alice Williams", email: "alice@example.com", role: "user", status: "inactive" },
  ]);
  
  const [appSettings, setAppSettings] = useState({
    companyName: "Acme Inc",
    defaultMeetingDuration: 30,
    emailNotifications: true,
  });
  
  const [userSettings, setUserSettings] = useState({
    name: "John Doe",
    email: "john@example.com",
    emailNotifications: true,
    pushNotifications: true,
  });
  
  const handleAppSettingsSave = () => {
    setSaveLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaveLoading(false);
      toast({
        title: "Settings saved",
        description: "Your application settings have been saved successfully.",
      });
    }, 1000);
  };
  
  const handleUserSettingsSave = () => {
    setSaveLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaveLoading(false);
      toast({
        title: "Settings saved",
        description: "Your user settings have been saved successfully.",
      });
    }, 1000);
  };
  
  const handleInviteUser = () => {
    toast({
      title: "User invited",
      description: "An invitation has been sent to the user.",
    });
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppNavbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                  <p className="text-muted-foreground">
                    Manage your account settings and application preferences.
                  </p>
                </div>
              </div>

              <Tabs defaultValue="app" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="app" className="flex items-center">
                    <Cog className="mr-2 h-4 w-4" />
                    <span>App Settings</span>
                  </TabsTrigger>
                  <TabsTrigger value="account" className="flex items-center">
                    <BadgeInfo className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Team Members</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="app">
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Settings</CardTitle>
                      <CardDescription>
                        Configure global settings for your application.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company/Team Name</Label>
                        <Input 
                          id="company" 
                          value={appSettings.companyName}
                          onChange={(e) => setAppSettings({...appSettings, companyName: e.target.value})}
                        />
                        <p className="text-sm text-muted-foreground">
                          This name will appear in emails, exports and other branded areas.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="meeting-duration">Default Meeting Duration</Label>
                        <Select 
                          defaultValue={appSettings.defaultMeetingDuration.toString()}
                          onValueChange={(value) => setAppSettings({...appSettings, defaultMeetingDuration: parseInt(value)})}
                        >
                          <SelectTrigger id="meeting-duration">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                            <SelectItem value="90">90 minutes</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          The default duration when creating new meetings.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <Switch 
                            id="email-notifications" 
                            checked={appSettings.emailNotifications}
                            onCheckedChange={(checked) => setAppSettings({...appSettings, emailNotifications: checked})}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Send email notifications for meeting invites, updates, and task assignments.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="logo">Upload Logo</Label>
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                          <Button variant="outline" size="sm">
                            Upload Logo
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Your logo will appear on meeting minutes exports and in the application.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button 
                        onClick={handleAppSettingsSave}
                        disabled={saveLoading}
                        className="bg-brand-600 hover:bg-brand-700"
                      >
                        {saveLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="account">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                          Update your account details and preferences.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                            <Avatar className="h-20 w-20">
                              <AvatarImage src="/placeholder.svg" alt="User" />
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-2 text-center sm:text-left">
                              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                Change Avatar
                              </Button>
                              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground">
                                Remove Photo
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={userSettings.name}
                            onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={userSettings.email}
                            onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button 
                          onClick={handleUserSettingsSave}
                          disabled={saveLoading}
                          className="bg-brand-600 hover:bg-brand-700"
                        >
                          {saveLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                          Manage how you receive notifications.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <Label htmlFor="email-notifications">Email Notifications</Label>
                            </div>
                            <Switch 
                              id="email-notifications" 
                              checked={userSettings.emailNotifications}
                              onCheckedChange={(checked) => setUserSettings({...userSettings, emailNotifications: checked})}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground pl-6">
                            Receive email notifications about meetings, tasks, and updates.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Bell className="h-4 w-4 text-muted-foreground" />
                              <Label htmlFor="push-notifications">Push Notifications</Label>
                            </div>
                            <Switch 
                              id="push-notifications" 
                              checked={userSettings.pushNotifications}
                              onCheckedChange={(checked) => setUserSettings({...userSettings, pushNotifications: checked})}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground pl-6">
                            Receive browser notifications for task assignments and mentions.
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={handleUserSettingsSave} className="bg-brand-600 hover:bg-brand-700">
                          Save Preferences
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="users">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <CardTitle>Team Members</CardTitle>
                          <CardDescription>
                            Manage team members and their access permissions.
                          </CardDescription>
                        </div>
                        <Button onClick={handleInviteUser} className="bg-brand-600 hover:bg-brand-700">
                          <Plus className="mr-2 h-4 w-4" />
                          Invite User
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="relative mb-6">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users by name or email..."
                          className="pl-8"
                        />
                      </div>
                      
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>{user.name.charAt(0)}{user.name.split(" ")[1]?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium">{user.name}</div>
                                      <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Select defaultValue={user.role}>
                                    <SelectTrigger className="w-32">
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="admin">Admin</SelectItem>
                                      <SelectItem value="user">User</SelectItem>
                                      <SelectItem value="guest">Guest</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  {user.status === "active" ? (
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                      <Check className="mr-1 h-3 w-3" />
                                      Active
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                      Pending
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="icon" disabled={user.id === "1"}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
