import React from "react";

const TopicInfoCard = ({ topic, formatDate }) => {
  if (!topic) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-6 mb-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{topic.topic}</h2>
          <div className="flex items-center space-x-6 text-purple-100">
            <div>
              <span className="text-sm">Total Results:</span>
              <span className="ml-2 font-semibold">
                {topic.topic_results.length}
              </span>
            </div>
            <div>
              <span className="text-sm">Last Scrape:</span>
              <span className="ml-2 font-semibold">
                {topic.last_scrape ? formatDate(topic.last_scrape) : "Never"}
              </span>
            </div>
            <div>
              <span className="text-sm">Created:</span>
              <span className="ml-2 font-semibold">
                {formatDate(topic.created_at)}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-purple-200">
            {topic.topic_results.length}
          </div>
          <div className="text-purple-100">Results Found</div>
        </div>
      </div>
    </div>
  );
};

export default TopicInfoCard;
