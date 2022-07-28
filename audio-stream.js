export async function startAudioStream()
{
    const audioContext = new AudioContext();

    await audioContext.audioWorklet.addModule("audio-stream-processor.js");

    const options =
    {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2]
    };

    const audioStreamNode = new AudioWorkletNode(audioContext, "audio-stream-processor", options);

    audioStreamNode.connect(audioContext.destination);

    return audioContext.sampleRate;
}
