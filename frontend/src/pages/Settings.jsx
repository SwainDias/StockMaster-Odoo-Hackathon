import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader title="Settings" />

        <div className="mt-10 w-full flex justify-center">
          <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-8">

            {/* Warehouse Card */}
            <a href="/warehouse" className="no-underline block">
              <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-50 to-white border border-blue-100 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-800">Warehouse</h4>
                    <p className="mt-2 text-sm text-blue-600">Manage warehouses and their details</p>
                  </div>
                  <div className="flex items-center justify-center bg-white rounded-full w-11 h-11 shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                      <path d="M3 9L12 4l9 5v8a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1V9z" stroke="currentColor" strokeWidth="1.2"></path>
                    </svg>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="inline-block px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium">
                    Master Data
                  </span>
                  <span className="text-xs text-gray-500">Click to open details & manage</span>
                </div>
              </div>
            </a>

            {/* Location Card */}
            <a href="/location" className="no-underline block">
              <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-50 to-white border border-emerald-100 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-emerald-800">Location</h4>
                    <p className="mt-2 text-sm text-emerald-600">Manage storage locations and assignments</p>
                  </div>
                  <div className="flex items-center justify-center bg-white rounded-full w-11 h-11 shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
                      <path d="M12 2v20M5 8h14" stroke="currentColor" strokeWidth="1.2"></path>
                    </svg>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="inline-block px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium">
                    Master Data
                  </span>
                  <span className="text-xs text-gray-500">Click to open details & manage</span>
                </div>
              </div>
            </a>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Settings;
