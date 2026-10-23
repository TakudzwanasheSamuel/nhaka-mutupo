import type { Metadata } from 'next';
import { AdminApp } from '@/components/admin/AdminApp';

export const metadata: Metadata = {
  title: 'Nhaka Mutupo | Content review',
  robots: { index: false, follow: false },
};

/** Private review side. Not linked from the game. */
export default function AdminPage() {
  return <AdminApp />;
}
