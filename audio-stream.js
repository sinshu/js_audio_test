export class AudioStream
{
    static latency = 0.2;
    static sampleRate = 0;
    static queueNeeded = false;

    static #node = null;

    static async start()
    {
        if (AudioStream.#node != null)
        {
            return;
        }

        const ac = new AudioContext();

        AudioStream.sampleRate = ac.sampleRate;

        await ac.audioWorklet.addModule("audio-stream-processor.js");

        const options =
        {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2],
            processorOptions: { bufferLength: AudioStream.sampleRate * AudioStream.latency }
        };

        AudioStream.#node = new AudioWorkletNode(ac, "audio-stream-processor", options);

        AudioStream.#node.port.onmessage = (e) =>
        {
            AudioStream.queueNeeded = e.data;
        };

        AudioStream.#node.connect(ac.destination);
    }

    static enqueue(left, right)
    {
        if (AudioStream.#node == null)
        {
            throw new Error("The start method must be called before the queue method.");
        }

        if (left.length != right.length)
        {
            throw new Error("The left and right block must be the same length.");
        }

        AudioStream.#node.port.postMessage([left, right]);
    }
}
