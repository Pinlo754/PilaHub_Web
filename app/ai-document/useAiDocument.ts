import { useEffect, useState } from "react";
import { AiDocumentType, CheckFileRes } from "@/utils/AiDocumentType";
import { AiDocumentService } from "@/hooks/aiDocument.service";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";

export const useAiDocuments = () => {
  const SIZE = 10;

  const { showSuccess, showError, toasts, removeToast } = useToast();
  const { confirm, confirmState, isConfirmOpen, closeConfirm } = useConfirm();

  const [documents, setDocuments] = useState<AiDocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);

  const [selectedDocument, setSelectedDocument] =
    useState<AiDocumentType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Section states — mỗi section độc lập
  const [roadmapStatus, setRoadmapStatus] = useState<CheckFileRes | null>(null);
  const [roadmapReviewStatus, setRoadmapReviewStatus] =
    useState<CheckFileRes | null>(null);
  const [scoringStatus, setScoringStatus] = useState<CheckFileRes | null>(null);
  const [workoutStatus, setWorkoutStatus] = useState<CheckFileRes | null>(null);

  const [checkingSection, setCheckingSection] = useState<string | null>(null);
  // activeSection is now a Set to allow multiple expanded sections
  const [activeSections, setActiveSections] = useState<Set<string>>(new Set());
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
      } else if (section === "roadmapReview") {
        res = await AiDocumentService.checkStatusOfRoadmapReviewReference();
        setRoadmapReviewStatus(res);
      } else if (section === "scoring") {
        res = await AiDocumentService.checkStatusOfScoringGuideline();
        setScoringStatus(res);
      } else {
        res = await AiDocumentService.checkStatusOfWorkoutFeedbackReference();
        setWorkoutStatus(res);
      }
      setActiveSections((prev) => new Set(prev).add(section));
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra");
    } finally {
      setCheckingSection(null);
    }
  };

  const toggleSection = (section: string) => {
    setActiveSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        // trigger check if not yet loaded
        checkSectionStatus(section);
      }
      return next;
    });
  };

  const uploadSectionFile = async (section: string, file: File) => {
    setUploadingSection(section);
    try {
      let currentStatus: CheckFileRes | null = null;
      if (section === "roadmap") currentStatus = roadmapStatus;
      else if (section === "roadmapReview") currentStatus = roadmapReviewStatus;
      else if (section === "scoring") currentStatus = scoringStatus;
      else currentStatus = workoutStatus;

      // Delete old file first if exists
      if (currentStatus?.hasActiveDocument) {
        const fileName = currentStatus.documentUri.split("/").pop()!;
        if (section === "roadmap") {
          await AiDocumentService.deleteRoadmapReference(fileName);
        } else if (section === "roadmapReview") {
          await AiDocumentService.deleteRoadmapReviewReference(fileName);
        } else if (section === "scoring") {
          await AiDocumentService.deleteFile(fileName);
        } else {
          await AiDocumentService.deleteWorkoutFeedbackReference(fileName);
        }
      }

      if (section === "roadmap") {
        await AiDocumentService.uploadRoadmapReference({ file });
      } else if (section === "roadmapReview") {
        await AiDocumentService.uploadRoadmapReviewReference({ file });
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
      let blob: Blob;
      let fileName: string;

      if (section === "roadmap") {
        blob = await AiDocumentService.downloadRoadmapReference();
        fileName = "roadmap-reference";
      } else if (section === "roadmapReview") {
        blob = await AiDocumentService.downloadRoadmapReviewReference();
        fileName = "roadmap-review-reference";
      } else if (section === "scoring") {
        blob = await AiDocumentService.downloadScoringGuideline();
        fileName = "scoring-guideline";
      } else {
        blob = await AiDocumentService.downloadWorkoutFeedbackReference();
        fileName = "workout-feedback-reference";
      }

      triggerDownload(blob, fileName);
    } catch (err: any) {
      showError(err?.type === "BUSINESS_ERROR" ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = async (fileName: string) => {
    setIsLoading(true);
    try {
      const blob = await AiDocumentService.downloadFile(fileName);
      triggerDownload(blob, fileName);
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

  const triggerDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
    roadmapReviewStatus,
    scoringStatus,
    workoutStatus,
    checkingSection,
    activeSections,
    toggleSection,
    uploadingSection,
    checkSectionStatus,
    uploadSectionFile,
    downloadSectionFile,
    toasts,
    removeToast,
  };
};
