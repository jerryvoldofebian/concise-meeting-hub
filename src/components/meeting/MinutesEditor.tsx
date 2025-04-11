
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { Share2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface MinutesEditorProps {
  minutes: string;
  onSave: (minutes: string) => void;
  onCancel: () => void;
  meetingId?: string;
  isSubmitting?: boolean;
}

export default function MinutesEditor({ 
  minutes, 
  onSave, 
  onCancel, 
  meetingId, 
  isSubmitting = false 
}: MinutesEditorProps) {
  const [editedMinutes, setEditedMinutes] = useState(minutes || "");
  const [activeTab, setActiveTab] = useState("edit");
  const [shareEmail, setShareEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setEditedMinutes(minutes || "");
  }, [minutes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedMinutes);
  };

  const handleShare = () => {
    if (!shareEmail) {
      toast({
        title: "Email required",
        description: "Please enter an email address to share with.",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would send the minutes to the specified email
    toast({
      title: "Minutes shared",
      description: `Meeting minutes have been shared with ${shareEmail}.`,
    });
    setShareEmail("");
  };

  const markdownGuide = `
## Markdown Guide
- **Bold text**: \`**text**\`
- *Italic text*: \`*text*\`
- # Heading 1: \`# heading\`
- ## Heading 2: \`## heading\`
- ### Heading 3: \`### heading\`
- Bullet list: \`- item\`
- Numbered list: \`1. item\`
- [Link](https://example.com): \`[text](url)\`
- Horizontal line: \`---\`
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" type="button" className="ml-2" disabled={isSubmitting}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">Share Minutes</h4>
              <p className="text-sm text-muted-foreground">
                Enter the email address of the person you want to share these minutes with.
              </p>
              <div className="space-y-2">
                <Label htmlFor="shareEmail">Email</Label>
                <Input 
                  id="shareEmail" 
                  placeholder="colleague@example.com" 
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleShare} className="w-full">
                Share Minutes
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <TabsContent value="edit" className="mt-0">
        <div className="space-y-2">
          <Textarea 
            value={editedMinutes}
            onChange={(e) => setEditedMinutes(e.target.value)}
            placeholder="Enter meeting minutes here using Markdown formatting..."
            className="min-h-[300px] font-mono"
            disabled={isSubmitting}
          />
          <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
            <ReactMarkdown>{markdownGuide}</ReactMarkdown>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="preview" className="mt-0">
        <div className="border rounded-md p-4 min-h-[300px] prose max-w-none overflow-auto bg-white">
          {editedMinutes ? (
            <ReactMarkdown>{editedMinutes}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground italic">No content to preview</p>
          )}
        </div>
      </TabsContent>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-brand-600 hover:bg-brand-700" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Minutes"}
        </Button>
      </div>
    </form>
  );
}
