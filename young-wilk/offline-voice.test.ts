import { chooseVoiceProfile, canUseOfflineNeuralVoice, voiceNeedsDownload } from "./offline-voice-models";
import { splitForSpeech } from "./voice";

const crisis = chooseVoiceProfile("crisis");
if (crisis.speed >= 1) throw new Error("Crisis voice should be slower");

if (!voiceNeedsDownload(undefined)) throw new Error("Missing voice pack should require download");
if (!canUseOfflineNeuralVoice({ candidateId:"x", installed:true, verifiedOnDevice:false, selected:true })) {
  throw new Error("Installed local voice should be usable offline");
}

const chunks = splitForSpeech("Pierwsze zdanie. Drugie zdanie jest trochę dłuższe.", 25);
if (chunks.length < 2) throw new Error("Speech splitting should produce multiple chunks");
