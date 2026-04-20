export type AiDocumentType = {
  name: string;
  displayName: string;
  mimeType: string;
  sizeBytes: string;
  state: string;
  createTime: string;
  updateTime: string;
  expirationTime: string;
  uri: string;
  sha256Hash: string;
};

export type AiDocumentsReq = {
  pageSize?: number;
  pageToken?: string;
};

export type AiDocumentRes = {
  files: AiDocumentType[];
  nextPageToken: string | null;
};

export type CheckFileRes = {
  hasActiveDocument: boolean;
  documentUri: string;
  message: string;
};

export type UploadFileReq = {
  file: File;
  displayName?: string;
};

export type UploadFileRes = {
  success: boolean;
  message: string;
  fileName: string;
  fileUri: string;
  state: string;
  displayName: string;
  sizeBytes: number;
  expirationTime: string;
};
