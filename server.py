from http.server import SimpleHTTPRequestHandler, HTTPServer
import os


class handler(SimpleHTTPRequestHandler):
    def do_PUT(self):
        """Save a file following a HTTP PUT request"""
        filename = os.getcwd() + self.path
        print(filename)
        file_length = int(self.headers['Content-Length'])
        
        with open(filename, 'wb') as output_file:
            output_file.write(self.rfile.read(file_length))
        self.send_response(201, 'Created')
        self.end_headers()
        reply_body = 'Saved "%s"\n' % filename
        self.wfile.write(reply_body.encode('utf-8'))


with HTTPServer(('localhost', 8000), handler) as server:
    server.serve_forever()
