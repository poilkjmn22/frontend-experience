import React from 'react';
import { report } from '@whnz/frontend-experience-core';
export class ErrorBoundary extends React.Component {
    componentDidCatch(error, info) {
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
//# sourceMappingURL=ErrorBoundary.js.map