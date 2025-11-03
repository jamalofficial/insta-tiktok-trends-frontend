import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";

const ResultsHeader = ({ topic, topicId }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <ChevronLeftIcon
            onClick={() => navigate("/topics")}
            className="flex items-center rounded-full w-8 h-8 p-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
          />
            
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {topic?.topic}
            <p className="text-xs font-normal">Topic ID <span className="font-semibold ">{topicId}</span></p>
          </h1>
          {/* <p className="text-lg text-gray-600">
            {topic
              ? `Results for "${topic.topic}"`
              : "Loading topic details..."}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default ResultsHeader;
