//const express = require('express');
//const ffmpeg = require('fluent-ffmpeg');
//const cors = require('cors');
//const fs = require('fs');
//const path = require('path');
//
//const app = express();
//const port = 8000;
//
// Replace with your actual RTSP URL
//const rtspUrl = 'rtsp://admin:admin%401234@10.0.70.3'; // %40 is @ encoded
//
// Enable CORS
//app.use(cors());
//
// Ensure HLS output folder exists
//const hlsFolder = path.join(__dirname, 'hls');
//if (!fs.existsSync(hlsFolder)) {
//  fs.mkdirSync(hlsFolder);
//}
//
// Start FFmpeg process at server startup
//ffmpeg(rtspUrl)
//  .inputOptions('-rtsp_transport tcp') // use TCP for RTSP
//  .outputOptions([
//    '-f hls',
//    '-hls_time 2', // duration of each segment
//    '-hls_list_size 5', // keep last 5 segments in playlist
//    '-hls_flags delete_segments+append_list',
//    '-hls_allow_cache 0',
//    '-hls_segment_filename', path.join(hlsFolder, 'stream%03d.ts')
//  ])
//  .output(path.join(hlsFolder, 'stream.m3u8'))
//  .on('start', () => console.log('FFmpeg started'))
//  .on('error', (err) => console.error('FFmpeg error:', err.message))
//  .on('end', () => console.log('FFmpeg stopped'))
//  .run();
//
// Serve HLS files (playlist + segments)
//app.use('/live', express.static(hlsFolder));
//
// Start Express server
//app.listen(port, () => {
//  console.log(`✅ Server running at http://localhost:${port}`);
//  console.log(`📺 Access HLS stream at http://localhost:${port}/live/stream.m3u8`);
//});
//
//



const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8000;

// Replace with your actual RTSP URL
const rtspUrl = 'rtsp://admin:admin%401234@10.0.70.3'; // %40 is @ encoded

// Enable CORS
app.use(cors());

// Ensure HLS output folder exists
const hlsFolder = path.join(__dirname, 'hls');
if (!fs.existsSync(hlsFolder)) {
  fs.mkdirSync(hlsFolder);
}

// Start FFmpeg process at server startup
ffmpeg(rtspUrl)
  .inputOptions('-rtsp_transport udp') // Use UDP for RTSP for lower latency
  .outputOptions([
    '-f hls',
    '-hls_time 1', // 1-second segments for minimal latency
    '-hls_list_size 3', // Keep only the last 3 segments in playlist
    '-hls_flags delete_segments+append_list',
    '-hls_allow_cache 0', // Disable caching to reduce delay
    '-hls_segment_filename', path.join(hlsFolder, 'stream%03d.ts'),
    '-max_delay', '500000', // Lower delay for quicker stream start
  ])
  .output(path.join(hlsFolder, 'stream.m3u8'))
  .on('start', () => console.log('FFmpeg started'))
  .on('error', (err) => console.error('FFmpeg error:', err.message))
  .on('end', () => console.log('FFmpeg stopped'))
  .run();

// Serve HLS files (playlist + segments)
app.use('/live', express.static(hlsFolder));

// Start Express server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`📺 Access HLS stream at http://localhost:${port}/live/stream.m3u8`);
});




