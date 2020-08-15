import ComponentView from "./component.js";

export default class NoTasks extends ComponentView {
  getTemplate() {
    return `
      <p class="board__no-tasks">
        Click «ADD NEW TASK» in menu to create your first task
      </p>
    `;
  }
}
