"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle,
  Shield,
  Clock
} from "lucide-react";

interface PhoneVerificationStepProps {
  onVerificationComplete: (phoneNumber: string) => void;
  onSkip: () => void;
}

type VerificationState = 'input' | 'sending' | 'verifying' | 'verified' | 'error';

export function PhoneVerificationStep({ onVerificationComplete, onSkip }: PhoneVerificationStepProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [state, setState] = useState<VerificationState>('input');
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

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setState('sending');
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
        setState('verifying');
        startCountdown();
      } else {
        throw new Error(data.error || 'Failed to send verification code');
      }
    } catch (err) {
      console.error('Error sending verification code:', err);
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
      setState('error');
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

    setState('sending');
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
          onVerificationComplete(data.phoneNumber);
        }, 1500);
      } else {
        throw new Error(data.error || 'Invalid verification code');
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify code');
      setState('verifying');
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setVerificationCode('');
    await handleSendCode();
  };

  const renderPhoneInput = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto mb-6 w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
          <Phone className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          Verify Your Phone Number
        </h2>
        <p className="text-muted-foreground text-lg">
          We&apos;ll send you SMS notifications for important ticket updates
        </p>
      </div>

      <Card className="border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            SMS Verification
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
              disabled={state === 'sending'}
            />
            <p className="text-xs text-muted-foreground">
              Include country code (e.g., +1 for US, +44 for UK)
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSendCode}
              disabled={state === 'sending' || !phoneNumber.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {state === 'sending' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Code
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={onSkip}
              disabled={state === 'sending'}
              className="border-white/10 hover:bg-white/5"
            >
              Skip for Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCodeVerification = () => (
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
            <Shield className="h-5 w-5 text-green-500" />
            Verification Code
          </CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your phone
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
              disabled={state === 'sending'}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleVerifyCode}
              disabled={state === 'sending' || verificationCode.length !== 6}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {state === 'sending' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Code
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleResendCode}
              disabled={countdown > 0 || state === 'sending'}
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
              onClick={onSkip}
              disabled={state === 'sending'}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Skip verification for now
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
        <h3 className="text-xl font-semibold mb-2">Phone Verified!</h3>
        <p className="text-muted-foreground mb-4">
          Your phone number has been successfully verified
        </p>
        <p className="text-sm text-green-600">
          You&apos;ll receive SMS notifications for ticket updates
        </p>
      </CardContent>
    </Card>
  );

  if (state === 'verified') {
    return renderVerified();
  }

  if (state === 'verifying' || state === 'sending') {
    return renderCodeVerification();
  }

  return renderPhoneInput();
} 