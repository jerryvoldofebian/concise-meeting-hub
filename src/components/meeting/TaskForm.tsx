
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, User } from "@/types";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TaskFormProps {
  task?: Task;
  meetingId?: string;
  onSave: (task: Partial<Task>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function TaskForm({ task, meetingId, onSave, onCancel, isSubmitting = false }: TaskFormProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    assigneeId: "",
    meetingId: meetingId || "",
    dueDate: "",
    status: "pending",
    priority: "medium",
  });

  const [users, setUsers] = useState<Partial<User>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users from Supabase
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name');
        
        if (error) throw error;
        setUsers(data.map(user => ({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name
        })));
      } catch (error) {
        console.error("Error fetching users:", error);
        // Fallback to mock data if there's an error
        setUsers([
          { id: "user1", firstName: "John", lastName: "Doe" },
          { id: "user2", firstName: "Jane", lastName: "Smith" },
          { id: "user3", firstName: "Mike", lastName: "Johnson" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        dueDate: task.dueDate || ""
      });
    } else if (meetingId) {
      setFormData(prev => ({
        ...prev,
        meetingId
      }));
    }
  }, [task, meetingId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input 
          id="title" 
          name="title" 
          placeholder="Enter task title" 
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
          placeholder="Enter task description" 
          value={formData.description || ""}
          onChange={handleInputChange}
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assigneeId">Assignee</Label>
          <Select 
            name="assigneeId" 
            value={formData.assigneeId} 
            onValueChange={(value) => handleSelectChange("assigneeId", value)}
            disabled={isSubmitting || loading}
          >
            <SelectTrigger>
              <SelectValue placeholder={loading ? "Loading users..." : "Select assignee"} />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id || ""}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input 
            id="dueDate" 
            name="dueDate" 
            type="date" 
            value={formData.dueDate}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select 
            name="priority" 
            value={formData.priority} 
            onValueChange={(value) => handleSelectChange("priority", value as "low" | "medium" | "high")}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            name="status" 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange("status", value as "pending" | "in-progress" | "completed" | "cancelled")}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-brand-600 hover:bg-brand-700" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (task ? "Update Task" : "Create Task")}
        </Button>
      </div>
    </form>
  );
}
