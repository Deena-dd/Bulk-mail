import { useState } from "react";
import axios from "axios"
import * as XLSX from "xlsx"

function App() {

  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emaillist, setemaillist] = useState([])



  function handlemsg(evt) {
    setmsg(evt.target.value)
  }
  function handlefile(evnt) {
    const file = (evnt.target.files[0])

    const reader = new FileReader()
    reader.onload = function (evnt) {
      const data = evnt.target.result
      const workbook = XLSX.read(data, { type: "binary" })
      const sheetname = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetname]
      const emaillist = XLSX.utils.sheet_to_json(worksheet, { header: "A" })
      const totalemaillist = emaillist.map(function (item) { return item.A })
      setemaillist(totalemaillist)

    }

    reader.readAsBinaryString(file)

  }


  function handlesend() {
    setstatus(true)
    axios.post("/sendmail", { msg: msg,emailList: emaillist })
    .then(function (data) {

      if (data.data === true) {
        alert("Email sent successfully")
        setstatus(false)
      }
      else {
        alert("failed")
        setstatus(false)
      }
    })
  }


  return (
    <div>
      <div className="bg-blue-950 text-white text-center" >
        <h1 className="text-2xl font-medium px-5 py-3">BulkMail</h1>
      </div>
      <div className="bg-blue-800 text-white text-center" >
        <h1 className=" font-medium px-5 py-3">We can help your business with sending multiple emails at once</h1>
      </div>
      <div className="bg-blue-600 text-white text-center" >
        <h1 className=" font-medium px-5 py-3">Drag and drop</h1>
      </div>
      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
        <textarea className="w-[80%] h-32 py-2 outline-none px-2 border border-black rounded-md" placeholder="Enter the email text ..." onChange={handlemsg} value={msg}></textarea>
        <div>
          <input type="file" className="border-4 border-dashed py-4 px-4 mt-5 mb-5" onChange={handlefile}></input>
        </div>
        <p>Total Emails in the file: {emaillist.length}</p>

        <button className="mt-2 bg-blue-950 py-2 px-2 text-white font-medium rounded-md w-fit" onClick={handlesend}>{status ? "sending..." : "send"}</button>
      </div>
      <div className="bg-blue-300 text-white text-center p-8" >
      </div>
      <div className="bg-blue-200 text-white text-center p-8" >
      </div>
    </div>
  );
}

export default App;
