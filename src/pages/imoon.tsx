import Loader from '@/components/Loader'
import { ThemeProvider } from '../contexts/ThemeContext'

function LoaderImoon() {
   return (
      <ThemeProvider>
         <Loader />
      </ThemeProvider>
   )
}

export default LoaderImoon
