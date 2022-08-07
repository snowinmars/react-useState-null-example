import { PropsWithChildren } from 'react';

export type PropsWithClassName = PropsWithChildren<{
  readonly className?: string | null;
}>;
