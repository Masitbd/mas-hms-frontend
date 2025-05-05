import React from "react";

const TransactionSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="mb-6 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/5"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

            <div className="mt-6">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
              {[1, 2].map((subItem) => (
                <div key={subItem} className="my-4">
                  <div className="flex justify-between items-center p-3 border-b border-gray-100">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionSkeleton;
