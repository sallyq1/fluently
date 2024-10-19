// src/app/components/main.ts
import { LowLevelRTClient, SessionUpdateMessage } from "rt-client";
import { Player } from "./player";
import { Recorder } from "./recorder";
import { EventEmitter } from "eventemitter3";

export const eventEmitter = new EventEmitter();

let realtimeStreaming: LowLevelRTClient;
let audioRecorder: Recorder;
let audioPlayer: Player;

export async function start_realtime() {
  const endpoint = process.env.NEXT_PUBLIC_AZURE_ENDPOINT!;
  const apiKey = process.env.NEXT_PUBLIC_AZURE_APIKEY!;
  const deploymentOrModel = process.env.NEXT_PUBLIC_AZURE_DEPLOYMENT!;

  realtimeStreaming = new LowLevelRTClient(
    new URL(endpoint),
    { key: apiKey },
    { deployment: deploymentOrModel }
  );

  try {
    console.log("sending session config");
    await realtimeStreaming.send(createConfigMessage());
  } catch (error) {
    console.log(error);
    eventEmitter.emit(
      "textUpdate",
      "[Connection error]: Unable to send initial config message. Please check your endpoint and authentication details.\n"
    );
    return;
  }
  console.log("sent");
  await Promise.all([resetAudio(true), handleRealtimeMessages()]);
}

function createConfigMessage(): SessionUpdateMessage {
  return {
    type: "session.update",
    session: {
      turn_detection: {
        type: "server_vad",
      },
      input_audio_transcription: {
        model: "whisper-1",
      },
    },
  };
}

async function handleRealtimeMessages() {
  for await (const message of realtimeStreaming.messages()) {
    let consoleLog = "" + message.type;

    switch (message.type) {
      case "session.created":
        eventEmitter.emit("textUpdate", "<< Session Started >>\n");
        break;
      case "response.audio_transcript.delta":
        eventEmitter.emit("textUpdate", message.delta);
        break;
      case "response.audio.delta":
        const binary = atob(message.delta);
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        const pcmData = new Int16Array(bytes.buffer);
        audioPlayer.play(pcmData);
        break;
      case "input_audio_buffer.speech_started":
        eventEmitter.emit("textUpdate", "<< Speech Started >>\n");
        audioPlayer.clear();
        break;
      case "conversation.item.input_audio_transcription.completed":
        eventEmitter.emit("textUpdate", " User: " + message.transcript + "\n");
        break;
      case "response.done":
        eventEmitter.emit("textUpdate", "--------------------\n");
        break;
      default:
        consoleLog = JSON.stringify(message, null, 2);
        break;
    }
    if (consoleLog) {
      console.log(consoleLog);
    }
  }
  resetAudio(false);
}

let recordingActive: boolean = false;
let buffer: Uint8Array = new Uint8Array();

function combineArray(newData: Uint8Array) {
  const newBuffer = new Uint8Array(buffer.length + newData.length);
  newBuffer.set(buffer);
  newBuffer.set(newData, buffer.length);
  buffer = newBuffer;
}

function processAudioRecordingBuffer(data: Buffer) {
  const uint8Array = new Uint8Array(data);
  combineArray(uint8Array);
  if (buffer.length >= 4800) {
    const toSend = new Uint8Array(buffer.slice(0, 4800));
    buffer = new Uint8Array(buffer.slice(4800));
    const regularArray = String.fromCharCode(...toSend);
    const base64 = btoa(regularArray);
    if (recordingActive) {
      realtimeStreaming.send({
        type: "input_audio_buffer.append",
        audio: base64,
      });
    }
  }
}

export async function resetAudio(startRecording: boolean) {
  recordingActive = false;
  if (audioRecorder) {
    audioRecorder.stop();
  }
  if (audioPlayer) {
    audioPlayer.clear();
  }
  audioRecorder = new Recorder(processAudioRecordingBuffer);
  audioPlayer = new Player();
  audioPlayer.init(24000);
  if (startRecording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioRecorder.start(stream);
    recordingActive = true;
  }
}

export enum InputState {
  Working,
  ReadyToStart,
  ReadyToStop,
}
