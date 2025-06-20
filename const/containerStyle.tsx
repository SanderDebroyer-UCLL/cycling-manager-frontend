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

export const container: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#efedf4',
  borderRadius: '0.75rem',
  padding: '1rem',
  gap: '0.5rem',
  animation: 'fadeIn 500ms cubic-bezier(0.22, 1, 0.36, 1)',
};

export const containerLargerPadding: React.CSSProperties = {
  ...container,
  padding: '1.5rem',
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
