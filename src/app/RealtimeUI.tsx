import React, { useState, useEffect } from "react";
import { start_realtime, resetAudio, InputState, eventEmitter } from "./main";

const RealtimeUI = () => {
  const [inputState, setInputState] = useState<InputState>(
    InputState.ReadyToStart
  );
  const [receivedText, setReceivedText] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<string>("");

  useEffect(() => {
    const handleTextUpdate = (newText: string) => {
      setCurrentLine((prevLine) => {
        const updatedLine = prevLine + newText;
        if (newText.includes("\n")) {
          setReceivedText((prevText) => [...prevText, updatedLine.trim()]);
          return "";
        }
        return updatedLine;
      });
    };

    eventEmitter.on("textUpdate", handleTextUpdate);

    return () => {
      eventEmitter.off("textUpdate", handleTextUpdate);
    };
  }, []);

  const handleStartClick = async () => {
    setInputState(InputState.Working);
    try {
      await start_realtime();
      setInputState(InputState.ReadyToStop);
    } catch (error) {
      console.log(error);
      setInputState(InputState.ReadyToStart);
    }
  };

  const handleStopClick = async () => {
    setInputState(InputState.Working);
    try {
      await resetAudio(false);
      setInputState(InputState.ReadyToStart);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-6 overflow-y-auto p-4 bg-gray-200 border border-blue-500 rounded-lg mr-8">
        {receivedText.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
      <div className="flex-2 flex flex-col justify-center items-end">
        <div className="flex flex-col mb-4 w-full">
          <input
            type="text"
            className="rounded-lg border border-transparent p-3 text-lg font-medium bg-gray-200 mb-2 transition-colors hover:border-blue-500 focus:outline-none focus:ring-4"
            value={currentLine}
            readOnly
          />
        </div>
        <div className="flex gap-2 mb-4">
          <button
            className="rounded-lg border border-transparent p-3 text-lg font-medium bg-blue-600 text-white transition-colors hover:border-blue-500 focus:outline-none focus:ring-4 disabled:border-gray-400 disabled:bg-gray-300 disabled:text-gray-600"
            onClick={handleStartClick}
            disabled={inputState !== InputState.ReadyToStart}
          >
            Start
          </button>
          <button
            className="rounded-lg border border-transparent p-3 text-lg font-medium bg-red-600 text-white transition-colors hover:border-red-500 focus:outline-none focus:ring-4 disabled:border-gray-400 disabled:bg-gray-300 disabled:text-gray-600"
            onClick={handleStopClick}
            disabled={inputState !== InputState.ReadyToStop}
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealtimeUI;
