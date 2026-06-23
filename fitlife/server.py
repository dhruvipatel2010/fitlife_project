import http.server
import socketserver

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    pass

# Force correct MIME types
Handler.extensions_map.update({
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.html': 'text/html',
})

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Serving at port", PORT)
    httpd.serve_forever()
