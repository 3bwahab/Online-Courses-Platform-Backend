class appError extends Error{
    
        constructor(){
            super();
        }
        create(message,statusCode,stautsText){
            this.message=message;
            this.statusCode=statusCode;
            this.stautsText=stautsText;
            return this;
        }
    
}
module.exports=new appError();