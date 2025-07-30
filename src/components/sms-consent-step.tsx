"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle,
  Bell,
  Clock,
  Info
} from "lucide-react";

interface SMSConsentStepProps {
  onComplete: (phoneNumber: string | null, consentGiven: boolean) => void;
}

type ConsentState = 'choosing' | 'phone-input' | 'verifying' | 'verified' | 'declined';

export function SMSConsentStep({ onComplete }: SMSConsentStepProps) {
  const [state, setState] = useState<ConsentState>('choosing');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

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

  const handleDeclineNotifications = () => {
    setState('declined');
    setTimeout(() => {
      onComplete(null, false);
    }, 1500);
  };

  const handleAcceptNotifications = () => {
    if (!consentGiven) {
      setError('Please confirm your consent to receive SMS notifications');
      return;
    }
    setState('phone-input');
    setError(null);
  };

  const handleSendVerification = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setState('verifying');
    setError(null);

    try {
      const response = await fetch('/api/sms/verify/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        startCountdown();
      } else {
        throw new Error(data.error || 'Failed to send verification code');
      }
    } catch (err) {
      console.error('Error sending verification code:', err);
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
      setState('phone-input');
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

    setError(null);

    try {
      const response = await fetch('/api/sms/verify/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber: phoneNumber.trim(),
          code: verificationCode.trim()
        }),
      });

      const data = await response.json();

      if (data.success && data.verified) {
        setState('verified');
        setTimeout(() => {
          onComplete(data.phoneNumber, true);
        }, 1500);
      } else {
        throw new Error(data.error || 'Invalid verification code');
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setVerificationCode('');
    await handleSendVerification();
  };

  const renderConsentChoice = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto mb-6 w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
          <Bell className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          Stay Updated with SMS Notifications
        </h2>
        <p className="text-muted-foreground text-lg">
          Get instant alerts when tickets are created or updated
        </p>
      </div>

      <Card className="border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
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
              You can change these preferences anytime in your profile settings.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={consentGiven}
                onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
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

          <div className="flex gap-3">
            <Button
              onClick={handleAcceptNotifications}
              disabled={!consentGiven}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Enable SMS Notifications
            </Button>

            <Button
              variant="outline"
              onClick={handleDeclineNotifications}
              className="border-white/10 hover:bg-white/5"
            >
              Skip for Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPhoneInput = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto mb-6 w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
          <Phone className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          Enter Your Phone Number
        </h2>
        <p className="text-muted-foreground text-lg">
          We'll verify your number to ensure you receive notifications
        </p>
      </div>

      <Card className="border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-green-500" />
            Phone Verification
          </CardTitle>
          <CardDescription>
            Enter your phone number to receive a verification code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Include country code (e.g., +1 for US, +44 for UK)
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSendVerification}
              disabled={!phoneNumber.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Verification Code
            </Button>

            <Button
              variant="outline"
              onClick={handleDeclineNotifications}
              className="border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVerificationInput = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto mb-6 w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
          <MessageSquare className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          Enter Verification Code
        </h2>
        <p className="text-muted-foreground text-lg">
          We sent a 6-digit code to {phoneNumber}
        </p>
      </div>

      <Card className="border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Verification Code
          </CardTitle>
          <CardDescription>
            Enter the code to confirm your phone number
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
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
              className="text-center text-2xl tracking-widest"
              maxLength={6}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleVerifyCode}
              disabled={verificationCode.length !== 6}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Verify & Enable Notifications
            </Button>

            <Button
              variant="outline"
              onClick={handleResendCode}
              disabled={countdown > 0}
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
              onClick={handleDeclineNotifications}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel and skip notifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVerified = () => (
    <Card className="border-green-500/20 bg-green-500/5">
      <CardContent className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">SMS Notifications Enabled!</h3>
        <p className="text-muted-foreground mb-4">
          Your phone number has been verified successfully
        </p>
        <p className="text-sm text-green-600">
          You'll receive notifications at {phoneNumber} for ticket updates
        </p>
      </CardContent>
    </Card>
  );

  const renderDeclined = () => (
    <Card className="border-gray-500/20 bg-gray-500/5">
      <CardContent className="text-center py-12">
        <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">SMS Notifications Disabled</h3>
        <p className="text-muted-foreground mb-4">
          You can enable SMS notifications anytime in your profile settings
        </p>
        <p className="text-sm text-gray-600">
          You'll still receive email notifications for important updates
        </p>
      </CardContent>
    </Card>
  );

  switch (state) {
    case 'choosing':
      return renderConsentChoice();
    case 'phone-input':
      return renderPhoneInput();
    case 'verifying':
      return renderVerificationInput();
    case 'verified':
      return renderVerified();
    case 'declined':
      return renderDeclined();
    default:
      return renderConsentChoice();
  }
} 