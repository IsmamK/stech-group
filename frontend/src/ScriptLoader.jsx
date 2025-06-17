import { useEffect } from "react";

const ScriptLoader = ({ src, inline, strategy = "afterInteractive", id }) => {
  useEffect(() => {
    if (inline && strategy === "afterInteractive") {
      const script = document.createElement("script");
      script.id = id;
      script.innerHTML = inline;
      document.body.appendChild(script);
      return () => script.remove();
    }

    if (src) {
      const script = document.createElement("script");
      script.src = src;
      script.async = strategy !== "beforeInteractive";
      document.body.appendChild(script);
      return () => script.remove();
    }
  }, [src, inline, strategy, id]);

  return null;
};

export default ScriptLoader;
