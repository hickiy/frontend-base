import NProgress from "nprogress";
import { getToken } from "@/utils/cookies.js";

import 


export function beforeEach(to, from, next) {
  NProgress.start();
  if (getToken()) {
    
  } else {
    
  }
}

export function afterEach() {
  NProgress.done();
}
