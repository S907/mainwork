const jwt = require('jsonwebtoken');

class userBlogAuth {
    
    async userBlogAuth(req, res, next) {
        try {
            if(req.cookies && req.cookies.userBlogToken) {
                console.log('1',req.cookies);
                jwt.verify(req.cookies.userBlogToken, 'M3S3CR3PKY5', (err, data) => {
                    if(!err){
                        req.user = data;
                        console.log('Req.user ===>', req.user);
                        //console.log(req.user);
                        next();
                    } else {
                        console.log(err);
                    }
                })
            }else {
                next();
            }
        }catch(err) {
            // console.log(err);
            throw err;
        }
    }
}

module.exports = new userBlogAuth();