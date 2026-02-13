/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_Logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _core_Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _core_steps__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);




async function exec(step) {
    await window.logger.info('Executing step ' + step.name);
    const err = `Step "${step.name}" failed`;
    try {
        if (!step.doNotResetBody)
            window.utils.resetForm();
        const result = await step.execute();
        if (!result) {
            window.logger.error(err);
            alert(err);
        }
        ;
        return result;
    }
    catch (error) {
        console.error(err, error);
        alert(err);
        if (window.cookieManager)
            window.cookieManager.deleteCookie('key');
        return false;
    }
}
(async () => {
    window.config = _config__WEBPACK_IMPORTED_MODULE_1__["default"];
    window.utils = new _core_Utils__WEBPACK_IMPORTED_MODULE_2__["default"]();
    window.logger = new _core_Logger__WEBPACK_IMPORTED_MODULE_0__["default"]();
    for (const step of _core_steps__WEBPACK_IMPORTED_MODULE_3__["default"]) {
        if (!(await exec(step)))
            break;
    }
    ;
})();


/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Logger {
    success(...message) {
        this._log('success', ...message);
    }
    ;
    error(...message) {
        this._log('error', ...message);
    }
    ;
    info(...message) {
        this._log('info', ...message);
    }
    ;
    logArgs(args, func) {
        const formattedArgs = this._formatArgs(args).join(', ');
        const fnName = func.toString().split('(')[0];
        return this._log('info', `${fnName}(${formattedArgs}); called`);
    }
    _formatArgs(args) {
        return Object.keys(args).map(k => {
            try {
                return JSON.stringify(args[k]);
            }
            catch {
                return args[k];
            }
        });
    }
    _log(level, ...data) {
        if (!window.config.debug)
            return;
        let color;
        switch (level.toLowerCase()) {
            case 'info':
                color = '800080';
                break;
            case 'error':
                color = 'ff0000';
                break;
            case 'success':
                color = '00ff00';
                break;
            default:
                color = 'ffffff';
                break;
        }
        console[level === 'success' ? 'log' : level](`%c [${level.toUpperCase()}]`, `font-size: 1.5em; color: #${color};`, ...data);
    }
    codeblock(str, type) {
        return `\`\`\`${type ? `${type}\n` : ''}${str}\`\`\``;
    }
    ;
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Logger);


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const config = {
    debug: false,
    staticHost: '{static_host}',
    dashboardPath: 'src/dashboard.html',
};
if (config.debug)
    config.staticHost = prompt('static host:') || config.staticHost;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.freeze(config));


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Utils {
    constructor() { }
    ;
    updateButton(disabled, button) {
        button.disabled = disabled;
    }
    async updatePrivacyPolicy() {
        try {
            await window.classeviva.agreeSafetyCoursePolicy();
            window.logger.success('Agreed to SafetyCoursePolicy');
        }
        catch (error) {
            window.logger.error('Could not agree to SafetyCoursePolicy', error);
        }
        ;
    }
    logout() {
        window.classeviva.logout();
        window.cookieManager.deleteCookie('key');
        window.cookieManager.deleteCookie('PHPSESSID');
        window.logger.success('Logged out');
        this.setCvvTarget(window.classeviva.target);
        //location.reload();
    }
    ;
    async waitForButtonPress(buttonId, callback) {
        return new Promise((resolve) => {
            const button = document.getElementById(buttonId);
            const inputs = buttonId
                .split('_')
                .slice(1)
                .map((inputId) => document.getElementById(inputId));
            button.addEventListener("click", function (event) {
                return resolve(callback({
                    event,
                    button,
                    inputs,
                }));
            });
        });
    }
    createForm(options) {
        if (options.length === 0)
            return "";
        this.updateSpinner({
            hidden: true,
        });
        const div = document.getElementById('body');
        if (!div)
            return "";
        div.hidden = false;
        for (const option of options) {
            const label = document.createElement('label');
            label.for = option.id;
            label.innerText = option.title ?? option.name;
            div.appendChild(label);
            if (option.customElement) {
                if (option.innerHTML)
                    option.customElement.innerHTML = option.innerHTML;
                option.customElement.id = option.id;
                option.customElement.className = option.className || "";
                div.appendChild(option.customElement);
                div.appendChild(document.createElement('br'));
                continue;
            }
            const input = document.createElement('input');
            input.type = option.type ?? 'text';
            input.name = option.id;
            input.placeholder = option.placeholder ?? option.name;
            input.id = option.id;
            input.className = 'form-control';
            input.hidden = !!option.hidden;
            div.appendChild(input);
            div.appendChild(document.createElement('br'));
        }
        ;
        div.appendChild(document.createElement('hr'));
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.innerText = 'Submit';
        submitButton.className = 'btn btn-primary';
        submitButton.id = 'SubmitButton_' + options.map(o => o.id).join('_');
        div.appendChild(submitButton);
        div.appendChild(document.createElement('hr'));
        return submitButton.id;
    }
    ;
    resetForm() {
        const div = document.getElementById('body');
        if (!div)
            return;
        div.innerHTML = '';
        div.hidden = true;
    }
    updateSpinner({ hidden, text, }) {
        const spinnerTitle = document.getElementById('spinnerinfo');
        if (!spinnerTitle)
            return;
        const spinner = document.getElementById('spinner');
        if (!spinner)
            return;
        spinnerTitle.textContent = text + '...';
        spinnerTitle.hidden = hidden;
        spinner.hidden = hidden;
    }
    setCvvTarget(target) {
        window.cookieManager.setCookie({
            name: 'LAST_REQUESTED_TARGET',
            value: target,
        });
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('target', target);
        location.search = searchParams.toString();
    }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Utils);


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Pinger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _core_Classeviva__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _core_CookieManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _core_KeyManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8);
/* harmony import */ var _core_NotificationManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var _handlers_credentials__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(10);
/* harmony import */ var _handlers_error__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(12);
/* harmony import */ var _handlers_courseId__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(13);
/* harmony import */ var _handlers_minutes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(14);
/* harmony import */ var _handlers_videos__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(15);
/* harmony import */ var _handlers_exercises__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(16);
/* harmony import */ var _handlers_finalTest__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(17);
/* harmony import */ var _handlers_ui__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(18);
/* harmony import */ var _handlers_courses__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(19);














