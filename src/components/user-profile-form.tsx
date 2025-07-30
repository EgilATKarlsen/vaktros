"use client";

import { useState, useEffect } from "react";
import { useUser } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  Phone, 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare,
  Shield,
  Clock,
  Info,
  XCircle
} from "lucide-react";

interface UserProfile {
  user_id: string;
  phone_number?: string;
  sms_notifications_enabled: boolean;
}

type ProfileState = 'loading' | 'no-consent' | 'phone-input' | 'verifying' | 'verified' | 'disabled';

export function UserProfileForm() {
  const user = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [state, setState] = useState<ProfileState>('loading');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  
  const [formData, setFormData] = useState({
    phone_number: '',
    sms_notifications_enabled: true,
    consent_given: false
  });
  
  const [verificationCode, setVerificationCode] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fetchProfile = async () => {
    try {
      setState('loading');
      setError(null);

      const response = await fetch('/api/user/profile');
      const data = await response.json();

      if (data.success) {
        setProfile(data.profile);
        setFormData({
          phone_number: data.profile.phone_number || '',
          sms_notifications_enabled: data.profile.sms_notifications_enabled ?? true,
          consent_given: false
        });

        // Determine the current state based on profile data and user metadata
        const hasPhone = !!data.profile.phone_number;
        const hasConsent = user?.clientMetadata?.smsConsentGiven === true;
        const isVerified = user?.clientMetadata?.phoneVerified === true;
        
        if (!hasConsent) {
          setState('no-consent');
        } else if (!hasPhone) {
          setState('phone-input');
        } else if (!isVerified) {
          setState('phone-input'); // Need to re-verify
        } else if (data.profile.sms_notifications_enabled) {
          setState('verified');
        } else {
          setState('disabled');
        }
      } else {
        throw new Error(data.error || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      setState('no-consent');
    }
  };

  const handleGiveConsent = () => {
    if (!formData.consent_given) {
      setError('Please confirm your consent to receive SMS notifications');
      return;
    }
    setState('phone-input');
    setError(null);
  };

  const handleWithdrawConsent = async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/consent/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consentType: 'sms_notifications',
          withdrawalReason: 'user_profile_settings'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setState('no-consent');
        setFormData(prev => ({ ...prev, consent_given: false, sms_notifications_enabled: false }));
        setSuccess('SMS consent withdrawn successfully. You will no longer receive SMS notifications.');
        
        // Refresh profile data
        setTimeout(() => {
          fetchProfile();
        }, 1000);
      } else {
        throw new Error(data.error || 'Failed to withdraw consent');
      }
    } catch (err) {
      console.error('Error withdrawing consent:', err);
      setError(err instanceof Error ? err.message : 'Failed to withdraw consent');
    } finally {
      setSaving(false);
    }
  };

  const handleSendVerification = async () => {
    if (!formData.phone_number.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/sms/verify/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: formData.phone_number.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setState('verifying');
        startCountdown();
        setSuccess('Verification code sent to your phone');
      } else {
        throw new Error(data.error || 'Failed to send verification code');
      }
    } catch (err) {
      console.error('Error sending verification code:', err);
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/sms/verify/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phone_number.trim(),
          code: verificationCode.trim()
        }),
      });

      const data = await response.json();

      if (data.success && data.verified) {
        setState('verified');
        setSuccess('Phone number verified successfully! SMS notifications are now enabled.');
        setVerificationCode('');
        
        // Refresh profile data
        setTimeout(() => {
          fetchProfile();
        }, 1000);
      } else {
        throw new Error(data.error || 'Invalid verification code');
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    } finally {
      setSaving(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setVerificationCode('');
    await handleSendVerification();
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    if (!enabled) {
      // Disable notifications without withdrawing consent
      setSaving(true);
      try {
        const response = await fetch('/api/user/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sms_notifications_enabled: false
          }),
        });

        const data = await response.json();
        if (data.success) {
          setState('disabled');
          setSuccess('SMS notifications disabled');
        }
      } catch (err) {
        setError('Failed to update notification settings');
      } finally {
        setSaving(false);
      }
    } else {
      // Re-enable notifications
      setState('verified');
      setSaving(true);
      try {
        const response = await fetch('/api/user/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sms_notifications_enabled: true
          }),
        });

        const data = await response.json();
        if (data.success) {
          setSuccess('SMS notifications enabled');
        }
      } catch (err) {
        setError('Failed to update notification settings');
      } finally {
        setSaving(false);
      }
    }
  };

  if (state === 'loading') {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No Consent State
  if (state === 'no-consent') {
    return (
      <Card className="border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-500" />
            SMS Notifications
          </CardTitle>
          <CardDescription>
            Choose whether you'd like to receive text message notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>What you'll receive:</strong> Notifications when support tickets are created, updated, or resolved. 
              You can change these preferences anytime.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/20 bg-green-500/5">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={formData.consent_given}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent_given: checked as boolean }))}
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="consent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to receive SMS notifications from VAKTROS
                </Label>
                <p className="text-xs text-muted-foreground">
                  By checking this box, you consent to receive text messages about your support tickets. 
                  Standard message rates may apply. You can opt out at any time.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleGiveConsent}
            disabled={!formData.consent_given || saving}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Enable SMS Notifications
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Phone Input State
  if (state === 'phone-input') {
    return (
      <Card className="border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-green-500" />
            Phone Number Verification
          </CardTitle>
          <CardDescription>
            Enter your phone number to receive SMS notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/20 bg-green-500/5">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={formData.phone_number}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">
              Include country code (e.g., +1 for US, +44 for UK)
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSendVerification}
              disabled={!formData.phone_number.trim() || saving}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Verification Code
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleWithdrawConsent}
              disabled={saving}
              className="border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Verifying State
  if (state === 'verifying') {
    return (
      <Card className="border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Enter Verification Code
          </CardTitle>
          <CardDescription>
            We sent a 6-digit code to {formData.phone_number}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/20 bg-green-500/5">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={saving}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleVerifyCode}
              disabled={verificationCode.length !== 6 || saving}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify & Enable Notifications
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleResendCode}
              disabled={countdown > 0 || saving}
              className="border-white/10 hover:bg-white/5"
            >
              {countdown > 0 ? (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  {countdown}s
                </>
              ) : (
                'Resend'
              )}
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={handleWithdrawConsent}
              disabled={saving}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel and withdraw consent
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Verified State
  if (state === 'verified') {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            SMS Notifications Active
          </CardTitle>
          <CardDescription>
            You're receiving SMS notifications for ticket updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert className="border-green-500/20 bg-green-500/5">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border">
            <div>
              <div className="font-medium">Phone Number</div>
              <div className="text-sm text-muted-foreground">{profile?.phone_number}</div>
            </div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>

          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border">
            <div>
              <div className="font-medium">SMS Notifications</div>
              <div className="text-sm text-muted-foreground">Receive notifications for ticket updates</div>
            </div>
            <Switch
              checked={true}
              onCheckedChange={handleToggleNotifications}
              disabled={saving}
            />
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleWithdrawConsent}
              disabled={saving}
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Withdraw SMS Consent
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This will disable all SMS notifications and remove your consent
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Disabled State
  if (state === 'disabled') {
    return (
      <Card className="border-gray-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-gray-500" />
            SMS Notifications Disabled
          </CardTitle>
          <CardDescription>
            You have SMS consent but notifications are currently disabled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border">
            <div>
              <div className="font-medium">Phone Number</div>
              <div className="text-sm text-muted-foreground">{profile?.phone_number}</div>
            </div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>

          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border">
            <div>
              <div className="font-medium">SMS Notifications</div>
              <div className="text-sm text-muted-foreground">Currently disabled</div>
            </div>
            <Switch
              checked={false}
              onCheckedChange={handleToggleNotifications}
              disabled={saving}
            />
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleWithdrawConsent}
              disabled={saving}
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Withdraw SMS Consent
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This will completely remove your SMS consent and phone number
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
} 