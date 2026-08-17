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
    // 21st.dev uses tRPC or React Server Components, the code might be in a script tag
    // let's just search for the component names
    console.log(`URL: ${url} - HTML length: ${html.length}`);
  } catch (e) {
    console.log(e);
  }
}

urls.forEach(fetchComponent);
