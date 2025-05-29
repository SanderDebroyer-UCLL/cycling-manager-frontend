import { CSSProperties } from 'react';

export const containerShadow: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#FFFFFF',
  boxShadow:
    '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
  borderRadius: '0.75rem',
  padding: '1rem',
  gap: '0.5rem',
  border: '1px solid #b3c4d6',
};

export const container: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ECEEF4',
  borderRadius: '0.75rem',
  padding: '1rem',
  gap: '0.5rem',
  // border: '1px solid #b3c4d6',
};

export const oldContainer: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f4f6f9',
  boxShadow:
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)', // shadow-md
  borderRadius: '0.5rem',
  padding: '1rem',
  gap: '0.5rem',
  border: '1px solid #b3c4d6',
};
