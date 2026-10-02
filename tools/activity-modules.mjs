import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import vm from 'node:vm';
import {activityTypes} from './explorers.mjs';
import * as ui from './activity-ui.mjs';
const directory=path.join(path.dirname(fileURLToPath(import.meta.url)),'activities');
const validID=/^[A-Za-z][A-Za-z0-9_-]*$/;
export function createActivityRegistry(entries,builtIns=activityTypes){
 const registry=new Map();
 for(const {filename,module}of entries){
  if(module.lessonId!==filename.slice(0,-4)||!validID.test(module.lessonId))throw Error('活动模块 lessonId 必须等于文件名');
  if(!Array.isArray(module.types)||!module.types.length||typeof module.render!=='function'||typeof module.browserScript!=='string'||!module.browserScript.trim())throw Error(`活动模块 ${filename} 缺少 types/render/browserScript`);
  if(/<\/script(?:\s|\/|>)/i.test(module.browserScript))throw Error(`活动模块 ${filename} 含关闭 script 标签`);
  try{new vm.Script(module.browserScript,{filename});}catch(error){throw Error(`活动模块 ${filename} 浏览器脚本语法错误：${error.message}`);}
  for(const type of module.types){if(typeof type!=='string'||!validID.test(type)||type==='parallax'||builtIns.includes(type)||registry.has(type))throw Error(`活动类型重复或无效：${String(type)}`);registry.set(type,module);}
 }
 return registry;
}
const entries=[];
if(fs.existsSync(directory))for(const filename of fs.readdirSync(directory).filter(name=>name.endsWith('.mjs')).sort())entries.push({filename,module:await import(pathToFileURL(path.join(directory,filename)).href)});
const registry=createActivityRegistry(entries);
export const customActivityTypes=[...registry.keys()];
export function validateCustomActivity(a,lessonId,activityRegistry=registry){const module=activityRegistry.get(a.type);if(module&&module.lessonId!==lessonId)throw Error(`活动 ${a.type} 只属于课程 ${module.lessonId}`);return Boolean(module);}
export function customActivityHTML(a,activityRegistry=registry){const module=activityRegistry.get(a.type);if(!module)return null;return module.render(a,ui);}
export function customActivityScripts(activities,activityRegistry=registry){const modules=[...new Set(activities.map(a=>activityRegistry.get(a.type)).filter(Boolean))];return modules.length?fs.readFileSync(path.join(path.dirname(directory),'activity-runtime.js'),'utf8')+'\n'+modules.map(module=>module.browserScript).join('\n'):'';}
