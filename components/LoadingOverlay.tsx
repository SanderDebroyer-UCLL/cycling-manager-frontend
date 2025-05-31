// components/LoadingOverlay.tsx
import { ProgressSpinner } from 'primereact/progressspinner';

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-surface z-50">
      <ProgressSpinner
        style={{ width: '100px', height: '100px' }}
        strokeWidth="8"
        className="stroke-primary-500"
        animationDuration=".5s"
      />
    </div>
  );
}
