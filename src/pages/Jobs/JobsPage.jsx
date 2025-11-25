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
  Popconfirm,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  addJob,
  selectAllJobs,
  updateJob,
  deleteJob,
} from "../../features/jobs/jobSlice";
import { removeActivitiesForJob } from "../../features/activities/activitiesSlice";
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
  const [editingJobId, setEditingJobId] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // 'add' | 'edit'

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
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditModal(record);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete job"
            description="Are you sure you want to delete this job and its activities?"
            okText="Yes"
            cancelText="No"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDeleteJob(record.id);
            }}
            onCancel={(e) => e?.stopPropagation()}
          >
            <Button
              type="link"
              size="small"
              danger
              onClick={(e) => e.stopPropagation()}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
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
    setModalMode("add");
    setEditingJobId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setModalMode("edit");
    setEditingJobId(job.id);
    form.setFieldsValue({
      title: job.title,
      company: job.company,
      location: job.location,
      source: job.source,
      tags: job.tags,
      link: job.link,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFinish = (values) => {
    const payload = {
      ...values,
      tags: values.tags || [],
      status: values.status || undefined, // we still default to 'saved' in addJob
    };

    if (modalMode === "add") {
      dispatch(addJob(payload));
      message.success("Job added");
    } else if (modalMode === "edit" && editingJobId) {
      dispatch(
        updateJob({
          id: editingJobId,
          changes: payload,
        })
      );
      message.success("Job updated");
    }

    setIsModalOpen(false);
    setEditingJobId(null);
    form.resetFields();
  };

  const handleDeleteJob = (jobId) => {
    dispatch(deleteJob(jobId));
    dispatch(removeActivitiesForJob(jobId));
    message.success("Job deleted");
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
        title={modalMode === "add" ? "Add Job" : "Edit Job"}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => {
          form.submit();
        }}
        okText={modalMode === "add" ? "Add Job" : "Save Changes"}
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
