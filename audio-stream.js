export class AudioStream
{
    static node = null;

    static async start()
    {
        const ac = new AudioContext();

        await ac.audioWorklet.addModule("audio-stream-processor.js");

        const options =
        {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2]
        };

        AudioStream.node = new AudioWorkletNode(ac, "audio-stream-processor", options);

        AudioStream.node.connect(ac.destination);

        return ac.sampleRate;
    }

    static queue()
    {
        if (AudioStream.node == null)
        {
            throw new Error("The start method must be called before the queue method.");
        }

        AudioStream.node.port.postMessage("ping");
    }
}
