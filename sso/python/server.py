from http.server import HTTPServer, BaseHTTPRequestHandler
from fastcomments_sso import get_fast_comments_config_with_secure_sso_payload

PORT = 8000


class Handler(BaseHTTPRequestHandler):

    # noinspection PyPep8Naming
    def do_GET(self):
        sso_json = get_fast_comments_config_with_secure_sso_payload(True)

        self.send_response(200)
        self.end_headers()

        page_html = f'''
        <!DOCTYPE html>
        <html>
          <head>
            <title><%= title %></title>
            <link rel='stylesheet' href='/stylesheets/style.css' />
            <meta name='viewport' content='width=device-width'>
          </head>
          <body>
            <h1>FastComments SSO Example</h1>
        
            <script src="https://cdn.fastcomments.com/js/embed-v2.min.js"></script>
            <div id="fastcomments-widget"></div>
            <script>
                window.FastCommentsUI(document.getElementById('fastcomments-widget'), {sso_json});
            </script>
          </body>
        </html>
        '''

        self.wfile.write(page_html.encode('utf-8'))


httpd = HTTPServer(('localhost', PORT), Handler)
httpd.serve_forever()
