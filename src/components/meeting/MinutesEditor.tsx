
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MinutesEditorProps {
  minutes: string;
  onSave: (minutes: string) => void;
  onCancel: () => void;
}

export default function MinutesEditor({ minutes, onSave, onCancel }: MinutesEditorProps) {
  const [editedMinutes, setEditedMinutes] = useState(minutes || "");
  const [activeTab, setActiveTab] = useState("edit");

  useEffect(() => {
    setEditedMinutes(minutes || "");
  }, [minutes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedMinutes);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="mt-0">
          <Textarea 
            value={editedMinutes}
            onChange={(e) => setEditedMinutes(e.target.value)}
            placeholder="Enter meeting minutes here..."
            className="min-h-[300px] font-mono"
          />
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0">
          <div className="border rounded-md p-4 min-h-[300px] prose max-w-none overflow-auto bg-white">
            {editedMinutes ? (
              <div className="whitespace-pre-wrap">
                {editedMinutes}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No content to preview</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
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
