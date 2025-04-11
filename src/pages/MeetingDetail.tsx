
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Edit,
  MapPin,
  MoreHorizontal,
  Plus,
  Share2,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Meeting, Task } from "@/types";
import MinutesEditor from "@/components/meeting/MinutesEditor";
import TaskForm from "@/components/meeting/TaskForm";
import { useToast } from "@/hooks/use-toast";

export default function MeetingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingMinutes, setIsEditingMinutes] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [activeTab, setActiveTab] = useState("minutes");

  useEffect(() => {
    // Simulate API fetch for meeting details
    setLoading(true);
    setTimeout(() => {
      setMeeting({
        id: "1",
        title: "Weekly Team Standup",
        description: "Regular team sync to discuss progress and blockers",
        date: "2025-04-12",
        startTime: "10:00",
        endTime: "10:30",
        location: "Meeting Room A",
        isRecurring: true,
        recurringPattern: "weekly",
        createdBy: "user1",
        createdAt: "2025-04-05T10:00:00Z",
        updatedAt: "2025-04-05T10:00:00Z",
        attendees: [
          { id: "a1", userId: "user1", meetingId: "1", isPresent: true, isOptional: false },
          { id: "a2", userId: "user2", meetingId: "1", isPresent: true, isOptional: false },
          { id: "a3", userId: "user3", meetingId: "1", isPresent: true, isOptional: false },
          { id: "a4", userId: "user4", meetingId: "1", isPresent: false, isOptional: true },
        ],
        minutes: `# Weekly Team Standup\n\n## Agenda\n1. Progress updates\n2. Blockers discussion\n3. Planning for the week\n\n## Notes\n- John shared progress on the authentication feature\n- Mary is working on the API endpoints\n- Team discussed the upcoming deployment timeline\n\n## Action Items\n- Complete authentication feature by Friday\n- Schedule API review session\n- Prepare deployment checklist`,
      });
      
      setTasks([
        {
          id: "1",
          title: "Complete authentication feature",
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
          id: "2",
          title: "Schedule API review session",
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
          id: "3",
          title: "Prepare deployment checklist",
          assigneeId: "user3",
          meetingId: "1",
          dueDate: "2025-04-14",
          status: "pending",
          priority: "medium",
          createdBy: "user1",
          createdAt: "2025-04-05T10:00:00Z",
          updatedAt: "2025-04-05T10:00:00Z",
        },
      ]);
      
      setLoading(false);
    }, 500);
  }, [id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleSaveMinutes = (minutes: string) => {
    if (meeting) {
      // Here you would normally update the meeting minutes in the database
      const updatedMeeting = { ...meeting, minutes };
      setMeeting(updatedMeeting);
      setIsEditingMinutes(false);
      
      toast({
        title: "Minutes saved",
        description: "Meeting minutes have been updated successfully.",
      });
    }
  };

  const handleSaveTask = (task: Partial<Task>) => {
    // Here you would normally save the task to the database
    const newTask = {
      id: `task-${Date.now()}`,
      title: task.title || "",
      description: task.description,
      assigneeId: task.assigneeId || "user1",
      meetingId: meeting?.id || "",
      dueDate: task.dueDate,
      status: task.status || "pending",
      priority: task.priority || "medium",
      createdBy: "user1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Task;
    
    setTasks([...tasks, newTask]);
    setIsAddingTask(false);
    setActiveTab("tasks");
    
    toast({
      title: "Task created",
      description: "New task has been added successfully.",
    });
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AppNavbar />
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse">Loading meeting details...</div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!meeting) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AppNavbar />
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold mb-4">Meeting not found</h2>
                <p className="text-muted-foreground mb-8">The meeting you are looking for does not exist.</p>
                <Link to="/meetings">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Meetings
                  </Button>
                </Link>
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
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Link to="/meetings">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                  <h1 className="text-2xl font-bold tracking-tight">{meeting.title}</h1>
                  {meeting.isRecurring && (
                    <Badge variant="outline" className="ml-2 border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100">
                      Recurring
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" className="h-9">
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Link to={`/meetings/${meeting.id}/edit`}>
                    <Button variant="outline" size="sm" className="h-9">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link to={`/meetings/${meeting.id}/edit`} className="flex w-full">
                          Edit meeting
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Duplicate meeting</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Cancel meeting
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Meeting Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">Date</p>
                            <p className="text-muted-foreground">{formatDate(meeting.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">Time</p>
                            <p className="text-muted-foreground">{meeting.startTime} - {meeting.endTime}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">Location</p>
                            <p className="text-muted-foreground">{meeting.location}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">Attendees</p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {meeting.attendees?.map((attendee, index) => (
                                <div key={attendee.id} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                                  <Avatar className="h-5 w-5">
                                    <AvatarFallback className="text-xs">
                                      {String.fromCharCode(65 + index)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">User {index + 1}</span>
                                  {attendee.isOptional && (
                                    <Badge variant="outline" className="text-xs h-5">Optional</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="minutes">Minutes</TabsTrigger>
                      <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="minutes" className="mt-6">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>Meeting Minutes</CardTitle>
                          {!isEditingMinutes && (
                            <Button variant="outline" size="sm" onClick={() => setIsEditingMinutes(true)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Minutes
                            </Button>
                          )}
                        </CardHeader>
                        <CardContent>
                          {isEditingMinutes ? (
                            <MinutesEditor 
                              minutes={meeting.minutes || ""}
                              onSave={handleSaveMinutes}
                              onCancel={() => setIsEditingMinutes(false)}
                            />
                          ) : (
                            <div className="prose max-w-none">
                              {meeting.minutes ? (
                                <div className="whitespace-pre-wrap">
                                  {meeting.minutes}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <p className="text-muted-foreground">No meeting minutes have been recorded yet.</p>
                                  <Button variant="link" className="mt-2" onClick={() => setIsEditingMinutes(true)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Add Minutes
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="tasks" className="mt-6">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>Assigned Tasks</CardTitle>
                          {!isAddingTask && (
                            <Button variant="outline" size="sm" onClick={() => setIsAddingTask(true)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Task
                            </Button>
                          )}
                        </CardHeader>
                        <CardContent>
                          {isAddingTask ? (
                            <TaskForm 
                              meetingId={meeting.id}
                              onSave={handleSaveTask}
                              onCancel={() => setIsAddingTask(false)}
                            />
                          ) : (
                            <>
                              {tasks.length > 0 ? (
                                <div className="space-y-4">
                                  {tasks.map((task, index) => (
                                    <div key={task.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                                      <div className="flex items-start gap-3">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full 
                                          ${task.priority === 'high' ? 'bg-red-100 text-red-600' : 
                                            task.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 
                                            'bg-green-100 text-green-600'}`}>
                                          <span className="text-xs font-bold">{index + 1}</span>
                                        </div>
                                        <div>
                                          <p className="font-medium">{task.title}</p>
                                          <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center gap-1">
                                              <Avatar className="h-5 w-5">
                                                <AvatarFallback className="text-xs">
                                                  {task.assigneeId.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                              </Avatar>
                                              <span className="text-xs text-muted-foreground">User {task.assigneeId.slice(-1)}</span>
                                            </div>
                                            <Separator orientation="vertical" className="h-3" />
                                            <span className="text-xs text-muted-foreground">Due {new Date(task.dueDate || "").toLocaleDateString()}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center">
                                        <div className={`rounded-full px-2 py-1 text-xs font-medium
                                          ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                                            'bg-green-100 text-green-800'}`}>
                                          {task.status === 'pending' ? 'Pending' : 
                                            task.status === 'in-progress' ? 'In Progress' : 'Completed'}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <p className="text-muted-foreground">No tasks have been assigned for this meeting.</p>
                                  <Button variant="link" className="mt-2" onClick={() => setIsAddingTask(true)}>
                                    Add Task
                                  </Button>
                                </div>
                              )}
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt="User" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">John Doe created this meeting</p>
                            <p className="text-xs text-muted-foreground">April 5, 2025</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt="User" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">John Doe added meeting minutes</p>
                            <p className="text-xs text-muted-foreground">April 12, 2025</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt="User" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">John Doe assigned 3 tasks</p>
                            <p className="text-xs text-muted-foreground">April 12, 2025</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
