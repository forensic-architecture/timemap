var assert = require('assert');
var child_process = require('child_process')
var http = require('http');
import test from 'ava'

const SERVER_LAUNCH_WAIT_TIME = 5 * 1000;

var server_proc = null;
var server_exited = false;

test.before.cb(t => {
  console.log("launching server...")
  server_proc = child_process.spawn('yarn', ['dev'], {
    cwd: '.',
    stdio: 'ignore'
  });

  server_proc.on('exit', function(code, signal) {
    server_exited = true;
  });

  setTimeout(t.end, SERVER_LAUNCH_WAIT_TIME)
});

test.after(function() {
  console.log("killing server...")
  server_proc.kill('SIGKILL');
});

test('should launch', t => {
  t.false(server_exited);
});

var urls = [
  '/',
  'js/index.bundle.js'
];

urls.forEach(function(url) {
  test.cb('should respond to request for "' + url + '"', t => {
    http.get({
      hostname: 'localhost',
      port: 8080,
      path: '/',
      agent: false
    }, function(res) {
      var result_data = '';

      if(res.statusCode != 200) {
        t.fail('Server response was not 200.');
      } else {
        res.on('data', function(data) { result_data += data });

        res.on('end', function() {
          if (result_data.length > 0) {
            t.pass();
          } else {
            t.fail("Server returned no data.");
          }
        });
      }

      t.end();
    })

  });

});
