// const Heading = ({ heading, subHeading }) => {
//   return (
//     <div className="text-center px-5 py-14 md:py-16">
//       {subHeading && (
//         <div className="inline-flex flex-col items-center gap-2 ">
//           <p className="text-4xl md:text-4xl font-bold  leading-tight underline underline-offset-9">
//             {subHeading}
//           </p>
//         </div>
//       )}

//       <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold  leading-[1.05]">
//         {heading}
//       </h2>
//     </div>
//   );
// };

// export default Heading;

const Heading = ({ heading, subHeading }) => {
  return (
    <div className="text-center px-5 py-14 md:py-16">
      {subHeading && (
        <div className="inline-flex flex-col items-center gap-2">
          <p className="text-4xl md:text-4xl font-bold leading-tight tracking-wide underline underline-offset-6 decoration-2">
            {subHeading}
          </p>
        </div>
      )}

      <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
        {heading}
      </h2>
    </div>
  );
};

export default Heading;