"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useCourses } from "./useCourses";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import SearchSection from "./_components/SearchSection";
import CourseTable from "./_components/CourseTable";
import DetailModal from "./_components/Modal/DetailModal";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import Pagination from "./_components/Pagination";

export default function CoursesPage() {
  // HOOK
  const {
    courses,
    isLoading,
    searchTerm,
    setSearchTerm,
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    createCourse,
    isModalOpen,
    isEditMode,
    modalData,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    exercises,
    handleRowClick,
    toasts,
    removeToast,
    confirmState,
    isConfirmOpen,
    confirm,
    closeConfirm,
    currentPage,
    deleteCourse,
    toggleCourseStatus,
    totalPages,
    setCurrentPage,
    filterLevel,
    setFilterLevel,
  } = useCourses();

  return (
    <div className="flex h-screen bg-orange-50">
      {isLoading && <LoadingOverlay />}

      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Khóa học" />
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6">
            {/* Search and Filter */}
            <SearchSection
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              filterLevel={filterLevel}
              onFilterLevelChange={setFilterLevel}
              openDetailModal={openCreateModal}
            />

            {/* Table */}
            <div className="overflow-x-auto">
              <CourseTable
                courses={courses}
                onRowClick={handleRowClick}
                onToggleStatus={toggleCourseStatus}
                onDelete={deleteCourse}
              />
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>

      <DetailModal
        open={isModalOpen}
        isEditMode={isEditMode}
        initialData={modalData}
        onOpenChange={(open) => !open && closeModal()}
        onSubmit={handleSubmit}
        exercises={exercises}
      />

      <Toast toasts={toasts} onRemove={removeToast} />

      {confirmState && (
        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={(open) => !open && closeConfirm()}
          title={confirmState.title}
          description={confirmState.description}
          confirmLabel={confirmState.confirmLabel}
          variant={confirmState.variant}
          onConfirm={confirmState.onConfirm}
        />
      )}
    </div>
  );
}
