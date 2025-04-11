import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, Download, MoreHorizontal, Plus, Search, Share2, Users } from "lucide-react";
import { useState } from "react";
import { Meeting } from "@/types";

export default function Meetings() {
  const [activeTab, setActiveTab] = useState("all");
  
  const [meetings] = useState<Meeting[]>([
    {
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
    },
    {
      id: "2",
      title: "Product Roadmap Review",
      description: "Review product roadmap and prioritize features",
      date: "2025-04-14",
      startTime: "14:00",
      endTime: "15:00",
      location: "Conference Room B",
      isRecurring: false,
      createdBy: "user1",
      createdAt: "2025-04-06T09:00:00Z",
      updatedAt: "2025-04-06T09:00:00Z",
      attendees: [
        { id: "a5", userId: "user1", meetingId: "2", isPresent: true, isOptional: false },
        { id: "a6", userId: "user2", meetingId: "2", isPresent: true, isOptional: false },
        { id: "a7", userId: "user5", meetingId: "2", isPresent: true, isOptional: false },
        { id: "a8", userId: "user6", meetingId: "2", isPresent: true, isOptional: false },
      ],
    },
    {
      id: "3",
      title: "Client Project Kickoff",
      description: "Kickoff meeting with client to discuss project scope and timeline",
      date: "2025-04-15",
      startTime: "11:00",
      endTime: "12:30",
      location: "Virtual - Zoom",
      isRecurring: false,
      createdBy: "user2",
      createdAt: "2025-04-07T14:00:00Z",
      updatedAt: "2025-04-07T14:00:00Z",
      attendees: [
        { id: "a9", userId: "user1", meetingId: "3", isPresent: true, isOptional: false },
        { id: "a10", userId: "user2", meetingId: "3", isPresent: true, isOptional: false },
        { id: "a11", userId: "user3", meetingId: "3", isPresent: true, isOptional: false },
        { id: "a12", userId: "user4", meetingId: "3", isPresent: true, isOptional: false },
        { id: "a13", userId: "user7", meetingId: "3", isPresent: true, isOptional: false },
        { id: "a14", userId: "user8", meetingId: "3", isPresent: true, isOptional: false },
        { id: "a15", userId: "user9", meetingId: "3", isPresent: true, isOptional: false },
        { id: "a16", userId: "user10", meetingId: "3", isPresent: true, isOptional: false },
      ],
    },
    {
      id: "4",
      title: "Design Review",
      description: "Review new design concepts and gather feedback",
      date: "2025-04-16",
      startTime: "13:00",
      endTime: "14:00",
      location: "Meeting Room C",
      isRecurring: false,
      createdBy: "user3",
      createdAt: "2025-04-08T11:00:00Z",
      updatedAt: "2025-04-08T11:00:00Z",
      attendees: [
        { id: "a17", userId: "user1", meetingId: "4", isPresent: true, isOptional: false },
        { id: "a18", userId: "user3", meetingId: "4", isPresent: true, isOptional: false },
        { id: "a19", userId: "user5", meetingId: "4", isPresent: true, isOptional: false },
      ],
    },
  ]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const filterMeetings = () => {
    if (activeTab === "all") return meetings;
    if (activeTab === "upcoming") return meetings.filter(m => new Date(m.date) >= new Date());
    if (activeTab === "past") return meetings.filter(m => new Date(m.date) < new Date());
    if (activeTab === "recurring") return meetings.filter(m => m.isRecurring);
    return meetings;
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
                  <h1 className="text-2xl font-bold tracking-tight">Meetings</h1>
                  <p className="text-muted-foreground">Create, manage, and view your meeting records.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link to="/meetings/new">
                    <Button className="bg-brand-600 hover:bg-brand-700">
                      <Plus className="mr-2 h-4 w-4" />
                      New Meeting
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="recurring">Recurring</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="search" 
                        placeholder="Search meetings..." 
                        className="pl-8" 
                      />
                    </div>
                  </div>

                  <TabsContent value="all" className="space-y-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px]">Meeting</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Attendees</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterMeetings().map((meeting) => (
                            <TableRow key={meeting.id}>
                              <TableCell>
                                <div className="font-medium">{meeting.title}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                                  {meeting.description}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {formatDate(meeting.date)} · {meeting.startTime} - {meeting.endTime}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {meeting.location}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="flex -space-x-2 mr-2">
                                    {Array(Math.min(3, meeting.attendees?.length || 0)).fill(0).map((_, i) => (
                                      <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                        <AvatarFallback className="text-xs">
                                          {String.fromCharCode(65 + i)}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                  </div>
                                  {(meeting.attendees?.length || 0) > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{(meeting.attendees?.length || 0) - 3} more
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(meeting.date) < new Date() ? (
                                  <Badge variant="outline" className="bg-muted">Completed</Badge>
                                ) : (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Upcoming</Badge>
                                )}
                                {meeting.isRecurring && (
                                  <Badge variant="outline" className="ml-2 border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100">
                                    Recurring
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                      <Link to={`/meetings/${meeting.id}`} className="flex w-full">
                                        View details
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Link to={`/meetings/${meeting.id}/edit`} className="flex w-full">
                                        Edit meeting
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <div className="flex items-center gap-2">
                                        <Share2 className="h-4 w-4" />
                                        <span>Share minutes</span>
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <div className="flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        <span>Export to PDF</span>
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      Cancel meeting
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                          {filterMeetings().length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8">
                                <div className="flex flex-col items-center justify-center text-center">
                                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                    <Calendar className="h-10 w-10 text-muted-foreground" />
                                  </div>
                                  <h3 className="mt-4 text-lg font-semibold">No meetings found</h3>
                                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                                    You don't have any meetings in this category.
                                  </p>
                                  <Link to="/meetings/new">
                                    <Button className="bg-brand-600 hover:bg-brand-700">
                                      <Plus className="mr-2 h-4 w-4" />
                                      Schedule a Meeting
                                    </Button>
                                  </Link>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="upcoming" className="space-y-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px]">Meeting</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Attendees</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterMeetings().map((meeting) => (
                            <TableRow key={meeting.id}>
                              <TableCell>
                                <div className="font-medium">{meeting.title}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                                  {meeting.description}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {formatDate(meeting.date)} · {meeting.startTime} - {meeting.endTime}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {meeting.location}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="flex -space-x-2 mr-2">
                                    {Array(Math.min(3, meeting.attendees?.length || 0)).fill(0).map((_, i) => (
                                      <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                        <AvatarFallback className="text-xs">
                                          {String.fromCharCode(65 + i)}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                  </div>
                                  {(meeting.attendees?.length || 0) > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{(meeting.attendees?.length || 0) - 3} more
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(meeting.date) < new Date() ? (
                                  <Badge variant="outline" className="bg-muted">Completed</Badge>
                                ) : (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Upcoming</Badge>
                                )}
                                {meeting.isRecurring && (
                                  <Badge variant="outline" className="ml-2 border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100">
                                    Recurring
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                      <Link to={`/meetings/${meeting.id}`} className="flex w-full">
                                        View details
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Link to={`/meetings/${meeting.id}/edit`} className="flex w-full">
                                        Edit meeting
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <div className="flex items-center gap-2">
                                        <Share2 className="h-4 w-4" />
                                        <span>Share minutes</span>
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <div className="flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        <span>Export to PDF</span>
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      Cancel meeting
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                          {filterMeetings().length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8">
                                <div className="flex flex-col items-center justify-center text-center">
                                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                    <Calendar className="h-10 w-10 text-muted-foreground" />
                                  </div>
                                  <h3 className="mt-4 text-lg font-semibold">No meetings found</h3>
                                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                                    You don't have any meetings in this category.
                                  </p>
                                  <Link to="/meetings/new">
                                    <Button className="bg-brand-600 hover:bg-brand-700">
                                      <Plus className="mr-2 h-4 w-4" />
                                      Schedule a Meeting
                                    </Button>
                                  </Link>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="past" className="space-y-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px]">Meeting</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Attendees</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterMeetings().map((meeting) => (
                            <TableRow key={meeting.id}>
                              <TableCell>
                                <div className="font-medium">{meeting.title}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                                  {meeting.description}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {formatDate(meeting.date)} · {meeting.startTime} - {meeting.endTime}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {meeting.location}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="flex -space-x-2 mr-2">
                                    {Array(Math.min(3, meeting.attendees?.length || 0)).fill(0).map((_, i) => (
                                      <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                        <AvatarFallback className="text-xs">
                                          {String.fromCharCode(65 + i)}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                  </div>
                                  {(meeting.attendees?.length || 0) > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{(meeting.attendees?.length || 0) - 3} more
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(meeting.date) < new Date() ? (
                                  <Badge variant="outline" className="bg-muted">Completed</Badge>
                                ) : (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Upcoming</Badge>
                                )}
                                {meeting.isRecurring && (
                                  <Badge variant="outline" className="ml-2 border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100">
                                    Recurring
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                      <Link to={`/meetings/${meeting.id}`} className="flex w-full">
                                        View details
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Link to={`/meetings/${meeting.id}/edit`} className="flex w-full">
                                        Edit meeting
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <div className="flex items-center gap-2">
                                        <Share2 className="h-4 w-4" />
                                        <span>Share minutes</span>
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <div className="flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        <span>Export to PDF</span>
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      Cancel meeting
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                          {filterMeetings().length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8">
                                <div className="flex flex-col items-center justify-center text-center">
                                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                    <Calendar className="h-10 w-10 text-muted-foreground" />
                                  </div>
                                  <h3 className="mt-4 text-lg font-semibold">No meetings found</h3>
                                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                                    You don't have any meetings in this category.
                                  </p>
                                  <Link to="/meetings/new">
                                    <Button className="bg-brand-600 hover:bg-brand-700">
                                      <Plus className="mr-2 h-4 w-4" />
                                      Schedule a Meeting
                                    </Button>
                                  </Link>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recurring" className="space-y-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px]">Meeting</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Attendees</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterMeetings().map((meeting) => (
                            <TableRow key={meeting.id}>
                              <TableCell>
                                <div className="font-medium">{meeting.title}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                                  {meeting.description}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {formatDate(meeting.date)} · {meeting.startTime} - {meeting.endTime}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {meeting.location}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="flex -space-x-2 mr-2">
                                    {Array(Math.min(3, meeting.attendees?.length || 0)).fill(0).map((_, i) => (
                                      <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                        <AvatarFallback className="text-xs">
                                          {String.fromCharCode(65 + i)}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                  </div>
                                  {(meeting.attendees?.length || 0) > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{(meeting.attendees?.length || 0) - 3} more
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(meeting.date) < new Date() ? (
                                  <Badge variant="outline" className="bg-muted">Completed</Badge>
                                ) : (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Upcoming</Badge>
                                )}
                                {meeting.isRecurring && (
                                  <Badge variant="outline" className="ml-2 border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100">
                                    Recurring
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                      <Link to={`/meetings/${meeting.id}`} className="flex w-full">
                                        View details
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Link to={`/meetings/${meeting.id}/edit`} className="flex w-full">
                                        Edit meeting
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <div className="flex items-center gap-2">
                                        <Share2 className="h-4 w-4" />
                                        <span>Share minutes</span>
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <div className="flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        <span>Export to PDF</span>
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      Cancel meeting
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                          {filterMeetings().length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8">
                                <div className="flex flex-col items-center justify-center text-center">
                                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                    <Calendar className="h-10 w-10 text-muted-foreground" />
                                  </div>
                                  <h3 className="mt-4 text-lg font-semibold">No meetings found</h3>
                                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                                    You don't have any meetings in this category.
                                  </p>
                                  <Link to="/meetings/new">
                                    <Button className="bg-brand-600 hover:bg-brand-700">
                                      <Plus className="mr-2 h-4 w-4" />
                                      Schedule a Meeting
                                    </Button>
                                  </Link>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
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
