import React from 'react';
import { useDropzone } from 'react-dropzone';

function Basic(props) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path}
      {' '}
      -
      {' '}
      {file.size}
      {' '}
      bytes
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

  <Basic />;
// /**
//  * Component to handle file upload. Works for image
//  * uploads, but can be edited to work for any file.
//  */
// function FileUpload() {
//   // State to store uploaded file
//   const [file, setFile] = React.useState('');

//   // Handles file upload event and updates state
//   function handleUpload(event) {
//     setFile(event.target.files[0]);

//     // Add code here to upload file to server
//     // ...
//   }

//   return (
//     <div id="upload-box">
//       <input type="file" onChange={handleUpload} />
//       <p>
//         Filename:
//         {' '}
//         {file.name}
//       </p>
//       <p>
//         File type:
//         {' '}
//         {file.type}
//       </p>
//       <p>
//         File size:
//         {' '}
//         {file.size}
//         {' '}
//         bytes
//       </p>
//       {file && <ImageThumb image={file} />}
//     </div>
//   );
// }

// /**
//  * Component to display thumbnail of image.
//  */
// // eslint-disable-next-line react/prop-types
// const ImageThumb = ({ image }) => <img src={URL.createObjectURL(image)} alt={image.name} />;

// export default FileUpload;
