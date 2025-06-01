import './App.css'
import { OTPInput } from './Otp'

function App() {

  return (
    <div>
      <form action="/post" method="post">
        Enter OTP here:
        <input type="text" autocomplete="one-time-code" inputmode="numeric" name="one-time-code" />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default App
