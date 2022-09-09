import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Call from "./Call";
const InitView = () => {
  let navigate = useNavigate();
  const [userAuthenticated] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (!userAuthenticated) {
      navigate("/login");
    } else
      navigate("/dashboard")
  }, [navigate]);
  return <>{userAuthenticated ? <Call /> : <></>}</>;
};

export default InitView;
