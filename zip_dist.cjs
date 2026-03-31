const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream(path.join(__dirname, 'dist_fixed.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('Archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err) { throw err; });
archive.pipe(output);

// Append files from a sub-directory and naming it `dist` within the archive
archive.directory('dist/', false);
archive.finalize();
