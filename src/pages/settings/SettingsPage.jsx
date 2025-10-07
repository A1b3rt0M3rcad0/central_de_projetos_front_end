import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import SettingsContent from "../../features/contents/SettingsContent";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <BasePage pageTitle="">
      <SettingsContent
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={() => navigate(-1)}
      />
    </BasePage>
  );
}

