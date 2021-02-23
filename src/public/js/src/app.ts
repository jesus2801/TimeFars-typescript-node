//---TYPES / INTERFACES-----
type Importance = 'i-1' | 'i-2' | 'i-3' | 'i-4';
interface Task {
  taskID: number;
  activity: string;
  importance: Importance;
  color: string;
  startDate: string;
  finalDate: string;
  creationDate: string;
}

interface Project {
  projectID: 9;
  title: string;
  description: string;
  color: string;
  creationDate: string;
}

interface Routine {
  routineID: 3;
  active: Object;
  title: string;
  description: string;
  color: string;
  creationDate: string;
}

interface ServerRes {
  error: boolean;
  message?: string;
}

class NavInterface {
  public navElement: HTMLDivElement = document.querySelector(
    '.nav-ctn'
  ) as HTMLDivElement;
  public routinesDropDownID: string = 'routines-drop-down';
  private routinesDropDown: HTMLLIElement = document.getElementById(
    this.routinesDropDownID
  ) as HTMLLIElement;
  private routines: HTMLUListElement = document.querySelector(
    '.routines-ctn'
  ) as HTMLUListElement;
  public projectsDropDownID: string = 'projects-drop-down';
  private projectsDropDown: HTMLLIElement = document.getElementById(
    this.projectsDropDownID
  ) as HTMLLIElement;
  private projects: HTMLUListElement = document.querySelector(
    '.projects-ctn'
  ) as HTMLUListElement;

  public toggleDropDownRoutines() {
    this.routinesDropDown.classList.toggle('active');
    this.routines.classList.toggle('active');
  }

  public toggleDropDownProjects() {
    this.projectsDropDown.classList.toggle('active');
    this.projects.classList.toggle('active');
  }

  public printRoutine(routineName: string, id: number, color: string, desc: string) {
    const routine: HTMLLIElement = document.createElement('li');
    routine.classList.add('routine');
    routine.dataset.id = id.toString();
    routine.dataset.desc = desc;
    routine.innerHTML = `<span style="background-color: #${color}"></span>${routineName}`;
    this.routines.insertBefore(routine, this.routines.querySelector('.add-routine'));
  }

  public printProject(projectName: string, id: number, color: string, desc: string) {
    const project: HTMLLIElement = document.createElement('li');
    project.classList.add('project');
    project.dataset.id = id.toString();
    project.dataset.desc = desc;
    project.innerHTML = `<span style="background-color: #${color}"></span>${projectName}`;
    this.projects.insertBefore(project, this.projects.querySelector('.add-project'));
  }
}

class TasksInterface extends NavInterface {
  public tasksCtn: HTMLDivElement = document.querySelector(
    '.tasks-ctn'
  ) as HTMLDivElement;
  public tumbleweed: HTMLObjectElement = document.getElementById(
    'tumbleweed'
  ) as HTMLObjectElement;

  public printTask(
    task: string,
    importance: string,
    color: string,
    initDate: Date,
    finalDate: Date,
    creationDate: Date,
    taskID: number
  ) {
    const initTime: string = convertDateToString(initDate);

    const finalTime: string = convertDateToString(finalDate);

    const timeDifference: string = convertDateToUnits(
      (finalDate.getTime() - initDate.getTime()) / 1000
    );

    const creationTime: string = convertDateToString(creationDate);

    const div = document.createElement('div');
    div.classList.add('task');
    div.dataset.id = taskID.toString();
    div.innerHTML = `
      <div class="header">
          <div class="color" style="background-color:${color}"></div>
          <p class="importance">${importance}</p>
      </div>
      <div class="body">
          <div class="main">
              <div class="circle"></div>
              <textarea maxlength="200" rows="1">${task}</textarea>
          </div>
          <div class="dates">
              <div class="tasks-dates">
                  <p>${initTime} - ${finalTime}: ${timeDifference}</p>
              </div>
              <p>Creada: ${creationTime}</p>
          </div>
      </div>`;
    this.tasksCtn.appendChild(div);
    this.autoSize(div.querySelector('.body .main textarea'));
  }

  public autoSize(...textareas: HTMLTextAreaElement[]) {
    textareas.forEach((textarea: HTMLTextAreaElement) => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }

  private removeTask(task: HTMLDivElement) {
    task.classList.add('remove');
    setTimeout(() => {
      task.remove();
    }, 400);
  }

  public doneTask(circleTarget: HTMLDivElement) {
    circleTarget.classList.add('active');
    this.removeTask(circleTarget.parentNode.parentElement.parentNode as HTMLDivElement);
  }
}

class UserInterface extends TasksInterface {
  private loader: any;
  public errors = {
    incognitoError: 'Lo sentimos ha ocurrido un error.',
    cannotUpdate:
      'Lo sentimos, no hemos podido actualizar tu información, te invitamos a volverlo a intentar, o en su defecto más tarde.',
  };

  public showLoader(): void {
    //@ts-ignore
    this.loader = Swal.fire({
      title: 'Cargando',
      didOpen: () => {
        //@ts-ignore
        Swal.showLoading();
      },
    });
  }

  public showErrorMessage(message: string): void {
    //@ts-ignore
    Swal.fire('¡Error!', message, 'error');
  }

  public removeLoader(): void {
    this.loader.close();
  }

