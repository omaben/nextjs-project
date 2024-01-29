import React, { ReactElement, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import DashboardLayout from '../../layouts/Dashboard'
import ReactMarkdown from 'react-markdown'
const Changelog = () => {
   const [mdText, setMdText] = useState('')

   useEffect(() => {
      fetch('/README.md')
         .then((response) => {
            if (response.ok) return response.text()
            else return Promise.reject("Didn't fetch text correctly")
         })
         .then((text) => {
            setMdText(text)
         })
         .catch((error) => console.error(error))
   })

   return (
      <React.Fragment>
         <ReactMarkdown>{mdText}</ReactMarkdown>
         <Helmet title="iMoon | Changelog" />
      </React.Fragment>
   )
}

Changelog.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout>{page}</DashboardLayout>
}

export default Changelog
