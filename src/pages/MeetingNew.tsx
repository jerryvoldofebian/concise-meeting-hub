
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MeetingNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    isRecurring: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally save the meeting to the database
    console.log("Meeting data:", formData);
    
    // Redirect to meetings list
    navigate("/meetings");
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppNavbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-2 mb-6">
                <Link to="/meetings">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">New Meeting</h1>
              </div>

              <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Meeting Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Meeting Title</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        placeholder="Enter meeting title" 
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        placeholder="Enter meeting description" 
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> Date
                        </Label>
                        <Input 
                          id="date" 
                          name="date" 
                          type="date" 
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> Location
                        </Label>
                        <Input 
                          id="location" 
                          name="location" 
                          placeholder="Enter location or meeting link" 
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" /> Start Time
                        </Label>
                        <Input 
                          id="startTime" 
                          name="startTime" 
                          type="time" 
                          value={formData.startTime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="endTime" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" /> End Time
                        </Label>
                        <Input 
                          id="endTime" 
                          name="endTime" 
                          type="time" 
                          value={formData.endTime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isRecurring"
                        name="isRecurring"
                        checked={formData.isRecurring}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 focus:ring-brand-500"
                      />
                      <Label htmlFor="isRecurring" className="text-sm font-medium">
                        This is a recurring meeting
                      </Label>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" /> Attendees
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      You can add attendees after creating the meeting.
                    </p>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end gap-4">
                  <Link to="/meetings">
                    <Button variant="outline" type="button">Cancel</Button>
                  </Link>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                    Create Meeting
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
