import { Link } from "react-router-dom";
import { Star, Users, Clock } from "lucide-react";

export default function CourseCard({ course }) {
  return (
    <Link to={`/course/${course._id}`}>
      <div className="card overflow-hidden h-full hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        {/* Thumbnail */}
        <div className="relative overflow-hidden bg-gray-200 h-48">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ${course.price}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category and Level */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase">
              {course.category}
            </span>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              {course.level}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>

          {/* Subtitle */}
          {course.subtitle && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-1">
              {course.subtitle}
            </p>
          )}

          {/* Description preview */}
          {course.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {course.description}
            </p>
          )}

          {/* Instructor */}
          <p className="text-sm text-gray-700 mb-3">
            by{" "}
            <span className="font-semibold">
              {course.instructor?.name || "Instructor"}
            </span>
          </p>

          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.5</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{course.enrolledStudents?.length || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{course.totalLectures || 0} lectures</span>
            </div>
          </div>

          {/* Extra details */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <span>{course.category}</span>
            <span className="capitalize">{course.level}</span>
          </div>

          {/* CTA Button */}
          <button className="w-full btn-primary">View Course</button>
        </div>
      </div>
    </Link>
  );
}
