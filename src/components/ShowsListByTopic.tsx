import React from "react";
import ShowCard from "./ShowCard";
import { Skeleton, Typography } from "@mui/material";
import { Show } from "../services/types";

interface ShowsListByTopicProps {
  showsByTopic: Show[];
  loading: boolean;
}

const ShowsListByTopic: React.FC<ShowsListByTopicProps> = ({ showsByTopic, loading }) => {
  return (
    <div className="p-7">
      <div className="pb-3 mb-4">
        <Typography variant="h4" gutterBottom color="secondary">
          Results
        </Typography>
        <div className="flex flex-wrap gap-5 pb-2">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index}>
                <Skeleton variant="rectangular" width={300} height={250} />
              </div>
            ))
          ) : showsByTopic.length > 0 ? (
            showsByTopic.map((show) => <ShowCard key={show.id} show={show} />)
          ) : (
            <Typography variant="body1">No results.</Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowsListByTopic;
