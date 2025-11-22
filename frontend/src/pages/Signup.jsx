import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TruckIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const validateLoginId = (id) => {
    return id.length >= 6 && id.length <= 12;
  };

  const validatePassword = (pwd) => {
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    return pwd.length > 8 && hasLowerCase && hasUpperCase && hasSpecialChar;
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!loginId || !email || !password || !rePassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!validateLoginId(loginId)) {
      toast({
        title: "Invalid Login ID",
        description: "Login ID must be between 6-12 characters",
        variant: "destructive",
      });
      return;
    }

    if (!validatePassword(password)) {
      toast({
        title: "Invalid Password",
        description: "Password must be more than 8 characters and contain lowercase, uppercase, and special character",
        variant: "destructive",
      });
      return;
    }

    if (password !== rePassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Account created successfully",
    });
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <TruckIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up for StockMaster</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loginId">Login ID</Label>
              <Input
                id="loginId"
                placeholder="Enter Login ID (6-12 characters)"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email ID</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email ID"
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
            <div className="space-y-2">
              <Label htmlFor="rePassword">Re-Enter Password</Label>
              <Input
                id="rePassword"
                type="password"
                placeholder="Re-Enter Password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Login ID: 6-12 characters</p>
              <p>• Password: more than 8 characters</p>
              <p>• Must contain: lowercase, uppercase, and special character</p>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button type="submit" className="w-full h-11 text-base">
              Sign Up
            </Button>
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => navigate("/")}
            >
              Already have an account? Sign In
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;

