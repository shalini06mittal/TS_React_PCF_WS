import PI, * as math from "./mathutils.js";

// imports and exports
console.log(math.add(3,4));
console.log(math.sub(3,4));

import {Employee as emp} from "./Employee.js";

let e1 = new emp(1, "askjh");
console.log(e1.display());
