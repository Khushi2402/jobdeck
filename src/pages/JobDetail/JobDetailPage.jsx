import { useParams } from "react-router-dom";

const JobDetailPage = () => {
  const { jobId } = useParams();

  return <div>Job Detail for {jobId} will come here</div>;
};

export default JobDetailPage;
