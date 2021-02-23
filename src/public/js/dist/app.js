var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var NavInterface = /** @class */ (function () {
    function NavInterface() {
        this.navElement = document.querySelector('.nav-ctn');
        this.routinesDropDownID = 'routines-drop-down';
        this.routinesDropDown = document.getElementById(this.routinesDropDownID);
        this.routines = document.querySelector('.routines-ctn');
        this.projectsDropDownID = 'projects-drop-down';
        this.projectsDropDown = document.getElementById(this.projectsDropDownID);
        this.projects = document.querySelector('.projects-ctn');
    }
    NavInterface.prototype.toggleDropDownRoutines = function () {
        this.routinesDropDown.classList.toggle('active');
        this.routines.classList.toggle('active');
    };
    NavInterface.prototype.toggleDropDownProjects = function () {
        this.projectsDropDown.classList.toggle('active');
        this.projects.classList.toggle('active');
    };
    NavInterface.prototype.printRoutine = function (routineName, id, color, desc) {
        var routine = document.createElement('li');
        routine.classList.add('routine');
        routine.dataset.id = id.toString();
        routine.dataset.desc = desc;
        routine.innerHTML = "<span style=\"background-color: #" + color + "\"></span>" + routineName;
        this.routines.insertBefore(routine, this.routines.querySelector('.add-routine'));
    };
    NavInterface.prototype.printProject = function (projectName, id, color, desc) {
        var project = document.createElement('li');
        project.classList.add('project');
        project.dataset.id = id.toString();
        project.dataset.desc = desc;
        project.innerHTML = "<span style=\"background-color: #" + color + "\"></span>" + projectName;
        this.projects.insertBefore(project, this.projects.querySelector('.add-project'));
    };
    return NavInterface;
}());
var TasksInterface = /** @class */ (function (_super) {
    __extends(TasksInterface, _super);
    function TasksInterface() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tasksCtn = document.querySelector('.tasks-ctn');
        _this.tumbleweed = document.getElementById('tumbleweed');
        return _this;
    }
    TasksInterface.prototype.printTask = function (task, importance, color, initDate, finalDate, creationDate, taskID) {
        var initTime = convertDateToString(initDate);
        var finalTime = convertDateToString(finalDate);
        var timeDifference = convertDateToUnits((finalDate.getTime() - initDate.getTime()) / 1000);
        var creationTime = convertDateToString(creationDate);
        var div = document.createElement('div');
        div.classList.add('task');
        div.dataset.id = taskID.toString();
        div.innerHTML = "\n      <div class=\"header\">\n          <div class=\"color\" style=\"background-color:" + color + "\"></div>\n          <p class=\"importance\">" + importance + "</p>\n      </div>\n      <div class=\"body\">\n          <div class=\"main\">\n              <div class=\"circle\"></div>\n              <textarea maxlength=\"200\" rows=\"1\">" + task + "</textarea>\n          </div>\n          <div class=\"dates\">\n              <div class=\"tasks-dates\">\n                  <p>" + initTime + " - " + finalTime + ": " + timeDifference + "</p>\n              </div>\n              <p>Creada: " + creationTime + "</p>\n          </div>\n      </div>";
        this.tasksCtn.appendChild(div);
        this.autoSize(div.querySelector('.body .main textarea'));
    };
    TasksInterface.prototype.autoSize = function () {
        var textareas = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            textareas[_i] = arguments[_i];
        }
        textareas.forEach(function (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + "px";
        });
    };
    TasksInterface.prototype.removeTask = function (task) {
        task.classList.add('remove');
        setTimeout(function () {
            task.remove();
        }, 400);
    };
    TasksInterface.prototype.doneTask = function (circleTarget) {
        circleTarget.classList.add('active');
        this.removeTask(circleTarget.parentNode.parentElement.parentNode);
    };
    return TasksInterface;
}(NavInterface));
var UserInterface = /** @class */ (function (_super) {
    __extends(UserInterface, _super);
    function UserInterface() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.errors = {
            incognitoError: 'Lo sentimos ha ocurrido un error.',
            cannotUpdate: 'Lo sentimos, no hemos podido actualizar tu información, te invitamos a volverlo a intentar, o en su defecto más tarde.'
        };
        return _this;
    }
    UserInterface.prototype.showLoader = function () {
        //@ts-ignore
        this.loader = Swal.fire({
            title: 'Cargando',
            didOpen: function () {
                //@ts-ignore
                Swal.showLoading();
            }
        });
    };
    UserInterface.prototype.showErrorMessage = function (message) {
        //@ts-ignore
        Swal.fire('¡Error!', message, 'error');
    };
    UserInterface.prototype.removeLoader = function () {
        this.loader.close();
    };
    UserInterface.prototype.showUpdating = function () { };
    UserInterface.prototype.removeUpdating = function () { };
    return UserInterface;
}(TasksInterface));
//------GLOBAL SCOPE------
var UI = new UserInterface();
//------GLOBAL SCOPE------
UI.showLoader();
var ServerConn = /** @class */ (function () {
    function ServerConn() {
        this.routes = {
            getTask: {
                rute: '/app/tasks/getTasks',
                method: 'POST'
            },
            getRoutines: {
                rute: '/app/tasks/getRoutines',
                method: 'POST'
            },
            getProjects: {
                rute: '/app/tasks/getProjects',
                method: 'POST'
            },
            deleteTask: {
                rute: '/app/tasks/delete',
                method: 'DELETE'
            }
        };
    }
    ServerConn.prototype.getTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, tasks, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch(this.routes.getTask.rute, {
                                method: this.routes.getTask.method
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        tasks = _a.sent();
                        return [2 /*return*/, tasks];
                    case 3:
                        e_1 = _a.sent();
                        UI.showErrorMessage(UI.errors.incognitoError);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ServerConn.prototype.convertImportance = function (importance) {
        switch (importance) {
            case 'i-1':
                return 'Importante';
                break;
            case 'i-2':
                return 'Un poco importante';
                break;
            case 'i-3':
                return 'No tan importante';
                break;
            case 'i-4':
                return 'Irrelevante';
                break;
        }
    };
    ServerConn.prototype.printTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tasks;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTasks()];
                    case 1:
                        tasks = _a.sent();
                        if (tasks.length === 0) {
                            UI.tumbleweed.classList.remove('ocult');
                            console.log(UI.tumbleweed);
                            return [2 /*return*/];
                        }
                        UI.tumbleweed.classList.add('ocult');
                        tasks.forEach(function (task) {
                            UI.printTask(task.activity, _this.convertImportance(task.importance), "#" + task.color, new Date(task.startDate), new Date(task.finalDate), new Date(task.creationDate), task.taskID);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerConn.prototype.printRoutinesAndProjects = function () {
        fetch(this.routes.getProjects.rute, {
            method: this.routes.getProjects.method
        })
            .then(function (res) { return res.json(); })["catch"](function () { return UI.showErrorMessage(UI.errors.incognitoError); })
            .then(function (projects) {
            if (projects.length === 0)
                return;
            projects.forEach(function (project) {
                UI.printProject(project.title, project.projectID, project.color, project.description);
            });
        });
        fetch(this.routes.getRoutines.rute, {
            method: this.routes.getRoutines.method
        })
            .then(function (res) { return res.json(); })["catch"](function () { return UI.showErrorMessage(UI.errors.incognitoError); })
            .then(function (routines) {
            if (routines.length === 0)
                return;
            routines.forEach(function (routine) {
                UI.printRoutine(routine.title, routine.routineID, routine.color, routine.description);
            });
        });
    };
    ServerConn.prototype.deleteTask = function (taskID) {
        UI.showUpdating();
        fetch(this.routes.deleteTask.rute + ("/" + taskID), {
            method: this.routes.deleteTask.method
        })
            .then(function (res) { return res.json(); })["catch"](function () { return UI.showErrorMessage(UI.errors.incognitoError); })
            .then(function (res) {
            UI.removeUpdating();
            if (res.error)
                UI.showErrorMessage(UI.errors.cannotUpdate);
        });
    };
    return ServerConn;
}());
var server = new ServerConn();
server.printTasks();
server.printRoutinesAndProjects();
//----EVENTS-----
window.addEventListener('load', function () { return UI.removeLoader(); });
UI.tasksCtn.addEventListener('input', function (e) {
    if (e.target.tagName.toLowerCase() === 'textarea') {
        UI.autoSize(e.target);
    }
});
UI.tasksCtn.addEventListener('change', function (e) {
    if (e.target.tagName.toLowerCase() === 'textarea' && e.target.value.trim() === '') {
        UI.autoSize(e.target);
    }
});
UI.tasksCtn.addEventListener('keydown', function (e) {
    if (e.code.toLocaleLowerCase() === 'enter' &&
        e.target.tagName.toLocaleLowerCase() === 'textarea') {
        e.target.value = e.target.value.replace('\n', '');
    }
});
UI.tasksCtn.addEventListener('click', function (e) {
    if (e.target.classList.contains('circle')) {
        console.log(e.target.parentNode.parentNode.parentNode.dataset.id);
        UI.doneTask(e.target);
    }
    else if (e.target.classList.contains('importance')) {
        switch (e.target.innerText.trim()) {
            case 'Importante':
                e.target.innerText = 'Irrelevante';
                break;
            case 'Un poco importante':
                e.target.innerText = 'Importante';
                break;
            case 'No tan importante':
                e.target.innerText = 'Un poco importante';
                break;
            case 'Irrelevante':
                e.target.innerText = 'No tan importante';
                break;
        }
    }
});
UI.navElement.addEventListener('click', function (e) {
    if (isClick(e.target, 3, UI.routinesDropDownID)) {
        return UI.toggleDropDownRoutines();
    }
    if (isClick(e.target, 3, UI.projectsDropDownID)) {
        return UI.toggleDropDownProjects();
    }
});
//----FUNCTIONS----
// I check if the entered id belongs to any of the target levels
// target level 1 is target, 2 is target.parentNode, 3 is target.parentNode.parentNode...
function isClick(target, levels, id) {
    var counter = 0;
    for (var i = 1; i <= levels; i++) {
        if (target.id === id) {
            counter += 1;
        }
        target = target.parentNode;
    }
    return counter >= 1;
}
// this function receives date in seconds
function convertDateToUnits(sec) {
    var seconds = sec >= 1 && sec < 60, minutes = sec >= 60 && sec < 60 * 60, hours = sec >= 60 * 60 && sec < 60 * 60 * 24, days = sec >= 60 * 60 * 24 && sec < 60 * 60 * 24 * 30;
    if (seconds) {
        return "Termina en " + sec + " seg";
    }
    else if (minutes) {
        return "Termina en " + (sec / 60).toFixed(0) + " min";
    }
    else if (hours) {
        return "Termina en " + (sec / 60 / 60).toFixed(0) + " h";
    }
    else if (days) {
        return "Termina en " + (sec / 60 / 60 / 24).toFixed(0) + " d";
    }
    else {
        return 'terminado';
    }
}
function convertDateToString(date) {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
}