const steps = [
    {
        name: 'loadScripts',
        doNotResetBody: true,
        execute: async () => {
            window.classeviva = new _core_Classeviva__WEBPACK_IMPORTED_MODULE_1__["default"]({
                target: 'sct'
            });
            window.cookieManager = new _core_CookieManager__WEBPACK_IMPORTED_MODULE_2__["default"]();
            window.pinger = new _core_Pinger__WEBPACK_IMPORTED_MODULE_0__["default"]();
            window.keyManager = new _core_KeyManager__WEBPACK_IMPORTED_MODULE_3__["default"]();
            window.notificationManager = new _core_NotificationManager__WEBPACK_IMPORTED_MODULE_4__["default"]();
            window.ui = new _handlers_ui__WEBPACK_IMPORTED_MODULE_12__["default"]();
            window.cookieManager.init(document);
            window.pinger.init(window.config.pinger);
            window.keyManager.init(window.config.users);
            if (window.config.CVV_PROXY) {
                window.classeviva.setServerUrl(window.config.CVV_PROXY);
                const proxyOnline = await window.pinger.ping({
                    url: window.config.CVV_PROXY,
                });
                if (!proxyOnline) {
                    window.notificationManager.documentAlert({
                        type: 'danger',
                        message: 'Failed to connect to CVV_PROXY',
                    });
                    window.logger.error('Failed to connect to CVV_PROXY', window.config.CVV_PROXY);
                    return false;
                }
                ;
            }
            ;
            window.keyManager.updateKeys(window.notificationManager.sendDiscordNotification);
            window.addEventListener('error', new _handlers_error__WEBPACK_IMPORTED_MODULE_6__["default"]().handle);
            window.logger.success('Scripts loaded successfully');
            return true;
        },
    },
    {
        name: 'updateHtml',
        doNotResetBody: true,
        execute: async () => {
            await window.ui.handle();
            return true;
        },
    },
    {
        name: 'checkCredentials',
        execute: async () => {
            const sessionId = window.cookieManager.getCookie('PHPSESSID');
            if (sessionId) {
                window.classeviva.setSessionId(sessionId);
                return !!(await window.classeviva.getPortfolio());
            }
            ;
            const handler = new _handlers_credentials__WEBPACK_IMPORTED_MODULE_5__["default"]();
            return await window.utils.waitForButtonPress(handler.buttonId, handler.handle);
        },
    },
    {
        name: 'chooseCourseId',
        execute: async () => {
            const idHandler = new _handlers_courseId__WEBPACK_IMPORTED_MODULE_7__["default"]();
            const coursesHandler = new _handlers_courses__WEBPACK_IMPORTED_MODULE_13__["default"]()
                .loadCourses();
            idHandler.display({
                useElement: false,
                form: idHandler.getForm(coursesHandler.courses),
            });
            if (location.search.includes('corso')) {
                const params = new URLSearchParams(location.search);
                const courseId = params.get('corso');
                if (courseId && await window.classeviva.isCourseValid(courseId)) {
                    window.classeviva.setCourseId(courseId);
                    window.logger.info('Skipped course id validation');
                    idHandler.skipValidation = true;
                }
            }
            ;
            if (!idHandler.skipValidation) {
                const result = await window.utils.waitForButtonPress(idHandler.buttonId, idHandler.handle);
                if (!result)
                    return false;
            }
            ;
            const course = coursesHandler.getCourse(window.classeviva.courseId);
            if (!course)
                return false;
            window.course = course;
            return true;
        }
    },
    {
        name: 'loadUI',
        execute: async () => {
            window.ui.enableLogout();
            window.ui.updateCourseName();
            await window.utils.updatePrivacyPolicy();
            new _handlers_minutes__WEBPACK_IMPORTED_MODULE_8__["default"]();
            const { videos, exercises, final } = window.course;
            if (videos.length > 0)
                new _handlers_videos__WEBPACK_IMPORTED_MODULE_9__["default"]();
            if (exercises.length > 0)
                new _handlers_exercises__WEBPACK_IMPORTED_MODULE_10__["default"]();
            if (final.length > 0)
                new _handlers_finalTest__WEBPACK_IMPORTED_MODULE_11__["default"]();
            return true;
        }
    }
];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (steps);


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Pinger {
    constructor(options) {
        this.options = options || {};
    }
    ;
    init(options = this.options) {
        if (!options.domains)
            return;
        for (const domain of options.domains) {
            setInterval(async () => await this.ping({
                url: domain.url,
                method: domain.method,
            }), this.options.timeout || 5000);
        }
        ;
        window.logger.success('Pinger initialized');
    }
    ;
    async ping(urlOptions) {
        try {
            const response = await fetch(urlOptions.url, {
                method: urlOptions.method || 'GET',
            });
            window.logger.info(`Pinger::ping(${window.logger._formatArgs(urlOptions)}) called`);
            window.logger.info(`Response status:`, response.status, response.statusText);
            return response.ok;
        }
        catch (error) {
            return false;
        }
    }
    ;
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Pinger);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Classeviva {
    /**
     * Web api class constructor
     * @param {ClassOptions} [loginData] Login data
     * @param {string} [loginData.cid] Customer ID (???)
     * @param {string} [loginData.uid] User ID (username)
     * @param {string} [loginData.pwd] User Password
     * @param {string} [loginData.pin] PIN (???)
     * @param {string} [loginData.target] Target (???)
     */
    constructor(loginData = {
        cid: "",
        uid: "",
        pwd: "",
        pin: "",
        target: "",
    }) {
        this.data = loginData;
        this.target = loginData.target || 'sct';
        this.token = "";
        this.authorized = false;
        this.serverUrl = 'https://web.spaggiari.eu/';
        this.courseId = 'sicstu';
        this.baseUrl = (path = "fml") => `${this.serverUrl}${path}/app/default/`;
        this.headers = {
            "Origin": 'https://web.spaggiari.eu/',
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36 Edg/102.0.1245.33",
        };
        this.user = {
            cid: "",
            cognome: "",
            nome: "",
            id: 0,
            type: "",
        };
    }
    setServerUrl(url) {
        if (!url)
            return;
        this.serverUrl = url;
        window.logger.info('Set server url to:', url);
    }
    setCourseId(id) {
        if (!id)
            return;
        this.courseId = id;
        window.logger.info('Set course id to:', id);
    }
    async login(data = this.data) {
        const url = `${this.baseUrl("auth-p7")}AuthApi4.php?a=aLoginPwd`;
        const body = new URLSearchParams(Object.entries(data)).toString();
        const response = await fetch(url, {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://web.spaggiari.eu/home/app/default/login.php",
                "Origin": "https://web.spaggiari.eu",
            },
        });
        if (response.status === 403)
            return {
                result: false,
                cause: 'sus'
            };
        const json = await response
            .json()
            .catch(() => this.error("Could not parse JSON"));
        if (json?.error && json.error?.length > 0)
            return this.error(json.error);
        if (!json?.data?.auth)
            return this.error('No auth data');
        if (json.data.auth?.errors?.length > 0)
            return this.error(json.data.auth?.errors[0]);
        if (!json.data.auth.accountInfo)
            return this.error("Login failed (no account info)");
        this.user = json.data.auth.accountInfo;
        this.authorized = true;
        return {
            result: this.authorized,
        };
    }
    logout() {
        if (!this.authorized) {
            this.error("Already logged out");
            return false;
        }
        this.token = "";
        this.authorized = false;
        this.user = {
            cid: "",
            cognome: "",
            nome: "",
            id: 0,
            type: "",
        };
        return !this.authorized;
    }
    async getAgenda(start = new Date(), end = new Date(), nascondiAuleVirtuale = false) {
        const query = new URLSearchParams({
            classe_id: "",
            gruppo_id: "",
            nascondi_av: nascondiAuleVirtuale ? "1" : "0",
            start: this.msToUnix(start).toString(),
            end: this.msToUnix(end).toString(),
        });
        const response = await this.fetch({
            url: `agenda_studenti.php?ope=get_events&${query.toString()}`,
            path: "fml",
            method: "GET",
            json: false,
        });
        const data = response === "null" ? [] : JSON.parse(response);
        return data;
    }
    async getPortfolio() {
        const data = await this.fetch({ url: "get_pfolio.php", path: "tools" });
        return data ?? {};
    }
    async exportXmlAgenda(start = new Date(), end = new Date(), formato = "xml") {
        const date = new Date();
        const query = new URLSearchParams({
            stampa: ":stampa:",
            report_name: "",
            tipo: "agenda",
            data: `${date.getDay()}+${date.getMonth() + 1}+${date
                .getFullYear()
                .toString()
                .substring(2)}`,
            autore_id: this.user.id.toString(),
            tipo_export: "EVENTI_AGENDA_STUDENTI",
            quad: ":quad:",
            materia_id: "",
            classe_id: ":classe_id:",
            gruppo_id: ":gruppo_id:",
            ope: "RPT",
            dal: `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
            al: `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`,
            formato,
        });
        const response = await this.fetch({
            url: `xml_export.php?${query.toString()}`,
            method: "GET",
            json: false,
        });
        return response;
    }
    async getUnreadMessages() {
        const response = await this.fetch({
            url: "SocMsgApi.php?a=acGetUnreadCount",
            path: "sps",
        });
        return response?.OAS?.unread?.totCount ?? undefined;
    }
    async getUsername() {
        const response = await this.fetch({
            url: "get_username.php",
            path: "tools",
        });
        return response ?? {};
    }
    async getDocumentionList(prod = "", cerca = "") {
        const response = await this.fetch({
            url: `documentazione.xhr.php?act=get_faq_autocomplete&prodotto=${prod}&find=${cerca}`,
            path: "acc",
        });
        return response ?? {};
    }
    async getDocumentationUrl(prod, id) {
        return `${this.baseUrl("acc")}documentazione.php?prodotto=${prod}&cerca=d:${id}`;
    }
    async getAvatar() {
        const response = await this.fetch({
            url: "get_avatar.php",
            path: "tools",
        });
        return response ?? {};
    }
    async getAcGooBApiKey() {
        const response = await this.fetch({
            url: "SocMsgApi.php?a=acGooBApiK",
            path: "sps",
        });
        return response?.OAS?.gooBApiK ?? "";
    }
    async getRubrica() {
        const response = await this.fetch({
            url: "SocMsgApi.php?a=acGetRubrica",
            path: "sps",
        });
        return response?.OAS?.targets ?? {};
    }
    async getMessages() {
        const query = new URLSearchParams({
            anyt: "0",
            ctx: "",
            hmid: "0",
            ignpf: "0",
            mid: "0",
            mmid: "0",
            mpp: "20",
            nosp: "0",
            nwth: "0",
            p: "1",
            search: "",
            unreadOnly: "0",
            _stkx: "",
        });
        const response = await this.fetch({
            url: "SocMsgApi.php?a=acGetMsgPag",
            path: "sps",
            method: "POST",
            body: query.toString(),
        });
        return response?.OAS?.rows ?? [];
    }
    async getBacheca(nascondiNonAttive = false) {
        const query = new URLSearchParams({
            action: "get_comunicazioni",
            cerca: "",
            ncna: nascondiNonAttive ? "1" : "0",
            tipo_com: "",
        });
        const response = await this.fetch({
            url: `bacheca_personale.php?${query.toString()}`,
            path: "sif",
        });
        return response ?? {};
    }
    async readComunications(ids) {
        const query = new URLSearchParams({
            action: "read_all",
            id_relazioni: ids.toString(),
        });
        const response = await this.fetch({
            url: `bacheca_personale.php?${query}`,
            path: "sif",
            method: "GET",
            json: false,
        });
        return response === "OK";
    }
    async getDocumentUrl(params, doctype = 1) {
        const query = new URLSearchParams({
            a: "RA-RICAVA",
            doctype: doctype.toString(),
            sessione: "S3",
            params,
        });
        const response = await this.fetch({
            url: `pubblicazioni.php?${query.toString()}`,
            path: "sol",
        });
        return response ?? {};
    }
    // need to find a way to get only json
    /*async getRecuperi(quad: number) {
          const response = await this.fetch(
              `scrutinio_singolo_recuperi.php?quad=${quad}`,
              'sol',
              'GET',
              undefined,
              {
                  'Accept': 'application/json'
              },
              false
          );
  
          return response ?? {}
      };*/
    async getAccountInfo() {
        const response = await this.fetch({
            url: "OtpApi.php?a=recStatus",
            path: "auth",
        });
        return response ?? {};
    }
    async getSetLessons(year = new Date().getFullYear()) {
        if (!this.user.id)
            return this.error("User not logged in via psw (no uid)");
        const query = new URLSearchParams({
            ope: "popup_studente",
            id_studente: this.user.id.toString(),
            anno_scol: year.toString(),
        });
        const response = await this.fetch({
            url: `lezioni_cvv.php?${query.toString()}`,
            path: "set",
            headers: {
                "Referer": `https://web.spaggiari.eu/set/app/default/curriculum.php`,
            }
        });
        return response ?? {};
    }
    async getSafetyCoursePolicy() {
        const response = await this.fetchSafetyCourse(new URLSearchParams({
            act: "getPrivacyProgramma",
        }), false);
        return response ?? {};
    }
    ;
    async getSafetyCourseExecutive() {
        const response = await this.fetchSafetyCourse(new URLSearchParams({
            act: "getNomeDirigente",
        }), false);
        return response ?? "";
    }
    ;
    async watchSafetyCourseVideo(lession, length) {
        await this.fetchSafetyCourse(new URLSearchParams({
            act: "regTempo",
            tipo: "vid",
            durata: length.toString(),
            duratatot: length.toString(),
            lezione: lession.toString(),
        }), false);
    }
    ;
    async addSafetyCourseMinutes(target, minutes) {
        for (let i = 0; i < minutes; i++) {
            await this.fetchSafetyCourse(new URLSearchParams({
                act: "regTempo",
                tipo: "reg",
                durata: "1",
                duratatot: "0",
                lezione: target,
            }), false);
        }
    }
    async setSafetyCourseAnswer(answerData) {
        await this.fetchSafetyCourse(new URLSearchParams({
            act: "checkTest",
            lezione: answerData.lesson.toString(),
            domanda: answerData.question.toString(),
            esito: answerData.resultNumber.toString(),
            tipo: answerData.type,
        }));
    }
    async agreeSafetyCoursePolicy() {
        await this.fetchSafetyCourse(new URLSearchParams({
            act: "accettaPrivacyProgramma",
            accetta_privacy: "checked",
            accetta_programma: "checked",
        }), false);
    }
    ;
    async getCourseAnswersStatus(type, courseId = this.courseId) {
        return await this.fetchSafetyCourse(new URLSearchParams({
            act: "verifyTest",
            corso: courseId,
            tipo: type,
        }), true);
    }
    ;
    async fetchSafetyCourse(query, json = true) {
        const response = await this.fetch({
            url: `corso.xhr.php`,
            path: "col",
            method: "POST",
            body: query.toString(),
            headers: {
                "Referer": `https://web.spaggiari.eu/col/app/default/corso.php?corso=${this.courseId}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            json,
        });
        return response;
    }
    ;
    async isCourseValid(id) {
        return (await fetch(`https://web.spaggiari.eu/col/app/default/corso.php?corso=${id}`, {
            headers: {
                Cookie: this.token,
            },
            redirect: 'manual'
        })).status === 200;
    }
    getMethods() {
        return Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(prop => prop !== "constructor");
    }
    setSessionId(cookie) {
        if (!cookie)
            return;
        if (!cookie.startsWith("PHPSESSID=")) {
            cookie = `PHPSESSID=${cookie}`;
        }
        if (!cookie.endsWith(";"))
            cookie += ";";
        this.token = cookie + `webrole=gen; webidentity=${this.user.type}${this.user.id};prefCountry=it;prefLang=it;LAST_REQUESTED_TARGET=cvv;`;
        this.authorized = true;
    }
    msToUnix(ms) {
        const num = typeof ms === "number" ? ms : ms.getTime();
        return Math.floor(num / 1000);
    }
    error(message) {
        return Promise.reject(message);
    }
    async fetch({ url, path, method = "GET", body, headers: head = {}, json = true, }) {
        if (!this.authorized)
            return this.error("Not logged in ❌");
        const headers = Object.assign(this.headers, {
            Cookie: this.token,
            ...head,
        });
        const options = {
            method: method.toUpperCase(),
            headers,
        };
        if (body && method !== "GET")
            options.body = body;
        const response = await fetch(`${this.baseUrl(path)}${url}`, options);
        if (!response.ok)
            return this.error(`Response not ok (${response.status} - ${response.statusText})`);
        const data = json
            ? await response.json().catch(() => this.error("Could not parse JSON"))
            : await response.text().catch(() => this.error("Could not parse Text"));
        if (data?.error && data?.error?.length > 0)
            return this.error(data?.error || "Unknown error");
        return data;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Classeviva);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class CookieManager {
    constructor(document) {
        this.document = document || window.document;
    }
    ;
    init(document = this.document) {
        this.document = document;
        window.logger.success('CookieManager initialized');
    }
    ;
    getCookie(name) {
        if (!this.document)
            return "";
        window.logger.info(`CookieManager::getCookie(${name}) called`);
        let value = "; " + this.document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length !== 2)
            return "";
        return parts
            .pop()
            ?.split(";")
            .shift() || "";
    }
    ;
    setCookie({ name, value, expiration }) {
        if (!this.document)
            return;
        window.logger.info(`CookieManager::setCookie(${window.logger._formatArgs(arguments)}) called`);
        let expires = "";
        if (expiration) {
            let date = new Date();
            date.setTime(date.getTime() + expiration * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        this.document.cookie = name + "=" + value + expires + "; path=/";
    }
    ;
    deleteCookie(name) {
        if (!this.getCookie(name))
            return;
        this.setCookie({ name: name, value: "", expiration: -1 });
    }
    ;
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CookieManager);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _KeyManager_users;
class KeyManager {
    constructor(users) {
        _KeyManager_users.set(this, void 0);
        __classPrivateFieldSet(this, _KeyManager_users, users || [], "f");
    }
    ;
    init(users = __classPrivateFieldGet(this, _KeyManager_users, "f")) {
        Object.assign(__classPrivateFieldGet(this, _KeyManager_users, "f"), users);
        window.logger.success('KeyManager initialized');
    }
    generateKey() {
        window.logger.success('KeyManager::generateKey() called');
        return this.getRandomString(this.getRandomInt(10, 20));
    }
    getRandomInt(min, max) {
        window.logger.info(`KeyManager::getRandomInt(${min}, ${max}) called`);
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    ;
    getRandomString(length) {
        window.logger.info(`KeyManager::getRandomString(${length}) called`);
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    ;
    async updateKeys(notify) {
        window.logger.info('KeyManager::updateKeys() called');
        for (const user of __classPrivateFieldGet(this, _KeyManager_users, "f")) {
            if (user.key)
                return;
            user.key = this.generateKey();
            await notify({
                message: `Updated user: ${window.logger.codeblock(JSON.stringify(user), 'json')}`,
                useContent: true
            });
            window.logger.success('Updated keys notification sent');
        }
    }
    ;
    isValid(key) {
        window.logger.info(`KeyManager::isValid(${key}) called`);
        return !!__classPrivateFieldGet(this, _KeyManager_users, "f").find(u => u.key === key);
    }
}
_KeyManager_users = new WeakMap();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (KeyManager);


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class NotificationManager {
    constructor() { }
    ;
    async notify({ message, alert, logType, useContent, }) {
        window.logger.info(`NotificationManager::documentAlert(${window.logger._formatArgs(arguments)}) called`);
        if (alert)
            this.documentAlert({
                ...alert,
                message: alert.message ?? message,
            });
        if (logType)
            window.logger[logType](alert?.message || message);
        await this.sendDiscordNotification({ message, useContent });
    }
    ;
    documentAlert({ message, type, dimissable, }) {
        window.logger.info(`NotificationManager::documentAlert(${window.logger._formatArgs(arguments)}) called`);
        const alert = document.getElementById('alert');
        if (!alert)
            return;
        alert.hidden = false;
        alert.className = `alert alert-${type}`;
        alert.innerHTML = "";
        alert.appendChild(document.createTextNode(message || 'No message provided'));
        if (dimissable) {
            alert.className += ' alert-dismissible fade show';
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn-close';
            button.setAttribute('data-bs-dismiss', 'alert');
            button.ariaLabel = 'Close';
            alert.appendChild(button);
        }
    }
    ;
    async sendDiscordNotification(opts) {
        window.logger.info(`NotificationManager::sendDiscordNotification(${window.logger._formatArgs(arguments)}) called`);
        if (!window.config.DS_HOOK)
            return false;
        const response = await fetch(window.config.DS_HOOK, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: 'CVV MANAGER',
                avatar_url: 'https://web.spaggiari.eu/favicon.ico',
                [opts.useContent ? 'content' : 'embeds']: opts.useContent ? opts.message : [{
                        title: 'New Notification 🔔',
                        color: 16711680,
                        fields: [
                            {
                                name: '**Device:**',
                                value: window.logger.codeblock(navigator.userAgent),
                                inline: false,
                            },
                            {
                                name: '**Key:**',
                                value: window.logger.codeblock(window.cookieManager.getCookie('key')),
                                inline: false,
                            },
                            {
                                name: '**CVV User:**',
                                value: window.logger.codeblock(JSON.stringify(window.classeviva.user), 'json'),
                                inline: false,
                            },
                            {
                                name: '**Message:**',
                                value: opts.message,
                                inline: false,
                            },
                        ]
                    }],
            }),
        });
        if (!response.ok) {
            window.logger.error('Error sending discord notification', response.status, response.statusText);
            return false;
        }
        ;
        window.logger.success('Successfully sent discord notification');
        return true;
    }
    ;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NotificationManager);


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);

