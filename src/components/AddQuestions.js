import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
function AddQuestions() {

    const [subAPI, setSubAPI] = useState([]);
    const [topicAPI, setTopicAPI] = useState([]);
    const [richEditorQ, setRichEditorQ] = useState("Enable")
    const [richEditor, setRichEditor] = useState("Enable")
    const [validate, setValidate] = useState({})
    const [validateOpt,setValidateOpt] = useState({})
    const [validateSameQ,setValidateSameQ] = useState({})
    let a=''
    // const [optIndex, setOptIndex] = useState()
    const tempOptionArr = [{
        isCorrect: false,
        option: '',
        richTextEditor: false
    },
    {
        isCorrect: false,
        option: '',
        richTextEditor: false
    },
    {
        isCorrect: false,
        option: '',
        richTextEditor: false
    },
    {
        isCorrect: false,
        option: '',
        richTextEditor: false
    }
    ]
    const tokenKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWRkMjgwYWU2ZDdkNzdjOGU0ZjY4ZjYiLCJfYWN0aXZlT3JnIjoiNjE5Y2U0YThlNTg2ODUxNDYxMGM4ZGE3IiwiaWF0IjoxNjQ0MjkyNzc4LCJleHAiOjE2NDQzMzU5Nzh9.GQmj1paG6Eaj-3eed0mL-5Nv-SshEbS_N6qVIKO9Xe0"
    const [optionArr, setOptionArr] = useState(tempOptionArr);
    const tempformData =
    {
        subject: "",
        topic: "",
        Qtype: "MULTIPLE CHOICE",
        questionText: '',
        DiffLevel: "easy",
        rightMarks: 1,
        wrongMarks: 0,
        options: null

    }

    const [formData, setFormData] = useState(tempformData)
    //Read API For subject
    useEffect(() => {
        axios.get(`http://admin.liveexamcenter.in/api/subjects?term=`, { headers: { authorization: tokenKey } })
            .then(response => {
                console.log(response.data.result)
                setSubAPI(response.data.result);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    //Read API for Topics
    useEffect(() => {

        axios.get(`http://admin.liveexamcenter.in/api/topics?term=`, { headers: { authorization: tokenKey } })
            .then((res) => {
                console.log(res.data.result)
                setTopicAPI(res.data.result)
            })
            .catch((err) => {
                console.log(err)
            })


    }, [])

    useEffect(() => {
        //to deselect the option when question type changes
        setOptionArr(tempOptionArr);

    }, [formData.Qtype])

    useEffect(() => {
        //to add the option array to formdata
        setFormData({ ...formData, options: optionArr })
    }, [optionArr])

    const onChangeHandler = (e) => {
        const ename = e.target.name;
        console.log(e)
        console.log(e.target.name)
        if (e.target.name == 'rightMarks' || e.target.name == 'wrongMarks') {
            setFormData({ ...formData, [ename]: parseInt(e.target.value) })
        }
        else
            setFormData({ ...formData, [ename]: e.target.value })

        if (e.target.value == '') {

            setValidate({ ...validate, [ename]: `${ename} is Required` })
        }
        else {
            setValidate({ ...validate, [ename]: '' })
        }
    }
    

    function removeOption(index) {
       
        console.log(index)
        const tempArr = [...optionArr];
        tempArr.splice(index, 1)
        setOptionArr(tempArr)


    }
    //console.log(optionArr)

    const changeOptions = (i, input) => {
        setOptionArr(prev => prev.map((option, ind) =>
            i == ind ? { ...option, option: input } : option
        ))
      
        if(input=='')
        {
          setValidateOpt({...validateOpt, [i]: {option:"option is required"}})
        }
        else
        {
            setValidateOpt({...validateOpt, [i] :''})
        }
        // optionArr.map((index)=>{
        //   return  index.option == input ? setValidateSameQ({...validateSameQ, sameQue :'Duplicate options are not allowed'}): setValidateSameQ(validateSameQ)
        // })
    }
    
    const SubmitForm = (e) => {
        e.preventDefault();
        axios.post('http://admin.liveexamcenter.in/api/questions', formData, { headers: { authorization: tokenKey } })
            .then((res) => {
                console.log(res.data)
                // setTopicAPI(res.data.result)
            })
            .catch((err) => {
                console.log(err)
            })
        console.log(optionArr)
        console.log(formData)
        setFormData(tempformData)

    }

    const checkBoxOption = (i, e) => {
        //To check option is checked or not and accordingly set value of iscorrect
        e.checked == true ? setOptionArr(prev => prev.map((isCorrect, ind) =>
            i == ind ? { ...isCorrect, isCorrect: true } : isCorrect
        )) : setOptionArr(prev => prev.map((isCorrect, ind) =>
            i == ind ? { ...isCorrect, isCorrect: false } : isCorrect
        ))

    }

    const radioBoxOption = (i, e) => {
        //To check option is checked or not and accordingly set value of iscorrect
        e.checked == true ? setOptionArr(prev => prev.map((isCorrect, ind) =>
            i == ind ? { ...isCorrect, isCorrect: true } : { ...isCorrect, isCorrect: false }
        )) : setOptionArr(prev => prev.map((isCorrect, ind) =>
            i == ind ? { ...isCorrect, isCorrect: false } : isCorrect
        ))

    }

    const newOption = () => {
        const temp = [...optionArr, { isCorrect: false, option: '' }]
        setOptionArr(temp)

    }

    const changeRichTextQ = () => {
        richEditorQ == "Enable" ? setRichEditorQ("Disable") : setRichEditorQ("Enable");
    }
    const changeRichText = (i) => {

        // setOptIndex(val)
        richEditor == "Enable" ? setRichEditor("Disable") : setRichEditor("Enable");
        setOptionArr((prev) =>
            prev.map((opt, j) => (i === j ? { ...opt, richTextEditor: opt.richTextEditor == true ? false : true } : opt))
        );

    }
    const onChangeHandlerEditor = (e) => {
        setFormData({ ...formData, questionText: e })
        console.log(e)
        if (e == '<p><br></p>') {
          
            setValidate({ ...validate, questionText: `Question Text is Required` })
        }
        else {
            setValidate({ ...validate, questionText: '' })
        }

    }
    const onChangeHandlerEditorOp = (e, i) => {
        console.log(e)
        setOptionArr((prev) =>
            prev.map((opt, j) => (i === j ? { ...opt, option: e } : opt))
        );
        if(e=='<p><br></p>')
        {
          setValidateOpt({...validateOpt, [i]: {option:"option is required"}})
        }
        else
        {
            setValidateOpt({...validateOpt, [i] :''})
        } 
    }
    // console.log(validate)
    // console.log(formData)
    return (
        <div>
            <div className='add-div'>
                <div className='add-header'>
                    <h3>Add question</h3>
                </div>
                {/* <pre>{JSON.stringify(formData, undefined, 2)}</pre> */}
                <form onSubmit={SubmitForm} id='myForm'>
                    {/* middle part of add question page */}
                    <div className='add-main'>
                        {/* for select subject and topic */}
                        <div className='add-main-row'>
                            {/* for subject */}
                            <div style={{ flex: '1' }} className='add-main-row1-col1' >
                                <label>Select Subject</label><br />
                                <select className='add-select' name='subject' onChange={onChangeHandler} required>
                                    <option value=''>Search Subject...</option>
                                    {subAPI && subAPI.map((subject, i) => {
                                        return <option key={i} value={subject._id}>{subject.name}</option>
                                    })}
                                </select>
                                <span style={{ color: "red" }}>{validate.subject}</span>
                            </div>
                            {/* for topic */}
                            <div style={{ flex: '1' }} className='add-main-row1-col1'>
                                <label>Select Topic</label><br />
                                <select className='add-select' name='topic' onChange={onChangeHandler}>
                                    <option value='' >Search Topic...</option>

                                    {topicAPI && topicAPI.map((topic, i) => {
                                        return (topic.subject && topic.subject._id === formData.subject ?
                                            <option key={i} value={topic._id}>{topic.name}</option> : null)
                                    })}
                                </select>
                                <span style={{ color: "red" }}>{validate.topic}</span>
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
                                    <select className='add-select' name='Qtype' defaultValue={formData.Qtype} onChange={onChangeHandler}>
                                        <option value={'MULTIPLE CHOICE'} >Multiple Choice</option>
                                        <option value={'MULTIPLE RESPONSE'}>Multiple Response</option>
                                        <option value={'FILL IN BLANKS'}>Fill in the blanks</option>
                                    </select>
                                </div>
                                {/* for Difficulty Level */}
                                <div style={{ flex: '1' }} className='add-main-row2-half row2-div'>
                                    <label>Difficulty Level</label><br />
                                    <select className='add-select' name='DiffLevel' defaultValue={formData.DiffLevel} onChange={onChangeHandler}>
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
                                    <span style={{ color: "red" }}>{validate.rightMarks}</span>
                                </div>
                                <div style={{ flex: '1' }} className='add-main-row2-half'>
                                    <label>Wrong Marks</label>
                                    <input type={'text'} name='wrongMarks' className='add-input' value={formData.wrongMarks} onChange={onChangeHandler} />
                                    <span style={{ color: "red" }}>{validate.wrongMarks}</span>
                                </div>
                            </div>
                        </div>
                        <div className='questionText-div'>
                            <label>Question</label>
                            {richEditorQ == "Enable" ?
                                <textarea rows={5} style={{ width: '100%', borderRadius: '4px', border: '1px solid lightgrey' }} name='questionText' value={formData.questionText} onChange={onChangeHandler} />
                                :

                                <ReactQuill

                                    onChange={onChangeHandlerEditor}
                                    value={formData.questionText}

                                />

                            }

                            <button type='button' className='option-btm-btn' style={{ marginTop: '3px', marginLeft: '10px', backgroundColor: 'white', border: 'none' }} onClick={() => changeRichTextQ()}>  {richEditorQ} Rich Text Editor</button>
                        </div>
                        <span style={{ color: "red" }}>{validate.questionText}</span>
                        <div>

                            Options
                            {optionArr.map((i, val) => {
                                return (
                                    <div key={val}>
                                        {
                                            
                                            formData.Qtype == 'MULTIPLE RESPONSE' ?
                                                <div>
                                                    <div className='options-row' >
                                                        <div className='options-col left'>
                                                            <input type={'checkbox'} name={'isCorrect'} id={`radio-1`} name='isCorrect' checked={i.isCorrect} onChange={(e) => checkBoxOption(val, e.target)} /> Option {val + 1}
                                                        </div>
                                                        {
                                                            i.richTextEditor == false ?
                                                                <textarea rows={4} id={`textarea-1`} className='options-col right' value={i.option} style={{ border: 'none', paddingLeft: '10px' }} name={`option`} onChange={(e) => changeOptions(val, e.target.value)} />
                                                                :
                                                                <ReactQuill
                                                                    onChange={(e) => onChangeHandlerEditorOp(e, val)}
                                                                    value={i.option}
                                                                />
                                                        }
                                                    </div>
                                                    <button type='button' className='option-btm-btn' style={{ marginTop: '3px', marginRight: '10px', backgroundColor: 'white', border: 'none' }} > Remove Option</button>|
                                                    <button type='button' className='option-btm-btn' style={{ marginTop: '3px', marginLeft: '10px', backgroundColor: 'white', border: 'none' }} onClick={() => changeRichText(val)}>  {richEditor} Rich Text Editor</button>
                                                    {Object.keys(validateOpt).map((obj,i)=>{
                                                     return i==val ? <span style={{ color: "red" }}>{validateOpt[obj].option}</span> :null
                                                   })}
                                                </div> :
                                                <div>
                                                    <div className='options-row' >
                                                        <div className='options-col left'>
                                                            <input type={'radio'} name={'isCorrect'} id={`radio-1`} name='isCorrect' checked={i.isCorrect} onChange={(e) => radioBoxOption(val, e.target)} /> Option {val + 1}
                                                        </div>
                                                        {
                                                            i.richTextEditor == false ?
                                                                <textarea rows={4} id={`textarea-1`} className='options-col right' value={i.option} style={{ border: 'none', paddingLeft: '10px' }} name={`option`} onChange={(e) => changeOptions(val, e.target.value)} />
                                                                :
                                                                <ReactQuill
                                                                    onChange={(e) => onChangeHandlerEditorOp(e, val)}
                                                                    value={i.option}
                                                                />
                                                        }
                                                    </div>
                                                    <button type='button' className='option-btm-btn' style={{ marginTop: '3px', marginRight: '10px', backgroundColor: 'white', border: 'none' }} onClick={() => removeOption(val)}> Remove Option</button>|
                                                    <button type='button' className='option-btm-btn' style={{ marginTop: '3px', marginLeft: '10px', backgroundColor: 'white', border: 'none' }} onClick={() => changeRichText(val)}>  {richEditor} Rich Text Editor</button>
                                                  
                                                 
                                                   {Object.keys(validateOpt).map((obj,i)=>{
                                                     return i==val ? <span style={{ color: "red" }}>{validateOpt[obj].option}</span> :null
                                                   })}
                                                </div>
                                                
                                        }   </div>
                                )
                            })}

                        </div>
                        <button type='button' onClick={newOption}>+Add Option</button>
                        <span style={{ color: "red" }}>{validateSameQ.sameQue}</span>
                    </div>
                    <div className='add-footer'>
                        <button className='btn btn-primary' style={{ padding: '10px 15px 10px 15px', fontSize: '20px' }} type='submit'>Save question</button>
                        <Link to='/questions'>
                            <button type='button' className='btn btn-light' style={{ marginLeft: '30px', fontSize: '20px', border: 'none', outline: 'none', padding: '6px 10px 6px 10px' }}>Cancel</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddQuestions
