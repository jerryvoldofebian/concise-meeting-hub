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
  CheckCircle,
  Clock,
  Download,
  Edit,
  FileEdit,
  MapPin,
  MoreHorizontal,
  Plus,
  Share2,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Meeting, Task, User } from "@/types";
import MinutesEditor from "@/components/meeting/MinutesEditor";
import TaskForm from "@/components/meeting/TaskForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function MeetingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingMinutes, setIsEditingMinutes] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [activeTab, setActiveTab] = useState("minutes");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [saveInProgress, setSaveInProgress] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchMeetingDetails = async () => {
      setLoading(true);
      try {
        const { data: meetingData, error: meetingError } = await supabase
          .from('meetings')
          .select('*')
          .eq('id', id)
          .single();
        
        if (meetingError) throw meetingError;
        
        const { data: attendeesData, error: attendeesError } = await supabase
          .from('meeting_attendees')
          .select('*, user:profiles(id, first_name, last_name, avatar)')
          .eq('meeting_id', id);
        
        if (attendeesError) throw attendeesError;
        
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*, assignee:profiles(id, first_name, last_name, avatar)')
          .eq('meeting_id', id);
        
        if (tasksError) throw tasksError;
        
        const meetingWithAttendees: Meeting = {
          ...meetingData,
          attendees: attendeesData.map(a => ({
            id: a.id,
            userId: a.user_id,
            meetingId: a.meeting_id,
            isPresent: a.is_present,
            isOptional: a.is_optional,
            user: a.user ? {
              id: a.user.id,
              firstName: a.user.first_name,
              lastName: a.user.last_name,
              avatar: a.user.avatar,
              email: '',
              role: 'user',
              createdAt: ''
            } : undefined
          }))
        };
        
        const formattedTasks: Task[] = tasksData.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description,
          assigneeId: t.assignee_id,
          assignee: t.assignee ? {
            id: t.assignee.id,
            firstName: t.assignee.first_name,
            lastName: t.assignee.last_name,
            avatar: t.assignee.avatar,
            email: '',
            role: 'user',
            createdAt: ''
          } : undefined,
          meetingId: t.meeting_id,
          dueDate: t.due_date,
          status: t.status as 'pending' | 'in-progress' | 'completed' | 'cancelled',
          priority: t.priority as 'low' | 'medium' | 'high',
          createdBy: t.created_by,
          createdAt: t.created_at,
          updatedAt: t.updated_at
        }));
        
        setMeeting(meetingWithAttendees);
        setTasks(formattedTasks);
      } catch (error) {
        console.error("Error fetching meeting details:", error);
        toast({
          title: "Error",
          description: "Failed to load meeting details. Please try again.",
          variant: "destructive",
        });
        
        if (process.env.NODE_ENV === 'development') {
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
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeetingDetails();
  }, [id, toast]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleSaveMinutes = async (minutes: string) => {
    if (!meeting || !id) return;
    
    setSaveInProgress(true);
    try {
      const { error } = await supabase
        .from('meetings')
        .update({ minutes, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      setMeeting({
        ...meeting,
        minutes
      });
      
      setIsEditingMinutes(false);
      toast({
        title: "Minutes saved",
        description: "Meeting minutes have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving meeting minutes:", error);
      toast({
        title: "Error",
        description: "Failed to save meeting minutes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaveInProgress(false);
    }
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    setSaveInProgress(true);
    try {
      if (editingTask) {
        const { error } = await supabase
          .from('tasks')
          .update({
            title: taskData.title,
            description: taskData.description,
            assignee_id: taskData.assigneeId,
            due_date: taskData.dueDate,
            status: taskData.status,
            priority: taskData.priority,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTask.id);
        
        if (error) throw error;
        
        setTasks(tasks.map(task => 
          task.id === editingTask.id 
            ? { ...task, ...taskData, updatedAt: new Date().toISOString() } 
            : task
        ));
        
        toast({
          title: "Task updated",
          description: "Task has been updated successfully.",
        });
      } else {
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            title: taskData.title,
            description: taskData.description,
            assignee_id: taskData.assigneeId,
            meeting_id: meeting?.id,
            due_date: taskData.dueDate,
            status: taskData.status || 'pending',
            priority: taskData.priority || 'medium',
            created_by: user?.id || '',
          })
          .select();
        
        if (error) throw error;
        
        const newTask: Task = {
          id: data[0].id,
          title: data[0].title,
          description: data[0].description,
          assigneeId: data[0].assignee_id,
          meetingId: data[0].meeting_id,
          dueDate: data[0].due_date,
          status: data[0].status as 'pending' | 'in-progress' | 'completed' | 'cancelled',
          priority: data[0].priority as 'low' | 'medium' | 'high',
          createdBy: data[0].created_by,
          createdAt: data[0].created_at,
          updatedAt: data[0].updated_at
        };
        
        setTasks([...tasks, newTask]);
        toast({
          title: "Task created",
          description: "New task has been added successfully.",
        });
      }
      
      setEditingTask(null);
      setIsAddingTask(false);
      setActiveTab("tasks");
    } catch (error) {
      console.error("Error saving task:", error);
      toast({
        title: "Error",
        description: "Failed to save task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaveInProgress(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsAddingTask(true);
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: 'pending' | 'in-progress' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', taskId);
      
      if (error) throw error;
      
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } 
          : task
      ));
      
      toast({
        title: "Status updated",
        description: `Task status has been updated to ${newStatus.replace('-', ' ')}.`,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportMeetingMinutes = () => {
    if (!meeting || !meeting.minutes) return;
    
    const fileName = `meeting_minutes_${meeting.id}.md`;
    const blob = new Blob([meeting.minutes], { type: 'text/markdown' });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    
    toast({
      title: "Export successful",
      description: "Meeting minutes have been exported as markdown.",
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
                  <Button variant="outline" size="sm" className="h-9" onClick={exportMeetingMinutes}>
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
                                    <AvatarImage src={attendee.user?.avatar} />
                                    <AvatarFallback className="text-xs">
                                      {attendee.user?.firstName?.[0] || String.fromCharCode(65 + index)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">
                                    {attendee.user 
                                      ? `${attendee.user.firstName} ${attendee.user.lastName}` 
                                      : `User ${index + 1}`}
                                  </span>
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
                              {meeting.minutes ? (
                                <>
                                  <FileEdit className="mr-2 h-4 w-4" />
                                  Edit Minutes
                                </>
                              ) : (
                                <>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Minutes
                                </>
                              )}
                            </Button>
                          )}
                        </CardHeader>
                        <CardContent>
                          {isEditingMinutes ? (
                            <MinutesEditor 
                              minutes={meeting.minutes || ""}
                              onSave={handleSaveMinutes}
                              onCancel={() => setIsEditingMinutes(false)}
                              meetingId={meeting.id}
                              isSubmitting={saveInProgress}
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
                                    <Plus className="mr-2 h-4 w-4" />
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
                            <Button variant="outline" size="sm" onClick={() => {
                              setEditingTask(null);
                              setIsAddingTask(true);
                            }}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Task
                            </Button>
                          )}
                        </CardHeader>
                        <CardContent>
                          {isAddingTask ? (
                            <TaskForm 
                              task={editingTask || undefined}
                              meetingId={meeting.id}
                              onSave={handleSaveTask}
                              onCancel={() => {
                                setIsAddingTask(false);
                                setEditingTask(null);
                              }}
                              isSubmitting={saveInProgress}
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
                                                <AvatarImage src={task.assignee?.avatar} />
                                                <AvatarFallback className="text-xs">
                                                  {task.assignee?.firstName?.[0] || task.assigneeId.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                              </Avatar>
                                              <span className="text-xs text-muted-foreground">
                                                {task.assignee 
                                                  ? `${task.assignee.firstName} ${task.assignee.lastName}` 
                                                  : `User ${task.assigneeId.slice(-1)}`}
                                              </span>
                                            </div>
                                            <Separator orientation="vertical" className="h-3" />
                                            <span className="text-xs text-muted-foreground">Due {new Date(task.dueDate || "").toLocaleDateString()}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className={`rounded-full px-2 py-1 text-xs font-medium
                                          ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'}`}>
                                          {task.status === 'pending' ? 'Pending' : 
                                            task.status === 'in-progress' ? 'In Progress' : 
                                            task.status === 'completed' ? 'Completed' : 'Cancelled'}
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                              <Edit className="mr-2 h-4 w-4" />
                                              Edit Task
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                            <DropdownMenuItem 
                                              onClick={() => handleUpdateTaskStatus(task.id, 'pending')}
                                              disabled={task.status === 'pending'}
                                            >
                                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 mr-2">
                                                Pending
                                              </Badge>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}
                                              disabled={task.status === 'in-progress'}
                                            >
                                              <Badge variant="outline" className="bg-blue-100 text-blue-800 mr-2">
                                                In Progress
                                              </Badge>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                                              disabled={task.status === 'completed'}
                                            >
                                              <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                                                Completed
                                              </Badge>
                                              <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => handleUpdateTaskStatus(task.id, 'cancelled')}
                                              disabled={task.status === 'cancelled'}
                                              className="text-red-600"
                                            >
                                              <Badge variant="outline" className="bg-red-100 text-red-800 mr-2">
                                                Cancelled
                                              </Badge>
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
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
