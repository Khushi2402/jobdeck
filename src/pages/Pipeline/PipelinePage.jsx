import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Typography, Tag, Space, Empty } from "antd";
import { selectAllJobs } from "../../features/jobs/jobSlice";

const { Title, Text } = Typography;

const STATUSES = [
  { key: "saved", label: "Saved" },
  { key: "applied", label: "Applied" },
  { key: "assessment", label: "Assessment" },
  { key: "interview", label: "Interview" },
  { key: "offer", label: "Offer" },
  { key: "rejected", label: "Rejected" },
];

const PipelinePage = () => {
  const navigate = useNavigate();
  const jobs = useSelector(selectAllJobs);

  const jobsByStatus = useMemo(() => {
    const grouped = {};
    STATUSES.forEach((s) => {
      grouped[s.key] = [];
    });

    jobs.forEach((job) => {
      const statusKey = job.status || "saved";
      if (!grouped[statusKey]) {
        grouped[statusKey] = [];
      }
      grouped[statusKey].push(job);
    });

    return grouped;
  }, [jobs]);

  return (
    <div>
      <Title level={3} style={{ marginBottom: 16 }}>
        Pipeline
      </Title>

      <Row gutter={16} align="top">
        {STATUSES.map((status) => {
          const statusJobs = jobsByStatus[status.key] || [];

          return (
            <Col key={status.key} xs={24} sm={12} md={8} lg={4}>
              <Card
                title={
                  <Space size="small">
                    <Text strong>{status.label}</Text>
                    <Tag>{statusJobs.length}</Tag>
                  </Space>
                }
                size="small"
                bodyStyle={{ padding: 8 }}
                style={{ marginBottom: 16, height: "70vh", overflowY: "auto" }}
              >
                {statusJobs.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        No jobs in this stage
                      </Text>
                    }
                  />
                ) : (
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {statusJobs.map((job) => (
                      <Card
                        key={job.id}
                        size="small"
                        hoverable
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <Space
                          direction="vertical"
                          size={2}
                          style={{ width: "100%" }}
                        >
                          <Text strong style={{ fontSize: 13 }}>
                            {job.title}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {job.company}
                          </Text>
                          {job.location && (
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              {job.location}
                            </Text>
                          )}
                          {job.tags && job.tags.length > 0 && (
                            <Space wrap size={4} style={{ marginTop: 4 }}>
                              {job.tags.slice(0, 3).map((tag) => (
                                <Tag
                                  key={tag}
                                  style={{ fontSize: 10, padding: "0 4px" }}
                                >
                                  {tag}
                                </Tag>
                              ))}
                              {job.tags.length > 3 && (
                                <Tag style={{ fontSize: 10, padding: "0 4px" }}>
                                  +{job.tags.length - 3}
                                </Tag>
                              )}
                            </Space>
                          )}
                        </Space>
                      </Card>
                    ))}
                  </Space>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default PipelinePage;