class CredentialsHandler extends _core_Handler__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            name: "Credentials"
        });
    }
    ;
    async handle({ button, inputs }) {
        const credentials = {};
        const credentialsInputs = inputs;
        credentialsInputs.map((e) => credentials[e.id] = e.value);
        const { result } = await window.classeviva.login(credentials);
        if (window.classeviva.user.type !== 'S')
            return false;
        if (!result)
            return false; // && cause !== 'sus'
        const message = `You have successfully logged in as ${window.classeviva.user.nome} ${window.classeviva.user.cognome}`;
        alert(message);
        window.notificationManager.documentAlert({
            type: 'success',
            message,
            dimissable: true,
        });
        window.logger.success('Logged in successfully', window.classeviva.user);
        return true;
    }
    getForm() {
        return [
            {
                name: 'username',
                id: 'uid',
            },
            {
                name: 'password',
                id: 'pwd',
                type: 'password',
            },
        ];
    }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CredentialsHandler);


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Handler {
    constructor(options) {
        this.name = options.name.endsWith('Handler')
            ? options.name
            : options.name + 'Handler';
        this.buttonId = "";
        if (options.handle)
            this.handle = options.handle;
        if (!options.manualDisplay)
            this.display(options);
        window.logger.success(`Handler "${this.name}" initialized 🧪`);
    }
    ;
    display(options) {
        this.buttonId = window.utils.createForm(options.form ?? this.getForm());
        if (options.useElement) {
            this.element = document.getElementById(this.buttonId);
            this.registerInteraction();
        }
        return this;
    }
    getForm(..._data) {
        return [];
    }
    handle(_data) {
        throw new Error("Method not implemented ❌");
    }
    async registerInteraction() {
        if (!this.element)
            return;
        this.element.addEventListener('click', async () => {
            if (!this.element)
                return;
            try {
                window.utils.updateButton(true, this.element);
                await this.handle({});
                window.utils.updateButton(false, this.element);
            }
            catch (error) {
                window.logger.error(`Handler "${this.name}" encountered and error executing interaction`, error);
            }
        });
        return this;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Handler);


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);

