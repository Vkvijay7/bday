const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, '..', 'public', 'sky.glb');

if (!fs.existsSync(glbPath)) {
  console.error('GLB file not found at', glbPath);
  process.exit(1);
}

const buffer = fs.readFileSync(glbPath);

// GLB header: magic (4 bytes), version (4 bytes), length (4 bytes)
const magic = buffer.toString('utf8', 0, 4);
const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);

console.log('GLB Header:');
console.log('  Magic:', magic);
console.log('  Version:', version);
console.log('  Total Length:', length);

if (magic !== 'glTF') {
  console.error('Invalid GLB file magic.');
  process.exit(1);
}

// First chunk: chunkLength (4 bytes), chunkType (4 bytes)
const chunkLength = buffer.readUInt32LE(12);
const chunkType = buffer.readUInt32LE(16);

// Chunk types: 0x4E4F534A is 'JSON'
const chunkTypeStr = buffer.toString('utf8', 16, 20);
console.log('First Chunk:');
console.log('  Length:', chunkLength);
console.log('  Type:', chunkTypeStr);

if (chunkTypeStr !== 'JSON') {
  console.error('First chunk is not JSON.');
  process.exit(1);
}

const jsonSlice = buffer.toString('utf8', 20, 20 + chunkLength);
const gltf = JSON.parse(jsonSlice);

console.log('\nGLTF Nodes:');
if (gltf.nodes) {
  gltf.nodes.forEach((node, idx) => {
    console.log(`Node ${idx}: ${node.name || 'Unnamed'}`);
    if (node.translation) console.log('  Translation:', node.translation);
    if (node.rotation) console.log('  Rotation:', node.rotation);
    if (node.scale) console.log('  Scale:', node.scale);
    if (node.mesh !== undefined) console.log('  Mesh index:', node.mesh);
  });
} else {
  console.log('No nodes found.');
}

if (gltf.meshes) {
  console.log('\nGLTF Meshes:');
  gltf.meshes.forEach((mesh, idx) => {
    console.log(`Mesh ${idx}: ${mesh.name || 'Unnamed'}`);
  });
}
