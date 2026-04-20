import {
  AiDocumentRes,
  AiDocumentsReq,
  CheckFileRes,
  UploadFileReq,
  UploadFileRes,
} from "@/utils/AiDocumentType";
import api from "./AxiosInstance";
import { ApiResponse } from "@/utils/ApiResType";

export const AiDocumentService = {
  // GET ALL
  getAll: async (params?: AiDocumentsReq): Promise<AiDocumentRes> => {
    const res = await api.get<ApiResponse<AiDocumentRes>>(
      `/admin/ai-documents/list`,
      { params },
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // CHECK STATUS OF ROADMAP REFERENCE
  checkStatusOfRoadmapReference: async (): Promise<CheckFileRes> => {
    const res = await api.get<ApiResponse<CheckFileRes>>(
      `/admin/ai-documents/roadmap-reference/status`,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // CHECK STATUS OF SCORING GUIDELINE
  checkStatusOfScoringGuideline: async (): Promise<CheckFileRes> => {
    const res = await api.get<ApiResponse<any>>(
      `/admin/ai-documents/guideline-status`,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    const data = res.data.data;
    return {
      hasActiveDocument: data.hasActiveGuideline,
      documentUri: data.guidelineUri,
      message: data.message,
    };
  },

  // CHECK STATUS OF WORKOUT FEEDBACK REFERENCE
  checkStatusOfWorkoutFeedbackReference: async (): Promise<CheckFileRes> => {
    const res = await api.get<ApiResponse<CheckFileRes>>(
      `/admin/ai-documents/workout-feedback-reference/status`,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // UPLOAD FILE
  uploadFile: async (payload: UploadFileReq): Promise<UploadFileRes> => {
    const formData = new FormData();
    formData.append("file", payload.file);

    const res = await api.post<ApiResponse<UploadFileRes>>(
      `/admin/ai-documents/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          displayName: payload.displayName,
        },
      },
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // UPLOAD ROADMAP REFERENCE
  uploadRoadmapReference: async (
    payload: UploadFileReq,
  ): Promise<UploadFileRes> => {
    const formData = new FormData();
    formData.append("file", payload.file);

    const res = await api.post<ApiResponse<UploadFileRes>>(
      `/admin/ai-documents/roadmap-reference`,

      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // UPLOAD SCORING GUIDELINE
  uploadScoringGuideline: async (
    payload: UploadFileReq,
  ): Promise<UploadFileRes> => {
    const formData = new FormData();
    formData.append("file", payload.file);

    const res = await api.post<ApiResponse<UploadFileRes>>(
      `/admin/ai-documents/scoring-guideline`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // UPLOAD WORKOUT FEEDBACK REFERENCE
  uploadWorkoutFeedbackReference: async (
    payload: UploadFileReq,
  ): Promise<UploadFileRes> => {
    const formData = new FormData();
    formData.append("file", payload.file);

    const res = await api.post<ApiResponse<UploadFileRes>>(
      `/admin/ai-documents/workout-feedback-reference`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // DOWNLOAD FILE
  downloadFile: async (fileName: string): Promise<string> => {
    const res = await api.get<ApiResponse<string>>(
      `/admin/ai-documents/download/${fileName}`,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // DOWNLOAD ROADMAP REFERENCE
  downloadRoadmapReference: async (): Promise<string> => {
    const res = await api.get<ApiResponse<string>>(
      `/admin/ai-documents/download-roadmap-reference`,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // DOWNLOAD SCORING GUIDELINE
  downloadScoringGuideline: async (): Promise<string> => {
    const res = await api.get<ApiResponse<string>>(
      `/admin/ai-documents/download-guideline`,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // DOWNLOAD WORKOUT FEEDBACK REFERENCE
  downloadWorkoutFeedbackReference: async (): Promise<string> => {
    const res = await api.get<ApiResponse<string>>(
      `/admin/ai-documents/download-workout-feedback-reference`,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // DELETE FILE
  deleteFile: async (fileName: string): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(
      `/admin/ai-documents/file/${fileName}`,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // DELETE ROADMAP REFERENCE
  deleteRoadmapReference: async (fileName: string): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(
      `/admin/ai-documents/roadmap-reference/${fileName}`,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },

  // DELETE WORKOUT FEEDBACK REFERENCE
  deleteWorkoutFeedbackReference: async (fileName: string): Promise<any> => {
    const res = await api.delete<ApiResponse<any>>(
      `/admin/ai-documents/workout-feedback-reference/${fileName}`,
    );

    if (!res.data.success) {
      throw {
        type: "BUSINESS_ERROR",
        message: res.data.message,
        errorCode: res.data.errorCode,
      };
    }

    return res.data.data;
  },
};
