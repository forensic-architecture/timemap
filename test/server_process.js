var assert = require('assert');
var child_process = require('child_process')
var http = require('http');

var SERVER_LAUNCH_WAIT_TIME = 5 * 1000;

describe('server process', function() {
  var server_proc = null;
  var server_exited = false;

  before(function() {
    this.timeout(SERVER_LAUNCH_WAIT_TIME + 1000);

    console.log("launching server...")
    server_proc = child_process.spawn('yarn', ['dev'], {
      cwd: '.',
      stdio: 'ignore'
    });

    server_proc.on('exit', function(code, signal) {
      server_exited = true;
    });

    return (new Promise(function(resolve) {
      // @TODO Better way to detect server alive-ness than waiting?
      setTimeout(resolve, SERVER_LAUNCH_WAIT_TIME)
    }));
  });

  after(function() {
    console.log("killing server...")
    server_proc.kill('SIGKILL');
  });

  it('should launch', function() {
    assert.equal(server_exited, false);
  });

  var urls = [
    '/',
    'js/index.bundle.js'
  ];

  urls.forEach(function(url) {

    it('should respond to request for "' + url + '"', function(done) {
      this.timeout(5000);

      http.get({
        hostname: 'localhost',
        port: 8080,
        path: '/',
        agent: false
      }, function(res) {
        var result_data = '';

        if(res.statusCode != 200) {
          throw new Error('Server response was not 200.');
        }

        res.on('data', function(data) { result_data += data });

        res.on('end', function() {
          if (result_data.length > 0) {
            done();
          } else {
            done(new Error("Server returned no data."));
          }
        });
      })

    });

  });

});
