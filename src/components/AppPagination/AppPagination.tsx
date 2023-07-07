import React from "react";

interface IProps {
  currPage: number;
  onPrevBtn: () => void;
  onNextBtn: () => void;
  paginationChange: (value: number) => void;
}

const AppPagination = ({
  currPage,
  onPrevBtn,
  onNextBtn,
  paginationChange,
}: IProps) => {
  return (
    <div>
      <button className="paginationBtn" onClick={onPrevBtn}>
        Previous
      </button>
      <input
        className="input paginationInput"
        type="number"
        id="pagination"
        name="pagination"
        value={currPage}
        onChange={(e) => paginationChange(parseInt(e.target.value))}
      />
      <button className="paginationBtn" onClick={onNextBtn}>
        Next
      </button>
    </div>
  );
};

export default AppPagination;
