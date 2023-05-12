const jwt = require('jsonwebtoken');
const adminModel = require('../model/admin.model');
const userModel = require('../model/userModel.model');
const userCategoryModel = require('../model/category.model');
const userBlogPostModel = require('../model/blogPost.model');
const commentDataModel = require('../model/comment.model');
const bcrypt = require('bcryptjs');
const blogPostModel = require('../model/blogPost.model');
const nodemailer = require('nodemailer');





class User {
  /**
   * @method: userAuth
   * @desc: auth function
   */

  async userBlogAuth(req, res, next) {
    try {
      if (req.user) {
        next();
      } else {
        res.redirect("/user-login");
      }
    } catch (error) {
      throw error;
    }
  }







   /**
   *
   * @method:  showIndexPage
   * @desc: showing index page with all details
   */

    async showIndexPage(req,res){
      try {
  
        const options = {
          page: 1,
          limit: 3,
        };
        
        let categoryData = await userCategoryModel.find({});
        let unifiedData= await userBlogPostModel.aggregate([
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$status", true],
                    
                  }
                ]
              }
            }
          },
          {
            $lookup: {
              from: "user-categories",
              let: {
                categoryDetail: "$category",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ["$_id", "$$categoryDetail"],
                        }
                      ]
                    }
                  }
                },
                {
                  $project: {
                    createdAt: 0,
                    updatedAt: 0,
                  },
                }
              ],
              as: "categoryList",
            }
          },
          {
            $unwind: {
              path: "$categoryList",
            }
          },
          {
            $project: {
              
              updatedAt: 0,
            }
          },
  
  
          {
            $lookup: {
              from: "user-models",
              let: {
                userDetail: "$userId",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ["$_id", "$$userDetail"]
                        }
                      ]
                    }
                  }
                }
              ],
              as: "userList",
            }
          },
          {
            $unwind: {
              path: "$userList",
            }
          },
        ])
        
        res.render('users/id',{
          title:'ID || Page',
          user: req.user,
          data: unifiedData,
          slug: unifiedData.slug,
          categoryDetails: categoryData
          })
        
          
  
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  






  
  /**
   * @method: showContactPage
   * @desc: to show user contact page
   */
  async showContactPage(req,res){
    try {
      res.render('users/user-contact',{
        title: 'User || Contact',
        user: req.user
      })
    } catch (error) {
      
    }
  }

  

  async showUserLoginPage(req, res) {
    try {
      res.render("users/login", {
        title: "Blog || Login",
        user: req.user
      });
    } catch (error) {
      throw error;
    }
  }

  async showUserRegister(req, res) {
    try {
      res.render("users/registration", {
        title: "Blog || Register",
        user: req.user
      });
    } catch (error) {
      throw error;
    }
  }

  
  /**
   *
   * @method:  getBlogUserPage
   * @desc: Show post blog user form
   */

  async getBlogUserPage(req, res) {
    try {
      
      let categoryData = await userCategoryModel.find({})
      res.render("users/user-post", {
        title: "User || Blog || Post",
        user: req.user,
        categoryData
      });
    } catch (error) {
      throw error;
    }
  }

  

  /**
   *
   * @method:  postUserRegister
   * @desc: post register form
   */

  async postUserRegister(req, res) {
    try {
      if (req.body.password) {
        req.body.password = bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10)
        );
        req.body.firstName = req.body.firstName.trim();
        req.body.lastName = req.body.lastName.trim();
        req.body.email = req.body.email.trim();
        req.body.password = req.body.password.trim();
        req.body.profilePicture = req.file.filename;
        let registerData = await userModel.create(req.body);
        if (registerData && registerData._id) {
          res.redirect("/user-login");
        } else {
          res.redirect("/user-register");
        }
      } else {
        res.redirect("/user-register");
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @method:  postLoginForm
   * @desc: post login form
   */

  async postLoginForm(req, res) {
    try {
      let isUserExists = await userModel.findOne({
        email: req.body.email,
      });

      if (!req.body.password || !req.body.email) {
        res.redirect("/user-page");
      } else {
        if (isUserExists) {
          const hashPassword = isUserExists.password;
          if (bcrypt.compareSync(req.body.password, hashPassword)) {
            const token = jwt.sign(
              {
                id: isUserExists._id,
                email: isUserExists.email,
              },
              "M3S3CR3PKY5",
              { expiresIn: "23hr" }
            );
            res.cookie("userBlogToken", token);
           

            res.redirect("/user-blog");
          } else {
            console.log("Not working function postLoginForm");
            
          }
        } else {
          console.log("Email does not exits");
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @method:  postBlogForm
   * @desc: To post blog form
   */
  async postBlogForm(req, res) {
    try {
      req.body.slug = req.body.title.trim().replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "_").toLowerCase();
      req.body.userId = req.user.id;

      req.body.image = req.file.filename;
      let postData = await userBlogPostModel.create(req.body);
      if(postData && postData._id){
        res.redirect('/user-blog');
      }else{
        console.log('Data submisson failed');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @method:  showUserBlogtable
   * @desc: post blog user form
   */

   async showUserBlogtable(req,res){
    try {
      
      let aggregationData = await userBlogPostModel.aggregate([
        {
          $lookup: {
            from: "user-categories",
            let: {
              categoryDetail: "$category",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$_id", "$$categoryDetail"],
                      }
                    ]
                  }
                }
              },
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0,
                },
              }
            ],
            as: "categoryList",
          }
        },
        {
          $unwind: {
            path: "$categoryList",
          }
        },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
          }
        },


        {
          $lookup: {
            from: "user-models",
            let: {
              userDetail: "$userId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$_id", "$$userDetail"]
                      }
                    ]
                  }
                }
              }
            ],
            as: "userList",
          }
        },
        {
          $unwind: {
            path: "$userList",
          }
        },
      ]);
      
      
        res.render('users/user-blog-table',{
            title:'Blog || Table',
            user:req.user,
            response :aggregationData
        })
    } catch (error) {
        throw error;
    }
  }





 


 

  /**
   *
   * @method:  viewPostPage
   * @desc: view individual post
   */

  async viewPostPage(req,res){
    try {
      
      let newaggregationData = await commentDataModel.aggregate([
        //comment lookup
        {
          $lookup: {
            from: "post-blogs",
            let: {
              postDetails: "$post",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$_id", "$$postDetails"],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  updatedAt: 0,
                },
              },

              //category lookup
              {
                $lookup: {
                  from: "user-categories",
                  let: {
                    categoryDetail: "$category",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            {
                              $eq: ["$_id", "$$categoryDetail"],
                            },
                          ],
                        },
                      },
                    },
                    {
                      $project: {
                        createdAt: 0,
                        updatedAt: 0,
                      },
                    },
                  ],
                  as: "categoryList",
                },
              },
              {
                $unwind: {
                  path: "$categoryList",
                },
              },
              //category lookup end

              //user lookup
              {
                $lookup: {
                  from: "user-models",
                  let: {
                    userDetail: "$userId",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            {
                              $eq: ["$_id", "$$userDetail"]
                            }
                          ]
                        }
                      }
                    }
                  ],
                  as: "userList",
                }
              },
              {
                $unwind: {
                  path: "$userList",
                }
              }
              //user lookup end
              
            ],
            as: "postList",
          },
        },
        {
          $unwind: {
            path: "$postList",
          },
        },
        {
          $project: {
            updatedAt: 0,
          },
        },
      ]);
      
     
        res.render('users/viewpost',{
         title: 'View || Post',
         user: req.user,
         displayData: newaggregationData,
       
       });

    


      } catch (error) {
    
      throw error;
    }
  }


  /**
   * 
   * @method sendMail 
   * @desc to send mail
   *  
   */

  async sendMail(req,res){
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "your_test_email",
            pass: "your_secret_key"
        }
    });
    let mailOptions = {
        from: 'no-reply@souvik.com',
        to: 'devsou94@gmail.com,souvikghosh146@gmail.com',
        subject: "Query From Sg's Blog",
        text: `Greetings From ${req.body.name}
        Query - ${req.body.message}
        Email - ${req.body.email}
        Contact - ${req.body.contact}`
    };
    transporter.sendMail(mailOptions);
    res.redirect('/contact');
    } catch (error) {
      throw error;
      
    }
  }

  /**
   * 
   * @method sendComment 
   * @desc to send mail
   *  
   */

  async sendComment(req,res){
    try {
      req.body.post= req.body.post;
      req.body.name= req.body.name;
      req.body.email= req.body.email;
      req.body.comment= req.body.comment;
      
      let saveCommentData = await commentDataModel.create(req.body);
    if(saveCommentData && saveCommentData._id){
      res.redirect(`view-post/${req.body.slug}`);
    }else{
      console.log('Comment not added');
    }
    } catch (error) {
        throw error;    }
  }


  /**
   * 
   * @method managePost 
   * @desc to send mail
   *  
   */

  async managePost(req,res){
    try {
      res.render('users/managepost',{
        title: 'Post || Table',
        user: req.user
      })
    } catch (error) {
      throw error;
    }
  }

  // Logout
  async userLogout(req, res) {
    try {
      res.clearCookie("userBlogToken");
      res.redirect("/");
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new User();