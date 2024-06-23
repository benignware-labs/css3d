var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/gl-vec3/subtract.js
var require_subtract = __commonJS({
  "node_modules/gl-vec3/subtract.js"(exports, module) {
    module.exports = subtract;
    function subtract(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      return out;
    }
  }
});

// node_modules/gl-vec3/cross.js
var require_cross = __commonJS({
  "node_modules/gl-vec3/cross.js"(exports, module) {
    module.exports = cross2;
    function cross2(out, a, b) {
      var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2];
      out[0] = ay * bz - az * by;
      out[1] = az * bx - ax * bz;
      out[2] = ax * by - ay * bx;
      return out;
    }
  }
});

// node_modules/gl-vec3/squaredLength.js
var require_squaredLength = __commonJS({
  "node_modules/gl-vec3/squaredLength.js"(exports, module) {
    module.exports = squaredLength;
    function squaredLength(a) {
      var x = a[0], y = a[1], z = a[2];
      return x * x + y * y + z * z;
    }
  }
});

// node_modules/point-line-distance/squared.js
var require_squared = __commonJS({
  "node_modules/point-line-distance/squared.js"(exports, module) {
    var subtract = require_subtract();
    var cross2 = require_cross();
    var squaredLength = require_squaredLength();
    var ab = [];
    var ap = [];
    var cr = [];
    module.exports = function(p, a, b) {
      subtract(ab, b, a);
      subtract(ap, p, a);
      var area = squaredLength(cross2(cr, ap, ab));
      var s = squaredLength(ab);
      if (s === 0) {
        throw Error("a and b are the same point");
      }
      return area / s;
    };
  }
});

// node_modules/point-line-distance/index.js
var require_point_line_distance = __commonJS({
  "node_modules/point-line-distance/index.js"(exports, module) {
    "use strict";
    var distanceSquared = require_squared();
    module.exports = function(point, a, b) {
      return Math.sqrt(distanceSquared(point, a, b));
    };
  }
});

// node_modules/gl-vec3/normalize.js
var require_normalize = __commonJS({
  "node_modules/gl-vec3/normalize.js"(exports, module) {
    module.exports = normalize;
    function normalize(out, a) {
      var x = a[0], y = a[1], z = a[2];
      var len = x * x + y * y + z * z;
      if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
      }
      return out;
    }
  }
});

// node_modules/get-plane-normal/index.js
var require_get_plane_normal = __commonJS({
  "node_modules/get-plane-normal/index.js"(exports, module) {
    var normalize = require_normalize();
    var sub = require_subtract();
    var cross2 = require_cross();
    var tmp = [0, 0, 0];
    module.exports = planeNormal;
    function planeNormal(out, point1, point2, point3) {
      sub(out, point1, point2);
      sub(tmp, point2, point3);
      cross2(out, out, tmp);
      return normalize(out, out);
    }
  }
});

// node_modules/gl-vec3/dot.js
var require_dot = __commonJS({
  "node_modules/gl-vec3/dot.js"(exports, module) {
    module.exports = dot;
    function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }
  }
});

// node_modules/quickhull3d/dist/VertexList.js
var require_VertexList = __commonJS({
  "node_modules/quickhull3d/dist/VertexList.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    var VertexList = /* @__PURE__ */ function() {
      function VertexList2() {
        _classCallCheck(this, VertexList2);
        this.head = null;
        this.tail = null;
      }
      _createClass(VertexList2, [{
        key: "clear",
        value: function clear() {
          this.head = this.tail = null;
        }
        /**
         * Inserts a `node` before `target`, it's assumed that
         * `target` belongs to this doubly linked list
         *
         * @param {*} target
         * @param {*} node
         */
      }, {
        key: "insertBefore",
        value: function insertBefore(target, node) {
          node.prev = target.prev;
          node.next = target;
          if (!node.prev) {
            this.head = node;
          } else {
            node.prev.next = node;
          }
          target.prev = node;
        }
        /**
         * Inserts a `node` after `target`, it's assumed that
         * `target` belongs to this doubly linked list
         *
         * @param {Vertex} target
         * @param {Vertex} node
         */
      }, {
        key: "insertAfter",
        value: function insertAfter(target, node) {
          node.prev = target;
          node.next = target.next;
          if (!node.next) {
            this.tail = node;
          } else {
            node.next.prev = node;
          }
          target.next = node;
        }
        /**
         * Appends a `node` to the end of this doubly linked list
         * Note: `node.next` will be unlinked from `node`
         * Note: if `node` is part of another linked list call `addAll` instead
         *
         * @param {*} node
         */
      }, {
        key: "add",
        value: function add(node) {
          if (!this.head) {
            this.head = node;
          } else {
            this.tail.next = node;
          }
          node.prev = this.tail;
          node.next = null;
          this.tail = node;
        }
        /**
         * Appends a chain of nodes where `node` is the head,
         * the difference with `add` is that it correctly sets the position
         * of the node list `tail` property
         *
         * @param {*} node
         */
      }, {
        key: "addAll",
        value: function addAll(node) {
          if (!this.head) {
            this.head = node;
          } else {
            this.tail.next = node;
          }
          node.prev = this.tail;
          while (node.next) {
            node = node.next;
          }
          this.tail = node;
        }
        /**
         * Deletes a `node` from this linked list, it's assumed that `node` is a
         * member of this linked list
         *
         * @param {*} node
         */
      }, {
        key: "remove",
        value: function remove(node) {
          if (!node.prev) {
            this.head = node.next;
          } else {
            node.prev.next = node.next;
          }
          if (!node.next) {
            this.tail = node.prev;
          } else {
            node.next.prev = node.prev;
          }
        }
        /**
         * Removes a chain of nodes whose head is `a` and whose tail is `b`,
         * it's assumed that `a` and `b` belong to this list and also that `a`
         * comes before `b` in the linked list
         *
         * @param {*} a
         * @param {*} b
         */
      }, {
        key: "removeChain",
        value: function removeChain(a, b) {
          if (!a.prev) {
            this.head = b.next;
          } else {
            a.prev.next = b.next;
          }
          if (!b.next) {
            this.tail = a.prev;
          } else {
            b.next.prev = a.prev;
          }
        }
      }, {
        key: "first",
        value: function first() {
          return this.head;
        }
      }, {
        key: "isEmpty",
        value: function isEmpty() {
          return !this.head;
        }
      }]);
      return VertexList2;
    }();
    exports["default"] = VertexList;
  }
});

// node_modules/quickhull3d/dist/Vertex.js
var require_Vertex = __commonJS({
  "node_modules/quickhull3d/dist/Vertex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Vertex = /* @__PURE__ */ _createClass(function Vertex2(point, index) {
      _classCallCheck(this, Vertex2);
      this.point = point;
      this.index = index;
      this.next = null;
      this.prev = null;
      this.face = null;
    });
    exports["default"] = Vertex;
  }
});

// node_modules/gl-vec3/add.js
var require_add = __commonJS({
  "node_modules/gl-vec3/add.js"(exports, module) {
    module.exports = add;
    function add(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      return out;
    }
  }
});

// node_modules/gl-vec3/copy.js
var require_copy = __commonJS({
  "node_modules/gl-vec3/copy.js"(exports, module) {
    module.exports = copy;
    function copy(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      return out;
    }
  }
});

// node_modules/gl-vec3/length.js
var require_length = __commonJS({
  "node_modules/gl-vec3/length.js"(exports, module) {
    module.exports = length;
    function length(a) {
      var x = a[0], y = a[1], z = a[2];
      return Math.sqrt(x * x + y * y + z * z);
    }
  }
});

// node_modules/gl-vec3/scale.js
var require_scale = __commonJS({
  "node_modules/gl-vec3/scale.js"(exports, module) {
    module.exports = scale;
    function scale(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      return out;
    }
  }
});

// node_modules/gl-vec3/scaleAndAdd.js
var require_scaleAndAdd = __commonJS({
  "node_modules/gl-vec3/scaleAndAdd.js"(exports, module) {
    module.exports = scaleAndAdd;
    function scaleAndAdd(out, a, b, scale) {
      out[0] = a[0] + b[0] * scale;
      out[1] = a[1] + b[1] * scale;
      out[2] = a[2] + b[2] * scale;
      return out;
    }
  }
});

// node_modules/gl-vec3/distance.js
var require_distance = __commonJS({
  "node_modules/gl-vec3/distance.js"(exports, module) {
    module.exports = distance;
    function distance(a, b) {
      var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2];
      return Math.sqrt(x * x + y * y + z * z);
    }
  }
});

// node_modules/gl-vec3/squaredDistance.js
var require_squaredDistance = __commonJS({
  "node_modules/gl-vec3/squaredDistance.js"(exports, module) {
    module.exports = squaredDistance;
    function squaredDistance(a, b) {
      var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2];
      return x * x + y * y + z * z;
    }
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/quickhull3d/dist/HalfEdge.js
var require_HalfEdge = __commonJS({
  "node_modules/quickhull3d/dist/HalfEdge.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    var _distance = _interopRequireDefault(require_distance());
    var _squaredDistance = _interopRequireDefault(require_squaredDistance());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    var debug = require_browser()("halfedge");
    var HalfEdge = /* @__PURE__ */ function() {
      function HalfEdge2(vertex, face) {
        _classCallCheck(this, HalfEdge2);
        this.vertex = vertex;
        this.face = face;
        this.next = null;
        this.prev = null;
        this.opposite = null;
      }
      _createClass(HalfEdge2, [{
        key: "head",
        value: function head() {
          return this.vertex;
        }
      }, {
        key: "tail",
        value: function tail() {
          return this.prev ? this.prev.vertex : null;
        }
      }, {
        key: "length",
        value: function length() {
          if (this.tail()) {
            return (0, _distance["default"])(this.tail().point, this.head().point);
          }
          return -1;
        }
      }, {
        key: "lengthSquared",
        value: function lengthSquared() {
          if (this.tail()) {
            return (0, _squaredDistance["default"])(this.tail().point, this.head().point);
          }
          return -1;
        }
      }, {
        key: "setOpposite",
        value: function setOpposite(edge) {
          var me = this;
          if (debug.enabled) {
            debug("opposite ".concat(me.tail().index, " <--> ").concat(me.head().index, " between ").concat(me.face.collectIndices(), ", ").concat(edge.face.collectIndices()));
          }
          this.opposite = edge;
          edge.opposite = this;
        }
      }]);
      return HalfEdge2;
    }();
    exports["default"] = HalfEdge;
  }
});

// node_modules/quickhull3d/dist/Face.js
var require_Face = __commonJS({
  "node_modules/quickhull3d/dist/Face.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = exports.VISIBLE = exports.NON_CONVEX = exports.DELETED = void 0;
    var _dot = _interopRequireDefault(require_dot());
    var _add = _interopRequireDefault(require_add());
    var _subtract = _interopRequireDefault(require_subtract());
    var _cross = _interopRequireDefault(require_cross());
    var _copy = _interopRequireDefault(require_copy());
    var _length = _interopRequireDefault(require_length());
    var _scale = _interopRequireDefault(require_scale());
    var _scaleAndAdd = _interopRequireDefault(require_scaleAndAdd());
    var _normalize = _interopRequireDefault(require_normalize());
    var _HalfEdge = _interopRequireDefault(require_HalfEdge());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    var debug = require_browser()("face");
    var VISIBLE = 0;
    exports.VISIBLE = VISIBLE;
    var NON_CONVEX = 1;
    exports.NON_CONVEX = NON_CONVEX;
    var DELETED = 2;
    exports.DELETED = DELETED;
    var Face = /* @__PURE__ */ function() {
      function Face2() {
        _classCallCheck(this, Face2);
        this.normal = [];
        this.centroid = [];
        this.offset = 0;
        this.outside = null;
        this.mark = VISIBLE;
        this.edge = null;
        this.nVertices = 0;
      }
      _createClass(Face2, [{
        key: "getEdge",
        value: function getEdge(i) {
          if (typeof i !== "number") {
            throw Error("requires a number");
          }
          var it = this.edge;
          while (i > 0) {
            it = it.next;
            i -= 1;
          }
          while (i < 0) {
            it = it.prev;
            i += 1;
          }
          return it;
        }
      }, {
        key: "computeNormal",
        value: function computeNormal() {
          var e0 = this.edge;
          var e1 = e0.next;
          var e2 = e1.next;
          var v2 = (0, _subtract["default"])([], e1.head().point, e0.head().point);
          var t = [];
          var v1 = [];
          this.nVertices = 2;
          this.normal = [0, 0, 0];
          while (e2 !== e0) {
            (0, _copy["default"])(v1, v2);
            (0, _subtract["default"])(v2, e2.head().point, e0.head().point);
            (0, _add["default"])(this.normal, this.normal, (0, _cross["default"])(t, v1, v2));
            e2 = e2.next;
            this.nVertices += 1;
          }
          this.area = (0, _length["default"])(this.normal);
          this.normal = (0, _scale["default"])(this.normal, this.normal, 1 / this.area);
        }
      }, {
        key: "computeNormalMinArea",
        value: function computeNormalMinArea(minArea) {
          this.computeNormal();
          if (this.area < minArea) {
            var maxEdge;
            var maxSquaredLength = 0;
            var edge = this.edge;
            do {
              var lengthSquared = edge.lengthSquared();
              if (lengthSquared > maxSquaredLength) {
                maxEdge = edge;
                maxSquaredLength = lengthSquared;
              }
              edge = edge.next;
            } while (edge !== this.edge);
            var p1 = maxEdge.tail().point;
            var p2 = maxEdge.head().point;
            var maxVector = (0, _subtract["default"])([], p2, p1);
            var maxLength = Math.sqrt(maxSquaredLength);
            (0, _scale["default"])(maxVector, maxVector, 1 / maxLength);
            var maxProjection = (0, _dot["default"])(this.normal, maxVector);
            (0, _scaleAndAdd["default"])(this.normal, this.normal, maxVector, -maxProjection);
            (0, _normalize["default"])(this.normal, this.normal);
          }
        }
      }, {
        key: "computeCentroid",
        value: function computeCentroid() {
          this.centroid = [0, 0, 0];
          var edge = this.edge;
          do {
            (0, _add["default"])(this.centroid, this.centroid, edge.head().point);
            edge = edge.next;
          } while (edge !== this.edge);
          (0, _scale["default"])(this.centroid, this.centroid, 1 / this.nVertices);
        }
      }, {
        key: "computeNormalAndCentroid",
        value: function computeNormalAndCentroid(minArea) {
          if (typeof minArea !== "undefined") {
            this.computeNormalMinArea(minArea);
          } else {
            this.computeNormal();
          }
          this.computeCentroid();
          this.offset = (0, _dot["default"])(this.normal, this.centroid);
        }
      }, {
        key: "distanceToPlane",
        value: function distanceToPlane(point) {
          return (0, _dot["default"])(this.normal, point) - this.offset;
        }
        /**
         * @private
         *
         * Connects two edges assuming that prev.head().point === next.tail().point
         *
         * @param {HalfEdge} prev
         * @param {HalfEdge} next
         */
      }, {
        key: "connectHalfEdges",
        value: function connectHalfEdges(prev, next) {
          var discardedFace;
          if (prev.opposite.face === next.opposite.face) {
            var oppositeFace = next.opposite.face;
            var oppositeEdge;
            if (prev === this.edge) {
              this.edge = next;
            }
            if (oppositeFace.nVertices === 3) {
              oppositeEdge = next.opposite.prev.opposite;
              oppositeFace.mark = DELETED;
              discardedFace = oppositeFace;
            } else {
              oppositeEdge = next.opposite.next;
              if (oppositeFace.edge === oppositeEdge.prev) {
                oppositeFace.edge = oppositeEdge;
              }
              oppositeEdge.prev = oppositeEdge.prev.prev;
              oppositeEdge.prev.next = oppositeEdge;
            }
            next.prev = prev.prev;
            next.prev.next = next;
            next.setOpposite(oppositeEdge);
            oppositeFace.computeNormalAndCentroid();
          } else {
            prev.next = next;
            next.prev = prev;
          }
          return discardedFace;
        }
      }, {
        key: "mergeAdjacentFaces",
        value: function mergeAdjacentFaces(adjacentEdge, discardedFaces) {
          var oppositeEdge = adjacentEdge.opposite;
          var oppositeFace = oppositeEdge.face;
          discardedFaces.push(oppositeFace);
          oppositeFace.mark = DELETED;
          var adjacentEdgePrev = adjacentEdge.prev;
          var adjacentEdgeNext = adjacentEdge.next;
          var oppositeEdgePrev = oppositeEdge.prev;
          var oppositeEdgeNext = oppositeEdge.next;
          while (adjacentEdgePrev.opposite.face === oppositeFace) {
            adjacentEdgePrev = adjacentEdgePrev.prev;
            oppositeEdgeNext = oppositeEdgeNext.next;
          }
          while (adjacentEdgeNext.opposite.face === oppositeFace) {
            adjacentEdgeNext = adjacentEdgeNext.next;
            oppositeEdgePrev = oppositeEdgePrev.prev;
          }
          var edge;
          for (edge = oppositeEdgeNext; edge !== oppositeEdgePrev.next; edge = edge.next) {
            edge.face = this;
          }
          this.edge = adjacentEdgeNext;
          var discardedFace;
          discardedFace = this.connectHalfEdges(oppositeEdgePrev, adjacentEdgeNext);
          if (discardedFace) {
            discardedFaces.push(discardedFace);
          }
          discardedFace = this.connectHalfEdges(adjacentEdgePrev, oppositeEdgeNext);
          if (discardedFace) {
            discardedFaces.push(discardedFace);
          }
          this.computeNormalAndCentroid();
          return discardedFaces;
        }
      }, {
        key: "collectIndices",
        value: function collectIndices() {
          var indices = [];
          var edge = this.edge;
          do {
            indices.push(edge.head().index);
            edge = edge.next;
          } while (edge !== this.edge);
          return indices;
        }
      }], [{
        key: "createTriangle",
        value: function createTriangle(v0, v1, v2) {
          var minArea = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
          var face = new Face2();
          var e0 = new _HalfEdge["default"](v0, face);
          var e1 = new _HalfEdge["default"](v1, face);
          var e2 = new _HalfEdge["default"](v2, face);
          e0.next = e2.prev = e1;
          e1.next = e0.prev = e2;
          e2.next = e1.prev = e0;
          face.edge = e0;
          face.computeNormalAndCentroid(minArea);
          if (debug.enabled) {
            debug("face created %j", face.collectIndices());
          }
          return face;
        }
      }]);
      return Face2;
    }();
    exports["default"] = Face;
  }
});

