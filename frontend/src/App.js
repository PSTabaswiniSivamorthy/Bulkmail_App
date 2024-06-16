import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const App = () => {
  const [msg, setMsg] = useState("Send");
  const [status, setStatus] = useState(false);
  const [buttonText, setButtonText] = useState("Send");
  const [emailList, setEmailList] = useState([]);

  const handleMsg = (evt) => {
    setMsg(evt.target.value);
  };

  const upload = () => {
    setStatus(true);
    setButtonText("Sending...");
    axios
      .post("http://localhost:5000/sendemail", {
        msg: msg,
        emailList: emailList,
      })
      .then((response) => {
        alert("Email sent successfully");
        setButtonText("Sent");
        setStatus(false);
      })
      .catch((error) => {
        alert("There was an error!", error);
        setButtonText("Error");
        setStatus(false);
      });
  };

  const handleFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils
        .sheet_to_json(worksheet, { header: 1 })
        .flat();
      
      setEmailList(emailList);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <div className="bg-blue-950 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">BulkMail</h1>
      </div>
      <div className="bg-blue-800 text-white text-center">
        <h1 className="font-medium px-5 py-3">
          We can help your Business with sending multiple emails in one shot
        </h1>
      </div>
      <div className="bg-blue-600 text-white text-center">
        <h1 className="font-medium px-5 py-3">Drag and Drop</h1>
      </div>
      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
        <textarea
          onChange={handleMsg}
          value={msg}
          className="w-[80%] h-32 py-2 outline-none px-2 border-black rounded-md"
          placeholder="Enter the email text...."
        ></textarea>
        <div className="bg-blue-400 text-white text-center">
          <input
            onChange={handleFile}
            type="file"
            className="border-4 border-dashed py-4 px-4 mt-5 mb-5"
          ></input>
        </div>
        <p>Total Emails in the file: {emailList.length}</p>
        <button
          onClick={upload}
          className="mt-2 bg-blue-950 py-2 px-2 text-white font-medium rounded-md w-fit"
          disabled={status}
        >
          {buttonText}
        </button>
      </div>
      <div className="bg-blue-300 text-white text-center p-8"></div>
      <div className="bg-blue-200 text-white text-center p-8"></div>
    </div>
  );
};

export default App;
