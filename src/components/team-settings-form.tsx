"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  CreditCard,
  MapPin,
  Briefcase,
  Calendar
} from "lucide-react";

interface LocationData {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

interface OrganizationData {
  subscription: string;
  billingPeriodEnd: string;
  location: LocationData;
  industry: string;
}

interface TeamSettingsFormProps {
  teamId: string;
  initialData: OrganizationData;
}

export function TeamSettingsForm({ teamId, initialData }: TeamSettingsFormProps) {
  const [formData, setFormData] = useState<OrganizationData>(initialData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const user = useUser();
  const userTeams = user?.useTeams() || [];
  const currentTeam = userTeams.find(team => team.id === teamId);
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('location.')) {
      const locationField = field.replace('location.', '');
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentTeam) {
      setError("Team not found");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update team metadata using Stack Auth
      await currentTeam.update({
        clientMetadata: {
          subscription: formData.subscription,
          billingPeriodEnd: formData.billingPeriodEnd,
          location: formData.location,
          industry: formData.industry,
        },
      });

      setSuccess("Organization settings updated successfully!");
      
      // Refresh the page to show updated data
      setTimeout(() => {
        router.refresh();
      }, 1500);

    } catch (err) {
      console.error('Error updating team settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const subscriptionOptions = [
    { value: 'Trial', label: 'Trial' },
    { value: 'Paid', label: 'Paid' },
  ];

  const industryOptions = [
    { value: 'Tech', label: 'Technology' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Construction', label: 'Construction' },
    { value: 'Coworking', label: 'Coworking' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-green-500">
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
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm font-medium">Error</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Subscription & Billing Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold">Subscription & Billing</h3>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="subscription">Current Subscription</Label>
            <Select 
              value={formData.subscription} 
              onValueChange={(value) => handleInputChange('subscription', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select subscription type" />
              </SelectTrigger>
              <SelectContent>
                {subscriptionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingPeriodEnd">
              <Calendar className="h-4 w-4" />
              Contract End Date
            </Label>
            <Input
              id="billingPeriodEnd"
              type="date"
              value={formData.billingPeriodEnd}
              onChange={(e) => handleInputChange('billingPeriodEnd', e.target.value)}
              className="border-white/10"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Location Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Location Information</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              type="text"
              placeholder="123 Main Street"
              value={formData.location.street}
              onChange={(e) => handleInputChange('location.street', e.target.value)}
              className="border-white/10"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                placeholder="San Francisco"
                value={formData.location.city}
                onChange={(e) => handleInputChange('location.city', e.target.value)}
                className="border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                type="text"
                placeholder="California"
                value={formData.location.state}
                onChange={(e) => handleInputChange('location.state', e.target.value)}
                className="border-white/10"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                type="text"
                placeholder="United States"
                value={formData.location.country}
                onChange={(e) => handleInputChange('location.country', e.target.value)}
                className="border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP/Postal Code</Label>
              <Input
                id="zip"
                type="text"
                placeholder="94105"
                value={formData.location.zip}
                onChange={(e) => handleInputChange('location.zip', e.target.value)}
                className="border-white/10"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Industry Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">Industry Information</h3>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="industry">Industry Type</Label>
          <Select 
            value={formData.industry} 
            onValueChange={(value) => handleInputChange('industry', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select industry type" />
            </SelectTrigger>
            <SelectContent>
              {industryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 