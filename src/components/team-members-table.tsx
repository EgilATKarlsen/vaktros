"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  UserX, 
  Crown, 
  User,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Mail,
  Shield
} from "lucide-react";

interface TeamMember {
  userId: string;
  displayName: string;
  email: string;
  role: 'Admin' | 'Member';
  joinedAt?: string;
}

interface TeamMembersTableProps {
  teamId: string;
  currentUserId: string;
  isCurrentUserAdmin: boolean;
}

export function TeamMembersTable({ teamId, currentUserId, isCurrentUserAdmin }: TeamMembersTableProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Alert dialog state for removal confirmation
  const [removeDialog, setRemoveDialog] = useState<{
    open: boolean;
    member: TeamMember | null;
  }>({
    open: false,
    member: null,
  });

  const user = useUser();
  const userTeams = user?.useTeams() || [];
  const currentTeam = userTeams.find(team => team.id === teamId);

  const fetchTeamMembers = useCallback(async () => {
    if (!currentTeam) return;

    try {
      setLoading(true);
      setError(null);

      // Get team member profiles using Stack Auth API
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch team members: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setMembers(data.members);
      } else {
        throw new Error(data.error || 'Failed to fetch team members');
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError(err instanceof Error ? err.message : 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  }, [currentTeam, teamId]);

  useEffect(() => {
    if (currentTeam) {
      fetchTeamMembers();
    }
  }, [currentTeam, teamId, fetchTeamMembers]);

  const handleRemoveMember = async (member: TeamMember) => {
    if (!isCurrentUserAdmin || !currentTeam) return;

    try {
      setActionLoading(member.userId);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/teams/${teamId}/members/${member.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to remove member: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setSuccess(`${member.displayName || member.email} has been removed from the team`);
        await fetchTeamMembers(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to remove member');
      }
    } catch (err) {
      console.error('Error removing member:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove member');
    } finally {
      setActionLoading(null);
      setRemoveDialog({ open: false, member: null });
    }
  };

  const openRemoveDialog = (member: TeamMember) => {
    setRemoveDialog({ open: true, member });
  };

  const confirmRemoval = () => {
    if (removeDialog.member) {
      handleRemoveMember(removeDialog.member);
    }
  };

  // Mobile Card Component for individual members
  const MemberCard = ({ member }: { member: TeamMember }) => (
    <Card key={member.userId} className="border-white/10 bg-white/5">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with avatar and name */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-sm truncate">
                    {member.displayName || 'Unknown User'}
                  </h3>
                  {member.userId === currentUserId && (
                    <Badge variant="secondary" className="text-xs">You</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Mail className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">{member.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Role and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-muted-foreground" />
              <Badge 
                variant={member.role === 'Admin' ? 'default' : 'outline'} 
                className={`text-xs ${
                  member.role === 'Admin' 
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/20' 
                    : ''
                }`}
              >
                {member.role === 'Admin' && <Crown className="w-3 h-3 mr-1" />}
                {member.role}
              </Badge>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
              Active
            </Badge>
          </div>

          {/* Actions */}
          {isCurrentUserAdmin && member.userId !== currentUserId && (
            <div className="pt-2 border-t border-white/10">
              <Button
                onClick={() => openRemoveDialog(member)}
                variant="ghost"
                size="sm"
                disabled={actionLoading === member.userId}
                className="w-full h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                {actionLoading === member.userId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <UserX className="w-4 h-4 mr-2" />
                    Remove from Team
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading team members...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500/20 bg-red-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <p className="font-medium">Error Loading Members</p>
          </div>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button 
            onClick={fetchTeamMembers} 
            variant="outline" 
            size="sm" 
            className="mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
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

      {members.length === 0 ? (
        <Card className="border-white/10">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <h3 className="font-medium mb-2">No team members found</h3>
              <p className="text-sm text-muted-foreground">
                This team doesn&apos;t have any members yet.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile View - Cards */}
          <div className="block md:hidden space-y-3">
            {members.map((member) => (
              <MemberCard key={member.userId} member={member} />
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block rounded-md border border-white/10">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead>Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  {isCurrentUserAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.userId} className="border-white/10">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {member.displayName || 'Unknown User'}
                            {member.userId === currentUserId && (
                              <Badge variant="secondary" className="ml-2 text-xs">You</Badge>
                            )}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{member.email}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={member.role === 'Admin' ? 'default' : 'outline'} 
                        className={`text-xs ${
                          member.role === 'Admin' 
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/20' 
                            : ''
                        }`}
                      >
                        {member.role === 'Admin' && <Crown className="w-3 h-3 mr-1" />}
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                        Active
                      </Badge>
                    </TableCell>
                    {isCurrentUserAdmin && (
                      <TableCell className="text-right">
                        {member.userId !== currentUserId ? (
                          <Button
                            onClick={() => openRemoveDialog(member)}
                            variant="ghost"
                            size="sm"
                            disabled={actionLoading === member.userId}
                            className="h-8 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            {actionLoading === member.userId ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <UserX className="w-4 h-4 mr-1" />
                                Remove
                              </>
                            )}
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Current User</span>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Removal Confirmation Dialog */}
      <AlertDialog open={removeDialog.open} onOpenChange={(open) => 
        setRemoveDialog(prev => ({ ...prev, open }))
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{removeDialog.member?.displayName || removeDialog.member?.email}</strong> from the team? 
              This action cannot be undone and they will lose access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoval}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 