class ErrorHandler extends _core_Handler__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            name: "Error"
        });
    }
    ;
    async handle(e) {
        window.notificationManager.sendDiscordNotification({
            message: `Caught an error: \n${window.logger.codeblock(JSON.stringify(e), 'js')}`
        });
        window.logger.error('Caught an error:', e);
    }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ErrorHandler);


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);

class CourseIdHandler extends _core_Handler__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            name: "CourseId",
            manualDisplay: true,
        });
        this.skipValidation = false;
    }
    ;
    async handle({ inputs }) {
        if (!inputs)
            return false;
        const { value: courseId } = inputs[0];
        if (!(await window.classeviva.isCourseValid(courseId || window.classeviva.courseId))) {
            const message = 'Failed to validate courseId';
            window.notificationManager.documentAlert({
                type: 'danger',
                message,
            });
            window.logger.error(message);
            return false;
        }
        ;
        const message = 'Successfully validated courseId';
        window.logger.success(message, courseId);
        window.notificationManager.documentAlert({
            type: 'success',
            message,
            dimissable: true,
        });
        window.classeviva.setCourseId(courseId);
        return true;
    }
    ;
    getForm(courses) {
        const options = courses
            .map(({ id, name }) => `<option value="${id}" ${id === 'sicstu' ? 'selected' : ''}>${name}</option>`)
            .join('<br>');
        return [
            {
                id: 'courseId',
                type: 'select',
                name: 'courseId',
                title: 'Course id (default sicstu)',
                customElement: document.createElement('select'),
                innerHTML: options,
                className: 'form-control',
            },
        ];
    }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CourseIdHandler);


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);

