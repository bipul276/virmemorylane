import React from 'react';

const TimeFilter = ({ years, setYears }) => {
  return (
    <div className="mb-6">
      <label htmlFor="years" className="block text-gray-700 font-medium mb-2">
        Select Time Range:
      </label>
      <select
        id="years"
        value={years}
        onChange={(e) => setYears(e.target.value)}
        className="border border-gray-300 rounded p-2 w-full"
      >
        <option value="all">All</option>
        <option value="10">10 Years</option>
        <option value="20">20 Years</option>
      </select>
    </div>
  );
};

export default TimeFilter;
