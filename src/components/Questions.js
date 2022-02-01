import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Style.css';
import LibPagination from './LibPagination';
import { Link } from 'react-router-dom'
import { confirm } from "react-confirm-box";

function Questions() {

    const [qData, setQData] = useState([]);
    const [x, setX] = useState(1);
    const [topicAPI, setTopicAPI] = useState([]);
    const [totalEntries, changeTotalEntries] = useState(0);
    const [selectedValue, changeSelectedValue] = useState(10);
    // const prevPage = () => {
    //     changeX(x===25? x : prevx => prevx - 1);
    // }
    const tokenKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWRkMjgwYWU2ZDdkNzdjOGU0ZjY4ZjYiLCJfYWN0aXZlT3JnIjoiNjE5Y2U0YThlNTg2ODUxNDYxMGM4ZGE3IiwiaWF0IjoxNjQzNjkwNDc3LCJleHAiOjE2NDM3MzM2Nzd9.rvaDoA1OwjHgJjs85f52ENKfTRdqo7NlkrudyN-JkMQ"
    useEffect(() => {
        setX(1);
    }, [selectedValue])


    const changeX = no => {
        setX(no);
    }

    const handleChange = e => {
        changeSelectedValue(e.target.value);
    }

    console.log(selectedValue);
    useEffect(() => {
        axios.get(`http://admin.liveexamcenter.in/api/questions?page=${x}&limit=${selectedValue}&term=&topic=`, { headers: { authorization: tokenKey } })
            .then(response => {
                changeTotalEntries(response.data.totalCount);
                console.log(response.data.result);
                setQData(response.data.result);
            })
            .catch(error => {
                console.log(error);
            })
    }, [x, selectedValue]);

    useEffect(() => {

        axios.get(`http://admin.liveexamcenter.in/api/topics?page=1&limit=5&term=`, { headers: { authorization: tokenKey } })
            .then((res) => {
                console.log(res.data.result)
                setTopicAPI(res.data.result)
            })
            .catch((err) => {
                console.log(err)
            })


    }, [])



    console.log(totalEntries)
    //to set start and end index of qustions per page
    let endIndex = x * selectedValue;
    const startIndex = endIndex - selectedValue;
    if (endIndex > totalEntries) endIndex = totalEntries;

    const searchQues = (e) => {
        axios.get(`http://admin.liveexamcenter.in/api/questions?page=${x}&limit=${selectedValue}&term=${e.target.value}&topic=`, { headers: { authorization: tokenKey } })
            .then(response => {
                changeTotalEntries(response.data.totalCount);
                setQData(response.data.result);
            })
            .catch(error => {
                console.log(error);
            })
    }
    const topicHandler = (e) => {
        console.log(e.target.value)
        axios.get(`http://admin.liveexamcenter.in/api/questions?page=${x}&limit=${selectedValue}&term=&topic=${e.target.value}`, { headers: { authorization: tokenKey } })
            .then(response => {
                changeTotalEntries(response.data.totalCount);
                setQData(response.data.result);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const deleteQueHandler = (Qid) => {
        // confirm("box")
        const result = confirm("Are you sure you want to delete the question, this can not be rolled back?");
        if (result) {
            axios.delete(`http://admin.liveexamcenter.in/api/questions/${Qid}`, { headers: { authorization: tokenKey } })
                .then(response => {
                    changeTotalEntries(response.data.totalCount);
                    setQData(response.data.result);
                })
                .catch(error => {
                    console.log(error);
                })
        }

    }
    return (
        <div className>
            <div className='title-div'>
                <h3>Questions
                    <Link to="/add_question">
                        <button style={{ float: "right" }} className='btn btn-primary'>+ Add Question</button></Link></h3>
            </div>
            <div className='main-div'>
                <div className='header-div'>
                    Show <select value={selectedValue} onChange={handleChange}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                    {' '} records per page
                    <select style={{ float: 'right' }} defaultValue={'default'} className='topics-dd' onClick={(e) => topicHandler(e)}>
                        <option value="default" disabled hidden>Select Topic</option>
                        {topicAPI && topicAPI.map((topic, i) => {
                            return <option key={i} value={topic._id}>{topic.name}</option>
                        })}
                    </select>

                    <input style={{ float: 'right' }} type={'text'} placeholder='Search Question' onChange={(e) => searchQues(e)} />

                </div>

                <div className='questions-div'>

                    {/*  qData && (questionsPerPage = qData.slice(0,10)) */}
                    {qData && qData.map((question, index) => {
                        const qType = question.type === 'MULTIPLE CHOICE' ? 'radio' : 'checkbox';
                        return (
                            <div key={index}>
                                <hr />
                                <div className='per-question'>
                                    <input type={'checkbox'} name="question" value={index} id={index} />
                                    {question.questionText}
                                    <div className='options-div'>
                                        {question.options.map((option, indexop) => {
                                            return (
                                                <div key={indexop}>
                                                    <label>
                                                        <input type={qType} name='option' value={indexop} id={indexop} />
                                                        {option.option}
                                                    </label>
                                                </div>

                                            )
                                        })}
                                        <Link to={`/edit/${question._id}`}>
                                        <button>Edit</button>
                                        </Link>
                                        <button onClick={() => deleteQueHandler(question._id)}>Delete</button>
                                    </div>

                                </div>
                            </div>
                        )
                    })}
                </div>
                {/* <div><ManualPagination currentPage={x} entriesPerPage={questionsPerPage} prevPage={prevPage} nextPage={nextPage} changeX={changeX} /></div> */}
                <div className='footer'>
                    {totalEntries && <LibPagination entriesPerPage={selectedValue} currentPage={x} totalEntries={totalEntries} changeX={changeX} startIndex={startIndex} endIndex={endIndex} />}
                </div>
            </div>
        </div>
    )
}

export default Questions
