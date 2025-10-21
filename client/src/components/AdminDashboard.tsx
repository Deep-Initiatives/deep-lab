import { useLocation } from "wouter";
import { Switch, Route } from "wouter";
import { AdminLayout } from "@/components/AdminLayout";
import AdminDashboardHome from "@/pages/admin/AdminDashboardHome";
import { AdminPodsPage } from "@/pages/admin/AdminPodsPage";
import { AdminAppsPage } from "@/pages/admin/AdminAppsPage";
import { AdminBlogsPage } from "@/pages/admin/AdminBlogsPage";
import { AdminApplicationsPage } from "@/pages/admin/AdminApplicationsPage";
import { AdminIdeasPage } from "@/pages/admin/AdminIdeasPage";
import { AdminContactsPage } from "@/pages/admin/AdminContactsPage";

interface AdminDashboardProps {
  isAdmin: boolean;
}

export function AdminDashboard({ isAdmin }: AdminDashboardProps) {
  const [location] = useLocation();

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground">You need admin privileges to access this dashboard.</p>
      </div>
    );
  }

  // Determine which component to render based on the current location
  const renderContent = () => {
    if (location === "/admin") {
      return <AdminDashboardHome />;
    } else if (location === "/admin/pods") {
      return <AdminPodsPage />;
    } else if (location === "/admin/apps") {
      return <AdminAppsPage />;
    } else if (location === "/admin/blogs") {
      return <AdminBlogsPage />;
    } else if (location === "/admin/applications") {
      return <AdminApplicationsPage />;
    } else if (location === "/admin/ideas") {
      return <AdminIdeasPage />;
    } else if (location === "/admin/contacts") {
      return <AdminContactsPage />;
    } else if (location === "/admin/settings") {
      return <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon...</p></div>;
    } else {
      return <AdminDashboardHome />;
    }
  };

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  );
}