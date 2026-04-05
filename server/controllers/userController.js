import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import { v2 as cloudinary } from "cloudinary"
import { clerkClient } from "@clerk/express"

// ✅ Get user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth().userId   // ✅ CORRECT

    console.log("USER ID:", userId)

    let user = await User.findById(userId)
    console.log("USER FROM DB:", user)

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId)
      const email = clerkUser.emailAddresses[0].emailAddress

      user = await User.findOne({ email })

      if (!user) {
        user = await User.create({
          _id: userId,
          email: email,
          name: clerkUser.firstName + " " + clerkUser.lastName,
          image: clerkUser.imageUrl,
          resume: ""
        })
      }
    }

    res.json({ success: true, user })

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}


// ✅ Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body
    const userId = req.auth().userId   // ✅ CORRECT

    console.log("USER ID:", userId)

    const isAlreadyApplied = await JobApplication.findOne({ jobId, userId })

    if (isAlreadyApplied) {
      return res.json({ success: false, message: 'Already Applied' })
    }

    const jobData = await Job.findById(jobId)

    if (!jobData) {
      return res.json({ success: false, message: 'Job Not Found' })
    }

    await JobApplication.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      date: Date.now()
    })

    res.json({ success: true, message: 'Applied Successfully' })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}


// ✅ Get user applied applications
export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.auth().userId   // ✅ CORRECT

    console.log("USER ID:", userId)

    const applications = await JobApplication.find({ userId })
      .populate('companyId', 'name email image')
      .populate('jobId', 'title description location category level salary')
      .exec()

    return res.json({ success: true, applications })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}


// ✅ Update user resume
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth().userId

    console.log("USER ID:", userId)

    const resumeFile = req.file

    let userData = await User.findById(userId)

    if (!userData) {
      // if user doesn't exist yet, create using Clerk profile
      const clerkUser = await clerkClient.users.getUser(userId)
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress

      if (!email) {
        return res.json({ success: false, message: 'User profile email is missing' })
      }

      userData = await User.findOne({ email })

      if (!userData) {
        userData = await User.create({
          _id: userId,
          email,
          name: `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim(),
          image: clerkUser?.imageUrl || '',
          resume: ''
        })
      }
    }

    if (resumeFile) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
      userData.resume = resumeUpload.secure_url
    }

    await userData.save()

    return res.json({ success: true, message: 'Resume Updated' })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
// import Job from "../models/Job.js"
// import JobApplication from "../models/JobApplication.js"
// import User from "../models/User.js"
// import { v2 as cloudinary } from "cloudinary"
// import { clerkClient } from "@clerk/express";

// // Get user data

// export const getUserData = async (req,res)=> {
//          console.log("Clerk ID:", req.auth.userId) 
//          try{
//    const userId = req.auth.userId
  
        
//         const user = await User.findById(userId)
//         console.log("USER FROM DB:", user)
//         if(!user){
//          return res.json({ success: false, message: 'User Not Found'})
//         }
//         res.json({success: true, user})

//    } catch (error){
//      res.json({success: false, message: error.message})
//    }

// }

// // Apply for a job
// export const applyForJob = async (req,res) => {

//   const { jobId } = req.body

//   const userId = req.auth.userId

//   try {

//    const isAlreadyApplied = await JobApplication.findOne({jobId, userId})
//  if(isAlreadyApplied.length>0){
//    return res.json({success: false, message: 'Already Applied'})
//  }
//  const jobData = await Job.findById(jobId)

//  if(!jobData){
//    return res.json({success: false, message: 'Job Not Found'})
//  }
//  await JobApplication.create({
//    companyId: jobData.companyId,
//    userId,
//    jobId,
//    date: Date.now()
//  })

//  res.json({success: true, message: 'Applied Successfully'})
//   } catch (error){

//    res.json({ success: false, message: error.message})
//   }

// }

// // Get user applied applications
// export const getUserJobApplications = async (req,res) => {
    
// try {
//    const userId = req.auth().userId

//    const application = await JobApplication.find({ userId })
//    .populate('companyId','name email image')
//    .populate('jobId','title description location category level salary')
//    .exec()

//    if(!applications){
//       return res.json({ success: false, message: 'No job applications found for this user.'})
//    }
//    return res.json({success: true, applications})
// }
// catch (error){
// res.json({ success: false, message: error.message})
// }
// }

// // update user profile (resume)
// export const updateUserResume = async (req,res) => {
// try {

//    const userId = req.auth().userId

//    const resumeFile = req.resumeFile

//    const userData = await User.findById(userId)

//    if(resumeFile){
//       const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
//       userData.resume = resumeUpload.secure_url
//    }

//    await userData.save()

//    return res.json({ success: true, message: 'Resume Updated'})

// } catch (error){

//    res.json({ success: false, message: error.message})
// }
// }