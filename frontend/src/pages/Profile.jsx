import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "Ravi Singh",
    role: "Warehouse Admin",
    email: "ravi.singh@example.com",
    phone: "+91 98765 43210",
    joined: "2024-01-10",
  });

  const handleChange = (key) => (e) => {
    setProfile((p) => ({ ...p, [key]: e.target.value }));
  };

  const handleSave = () => {
    console.log("Save profile:", profile);
  };

  const handleLogout = () => {
    // You can add your logout logic: clearing tokens, navigating to login, etc.
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader title="Profile" />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left profile summary */}
          <aside className="lg:col-span-4">
            <Card className="rounded-2xl shadow-md overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">

                  {/* Avatar Circle */}
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-muted flex items-center justify-center mb-4">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        profile.name
                      )}&background=2F6DF6&color=fff`}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-xl font-semibold">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">{profile.role}</p>

                  <div className="mt-4 w-full space-y-3">

                    {/* Email */}
                    <div className="px-4 py-2 bg-muted/50 rounded-lg text-left">
                      <div className="text-xs text-muted-foreground">Email</div>
                      <div className="text-sm font-medium">{profile.email}</div>
                    </div>

                    {/* Phone */}
                    <div className="px-4 py-2 bg-muted/50 rounded-lg text-left">
                      <div className="text-xs text-muted-foreground">Phone</div>
                      <div className="text-sm font-medium">{profile.phone}</div>
                    </div>

                    {/* Joined */}
                    <div className="px-4 py-2 bg-muted/50 rounded-lg text-left">
                      <div className="text-xs text-muted-foreground">Joined</div>
                      <div className="text-sm font-medium">{profile.joined}</div>
                    </div>

                    {/* Edit Button */}
                    <Button
                      className="w-full mt-2"
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                      Edit Profile
                    </Button>

                    {/* Logout Button */}
                    <Button
                      variant="outline"
                      className="w-full mt-2 border-red-500 text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>

                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Right editable form */}
          <main className="lg:col-span-8">
            <Card className="rounded-2xl shadow-lg">
              <CardHeader className="p-6">
                <CardTitle className="text-2xl">Profile Details</CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={profile.name} onChange={handleChange("name")} />
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={profile.role} onChange={handleChange("role")} />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profile.email} onChange={handleChange("email")} />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={profile.phone} onChange={handleChange("phone")} />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Joined Date</Label>
                    <Input type="date" value={profile.joined} onChange={handleChange("joined")} />
                  </div>

                </div>

                <div className="mt-6 flex items-center gap-3">
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