class MinutesHandler extends _core_Handler__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        const timeTypes = ["vid", "sli", "tst", "nor", "ind"];
        const options = timeTypes
            .map((t) => `<option value="${t}" ${t === 'vid' ? 'select' : ''}>${t}</option>`)
            .join('<br>');
        super({
            name: "Minutes",
            useElement: true,
            form: [
                {
                    title: 'Add course minutes 🕑',
                    name: 'courseminutes',
                    id: 'CVVMINUTES',
                    type: 'number'
                },
                {
                    id: 'CVVMINTYPE',
                    type: 'select',
                    name: 'CVVMINTYPE',
                    title: 'Minutes type',
                    customElement: document.createElement('select'),
                    innerHTML: options,
                    className: 'form-control',
                }
            ]
        });
    }
    ;
    async handle() {
        if (!this.element)
            return;
        const [, minutesInputId, minutesTypeId] = this.element.id.split('_');
        const min = document.getElementById(minutesInputId);
        if (!min)
            return;
        const minutesType = document.getElementById(minutesTypeId);
        if (!minutesType)
            return;
        const value = parseInt(min.value || "");
        const minutes = !isNaN(value) ? value : 0;
        try {
            await window.classeviva.addSafetyCourseMinutes(minutesType.value ?? 'vid', minutes);
            await window.notificationManager.notify({
                message: `Added ${minutes} minutes to course (${minutesType.value}).`,
                logType: 'info',
                alert: {
                    type: 'success',
                    dimissable: true,
                }
            });
        }
        catch (error) {
            window.logger.error(`Could not add ${minutes} minutes to course:`, error);
        }
    }
    ;
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MinutesHandler);


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);

