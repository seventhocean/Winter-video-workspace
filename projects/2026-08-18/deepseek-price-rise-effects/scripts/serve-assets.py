#!/usr/bin/env python3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

SOURCE = Path("/Users/winter/Movies/Videos/8月19Deepseek涨价/初剪辑版本.mov")

class RangeHandler(BaseHTTPRequestHandler):
    def _headers(self):
        size = SOURCE.stat().st_size
        start, end, status = 0, size - 1, 200
        requested = self.headers.get("Range")
        if requested and requested.startswith("bytes="):
            first, _, last = requested[6:].partition("-")
            start = int(first) if first else 0
            end = min(int(last), size - 1) if last else size - 1
            status = 206
        self.send_response(status)
        self.send_header("Content-Type", "video/quicktime")
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Access-Control-Allow-Origin", "*")
        if status == 206:
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.end_headers()
        return start, end

    def do_HEAD(self):
        if self.path != "/source.mov":
            self.send_error(404)
            return
        self._headers()

    def do_GET(self):
        if self.path != "/source.mov":
            self.send_error(404)
            return
        start, end = self._headers()
        with SOURCE.open("rb") as handle:
            handle.seek(start)
            remaining = end - start + 1
            while remaining > 0:
                chunk = handle.read(min(1024 * 1024, remaining))
                if not chunk:
                    break
                self.wfile.write(chunk)
                remaining -= len(chunk)

print("素材服务：http://127.0.0.1:8769/source.mov", flush=True)
ThreadingHTTPServer(("127.0.0.1", 8769), RangeHandler).serve_forever()
