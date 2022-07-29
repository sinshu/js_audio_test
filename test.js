import { AudioStream } from "./audio-stream.js";

var phase = 0;

window.addEventListener("load", function()
{
    var btn1 = document.getElementById("btn1");
    var btn2 = document.getElementById("btn2");

    btn1.addEventListener("click", async function()
    {
        btn1.disabled = true;

        await AudioStream.start();

        setInterval(() =>
        {
            const left = new Float32Array(4096);
            const right = new Float32Array(4096);

            if (AudioStream.queueNeeded)
            {
                for (var t = 0; t < left.length; t++)
                {
                    left[t] = 0.1 * (Math.random() - 0.5);
                    right[t] = 0.9 * Math.sin(phase);
                    phase += 2 * Math.PI * 440 / 48000;
                }

                AudioStream.enqueue(left, right);
            }
        }, 10);
    });

    btn2.addEventListener("click", async function()
    {
        console.log("OOPS");
    });
});
