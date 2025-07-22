"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Upload,
  X,
  FileText,
  Image,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { CreateTicketData } from "@/lib/db";

interface CreateTicketDialogProps {
  teamId: string;
  userId: string;
  userName: string;
  userEmail: string;
  variant?: "outline" | "default";
}

export function CreateTicketDialog({ 
  teamId, 
  userId, 
  userName, 
  userEmail,
  variant = "outline" 
}: CreateTicketDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "Medium" as CreateTicketData['severity'],
    category: "Technical" as CreateTicketData['category'],
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Title and description are required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('severity', formData.severity);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('teamId', teamId);
      formDataToSend.append('userId', userId);
      formDataToSend.append('userName', userName);
      formDataToSend.append('userEmail', userEmail);

      // Add files to form data
      files.forEach((file, index) => {
        formDataToSend.append(`file-${index}`, file);
      });

      const response = await fetch('/api/tickets/create', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create ticket');
      }

      setSuccess(`Ticket #${result.ticket.id} created successfully!`);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        severity: "Medium",
        category: "Technical",
      });
      setFiles([]);

      // Close dialog and refresh after a short delay
      setTimeout(() => {
        setOpen(false);
        setSuccess(null);
        router.refresh();
      }, 2000);

    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const severityOptions = [
    { value: 'Low', label: 'Low', description: 'Minor issues, feature requests' },
    { value: 'Medium', label: 'Medium', description: 'General support, non-urgent issues' },
    { value: 'High', label: 'High', description: 'Important issues affecting operations' },
    { value: 'Critical', label: 'Critical', description: 'System down, urgent issues' },
  ];

  const categoryOptions = [
    { value: 'Technical', label: 'Technical', description: 'System issues, bugs, configuration' },
    { value: 'Billing', label: 'Billing', description: 'Payment, subscription, invoicing' },
    { value: 'Feature Request', label: 'Feature Request', description: 'New features, enhancements' },
    { value: 'Bug Report', label: 'Bug Report', description: 'Software bugs, unexpected behavior' },
    { value: 'General Support', label: 'General Support', description: 'Questions, guidance, help' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          className={`flex items-center gap-2 transition-all duration-200 ${
            variant === "default" 
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105" 
              : "border-white/10 hover:bg-white/5 hover:border-blue-500/30"
          }`}
        >
          <Plus className="w-4 h-4" />
          Create Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create Support Ticket</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Submit a support request to our managed services team. Include as much detail as possible to help us resolve your issue quickly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <p className="text-sm font-medium">Success!</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{success}</p>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm font-medium">Error</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Ticket Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="border-white/10 bg-background focus:border-blue-500/50"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="severity" className="text-sm font-medium">
                Severity <span className="text-red-400">*</span>
              </Label>
              <Select 
                value={formData.severity} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value as CreateTicketData['severity'] }))}
              >
                <SelectTrigger className="w-full border-white/10">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  {severityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          option.value === 'Critical' ? 'bg-red-500' :
                          option.value === 'High' ? 'bg-orange-500' :
                          option.value === 'Medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category <span className="text-red-400">*</span>
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as CreateTicketData['category'] }))}
              >
                <SelectTrigger className="w-full border-white/10">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the issue, steps to reproduce, expected vs actual behavior, etc."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="border-white/10 bg-background min-h-[100px] focus:border-blue-500/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="files" className="text-sm font-medium flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Attachments (Optional)
            </Label>
            <Input
              id="files"
              type="file"
              multiple
              accept="image/*,.pdf,.txt,.log,.json,.xml"
              onChange={handleFileChange}
              className="border-white/10 bg-background file:bg-blue-500/10 file:text-blue-400 file:border-0 file:rounded-md file:px-3 file:py-1 file:text-sm file:mr-3"
            />
            <p className="text-xs text-muted-foreground">
              Upload screenshots, logs, or other relevant files (max 10MB per file)
            </p>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Selected Files</Label>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white/5 border border-white/10 rounded-md">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file)}
                      <div>
                        <span className="text-sm font-medium">{file.name}</span>
                        <p className="text-xs text-muted-foreground">({formatFileSize(file.size)})</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.description.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Ticket
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 