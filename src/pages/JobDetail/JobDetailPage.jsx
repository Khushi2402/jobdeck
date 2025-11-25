import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Descriptions, Space, Tag, Typography, Result } from "antd";
import { selectJobById } from "../../features/jobs/jobSlice";

const { Title, Text, Paragraph } = Typography;

const JobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const job = useSelector((state) => selectJobById(state, jobId));

  if (!job) {
    return (
      <Result
        status="404"
        title="Job not found"
        subTitle="This job does not exist or was removed."
        extra={
          <Button type="primary" onClick={() => navigate("/jobs")}>
            Back to Jobs
          </Button>
        }
      />
    );
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Space
        align="center"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>
            {job.title}{" "}
            <Text type="secondary" style={{ fontWeight: 400 }}>
              @ {job.company}
            </Text>
          </Title>
          <Space size="small">
            <Text type="secondary">
              {job.location || "Location not specified"}
            </Text>
            <Text type="secondary">•</Text>
            <Text type="secondary">Source: {job.source || "N/A"}</Text>
          </Space>
        </div>

        <Button onClick={() => navigate("/jobs")}>Back to Jobs</Button>
      </Space>

      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div>
          <Text strong>Status:</Text>{" "}
          <Tag color="blue">{job.status || "saved"}</Tag>
        </div>

        <div>
          <Text strong>Tags:</Text>{" "}
          {job.tags && job.tags.length > 0 ? (
            <Space wrap>
              {job.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
          ) : (
            <Text type="secondary">No tags added</Text>
          )}
        </div>
      </Space>

      <Descriptions
        title="Job Details"
        bordered
        column={1}
        size="small"
        labelStyle={{ width: "160px" }}
      >
        <Descriptions.Item label="Company">{job.company}</Descriptions.Item>
        <Descriptions.Item label="Job Title">{job.title}</Descriptions.Item>
        <Descriptions.Item label="Location">
          {job.location || "Not specified"}
        </Descriptions.Item>
        <Descriptions.Item label="Source">
          {job.source || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Job Link">
          {job.link ? (
            <a href={job.link} target="_blank" rel="noreferrer">
              {job.link}
            </a>
          ) : (
            <Text type="secondary">No link provided</Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {job.createdAt
            ? new Date(job.createdAt).toLocaleString()
            : "Not available"}
        </Descriptions.Item>
        <Descriptions.Item label="Last Updated">
          {job.updatedAt
            ? new Date(job.updatedAt).toLocaleString()
            : "Not available"}
        </Descriptions.Item>
      </Descriptions>

      <div>
        <Title level={5}>Notes</Title>
        <Paragraph type="secondary">
          Notes, follow-ups, and activity timeline will be added here in the
          next steps.
        </Paragraph>
      </div>
    </Space>
  );
};

export default JobDetailPage;
