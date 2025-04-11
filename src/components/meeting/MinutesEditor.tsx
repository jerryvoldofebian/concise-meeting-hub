
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface MinutesEditorProps {
  minutes: string;
  onSave: (minutes: string) => void;
  onCancel: () => void;
}

export default function MinutesEditor({ minutes, onSave, onCancel }: MinutesEditorProps) {
  const [editedMinutes, setEditedMinutes] = useState(minutes || "");

  useEffect(() => {
    setEditedMinutes(minutes || "");
  }, [minutes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedMinutes);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea 
        value={editedMinutes}
        onChange={(e) => setEditedMinutes(e.target.value)}
        placeholder="Enter meeting minutes here..."
        className="min-h-[300px]"
      />
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
          Save Minutes
        </Button>
      </div>
    </form>
  );
}
