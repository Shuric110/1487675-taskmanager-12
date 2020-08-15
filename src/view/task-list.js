import ComponentView from "./component.js";

export default class TaskList extends ComponentView {
  getTemplate() {
    return `<div class="board__tasks"></div>`;
  }
}
