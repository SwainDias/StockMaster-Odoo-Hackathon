import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  // local state for the editable form
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
    // wire up API call / mutation here
    console.log("Save profile", profile);
  };

  // helper: compute initials for avatar fallback
  const initials = profile.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader title="Profile" />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: compact profile summary */}
          <aside className="lg:col-span-4">
            <Card className="rounded-2xl shadow-md overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar fallback: initials inside a colored circle */}
                  <div
                    className="flex items-center justify-center rounded-full w-28 h-28 mb-4 text-white text-2xl font-semibold"
                    style={{ background: "#2F6DF6" }}
                  >
                    {initials}
                  </div>

                  <h3 className="text-xl font-semibold text-foreground">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{profile.role}</p>

                  <div className="mt-4 w-full space-y-3">
                    <div className="flex items-center justify-between px-4 py-2 bg-muted/50 rounded-lg">
                      <div>
                        <div className="text-xs text-muted-foreground">Email</div>
                        <div className="text-sm font-medium">{profile.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-4 py-2 bg-muted/50 rounded-lg">
                      <div>
                        <div className="text-xs text-muted-foreground">Phone</div>
                        <div className="text-sm font-medium">{profile.phone}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-4 py-2 bg-muted/50 rounded-lg">
                      <div>
                        <div className="text-xs text-muted-foreground">Joined</div>
                        <div className="text-sm font-medium">{profile.joined}</div>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">Active</Badge>
                    </div>

                    <div className="pt-2">
                      <Button
                        className="w-full"
                        onClick={() => {
                          // scroll to the editable form (right side)
                          const y = document.querySelector("main")?.getBoundingClientRect().top ?? 0;
                          window.scrollTo({ top: window.scrollY + y - 20, behavior: "smooth" });
                        }}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* small utilities card */}
            <Card className="mt-6 rounded-2xl shadow-sm">
              <CardContent className="p-4">
                <h4 className="text-sm font-semibold">Quick Info</h4>
                <p className="mt-2 text-xs text-muted-foreground">
                  Use this page to update your display name, contact details and role. Changes will reflect across
                  the application.
                </p>
              </CardContent>
            </Card>
          </aside>

          {/* Right: editable profile form */}
          <main className="lg:col-span-8">
            <Card className="rounded-2xl shadow-lg">
              <CardHeader className="p-6">
                <CardTitle className="text-2xl">Profile Details</CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={profile.name} onChange={handleChange("name")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={profile.role} onChange={handleChange("role")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profile.email} onChange={handleChange("email")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={profile.phone} onChange={handleChange("phone")} />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="joined">Joined Date</Label>
                    <Input id="joined" value={profile.joined} onChange={handleChange("joined")} type="date" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Short Bio</Label>
                    <Input id="bio" placeholder="Write a short bio (optional)" />
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
