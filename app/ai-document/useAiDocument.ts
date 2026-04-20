import { useEffect, useState } from "react";
import { AiDocumentType, CheckFileRes } from "@/utils/AiDocumentType";
import { AiDocumentService } from "@/hooks/aiDocument.service";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

export const useAiDocuments = () => {
  const SIZE = 10;

  // HOOKS
  const { showSuccess, showError, toasts, removeToast } = useToast();
  const { confirm, confirmState, isConfirmOpen, closeConfirm } = useConfirm();

  // STATE
  const [documents, setDocuments] = useState<AiDocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);

  const [selectedDocument, setSelectedDocument] =
    useState<AiDocumentType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // REFERENCE SECTION STATES
  const [roadmapStatus, setRoadmapStatus] = useState<CheckFileRes | null>(null);
  const [scoringStatus, setScoringStatus] = useState<CheckFileRes | null>(null);
  const [workoutStatus, setWorkoutStatus] = useState<CheckFileRes | null>(null);
  const [checkingSection, setCheckingSection] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);

  // API
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await AiDocumentService.getAll({
        pageSize: SIZE,
        pageToken: page > 0 ? String(page) : undefined,
      });
      setDocuments(res.files ?? []);
      // nextPageToken used as a way to determine if there's more
      setTotalPages(res.nextPageToken ? page + 2 : page + 1);
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const checkSectionStatus = async (section: string) => {
    setCheckingSection(section);
    try {
      let res: CheckFileRes;
      if (section === "roadmap") {
        res = await AiDocumentService.checkStatusOfRoadmapReference();
        setRoadmapStatus(res);
      } else if (section === "scoring") {
        res = await AiDocumentService.checkStatusOfScoringGuideline();
        setScoringStatus(res);
      } else {
        res = await AiDocumentService.checkStatusOfWorkoutFeedbackReference();
        setWorkoutStatus(res);
      }
      setActiveSection(section);
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra");
    } finally {
      setCheckingSection(null);
    }
  };

  const uploadSectionFile = async (section: string, file: File) => {
    setUploadingSection(section);
    try {
      let currentStatus: CheckFileRes | null = null;
      if (section === "roadmap") currentStatus = roadmapStatus;
      else if (section === "scoring") currentStatus = scoringStatus;
      else currentStatus = workoutStatus;

      // Delete old file first if exists
      if (currentStatus?.hasActiveDocument) {
        const fileName = currentStatus.documentUri.split("/").pop()!;
        if (section === "roadmap") {
          await AiDocumentService.deleteRoadmapReference(fileName);
        } else if (section === "scoring") {
          await AiDocumentService.deleteFile(fileName);
        } else {
          await AiDocumentService.deleteWorkoutFeedbackReference(fileName);
        }
      }

      // Upload
      if (section === "roadmap") {
        await AiDocumentService.uploadRoadmapReference({ file });
      } else if (section === "scoring") {
        await AiDocumentService.uploadScoringGuideline({ file });
      } else {
        await AiDocumentService.uploadWorkoutFeedbackReference({ file });
      }

      showSuccess("Tải lên thành công");
      await checkSectionStatus(section);
      await fetchAll();
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra");
    } finally {
      setUploadingSection(null);
    }
  };

  const downloadSectionFile = async (section: string) => {
    setIsLoading(true);
    try {
      let url: string;
      if (section === "roadmap") {
        url = await AiDocumentService.downloadRoadmapReference();
      } else if (section === "scoring") {
        url = await AiDocumentService.downloadScoringGuideline();
      } else {
        url = await AiDocumentService.downloadWorkoutFeedbackReference();
      }
      triggerDownload(url);
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = async (fileName: string) => {
    setIsLoading(true);
    try {
      const url = await AiDocumentService.downloadFile(fileName);
      triggerDownload(url, fileName);
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = (fileName: string) => {
    confirm({
      title: "Xoá tài liệu?",
      description: "Tài liệu này sẽ bị xoá vĩnh viễn và không thể khôi phục.",
      confirmLabel: "Xoá",
      variant: "danger",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await AiDocumentService.deleteFile(fileName);
          await fetchAll();
          showSuccess("Đã xoá tài liệu");
          if (showDetailModal) {
            setShowDetailModal(false);
            setSelectedDocument(null);
          }
        } catch (err: any) {
          showError(
            err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra",
          );
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  // HANDLERS
  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => (prev > 0 ? prev - 1 : 0));

  const openDetailModal = (doc: AiDocumentType) => {
    setSelectedDocument(doc);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedDocument(null);
    setShowDetailModal(false);
  };

  const triggerDownload = (url: string, fileName?: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // EFFECTS
  useEffect(() => {
    fetchAll();
  }, [page]);

  return {
    documents,
    isLoading,
    confirmState,
    isConfirmOpen,
    closeConfirm,
    fetchAll,
    totalPages,
    page,
    handleNextPage,
    handlePrevPage,
    selectedDocument,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    downloadFile,
    deleteFile,
    // Section
    roadmapStatus,
    scoringStatus,
    workoutStatus,
    checkingSection,
    activeSection,
    setActiveSection,
    uploadingSection,
    checkSectionStatus,
    uploadSectionFile,
    downloadSectionFile,
    toasts,
    removeToast,
  };
};
