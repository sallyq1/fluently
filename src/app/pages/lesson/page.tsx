// "use client";

// import React, { useState, useEffect } from "react";
// import { Player } from "@/app/player";
// import { Recorder } from "@/app/recorder";
// import { LowLevelRTClient, SessionUpdateMessage } from "rt-client";
// import {
//   start_realtime,
//   resetAudio,
//   InputState,
//   eventEmitter,
// } from "@/app/main";
// import "@/app/globals.css";

// const LessonPage = () => {
//   const [inputState, setInputState] = useState<InputState>(
//     InputState.ReadyToStart
//   );
//   const [receivedText, setReceivedText] = useState<string[]>([]);
//   const [currentLine, setCurrentLine] = useState<string>("");

//   useEffect(() => {
//     const handleTextUpdate = (newText: string) => {
//       setCurrentLine((prevLine) => {
//         const updatedLine = prevLine + newText;
//         if (newText.includes("\n")) {
//           setReceivedText((prevText) => [...prevText, updatedLine.trim()]);
//           return "";
//         }
//         return updatedLine;
//       });
//     };

//     eventEmitter.on("textUpdate", handleTextUpdate);

//     return () => {
//       eventEmitter.off("textUpdate", handleTextUpdate);
//     };
//   }, []);

//   const handleStartClick = async () => {
//     setInputState(InputState.Working);
//     try {
//       await start_realtime();
//       setInputState(InputState.ReadyToStop);
//     } catch (error) {
//       console.log(error);
//       setInputState(InputState.ReadyToStart);
//     }
//   };

//   const handleStopClick = async () => {
//     setInputState(InputState.Working);
//     try {
//       await resetAudio(false);
//       setInputState(InputState.ReadyToStart);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="flex-6 overflow-y-auto p-4 bg-gray-200 border border-blue-500 rounded-lg mr-8">
//         {receivedText.map((text, index) => (
//           <p key={index}>{text}</p>
//         ))}
//       </div>
//       <div className="flex-2 flex flex-col justify-center items-end">
//         <div className="flex flex-col mb-4 w-full">
//           <input
//             type="text"
//             className="rounded-lg border border-transparent p-3 text-lg font-medium bg-gray-200 mb-2 transition-colors hover:border-blue-500 focus:outline-none focus:ring-4"
//             value={currentLine}
//             readOnly
//           />
//         </div>
//         <div className="flex gap-2 mb-4">
//           <button
//             className="rounded-lg border border-transparent p-3 text-lg font-medium bg-blue-600 text-white transition-colors hover:border-blue-500 focus:outline-none focus:ring-4 disabled:border-gray-400 disabled:bg-gray-300 disabled:text-gray-600"
//             onClick={handleStartClick}
//             disabled={inputState !== InputState.ReadyToStart}
//           >
//             Start
//           </button>
//           <button
//             className="rounded-lg border border-transparent p-3 text-lg font-medium bg-red-600 text-white transition-colors hover:border-red-500 focus:outline-none focus:ring-4 disabled:border-gray-400 disabled:bg-gray-300 disabled:text-gray-600"
//             onClick={handleStopClick}
//             disabled={inputState !== InputState.ReadyToStop}
//           >
//             Stop
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LessonPage;

'use client';
import { useState } from 'react';

export default function Chatbot() {
  const [chatHistory, setChatHistory] = useState<{ user: string; bot: string }[]>([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false); // To manage bot's response delay

  // Predefined sequence of user messages
  const userMessages = [
    "Hola",
    "Bien, y tu?",
    "My favorite fruit is apples"
  ];

  // Predefined bot responses
  const predefinedResponses: { [key: string]: string } = {
    "Hola": "Como estas?",
    "Bien, y tu?": "Muy bien, gracias! Hoy aprenderemos sobre frutas en español. ¿Cuál es tu fruta favorita?",
    "My favorite fruit is apples": "Apples in Spanish is called 'manzana'.",
  };

  // Function to simulate recording a voice message
  const recordMessage = () => {
    if (messageIndex >= userMessages.length) return;

    // Set recording state to true and simulate recording for 2 seconds
    setRecording(true);
    setTimeout(() => {
      const userMessage = userMessages[messageIndex];
      
      // Update chat history with user's message
      setChatHistory([...chatHistory, { user: userMessage, bot: '...' }]); // Bot's response will come later

      setRecording(false); // End recording after 2 seconds
      setLoading(true); // Show loading while bot is "thinking"

      // After 2 more seconds, show the bot's response
      setTimeout(() => {
        const botResponse = predefinedResponses[userMessage] || "I don't understand. Please follow the conversation flow.";

        // Update the chat history with the bot's actual response
        setChatHistory(prevHistory => prevHistory.map((chat, index) =>
          index === prevHistory.length - 1 ? { ...chat, bot: botResponse } : chat
        ));

        setMessageIndex(messageIndex + 1); // Move to the next message in the sequence
        setLoading(false); // Stop showing loading
      }, 2000); // 2-second delay for bot response
    }, 2000); // 2-second delay for recording
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-4">Voice-Recording Chatbot</h1>

      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <div className="h-64 overflow-y-auto border rounded-lg p-4">
            {chatHistory.map((chat, index) => (
              <div key={index} className="mb-4">
                <p className="font-bold">User:</p>
                <p>{chat.user}</p>
                <p className="font-bold mt-2">Bot:</p>
                <p>{chat.bot}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={recordMessage}
          className={`w-full py-2 rounded-lg ${recording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
          disabled={recording || loading} // Disable button while recording or bot is responding
        >
          {recording ? 'Recording...' : loading ? 'Bot is typing...' : 'Record'}
        </button>
      </div>
    </div>
  );
}
