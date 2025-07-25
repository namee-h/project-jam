import { Box, styled, Typography } from "@mui/material";
import type { JSX } from "react";
import { useParams } from "react-router-dom";

import useProjectDelete from "@features/projects/queries/useProjectDone";

export const ProjectDone = (): JSX.Element => {
  return (
    <MessageBtn className="gray">
      <Typography fontWeight={600}>모집 마감</Typography>
    </MessageBtn>
  );
};

export const ProjectDones = ({
  projectOwnerID,
}: {
  projectOwnerID: string;
}): JSX.Element => {
  const { id: projectID } = useParams();
  const { mutate: projectdelete, isPending } = useProjectDelete();

  const handleIsDone = (): void => {
    if (projectID && !isPending) {
      projectdelete({ projectID, projectOwnerID });
    }
  };

  return (
    <MessageBtn className="red" onClick={handleIsDone}>
      <Typography>모집 마감 하기</Typography>
    </MessageBtn>
  );
};

const MessageBtn = styled(Box)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  cursor: pointer;

  &.white {
    border: 1px solid #dddddd;
    &:hover {
      background-color: #f4f4f4;
    }
  }

  &.red {
    color: white;
    background-color: tomato;
    &:hover {
      background-color: #e14b30;
    }
  }

  &.gray {
    color: #303030;
    background-color: #f0f0f0;
    cursor: default;
  }
`;
