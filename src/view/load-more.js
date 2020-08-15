import ComponentView from "./component.js";

export default class LoadMore extends ComponentView {
  getTemplate() {
    return `
      <button class="load-more" type="button">load more</button>
    `;
  }
}
