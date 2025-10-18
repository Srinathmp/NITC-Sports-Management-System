import { Trophy, Mail, Lock } from "lucide-react"
import { useState } from "react"

export default function Login() {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    function handleSubmit(e){
        e.preventDefault()
        console.log(email,password)
        setEmail('')
        setPassword('')
    }

    return (
        <div className="bg-[#445cd5ff] min-h-screen flex flex-col items-center justify-center">
            <div className="min-w-sm lg:min-w-md">
                <div className="flex flex-col items-center justify-center gap-2 text-white/90 mb-10">
                    <Trophy className="font-bold" size={48} />
                    <p className="font-bold text-3xl">INSMS</p>
                    <p>Inter-NIT Sports Management System</p>
                </div>
                <div className="rounded-2xl border border-white/30 bg-white shadow-lg backdrop-blur-lg p-2">
                    <div className="flex flex-col items-center justify-center text-center gap-2 p-4">
                        <p className="font-semibold text-2xl">Sign In</p>
                        <p className="text-sm">Enter your credentials to access your dashboard</p>
                    </div>
                    <form className="p-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email_id" className="text-sm font-medium"> Email Address </label>
                            <div className="flex gap-4 rounded-lg border border-blue-200 bg-white/30 p-2 mt-2 mb-4 focus-within:ring-3 focus-within:ring-blue-500">
                                <Mail />
                                <input type="email" id="email_id" placeholder="Enter your email" 
                                className="w-full focus-visible:outline-none file:bg-transparent" 
                                value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="pswd" className="text-sm font-medium"> Password </label>
                            <div className="flex gap-4 rounded-lg border border-blue-200 bg-white/30 p-2 mt-2 focus-within:ring-3 focus-within:ring-blue-500">
                                <Lock />
                                <input id="pswd" type="password" placeholder="Enter your password" 
                                className="w-full focus-visible:outline-none" value={password}
                                 onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="text-white cursor-pointer w-full bg-[#3a90ffff] mt-8 p-2 border-[#70aafbff] rounded-lg hover:bg-[#0157c8ff]">
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}