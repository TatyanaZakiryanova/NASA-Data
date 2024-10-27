'use client';

import { Provider } from 'react-redux';

import { store } from '@/app/redux/store';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
