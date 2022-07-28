import { startAudioStream } from "./audio-stream.js";

window.addEventListener("load", function()
{
    var btn1 = document.getElementById("btn1");

    btn1.addEventListener("click", async function()
    {
        startAudioStream().then(x => console.log(x));
    });
});
