
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import {
  Calendar,
  CheckSquare,
  Clock,
  MoreVertical,
  Plus,
  Search,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [upcomingMeetings] = useState([
    {
      id: "1",
      title: "Weekly Team Standup",
      date: "2025-04-12T10:00:00",
      attendees: 6,
    },
    {
      id: "2",
      title: "Product Roadmap Review",
      date: "2025-04-14T14:00:00",
      attendees: 4,
    },
    {
      id: "3",
      title: "Client Project Kickoff",
      date: "2025-04-15T11:00:00",
      attendees: 8,
    },
  ]);

  const [recentTasks] = useState([
    {
      id: "1",
      title: "Update product roadmap document",
      assignee: "John Doe",
      dueDate: "2025-04-13",
      status: "pending",
      priority: "high",
    },
    {
      id: "2",
      title: "Prepare presentation for client meeting",
      assignee: "John Doe",
      dueDate: "2025-04-14",
      status: "in-progress",
      priority: "medium",
    },
    {
      id: "3",
      title: "Review design mockups",
      assignee: "Jane Smith",
      dueDate: "2025-04-15",
      status: "pending",
      priority: "low",
    },
  ]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppNavbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                  <p className="text-muted-foreground">
                    Welcome back! Here's an overview of your meetings and tasks.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-full rounded-md pl-8"
                    />
                  </div>
                  <Link to="/meetings/new">
                    <Button className="bg-brand-600 hover:bg-brand-700">
                      <Plus className="mr-2 h-4 w-4" />
                      New Meeting
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">45</div>
                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+4 new this week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                    <UsersRound className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">0 pending invitations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Meeting Hours</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24.5</div>
                    <p className="text-xs text-muted-foreground">-2 from last month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Upcoming Meetings</CardTitle>
                      <CardDescription>Your scheduled meetings for the next 7 days.</CardDescription>
                    </div>
                    <Link to="/meetings">
                      <Button variant="outline" size="sm">View all</Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingMeetings.map((meeting) => (
                        <div key={meeting.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{meeting.title}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(meeting.date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {Array(Math.min(3, meeting.attendees)).fill(0).map((_, i) => (
                                <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                  <AvatarFallback className="text-xs">
                                    {String.fromCharCode(65 + i)}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {meeting.attendees > 3 && (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                                  +{meeting.attendees - 3}
                                </div>
                              )}
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {upcomingMeetings.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No upcoming meetings</p>
                          <Button variant="link" asChild className="mt-2">
                            <Link to="/meetings/new">Schedule a meeting</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Tasks</CardTitle>
                      <CardDescription>Your assigned and created tasks.</CardDescription>
                    </div>
                    <Link to="/tasks">
                      <Button variant="outline" size="sm">View all</Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex items-start gap-3">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-full 
                              ${task.priority === 'high' ? 'bg-red-100 text-red-600' : 
                                task.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 
                                'bg-green-100 text-green-600'}`}>
                              <CheckSquare className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{task.title}</p>
                              <p className="text-sm text-muted-foreground">Due {new Date(task.dueDate).toLocaleDateString()}</p>
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
                            <Button variant="ghost" size="icon" className="h-7 w-7 ml-2">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {recentTasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <CheckSquare className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No tasks assigned</p>
                          <Button variant="link" asChild className="mt-2">
                            <Link to="/tasks/new">Create a task</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
