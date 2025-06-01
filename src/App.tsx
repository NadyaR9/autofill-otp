import './App.css'
import { OTPInput } from './Otp'

function App() {

  return <OTPInput length={6} onChange={(code) => {
    console.log('onChange');
                  if (code.length === 6) {
                    console.log('onSubmit');

                  }
                }}
                hasError={false}
                resetError={() => {
                  console.log('resetError')
                }}/>
}

export default App
