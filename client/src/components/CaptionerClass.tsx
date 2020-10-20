import React from 'react';
import { Textarea } from "@chakra-ui/core"

// import connection, { socket, StringBinding } from '../services/sharedb'

// interface Props {};
// interface State {};

// export default class Captioner extends React.Component<Props, State> {
//   doc: any = null;
//   binding: StringBinding | null = null;
//   textInput: HTMLTextAreaElement | null = null;

//   scrollToBottom = () => {
//     if (this.textInput) {
//       this.textInput.scrollTop = this.textInput.scrollHeight;
//     }
//   }

//   componentDidMount() {

//     // const scrollToBottom = this.scrollToBottom;
//     // connection.on('receive', function(request: any) {
//     //   var data = request.data;
//     //   if (data.ping) {
//     //     request.data = null;
//     //   }
//     //   if (request.data) {
//     //     scrollToBottom()
//     //   }
//     // });

//     socket.onopen = () => {
//       console.log('WebSocket Connected');
//       this.doc = connection.get('examples', 'textarea');
//       this.doc.subscribe((err: any) => {
//         if (err) {
//           console.log('Something bad happened');
//           throw err;
//         }
//         console.log('Live Document Connected!')
//         this.binding = new StringBinding(this.textInput, this.doc);
//         this.binding.setup();
//       });
//     };

//     socket.onclose = () => {
//       console.log('WebSocket Closed');
//       // status.innerHTML = "Closed"
//       // element.style.backgroundColor = "gray";
//     };

//     socket.onerror = () => {
//       console.log('WebSocket Error');
//       // status.innerHTML = "Error"
//       // element.style.backgroundColor = "red";
//     }

//     // this.socket.onmessage = (event) => {
//     //   console.debug("WebSocket message received:", event);
//     // };
//   }

//   render() {
//     return (
//       <Textarea
//         id="other-pad"
//         ref={ref => this.textInput = ref}
//         placeholder="Here is a sample placeholder"
//         resize="none"
//         h="100%"
//         w="100%"
//         m="2"
//       />

//       // <div>
//       //   <div className="caption whole-body">
//       //     <div className="caption-body">
//       //       <textarea
//       //         id="other-pad"
//       //         ref={ref => this.textInput = ref}
//       //         // className={padClass}
//       //         placeholder="Text will stream when audio begins..."
//       //         defaultValue="Connecting..."
//       //         // readOnly={!isAgent}
//       //         // onChange={this.scrollToBottom()}
//       //       />
//       //     </div>
//       //   </div>
//       // </div>
//     );
//   }
// }
