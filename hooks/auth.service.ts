import api from "./AxiosInstance";

type LoginPayload = { email: string; password: string };

export type AuthResult<T = any> =
  | { ok: true; data: T }
  | { ok: false; error: any };

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export async function login(payload: LoginPayload): Promise<AuthResult> {
  try {
    const res = await api.post("/auth/login", payload);

    const data = res.data?.data ?? res.data;

    if (typeof window !== "undefined") {
      if (data?.accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
        localStorage.setItem("id", data.account.accountId);
        localStorage.setItem("role", data.account.role);

        api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
      }

      if (data?.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      }
    }

    return { ok: true, data };
  } catch (e: any) {
    const error = e.response?.data ?? e.message ?? e;
    return { ok: false, error };
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {}

  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem("id");
    localStorage.removeItem("role");
  }
}

export async function getTokens(): Promise<{
  accessToken?: string | null;
  refreshToken?: string | null;
}> {
  if (typeof window === "undefined") {
    return {};
  }

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  return { accessToken, refreshToken };
}

export async function getProfile(): Promise<AuthResult> {
  try {
    const res = await api.get("/auth/me");
    const data = res.data?.data ?? res.data;
    return { ok: true, data };
  } catch (e: any) {
    const error = e.response?.data ?? e.message ?? e;
    return { ok: false, error };
  }
}

export async function register(payload: {
  email: string;
  password: string;
  phoneNumber?: string;
}): Promise<AuthResult> {
  try {
    const res = await api.post("/auth/register", payload);
    const data = res.data?.data ?? res.data;
    return { ok: true, data };
  } catch (e: any) {
    const error = e.response?.data ?? e.message ?? e;
    return { ok: false, error };
  }
}

export async function verifyEmail(
  email: string,
  otpCode: string
): Promise<AuthResult> {
  try {
    const res = await api.post("/auth/verify-email", { email, otpCode });
    const data = res.data?.data ?? res.data;
    return { ok: true, data };
  } catch (e: any) {
    const error = e.response?.data ?? e.message ?? e;
    return { ok: false, error };
  }
}

export async function resendOtp(email: string): Promise<AuthResult> {
  try {
    const res = await api.post("/auth/resend-otp", { email });
    const data = res.data?.data ?? res.data;
    return { ok: true, data };
  } catch (e: any) {
    const error = e.response?.data ?? e.message ?? e;
    return { ok: false, error };
  }
}

export async function getProfileById(id: string): Promise<AuthResult> {
  try {
    const res = await api.get(`/accounts/${id}`);
    const data = res.data?.data ?? res.data;
    return { ok: true, data };
  } catch (e: any) {
    const error = e.response?.data ?? e.message ?? e;
    return { ok: false, error };
  }
}

export async function getVendorById(id: string): Promise<AuthResult> {
  try {
    const res = await api.get(`/vendors/${id}`);
    const data = res.data?.data ?? res.data;
    return { ok: true, data };
  } catch (e: any) {
    const error = e.response?.data ?? e.message ?? e;
    return { ok: false, error };
  }
}

export async function getTraineeById(id: string): Promise<AuthResult> {
  try {
    const res = await api.get(`/trainees/${id}`);
    const data = res.data?.data ?? res.data;
    return { ok: true, data };
  } catch (e: any) {
    const error = e.response?.data ?? e.message ?? e;
    return { ok: false, error };
  }
}