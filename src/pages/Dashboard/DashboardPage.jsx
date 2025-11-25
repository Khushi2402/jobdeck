import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Card, Statistic, List, Typography, Tag, Space } from "antd";
import { selectAllJobs } from "../../features/jobs/jobSlice";
import { selectAllActivities } from "../../features/activities/activitiesSlice";

const { Title, Text } = Typography;

const DashboardPage = () => {
  const jobs = useSelector(selectAllJobs);
  const activities = useSelector(selectAllActivities);

  const {
    totalJobs,
    appliedCount,
    interviewCount,
    offerCount,
    thisWeekCount,
    upcomingActivities,
  } = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    // Set startOfWeek to Monday this week
    const currentDay = startOfWeek.getDay() || 7; // Sunday -> 7
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - (currentDay - 1));

    const totalJobs = jobs.length;
    let appliedCount = 0;
    let interviewCount = 0;
    let offerCount = 0;
    let thisWeekCount = 0;

    jobs.forEach((job) => {
      const status = job.status || "saved";
      if (status === "applied") appliedCount += 1;
      if (status === "interview") interviewCount += 1;
      if (status === "offer") offerCount += 1;

      if (job.createdAt) {
        const created = new Date(job.createdAt);
        if (created >= startOfWeek && created <= now) {
          thisWeekCount += 1;
        }
      }
    });

    // Upcoming activities = future or today
    const upcomingActivities = activities
      .filter((activity) => {
        if (!activity.date) return false;
        const date = new Date(activity.date);
        // Consider upcoming if today or later
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        return date >= todayStart;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);

    return {
      totalJobs,
      appliedCount,
      interviewCount,
      offerCount,
      thisWeekCount,
      upcomingActivities,
    };
  }, [jobs, activities]);

  return (
    <div>
      <Title level={3} style={{ marginBottom: 16 }}>
        Dashboard
      </Title>

      {/* Top stats */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="Total Applications" value={totalJobs} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="Applied" value={appliedCount} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="Interviews" value={interviewCount} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="Offers" value={offerCount} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Applications This Week">
            <Statistic value={thisWeekCount} suffix="job(s)" />
            <Text type="secondary">
              Count of new applications created since Monday.
            </Text>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Upcoming Activities">
            {upcomingActivities.length === 0 ? (
              <Text type="secondary">
                No upcoming activities. Add follow-ups or interview notes on job
                detail pages.
              </Text>
            ) : (
              <List
                dataSource={upcomingActivities}
                renderItem={(activity) => (
                  <List.Item>
                    <Space direction="vertical" size={0}>
                      <Space>
                        <Tag>{activity.type}</Tag>
                        <Text strong>{activity.title}</Text>
                      </Space>
                      <Text type="secondary">
                        {new Date(activity.date).toLocaleString()}
                      </Text>
                      {activity.description && (
                        <Text type="secondary">{activity.description}</Text>
                      )}
                    </Space>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
