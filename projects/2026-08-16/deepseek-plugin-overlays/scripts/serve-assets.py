from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path("/Users/winter/Movies/Videos/8月16 Deepseek插件")


class CorsHandler(SimpleHTTPRequestHandler):
    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Range")
        self.send_header("Access-Control-Expose-Headers", "Content-Length, Content-Range")
        super().end_headers()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8768), lambda *args, **kwargs: CorsHandler(*args, directory=str(ROOT), **kwargs))
    print("素材服务：http://127.0.0.1:8768")
    server.serve_forever()
