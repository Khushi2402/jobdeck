// src/pages/Pipeline/PipelinePage.jsx
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Typography, Tag, Space, Empty } from "antd";
import { selectAllJobs, updateJob } from "../../features/jobs/jobSlice";
import { appTheme } from "../../theme";

const { Title, Text } = Typography;

const STATUSES = [
  { key: "saved", label: "Saved" },
  { key: "applied", label: "Applied" },
  { key: "assessment", label: "Assessment" },
  { key: "interview", label: "Interview" },
  { key: "offer", label: "Offer" },
  { key: "rejected", label: "Rejected" },
];

const statusBgColors = {
  saved: "#ffe9a8",
  applied: "#ffcfe3",
  assessment: "#cfe6ff",
  interview: "#d9f99d",
  offer: "#e5d9ff",
  rejected: "#f5d0d0",
};

const PipelinePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobs = useSelector(selectAllJobs);

  const jobsByStatus = useMemo(() => {
    const grouped = {};
    STATUSES.forEach((s) => {
      grouped[s.key] = [];
    });

    jobs.forEach((job) => {
      const statusKey = job.status || "saved";
      if (!grouped[statusKey]) grouped[statusKey] = [];
      grouped[statusKey].push(job);
    });

    return grouped;
  }, [jobs]);

  // HTML5 drag handlers
  const handleDragStart = (event, jobId) => {
    event.dataTransfer.setData("text/plain", jobId);
  };

  const handleDragOver = (event) => {
    // Allow drop
    event.preventDefault();
  };

  const handleDrop = (event, newStatus) => {
    event.preventDefault();
    const jobId = event.dataTransfer.getData("text/plain");
    if (!jobId) return;

    dispatch(
      updateJob({
        id: jobId,
        changes: { status: newStatus },
      })
    );
  };

  return (
    <div>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Pipeline
          </Title>
          <Text type="secondary">
            Visualize all your applications by stage and jump into details
            quickly.
          </Text>
        </div>

        <Card
          bordered={false}
          style={{
            borderRadius: appTheme.radii.card,
            background: appTheme.colors.surface,
          }}
        >
          <Row gutter={16} align="top">
            {STATUSES.map((status) => {
              const statusJobs = jobsByStatus[status.key] || [];
              const bg = statusBgColors[status.key] || appTheme.colors.surface;

              return (
                <Col key={status.key} xs={24} sm={12} md={8} lg={4}>
                  {/* Make the whole column a drop target */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(event) => handleDrop(event, status.key)}
                  >
                    <Card
                      size="small"
                      bordered={false}
                      style={{
                        marginBottom: 16,
                        borderRadius: 18,
                        background: bg,
                        minHeight: 260,
                      }}
                      bodyStyle={{ padding: 8 }}
                      title={
                        <Space size="small">
                          <Text strong style={{ fontSize: 13 }}>
                            {status.label}
                          </Text>
                          <Tag
                            style={{
                              borderRadius: 999,
                              padding: "0 8px",
                              fontSize: 11,
                            }}
                          >
                            {statusJobs.length}
                          </Tag>
                        </Space>
                      }
                    >
                      {statusJobs.length === 0 ? (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              No jobs in this stage
                            </Text>
                          }
                        />
                      ) : (
                        <Space
                          direction="vertical"
                          style={{
                            width: "100%",
                            maxHeight: "60vh",
                            overflowY: "auto",
                          }}
                          size={8}
                        >
                          {statusJobs.map((job) => (
                            <Card
                              key={job.id}
                              size="small"
                              hoverable
                              bordered={false}
                              draggable
                              onDragStart={(event) =>
                                handleDragStart(event, job.id)
                              }
                              onDoubleClick={() => navigate(`/jobs/${job.id}`)}
                              style={{
                                cursor: "grab",
                                borderRadius: 14,
                                background: "rgba(255,255,255,0.9)",
                              }}
                              bodyStyle={{ padding: 8 }}
                            >
                              <Space
                                direction="vertical"
                                size={2}
                                style={{ width: "100%" }}
                              >
                                <Text strong style={{ fontSize: 12 }}>
                                  {job.title}
                                </Text>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                  {job.company}
                                </Text>
                                {job.location && (
                                  <Text
                                    type="secondary"
                                    style={{ fontSize: 10 }}
                                  >
                                    {job.location}
                                  </Text>
                                )}
                                {job.tags && job.tags.length > 0 && (
                                  <Space wrap size={4} style={{ marginTop: 4 }}>
                                    {job.tags.slice(0, 3).map((tag) => (
                                      <Tag
                                        key={tag}
                                        style={{
                                          fontSize: 10,
                                          borderRadius: 999,
                                          padding: "0 6px",
                                        }}
                                      >
                                        {tag}
                                      </Tag>
                                    ))}
                                    {job.tags.length > 3 && (
                                      <Tag
                                        style={{
                                          fontSize: 10,
                                          borderRadius: 999,
                                          padding: "0 6px",
                                        }}
                                      >
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
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card>
      </Space>
    </div>
  );
};

export default PipelinePage;
