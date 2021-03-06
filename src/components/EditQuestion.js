import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Main from "./Main";

function EditQuestion() {
  const { Qid } = useParams();
  const navigate = useNavigate();
  const [richEditorQ, setRichEditorQ] = useState("Enable");
  const [queAPI, setQueAPI] = useState([]);
  const [subAPI, setSubAPI] = useState([]);
  const [topicAPI, setTopicAPI] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [richTextEditFlag, setRichTextEditFlag] = useState([]);
  const tokenKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWRkMjgwYWU2ZDdkNzdjOGU0ZjY4ZjYiLCJfYWN0aXZlT3JnIjoiNjE5Y2U0YThlNTg2ODUxNDYxMGM4ZGE3IiwiaWF0IjoxNjQ0ODk5NDUwLCJleHAiOjE2NDQ5NDI2NTB9.hIb1vv07n1FOH_V1aQVy8rE3aoq6Xj6qscx52HYpx08";
  const [optionArr, setOptionArr] = useState([]);
  const [validate, setValidate] = useState({});
  const [validateOpt, setValidateOpt] = useState({});
  const [validateSameQ, setValidateSameQ] = useState({});
  const [formErrorsOpt, setFormErrorsOpt] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    type: "MULTIPLE CHOICE",
    questionText: "",
    DiffLevel: "easy",
    rightMarks: 1,
    wrongMarks: 0,
    options: null,
  });
  useEffect(() => {
    axios
      .get(`http://admin.liveexamcenter.in/api/questions/${Qid}`, {
        headers: { authorization: tokenKey },
      })
      .then((response) => {
        console.log(response.data);
        //setQidData({...response.data});
        setFormData({
          ...formData,
          subject: response.data.subject._id,
          topic: response.data.topic._id,
          type: response.data.type,
          questionText: response.data.questionText,
          DiffLevel: response.data.diffLevel,
          rightMarks: response.data.rightMarks,
          wrongMarks: response.data.wrongMarks,
        });

        setOptionArr([...response.data.options]);

        setIsLoading(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [Qid]);
  isloading && console.log(optionArr);

  useEffect(() => {}, [optionArr]);

  //subject api call
  useEffect(() => {
    axios
      .get(`http://admin.liveexamcenter.in/api/subjects?page=1&limit=5&term=`, {
        headers: { authorization: tokenKey },
      })
      .then((res) => {
        setSubAPI(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  //Read API for Topics
  useEffect(() => {
    axios
      .get(`http://admin.liveexamcenter.in/api/topics?page=1&limit=5&term=`, {
        headers: { authorization: tokenKey },
      })
      .then((res) => {
        setTopicAPI(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // useEffect(()=>{
  //     //to deselect the option when question type changes
  //      setOptionArr(tempOptionArr);

  // },[formData.type])

  useEffect(() => {
    //to add the option array to formdata
    setFormData({ ...formData, options: optionArr });
  }, [optionArr]);

  const onChangeHandler = (e) => {
    const ename = e.target.name;
    const regex = /^[0-9\b]+$/;
    if (
      (e.target.name == "rightMarks" || e.target.name == "wrongMarks") &&
      e.target.value != ""
    ) {
      setFormData({
        ...formData,
        [ename]: regex.test(e.target.value) ? parseInt(e.target.value) : "",
      });
    } else setFormData({ ...formData, [ename]: e.target.value });

    if (e.target.value == "") {
      setValidate({ ...validate, [ename]: `${ename} is Required` });
    } else {
      setValidate({ ...validate, [ename]: "" });
    }
  };

  function removeOption(index) {
    //
    const tempArr = [...optionArr];
    tempArr.splice(index, 1);
    setOptionArr(tempArr);
  }
  //console.log(optionArr)

  const changeOptions = (i, input) => {
    setOptionArr((prev) =>
      prev.map((option, ind) =>
        i == ind ? { ...option, option: input } : option
      )
    );
    setFormData({ ...formData, options: optionArr });
    if (input == "") {
      setValidateOpt({ ...validateOpt, [i]: { option: "option is required" } });
    } else {
      setValidateOpt({ ...validateOpt, [i]: "" });
    }
  };
  isloading && console.log(formData);
  const SubmitForm = (e) => {
    e.preventDefault();
    // let navigate = Navigate();
    // axios
    //   .put(`http://admin.liveexamcenter.in/api/questions/${Qid}`, formData, {
    //     headers: { authorization: tokenKey },
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //     navigate("/questions");
    //     // setTopicAPI(res.data.result)
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    setValidate(validateOnSubmit(formData));

    setFormErrorsOpt(validateOnSubmitOpt(formData));

    setIsSubmit(true);
    console.log(optionArr);
    console.log(formData);
  };
  const validateOnSubmit = (values) => {
    const errors = {};
    let flag = false;
    if (values.subject == "") errors.subject = "Subject is Required";
    if (values.topic == "") errors.topic = "Topic is Required";
    if (values.rightMarks == null)
      errors.rightMarks = "Right Marks are Required";
    if (values.wrongMarks == null)
      errors.wrongMarks = "Wrong Marks are Required";
    if (values.questionText == "") errors.questionText = "Question is Required";

    values.options.map((option) => {
      if (option.isCorrect === true) {
        flag = true;
      }
    });
    console.log(flag);
    if (flag === false)
      errors.correctOpt = "Please select correct answer from options";

    return errors;
  };
  const validateOnSubmitOpt = (values) => {
    const oArr = [];
    values.options.map((option) => {
      if (option.option == "") {
        oArr.push({ option: "option is required" });
        console.log(oArr);
      } else {
        oArr.push({ option: "" });
      }
    });
    return oArr;
  };
  useEffect(() => {
    let flag = 0;
    Object.keys(validateOpt).map(function (err) {
      if (validateOpt[err] != "") {
        flag++;
      }
    });
    console.log(isSubmit);
    console.log(Object.keys(validate).length);
    if (Object.keys(validate).length === 0 && flag == 0 && isSubmit) {
      axios
        .put(`http://admin.liveexamcenter.in/api/questions/${Qid}`, formData, {
          headers: { authorization: tokenKey },
        })
        .then((res) => {
          console.log(res.data);
          console.log("success");
          setIsSubmit(false);
          navigate("/questions");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  const checkBoxOption = (i, e) => {
    //To check option is checked or not and accordingly set value of iscorrect
    e.checked == true
      ? setOptionArr((prev) =>
          prev.map((isCorrect, ind) =>
            i == ind ? { ...isCorrect, isCorrect: true } : isCorrect
          )
        )
      : setOptionArr((prev) =>
          prev.map((isCorrect, ind) =>
            i == ind ? { ...isCorrect, isCorrect: false } : isCorrect
          )
        );
  };

  const radioBoxOption = (i, e) => {
    //To check option is checked or not and accordingly set value of iscorrect
    e.checked == true
      ? setOptionArr((prev) =>
          prev.map((isCorrect, ind) =>
            i == ind
              ? { ...isCorrect, isCorrect: true }
              : { ...isCorrect, isCorrect: false }
          )
        )
      : setOptionArr((prev) =>
          prev.map((isCorrect, ind) =>
            i == ind ? { ...isCorrect, isCorrect: false } : isCorrect
          )
        );
  };

  const newOption = () => {
    const temp = [
      ...optionArr,
      { isCorrect: false, option: "", richTextEditor: false },
    ];
    setOptionArr(temp);
  };
  const changeRichTextQ = () => {
    richEditorQ == "Enable"
      ? setRichEditorQ("Disable")
      : setRichEditorQ("Enable");
  };
  const changeRichText = (i) => {
    setOptionArr((prev) =>
      prev.map((opt, j) =>
        i === j
          ? {
              ...opt,
              richTextEditor: opt.richTextEditor == true ? false : true,
            }
          : opt
      )
    );
  };
  const onChangeHandlerEditor = (e) => {
    setFormData({ ...formData, questionText: e });
  };
  const onChangeHandlerEditorOp = (e, i) => {
    console.log(e);
    setOptionArr((prev) =>
      prev.map((opt, j) => (i === j ? { ...opt, option: e } : opt))
    );
  };

  useEffect(() => {
    if (isloading) {
      let temp = optionArr.map((e) => {
        e.richTextEditor = false;
        return e;
      });
      setOptionArr(temp);
    } else return;
  }, [isloading]);
  return (
    <div>
      <Main />
      {isloading && (
        <div className="add-div">
          <div className="add-header">
            <h3>Edit question</h3>
          </div>
          <pre>{JSON.stringify(formData, undefined, 2)}</pre>
          <form onSubmit={SubmitForm} id="myForm">
            {/* middle part of add question page */}
            <div className="add-main">
              {/* for select subject and topic */}
              <div className="add-main-row">
                {/* for subject */}
                <div style={{ flex: "1" }} className="add-main-row1-col1">
                  <label>Select Subject</label>
                  <br />
                  <select
                    className="add-select"
                    name="subject"
                    value={formData.subject}
                    onChange={onChangeHandler}
                    required
                  >
                    {subAPI &&
                      subAPI.map((subject, i) => {
                        return (
                          <option key={i} value={subject._id}>
                            {subject.name}
                          </option>
                        );
                      })}
                  </select>
                  <span style={{ color: "red" }}>{validate.subject}</span>
                </div>
                {/* for topic */}
                <div style={{ flex: "1" }} className="add-main-row1-col1">
                  <label>Select Topic</label>
                  <br />
                  <select
                    className="add-select"
                    name="topic"
                    value={formData.topic}
                    onChange={onChangeHandler}
                  >
                    {/* <option value={QidData.topic && QidData.topic._id} >{QidData.topic && QidData.topic.name}</option>  */}
                    {topicAPI &&
                      topicAPI.map((topic, i) => {
                        return topic.subject &&
                          topic.subject._id === formData.subject ? (
                          <option key={i} value={topic._id}>
                            {topic.name}
                          </option>
                        ) : null;
                      })}
                  </select>
                  <span style={{ color: "red" }}>{validate.topic}</span>
                </div>
                {}{" "}
              </div>
              {/* for question type, level and marks */}
              <div className="add-main-row">
                {/* for question type and level of difficulty */}
                <div style={{ flex: "1" }} className="add-main-row2-col1">
                  {/* for Question type */}
                  <div style={{ flex: "1" }} className="row2-div">
                    <label>Question Type</label>
                    <br />
                    <select
                      className="add-select"
                      name="Qtype"
                      value={formData.type}
                      onChange={onChangeHandler}
                    >
                      <option value={"MULTIPLE CHOICE"}>Multiple Choice</option>
                      <option value={"MULTIPLE RESPONSE"}>
                        Multiple Response
                      </option>
                      <option value={"FILL IN BLANKS"}>
                        Fill in the blanks
                      </option>
                    </select>
                  </div>
                  {/* for Difficulty Level */}
                  <div
                    style={{ flex: "1" }}
                    className="add-main-row2-half row2-div"
                  >
                    <label>Difficulty Level</label>
                    <br />
                    <select
                      className="add-select"
                      name="DiffLevel"
                      value={formData.DiffLevel}
                      onChange={onChangeHandler}
                    >
                      <option value={"easy"}>Easy</option>
                      <option value={"medium"}>Medium</option>
                      <option value={"hard"}>Hard</option>
                    </select>
                  </div>
                </div>
                <div style={{ flex: "1" }} className="add-main-row2-col1 ">
                  <div style={{ flex: "1" }}>
                    <label>Right Marks</label>
                    <br />
                    <input
                      type={"text"}
                      name="rightMarks"
                      className="add-input"
                      value={formData.rightMarks}
                      onChange={onChangeHandler}
                    />
                    <span style={{ color: "red" }}>{validate.rightMarks}</span>
                  </div>
                  <div style={{ flex: "1" }} className="add-main-row2-half">
                    <label>Wrong Marks</label>
                    <input
                      type={"text"}
                      name="wrongMarks"
                      className="add-input"
                      value={formData.wrongMarks}
                      onChange={onChangeHandler}
                    />
                    <span style={{ color: "red" }}>{validate.wrongMarks}</span>
                  </div>
                </div>
              </div>
              <div className="questionText-div">
                <label>Question</label>
                {richEditorQ == "Enable" ? (
                  <textarea
                    rows={5}
                    style={{
                      width: "100%",
                      borderRadius: "4px",
                      border: "1px solid lightgrey",
                    }}
                    name="questionText"
                    value={formData.questionText}
                    onChange={onChangeHandler}
                  />
                ) : (
                  <ReactQuill
                    onChange={onChangeHandlerEditor}
                    value={formData.questionText}
                  />
                )}
                <button
                  type="button"
                  className="option-btm-btn"
                  style={{
                    marginTop: "3px",
                    marginLeft: "10px",
                    backgroundColor: "white",
                    border: "none",
                  }}
                  onClick={() => changeRichTextQ()}
                >
                  {" "}
                  {richEditorQ} Rich Text Editor
                </button>
                <span style={{ color: "red" }}>{validate.questionText}</span>
                {/* <textarea rows={5} style={{ width: '100%', borderRadius: '4px', border: '1px solid lightgrey' }} name='questionText' defaultValue={formData.questionText} onChange={onChangeHandler} /> */}
              </div>
              <div>
                Options
                {optionArr.map((i, val) => {
                  return formData.type == "MULTIPLE RESPONSE" ? (
                    <div key={val}>
                      <div className="options-row">
                        <div className="options-col left">
                          <input
                            type={"checkbox"}
                            name={"isCorrect"}
                            id={`radio-1`}
                            name="isCorrect"
                            checked={i.isCorrect}
                            onChange={(e) => checkBoxOption(val, e.target)}
                          />{" "}
                          Option {val + 1}
                        </div>
                        {i.richTextEditor == false ? (
                          <textarea
                            rows={4}
                            id={`textarea-1`}
                            className="options-col right"
                            value={i.option}
                            style={{ border: "none", paddingLeft: "10px" }}
                            name={`option`}
                            onChange={(e) => changeOptions(val, e.target.value)}
                          />
                        ) : (
                          <ReactQuill
                            onChange={(e) => onChangeHandlerEditorOp(e, val)}
                            value={i.option}
                          />
                        )}
                        {/* <textarea rows={4} id={`textarea-1`} className='options-col right' value={i.option}  style={{ border: 'none', paddingLeft: '10px' }} name={`option`} onChange={(e) => changeOptions(val, e.target.value)}/> */}
                      </div>
                      <button
                        type="button"
                        className="option-btm-btn"
                        style={{
                          marginTop: "3px",
                          marginRight: "10px",
                          backgroundColor: "white",
                          border: "none",
                        }}
                      >
                        {" "}
                        Remove Option
                      </button>
                      |
                      <button
                        type="button"
                        className="option-btm-btn"
                        style={{
                          marginTop: "3px",
                          marginLeft: "10px",
                          backgroundColor: "white",
                          border: "none",
                        }}
                        onClick={() => changeRichText(val)}
                      >
                        {i.richTextEditor === false ? "Enable" : "Disable"} Rich
                        Text Editor
                      </button>
                      <div>
                        {isSubmit ? (
                          <span style={{ color: "red" }}>
                            {formErrorsOpt[val].option}
                          </span>
                        ) : (
                          Object.keys(validateOpt).map((obj, i) => {
                            return i === val ? (
                              <span style={{ color: "red" }}>
                                {validateOpt[obj].option}
                              </span>
                            ) : null;
                          })
                        )}
                      </div>
                    </div>
                  ) : (
                    <div key={val}>
                      <div className="options-row">
                        <div className="options-col left">
                          <input
                            type={"radio"}
                            id={`radio-1`}
                            name="isCorrect"
                            checked={i.isCorrect}
                            onChange={(e) => radioBoxOption(val, e.target)}
                          />{" "}
                          Option {val + 1}
                        </div>
                        {/* <textarea rows={4} id={`textarea-1`} className='options-col right' value={i.option} style={{ border: 'none', paddingLeft: '10px' }} name={`option`} onChange={(e) => changeOptions(val, e.target.value)}/> */}
                        {i.richTextEditor == false ? (
                          <textarea
                            rows={4}
                            id={`textarea-1`}
                            className="options-col right"
                            value={i.option}
                            style={{ border: "none", paddingLeft: "10px" }}
                            name={`option`}
                            onChange={(e) => changeOptions(val, e.target.value)}
                          />
                        ) : (
                          <ReactQuill
                            onChange={(e) => onChangeHandlerEditorOp(e, val)}
                            value={i.option}
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        className="option-btm-btn"
                        style={{
                          marginTop: "3px",
                          marginRight: "10px",
                          backgroundColor: "white",
                          border: "none",
                        }}
                        onClick={() => removeOption(val)}
                      >
                        {" "}
                        Remove Option
                      </button>
                      |
                      <button
                        type="button"
                        className="option-btm-btn"
                        style={{
                          marginTop: "3px",
                          marginLeft: "10px",
                          backgroundColor: "white",
                          border: "none",
                        }}
                        onClick={() => changeRichText(val)}
                      >
                        {" "}
                        {i.richTextEditor === false ? "Enable" : "Disable"} Rich
                        Text Editor
                      </button>
                      <div>
                        {isSubmit ? (
                          <span style={{ color: "red" }}>
                            {formErrorsOpt[val].option}
                          </span>
                        ) : (
                          Object.keys(validateOpt).map((obj, i) => {
                            return i === val ? (
                              <span style={{ color: "red" }}>
                                {validateOpt[obj].option}
                              </span>
                            ) : null;
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button type="button" onClick={newOption}>
                +Add Option
              </button>
            </div>
            <div className="add-footer">
              <button
                className="btn btn-primary"
                style={{ padding: "10px 15px 10px 15px", fontSize: "20px" }}
                type="submit"
              >
                Update question
              </button>
              <Link to="/questions">
                <button
                  type="button"
                  className="btn btn-light"
                  style={{
                    marginLeft: "30px",
                    fontSize: "20px",
                    border: "none",
                    outline: "none",
                    padding: "6px 10px 6px 10px",
                  }}
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default EditQuestion;
