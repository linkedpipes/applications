# Pre-requisites:
# python3 -m pip install selenium
# python3 -m pip install urllib3

from selenium.webdriver.remote import webdriver
import base64
import http.client
import logging
import socket
import inspect
import string
from selenium.webdriver.remote import utils
import urllib.request
from selenium.webdriver.remote.command import Command
from selenium.webdriver.remote.errorhandler import ErrorCode
from selenium.webdriver.remote.webdriver import RemoteConnection

try:
    from urllib import parse
except ImportError:
    import urlparse as parse

LOGGER = logging.getLogger(__name__)


class BsRemoteConnection(RemoteConnection):
    """
    A connection with the Remote WebDriver server.
    Communicates with the server using the WebDriver wire protocol:
    http://code.google.com/p/selenium/wiki/JsonWireProtocol
    """

    def __init__(self, remote_server_addr, keep_alive=True, resolve_ip=True):
        # Attempt to resolve the hostname and get an IP address.
        super(BsRemoteConnection, self).__init__(remote_server_addr)
        self.keep_alive = keep_alive
        parsed_url = parse.urlparse(remote_server_addr)
        addr = ""
        try:
            netloc = socket.gethostbyname(parsed_url.hostname)
            addr = netloc
            if parsed_url.port:
                netloc += ':%d' % parsed_url.port
            if parsed_url.username:
                auth = parsed_url.username
                if parsed_url.password:
                    auth += ':%s' % parsed_url.password
                netloc = '%s@%s' % (auth, netloc)
        except socket.gaierror:
            LOGGER.info('Could not get IP address for host: %s' %
                        parsed_url.hostname)

        self._conn = http.client.HTTPConnection(
            str(addr), str(parsed_url.port or 80))

    def _request(self, arg1, arg2=None, body=None, data=None, method=None):
        """
        Send an HTTP request to the remote server.
        :Args:
         - method - A string for the HTTP method to send the request with.
         - url - The URL to send the request to.
         - body - The message body to send.
        :Returns:
          A dictionary with the server's parsed JSON response.
        """
        if method == None:
            method = arg1
            url = arg2
        else:
            url = arg1
        if body == None:
            body = data

        LOGGER.debug('%s %s %s' % (method, url, body))

        parsed_url = parse.urlparse(url)
        headers = {}
        headers["Connection"] = "Keep-Alive"
        headers[method] = parsed_url.path
        headers["User-Agent"] = "Python http auth"
        headers["Content-type"] = "text/html;charset=\"UTF-8\""
        headers["Connection"] = "keep-alive"

        # for basic auth
        if parsed_url.username:
            credentials = '%s:%s' % (parsed_url.username, parsed_url.password)
            auth = base64.standard_b64encode(
                credentials.encode()).decode().replace('\n', '')
            # Authorization header
            headers["Authorization"] = "Basic %s" % auth

        self._conn.request(method, parsed_url.path, body, headers)
        resp = self._conn.getresponse()
        statuscode = resp.status
        statusmessage = resp.msg
        LOGGER.debug('%s %s' % (statuscode, statusmessage))
        data = resp.read()
        try:
            if statuscode > 399 and statuscode < 500:
                return {'status': statuscode, 'value': data}
            body = data.decode('utf-8').replace('\x00', '').strip()
            content_type = []
            if resp.getheader('Content-Type') is not None:
                content_type = resp.getheader('Content-Type').split(';')
            if not any([x.startswith('image/png') for x in content_type]):
                try:
                    data = utils.load_json(body.strip())
                except ValueError:
                    if statuscode > 199 and statuscode < 300:
                        status = ErrorCode.SUCCESS
                    else:
                        status = ErrorCode.UNKNOWN_ERROR
                    return {'status': status, 'value': body.strip()}

                assert type(data) is dict, (
                    'Invalid server response body: %s' % body)
                # Some of the drivers incorrectly return a response
                # with no 'value' field when they should return null.
                if 'value' not in data:
                    data['value'] = None
                return data
            else:
                data = {'status': 0, 'value': body.strip()}
                return data
        finally:
            LOGGER.debug("Finished Request")


webdriver.RemoteConnection = BsRemoteConnection
