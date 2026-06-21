/**
 * API client functions for prayer requests and other backend operations
 */

export const VITE_API_URL = import.meta.env.VITE_API_URL;

export const API_BASE_URL = typeof window !== 'undefined' && import.meta.env.DEV
  ? ''
  : (VITE_API_URL && !/^https?:\/\/localhost(:|$)/i.test(VITE_API_URL)
      ? VITE_API_URL
      : 'https://mocwo-backend.onrender.com');

console.log('[API] Using base URL:', API_BASE_URL || '/api');

export interface PrayerRequestPayload {
  name: string;
  phone: string;
  location: string;
  prayer: string;
  method: "sms" | "whatsapp" | "email";
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Helper: Safe fetch with timeout + better error handling
 */
async function safeFetch(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Helper: Handle API errors safely
 */
async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // Not JSON → keep default message
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Send a prayer request
 */
export async function sendPrayerRequest(
  payload: PrayerRequestPayload
): Promise<ApiResponse> {
  try {
    const url = `${API_BASE_URL}/api/sendPrayer`;
    console.log('[API] Sending prayer to:', url, payload);

    const response = await safeFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await handleResponse(response);

    return {
      success: true,
      data,
      message: data.message || "Prayer request sent successfully",
    };

  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error('[API] Prayer request error:', errorMessage);

    return {
      success: false,
      error: errorMessage,
      message: `Failed to send prayer request: ${errorMessage}`,
    };
  }
}

/**
 * Verify if a user is an admin
 */
export async function verifyAdmin(email: string): Promise<ApiResponse> {
  try {
    const url = `${API_BASE_URL}/api/verify-admin`;
    console.log('[API] Verifying admin at:', url, email);

    const response = await safeFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await handleResponse(response);

    return {
      success: true,
      data,
      message: "Admin verification successful",
    };

  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    let friendlyMessage = errorMessage;
    if (/failed to fetch|network request failed|networkerror|connection refused|abort/i.test(errorMessage)) {
      friendlyMessage =
        "Admin verification service is unavailable. Please ensure the backend server is running and accessible.";
    }

    console.error('[API] Verification error:', errorMessage);

    return {
      success: false,
      error: friendlyMessage,
      message: `Admin verification failed: ${friendlyMessage}`,
    };
  }
}

export async function loginAdmin(email: string, password: string): Promise<ApiResponse> {
  try {
    const url = `${API_BASE_URL}/api/admin-login`;
    console.log('[API] Logging in admin at:', url, email);

    const response = await safeFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);
    const loginData = data?.data ?? data;

    return {
      success: true,
      data: loginData,
      message: "Admin login successful",
    };

  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    let friendlyMessage = errorMessage;
    if (/failed to fetch|network request failed|networkerror|connection refused|abort/i.test(errorMessage)) {
      friendlyMessage =
        "Admin login service is unavailable. Please ensure the backend server is running and accessible.";
    }

    console.error('[API] Login error:', errorMessage);

    return {
      success: false,
      error: friendlyMessage,
      message: `Admin login failed: ${friendlyMessage}`,
    };
  }
}