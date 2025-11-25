// src/pages/Dashboard/DashboardPage.jsx
import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  Statistic,
  List,
  Typography,
  Tag,
  Space,
  Calendar,
} from "antd";
import { selectAllJobs } from "../../features/jobs/jobSlice";
import { selectAllActivities } from "../../features/activities/activitiesSlice";
import { appTheme } from "../../theme";

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
    const currentDay = startOfWeek.getDay() || 7;
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

    const upcomingActivities = activities
      .filter((activity) => {
        if (!activity.date) return false;
        const date = new Date(activity.date);
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

  const statCardStyle = (bg) => ({
    borderRadius: 18,
    background: bg,
    border: "none",
  });

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>

      <Row gutter={20}>
        {/* LEFT SIDE: stats and lists */}
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card
                style={statCardStyle(appTheme.colors.cardYellow)}
                bordered={false}
              >
                <Statistic title="Total Applications" value={totalJobs} />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card
                style={statCardStyle(appTheme.colors.cardPink)}
                bordered={false}
              >
                <Statistic title="Applied" value={appliedCount} />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card
                style={statCardStyle(appTheme.colors.cardBlue)}
                bordered={false}
              >
                <Statistic title="Interviews" value={interviewCount} />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card
                style={statCardStyle(appTheme.colors.cardGreen)}
                bordered={false}
              >
                <Statistic title="Offers" value={offerCount} />
              </Card>
            </Col>

            <Col xs={24} sm={12}>
              <Card bordered={false}>
                <Statistic
                  title="Applications This Week"
                  value={thisWeekCount}
                  suffix="job(s)"
                />
                <Text type="secondary">
                  New applications created since Monday.
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12}>
              <Card title="Upcoming Activities" bordered={false}>
                {upcomingActivities.length === 0 ? (
                  <Text type="secondary">
                    No upcoming activities. Add follow-ups on job detail pages.
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
        </Col>

        {/* RIGHT SIDE: calendar at top-right */}
        <Col xs={24} lg={8}>
          <Card
            title="Calendar"
            bordered={false}
            style={{
              borderRadius: 18,
              background: "#ffeef6",
              marginBottom: 16,
            }}
          >
            <Calendar fullscreen={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
