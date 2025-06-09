import DashboardPage from "../pages/HomePage";

function IsAuthenticated({ children }) {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    return <DashboardPage />;
  }
  return children;
}

export default IsAuthenticated;
