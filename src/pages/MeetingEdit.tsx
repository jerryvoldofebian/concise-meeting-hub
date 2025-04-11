
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Meeting } from "@/types";

export default function MeetingEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    isRecurring: false,
    recurringPattern: ""
  });

  useEffect(() => {
    if (!id) return;
    
    const fetchMeeting = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('meetings')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setFormData({
          title: data.title,
          description: data.description || "",
          date: data.date,
          startTime: data.start_time,
          endTime: data.end_time,
          location: data.location || "",
          isRecurring: data.is_recurring,
          recurringPattern: data.recurring_pattern || ""
        });
      } catch (error) {
        console.error("Error fetching meeting:", error);
        toast({
          title: "Error",
          description: "Failed to load meeting details. Please try again.",
          variant: "destructive",
        });
        navigate('/meetings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeeting();
  }, [id, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('meetings')
        .update({
          title: formData.title,
          description: formData.description || null,
          date: formData.date,
          start_time: formData.startTime,
          end_time: formData.endTime,
          location: formData.location || null,
          is_recurring: formData.isRecurring,
          recurring_pattern: formData.isRecurring ? formData.recurringPattern || 'weekly' : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Meeting updated",
        description: "Your meeting has been updated successfully.",
      });
      
      navigate(`/meetings/${id}`);
    } catch (error) {
      console.error("Error updating meeting:", error);
      toast({
        title: "Error",
        description: "Failed to update meeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppNavbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-2 mb-6">
                <Link to={`/meetings/${id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Edit Meeting</h1>
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                          disabled={isSubmitting}
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
                          disabled={isSubmitting}
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
                          disabled={isSubmitting}
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
                          disabled={isSubmitting}
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
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="isRecurring" className="text-sm font-medium">
                        This is a recurring meeting
                      </Label>
                    </div>
                    
                    {formData.isRecurring && (
                      <div className="space-y-2">
                        <Label htmlFor="recurringPattern">Recurring Pattern</Label>
                        <select
                          id="recurringPattern"
                          name="recurringPattern"
                          value={formData.recurringPattern}
                          onChange={handleInputChange as any}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          disabled={isSubmitting}
                        >
                          <option value="">Select frequency</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="bi-weekly">Bi-weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    )}
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
                      You can manage attendees after updating the meeting.
                    </p>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end gap-4">
                  <Link to={`/meetings/${id}`}>
                    <Button variant="outline" type="button" disabled={isSubmitting}>Cancel</Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="bg-brand-600 hover:bg-brand-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
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
