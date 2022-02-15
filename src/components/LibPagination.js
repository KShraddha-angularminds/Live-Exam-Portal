import React from "react";
import Pagination from "react-bootstrap-4-pagination";

function LibPagination({
  entriesPerPage,
  currentPage,
  totalEntries,
  changeX,
  startIndex,
  endIndex,
}) {
  const renderQuestions = [];
  console.log(typeof entriesPerPage);
  for (let i = 1; i <= Math.ceil(totalEntries / entriesPerPage); i++) {
    renderQuestions.push(i);
  }
  console.log(renderQuestions);
  let pLength = renderQuestions.length;
  console.log(pLength);
  let paginationConfig = {
    totalPages: totalEntries / entriesPerPage,
    currentPage: currentPage,
    showMax: 10,
    //parseInt(entriesPerPage) ,
    //currentPage>16 && currentPage<=20 ?(pLength-currentPage)+2:entriesPerPage,
    size: "md",
    threeDots: false,
    prevNext: true,
    prevText: "Previous",
    nextText: "Next",
    // activeBorderColor: 'black',
    activeBgColor: "blue",
    onClick: function (page) {
      if (page <= pLength) changeX(page);
      else return;
    },
  };

  return (
    <div className="row">
      <div className="col-md">
        Showing {startIndex + 1} to {endIndex} of {totalEntries} entries
      </div>
      <div className="col-md">
        <Pagination {...paginationConfig} />
      </div>
    </div>
  );
}

export default LibPagination;
