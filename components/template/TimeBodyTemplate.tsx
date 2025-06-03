import { StageResult } from '@/types/race';
import { formatDuration } from '@/utils/parse-time';
import React from 'react';

export const TimeBodyTemplate = (rowData: StageResult) => {
  if (rowData.time) {
    return (
      <span className="text-gray-500">{formatDuration(rowData.time)}</span>
    );
  }
  return null;
};

export default TimeBodyTemplate;
