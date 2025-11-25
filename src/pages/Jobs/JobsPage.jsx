import { useState } from "react";
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
} from "antd";
import { useNavigate } from "react-router-dom";
import { addJob, selectAllJobs } from "../../features/jobs/jobSlice";

const { Title, Text } = Typography;
const { Option } = Select;

const JobsPage = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectAllJobs);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

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
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
        align="center"
      >
        <Title level={3} style={{ margin: 0 }}>
          Jobs
        </Title>
        <Button type="primary" onClick={handleOpenModal}>
          Add job
        </Button>
      </Space>

      {jobs.length === 0 ? (
        <Text type="secondary">
          No jobs yet. Click &quot;Add job&quot; to create your first entry.
        </Text>
      ) : (
        <Table
          dataSource={jobs}
          columns={columns}
          rowKey="id"
          pagination={false}
          onRow={(record) => ({
            onClick: () => navigate(`/jobs/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      )}

      {/* Add Job Modal */}
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