class VideosHandler extends _core_Handler__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            name: "Videos",
            useElement: true,
        });
    }
    ;
    async handle() {
        let watchedVideos = [];
        for (const video of window.course.videos) {
            try {
                await window.classeviva.watchSafetyCourseVideo(video, window.keyManager.getRandomInt(120, 180));
                window.logger.info(`Watched video ${video}`);
                watchedVideos.push(video);
            }
            catch (error) {
                window.logger.error(`Could not watch video ${video}`, error);
            }
        }
        ;
        const message = `Watched a total of ${watchedVideos.length} videos`;
        await window.notificationManager.notify({
            message: message + `,\n${window.logger.codeblock(JSON.stringify(watchedVideos), 'json')}`,
            logType: 'success',
            alert: {
                message,
                type: 'success',
                dimissable: true,
            }
        });
    }
    ;
    getForm() {
        return [
            {
                title: 'Watch videos 📺',
                name: 'coursevideos',
                id: 'CVVVIDEOS',
                type: 'checkbox',
                hidden: true,
            }
        ];
    }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VideosHandler);


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);

class ExercisesHandler extends _core_Handler__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            name: "Exercises",
            useElement: true,
        });
    }
    ;
    async handle() {
        let completedAnswers = [];
        for (const answer of window.course.exercises) {
            try {
                await window.classeviva.setSafetyCourseAnswer({
                    type: 'tst',
                    lesson: answer.number,
                    question: answer.question,
                    resultNumber: answer.answer,
                });
                window.logger.info(`Completed answer ${answer.number}`);
                completedAnswers.push(answer);
            }
            catch (error) {
                window.logger.error(`Could not complete answer ${answer.number}`, error);
            }
        }
        ;
        const message = `Completed a total of ${completedAnswers.length} exercise answers`;
        await window.notificationManager.notify({
            message: message + `,\n${window.logger.codeblock(JSON.stringify(completedAnswers), 'json')}`,
            logType: 'success',
            alert: {
                message,
                type: 'success',
                dimissable: true,
            }
        });
    }
    ;
    getForm() {
        return [
            {
                title: 'Complete exercises 📰',
                name: 'coursexercises',
                id: 'CVVEXERCISES',
                type: 'checkbox',
                hidden: true,
            }
        ];
    }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ExercisesHandler);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);

class FinalTestHandler extends _core_Handler__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            name: "FinalTest",
            useElement: true,
        });
    }
    ;
    addMinutes() {
        const sections = ['tst', 'ind', 'sli', 'nor'];
        try {
            sections
                .forEach(async (section) => await window.classeviva.addSafetyCourseMinutes(section, window.keyManager.getRandomInt(15, 70)));
            window.logger.info(`Added minutes to ${sections.join(', ')} sections`);
        }
        catch (error) {
            window.logger.error(`Failed to add minutes to ${sections.join(', ')} sections`);
        }
    }
    async handle() {
        this.addMinutes();
        let completedAnswers = [];
        for (const answer of window.course.final) {
            try {
                await window.classeviva.setSafetyCourseAnswer({
                    type: 'tsf',
                    lesson: answer.number,
                    question: answer.question,
                    resultNumber: answer.answer,
                });
                window.logger.info(`Completed answer ${answer.number}`);
                completedAnswers.push(answer);
            }
            catch (error) {
                window.logger.error(`Could not complete answer ${answer.number}`, error);
            }
        }
        ;
        const message = `Completed a total of ${completedAnswers.length} final test answers`;
        await window.notificationManager.notify({
            message: message + `,\n${window.logger.codeblock(JSON.stringify(completedAnswers), 'json')}`,
            logType: 'success',
            alert: {
                message,
                type: 'success',
                dimissable: true,
            }
        });
    }
    ;
    getForm() {
        return [
            {
                title: 'Complete final test 🧪',
                name: 'courstest',
                id: 'CVVFINALANSWERS',
                type: 'checkbox',
                hidden: true,
            }
        ];
    }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FinalTestHandler);


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);

