import api from "./AxiosInstance";

type LoginPayload = { email: string; password: string };

// 1. Thiết kế lại AuthResult để tường minh và dễ dùng hơn ở UI
export type AuthResult<T = any> =
  | { ok: true; data: T }
  | { ok: false; errorCode: string; message: string };

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * Hàm Helper nội bộ: Chuẩn hóa mọi phản hồi (thành công lẫn thất bại)
 * từ Backend về cấu trúc AuthResult chuẩn của Frontend.
 */
function handleApiResponse(res: any): AuthResult {
  const payload = res?.data;

  // Trường hợp backend trả về JSON có flag success (như cấu trúc của bạn)
  if (payload && typeof payload === 'object' && 'success' in payload) {
    if (payload.success === true) {
      return { ok: true, data: payload.data ?? payload };
    }
    return {
      ok: false,
      errorCode: payload.errorCode || "UNKNOWN_ERROR",
      message: payload.message || "Đã có lỗi xảy ra",
    };
  }

  // Trường hợp dự phòng nếu API trả về data thô trực tiếp (không qua bọc success)
  return { ok: true, data: payload };
}

/**
 * Hàm Helper nội bộ: Chuyển đổi mọi Exception (mã 4xx, 5xx từ Axios)
 * thành định dạng AuthResult để UI không bao giờ phải viết try...catch nữa.
 */
function handleApiError(e: any): AuthResult {
  const errorData = e.response?.data;

  return {
    ok: false,
    // Ưu tiên đọc cấu trúc lỗi JSON từ backend của bạn
    errorCode: errorData?.errorCode || `HTTP_${e.response?.status || "ERROR"}`,
    message: errorData?.message || e.message || "Lỗi kết nối hệ thống",
  };
}

// =========================================================================
// CÁC PHƯƠNG THỨC API CHÍNH (Đã tinh gọn logic xử lý nhờ Helper)
// =========================================================================

export async function login(payload: LoginPayload): Promise<AuthResult> {
  try {
    const res = await api.post("/auth/login", payload);
    const result = handleApiResponse(res);

    if (result.ok && typeof window !== "undefined") {
      const data = result.data;
      if (data?.accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
        localStorage.setItem("id", data.account?.accountId || "");
        localStorage.setItem("role", data.account?.role || "");
        api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
      }
      if (data?.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      }
    }
    return result;
  } catch (e: any) {
    return handleApiError(e);
  }
}

export async function logout(): Promise<void> {
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
  if (typeof window === "undefined") return {};
  return {
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

export async function getProfile(): Promise<AuthResult> {
  try {
    const res = await api.get("/auth/me");
    return handleApiResponse(res);
  } catch (e: any) {
    return handleApiError(e);
  }
}

export async function register(payload: {
  email: string;
  password: string;
  phoneNumber?: string;
}): Promise<AuthResult> {
  try {
    const res = await api.post("/auth/register", payload);
    return handleApiResponse(res);
  } catch (e: any) {
    return handleApiError(e);
  }
}

export async function registerVendor(payload: {
  email: string;
  password: string;
  phoneNumber?: string;
}): Promise<AuthResult> {
  try {
    const res = await api.post("/auth/register-vendor", payload);
    return handleApiResponse(res);
  } catch (e: any) {
    return handleApiError(e);
  }
}

export async function verifyEmail(email: string, otpCode: string): Promise<AuthResult> {
  try {
    const res = await api.post("/auth/verify-email", { 'email': email, 'otpCode': otpCode });
    return handleApiResponse(res);
  } catch (e: any) {
    return handleApiError(e);
  }
}

export async function resendOtp(email: string): Promise<AuthResult> {
  try {
    const res = await api.post("/auth/resend-otp", { 'email': email });
    return handleApiResponse(res);
  } catch (e: any) {
    return handleApiError(e);
  }
}

export async function getProfileById(id: string): Promise<AuthResult> {
  try {
    const res = await api.get(`/accounts/${id}`);
    return handleApiResponse(res);
  } catch (e: any) {
    return handleApiError(e);
  }
}

export async function getVendorById(id: string): Promise<AuthResult> {
  try {
    const res = await api.get(`/vendors/${id}`);
    return handleApiResponse(res);
  } catch (e: any) {
    return handleApiError(e);
  }
}

export async function getTraineeById(id: string): Promise<AuthResult> {
  try {
    const res = await api.get(`/trainees/${id}`);
    return handleApiResponse(res);
  } catch (e: any) {
    return handleApiError(e);
  }
}