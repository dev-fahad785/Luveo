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
          fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
          fontWeight: 300,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--prada-black)",
          margin: "0 0 16px",
        }}
      >
        {heading}
      </h2>

      {/* Thin centre line */}
      <div
        style={{
          width: 40,
          height: 1,
          background: "var(--prada-black)",
          margin: "0 auto 18px",
        }}
      />

      {subHeading && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.7rem",
            fontWeight: 400,
            letterSpacing: "0.15em",
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