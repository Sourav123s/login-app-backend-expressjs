const {user:User}=require('../models');
const jwt=require('jsonwebtoken')
const {hashPassword,verfiPassword}=require('../service/password')

async function addUser(req,res){
    try {
        const rb=req.body;
        console.log(rb);

        let check_user=await User.findOne({
            where:{
                email:rb.email
            }
        })

        if(check_user){
            return res.json({
                success: false,
                data: check_user.Email,//this need to send by the user when it redirect to check password page
                message: "Student Already Exists with this email",
            })  
        }
        let Password = await hashPassword(rb.password);

        let createUser=await User.create({
            firstName: rb.firstName,
            lastName: rb.lastName,
            email: rb.email,
            password: Password
        })
        return res.json({
            success: true,
            message: "Student created successfully ",
            // createUser,
        })
        
    } catch (error) {
        console.log(error);
    }
}
function verifyjwtToken(req, res, next) {
    try {
        if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            const token = req.headers.authorization.split(' ')[1];

            jwt.verify(token, 'secrect_key', (err, payload) => {
                if (err) {
                    throw err;
                }
                req.user = payload;
                next();
            });
        } else {
            return res.status(401).send('Unauthorize');
        }
    } catch (error) {
        console.log(error);
    }
}

async function Login(req,res){
    try {
        const rb = req.body;
        let user = await User.findOne({
            where: {
                email: rb.email
            }
        })

        if (!user) {
            return res.json({
                success: false,
                message: 'No user are found with this email ',//Redirect the user to create new profile 
            })
        }
        let Password = user.password
        let chechkPassword = await verfiPassword(rb.password, Password);

        if(chechkPassword){
            delete user.dataValues.password;
            let token=jwt.sign({
                id:user.id,
                firstName: user.password,
                lastName:user.lastName,
                email:user.email
            },
                'secrect_key',
                { expiresIn: '3h' }
            );
            return res.json({
                success: true,
                message: "Login In sucessfully",
                details: { user, token },
            })

        }else{
            return res.json({
                success: false,
                message: "wrong password ",
            });

        }
        
    } catch (error) {
        console.log(error);
    }
}
async function userProfile(req, res) {
    try {
        const rb = req.user;

        const user = await User.findOne({
            where: {
                id: rb.id
            },
            attribute: ['id','firstName','lastName','email']
        })

        if (user) {
            return res.json({
                success: true,
                message: 'User Sucessfully found ',
                data: user
            })
        } else {
            return res.json({
                success: false,
                message: 'User not found ',

            })
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports={
    addUser,
    Login,
    verifyjwtToken,
    userProfile
}