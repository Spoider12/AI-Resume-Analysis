import {getAllInterviewReports,getInterviewReportById,generateInterviewReport} from "../services/interview.api"
import {useContext} from "react"
import { InterviewContext } from "../interviewContext"
export const useInterview = () =>{
const context = useContext(InterviewContext)

if(!context){
    throw new Error ("useInterview must be used within an InterviewProvider")
}
const {loading ,setLoading,report ,setReport,reports,setReports} = context

const generateReport = async ({jobDescription , selfDescription , resumeFile}) =>{
    setLoading(true)
    try {
        const response = await generateInterviewReport({jobDescription , selfDescription , resumeFile})
        setReport(response)
        return response
    } catch (error) {
        console.error("Error generating interview report:", error)
        return null
    } finally {
        setLoading(false)
    }
}
const getReportById = async (interviewId) =>{
    setLoading(true)
    try {
        const response = await getInterviewReportById(interviewId)
        setReport(response)
    } catch (error) {
        console.error("Error fetching interview report:", error)
    } finally {
        setLoading(false)
    }
}
const getReports = async () =>{
    setLoading(true)
    try {
        const response = await getAllInterviewReports()
        setReports(response)
    } catch (error) {
        console.error("Error fetching all interview reports:", error)
    } finally { 
        setLoading(false)
    }
}
return {loading,setLoading,report,setReport,reports,setReports,generateReport,getReportById,getReports}
}