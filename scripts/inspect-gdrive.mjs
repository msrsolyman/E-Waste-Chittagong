async function inspect() {
  const url = "https://drive.google.com/drive/folders/1AZ1LG2_bMi7fGbf6P9y2gFhYMe8e9pY9?usp=sharing";
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  console.log("Status:", res.status);
  const html = await res.text();
  console.log("HTML length:", html.length);

  // Search for file names or items in Google Drive folder HTML
  const regex = /\["([a-zA-Z0-9_-]{28,})",\["([^"]+\.(jpg|jpeg|png|webp|mp4|mov|webm))"/gi;
  const matches = [...html.matchAll(regex)];
  console.log("Matched media items:", matches.length);
  for (const m of matches) {
    console.log("- ID:", m[1], "Name:", m[2]);
  }

  // Also search for general title / items in initial data
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  console.log("Folder title:", titleMatch ? titleMatch[1] : "Unknown");
}
inspect().catch(console.error);
