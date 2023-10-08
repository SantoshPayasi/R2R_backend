import { Request, Response, NextFunction } from "express";
export const validate = async (req: Request, res: Response, next: NextFunction) => {
  const { name, account, passowrd } = req.body;
  if (!name) res.status(400).json({ msg: "Please Enter your name" });
  if (String(name).length > 20)
    res.status(400).json({
      "msg": "Name length is to large.",
    });
  if(!account)
  res.status(400).json({
    "msg": "Please enter your email or phone",
  })
  if(!validateEmail(account) && !validateNumber(account))
  res.status(200).json(
    {
    "msg":"Please enter valid account or number"
    }
  )
  if(String(passowrd).length<6)
  res.status(400).json(
    {
    "msg":"Please enter a valid password which contains atleast 6 chatacters"
    }
    )

  next();

};


export const validateEmail = (account:string)=>{
    var RegExp = /^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/;
     return RegExp.test(account)
}

export const validateNumber =(account:string)=>{
    var RegExp = /^\+?([0-9]{4})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    return RegExp.test(account)
}





