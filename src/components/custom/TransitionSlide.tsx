import { Slide } from '@mui/material'
import React from 'react'
import { TransitionProps } from 'react-transition-group/Transition'

/**
 * TransitionSlide is a functional component created using React.forwardRef.
 * It provides a Slide transition effect with a leftward direction.
 *
 * @param {TransitionProps & { children: React.ReactElement<any, any> }} props - Props for configuring the Slide transition.
 * @param {React.Ref<unknown>} ref - A ref that can be used to access the DOM element associated with this transition.
 * @returns {React.ReactElement} - Returns a Slide transition component with specified props.
 */
const TransitionSlide = React.forwardRef(function Transition(
   props: TransitionProps & {
      children: React.ReactElement<any, any>
   },
   ref: React.Ref<unknown>,
   direction?: 'left' | 'right' | 'up' | 'down'
) {
   // Return a Slide transition component with specified direction and props
   return (
      <Slide direction={direction ? direction : 'left'} ref={ref} {...props} />
   )
})

export default TransitionSlide
