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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import {
  Calendar,
  CheckSquare,
  Clock,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Task } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Tasks() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Update product roadmap document",
      description: "Add the new features we discussed in the planning meeting",
      assigneeId: "user1",
      meetingId: "1",
      dueDate: "2025-04-13",
      status: "pending",
      priority: "high",
      createdBy: "user2",
      createdAt: "2025-04-05T10:00:00Z",
      updatedAt: "2025-04-05T10:00:00Z",
    },
    {
      id: "2",
      title: "Prepare presentation for client meeting",
      description: "Create slides for the quarterly review",
      assigneeId: "user1",
      meetingId: "2",
      dueDate: "2025-04-14",
      status: "in-progress",
      priority: "medium",
      createdBy: "user1",
      createdAt: "2025-04-06T09:00:00Z",
      updatedAt: "2025-04-06T09:00:00Z",
    },
    {
      id: "3",
      title: "Review design mockups",
      description: "Review the new homepage designs and provide feedback",
      assigneeId: "user3",
      meetingId: "3",
      dueDate: "2025-04-15",
      status: "pending",
      priority: "low",
      createdBy: "user2",
      createdAt: "2025-04-07T14:00:00Z",
      updatedAt: "2025-04-07T14:00:00Z",
    },
    {
      id: "4",
      title: "Complete authentication feature",
      description: "Implement login, signup, and password reset functionality",
      assigneeId: "user1",
      meetingId: "1",
      dueDate: "2025-04-15",
      status: "in-progress",
      priority: "high",
      createdBy: "user1",
      createdAt: "2025-04-05T10:00:00Z",
      updatedAt: "2025-04-05T10:00:00Z",
    },
    {
      id: "5",
      title: "Schedule API review session",
      description: "Set up a meeting to review the API endpoints",
      assigneeId: "user2",
      meetingId: "1",
      dueDate: "2025-04-13",
      status: "pending",
      priority: "medium",
      createdBy: "user1",
      createdAt: "2025-04-05T10:00:00Z",
      updatedAt: "2025-04-05T10:00:00Z",
    },
    {
      id: "6",
      title: "Prepare deployment checklist",
      description: "Create a checklist for the upcoming deployment",
      assigneeId: "user3",
      meetingId: "1",
      dueDate: "2025-04-14",
      status: "completed",
      priority: "medium",
      createdBy: "user1",
      createdAt: "2025-04-05T10:00:00Z",
      updatedAt: "2025-04-08T10:00:00Z",
    },
  ]);

  const filterTasks = () => {
    if (activeTab === "all") return tasks;
    if (activeTab === "pending") return tasks.filter(t => t.status === "pending");
    if (activeTab === "in-progress") return tasks.filter(t => t.status === "in-progress");
    if (activeTab === "completed") return tasks.filter(t => t.status === "completed");
    return tasks;
  };

  const filteredTasks = filterTasks();

  const handleStatusChange = (taskId: string, newStatus: "pending" | "in-progress" | "completed") => {
    setIsLoading(true);
    
    setTimeout(() => {
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      );
      
      setTasks(updatedTasks);
      setIsLoading(false);
      
      toast({
        title: "Task updated",
        description: `Task status has been changed to ${newStatus.replace('-', ' ')}.`,
      });
    }, 500);
  };

  const handleDeleteTask = (taskId: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      setIsLoading(false);
      
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    }, 500);
  };

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
                  <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
                  <p className="text-muted-foreground">Manage and track tasks from your meetings.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link to="/tasks/new">
                    <Button className="bg-brand-600 hover:bg-brand-700">
                      <Plus className="mr-2 h-4 w-4" />
                      New Task
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-6">
                <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search tasks..."
                        className="pl-8 w-full"
                      />
                    </div>
                  </div>

                  <TabsContent value="all" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredTasks.map((task) => (
                        <Card key={task.id} className="overflow-hidden">
                          <CardHeader className="p-5">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  {task.title}
                                </CardTitle>
                                {task.description && (
                                  <CardDescription className="mt-1">
                                    {task.description.length > 100
                                      ? `${task.description.substring(0, 100)}...`
                                      : task.description}
                                  </CardDescription>
                                )}
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Link to={`/tasks/${task.id}`} className="flex w-full">
                                      View details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Link to={`/tasks/${task.id}/edit`} className="flex w-full">
                                      Edit task
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, "completed")}>
                                    Mark as completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, "in-progress")}>
                                    Mark as in progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, "pending")}>
                                    Mark as pending
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteTask(task.id)}
                                  >
                                    Delete task
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent className="p-5 pt-0">
                            <div className="flex items-center gap-4 mt-4">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src="/placeholder.svg" alt="User" />
                                  <AvatarFallback className="text-xs">
                                    {task.assigneeId.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                  User {task.assigneeId.slice(-1)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  Due {new Date(task.dueDate || "").toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <Badge
                                className={`
                                  ${task.priority === "high" 
                                    ? "bg-red-100 text-red-800" 
                                    : task.priority === "medium" 
                                      ? "bg-amber-100 text-amber-800" 
                                      : "bg-green-100 text-green-800"}
                                `}
                              >
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                              </Badge>
                              <Badge
                                className={`
                                  ${task.status === "pending" 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : task.status === "in-progress" 
                                      ? "bg-blue-100 text-blue-800" 
                                      : "bg-green-100 text-green-800"}
                                `}
                              >
                                {task.status === "pending" 
                                  ? "Pending" 
                                  : task.status === "in-progress" 
                                    ? "In Progress" 
                                    : "Completed"}
                              </Badge>
                            </div>
                            <div className="mt-4">
                              <Link to={`/meetings/${task.meetingId}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>From meeting</span>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {isLoading && (
                        <div className="col-span-full flex items-center justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                      )}
                      
                      {!isLoading && filteredTasks.length === 0 && (
                        <div className="col-span-full">
                          <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <CheckSquare className="h-10 w-10 text-muted-foreground" />
                              </div>
                              <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
                              <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                                You don't have any {activeTab !== "all" ? activeTab : ""} tasks. Create a new task to get started.
                              </p>
                              <Link to="/tasks/new">
                                <Button className="bg-brand-600 hover:bg-brand-700">
                                  <Plus className="mr-2 h-4 w-4" />
                                  Create New Task
                                </Button>
                              </Link>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pending" className="space-y-6">
                    {/* Same grid structure for pending tasks */}
                  </TabsContent>
                  
                  <TabsContent value="in-progress" className="space-y-6">
                    {/* Same grid structure for in-progress tasks */}
                  </TabsContent>
                  
                  <TabsContent value="completed" className="space-y-6">
                    {/* Same grid structure for completed tasks */}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
