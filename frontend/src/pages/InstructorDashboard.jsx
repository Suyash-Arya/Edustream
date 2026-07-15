import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useCourseStore } from '../store/courseStore';
import { useNotification } from '../hooks/useNotification';
import CreateCourseModal from '../components/CreateCourseModal';

export default function InstructorDashboard() {
  const { myCreatedCourses, loading, getMyCreatedCourses } = useCourseStore();
  const { success, error } = useNotification();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      await getMyCreatedCourses();
    } catch (err) {
      error('Failed to load courses');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-main">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Instructor Dashboard</h1>
            <p className="text-gray-600 mt-2">Create and manage your courses</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Course
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card p-6">
            <p className="text-gray-600 text-sm">Total Courses</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {myCreatedCourses.length}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm">Total Students</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {myCreatedCourses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0)}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm">Published Courses</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {myCreatedCourses.filter(c => c.isPublished).length}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm">Draft Courses</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {myCreatedCourses.filter(c => !c.isPublished).length}
            </p>
          </div>
        </div>

        {/* Courses Table */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Your Courses</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">Loading courses...</p>
            </div>
          ) : myCreatedCourses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">No courses yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create Your First Course
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-t border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Course Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myCreatedCourses.map((course) => (
                    <tr key={course._id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{course.title}</p>
                          <p className="text-sm text-gray-600">{course.totalLectures} lectures</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{course.category}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {course.enrolledStudents?.length || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          course.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">${course.price}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadCourses();
          }}
        />
      )}
    </div>
  );
}
