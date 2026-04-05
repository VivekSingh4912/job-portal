import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Navbar from '../components/Navbar'
import moment from 'moment'
import Footer from '../components/Footer'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

const Applications = () => {

    const { user } = useUser()
    const { getToken } = useAuth()

    const { jobsApplied, backendUrl, userData, fetchUserData, fetchUserApplications } = useContext(AppContext)

    const [isEdit, setIsEdit] = useState(false)
    const [resume, setResume] = useState(null)

    const updateResume = async () => {
        try {
                console.log("Uploading resume:", resume) 
            if (!resume) {
                toast.error("Please select a resume")
                return
            }

            const formData = new FormData()
            formData.append('resume', resume)

            const token = await getToken()
            console.log("Token:", token) 
            console.log("Backend URL:", backendUrl)
            const { data } = await axios.post(
                backendUrl + '/api/users/update-resume',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (data.success) {
                toast.success(data.message)
                await fetchUserData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

        setIsEdit(false)
        setResume(null)
    }
    useEffect(()=>{
       if(user){
        fetchUserApplications()
       }
    },[user])

    return (
        <>
            <Navbar />

            <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>

                {/* Resume Section */}
                <h2 className='text-xl font-semibold'>Your Resume</h2>

                <div className='flex gap-2 mb-6 mt-3'>
                    {(isEdit || userData?.resume === "") ? (
                        <>
                            <label className='flex items-center' htmlFor="resumeUpload">
                                <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>
                                    {resume ? resume.name : "Select Resume"}
                                </p>

                                <input
                                    id='resumeUpload'
                                    type="file"
                                    hidden
                                    accept='application/pdf'
                                    onChange={e => setResume(e.target.files[0])}
                                />

                                <img src={assets.profile_upload_icon} alt="" />
                            </label>

                            <button
                                onClick={updateResume}
                                className='bg-green-100 border border-green-400 rounded-lg px-4 py-2'
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <div className='flex gap-2'>
                            <a
                                href={userData?.resume}
                                target="_blank"
                                rel="noreferrer"
                                className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg'
                            >
                                Resume
                            </a>

                            <button
                                onClick={() => setIsEdit(true)}
                                className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>

                {/* Jobs Applied */}
                <h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>

                <table className='min-w-full bg-white border rounded-lg'>
                    <thead>
                        <tr>
                            <th className='py-3 px-4 border-b text-left'>Company</th>
                            <th className='py-3 px-4 border-b text-left'>Job Title</th>
                            <th className='py-3 px-4 border-b text-left max-sm:hidden'>Location</th>
                            <th className='py-3 px-4 border-b text-left max-sm:hidden'>Date</th>
                            <th className='py-3 px-4 border-b text-left'>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {jobsApplied?.length > 0 ? (
                            jobsApplied.map((job, index) => (
                                <tr key={index}>
                                    <td className='py-3 px-4 flex items-center gap-2 border-b'>
                                        <img
                                            className='w-8 h-8'
                                            src={job.companyId?.image || job.logo}
                                            alt=""
                                        />
                                        {job.companyId?.name || job.company}
                                    </td>

                                    <td className='py-2 px-4 border-b'>{job.title}</td>

                                    <td className='py-2 px-4 border-b max-sm:hidden'>
                                        {job.location}
                                    </td>

                                    <td className='py-2 px-4 border-b max-sm:hidden'>
                                        {moment(job.date).format('ll')}
                                    </td>

                                    <td className='py-2 px-4 border-b'>
                                        <span
                                            className={`px-4 py-1.5 rounded ${
                                                job.status === 'Accepted'
                                                    ? 'bg-green-100'
                                                    : job.status === 'Rejected'
                                                    ? 'bg-red-100'
                                                    : 'bg-blue-100'
                                            }`}
                                        >
                                            {job.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className='text-center py-4'>
                                    No Jobs Applied Yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>

            <Footer />
        </>
    )
}

export default Applications

// import React, { useState, useContext } from 'react'
// import { AppContext } from '../context/AppContext'
// import { assets } from '../assets/assets'
// import Navbar from '../components/Navbar'
// import moment from 'moment'
// import Footer from '../components/Footer'
// import { useAuth, useUser } from '@clerk/clerk-react'



// const Applications = () =>{
//     const { user } = useUser()
//     const {getToken } = useAuth()
// const { jobsApplied } = useContext(AppContext)
// console.log(jobsApplied)  
// const [isEdit,setIsEdit] = useState(false)
// const [resume,setResume] = useState(null)

// const { backendUrl, userData ,userApplications, fetchUserData } = useContext(AppContext)
// const updateResume = async () =>{
//  try{
//  const formData = new FormData()
//  formData.append('resume',resume)

//  const token = await getToken()

//     const {data} = await axios.post(backendUrl+'/api/users/update-resume',
//         formData,
//         {headers:{ Authorization : `Bearer ${token}`}}
//     )
//     if (data.success){
//         toast.success(data.message)
//         await fetchUserData()
         
//     }else{
//         toast.error(data.message)
//     }
 
//  }catch (error){
//     toast.error(error.message)
//  }
//  setIsEdit(false)
//  setResume(null)
// }
// return (
//         <>
//         <Navbar />
//         <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
//             <h2 className='text-xl font-semibold'>Your Resume</h2>
//             <div className='flex gap-2 mb-6 mt-3'>
//               {
//                 isEdit || userData && userData.resume === ""
//                 ? <>
//                   <label className='flex items-center' htmlFor="resumeUpload">
//                     <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>{resume ? resume.name : "Select Resume" }</p>
//                     <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} accept='application/pdf' type="file" hidden />
//                     <img src={assets.profile_upload_icon} alt="" />
//                   </label>
//                   <button onClick={updateResume} className='bg-green-100 border border-green-400 rounded-lg px-4 py-2'>Save</button>
//                 </>
//                 : <div className='flex gap-2'>
//                  <a className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg' href="">
//                     Resume
//                  </a>
//                  <button onClick={()=>setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'>Edit</button>
//                 </div>
//               }
//             </div>
//             <h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>
         
//             <table className='min-w-full bg-white border rounded-lg'>
//                 <thead>
//                     <tr>
//                     <th className='py-3 px-4 border-b text-left'>Company</th>
//                     <th className='py-3 px-4 border-b text-left'>Job Title</th>
//                     <th className='py-3 px-4 border-b text-left max-sm:hidden'>Location</th>
//                     <th className='py-3 px-4 border-b text-left max-sm:hidden'>Date</th>
//                     <th className='py-3 px-4 border-b text-left'>Status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {jobsApplied.map ((job,index)=>  (
//                         <tr key={index}>
//                          <td className='py-3 px-4 flex items-center gap-2 border-b'>
//                             <img className='w-8 h-8' src= {job.companyId?.image || job.logo} alt="" />
//                             {job.companyId?.name || job.company}
//                          </td>
//                          <td className='py-2 px-4 border-b'>{job.title}</td>
//                          <td className='py-2 px-4 border-b max-sm:hidden'>{job.location}</td>
//                          <td className='py-2 px-4 border-b max-sm:hidden'>{moment(job.date).format('ll')}</td>
//                          <td className='py-2 px-4 border-b'>
//                             <span className={`${job.status === 'Accepted' ? 'bg-green-100' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'} px-4 py-1.5 rounded`}>{job.status}</span>
//                              </td>
//                         </tr>
//                     )   )}
//                 </tbody>
//             </table>
//         </div>
//         <Footer />
//         </>
//     )
// }
// export default Applications