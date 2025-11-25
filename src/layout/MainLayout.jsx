// src/layout/MainLayout.jsx
import React from "react";
import { Layout, Menu, Typography } from "antd";
import {
  AppstoreOutlined,
  ApartmentOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { appTheme } from "../theme";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = ({ children }) => {
  const location = useLocation();

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

  return (
    <Layout
      style={{ minHeight: "100vh", background: appTheme.colors.background }}
    >
      <Sider
        collapsible
        width={230}
        style={{
          background: appTheme.colors.sidebarBg,
        }}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "999px",
              background: appTheme.colors.sidebarAccent,
            }}
          />
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
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentKey]}
          items={menuItems}
          style={{ borderRight: "none" }}
        />
      </Sider>

      <Layout style={{ background: "transparent" }}>
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
          <Text
            style={{
              fontWeight: 500,
              fontSize: 16,
            }}
          >
            Job Application Command Center
          </Text>
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