  public showUpdating(): void {}

  public removeUpdating(): void {}
}

//------GLOBAL SCOPE------
const UI = new UserInterface();
//------GLOBAL SCOPE------
UI.showLoader();

class ServerConn {
  private routes = {
    getTask: {
      rute: '/app/tasks/getTasks',
      method: 'POST',
    },
    getRoutines: {
      rute: '/app/tasks/getRoutines',
      method: 'POST',
    },
    getProjects: {
      rute: '/app/tasks/getProjects',
      method: 'POST',
    },
    deleteTask: {
      rute: '/app/tasks/delete',
      method: 'DELETE',
    },
  };

  private async getTasks() {
    try {
      const response: Response = await fetch(this.routes.getTask.rute, {
        method: this.routes.getTask.method,
      });
      const tasks: Task[] = await response.json();
      return tasks;
    } catch (e) {
      UI.showErrorMessage(UI.errors.incognitoError);
    }
  }

  private convertImportance(importance: Importance): string {
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
  }

  public async printTasks(): Promise<void> {
    const tasks = await this.getTasks();
    if (tasks.length === 0) {
      UI.tumbleweed.classList.remove('ocult');
      console.log(UI.tumbleweed);
      return;
    }
    UI.tumbleweed.classList.add('ocult');
    tasks.forEach((task: Task) => {
      UI.printTask(
        task.activity,
        this.convertImportance(task.importance),
        `#${task.color}`,
        new Date(task.startDate),
        new Date(task.finalDate),
        new Date(task.creationDate),
        task.taskID
      );
    });
  }

  public printRoutinesAndProjects(): void {
    fetch(this.routes.getProjects.rute, {
      method: this.routes.getProjects.method,
    })
      .then(res => res.json())
      .catch(() => UI.showErrorMessage(UI.errors.incognitoError))
      .then((projects: Project[]) => {
        if (projects.length === 0) return;
        projects.forEach((project: Project) => {
          UI.printProject(
            project.title,
            project.projectID,
            project.color,
            project.description
          );
        });
      });

    fetch(this.routes.getRoutines.rute, {
      method: this.routes.getRoutines.method,
    })
      .then(res => res.json())
      .catch(() => UI.showErrorMessage(UI.errors.incognitoError))
      .then((routines: Routine[]) => {
        if (routines.length === 0) return;
        routines.forEach((routine: Routine) => {
          UI.printRoutine(
            routine.title,
            routine.routineID,
            routine.color,
            routine.description
          );
        });
      });
  }

  public deleteTask(taskID: number | string): void {
    UI.showUpdating();
    fetch(this.routes.deleteTask.rute+`/${taskID}`, {
      method: this.routes.deleteTask.method,
    })
      .then(res => res.json())
      .catch(() => UI.showErrorMessage(UI.errors.incognitoError))
      .then((res: ServerRes) => {
        UI.removeUpdating();
        if (res.error) UI.showErrorMessage(UI.errors.cannotUpdate);
      });
  }
}

const server = new ServerConn();
server.printTasks();
server.printRoutinesAndProjects();

//----EVENTS-----
window.addEventListener('load', () => UI.removeLoader());

UI.tasksCtn.addEventListener('input', (e: any) => {
  if (e.target.tagName.toLowerCase() === 'textarea') {
    UI.autoSize(e.target);
  }
});

UI.tasksCtn.addEventListener('change', (e: any) => {
  if (e.target.tagName.toLowerCase() === 'textarea' && e.target.value.trim() === '') {
    UI.autoSize(e.target);
  }
});

UI.tasksCtn.addEventListener('keydown', (e: any) => {
  if (
    e.code.toLocaleLowerCase() === 'enter' &&
    e.target.tagName.toLocaleLowerCase() === 'textarea'
  ) {
    e.target.value = e.target.value.replace('\n', '');
  }
});

UI.tasksCtn.addEventListener('click', (e: any) => {
  if (e.target.classList.contains('circle')) {
    console.log(e.target.parentNode.parentNode.parentNode.dataset.id);
    UI.doneTask(e.target);
  } else if (e.target.classList.contains('importance')) {
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

UI.navElement.addEventListener('click', (e: any) => {
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
function isClick(target: any, levels: number, id: string): boolean {
  let counter: number = 0;
  for (let i = 1; i <= levels; i++) {
    if (target.id === id) {
      counter += 1;
    }
    target = target.parentNode;
  }
  return counter >= 1;
}

// this function receives date in seconds
function convertDateToUnits(sec: number): string {
  const seconds = sec >= 1 && sec < 60,
    minutes = sec >= 60 && sec < 60 * 60,
    hours = sec >= 60 * 60 && sec < 60 * 60 * 24,
    days = sec >= 60 * 60 * 24 && sec < 60 * 60 * 24 * 30;
  if (seconds) {
    return `Termina en ${sec} seg`;
  } else if (minutes) {
    return `Termina en ${(sec / 60).toFixed(0)} min`;
  } else if (hours) {
    return `Termina en ${(sec / 60 / 60).toFixed(0)} h`;
  } else if (days) {
    return `Termina en ${(sec / 60 / 60 / 24).toFixed(0)} d`;
  } else {
    return 'terminado';
  }
}

function convertDateToString(date: Date): string {
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}
