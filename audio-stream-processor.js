class AudioStreamProcessor extends AudioWorkletProcessor
{
    constructor()
    {
        super();

        this.port.onmessage = (e) =>
        {
            console.log(e.data);
        };

        this.phase = 0;
    }

    process(inputs, outputs, parameters)
    {
        if (outputs.length != 1)
        {
            throw new Error("The number of outputs must be one");
        }

        if (outputs[0].length != 2)
        {
            throw new Error("The number of output channels must be two.");
        }

        const left = outputs[0][0];
        const right = outputs[0][1];

        for (var t = 0; t < left.length; t++)
        {
            left[t] = Math.random() - 0.5;
        }

        for (var t = 0; t < right.length; t++)
        {
            right[t] = 0.9 * Math.sin(this.phase);
            this.phase += 2 * Math.PI * 500 / 48000;
        }

        return true;
    }
}

registerProcessor("audio-stream-processor", AudioStreamProcessor);
