import Login from "../pages/Login";

function AuthMiddleware({ children }) {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return <Login />;
  }
  return children;
}

export default AuthMiddleware;
