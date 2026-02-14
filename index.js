const memes = document.querySelector("#memes");
const form = document.querySelector("#form");
const page = document.querySelector("#page");
const memeContent = document.querySelector("#memeContent");

let memesArray = [];
let currentlyCreating = "";
fetch("https://api.imgflip.com/get_memes")
  .then((blob) => {
    return blob.json();
  })
  .then((data) => {
    memesArray = [...data?.data?.memes];
    viewHandler();
  });

function viewHandler() {
  let html = memesArray
    .map((ele, i) => {
      return `
                    <div class="card p-2 mb-2">
                        <img class="mb-2 memeImg" src=${ele.url}>
                        <p class="lead mb-2">${ele.name}</p>
                        <div>
                            <button id=${i} class="btn btn-success" onclick=toggleForm(this.id)>+Add</button>
                        </div>
                </div>
            `;
    })
    .join("");
  memes.innerHTML = html;
}

function toggleForm(id) {
  if (id != undefined) {
    console.log(id);
    console.log(memesArray[id]);
    form.style.transform = "scale(1)";
    page.style.filter = "blur(10px)";
    document.querySelector(".inp").value = memesArray[id].id;
    let i = 0;
    let html = "";
    while (i < memesArray[id].box_count) {
      html += `
        <input class="inp" name="text${i}" type="text" placeholder="Text ${
        i + 1
      }">
        `;
      i++;
    }
    memeContent.innerHTML = html;
  } else {
  }
}

function cancel() {
  form.style.transform = "scale(0)";
  page.style.filter = "blur(0px)";
}
let str = "";

function addMeme() {
  let inps = document.querySelectorAll(".inp");
  let formBody = [];
  inps.forEach((ele) => {
    if (ele.name.includes("text")) {
      let encodeValue = encodeURIComponent(ele.value);
      let encodeKey = encodeURIComponent(
        `boxes[${ele.name.split("text")[1]}][text]`
      );
      formBody.push(encodeKey + "=" + encodeValue);
    } else {
      let encodeValue = encodeURIComponent(ele.value);
      let encodeKey = encodeURIComponent(ele.name);
      formBody.push(encodeKey + "=" + encodeValue);
    }
  });

  formBody = formBody.join("&");
  // console.log(formBody);
  fetch("https://api.imgflip.com/caption_image",{
    method:"POST",
    headers:{
      "content-type":"application/x-www-form-urlencoded"
    },
    body:formBody
  }).then(blob=>{
    return blob.json()
  }).then(data=>{
    console.log(data);
    
  })
}
