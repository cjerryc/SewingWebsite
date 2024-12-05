(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var D,Ae;class nt extends Error{}nt.prototype.name="InvalidTokenError";function Vs(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Bs(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Vs(t)}catch{return atob(t)}}function Qe(r,t){if(typeof r!="string")throw new nt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new nt(`Invalid token specified: missing part #${e+1}`);let i;try{i=Bs(s)}catch(n){throw new nt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new nt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Ws="mu:context",Xt=`${Ws}:change`;class Ys{constructor(t,e){this._proxy=Ks(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class Xe extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Ys(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Xt,t),t}detach(t){this.removeEventListener(Xt,t)}}function Ks(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let u=new CustomEvent(Xt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:i,oldValue:l,value:n}),t.dispatchEvent(u)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function Js(r,t){const e=ts(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function ts(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return ts(r,i.host)}class Gs extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function es(r="mu:message"){return(t,...e)=>t.dispatchEvent(new Gs(e,r))}class ne{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Zs(r){return t=>({...t,...r})}const te="mu:auth:jwt",ss=class is extends ne{constructor(t,e){super((s,i)=>this.update(s,i),t,is.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(Xs(s)),Yt(i);case"auth/signout":return e(ti()),Yt(this._redirectForLogin);case"auth/redirect":return Yt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};ss.EVENT_TYPE="auth:message";let rs=ss;const ns=es(rs.EVENT_TYPE);function Yt(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class Qs extends Xe{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=W.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new rs(this.context,this.redirect).attach(this)}}class ct{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(te),t}}class W extends ct{constructor(t){super();const e=Qe(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new W(t);return localStorage.setItem(te,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(te);return t?W.authenticate(t):new ct}}function Xs(r){return Zs({user:W.authenticate(r),token:r})}function ti(){return r=>{const t=r.user;return{user:t&&t.authenticated?ct.deauthenticate(t):t,token:""}}}function ei(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function si(r){return r.authenticated?Qe(r.token||""):{}}const Y=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:W,Provider:Qs,User:ct,dispatch:ns,headers:ei,payload:si},Symbol.toStringTag,{value:"Module"}));function Pt(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function ee(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const os=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:ee,relay:Pt},Symbol.toStringTag,{value:"Module"}));function as(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const ii=new DOMParser;function L(r,...t){const e=t.map(l),s=r.map((a,u)=>{if(u===0)return[a];const f=e[u-1];return f instanceof Node?[`<ins id="mu-html-${u-1}"></ins>`,a]:[f,a]}).flat().join(""),i=ii.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,u)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${u}`);if(f){const d=f.parentNode;d==null||d.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${u}`)}}),o;function l(a,u){if(a===null)return"";switch(typeof a){case"string":return Ee(a);case"bigint":case"boolean":case"number":case"symbol":return Ee(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,d=a.map(l);return f.replaceChildren(...d),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ee(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ht(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}let ri=(D=class extends HTMLElement{constructor(){super(),this._state={},Ht(this).template(D.template).styles(D.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Pt(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},ni(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},D.template=L`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,D.styles=as`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `,D);function ni(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const oi=Object.freeze(Object.defineProperty({__proto__:null,Element:ri},Symbol.toStringTag,{value:"Module"})),ls=class cs extends ne{constructor(t){super((e,s)=>this.update(e,s),t,cs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(li(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(ci(s,i));break}}}};ls.EVENT_TYPE="history:message";let oe=ls;class Se extends Xe{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=ai(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ae(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new oe(this.context).attach(this)}}function ai(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function li(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function ci(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const ae=es(oe.EVENT_TYPE),hi=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Se,Provider:Se,Service:oe,dispatch:ae},Symbol.toStringTag,{value:"Module"}));class K{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new xe(this._provider,t);this._effects.push(i),e(i)}else Js(this._target,this._contextLabel).then(i=>{const n=new xe(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class xe{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const hs=class ds extends HTMLElement{constructor(){super(),this._state={},this._user=new ct,this._authObserver=new K(this,"blazing:auth"),Ht(this).template(ds.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;di(i,this._state,e,this.authorization).then(n=>et(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},et(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&ke(this.src,this.authorization).then(e=>{this._state=e,et(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&ke(this.src,this.authorization).then(i=>{this._state=i,et(i,this)});break;case"new":s&&(this._state={},et({},this));break}}};hs.observedAttributes=["src","new","action"];hs.template=L`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function ke(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function et(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function di(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const ui=class us extends ne{constructor(t,e){super(e,t,us.EVENT_TYPE,!1)}};ui.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt=globalThis,le=xt.ShadowRoot&&(xt.ShadyCSS===void 0||xt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ce=Symbol(),Pe=new WeakMap;let ps=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ce)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(le&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Pe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Pe.set(e,t))}return t}toString(){return this.cssText}};const pi=r=>new ps(typeof r=="string"?r:r+"",void 0,ce),fi=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new ps(e,r,ce)},gi=(r,t)=>{if(le)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=xt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Ce=le?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return pi(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:mi,defineProperty:vi,getOwnPropertyDescriptor:yi,getOwnPropertyNames:_i,getOwnPropertySymbols:$i,getPrototypeOf:bi}=Object,J=globalThis,Oe=J.trustedTypes,wi=Oe?Oe.emptyScript:"",Te=J.reactiveElementPolyfillSupport,ot=(r,t)=>r,Ct={toAttribute(r,t){switch(t){case Boolean:r=r?wi:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},he=(r,t)=>!mi(r,t),Re={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:he};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),J.litPropertyMetadata??(J.litPropertyMetadata=new WeakMap);let q=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Re){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&vi(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=yi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Re}static _$Ei(){if(this.hasOwnProperty(ot("elementProperties")))return;const t=bi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ot("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ot("properties"))){const e=this.properties,s=[..._i(e),...$i(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Ce(i))}else t!==void 0&&e.push(Ce(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return gi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Ct).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Ct;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??he)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};q.elementStyles=[],q.shadowRootOptions={mode:"open"},q[ot("elementProperties")]=new Map,q[ot("finalized")]=new Map,Te==null||Te({ReactiveElement:q}),(J.reactiveElementVersions??(J.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ot=globalThis,Tt=Ot.trustedTypes,Ue=Tt?Tt.createPolicy("lit-html",{createHTML:r=>r}):void 0,fs="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,gs="?"+k,Ai=`<${gs}>`,I=document,ht=()=>I.createComment(""),dt=r=>r===null||typeof r!="object"&&typeof r!="function",de=Array.isArray,Ei=r=>de(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Kt=`[ 	
\f\r]`,st=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ne=/-->/g,Me=/>/g,R=RegExp(`>|${Kt}(?:([^\\s"'>=/]+)(${Kt}*=${Kt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Le=/'/g,Ie=/"/g,ms=/^(?:script|style|textarea|title)$/i,Si=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),it=Si(1),G=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),je=new WeakMap,N=I.createTreeWalker(I,129);function vs(r,t){if(!de(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ue!==void 0?Ue.createHTML(t):t}const xi=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=st;for(let l=0;l<e;l++){const a=r[l];let u,f,d=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===st?f[1]==="!--"?o=Ne:f[1]!==void 0?o=Me:f[2]!==void 0?(ms.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=R):f[3]!==void 0&&(o=R):o===R?f[0]===">"?(o=i??st,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,u=f[1],o=f[3]===void 0?R:f[3]==='"'?Ie:Le):o===Ie||o===Le?o=R:o===Ne||o===Me?o=st:(o=R,i=void 0);const h=o===R&&r[l+1].startsWith("/>")?" ":"";n+=o===st?a+Ai:d>=0?(s.push(u),a.slice(0,d)+fs+a.slice(d)+k+h):a+k+(d===-2?l:h)}return[vs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let se=class ys{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[u,f]=xi(t,e);if(this.el=ys.createElement(u,s),N.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=N.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(fs)){const c=f[o++],h=i.getAttribute(d).split(k),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Pi:p[1]==="?"?Ci:p[1]==="@"?Oi:zt}),i.removeAttribute(d)}else d.startsWith(k)&&(a.push({type:6,index:n}),i.removeAttribute(d));if(ms.test(i.tagName)){const d=i.textContent.split(k),c=d.length-1;if(c>0){i.textContent=Tt?Tt.emptyScript:"";for(let h=0;h<c;h++)i.append(d[h],ht()),N.nextNode(),a.push({type:2,index:++n});i.append(d[c],ht())}}}else if(i.nodeType===8)if(i.data===gs)a.push({type:2,index:n});else{let d=-1;for(;(d=i.data.indexOf(k,d+1))!==-1;)a.push({type:7,index:n}),d+=k.length-1}n++}}static createElement(t,e){const s=I.createElement("template");return s.innerHTML=t,s}};function Z(r,t,e=r,s){var i,n;if(t===G)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=dt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=Z(r,o._$AS(r,t.values),o,s)),t}class ki{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??I).importNode(e,!0);N.currentNode=i;let n=N.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let u;a.type===2?u=new _t(n,n.nextSibling,this,t):a.type===1?u=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(u=new Ti(n,this,t)),this._$AV.push(u),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=N.nextNode(),o++)}return N.currentNode=I,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class _t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),dt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==G&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ei(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&dt(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=se.createElement(vs(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new ki(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=je.get(t.strings);return e===void 0&&je.set(t.strings,e=new se(t)),e}k(t){de(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new _t(this.O(ht()),this.O(ht()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class zt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=Z(this,t,e,0),o=!dt(t)||t!==this._$AH&&t!==G,o&&(this._$AH=t);else{const l=t;let a,u;for(t=n[0],a=0;a<n.length-1;a++)u=Z(this,l[s+a],e,a),u===G&&(u=this._$AH[a]),o||(o=!dt(u)||u!==this._$AH[a]),u===_?t=_:t!==_&&(t+=(u??"")+n[a+1]),this._$AH[a]=u}o&&!i&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Pi extends zt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class Ci extends zt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class Oi extends zt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??_)===G)return;const s=this._$AH,i=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ti{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const He=Ot.litHtmlPolyfillSupport;He==null||He(se,_t),(Ot.litHtmlVersions??(Ot.litHtmlVersions=[])).push("3.2.0");const Ri=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new _t(t.insertBefore(ht(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let B=class extends q{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Ri(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return G}};B._$litElement$=!0,B.finalized=!0,(Ae=globalThis.litElementHydrateSupport)==null||Ae.call(globalThis,{LitElement:B});const ze=globalThis.litElementPolyfillSupport;ze==null||ze({LitElement:B});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ui={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:he},Ni=(r=Ui,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function _s(r){return(t,e)=>typeof e=="object"?Ni(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $s(r){return _s({...r,state:!0,attribute:!1})}function Mi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Li(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var bs={};(function(r){var t=function(){var e=function(d,c,h,p){for(h=h||{},p=d.length;p--;h[d[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,m,g,v,Ft){var w=v.length-1;switch(g){case 1:return new m.Root({},[v[w-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[v[w-1],v[w]]);break;case 4:case 5:this.$=v[w];break;case 6:this.$=new m.Literal({value:v[w]});break;case 7:this.$=new m.Splat({name:v[w]});break;case 8:this.$=new m.Param({name:v[w]});break;case 9:this.$=new m.Optional({},[v[w-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(m,g){this.message=m,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],m=[null],g=[],v=this.table,Ft="",w=0,$e=0,zs=2,be=1,Ds=g.slice.call(arguments,1),y=Object.create(this.lexer),O={yy:{}};for(var qt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,qt)&&(O.yy[qt]=this.yy[qt]);y.setInput(c,O.yy),O.yy.lexer=y,O.yy.parser=this,typeof y.yylloc>"u"&&(y.yylloc={});var Vt=y.yylloc;g.push(Vt);var Fs=y.options&&y.options.ranges;typeof O.yy.parseError=="function"?this.parseError=O.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var qs=function(){var z;return z=y.lex()||be,typeof z!="number"&&(z=h.symbols_[z]||z),z},b,T,A,Bt,H={},Et,x,we,St;;){if(T=p[p.length-1],this.defaultActions[T]?A=this.defaultActions[T]:((b===null||typeof b>"u")&&(b=qs()),A=v[T]&&v[T][b]),typeof A>"u"||!A.length||!A[0]){var Wt="";St=[];for(Et in v[T])this.terminals_[Et]&&Et>zs&&St.push("'"+this.terminals_[Et]+"'");y.showPosition?Wt="Parse error on line "+(w+1)+`:
`+y.showPosition()+`
Expecting `+St.join(", ")+", got '"+(this.terminals_[b]||b)+"'":Wt="Parse error on line "+(w+1)+": Unexpected "+(b==be?"end of input":"'"+(this.terminals_[b]||b)+"'"),this.parseError(Wt,{text:y.match,token:this.terminals_[b]||b,line:y.yylineno,loc:Vt,expected:St})}if(A[0]instanceof Array&&A.length>1)throw new Error("Parse Error: multiple actions possible at state: "+T+", token: "+b);switch(A[0]){case 1:p.push(b),m.push(y.yytext),g.push(y.yylloc),p.push(A[1]),b=null,$e=y.yyleng,Ft=y.yytext,w=y.yylineno,Vt=y.yylloc;break;case 2:if(x=this.productions_[A[1]][1],H.$=m[m.length-x],H._$={first_line:g[g.length-(x||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(x||1)].first_column,last_column:g[g.length-1].last_column},Fs&&(H._$.range=[g[g.length-(x||1)].range[0],g[g.length-1].range[1]]),Bt=this.performAction.apply(H,[Ft,$e,w,O.yy,A[1],m,g].concat(Ds)),typeof Bt<"u")return Bt;x&&(p=p.slice(0,-1*x*2),m=m.slice(0,-1*x),g=g.slice(0,-1*x)),p.push(this.productions_[A[1]][0]),m.push(H.$),g.push(H._$),we=v[p[p.length-2]][p[p.length-1]],p.push(we);break;case 3:return!0}}return!0}},u=function(){var d={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===m.length?this.yylloc.first_column:0)+m[m.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,m,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in g)this[v]=g[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,m;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),v=0;v<g.length;v++)if(p=this._input.match(this.rules[g[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,m=v,this.options.backtrack_lexer){if(c=this.test_match(p,g[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,m,g){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();a.lexer=u;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Li<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(bs);function F(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var ws={Root:F("Root"),Concat:F("Concat"),Literal:F("Literal"),Splat:F("Splat"),Param:F("Param"),Optional:F("Optional")},As=bs.parser;As.yy=ws;var Ii=As,ji=Object.keys(ws);function Hi(r){return ji.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Es=Hi,zi=Es,Di=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ss(r){this.captures=r.captures,this.re=r.re}Ss.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Fi=zi({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Di,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Ss({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),qi=Fi,Vi=Es,Bi=Vi({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),Wi=Bi,Yi=Ii,Ki=qi,Ji=Wi;$t.prototype=Object.create(null);$t.prototype.match=function(r){var t=Ki.visit(this.ast),e=t.match(r);return e||!1};$t.prototype.reverse=function(r){return Ji.visit(this.ast,r)};function $t(r){var t;if(this?t=this:t=Object.create($t.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=Yi.parse(r),t}var Gi=$t,Zi=Gi,Qi=Zi;const Xi=Mi(Qi);var tr=Object.defineProperty,xs=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&tr(t,e,i),i};const ks=class extends B{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>it` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new Xi(i.path)})),this._historyObserver=new K(this,e),this._authObserver=new K(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),it` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(ns(this,"auth/redirect"),it` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):it` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),it` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){ae(this,"history/redirect",{href:t})}};ks.styles=fi`
    :host,
    main {
      display: contents;
    }
  `;let Rt=ks;xs([$s()],Rt.prototype,"_user");xs([$s()],Rt.prototype,"_match");const er=Object.freeze(Object.defineProperty({__proto__:null,Element:Rt,Switch:Rt},Symbol.toStringTag,{value:"Module"})),Ps=class Cs extends HTMLElement{constructor(){if(super(),Ht(this).template(Cs.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Ps.template=L`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;let sr=Ps;const ir=Object.freeze(Object.defineProperty({__proto__:null,Element:sr},Symbol.toStringTag,{value:"Module"})),ue=class ie extends HTMLElement{constructor(){super(),this._array=[],Ht(this).template(ie.template).styles(ie.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Os("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{ee(t,"button.add")?Pt(t,"input-array:add"):ee(t,"button.remove")&&Pt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],nr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};ue.template=L`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;ue.styles=as`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;let rr=ue;function nr(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(Os(e)))}function Os(r,t){const e=r===void 0?L`<input />`:L`<input value="${r}" />`;return L`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}const or=Object.freeze(Object.defineProperty({__proto__:null,Element:rr},Symbol.toStringTag,{value:"Module"}));function tt(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var ar=Object.defineProperty,lr=Object.getOwnPropertyDescriptor,cr=(r,t,e,s)=>{for(var i=lr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&ar(t,e,i),i};class hr extends B{constructor(t){super(),this._pending=[],this._observer=new K(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}cr([_s()],hr.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,pe=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,fe=Symbol(),De=new WeakMap;let Ts=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==fe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(pe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=De.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&De.set(e,t))}return t}toString(){return this.cssText}};const dr=r=>new Ts(typeof r=="string"?r:r+"",void 0,fe),bt=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Ts(e,r,fe)},ur=(r,t)=>{if(pe)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=kt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Fe=pe?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return dr(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:pr,defineProperty:fr,getOwnPropertyDescriptor:gr,getOwnPropertyNames:mr,getOwnPropertySymbols:vr,getPrototypeOf:yr}=Object,C=globalThis,qe=C.trustedTypes,_r=qe?qe.emptyScript:"",Jt=C.reactiveElementPolyfillSupport,at=(r,t)=>r,Ut={toAttribute(r,t){switch(t){case Boolean:r=r?_r:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ge=(r,t)=>!pr(r,t),Ve={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:ge};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);class V extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ve){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&fr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=gr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ve}static _$Ei(){if(this.hasOwnProperty(at("elementProperties")))return;const t=yr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(at("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(at("properties"))){const e=this.properties,s=[...mr(e),...vr(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Fe(i))}else t!==void 0&&e.push(Fe(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ur(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Ut).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Ut;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ge)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}V.elementStyles=[],V.shadowRootOptions={mode:"open"},V[at("elementProperties")]=new Map,V[at("finalized")]=new Map,Jt==null||Jt({ReactiveElement:V}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lt=globalThis,Nt=lt.trustedTypes,Be=Nt?Nt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Rs="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,Us="?"+P,$r=`<${Us}>`,j=document,ut=()=>j.createComment(""),pt=r=>r===null||typeof r!="object"&&typeof r!="function",me=Array.isArray,br=r=>me(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Gt=`[ 	
\f\r]`,rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,We=/-->/g,Ye=/>/g,U=RegExp(`>|${Gt}(?:([^\\s"'>=/]+)(${Gt}*=${Gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ke=/'/g,Je=/"/g,Ns=/^(?:script|style|textarea|title)$/i,wr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),S=wr(1),Q=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Ge=new WeakMap,M=j.createTreeWalker(j,129);function Ms(r,t){if(!me(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Be!==void 0?Be.createHTML(t):t}const Ar=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=rt;for(let l=0;l<e;l++){const a=r[l];let u,f,d=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===rt?f[1]==="!--"?o=We:f[1]!==void 0?o=Ye:f[2]!==void 0?(Ns.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=U):f[3]!==void 0&&(o=U):o===U?f[0]===">"?(o=i??rt,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,u=f[1],o=f[3]===void 0?U:f[3]==='"'?Je:Ke):o===Je||o===Ke?o=U:o===We||o===Ye?o=rt:(o=U,i=void 0);const h=o===U&&r[l+1].startsWith("/>")?" ":"";n+=o===rt?a+$r:d>=0?(s.push(u),a.slice(0,d)+Rs+a.slice(d)+P+h):a+P+(d===-2?l:h)}return[Ms(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class ft{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[u,f]=Ar(t,e);if(this.el=ft.createElement(u,s),M.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=M.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(Rs)){const c=f[o++],h=i.getAttribute(d).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Sr:p[1]==="?"?xr:p[1]==="@"?kr:Dt}),i.removeAttribute(d)}else d.startsWith(P)&&(a.push({type:6,index:n}),i.removeAttribute(d));if(Ns.test(i.tagName)){const d=i.textContent.split(P),c=d.length-1;if(c>0){i.textContent=Nt?Nt.emptyScript:"";for(let h=0;h<c;h++)i.append(d[h],ut()),M.nextNode(),a.push({type:2,index:++n});i.append(d[c],ut())}}}else if(i.nodeType===8)if(i.data===Us)a.push({type:2,index:n});else{let d=-1;for(;(d=i.data.indexOf(P,d+1))!==-1;)a.push({type:7,index:n}),d+=P.length-1}n++}}static createElement(t,e){const s=j.createElement("template");return s.innerHTML=t,s}}function X(r,t,e=r,s){var o,l;if(t===Q)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=pt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=X(r,i._$AS(r,t.values),i,s)),t}class Er{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??j).importNode(e,!0);M.currentNode=i;let n=M.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let u;a.type===2?u=new wt(n,n.nextSibling,this,t):a.type===1?u=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(u=new Pr(n,this,t)),this._$AV.push(u),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=M.nextNode(),o++)}return M.currentNode=j,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class wt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),pt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==Q&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):br(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&pt(this._$AH)?this._$AA.nextSibling.data=t:this.T(j.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=ft.createElement(Ms(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new Er(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=Ge.get(t.strings);return e===void 0&&Ge.set(t.strings,e=new ft(t)),e}k(t){me(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new wt(this.O(ut()),this.O(ut()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Dt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=X(this,t,e,0),o=!pt(t)||t!==this._$AH&&t!==Q,o&&(this._$AH=t);else{const l=t;let a,u;for(t=n[0],a=0;a<n.length-1;a++)u=X(this,l[s+a],e,a),u===Q&&(u=this._$AH[a]),o||(o=!pt(u)||u!==this._$AH[a]),u===$?t=$:t!==$&&(t+=(u??"")+n[a+1]),this._$AH[a]=u}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Sr extends Dt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class xr extends Dt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class kr extends Dt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??$)===Q)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Pr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const Zt=lt.litHtmlPolyfillSupport;Zt==null||Zt(ft,wt),(lt.litHtmlVersions??(lt.litHtmlVersions=[])).push("3.2.1");const Cr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new wt(t.insertBefore(ut(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let E=class extends V{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Cr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Q}};var Ze;E._$litElement$=!0,E.finalized=!0,(Ze=globalThis.litElementHydrateSupport)==null||Ze.call(globalThis,{LitElement:E});const Qt=globalThis.litElementPolyfillSupport;Qt==null||Qt({LitElement:E});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");const Lt=class Lt extends E{render(){return S`

    <mu-dropdown>
            <a slot="actuator">
              Hello,
              <span id="userid"></span>
            </a>

            <menu>
              <li class="when-signed-in">
                <a id="signout">Sign Out</a>
              </li>
              <li class="when-signed-out">
                <a href="/login">Sign In</a>
              </li>
            </menu>

          </mu-dropdown>
    `}};Lt.uses=tt({"mu-dropdown":ir.Element}),Lt.styles=[bt`
    :host {
      display: contents;
    }
    header {
      display: flex;
      flex-wrap: wrap;
      align-items: bottom;
      justify-content: space-between;
      padding: var(--size-spacing-medium);
      background-color: var(--header-gradient);
      color: var(--color-text-inverted);
    }
    header ~ * {
      margin: var(--size-spacing-medium);
    }
    header p {
      --color-link: var(--color-link-inverted);
    }
    nav {
      display: flex;
      flex-direction: column;
      flex-basis: max-content;
      align-items: end;
    }
    a[slot="actuator"] {
      color: var(--color-link-inverted);
      cursor: pointer;
    }
    #userid:empty::before {
      content: "Sewist";
    }
    menu a {
      list-style-type: none;
      color: var(--color-link);
      cursor: pointer;
      text-decoration: underline;
    }
    a:has(#userid:empty) ~ menu > .when-signed-in,
    a:has(#userid:not(:empty)) ~ menu > .when-signed-out {
      display: none;
    }
  `];let Mt=Lt;function Or(r){const e=r.target.checked;os.relay(r,"dark-mode",{checked:e})}const ve=class ve extends E{render(){return S`

    <footer class="footer"> 
    <label @change=${Or}>
    <input type="checkbox" autocomplete="off" />
    Dark mode
    </label>
     </footer>
    `}static initializeOnce(){function t(e,s){e.classList.toggle("dark-mode",s)}document.body.addEventListener("dark-mode",e=>{var s;return t(e.currentTarget,(s=e.detail)==null?void 0:s.checked)})}};ve.styles=[bt`
    :host{
    display: contents;
    }
    .footer {
    position: fixed;
    text-align: center;
    bottom: 0;
  }
  `];let gt=ve;tt({"mu-auth":Y.Provider,"sewing-header":Mt,"sewing-footer":gt});gt.initializeOnce();window.relayEvent=os.relay;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tr={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:ge},Rr=(r=Tr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function At(r){return(t,e)=>typeof e=="object"?Rr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ls(r){return At({...r,state:!0,attribute:!1})}var Ur=Object.defineProperty,Is=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Ur(t,e,i),i};const ye=class ye extends E{constructor(){super(...arguments),this.src="/api/casualFormal/coats",this.clothingIndex=new Array,this.clothingIndexToDisplay=new Array,this.kind="coats",this._authObserver=new K(this,"sewing:auth"),this._user=new Y.User}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(`/api/casualFormal?class=${this.kind}`)})}render(){for(let e=0;e<this.clothingIndex.length;e++)this.clothingIndexToDisplay.push(this.clothingIndex[e]);const t=this.clothingIndexToDisplay.map(this.renderItem);return S`
      <header>
        <h1>Sewing Garments</h1>
        <p>Making a Piece From Start to Finish</p>
    
        <svg class="logo">
            <use href="/icons/sewingMachine.svg#icon-sewingMachine" />
        </svg>

        <sewing-header></sewing-header>
        </header>


        <header class="header">
        <section>
            <h2>Type of Garments</h2>
            <ul class="ulnobullets">
            <li><a href="app/casualFormal/coats">Coats</a></li>
            <li><a href="app/casualFormal/jackets">Jackets</a></li>
            <li><a href="app/casualFormal/tops">Tops</a></li>
            <li><a href="app/casualFormal/bottoms">Bottoms</a></li>
            </ul>
        </section>
        
        <section>
            <h2>Seasonal Pieces</h2> 
            <ul class="ulnobullets">
            <li><a href="../seasonal/fall.html">Fall</a></li>
            <li><a href="seasonal/winter.html">Winter</a></li>
            <li><a href="seasonal/spring.html">Spring</a></li>
            <li><a href="seasonal/summer.html">Summer</a></li>
            </ul>
        </section>
        
        <section>
            <h2>Fabrics</h2>
            <ul class="ulnobullets">
                <li><a href="fabrics/light.html">Lightweight</a></li>
                <li><a href="fabrics/heavy.html">Heavyweight</a></li>
                <li><a href="fabrics/sheen.html">Sheen</a></li>
            </ul>
            </section>
        
        <section>
            <h2>Notions and Embellishments</h2>
            <ul class="ulnobullets">
                <li><a href="notions/buttons.html">Buttons</a></li>
                <li><a href="notions/zippers.html">Zippers</a></li>
                <li><a href="notions/piping.html">Piping</a></li>
            </ul>
            </section>
        
            <section>
            <h2>Tools for the Job</h2>
            <ul class="ulnobullets">
                <li><a href="tools/needles.html">Needle Weights</a></li>
                <li><a href="tools/iron.html">Ironing and Pressing</a></li>
                <li><a href="tools/patterns.html">Patterns</a></li>
            </ul>
            </section>
        </header>

        <img src="./public/images/landingImage2.jpg" alt="Fabric and Thread">
        <p>An informal almanac on sewing garments: from the bolt to the hanger.</p>
        <img src="./public/images/thread.jpg" alt="Spools of Thread">
        <sewing-footer></sewing-footer>

        <header class="header3">
            <header class="header3">
            <h2>A Peak at your Clothing items</h2>
            </header>
            <dl>${t}</dl>
        </header>
        `}hydrate(t){fetch(t,{headers:Y.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).catch(e=>console.log("Failed to load clothing data:",e)).then(e=>{if(e){const s=e;this.clothingIndex=s}}).catch(e=>console.log("Failed to convert descriptionElement data:",e))}renderItem(t){const{item:e,description:s,info:i}=t;return S`
            <dt>
               <h3> ${e} </h3>
            </dt>
            <!-- <dt>A bit about <b>${e}</b>: -->
                <p>${s}</p>
            </dt>
            <!-- <dt>Some good things to know:
                <p>${i}</p>
            </dt> -->
            `}};ye.styles=bt`
        header {
        background: var(--top-header-gradient);
        padding: var(--size-spacing-medium);
        font-family: var(--font-family-display);
        line-height: var(--font-line-height-display);
        color: var(--color-text);
        border-width: 5px;
        border-style: solid;
        border-image: var(--border-header-gradient);
        border-radius: 8px;

        text-align: var(--header-text-align);   

        grid-column-start: var(--grid-column-start);
        grid-column-end: var(--grid-column-end);
        grid-row-start: var(--grid-row-start-h1);
        grid-row-end: var(--grid-row-end-h1);
        }
        .header {
        border-radius: 5px;
        border-style: solid;
        background: var(--header-gradient);

        display: var(--header-display);
        align-items: var(--header-align-items);
        justify-content: var(--header-justify-content); 
        font-family: var(--font-family-display);
        text-align: var(--header-text-align);   

        grid-column-start: var(--grid-column-start);
        grid-column-end: var(--grid-column-end);
        grid-row-start: var(--grid-row-start-h2);
        grid-row-end: var(--grid-row-end-h2);

        /* unvisited link */
        a:link {
            color: var(--body-link-unvisited);
        }
        /* visited link */
            a:visited {
            color: var(--body-link-visited);
        }
    
        /* mouse over link */
            a:hover {
            color: var(--body-link-hover);
        }
        }
        .header3 {
        grid-column-start: var(--grid-column-start);
        grid-column-end: var(--grid-column-end);
        grid-row-start: var(--grid-row-start-h3);
        grid-row-end: var(--grid-row-end-h3);
        background: var(--body-gradient);
        }
        body {
        /* colors */
        font-family: var(--font-family-body);
        color: var(--color-text);
        background: var(--body-gradient);
        display: var(--container-display);
        align-items: var(--container-align-items); 
        grid-template-columns: var(--container-template-columns);
        grid-column-gap: var(--container-grid-column-gap);
        grid-row-gap: var(--container-grid-row-gap);
        padding: var(--size-spacing-medium);
        }
        body.dark-mode header{
        color: var(--color-text);
        background: var(--header-gradient);
        background-color: var(--background-color);
        --color-text-control: rgb(51 51 51);
        border-radius: 5px;
        border-style: solid;
        }
        body.dark-mode {
        color: var(--color-text);
        background-color: var(--background-color);
        background: var(--body-gradient);
        a:link {
            color: var(--body-link-unvisited);
        }
        /* visited link */
            a:visited {
            color: var( --body-link-visited);
        }
    
        /* mouse over link */
            a:hover {
            color: var(--body-link-hover);
        }
        }
        .footer {
        position: fixed;
        text-align: center ;
        bottom: 0;
        }
        svg.icon {
        display: var(--svg-display);
        height: var(--svg-square-length);
        width: var(--svg-square-length);
        vertical-align: var(--svg-align);
        fill: var(--svg-fill);
        }

        svg.logo {
        display: var(--svg-display-block);
        height: var(--svg-square-length);
        width: var(--svg-square-length);
        vertical-align: var(--svg-align);
        fill: var(--svg-fill);
        margin: auto;
        }

        .ulnobullets{
        list-style-type: var(--ulnobullets-listStyle);
        padding: var(--ulnobullets-padding);
        margin: var(--ulnobullets-margin);
        }
    `;let mt=ye;Is([Ls()],mt.prototype,"clothingIndex");Is([At()],mt.prototype,"kind");var Nr=Object.defineProperty,js=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Nr(t,e,i),i};const It=class It extends E{get descriptionElement(){return this.using||{}}render(){const{item:t,description:e,info:s}=this.using||{};return S`
    
      <section class="view">
        <h3>${t}</h3>
        ${e}
        <ul>
        ${s}
        </ul>
        </section>
  
  `}};It.uses=tt({"mu-form":oi.Element,"input-array":or.Element}),It.styles=bt`
  :host {
  display: contents;
  }
  :host([mode="edit"]),
  :host([mode="new"]) {
    --display-view-none: none;
  }
  :host(:not([mode])),
  :host([mode="view"]) {
    --display-editor-none: none;
  }
  
  section.view {
    display: var(--display-view-none, grid);
  }

  mu-form.edit {
    display: var(--display-editor-none, grid);
  }

  section {
    font-family: var(--font-family-body);
    color: var(--color-text);
    background-color: var(--body-background-color);
    background: var(--panel-gradient);
    padding: var(--size-spacing-medium);

    border-radius: 5px;
    box-shadow: 5px 10px 18px #888888;
  }
  h3{
    padding: var(--size-spacing-medium);
    font-family: var(--font-family-display);
    line-height: var(--font-line-height-display);
    color: var(--color-text);
    text-align: var(--header-text-align);
  }`;let vt=It;js([At({attribute:!1})],vt.prototype,"using");js([At()],vt.prototype,"href");var Mr=Object.defineProperty,Hs=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Mr(t,e,i),i};const jt=class jt extends E{constructor(){super(...arguments),this.src="/api/casualFormal",this.kind="",this.clothingIndex=new Array,this._authObserver=new K(this,"sewing:auth"),this._user=new Y.User}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),console.log("kind in view.ts: ",this.kind),this.hydrate(`/api/casualFormal?class=${this.kind}`)})}hydrate(t){fetch(t,{headers:Y.headers(this._user)}).then(e=>(e.status===200&&console.log(e.body),e.json())).catch(e=>console.log("Failed to load clothing data:",e)).then(e=>{if(e){const s=e;this.clothingIndex=s}}).catch(e=>console.log("Failed to convert descriptionElement data:",e))}renderItem(t){return S`
        <description-elem
          .using=${t}></description-elem>
        `}render(){const t=this.clothingIndex.map(this.renderItem);return S`
        <header>
            <a href="/app">&larr; Sewing a Garment</a>
        </header>
        <header class="header">
            <svg class="icon">
                <use href="/icons/${this.kind}.svg#icon-${this.kind}" />
            </svg>
            <h2>${this.kind}</h2>
            <svg class="icon">
                <use href="/icons/${this.kind}.svg#icon-${this.kind}" />
            </svg>
        </header>


        <article>
        <section class="${this.kind}"> 
            ${t}
        </section>
        </article>

        <footer class="footer">
        <!-- Dark Mode Checkbox -->
        <label>
            <input type="checkbox" autocomplete="off" id="darkModeToggle"/>
            Dark mode
        </label>
        </footer>
   
        `}};jt.uses=tt({"description-elem":vt}),jt.styles=bt`
        header {
        /* header background color and text color */
        background: var(--top-header-gradient);
        padding: var(--size-spacing-medium);
        font-family: var(--font-family-display);
        line-height: var(--font-line-height-display);
        color: var(--color-text);
        border-width: 5px;
        border-style: solid;
        border-image: var(--border-header-gradient);
        border-radius: 8px;

        text-align: var(--header-text-align);   

        grid-column-start: var(--grid-column-start);
        grid-column-end: var(--grid-column-end);
        grid-row-start: var(--grid-row-start-h1);
        grid-row-end: var(--grid-row-end-h1);
        }
        .header {
        border-radius: 5px;
        border-style: solid;
        background: var(--header-gradient);

        /* flex */
        display: var(--header-display);
        align-items: var(--header-align-items);
        justify-content: var(--header-justify-content); 
        font-family: var(--font-family-display);
        text-align: var(--header-text-align);   

        /* grid-template-columns: 1fr 1fr 1fr 1fr 1fr; */
        grid-column-start: var(--grid-column-start);
        grid-column-end: var(--grid-column-end);
        grid-row-start: var(--grid-row-start-h2);
        grid-row-end: var(--grid-row-end-h2);

        /* unvisited link */
        a:link {
            color: var(--body-link-unvisited);
        }
        /* visited link */
            a:visited {
            color: var(--body-link-visited);
        }
    
        /* mouse over link */
            a:hover {
            color: var(--body-link-hover);
        }
        }
        .header3 {
        /* grid-template-columns: 1fr 1fr 1fr 1fr 1fr; */
        grid-column-start: var(--grid-column-start);
        grid-column-end: var(--grid-column-end);
        grid-row-start: var(--grid-row-start-h3);
        grid-row-end: var(--grid-row-end-h3);
        background: var(--body-gradient);
        }
        body {
        /* colors */
        font-family: var(--font-family-body);
        color: var(--color-text);
        background: var(--body-gradient);
        
        padding: var(--size-spacing-medium);
        display: var(--container-display);
        align-items: var(--container-align-items); 
        grid-template-columns: var(--container-template-columns);
        grid-column-gap: var(--container-grid-column-gap);
        grid-row-gap: var(--container-grid-row-gap);
        color: var(--color-text);
        }
        body.dark-mode header{
        color: var(--color-text);
        background: var(--header-gradient);
        background-color: var(--background-color);
        --color-text-control: rgb(51 51 51);
        border-radius: 5px;
        border-style: solid;
        }
        body.dark-mode {
        color: var(--color-text);
        background-color: var(--background-color);
        background: var(--body-gradient);
        a:link {
            color: var(--body-link-unvisited);
        }
        /* visited link */
            a:visited {
            color: var( --body-link-visited);
        }
    
        /* mouse over link */
            a:hover {
            color: var(--body-link-hover);
        }
        }
        .footer {
        position: fixed;
        text-align: center ;
        bottom: 0;
        }
        svg.icon {
        /* text-align: var(--header-text-align);    */
        display: var(--svg-display);
        height: var(--svg-square-length);
        width: var(--svg-square-length);
        vertical-align: var(--svg-align);
        fill: var(--svg-fill);
        }

        svg.logo {
        /* text-align: var(--header-text-align);    */
        display: var(--svg-display-block);
        height: var(--svg-square-length);
        width: var(--svg-square-length);
        vertical-align: var(--svg-align);
        fill: var(--svg-fill);
        margin: auto;
        }

        .ulnobullets{
        list-style-type: var(--ulnobullets-listStyle);
        padding: var(--ulnobullets-padding);
        margin: var(--ulnobullets-margin);
        }
    `;let yt=jt;Hs([At()],yt.prototype,"kind");Hs([Ls()],yt.prototype,"clothingIndex");const _e=class _e extends E{render(){return S`
        <home-view></home-view>
      `}connectedCallback(){super.connectedCallback(),gt.initializeOnce()}};_e.uses=tt({"home-view":mt,"casualformal-view":yt});let re=_e;const Lr=[{path:"/app/casualFormal/:kind",view:r=>S`
          <casualformal-view
          kind=${r.kind}
          ></casualformal-view>
        `},{path:"/app",view:()=>S`
        <home-view></home-view>
      `},{path:"/",redirect:"/app"}];tt({"mu-auth":Y.Provider,"mu-history":hi.Provider,"mu-switch":class extends er.Element{constructor(){super(Lr,"sewing:history","sewing:auth")}},"sewing-app":re,"sewing-header":Mt});
