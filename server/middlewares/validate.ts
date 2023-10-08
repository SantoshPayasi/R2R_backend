import { Request, Response, NextFunction } from "express";
export const validate = async (req: Request, res: Response, next: NextFunction) => {
  const { name, account, passowrd } = req.body;
  let errorArray = [];
  if (!name) errorArray.push("Please enter your valid name")
  if (String(name).length > 20){ errorArray.push("Please enter valid name")}
  if(!account) { errorArray.push("Please enter your email or phone")}
  
  if(!validateEmail(account) && !validateNumber(account))
  {
    errorArray.push("Please enter valid account or number")
  }
  
  if(String(passowrd).length<6){  errorArray.push("Please enter a valid password which contains atleast 6 chatacters")}
  
  if(errorArray.length>0){
    res.status(400).send(
      {
      status:"Invaid Request",
      error:errorArray
      }
    )
  }
  else{
    next();
  }
};


export const validateEmail = (account:string)=>{
    var RegExp = /^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/;
     return RegExp.test(account)
}

export const validateNumber =(account:string)=>{
    var RegExp = /^\+?([0-9]{4})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    return RegExp.test(account)
}





