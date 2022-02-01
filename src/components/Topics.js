import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Style.css';
import LibPagination from './LibPagination';
import { Link } from 'react-router-dom'
import { confirm } from "react-confirm-box";

function Topic() {

    const [tData, setTData] = useState([]);
    const [x, setX] = useState(1);
    const [topicAPI, setTopicAPI] = useState([]);
    const [totalEntries, changeTotalEntries] = useState(0);
    const [selectedValue, changeSelectedValue] = useState(10);
    // const prevPage = () => {
    //     changeX(x===25? x : prevx => prevx - 1);
    // }
    const tokenKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWRkMjgwYWU2ZDdkNzdjOGU0ZjY4ZjYiLCJfYWN0aXZlT3JnIjoiNjE5Y2U0YThlNTg2ODUxNDYxMGM4ZGE3IiwiaWF0IjoxNjQzNTI5OTkzLCJleHAiOjE2NDM1NzMxOTN9.xy4c6dRPVAydXFuktMX885YatpkZstF3aHOhTAd2mKI"
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
        axios.get(`http://admin.liveexamcenter.in/api/topics?page=${x}&limit=${selectedValue}&term=&topic=`, { headers: { authorization: tokenKey } })
            .then(response => {
                changeTotalEntries(response.data.totalCount);
                console.log(response.data.result);
                setTData(response.data.result);
            })
            .catch(error => {
                console.log(error);
            })
    }, [x, selectedValue]);

console.log(tData)

    console.log(totalEntries)
    //to set start and end index of qustions per page
    let endIndex = x * selectedValue;
    const startIndex = endIndex - selectedValue;
    if (endIndex > totalEntries) endIndex = totalEntries;

    const searchQues = (e) => {
        axios.get(`http://admin.liveexamcenter.in/api/topics?page=${x}&limit=${selectedValue}&term=${e.target.value}&topic=`, { headers: { authorization: tokenKey } })
            .then(response => {
                changeTotalEntries(response.data.totalCount);
                setTData(response.data.result);
            })
            .catch(error => {
                console.log(error);
            })
    }
    const topicHandler = (e) => {
        console.log(e.target.value)
        axios.get(`http://admin.liveexamcenter.in/api/topics?page=${x}&limit=${selectedValue}&term=&topic=${e.target.value}`, { headers: { authorization: tokenKey } })
            .then(response => {
                changeTotalEntries(response.data.totalCount);
                setTData(response.data.result);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const deleteQueHandler = (Qid) => {
        // confirm("box")
        const result = confirm("Are you sure you want to delete the question, this can not be rolled back?");
        if (result) {
            axios.delete(`http://admin.liveexamcenter.in/api/topics/${Qid}`, { headers: { authorization: tokenKey } })
                .then(response => {
                    changeTotalEntries(response.data.totalCount);
                    setTData(response.data.result);
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
                    <Link to="/add_subject">
                        <button style={{ float: "right" }} className='btn btn-primary'>+ Add Subject</button></Link></h3>
            </div>
            <div className='main-div'>
                <div className='header-div'>
                    Show <select value={selectedValue} onChange={handleChange}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                    {' '} records per page

                    <input style={{ float: 'right' }} type={'text'} placeholder='Search Question' onChange={(e) => searchQues(e)} />

                </div>

                <div className='questions-div'>
                    <table className="table">
                        <tr>
                            <td>
                                <input type="checkbox" />
                            </td>
                            <td> Sr.No </td><td> Topic </td><td>Subject</td><td> Actions </td>
                        </tr>
                        {tData && tData.map((topic, index) => {
                            return (
                                <tr key={index}>
                                    <td>  <input type={'checkbox'} name="topic" value={index} id={index} /></td>
                                    <td>{index + 1}</td>
                                    <td>
                                        {topic.name}
                                    </td>
                                    <td>
                                        {topic.subject && topic.subject.name}
                                    </td>
                                    
                                    <td>
                                        <button  onClick={() => deleteQueHandler(topic._id)}>Delete</button>
                                    </td>

                                </tr>


                            )
                        })}
                    </table>
                </div>
                {/* <div><ManualPagination currentPage={x} entriesPerPage={questionsPerPage} prevPage={prevPage} nextPage={nextPage} changeX={changeX} /></div> */}
                <div className='footer'>
                    {totalEntries && <LibPagination entriesPerPage={selectedValue} currentPage={x} totalEntries={totalEntries} changeX={changeX} startIndex={startIndex} endIndex={endIndex} />}
                </div>
            </div>
        </div>
    )
}

export default Topic
