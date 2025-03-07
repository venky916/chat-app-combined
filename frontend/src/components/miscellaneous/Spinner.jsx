import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-sky-600"></div>
    </div>
  );
};

export default Spinner;
