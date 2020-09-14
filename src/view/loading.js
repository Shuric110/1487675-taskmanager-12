import ComponentView from "./component.js";

export default class Loading extends ComponentView {
  getTemplate() {
    return `
      <p class="board__no-tasks">
        Loading...
      </p>
    `;
  }
}
