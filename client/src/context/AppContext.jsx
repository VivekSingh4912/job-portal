import { createContext,useEffect, useState} from "react";
// import { jobsData, jobsApplied as defaultJobsApplied } from '../assets/assets' 
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
// import const AppContext = createContext()

export const AppContext = createContext()

export const AppContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const {user} = useUser()
  const {getToken} = useAuth()
  
  const [searchFilter, setSearchFilter] = useState({
      title:'',
      location:''
  })

  const [isSearched,setIsSearched] = useState(false)

  const[jobs, setJobs] =  useState([])

    const [jobsApplied, setJobsApplied] = useState([])

const [showRecruiterLogin,setShowRecruiterLogin] = useState(false)

const [companyToken, setCompanyToken] = useState(null)
const [companyData, setCompanyData] = useState(null)

const [userData, setUserData] = useState(null)
const [userApplications, setUserApplications] = useState([])






//  const [jobsApplied, setJobsApplied] = useState([]) 

// useEffect(() => {
//   const savedJobs = localStorage.getItem("jobsApplied")
//   if (savedJobs) {
//     setJobsApplied(JSON.parse(savedJobs))
//   }
// }, [])

// useEffect(() => {
//   localStorage.setItem("jobsApplied", JSON.stringify(jobsApplied))
// }, [jobsApplied])

  // Function to fetch jobs
  const fetchJobs = async () => {
    try {
      console.log(backendUrl + '/api/jobs') 
      const {data} = await axios.get(backendUrl+'/api/jobs')
      if ( data.success){
        setJobs(data.jobs)
        console.log(data.jobs);
      } else {
        toast.error(data.message)
      }

    } catch (error){
       toast.error(error.message)
    }
    // setJobs(jobsData)
  }

  // function to fetch company data
  const fetchCompanyData = async () => {
    try {
         
      const {data} = await axios.get(backendUrl + '/api/company/company',{headers:{token: companyToken}})
      if(data.success){
        setCompanyData(data.company)
        console.log(data)
      }else{
        toast.error(data.message)
      }
    } catch (error){
      toast.error(error.message)
    }
  }
  
  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      
        const token = await getToken();
  // console.log("TOKEN:", token);
        const {data} = await axios.get(backendUrl+'/api/users/user',
          {headers:{Authorization: `Bearer ${token}`}})

          if(data.success){
            setUserData(data.user)
          }
          // else{
          //   toast.error(data.message)
          // }

    } catch(error){
      toast.error(error.message)
      // console.log(error.message)
    }
  }

  useEffect(()=>{
    fetchJobs()

    const storedCompanyToken = localStorage.getItem('companyToken')

    if(storedCompanyToken){
      setCompanyToken(storedCompanyToken)
    }
  },[])

  useEffect(()=>{
 if(companyToken){
  fetchCompanyData()
 }
  },[companyToken])

  const fetchUserApplications = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/users/applications', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success && Array.isArray(data.applications)) {
        const mapped = data.applications.map(app => ({
          _id: app.jobId?._id || app._id,
          title: app.jobId?.title || '',
          location: app.jobId?.location || '',
          date: app.date || app.jobId?.date || Date.now(),
          status: app.status || 'Pending',
          companyId: app.companyId || app.jobId?.companyId || {},
          description: app.jobId?.description || ''
        }))
        setJobsApplied(mapped)
      } else {
        setJobsApplied([])
      }
    } catch (error) {
      toast.error(error.message)
      setJobsApplied([])
    }
  }

  useEffect(()=>{
     if(user){
      fetchUserData()
      fetchUserApplications()
     }
  },[user])
    const value = {
      setSearchFilter, searchFilter,
      isSearched, setIsSearched,
      jobs, setJobs,
      jobsApplied, setJobsApplied,
      showRecruiterLogin, setShowRecruiterLogin,
      companyToken, setCompanyToken,
      companyData, setCompanyData,
      backendUrl,
      userData, setUserData,
      userApplications, setUserApplications,
      fetchUserApplications,
      fetchUserData,
    }
    return (<AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>)
}