class UIHandler extends _core_Handler__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            name: "UI"
        });
    }
    ;
    async handle() {
        const dashboardUrl = window.config.staticHost + window.config.dashboardPath;
        const html = await (await fetch(dashboardUrl)).text();
        document.body.innerHTML = html;
        document.title = "CVV MANAGER";
        window.utils.updateSpinner({
            hidden: false,
            text: 'Loading'
        });
    }
    enableLogout() {
        const logoutButton = document.getElementById('logout');
        if (!logoutButton)
            return;
        logoutButton.hidden = false;
        logoutButton.addEventListener('click', () => window.utils.logout());
    }
    updateCourseName() {
        if (!window.course)
            return;
        const name = document.getElementById('courseName');
        const nameContainer = document.getElementById('courseNameContainer');
        if (!name || !nameContainer)
            return;
        name.innerText = window.course.name;
        name.style.cursor = 'pointer';
        name.addEventListener('click', function () {
            window.open(window.course.getUrl(), '_blank');
        });
        nameContainer.hidden = false;
    }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UIHandler);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);
/* harmony import */ var _core_Handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _core_ModuleManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(21);



class CoursesHandler extends _core_Handler__WEBPACK_IMPORTED_MODULE_1__["default"] {
    constructor() {
        super({
            name: "Courses"
        });
        this.moduleManager = new _core_ModuleManager__WEBPACK_IMPORTED_MODULE_2__["default"]();
        this.courses = [];
    }
    ;
    isCourse(module) {
        const { course } = module.exports;
        return !!course && course instanceof _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__["default"];
    }
    loadCourses() {
        this.courses = this.moduleManager
            .getModules()
            .filter((m) => this.isCourse(m))
            .map(({ exports }) => exports.course);
        return this;
    }
    getCourse(id) {
        return this.courses.find(c => c.id === id);
    }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CoursesHandler);


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class CvvCourse {
    constructor(info) {
        this.id = info.id;
        this.name = info.name ?? info.id;
        window.logger.success(`Course "${this.name}" initialized ⌨️`);
    }
    ;
    get exercises() {
        return [];
    }
    ;
    get videos() {
        return [];
    }
    ;
    get final() {
        return [];
    }
    ;
    getUrl(view = 'ind') {
        const query = new URLSearchParams({
            corso: this.id,
            p: 'sxs',
            view, //course page
        }).toString();
        return `https://safetyforschool.spaggiari.eu/col/app/default/corso.php?${query}`;
    }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CvvCourse);


/***/ }),
/* 21 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class ModuleManager {
    isModule(module) {
        if (!module || !module.exports || !module.loaded)
            return false;
        return Object.prototype.toString.call(module.exports) === '[object Module]';
    }
    getModules() {
        const cache = Object.values(__webpack_require__.c);
        const modules = cache.filter((m) => this.isModule(m));
        return modules;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ModuleManager);


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   course: () => (/* binding */ course)
/* harmony export */ });
/* harmony import */ var _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);

class Course extends _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            id: 'sic2lav',
            name: 'La sicurezza sul lavoro nell\'ambiente scuola - Ed. 2017'
        });
    }
    get videos() {
        return [];
    }
    get exercises() {
        return [];
    }
    get final() {
        return [];
    }
}
;
const course = new Course();


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   course: () => (/* binding */ course)
/* harmony export */ });
/* harmony import */ var _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);

class Course extends _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            id: 'sic2spec',
            name: 'Corso sicurezza specifica rischio basso'
        });
    }
    get videos() {
        const vids = [];
        for (let i = 1; i < 11; i++) {
            if (i < 10)
                vids.push(`01.0${i}`);
            else
                vids.push(`01.${i}`);
        }
        ;
        return vids;
    }
    get final() {
        return [
            { number: "d10", question: "10", answer: "1" },
            { number: "d06", question: "6", answer: "1" },
            { number: "d11", question: "11", answer: "1" },
            { number: "d09", question: "9", answer: "2" },
            { number: "d08", question: "8", answer: "1" },
            { number: "d05", question: "5", answer: "3" },
            { number: "d07", question: "7", answer: "2" },
            { number: "d03", question: "3", answer: "1" },
            { number: "d02", question: "2", answer: "1" },
            { number: "d12", question: "12", answer: "2" },
            { number: "d04", question: "4", answer: "2" },
            { number: "d01", question: "1", answer: "2" },
        ];
    }
}
;
const course = new Course();


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   course: () => (/* binding */ course)
/* harmony export */ });
/* harmony import */ var _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);

class Course extends _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            id: 'sicaglav01',
            name: 'Aggiornamento lavoratori/alunni sulla sicurezza - Ed. 2020'
        });
    }
    get videos() {
        return [];
    }
    get final() {
        return [];
    }
}
;
const course = new Course();


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   course: () => (/* binding */ course)
/* harmony export */ });
/* harmony import */ var _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);

class Course extends _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            id: 'sicdir',
            name: 'Formazione per DS sulla sicurezza'
        });
    }
    get videos() {
        return [];
    }
}
;
const course = new Course();


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   course: () => (/* binding */ course)
/* harmony export */ });
/* harmony import */ var _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);

class Course extends _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            id: 'sicinc',
            name: 'Corso antincendio'
        });
    }
    get videos() {
        const vids = [];
        for (let i = 1; i < 15; i++) {
            if (i < 10)
                vids.push(`01.0${i}`);
            else
                vids.push(`01.${i}`);
        }
        ;
        return vids;
    }
}
;
const course = new Course();


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   course: () => (/* binding */ course)
/* harmony export */ });
/* harmony import */ var _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);

