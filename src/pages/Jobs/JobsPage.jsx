import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Tag,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  Table,
  Card,
} from "antd";
import { useNavigate } from "react-router-dom";
import { addJob, selectAllJobs } from "../../features/jobs/jobSlice";
import { useUIStore } from "../../store/uiStore";
import { appTheme } from "../../theme";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const JobsPage = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectAllJobs);
  const { jobFilters, setJobFilters } = useUIStore();

  const { status: statusFilter, source: sourceFilter, search } = jobFilters;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const statusColors = {
    saved: "default",
    applied: "blue",
    assessment: "purple",
    interview: "gold",
    offer: "green",
    rejected: "red",
  };

  const columns = [
    {
      title: "Job Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <span style={{ fontWeight: 500 }}>
          {text} @ {record.company}
        </span>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (text) => text || <Text type="secondary">Not specified</Text>,
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = statusColors[status] || "default";
        const label =
          status?.charAt(0).toUpperCase() + status?.slice(1) || "Saved";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) =>
        tags && tags.length > 0 ? (
          <Space wrap>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        ) : (
          <Text type="secondary">No tags</Text>
        ),
    },
  ];

  const filteredJobs = useMemo(() => {
    const searchLower = search.trim().toLowerCase();

    return jobs.filter((job) => {
      // Status filter
      if (statusFilter !== "all" && (job.status || "saved") !== statusFilter) {
        return false;
      }

      // Source filter
      if (sourceFilter !== "all" && (job.source || "Other") !== sourceFilter) {
        return false;
      }

      // Text search on title + company
      if (searchLower) {
        const haystack = `${job.title || ""} ${
          job.company || ""
        }`.toLowerCase();
        if (!haystack.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, statusFilter, sourceFilter, search]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFinish = (values) => {
    // values = { title, company, location, source, tags, link }
    dispatch(
      addJob({
        ...values,
        // ensure tags is always an array
        tags: values.tags || [],
        // default status for new jobs
        status: "saved",
      })
    );
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleAddSampleJob = () => {
    dispatch(
      addJob({
        title: "Frontend Engineer",
        company: "Sample Corp",
        location: "Remote",
        source: "LinkedIn",
        status: "saved", // will be overridden in prepare, but fine
        tags: ["React", "Remote", "Frontend"],
        link: "https://example.com/job/frontend",
      })
    );
  };

  return (
    <div>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {/* Header row */}
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <Title level={3} style={{ marginBottom: 4 }}>
              Jobs
            </Title>
            <Text type="secondary">
              Track all your applications, statuses, and sources in one place.
            </Text>
          </div>

          <Button type="primary" onClick={handleOpenModal}>
            Add job
          </Button>
        </Space>

        {/* Filters + table inside a soft card */}
        <Card
          bordered={false}
          style={{
            borderRadius: 18,
            background: appTheme.colors.surface,
          }}
        >
          {/* Filters row */}
          <Space
            style={{
              marginBottom: 16,
              width: "100%",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
            align="center"
          >
            <Space wrap>
              <Select
                value={statusFilter}
                style={{ width: 180 }}
                onChange={(value) => setJobFilters({ status: value })}
              >
                <Option value="all">All statuses</Option>
                <Option value="saved">Saved</Option>
                <Option value="applied">Applied</Option>
                <Option value="assessment">Assessment</Option>
                <Option value="interview">Interview</Option>
                <Option value="offer">Offer</Option>
                <Option value="rejected">Rejected</Option>
              </Select>

              <Select
                value={sourceFilter}
                style={{ width: 180 }}
                onChange={(value) => setJobFilters({ source: value })}
              >
                <Option value="all">All sources</Option>
                <Option value="LinkedIn">LinkedIn</Option>
                <Option value="Naukri">Naukri</Option>
                <Option value="Company Site">Company Site</Option>
                <Option value="Referral">Referral</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Space>

            <Search
              placeholder="Search by title or company"
              allowClear
              value={search}
              onChange={(e) => setJobFilters({ search: e.target.value })}
              style={{ maxWidth: 260 }}
            />
          </Space>

          {/* Table / empty states */}
          {jobs.length === 0 ? (
            <Text type="secondary">
              No jobs yet. Click &quot;Add job&quot; to create your first entry.
            </Text>
          ) : filteredJobs.length === 0 ? (
            <Text type="secondary">
              No jobs match the current filters. Try changing filters or
              clearing the search.
            </Text>
          ) : (
            <Table
              dataSource={filteredJobs}
              columns={columns}
              rowKey="id"
              pagination={false}
              onRow={(record) => ({
                onClick: () => navigate(`/jobs/${record.id}`),
                style: { cursor: "pointer" },
              })}
            />
          )}
        </Card>
      </Space>

      {/* Add Job Modal (unchanged) */}
      <Modal
        title="Add Job"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => {
          form.submit();
        }}
        okText="Save"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            source: "LinkedIn",
          }}
        >
          <Form.Item
            label="Job Title"
            name="title"
            rules={[{ required: true, message: "Please enter job title" }]}
          >
            <Input placeholder="Frontend Engineer" />
          </Form.Item>

          <Form.Item
            label="Company"
            name="company"
            rules={[{ required: true, message: "Please enter company name" }]}
          >
            <Input placeholder="Awesome Startup Pvt Ltd" />
          </Form.Item>

          <Form.Item label="Location" name="location">
            <Input placeholder="Remote / Bangalore / Mumbai" />
          </Form.Item>

          <Form.Item label="Source" name="source">
            <Select>
              <Option value="LinkedIn">LinkedIn</Option>
              <Option value="Naukri">Naukri</Option>
              <Option value="Company Site">Company Site</Option>
              <Option value="Referral">Referral</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Tags" name="tags">
            <Select
              mode="tags"
              placeholder="Add tags like React, Remote, Product-based"
            />
          </Form.Item>

          <Form.Item label="Job Link" name="link">
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JobsPage;