// node_modules/quickhull3d/dist/QuickHull.js
var require_QuickHull = __commonJS({
  "node_modules/quickhull3d/dist/QuickHull.js"(exports) {
    "use strict";
    function _typeof(obj) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
        return typeof obj2;
      } : function(obj2) {
        return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      }, _typeof(obj);
    }
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    var _pointLineDistance = _interopRequireDefault(require_point_line_distance());
    var _getPlaneNormal = _interopRequireDefault(require_get_plane_normal());
    var _dot = _interopRequireDefault(require_dot());
    var _VertexList = _interopRequireDefault(require_VertexList());
    var _Vertex = _interopRequireDefault(require_Vertex());
    var _Face = _interopRequireWildcard(require_Face());
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function") return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      })(nodeInterop);
    }
    function _interopRequireWildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
        return { "default": obj };
      }
      var cache = _getRequireWildcardCache(nodeInterop);
      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj["default"] = obj;
      if (cache) {
        cache.set(obj, newObj);
      }
      return newObj;
    }
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    }
    function _iterableToArrayLimit(arr, i) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
      if (_i == null) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _s, _e;
      try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    var debug = require_browser()("quickhull");
    var MERGE_NON_CONVEX_WRT_LARGER_FACE = 1;
    var MERGE_NON_CONVEX = 2;
    var QuickHull = /* @__PURE__ */ function() {
      function QuickHull2(points) {
        _classCallCheck(this, QuickHull2);
        if (!Array.isArray(points)) {
          throw TypeError("input is not a valid array");
        }
        if (points.length < 4) {
          throw Error("cannot build a simplex out of <4 points");
        }
        this.tolerance = -1;
        this.nFaces = 0;
        this.nPoints = points.length;
        this.faces = [];
        this.newFaces = [];
        this.claimed = new _VertexList["default"]();
        this.unclaimed = new _VertexList["default"]();
        this.vertices = [];
        for (var i = 0; i < points.length; i += 1) {
          this.vertices.push(new _Vertex["default"](points[i], i));
        }
        this.discardedFaces = [];
        this.vertexPointIndices = [];
      }
      _createClass(QuickHull2, [{
        key: "addVertexToFace",
        value: function addVertexToFace(vertex, face) {
          vertex.face = face;
          if (!face.outside) {
            this.claimed.add(vertex);
          } else {
            this.claimed.insertBefore(face.outside, vertex);
          }
          face.outside = vertex;
        }
        /**
         * Removes `vertex` for the `claimed` list of vertices, it also makes sure
         * that the link from `face` to the first vertex it sees in `claimed` is
         * linked correctly after the removal
         *
         * @param {Vertex} vertex
         * @param {Face} face
         */
      }, {
        key: "removeVertexFromFace",
        value: function removeVertexFromFace(vertex, face) {
          if (vertex === face.outside) {
            if (vertex.next && vertex.next.face === face) {
              face.outside = vertex.next;
            } else {
              face.outside = null;
            }
          }
          this.claimed.remove(vertex);
        }
        /**
         * Removes all the visible vertices that `face` is able to see which are
         * stored in the `claimed` vertext list
         *
         * @param {Face} face
         * @return {Vertex|undefined} If face had visible vertices returns
         * `face.outside`, otherwise undefined
         */
      }, {
        key: "removeAllVerticesFromFace",
        value: function removeAllVerticesFromFace(face) {
          if (face.outside) {
            var end = face.outside;
            while (end.next && end.next.face === face) {
              end = end.next;
            }
            this.claimed.removeChain(face.outside, end);
            end.next = null;
            return face.outside;
          }
        }
        /**
         * Removes all the visible vertices that `face` is able to see, additionally
         * checking the following:
         *
         * If `absorbingFace` doesn't exist then all the removed vertices will be
         * added to the `unclaimed` vertex list
         *
         * If `absorbingFace` exists then this method will assign all the vertices of
         * `face` that can see `absorbingFace`, if a vertex cannot see `absorbingFace`
         * it's added to the `unclaimed` vertex list
         *
         * @param {Face} face
         * @param {Face} [absorbingFace]
         */
      }, {
        key: "deleteFaceVertices",
        value: function deleteFaceVertices(face, absorbingFace) {
          var faceVertices = this.removeAllVerticesFromFace(face);
          if (faceVertices) {
            if (!absorbingFace) {
              this.unclaimed.addAll(faceVertices);
            } else {
              var nextVertex;
              for (var vertex = faceVertices; vertex; vertex = nextVertex) {
                nextVertex = vertex.next;
                var distance = absorbingFace.distanceToPlane(vertex.point);
                if (distance > this.tolerance) {
                  this.addVertexToFace(vertex, absorbingFace);
                } else {
                  this.unclaimed.add(vertex);
                }
              }
            }
          }
        }
        /**
         * Reassigns as many vertices as possible from the unclaimed list to the new
         * faces
         *
         * @param {Faces[]} newFaces
         */
      }, {
        key: "resolveUnclaimedPoints",
        value: function resolveUnclaimedPoints(newFaces) {
          var vertexNext = this.unclaimed.first();
          for (var vertex = vertexNext; vertex; vertex = vertexNext) {
            vertexNext = vertex.next;
            var maxDistance = this.tolerance;
            var maxFace = void 0;
            for (var i = 0; i < newFaces.length; i += 1) {
              var face = newFaces[i];
              if (face.mark === _Face.VISIBLE) {
                var dist = face.distanceToPlane(vertex.point);
                if (dist > maxDistance) {
                  maxDistance = dist;
                  maxFace = face;
                }
                if (maxDistance > 1e3 * this.tolerance) {
                  break;
                }
              }
            }
            if (maxFace) {
              this.addVertexToFace(vertex, maxFace);
            }
          }
        }
        /**
         * Computes the extremes of a tetrahedron which will be the initial hull
         *
         * @return {number[]} The min/max vertices in the x,y,z directions
         */
      }, {
        key: "computeExtremes",
        value: function computeExtremes() {
          var me = this;
          var min = [];
          var max = [];
          var minVertices = [];
          var maxVertices = [];
          var i, j;
          for (i = 0; i < 3; i += 1) {
            minVertices[i] = maxVertices[i] = this.vertices[0];
          }
          for (i = 0; i < 3; i += 1) {
            min[i] = max[i] = this.vertices[0].point[i];
          }
          for (i = 1; i < this.vertices.length; i += 1) {
            var vertex = this.vertices[i];
            var point = vertex.point;
            for (j = 0; j < 3; j += 1) {
              if (point[j] < min[j]) {
                min[j] = point[j];
                minVertices[j] = vertex;
              }
            }
            for (j = 0; j < 3; j += 1) {
              if (point[j] > max[j]) {
                max[j] = point[j];
                maxVertices[j] = vertex;
              }
            }
          }
          this.tolerance = 3 * Number.EPSILON * (Math.max(Math.abs(min[0]), Math.abs(max[0])) + Math.max(Math.abs(min[1]), Math.abs(max[1])) + Math.max(Math.abs(min[2]), Math.abs(max[2])));
          if (debug.enabled) {
            debug("tolerance %d", me.tolerance);
          }
          return [minVertices, maxVertices];
        }
        /**
         * Compues the initial tetrahedron assigning to its faces all the points that
         * are candidates to form part of the hull
         */
      }, {
        key: "createInitialSimplex",
        value: function createInitialSimplex() {
          var vertices = this.vertices;
          var _this$computeExtremes = this.computeExtremes(), _this$computeExtremes2 = _slicedToArray(_this$computeExtremes, 2), min = _this$computeExtremes2[0], max = _this$computeExtremes2[1];
          var i, j;
          var maxDistance = 0;
          var indexMax = 0;
          for (i = 0; i < 3; i += 1) {
            var distance = max[i].point[i] - min[i].point[i];
            if (distance > maxDistance) {
              maxDistance = distance;
              indexMax = i;
            }
          }
          var v0 = min[indexMax];
          var v1 = max[indexMax];
          var v2, v3;
          maxDistance = 0;
          for (i = 0; i < this.vertices.length; i += 1) {
            var vertex = this.vertices[i];
            if (vertex !== v0 && vertex !== v1) {
              var _distance = (0, _pointLineDistance["default"])(vertex.point, v0.point, v1.point);
              if (_distance > maxDistance) {
                maxDistance = _distance;
                v2 = vertex;
              }
            }
          }
          var normal = (0, _getPlaneNormal["default"])([], v0.point, v1.point, v2.point);
          var distPO = (0, _dot["default"])(v0.point, normal);
          maxDistance = -1;
          for (i = 0; i < this.vertices.length; i += 1) {
            var _vertex = this.vertices[i];
            if (_vertex !== v0 && _vertex !== v1 && _vertex !== v2) {
              var _distance2 = Math.abs((0, _dot["default"])(normal, _vertex.point) - distPO);
              if (_distance2 > maxDistance) {
                maxDistance = _distance2;
                v3 = _vertex;
              }
            }
          }
          var faces = [];
          if ((0, _dot["default"])(v3.point, normal) - distPO < 0) {
            faces.push(_Face["default"].createTriangle(v0, v1, v2), _Face["default"].createTriangle(v3, v1, v0), _Face["default"].createTriangle(v3, v2, v1), _Face["default"].createTriangle(v3, v0, v2));
            for (i = 0; i < 3; i += 1) {
              var _j = (i + 1) % 3;
              faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge(_j));
              faces[i + 1].getEdge(1).setOpposite(faces[_j + 1].getEdge(0));
            }
          } else {
            faces.push(_Face["default"].createTriangle(v0, v2, v1), _Face["default"].createTriangle(v3, v0, v1), _Face["default"].createTriangle(v3, v1, v2), _Face["default"].createTriangle(v3, v2, v0));
            for (i = 0; i < 3; i += 1) {
              var _j2 = (i + 1) % 3;
              faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge((3 - i) % 3));
              faces[i + 1].getEdge(0).setOpposite(faces[_j2 + 1].getEdge(1));
            }
          }
          for (i = 0; i < 4; i += 1) {
            this.faces.push(faces[i]);
          }
          for (i = 0; i < vertices.length; i += 1) {
            var _vertex2 = vertices[i];
            if (_vertex2 !== v0 && _vertex2 !== v1 && _vertex2 !== v2 && _vertex2 !== v3) {
              maxDistance = this.tolerance;
              var maxFace = void 0;
              for (j = 0; j < 4; j += 1) {
                var _distance3 = faces[j].distanceToPlane(_vertex2.point);
                if (_distance3 > maxDistance) {
                  maxDistance = _distance3;
                  maxFace = faces[j];
                }
              }
              if (maxFace) {
                this.addVertexToFace(_vertex2, maxFace);
              }
            }
          }
        }
      }, {
        key: "reindexFaceAndVertices",
        value: function reindexFaceAndVertices() {
          var activeFaces = [];
          for (var i = 0; i < this.faces.length; i += 1) {
            var face = this.faces[i];
            if (face.mark === _Face.VISIBLE) {
              activeFaces.push(face);
            }
          }
          this.faces = activeFaces;
        }
      }, {
        key: "collectFaces",
        value: function collectFaces(skipTriangulation) {
          var faceIndices = [];
          for (var i = 0; i < this.faces.length; i += 1) {
            if (this.faces[i].mark !== _Face.VISIBLE) {
              throw Error("attempt to include a destroyed face in the hull");
            }
            var indices = this.faces[i].collectIndices();
            if (skipTriangulation) {
              faceIndices.push(indices);
            } else {
              for (var j = 0; j < indices.length - 2; j += 1) {
                faceIndices.push([indices[0], indices[j + 1], indices[j + 2]]);
              }
            }
          }
          return faceIndices;
        }
        /**
         * Finds the next vertex to make faces with the current hull
         *
         * - let `face` be the first face existing in the `claimed` vertex list
         *  - if `face` doesn't exist then return since there're no vertices left
         *  - otherwise for each `vertex` that face sees find the one furthest away
         *  from `face`
         *
         * @return {Vertex|undefined} Returns undefined when there're no more
         * visible vertices
         */
      }, {
        key: "nextVertexToAdd",
        value: function nextVertexToAdd() {
          if (!this.claimed.isEmpty()) {
            var eyeVertex, vertex;
            var maxDistance = 0;
            var eyeFace = this.claimed.first().face;
            for (vertex = eyeFace.outside; vertex && vertex.face === eyeFace; vertex = vertex.next) {
              var distance = eyeFace.distanceToPlane(vertex.point);
              if (distance > maxDistance) {
                maxDistance = distance;
                eyeVertex = vertex;
              }
            }
            return eyeVertex;
          }
        }
        /**
         * Computes a chain of half edges in ccw order called the `horizon`, for an
         * edge to be part of the horizon it must join a face that can see
         * `eyePoint` and a face that cannot see `eyePoint`
         *
         * @param {number[]} eyePoint - The coordinates of a point
         * @param {HalfEdge} crossEdge - The edge used to jump to the current `face`
         * @param {Face} face - The current face being tested
         * @param {HalfEdge[]} horizon - The edges that form part of the horizon in
         * ccw order
         */
      }, {
        key: "computeHorizon",
        value: function computeHorizon(eyePoint, crossEdge, face, horizon) {
          this.deleteFaceVertices(face);
          face.mark = _Face.DELETED;
          var edge;
          if (!crossEdge) {
            edge = crossEdge = face.getEdge(0);
          } else {
            edge = crossEdge.next;
          }
          do {
            var oppositeEdge = edge.opposite;
            var oppositeFace = oppositeEdge.face;
            if (oppositeFace.mark === _Face.VISIBLE) {
              if (oppositeFace.distanceToPlane(eyePoint) > this.tolerance) {
                this.computeHorizon(eyePoint, oppositeEdge, oppositeFace, horizon);
              } else {
                horizon.push(edge);
              }
            }
            edge = edge.next;
          } while (edge !== crossEdge);
        }
        /**
         * Creates a face with the points `eyeVertex.point`, `horizonEdge.tail` and
         * `horizonEdge.tail` in ccw order
         *
         * @param {Vertex} eyeVertex
         * @param {HalfEdge} horizonEdge
         * @return {HalfEdge} The half edge whose vertex is the eyeVertex
         */
      }, {
        key: "addAdjoiningFace",
        value: function addAdjoiningFace(eyeVertex, horizonEdge) {
          var face = _Face["default"].createTriangle(eyeVertex, horizonEdge.tail(), horizonEdge.head());
          this.faces.push(face);
          face.getEdge(-1).setOpposite(horizonEdge.opposite);
          return face.getEdge(0);
        }
        /**
         * Adds horizon.length faces to the hull, each face will be 'linked' with the
         * horizon opposite face and the face on the left/right
         *
         * @param {Vertex} eyeVertex
         * @param {HalfEdge[]} horizon - A chain of half edges in ccw order
         */
      }, {
        key: "addNewFaces",
        value: function addNewFaces(eyeVertex, horizon) {
          this.newFaces = [];
          var firstSideEdge, previousSideEdge;
          for (var i = 0; i < horizon.length; i += 1) {
            var horizonEdge = horizon[i];
            var sideEdge = this.addAdjoiningFace(eyeVertex, horizonEdge);
            if (!firstSideEdge) {
              firstSideEdge = sideEdge;
            } else {
              sideEdge.next.setOpposite(previousSideEdge);
            }
            this.newFaces.push(sideEdge.face);
            previousSideEdge = sideEdge;
          }
          firstSideEdge.next.setOpposite(previousSideEdge);
        }
        /**
         * Computes the distance from `edge` opposite face's centroid to
         * `edge.face`
         *
         * @param {HalfEdge} edge
         * @return {number}
         * - A positive number when the centroid of the opposite face is above the
         *   face i.e. when the faces are concave
         * - A negative number when the centroid of the opposite face is below the
         *   face i.e. when the faces are convex
         */
      }, {
        key: "oppositeFaceDistance",
        value: function oppositeFaceDistance(edge) {
          return edge.face.distanceToPlane(edge.opposite.face.centroid);
        }
        /**
         * Merges a face with none/any/all its neighbors according to the strategy
         * used
         *
         * if `mergeType` is MERGE_NON_CONVEX_WRT_LARGER_FACE then the merge will be
         * decided based on the face with the larger area, the centroid of the face
         * with the smaller area will be checked against the one with the larger area
         * to see if it's in the merge range [tolerance, -tolerance] i.e.
         *
         *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance
         *
         * Note that the first check (with +tolerance) was done on `computeHorizon`
         *
         * If the above is not true then the check is done with respect to the smaller
         * face i.e.
         *
         *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance
         *
         * If true then it means that two faces are non convex (concave), even if the
         * dot(...) - offset value is > 0 (that's the point of doing the merge in the
         * first place)
         *
         * If two faces are concave then the check must also be done on the other face
         * but this is done in another merge pass, for this to happen the face is
         * marked in a temporal NON_CONVEX state
         *
         * if `mergeType` is MERGE_NON_CONVEX then two faces will be merged only if
         * they pass the following conditions
         *
         *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance
         *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance
         *
         * @param {Face} face
         * @param {number} mergeType - Either MERGE_NON_CONVEX_WRT_LARGER_FACE or
         * MERGE_NON_CONVEX
         */
      }, {
        key: "doAdjacentMerge",
        value: function doAdjacentMerge(face, mergeType) {
          var edge = face.edge;
          var convex = true;
          var it = 0;
          do {
            if (it >= face.nVertices) {
              throw Error("merge recursion limit exceeded");
            }
            var oppositeFace = edge.opposite.face;
            var merge = false;
            if (mergeType === MERGE_NON_CONVEX) {
              if (this.oppositeFaceDistance(edge) > -this.tolerance || this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
                merge = true;
              }
            } else {
              if (face.area > oppositeFace.area) {
                if (this.oppositeFaceDistance(edge) > -this.tolerance) {
                  merge = true;
                } else if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
                  convex = false;
                }
              } else {
                if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
                  merge = true;
                } else if (this.oppositeFaceDistance(edge) > -this.tolerance) {
                  convex = false;
                }
              }
            }
            if (merge) {
              debug("face merge");
              var discardedFaces = face.mergeAdjacentFaces(edge, []);
              for (var i = 0; i < discardedFaces.length; i += 1) {
                this.deleteFaceVertices(discardedFaces[i], face);
              }
              return true;
            }
            edge = edge.next;
            it += 1;
          } while (edge !== face.edge);
          if (!convex) {
            face.mark = _Face.NON_CONVEX;
          }
          return false;
        }
        /**
         * Adds a vertex to the hull with the following algorithm
         *
         * - Compute the `horizon` which is a chain of half edges, for an edge to
         *   belong to this group it must be the edge connecting a face that can
         *   see `eyeVertex` and a face which cannot see `eyeVertex`
         * - All the faces that can see `eyeVertex` have its visible vertices removed
         *   from the claimed VertexList
         * - A new set of faces is created with each edge of the `horizon` and
         *   `eyeVertex`, each face is connected with the opposite horizon face and
         *   the face on the left/right
         * - The new faces are merged if possible with the opposite horizon face first
         *   and then the faces on the right/left
         * - The vertices removed from all the visible faces are assigned to the new
         *   faces if possible
         *
         * @param {Vertex} eyeVertex
         */
      }, {
        key: "addVertexToHull",
        value: function addVertexToHull(eyeVertex) {
          var horizon = [];
          this.unclaimed.clear();
          this.removeVertexFromFace(eyeVertex, eyeVertex.face);
          this.computeHorizon(eyeVertex.point, null, eyeVertex.face, horizon);
          if (debug.enabled) {
            debug("horizon %j", horizon.map(function(edge) {
              return edge.head().index;
            }));
          }
          this.addNewFaces(eyeVertex, horizon);
          debug("first merge");
          for (var i = 0; i < this.newFaces.length; i += 1) {
            var face = this.newFaces[i];
            if (face.mark === _Face.VISIBLE) {
              while (this.doAdjacentMerge(face, MERGE_NON_CONVEX_WRT_LARGER_FACE)) {
              }
            }
          }
          debug("second merge");
          for (var _i2 = 0; _i2 < this.newFaces.length; _i2 += 1) {
            var _face = this.newFaces[_i2];
            if (_face.mark === _Face.NON_CONVEX) {
              _face.mark = _Face.VISIBLE;
              while (this.doAdjacentMerge(_face, MERGE_NON_CONVEX)) {
              }
            }
          }
          debug("reassigning points to newFaces");
          this.resolveUnclaimedPoints(this.newFaces);
        }
      }, {
        key: "build",
        value: function build() {
          var iterations = 0;
          var eyeVertex;
          this.createInitialSimplex();
          while (eyeVertex = this.nextVertexToAdd()) {
            iterations += 1;
            debug("== iteration %j ==", iterations);
            debug("next vertex to add = %d %j", eyeVertex.index, eyeVertex.point);
            this.addVertexToHull(eyeVertex);
            debug("end");
          }
          this.reindexFaceAndVertices();
        }
      }]);
      return QuickHull2;
    }();
    exports["default"] = QuickHull;
  }
});

