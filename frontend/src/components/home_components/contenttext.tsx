import { useState } from "react";

function ContentText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [contentText, setContentText] = useState(text.substring(0, 800));
  const handleExpanded = () => {
    setExpanded(!expanded);
    expanded ? setContentText(text.substring(0, 800)) : setContentText(text);
  };
  return (
    <>
      {contentText}
      <a
        style={{ cursor: "pointer" }}
        onClick={handleExpanded}
        className="link"
      >
        &nbsp;Read {expanded ? "less" : "more"}..
      </a>
    </>
  );
}

export default ContentText;
