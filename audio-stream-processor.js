class AudioStreamProcessor extends AudioWorkletProcessor
{
    constructor()
    {
        super();

        this.phase = 0;
    }

    process (inputs, outputs, parameters)
    {
        if (outputs.length == 0)
        {
            return true;
        }

        const output = outputs[0];

        if (output.length == 0)
        {
            return true;
        }

        if (output.length == 1)
        {
            const mono = output[0];

            for (var t = 0; t < mono.length; t++)
            {
                mono[t] = Math.random() - 0.5;
            }

            return true;
        }

        const left = output[0];
        const right = output[1];

        for (var t = 0; t < left.length; t++)
        {
            left[t] = Math.random() - 0.5;
        }

        for (var t = 0; t < right.length; t++)
        {
            right[t] = 0.9 * Math.sin(this.phase);
            this.phase += 2 * Math.PI * 500 / 48000;
        }

        for (var ch = 2; ch < output.length; ch++)
        {
            output[ch].fill(0);
        }

        return true;
    }
}

registerProcessor("audio-stream-processor", AudioStreamProcessor);
