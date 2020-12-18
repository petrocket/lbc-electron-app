// Initial welcome page. Delete the following line to remove it.
'use strict';
const styles=document.createElement('style');
styles.innerText=`@import url(https://unpkg.com/spectre.css/dist/spectre.min.css);.empty{display:flex;flex-direction:column;justify-content:center;height:100vh;position:relative}.footer{bottom:0;font-size:13px;left:50%;opacity:.9;position:absolute;transform:translateX(-50%);width:100%}`;
const vueScript=document.createElement('script');
vueScript.setAttribute('type','text/javascript'),
vueScript.setAttribute('src','https://unpkg.com/vue'),
vueScript.onload=init,
document.head.appendChild(vueScript),
document.head.appendChild(styles);

function init(){
    Vue.config.devtools=false,
    Vue.config.productionTip=false,
    new Vue({
        data:{
            versions:{
                electron:process.versions.electron,
                electronWebpack:require('electron-webpack/package.json').version,
                appVersion:process.env.npm_package_version
                // alternately, in a prod environment we can use this 
                //appVersion:require('electron').remote.app.getVersion()
            }
        },
        methods:{
            open(b){
                require('electron').shell.openExternal(b)
            },
            openLogsPath(){
                var logPath = require('electron-log').transports.file.getFile().path
                require('electron').shell.showItemInFolder(logPath)
            }
        },
        template:`<div>
            <div class=empty>
            <p class="empty-title h5">Welcome!</p>
            <p class=empty-subtitle>You're running version v{{ versions.appVersion }}</p>
            <div class=empty-action>
                <button @click="open('https://aws.amazon.com/lumberyard/downloads/')"class="btn btn-primary">Get Lumberyard</button>
                <button @click="open('https://docs.aws.amazon.com/lumberyard/index.html')"class="btn btn-primary">Docs</button> 
                <button @click="openLogsPath()"class="btn btn-primary">Logs</button> <br />
                <ul class=breadcrumb>
                    <li class=breadcrumb-item>electron-webpack v{{ versions.electronWebpack }}</li>
                    <li class=breadcrumb-item>electron v{{ versions.electron }}</li>
                </ul>
            </div>
            <p class=footer>This intitial landing page can be easily removed from <code>src/renderer/index.js</code>.</p>
            </div>
        </div>`
    }).$mount('#app')
}
