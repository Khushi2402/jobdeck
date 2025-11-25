// src/components/profile/ResumeUploadDrawer.jsx
import { Drawer, Upload, Typography, message, Button, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ResumeUploadDrawer = ({
  open,
  onClose,
  onResumeSelected,
  currentResume,
}) => {
  const beforeUpload = (file) => {
    const isAllowed =
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (!isAllowed) {
      message.error("Only PDF or Word documents are allowed.");
      return Upload.LIST_IGNORE;
    }

    if (file.size > 2 * 1024 * 1024) {
      message.error("File must be smaller than 2MB.");
      return Upload.LIST_IGNORE;
    }

    // We don't actually upload anywhere; we just pass meta back to parent
    onResumeSelected({
      fileName: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    });

    message.success("Resume stored locally for this profile.");
    onClose();
    return Upload.LIST_IGNORE;
  };

  return (
    <Drawer
      title="Upload resume"
      placement="right"
      width={360}
      onClose={onClose}
      open={open}
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Text type="secondary">
          Upload a PDF or Word document. We store it only in your browser
          (localStorage) for now – no real server upload yet.
        </Text>

        {currentResume && (
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: "#f9fafb",
            }}
          >
            <Text strong>Current resume</Text>
            <br />
            <Text>{currentResume.fileName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Last updated {new Date(currentResume.uploadedAt).toLocaleString()}
            </Text>
          </div>
        )}

        <Upload beforeUpload={beforeUpload} showUploadList={false}>
          <Button icon={<UploadOutlined />}>Choose file</Button>
        </Upload>
      </Space>
    </Drawer>
  );
};

export default ResumeUploadDrawer;
