const adminModel=require('../model/admin.model');
const loggedInUserModel = require('../model/user.model');
const blogModel = require('../model/blog.model');
const faqModel = require('../model/faq.model');
const feedBackModel = require('../model/feedback.model');
const contactModel = require('../model/contact.model');
const userCategoryModel = require('../model/category.model');
const userblogModel = require('../model/blogPost.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const feedbackModel = require('../model/feedback.model');
const frontUserModel = require('../model/userModel.model');
const userCommentData = require('../model/comment.model');

class AdminController{



    /**
      * @method userAuth
      * @description To authenticate users
      */
     async userAuth(req, res, next) {
        try {
            let user = req.user;
           
            if (user) {
                
                next();
            } else {
                res.redirect('/admin/login');
            }
        } catch (err) {
            throw err;
        }
    }

    /**
     * 
     * @method: showIndexPAge 
     * @desc: Rendering login page
     */
    async showIndexPage(req,res){
    try {
        res.render('admin/login',{
            title: 'Sb Admin Panel login',
            user: req.user
        })
        } catch (error) {
        
        throw(error)
        }
    }

    


    /**
     * @method: showAdminTemplate
     * @desc: to render admin template
     */

    async showAdminTemplate(req,res){
        try {
            let fetchUserDetails = await loggedInUserModel.find({isDeleted:false});
            
            res.render('admin/template',{
                title:'Admin-template',
                userData: fetchUserDetails,
                user: req.user
            })
        } catch (error) {
            console.log(error);
        }
    }


    /**
     * @method: showRegistrationPage
     * @desc: to render regsitration page
     */
    async showRegistrationPage(req,res){
        try {
            res.render('admin/register',{
                title: 'Registration'
            })
        } catch (error) {
            throw error;
        }
    }

     /**
     * @method: submitRegistrationpage
     * @desc: to submit regsitration page
     */

    async submitRegistrationpage(req,res){
        try {
            req.body.firstName = req.body.firstName.trim();
            req.body.lastName = req.body.lastName.trim();
            req.body.email = req.body.email.trim();
            req.body.password = req.body.password.trim();
      
            //Checking if the fields are blank or not
            if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
             
              res.redirect('/admin/register');
            }
      
            //Checking if email already exists
            let isEmailExists = await adminModel.find({ email: req.body.email });
      
            if (!isEmailExists.length) {
                req.body.image = req.file.filename
              req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
      
              let Data = await adminModel.create(req.body);
              req.body.fullName = `${req.body.firstName} ${req.body.lastName}`;
      
              //Checking to see if Data is Saved
              if (Data && Data._id) {
                
                res.redirect('/admin/login');
              } else {
                
                res.redirect('/admin/register');
              }
              console.log(Data);
            } else {
              
              res.redirect('/admin/register');
            }
      
          } catch (err) {
            throw err;
          }
        
    }




     /**
     * @method: signInAdmin
     * @desc: to signIn to dashboard page
     */

      async signInAdmin(req,res){
        
        
        try {
            
            req.body.email = req.body.email.trim();
            req.body.password = req.body.password.trim();

            

            let isUserExists = await adminModel.findOne({
                email:req.body.email
            });
            

            if (!req.body.password && !req.body.email) {
                res.redirect('/admin/login');
            } else {
                if (isUserExists && isUserExists.role === 'Admin') {
                    const hashPassword = isUserExists.password;
                    if (bcrypt.compareSync(req.body.password, hashPassword)) {
                        // token creation
                        const token = jwt.sign({
                            id: isUserExists._id,
                            email: isUserExists.email,
                            fullName: isUserExists.fullName,
                            image: isUserExists.image,
                            

                        }, 'MREW333SGYTY', { expiresIn: '24h' });

                        // req.user.token = token;
                        res.cookie('usertokken', token); // Set your cookie
                       

                        
                        res.redirect('/admin/dashboard');
                    } else {
                        
                        res.redirect('/admin/login');
                    }
                } else {
                    req.flash('message', 'Email does not exist!');
                    res.redirect('/admin/login');
                }
                
            }
        } catch (err) {
            throw err;
        }
    }
    



    /**
     * 
     * @method: showDashBoardPAge 
     * @desc: Rendering dashboard page
     */

     async showDashBoardPage(req,res){
        try {
            
           
            res.render('admin/dashboard',{
                title: 'Dashboard',
                user: req.user
              
            })
        } catch (error) {
           
        }
    }

     
    /**
     * @method: getLogout
     * @desc: to logout from the dashboard page
     */

    async getLogout(req,res){
        try {
           
        res.clearCookie('usertokken');
       
        res.redirect('/admin/login');
        } catch (error) {
            console.log(error);
        }
    }


    

    /**
     * @method: postUserDetails
     * @desc: to post user details from the user form
     */

    async postUserFormDetails(req,res){
        try {
            
            req.body.image = req.file.filename;
            req.body.firstName = req.body.firstName.trim();
            req.body.lastName = req.body.lastName.trim();
            if(!req.body.firstName && !req.body.lastName) {
                
                res.redirect('/admin/user-form')
            }
            let isEmailExists = await loggedInUserModel.find({email: req.body.email, isDeleted:false});
            if(!isEmailExists.length){
                
                req.body.fullName = `${req.body.firstName} ${req.body.lastName}`;
                let saveUserData = await loggedInUserModel.create(req.body);
                  
                    if(saveUserData && saveUserData._id) {
                       
                        res.redirect('/admin/template')
    
                }else {
                   
                    res.redirect('/admin/user-form')
                }
            }else {
               
                res.redirect('/admin/user-form');
            }
        }catch (err) {
           
            throw err;
    
        }
    }

     /**
     * @method: showLoggedInUser
     * @desc: to show loggedin User form after submit has been done
     */

     async showLoggedInUser(req,res){
        try {
            res.render('admin/loggedin-user-form',{
                title:'User-Form-Logged-In',
                user: req.user
            })
        } catch (error) {
           
            throw error;
        }
     }

    /**
     * @method: editUserDetails
     * @desc: to edit user details page from the edit form
     */

    async editUserEditDetails(req,res){
        try {
            let editUserData = await loggedInUserModel.find({_id: req.params.id});
            
            
             
            res.render('admin/edit-user-form', {
                title: 'Edit || UserDetails',
                response: editUserData[0],
                user: req.user
                
            })
        }catch (err) {
            throw err;
        }
    }

    /**
     * @method: editUserDetails
     * @desc: to edit user details page
     */
    
    async postEditUserEditDetails(req,res){
        try {
            let data = await loggedInUserModel.find({_id: req.body.id});
            
            let isEmailExists = await loggedInUserModel.find({email: req.body.email, _id: {$ne: req.body.id}});
            
            if(!isEmailExists.length) {
                req.body.image = req.file.filename;
                req.body.fullName = `${req.body.firstName} ${req.body.lastName}`;
                let findUserDetailsAndUpdate = await loggedInUserModel.findByIdAndUpdate(req.body.id, req.body);
                
               
                fs.unlinkSync(`./public/uploads/${data[0].image}`);
                if(findUserDetailsAndUpdate && findUserDetailsAndUpdate._id) {
                    
                   
                    res.redirect('/admin/template')
                }else {
                  
                    res.redirect('/admin/user-form')
                }
            }else {
             
                res.redirect('/admin/dashboard')
            }
        }catch (err) {
            throw err;
        }
    }

    /**
   * @method: userDelete
   * @description: Soft Deleting the Users
   */
  async userDelete(req, res) {
    try {
      let dataUpdate = await loggedInUserModel.findByIdAndUpdate(req.params.id, {
        isDeleted: true
      });
      if (dataUpdate && dataUpdate._id) {
      
        res.redirect('/admin/template')
      } else {
       
        res.redirect('/admin/template')
      }
    } catch (err) {
      throw err;
    }
  }



    // Blog Part
    /**
     * @method: showBlogPage
     * @desc: to show blog page
     */

    async showBlogPage(req,res){
        try {
            res.render('admin/blog-page',{
                title: 'Blog',
                user: req.user
            })
        } catch (error) {
           
            throw error;
        }
    }

    /**
     * @method: showBlogForm
     * @desc: to show submitted blog data
     */

    async showBlogPageDetails(req,res){
        try {
            
            let blogData = await blogModel.find({isDeleted:false})
           
            res.render('admin/blog-form-details',{
                title:'Blog-Form',
                blogData,
                user:req.user
            })
        } catch (error) {
       
            throw error;
        }
    }

    
    /**
     * @method: showBlogForm
     * @desc: to show blog form
     */

    async submitBlogForm(req,res){
        try {
           

            if(req.file && req.file.filename){
                req.body.image = req.file.filename

            }
            let submitBlogBody = await blogModel.create(req.body)
           
            if(submitBlogBody && submitBlogBody._id){
               
                res.redirect('/admin/blog-page')
            }else{
              
                res.redirect('/admin/dashboard');
            }
        } catch (error) {
           
            throw error;
        }
    }


     /**
     * @method: showBlogEditForm
     * @desc: to show blog edit form
     */

     async showBlogEditForm(req,res){
        try {
            let showBlogData = await blogModel.find({_id: req.params.id});
            
            res.render('admin/blog-edit-page',{
                response: showBlogData[0],
                title:'Blog|| Edit',
                user: req.user
            })
            
        } catch (error) {
           
            throw error;
        }
     }


     /**
     * @method: showBlogEditForm
     * @desc: to update blog edit form
     */
     async postEditBlogForm(req,res){
        try {
            let postEditId = await blogModel.find({_id:req.body.id});
           
            req.body.image = req.file.filename;
            let updateBlogData = await blogModel.findByIdAndUpdate(req.body.id, req.body);
          
            if(updateBlogData && updateBlogData._id){
             
                res.redirect('/admin/blog-form-details');
            }else{
              
                res.redirect('/admin/dashboard');
            }
            
        } catch (error) {
           
            throw error;
        }
     }

     /**
     * @method: deleteBlogEditForm
     * @desc: to delete blog 
     */
     async deleteBlogEditForm(req,res){
        try {
            try {
                let dataUpdate = await blogModel.findByIdAndUpdate(req.params.id, {
                  isDeleted: true
                });
                if (dataUpdate && dataUpdate._id) {
                  
                  res.redirect('/admin/blog-form-details')
                } else {
                 
                  res.redirect('/admin/template')
                }
              } catch (err) {
                throw err;
              }
            
        } catch (error) {
            
            throw error;
        }
     }

    
    
    
     /**
     * @method: showFaqPage
     * @desc: to show faq page
     */
    async showFaqPage(req,res){
        try {
            res.render('admin/faq',{
                title:'FAQ || Submit',
                user: req.user
            })
        } catch (error) {
           
            throw error;
        }
    }



    /**
     * @method: showFaqView
     * @desc: to show faq form page
     */
    async showFaqView(req,res){
        try {
            let viewFaqData = await faqModel.find({isDeleted:false});
            res.render('admin/faq-view',{
                title:'Faq || View',
                user: req.user,
                response: viewFaqData
            })
            
        } catch (error) {
         
            throw error;
        }
    }

    //showFaqEditPage
    /**
     * @method: showFaqEditPage
     * @desc: to show edit faq form page
     */

    async showFaqEditPage(req,res){
        try {
            let faqEditData = await faqModel.find({_id: req.params.id})
            res.render('admin/faq-edit',{
                title:"Faq || Edit",
                response:faqEditData[0],
                user:req.user

            }) 
            
        } catch (error) {
           
            throw error;
        }
    }

    /**
     * @method: postFaqEditPage
     * @desc: to show faq form page
     */
        async postFaqEditPage(req,res){
            try {
                let showHiddenData = await faqModel.find({_id:req.body.id});
                let postFaqData = await faqModel.findByIdAndUpdate(req.body.id, req.body);

                if(postFaqData && postFaqData._id){
               
                    res.redirect('/admin/faq-view')
                }else{
                    
                    res.redirect('/admin/faq')
                }
            } catch (error) {
                throw error;
            }
        }

        /**
         * method: deleteFaqEditPage
         * desc: to delete faq details from Table
         */

        async deleteFaqEditPage(req,res){
            try {
                let deleteFaqData = await faqModel.findByIdAndUpdate( req.params.id, {
                    isDeleted:true
                })
                if(deleteFaqData && deleteFaqData._id){
                    res.redirect('/admin/faq-view')
                }else{
                    res.redirect('/admin/faq')
                }
            } catch (error) {
                throw error;
            }
        }



    /**
     * @method: postFaqFormPage
     * @desc: to show faq form page
     */

    async postFaqFormPage(req,res){
        try {
            let submitFaqData= await faqModel.create(req.body);
            if(submitFaqData && submitFaqData._id){
                res.redirect('/admin/faq')
            }else{
                console.log('Faq not added');
            }
        } catch (error) {
            throw error;
        }
    }

    
    /**
     * @method: showFeedbackPage
     * @desc: to show feedback page
     */

    async showFeedbackPage(req,res){
        try {
            res.render('admin/feeback-page',{
                title:'FeedBack || Page',
                user: req.user
            })
        } catch (error) {
            throw error
        }
    }


    /**
     * method: postFeedbackPage
     * desc: postfeedback page
     */
    async postFeedbackPage(req,res){
        try {
            //console.log('641=>', req.body);
            req.body.firstName = req.body.firstName.trim();
            req.body.lastName = req.body.lastName.trim();
            req.body.feedback = req.body.feedback.trim();
            let postFeedbackData = await feedBackModel.create(req.body);

            
                if(postFeedbackData && postFeedbackData._id){
                    res.redirect('/admin/feedback-page')
                }else{
                    res.redirect('/admin/feedback-page')
                }
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * method: showFeedbackPageDetails
     * desc: show feeback form submitted details in a table
     */

    async showFeedbackPageDetails(req,res){
        try {
            let showFeedbackdetails = await feedBackModel.find({isDeleted:false});
            res.render('admin/feedback-page-details',{
                title:'Feedback || Table',
                user: req.user,
                response : showFeedbackdetails
            })
        } catch (error) {
            throw error;
        }
    }

    /**
     * method: showEditFeedbackForm
     * desc: to show edit feedback form
     */

    async showEditFeedbackForm(req,res){
        try {

            let editFeedbackData = await feedBackModel.find({_id: req.params.id});
            
            
            res.render('admin/feedback-page-edit',{
                title: 'Feedback || Edit',
                response: editFeedbackData[0], 
                user: req.user
            })
            
        } catch (error) {
            throw error;
        }
    }

    /**
     * method: postEditFeedbackForm
     * desc: to post edit feedback form
     */
        async postEditFeedbackPage(req,res){
            try {
                let getHiddenId = await feedbackModel.find({_id: req.body.id});
                let postEditFdDetails= await feedBackModel.findByIdAndUpdate(req.body.id, req.body);

                if(postEditFdDetails && postEditFdDetails._id){
                    res.redirect('/admin/feedback-page-details');
                }else{
                    res.redirect('/admin/faq')
                }
            } catch (error) {
                throw error;
            }
        }



    /**
     * method: deleteEditFeedbackForm
     * desc: to delete feedback details
     */

        async deleteEditFeedbackForm(req,res){
            try {
                let deleteEditData= await feedBackModel.findByIdAndUpdate(req.params.id,{
                    isDeleted:true
                });
                if(deleteEditData && deleteEditData._id){
                    res.redirect('/admin/feedback-page-details')
                }else{
                    console.log('Feedback Data not deleted');
                    
                }
            } catch (error) {
                throw error;
            }
        }
    
     /**
     * @method: showContactPage
     * @desc: to show feedback page
     */
    async showContactPage(req,res){
        res.render('admin/contact-page',{
            title: 'Contact || Page',
            user: req.user
        })
    }

    /**
     * method: showContactTable
     * desc: to show contact table
     */

    async showContactTable(req, res){
        try {
            let viewContactTable = await contactModel.find({isDeleted:false});
            res.render('admin/contact-page-table',{
                title:'Contact || Table',
                user :req.user,
                response: viewContactTable
            })
        } catch (error) {
            throw error;
        }
    }

    /**
     * method: postContactPage
     * desc: to post contatc form
     */

    async postContactPage(req,res){
        try {
            req.body.firstName = req.body.firstName.trim();
            req.body.lastName = req.body.lastName.trim();
            req.body.message = req.body.message.trim();
            if(!(req.body.firstName || req.body.lastName || req.body.message)){
                res.redirect('/admin/contact-page-table');
            }
            let postContactDetails = await contactModel.create(req.body);
            if(postContactDetails && postContactDetails._id){
                res.redirect('/admin/contact-page-table');
            }else{
                res.redirect('/admin/contact-page')
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * method: showEditContactForm
     * desc: to show edit contact form
     */
    
    async showEditContactForm(req,res){
        try {
            let editContactForm = await contactModel.find({_id:req.params.id});
            res.render('admin/contact-page-edit',{
                title: 'Contact || Edit',
                response: editContactForm[0],
                user : req.user
            })
            
        } catch (error) {
            throw error;
        }
    }

   
    /**
     * method: postContactEditPage
     * desc: to post edit contact form
     */

    async postContactEditPage(req,res){
        try {
            let hiddenIdContact = await contactModel.find({_id:req.body.id});
            let postEditDetails = await contactModel.findByIdAndUpdate(req.body.id, req.body);
            if(postEditDetails && postEditDetails._id){
                res.redirect('/admin/contact-page-table');
            }else{
                res.redirect('/admin/contact-page');
            }
        } catch (error) {
            throw error;
        }
    }

    
    /**
     * method: deleteContactForm
     * desc: to delete contact form table data
     */

    async deleteContactForm(req,res){
        try {
            let deleteDataContact = await contactModel.findByIdAndUpdate(req.params.id,{
                isDeleted:true
            });
            if(deleteDataContact && deleteDataContact._id){
                res.redirect('/admin/contact-page-table');
            }else{
                res.redirect('/admin/contact-page-table');
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * method: showCategoryForm
     * desc: to show category form 
     */
    async showCategoryForm(req,res){
        try {
            res.render('admin/admin-blog-form',{
                user: req.user,
                title: 'Admin || Category || Form'
            })
        } catch (error) {
            throw error;
        }
    }


    /**
     * method: showCategoryForm
     * desc: to show category table 
     */
     async showCategoryTable(req,res){
        try {
            let renderData = await userCategoryModel.find({})
            res.render('admin/admin-blog-table',{
                user: req.user,
                title: 'Admin || Category || Table',
                displayData: renderData
            })
        } catch (error) {
            throw error;
        }
    }



    /**
     * method: postCategoryForm
     * desc: to post category form 
     */
     async postCategoryForm(req,res){
        try {
            
            let categoryData = await userCategoryModel.create(req.body);
            if(categoryData && categoryData._id){
                res.redirect('/admin/show-category-table');
            }else{
                res.redirect('/admin/show-category-form')
            }
        
            
        } catch (error) {
            throw error;
        }
    }



    async posts(req,res){

        try {
            let postsData = await userblogModel.find().populate("category").populate("userId").sort('-createdAt');
            res.render('admin/posts',{
                user:req.user,
                title: 'Posts || User',
                displayData: postsData
    
            })
            
        } catch (error) {
            throw error;
        }   
    }

    async activePost(req,res){
        try {
            let activePostData = await userblogModel.findByIdAndUpdate(req.params.id, {status:true});
            if(activePostData && activePostData._id){
                res.redirect('/admin/posts')
            }else{
                console.log('Data deactivated ');
            }
        } catch (error) {
            throw error;
        }
    }


    async deActivePost(req,res){
        try {
            let deactivateData = await userblogModel.findByIdAndUpdate(req.params.id,{
                status:false
            });
            if(deactivateData && deactivateData._id){
                res.redirect('/admin/posts')
            }else{
            }
        } catch (error) {
            throw error;
        }
    }



    async frontEndUsers(req,res){
        try {
            let frontData = await frontUserModel.find({});
            res.render('admin/user-front',{
                title: 'User || Front || Table',
                user:req.user,
                displayData: frontData
            })
        } catch (error) {
            throw error;
        }
    }

    async activeFrontUser(req,res){
        try {
            let activeData = await frontUserModel.findByIdAndUpdate(req.params.id,{
                status:true
            });
            if(activeData && activeData._id){
                res.redirect('/admin/users')
            }

        } catch (error) {
            throw error;
        }
    }

    async deactiveFrontUser(req,res){
        try {
            let deActiveData= await frontUserModel.findByIdAndUpdate(req.params.id,{
                status:false
            });

            if(deActiveData && deActiveData._id){
                res.redirect('/admin/users')
            }
        } catch (error) {
            throw error;
        }
    }



    async comments(req,res){
        try {
            let showComments = await userCommentData.find({});
            res.render('admin/comment',{
                title: 'Comments || Users',
                displayData: showComments,
                user:req.user
            })
        } catch (error) {
            throw error;
        }
    }


    async activeComment(req,res){
        try {
            let activeComment = await userCommentData.findByIdAndUpdate(req.params.id,{
                status:true
            });
            if(activeComment._id && activeComment){
                res.redirect('/admin/comment')
            }
        } catch (error) {
            throw error;
        }
    }


    async deActiveComment(req,res){
        try {
            let deActiveComment = await userCommentData.findByIdAndUpdate(req.params.id,{
                status:false
            });
            if(deActiveComment && deActiveComment._id){
                res.redirect('/admin/comment')
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AdminController()