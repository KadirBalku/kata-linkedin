const url2 = "https://source.unsplash.com/random/300×300";

async function a() {
  const response = await fetch(url2);
  console.log(response.url);
}

a();
