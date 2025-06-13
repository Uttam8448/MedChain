import React from "react";

const GetPrediction = () => {
  const handleClick = () => {
    window.open("http://127.0.0.1:5000", "_blank");
  };

  return (
    <div>
      <button onClick={handleClick} className={` text-white px-4 py-2 rounded w-fit bg-cyan-500 tracking-widest` }>Click for Prediction</button>
    </div>
  );
};

export default GetPrediction;
