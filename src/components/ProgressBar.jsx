import React from 'react';

const ProgressBar = ({ percentage }) => {
  return (
    <div className="pt-4">
      <div className="flex items-center justify-between">
        <div className="w-full bg-blue-950 rounded-full p-1">
          <div
            style={{ width: `${percentage}%` }}
            className="text-xs leading-none text-center text-white bg-blue-600 rounded-full p-1 px-2"
          >
            {percentage > 0 && percentage <= 100 ? `${percentage}%` : '~0'}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProgressBar;
