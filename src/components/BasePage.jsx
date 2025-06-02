import SideBar from "./SideBar";
import Header from "./Header";
import Footer from "./Footer";

export default function BasePage({ pageTitle, children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar />

      {/* Main area: header + content + footer */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header pageTitle={pageTitle} />

        {/* Conteúdo principal: scrollable */}
        <main className="flex-1 overflow-auto p-6">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
