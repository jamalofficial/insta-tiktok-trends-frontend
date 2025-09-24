import React from "react";
import { useNavigate } from "react-router-dom";

const TopicHeader = ({ topic, topicId }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/topics")}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Topics
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Topic Results
          </h1>
          <p className="text-lg text-gray-600">
            {topic
              ? `Results for "${topic.topic}"`
              : "Loading topic details..."}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Topic ID</div>
          <div className="text-lg font-semibold text-gray-900">{topicId}</div>
        </div>
      </div>
    </div>
  );
};

export default TopicHeader;
