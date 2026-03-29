"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useCourses } from "./useCourses";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import SearchSection from "./_components/SearchSection";
import CourseTable from "./_components/CourseTable";
import Pagination from "./_components/Pagination";
import DetailModal from "./_components/Modal/DetailModal";

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
              openDetailModal={openCreateModal}
            />

            {/* Table */}
            <div className="overflow-x-auto">
              <CourseTable courses={courses} onRowClick={handleRowClick} />
            </div>

            {/* Pagination */}
            <Pagination />
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
    </div>
  );
}
