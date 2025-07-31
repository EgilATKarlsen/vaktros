"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload,
  X,
  FileText,
  Image,
  Loader2,
  CheckCircle,
  AlertCircle,
  Send
} from "lucide-react";
import { CreateTicketData } from "@/lib/db";

interface CreateTicketFormProps {
  teamId: string;
  userId: string;
  userName: string;
  userEmail: string;
}

export function CreateTicketForm({ 
  teamId, 
  userId, 
  userName, 
  userEmail
}: CreateTicketFormProps) {
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

      // Redirect to tickets page after a short delay
      setTimeout(() => {
        router.push('/dashboard/tickets');
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
      return <Image className="w-4 h-4"/>;
    }
    return <FileText className="w-4 h-4" />;
  };

  const severityOptions = [
    { value: 'Low', label: 'Low', description: 'Minor issues, feature requests', color: 'text-green-400' },
    { value: 'Medium', label: 'Medium', description: 'General support, non-urgent issues', color: 'text-yellow-400' },
    { value: 'High', label: 'High', description: 'Important issues affecting operations', color: 'text-orange-400' },
    { value: 'Critical', label: 'Critical', description: 'System down, urgent issues', color: 'text-red-400' },
  ];

  const categoryOptions = [
    { value: 'Technical', label: 'Technical', description: 'System issues, bugs, configuration' },
    { value: 'Billing', label: 'Billing', description: 'Payment, subscription, invoicing' },
    { value: 'Feature Request', label: 'Feature Request', description: 'New features, enhancements' },
    { value: 'Bug Report', label: 'Bug Report', description: 'Software bugs, unexpected behavior' },
    { value: 'General Support', label: 'General Support', description: 'Questions, guidance, help' },
  ];

  if (success) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-green-400">Success!</h3>
              <p className="text-sm text-muted-foreground mt-1">{success}</p>
              <p className="text-xs text-muted-foreground mt-2">Redirecting to tickets page...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {error && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-3 sm:pt-4 px-3 sm:px-6">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm font-medium">Error</p>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Ticket Title <span className="text-red-400">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Brief description of the issue"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="border-white/10 bg-background focus:border-blue-500/50 text-base sm:text-sm h-11 sm:h-10"
          required
        />
      </div>

      {/* Mobile: Stack fields vertically, Desktop: Side by side */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="severity" className="text-sm font-medium">
            Severity <span className="text-red-400">*</span>
          </Label>
          <Select 
            value={formData.severity} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value as CreateTicketData['severity'] }))}
          >
            <SelectTrigger className="w-full border-white/10 h-11 sm:h-10 text-base sm:text-sm">
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
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-muted-foreground hidden sm:block">{option.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Category <span className="text-red-400">*</span>
          </Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as CreateTicketData['category'] }))}
          >
            <SelectTrigger className="w-full border-white/10 h-11 sm:h-10 text-base sm:text-sm">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-muted-foreground hidden sm:block">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Detailed description of the issue, steps to reproduce, expected vs actual behavior, etc."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="border-white/10 bg-background min-h-[120px] sm:min-h-[100px] focus:border-blue-500/50 text-base sm:text-sm resize-none"
          required
        />
      </div>

      <div className="space-y-1 sm:space-y-2">
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
          className="border-white/10 bg-background file:bg-blue-500/10 file:text-blue-400 file:border-0 file:rounded-md file:px-3 file:py-2 file:text-sm file:mr-3 h-11 sm:h-10"
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
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {getFileIcon(file)}
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium block truncate">{file.name}</span>
                    <p className="text-xs text-muted-foreground">({formatFileSize(file.size)})</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0 ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile-friendly button layout */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/tickets')}
          disabled={loading}
          className="border-white/10 hover:bg-white/5 order-2 sm:order-1 h-11 sm:h-10"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || !formData.title.trim() || !formData.description.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white flex-1 order-1 sm:order-2 h-11 sm:h-10 touch-manipulation"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Ticket...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Create Support Ticket</span>
              <span className="sm:hidden">Create Ticket</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 