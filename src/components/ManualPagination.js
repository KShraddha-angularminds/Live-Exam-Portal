// import React, { useEffect } from 'react';
// import { useState } from 'react/cjs/react.development';

// function ManualPagination({ currentPage, entriesPerPage, prevPage, nextPage, changeX }) {
//     const [sliceValue, setSliceValue] = useState(0);
//     console.log(currentPage);
    // const renderQuestions = [];
//     let arr = [];
//     let property;
    // for (let i = 1; i <= Math.ceil(243 / entriesPerPage); i++) {
    //     renderQuestions.push(i);
    // }

//     const activePage = (no) => {
//         document.getElementById(no).classList.add('active-page');
//         property = document.getElementById(no);
//         property.classList.add('active-page');
//         changeX(no);
//     }

//     useEffect(()=>{
//         var all_pages = document.getElementsByClassName("pages");
//         for (let i = 0; i < all_pages.length; ++i) {
//             if (all_pages[i].classList.contains("color") && all_pages[x] != property) {
//               all_pages[x].classList.remove("color");
//             } //end if
//           }
//     })

//     useEffect(() => {
//         setSliceValue(currentPage >= 6 ? currentPage - 6 : 0);
//     }, [currentPage]);
    
//     console.log(sliceValue);
//     arr = renderQuestions.slice(sliceValue, sliceValue + 10);

//     return (
//         <div>
//             <nav aria-label="Page navigation example">
//                 <ul className="pagination justify-content-center">
//                     {<li className="page-item pages"><a className="page-link" onClick={prevPage} href="#">Previous</a></li>}
//                     {/* <li className="page-item"><a className="page-link" onClick={()=>changeX(0)} href="#">1</a></li>
//                    <li className="page-item"><a className="page-link" href="#">...</a></li> */}

//                     {arr.map((no, i) => {
//                         return <li key={no} className="page-item" >
//                             <a className="page-link" id={no} onClick={() => activePage(no)} href="#">
//                                 {no}
//                             </a>
//                         </li>
//                     })}
//                     {/* <li className="page-item"><a className="page-link" href="#">...</a></li>
//                     <li className="page-item"><a className="page-link" onClick={()=>changeX(192)} href="#">193</a></li> */}
//                     {<li className="page-item"><a className="page-link" onClick={nextPage} href="#">Next</a></li>}
//                 </ul>
//             </nav>
//         </div>
//     )
// }

// export default ManualPagination;