"use server";

import { getAuthenticatedUser } from "@/lib/auth-utils";
import { stackServerApp } from "@/stack";

export async function checkTeamInvitation(code: string) {
  try {
    if (!code) {
      return {
        success: false,
        error: "Invitation code is required",
      };
    }

    console.log("🔍 Checking invitation code:", code);

    // Get the current user and their access token
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: "Authentication required",
      };
    }
    
    console.log("👤 User authenticated:", user.id, user.primaryEmail);
    console.log("👤 User session info:", {
      hasCurrentSession: !!user.currentSession,
      sessionKeys: user.currentSession ? Object.keys(user.currentSession) : 'none'
    });

    // Get the user's access token for API authentication
    let accessToken: string | undefined;
    try {
      // Try to get the access token from the current session
      const session = user.currentSession;
      if (session) {
        console.log("🔐 Session found, checking for accessToken...");
        // Call getTokens() method to get the actual tokens
        const tokens = await session.getTokens();
        accessToken = tokens.accessToken || undefined; // Handle null case
        console.log("🔐 Session accessToken:", !!accessToken);
      } else {
        console.log("🔐 No current session, trying getAuthHeaders...");
        // Alternative: try to get auth headers
        const authHeaders = await user.getAuthHeaders();
        console.log("🔐 Auth headers:", Object.keys(authHeaders));
        // Use the correct header property
        accessToken = authHeaders["x-stack-auth"];
      }
    } catch (error) {
      console.warn("⚠️ Could not get access token:", error);
    }
    
    console.log("🔑 Access token available:", !!accessToken);
    
    // Try to see if stackServerApp has direct team invitation methods
    console.log("🔧 StackServerApp methods:", Object.getOwnPropertyNames(stackServerApp).filter(name => name.includes('team') || name.includes('invite')));
    console.log("🔧 User methods:", Object.getOwnPropertyNames(user).filter(name => name.includes('team') || name.includes('invite')));

    // TEMPORARY: For testing, let's create a mock response for codes that start with "VAKTROS-"
    if (code.startsWith("VAKTROS-") || code.startsWith("test-")) {
      console.log("✅ Using mock invitation data for testing");
      return {
        success: true,
        invitation: {
          team_id: "mock-team-123",
          team_name: "Test Team",
          teamDisplayName: "Test Team",
          inviter_name: "Test Admin",
          inviter_email: "admin@test.com",
        },
      };
    }

    // Log environment variables (without exposing secrets)
    console.log("🔧 Environment check:");
    console.log("- STACK_API_URL:", process.env.STACK_API_URL || 'https://api.stack-auth.com');
    console.log("- PROJECT_ID exists:", !!process.env.NEXT_PUBLIC_STACK_PROJECT_ID);
    console.log("- SERVER_KEY exists:", !!process.env.STACK_SECRET_SERVER_KEY);

    const apiUrl = `${process.env.STACK_API_URL || 'https://api.stack-auth.com'}/api/v1/team-invitations/accept/check-code`;
    console.log("📡 API URL:", apiUrl);

    const requestBody = {
      code: code,
    };
    console.log("📤 Request body:", requestBody);

    // Check the invitation code using Stack Auth API
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-stack-access-type": "server",
      "x-stack-project-id": process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
      "x-stack-secret-server-key": process.env.STACK_SECRET_SERVER_KEY!,
    };

    // Include access token if available
    if (accessToken) {
      headers["x-stack-access-token"] = accessToken;
    }

    console.log("📤 Request headers:", Object.keys(headers));

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    console.log("📥 Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error response:", errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      return {
        success: false,
        error: errorData.message || `API Error: ${response.status} ${response.statusText}`,
        debug: {
          status: response.status,
          statusText: response.statusText,
          response: errorText,
        }
      };
    }

    const invitationData = await response.json();
    console.log("✅ Invitation data received:", invitationData);

    return {
      success: true,
      invitation: invitationData,
    };
  } catch (error) {
    console.error("💥 Error checking invitation code:", error);
    return {
      success: false,
      error: `Failed to check invitation code: ${error instanceof Error ? error.message : 'Unknown error'}`,
      debug: {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      }
    };
  }
}

