
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TaskForm from "@/components/meeting/TaskForm";
import { Task } from "@/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function TaskNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSaveTask = async (task: Partial<Task>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be signed in to create tasks.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Format the task for Supabase (snake_case)
      const { data, error } = await supabase.from('tasks').insert({
        title: task.title,
        description: task.description,
        assignee_id: task.assigneeId,
        meeting_id: task.meetingId,
        due_date: task.dueDate,
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        created_by: user.id
      });

      if (error) throw error;

      toast({
        title: "Task created",
        description: "Your task has been created successfully."
      });
      
      // Redirect to tasks list
      navigate("/tasks");
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error creating task",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
                <Link to="/tasks">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">New Task</h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Task Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaskForm 
                    onSave={handleSaveTask}
                    onCancel={() => navigate("/tasks")}
                    isSubmitting={isSubmitting}
                  />
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