// node_modules/quickhull3d/dist/index.js
var require_dist = __commonJS({
  "node_modules/quickhull3d/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = runner;
    exports.isPointInsideHull = isPointInsideHull;
    var _QuickHull = _interopRequireDefault(require_QuickHull());
    var _getPlaneNormal = _interopRequireDefault(require_get_plane_normal());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    function runner(points) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var instance = new _QuickHull["default"](points);
      instance.build();
      return instance.collectFaces(options.skipTriangulation);
    }
    function isPointInsideHull(point, points, faces) {
      for (var i = 0; i < faces.length; i++) {
        var face = faces[i];
        var a = points[face[0]];
        var b = points[face[1]];
        var c = points[face[2]];
        var planeNormal = (0, _getPlaneNormal["default"])([], a, b, c);
        var pointAbsA = [point[0] - a[0], point[1] - a[1], point[2] - a[2]];
        var dotProduct = planeNormal[0] * pointAbsA[0] + planeNormal[1] * pointAbsA[1] + planeNormal[2] * pointAbsA[2];
        if (dotProduct > 0) {
          return false;
        }
      }
      return true;
    }
  }
});

// lib/math/utils.mjs
var clamp = (value, min, max) => Math.max(min, Math.min(max, value));
var rad2deg = (radians) => radians * 180 / Math.PI;
var centroid = (...vectors) => {
  const sum = vectors.reduce((sum2, vector) => sum2.add(vector), new Vector3());
  return sum.divide(vectors.length);
};

