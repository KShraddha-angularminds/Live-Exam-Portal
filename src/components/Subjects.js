import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Style.css';
import LibPagination from './LibPagination';
import { Link } from 'react-router-dom'
//import { confirm } from "react-confirm-box";

function Subject() {

    const [sData, setSData] = useState([]);
    const [x, setX] = useState(1);
    const [topicAPI, setTopicAPI] = useState([]);
    const [totalEntries, changeTotalEntries] = useState(0);
    const [selectedValue, changeSelectedValue] = useState(10);
    const [checkArr, setCheckArr] = useState([])
    const [deleteResponse,setDelResonse]=useState('')
    // const prevPage = () => {
    //     changeX(x===25? x : prevx => prevx - 1);
    // }
    const tokenKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWRkMjgwYWU2ZDdkNzdjOGU0ZjY4ZjYiLCJfYWN0aXZlT3JnIjoiNjE5Y2U0YThlNTg2ODUxNDYxMGM4ZGE3IiwiaWF0IjoxNjQ0MjkyNzc4LCJleHAiOjE2NDQzMzU5Nzh9.GQmj1paG6Eaj-3eed0mL-5Nv-SshEbS_N6qVIKO9Xe0"
    useEffect(() => {
        setX(1);
    }, [selectedValue])


    const changeX = no => {
        setX(no);
    }

    const handleChange = e => {
        changeSelectedValue(e.target.value);
    }

    // console.log(selectedValue);
    useEffect(() => {
        axios.get(`http://admin.liveexamcenter.in/api/subjects?page=${x}&limit=${selectedValue}&term=&topic=`, { headers: { authorization: tokenKey } })
            .then(response => {
                changeTotalEntries(response.data.totalCount);
                console.log(response.data.result);
                setSData(response.data.result);
            })
            .catch(error => {
                console.log(error);
            })
    }, [x, selectedValue,deleteResponse]);



    // console.log(totalEntries)
    //to set start and end index of qustions per page
    let endIndex = x * selectedValue;
    const startIndex = endIndex - selectedValue;
    if (endIndex > totalEntries) endIndex = totalEntries;

    const searchQues = (e) => {
        axios.get(`http://admin.liveexamcenter.in/api/subjects?page=${x}&limit=${selectedValue}&term=${e.target.value}&topic=`, { headers: { authorization: tokenKey } })
            .then(response => {
                changeTotalEntries(response.data.totalCount);
                setSData(response.data.result);
            })
            .catch(error => {
                console.log(error);
            })
    }
    const topicHandler = (e) => {
        console.log(e.target.value)
        axios.get(`http://admin.liveexamcenter.in/api/subjects?page=${x}&limit=${selectedValue}&term=&topic=${e.target.value}`, { headers: { authorization: tokenKey } })
            .then(response => {
                changeTotalEntries(response.data.totalCount);
                setSData(response.data.result);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const deleteQueHandler = (Qid) => {
      
        const result = window.confirm("Are you sure you want to delete the question, this can not be rolled back?");
        if (result) {
            axios.delete(`http://admin.liveexamcenter.in/api/subjects/${Qid}`, { headers: { authorization: tokenKey } })
                .then(response => {
                    changeTotalEntries(response.data.totalCount);
                    setDelResonse(Qid)
                    document.getElementById("sDelete").selected=false;
                })
                .catch(error => {
                    console.log(error);
                })
        }

    }

    const SingleDelete = (e, index) => {
        if (e.target.checked) setCheckArr([...checkArr, index])
        else {
            document.getElementById("AllCheck").checked=false 
            const tempArr = checkArr.filter(item => item !== index);
            setCheckArr(tempArr)
            console.log(checkArr)
        }

    }
    const deleteSelected = (e) =>{
        checkArr.map((index)=>{
            axios.delete(`http://admin.liveexamcenter.in/api/subjects/${index}`, { headers: { authorization: tokenKey } })
            .then(response => {
               setCheckArr([])
                setDelResonse(e)
               document.getElementById("sCheck").checked = false;
            })
            .catch(error => {
                console.log(error);
            })
        })
    }
    
    const deleteAll = (e) =>{
        if(e.target.checked)
        {
            var ele=document.getElementsByName('subjectChk');  
            for(var i=0; i<ele.length; i++){  
                if(ele[i].type=='checkbox')  
                    ele[i].checked=true;  
            }
        let temp= sData.map((data)=>{
          
            return data._id
        })
        setCheckArr(temp)
        }
        else
        {
            var ele=document.getElementsByName('subjectChk');  
            for(var i=0; i<ele.length; i++){  
                if(ele[i].type=='checkbox')  
                    ele[i].checked=false;  
            }
            setCheckArr([])
        }
    }


    useEffect(() => {
        if (checkArr.length != 0)
            document.getElementById("sDelete").style.display = "block";
        else document.getElementById("sDelete").style.display = "none";
    }, [checkArr])

    console.log(checkArr)
    return (
        <div className>
            <div className='title-div'>
                <h3>Subjects
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
                                <input type="checkbox" id="AllCheck" onClick={(e)=>deleteAll(e)}/>
                            </td>
                            <td> Sr.No </td><td> Subject </td><td> Actions </td>
                            <td><button name='check' id="sDelete" style={{ display: "none" }} onClick={(e)=>deleteSelected(e)}>Delete</button></td>
                        </tr>
                        {sData && sData.map((subject, index) => {
                            return (
                                <tr key={index}>
                                    <td>  <input type={'checkbox'} name="subjectChk" value={index} id={'sCheck'} onClick={(e) => SingleDelete(e, subject._id)} /></td>
                                    <td>{index + 1}</td>
                                    <td>
                                        {subject.name}
                                    </td>
                                    <td>
                                        <button onClick={() => deleteQueHandler(subject._id)}>Delete</button>
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

export default Subject
