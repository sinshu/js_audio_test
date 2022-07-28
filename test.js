import { AudioStream } from "./audio-stream.js";

window.addEventListener("load", function()
{
    var btn1 = document.getElementById("btn1");
    var btn2 = document.getElementById("btn2");

    btn1.addEventListener("click", async function()
    {
        AudioStream.start().then(x => console.log(x));
    });

    btn2.addEventListener("click", async function()
    {
        AudioStream.queue();
    });
});
