import React, { useState } from "react";
import PublicProfile from "@/pages/client/Account/PublicProfile";
import AccountSettings from "@/pages/client/Account/AccountSettings";
import MyOrders from "@/pages/client/Account/MyOrders";
import MyCancellations from "@/pages/client/Account/MyCancellations";

const Account = () => {
  const [activeSection, setActiveSection] = useState("public-profile"); // Phần mặc định

  const renderContent = () => {
    switch (activeSection) {
      case "public-profile":
        return <PublicProfile />;
      case "account-settings":
        return <AccountSettings />;
      case "my-orders":
        return <MyOrders />;
      case "my-cancellations":
        return <MyCancellations />;
      default:
        return <PublicProfile />;
    }
  };

  const getClassName = (section) =>
    section === activeSection
      ? "flex items-center px-3 py-2.5 font-bold bg-white text-indigo-900 border rounded-full"
      : "flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full";

  return (
    <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
      {/* Sidebar */}
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
          <button
            className={getClassName("public-profile")}
            onClick={() => setActiveSection("public-profile")}
          >
            Public Profile
          </button>
          <button
            className={getClassName("account-settings")}
            onClick={() => setActiveSection("account-settings")}
          >
            Account Settings
          </button>
          <h2 className="pl-3 mb-4 text-2xl font-semibold">My Orders</h2>
          <button
            className={getClassName("my-orders")}
            onClick={() => setActiveSection("my-orders")}
          >
            My Orders
          </button>
          <button
            className={getClassName("my-cancellations")}
            onClick={() => setActiveSection("my-cancellations")}
          >
            My Cancellations
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        {renderContent()}
      </main>
    </div>
  );
};

export default Account;
