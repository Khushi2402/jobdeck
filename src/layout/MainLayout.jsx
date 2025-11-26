// src/layout/MainLayout.jsx
import React, { useState } from "react";
import { Layout, Menu, Typography } from "antd";
import {
  AppstoreOutlined,
  ApartmentOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { appTheme } from "../theme";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUser();

  const menuItems = [
    {
      key: "/",
      icon: <AppstoreOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "/pipeline",
      icon: <ApartmentOutlined />,
      label: <Link to="/pipeline">Pipeline</Link>,
    },
    {
      key: "/jobs",
      icon: <TableOutlined />,
      label: <Link to="/jobs">Jobs</Link>,
    },
  ];

  const currentKey =
    location.pathname === "/" ? "/" : location.pathname.split("?")[0];

  const displayName =
    user?.fullName || user?.primaryEmailAddress?.emailAddress || "Your profile";

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  // widths used by AntD for sider
  const siderWidth = 230;
  const siderCollapsedWidth = 80;

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: appTheme.colors.background,
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null} // hide default trigger
        width={siderWidth}
        collapsedWidth={siderCollapsedWidth}
        style={{
          background: appTheme.colors.sidebarBg,
          boxShadow: "4px 0 24px rgba(15, 23, 42, 0.65)",
          position: "fixed", // 🔒 pin sidebar
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Logo */}
          <div
            style={{
              height: 64,
              margin: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: collapsed ? 0 : 10,
            }}
          >
            <div
              style={{
                width: collapsed ? 20 : 24,
                height: collapsed ? 20 : 24,
                borderRadius: "999px",
                background: `radial-gradient(circle at 30% 30%, #fecaca, ${appTheme.colors.sidebarAccent})`,
              }}
            />
            {!collapsed && (
              <Text
                style={{
                  color: appTheme.colors.sidebarText,
                  fontWeight: 600,
                  fontSize: 18,
                  letterSpacing: 0.5,
                }}
              >
                Job Deck
              </Text>
            )}
          </div>

          {/* Main navigation */}
          <Menu
            theme="light"
            mode="inline"
            inlineCollapsed={collapsed}
            selectedKeys={[currentKey]}
            items={menuItems}
            style={{
              borderRight: "none",
              background: "transparent",
              paddingTop: 8,
              flex: 1, // fill middle vertical space
            }}
          />

          {/* Bottom profile + collapse section */}
          <SignedIn>
            <div
              style={{
                padding: collapsed ? "8px 8px 16px" : "12px 16px 16px",
                borderTop: "1px solid rgba(148, 163, 184, 0.35)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                alignItems: collapsed ? "center" : "stretch",
              }}
            >
              {/* Profile block */}
              <div
                onClick={handleProfileClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                {collapsed ? (
                  <>
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "999px",
                          objectFit: "cover",
                          border: "1px solid rgba(148, 163, 184, 0.6)",
                        }}
                      />
                    ) : null}
                  </>
                ) : (
                  <>
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "999px",
                          objectFit: "cover",
                          border: "1px solid rgba(148, 163, 184, 0.6)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "999px",
                          background: "#4b5563",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#e5e7eb",
                          fontSize: 16,
                        }}
                      >
                        {displayName?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div style={{ overflow: "hidden" }}>
                      <Text
                        style={{
                          color: "#000000",
                          fontSize: 13,
                          fontWeight: 500,
                          display: "block",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {displayName}
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          color: "#9ca3af",
                          fontSize: 11,
                        }}
                      >
                        View profile
                      </Text>
                    </div>
                  </>
                )}
              </div>

              {/* Collapse button */}
              <button
                type="button"
                onClick={toggleCollapsed}
                style={{
                  marginTop: 4,
                  width: "100%",
                  border: "none",
                  borderRadius: 999,
                  padding: collapsed ? "4px 0" : "6px 0",
                  fontSize: 11,
                  color: "#e5e7eb",
                  background: "rgba(15,23,42,0.6)",
                  cursor: "pointer",
                }}
              >
                {collapsed ? ">" : "<"}
              </button>
            </div>
          </SignedIn>
        </div>
      </Sider>

      {/* Main area shifted right so it doesn't sit under the fixed sidebar */}
      <Layout
        style={{
          background: "transparent",
          marginLeft: collapsed ? siderCollapsedWidth : siderWidth, // 🔁 update on collapse
          transition: "margin-left 0.2s ease",
        }}
      >
        <Header
          style={{
            background: appTheme.colors.surface,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: appTheme.shadows.soft,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          {collapsed ? (
            <>
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: 16,
                }}
              >
                Job Deck
              </Text>
            </>
          ) : (
            <>
              <div></div>
            </>
          )}

          <SignedIn>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </SignedIn>
        </Header>

        <Content
          style={{
            margin: "16px 24px",
            paddingBottom: 24,
          }}
        >
          <div
            style={{
              background: appTheme.colors.surface,
              borderRadius: appTheme.radii.layout,
              padding: 24,
              minHeight: "calc(100vh - 120px)",
              boxShadow: appTheme.shadows.soft,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
