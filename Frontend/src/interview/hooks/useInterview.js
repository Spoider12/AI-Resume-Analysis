import { getAllInterviewReports, generateInterviewReport, getInterviewReportById } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interviewContext"
import { useParams } from "react-router"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null

        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            const interviewReport = response?.interviewReport ?? null
            if (interviewReport) {
                setReport(interviewReport)
            }
            return interviewReport
        } catch (error) {
            console.error(error)
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (id) => {
        setLoading(true)
        let response = null

        try {
            response = await getInterviewReportById(id)
            const interviewReport = response?.interviewReport ?? null
            if (interviewReport) {
                setReport(interviewReport)
            }
            return interviewReport
        } catch (error) {
            console.error(error)
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        let response = null

        try {
            response = await getAllInterviewReports()
            const nextReports = response?.interviewReports ?? []
            setReports(nextReports)
            return nextReports
        } catch (error) {
            console.error(error)
            setReports([])
            return []
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        if (!interviewReportId) return null

        setLoading(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interview/report/${interviewReportId}/resume`, {
                credentials: "include",
            })

            if (!response.ok) {
                throw new Error("Resume download endpoint is not available")
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
            return true
        } catch (error) {
            console.error(error)
            return null
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }
}
