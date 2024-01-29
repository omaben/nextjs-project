import { OperatorConfig } from '@alienbackoffice/back-front'
import { json } from '@codemirror/lang-json'
import { ViewUpdate } from '@codemirror/view'
import { Box } from '@mui/material'
import CodeMirror from '@uiw/react-codemirror'
import React from 'react'
const JSONEditor = (props: {
   editable: boolean
   data: any
   setExtraData?: Function
   setExtraDataError?: Function
}) => {
   const [highlightedValue, setHighlightedValue] = React.useState<string>(
      JSON.stringify(props.data, null, 2)
   )
   const [hasFormatError, setHasFormatError] = React.useState<boolean>(false)
   const [errorLineNumber, setErrorLineNumber] = React.useState<number>(0)
   const [error, setError] = React.useState('')
   const getErrorLineNumber = (error: Error, jsonValue: string) => {
      // The error message usually includes information about the position of the error
      const errorMessage = error.message
      const positionMatch = /position (\d+)/.exec(errorMessage)

      if (positionMatch && positionMatch[1]) {
         const position = parseInt(positionMatch[1])
         const linesBeforeError = jsonValue.substr(0, position).split('\n')
         return linesBeforeError.length
      }

      return null
   }
   const handleJsonChange = (value: string, viewUpdate: ViewUpdate) => {
      checkJsonFormat(value)
   }
   const checkJsonFormat = (value: string) => {
      try {
         JSON.parse(value)
         props.setExtraData &&
            props.setExtraData(JSON.parse(value) as OperatorConfig)
         setHasFormatError(false)
         props.setExtraDataError && props.setExtraDataError(false)
      } catch (error: any) {
         setHasFormatError(true)
         props.setExtraDataError && props.setExtraDataError(true)
         if (error.toString().indexOf('at') > -1) {
            var substr = error
               .toString()
               .substring(error.toString().indexOf('at') + 0)

            var lineNumber = getErrorLineNumber(error, value) as number
            setErrorLineNumber(lineNumber)
            setError(error.toString().replace(substr, ``))
         } else {
            setError(error.toString())
         }
      }
   }
   return (
      <Box>
         {hasFormatError && (
            <p style={{ color: 'red' }}>
               {error} at line {errorLineNumber}
            </p>
         )}
         <CodeMirror
            value={highlightedValue}
            editable={props.editable}
            extensions={[json()]}
            basicSetup={{ lineNumbers: true, highlightActiveLineGutter: true }}
            onChange={(e, viewUpdate) => handleJsonChange(e, viewUpdate)}
            theme={'dark'}

            // width={
            //    isLgUp
            //       ? 'calc(100vw - 400px)'
            //       : isDesktop
            //       ? 'calc(100vw - 250px)'
            //       : '100%'
            // }
         />
      </Box>
   )
}

export default JSONEditor