// lib/math/Quaternion.mjs
var Quaternion = class {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.isQuaternion = true;
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }
  static slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {
    let x0 = src0[srcOffset0 + 0], y0 = src0[srcOffset0 + 1], z0 = src0[srcOffset0 + 2], w0 = src0[srcOffset0 + 3];
    const x1 = src1[srcOffset1 + 0], y1 = src1[srcOffset1 + 1], z1 = src1[srcOffset1 + 2], w1 = src1[srcOffset1 + 3];
    if (t === 0) {
      dst[dstOffset + 0] = x0;
      dst[dstOffset + 1] = y0;
      dst[dstOffset + 2] = z0;
      dst[dstOffset + 3] = w0;
      return;
    }
    if (t === 1) {
      dst[dstOffset + 0] = x1;
      dst[dstOffset + 1] = y1;
      dst[dstOffset + 2] = z1;
      dst[dstOffset + 3] = w1;
      return;
    }
    if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
      let s = 1 - t;
      const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1, dir = cos >= 0 ? 1 : -1, sqrSin = 1 - cos * cos;
      if (sqrSin > Number.EPSILON) {
        const sin = Math.sqrt(sqrSin), len = Math.atan2(sin, cos * dir);
        s = Math.sin(s * len) / sin;
        t = Math.sin(t * len) / sin;
      }
      const tDir = t * dir;
      x0 = x0 * s + x1 * tDir;
      y0 = y0 * s + y1 * tDir;
      z0 = z0 * s + z1 * tDir;
      w0 = w0 * s + w1 * tDir;
      if (s === 1 - t) {
        const f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);
        x0 *= f;
        y0 *= f;
        z0 *= f;
        w0 *= f;
      }
    }
    dst[dstOffset] = x0;
    dst[dstOffset + 1] = y0;
    dst[dstOffset + 2] = z0;
    dst[dstOffset + 3] = w0;
  }
  static multiplyQuaternionsFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1) {
    const x0 = src0[srcOffset0];
    const y0 = src0[srcOffset0 + 1];
    const z0 = src0[srcOffset0 + 2];
    const w0 = src0[srcOffset0 + 3];
    const x1 = src1[srcOffset1];
    const y1 = src1[srcOffset1 + 1];
    const z1 = src1[srcOffset1 + 2];
    const w1 = src1[srcOffset1 + 3];
    dst[dstOffset] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
    dst[dstOffset + 1] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
    dst[dstOffset + 2] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
    dst[dstOffset + 3] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;
    return dst;
  }
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
    this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
    this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(value) {
    this._z = value;
    this._onChangeCallback();
  }
  get w() {
    return this._w;
  }
  set w(value) {
    this._w = value;
    this._onChangeCallback();
  }
  set(x, y, z, w) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
    this._onChangeCallback();
    return this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(quaternion) {
    this._x = quaternion.x;
    this._y = quaternion.y;
    this._z = quaternion.z;
    this._w = quaternion.w;
    this._onChangeCallback();
    return this;
  }
  setFromEuler(euler, update = true) {
    const x = euler._x, y = euler._y, z = euler._z, order = euler._order;
    const cos = Math.cos;
    const sin = Math.sin;
    const c1 = cos(x / 2);
    const c2 = cos(y / 2);
    const c3 = cos(z / 2);
    const s1 = sin(x / 2);
    const s2 = sin(y / 2);
    const s3 = sin(z / 2);
    switch (order) {
      case "XYZ":
        this._x = s1 * c2 * c3 + c1 * s2 * s3;
        this._y = c1 * s2 * c3 - s1 * c2 * s3;
        this._z = c1 * c2 * s3 + s1 * s2 * c3;
        this._w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case "YXZ":
        this._x = s1 * c2 * c3 + c1 * s2 * s3;
        this._y = c1 * s2 * c3 - s1 * c2 * s3;
        this._z = c1 * c2 * s3 - s1 * s2 * c3;
        this._w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case "ZXY":
        this._x = s1 * c2 * c3 - c1 * s2 * s3;
        this._y = c1 * s2 * c3 + s1 * c2 * s3;
        this._z = c1 * c2 * s3 + s1 * s2 * c3;
        this._w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case "ZYX":
        this._x = s1 * c2 * c3 - c1 * s2 * s3;
        this._y = c1 * s2 * c3 + s1 * c2 * s3;
        this._z = c1 * c2 * s3 - s1 * s2 * c3;
        this._w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case "YZX":
        this._x = s1 * c2 * c3 + c1 * s2 * s3;
        this._y = c1 * s2 * c3 + s1 * c2 * s3;
        this._z = c1 * c2 * s3 - s1 * s2 * c3;
        this._w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case "XZY":
        this._x = s1 * c2 * c3 - c1 * s2 * s3;
        this._y = c1 * s2 * c3 - s1 * c2 * s3;
        this._z = c1 * c2 * s3 + s1 * s2 * c3;
        this._w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      default:
        console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + order);
    }
    if (update === true) this._onChangeCallback();
    return this;
  }
  setFromAxisAngle(axis, angle) {
    const halfAngle = angle / 2, s = Math.sin(halfAngle);
    this._x = axis.x * s;
    this._y = axis.y * s;
    this._z = axis.z * s;
    this._w = Math.cos(halfAngle);
    this._onChangeCallback();
    return this;
  }
  setFromRotationMatrix(m) {
    const te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10], trace = m11 + m22 + m33;
    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1);
      this._w = 0.25 / s;
      this._x = (m32 - m23) * s;
      this._y = (m13 - m31) * s;
      this._z = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      const s = 2 * Math.sqrt(1 + m11 - m22 - m33);
      this._w = (m32 - m23) / s;
      this._x = 0.25 * s;
      this._y = (m12 + m21) / s;
      this._z = (m13 + m31) / s;
    } else if (m22 > m33) {
      const s = 2 * Math.sqrt(1 + m22 - m11 - m33);
      this._w = (m13 - m31) / s;
      this._x = (m12 + m21) / s;
      this._y = 0.25 * s;
      this._z = (m23 + m32) / s;
    } else {
      const s = 2 * Math.sqrt(1 + m33 - m11 - m22);
      this._w = (m21 - m12) / s;
      this._x = (m13 + m31) / s;
      this._y = (m23 + m32) / s;
      this._z = 0.25 * s;
    }
    this._onChangeCallback();
    return this;
  }
  setFromUnitVectors(vFrom, vTo) {
    let r = vFrom.dot(vTo) + 1;
    if (r < Number.EPSILON) {
      r = 0;
      if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
        this._x = -vFrom.y;
        this._y = vFrom.x;
        this._z = 0;
        this._w = r;
      } else {
        this._x = 0;
        this._y = -vFrom.z;
        this._z = vFrom.y;
        this._w = r;
      }
    } else {
      this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
      this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
      this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
      this._w = r;
    }
    return this.normalize();
  }
  angleTo(q) {
    return 2 * Math.acos(Math.abs(clamp(this.dot(q), -1, 1)));
  }
  rotateTowards(q, step) {
    const angle = this.angleTo(q);
    if (angle === 0) return this;
    const t = Math.min(1, step / angle);
    this.slerp(q, t);
    return this;
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  invert() {
    return this.conjugate();
  }
  conjugate() {
    this._x *= -1;
    this._y *= -1;
    this._z *= -1;
    this._onChangeCallback();
    return this;
  }
  dot(v) {
    return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
  }
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  normalize() {
    let l = this.length();
    if (l === 0) {
      this._x = 0;
      this._y = 0;
      this._z = 0;
      this._w = 1;
    } else {
      l = 1 / l;
      this._x = this._x * l;
      this._y = this._y * l;
      this._z = this._z * l;
      this._w = this._w * l;
    }
    this._onChangeCallback();
    return this;
  }
  multiply(q) {
    return this.multiplyQuaternions(this, q);
  }
  premultiply(q) {
    return this.multiplyQuaternions(q, this);
  }
  multiplyQuaternions(a, b) {
    const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
    const qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;
    this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
    this._onChangeCallback();
    return this;
  }
  slerp(qb, t) {
    if (t === 0) return this;
    if (t === 1) return this.copy(qb);
    const x = this._x, y = this._y, z = this._z, w = this._w;
    let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;
    if (cosHalfTheta < 0) {
      this._w = -qb._w;
      this._x = -qb._x;
      this._y = -qb._y;
      this._z = -qb._z;
      cosHalfTheta = -cosHalfTheta;
    } else {
      this.copy(qb);
    }
    if (cosHalfTheta >= 1) {
      this._w = w;
      this._x = x;
      this._y = y;
      this._z = z;
      return this;
    }
    const sqrSinHalfTheta = 1 - cosHalfTheta * cosHalfTheta;
    if (sqrSinHalfTheta <= Number.EPSILON) {
      const s = 1 - t;
      this._w = s * w + t * this._w;
      this._x = s * x + t * this._x;
      this._y = s * y + t * this._y;
      this._z = s * z + t * this._z;
      this.normalize();
      return this;
    }
    const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
    const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
    this._w = w * ratioA + this._w * ratioB;
    this._x = x * ratioA + this._x * ratioB;
    this._y = y * ratioA + this._y * ratioB;
    this._z = z * ratioA + this._z * ratioB;
    this._onChangeCallback();
    return this;
  }
  slerpQuaternions(qa, qb, t) {
    return this.copy(qa).slerp(qb, t);
  }
  random() {
    const theta1 = 2 * Math.PI * Math.random();
    const theta2 = 2 * Math.PI * Math.random();
    const x0 = Math.random();
    const r1 = Math.sqrt(1 - x0);
    const r2 = Math.sqrt(x0);
    return this.set(
      r1 * Math.sin(theta1),
      r1 * Math.cos(theta1),
      r2 * Math.sin(theta2),
      r2 * Math.cos(theta2)
    );
  }
  equals(quaternion) {
    return quaternion._x === this._x && quaternion._y === this._y && quaternion._z === this._z && quaternion._w === this._w;
  }
  fromArray(array, offset = 0) {
    this._x = array[offset];
    this._y = array[offset + 1];
    this._z = array[offset + 2];
    this._w = array[offset + 3];
    this._onChangeCallback();
    return this;
  }
  toArray(array = [], offset = 0) {
    array[offset] = this._x;
    array[offset + 1] = this._y;
    array[offset + 2] = this._z;
    array[offset + 3] = this._w;
    return array;
  }
  fromBufferAttribute(attribute, index) {
    this._x = attribute.getX(index);
    this._y = attribute.getY(index);
    this._z = attribute.getZ(index);
    this._w = attribute.getW(index);
    this._onChangeCallback();
    return this;
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(callback) {
    this._onChangeCallback = callback;
    return this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x;
    yield this._y;
    yield this._z;
    yield this._w;
  }
};

// lib/math/Vector3.mjs
var Vector3 = class _Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  set(x, y, z) {
    if (z === void 0) z = this.z;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }
  add(v) {
    return new _Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }
  divide(v) {
    v = typeof v === "number" ? new _Vector3(v, v, v) : v;
    return new _Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
  }
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  equals(v) {
    return v.x === this.x && v.y === this.y && v.z === this.z;
  }
  cross(v) {
    return new _Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }
  rotateX(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const y = this.y * cos - this.z * sin;
    const z = this.y * sin + this.z * cos;
    return new _Vector3(this.x, y, z);
  }
  rotateY(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = this.x * cos - this.z * sin;
    const z = this.x * sin + this.z * cos;
    return new _Vector3(x, this.y, z);
  }
  rotateZ(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = this.x * cos - this.y * sin;
    const y = this.x * sin + this.y * cos;
    return new _Vector3(x, y, this.z);
  }
  valueOf() {
    return [this.x, this.y, this.z];
  }
  toString() {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
  applyAxisAngle(axis, angle) {
    const quaternion = new Quaternion().setFromAxisAngle(axis, angle);
    return this.applyQuaternion(quaternion);
  }
  applyQuaternion(q) {
    const x = this.x, y = this.y, z = this.z;
    const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return this;
  }
  subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }
  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }
  divideScalar(scalar) {
    return this.multiplyScalar(1 / scalar);
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }
  crossVectors(a, b) {
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }
  setFromMatrixPosition(m) {
    const e = m.elements;
    this.x = e[12];
    this.y = e[13];
    this.z = e[14];
    return this;
  }
  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
    yield this.z;
  }
};

