exports.get404=(req,res,next)=>{
    res.status(404).render('404',{
        title:'Page Not Found',
        path:'/404',
    });
};

exports.get500=(req,res,next)=>{
    res.status(500).render('500',{
        title:'Error',
        path:'/500',
    });
    
};