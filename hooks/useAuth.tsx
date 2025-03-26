import { useState, useEffect } from "react";

const useAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    
    const token = localStorage.getItem("adminToken");

    
    if (token) {
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
    }
  }, []); 

  return { isSignedIn };
};

export default useAuth;
