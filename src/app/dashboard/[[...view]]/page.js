import DashboardClient from '@/components/dashboard/DashboardClient.js';

export default function Page() {
  return (
    // DashboardClient handles private route protection internally
    <DashboardClient />
  );
}