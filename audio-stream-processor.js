class AudioStreamProcessor extends AudioWorkletProcessor
{
    constructor(options)
    {
        super(options);

        this.blockQueue = new Array();
        this.currentBlock = null;
        this.currentBlockRead = 0;

        this.bufferLength = options.processorOptions.bufferLength;
        this.maxBufferLength = options.processorOptions.maxBufferLength;
        this.queueNeeded = false;

        this.port.onmessage = (e) =>
        {
            var margin = 0;
            this.blockQueue.forEach(block =>
            {
                margin += block[0].length;
            });

            if (margin > this.maxBufferLength)
            {
                throw new Error("Too many blocks were queued.");
            }

            this.blockQueue.push(e.data);
        };
    }

    process(inputs, outputs, parameters)
    {
        if (outputs.length != 1)
        {
            throw new Error("The number of outputs must be one.");
        }

        if (outputs[0].length != 2)
        {
            throw new Error("The number of output channels must be two.");
        }

        const outputLeft = outputs[0][0];
        const outputRight = outputs[0][1];    
        const outputLength = outputLeft.length;

        var outputWrote = 0;

        while (outputWrote < outputLength)
        {
            if (this.currentBlock == null)
            {
                if (this.blockQueue.length == 0)
                {
                    outputLeft.fill(0, outputWrote);
                    outputRight.fill(0, outputWrote);
                    break;
                }

                this.currentBlock = this.blockQueue.shift();
                this.currentBlockRead = 0;
            }

            const blockLeft = this.currentBlock[0];
            const blockRight = this.currentBlock[1];
            const blockLength = blockLeft.length;

            const srcRem = blockLength - this.currentBlockRead;
            const dstRem = outputLength - outputWrote;
            const rem = Math.min(srcRem, dstRem);

            for (var t = 0; t < rem; t++)
            {
                outputLeft[outputWrote + t] = blockLeft[this.currentBlockRead + t];
                outputRight[outputWrote + t] = blockRight[this.currentBlockRead + t];
            }

            this.currentBlockRead += rem;
            outputWrote += rem;

            if (this.currentBlockRead == blockLength)
            {
                this.currentBlock = null;
                this.currentBlockRead = 0;
            }
        }

        var margin = 0;
        if (this.currentBlock != null)
        {
            margin += this.currentBlock[0].length - this.currentBlockRead;
        }
        this.blockQueue.forEach(block =>
        {
            margin += block[0].length;
        });

        const newQueueNeeded = margin < this.bufferLength;
        if (this.queueNeeded != newQueueNeeded)
        {
            this.port.postMessage(newQueueNeeded);
        }
        this.queueNeeded = newQueueNeeded;

        return true;
    }
}

registerProcessor("audio-stream-processor", AudioStreamProcessor);
