import React from "react";

const Heading = ({ heading, subHeading }) => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px clamp(20px, 5vw, 60px) 40px",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "var(--prada-black)",
          margin: "0 0 16px",
        }}
      >
        {heading}
      </h2>

      {subHeading && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--prada-gray)",
            margin: 0,
          }}
        >
          {subHeading}
        </p>
      )}
    </div>
  );
};

export default Heading;