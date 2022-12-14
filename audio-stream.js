export async function AudioStream_start()
{
    await AudioStream.start();
}

export function AudioStream_enqueue(left, right)
{
    AudioStream.enqueue(left, right);
}

export function AudioStream_queueNeeded()
{
    return AudioStream.queueNeeded;
}

export function AudioStream_getSampleRate()
{
    return AudioStream.sampleRate;
}

class AudioStream
{
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

            processorOptions:
            {
                bufferLength: 0.3 * AudioStream.sampleRate,
                maxBufferLength: 3 * AudioStream.sampleRate
            }
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