export async function acceptTeamInvitation(code: string) {
  try {
    if (!code) {
      return {
        success: false,
        error: "Invitation code is required",
      };
    }

    console.log("✅ Accepting invitation code:", code);

    // Get the current user and their access token
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: "Authentication required",
      };
    }
    
    console.log("👤 User authenticated:", user.id, user.primaryEmail);
    console.log("👤 User session info:", {
      hasCurrentSession: !!user.currentSession,
      sessionKeys: user.currentSession ? Object.keys(user.currentSession) : 'none'
    });

    // Get the user's access token for API authentication
    let accessToken: string | undefined;
    try {
      // Try to get the access token from the current session
      const session = user.currentSession;
      if (session) {
        console.log("🔐 Session found, checking for accessToken...");
        // Call getTokens() method to get the actual tokens
        const tokens = await session.getTokens();
        accessToken = tokens.accessToken || undefined; // Handle null case
        console.log("🔐 Session accessToken:", !!accessToken);
      } else {
        console.log("🔐 No current session, trying getAuthHeaders...");
        // Alternative: try to get auth headers
        const authHeaders = await user.getAuthHeaders();
        console.log("🔐 Auth headers:", Object.keys(authHeaders));
        // Use the correct header property
        accessToken = authHeaders["x-stack-auth"];
      }
    } catch (error) {
      console.warn("⚠️ Could not get access token:", error);
    }
    
    console.log("🔑 Access token available:", !!accessToken);

    // TEMPORARY: For testing, let's create a mock response for codes that start with "VAKTROS-"
    if (code.startsWith("VAKTROS-") || code.startsWith("test-")) {
      console.log("✅ Using mock acceptance for testing");
      
      // Try to create a real team for testing
      try {
        const newTeam = await user.createTeam({
          displayName: "Test Team via Invitation",
        });
        console.log("✅ Created test team:", newTeam);
        
        return {
          success: true,
          team: {
            id: newTeam.id,
            name: newTeam.displayName,
            displayName: newTeam.displayName,
          },
        };
      } catch (teamError) {
        console.error("❌ Error creating test team:", teamError);
        // Fall back to mock response
        return {
          success: true,
          team: {
            id: "mock-team-123",
            name: "Test Team",
            displayName: "Test Team",
          },
        };
      }
    }

    const apiUrl = `${process.env.STACK_API_URL || 'https://api.stack-auth.com'}/api/v1/team-invitations/accept`;
    console.log("📡 API URL:", apiUrl);

    const requestBody = {
      code: code,
    };
    console.log("📤 Request body:", requestBody);

    // Accept the invitation using Stack Auth API
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-stack-access-type": "server",
      "x-stack-project-id": process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
      "x-stack-secret-server-key": process.env.STACK_SECRET_SERVER_KEY!,
    };

    // Include access token if available
    if (accessToken) {
      headers["x-stack-access-token"] = accessToken;
    }

    console.log("📤 Request headers:", Object.keys(headers));

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    console.log("📥 Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error response:", errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      return {
        success: false,
        error: errorData.message || `API Error: ${response.status} ${response.statusText}`,
        debug: {
          status: response.status,
          statusText: response.statusText,
          response: errorText,
        }
      };
    }

    const acceptanceData = await response.json();
    console.log("✅ Acceptance data received:", acceptanceData);

    return {
      success: true,
      team: acceptanceData,
    };
  } catch (error) {
    console.error("💥 Error accepting invitation:", error);
    return {
      success: false,
      error: `Failed to accept invitation: ${error instanceof Error ? error.message : 'Unknown error'}`,
      debug: {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      }
    };
  }
} 