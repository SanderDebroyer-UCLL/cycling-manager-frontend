import { Toast } from 'primereact/toast';
import { createRef } from 'react';

export const toastRef = createRef<Toast>();

type ToastProps = {
  severity?: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';
  summary: string;
  detail: string;
};

export const showErrorToast = ({
  severity = 'error',
  summary,
  detail,
}: ToastProps) => {
  toastRef.current?.show({ severity, summary, detail });
};

export const showSuccessToast = ({
  severity = 'success',
  summary,
  detail,
}: ToastProps) => {
  toastRef.current?.show({ severity, summary, detail });
};

export const showInfoToast = ({
  severity = 'info',
  summary,
  detail,
}: ToastProps) => {
  toastRef.current?.show({ severity, summary, detail });
};

export const showWarnToast = ({
  severity = 'warn',
  summary,
  detail,
}: ToastProps) => {
  toastRef.current?.show({ severity, summary, detail });
};

export const showSecondaryToast = ({
  severity = 'secondary',
  summary,
  detail,
}: ToastProps) => {
  toastRef.current?.show({ severity, summary, detail });
};

export const showContrastToast = ({
  severity = 'contrast',
  summary,
  detail,
}: ToastProps) => {
  toastRef.current?.show({ severity, summary, detail });
};
