const major = Number.parseInt(process.versions.node.split(".")[0], 10);

if (major < 20) {
  console.error(`
Groene Kansen Kaart requires Node.js 20 or newer.

  Your version: ${process.versions.node}

If you use nvm, run:
  nvm install
  nvm use

Or install Node 20+ from https://nodejs.org/
`);
  process.exit(1);
}
