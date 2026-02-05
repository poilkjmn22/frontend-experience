import React, { Profiler } from 'react';
import { report } from '@whnz/frontend-experience-core';

export function withProfiler<T extends React.ComponentType<any>>(
  Component: T,
  id: string
) {
  type Props = React.ComponentProps<T>;

  return function ProfiledComponent(props: Props) {
    return (
      <Profiler
        id={id}
        onRender={(_, phase, actualDuration) => {
          if (actualDuration > 30) {
            report({
              type: 'react-render',
              duration: actualDuration,
              timestamp: Date.now(),
              extra: { id, phase }
            });
          }
        }}
      >
        <Component {...props} />
      </Profiler>
    );
  };
}
