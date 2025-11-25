// src/pages/Profile/ProfilePage.jsx
import { useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Tag,
  Button,
  Divider,
  Timeline,
  Form,
  Input,
  Select,
  Modal,
  DatePicker,
  Checkbox,
} from "antd";
import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { appTheme } from "../../theme";
import {
  addExperience,
  selectProfileForUser,
  setCareer,
  setEducation,
  setResumeMeta,
  setSkills,
  setSummary,
  upsertBasicInfo,
} from "../../features/profile/profileSlice";
import ResumeUploadDrawer from "./ResumeUploadDrawer";

const { Title, Text } = Typography;
const { TextArea } = Input;

const workModeLabels = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "Onsite",
};

const ProfilePage = () => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const userId = user?.id;

  const profile = useSelector((state) => selectProfileForUser(state, userId));

  const fallbackName = useMemo(
    () =>
      user?.fullName ||
      user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
      "Your name",
    [user]
  );

  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress || "your@email.com";

  const avatarUrl = user?.imageUrl;

  // modal/drawer state
  const [basicInfoOpen, setBasicInfoOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [careerOpen, setCareerOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  const [basicForm] = Form.useForm();
  const [skillsForm] = Form.useForm();
  const [expForm] = Form.useForm();
  const [eduForm] = Form.useForm();
  const [summaryForm] = Form.useForm();
  const [careerForm] = Form.useForm();

  const currentBasic = profile?.basicInfo || {};
  const currentSkills = profile?.skills || [];
  const currentExperiences = profile?.experiences || [];
  const currentEducation = profile?.education || [];
  const currentSummary = profile?.summary || "";
  const currentCareer = profile?.career || {};
  const currentResume = profile?.resume || null;

  // dynamic completeness
  const profileCompletion = useMemo(() => {
    let c = 0;

    const hasBasic =
      currentBasic &&
      (currentBasic.title ||
        currentBasic.company ||
        currentBasic.location ||
        (currentBasic.preferredRoles &&
          currentBasic.preferredRoles.length > 0) ||
        (currentBasic.preferredLocations &&
          currentBasic.preferredLocations.length > 0));

    if (hasBasic) c = 20;
    if (currentSkills && currentSkills.length > 0) c = Math.max(c, 30);
    if (currentExperiences && currentExperiences.length > 0)
      c = Math.max(c, 50);
    if (currentEducation && currentEducation.length > 0) c = Math.max(c, 60);
    if (currentSummary && currentSummary.trim().length > 0) c = Math.max(c, 70);
    if (
      currentCareer &&
      ((currentCareer.targetRoles && currentCareer.targetRoles.length > 0) ||
        (currentCareer.wantMoreOf &&
          currentCareer.wantMoreOf.trim().length > 0))
    ) {
      c = Math.max(c, 80);
    }
    if (currentResume) c = 100;

    return c;
  }, [
    currentBasic,
    currentSkills,
    currentExperiences,
    currentEducation,
    currentSummary,
    currentCareer,
    currentResume,
  ]);

  const handleScrollTo = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const headerOffset = 80; // approximate header height
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  /* ---------- submit handlers ---------- */

  const handleBasicSave = (values) => {
    if (!userId) return;
    dispatch(
      upsertBasicInfo({
        userId,
        basicInfo: values,
      })
    );
    setBasicInfoOpen(false);
  };

  const handleSkillsSave = (values) => {
    if (!userId) return;
    dispatch(
      setSkills({
        userId,
        skills: values.skills || [],
      })
    );
    setSkillsOpen(false);
  };

  const handleExperienceSave = (values) => {
    if (!userId) return;

    const from = values.from ? values.from.format("MMM YYYY") : "";
    const to =
      values.current || !values.to
        ? null
        : values.to
        ? values.to.format("MMM YYYY")
        : null;

    dispatch(
      addExperience({
        userId,
        experience: {
          role: values.role || "",
          company: values.company || "",
          from,
          to,
          current: !!values.current,
          description: values.description || "",
        },
      })
    );
    setExperienceOpen(false);
    expForm.resetFields();
  };

  const handleEducationSave = (values) => {
    if (!userId) return;
    const items = values.items || [];
    const processed = items.map((item) => {
      const from = item.from ? item.from.format("MMM YYYY") : "";
      const to =
        item.current || !item.to
          ? null
          : item.to
          ? item.to.format("MMM YYYY")
          : null;
      return {
        degree: item.degree || "",
        institution: item.institution || "",
        from,
        to,
        current: !!item.current,
      };
    });

    dispatch(
      setEducation({
        userId,
        education: processed,
      })
    );
    setEducationOpen(false);
  };

  const handleSummarySave = (values) => {
    if (!userId) return;
    dispatch(
      setSummary({
        userId,
        summary: values.summary || "",
      })
    );
    setSummaryOpen(false);
  };

  const handleCareerSave = (values) => {
    if (!userId) return;
    dispatch(
      setCareer({
        userId,
        career: {
          targetRoles: values.targetRoles || [],
          wantMoreOf: values.wantMoreOf || "",
        },
      })
    );
    setCareerOpen(false);
  };

  const handleResumeSelected = (resumeMeta) => {
    if (!userId) return;
    dispatch(
      setResumeMeta({
        userId,
        resume: resumeMeta,
      })
    );
  };

  // watchers for checkbox -> disable date fields
  const currentWorking = Form.useWatch("current", expForm);

  return (
    <>
      <Space direction="vertical" size={18} style={{ width: "100%" }}>
        <Title level={3} style={{ marginBottom: 0 }}>
          Your Profile
        </Title>
        <Text type="secondary">
          Keep your profile updated so Job Deck can reflect your current skills
          and experience.
        </Text>

        {/* Top overview strip */}
        <Card
          bordered={false}
          bodyStyle={{ padding: 20 }}
          style={{
            borderRadius: appTheme.radii.card,
            background:
              "linear-gradient(120deg, #ffe9e9 0%, #ffe9ff 40%, #e5f0ff 100%)",
          }}
        >
          <Row gutter={24} align="middle">
            <Col xs={24} md={8}>
              <Space align="center" size={16}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile avatar"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid rgba(22, 163, 74, 0.8)",
                      boxShadow: "0 0 0 4px rgba(187, 247, 208, 0.9)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "#e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 32,
                      fontWeight: 600,
                      color: "#4b5563",
                    }}
                  >
                    {fallbackName[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <Title level={4} style={{ marginBottom: 4 }}>
                    {fallbackName}
                  </Title>
                  <Text strong>
                    {currentBasic.title || "Add your current title"}
                  </Text>
                  <br />
                  <Text type="secondary">
                    {currentBasic.company || "Add your current employer"}
                  </Text>
                </div>
              </Space>
            </Col>

            <Col xs={24} md={8}>
              <Space
                direction="vertical"
                size={6}
                style={{ marginTop: 12, marginBottom: 12 }}
              >
                <Space size="small">
                  <EnvironmentOutlined />
                  <Text>
                    {currentBasic.location || "Add your location in Basic info"}
                  </Text>
                </Space>
                <Space size="small">
                  <MailOutlined />
                  <Text>{primaryEmail}</Text>
                </Space>
                <Space size="small">
                  <PhoneOutlined />
                  <Text>+91-XXXXXXXXXX</Text>
                </Space>
              </Space>
            </Col>

            <Col xs={24} md={8}>
              <Space
                direction="vertical"
                size={8}
                style={{ width: "100%", alignItems: "flex-end" }}
              >
                <Button
                  type="default"
                  size="small"
                  onClick={() => {
                    basicForm.setFieldsValue({
                      ...currentBasic,
                    });
                    setBasicInfoOpen(true);
                  }}
                >
                  Edit basic info
                </Button>
                <Button
                  type="primary"
                  size="small"
                  icon={<StarOutlined />}
                  onClick={() => {
                    skillsForm.setFieldsValue({ skills: currentSkills });
                    setSkillsOpen(true);
                  }}
                >
                  Manage skills
                </Button>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Profile completeness: <strong>{profileCompletion}%</strong>
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Main layout */}
        <Row gutter={20} align="top">
          {/* Left column: navigator + snapshot */}
          <Col xs={24} lg={7}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <Card
                bordered={false}
                bodyStyle={{ padding: 14 }}
                style={{ borderRadius: appTheme.radii.card }}
              >
                <Title level={5} style={{ marginBottom: 8 }}>
                  Sections
                </Title>
                <Space direction="vertical" size={6} style={{ width: "100%" }}>
                  {[
                    { id: "basic-info", label: "Basic info" },
                    { id: "skills", label: "Skills" },
                    { id: "experience", label: "Experience" },
                    { id: "education", label: "Education" },
                    { id: "summary", label: "Profile summary" },
                    { id: "future", label: "Career focus" },
                    { id: "resume", label: "Resume" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleScrollTo(item.id)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border: "none",
                        background: "transparent",
                        padding: "6px 4px",
                        borderRadius: 999,
                        fontSize: 13,
                        color: "#6b7280",
                        cursor: "pointer",
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </Space>
              </Card>

              <Card
                bordered={false}
                bodyStyle={{ padding: 16 }}
                style={{ borderRadius: appTheme.radii.card }}
              >
                <Title level={5} style={{ marginBottom: 8 }}>
                  Snapshot
                </Title>
                <Space direction="vertical" size={6}>
                  <Text type="secondary">Preferred roles</Text>
                  <Text>
                    {currentBasic.preferredRoles &&
                    currentBasic.preferredRoles.length
                      ? currentBasic.preferredRoles.join(", ")
                      : "Not set"}
                  </Text>
                  <Divider style={{ margin: "8px 0" }} />
                  <Text type="secondary">Preferred locations</Text>
                  <Text>
                    {currentBasic.preferredLocations &&
                    currentBasic.preferredLocations.length
                      ? currentBasic.preferredLocations.join(", ")
                      : "Not set"}
                  </Text>
                </Space>
              </Card>
            </Space>
          </Col>

          {/* Right column: sections */}
          <Col xs={24} lg={17}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              {/* Basic info */}
              <Card
                id="basic-info"
                bordered={false}
                title="Basic info"
                extra={
                  <Button
                    type="link"
                    onClick={() => {
                      basicForm.setFieldsValue({
                        ...currentBasic,
                      });
                      setBasicInfoOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                }
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Text type="secondary">Current title</Text>
                    <br />
                    <Text>{currentBasic.title || "Not set"}</Text>
                  </Col>
                  <Col xs={24} md={12}>
                    <Text type="secondary">Current employer</Text>
                    <br />
                    <Text>{currentBasic.company || "Not set"}</Text>
                  </Col>
                </Row>
                <Divider style={{ margin: "12px 0" }} />
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Text type="secondary">Location</Text>
                    <br />
                    <Text>{currentBasic.location || "Not set"}</Text>
                  </Col>
                  <Col xs={24} md={12}>
                    <Text type="secondary">Work mode</Text>
                    <br />
                    <Text>
                      {currentBasic.workMode
                        ? workModeLabels[currentBasic.workMode] ||
                          currentBasic.workMode
                        : "Not set"}
                    </Text>
                  </Col>
                </Row>
                <Divider style={{ margin: "12px 0" }} />
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Text type="secondary">Preferred roles</Text>
                    <br />
                    <Text>
                      {currentBasic.preferredRoles &&
                      currentBasic.preferredRoles.length
                        ? currentBasic.preferredRoles.join(", ")
                        : "Not set"}
                    </Text>
                  </Col>
                  <Col xs={24} md={12}>
                    <Text type="secondary">Preferred locations</Text>
                    <br />
                    <Text>
                      {currentBasic.preferredLocations &&
                      currentBasic.preferredLocations.length
                        ? currentBasic.preferredLocations.join(", ")
                        : "Not set"}
                    </Text>
                  </Col>
                </Row>
              </Card>

              {/* Skills */}
              <Card
                id="skills"
                bordered={false}
                title="Skills"
                extra={
                  <Button
                    type="link"
                    onClick={() => {
                      skillsForm.setFieldsValue({ skills: currentSkills });
                      setSkillsOpen(true);
                    }}
                  >
                    Manage skills
                  </Button>
                }
              >
                <Text type="secondary">
                  Add skills that describe your current expertise.
                </Text>
                <Divider style={{ margin: "10px 0" }} />
                {currentSkills.length ? (
                  <Space wrap size={[8, 8]}>
                    {currentSkills.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </Space>
                ) : (
                  <Text type="secondary">No skills added yet.</Text>
                )}
              </Card>

              {/* Experience */}
              <Card
                id="experience"
                bordered={false}
                title="Experience"
                extra={
                  <Button
                    type="link"
                    onClick={() => {
                      expForm.resetFields();
                      setExperienceOpen(true);
                    }}
                  >
                    Add experience
                  </Button>
                }
              >
                {currentExperiences.length === 0 ? (
                  <>
                    <Text type="secondary">
                      You haven&apos;t added any experience yet.
                    </Text>
                    <Divider style={{ margin: "10px 0" }} />
                  </>
                ) : null}
                {currentExperiences.length > 0 && (
                  <Timeline
                    items={currentExperiences.map((exp) => ({
                      color: "pink",
                      children: (
                        <Space direction="vertical" size={2}>
                          <Text strong>
                            {exp.role || "Role"}{" "}
                            {exp.company ? `· ${exp.company}` : ""}
                          </Text>
                          {(exp.from || exp.to || exp.current) && (
                            <Text type="secondary">
                              {exp.from || ""}{" "}
                              {exp.from || exp.to || exp.current ? "–" : ""}{" "}
                              {exp.current ? "Present" : exp.to || ""}
                            </Text>
                          )}
                          {exp.description && <Text>{exp.description}</Text>}
                        </Space>
                      ),
                    }))}
                  />
                )}
              </Card>

              {/* Education */}
              <Card
                id="education"
                bordered={false}
                title="Education"
                extra={
                  <Button
                    type="link"
                    onClick={() => {
                      eduForm.setFieldsValue({
                        items: currentEducation.map((ed) => ({
                          degree: ed.degree,
                          institution: ed.institution,
                          from: ed.from ? dayjs(ed.from, "MMM YYYY") : null,
                          to: ed.to ? dayjs(ed.to, "MMM YYYY") : null,
                          current: ed.current,
                        })),
                      });
                      setEducationOpen(true);
                    }}
                  >
                    Add / edit education
                  </Button>
                }
              >
                {currentEducation.length === 0 ? (
                  <Text type="secondary">No education added yet.</Text>
                ) : (
                  <Space direction="vertical" size={8}>
                    {currentEducation.map((ed, idx) => (
                      <div key={idx}>
                        <Text strong>{ed.degree || "Degree"}</Text>
                        <br />
                        <Text type="secondary">
                          {ed.institution || ""}{" "}
                          {(ed.from || ed.to || ed.current) && "· "}
                          {ed.from || ""}{" "}
                          {ed.from || ed.to || ed.current ? "–" : ""}{" "}
                          {ed.current ? "Present" : ed.to || ""}
                        </Text>
                      </div>
                    ))}
                  </Space>
                )}
              </Card>

              {/* Profile summary */}
              <Card
                id="summary"
                bordered={false}
                title="Profile summary"
                extra={
                  <Button
                    type="link"
                    onClick={() => {
                      summaryForm.setFieldsValue({ summary: currentSummary });
                      setSummaryOpen(true);
                    }}
                  >
                    Edit summary
                  </Button>
                }
              >
                <Divider style={{ margin: "10px 0" }} />
                <Text>{currentSummary || "No summary added yet."}</Text>
              </Card>

              {/* Career focus */}
              <Card
                id="future"
                bordered={false}
                title="Career focus"
                extra={
                  <Button
                    type="link"
                    onClick={() => {
                      careerForm.setFieldsValue({
                        targetRoles: currentCareer.targetRoles || [],
                        wantMoreOf: currentCareer.wantMoreOf || "",
                      });
                      setCareerOpen(true);
                    }}
                  >
                    Edit preferences
                  </Button>
                }
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Text type="secondary">Target roles</Text>
                    <br />
                    <Text>
                      {currentCareer.targetRoles &&
                      currentCareer.targetRoles.length
                        ? currentCareer.targetRoles.join(", ")
                        : "Not set"}
                    </Text>
                  </Col>
                  <Col xs={24} md={12}>
                    <Text type="secondary">What you want more of</Text>
                    <br />
                    <Text>{currentCareer.wantMoreOf || "Not set"}</Text>
                  </Col>
                </Row>
              </Card>

              {/* Resume section */}
              <Card
                id="resume"
                bordered={false}
                title="Resume"
                extra={
                  <Button type="link" onClick={() => setResumeOpen(true)}>
                    {currentResume ? "Update resume" : "Upload resume"}
                  </Button>
                }
              >
                {currentResume ? (
                  <>
                    <Text strong>{currentResume.fileName}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Last updated{" "}
                      {new Date(currentResume.uploadedAt).toLocaleDateString()}{" "}
                      · ~{Math.round(currentResume.size / 1024)} KB
                    </Text>
                  </>
                ) : (
                  <Text type="secondary">No resume uploaded yet.</Text>
                )}
              </Card>
            </Space>
          </Col>
        </Row>
      </Space>

      {/* ---------- Modals ---------- */}

      {/* Basic info */}
      <Modal
        title="Edit basic info"
        open={basicInfoOpen}
        onCancel={() => setBasicInfoOpen(false)}
        onOk={() => basicForm.submit()}
      >
        <Form layout="vertical" form={basicForm} onFinish={handleBasicSave}>
          <Form.Item name="title" label="Current title">
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item name="company" label="Current employer">
            <Input placeholder="Employer" />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input placeholder="City, Country" />
          </Form.Item>
          <Form.Item name="noticePeriod" label="Notice period">
            <Input placeholder="Notice period" />
          </Form.Item>
          <Form.Item name="workMode" label="Work mode">
            <Select
              placeholder="Select work mode"
              options={[
                { value: "remote", label: "Remote" },
                { value: "hybrid", label: "Hybrid" },
                { value: "onsite", label: "Onsite" },
              ]}
            />
          </Form.Item>
          <Form.Item name="preferredRoles" label="Preferred roles">
            <Select mode="tags" placeholder="Add roles" />
          </Form.Item>
          <Form.Item name="preferredLocations" label="Preferred locations">
            <Select mode="tags" placeholder="Add locations" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Skills */}
      <Modal
        title="Manage skills"
        open={skillsOpen}
        onCancel={() => setSkillsOpen(false)}
        onOk={() => skillsForm.submit()}
      >
        <Form layout="vertical" form={skillsForm} onFinish={handleSkillsSave}>
          <Form.Item name="skills" label="Skills">
            <Select mode="tags" placeholder="Type a skill and press Enter" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Experience */}
      <Modal
        title="Add experience"
        open={experienceOpen}
        onCancel={() => setExperienceOpen(false)}
        onOk={() => expForm.submit()}
      >
        <Form layout="vertical" form={expForm} onFinish={handleExperienceSave}>
          <Form.Item name="role" label="Role">
            <Input placeholder="Role" />
          </Form.Item>
          <Form.Item name="company" label="Company">
            <Input placeholder="Company" />
          </Form.Item>
          <Form.Item name="from" label="From">
            <DatePicker
              picker="month"
              style={{ width: "100%" }}
              placeholder="Select start month"
            />
          </Form.Item>
          <Form.Item
            name="current"
            valuePropName="checked"
            style={{ marginBottom: 8 }}
          >
            <Checkbox>Currently working here</Checkbox>
          </Form.Item>
          <Form.Item name="to" label="To">
            <DatePicker
              picker="month"
              style={{ width: "100%" }}
              placeholder="Select end month"
              disabled={currentWorking}
            />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Education */}
      <Modal
        title="Add / edit education"
        open={educationOpen}
        onCancel={() => setEducationOpen(false)}
        onOk={() => eduForm.submit()}
      >
        <Form layout="vertical" form={eduForm} onFinish={handleEducationSave}>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => {
                  const currentPursuing = Form.useWatch(
                    ["items", field.name, "current"],
                    eduForm
                  );
                  return (
                    <div key={field.key} style={{ marginBottom: 16 }}>
                      <Form.Item
                        {...field}
                        name={[field.name, "degree"]}
                        label="Degree"
                      >
                        <Input placeholder="Degree" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "institution"]}
                        label="Institution"
                      >
                        <Input placeholder="Institution" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "from"]}
                        label="From"
                      >
                        <DatePicker
                          picker="month"
                          style={{ width: "100%" }}
                          placeholder="Select start month"
                        />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "current"]}
                        valuePropName="checked"
                        style={{ marginBottom: 8 }}
                      >
                        <Checkbox>Currently pursuing</Checkbox>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "to"]}
                        label="To"
                      >
                        <DatePicker
                          picker="month"
                          style={{ width: "100%" }}
                          placeholder="Select end month"
                          disabled={currentPursuing}
                        />
                      </Form.Item>
                      <Button
                        type="link"
                        danger
                        onClick={() => remove(field.name)}
                        style={{ padding: 0 }}
                      >
                        Remove
                      </Button>
                      <Divider />
                    </div>
                  );
                })}
                <Button type="dashed" onClick={() => add()}>
                  Add education entry
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* Summary */}
      <Modal
        title="Edit profile summary"
        open={summaryOpen}
        onCancel={() => setSummaryOpen(false)}
        onOk={() => summaryForm.submit()}
      >
        <Form layout="vertical" form={summaryForm} onFinish={handleSummarySave}>
          <Form.Item name="summary" label="Summary">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Career focus */}
      <Modal
        title="Edit career preferences"
        open={careerOpen}
        onCancel={() => setCareerOpen(false)}
        onOk={() => careerForm.submit()}
      >
        <Form layout="vertical" form={careerForm} onFinish={handleCareerSave}>
          <Form.Item name="targetRoles" label="Target roles">
            <Select mode="tags" placeholder="Add roles" />
          </Form.Item>
          <Form.Item name="wantMoreOf" label="What you want more of">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Resume upload drawer */}
      <ResumeUploadDrawer
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        onResumeSelected={handleResumeSelected}
        currentResume={currentResume}
      />
    </>
  );
};

export default ProfilePage;