// lib/math/Matrix4.mjs
var WebGLCoordinateSystem = 2e3;
var WebGPUCoordinateSystem = 2001;
var Matrix4 = class _Matrix4 {
  constructor(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
    _Matrix4.prototype.isMatrix4 = true;
    this.elements = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ];
    if (n11 !== void 0) {
      this.set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44);
    }
  }
  set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
    const te = this.elements;
    te[0] = n11;
    te[4] = n12;
    te[8] = n13;
    te[12] = n14;
    te[1] = n21;
    te[5] = n22;
    te[9] = n23;
    te[13] = n24;
    te[2] = n31;
    te[6] = n32;
    te[10] = n33;
    te[14] = n34;
    te[3] = n41;
    te[7] = n42;
    te[11] = n43;
    te[15] = n44;
    return this;
  }
  identity() {
    this.set(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    );
    return this;
  }
  clone() {
    return new _Matrix4().fromArray(this.elements);
  }
  copy(m) {
    const te = this.elements;
    const me = m.elements;
    te[0] = me[0];
    te[1] = me[1];
    te[2] = me[2];
    te[3] = me[3];
    te[4] = me[4];
    te[5] = me[5];
    te[6] = me[6];
    te[7] = me[7];
    te[8] = me[8];
    te[9] = me[9];
    te[10] = me[10];
    te[11] = me[11];
    te[12] = me[12];
    te[13] = me[13];
    te[14] = me[14];
    te[15] = me[15];
    return this;
  }
  copyPosition(m) {
    const te = this.elements, me = m.elements;
    te[12] = me[12];
    te[13] = me[13];
    te[14] = me[14];
    return this;
  }
  setFromMatrix3(m) {
    const me = m.elements;
    this.set(
      me[0],
      me[3],
      me[6],
      0,
      me[1],
      me[4],
      me[7],
      0,
      me[2],
      me[5],
      me[8],
      0,
      0,
      0,
      0,
      1
    );
    return this;
  }
  extractBasis(xAxis, yAxis, zAxis) {
    xAxis.setFromMatrixColumn(this, 0);
    yAxis.setFromMatrixColumn(this, 1);
    zAxis.setFromMatrixColumn(this, 2);
    return this;
  }
  makeBasis(xAxis, yAxis, zAxis) {
    this.set(
      xAxis.x,
      yAxis.x,
      zAxis.x,
      0,
      xAxis.y,
      yAxis.y,
      zAxis.y,
      0,
      xAxis.z,
      yAxis.z,
      zAxis.z,
      0,
      0,
      0,
      0,
      1
    );
    return this;
  }
  extractRotation(m) {
    const te = this.elements;
    const me = m.elements;
    const scaleX = 1 / _v1.setFromMatrixColumn(m, 0).length();
    const scaleY = 1 / _v1.setFromMatrixColumn(m, 1).length();
    const scaleZ = 1 / _v1.setFromMatrixColumn(m, 2).length();
    te[0] = me[0] * scaleX;
    te[1] = me[1] * scaleX;
    te[2] = me[2] * scaleX;
    te[3] = 0;
    te[4] = me[4] * scaleY;
    te[5] = me[5] * scaleY;
    te[6] = me[6] * scaleY;
    te[7] = 0;
    te[8] = me[8] * scaleZ;
    te[9] = me[9] * scaleZ;
    te[10] = me[10] * scaleZ;
    te[11] = 0;
    te[12] = 0;
    te[13] = 0;
    te[14] = 0;
    te[15] = 1;
    return this;
  }
  makeRotationFromEuler(euler) {
    const te = this.elements;
    const x = euler.x, y = euler.y, z = euler.z;
    const a = Math.cos(x), b = Math.sin(x);
    const c = Math.cos(y), d = Math.sin(y);
    const e = Math.cos(z), f = Math.sin(z);
    if (euler.order === "XYZ") {
      const ae = a * e, af = a * f, be = b * e, bf = b * f;
      te[0] = c * e;
      te[4] = -c * f;
      te[8] = d;
      te[1] = af + be * d;
      te[5] = ae - bf * d;
      te[9] = -b * c;
      te[2] = bf - ae * d;
      te[6] = be + af * d;
      te[10] = a * c;
    } else if (euler.order === "YXZ") {
      const ce = c * e, cf = c * f, de = d * e, df = d * f;
      te[0] = ce + df * b;
      te[4] = de * b - cf;
      te[8] = a * d;
      te[1] = a * f;
      te[5] = a * e;
      te[9] = -b;
      te[2] = cf * b - de;
      te[6] = df + ce * b;
      te[10] = a * c;
    } else if (euler.order === "ZXY") {
      const ce = c * e, cf = c * f, de = d * e, df = d * f;
      te[0] = ce - df * b;
      te[4] = -a * f;
      te[8] = de + cf * b;
      te[1] = cf + de * b;
      te[5] = a * e;
      te[9] = df - ce * b;
      te[2] = -a * d;
      te[6] = b;
      te[10] = a * c;
    } else if (euler.order === "ZYX") {
      const ae = a * e, af = a * f, be = b * e, bf = b * f;
      te[0] = c * e;
      te[4] = be * d - af;
      te[8] = ae * d + bf;
      te[1] = c * f;
      te[5] = bf * d + ae;
      te[9] = af * d - be;
      te[2] = -d;
      te[6] = b * c;
      te[10] = a * c;
    } else if (euler.order === "YZX") {
      const ac = a * c, ad = a * d, bc = b * c, bd = b * d;
      te[0] = c * e;
      te[4] = bd - ac * f;
      te[8] = bc * f + ad;
      te[1] = f;
      te[5] = a * e;
      te[9] = -b * e;
      te[2] = -d * e;
      te[6] = ad * f + bc;
      te[10] = ac - bd * f;
    } else if (euler.order === "XZY") {
      const ac = a * c, ad = a * d, bc = b * c, bd = b * d;
      te[0] = c * e;
      te[4] = -f;
      te[8] = d * e;
      te[1] = ac * f + bd;
      te[5] = a * e;
      te[9] = ad * f - bc;
      te[2] = bc * f - ad;
      te[6] = b * e;
      te[10] = bd * f + ac;
    }
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;
    te[12] = 0;
    te[13] = 0;
    te[14] = 0;
    te[15] = 1;
    return this;
  }
  makeRotationFromQuaternion(q) {
    return this.compose(_zero, q, _one);
  }
  lookAt(eye, target, up) {
    const te = this.elements;
    _z.subVectors(eye, target);
    if (_z.lengthSq() === 0) {
      _z.z = 1;
    }
    _z.normalize();
    _x.crossVectors(up, _z);
    if (_x.lengthSq() === 0) {
      if (Math.abs(up.z) === 1) {
        _z.x += 1e-4;
      } else {
        _z.z += 1e-4;
      }
      _z.normalize();
      _x.crossVectors(up, _z);
    }
    _x.normalize();
    _y.crossVectors(_z, _x);
    te[0] = _x.x;
    te[4] = _y.x;
    te[8] = _z.x;
    te[1] = _x.y;
    te[5] = _y.y;
    te[9] = _z.y;
    te[2] = _x.z;
    te[6] = _y.z;
    te[10] = _z.z;
    return this;
  }
  multiply(m) {
    return this.multiplyMatrices(this, m);
  }
  premultiply(m) {
    return this.multiplyMatrices(m, this);
  }
  multiplyMatrices(a, b) {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;
    const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
    const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
    const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
    const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];
    const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
    const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
    const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
    const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    return this;
  }
  multiplyScalar(s) {
    const te = this.elements;
    te[0] *= s;
    te[4] *= s;
    te[8] *= s;
    te[12] *= s;
    te[1] *= s;
    te[5] *= s;
    te[9] *= s;
    te[13] *= s;
    te[2] *= s;
    te[6] *= s;
    te[10] *= s;
    te[14] *= s;
    te[3] *= s;
    te[7] *= s;
    te[11] *= s;
    te[15] *= s;
    return this;
  }
  determinant() {
    const te = this.elements;
    const n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
    const n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
    const n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
    const n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];
    return n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) + n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) + n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) + n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
  }
  transpose() {
    const te = this.elements;
    let tmp;
    tmp = te[1];
    te[1] = te[4];
    te[4] = tmp;
    tmp = te[2];
    te[2] = te[8];
    te[8] = tmp;
    tmp = te[6];
    te[6] = te[9];
    te[9] = tmp;
    tmp = te[3];
    te[3] = te[12];
    te[12] = tmp;
    tmp = te[7];
    te[7] = te[13];
    te[13] = tmp;
    tmp = te[11];
    te[11] = te[14];
    te[14] = tmp;
    return this;
  }
  setPosition(x, y, z) {
    const te = this.elements;
    if (x.isVector3) {
      te[12] = x.x;
      te[13] = x.y;
      te[14] = x.z;
    } else {
      te[12] = x;
      te[13] = y;
      te[14] = z;
    }
    return this;
  }
  invert() {
    const te = this.elements, n11 = te[0], n21 = te[1], n31 = te[2], n41 = te[3], n12 = te[4], n22 = te[5], n32 = te[6], n42 = te[7], n13 = te[8], n23 = te[9], n33 = te[10], n43 = te[11], n14 = te[12], n24 = te[13], n34 = te[14], n44 = te[15], t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44, t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44, t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44, t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
    if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const detInv = 1 / det;
    te[0] = t11 * detInv;
    te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
    te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
    te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
    te[4] = t12 * detInv;
    te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
    te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
    te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
    te[8] = t13 * detInv;
    te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
    te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
    te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
    te[12] = t14 * detInv;
    te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
    te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
    te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
    return this;
  }
  scale(v) {
    const te = this.elements;
    const x = v.x, y = v.y, z = v.z;
    te[0] *= x;
    te[4] *= y;
    te[8] *= z;
    te[1] *= x;
    te[5] *= y;
    te[9] *= z;
    te[2] *= x;
    te[6] *= y;
    te[10] *= z;
    te[3] *= x;
    te[7] *= y;
    te[11] *= z;
    return this;
  }
  getMaxScaleOnAxis() {
    const te = this.elements;
    const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
    const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
    const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
    return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
  }
  makeTranslation(x, y, z) {
    if (x.isVector3) {
      this.set(
        1,
        0,
        0,
        x.x,
        0,
        1,
        0,
        x.y,
        0,
        0,
        1,
        x.z,
        0,
        0,
        0,
        1
      );
    } else {
      this.set(
        1,
        0,
        0,
        x,
        0,
        1,
        0,
        y,
        0,
        0,
        1,
        z,
        0,
        0,
        0,
        1
      );
    }
    return this;
  }
  makeRotationX(theta) {
    const c = Math.cos(theta), s = Math.sin(theta);
    this.set(
      1,
      0,
      0,
      0,
      0,
      c,
      -s,
      0,
      0,
      s,
      c,
      0,
      0,
      0,
      0,
      1
    );
    return this;
  }
  makeRotationY(theta) {
    const c = Math.cos(theta), s = Math.sin(theta);
    this.set(
      c,
      0,
      s,
      0,
      0,
      1,
      0,
      0,
      -s,
      0,
      c,
      0,
      0,
      0,
      0,
      1
    );
    return this;
  }
  makeRotationZ(theta) {
    const c = Math.cos(theta), s = Math.sin(theta);
    this.set(
      c,
      -s,
      0,
      0,
      s,
      c,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    );
    return this;
  }
  makeRotationAxis(axis, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;
    const x = axis.x, y = axis.y, z = axis.z;
    const tx = t * x, ty = t * y;
    this.set(
      tx * x + c,
      tx * y - s * z,
      tx * z + s * y,
      0,
      tx * y + s * z,
      ty * y + c,
      ty * z - s * x,
      0,
      tx * z - s * y,
      ty * z + s * x,
      t * z * z + c,
      0,
      0,
      0,
      0,
      1
    );
    return this;
  }
  makeScale(x, y, z) {
    this.set(
      x,
      0,
      0,
      0,
      0,
      y,
      0,
      0,
      0,
      0,
      z,
      0,
      0,
      0,
      0,
      1
    );
    return this;
  }
  makeShear(xy, xz, yx, yz, zx, zy) {
    this.set(
      1,
      yx,
      zx,
      0,
      xy,
      1,
      zy,
      0,
      xz,
      yz,
      1,
      0,
      0,
      0,
      0,
      1
    );
    return this;
  }
  compose(position, quaternion, scale) {
    const te = this.elements;
    const x = quaternion._x, y = quaternion._y, z = quaternion._z, w = quaternion._w;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;
    const sx = scale.x, sy = scale.y, sz = scale.z;
    te[0] = (1 - (yy + zz)) * sx;
    te[1] = (xy + wz) * sx;
    te[2] = (xz - wy) * sx;
    te[3] = 0;
    te[4] = (xy - wz) * sy;
    te[5] = (1 - (xx + zz)) * sy;
    te[6] = (yz + wx) * sy;
    te[7] = 0;
    te[8] = (xz + wy) * sz;
    te[9] = (yz - wx) * sz;
    te[10] = (1 - (xx + yy)) * sz;
    te[11] = 0;
    te[12] = position.x;
    te[13] = position.y;
    te[14] = position.z;
    te[15] = 1;
    return this;
  }
  decompose(position, quaternion, scale) {
    const te = this.elements;
    let sx = _v1.set(te[0], te[1], te[2]).length();
    const sy = _v1.set(te[4], te[5], te[6]).length();
    const sz = _v1.set(te[8], te[9], te[10]).length();
    const det = this.determinant();
    if (det < 0) sx = -sx;
    position.x = te[12];
    position.y = te[13];
    position.z = te[14];
    _m1.copy(this);
    const invSX = 1 / sx;
    const invSY = 1 / sy;
    const invSZ = 1 / sz;
    _m1.elements[0] *= invSX;
    _m1.elements[1] *= invSX;
    _m1.elements[2] *= invSX;
    _m1.elements[4] *= invSY;
    _m1.elements[5] *= invSY;
    _m1.elements[6] *= invSY;
    _m1.elements[8] *= invSZ;
    _m1.elements[9] *= invSZ;
    _m1.elements[10] *= invSZ;
    quaternion.setFromRotationMatrix(_m1);
    scale.x = sx;
    scale.y = sy;
    scale.z = sz;
    return this;
  }
  makePerspective(left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem) {
    const te = this.elements;
    const x = 2 * near / (right - left);
    const y = 2 * near / (top - bottom);
    const a = (right + left) / (right - left);
    const b = (top + bottom) / (top - bottom);
    let c, d;
    if (coordinateSystem === WebGLCoordinateSystem) {
      c = -(far + near) / (far - near);
      d = -2 * far * near / (far - near);
    } else if (coordinateSystem === WebGPUCoordinateSystem) {
      c = -far / (far - near);
      d = -far * near / (far - near);
    } else {
      throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + coordinateSystem);
    }
    te[0] = x;
    te[4] = 0;
    te[8] = a;
    te[12] = 0;
    te[1] = 0;
    te[5] = y;
    te[9] = b;
    te[13] = 0;
    te[2] = 0;
    te[6] = 0;
    te[10] = c;
    te[14] = d;
    te[3] = 0;
    te[7] = 0;
    te[11] = -1;
    te[15] = 0;
    return this;
  }
  makeOrthographic(left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem) {
    const te = this.elements;
    const w = 1 / (right - left);
    const h = 1 / (top - bottom);
    const p = 1 / (far - near);
    const x = (right + left) * w;
    const y = (top + bottom) * h;
    let z, zInv;
    if (coordinateSystem === WebGLCoordinateSystem) {
      z = (far + near) * p;
      zInv = -2 * p;
    } else if (coordinateSystem === WebGPUCoordinateSystem) {
      z = near * p;
      zInv = -1 * p;
    } else {
      throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + coordinateSystem);
    }
    te[0] = 2 * w;
    te[4] = 0;
    te[8] = 0;
    te[12] = -x;
    te[1] = 0;
    te[5] = 2 * h;
    te[9] = 0;
    te[13] = -y;
    te[2] = 0;
    te[6] = 0;
    te[10] = zInv;
    te[14] = -z;
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;
    te[15] = 1;
    return this;
  }
  equals(matrix) {
    const te = this.elements;
    const me = matrix.elements;
    for (let i = 0; i < 16; i++) {
      if (te[i] !== me[i]) return false;
    }
    return true;
  }
  fromArray(array, offset = 0) {
    for (let i = 0; i < 16; i++) {
      this.elements[i] = array[i + offset];
    }
    return this;
  }
  toArray(array = [], offset = 0) {
    const te = this.elements;
    array[offset] = te[0];
    array[offset + 1] = te[1];
    array[offset + 2] = te[2];
    array[offset + 3] = te[3];
    array[offset + 4] = te[4];
    array[offset + 5] = te[5];
    array[offset + 6] = te[6];
    array[offset + 7] = te[7];
    array[offset + 8] = te[8];
    array[offset + 9] = te[9];
    array[offset + 10] = te[10];
    array[offset + 11] = te[11];
    array[offset + 12] = te[12];
    array[offset + 13] = te[13];
    array[offset + 14] = te[14];
    array[offset + 15] = te[15];
    return array;
  }
};
var _v1 = /* @__PURE__ */ new Vector3();
var _m1 = /* @__PURE__ */ new Matrix4();
var _zero = /* @__PURE__ */ new Vector3(0, 0, 0);
var _one = /* @__PURE__ */ new Vector3(1, 1, 1);
var _x = /* @__PURE__ */ new Vector3();
var _y = /* @__PURE__ */ new Vector3();
var _z = /* @__PURE__ */ new Vector3();

