"use strict";

import config from "./../app/config";
import Messenger from "./../app/messenger";

describe("Messenger", function() {
  var messenger, x, y, f, s;

  beforeAll(function() {
    (messenger = new Messenger(config.messenger)),
      (x = 1),
      (y = 2),
      (f = "south"),
      (s = "sake");
  });

  /**
   * Testing ALL messages in config file in a loop.
   */
  function testItsInLoop(key) {
    it(["should output correct", key, "message"].join(" "), function() {
      expect(
        messenger.getMessage({
          msg: key,
          x: x,
          y: y,
          f: f
        })
      ).toEqual(
        messenger._constructMessage({
          msg: key,
          x: x,
          y: y,
          f: f
        })
      );
    });
  }

  /**
   * A loop by itself
   */
  for (var key in config.messenger.oMsgs) {
    testItsInLoop(key);
  }
});
