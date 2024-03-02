import * as React from "react";
import { useAuth } from "@clerk/clerk-react";
import { Outlet, useNavigate } from "react-router-dom";

export default function CompareLayout() {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  // console.log("test userId by clerk → ", userId);

  React.useEffect(() => {
    if (!userId) {
      navigate("/sign-in");
    }
  }, []);

  if (!isLoaded) return "Loading...";

  return <Outlet />;
}
