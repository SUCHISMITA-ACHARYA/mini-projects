import { useState } from "react"
import axios from "axios"
import { io } from "socket.io-client"
import "./index.css"

/*Demo videos for Viewer ------- */


const demoVideos = [
  {
    id: 1,
    title: "Nature Demo",
    url: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    id: 2,
    title: "City Timelapse",
    url: "https://www.w3schools.com/html/movie.mp4"
  }
]

/*   Helper to get role from JWT ------ */
const getRoleFromToken = (token) => {
  const payload = JSON.parse(atob(token.split(".")[1]))
  return payload.role
}

function App() {
  const [socket, setSocket] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [token, setToken] = useState("")
  const [role, setRole] = useState("")
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [videos, setVideos] = useState([])

  /* Login ------- */
  const login = async () => {
    const res = await axios.post("https://video-platform-backend-dsfn.onrender.com/auth/login", {
      email,
      password
    })

    setToken(res.data.token)
    setRole(getRoleFromToken(res.data.token))

    const newSocket = io("https://video-platform-backend-dsfn.onrender.com")
    newSocket.on("progress", p => setProgress(p))
    setSocket(newSocket)
  }

  /*Upload ------- */
  const upload = async () => {
    if (!file) return
    setProgress(0)

    const form = new FormData()
    form.append("video", file)

    await axios.post(
      "https://video-platform-backend-dsfn.onrender.com/video/upload",
      form,
      { headers: { authorization: token } }
    )
  }

  /*Load videos ------- */

  const loadVideos = async () => {
    const res = await axios.get(
      "https://video-platform-backend-dsfn.onrender.com/video/list",
      { headers: { authorization: token } }
    )
    setVideos(res.data)
  }

  /*LOGIN UI ------- */


  if (!token) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Video Platform Login</h2>
          <input
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={login}>Login</button>
        </div>
      </div>
    )
  }



  /*DASHBOARD ------ */

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">
        {role === "viewer" ? "Video Library" : "Video Processing Dashboard"}
      </h1>

      <p style={{ color: "white", textAlign: "center", marginBottom: 20 }}>
        Logged in as <b>{role.toUpperCase()}</b>
      </p>

      {
/*EDITOR UPLOAD UI ------- */}

      {role !== "viewer" && (
        <div className="upload-box">
          <h2>Upload New Video</h2>

          <div className="upload-section">
            <label className="file-input">
              Choose Video
              <input
                type="file"
                accept="video/*"
                onChange={e => setFile(e.target.files[0])}
              />
            </label>

            {file && (
              <p className="chosen-file">
                Chosen file: <b>{file.name}</b>
              </p>
            )}

            <button className="upload-btn" onClick={upload}>
              Upload Video
            </button>

            {progress > 0 && progress < 100 && (
              <div className="progress-container">
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p>{progress}% Processing...</p>
              </div>
            )}

            {progress === 100 && (
              <p className="done-text">✅ Processing complete</p>
            )}
          </div>

          <div className="load-section">
            <button className="load-btn" onClick={loadVideos}>
              Load Videos
            </button>
          </div>
        </div>
      )}

      {

        
  /*VIEWER BROWSING -------- */}


      {role === "viewer" && (
        <div>
          <h2 style={{ color: "white", textAlign: "center", marginBottom: 20 }}>
            Browse Videos
          </h2>

          <div className="video-grid">
            {demoVideos.map(v => (
              <div className="video-card" key={v.id}>
                <p>{v.title}</p>
                <video controls width="100%">
                  <source src={v.url} />
                </video>
              </div>
            ))}
          </div>
        </div>
      )}

      {
      
      /*EDITOR REAL VIDEOS -------- */}
      {role !== "viewer" && (
        <div className="video-grid">
          {videos.map(v => (
            <div className="video-card" key={v._id}>
              <p
                className={
                  v.status === "safe"
                    ? "status-safe"
                    : "status-flagged"
                }
              >
                Status: {v.status}
              </p>
              <video controls width="100%">
                <source
                  src={`https://video-platform-backend-dsfn.onrender.com/uploads/${v.filename}`}
                />
              </video>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
