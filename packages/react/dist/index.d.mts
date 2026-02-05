import React from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

declare class ErrorBoundary extends React.Component<{
    children: React.ReactNode;
}> {
    componentDidCatch(error: Error, info: any): void;
    render(): React.ReactNode;
}

declare function withProfiler<T extends React.ComponentType<any>>(Component: T, id: string): (props: React.ComponentProps<T>) => react_jsx_runtime.JSX.Element;

export { ErrorBoundary, withProfiler };
