// src/pages/JobDetail/JobDetailPage.jsx
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Descriptions,
  Space,
  Tag,
  Typography,
  Result,
  Timeline,
  Form,
  Input,
  Select,
  message,
} from "antd";
import { selectJobById, updateJob } from "../../features/jobs/jobSlice";
import {
  addActivity,
  selectActivitiesByJobId,
  fetchActivitiesByJob,
} from "../../features/activities/activitiesSlice";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const JobDetailPage = () => {
  const { getToken } = useAuth();
  const { jobId } = useParams();
  const navigate = useNavigate();

  const job = useSelector((state) => selectJobById(state, jobId));

  const dispatch = useDispatch();
  const activities = useSelector((state) =>
    selectActivitiesByJobId(state, jobId)
  );

  const [form] = Form.useForm();

  // Load activities for this job when detail page opens
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        await dispatch(fetchActivitiesByJob({ jobId, token })).unwrap();
      } catch (err) {
        // fallback if fetchActivitiesByJob doesn't accept token
        try {
          await dispatch(fetchActivitiesByJob(jobId)).unwrap();
        } catch (e) {
          console.error("Failed to fetch activities", e);
        }
      }
    })();
  }, [dispatch, getToken, jobId]);

  const handleAddActivity = async (values) => {
    try {
      const token = await getToken();
      await dispatch(
        addActivity({
          jobId,
          type: values.type,
          title: values.title,
          description: values.description,
          token,
        })
      ).unwrap();
      form.resetFields();
      message.success("Activity added");
    } catch (err) {
      console.error("Add activity error:", err);
      message.error("Failed to add activity");
    }
  };

  const handleStatusChange = async (value) => {
    try {
      const token = await getToken();
      await dispatch(
        updateJob({
          id: jobId,
          changes: {
            status: value,
          },
          token,
        })
      ).unwrap();
      message.success("Status updated");
    } catch (err) {
      console.error("Status update error:", err);
      message.error("Failed to change status");
    }
  };

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
          <Text strong>Status:&nbsp;</Text>
          <Select
            size="small"
            value={job.status || "saved"}
            style={{ minWidth: 140 }}
            onChange={handleStatusChange}
          >
            <Option value="saved">Saved</Option>
            <Option value="applied">Applied</Option>
            <Option value="assessment">Assessment</Option>
            <Option value="interview">Interview</Option>
            <Option value="offer">Offer</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
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

      <Space
        align="start"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        {/* Activity Timeline */}
        <div style={{ flex: 2, marginRight: 24 }}>
          <Title level={5}>Activity Timeline</Title>
          {activities.length === 0 ? (
            <Text type="secondary">
              No activity yet. Add your first activity using the form on the
              right.
            </Text>
          ) : (
            <Timeline
              items={activities
                .slice()
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((activity) => ({
                  color: "blue",
                  children: (
                    <div>
                      <Text strong>{activity.title}</Text>
                      <br />
                      <Text type="secondary">
                        {new Date(activity.date).toLocaleString()} •{" "}
                        {activity.type}
                      </Text>
                      {activity.description && (
                        <Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                          {activity.description}
                        </Paragraph>
                      )}
                    </div>
                  ),
                }))}
            />
          )}
        </div>

        {/* Add Activity Form */}
        <div style={{ flex: 1 }}>
          <Title level={5}>Add Activity</Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddActivity}
            initialValues={{
              type: "note",
            }}
          >
            <Form.Item
              label="Type"
              name="type"
              rules={[
                { required: true, message: "Please select activity type" },
              ]}
            >
              <Select>
                <Option value="applied">Applied</Option>
                <Option value="follow_up">Follow-up</Option>
                <Option value="interview">Interview</Option>
                <Option value="offer">Offer</Option>
                <Option value="note">Note</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Title"
              name="title"
              rules={[
                { required: true, message: "Please enter activity title" },
              ]}
            >
              <Input placeholder="e.g. Applied on company site" />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <TextArea
                rows={3}
                placeholder="Optional details, like what you discussed or sent"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Add Activity
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Space>
    </Space>
  );
};

export default JobDetailPage;
