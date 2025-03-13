import React, { useState } from "react";

const ImageViewer = ({ memory }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!memory) return <p className="text-center text-gray-600">Please fetch an image.</p>;

  return (
    <div className="mt-8 text-center">
      <h3 className="text-2xl font-semibold mb-4">Historical Image</h3>
      <img
        src={memory.mostRelatedImage}
        alt="Historical"
        className="mx-auto border-2 border-gray-300 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
        onClick={() => setShowDetails(!showDetails)}
      />
      {showDetails && (
        <div className="mt-6 text-left max-w-2xl mx-auto bg-white p-4 rounded shadow">
          <h4 className="text-xl font-medium mt-2">Transformation Details</h4>
          <p className="text-gray-700">{memory.transformationDetails}</p>
          <h4 className="text-xl font-medium mt-4">Additional Information</h4>
          <p className="text-gray-700">{memory.info}</p>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
