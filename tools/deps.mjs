import {createRequire} from 'node:module';
import {homedir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const roots=[new URL('./package.json',import.meta.url), ...(process.env.STELLAR_NODE_MODULES?[join(process.env.STELLAR_NODE_MODULES,'../package.json')]:[]),join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json')];
export async function dependency(name){
 for(const root of roots){
  try {const req=createRequire(root);return await import(pathToFileURL(req.resolve(name)).href);} catch(e){if(!['MODULE_NOT_FOUND','ERR_MODULE_NOT_FOUND'].includes(e.code))throw e;}
 }
 throw new Error(`缺少 ${name}。请在 tools 目录安装 package.json 中的依赖，或设置 STELLAR_NODE_MODULES。`);
}
