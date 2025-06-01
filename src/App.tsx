import './App.css'
import { OTPInput } from './Otp'

function App() {

  return (
    <div style="border:1px solid; padding: 5px; 10px; margin: 10px 0;">
      <form action="/post" method="post">
        Enter OTP here:
        <input type="text" autocomplete="one-time-code" inputmode="numeric" name="one-time-code" />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default App
