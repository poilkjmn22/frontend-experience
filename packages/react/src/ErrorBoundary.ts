import React from 'react';
import { report } from '@whnz/frontend-experience-core';

export class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}> {
  componentDidCatch(error: Error, info: any) {
    report({
      type: 'react-error',
      timestamp: Date.now(),
      extra: {
        message: error.message,
        stack: error.stack,
        componentStack: info.componentStack,
      },
    });
  }

  render() {
    return this.props.children;
  }
}
