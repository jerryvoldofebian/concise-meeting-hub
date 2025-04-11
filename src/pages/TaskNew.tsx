
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TaskForm from "@/components/meeting/TaskForm";
import { Task } from "@/types";

export default function TaskNew() {
  const navigate = useNavigate();

  const handleSaveTask = (task: Partial<Task>) => {
    // Here you would normally save the task to the database
    console.log("Task data:", task);
    
    // Redirect to tasks list
    navigate("/tasks");
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
