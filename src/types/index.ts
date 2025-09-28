/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ErrorFallbackProps {
	error: any;
	resetErrorBoundary: (...args: any[]) => void;
}
