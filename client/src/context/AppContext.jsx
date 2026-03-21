import { createContext,useEffect, useState} from "react";
import { jobsData, jobsApplied as defaultJobsApplied } from '../assets/assets' 
// import const AppContext = createContext()

export const AppContext = createContext()

export const AppContextProvider = (props) => {
  
  const [searchFilter, setSearchFilter] = useState({
      title:'',
      location:''
  })

  const [isSearched,setIsSearched] = useState(false)

  const[jobs, setJobs] =  useState([])

    const [jobsApplied, setJobsApplied] = useState(defaultJobsApplied)

const [showRecruiterLogin,setShowRecruiterLogin] = useState(false)



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
    setJobs(jobsData)
  }

  useEffect(()=>{
    fetchJobs()
  },[])

    const value = {
      setSearchFilter,searchFilter,
      isSearched,setIsSearched,
      jobs,setJobs,
       jobsApplied, setJobsApplied,
      showRecruiterLogin,setShowRecruiterLogin,
      //  jobsApplied, setJobsApplied,
    }
    return (<AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>)
}