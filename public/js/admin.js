const deleteExam=(btn)=>{
    const examId= btn.parentNode.querySelector('[name=examId]').value;
    const csrf=btn.parentNode.querySelector('[name=_csrf]').value;

    const examElement=btn.closest('article')
    console.log(examId);
    fetch('/admin/examlist/delete/:'+ examId,{
        method:'Delete',
        headers:{
            'csrf-token':csrf
        }
    }).then(result=>{
        return result.json();
    }).then(data=>{
        examElement.parentNode.removeChild(examElement);
    }).catch(err=>{
        console.log(err);
    });
};