import React from "react";

interface LinkProps {
  link: LinkData;
  isHistory?: boolean;
}

const Link: React.FC<LinkProps> = ({ link, isHistory }) => {
  return (
    <line
      className="link"
      stroke={isHistory ? "lightcoral" : "#999"}
      strokeDasharray={isHistory ? "5, 5" : "2, 2"}
    />
  );
};

export default Link;
