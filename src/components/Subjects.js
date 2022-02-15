import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Style.css";
import LibPagination from "./LibPagination";
import { Link } from "react-router-dom";
import Main from "./Main";
import Modal from "react-modal";
//import { confirm } from "react-confirm-box";

function Subject() {
  const [sData, setSData] = useState([]);
  const [x, setX] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [topicAPI, setTopicAPI] = useState([]);
  const [totalEntries, changeTotalEntries] = useState(0);
  const [selectedValue, changeSelectedValue] = useState(10);
  const [checkArr, setCheckArr] = useState([]);
  const [deleteResponse, setDelResonse] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  // const prevPage = () => {
  //     changeX(x===25? x : prevx => prevx - 1);
  // }
  const tokenKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWRkMjgwYWU2ZDdkNzdjOGU0ZjY4ZjYiLCJfYWN0aXZlT3JnIjoiNjE5Y2U0YThlNTg2ODUxNDYxMGM4ZGE3IiwiaWF0IjoxNjQ0ODk5NDUwLCJleHAiOjE2NDQ5NDI2NTB9.hIb1vv07n1FOH_V1aQVy8rE3aoq6Xj6qscx52HYpx08";

  useEffect(() => {
    setX(1);
  }, [selectedValue]);

  const changeX = (no) => {
    setX(no);
  };

  const handleChange = (e) => {
    changeSelectedValue(e.target.value);
  };

  // console.log(selectedValue);
  useEffect(() => {
    axios
      .get(
        `http://admin.liveexamcenter.in/api/subjects?page=${x}&limit=${selectedValue}&term=&topic=`,
        { headers: { authorization: tokenKey } }
      )
      .then((response) => {
        changeTotalEntries(response.data.totalCount);
        console.log(response.data.result);
        setSData(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [x, selectedValue, deleteResponse, isSubmit]);

  // console.log(totalEntries)
  //to set start and end index of qustions per page
  let endIndex = x * selectedValue;
  const startIndex = endIndex - selectedValue;
  if (endIndex > totalEntries) endIndex = totalEntries;

  const searchQues = (e) => {
    axios
      .get(
        `http://admin.liveexamcenter.in/api/subjects?page=${x}&limit=${selectedValue}&term=${e.target.value}&topic=`,
        { headers: { authorization: tokenKey } }
      )
      .then((response) => {
        changeTotalEntries(response.data.totalCount);
        setSData(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const topicHandler = (e) => {
    console.log(e.target.value);
    axios
      .get(
        `http://admin.liveexamcenter.in/api/subjects?page=${x}&limit=${selectedValue}&term=&topic=${e.target.value}`,
        { headers: { authorization: tokenKey } }
      )
      .then((response) => {
        changeTotalEntries(response.data.totalCount);
        setSData(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteQueHandler = (Qid) => {
    const result = window.confirm(
      "Are you sure you want to delete the question, this can not be rolled back?"
    );
    if (result) {
      axios
        .delete(`http://admin.liveexamcenter.in/api/subjects/${Qid}`, {
          headers: { authorization: tokenKey },
        })
        .then((response) => {
          changeTotalEntries(response.data.totalCount);
          setDelResonse(Qid);
          document.getElementById("sDelete").selected = false;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const SingleDelete = (e, index) => {
    if (e.target.checked) setCheckArr([...checkArr, index]);
    else {
      document.getElementById("AllCheck").checked = false;
      const tempArr = checkArr.filter((item) => item !== index);
      setCheckArr(tempArr);
      console.log(checkArr);
    }
  };
  const deleteSelected = (e) => {
    checkArr.map((index) => {
      axios
        .delete(`http://admin.liveexamcenter.in/api/subjects/${index}`, {
          headers: { authorization: tokenKey },
        })
        .then((response) => {
          setCheckArr([]);
          setDelResonse(e);
          document.getElementById("sCheck").checked = false;
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const deleteAll = (e) => {
    if (e.target.checked) {
      var ele = document.getElementsByName("subjectChk");
      for (var i = 0; i < ele.length; i++) {
        if (ele[i].type == "checkbox") ele[i].checked = true;
      }
      let temp = sData.map((data) => {
        return data._id;
      });
      setCheckArr(temp);
    } else {
      var ele = document.getElementsByName("subjectChk");
      for (var i = 0; i < ele.length; i++) {
        if (ele[i].type == "checkbox") ele[i].checked = false;
      }
      setCheckArr([]);
    }
  };
  console.log(formData);
  useEffect(() => {
    if (checkArr.length != 0)
      document.getElementById("sDelete").style.display = "block";
    else document.getElementById("sDelete").style.display = "none";
  }, [checkArr]);

  console.log(checkArr);
  const handleAddSubject = () => {
    axios
      .post("http://admin.liveexamcenter.in/api/subjects", formData, {
        headers: { authorization: tokenKey },
      })
      .then((res) => {
        console.log(res.data);
        console.log("sucees");
        setIsSubmit(true);

        //setFormData(tempformData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className>
      <Main />
      <div className="title-div">
        <h3>
          Subjects
          <button
            style={{ float: "right" }}
            className="btn btn-primary"
            class="btn btn-primary"
            data-toggle="modal"
            data-target="#exampleModal"
          >
            + Add Subject
          </button>
        </h3>
      </div>
      <div className="main-div">
        <div className="header-div">
          Show{" "}
          <select value={selectedValue} onChange={handleChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>{" "}
          records per page
          <input
            style={{ float: "right" }}
            type={"text"}
            placeholder="Search Question"
            onChange={(e) => searchQues(e)}
          />
        </div>

        <div className="questions-div">
          <table className="table">
            <tr>
              <td>
                <input
                  type="checkbox"
                  id="AllCheck"
                  onClick={(e) => deleteAll(e)}
                />
              </td>
              <td> Sr.No </td>
              <td> Subject </td>
              <td> Actions </td>
              <td>
                <button
                  name="check"
                  id="sDelete"
                  style={{ display: "none" }}
                  onClick={(e) => deleteSelected(e)}
                  style={{ border: "none" }}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </td>
            </tr>
            {sData &&
              sData.map((subject, index) => {
                return (
                  <tr key={index}>
                    <td>
                      {" "}
                      <input
                        type={"checkbox"}
                        name="subjectChk"
                        value={index}
                        id={"sCheck"}
                        onClick={(e) => SingleDelete(e, subject._id)}
                      />
                    </td>
                    <td>{startIndex + index + 1}</td>
                    <td>{subject.name}</td>
                    <td>
                      <button
                        onClick={() => deleteQueHandler(subject._id)}
                        style={{ border: "none" }}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
          </table>
        </div>
        {/* <div><ManualPagination currentPage={x} entriesPerPage={questionsPerPage} prevPage={prevPage} nextPage={nextPage} changeX={changeX} /></div> */}
        <div className="footer">
          {totalEntries && (
            <LibPagination
              entriesPerPage={selectedValue}
              currentPage={x}
              totalEntries={totalEntries}
              changeX={changeX}
              startIndex={startIndex}
              endIndex={endIndex}
            />
          )}
        </div>
      </div>
      {/* -----Model Box----- */}

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                <h3>
                  <b>Add Subject</b>
                </h3>
              </h5>
            </div>
            <div class="modal-body">
              <label> Subject Name</label>

              <input
                type="text"
                name="name"
                style={{ width: "100%" }}
                onChange={onChangeHandler}
              />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                style={{ border: "none" }}
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={handleAddSubject}
                data-dismiss="modal"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subject;
