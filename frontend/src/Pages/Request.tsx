import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { data } from "../components/config";

const TrackLogger: React.FC = () => {
  const { loggerId } = useParams<{ loggerId: string }>();

  useEffect(() => {
    if (!loggerId) return;

    window.location.href = `${data.api}/api/logger/log/${loggerId}`;
  }, [loggerId]);

  return (
    <>
     <title>Wait...</title>
     <p>Wait....</p>
    </>
  );
};

export default TrackLogger;