// lib/math/Euler.mjs
var _matrix = /* @__PURE__ */ new Matrix4();
var _quaternion = /* @__PURE__ */ new Quaternion();
var Euler = class _Euler {
  constructor(x = 0, y = 0, z = 0, order = _Euler.DEFAULT_ORDER) {
    this.isEuler = true;
    this._x = x;
    this._y = y;
    this._z = z;
    this._order = order;
  }
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
    this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
    this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(value) {
    this._z = value;
    this._onChangeCallback();
  }
  get order() {
    return this._order;
  }
  set order(value) {
    this._order = value;
    this._onChangeCallback();
  }
  set(x, y, z, order = this._order) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._order = order;
    this._onChangeCallback();
    return this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(euler) {
    this._x = euler._x;
    this._y = euler._y;
    this._z = euler._z;
    this._order = euler._order;
    this._onChangeCallback();
    return this;
  }
  setFromRotationMatrix(m, order = this._order, update = true) {
    const te = m.elements;
    const m11 = te[0], m12 = te[4], m13 = te[8];
    const m21 = te[1], m22 = te[5], m23 = te[9];
    const m31 = te[2], m32 = te[6], m33 = te[10];
    switch (order) {
      case "XYZ":
        this._y = Math.asin(clamp(m13, -1, 1));
        if (Math.abs(m13) < 0.9999999) {
          this._x = Math.atan2(-m23, m33);
          this._z = Math.atan2(-m12, m11);
        } else {
          this._x = Math.atan2(m32, m22);
          this._z = 0;
        }
        break;
      case "YXZ":
        this._x = Math.asin(-clamp(m23, -1, 1));
        if (Math.abs(m23) < 0.9999999) {
          this._y = Math.atan2(m13, m33);
          this._z = Math.atan2(m21, m22);
        } else {
          this._y = Math.atan2(-m31, m11);
          this._z = 0;
        }
        break;
      case "ZXY":
        this._x = Math.asin(clamp(m32, -1, 1));
        if (Math.abs(m32) < 0.9999999) {
          this._y = Math.atan2(-m31, m33);
          this._z = Math.atan2(-m12, m22);
        } else {
          this._y = 0;
          this._z = Math.atan2(m21, m11);
        }
        break;
      case "ZYX":
        this._y = Math.asin(-clamp(m31, -1, 1));
        if (Math.abs(m31) < 0.9999999) {
          this._x = Math.atan2(m32, m33);
          this._z = Math.atan2(m21, m11);
        } else {
          this._x = 0;
          this._z = Math.atan2(-m12, m22);
        }
        break;
      case "YZX":
        this._z = Math.asin(clamp(m21, -1, 1));
        if (Math.abs(m21) < 0.9999999) {
          this._x = Math.atan2(-m23, m22);
          this._y = Math.atan2(-m31, m11);
        } else {
          this._x = 0;
          this._y = Math.atan2(m13, m33);
        }
        break;
      case "XZY":
        this._z = Math.asin(-clamp(m12, -1, 1));
        if (Math.abs(m12) < 0.9999999) {
          this._x = Math.atan2(m32, m22);
          this._y = Math.atan2(m13, m11);
        } else {
          this._x = Math.atan2(-m23, m33);
          this._y = 0;
        }
        break;
      default:
        console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + order);
    }
    this._order = order;
    if (update === true) this._onChangeCallback();
    return this;
  }
  setFromQuaternion(q, order, update) {
    _matrix.makeRotationFromQuaternion(q);
    return this.setFromRotationMatrix(_matrix, order, update);
  }
  setFromVector3(v, order = this._order) {
    return this.set(v.x, v.y, v.z, order);
  }
  reorder(newOrder) {
    _quaternion.setFromEuler(this);
    return this.setFromQuaternion(_quaternion, newOrder);
  }
  equals(euler) {
    return euler._x === this._x && euler._y === this._y && euler._z === this._z && euler._order === this._order;
  }
  fromArray(array) {
    this._x = array[0];
    this._y = array[1];
    this._z = array[2];
    if (array[3] !== void 0) this._order = array[3];
    this._onChangeCallback();
    return this;
  }
  toArray(array = [], offset = 0) {
    array[offset] = this._x;
    array[offset + 1] = this._y;
    array[offset + 2] = this._z;
    array[offset + 3] = this._order;
    return array;
  }
  _onChange(callback) {
    this._onChangeCallback = callback;
    return this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x;
    yield this._y;
    yield this._z;
    yield this._order;
  }
};
Euler.DEFAULT_ORDER = "XYZ";

// lib/cameras/Object3D.mjs
var _m12 = /* @__PURE__ */ new Matrix4();
var _target = /* @__PURE__ */ new Vector3();
var _position = /* @__PURE__ */ new Vector3();
var Object3D = class _Object3D {
  constructor() {
    this.up = _Object3D.DEFAULT_UP.clone();
    this.position = new Vector3();
    this.rotation = new Euler();
    this.quaternion = new Quaternion();
    this.scale = new Vector3(1, 1, 1);
    const onRotationChange = () => this.quaternion.setFromEuler(this.rotation, false);
    const onQuaternionChange = () => this.rotation.setFromQuaternion(this.quaternion, void 0, false);
    this.rotation._onChange(onRotationChange);
    this.quaternion._onChange(onQuaternionChange);
    this.matrix = new Matrix4();
    this.matrixWorld = new Matrix4();
    this.matrixWorldNeedsUpdate = false;
  }
  lookAt(x, y, z) {
    if (x.isVector3) {
      _target.copy(x);
    } else {
      _target.set(x, y, z);
    }
    this.updateWorldMatrix(true, false);
    _position.setFromMatrixPosition(this.matrixWorld);
    _m12.lookAt(_position, _target, this.up);
    this.quaternion.setFromRotationMatrix(_m12);
  }
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale);
    this.matrixWorldNeedsUpdate = true;
  }
  updateMatrixWorld(force) {
    this.updateMatrix();
    if (this.matrixWorldNeedsUpdate || force) {
      this.matrixWorld.copy(this.matrix);
      this.matrixWorldNeedsUpdate = false;
      force = true;
    }
  }
  updateWorldMatrix(updateParents, updateChildren) {
    this.updateMatrix();
    this.matrixWorld.copy(this.matrix);
  }
};
Object3D.DEFAULT_UP = /* @__PURE__ */ new Vector3(0, 1, 0);

