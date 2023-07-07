import React from "react";
import "./AppDataPerPage.css";

interface IProps {
  limit: number;
  limitChange: (value: number) => void;
}

const AppPerPage = ({ limit, limitChange }: IProps) => {
  return (
    <div>
      <input
        className="input limitInput"
        type="number"
        id="limit"
        name="limit"
        min="1"
        max="100"
        value={limit}
        onChange={(e) => limitChange(parseInt(e.target.value))}
      />
      <label htmlFor="limit">/ page</label>
    </div>
  );
};

export default AppPerPage;
