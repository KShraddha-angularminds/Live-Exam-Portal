import React, { useState, useEffect } from 'react'
import axios from 'axios';
import {Link,useParams,useNavigate} from 'react-router-dom'

function EditQuestion() {
    const {Qid} = useParams();
    const navigate = useNavigate();
  
    const [queAPI, setQueAPI] = useState([]);
    const [subAPI, setSubAPI] = useState([]);
    const [topicAPI, setTopicAPI] = useState([]);
    const [isloading,setIsLoading] = useState(false)
   
    const tokenKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWRkMjgwYWU2ZDdkNzdjOGU0ZjY4ZjYiLCJfYWN0aXZlT3JnIjoiNjE5Y2U0YThlNTg2ODUxNDYxMGM4ZGE3IiwiaWF0IjoxNjQzNjkwNDc3LCJleHAiOjE2NDM3MzM2Nzd9.rvaDoA1OwjHgJjs85f52ENKfTRdqo7NlkrudyN-JkMQ"
    const [optionArr, setOptionArr] = useState([]);
    
    
    const [formData, setFormData] = useState( {
        subject: "",
        topic: "",
        type: "MULTIPLE CHOICE",
        questionText:'',
        DiffLevel: "easy",
        rightMarks: 1,
        wrongMarks: 0,
        options: null
       
    })
    useEffect(() => {
        axios.get(`http://admin.liveexamcenter.in/api/questions/${Qid}`, { headers: { authorization: tokenKey } })
            .then(response => {
                console.log(response.data)
                //setQidData({...response.data});
                setFormData({
                    ...formData, 
                    subject: response.data.subject._id,
                    topic: response.data.topic._id,
                    type: response.data.type,
                    questionText : response.data.questionText,
                    DiffLevel: response.data.diffLevel,
                    rightMarks: response.data.rightMarks,
                    wrongMarks: response.data.wrongMarks,

                })
                setOptionArr([...response.data.options])
                setIsLoading(true)
            })
            .catch(error => {
                console.log(error);
            })
    }, [Qid]);
   // isloading && console.log(QidData)

   
       //subject api call
        useEffect(() => {

            axios.get(`http://admin.liveexamcenter.in/api/subjects?page=1&limit=5&term=`, { headers: { authorization: tokenKey } })
                .then((res) => {
                  
                    setSubAPI(res.data.result)
                })
                .catch((err) => {
                    console.log(err)
                })
    
    
        }, [])
    //Read API for Topics
    useEffect(() => {

        axios.get(`http://admin.liveexamcenter.in/api/topics?page=1&limit=5&term=`, { headers: { authorization: tokenKey } })
            .then((res) => {
              
                setTopicAPI(res.data.result)
            })
            .catch((err) => {
                console.log(err)
            })


    }, [])

    // useEffect(()=>{
    //     //to deselect the option when question type changes
    //      setOptionArr(tempOptionArr);
        
    // },[formData.type])
    
    useEffect(()=>{
        //to add the option array to formdata
        setFormData({...formData, options:optionArr})
    },[optionArr])

    const onChangeHandler = (e) => {
        const ename = e.target.name;
        if(e.target.name=='rightMarks' || e.target.name=='wrongMarks')
        {
            setFormData({ ...formData, [ename]: parseInt(e.target.value) })
        } 
        else
        setFormData({ ...formData, [ename]: e.target.value })
    }


    function removeOption(index) {
       // 
        const tempArr= [...optionArr];
        tempArr.splice(index,1)
        setOptionArr(tempArr)
       
        
    }
    //console.log(optionArr)

    const changeOptions = (i,input) =>{
        setOptionArr(prev=> prev.map((option,ind)=>
            i==ind ? {...option, option: input} : option
        ))
       
    }
       isloading && console.log(formData)
    const SubmitForm =(e)=>{
        e.preventDefault();
        // let navigate = Navigate();
        axios.put(`http://admin.liveexamcenter.in/api/questions/${Qid}`,formData,{ headers: { authorization: tokenKey }})
        .then((res) => {
            console.log(res.data)
            navigate("/questions")
           // setTopicAPI(res.data.result)
        })
        .catch((err) => {
            console.log(err)
        })
        console.log(optionArr)
        console.log(formData)
        
     
        
    }

    const checkBoxOption =(i,e)=>{
        //To check option is checked or not and accordingly set value of iscorrect
       e.checked== true ? setOptionArr(prev=> prev.map((isCorrect,ind)=>
              i==ind ? {...isCorrect, isCorrect: true} : isCorrect
          )) : setOptionArr(prev=> prev.map((isCorrect,ind)=>
          i==ind ? {...isCorrect, isCorrect: false} : isCorrect
      ))

    }

    const radioBoxOption =(i,e)=>{
        //To check option is checked or not and accordingly set value of iscorrect
       e.checked== true ? setOptionArr(prev=> prev.map((isCorrect,ind)=>
              i==ind ? {...isCorrect, isCorrect: true} : {...isCorrect, isCorrect: false}
          )) : setOptionArr(prev=> prev.map((isCorrect,ind)=>
          i==ind ? {...isCorrect, isCorrect: false} : isCorrect
      ))

    }

    const newOption = () =>{
       const temp = [...optionArr , { isCorrect: false, option: ''}]
       setOptionArr(temp)
     
    }
 //   console.log("hello")
    //console.log(QidData.type)
   // console.log(QidData.diffLevel)
    
    return (
        <div>
            {isloading && 
            <div className='add-div'>
                <div className='add-header'>
                    <h3>Add question</h3>
                </div>
                <form onSubmit={SubmitForm} id='myForm'>
                    {/* middle part of add question page */}
                    <div className='add-main'>
                        {/* for select subject and topic */}
                        <div className='add-main-row'>
                            {/* for subject */}
                            <div style={{ flex: '1' }} className='add-main-row1-col1' >
                                <label>Select Subject</label><br />
                                <select className='add-select' name='subject' value={formData.subject} onChange={onChangeHandler} required>
                                    {subAPI && subAPI.map((subject, i) => {
                                        return <option key={i} value={subject._id}>{subject.name}</option>
                                    })}
                                </select>
                            </div>
                            {/* for topic */}
                            <div style={{ flex: '1' }} className='add-main-row1-col1'>
                                <label>Select Topic</label><br />
                                <select className='add-select' name='topic' value={formData.topic} onChange={onChangeHandler}>
                                     {/* <option value={QidData.topic && QidData.topic._id} >{QidData.topic && QidData.topic.name}</option>  */}
                                    {topicAPI && topicAPI.map((topic, i) => {
                                        return(topic.subject && topic.subject._id === formData.subject ?
                                            <option key={i} value={topic._id}>{topic.name}</option> : null)
                                    })}
                                </select>
                            </div>
                            {
                            }       </div>
                        {/* for question type, level and marks */}
                        <div className='add-main-row'>
                            {/* for question type and level of difficulty */}
                            <div style={{ flex: '1' }} className='add-main-row2-col1' >
                                {/* for Question type */}
                                <div style={{ flex: '1' }} className='row2-div'>
                                    <label>Question Type</label><br />
                                    <select className='add-select' name='Qtype' value={formData.type} onChange={onChangeHandler}>
                                        <option value={'MULTIPLE CHOICE'} >Multiple Choice</option>
                                        <option value={'MULTIPLE RESPONSE'}>Multiple Response</option>
                                        <option value={'FILL IN BLANKS'}>Fill in the blanks</option>
                                    </select>
                                </div>
                                {/* for Difficulty Level */}
                                <div style={{ flex: '1' }} className='add-main-row2-half row2-div'>
                                    <label>Difficulty Level</label><br />
                                    <select className='add-select' name='DiffLevel' value={formData.DiffLevel} onChange={onChangeHandler}>
                                        <option value={'easy'} >Easy</option>
                                        <option value={'medium'}>Medium</option>
                                        <option value={'hard'}>Hard</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ flex: '1' }} className='add-main-row2-col1 '>
                                <div style={{ flex: '1' }} >
                                    <label>Right Marks</label><br />
                                    <input type={'text'} name='rightMarks' className='add-input' value={formData.rightMarks} onChange={onChangeHandler} />
                                </div>
                                <div style={{ flex: '1' }} className='add-main-row2-half'>
                                    <label>Wrong Marks</label>
                                    <input type={'text'} name='wrongMarks' className='add-input' value={formData.wrongMarks} onChange={onChangeHandler} />
                                </div>
                            </div>
                        </div>
                        <div className='questionText-div'>
                            <label>Question</label>
                            <textarea rows={5} style={{ width: '100%', borderRadius: '4px', border: '1px solid lightgrey' }} name='questionText' defaultValue={formData.questionText} onChange={onChangeHandler} />
                        </div>
                        <div>

                            Options
                            {optionArr.map((i, val) => {
                                return (
                                    formData.type == 'MULTIPLE RESPONSE' ?
                                        <div key={val}>
                                            <div className='options-row' >
                                                <div className='options-col left'>
                                                    <input type={'checkbox'} name={'isCorrect'} id={`radio-1`}   name='isCorrect' checked={i.isCorrect} onChange={(e)=>checkBoxOption(val,e.target)} /> Option {val+1}
                                                </div>
                                                <textarea rows={4} id={`textarea-1`} className='options-col right' value={i.option} style={{ border: 'none', paddingLeft: '10px' }} name={`option`} onChange={(e)=>changeOptions(val,e.target.value)} />
                                            </div>
                                            <button type='button' className='option-btm-btn' style={{ marginTop: '3px', marginRight: '10px', backgroundColor: 'white', border: 'none' }}> Remove Option</button>|
                                            <button type='button' className='option-btm-btn' style={{ marginTop: '3px', marginLeft: '10px', backgroundColor: 'white', border: 'none' }} >  Enable Rich Text Editor</button>
                                        </div> :
                                        <div key={val}>
                                            <div className='options-row' >
                                                <div className='options-col left'>
                                                    <input type={'radio'} name={'isCorrect'} id={`radio-1`}  name='isCorrect' checked={i.isCorrect} onChange={(e)=>radioBoxOption(val,e.target)}/> Option {val+1}
                                                </div>
                                                <textarea rows={4} id={`textarea-1`} className='options-col right' value={i.option} style={{ border: 'none', paddingLeft: '10px' }} name={`option`} onChange={(e)=>changeOptions(val,e.target.value)} />
 
                                            </div>
                                            <button type='button' className='option-btm-btn' style={{ marginTop: '3px', marginRight: '10px', backgroundColor: 'white', border: 'none' }} onClick={() => removeOption(val)}> Remove Option</button>|
                                            <button type='button' className='option-btm-btn' style={{ marginTop: '3px', marginLeft: '10px', backgroundColor: 'white', border: 'none' }} >  Enable Rich Text Editor</button>
                                        </div>
                                )
                            })}

                        </div>
                        <button type='button' onClick={newOption}>+Add Option</button>
                    </div>
                    <div className='add-footer'>
                        <button className='btn btn-primary' style={{ padding: '10px 15px 10px 15px', fontSize: '20px' }} type='submit'>Update question</button>
                        <Link to='/questions'>
                        <button type='button' className='btn btn-light' style={{ marginLeft: '30px', fontSize: '20px', border: 'none', outline: 'none', padding: '6px 10px 6px 10px' }}>Cancel</button>
                        </Link>
                    </div>
                </form>
            </div>
}
        </div>
    )
}

export default EditQuestion
