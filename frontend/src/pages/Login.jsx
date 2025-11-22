import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TruckIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { authAPI, setToken } from "@/lib/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotStep, setForgotStep] = useState("email"); // 'email' | 'reset'
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      setToken(response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    setForgotLoading(true);
    try {
      const response = await authAPI.forgotPassword(forgotEmail);
      toast({
        title: "OTP Sent",
        description: response.message || "OTP sent to your email. Check your inbox or console for OTP (dev mode)",
      });
      // In dev mode, the OTP is returned in the response
      if (response.otp) {
        console.log("OTP (dev mode):", response.otp);
        toast({
          title: "OTP (Dev Mode)",
          description: `OTP: ${response.otp}`,
        });
      }
      setForgotStep("reset");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setForgotLoading(true);
    try {
      await authAPI.resetPassword(forgotEmail, otp, newPassword);
      toast({
        title: "Success",
        description: "Password reset successfully. You can now login with your new password.",
      });
      setForgotPasswordOpen(false);
      setForgotStep("email");
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <TruckIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">StockMaster</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <Dialog 
                open={forgotPasswordOpen} 
                onOpenChange={(open) => {
                  setForgotPasswordOpen(open);
                  if (!open) {
                    // Reset form when dialog closes
                    setForgotStep("email");
                    setForgotEmail("");
                    setOtp("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }
                }}
              >
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-primary hover:underline"
                  >
                    Forget Password?
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                      {forgotStep === "email" && "Enter your email to receive an OTP"}
                      {forgotStep === "reset" && "Enter the OTP and your new password"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {forgotStep === "email" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="forgotEmail">Email</Label>
                          <Input
                            id="forgotEmail"
                            type="email"
                            placeholder="Enter your email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={handleForgotPassword}
                          disabled={forgotLoading}
                          className="w-full"
                        >
                          {forgotLoading ? "Sending..." : "Send OTP"}
                        </Button>
                      </>
                    )}
                    {forgotStep === "reset" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="otp">OTP</Label>
                          <Input
                            id="otp"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Check your email or console (dev mode) for OTP
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setForgotStep("email")}
                            className="flex-1"
                          >
                            Back
                          </Button>
                          <Button
                            onClick={handleResetPassword}
                            disabled={forgotLoading}
                            className="flex-1"
                          >
                            {forgotLoading ? "Resetting..." : "Reset Password"}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;

