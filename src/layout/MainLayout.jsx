import React from "react";
import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  ApartmentOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

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

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div
          style={{
            height: 64,
            margin: 16,
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          JACC
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            fontWeight: "500",
          }}
        >
          Job Application Command Center
        </Header>
        <Content
          style={{ margin: "16px", padding: "16px", background: "#fff" }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
