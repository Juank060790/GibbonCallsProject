// import React from "react";
// import { db, myFirebase } from "../Firebase/firebase";
// export default function Upload() {
//   const [file, setFile] = React.useState(null);

//   const onFileChange = (e) => {
//     setFile(e.target.files[0]);
//     console.log(e.target.files[0]);
//   };

//   const UploadFile = async (e) => {
//     e.preventDefault();
//     const storageRef = myFirebase.storage().ref();
//     const fileRef = storageRef.child(file.name);
//     await fileRef.put(file);
//     db.collection("calls")
//       .doc("1627622832156")
//       .update({
//         name: file.name,
//         spectogram: await fileRef.getDownloadURL(),
//       });
//   };
//   return (
//     <div>
//       <input type="file" onChange={onFileChange} />
//       <button onClick={UploadFile}>Upload</button>
//     </div>
//   );
// }