// lib/cameras/Camera.mjs
var Camera = class extends Object3D {
  constructor() {
    super();
    this.matrixWorldInverse = new Matrix4();
    this.projectionMatrix = new Matrix4();
    this.projectionMatrixInverse = new Matrix4();
  }
  updateMatrixWorld(force) {
    super.updateMatrixWorld(force);
    this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  updateWorldMatrix(updateParents, updateChildren) {
    super.updateWorldMatrix(updateParents, updateChildren);
    this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
};

// lib/cameras/PerspectiveCamera.mjs
var DEG2RAD = Math.PI / 180;
var PerspectiveCamera = class extends Camera {
  constructor(fov = 50, aspect = 1, near = 0.1, far = 2e3) {
    super();
    this.isPerspectiveCamera = true;
    this.fov = fov;
    this.zoom = 1;
    this.near = near;
    this.far = far;
    this.focus = 10;
    this.aspect = aspect;
    this.view = null;
    this.filmGauge = 35;
    this.filmOffset = 0;
    this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const near = this.near;
    let top = near * Math.tan(DEG2RAD * 0.5 * this.fov) / this.zoom;
    let height = 2 * top;
    let width = this.aspect * height;
    let left = -0.5 * width;
    const skew = this.filmOffset;
    if (skew !== 0) left += near * skew / this.getFilmWidth();
    this.projectionMatrix.makePerspective(left, left + width, top, top - height, near, this.far, this.coordinateSystem);
    this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
};

// lib/core/Renderer.mjs
var epsilon = (value) => Math.abs(value) < 1e-10 ? 0 : value;
var CSS3DRenderer = class {
  constructor(camera, viewElement = null, cameraElement = null) {
    this.camera = camera;
    this.width = 0;
    this.height = 0;
    this.widthHalf = 0;
    this.heightHalf = 0;
    this.viewElement = viewElement || document.createElement("div");
    this.cameraElement = cameraElement || document.createElement("div");
    this.cameraElement.style.transformStyle = "preserve-3d";
    this.viewElement.appendChild(this.cameraElement);
  }
  getCameraCSSMatrix(matrix) {
    const elements = matrix.elements;
    return "matrix3d(" + epsilon(elements[0]) + "," + epsilon(-elements[1]) + "," + epsilon(elements[2]) + "," + epsilon(elements[3]) + "," + epsilon(elements[4]) + "," + epsilon(-elements[5]) + "," + epsilon(elements[6]) + "," + epsilon(elements[7]) + "," + epsilon(elements[8]) + "," + epsilon(-elements[9]) + "," + epsilon(elements[10]) + "," + epsilon(elements[11]) + "," + epsilon(elements[12]) + "," + epsilon(-elements[13]) + "," + epsilon(elements[14]) + "," + epsilon(elements[15]) + ")";
  }
  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.widthHalf = width / 2;
    this.heightHalf = height / 2;
    this.viewElement.style.width = width + "px";
    this.viewElement.style.height = height + "px";
    this.cameraElement.style.width = width + "px";
    this.cameraElement.style.height = height + "px";
  }
  render() {
    console.log("render");
    const camera = this.camera;
    const cameraElement = this.cameraElement;
    const viewElement = this.viewElement;
    const _widthHalf = this.widthHalf;
    const _heightHalf = this.heightHalf;
    const fov = camera.projectionMatrix.elements[5] * _heightHalf;
    camera.updateMatrixWorld();
    let tx, ty;
    if (camera.isOrthographicCamera) {
      tx = -(camera.right + camera.left) / 2;
      ty = (camera.top + camera.bottom) / 2;
    }
    const p = fov * 40;
    const scaleByViewOffset = camera.view && camera.view.enabled ? camera.view.height / camera.view.fullHeight : 1;
    const cameraCSSMatrix = camera.isOrthographicCamera ? `scale( ${scaleByViewOffset} )scale(` + fov + ")translate(" + epsilon(tx) + "px," + epsilon(ty) + "px)" + this.getCameraCSSMatrix(camera.matrixWorldInverse) : `scale( ${scaleByViewOffset} )translateZ(` + fov + "px)" + this.getCameraCSSMatrix(camera.matrixWorldInverse);
    const perspective = camera.isPerspectiveCamera ? "perspective(" + p + "px) " : "";
    const style = perspective + cameraCSSMatrix + "translate(" + _widthHalf + "px," + _heightHalf + "px)";
    cameraElement.style.transform = style;
  }
};

// lib/core/EventDispatcher.mjs
var EventDispatcher = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  addEventListener(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(callback);
  }
  removeEventListener(type, callback) {
    if (this.listeners.has(type)) {
      const callbacks = this.listeners.get(type);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  dispatchEvent(event) {
    if (this.listeners.has(event.type)) {
      const callbacks = this.listeners.get(event.type);
      for (const callback of callbacks) {
        callback(event);
      }
    }
  }
};

// lib/controls/OrbitControls.mjs
var OrbitControls = class extends EventDispatcher {
  constructor(camera, domElement) {
    super();
    this.camera = camera;
    this.domElement = domElement;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.isDragging = false;
    this.rotation = {
      x: 0,
      y: 0
    };
    this.mouse = {
      x: 0,
      y: 0
    };
    this.z = camera.position.z;
    this.init();
  }
  init() {
    this.domElement.addEventListener("mousedown", this.onMouseDown);
    this.domElement.addEventListener("mousemove", this.onMouseMove);
    this.domElement.addEventListener("mouseup", this.onMouseUp);
    this.domElement.addEventListener("wheel", this.onWheel);
  }
  dispose() {
    this.domElement.removeEventListener("mousedown", this.onMouseDown);
    this.domElement.removeEventListener("mousemove", this.onMouseMove);
    this.domElement.removeEventListener("mouseup", this.onMouseUp);
    this.domElement.removeEventListener("wheel", this.onWheel);
  }
  onMouseDown(event) {
    this.isDragging = true;
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }
  onMouseMove(event) {
    if (this.isDragging) {
      const deltaX = event.clientX - this.mouse.x;
      const deltaY = event.clientY - this.mouse.y;
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;
      this.rotation.y -= deltaX * 0.5;
      this.rotation.x += deltaY * 0.5;
      const radius = Math.sqrt(this.camera.position.x ** 2 + this.camera.position.y ** 2 + this.camera.position.z ** 2);
      const theta = Math.atan2(this.camera.position.x, this.camera.position.z);
      const phi = Math.acos(this.camera.position.y / radius);
      const deltaTheta = deltaX * -0.01;
      const deltaPhi = deltaY * 0.01;
      const newTheta = theta + deltaTheta;
      const newPhi = Math.max(Math.min(phi - deltaPhi, Math.PI - 0.01), 0.01);
      const x = radius * Math.sin(newPhi) * Math.sin(newTheta);
      const y = radius * Math.cos(newPhi);
      const z = radius * Math.sin(newPhi) * Math.cos(newTheta);
      this.camera.position.set(x, y, z);
      this.camera.lookAt(0, 0, 0);
      this.camera.updateProjectionMatrix();
      this.update();
    }
  }
  onMouseUp(event) {
    this.isDragging = false;
  }
  onWheel(event) {
    const deltaZ = event.deltaY * 0.4;
    const direction = this.camera.position.clone().normalize();
    const newPosition = this.camera.position.clone().sub(direction.multiplyScalar(deltaZ));
    const { x, y, z } = newPosition;
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
    this.update();
    event.preventDefault();
  }
  update() {
    this.dispatchEvent({ type: "change" });
  }
};

// lib/core/Scene.mjs
var C3Scene = class extends HTMLElement {
  #camera;
  #renderer;
  constructor() {
    super();
    this.handleResize = this.handleResize.bind(this);
    this.render = this.render.bind(this);
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          min-height: 250px;
          display: flex;
          overflow: hidden;
          position: relative;
          perspective: 300px;
          -webkit-perspective: 300px;
          perspective-origin: center center;
          transform-style: preserve-3d;
          aspect-ratio: 16/9;
          padding: 0;
        }

        :host * {
          transform-style: preserve-3d;
          box-sizing: border-box;
        }

        :host .view {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          transform-style: preserve-3d;
        }

        :host slot {
          display: block;
          transform-style: preserve-3d;
        }

      </style>
      <div class="view">
        <div class="camera">
          <slot></slot>
        </div>
      </div>
    `;
    const { width, height } = this.getBoundingClientRect();
    this.#camera = new PerspectiveCamera(50, width / height, 0.1, 1e3);
    this.#camera.position.x = 0;
    this.#camera.position.y = 100;
    this.#camera.position.z = 580;
    const viewElement = shadowRoot.querySelector(".view");
    const cameraElement = shadowRoot.querySelector(".camera");
    this.#renderer = new CSS3DRenderer(this.#camera, viewElement, cameraElement);
    this.#renderer.setSize(width, height);
    const controls = new OrbitControls(this.#camera, viewElement);
    controls.addEventListener("change", this.render);
    this.render();
    this.#camera.lookAt(0, 0, 0);
  }
  get camera() {
    return this.#camera;
  }
  connectedCallback() {
    window.addEventListener("resize", this.handleResize);
    this.render();
  }
  handleResize() {
    const { width, height } = this.getBoundingClientRect();
    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(width, height);
  }
  render() {
    this.#renderer.render();
  }
};
customElements.define("c3-scene", C3Scene);

// lib/utils.mjs
var camelize = (str) => str.replace(/-./g, (s) => s.charAt(1).toUpperCase());
var decamelize = (str) => str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

// lib/mixins/CSSStyleMixin.mjs
var getStylesheet = (shadowRoot) => {
  let style = shadowRoot.querySelector("style[data-c3-style-handle]");
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("data-c3-style-handle", "");
    shadowRoot.appendChild(style);
  }
  return style.sheet;
};
var CSSStyleMixin = (clazz, props, isVar = false, callback = (target, prop, newValue) => target.dispatchEvent(new CustomEvent("change", { bubbles: false, detail: { name: prop, value: newValue } }))) => {
  props.forEach((prop) => {
    const name = typeof prop === "string" ? prop : prop[1];
    prop = typeof prop === "string" ? prop : prop[0];
    console.log("DEFINE: ", clazz.name, prop, name, isVar ? "VAR" : "VALUE");
    Object.defineProperty(clazz.prototype, prop, {
      configurable: true,
      get() {
        console.log("GET VALUE: ", clazz.name, prop);
        return window.getComputedStyle(this.shadowRoot.host).getPropertyValue(
          isVar ? `--${name}` : name
        );
      },
      set(value) {
        console.log("SET VALUE: ", clazz.name, prop, value);
        const sheet = getStylesheet(this.shadowRoot);
        const rule = [...sheet.cssRules].filter((rule2) => rule2.selectorText === ":host")[0];
        const hyphenated = decamelize(name);
        const oldValue = this[prop];
        if (rule) {
          rule.style.setProperty(isVar ? `--${name}` : hyphenated, value);
        } else {
          sheet.insertRule(`:host {
            ${isVar ? `--${name}` : hyphenated}: ${value};
          }`, 0);
        }
        const newValue = this[prop];
        if (oldValue !== newValue && callback) {
          callback(this, prop, newValue, oldValue);
        }
      }
    });
  });
};

// lib/core/3DObject.mjs
var C3Object = class _C3Object extends HTMLElement {
  #style;
  constructor() {
    super();
    this.render = this.render.bind(this);
    this.attachShadow({ mode: "open" });
    this.#style = document.createElement("style");
    this.#style.textContent = `
      :host {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        display: block;
        pointer-events: auto;
        user-select: none;
        transform-style: preserve-3d;
      }

      :host * {
        transform-style: preserve-3d;
      }

      :host::before {
        content: '';
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        outline: 5px solid blue;
        transform-style: preserve-3d;
      }
    `;
    this.shadowRoot.appendChild(this.#style);
  }
  static get observedAttributes() {
    return [
      "position",
      "rotate",
      "scale",
      "animation",
      "background",
      "color"
    ];
  }
  static getPosition(target) {
    const position = window.getComputedStyle(target).getPropertyValue("translate");
    console.log("position", position);
    const [x = 0, y = 0, z = 0] = position.split(/\s+/).map((n = "") => Number(n.replace(/px$/g, ""))).map((n) => !isNaN(n) ? n : 0);
    return new Vector3(x, y, z);
  }
  connectedCallback() {
    window.requestAnimationFrame(() => this.render());
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    const prop = camelize(name);
    if (Reflect.has(this, prop)) {
      this[prop] = newValue;
    } else {
      this.render();
    }
  }
  get x() {
    return _C3Object.getPosition(this).x;
  }
  get y() {
    return _C3Object.getPosition(this).y;
  }
  get z() {
    return _C3Object.getPosition(this).y;
  }
  get scene() {
    return this.closest("c3-scene");
  }
  render() {
  }
};
CSSStyleMixin(C3Object, [
  ["position", "translate"],
  "rotate",
  "scale",
  "animation"
]);

// lib/shapes/box.mjs
var box = `
  <style scoped>
    :host {
      --width: 200px;
      --height: 200px;
      --depth: 200px;
      --background: rgba(0, 255, 255, 0.6);
    }

    :host .cube {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--width);
      height: var(--height);
      transform-style: preserve-3d;
      transform: translate3d(-50%, -50%, calc(var(--depth) / 2 - var(--width) / 2));
      
    }

    :host .face {
      width: var(--width);
      height: var(--height);
      display: block;
      position: absolute;
      background: var(--background, 'gray');
      /* backface-visibility: hidden; */
      transform-style: preserve-3d;
      /*border: 1px solid red;*/
    }

    /*
    .face {
      position: absolute;
      width: var(--width);
      height: var(--height);
      border: 2px solid black;
      background: var(--background, 'gray');
      backface-visibility: hidden;
      transform-style: preserve-3d;
    }*/
  
    :host .front {
      transform: rotateY( 0deg) translateZ(calc(var(--width) / 2));
      transform-origin: \xDF 0;
    }

    :host .back {
      transform: rotateX( 180deg) translateZ(calc( var(--depth) - var(--width) / 2 )) ;
    }

    :host .right {
      width: var(--depth);
      transform: rotateY( 90deg) translateX(calc(var(--depth) / 2 - var(--width) / 2)) translateZ(calc( var(--width) - var(--depth) / 2 )) scaleX(-1);
    }

    :host .left {
      width: var(--depth);
      transform: rotateY( -90deg) translateX(calc(var(--width) / 2 - var(--depth) / 2)) translateZ(calc(var(--depth) / 2 ))  scaleX(-1); 
    }

    :host .top {
      height: var(--depth);
      transform: rotateX( 90deg) translateY(calc(var(--width) / 2 - var(--depth) / 2)) translateX(0)  translateZ(calc(var(--depth) / 2)) scaleY(-1);
    }

    :host .bottom {
      height: var(--depth);
      transform: rotateX( -90deg) translateY(calc( var(--depth) / 2 - var(--width) / 2))  translateZ(calc(var(--height) - var(--depth) / 2))  scaleY(-1);
    }
   
    
    
  </style>
  <div class="cube">
    <div class="face front"></div>
    <div class="face back"></div>
    <div class="face right"></div>
    <div class="face left"></div>
    <div class="face top"></div>
    <div class="face bottom"></div>
  </div>
`;

// lib/elements/Box.mjs
var C3Box = class extends C3Object {
  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
      "background",
      "width",
      "height",
      "depth"
    ];
  }
  constructor() {
    super();
    const shape = document.createElement("div");
    shape.style.transformStyle = "preserve-3d";
    shape.innerHTML = box;
    this.shadowRoot.appendChild(shape);
  }
};
CSSStyleMixin(C3Box, [
  "background",
  "width",
  "height",
  "depth"
], true);
customElements.define("c3-box", C3Box);

// lib/elements/Grid.mjs
var C3Grid = class extends C3Object {
  #style;
  constructor() {
    super();
    this.#style = document.createElement("style");
    this.shadowRoot.appendChild(this.#style);
  }
  connectedCallback() {
    this.render();
  }
  render() {
    super.render();
    const f = 1;
    const size = parseFloat(this.getAttribute("size") || "200px");
    const divisions = parseInt(this.getAttribute("divisions") || "10");
    const width = size * f;
    const height = size * f;
    this.shadowRoot.host.style.setProperty("--color", "rgba(2555, 255, 255, 0.5)");
    this.#style.textContent = `
      :host {
        --size: ${size}px;
        --divisions: ${divisions};
      }
      
      :host::after {
        --stroke: 2.5px;
        --tile: calc(var(--size) / var(--divisions));
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: calc(var(--size) + var(--stroke));
        height: calc(var(--size) + var(--stroke));
        background: repeating-linear-gradient(90deg, var(--color), var(--color) 1px, transparent 1px, transparent var(--tile)) 
            , repeating-linear-gradient(180deg, var(--color), var(--color) 1px, transparent 1px, transparent var(--tile));
        transform: rotateX(90deg)  translate(-50%, -50%);
        transform-style: preserve-3d;
        transform-origin: 0 0;
      }
    `;
  }
};
customElements.define("c3-grid", C3Grid);

// lib/elements/Group.mjs
var C3Group = class extends C3Object {
  #slot;
  // #mutationObserver;
  static get observedAttributes() {
    return [...C3Object.observedAttributes];
  }
  constructor() {
    super();
    this.handleSlotChange = this.handleSlotChange.bind(this);
    const slot = document.createElement("slot");
    slot.style.display = "block";
    slot.style.transformStyle = "preserve-3d";
    this.shadowRoot.appendChild(slot);
    slot.addEventListener("slotchange", this.handleSlotChange);
    this.#slot = slot;
  }
  disconnectedCallback() {
    this.#slot.removeEventListener("slotchange", this.handleSlotChange);
  }
  // handleChildrenChange() {
  //   console.log('*********** children change...');
  //   this.render();
  // }
  handleSlotChange() {
    console.log("****** slot change...");
    this.render();
  }
};
customElements.define("c3-group", C3Group);

// lib/shapes/polyhedron.mjs
var import_quickhull3d = __toESM(require_dist(), 1);
var qh = import_quickhull3d.default["default"];
var polyhedron = (points) => {
  console.log("polyhedron...", points);
  points = points.map((point) => [...point]);
  points = points.filter((point, index) => points.findIndex((p) => p.join() === point.join()) === index);
  if (points.length < 4) {
    return "";
  }
  console.log("points", points);
  const faces = qh(points).map((face) => face.map((index) => points[index])).map((face) => face.map((point) => new Vector3(...point))).map((face, index) => {
    const [a, b, c] = face;
    const center = centroid(a, b, c);
    const normal = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
    const angle = Math.acos(normal.z);
    const axis = normal.clone().cross(new Vector3(0, 0, -1)).normalize();
    const points2d = face.map((point) => point.clone().sub(center).applyAxisAngle(axis, -angle));
    const minX = Math.min(...points2d.map((point) => point.x));
    const minY = Math.min(...points2d.map((point) => point.y));
    const maxX = Math.max(...points2d.map((point) => point.x));
    const maxY = Math.max(...points2d.map((point) => point.y));
    const width = maxX - minX;
    const height = maxY - minY;
    const shiftX = minX + width / 2;
    const shiftY = minY + height / 2;
    const local2d = points2d.map((point) => new Vector3(point.x - minX, point.y - minY, 0));
    const clipPath = `polygon(${local2d.map((point) => `${point.x}px ${point.y}px`).join(", ")})`;
    const transform = `
        translate(-50%, -50%)
        translate3d(${center.x}px, ${center.y}px, ${center.z}px)
        rotate3d(${axis.x}, ${axis.y}, ${axis.z}, ${rad2deg(angle)}deg)
        translate(${shiftX}px, ${shiftY}px)
      `;
    return `
        <div
          class="face"
          style="
            width: ${width}px;
            height: ${height}px;
            transform:  ${transform};
            clip-path: ${clipPath};
          "
        >
        </div>
      `;
  });
  return `
    <style scoped>
      :host {
        --background: rgba(0, 255, 255, 0.5);
        cursor: pointer;
      }

      .face {
        position: absolute;
        left: 0;
        top: 0;
        transform-style: preserve-3d;
        transform-origin: center;
        background: var(--background);
        /*backface-visibility: hidden;*/
        
      }

    </style>
    ${faces.join("")}
  `;
};

// lib/elements/Polyhedron.mjs
var C3Polyhedron = class extends C3Group {
  #shape;
  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
      "background"
    ];
  }
  constructor() {
    console.log("C3Polyhedron constructor...");
    super();
    this.handleSlotChange = this.handleSlotChange.bind(this);
    this.#shape = document.createElement("div");
    this.#shape.style.transformStyle = "preserve-3d";
    this.shadowRoot.appendChild(this.#shape);
  }
  get vertices() {
    return [...this.querySelectorAll("c3-vertex")];
  }
  render() {
    console.log("render polyhedron...");
    super.render();
    console.log("this", this);
    const points = [...this.querySelectorAll("c3-vertex")].map((vertex) => [...C3Object.getPosition(vertex)]);
    console.log("points", points);
    this.#shape.innerHTML = polyhedron(points);
  }
};
CSSStyleMixin(C3Polyhedron, [
  "background"
], true);
customElements.define("c3-polyhedron", C3Polyhedron);

// lib/elements/Vertex.mjs
var C3Vertex = class extends C3Object {
  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes
    ];
  }
};
customElements.define("c3-vertex", C3Vertex);

// lib/shapes/cylinder.mjs
var FACETS = 16;
var cylinder = `
  <style scoped>
    :host {
      --radius: 100px;
      --topRadius: 100px;
      --bottomRadius: 100px;
      --height: 200px;
      --facets: ${FACETS};
      --background: rgba(0, 255, 255, 0.1);
    }

    /*
    :host::before,
    :host::after {
      --r: calc(max(var(--topRadius), var(--bottomRadius)));
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: calc(var(--r) * 2);
      height: var(--height);
      transform: translateX(-50%) translateY(-50%) translateZ(calc(var(--r)));
      outline: 2px solid green;
    }

    :host::after {
      transform: translateX(-50%) translateY(-50%) translateZ(calc(-1 * var(--r)));
    }
    */

    .shape {
      --_topRadius: var(--topRadius, var(--radius));
      --_bottomRadius: var(--bottomRadius, var(--radius));
    }

    .shape {
      transform: translate3d(-50%, -50%, calc(var(--radiusTop) / 2));
      transform-style: preserve-3d;
    }

    .top, .bottom, .body {
      transform-style: preserve-3d;
    }

    

    .facet {
      --r: calc((var(--_bottomRadius) + var(--_topRadius)) / 2);
      --angle: calc(var(--facet) * 360deg / var(--facets));
      --x: calc(var(--r) * cos(var(--angle)) - 50%);
      --y: -50%;
      --z: calc(var(--r) * sin(var(--angle)));
      --w2: calc(var(--_topRadius) * 2 * tan(180deg / var(--facets)));
      --w1: calc(var(--_bottomRadius) * 2 * tan(180deg / var(--facets)));

      --w: max(var(--w1), var(--w2));
      --ax: calc(atan2(var(--_bottomRadius) - var(--_topRadius), var(--height)));
      --lx: calc(min(var(--w1), var(--w2)) / 2);
      --h: calc(var(--height) + var(--lx) * sin(ax));
      --s: calc(var(--height) / cos(var(--ax) * -1));
      --a: calc(atan2(var(--s), var(--w2) / 2 - var(--w1) / 2) - 45deg);

      transform-style: preserve-3d;
    }

    .body .facet {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--w);
      height: var(--s);
      transform-origin: 50% 50%;
      transform: translate3d(var(--x), var(--y), var(--z)) rotateY(calc(-1 * var(--angle) + 90deg)) rotateX(calc(var(--ax) * -1));
      
      background: var(--background);
      background-position-x: calc(100% * var(--facet));
      /* background-size: calc(100% * var(--facets)) 100%; */

      --mc: orange;
      --mt: rgba(0, 255, 0, 0.5);
      --mt: transparent; 
     
      mask-image:
        conic-gradient(
          from 135deg at calc( 50% - var(--w1) / 2) 0,
          var(--mt) 45deg,
          var(--mc) 0,
          var(--mc) calc(90deg - var(--a)),
          var(--mt) calc(90deg - var(--a))
        ),

        conic-gradient(
          from 135deg at calc( 50% + var(--w1) / 2) 0,
            var(--mt) calc(var(--a)),
            var(--mc) calc(45deg - var(--a)),
            var(--mc) calc(45deg),
            var(--mt) calc(45deg)
        ),

        conic-gradient(
          from -45deg at calc( 50% - var(--w2) / 2) 100%,
            var(--mt) calc(90deg - var(--a)),
            var(--mc) calc(90deg - var(--a)),
            var(--mc) 45deg,
            var(--mt) 45deg
        ),
        
        conic-gradient(
          from -45deg at calc( 50% + var(--w2) / 2) 100%,
            var(--mt) 45deg,
            var(--mc) 45deg,
            var(--mc) calc(var(--a)),
            var(--mt) calc(var(--a))
        ),
        
        linear-gradient(90deg,
          var(--mt) calc(50% - var(--lx)),
          var(--mc) calc(50% - var(--lx)),
          var(--mc) calc(50% + var(--lx) + 0.5px),
          var(--mt) calc(50% + var(--lx) + 0.5px)
        );
    }

    .top .facet {
      --sx: var(--w2);
      --w: calc(var(--topRadius, var(--radius)) * 2);
      --h: calc(var(--topRadius, var(--radius)) * 2);
    }

    .bottom .facet {
      --sx: var(--w1);
      --w: calc(var(--bottomRadius, var(--radius)) * 2);
      --h: calc(var(--bottomRadius, var(--radius)) * 2);
    }

    .bottom {
      position: absolute;
      top: calc( -1 * var(--height));
    }

    .top .facet,
    .bottom .facet {
      --mc: orange;
      --mt: transparent;
      --r: calc((var(--_bottomRadius) + var(--_topRadius)) / 2);
      --a: calc(atan2(var(--h), var(--sx)));
      --b: calc(atan2(var(--h), var(--sx) * -1));
      --fy: calc(var(--facet) * 0px); 
    }

    .bottom .facet {
      /*transform: translate(-50%, calc(var(--height) / -2 - 50% + var(--fy) )) rotateX(90deg) rotateZ(calc(var(--angle)));*/
    }

    .top .facet::before,
    .bottom .facet::before {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: calc(var(--_topRadius) * 2);
      height: calc(var(--_topRadius) * 2);
      background: var(--background);
     
      transform: translate(-50%, -50%) rotateZ(calc(-1 * var(--angle)));
      transform-origin: 50% 50%;
    }

    .bottom .facet::before {
      width: calc(var(--_bottomRadius) * 2);
      height: calc(var(--_bottomRadius) * 2);
      transform: translate(-50%, -50%) rotateZ(calc(-1 * var(--angle))) scaleX(-1);
    }

    .top .facet,
    .bottom .facet {
      background-size: auto 100%;
    }

    .top .facet,
    .bottom .facet {
      position: absolute;
      width: var(--w);
      height: var(--h);
      transform-origin: 50% 50%;
      transform: translate(-50%, calc(var(--height) / 2 - 50% + var(--fy) )) rotateX(90deg) rotateZ(calc(var(--angle)));
      mask-image: conic-gradient(from calc(0deg ) at 50% 50%, var(--mt) var(--a), var(--mc) var(--a), var(--mc) calc(var(--b)), var(--mt) calc(var(--b)));

      outline: 3px solid blue;
    }

    
  </style>
  <div class="shape cylinder">
    <div class="top">
      ${Array.from({ length: FACETS }, (_, i) => `<div class="facet" style="--facet: ${i}"></div>`).join("\n")}
    </div>
    <div class="body">
      ${Array.from({ length: FACETS }, (_, i) => `<div class="facet" style="--facet: ${i}"></div>`).join("\n")}
    </div>
    <div class="bottom">
      ${Array.from({ length: FACETS }, (_, i) => `<div class="facet" style="--facet: ${i}"></div>`).join("\n")}
    </div>
  </div>
  
`;

// lib/elements/Cylinder.mjs
var C3Cylinder = class extends C3Object {
  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
      "background",
      "radius",
      "topRadius",
      "top-radius",
      "bottomRadius",
      "bottom-radius",
      "height",
      "facets"
    ];
  }
  constructor() {
    super();
    const shape = document.createElement("div");
    shape.style.transformStyle = "preserve-3d";
    shape.innerHTML = cylinder;
    this.shadowRoot.appendChild(shape);
  }
};
CSSStyleMixin(C3Cylinder, [
  "background",
  "radius",
  "topRadius",
  "bottomRadius",
  "height",
  "facets"
], true);
customElements.define("c3-cylinder", C3Cylinder);

// lib/shapes/sphere.mjs
var SLICES = 32;
var FACETS2 = 16;
var sphere = `
  <style scoped>
    :host {
      --radius: 100px;
      --background: gray;
      display: grid;
    }

    .scene {
      width: calc(var(--radius) * 2);
      height: calc(var(--radius) * 2);
      /*transform: translateX(-50%) translateY(-50%) translateZ(calc(var(--radius) * -1));*/
      transform: translate(-50%, -50%);
    }

    :host * {
      transform-style: preserve-3d;
      backface-visibility: hidden;
    }

    .scene,
    .scene *,
    .scene *::before,
    .scene *::after {
      position: absolute;
    }

    .sphere, .slice {
      inset: 0;
    }

    .sphere {
      /* display: grid; */
      transform: scaleX(-1);
    }

    .slice {
      --ngon: 32;
      --angle: calc(360deg/var(--ngon));
      transform: rotateY(calc(var(--angle) * var(--sliceStep))) scaleX(calc(cos(var(--angle) / 2)));
      display: grid;
      place-items: center;
    }

    .facet {
      --facet-width: calc(var(--radius) * 2 * sin(var(--angle) / 2));
      width: var(--facet-width);
      aspect-ratio: 1;
      --ptAngle: calc( atan( (sin(var(--angle)*(var(--ptStep) + 1)) - sin(var(--angle)*var(--ptStep)))/2 ) );
      --peak: calc(-100% * sin(var(--angle)*(var(--facetStep) + 1))/(sin(var(--angle)*(var(--facetStep) + 1)) - sin(var(--angle)*var(--facetStep))) + 100%);
      --clr3: hsl(calc(360deg - 10deg/(var(--ngon)/2)*var(--facetStep)) 100% calc(50% + 38%/(var(--ngon)/2)*var(--facetStep)));  
      --clr4: hsl(calc(360deg - 10deg/(var(--ngon)/2)*(var(--facetStep) + 1)) 100% calc(50% + 38%/(var(--ngon)/2)*(var(--facetStep) + 1)));
      /*background-image: linear-gradient(var(--clr3), var(--clr4)), conic-gradient(from calc(90deg*(1 + var(--dir)) - 1*var(--ptAngle)) at 50% var(--peak), var(--clr1),var(--clr2) calc(2*var(--ptAngle)), transparent 0);*/
      background-blend-mode: difference;
      webkit-mask-image: conic-gradient(from calc(90deg*(1 + var(--dir)) - 1*var(--ptAngle)) at 50% var(--peak), black calc(2*var(--ptAngle)), transparent 0);
      mask-image: conic-gradient(from calc(90deg*(1 + var(--dir)) - 1*var(--ptAngle)) at 50% var(--peak), black calc(2*var(--ptAngle)), transparent 0);
      --pushZ: 52em;
      transform: rotate(calc(90deg + var(--angle)*(.5 + var(--facetStep)))) translateX(calc(var(--pushZ) * cos(var(--angle) / 2))) rotateY(calc(90deg));
      --dir: 1;
      padding-inline: 0;
      background: red;
      background: var(--background);
      background-position: calc(var(--sliceStep) / var(--ngon) * -100%) calc(var(--facetStep) / (var(--ngon) / 2) * 100%);
      background-size: 3200% 1600%;
      backface-visibility: hidden;
    }

    .facet:nth-child(n+9) {
      --dir: -1;
    }

    .slice:nth-child(n-17) .facet:nth-child(n+9),
    .slice:nth-child(n+17) .facet:nth-child(n-9) {
      --clr1: hsl(calc(60deg + 120deg/var(--ngon)*(var(--gradStep) + 1)) 100% calc(50% - 23%/var(--ngon)*(var(--gradStep) + 1)));  
      --clr2: hsl(calc(60deg + 120deg/var(--ngon)*var(--gradStep)) 100% calc(50% - 23%/var(--ngon)*var(--gradStep)));
    }

    :where(.facet),
    .slice:nth-child(n+17) .facet:nth-child(n+9) {
      --clr2: hsl(calc(60deg + 120deg/var(--ngon)*(var(--gradStep) + 1)) 100% calc(50% - 23%/var(--ngon)*(var(--gradStep) + 1)));  
      --clr1: hsl(calc(60deg + 120deg/var(--ngon)*var(--gradStep)) 100% calc(50% - 23%/var(--ngon)*var(--gradStep)));
    }


    .scene .facet {
      --pushZ: var(--radius);
    }

    .scene .facet {
      backface-visibility: hidden;
    }

    /* iterations */

    .slice:nth-child(1) {
      --sliceStep: 0;
    }

    .slice:nth-child(2) {
      --sliceStep: 1;
    }

    .slice:nth-child(3) {
      --sliceStep: 2;
    }

    .slice:nth-child(4) {
      --sliceStep: 3;
    }

    .slice:nth-child(5) {
      --sliceStep: 4;
    }

    .slice:nth-child(6) {
      --sliceStep: 5;
    }

    .slice:nth-child(7) {
      --sliceStep: 6;
    }

    .slice:nth-child(8) {
      --sliceStep: 7;
    }

    .slice:nth-child(9) {
      --sliceStep: 8;
    }

    .slice:nth-child(10) {
      --sliceStep: 9;
    }

    .slice:nth-child(11) {
      --sliceStep: 10;
    }

    .slice:nth-child(12) {
      --sliceStep: 11;
    }

    .slice:nth-child(13) {
      --sliceStep: 12;
    }

    .slice:nth-child(14) {
      --sliceStep: 13;
    }

    .slice:nth-child(15) {
      --sliceStep: 14;
    }

    .slice:nth-child(16) {
      --sliceStep: 15;
    }

    .slice:nth-child(17) {
      --sliceStep: 16;
    }

    .slice:nth-child(18) {
      --sliceStep: 17;
    }

    .slice:nth-child(19) {
      --sliceStep: 18;
    }

    .slice:nth-child(20) {
      --sliceStep: 19;
    }

    .slice:nth-child(21) {
      --sliceStep: 20;
    }

    .slice:nth-child(22) {
      --sliceStep: 21;
    }

    .slice:nth-child(23) {
      --sliceStep: 22;
    }

    .slice:nth-child(24) {
      --sliceStep: 23;
    }

    .slice:nth-child(25) {
      --sliceStep: 24;
    }

    .slice:nth-child(26) {
      --sliceStep: 25;
    }

    .slice:nth-child(27) {
      --sliceStep: 26;
    }

    .slice:nth-child(28) {
      --sliceStep: 27;
    }

    .slice:nth-child(29) {
      --sliceStep: 28;
    }

    .slice:nth-child(30) {
      --sliceStep: 29;
    }

    .slice:nth-child(31) {
      --sliceStep: 30;
    }

    .slice:nth-child(32) {
      --sliceStep: 31;
    }


    /* incrementing the facet's step variable */

    .facet:nth-child(1) {
      --facetStep: 0;
    }

    .facet:nth-child(2) {
      --facetStep: 1;
    }

    .facet:nth-child(3) {
      --facetStep: 2;
    }

    .facet:nth-child(4) {
      --facetStep: 3;
    }

    .facet:nth-child(5) {
      --facetStep: 4;
    }

    .facet:nth-child(6) {
      --facetStep: 5;
    }

    .facet:nth-child(7) {
      --facetStep: 6;
    }

    .facet:nth-child(8) {
      --facetStep: 7;
    }

    .facet:nth-child(9) {
      --facetStep: 8;
    }

    .facet:nth-child(10) {
      --facetStep: 9;
    }

    .facet:nth-child(11) {
      --facetStep: 10;
    }

    .facet:nth-child(12) {
      --facetStep: 11;
    }

    .facet:nth-child(13) {
      --facetStep: 12;
    }

    .facet:nth-child(14) {
      --facetStep: 13;
    }

    .facet:nth-child(15) {
      --facetStep: 14;
    }

    .facet:nth-child(16) {
      --facetStep: 15;
    }

    /* this switches the incrementation and goes backwards at the midpoint */

    .facet:nth-child(1), .facet:nth-last-child(1) {
      --ptStep: 0;
    }

    .facet:nth-child(2), .facet:nth-last-child(2) {
      --ptStep: 1;
    }

    .facet:nth-child(3), .facet:nth-last-child(3) {
      --ptStep: 2;
    }

    .facet:nth-child(4), .facet:nth-last-child(4) {
      --ptStep: 3;
    }

    .facet:nth-child(5), .facet:nth-last-child(5) {
      --ptStep: 4;
    }

    .facet:nth-child(6), .facet:nth-last-child(6) {
      --ptStep: 5;
    }

    .facet:nth-child(7), .facet:nth-last-child(7) {
      --ptStep: 6;
    }

    .facet:nth-child(8), .facet:nth-last-child(8) {
      --ptStep: 7;
    }
  </style>
  <div class="scene">
    <div class="sphere">
      ${[...Array(SLICES)].map((_, i) => `
        <div class="slice" style="--sliceStep: ${i}">
          ${[...Array(FACETS2)].map((_2, j) => `
            <div class="facet" style="--facetStep: ${j}"></div>
          `).join("")}
        </div>
      `).join("")}
    </div>
  </div>
  `;

// lib/elements/Sphere.mjs
var C3Sphere = class extends C3Object {
  #style;
  #radius;
  #background;
  constructor() {
    super();
    const shape = document.createElement("div");
    shape.style.transformStyle = "preserve-3d";
    shape.innerHTML = sphere;
    this.shadowRoot.appendChild(shape);
  }
  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
      "background",
      "radius"
    ];
  }
};
CSSStyleMixin(C3Sphere, [
  "background",
  "radius"
], true);
customElements.define("c3-sphere", C3Sphere);
export {
  C3Box,
  C3Cylinder,
  C3Grid,
  C3Group,
  C3Polyhedron,
  C3Scene,
  C3Sphere,
  C3Vertex
};