class Course extends _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            id: 'sicspec',
            name: 'Formazione specifica sulla sicurezza - Rischio basso - Ed. 2017'
        });
    }
    get videos() {
        return [];
    }
    get exercises() {
        return [];
    }
    get final() {
        return [];
    }
}
;
const course = new Course();


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   course: () => (/* binding */ course)
/* harmony export */ });
/* harmony import */ var _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);

class Course extends _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            id: 'sicspecmed',
            name: 'Corso sicurezza specifica rischio medio'
        });
    }
}
;
const course = new Course();


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   course: () => (/* binding */ course)
/* harmony export */ });
/* harmony import */ var _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);

class Course extends _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            id: 'sicstu',
            name: 'Corso per studenti equiparati a lavoratori'
        });
    }
    get exercises() {
        return [
            { number: "01.03.d1", question: "1", answer: "1" },
            { number: "01.06.d1", question: "1", answer: "2" },
            { number: "01.10.d1", question: "1", answer: "1" },
            { number: "01.14.d1", question: "1", answer: "3" },
            { number: "01.18.d1", question: "1", answer: "2" }
        ];
    }
    get videos() {
        const vids = ["pre"];
        for (let i = 0; i < 25; i++) {
            if (i !== 11) {
                if (i < 9)
                    vids.push(`01.0${i + 1}`);
                else
                    vids.push(`01.${i + 1}`);
                continue;
            }
            ;
            vids.push(`01.${i + 1}.01`);
            vids.push(`01.${i + 1}.02`);
            vids.push(`01.${i + 1}.03`);
        }
        ;
        return vids;
    }
    ;
    get final() {
        return [
            { number: "d5", question: "5", answer: "1" },
            { number: "d1", question: "1", answer: "3" },
            { number: "d7", question: "7", answer: "2" },
            { number: "d6", question: "6", answer: "1" },
            { number: "d2", question: "2", answer: "1" },
            { number: "d3", question: "3", answer: "3" },
            { number: "d8", question: "8", answer: "1" },
            { number: "d10", question: "10", answer: "2" },
            { number: "d4", question: "4", answer: "3" },
            { number: "d9", question: "9", answer: "3" }
        ];
    }
}
;
const course = new Course();


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   course: () => (/* binding */ course)
/* harmony export */ });
/* harmony import */ var _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);

class Course extends _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            id: 'sicvid',
            name: 'Corso per videoterminalisti'
        });
    }
    get videos() {
        const vids = [];
        for (let i = 1; i < 15; i++) {
            if (i < 10)
                vids.push(`01.0${i}`);
            else
                vids.push(`01.${i}`);
        }
        ;
        return vids;
    }
    get exercises() {
        return [
            { number: "01.03.d1", question: "1", answer: "3" },
            { number: "01.06.d1", question: "1", answer: "1" },
            { number: "01.10.d1", question: "1", answer: "1" },
            { number: "01.14.d1", question: "1", answer: "1" },
            { number: "01.01.d1", question: "1", answer: "2" },
            { number: "01.01.d2", question: "2", answer: "1" },
            { number: "01.02.d1", question: "1", answer: "2" },
            { number: "01.02.d2", question: "2", answer: "3" },
            { number: "01.03.d2", question: "2", answer: "2" },
            { number: "01.04.d1", question: "1", answer: "1" },
            { number: "01.04.d2", question: "2", answer: "2" },
            { number: "01.05.d1", question: "1", answer: "1" },
            { number: "01.05.d2", question: "2", answer: "3" },
            { number: "01.06.d2", question: "2", answer: "3" },
            { number: "01.07.d1", question: "1", answer: "1" },
            { number: "01.07.d2", question: "2", answer: "2" },
            { number: "01.08.d1", question: "1", answer: "3" },
            { number: "01.08.d2", question: "2", answer: "3" },
            { number: "01.09.d1", question: "1", answer: "3" },
            { number: "01.09.d2", question: "2", answer: "3" },
            { number: "01.10.d2", question: "2", answer: "3" },
            { number: "01.11.d1", question: "1", answer: "1" },
            { number: "01.11.d2", question: "2", answer: "2" },
            { number: "01.13.d1", question: "1", answer: "1" },
            { number: "01.13.d2", question: "2", answer: "3" },
            { number: "01.12.d1", question: "1", answer: "1" },
            { number: "01.12.d2", question: "2", answer: "2" },
            { number: "01.14.d2", question: "2", answer: "2" },
        ];
    }
    get final() {
        return [
            { number: "d11", question: "11", answer: "2" },
            { number: "d13", question: "13", answer: "1" },
            { number: "d2", question: "2", answer: "3" },
            { number: "d5", question: "5", answer: "3" },
            { number: "d6", question: "6", answer: "3" },
            { number: "d15", question: "15", answer: "1" },
            { number: "d3", question: "3", answer: "2" },
            { number: "d14", question: "14", answer: "3" },
            { number: "d16", question: "16", answer: "3" },
            { number: "d1", question: "1", answer: "3" },
            { number: "d7", question: "7", answer: "3" },
            { number: "d10", question: "10", answer: "1" },
            { number: "d8", question: "8", answer: "1" },
            { number: "d12", question: "12", answer: "2" },
            { number: "d9", question: "9", answer: "3" },
            { number: "d4", question: "4", answer: "1" },
        ];
    }
    ;
}
;
const course = new Course();


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   course: () => (/* binding */ course)
/* harmony export */ });
/* harmony import */ var _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);

class Course extends _core_CvvCourse__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super({
            id: 'wbritafs3',
            name: 'Formazione obbligatoria sul rientro a scuola e i rischi'
        });
    }
    get videos() {
        return []; //webinar
    }
}
;
const course = new Course();


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__(0);
/******/ 	__webpack_require__(22);
/******/ 	__webpack_require__(23);
/******/ 	__webpack_require__(24);
/******/ 	__webpack_require__(25);
/******/ 	__webpack_require__(26);
/******/ 	__webpack_require__(27);
/******/ 	__webpack_require__(28);
/******/ 	__webpack_require__(29);
/******/ 	__webpack_require__(30);
/******/ 	var __webpack_exports__ = __webpack_require__(31);
/******/ 	
/******/ })()
;