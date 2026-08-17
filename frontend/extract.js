const fs = require('fs');
const urls = [
  "https://21st.dev/community/components?preview=%2F%40easemize%2Fcomponents%2Fspotlight-card",
  "https://21st.dev/@kokonutd/components/button-colorful",
  "https://21st.dev/community/components?preview=%2F%40ibelick%2Fcomponents%2Ftailwind-css-background-snippet",
  "https://21st.dev/community/components?preview=%2F%40minhxthanh%2Fcomponents%2Fgradient-menu"
];

async function fetchComponent(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const regex = /"code":"([^"]+)"/g;
    let match;
    console.log(`URL: ${url}`);
    while ((match = regex.exec(html)) !== null) {
        // Just print the first 100 chars to see if we get it
        console.log(match[1].substring(0, 100).replace(/\\n/g, '\n'));
        break;
    }
  } catch (e) {
    console.log(e);
  }
}

urls.forEach(fetchComponent);
