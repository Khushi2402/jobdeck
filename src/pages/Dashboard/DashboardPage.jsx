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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { selectAllJobs } from "../../features/jobs/jobSlice";
import { selectAllActivities } from "../../features/activities/activitiesSlice";
import { appTheme } from "../../theme";

const { Title, Text } = Typography;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

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
    statusChartData,
    sourceChartData,
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

    const statusCounts = {
      saved: 0,
      applied: 0,
      assessment: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };

    const sourceCounts = {};

    jobs.forEach((job) => {
      const status = job.status || "saved";
      if (statusCounts[status] != null) {
        statusCounts[status] += 1;
      }

      if (status === "applied") appliedCount += 1;
      if (status === "interview") interviewCount += 1;
      if (status === "offer") offerCount += 1;

      const source = job.source || "Other";
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;

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

    const statusLabels = [
      "Saved",
      "Applied",
      "Assessment",
      "Interview",
      "Offer",
      "Rejected",
    ];
    const statusKeys = [
      "saved",
      "applied",
      "assessment",
      "interview",
      "offer",
      "rejected",
    ];
    const statusData = statusKeys.map((key) => statusCounts[key]);

    const statusChartData = {
      labels: statusLabels,
      datasets: [
        {
          label: "Applications",
          data: statusData,
          backgroundColor: [
            appTheme.colors.cardYellow,
            appTheme.colors.cardPink,
            appTheme.colors.cardBlue,
            appTheme.colors.cardGreen,
            "#e5d9ff",
            "#f5d0d0",
          ],
          borderRadius: 6,
        },
      ],
    };

    const sourceLabels = Object.keys(sourceCounts);
    const sourceDataValues = sourceLabels.map((label) => sourceCounts[label]);

    const sourceChartData = {
      labels: sourceLabels,
      datasets: [
        {
          data: sourceDataValues,
          backgroundColor: [
            appTheme.colors.cardPink,
            appTheme.colors.cardBlue,
            appTheme.colors.cardYellow,
            appTheme.colors.cardGreen,
            "#e5d9ff",
            "#f5d0d0",
          ],
        },
      ],
    };

    return {
      totalJobs,
      appliedCount,
      interviewCount,
      offerCount,
      thisWeekCount,
      upcomingActivities,
      statusChartData,
      sourceChartData,
    };
  }, [jobs, activities]);

  const statCardStyle = (bg) => ({
    borderRadius: 18,
    background: bg,
    border: "none",
  });

  const fullCard = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>

      {/* Top summary stats – 5 colorful cards */}
      <div
        style={{ display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap" }}
      >
        <Card
          style={{
            ...statCardStyle(appTheme.colors.cardYellow),
            flex: 1,
            minWidth: 160,
          }}
          bordered={false}
        >
          <Statistic title="Total Applications" value={totalJobs} />
        </Card>

        <Card
          style={{
            ...statCardStyle(appTheme.colors.cardPink),
            flex: 1,
            minWidth: 160,
          }}
          bordered={false}
        >
          <Statistic title="Applied" value={appliedCount} />
        </Card>

        <Card
          style={{
            ...statCardStyle(appTheme.colors.cardBlue),
            flex: 1,
            minWidth: 160,
          }}
          bordered={false}
        >
          <Statistic title="Interviews" value={interviewCount} />
        </Card>

        <Card
          style={{
            ...statCardStyle(appTheme.colors.cardGreen),
            flex: 1,
            minWidth: 160,
          }}
          bordered={false}
        >
          <Statistic title="Offers" value={offerCount} />
        </Card>

        {/* New colored card: Applications This Week */}
        <Card
          style={{
            ...statCardStyle("#ffeef6"),
            flex: 1,
            minWidth: 160,
          }}
          bordered={false}
        >
          <Statistic
            title="Applications This Week"
            value={thisWeekCount}
            suffix="job(s)"
          />
        </Card>
      </div>

      {/* Middle row: Upcoming Activities + Calendar, equal-ish height */}
      <Row gutter={20} align="stretch">
        <Col xs={24} lg={16}>
          <Card title="Upcoming Activities" bordered={false} style={fullCard}>
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

        <Col xs={24} lg={8}>
          <Card
            title="Calendar"
            bordered={false}
            style={{
              borderRadius: 18,
              background: "#ffeef6",
              height: "100%",
            }}
          >
            <Calendar fullscreen={false} />
          </Card>
        </Col>
      </Row>

      {/* Bottom: charts row, equal heights */}
      <div
        style={{ display: "flex", gap: 20, marginTop: 24, flexWrap: "wrap" }}
      >
        <Card
          title="Applications by status"
          bordered={false}
          style={{ ...fullCard, flex: 1, minWidth: 260 }}
        >
          {totalJobs === 0 ? (
            <Text type="secondary">
              Add some jobs to see applications by status.
            </Text>
          ) : (
            <div style={{ height: 280 }}>
              <Bar
                data={statusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: { precision: 0 },
                    },
                  },
                }}
              />
            </div>
          )}
        </Card>

        <Card
          title="Applications by source"
          bordered={false}
          style={{ ...fullCard, flex: 1, minWidth: 260 }}
        >
          {totalJobs === 0 ? (
            <Text type="secondary">
              Add some jobs to see applications by source.
            </Text>
          ) : (
            <div style={{ height: 280 }}>
              <Doughnut
                data={sourceChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { boxWidth: 14 },
                    },
                  },
                }}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
