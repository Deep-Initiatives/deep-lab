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
import AdminProfilePage from "@/pages/admin/AdminProfilePage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";

interface AdminDashboardProps {
  isAdmin: boolean;
  userRole?: string;
}

export function AdminDashboard({ isAdmin, userRole }: AdminDashboardProps) {
  const [location] = useLocation();

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground">You need admin privileges to access this dashboard.</p>
      </div>
    );
  }

  // Check if user has permission to access the current page
  const hasPermission = (page: string) => {
    if (userRole === "blog-admin") {
      return page === "blogs" || page === "dashboard" || page === "settings";
    }
    return true; // Full admin has access to everything
  };

  // Determine which component to render based on the current location
  const renderContent = () => {
    if (location === "/admin") {
      return <AdminDashboardHome userRole={userRole} />;
    } else if (location === "/admin/pods") {
      if (!hasPermission("pods")) {
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        );
      }
      return <AdminPodsPage />;
    } else if (location === "/admin/apps") {
      if (!hasPermission("apps")) {
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        );
      }
      return <AdminAppsPage />;
    } else if (location === "/admin/blogs") {
      if (!hasPermission("blogs")) {
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        );
      }
      return <AdminBlogsPage />;
    } else if (location === "/admin/applications") {
      if (!hasPermission("applications")) {
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        );
      }
      return <AdminApplicationsPage />;
    } else if (location === "/admin/ideas") {
      if (!hasPermission("ideas")) {
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        );
      }
      return <AdminIdeasPage />;
    } else if (location === "/admin/contacts") {
      if (!hasPermission("contacts")) {
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        );
      }
      return <AdminContactsPage />;
    } else if (location === "/admin/settings") {
      if (!hasPermission("settings")) {
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        );
      }
      return <AdminProfilePage />;
    } else if (location === "/admin/users") {
      if (userRole !== "admin") {
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        );
      }
      return <AdminUsersPage />;
    } else {
      return <AdminDashboardHome userRole={userRole} />;
    }
  };

  return (
    <AdminLayout userRole={userRole}>
      {renderContent()}
    </AdminLayout>
  );
}